# Jiseti Application

A community reporting and civic engagement platform built with React, Vite, and Tailwind CSS.

### Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS, PostCSS
- **Testing:** Vitest, React Testing Library

---

### Getting Started

```bash
# Clone repository and navigate to Frontend
git clone https://github.com/aj-devworks/jiseeti_app.git
cd jiseeti_app/Frontend

# Install dependencies
npm install

# Start local server
npm run dev

# Run tests
npm test
```

---

### Project Structure

```text
src/
├── assets/        # Static media
├── components/    # Reusable UI (Navbar, BottomNav, ReportCard, StatusBadge)
├── context/       # State management (AuthContext)
├── api.js         # Backend API client
├── pages/         # Core views (HomeFeed, MapView, CreateRecord, etc.)
└── App.test.jsx   # Unit test suite
```

---

### Team Roles

- **Abdinasir (Auth & Profile):** `AuthContext`, `Login`, `Signup`, `Profile`
- **Sir Alex (Navigation & Core Logic):** `App`, `Navbar`, `BottomNav`, `ReportCard`, `StatusBadge`, `CreateRecord`, `RecordDetail`
- **Rehema (Feeds & Dashboards):** `HomeFeed`, `MapView`, `Alerts`, `AdminReview`, `Placeholder`
- **Brian (QA & Testing):** `App.test.jsx`, end-to-end testing, and UI validation
