# SEO Checklist — Augventa

## First, the honest part

There are two very different goals hiding in "show up on top of Google":

**1. Someone searches your company name** ("Augventa", "Augventa agency").
This is *branded search*, and you can absolutely win it — you should be #1 for your own
name, usually within 2–6 weeks of the steps below. Nobody else is competing for that term.

**2. Someone searches what you sell** ("IT staff augmentation company",
"AI automation agency", "luxury branding agency"). This is *competitive search*. It takes 4–12 months of
consistent content, links and reviews. No website file can shortcut it, and anyone
promising page 1 in 30 days is selling you something.

The code below handles everything a website can control. The off-site section is
where the actual ranking gets won.

---

## Already done in this site

- [x] Unique, keyword-led `<title>` and meta description on all 5 pages
- [x] Canonical URL on every page (prevents duplicate-content splits)
- [x] `robots` meta allowing indexing + large image previews
- [x] Open Graph + Twitter Card tags (proper previews on WhatsApp, LinkedIn, FB, X)
- [x] `robots.txt` pointing at the sitemap
- [x] `sitemap.xml` listing all 5 pages
- [x] **Organization / ProfessionalService** structured data — name, phone, email,
      address, hours, services. This is what feeds a Google knowledge panel.
- [x] **FAQPage** structured data on both service pages (can win expandable results)
- [x] **BreadcrumbList** on inner pages (nicer-looking search snippets)
- [x] Semantic HTML: one `<h1>` per page, logical `<h2>`/`<h3>` order
- [x] Mobile-responsive (Google indexes the mobile version of your site first)
- [x] Fast by default — no frameworks, no external fonts, no render-blocking JS
- [x] SVG favicon
- [x] Descriptive internal linking between the two service pages

---

## Before you publish — 6 required edits

1. **Find & replace the domain.** `https://augventa.com` appears in all 5
   HTML files, `robots.txt` and `sitemap.xml`. Replace with your real domain.
2. **Real contact details.** Phone, email and address — in the footers, in
   `contact.html`, and in the JSON-LD block in `index.html`. These must match your
   Google Business Profile **exactly**, character for character.
3. **Social URLs.** The `sameAs` array in `index.html` still says `YOUR-PAGE`.
4. **Create `assets/og-image.jpg`** — 1200×630px, your logo and tagline. Without it
   your links share as a blank grey box.
5. **Replace the placeholder testimonials and team members.** Invented quotes
   attributed to named people are a real credibility and legal risk once live.
6. **HTTPS.** Google treats it as a ranking signal and browsers flag forms without
   it. Netlify, Vercel and Cloudflare give it free.

> ⚠️ I deliberately did **not** add `aggregateRating` / `Review` schema. Marking up
> reviews you haven't actually received violates Google's spam policies and can get
> your rich results — or the whole site — demoted. Add it once you have real reviews.

---

## The off-site work — this is what actually ranks you

### Week 1 — get indexed and claim your name

1. **Google Search Console** (search.google.com/search-console) — free.
   Add your domain, verify it, submit `sitemap.xml`, then use **URL Inspection →
   Request Indexing** on your homepage. This is the single fastest way to get found.
2. **Google Business Profile** (business.google.com) — free, and still worth completing
   even though you sell mostly remote — it anchors your brand-name result.
   - Complete 100% of the profile: category ("Business management consultant"), hours, service
     areas, description, 10+ photos
   - Your name, address and phone must match the website *exactly*
   - This is what puts you in the map pack and gives you a panel on the right side
     of the results page when someone searches your name
3. **Bing Webmaster Tools** — takes 5 minutes, and it also feeds ChatGPT search.
4. **Google Analytics 4** — so you can see what's working.

### Weeks 2–4 — consistency signals

5. **Same NAP everywhere.** Name, Address, Phone identical across Facebook,
   Instagram, LinkedIn, and every directory. Inconsistency is the most common reason
   local businesses don't rank.
6. **List on directories:** Facebook Page, LinkedIn Company Page, Instagram business
   account, Clutch, Yelp, local Chamber of Commerce, Pakistani directories.
7. **Ask your first 5 clients for Google reviews.** Reviews are a direct local
   ranking factor and the strongest conversion element you have. Reply to every one.

### Month 2 onward — the long game

8. **Start a blog.** This is how you rank for non-branded terms. One genuinely
   useful post per week beats ten thin ones. Topics that convert for agencies:
   - "In-house hire vs staff augmentation: the real cost comparison"
   - "Which internal processes are actually worth automating with AI?"
   - "GEO vs AEO vs SEO: what changed and what to do about it"
   - Case studies with real numbers — these rank *and* close deals
9. **Build location pages** if you serve specific cities — one page per city, with
   genuinely different content on each. Not copy-paste with the city swapped.
10. **Earn links.** Guest posts, local press, partner sites, industry directories.
    Never buy links — it's the fastest way to a manual penalty.
11. **Keep Search Console open.** The Performance report shows the exact queries
    you're already appearing for. Ranking #11 for something? One improved page often
    moves it to page 1 — far cheaper than chasing a new keyword.

---

## GEO / AEO — you sell it, so the site should demonstrate it

You now offer generative and answer engine optimisation. Prospects will check
whether your own site shows up in AI answers, so treat this as a shop window:

- The **FAQPage schema** already on both service pages is the single biggest AEO
  asset here — AI assistants parse it directly. Keep answers self-contained,
  factual, and phrased the way a buyer would ask.
- **Entity consistency** is what GEO runs on. "Augventa" must be described the same
  way everywhere — site, LinkedIn, Clutch, Crunchbase. AI models build their picture
  of you from the consensus across those sources.
- **Get cited, not just linked.** Being quoted in an article carries more GEO weight
  than a link in a directory, because that is what the models ingest.
- **Publish comparison and definition content.** "X vs Y" and "what is X" pages are
  disproportionately quoted in generated answers.
- Test monthly: ask ChatGPT and Perplexity *"who does IT staff augmentation in
  [your city]?"* and see whether you appear. That is your GEO ranking check.

---

## Free tools worth using

| Tool | What for |
|---|---|
| Google Search Console | Indexing, actual queries, errors — non-negotiable |
| Google Business Profile | Local pack + branded knowledge panel |
| PageSpeed Insights | Core Web Vitals; this site should score 95+ |
| Rich Results Test | Confirms your FAQ/Organization schema is valid |
| Schema Markup Validator | Second opinion on the JSON-LD |
| Bing Webmaster Tools | Bing + AI search visibility |
| Ubersuggest / Keyword Planner | Finding what people actually search |

---

## Realistic timeline

| When | What to expect |
|---|---|
| Days 1–7 | Site indexed; findable by exact domain name |
| Weeks 2–6 | Ranking #1 for your own brand name; Business Profile live in maps |
| Months 2–4 | Long-tail terms start appearing ("GCP migration partner [your area]") |
| Months 4–8 | Competitive service keywords, if blogging consistently |
| Months 8–12+ | Head terms like "IT staff augmentation" — needs real authority |

The site is now technically sound. Steps 1 and 2 above are worth more than
everything else combined — do those today.
