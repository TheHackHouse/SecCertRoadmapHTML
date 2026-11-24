/*
 * Security Certification Roadmap renderer.
 *
 * Everything is static: the data files in ../data define window.ROADMAP_DATA and this script
 * draws it. There is no build step and no network access, so the page also works when opened
 * straight from disk.
 *
 * Layout model: each view is ONE CSS grid. Columns are the sub-domains (plus a narrow gap
 * column between domains); rows are the 26 levels. Domain borders, sub-domain shading and the
 * entries are all items in that same grid, so they cannot drift out of alignment.
 */
(function () {
    'use strict';

    var D = window.ROADMAP_DATA || {};
    var T = D.taxonomy;
    var LEVELS = T.levels.count;   // number of level rows (26)
    var HEAD = 2;                  // grid rows above the levels: domain titles, sub-domain titles
    var HEAD_H = 1.5 + 0.8;        // their heights in units of --row (--h1 and --h2 in the stylesheet)
    var MAX_DRIFT = 2;             // Cyber View: an entry may sit at most this many rows from its level
    var SCOPED_DRIFT = 0;          // domain / sub-domain views have room to place every entry exactly
    var MAX_WIDTH = 16;            // never widen one sub-domain beyond this many columns
    var BRIDGE_MAX = 7;            // widest bar used to join adjacent categories
    var SIZES = { fit: [16, 80], large: [58, 58], xl: [77, 77] };   // px limits for one column; Large and Extra large are fixed (about 13 px and 17 px labels)

    // ---------- taxonomy lookups ----------
    var SUB = {}, DOM = {};
    T.domains.forEach(function (d, di) {
        DOM[d.id] = { dom: d, index: di };
        d.subdomains.forEach(function (s) { SUB[s.id] = { sub: s, dom: d, di: di }; });
    });
    var CHARTS = {};
    T.charts.forEach(function (c) { CHARTS[c.id] = c; });

    var el = function (id) { return document.getElementById(id); };
    var state = { chart: 'certifications', view: 'all', q: '', max: '', unknown: true, size: 'fit' };
    // Touch screens have no hover, so a box's details cannot be shown by pointing at it. There, the
    // first tap on a box shows its details and the second tap (or the link in the details) opens the
    // provider's page; tapping anywhere else closes the details. Mouse and keyboard use is unchanged.
    var touchUI = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
    var armed = null;   // the box whose details are open on a touch screen
    function defaultSize() { return (touchUI && window.innerWidth <= 980) ? 'large' : 'fit'; }
    var current = null;            // last rendered layout

    // ---------- validation (shown to maintainers) ----------
    function validate() {
        var issues = [];
        T.charts.forEach(function (c) {
            var list = D[c.id];
            if (!Array.isArray(list)) { issues.push(c.id + ': data file missing'); return; }
            var ids = {};
            list.forEach(function (e, i) {
                var where = c.id + ' #' + (i + 1) + ' (' + (e.label || '?') + ')';
                if (!e.id || !e.label || !e.name) issues.push(where + ': needs id, label and name');
                if (ids[e.id]) issues.push(where + ': duplicate id "' + e.id + '"');
                ids[e.id] = 1;
                if (!(e.level >= 1 && e.level <= LEVELS)) issues.push(where + ': level must be 1-' + LEVELS);
                if (e.bar) {
                    if (e.bar !== 'all' && !(Array.isArray(e.bar) && DOM[e.bar[0]] && DOM[e.bar[1]])) issues.push(where + ': bar must be "all" or [fromDomain, toDomain]');
                } else if (!Array.isArray(e.cats) || !e.cats.length) {
                    issues.push(where + ': needs cats (or bar)');
                } else {
                    e.cats.forEach(function (k) { if (!SUB[k]) issues.push(where + ': unknown category "' + k + '"'); });
                }
            });
        });
        return issues;
    }

    // ---------- views ----------
    // view ids: "all", "d:<domainId>", "s:<subdomainId>"
    function scopeFor(view) {
        if (view.indexOf('d:') === 0 && DOM[view.slice(2)]) {
            var d = DOM[view.slice(2)].dom;
            return { label: d.name, domains: [{ dom: d, subs: d.subdomains.slice() }] };
        }
        if (view.indexOf('s:') === 0 && SUB[view.slice(2)]) {
            var s = SUB[view.slice(2)];
            return { label: s.dom.name + ' › ' + s.sub.name, domains: [{ dom: s.dom, subs: [s.sub] }] };
        }
        return { label: 'Cyber View (all domains)', domains: T.domains.map(function (d) { return { dom: d, subs: d.subdomains.slice() }; }) };
    }

    // ---------- layout ----------
    function rowOf(level) { return HEAD + (LEVELS - level) + 1; }   // level 26 -> first level row

    function columns(scope, widths) {
        var c = 2, sub = {}, dom = [], tracks = [], order = [];
        scope.domains.forEach(function (sd, i) {
            var a = c;
            sd.subs.forEach(function (s) {
                sub[s.id] = [c, c + widths[s.id] - 1];
                for (var k = 0; k < widths[s.id]; k++) tracks.push('col');
                c += widths[s.id];
                order.push(s.id);
            });
            dom.push({ sd: sd, a: a, b: c - 1 });
            if (i < scope.domains.length - 1) { tracks.push('gap'); c++; }
        });
        return { sub: sub, dom: dom, tracks: tracks, order: order, first: 2, last: c - 1 };
    }

    function entriesIn(chart, scope) {
        var inScope = {}, domIdx = {};
        scope.domains.forEach(function (sd) {
            domIdx[sd.dom.id] = DOM[sd.dom.id].index;
            sd.subs.forEach(function (s) { inScope[s.id] = 1; });
        });
        var out = [];
        (D[chart] || []).forEach(function (e, i) {
            if (e.bar) {
                if (e.bar === 'all') { out.push({ e: e, i: i, bar: true }); return; }
                var lo = DOM[e.bar[0]].index, hi = DOM[e.bar[1]].index;
                var hit = Object.keys(domIdx).some(function (k) { return domIdx[k] >= lo && domIdx[k] <= hi; });
                if (hit) out.push({ e: e, i: i, bar: true });
                return;
            }
            var cats = (e.cats || []).filter(function (k) { return inScope[k]; });
            if (cats.length) out.push({ e: e, i: i, cats: cats });
        });
        return out;
    }

    function pack(items, scope, widths, maxDrift) {
        var cols = columns(scope, widths);
        var occ = {}, placed = [], bad = {}, barRows = {};
        var top = HEAD + 1, bottom = HEAD + LEVELS;
        function free(r, c, sp) {
            for (var k = 0; k < sp; k++) if (occ[r * 1000 + c + k]) return false;
            return true;
        }
        function put(r, c, sp, it, color, cats) {
            for (var k = 0; k < sp; k++) occ[r * 1000 + c + k] = 1;
            placed.push({ r: r, c: c, sp: sp, e: it.e, color: color, cats: cats, bar: !!it.bar });
        }
        function rowsNear(r, maxd) {
            var rs = [r];
            for (var d = 1; d <= maxd; d++) { rs.push(r + d); rs.push(r - d); }
            return rs.filter(function (x) { return x >= top && x <= bottom; });
        }

        // 1. multi-discipline bars
        items.filter(function (it) { return it.bar; }).forEach(function (it) {
            var a = cols.first, b = cols.last;
            if (it.e.bar !== 'all') {
                var lo = DOM[it.e.bar[0]].index, hi = DOM[it.e.bar[1]].index;
                var ds = cols.dom.filter(function (x) { return DOM[x.sd.dom.id].index >= lo && DOM[x.sd.dom.id].index <= hi; });
                a = ds[0].a; b = ds[ds.length - 1].b;
            }
            var rows = rowsNear(rowOf(it.e.level), LEVELS);
            for (var j = 0; j < rows.length; j++) if (free(rows[j], a, b - a + 1)) { put(rows[j], a, b - a + 1, it, 'black', []); barRows[rows[j]] = 1; return; }
        });

        // 2. one unit per category, or one bridging bar when the categories are adjacent
        var units = [];
        items.filter(function (it) { return !it.bar; }).forEach(function (it) {
            var cs = it.cats.slice().sort(function (x, y) { return cols.order.indexOf(x) - cols.order.indexOf(y); });
            var idx = cs.map(function (k) { return cols.order.indexOf(k); });
            var contiguous = idx.every(function (v, j) { return v === idx[0] + j; });
            if (cs.length > 1 && contiguous) {
                var a = cols.sub[cs[0]][1], b = cols.sub[cs[cs.length - 1]][0];
                if (b - a + 1 <= BRIDGE_MAX) { units.push({ it: it, sub: cs[0], cols: [a], sp: b - a + 1, bridge: cs }); return; }
            }
            cs.forEach(function (k) { units.push(single(it, k, cs.length)); });
        });
        function single(it, k, n) {
            var r = cols.sub[k], w = r[1] - r[0] + 1;
            var sp = (n === 1 && it.e.span > 1) ? Math.min(it.e.span, w) : 1;
            var cs = [];
            for (var c = r[0]; c <= r[1] - sp + 1; c++) cs.push(c);
            return { it: it, sub: k, cols: cs, sp: sp };
        }
        units.sort(function (x, y) { return (y.sp - x.sp) || (y.it.e.level - x.it.e.level) || (x.it.i - y.it.i); });
        for (var u = 0; u < units.length; u++) {
            var un = units[u], target = rowOf(un.it.e.level);
            var allow = maxDrift + (barRows[target] ? 1 : 0);   // a full-width bar on the target row pushes entries one row
            var rows = rowsNear(target, un.bridge ? allow : LEVELS), done = false;
            for (var j = 0; j < rows.length && !done; j++) {
                for (var q = 0; q < un.cols.length && !done; q++) {
                    if (free(rows[j], un.cols[q], un.sp)) {
                        put(rows[j], un.cols[q], un.sp, un.it, SUB[un.sub].dom.color, un.bridge || [un.sub]);
                        if (Math.abs(rows[j] - target) > allow) bad[un.sub] = 1;
                        done = true;
                    }
                }
            }
            if (!done) {
                if (un.bridge) un.bridge.forEach(function (k) { units.push(single(un.it, k, un.bridge.length)); });
                else bad[un.sub] = 1;
            }
        }
        return { cols: cols, placed: placed, bad: bad };
    }

    function layout(chart, scope) {
        var widths = {};
        scope.domains.forEach(function (sd) { sd.subs.forEach(function (s) { widths[s.id] = s.minCols || 1; }); });
        var items = entriesIn(chart, scope), res;
        var drift = scope.domains.length > 1 ? MAX_DRIFT : SCOPED_DRIFT;
        for (var n = 0; n < 80; n++) {
            res = pack(items, scope, widths, drift);
            var b = Object.keys(res.bad).filter(function (k) { return widths[k] < MAX_WIDTH; });
            if (!b.length) break;
            b.forEach(function (k) { widths[k] += 1; });
        }
        res.items = items; res.scope = scope; res.widths = widths;
        return res;
    }

    // ---------- rendering ----------
    function div(cls, style, text) {
        var d = document.createElement('div');
        d.className = cls;
        if (style) d.setAttribute('style', style);
        if (text) d.textContent = text;
        return d;
    }
    function bandFor(level) {
        var b = T.levels.bands.filter(function (x) { return level >= x.from && level <= x.to; })[0];
        return b ? b.name : '';
    }
    function sizeClass(label, sp) {
        var longest = Math.max.apply(null, label.split(/[ \-\/:]/).map(function (w) { return w.length; }));
        longest = longest / sp;
        if (longest > 12) return ' xxs';
        if (longest > 9) return ' xs';
        if (longest > 7 || (sp === 1 && label.length > 12)) return ' sm';
        return '';
    }

    function render() {
        var chart = CHARTS[state.chart] ? state.chart : 'certifications';
        var scope = scopeFor(state.view);
        var L = layout(chart, scope);
        current = L;
        var grid = el('rm-grid');
        grid.textContent = '';
        grid.style.gridTemplateColumns = 'var(--lvl) ' + L.cols.tracks.map(function (t) { return t === 'gap' ? 'var(--gap)' : 'var(--col)'; }).join(' ');
        grid.style.gridTemplateRows = 'var(--h1) var(--h2) repeat(' + LEVELS + ', var(--row))';
        var lastRow = HEAD + LEVELS + 1;

        T.levels.bands.forEach(function (b) {
            var band = div('rm-band band-' + b.name.toLowerCase(), 'grid-column: 1; grid-row: ' + rowOf(b.to) + ' / ' + (rowOf(b.from) + 1) + ';', b.name);
            grid.appendChild(band);
        });
        L.cols.dom.forEach(function (x) {
            var d = x.sd.dom, span = 'grid-column: ' + x.a + ' / ' + (x.b + 1) + ';';
            var title = div('rm-dtitle c-text-' + d.color, span + 'grid-row: 1;', d.name);
            title.title = d.description || '';
            title.setAttribute('data-view', 'd:' + d.id);
            grid.appendChild(title);
            grid.appendChild(div('rm-frame b-' + d.color, span + 'grid-row: 2 / ' + lastRow + ';'));
            var shaded = d.subdomains.length > 1;
            x.sd.subs.forEach(function (s) {
                var r = L.cols.sub[s.id], ss = 'grid-column: ' + r[0] + ' / ' + (r[1] + 1) + ';';
                if (s.name) {
                    var st = div('rm-stitle', ss + 'grid-row: 2;', s.name);
                    if (d.subdomains.length > 1) st.setAttribute('data-view', 's:' + s.id);
                    grid.appendChild(st);
                }
                if (shaded) grid.appendChild(div('rm-shade s-' + d.color, ss + 'grid-row: 3 / ' + lastRow + ';'));
            });
        });
        L.placed.forEach(function (p) {
            var a = document.createElement('a');
            a.className = 'rm-item c-' + p.color + (p.bar ? ' rm-bar' : '') + sizeClass(p.e.label, p.sp);
            a.href = p.e.url || '#';
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = p.e.label;
            a.setAttribute('data-id', p.e.id);
            a.setAttribute('aria-label', p.e.name + (p.e.details && p.e.details.length ? ' - ' + p.e.details.join(', ') : ''));
            a.style.gridColumn = p.c + ' / span ' + p.sp;
            a.style.gridRow = String(p.r);
            a._entry = p.e; a._cats = p.cats;
            grid.appendChild(a);
        });

        var meta = CHARTS[chart];
        if (el('rm-title') && !el('rm-title').hasAttribute('data-static')) el('rm-title').textContent = meta.title;
        el('rm-note').textContent = meta.note || '';
        el('rm-scope').textContent = scope.label;
        el('rm-back').hidden = state.view === 'all';
        document.title = meta.title + (state.view === 'all' ? '' : ' - ' + scope.label) + (document.body.getAttribute('data-title-suffix') || '');
        renderList(L);
        setupRange();
        resize();
        applyFilters();
    }

    function renderList(L) {
        var seen = {}, rows = [];
        L.placed.forEach(function (p) {
            if (p.e.kind === 'recommendation') return;
            if (seen[p.e.id]) { seen[p.e.id].cats = seen[p.e.id].cats.concat(p.cats); return; }
            seen[p.e.id] = { e: p.e, cats: p.cats.slice() };
            rows.push(seen[p.e.id]);
        });
        rows.sort(function (x, y) { return (y.e.level - x.e.level) || x.e.label.localeCompare(y.e.label); });
        var body = el('rm-list-body');
        body.textContent = '';
        rows.forEach(function (r) {
            var tr = document.createElement('tr');
            tr.setAttribute('data-id', r.e.id);
            var cats = r.e.bar ? 'All domains' : unique(r.e.cats.map(function (k) { return SUB[k] ? (SUB[k].sub.name || SUB[k].dom.name) : k; })).join(', ');
            [bandFor(r.e.level) + ' (' + r.e.level + ')', r.e.label, r.e.name, cats, (r.e.details || []).join(' / ')].forEach(function (t, i) {
                var td = document.createElement('td');
                if (i === 2 && r.e.url) {
                    var a = document.createElement('a');
                    a.href = r.e.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = t;
                    td.appendChild(a);
                } else td.textContent = t;
                tr.appendChild(td);
            });
            body.appendChild(tr);
        });
        el('rm-list').open = state.view !== 'all';
    }
    function unique(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }

    // ---------- sizing ----------
    function resize() {
        if (!current) return;
        var wrap = el('rm-wrap'), grid = el('rm-grid');
        var n = current.cols.tracks.filter(function (t) { return t === 'col'; }).length;
        var g = current.cols.tracks.length - n;
        var cg = 2, avail = wrap.clientWidth - 24;
        var col = (avail - 30 - (n + g + 1) * cg) / (n + 0.3 * g);
        var lim = SIZES[state.size] || SIZES.fit;
        if (state.size === 'fit' && state.view !== 'all') {
            // Domain and sub-domain views also fit vertically: the whole chart, title rows included,
            // must sit inside the viewport below the sticky nav, with the wrap's own padding.
            var nav = document.querySelector('.hh-nav');
            var availH = window.innerHeight - (nav ? nav.offsetHeight : 0) - 56;
            var rows = HEAD_H + LEVELS + 0.08 * (HEAD + LEVELS - 1);   // in units of --row
            var colH = (availH / rows) / 0.62;                        // --row is 0.62 * --col
            col = Math.min(col, colH);
        }
        col = Math.max(lim[0], Math.min(lim[1], col));
        grid.style.setProperty('--col', col.toFixed(2) + 'px');
        grid.style.setProperty('--gap', (col * 0.3).toFixed(2) + 'px');
        grid.style.setProperty('--row', (col * 0.62).toFixed(2) + 'px');
        grid.style.setProperty('--lvl', Math.max(22, col * 0.6).toFixed(2) + 'px');
        grid.style.setProperty('--fs', Math.max(5, col * 0.22).toFixed(2) + 'px');
    }

    // ---------- filters ----------
    function priceOk(e) {
        if (e.usd === null || e.usd === undefined) return state.unknown;
        return state.max === '' || e.usd <= parseFloat(state.max);
    }
    function textOk(e) {
        if (!state.q) return true;
        var hay = (e.label + ' ' + e.name + ' ' + (e.details || []).join(' ')).toLowerCase();
        return state.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
    }
    function counted(e) { return e.kind !== 'recommendation'; }
    function applyFilters() {
        var shown = {}, total = {};
        Array.prototype.forEach.call(el('rm-grid').querySelectorAll('.rm-item'), function (a) {
            var e = a._entry;
            if (e.kind === 'recommendation') return;
            var ok = priceOk(e) && textOk(e);
            a.classList.toggle('rm-dim', !ok);
            if (counted(e)) { total[e.id] = 1; if (ok) shown[e.id] = 1; }
        });
        Array.prototype.forEach.call(el('rm-list-body').rows, function (tr) {
            var e = (D[state.chart] || []).filter(function (x) { return x.id === tr.getAttribute('data-id'); })[0];
            tr.hidden = !(e && priceOk(e) && textOk(e));
        });
        var nShown = Object.keys(shown).length, nTotal = Object.keys(total).length;
        el('rm-count').textContent = nShown + ' of ' + nTotal + ' ' + CHARTS[state.chart].noun + ' shown';
        el('rm-footer-count').textContent = nTotal + ' ' + CHARTS[state.chart].noun + ' in this view · ' + (D[state.chart] || []).filter(counted).length + ' in total · ' + T.updated;
        el('rm-list-count').textContent = '(' + nShown + ')';
    }
    function setupRange() {
        var top = 0;
        (D[state.chart] || []).forEach(function (e) { if (e.usd > top) top = e.usd; });
        top = Math.ceil(top / 50) * 50;
        var r = el('rm-range');
        r.max = top;
        r.value = state.max === '' ? top : Math.min(parseFloat(state.max), top);
    }

    // ---------- tooltip ----------
    function showTip(a) {
        var e = a._entry, tip = el('rm-tip');
        tip.textContent = '';
        var h = document.createElement('strong'); h.textContent = e.name; tip.appendChild(h);
        (e.details || []).forEach(function (t) { tip.appendChild(div('', '', t)); });
        var cats = e.bar ? 'All domains' : unique((e.cats || []).map(function (k) { return SUB[k] ? (SUB[k].sub.name || SUB[k].dom.name) : k; })).join(', ');
        tip.appendChild(div('rm-tip-meta', '', bandFor(e.level) + ' · ' + cats));
        if (touchUI) {
            var o = document.createElement('a'); o.className = 'rm-tip-open';
            if (e.url) { o.href = e.url; o.target = '_blank'; o.rel = 'noopener'; o.textContent = 'Open the provider\'s page'; }
            else o.textContent = 'No link for this entry';
            tip.appendChild(o);
        }
        tip.hidden = false;
        var r = a.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
        var x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 8);
        var y = r.bottom + 8;
        if (y + th > window.innerHeight - 8) y = r.top - th - 8;
        tip.style.left = x + 'px'; tip.style.top = Math.max(8, y) + 'px';
        Array.prototype.forEach.call(document.querySelectorAll('.rm-item[data-id="' + e.id + '"]'), function (x) { x.classList.add('rm-same'); });
    }
    function hideTip() {
        armed = null;
        el('rm-tip').hidden = true;
        Array.prototype.forEach.call(document.querySelectorAll('.rm-same'), function (x) { x.classList.remove('rm-same'); });
    }

    // ---------- state <-> URL ----------
    function readHash() {
        var h = {};
        location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
            var p = kv.split('='); if (p[0]) h[p[0]] = decodeURIComponent(p[1] || '');
        });
        if (h.chart && CHARTS[h.chart]) state.chart = h.chart;
        state.view = h.view || 'all';
    }
    function writeHash() {
        var h = '#chart=' + state.chart + '&view=' + state.view;
        if (location.hash !== h) history.replaceState(null, '', h);
    }
    function go(view) {
        state.view = view;
        el('rm-view').value = view;
        writeHash();
        render();
        window.scrollTo(0, 0);
    }

    // ---------- controls ----------
    function buildControls() {
        var cs = el('rm-chart'), isSelect = cs.tagName === 'SELECT';
        T.charts.forEach(function (c) {
            var o = document.createElement(isSelect ? 'option' : 'button');
            if (isSelect) o.value = c.id; else { o.type = 'button'; o.setAttribute('data-chart', c.id); }
            o.textContent = isSelect ? c.title : (c.tab || c.title);
            cs.appendChild(o);
        });
        function syncChart() {
            if (isSelect) { cs.value = state.chart; return; }
            Array.prototype.forEach.call(cs.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-chart') === state.chart ? 'true' : 'false'); });
        }
        var vs = el('rm-view');
        var o = document.createElement('option'); o.value = 'all'; o.textContent = 'Cyber View (all domains)'; vs.appendChild(o);
        T.domains.forEach(function (d) {
            var g = document.createElement('optgroup'); g.label = d.name;
            var od = document.createElement('option'); od.value = 'd:' + d.id; od.textContent = d.name + (d.subdomains.length > 1 ? ' (all)' : ''); g.appendChild(od);
            if (d.subdomains.length > 1) d.subdomains.forEach(function (s) {
                var os = document.createElement('option'); os.value = 's:' + s.id; os.textContent = ' ' + s.name; g.appendChild(os);
            });
            vs.appendChild(g);
        });
        syncChart(); vs.value = state.view;
        if (isSelect) cs.addEventListener('change', function () { state.chart = cs.value; writeHash(); render(); });
        else cs.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-chart]'); if (!b) return;
            state.chart = b.getAttribute('data-chart'); syncChart(); writeHash(); render();
        });
        vs.addEventListener('change', function () { go(vs.value); });
        el('rm-back').addEventListener('click', function () { go('all'); });
        el('rm-search').addEventListener('input', function (ev) { state.q = ev.target.value.trim(); applyFilters(); });
        el('rm-max').addEventListener('input', function (ev) {
            state.max = ev.target.value;
            if (state.max !== '') el('rm-range').value = Math.min(parseFloat(state.max), parseFloat(el('rm-range').max));
            applyFilters();
        });
        el('rm-range').addEventListener('input', function (ev) {
            var v = ev.target.value;
            state.max = parseFloat(v) >= parseFloat(ev.target.max) ? '' : v;
            el('rm-max').value = state.max;
            applyFilters();
        });
        el('rm-unknown').addEventListener('change', function (ev) { state.unknown = ev.target.checked; applyFilters(); });
        el('rm-size').addEventListener('change', function (ev) { state.size = ev.target.value; resize(); });
        el('rm-reset').addEventListener('click', function () {
            // back to the page as first loaded: default chart, Cyber View, fit size, no filters
            state.chart = 'certifications'; state.view = 'all'; state.size = defaultSize();
            state.q = ''; state.max = ''; state.unknown = true;
            if (isSelect) cs.value = state.chart;
            syncChart(); vs.value = state.view; el('rm-size').value = state.size;
            el('rm-search').value = ''; el('rm-max').value = ''; el('rm-unknown').checked = true;
            writeHash(); render();   // render() re-runs setupRange, resize and applyFilters
            window.scrollTo(0, 0);
        });
        var grid = el('rm-grid');
        grid.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-view]');
            if (t) { go(t.getAttribute('data-view')); return; }
            var a = ev.target.closest('.rm-item');
            if (!a) return;
            if (!a._entry.url) { ev.preventDefault(); if (touchUI) { armed = a; showTip(a); } return; }
            if (touchUI && armed !== a) { ev.preventDefault(); armed = a; showTip(a); }   // first tap: details; second tap: the link
        });
        if (!touchUI) {
            grid.addEventListener('mouseover', function (ev) { var a = ev.target.closest('.rm-item'); if (a) showTip(a); });
            grid.addEventListener('mouseout', function (ev) { if (ev.target.closest('.rm-item')) hideTip(); });
        }
        document.addEventListener('click', function (ev) {
            if (touchUI && !ev.target.closest('.rm-item') && !ev.target.closest('#rm-tip')) hideTip();
        });
        grid.addEventListener('focusin', function (ev) { var a = ev.target.closest('.rm-item'); if (a) showTip(a); });
        grid.addEventListener('focusout', function () { if (!touchUI) hideTip(); });   // on a phone focus moves to the details' link before its tap lands
        document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') hideTip(); });
        window.addEventListener('scroll', function () { if (!touchUI) hideTip(); }, { passive: true });   // on a phone the details stay open while scrolling to read them
        window.addEventListener('hashchange', function () { readHash(); syncChart(); vs.value = state.view; render(); });
        if (window.ResizeObserver) new ResizeObserver(resize).observe(el('rm-wrap'));
        window.addEventListener('resize', resize);   // the observer sees width changes only; vertical fit needs the window height too
    }

    function init() {
        var issues = validate();
        if (issues.length) {
            var w = el('rm-warn');
            w.hidden = false;
            w.textContent = 'Data problems (' + issues.length + '): ' + issues.slice(0, 12).join('; ') + (issues.length > 12 ? '; ...' : '');
            if (window.console) console.warn('Roadmap data problems:\n' + issues.join('\n'));
        }
        Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (n) {
            var list = D[n.getAttribute('data-count')];
            if (Array.isArray(list)) n.textContent = list.filter(function (e) { return e.kind !== 'recommendation'; }).length;
        });
        readHash();
        state.size = defaultSize();
        buildControls();
        el('rm-size').value = state.size;
        writeHash();
        render();
    }
    // exposed for debugging and tests
    window.Roadmap = { layout: function (chart, view) { return layout(chart, scopeFor(view)); }, validate: validate, go: go };
    document.addEventListener('DOMContentLoaded', init);
})();
