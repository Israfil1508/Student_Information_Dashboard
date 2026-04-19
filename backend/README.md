<!-- Initial Comment: Student Information Dashboard repository file. -->
# Backend - Student Information API

Node.js + Express + TypeScript REST API for the Access to Education dashboard.

## Live URL

- API: `ADD_API_URL_AFTER_DEPLOY`

## Run Locally

```bash
cp .env.example .env
docker run --name scholarship-mongo -p 27017:27017 -d mongo:7
npm install
npm run seed
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Tests

```bash
npm test
```

Current automated coverage includes:

- Unit tests for Zod validation rules (credits bounds, GPA-history consistency, empty updates, scholarship date constraints)
- Integration tests for API correctness (`/api/health`, student creation + retrieval, invalid payload rejection, enrollment transition rules)

## Environment Variables

Backend configuration environment variables:

| Variable | Required | Default | Example | Purpose |
| --- | --- | --- | --- | --- |
| `PORT` | No | `4000` | `4000` | API listen port. Most hosting platforms provide this automatically. |
| `CORS_ORIGIN` | Yes (for deployment) | `http://localhost:5173` | `https://your-frontend-domain.com` | Allowed CORS origins. Provide comma-separated values for multiple frontend domains. |
| `MONGODB_URL` | No | `mongodb+srv://israfil:1508@cluster0.mi7tvyl.mongodb.net/scholarship_management?retryWrites=true&w=majority&appName=Cluster0` | `mongodb+srv://israfil:1508@cluster0.mi7tvyl.mongodb.net/scholarship_management?retryWrites=true&w=majority&appName=Cluster0` | MongoDB connection string. |
| `MONGODB_DB_NAME` | No | `scholarship_management` | `scholarship_management_prod` | MongoDB database name. |
| `MONGODB_COLLECTION` | No | `app_state` | `app_state` | Collection used to store the app state document. |
| `MONGODB_SERVER_SELECTION_TIMEOUT_MS` | No | `10000` | `12000` | MongoDB server selection timeout in milliseconds before fallback/error. |

Notes:

- Keep `CORS_ORIGIN` aligned with the exact frontend origin (protocol + domain + port if used).
- Ensure the MongoDB user has read/write permissions for the configured database.
- If your environment blocks DNS SRV lookups, Atlas `mongodb+srv://` URIs can fail with `querySrv` errors. In that case, use Atlas standard `mongodb://` URI format or allow SRV DNS resolution on your network.
- No additional backend-specific env vars are required by application code.

### backend/.env.example

```env
PORT=4000
CORS_ORIGIN=http://localhost:5176
MONGODB_URL=mongodb+srv://israfil:1508@cluster0.mi7tvyl.mongodb.net/scholarship_management?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=scholarship_management
MONGODB_COLLECTION=app_state
```

## Data Model Coverage

- Students (profile, demographics, academics, enrollment history)
- Scholarships (status tracking and timestamped history)
- Mentors (capacity and assignment)
- Meetings (full CRUD and timestamped logs)
- Audit logs (cross-entity timestamped actions)

Detailed model fields and relationships: see DATA_MODEL.md.

## Main Endpoints

- `GET /api/health`
- `GET /api/dashboard/summary`
- `GET /api/students`
- `GET /api/students/:studentId`
- `POST /api/students`
- `PUT /api/students/:studentId`
- `GET/PUT /api/students/:studentId/mentor`
- `GET/POST /api/students/:studentId/scholarships`
- `PUT /api/scholarships/:scholarshipId`
- `GET/POST /api/students/:studentId/meetings`
- `PUT/DELETE /api/meetings/:meetingId`

## Validation and Rules

- GPA must be between 0.0 and 4.0
- Credits completed cannot exceed credits required
- Enrollment status transitions are validated
- Scholarship status transitions are validated
- Mentor assignment respects `maxMentees`
- `expectedGraduation` accepts date-only format (`YYYY-MM-DD`)
- Other date/time fields are validated and normalized to ISO timestamps

## Seed Data

`npm run seed` creates:

- 15 students
- 5 mentors
- 22 scholarships
- 30 meetings

## Technical Decisions

- AI-suggested: Express REST structure with Zod validation and standardized response envelopes.
- Manual override: strict transition rules for enrollment and scholarship statuses, plus mentor-capacity checks.

## One Improvement With More Time

- Move persistence from a single MongoDB document to normalized collections with indexes.
