# Security Certification Roadmap

An interactive map of **728 security certifications**, **318 training courses** and **89 retired
certifications**, placed by security domain and by level from beginner to expert.

- **Live:** [tools.hackhouse.com/roadmap](https://tools.hackhouse.com/roadmap/), in the Reference section of HackHouse Tools
- **Repository:** [TheHackHouse/SecCertRoadmapHTML](https://github.com/TheHackHouse/SecCertRoadmapHTML)
- **Offline:** open [`roadmap/standalone.html`](roadmap/standalone.html) in any browser

This is a continuation of Paul Jerimy's
[Security Certification Roadmap](https://pauljerimy.com/security-certification-roadmap/), which has
been the go-to map of security certifications for years. A big thank you to Paul for creating it,
maintaining it since 2018 and sharing it openly, and to Drackar of techexams.net, whose 2014–2015
charts it grew from. The original repository has not been updated since mid-2024 and its pull requests
have been waiting since then, so it appears to have been abandoned. HackHouse has forked it to keep the
roadmap current. If Paul resumes work on the original, we would be glad to contribute these changes
back.

**Pull requests are welcome here.** Please open them against
[TheHackHouse/SecCertRoadmapHTML](https://github.com/TheHackHouse/SecCertRoadmapHTML) rather than the
original repository. See [Contributing](#contributing) for what helps a change get merged quickly.

Everything is static HTML, CSS and JavaScript. There is no build step and no server-side code, and
the page loads nothing from any other domain.

## What it shows

| Chart | Contents |
|---|---|
| **Certifications** | Exam-based security certifications that can be obtained today |
| **Training** | Reputable courses that do not end in an exam-based certification: practitioner-led offensive, defensive, hardware, telecom, ICS and physical training |
| **Retired** | Certifications that can no longer be obtained, each with a note on when or why |

Each chart can be viewed three ways:

- **Cyber View:** every domain side by side, like the classic roadmap.
- **Domain view:** one domain, such as *Offensive Security Operations*, larger and with every entry at its exact level.
- **Sub-domain view:** one area, such as *Cloud*, *Malware / RE* or *Physical*.

Columns are domains and their sub-areas; height is level. Hovering or focusing a box shows its full
name, price and notes, and clicking it opens the provider's page. Clicking a domain or sub-domain
heading opens that view. The page also has a search box, a maximum-price filter (in US dollars),
a toggle for entries with no published price, and a list view of the same entries as a table. The
address bar keeps the current chart and view, e.g. `#chart=training&view=s:EXP`, so any view can be
bookmarked or shared.

## Domains

| Domain | Sub-domains (columns) |
|---|---|
| Communication and Network Security | — |
| IAM | — |
| Security Architecture and Engineering | Cloud / SysOps, *nix, ICS / IoT, Architecture |
| Asset Security | — |
| Security and Risk Management | Management, GRC |
| Security Assessment and Testing | — |
| Software Security | — |
| Defensive Security Operations | SOC / Threat Intel, Cloud / AI, Malware / RE, Forensics, Incident Handling |
| Offensive Security Operations | Penetration Testing, Exploitation / RE / Hardware, Cloud, AI, Physical |

An entry that belongs to more than one area appears in each of them. When those areas sit next to
each other it is drawn as a single bar spanning them (for example, GCIH across Incident Handling and
Penetration Testing). GSE, CISSP and SecurityX span the first seven domains, and *Programming Language*
spans the whole chart, because they apply across all of them.

Levels run from 1 (most entry-level) to 26 (most advanced), grouped as Beginner (1–4),
Intermediate (5–16) and Expert (17–26).

## Repository layout

```
roadmap/                    The roadmap app (deploy this folder)
  index.html                HackHouse Tools page (uses the site's theme, nav and footer)
  standalone.html           Same app with its own styling; runs anywhere, including from disk
  data/
    taxonomy.js             Domains, sub-domains, colours, level bands, chart titles
    certifications.js       One certification per line
    training.js             One training course per line
    retired.js              One retired certification per line
  js/roadmap.js             Validation, layout and rendering
  css/hackhouse.css         Styling for the HackHouse Tools page
  css/roadmap.css           Styling for the standalone page
  README.md                 Data format, editing and deployment details

Security-Certification-Roadmap9.html        Legacy chart pages (see below)
Security-Certification-Roadmap-Retired.html
Security-Training-Roadmap.html
inaccessible-sites.txt      Provider sites that blocked or failed during research, and what each affected
LICENSE.txt                 CC BY-SA 4.0
```

## Updating the data

The files in `roadmap/data/` are the source of truth. Each entry is a single line:

```js
{"id": "oscp", "label": "OSCP", "name": "OffSec Certified Professional (OSCP / OSCP+)", "level": 16,
 "cats": ["PEN"], "span": 2, "details": ["$1,749 course + exam"], "usd": 1749,
 "url": "https://www.offsec.com/courses/pen-200/"}
```

- **To add an entry,** add one line with its level and category ids (`cats`, using the sub-domain ids in `taxonomy.js`). The layout places it automatically; nothing is positioned by hand.
- **To move an entry,** change its `level` or `cats`.
- **To retire an entry,** move its line from `certifications.js` to `retired.js` and add a note to `details` saying when and why.
- **`usd`** is the approximate US-dollar price used by the price filter, or `null` when no price is published.

When the page loads, it checks the data. Missing fields, duplicate ids, unknown categories and
out-of-range levels are listed in a banner at the top of the page and in the browser console. The
full field reference is in [`roadmap/README.md`](roadmap/README.md).

### Contributing

Pull requests are welcome at
[TheHackHouse/SecCertRoadmapHTML](https://github.com/TheHackHouse/SecCertRoadmapHTML/pulls).
Issues are welcome too, for example to report a retired certification, a new one or a wrong price. Please:

- change only the relevant line(s) in `roadmap/data/`;
- link the provider's own page for the certification or course, not a reseller or blog;
- describe the price exactly as the provider publishes it, and note when an exam requires a course or prerequisites;
- for a retirement, rename or new entry, include a source in the pull request description;
- open `roadmap/standalone.html` and check that no data-problem banner appears.

The training chart is limited to established, practitioner-led providers. Course marketplaces and
generic introductory content are left out.

## Deploying

The maintained, live version is at https://tools.hackhouse.com/roadmap/. To host it elsewhere, copy
the `roadmap/` folder to the web root so the page is served at `/roadmap/`. On tools.hackhouse.com, `index.html` uses the site's `/css/hh-theme.css`, `/js/hh-nav.js`, fonts and
images. The steps for the home-page tile and the sitemap entry are in
[`roadmap/README.md`](roadmap/README.md#deploying-to-toolshackhousecom). For any other host, use
`standalone.html`, which needs nothing outside the folder.

## Legacy pages

`Security-Certification-Roadmap9.html` is the original single-file chart that is embedded at
[pauljerimy.com](https://pauljerimy.com/security-certification-roadmap/).
`Security-Certification-Roadmap-Retired.html` and `Security-Training-Roadmap.html` are companion
pages built in the same format during the November 2026 update.

These pages hold the same data as the November 2026 export but are no longer updated. Future changes
go into `roadmap/data/` only.

## Methodology and sources

- **Checked against providers.** Certifications and courses were checked against each provider's current catalogue in November 2026. Where a provider's site blocked automated access, the information came from conference listings, archived pages or search results instead; those cases are listed in `inaccessible-sites.txt` and are worth a manual check.
- **Prices and filtering.** Prices are as published, in the provider's currency. They are converted to US dollars at fixed approximate rates only for the price filter. Where the price shown includes prerequisite exams or mandatory fees, the tooltip says so.
- **Levels** follow the original roadmap's placements, adjusted where entries were added or re-categorised.
- **Categories** were reviewed for every entry in November 2026; for example, GREM sits in Malware / RE and threat-intelligence certifications sit in SOC / Threat Intel.
- **Data from forks.** Data from community forks (Jakobraun, hevertydourado, G1rdo, N1ckw1ck, JaimePolop) was merged where it could be confirmed.

## Credits and licence

Created and maintained from 2018 to 2024 by [Paul Jerimy](https://pauljerimy.com/), building on
earlier charts by Drackar of techexams.net (2014–2015). Thank you both: this roadmap exists because of
your work. The November 2026 data-driven rewrite, the training
and retired charts, the Offensive/Defensive split and the re-categorisation were done for
[HackHouse](https://www.hackhouse.com/). Thanks to everyone credited in the change log below for
corrections and additions.

Licensed under [Creative Commons Attribution-ShareAlike 4.0](LICENSE.txt). You may share and adapt
the roadmap, including commercially, provided you credit the source and share your version under the
same licence.

## Change log

### November 2026

**Page, 24 November**
- *Fit to window* now fits a domain or sub-domain view to the screen vertically as well as horizontally, and re-fits when the window is resized.
- *Large* and *Extra large* sizes use fixed column widths (58 px and 77 px) so labels stay readable on high-DPI screens; the old *Large* was a clamp that wide screens had already hit.
- The price filters sit on their own row under the chart, view, size and search controls.
- *Reset* returns the whole page to its defaults (certifications, Cyber View, fit, no filters), not just the filters.
- Plainer introduction, the Sources panel moved below the list view, and a note of the last update date.
- Asset links carry content hashes so a cached copy of the script is never served after a change.
**New app**
- Rewrote the roadmap as a data-driven static app in `roadmap/`. It has a Cyber View plus domain and sub-domain views, search, a price filter with a no-published-price toggle, a list view, shareable URLs and data validation. Each view is one CSS grid, so borders, shading and entries always line up.
- Added a HackHouse Tools edition (`roadmap/index.html`) and a standalone edition (`roadmap/standalone.html`).

**Structure**
- Split Security Operations into **Defensive** (SOC / Threat Intel, Cloud / AI, Malware / RE, Forensics, Incident Handling) and **Offensive** (Penetration Testing, Exploitation / RE / Hardware, Cloud, AI, Physical).
- Added sub-domain titles to Security Architecture and Engineering (Cloud / SysOps, *nix, ICS / IoT, Architecture) and to Security and Risk Management (Management, GRC).
- Re-checked the category of every entry; about 180 certifications and 70 courses moved (for example GREM to Malware / RE, and threat-intelligence certifications to SOC / Threat Intel). Entries can now appear in several categories.
- Made GSE, CISSP and SecurityX bars across the first seven domains and *Programming Language* a bar across the whole chart.

**New charts**
- Added a **Training** chart: 318 courses from providers including SpecterOps, MDSec, Zero-Point Security, Sektor7, MalDev Academy, Corelan, RET2, Zero2Automated, Signal Labs, OpenSecurityTraining2, Zero Day Engineering, Winsider, TrainSec, Synacktiv, Antisyphon, XINTRA, Mandiant Academy, Red Siege, Orange Cyberdefense / SensePost, Mossé, Red Team Alliance, Attify, Raelize, Penthertz, P1 Security, SANS courses without a GIAC exam, CISA / Idaho National Lab and SEI / CERT.
- Added a **Retired** chart: 89 certifications recovered from this repository's history and from current audits, each with a retirement note.

**Certifications**
- Added Cloud and AI / Cyber areas with about 60 new certifications, including OSAI, HTB COAE, GOAA, GAIPS, AAISM, AIGP, SecAI+, CARTP, CARTE, Pwned Labs, CloudBreach, HackTricks and White Knight Labs cloud certifications.
- Added over 100 penetration testing, exploitation and defensive certifications: HTB CAPE/CWPE/CDEP, Altered Security CRTP/CRTE/CETP, TCM, TryHackMe, The SecOps Group, CyberWarFare Labs, White Knight Labs, 8kSec, OffSec OSTH/OSIR, the GIAC GX series, 13Cubed, Cellebrite and more.
- Added RTA CEA (physical covert entry), Mandiant MCTIA and MIR, ACIP, and Fortinet's NSE 1–8 scheme, which replaced FCF/FCA/FCP/FCSS/FCX on 15 July 2026.
- Removed or retired certifications that are no longer obtainable, including OSMR, MCD, S-EHE, EEHF, CREST CCHIA/CCNIA/CRTSA, the Palo Alto PCxx series, the NCSC CCP levels, and the GIAC certifications in abeyance.
- Applied renames, including CREST CCRTM/CCRTS, CRTM (formerly PACES), CRTL, HTB CWES, PMRP, CCDL2, SC-401, SC-500, MS-102, SecurityX, the Cisco CCNA/CCNP Cybersecurity and Automation tracks, and the VMware VCF certifications.
- Corrected prices and links: GIAC (PR #190), OffSec, CREST, The SecOps Group, INE, SECO (now DNV), Zero-Point, Cyber Scheme, Mossé, TCM and Mile2, plus about 85 prices from the Jakobraun audit.
- Merged pull requests #132, #157, #166, #170, #186 and #190, and data from the Jakobraun, hevertydourado, G1rdo, N1ckw1ck and JaimePolop forks.
- Compared against [cyberdudekz/security-cert-roadmap](https://github.com/cyberdudekz/security-cert-roadmap) and checked each of its certifications on the vendor's site. Added 73 that were missing (vendor certifications from Splunk, CrowdStrike, CyberArk, Okta, HashiCorp, Ping, SailPoint, Saviynt, Zscaler, Netskope, Tenable, IBM QRadar, Palo Alto XSIAM, Broadcom, Veeam, Rubrik, plus AWS, Google Cloud, Microsoft, PECB, PMI-RMP, CRMA, CFE, CBCP, CCZT and PCI ISA) and 7 retired AWS, Microsoft and Linux Foundation certifications. About 60 of its entries were left out because they don't exist (for example "GIAC GNPT", "OSWE+" and "3GPP 5G Cybersecurity Expert") or are not exam-based certifications.
- Fixed the GCIH and GCUX titles.

**Legacy pages**
- Added the companion `Security-Certification-Roadmap-Retired.html` and `Security-Training-Roadmap.html` pages and a price filter on all three legacy pages.
- Removed the narrow-screen fallback that replaced the chart with a 2022 image.
- Fixed alignment of boxes, borders and shading at all window sizes.

### July 2024:
- Added GIAC certifications: GRTP, GEIR, GX-FA, GX-PT, GMLE
- Added ISACA certification: CCOA
- Added CyberDefenders certification: CCD (credit: 0xHasanM)
- Added TCM Security certification: PJMR (credit: Brandon-Russell-1)
- Added Hack the Box certifications: HTB CDSA, HTB CWEE
- Added The SecOps Group certifications: SOG CAP, SOG NSP, SOG CCSP-AWS, SOG CAPen, SOG CNPen, SOG CMPen And, SOG CMPen iOS, CCPenX-AWS, SOG CAPenX
- Added Fortinet certifications: FCF, FCA, FCP NS, FCP PCS, FCP SO, FCSS SO, FCSS OT, FCSS NS, FCSS SASE, FCSS PCS, FCSS ZTA, FCX
- Removed defunct Fortinet certifications: NSE 3, 4, 5, 6, 7, 8
- Removed defunct Palo Alto certifications: PA CRTP, and PA CRTE (credit: MaLevi4)
- Removed defunct Linux Foundation certification: LFCE (credit: MaLevi4)
- Removed defunct CREST certifications: CRTSA, CMRE (credit: sawft99)
- Removed defunct INE certifications: eCRE, eCPTX, eCMAP, eWDP, eCXD (credit: Brandon-Russell-1 & r-yu-2)
- Removed defunct GIAC certifications: GPPA, GEVA, and also ICS612 because its not a certification
- Removed defunct ISC2 certification: HCISPP
- Removed defucnct ISACA certifications: CSX-PA, CSX-T
- Removed defunct IA Certification certification: CEREA
- Moved GIAC GSE down 2 rows after removal of lab requirement
- Shortened Security+, SSCP, GSEC, Programming Languages, CASP+, CISSP, CISSP Concentrations, and GSE to cover 4 spaces in only GRC to make room for more certifications
- Shortened GREM to fit with the new size of the GRC certifications
- Corrected GIAC GPYC as a blue ops certification instead of a red ops
- Corrected (ISC)2 branding to ISC2 (credit: kabaki1982)
- Corrected lins for eLearnSecurity Certifications
- Corrected link for S-EHR (credit: kasperkarlsson)
- Corrected link to CISSP concentrations (credit: psarossy)
- Corrected links to CREST certifications (credit: sawft99)
- Corrected links for Cisco DevNet Pro and DevNet A
- Corrected spelling for PSM III and MTH description
- Corrected certification names for CREST CCTINF, CCTIM, CCHIA, CCTAPP, CCNIA,  (credit: sawft99)
- Corrected certification name for SC-400 (credit: ep3p)
- Corrected certification name for AZ-305 (credit: wongsenoch)
- Corrected certification name for CAP to CGRC (credit: corbin-lounsbury)
- Corrected price for Splunk ECSA (credit: aserpi)
- Corrected prices for GIAC certifications
- Corrected prices for CompTIA certifications

### February 2023:
- January's update was done to the wrong version which brought some old bugs back:
- Duplicate AZ-500 fixed to AZ-305
- Static mobile version changed back to dynamic

### January 2023:
- Added ISC2 certification: CC
- Added ISMI certifications: CSM and CSMP
- Added OCEG certifications: GRCP and GRCA
- Added Zero Point Security certification: CRTO II
- Added GIAC certifications: GCTD and GCWN
- Added Scrum.org certifications: PSM I and PSM II
- Added IDPro certification: CIDPRO
- Added Mosse Institute: MSAF
- Added HTB certification: HTB CPTS
- Added Shared Assessments certifications: CTPRP and CTPRA
- Removed duplicate Zero Point CRTO
- Removed Mosse Institute MTCF (defunct)
- Removed SUSE SEA (defunct)
- Updated link and exam cost for eJPT
- Corrected CSP-SM as PSM III
- Corrected links for SUSE SCA and SCE
- Moved BSCP from Test to Penetration Testing
- Moved BSCP up 1 row
- Moved OSEE up 1 row
- Moved S-CISO down 5 rows
- Moved CIISec ICSF down 1 row
- Moved MTIA down 2 rows
- Moved MDSO down 2 rows
- Moved MVRE down 2 rows
- Moved MTH down 3 rows
- Moved MRT down 3 rows
- Moved MRE down 3 rows
- Moved MCD down 4 rows
- Moved MCSE down 5 rows
- Reduced Cloud+, Server+, and CCSP size to just the Security Architecture & Engineering - Cloud/SysOps sub-domain

### August 2022:
- Added SANS certifications: GIME and GCFR
- Added SECO certifications: S-TA, S-SA, and S-CSPL
- Added Certiport certifications: ITS-C and ITS-NS
- Addied EC Council certification: CCSE
- Added Mile2 certifications: C)HISSP, C)ISRM, IS20, C)IHE, C)DRE, CM)ISSO, CM)IPS, and CM)DFI
- Added PCI certification: PCI QSA
- Added The H Layer certification: SACP
- Added Cyber Scheme certifications: CSTM and CSTL
- Added Microsoft certification: SC-100
- Added Hack the Box certification: HTB CBBH
- Removed duplicate PCNSA
- Removed CREST CWS
- Moved MCSE from Security Operations to Security Architecture and Engineering
- Moved GPEN up 1 row
- Moved CFCE up 1 row
- Moved C)ISSM up 2 rows
- Moved CISSM up 1 row
- Moved CAP up 1 row
- Moved HCISPP up 1 row
- Corrected HCISSP to HCISPP
- Corrected the CCIE Ent link
- Corrected SECO certification links and prices
- Corrected SANS certification prices from $849 to $949
- Corrected Offensive Security prices to $1499 except OSWE to $1649
- Other link and price fixes that I lost track of because I accidently closed this readme without saving

### April 2022:
- Added Fair Institute certification: Fair Fdn
- Added Dark Vortex certifications: DV MoS, DV RTOS, DV OTD, DV AOPH, and DV MILF
- Added Mosse Institute certifications: MCSF, MICS, MTCF, MASE, MCL, MCPT, MCSE, MESE, MCPE, MDSO, and MVRE
- Added Mitre Att&ck certifications: MAD CTI and MAD SOCA
- Added EXIN certifications: 27001F, 27001P, and 27001E
- Added Axelos certifications: M_o_S Foundation and M_o_S Practitioner
- Added SANS certifications: GFACT, GSOC, and GPCS
- Added Microsoft certification: SC-400
- Added Fortinet certifications: NSE 3 and NSE 5
- Added Palo Alto certifications: PCCET, PCDRA, PCCSE, and PCSAE
- Added Mile2 certifications: C)SWAE, C)CSA, and C_TIA
- Added EC First certifications: CSCS, CCSA, and CCP
- Added PECB certifications: 27001F, 27001LI, 27001LA, 27032F, 27032CM, 27005RM, and 27005LM, and CLCSM
- Added Offensive Securiry certifications: OSDA, OSWA, and OSMR
- Added Docker certification: DCA
- Added Cloud Native Computing Foundation certifications: CKS, CKA, CKAD, and KCNA
- Removed Palo Alto certifications: PCCSA
- Removed Infosec Institute / IACRB certifications: CPT, CEPT, and CEREA which do not appear to be available at this time
- Removed Mile2 certifications: C)VE, C)VCP, C)VFE, and Red vs Blue
- Removed 9 Lunarline certifications as they were purchased by Motorola and the certifications appear to be discontinued: CEIM, CESO, CEPP, CERP, CEPM, CESA, CESE, CECS, and CEIA
- Removed GSSP which was retired
- Moved F5 CA up 3 rows
- Moved WCNA down 1 row
- Moved CCT down 1 row
- Moved OSCE3 up 1 row
- Moved DevNetA up 1 row
- Moved CCSC up 1 row
- Corrected Mile2 web links and exam prices from $400 to $550.
- Corrected C)PTC from "Expert" to "Consultant"
- Corrected IACRB certifications to reflect take over by Infosec Institute and new pricing: CSAP, CREA, CMWAPT, CRTOP, CDRP, CSSA, CCTHP, CMFE, and CCFE
- Corrected LPIC-1 and LPIC-2 to reflect they require 2 exams each, with each exam costing $200
- Corrected GIAC certifications to reflect the exam price drop from $1,999 to $849 if taken without a SANS course
- Corrected GREM certification link
- Corrected SF CIAMD to fit in it's container
- Corrected link to CIISec ICSF
- Renamed Microsoft certifications to their exam code. I.E., MSOAA is now SC-200
- Added hover text over domain titles with domain descriptions in line with the ISC2 CBK
- Added a row to the bottom of the certification to allow for more beginner level certifications
- Added a column on the left to add proficiency level indicators to the rows with: Beginner, Intermediate, and Advanced
- Added a column to Security Architecture & Engineering - Cloud/SysOps for container certs and more spacing
- Added a column to Security and Risk Management in order to add additional ISO/IEC 27000 certifications
- Added more code comments
- Redesigned tooltips to display in place (absolute to relative positioning)
- Added more contrast to colors: dark blue for blue team, lighter blue for software sec, darker purple for testing, grey for management, and lighter yellow for asset sec. (I tested magenta as a replacement for black and it was not pleasing on the eye.)

