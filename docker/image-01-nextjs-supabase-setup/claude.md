# CLAUDE.md

## Project Overview

This project is a Next.js App Router application demonstrating CRUD operations for Users using:

- Next.js (App Router)
- React
- Supabase (Postgres)
- Drizzle ORM
- shadcn/ui
- Tailwind CSS
- lucide-react

The application contains four pages, each dedicated to one CRUD operation:
- Read users
- Create users
- Update users
- Delete users

Each page has its own form and UI logic and communicates with the backend through API Route Handlers.

---

## Architecture Rules

### Rendering Model
- Use Server Components by default
- Use Client Components for forms and interactivity
- Data fetching may occur in Server Components
- All mutations must go through backend routes

### Data Flow

Client UI  
→ API Routes (Route Handlers)  
→ Drizzle ORM  
→ Supabase Postgres

---

## Tech Stack Rules

### Frontend
- Use Next.js App Router
- React for UI
- shadcn/ui components only
- Tailwind CSS for styling
- lucide-react for icons
- Forms may use controlled inputs or React Hook Form

### Backend
- Use Route Handlers
- Use Drizzle ORM for all database access
- Supabase is used strictly as managed Postgres
- No raw SQL
- No Supabase queries inside React components

---

## Database Schema

The users table must include:

- id (uuid, primary key)
- name (text)
- email (text, unique)
- created_at (timestamp)

Rules:
- Schema must be defined with Drizzle
- Use migrations
- Schema definitions must not live in UI code

---

## Supabase Rules

- Supabase is not accessed directly from the frontend
- Auth is optional unless explicitly required
- Required environment variables:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY (server-only)

Never expose service role keys to the client.

---

## API Route Rules

### /api/users

GET
- Returns all users
- Used by the Read Users page

POST
- Creates a new user
- Used by the Create User page
- Must validate request payload

---

### /api/users/[id]

PUT
- Updates a user by ID
- Used by the Update User page
- Must validate ID and payload

DELETE
- Deletes a user by ID
- Used by the Delete User page
- Must confirm user existence

---

## API Design Guidelines

- JSON responses only
- Use correct HTTP status codes
- Validate all inputs
- Handle errors gracefully
- Never expose raw database errors

Example response shape:

{
  "success": true,
  "data": null,
  "error": null
}

---

## Pages and Behavior

### Read Users Page
- Fetch users via GET /api/users
- Display results in a shadcn/ui table
- No mutations allowed

### Create User Page
- Client-side form
- Fields: name, email
- Submits via POST /api/users
- Show success or error feedback

### Update User Page
- Client-side form
- Accepts or selects a user ID
- Pre-fills user data if available
- Submits via PUT /api/users/[id]
- Handle invalid IDs gracefully

### Delete User Page
- Client-side form
- Explicit confirmation required
- Destructive shadcn/ui button
- Submits via DELETE /api/users/[id]
- Show success or error feedback

---

## UI and UX Rules

- Use shadcn/ui components exclusively
- Tailwind utility classes only
- Destructive actions must be clearly styled
- Icons should improve clarity, not add noise

---

## Type Safety

- Avoid any
- Prefer types inferred from Drizzle schemas
- Share reusable types where appropriate

---

## What Not To Do

- No Server Actions
- No direct database access in components
- No Supabase client usage in UI
- No raw SQL
- No business logic in pages

---

## Goal

Build a clean, backend-driven CRUD application that:
- Follows App Router best practices
- Uses REST-style API routes
- Keeps UI and data layers separated
- Is production-ready and easy to extend