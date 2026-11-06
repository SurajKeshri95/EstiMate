# EstiMate

**Cost and resource estimation for software projects.**

EstiMate helps project managers, finance teams and business analysts turn a feature list into a defensible estimate: effort in hours, calendar duration, team staffing over time, and a client price with margin. It is built for startups and larger companies that need numbers they can explain.

## Features

- **Sizing by function points.** Describe the project as inputs, outputs, inquiries, files and interfaces, each with a complexity and a count.
- **Effort multipliers.** Adjust reliability, reuse, platform difficulty, team experience, tooling, process maturity and more with simple sliders.
- **Confidence ranges.** Effort and cost are shown as P50, P80 and P95 values instead of a single number.
- **Staffing curve.** A Rayleigh style curve shows how headcount ramps up, peaks and tapers, by role (backend, frontend, QA, DevOps, design, project management).
- **Phase breakdown.** See where the effort goes across requirements, design, implementation, testing and deployment.
- **Pricing.** Cost per person month in INR, management reserve and target margin roll up into a client price.
- **Input quality indicator.** Shows how wide the estimate range is based on how much detail you provided.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| State and data | Zustand, React Query, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 15 with Prisma |
| Cache and queue | Redis 7, Bull |
| Security | Helmet, CORS, JWT, bcryptjs |
| Infrastructure | Docker and Docker Compose |

## Project structure

```
EstiMate/
├── backend/
│   └── src/
│       ├── routes/
│       ├── services/
│       └── index.ts
├── frontend/
│   └── src/
│       ├── components/     EstimationForm, ResultsPanel
│       ├── pages/          EstimatePage
│       ├── services/       api.ts
│       ├── store/          estimationStore.ts
│       ├── App.tsx
│       └── main.tsx
├── docker-compose.yml      PostgreSQL and Redis
└── README.md
```

## Getting started

### Prerequisites

- Node.js (LTS) and npm
- Docker Desktop (on Windows this needs WSL 2)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/SurajKeshri95/EstiMate.git
cd EstiMate
```

### 2. Start PostgreSQL and Redis

```bash
docker-compose up -d
docker ps
```

You should see the `estimation_db` and `estimation_redis` containers running.

### 3. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/estimation_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=change_this_before_deploying
JWT_EXPIRY=24h
```

Start the server:

```bash
npm run dev:watch
```

Check it works by opening http://localhost:3001/health. It should return a JSON status message.

### 4. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3001
```

Start the app:

```bash
npm run dev
```

Open http://localhost:5173.

## Scripts

**Backend**

| Command | What it does |
|---|---|
| `npm run dev` | Run the server once with ts-node |
| `npm run dev:watch` | Run with auto restart on changes |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |

**Frontend**

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint the source |

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| 1 | Foundation and setup | Complete |
| 2 | Core estimation engine | In progress |
| 3 | Resource allocation and scheduling | Planned |
| 4 | Reporting and analytics (PDF reports) | Planned |
| 5 | Authentication and multi tenancy | Planned |
| 6 | Testing and optimization (Jest, Playwright) | Planned |
| 7 | Deployment (GitHub Actions, AWS or GCP) | Planned |

## Troubleshooting

**Port already in use.** Find and stop the process, or change the port.

```powershell
netstat -ano | findstr :3001
taskkill /PID <process_id> /F
```

For the frontend, run `npm run dev -- --port 5174`.

**Cannot connect to the database.** Make sure Docker Desktop is running, then restart the containers.

```bash
docker-compose down
docker-compose up -d
```

**Frontend cannot reach the backend.** Check that `frontend/.env` contains `VITE_API_URL=http://localhost:3001` and restart `npm run dev` after editing it.

## Security notes

- Never commit `.env` files. They are listed in `.gitignore`.
- The database credentials in `docker-compose.yml` and the sample `.env` are for local development only. Use strong, unique values and a new `JWT_SECRET` before deploying.

## Author

**Suraj Keshri**
GitHub: [@SurajKeshri95](https://github.com/SurajKeshri95)
