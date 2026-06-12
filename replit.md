# I.LuxuryEgypt

A bespoke luxury travel management system and CMS for Egyptian tourism. Provides a client-facing website for browsing tours, hotels, and destinations, alongside a comprehensive admin dashboard for content management and inquiry handling.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Tailwind CSS, Framer Motion, Shadcn/UI (Radix), TanStack Query, Wouter routing
- **Backend**: Node.js + Express, JWT authentication, Multer for file uploads
- **Database**: PostgreSQL (Replit built-in) via Drizzle ORM
- **Build**: Vite (frontend), esbuild (server bundling)

## Project Layout

- `client/` — React frontend (components, pages, lib)
- `server/` — Express backend (routes, auth, storage, db)
- `shared/` — Shared TypeScript types and Drizzle schema
- `attached_assets/` — Uploaded media files

## Development

The app runs as a single unified server (Express + Vite middleware) on port 5000.

```
npm run dev      # Start dev server (port 5000)
npm run db:push  # Push schema changes to the database
npm run build    # Build for production
npm start        # Start production server
```

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned by Replit)
- `JWT_SECRET` — Secret key for JWT token signing
- `SESSION_SECRET` — Secret for session management

## Admin Access

Default admin credentials (change after first login):
- Username: `admin`
- Password: `admin123`

## User Preferences

- Keep the single-server architecture (Express serves both API and frontend)
- Do not run `npm run build` in the dev environment (see DO_NOT_BUILD_ON_SERVER.txt)
