# DEV4COM - Next.js Website

## Project Overview
Portfolio and lead-generation website for **DEV4COM** (Dev4Ecom), a web agency based in Lausanne, Switzerland. Targets clients in Lausanne, Annecy, Suisse romande, and Haute-Savoie.

## Tech Stack
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS 3 + custom CSS animations in `globals.css`
- **Animations**: Framer Motion 10
- **Auth**: Firebase (email/password) via `AuthContext`
- **Email**: Nodemailer with Hostinger SMTP
- **Storage**: AWS S3 for media uploads
- **Icons**: Lucide React
- **Fonts**: Inter (global via `next/font`), Syne (Hero display headings)
- **Deployment**: Vercel

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (contact, send-lead-email)
│   ├── admin/              # Admin dashboard (Firebase-protected)
│   ├── services/           # Services page
│   ├── projets/            # Portfolio page
│   ├── contact/            # Contact form page
│   ├── audio/              # Audio module page
│   ├── mentions-legales/   # Legal notice
│   ├── politique-confidentialite/  # Privacy policy
│   ├── layout.tsx          # Root layout (metadata, JSON-LD, fonts)
│   ├── sitemap.ts          # Dynamic sitemap generation
│   └── robots.ts           # Robots.txt configuration
├── components/
│   ├── Header.tsx          # Navigation with auth state
│   ├── Hero.tsx            # Homepage hero section
│   ├── Chatbot.tsx         # Rule-based chat assistant (client-side)
│   ├── Contact.tsx         # Contact form with Google Maps
│   ├── Services.tsx        # Services display
│   ├── Projects.tsx        # Portfolio grid
│   ├── Footer.tsx          # Site footer
│   ├── Loader.tsx          # SVG Bezier curve loading animation
│   └── admin/              # Admin sub-components (CRUD)
├── contexts/
│   └── AuthContext.tsx      # Firebase auth provider
├── lib/
│   ├── firebase.ts         # Firebase initialization
│   ├── email.ts            # Email HTML templates + Nodemailer config
│   └── s3.ts               # AWS S3 upload/delete utilities
└── types/
    ├── project.ts          # Project interface
    └── audio.ts            # Audio interface
```

## Key Conventions
- **Language**: French-first (UI, content, error messages)
- **Components**: Functional components with `React.FC` typing
- **Client vs Server**: Pages that only compose components are Server Components (can export `metadata`). Pages using framer-motion directly are `'use client'` with metadata in their `layout.tsx`.
- **Styling**: Tailwind utilities inline. Custom CSS only in `globals.css` for keyframe animations.
- **Dark theme**: Background `#0a0a0a` / `tech-pattern-bg`, blue-cyan accent palette
- **Path alias**: `@/*` → `./src/*`
- **API routes**: `NextResponse.json()` with try-catch, French error messages

## Environment Variables
See `.env.exemple` for the template. Key vars:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — Hostinger email
- `CONTACT_EMAIL` — Admin notification email
- `NEXT_PUBLIC_*` — Firebase config (public keys)
- `NEXT_PUBLIC_AWS_*` — S3 config

## Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## SEO
- Root `layout.tsx` contains global metadata, JSON-LD structured data (ProfessionalService), and title template
- Per-page metadata exported from Server Component pages or route-level `layout.tsx`
- `sitemap.ts` and `robots.ts` auto-generate `/sitemap.xml` and `/robots.txt`
- Location keywords: Annecy, Lausanne, Suisse romande, Haute-Savoie

## Important Notes
- The chatbot is **client-side rule-based** (no API costs). Falls back to email CTA.
- Admin dashboard at `/admin` requires Firebase auth.
- Google Maps embed in Contact.tsx points to the Lausanne office address.
- The Loader component uses lightweight SVG Bezier curve animations (no blur filters for mobile performance).
