---
name: riligar-dev-website-seo
description: >
  Update all SEO metadata for a RiLiGar website template. Reads the project
  owner's name, domain, role, and content, then updates: index.html (title,
  description, og tags, JSON-LD), useSeoMeta hook (BASE_URL, default title),
  all page-level useSeoMeta calls, sitemap.xml (URLs + blog slugs), and
  robots.txt (sitemap URL). Run whenever a template is repurposed for a new owner.
tags: [seo, website, meta, sitemap, riligar]
---

# RiLiGar Dev Website SEO

Update all SEO metadata across the website template for a new owner.

## Quick Start

```
Update SEO for this website. Owner: [Name], Domain: [domain], Role: [role description].
```

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| **Owner name** | Yes | Full name of the person |
| **Domain** | Yes | e.g. `humbertomaciel.com.br` |
| **Role / tagline** | Yes | e.g. `Senior Salesforce Consultant · 7x Certified` |
| **Description** | Yes | 1–2 sentence SEO description |
| **LinkedIn URL** | Yes | For JSON-LD sameAs |
| **Photo filename** | Yes | e.g. `Humberto Maciel.webp` |
| **Blog slugs** | Auto | Read from `blog-posts/*.js` files |

## Files to Update

1. `index.html` — static meta tags, og tags, JSON-LD Person + WebSite
2. `src/hooks/useSeoMeta.js` — BASE_URL, default title fallback
3. `src/pages/Home.jsx` — add or update useSeoMeta call
4. `src/pages/Blog.jsx` — update useSeoMeta call
5. `src/pages/BlogPost.jsx` — update useSeoMeta call
6. `public/sitemap.xml` — replace domain + all blog slugs
7. `public/robots.txt` — update Sitemap URL

## Process

### Phase 1: Read current state
- Read `index.html`, `useSeoMeta.js`, all page files, `sitemap.xml`, `robots.txt`
- Read all `blog-posts/*.js` to collect current slugs and dates

### Phase 2: Update index.html
- `<title>`: `[Name] — [Role short]`
- `<meta name="description">`: provided description
- `<meta name="author">`: owner name
- `<link rel="canonical">`: `https://[domain]/`
- All `og:*` tags: title, description, url, image, site_name
- All `twitter:*` tags
- `<link rel="apple-touch-icon">`: update filename
- JSON-LD Person: name, url, image, jobTitle, description, sameAs, knowsAbout
- JSON-LD WebSite: name, url

### Phase 3: Update useSeoMeta.js
- `BASE_URL`: `https://[domain]`
- Default title fallback: `[Name] — [Role short]`
- Title suffix: `— [Name]`

### Phase 4: Update page useSeoMeta calls
For each page, set contextually correct title + description:
- **Home**: owner name + role as title, full pitch as description
- **Blog**: `Blog — [Name]`, description about content topics
- **BlogPost**: already dynamic from post data — verify correct

### Phase 5: Update sitemap.xml
- Replace all occurrences of old domain with new domain
- Remove old blog post URLs
- Add current blog post URLs (from blog-posts/*.js slugs + dates)
- Keep: `/`, `/blog`, `/politica-de-privacidade`
- Remove: `/news` entries (if not used)

### Phase 6: Update robots.txt
- Update `Sitemap:` line with new domain

## knowsAbout for JSON-LD (Salesforce context)
When owner is a Salesforce consultant, use:
```json
"knowsAbout": [
  "Salesforce Implementation",
  "Sales Cloud",
  "Service Cloud",
  "Marketing Cloud",
  "Experience Cloud",
  "Apex",
  "Lightning Web Components",
  "Salesforce DevOps",
  "CRM Strategy",
  "Release Management"
]
```

## Tips
- Domain may not be final — use a placeholder like `humbertomaciel.com.br` and note it
- Never change the `useSeoMeta` hook signature — only BASE_URL and default strings
- Blog slugs come from the `slug` field in each `blog-posts/*.js` file
- `lastmod` in sitemap should match the `date` field in each blog post file
