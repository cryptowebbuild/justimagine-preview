# Just Imagine Heating Ltd — website

A complete, static, SEO-ready website for **Just Imagine Heating Ltd** (Rugby, Warwickshire).
No build step, no framework, no database: upload the folder and it runs.

---

## 1. What's in the box

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Full conversion page: hero, services, emergency, why us, process, coverage, FAQ, quote form |
| Services | `services.html` | Hub for all 8 services, with anchor links |
| Boiler installation | `boiler-installation.html` | Dedicated landing page |
| Boiler repair & servicing | `boiler-repair-servicing.html` | Dedicated landing page |
| Landlord gas safety | `landlord-gas-safety-certificate.html` | CP12 landing page |
| Plumbing & heating | `plumbing-and-heating.html` | Dedicated landing page |
| Areas | `areas.html` | Coverage hub |
| Town pages | `areas/*.html` | Rugby, Coventry, Leicester, Northampton, Leamington Spa, Warwick, Kenilworth, Milton Keynes |
| About | `about.html` | Who you are, accreditations, values |
| Contact | `contact.html` | Quote form + phone/email |
| FAQs | `faq.html` | 10 questions with FAQ schema |
| Privacy / Terms | `privacy.html`, `terms.html` | UK GDPR-style policy and service terms |
| Utility | `404.html`, `thanks.html` | Error and form-success pages (noindex) |

Supporting files: `assets/css/styles.css`, `assets/js/app.js`, `assets/img/*`,
`robots.txt`, `sitemap.xml`, `site.webmanifest`.

**22 pages, 20 URLs in the sitemap.**

---

## 2. Deploy

Any static host works. The site uses relative paths, so it also runs from a subfolder.

**Netlify / Cloudflare Pages / Vercel**
1. Drag the whole folder into the dashboard (or connect the repo).
2. Build command: none. Output directory: `/` (the folder itself).
3. Point `justimagine.ltd` at the host and enable HTTPS.

**cPanel / traditional hosting**
Upload the contents to `public_html`. Make sure `index.html` sits at the root.

**Local preview**
```
python -m http.server 8099
```
Then open <http://localhost:8099>.

> Note: opening `index.html` directly from disk works for the layout, but the
> root-relative links in `site.webmanifest` and the 404 page expect a web server.

---

## 3. The contact form

By default the form **does not send email** — it validates the fields and opens the
visitor's email app with everything pre-filled to `justimagineheating@gmail.com`.
That is deliberate: it means the site works on any host with no backend.

**To collect submissions properly**, create a form endpoint (Formspree, Basin,
Netlify Forms, or your own) and add the URL here:

```html
<form class="form" data-quote-form data-endpoint="https://formspree.io/f/XXXXXXX">
```

It appears on: `index.html`, `contact.html`, and the four service pages.
When an endpoint is set, the form posts via `fetch` and shows an inline success
message; if the request fails it falls back to email.

**After changing the endpoint**, also set `action`/`method` if you want a no-JS
fallback, or leave it — the form is progressively enhanced.

---

## 4. Editing content

Everything is plain HTML. Open the file, change the text, save. There is no build
step and no templating to learn.

Common edits:

| What | Where |
|---|---|
| Phone number | Search for `07774 079 152` and `tel:+447774079152` in every `.html` file |
| Email | `justimagineheating@gmail.com` |
| Gas Safe number | `6100115` + the `gassaferegister.co.uk` link in the header/footer |
| Services | `services.html` and the four service pages |
| Service areas | `areas.html` and the files in `areas/` |
| FAQs | `faq.html` (visible text **and** the `FAQPage` JSON-LD at the bottom of the file) |
| Colours / type | `assets/css/styles.css` → `:root` tokens at the top |

If you change a page's title or description, update the matching `<title>`,
`<meta name="description">`, `og:title`, `og:description` and `twitter:*` tags.
Those are duplicated per page on purpose (no JS-generated meta).

---

## 5. SEO — what is already done

- Unique `<title>` and meta description on every page (all within recommended lengths)
- Canonical URL, `hreflang="en-GB"` and `x-default` on every page
- Open Graph + Twitter Card tags, with a 1200×630 share image (`assets/img/og-cover.jpg`)
- One `<h1>` per page, logical `h2`/`h3` order
- Semantic landmarks (`header`, `nav`, `main`, `footer`), skip link, breadcrumbs
- **Structured data (JSON-LD):** `LocalBusiness` + `Plumber` + `HVACBusiness`,
  `WebSite`, `WebPage`, `BreadcrumbList`, `Service` (service and town pages),
  `FAQPage` (home and FAQ page), plus the Gas Safe credential
- `sitemap.xml` with priorities and lastmod, and `robots.txt` pointing to it
- Descriptive URLs, internal linking between services, areas and FAQs
- Descriptive `alt` text on every image
- Mobile-first responsive layout, no layout shift (images have width/height)
- Fast by default: ~45 KB CSS, ~7 KB JS, no frameworks, no jQuery, lazy-loaded images
- `404.html` marked `noindex`, `thanks.html` marked `noindex`

### After launch (do these — they matter more than the code)

1. **Google Search Console** — verify the domain, submit
   `https://justimagine.ltd/sitemap.xml`, then request indexing for the home page.
2. **Bing Webmaster Tools** — import from Search Console.
3. **Google Business Profile** — claim/complete it: category *Gas engineer*,
   *Heating contractor*, *Plumber*; service area (Rugby + the towns listed);
   phone, email, hours, photos. Add the website link. This is the single
   biggest local-SEO lever for a business like this.
4. **Reviews** — ask happy customers for Google reviews and add them to the
   Google profile. Do **not** paste invented reviews into the site.
5. **NAP consistency** — the same business name, phone and base town everywhere
   (site, Google, Facebook, Checkatrade, Yell, etc.).
6. **Real photos** — replace `assets/img/*.jpg` with genuine photos of the
   engineer, van and jobs. Real photos convert better than stock/AI images and
   are the main trust upgrade left.
7. **Analytics (optional)** — add a consent-gated GA4/Plausible snippet in
   `assets/js/app.js` inside `window.loadAnalytics`, so it only runs after the
   visitor accepts.

### Things to review before publishing (accuracy)

The site only makes claims that come from your existing site or are standard
service promises. Please confirm these are true for your business, or edit them:

- "Free home survey and written quote" for boiler installations
- "Digital copy sent the same day" for landlord certificates
- "Same-day and next-day slots where we can fit them in"
- "Any diagnostic charge will be confirmed before we visit"
- "12-month workmanship guarantee" (in `terms.html`)
- "Public liability insurance held" (in `terms.html`)
- "We repair and service all major domestic boiler brands"
- The 8 towns and postcode groups on the area pages

I deliberately **did not invent** prices, opening hours, a street address,
years of experience, customer reviews or a review rating. Add them when you have
real, verifiable details — Google rewards them, but only if they are true.

---

## 6. Accessibility & performance notes

- WCAG 2.1 AA colour contrast (audited with axe-core: 0 violations on the five
  main templates at desktop and mobile widths)
- Visible focus styles, labelled form fields, `aria-expanded` mobile menu,
  keyboard-operable accordions (`<details>`), `aria-live` form status
- Respects `prefers-reduced-motion`; content is visible without JavaScript
- Tested at 360, 390, 768, 1024 and 1440 px with no horizontal overflow

---

## 7. Files you can safely delete

- `README.md` (this file) — optional, keep it for reference
- Nothing else. Every other file is referenced by the site.

---

© 2026 Just Imagine Heating Ltd. Gas Safe registered — Reg. 6100115.
