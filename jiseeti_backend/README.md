# Jiseeti Backend

Flask + PostgreSQL API powering the Jiseeti civic issue reporting app. Citizens submit reports (red-flag hazards or intervention requests), upvote them, and track status. Government officials moderate reports and post public alerts.

## Tech Stack

- Flask 3 (app factory pattern)
- PostgreSQL + SQLAlchemy + Flask-Migrate
- Flask-JWT-Extended (auth)
- Flask-Bcrypt (password hashing)
- Flask-CORS

## Project Structure

```
jiseeti_backend/
├── app/
│   ├── models/        # User, Report, Upvote, Alert
│   ├── routes/         # auth, reports, alerts, admin blueprints
│   ├── utils/          # role_required decorator, photo upload helper
│   ├── config.py
│   └── extensions.py
├── migrations/
├── run.py              # dev entrypoint
├── wsgi.py              # production entrypoint
└── requirements.txt
```

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# create a Postgres user + databases, then set DATABASE_URL in .env
export FLASK_APP=run.py
flask db upgrade

flask run
```

## Environment Variables (`.env`)

| Variable            | Purpose                              |
| ------------------- | ------------------------------------ |
| `SECRET_KEY`        | Flask secret                         |
| `JWT_SECRET_KEY`    | JWT signing key                      |
| `DATABASE_URL`      | Postgres connection string           |
| `TEST_DATABASE_URL` | Postgres connection string for tests |

## Auth

JWT bearer tokens. Signup/login return a token; send it as `Authorization: Bearer <token>` on protected routes. Roles: `citizen` and `official`.

## API Routes

| Method | Route                       | Auth     | Description                                                     |
| ------ | --------------------------- | -------- | --------------------------------------------------------------- |
| POST   | `/auth/signup`              | —        | Create account (`full_name`, `email`, `password`, `role`)       |
| POST   | `/auth/login`               | —        | Get a token                                                     |
| GET    | `/reports`                  | —        | List reports, optional `?status=pending\|in-progress\|resolved` |
| GET    | `/reports/:id`              | —        | Single report                                                   |
| POST   | `/reports`                  | citizen  | Create report (JSON or multipart with `photo`)                  |
| PATCH  | `/reports/:id`              | owner    | Edit own report (pending only)                                  |
| DELETE | `/reports/:id`              | owner    | Delete own report                                               |
| POST   | `/reports/:id/upvote`       | any user | Toggle upvote                                                   |
| GET    | `/alerts`                   | —        | List municipal alerts                                           |
| POST   | `/alerts`                   | official | Create an alert                                                 |
| GET    | `/admin/stats`              | official | Pending/in-progress/resolved counts                             |
| PATCH  | `/admin/reports/:id/status` | official | Change a report's status                                        |
| GET    | `/uploads/:filename`        | —        | Serve an uploaded photo                                         |

## Data Model

- **User**: `full_name`, `email`, `password_hash`, `role`
- **Report**: `category` (`red-flag`/`intervention`), `title`, `description`, `location`, `photo_url`, `status`, `user_id`
- **Upvote**: unique per (`report_id`, `user_id`)
- **Alert**: `title`, `message`

## Testing

```bash
pip install pytest
export TEST_DATABASE_URL="sqlite:///:memory:"
export FLASK_ENV=testing
python3 -m pytest tests/ -v
```

Covers auth, report CRUD, upvote toggling, ownership/role permission checks, admin status changes, and alerts (17 tests).

## Notes

- Reports can only be edited by their creator, and only while `status = pending`.
- Status changes and alert creation are restricted to `role = official` via the `role_required` decorator.
