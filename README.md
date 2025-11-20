## Task Pulse – Real-Time MERN Task Manager

Task Pulse is a full-stack task management system built with the MERN stack. It delivers secure authentication, rich task CRUD with assignment, filtering, and search, plus real-time updates so every connected user stays in sync.

### Key Features
- **Secure Auth**: Email registration + login basic not google OAuth.
- **Task Power Tools**: Create, edit, delete, search, paginate, sort, and filter tasks; assign work to teammates and manage tags, priority, status, and due dates.
- **Insightful Analytics**: Server-side totals for total/completed/in-progress/pending tasks rendered as dashboard cards.
- **Real-Time Sync**: Socket.IO broadcasts ensure task lists and statistics refresh instantly across all connected browsers.
- **Modern UI/UX**: React + Vite + TypeScript with Context state, protected routes, responsive layout, form validation, toasts, loading states, and delete confirmations.
- **Clean Architecture**: Modular Express controllers/middleware, centralized error handling, Mongo models with validation, and documented environment variables.

### Tech Stack
- **Backend**: Node.js, Express 5, MongoDB/Mongoose, JWT,  express-validator, Socket.IO, dotenv, cors.
- **Frontend**: Vite (React + TypeScript), React Router v7, Context API + hooks, Axios, Socket.IO client.

### Project Structure
```
task-pulse/
├── server/                # Node/Express API
│   ├── src/
│   │   ├── config/        # Mongo connection
│   │   ├── controllers/   # Auth, task, user logic
│   │   ├── middleware/    # auth, validation, errors
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # REST endpoints
│   │   └── utils/         # helpers (token issuer)
│   ├── env.sample         # Backend env template
│   └── package.json
├── client/                # React SPA
│   ├── src/
│   │   ├── api/           # Axios + socket helpers
│   │   ├── components/    # UI building blocks
│   │   ├── context/       # Auth + task providers
│   │   ├── hooks/         # `useAuth`, `useTasks`
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── routes/        # ProtectedRoute
│   │   └── types/         # Shared TS models
│   ├── env.sample         # Frontend env template
│   └── package.json
└── README.md
```

### Getting Started
#### 1. Prerequisites
- Node.js 18+
- npm 9+
- MongoDB instance (local or hosted)

#### 2. Clone & Install
```bash
git clone <repo-url>
cd task-pulse

# Backend deps
cd server
npm install

# Frontend deps
cd ../client
npm install
```

#### 3. Environment Variables
Create files from the provided templates:

```
# Backend
cp server/env.sample server/.env

# Frontend
cp client/env.sample client/.env
```

Set the values:
- `server/.env`
  - `PORT` – API port (default 5000)
  - `MONGO_URI` – MongoDB connection string
  - `JWT_SECRET` / `JWT_EXPIRES_IN`
  - `CLIENT_URL` – comma-separated allowed origins (e.g., `http://localhost:5173`)
- `client/.env`
  - `VITE_API_URL` – usually `http://localhost:5000/api`
  - `VITE_SOCKET_URL` – usually `http://localhost:5000`

#### 4. Run the Stack
In two terminals:
```bash
# API
cd server
npm run dev

# Web client
cd client
npm run dev
```
Visit `http://localhost:5173` and create an account to start using the app. The client automatically attaches JWT tokens to API calls once you log in.


### API Overview
| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| POST   | `/api/auth/register`| Create a new user                    |
| POST   | `/api/auth/login`   | Authenticate and receive JWT         |
| GET    | `/api/auth/me`      | Current user profile (protected)     |
| GET    | `/api/users`        | List all users for assignment        |
| GET    | `/api/tasks`        | Paginated tasks with filters/search  |
| GET    | `/api/tasks/:id`    | Single task (creator/assignee only)  |
| POST   | `/api/tasks`        | Create task (authenticated)          |
| PUT    | `/api/tasks/:id`    | Update task (creator only)           |
| DELETE | `/api/tasks/:id`    | Delete task (creator only)           |
| GET    | `/api/tasks/stats`  | Totals for total/completed/pending/in-progress |

All task endpoints accept query params for pagination (`page`, `limit`), sorting (`sortBy`, `sortOrder`), status/priority filters, assignee filtering, and keyword search (title/description).

### Frontend Highlights
- **Authentication Pages**: Form validation, inline errors, and automatic redirect when already signed in.
- **Protected Routing**: `ProtectedRoute` gate keeps the dashboard until `/api/auth/me` resolves.
- **Dashboard**:
  - KPI cards for total/completed/in-progress/pending.
  - Task creation + inline edit form with assignment, tags, priority, due date.
  - Filter/search card and delete confirmation modal.
  - Toast feedback, loading skeletons, and responsive grid layout.
- **State Management**:
  - `AuthContext` stores user/token, bootstraps session via `/auth/me`, and exposes login/register/logout helpers.
  - `TaskContext` centralizes filters, task list, pagination meta, stats, user directory, and handles socket-driven refreshes.

### Real-Time Updates
Each create/update/delete operation emits a `tasks:update` through Socket.IO. Clients stay connected via `TaskContext`, automatically refreshing list + stats whenever events arrive. No manual refresh is required for collaborators to see changes.
