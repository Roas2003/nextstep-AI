# Final Project Documentation — Next Step AI

## Project Overview
Next Step AI is a web-based career support platform built as a React single-page application. The implemented system focuses on helping authenticated users create and manage resumes, analyze their skills, and view AI-assisted job recommendations. The project uses Supabase for authentication and profile data persistence, and a Supabase Edge Function for job suggestion generation.

The application interface is primarily Arabic and right-to-left oriented, with protected routes for core user features.

## System Architecture
The implemented architecture follows a frontend-centric SPA model with managed backend services:

- **Frontend Layer**: React application (Vite build system) with route-based pages and reusable UI components.
- **Application Logic Layer**: Page-level business logic in React components and global authentication state via React Context (`AuthContext`).
- **Data/Service Layer**: Supabase JavaScript client handling authentication, profile table CRUD operations, and edge function invocation.
- **Backend Function Layer**: Supabase Edge Function (`suggest-jobs`) implemented in Deno for skill-based job recommendation responses.

Routing is defined in `src/app/routes.tsx`, where `/login` and `/register` are public, and `/`, `/resume`, `/skills`, `/jobs`, and `/dashboard` are wrapped by `ProtectedRoute`.

## Technology Stack
Implemented technologies include:

- **Core Framework**: React 18 + TypeScript
- **Build Tooling**: Vite
- **Routing**: `react-router`
- **Backend as a Service**: Supabase (`@supabase/supabase-js`)
- **Serverless Runtime**: Supabase Edge Functions (Deno)
- **UI Components**: Radix-based UI wrappers in `src/app/components/ui`
- **Styling**: Tailwind CSS + custom theme variables (`src/styles/theme.css`)
- **Typography**: Cairo font via Google Fonts (`src/styles/fonts.css`)
- **Notifications**: Sonner toast system
- **Animation**: Motion (`motion/react`)
- **PDF Export**: `html2canvas` + `jspdf`

## Functional Requirements
Based on implemented code, the system provides:

1. **User Registration**
   - Name, email, password, and confirm password inputs.
   - Client-side validation for name length, email format, password complexity, and password match.

2. **User Login and Logout**
   - Email/password sign-in via Supabase Auth.
   - Logout action from navigation user menu with confirmation dialog.

3. **Protected Access Control**
   - Redirect unauthenticated users to `/login` when trying to access protected routes.

4. **Resume Building and Editing**
   - Manage personal information, experiences, education, skills, and visual theme.
   - Add/remove/edit entries for experience and education.

5. **Resume Persistence**
   - Save resume data to Supabase `profile` table (insert or update by `user_id`).
   - Auto-save timer in resume builder when minimum data exists.
   - Manual save support including keyboard shortcut (`Ctrl/Cmd + S`).

6. **Resume PDF Export**
   - Generate and download PDF from rendered resume preview content.

7. **Skill Analysis View**
   - Load skills from local storage (`resume` key) and display categorized progress.
   - Display predefined career paths and required skill comparisons.
   - Display predefined recommended courses.

8. **AI-assisted Job Matching**
   - Fetch user skills from profile.
   - Invoke Supabase Edge Function `suggest-jobs`.
   - Normalize and display returned jobs with match percentage.
   - Apply search and filter controls.
   - Fallback recommendations when AI data is unavailable or skills are missing.

9. **Dashboard Insights**
   - Show summary cards (resumes, suggested jobs, skills, average match).
   - Show user skills and suggested jobs with match percentage.
   - Save selected job title to local storage and route to resume page for targeted enhancement.

10. **Global Error Handling**
    - Error boundary fallback UI with reload/home actions on unhandled rendering errors.

## Non-Functional Requirements
Observed non-functional characteristics in implementation:

- **Usability**: Arabic UI text and right-to-left presentation in layout; structured navigation for desktop/mobile.
- **Responsiveness**: Adaptive navigation and grid-based layouts for multiple viewport sizes.
- **Reliability**: Error boundary component and user-facing error toasts on operation failures.
- **Maintainability**: Separation of concerns across pages, shared components, context, and utility modules.
- **User Feedback Quality**: Loading skeletons and toast notifications for action outcomes.

## Database Design
No SQL migration files are present in the repository; the design below is inferred from active queries and payloads.

### Main Entity Used: `profile`
The frontend reads/writes profile records through Supabase table operations.

### Inferred Fields from Implementation
- `id` (selected in update flow)
- `user_id` (key used for record association)
- `name`
- `title`
- `email`
- `phone`
- `location`
- `summary`
- `skills` (stored as comma-separated string)
- `education` (stored as concatenated text entries joined by `, ` using the pattern: `degree institution year`)
- `experience` (stored as concatenated text entries joined by `, ` using the pattern: `title company period description`)
- `theme`

### Data Access Pattern
- Query by `user_id` using `.maybeSingle()`.
- If profile exists: update.
- If profile does not exist: insert.

## API Documentation
The project uses Supabase APIs and one custom edge function.

### Authentication API Usage
From `AuthContext.tsx`:
- `supabase.auth.signUp(...)`
- `supabase.auth.signInWithPassword(...)`
- `supabase.auth.getUser()`
- `supabase.auth.signOut()`

### Database API Usage
From pages such as `ResumeBuilder`, `Dashboard`, `JobMatching`:
- `supabase.from("profile").select(...)`
- `supabase.from("profile").update(...)`
- `supabase.from("profile").insert(...)`

### Edge Function API
- **Function Name**: `suggest-jobs`
- **Invocation**: `supabase.functions.invoke("suggest-jobs", { body: { skills } })`
- **Backend File**: `supabase/functions/suggest-jobs/index.ts`
- **Expected Input**: JSON object with `skills: string[]`
- **Response**: Array of job objects including title, company, location, salary, type, experience, matchPercentage, description, requirements, postedDate.

