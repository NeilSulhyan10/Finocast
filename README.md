# Finocast - Precision Investment Casting Website

Next.js 16 App Router website for Finocast, a precision investment casting and machining manufacturer.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (ESM) + JSX — **No TypeScript**
- **Styling**: Tailwind CSS v4
- **Animations**: Motion for React
- **Icons**: Lucide React
- **Validation**: Zod
- **Email**: Resend / SendGrid / Nodemailer (configurable)

## Project Structure

```
finocast/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── products/
│   │   ├── process/
│   │   ├── factory/
│   │   └── quality/
│   ├── documents/
│   └── logo.svg
├── docs/
│   ├── content-verification.md
│   ├── asset-inventory.md
│   └── redirects.md
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.jsx
│   │   ├── globals.css
│   │   ├── about/page.jsx
│   │   ├── capabilities/page.jsx
│   │   ├── industries/page.jsx
│   │   ├── process/page.jsx
│   │   ├── quality/page.jsx
│   │   ├── infrastructure/page.jsx
│   │   ├── contact/page.jsx
│   │   ├── request-a-quote/page.jsx
│   │   ├── api/enquiries/route.js
│   │   ├── sitemap.js
│   │   └── robots.js
│   ├── components/
│   │   ├── layout/Header.jsx, Footer.jsx
│   │   ├── home/ (Hero, CapabilitiesAtGlance, ProductGallery, Industries, Process, Quality, Infrastructure, About, CTA)
│   │   ├── ui/ (Button, Layout, Typography)
│   │   └── forms/FormFields.jsx
│   ├── data/
│   │   ├── company.js
│   │   ├── materials.js
│   │   ├── industries.js
│   │   ├── process.js
│   │   └── equipment.js
│   └── lib/
│       ├── validation.js
│       ├── email.js
│       ├── seo.js
│       └── utils.js
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Supabase project with the migration applied; see `docs/supabase-setup.md`.

- Node.js 20.9 or later (required by the installed Next.js version)
- npm 9+ (or yarn/pnpm/bun)

### Installation

```bash
# Navigate to project directory
cd Finocast

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required for forms/admin: Supabase URL, publishable key (or the supported legacy anon key), and server-only service role key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Existing Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable key; legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only privileged key for validated submissions, private uploads, and admin APIs |
| `CRON_SECRET` | For attachments | Bearer secret for the scheduled expired-upload cleanup route |
| `FINOCAST_ENQUIRY_EMAIL` | For notifications | Notification destination; defaults to `bhupal@finocast.com` |
| `EMAIL_PROVIDER` | No | `resend`, `sendgrid`, or `nodemailer` (default: resend) |
| `EMAIL_FROM` | For notifications | Sender email address verified with your provider |
| `EMAIL_FROM_NAME` | No | Sender display name |
| `RESEND_API_KEY` | If using Resend | Resend API key |
| `SENDGRID_API_KEY` | If using SendGrid | SendGrid API key |
| `SMTP_HOST` | If using Nodemailer | SMTP server hostname |
| `SMTP_PORT` | If using Nodemailer | SMTP port (default: 587) |
| `SMTP_SECURE` | If using Nodemailer | Use TLS (default: false) |
| `SMTP_USER` | If using Nodemailer | SMTP username |
| `SMTP_PASS` | If using Nodemailer | SMTP password |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL for canonical links (default: https://finocast.com) |

## Email Configuration

### Resend (Recommended)

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Create API key
4. Add to `.env`:
   ```env
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=your-resend-api-key
   FINOCAST_ENQUIRY_EMAIL=bhupal@finocast.com
   EMAIL_FROM=your-verified-sender@example.com
   ```

### SendGrid

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify sender identity
3. Create API key with Mail Send permissions
4. Add to `.env`:
   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=your-sendgrid-api-key
   FINOCAST_ENQUIRY_EMAIL=bhupal@finocast.com
   EMAIL_FROM=your-verified-sender@example.com
   ```

### Nodemailer (Custom SMTP)

```env
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
FINOCAST_ENQUIRY_EMAIL=bhupal@finocast.com
EMAIL_FROM=your-verified-sender@example.com
```

## Content Verification

**Important**: All company facts, specifications, and claims are documented in `docs/content-verification.md` with verification statuses:

- **VERIFIED** - Confirmed by multiple current sources
- **HISTORICAL** - Published on legacy website, not recently confirmed
- **CONFLICTING** - Multiple sources disagree
- **AWAITING CONFIRMATION** - Needs verification from business owner
- **NOT VERIFIED** - No supporting evidence found

**Never publish historical figures as current claims without confirmation.**

Key items requiring business owner verification before launch:
1. Current ISO 9001:2015 certification validity and scope
2. Current annual capacity (500 MT claim)
3. Current facility size (20,000 sq. ft. claim)
4. Current casting weight range (0.050–120 kg)
5. Current export markets
6. Active industries (aerospace, defence, orthopaedics especially)
7. Office address (conflicting addresses on legacy site)
8. Radiography/ultrasonic testing - in-house or outsourced?
9. Complete list of current nickel/cobalt alloy grades
10. Dimensional tolerances and surface finish specifications

## Asset Management

See `docs/asset-inventory.md` for complete asset catalog.

### Required Assets (Priority)

1. **Logo**: Vector format (SVG) - primary, white, monochrome variants
2. **Hero Images**: Factory exterior, foundry interior, CNC machining close-up
3. **Product Photography**: 8+ cast component photos with scale reference
4. **Process Photography**: 11 stages of investment casting process
5. **Factory Photography**: 10+ facility/equipment photos
6. **Quality Equipment**: 9+ inspection/testing equipment photos
7. **Documents**: Brochure PDF, ISO certificate (if current)

### Placeholder Strategy

Until authentic photography is available:
- Use high-quality industrial stock photos (Unsplash/Pexels)
- Mark clearly as placeholders in alt text and documentation
- Never present as actual Finocast facility/product photos
- Replace before production launch

## Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Homepage with all key sections | Complete |
| `/about` | Company history, vision, facility | Complete |
| `/capabilities` | Materials, casting specs, CNC machining, finishing | Complete |
| `/industries` | 9 industry sectors with applications | Complete |
| `/process` | 11-stage manufacturing process | Complete |
| `/quality` | Testing, inspection, certifications | Complete |
| `/infrastructure` | Equipment lists, factory gallery | Complete |
| `/contact` | Contact info, general enquiry form | Complete |
| `/request-a-quote` | Technical RFQ form | Complete |

## Enquiry System

Two form endpoints:
1. **General Contact** (`/contact`) - Basic enquiries
2. **Request a Quote** (`/request-a-quote`) - Technical RFQs with component details

Both submit to `/api/enquiries` with:
- Server-side Zod validation
- Rate limiting (5 requests/minute per IP)
- Honeypot spam protection
- Transactional email via configured provider
- Confirmation email to enquirer

### Quote Attachments

Quotation attachments upload directly to a private Supabase Storage bucket using short-lived signed upload tokens. The form accepts PDF, DWG, DXF, STEP/STP, IGES/IGS, JPG/JPEG, PNG, WEBP and TIFF files, with a limit of 5 files, 10 MB per file and 25 MB total. Expired staging uploads should be removed by scheduling the authenticated cleanup endpoint described in `docs/supabase-setup.md`.

### Supabase Enquiries and Administration

Both public forms persist validated submissions to Supabase PostgreSQL. The protected `/admin` dashboard requires a Supabase Auth account explicitly added to `public.admin_users`. Apply `supabase/migrations/202610100001_finocast_admin_enquiries.sql` and follow `docs/supabase-setup.md` before enabling forms in production. The Supabase service role key stays server-side and is required for public server-side intake, attachment staging and administrative operations.

## SEO Features

- Unique titles, descriptions per page
- Open Graph & Twitter Card metadata
- Canonical URLs
- JSON-LD structured data (Organization, LocalBusiness, WebSite, BreadcrumbList)
- Sitemap.xml generation
- Robots.txt
- Semantic HTML with proper heading hierarchy
- Descriptive alt text for all images

## Accessibility

- WCAG 2.1 AA target
- Keyboard navigation
- Focus visible states
- ARIA labels and roles
- Form labels and error announcements
- Color contrast compliance
- Reduced motion support
- Skip links (to be added)

## Performance

- Next.js Image optimization (WebP/AVIF)
- Font optimization (next/font)
- Server Components by default
- Client Components only for interactivity
- Lazy loading for below-fold images
- Minimal JavaScript bundle

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

```bash
npm run build
npm run start
```

Ensure environment variables are configured in your platform.

## Legacy URL Redirects

See `docs/redirects.md` for URL mapping from old site.

Key legacy URLs to preserve/redirect:
- `/about/` → `/about`
- `/material-application/` → `/capabilities#materials`
- `/process/` → `/process`
- `/quality/` → `/quality`
- `/machine-facility/` → `/infrastructure`
- `/contact/` → `/contact`

## Documentation

- `docs/content-verification.md` - All facts with verification status
- `docs/asset-inventory.md` - Complete asset catalog
- `docs/redirects.md` - Legacy URL redirects

## License

Proprietary - Finocast Precision Investment Casting. All rights reserved.
