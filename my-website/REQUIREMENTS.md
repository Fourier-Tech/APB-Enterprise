# APB Enterprise - Project Requirements

This is a production Next.js website for APB Enterprise (elevator components manufacturer).

## Project Info
- **Company**: APB Enterprise — Elevator Control Systems Manufacturer
- **Development Team**: FourierTech (student dev agency)
- **Type**: Production website (custom-built, not a template)

## Tech Stack
- **Framework**: Next.js 16.2.6 (App Router, Turbopack)
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5
- **ORM**: Prisma 7.8.0
- **Database**: Neon PostgreSQL (serverless database)
- **PostgreSQL Adapter**: pg 8.21.0
- **Animations**: GSAP 3.12.5 (loaded via CDN)
- **Maps**: jsVectorMap 1.5.3 (world map, loaded via CDN)
- **Icons**: Font Awesome 6 (loaded via CDN)
- **Fonts**: Google Fonts (Space Grotesk + Epilogue)
- **Hosting**: Railway (unified single-service deployment)
- **Media Storage**: Cloudinary (images + PDFs)

## NPM Dependencies (package.json)
### Production:
- `@prisma/adapter-pg`: ^7.8.0
- `@prisma/client`: ^7.8.0
- `dotenv`: ^17.4.2
- `next`: 16.2.6
- `pg`: ^8.21.0
- `react`: 19.2.4
- `react-dom`: 19.2.4

### Development:
- `@tailwindcss/postcss`: ^4
- `@types/node`: ^20
- `@types/react`: ^19
- `@types/react-dom`: ^19
- `eslint`: ^9
- `eslint-config-next`: 16.2.6
- `prisma`: ^7.8.0
- `tailwindcss`: ^4
- `ts-node`: ^10.9.2
- `typescript`: ^5

## Environment Variables Required
- `DATABASE_URL`: Neon PostgreSQL connection string (pooled)
- `DIRECT_URL`: Neon PostgreSQL direct connection string (for migrations)

## Setup Instructions
1. Clone the repository
2. Navigate to the project directory: `cd my-website`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add `DATABASE_URL` and `DIRECT_URL`
5. Generate the Prisma client: `npx prisma generate`
6. Sync the database schema: `npx prisma db push` (or `npx prisma migrate dev` if using migrations)
7. Start the development server: `npm run dev` (starts on port 3000)

## Build & Deploy
- **Production Build**: `npm run build`
- **Start Production Server**: `npm run start`
- **Deployment**: Configured to auto-deploy to Railway on pushes to the main branch.

## CDN Dependencies (Loaded in `layout.tsx` `<head>`)
- Google Fonts: Space Grotesk + Epilogue
- Font Awesome 6.0.0-beta3
- jsVectorMap 1.5.3 (CSS)
- GSAP 3.12.5 & jsVectorMap JS (Loaded dynamically via script tags in specific components like LiftZone)

## Database Tables
1. `products`: Elevator components catalog
2. `brochures`: PDF brochure links (Cloudinary)
3. `contacts`: Single-row business contact configuration
4. `quote_requests`: Form submission logs for quotes

## Pages Layout
- `/` (Home): Hero Banner, Interactive Elevator Demo, LiftZone Scroll-Jack section, Brochure strip
- `/about`: Company story
- `/products`: Product catalog with dynamic database integration
- `/brochures`: PDF viewer for catalogs
- `/contact`: WhatsApp quote generation forms

## System Requirements
- **Node.js**: Minimum Node.js 18.x (Recommended: Node.js 20.x or 22.x)
