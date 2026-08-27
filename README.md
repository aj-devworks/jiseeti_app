# Jiseeti

A civic issue reporting and community engagement platform. Citizens submit reports (hazards or intervention requests), upvote them, and track resolution status. Government officials moderate reports and post public alerts.

**Repo layout:** `Frontend/` (React + Vite) and `jiseeti_backend/` (Flask + PostgreSQL API) live side by side in this repo.

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React, Vite, Tailwind CSS, PostCSS |
| Backend | Flask 3, PostgreSQL, SQLAlchemy, Flask-Migrate, JWT auth, Bcrypt |
| Testing | Vitest + React Testing Library (frontend), pytest (backend) |

---

## Getting Started

Run both servers in separate terminals.

**Backend** (`jiseeti_backend/`):
```bash
cd jiseeti_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# create a Postgres user + databases, then set DATABASE_URL in .env
export FLASK_APP=run.py
flask db upgrade
flask run
```

**Frontend** (`Frontend/`):
```bash
cd Frontend
npm install
npm run dev
```

The frontend talks to the backend at `http://127.0.0.1:5000` by default (see `Frontend/src/api.js`).

---

## Project Structure

```text
jiseeti_app/
├── Frontend/
│   └── src/
│       ├── assets/        # Static media
│       ├── components/    # Reusable UI (Navbar, BottomNav, ReportCard, StatusBadge)
│       ├── context/       # AuthContext
│       ├── pages/         # HomeFeed, MapView, CreateRecord, Alerts, AdminReview, etc.
│       └── api.js         # Backend API client
│
└── jiseeti_backend/
    └── app/
        ├── models/         # User, Report, Upvote, Alert
        ├── routes/         # auth, reports, alerts, admin blueprints
        ├── utils/          # role_required decorator, photo upload helper
        ├── config.py
        └── extensions.py
```

---

## Backend

### Auth

JWT bearer tokens. Signup/login return a token; send it as `Authorization: Bearer <token>` on protected routes. Roles: `citizen` and `official`.

### API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | — | Create account (`full_name`, `email`, `password`, `role`) |
| POST | `/auth/login` | — | Get a token |
| GET | `/reports` | — | List reports, optional `?status=pending\|in-progress\|resolved` |
| GET | `/reports/:id` | — | Single report |
| POST | `/reports` | citizen | Create report (JSON or multipart with `photo`) |
| PATCH | `/reports/:id` | owner | Edit own report (pending only) |
| DELETE | `/reports/:id` | owner | Delete own report |
| POST | `/reports/:id/upvote` | any user | Toggle upvote |
| GET | `/alerts` | — | List municipal alerts |
| POST | `/alerts` | official | Create an alert |
| GET | `/admin/stats` | official | Pending/in-progress/resolved counts |
| PATCH | `/admin/reports/:id/status` | official | Change a report's status |
| GET | `/uploads/:filename` | — | Serve an uploaded photo |

### Data Model

- **User**: `full_name`, `email`, `password_hash`, `role`
- **Report**: `category` (`red-flag`/`intervention`), `title`, `description`, `location`, `photo_url`, `status`, `user_id`
- **Upvote**: unique per (`report_id`, `user_id`)
- **Alert**: `title`, `message`

### Environment Variables (`jiseeti_backend/.env`)

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Flask secret |
| `JWT_SECRET_KEY` | JWT signing key |
| `DATABASE_URL` | Postgres connection string |
| `TEST_DATABASE_URL` | Postgres connection string for tests |

### Backend Testing

```bash
pip install pytest
export TEST_DATABASE_URL="sqlite:///:memory:"
export FLASK_ENV=testing
python3 -m pytest tests/ -v
```

Covers auth, report CRUD, upvote toggling, ownership/role permission checks, admin status changes, and alerts (17 tests).

### Backend Notes

- Reports can only be edited by their creator, and only while `status = pending`.
- Status changes and alert creation are restricted to `role = official` via the `role_required` decorator.

---

## Frontend Testing

```bash
cd Frontend
npm test
```

---

## Team Roles

- **Abdinasir** — Backend (auth, models, routes, migrations) + Frontend Auth & Profile (`AuthContext`, `Login`, `Signup`, `Profile`)
- **Sir Alex** — Navigation & Core Logic (`App`, `Navbar`, `BottomNav`, `ReportCard`, `StatusBadge`, `CreateRecord`, `RecordDetail`)
- **Rehema** — Feeds & Dashboards (`HomeFeed`, `MapView`, `Alerts`, `AdminReview`)
- **Brian** — QA & Testing (frontend + backend test suites, end-to-end validation)
