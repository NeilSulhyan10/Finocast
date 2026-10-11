# Finocast Legacy URL Redirects

This document maps legacy website URLs to new website routes for permanent (301) redirects.

## Legacy URL Structure (from finocast.com)

| Legacy URL | New Route | Redirect Type | Notes |
|------------|-----------|---------------|-------|
| `/` | `/` | - | Homepage |
| `/about/` | `/about` | 301 | Trailing slash normalization |
| `/material-application/` | `/capabilities#materials` | 301 | Section anchor |
| `/process/` | `/process` | 301 | |
| `/quality/` | `/quality` | 301 | |
| `/machine-facility/` | `/infrastructure` | 301 | Renamed |
| `/contact/` | `/contact` | 301 | |
| `/enquiry/` or `/enquiry` | `/request-a-quote` | 301 | Renamed to RFQ |

## WordPress-Specific URLs (if applicable)

| Legacy URL | New Route | Redirect Type | Notes |
|------------|-----------|---------------|-------|
| `/wp-content/uploads/2020/12/Finocast_brochure.pdf` | `/documents/Finocast_brochure.pdf` | 301 | Brochure download |
| `/wp-content/uploads/*` | `/images/*` or remove | 301/410 | Migrate or remove assets |

## Blog/News URLs (if any)

| Legacy URL | New Route | Redirect Type | Notes |
|------------|-----------|---------------|-------|
| `/blog/*` | `/` or remove | 301/410 | No blog in new site |
| `/news/*` | `/` or remove | 301/410 | No news section |

## Implementation

### Next.js Middleware (recommended)

Create `src/middleware.js`:

```javascript
import { NextResponse } from 'next/server';

const redirects = new Map([
  ['/about/', '/about'],
  ['/material-application/', '/capabilities#materials'],
  ['/process/', '/process'],
  ['/quality/', '/quality'],
  ['/machine-facility/', '/infrastructure'],
  ['/contact/', '/contact'],
  ['/enquiry/', '/request-a-quote'],
  ['/enquiry', '/request-a-quote'],
  ['/wp-content/uploads/2020/12/Finocast_brochure.pdf', '/documents/Finocast_brochure.pdf'],
]);

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  if (redirects.has(pathname)) {
    const destination = redirects.get(pathname);
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url, 301);
  }
  
  // Handle trailing slashes
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/about/',
    '/material-application/',
    '/process/',
    '/quality/',
    '/machine-facility/',
    '/contact/',
    '/enquiry/',
    '/enquiry',
    '/wp-content/uploads/2020/12/Finocast_brochure.pdf',
  ],
};
```

### Alternative: next.config.mjs Redirects

```javascript
// next.config.mjs
const nextConfig = {
  async redirects() {
    return [
      { source: '/about/', destination: '/about', permanent: true },
      { source: '/material-application/', destination: '/capabilities#materials', permanent: true },
      { source: '/process/', destination: '/process', permanent: true },
      { source: '/quality/', destination: '/quality', permanent: true },
      { source: '/machine-facility/', destination: '/infrastructure', permanent: true },
      { source: '/contact/', destination: '/contact', permanent: true },
      { source: '/enquiry/', destination: '/request-a-quote', permanent: true },
      { source: '/enquiry', destination: '/request-a-quote', permanent: true },
      { source: '/wp-content/uploads/2020/12/Finocast_brochure.pdf', destination: '/documents/Finocast_brochure.pdf', permanent: true },
    ];
  },
};
```

## Notes

- **Anchor links** (`#materials`) work client-side after page load
- **Trailing slashes**: Next.js App Router handles automatically, but explicit redirects ensure SEO
- **WordPress uploads**: Migrate brochure to `/public/documents/`, other assets to `/public/images/`
- **410 Gone**: Use for content that has no equivalent (e.g., blog posts) rather than redirecting to homepage
- **Testing**: Verify all redirects with `curl -I` before DNS cutover

## Verification Checklist

- [ ] All legacy URLs tested and mapped
- [ ] 301 redirects implemented and tested
- [ ] No redirect chains (>1 hop)
- [ ] No redirect loops
- [ ] Brochure PDF accessible at new URL
- [ ] Google Search Console updated with new sitemap
- [ ] Bing Webmaster Tools updated
- [ ] Analytics updated for new URLs