### July 2021:
- Added Mosse Cyber Security Institute Certifications: MOIS, MNSE, MRCI, MBT, MDFIR, MGRC, MPT, MRE, MTH, MCD, MRT, and MTIA
- Added GIAC Certification: GCPN
- Added PDSO Certifications: CDP and CDE
- Added Microsoft Certification: MSOAA, MSCIF, and MIAAA
- Added Offensive Security Certification: OSED and OSCE3
- Added TCM Security Certification: PNPT
- Added Zero Point Security Certification: ZPRTO
- Added TUV Certifications: COSP, COSTE, and COSM
- Added EC Council Certification: CPENT
- Added (ISC)2 Certification: HCISSP
- Added Security Blue Team Certification: BLT2
- Removed CCAr due to it being retired March 1st, 2021
- Removed MTA due to that category of certification being retired on June 30th, 2021
- Removed ECSA due to it being retired May 15th, 2021
- Moved GCWN from the Unix to SysOps sub domain
- Moved eCIR up 1 row based on feedback
- Moved CSX-P down 3 rows based on feedback
- Moved CEPT down 7 rows and expanded into exploitation based on feedback
- Moved CPT down 5 rows based on feedback
- Moved eJPT up 1 row based on feedback
- Moved the CIST, CIGE, and SFCIAMD certifications up 1 row in the IAM domain
- Corrected the exam price for Offensive Security OSWE from $2799 to ~$1299
- Corrected the exam price for eJPT from $400 to $200
- Corrected the exam price for CFR from $149 to $250
- Corrected the exam price and link for KLCP
- Corrected the link for EITCA/IS
- Corrected the tooltip for S-CEHL due to a spelling typo
- Asset Security certifications now properly colored "yellow" instead of "orange"

