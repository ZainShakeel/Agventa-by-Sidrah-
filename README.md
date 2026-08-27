# Augventa — Company Website

*Augmenting Ventures*

A static, 5-page website for a technology and growth partner with two practices:

**Tech** — IT Staff Augmentation · AI Automation · GCP Integration · Revenue
Services (GTM, BD, Sales Consulting, Process Automation, Fractional Sales)

**Non-Tech** — B2B Partnerships/Lead Generation · Branding (luxury, healthcare,
hospitality) · Paid Ads · Website Development · GEO/AEO/SEO · App Development

No build tools, no dependencies. Just open `index.html` in a browser.

## Files

```
Sidra test/
├── index.html        Home — hero, two service pillars, why us, process, stats, testimonials
├── tech.html         Tech practice — 4 services + Revenue detail, models, FAQ
├── non-tech.html     Non-tech practice — 6 services, GEO/AEO explainer, models, FAQ
├── about.html        Story, values, process, team
├── contact.html      Contact form + details
├── robots.txt        Search engine crawl rules + sitemap pointer
├── sitemap.xml       All 5 pages, for Google Search Console
├── SEO-CHECKLIST.md  Full SEO guide — read this before publishing
├── SUBMISSIONS.md    Directory listings, NAP block + submission tracker
├── README.md         This file
└── assets/
    ├── style.css     All styling (CSS variables at the top)
    ├── script.js     Mobile nav, scroll reveal, FAQ accordion, form validation
    └── favicon.svg   Browser tab icon
```

## SEO

Every page ships with unique titles and meta descriptions, canonical URLs, Open Graph
and Twitter cards, and JSON-LD structured data (Organization, Service, FAQPage,
BreadcrumbList). See **[SEO-CHECKLIST.md](SEO-CHECKLIST.md)** for the required
pre-launch edits and — more importantly — the off-site work that actually drives
ranking.

**Do this first:** find & replace `https://www.augventa.com` with your real domain
across all HTML files, `robots.txt` and `sitemap.xml`.

## Things to change before going live

1. **Brand name** — search for `Augventa` across the `.html` files.
2. **Colors** — edit the `:root` variables at the top of `assets/style.css`.
   `--brand` (orange) and `--accent` (gold) control almost everything.
   Note the two-token split: `--brand` is the dark, text-safe orange; `--brand-bright`
   is the vivid logo orange, for graphics only — see the comment in the file.
3. **Contact details** — email, phone and address appear in the footer of every page
   and in `contact.html`.
4. **Social links** — the `.socials` block in each footer currently points to `#`.
5. **Pricing** — ⚠️ the figures in `tech.html` and `non-tech.html` are placeholders
   I invented ($4,200/engineer/mo, $12,000 project, $2,500-$6,000 retainers).
   Replace with your real commercials — search for `class="price"`.
6. **Testimonials, team and stats** — all placeholders in `index.html` and
   `about.html`, each marked with a ⚠️ HTML comment. The quotes are invented and
   attributed to named people; replace them before publishing. Same for the
   "48h to first CV", "94% renewal" and "45+ ventures" figures.
7. **Logo** — `assets/logo.svg` is an SVG redraw of the orange "A" mark (variant 03),
   used in every header and footer. `assets/favicon.svg` is the square tab version.
   If you have the original vector files from your designer, drop them in and point
   the `<img class="logo-mark">` tags at them instead — they'll be more faithful than
   my redraw. Keep SVG rather than PNG so the mark stays sharp on every screen.

## Form delivery — ⚠️ one activation step required

Both forms (the contact page and the popup on the service pages) POST to
**FormSubmit**, which emails submissions to:

- **To:** Sidrah@adventa.com
- **Cc:** shakeelzain04@gmail.com (test inbox — remove the `_cc` hidden field when done)

**Before any email arrives, FormSubmit must be activated once.** Submit the form a
single time; FormSubmit emails a confirmation link to Sidrah@adventa.com. Click it,
and every submission after that is delivered. Until then submissions are discarded
silently.

**Testing locally won't work.** Opening `index.html` from your hard drive gives the
page a `file://` origin, which browsers block from making cross-site requests. Host
it first — drag the folder onto [netlify.com/drop](https://app.netlify.com/drop) and
test on the URL it gives you.

To change the destination address, edit the `action` attribute on both forms —
`contact.html`, `tech.html`, `non-tech.html`. The JavaScript reads the address from
there, so nothing in `script.js` needs touching.

Prefer a different provider? Formspree and Netlify Forms both drop in the same way;
the submit handler falls back to a normal form POST for any non-FormSubmit action.

## Alternative: other form providers

The form validates in the browser but does not submit anywhere. Easiest fix — use
[Formspree](https://formspree.io): create a form, then in `contact.html` change

```html
<form id="contactForm" novalidate>
```

to

```html
<form id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST" novalidate>
```

and in `assets/script.js` replace the success block (section 4) with `form.submit();`.

Netlify Forms works too — just add `netlify` to the `<form>` tag and deploy to Netlify.

## Publishing

Drag the whole folder onto [netlify.com/drop](https://app.netlify.com/drop) — it's live
in seconds. GitHub Pages, Vercel, or any shared host with FTP will work equally well.
