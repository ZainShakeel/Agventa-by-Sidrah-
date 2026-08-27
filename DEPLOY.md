# Deploying to Cloudflare Pages with a GoDaddy domain

Repo: <https://github.com/ZainShakeel/Agventa-by-Sidrah->

Three stages: **connect the repo → deploy → point the domain.**
Stage 3 is the only one with a trap in it, so read the ⚠️ warning before you touch
GoDaddy.

---

## Stage 1 — Connect the repo to Cloudflare Pages

1. Go to <https://dash.cloudflare.com> and sign up or log in (free plan is fine).
2. In the left sidebar open **Workers & Pages** → **Create** → **Pages** tab →
   **Connect to Git**.
   *The exact menu wording shifts as Cloudflare merges Pages into Workers. Look for
   "Import an existing Git repository" — that's the one you want.*
3. Click **Connect GitHub**, authorise Cloudflare, and choose
   **ZainShakeel/Agventa-by-Sidrah-**.
   You can grant access to just this one repo rather than all of them.
4. On the build configuration screen:

   | Field | Value |
   |---|---|
   | Project name | `augventa` (this becomes `augventa.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | *leave completely empty* |
   | Build output directory | `/` |

   This is a plain static site — there is no build step. If Cloudflare tries to run
   one, the deploy fails. Empty build command is correct.

5. **Save and Deploy.** It takes about 30 seconds.

You'll get a live URL like `https://augventa.pages.dev`. Open it and click through
all five pages to confirm everything works.

**From now on, every `git push` to `main` redeploys automatically.** No further
action needed to publish changes.

---

## Stage 2 — Test the contact form

Now that the site is on a real HTTPS domain, the form will work (it can't work from
your Desktop — browsers block cross-site requests from `file://` pages).

1. Submit the contact form once.
2. **FormSubmit sends a one-time activation link to Sidrah@adventa.com.** Open that
   email and click the link.
3. Submit again. This one should arrive at Sidrah@adventa.com, cc'd to
   shakeelzain04@gmail.com.

Until that activation link is clicked, submissions are silently discarded. If your
test produces nothing, this is almost always why.

---

## Stage 3 — Point the GoDaddy domain at Cloudflare

### ⚠️ Read this first

You're about to move DNS control from GoDaddy to Cloudflare. **If your domain
currently receives email, its MX records must come across or email stops working.**

Before changing anything, open GoDaddy's DNS page and screenshot every record —
especially **MX**, and any **TXT** records (SPF, DKIM, domain verification). Cloudflare
usually imports these automatically, but you must verify, and you can only verify
against a record of what was there.

### Why move the nameservers at all?

Because a bare domain (`augventa.com`, no `www`) cannot be a CNAME under standard
DNS, and GoDaddy doesn't support the workaround. Cloudflare does — it's called CNAME
flattening. Keeping DNS at GoDaddy means only `www.augventa.com` works properly;
the bare domain would need a clumsy GoDaddy redirect.

Moving nameservers takes ten minutes and also gives you free CDN, SSL and analytics.

### Steps

1. **In Cloudflare:** click **Add a site** (top of the dashboard), type your domain,
   choose the **Free** plan.
2. Cloudflare scans your existing DNS. **Compare the list against your screenshot.**
   Add anything missing — particularly MX records — before continuing.
3. Cloudflare shows you two nameservers, something like:
   ```
   dana.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```
   Keep this tab open.
4. **In GoDaddy:** *My Products* → find the domain → **DNS** → scroll to
   **Nameservers** → **Change** → choose **"I'll use my own nameservers"**.
5. Delete GoDaddy's nameservers, paste in Cloudflare's two, save. Confirm any
   warning GoDaddy shows.
6. Back in Cloudflare, click **Check nameservers now**. Propagation usually takes
   10–60 minutes (GoDaddy says up to 48 hours; it's rarely that long).

### Attach the domain to your Pages project

Once Cloudflare says the domain is **Active**:

1. **Workers & Pages** → your `augventa` project → **Custom domains** tab.
2. **Set up a custom domain** → enter `augventa.com` → Cloudflare creates the DNS
   record for you.
3. Repeat for `www.augventa.com`.
4. SSL certificates issue automatically — usually a few minutes, occasionally up to
   an hour. The padlock appears when it's done.

---

## Stage 4 — Pick one canonical domain

Decide whether your real address is `augventa.com` or `www.augventa.com`, then make
everything agree. Splitting between both divides your SEO signals across two
addresses and Google treats them as separate sites.

**Recommended:** bare domain (`augventa.com`) as primary, `www` redirecting to it.

To set the redirect: Cloudflare dashboard → your domain → **Rules** → **Redirect
Rules** → create a rule sending `www.augventa.com/*` to `https://augventa.com/$1`
with a **301 (permanent)** status.

Then make the site's own tags match — every page has a `<link rel="canonical">` and
OG/Twitter URLs currently set to `https://www.augventa.com`. If you go with the bare
domain, all of them need the `www.` removed, along with `robots.txt` and
`sitemap.xml`. It's a single find-and-replace across the repo — ask and I'll do it in
one pass.

---

## Stage 5 — After it's live

1. **Google Search Console** — add the domain, verify (easiest via a Cloudflare TXT
   record), submit `https://yourdomain.com/sitemap.xml`, then use URL Inspection →
   Request Indexing on the homepage.
2. **Google Business Profile** — the highest-leverage item for showing up when
   someone searches your company name. See `SEO-CHECKLIST.md`.
3. **Remove the test cc.** Once the form is confirmed working, delete the
   `_cc` hidden field (`shakeelzain04@gmail.com`) from `contact.html`, `tech.html`
   and `non-tech.html`, or that inbox keeps receiving real client enquiries.
4. **Replace the placeholder content** still in the site — pricing figures,
   testimonials, team members and the stat numbers. All flagged in `README.md`.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| Deploy fails immediately | A build command was set. It must be empty. |
| Site loads but CSS is missing | Build output directory isn't `/`. |
| Form submits but no email | FormSubmit activation link not clicked yet. |
| Domain shows "Pending nameserver update" | GoDaddy change hasn't propagated. Wait, then re-check. |
| Email stopped working after DNS move | MX records didn't transfer. Re-add them in Cloudflare DNS from your screenshot. |
| Certificate warning in browser | SSL still issuing. Give it up to an hour. |
| Changes pushed but site unchanged | Check the Deployments tab for a failed build; hard-refresh with Ctrl+Shift+R. |