### February 2021:
- Added PAI Certification: WCNA
- Added eLearnSecurity Certification: eCMAP
- Added Cisco Certification: CCCOP
- Added Linux Foundation Certifications: LFCA, LFCS, and LFCE
- Added APMG Certifications: 27001F, 27001P, and 27001A
- Expanded the GRC sub-domain to 3 columns & shifted certifications accordingly
- Moved CCCOA from Network to Security Operations
- Corrections to CCCOA, IIA CIA, FortiNET NSE 8, CAD, CAC, CCSP, eCRE, and GCPEH

### November 2020:
- Added to GitHub for pull requests
- Added Security Blue Team certification: BTL1
- Added Sales Force Certifications: SFCCCC, SFCIAMD, and SFCTA
- Added The Institute of Internal Auditors: CIA
- Added Offensive Security certification: OSEP
- Added Cisco Certification: CCCOA
- Removed Offensive Security OSCE (retired)
- Removed Cisco CCNA CyberOps (retired)
- Removed duplicate Pentester Academy CRTP
- Corrected links for Cloud+ and eWPTX
- Corrected Typo for NSCS Certs, OPSA, CCFE, and CCIE
- Corrected exam cost for AWS Security Spec and eWPTX

### October 2020:
- Updated HTML/CSS logic to increase chart size
- Updated HTML/CSS logic to allow certifications to span domains
- Updated HTML/CSS logic to allow sub-domains
- Updated HTML/CSS logic to allow easier updates
- Changed hover text to be in a static location in order to avoid clipping
- Aligned columns/towers with (ISC)2 CBK Security Domains
- Moved certifications into new domains when applicable
- Adjusted rankings based on research and feedback
- Added Identity Management Institute certications: CIMP, CIAM, CIGE, CIST, CAMS, CIPA, CIMP, and CRFS
- Added EXIN Privacy certificationss: EPDPP, EPDPF, and EPDPE
- Added ISACA certification: CDPSE
- Added DRI certifications: DCCRP, DCRMP, DACRP, DCBCLA, and DCBCA
- Added QAI certification: CSBA
- Added APMG certifications: 20000P, 20000A, and 20000F
- Added Cisco certifications: DevNet Pro, and DevNet Associate
- Added Pentester Academy certifications: CRTP, CRTE, and PACES

