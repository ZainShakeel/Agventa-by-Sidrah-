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
2. **FormSubmit emails a one-time activation link to shakeelzain04@gmail.com.**
   Open it and click the link.
3. Submit again. This one lands in shakeelzain04@gmail.com.

Delivery points at that Gmail address because `sidrah@augventa.com` has no mailbox
behind it yet — see **Set up email on the domain** below.

Until the activation link is clicked, submissions are silently discarded. If your
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
3. Repeat for `www.augventa.com` so both resolve.
4. SSL certificates issue automatically — usually a few minutes, occasionally up to
   an hour. The padlock appears when it's done.

---

## Stage 4 — Canonical domain (done) and the www fix

The site is live on the **bare domain** `https://augventa.com`, and every canonical,
OG and JSON-LD URL in the repo now points there. No further code changes needed.

⚠️ **`www.augventa.com` currently returns a 522 error.** A DNS record for `www`
exists but isn't attached to the Pages project, so anyone typing "www" hits a broken
page. Fix it one of two ways:

**Option A (recommended)** — Workers & Pages → your project → **Custom domains** →
add `www.augventa.com`. Then your domain → **Rules → Redirect Rules** → send
`www.augventa.com/*` to `https://augventa.com/$1` with a **301 (permanent)**.

**Option B** — your domain → **DNS** → delete the `www` record, so www simply
doesn't resolve rather than erroring.

---

## Set up email on the domain

`augventa.com` has **no MX records**, so `sidrah@augventa.com` cannot receive mail.
Free fix, and the domain is already on Cloudflare:

1. Cloudflare dashboard → your domain → **Email** → **Email Routing** → enable.
2. Cloudflare adds the MX and SPF records automatically.
3. Create a custom address: `sidrah@augventa.com` → forward to Sidrah's real inbox.
4. Cloudflare sends that inbox a verification link. It must be clicked.

Then switch form delivery back: change the `action` on all three forms to
`https://formsubmit.co/sidrah@augventa.com`, add the `_cc` hidden field back for the
test inbox, push, and redo the FormSubmit activation once.

Note: Email Routing **forwards** incoming mail; it does not let you *send* as
sidrah@augventa.com. For that you need Google Workspace or Zoho Mail (Zoho has a free
tier for a single domain).

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