## Authentication & Authorization
Authentication is fully integrated through Supabase Auth and managed in a React context provider.

### Authentication Flow
1. Register user account with email/password and name metadata.
2. Login using email/password.
3. On app initialization, fetch current user session via `getUser()`.
4. Set `isAuthenticated` and `user` state accordingly.

### Authorization Flow
- Protected pages are wrapped in `ProtectedRoute`.
- If `isAuthenticated` is false, route redirects to `/login`.

No role-based access control model is implemented in the repository beyond authenticated/unauthenticated access state.

## System Workflows
### 1. Account Workflow
- User registers or logs in.
- Auth context stores active user identity.
- User accesses protected routes through validated session state.

### 2. Resume Workflow
- Resume page loads profile by `user_id`.
- User edits resume sections and skills.
- User saves resume to profile table.
- Optional auto-save executes periodically.
- User can export current resume preview to PDF.

### 3. Job Recommendation Workflow
- Job page loads profile skills.
- Skills sent to `suggest-jobs` edge function.
- Jobs normalized and sorted by match.
- User can filter/search displayed jobs.
- If function fails or no data, fallback jobs are shown.

### 4. Dashboard-to-Resume Optimization Workflow
- Dashboard suggests job titles based on skill keywords.
- Selected job title saved in local storage (`selectedJob`).
- ResumeBuilder reads this value and applies job-specific resume enhancement.

## Folder Structure
The following structure reflects the implemented project organization:

- `src/main.tsx` — React app entry point.
- `src/app/App.tsx` — Root app composition with `ErrorBoundary`, `AuthProvider`, router, and toaster.
- `src/app/routes.tsx` — Route definitions and protection mapping.
- `src/app/context/AuthContext.tsx` — Authentication state and auth actions.
- `src/app/pages/` — Main feature pages:
  - `Home.tsx`
  - `Login.tsx`
  - `Register.tsx`
  - `ResumeBuilder.tsx`
  - `SkillAnalysis.tsx`
  - `JobMatching.tsx`
  - `Dashboard.tsx`
- `src/app/components/` — Shared app components such as:
  - `Layout.tsx`
  - `Navigation.tsx`
  - `ProtectedRoute.tsx`
  - `ResumePreview.tsx`
  - `ErrorBoundary.tsx`
  - `ConfirmDialog.tsx`
  - `DashboardSkeleton.tsx`
- `src/app/components/ui/` — Reusable UI primitives.
- `src/app/lib/supabase.ts` — Supabase client initialization.
- `src/styles/` — global style imports, fonts, and theme tokens.
- `supabase/functions/suggest-jobs/` — Edge function implementation and function import map.
- `supabase/config.toml` — Supabase function runtime configuration.

## Deployment Guide
The repository contains the core pieces needed for frontend build and Supabase function deployment configuration.

### Frontend Build
1. Install dependencies.
2. Build using Vite (`npm run build`).

### Supabase Function Configuration
- `supabase/config.toml` defines function settings for `suggest-jobs`.
- `verify_jwt = true` is enabled for this function.

### Notes from Current Repository State
- No CI/CD workflow files are present for automated pipeline deployment in this repository.
- Supabase project linkage metadata exists under `supabase/.temp`.

## Installation Guide
### Prerequisites
- Node.js and npm

### Steps
1. Clone repository.
2. Navigate to project root.
3. Install packages:
   ```bash
   npm install
   ```
4. Run development server:
   ```bash
   npm run dev
   ```
5. Build production bundle:
   ```bash
   npm run build
   ```

## Security Model
Implemented security controls include:

- **Authenticated access enforcement** on protected routes.
- **Supabase-managed authentication** (registration, login, session retrieval, logout).
- **JWT verification enabled** for `suggest-jobs` edge function (`verify_jwt = true`).
- **CORS headers** configured in the edge function for request handling.
- **Input validation** on registration fields and resume email format checks at UI level.

Implementation notes directly visible in code:
- Supabase URL and publishable key are hardcoded in `src/app/lib/supabase.ts` rather than environment variables.
- SkillAnalysis and dashboard-to-resume flow use direct `localStorage` access.

## Performance Considerations
Current implementation includes:

- **Client-side loading states** using skeleton placeholders.
- **Route-level and component-level state management** to avoid unnecessary global complexity.
- **Filtered/sorted job lists on the client** after initial fetch.
- **Periodic resume auto-save** to reduce accidental data loss.
- **Single profile record strategy** per user for lightweight data fetch and update flow.

Potential technical constraints observed:
- Denormalized storage format for skills, education, and experience (comma-separated skills and flattened text strings in the profile table).
- Function and profile fetch flows depend on network round-trips and per-page loading.

## Future Improvements
Improvements grounded in current implementation gaps:

1. Move Supabase credentials to environment variables.
2. Introduce normalized database schema for experiences, education, and skills.
3. Add automated test suite (unit/integration/E2E), since no tests are currently configured.
4. Add lint and type-check scripts in project scripts for CI quality gates.
5. Replace direct localStorage access with the existing safe wrapper utility consistently.
6. Introduce robust server-side validation for profile payloads.
7. Add stronger deployment automation through CI/CD workflows.

## Conclusion
Next Step AI is an implemented, functional career-assistance web application that combines authenticated user workflows with resume management and AI-assisted job recommendation capabilities. The codebase demonstrates a clear separation between UI, application logic, and backend service usage through Supabase and an edge function.

The current system is suitable as a graduation project deliverable due to its complete user flow coverage (authentication, profile persistence, resume operations, recommendation workflows, and dashboard insights), while also presenting clear technical directions for production hardening and future academic/engineering extension.
