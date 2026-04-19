<!-- Initial Comment: Student Information Dashboard repository file. -->
# Frontend - Student Information Dashboard

React + TypeScript + Vite frontend for Access to Education.

## Live URL

- Frontend: `ADD_FRONTEND_URL_AFTER_DEPLOY`

## Run Locally

```bash
cp .env.example .env
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

All frontend runtime environment variables:

| Variable | Required | Default | Example | Purpose |
| --- | --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes (for deployment) | `http://localhost:4000` | `https://api.your-domain.com` | Base URL used for all frontend API requests. |

Notes:

- Use full URL including protocol (`http://` or `https://`).
- Do not add trailing slash.
- `VITE_*` variables are embedded into the built frontend bundle by Vite.

### frontend/.env.example

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Module Mapping

- Module 01: Student directory with search + filters
- Module 02: Student profile dashboard with GPA chart, current courses, and credit completion
- Module 03: Scholarship management (list, add, update status)
- Module 04: Mentorship and meetings (mentor assignment, schedule, searchable history)

## Layered Structure

- `src/api/`: API call layer (`client.ts`, `student.api.ts`, `scholarship.api.ts`, `mentor.api.ts`, `meeting.api.ts`)
- `src/components/common/`: reusable UI pieces (`Button.tsx`, `Input.tsx`, `Loader.tsx`)
- `src/components/student/`: student-focused reusable components (`StudentCard.tsx`, `StudentList.tsx`)
- `src/pages/`: page-level route files (`StudentDirectory.tsx`, `StudentProfile.tsx`, `ScholarshipPage.tsx`, `MentorshipPage.tsx`)
- `src/services/`: business logic wrappers (`student.service.ts`, `scholarship.service.ts`, `mentor.service.ts`, `meeting.service.ts`)
- `src/hooks/`: custom hooks (`useStudents.ts`, `useStudent.ts`, `useMeetings.ts`)
- `src/types/`: TypeScript interfaces (`student.types.ts`, `scholarship.types.ts`, `mentor.types.ts`, `meeting.types.ts`)
- `src/utils/`: helpers (`formatDate.ts`, plus shared utility helpers used by exports/forms)
- `src/routes/`: routing config (`AppRoutes.tsx`)
- `src/App.tsx`, `src/main.tsx`: app entry composition

The dashboard UI is split into additional internal modules under `src/pages/dashboard/` to keep the page maintainable.

## UX Features

- Loading and API error states across all panels
- Success and failure feedback for write actions
- Keyboard-friendly controls with semantic labels
- Responsive layout for desktop and mobile

## Technical Decisions

- AI-suggested: tabbed workspace layout and charting with Recharts.
- Manual override: custom CSS visual direction, module separation, and accessibility-first form controls.

## One Improvement With More Time

- Add route-level code splitting to reduce production bundle size.