### September 2020:
- Removed GIAC GCUX – indefinitely unobtainable
- Corrected price on SABSA courses for North America ($400 lower)
- Removed MCSA and MCSE retiring in Jan 2021
- Removed Windows sub-domain migrating remaining certs to other appropriate sub-domains
- Named Linux sub-domain as “*nix” to reflect inclusion of Unix based certifications
- Added Microsoft 365 EAE
- Added Microsoft Azure Fundamentals

### July 2020:
- Added description of certification categories
- Added static chart for mobile and small screen users
- Added description and link to “Programming Languages”
- Fixed cert name spacing issues
- Moved OSCP up one rung due to 2020 refresh
- Added IIBA Certificate Cybersecurity Analysis
- Added AWS Security Specialist
- Added TUV Certified Operational Technology Cybersecurity Professional
- Added TUV Cybersecurity Specialist
- Added TUV Cybersecurity Awareness
- Added TUV Internal Auditor ISO 27001:2013, Information Security Management Systems
- Added TUV IT Security Auditor
- Added TUV IT Security Manager
- Added TUV Mobile Security Analyst
- Added Excida CACS
- Added Excida CACE
- Added GIAC Enterprise Vulnerability Assessor
- Added GIAC Battlefield Forensics and Acquisition
- Added GIAC Cloud Security Automation
- Added GIAC Open Source Intelligence
- Added Pentester Academy Certified Red Team Professional
- Added Pentester Academy Certified Red Team Expert

