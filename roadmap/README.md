# Security Certification Roadmap (data-driven version)

A static rewrite of the roadmap charts. The data lives in plain files; one script draws every
view from it. No build step, no server and no network access are needed.

## Deploying to tools.hackhouse.com

`index.html` is the HackHouse Tools page. It uses the site's own `/css/hh-theme.css`,
`/js/hh-nav.js`, fonts, images, nav and footer, plus `css/hackhouse.css` for the chart, and loads
nothing from any other domain. `standalone.html` is the same app with its own light styling, for use
anywhere else (it needs nothing from the site).

1. Copy this folder to the site root as `/roadmap/`, so the page is served at
   `https://tools.hackhouse.com/roadmap/`. (`standalone.html`, `css/roadmap.css` and this README are
   optional on the server.)
2. Add a tile to the **Reference Information** grid on the home page (`index.html`, section `#reference`):

   ```html
   <a class="hh-tile" href="/roadmap/">
     <span class="hh-tile-tag">Certifications</span>
     <div class="hh-tile-name">Cyber Security Certifications Map 2026</div>
     <div class="hh-tile-desc">728 certifications and 318 training courses mapped by domain and level, with offensive, defensive and per-area views.</div>
   </a>
   ```

3. Add it to `sitemap.xml`:

   ```xml
   <url>
     <loc>https://tools.hackhouse.com/roadmap/</loc>
     <lastmod>2026-11-24</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.9</priority>
   </url>
   ```

The nav, footer and the `?v=` versions of the theme files in `index.html` were copied from the live site
on 2026-11-24; if the site template changes, copy the new nav and footer into this page too. The counts
in the page's introduction are filled in from the data automatically; the counts in the tile above are
not, so update them when the data grows.

The data is derived from Paul Jerimy's roadmap under CC BY-SA 4.0, so this page must keep the
attribution and licence notice in its "Sources" paragraph.

## Use it

Open `standalone.html` in a browser, straight from disk or from any static web host. (`index.html` is the
HackHouse Tools page and needs the site's theme files, so it only looks right on tools.hackhouse.com.)

- **Chart:** certifications, training courses (no exam-based certification) or retired certifications.
- **View:** *Cyber View* shows every domain. Picking a domain (e.g. *Offensive Security Operations*)
  or a sub-domain (e.g. *Cloud*) shows just that vertical, larger, with every entry at its exact level.
  Clicking a domain or sub-domain title in the chart does the same.
- **Size:** *Fit to window* squeezes the Cyber View onto one screen width, and a domain or sub-domain
  view onto one screen in both directions; *Large* (58 px columns, about 13 px text) and *Extra large*
  (77 px columns, about 17 px text) keep the labels readable on big or high-DPI
  screens and scroll sideways.
- **Filters:** search text, a maximum price (USD) and whether to include entries with no published
  price. Filtered-out entries are dimmed rather than removed, so the layout stays put. *Reset* puts the
  whole page back to its defaults: certifications chart, Cyber View, fit size, no filters.
- **List view** under the chart shows the same entries as a table (open by default in domain views).
- The address bar keeps the current chart and view (`#chart=training&view=s:EXP`), so views can be
  bookmarked and shared.

To embed it in another page, use an iframe pointing at `index.html` with the view in the hash.

## Files

| File | What it holds |
|---|---|
| `data/taxonomy.js` | Domains, their sub-domains (the columns), colours, level bands, chart titles |
| `data/certifications.js` | Certification entries, one per line |
| `data/training.js` | Training-course entries, one per line |
| `data/retired.js` | Retired-certification entries, one per line |
| `js/roadmap.js` | Validation, layout and rendering |
| `css/roadmap.css` | Styling |

The data files are JavaScript (`window.ROADMAP_DATA.xxx = [...]`) rather than JSON so that the page
still works when opened from disk, where browsers block loading JSON files.

## Editing entries

Each entry is one line in the relevant data file:

```js
{"id": "oscp", "label": "OSCP", "name": "OffSec Certified Professional (OSCP / OSCP+)", "level": 16,
 "cats": ["PEN"], "span": 2, "details": ["$1,749 course + exam"], "usd": 1749,
 "url": "https://www.offsec.com/courses/pen-200/"}
```

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Unique within the file; lower case, no spaces |
| `label` | yes | Short text shown in the box |
| `name` | yes | Full name, shown in the tooltip and list |
| `level` | yes | 1 (most entry-level) to 26 (most advanced). Bands: Beginner 1–4, Intermediate 5–16, Expert 17–26 |
| `cats` | yes* | One or more sub-domain ids from `taxonomy.js`, e.g. `["MAL"]` or `["IH", "PEN"]` |
| `bar` | yes* | Instead of `cats`: `"all"` for a bar across the whole chart, or `["network", "software"]` for a bar across that range of domains |
| `span` | no | Draw the box this many columns wide (single-category entries only). Used as `2` to mark broad, generalist certifications within their area; a cert that genuinely covers several areas uses `cats` or `bar` instead |
| `details` | no | Extra tooltip lines: price, prerequisites, notes |
| `usd` | no | Price in US dollars used by the price filter; `null` means no published price |
| `url` | no | Link opened when the box is clicked |
| `kind` | no | `"recommendation"` for things that are not courses or certifications (e.g. *Programming Language*); they are not counted or filtered |

\* Each entry needs either `cats` or `bar`.

An entry in several categories appears in each of them. When its categories sit next to each other
(e.g. Incident Handling and Penetration Testing), it is drawn as one bar spanning both instead.

## How the layout works

Each view is a single CSS grid: one column per sub-domain column, a narrow gap column between
domains, and one row per level. Borders, shading and entries are all items in that grid, so they
cannot fall out of alignment. On the Certifications chart the script starts each sub-domain at its
`minCols` from `taxonomy.js`; on the Training and Retired charts every sub-domain starts at one
column, since those charts have far fewer entries in some areas. It then widens a column until every
entry fits within two rows of its level in the Cyber View (exactly at its level in domain views), so
no chart carries empty columns and adding entries never needs manual positioning.

## Checking the data

When the page loads it validates the data: missing fields, duplicate ids, unknown categories and
out-of-range levels are listed in a yellow banner at the top and in the browser console.

## Adding a domain or sub-domain

Add it to `domains` in `data/taxonomy.js` (id, name, colour from `colors`, description, sub-domains
with `minCols`), then use the new sub-domain id in entries' `cats`. Colours used by boxes, borders and
shading are defined in `css/roadmap.css` (`.c-<colour>`, `.b-<colour>`, `.s-<colour>`).

Licence: CC BY-SA 4.0, as for the rest of this repository.