### March 2020:
- Migrated from powerpoint image to HTML/CSS5 interactive chart
- Added mouse over information for exam price and if a course is required
- Added link to certification websites
- Included 324 certifications

### December 2019:
See roadmap here: https://www.pauljerimy.com/OC/Security%20Certification%20Progression%20Chart%20v6.2.png
- Changes towers from job types to security domains
- Added many certifications
- Moved some certifications up or down
- Moved categories so engineering and architecture are side by side due to their relation
- Changed Security Engineering to Security Implementation
- Marked Sec+, SSCP, GSEC, Programming languages, CASP, CISSP, GSE as core certifications with a gradient & note
- Added a version, date, and author
- Removed the self explanatory key
- Removed the color for "software"
- Minor formatting changes

### November 2018:
See roadmap here: https://www.pauljerimy.com/OC/Security%20Certification%20Progression%20Chart%20v5.2.png
- Rebuilt roadmap from old image
- Added many certifications
- Removed DoD 8570.01M indicators
- Condensed certifications for easier viewing

### July 2015 By Drackar of wwww.techexams.net:
See roadmap here: https://www.pauljerimy.com/OC/Security%20Certification%20Progression%20Chart%20v4.0.png
- Added Malware Analysis
- Added IT Security Auditor
- Added additional certifications
- Changed rankings

### November 2014 By Drackar of www.techexams.net:
See roadmap here: https://www.pauljerimy.com/OC/Security%20Certification%20Progression%20Chart%20v3.0.png
- Color coded domains
- Indicated DoD 8570 alignment
- Added key
- Added certifications
- Rearranged ranking
