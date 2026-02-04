# NASA Dashboard

Project: NASA Dashboard (Full-stack application)  
Dashboard allows users to select a date and view list of asteroids closest to Earth using NASA - NeoWs API.

---


## Tech Stack Used

Frontend - React (with TypeScript), Vite

Backend - Node.js, Fastify, OpenAPI 3 (Swagger), NASA NeoWs API (https://api.nasa.gov/)

Dev Tools - ESLint, Prettier

---


## App Navigation / Explanation 

### Frontend
- Date picker: Users can select a specific day
- Get Asteroids button: Fetches asteroid data from the backend
- Displays list asteroids of in a table
- Fields are Sorted by:
  - Size (avg)
  - Closeness to Earth (Miles)
  - Relative velocity (Miles per Hours)

### Backend
- Fastify server with structured routes
- Calls NASA NeoWs API and returns a normalized payload tailored for the UI.
- Provides a clean API for the frontend
- Includes OpenAPI 3 schema and Swagger UI

## API Documentation:
- Swagger UI Link: http://localhost:3001/docs 

---



## CodeBase 
- Clean Code with Readability, Maintainability, Extensibility
- Reusable components at Front-End
- Separate Backend routes for different responsibilites

--- 



## Bonus 

1) Implemented in-memory caching on the backend to reduce repeated NASA API calls
- Cache key: date
- TTL: 5 mins
- Purpose: Reduce repeated calls to NASA API and avoid hitting rate limits
</br>

2) Cache at Front-End
- TTL: 5mins
- - Purpose: Reduce repeated calls to NASA API

2) ESLint + Prettier configuration for both frontend and backend
- It helped for consistent formatting and basic code quality rules
</br>

3) Root-level scripts to run frontend and backend together
- Easy to run app
</br>

4) Basic request Validation and error handling
- Input Validation for date Picker
- Error responses for invalid input and external API failures

---


## Trade Offs

### Tech stack
1) Backend: Fastify VS Express
Fastify was a good fit because schema-first routes make Validation + OpenAPI/Swagger straightforward. Express would also work, but would require more manual wiring.
</br>

2) Frontend: React (no Next.js per requirement)  
Kept the UI lightweight and quick to iterate on using React + Vite + TypeScript.


### Data / logic decisions
1) Closest objects interpretation: NASA provides min/max estimated diameter. I display an average for simpler UI and sorting (min/max are still available in the API response if needed).
</br>

2) Size field: NASA provides min/max estimated diameter. I display an average for simpler UI and sorting.
</br>

3) Closeness + speed source: Used `close_approach_data[0].miss_distance.miles` and `relative_velocity.miles_per_hour` for consistent units in the UI.


### Backend trade-offs
1) Caching: Implemented simple in-memory caching (TTL 5 minS). This reduces repeated NASA calls and helps avoid rate limits, but resets on restart and won’t work across multiple server instances.
</br>

2) API shape: Kept a single endpoint (`/api/asteroids`) that returns a UI-friendly response instead of passing through the raw NASA payload.


### Frontend trade-offs
1) Minimal styling: Kept styling clean but basic to focus on core functionality under time constraints.
</br>

2) Manual fetch trigger: Used a “Get Asteroids” button rather than auto-fetching on every date change to avoid unnecessary API calls.


### Developer tooling
1) Lint/format setup: Added ESLint + Prettier for consistency, but didn’t add tests due to time limits.

### Build Scripts
1) Added Husky pre-commit hook to run linting before commits.

### If I had more time
- Add unit/integration tests (backend + frontend)
- Pagination for Huge List of Asteroids.
- Add persistent caching (Redis or file-based) + better rate-limit handling
- Improve UI and accessibility (keyboard sorting, better empty/error UI)


---



## Installations/ Project Setup

Step 0: Create a Root Folder, 
create 2 Folders for Client: frontend/ – React (TypeScript) and Server: backend/ – Fastify server

Step 1: Frontend Setup
- cd frontend
- Create React Vite Project using command: npm create vite@latest . -- --template react-ts
- Select TypeScript

- npm install dependencies using command: npm i
- Command to Run: npm run dev
- Run on - http://localhost:5173 

- Added ESLint and Prettier for code quality and formatting.

- Install Husky to enable pre-commit Git hooks for automatic linting before commits: npx husky init

Step 2: Backend Setup
- cd backend
- npm install dependencies using command: npm i
- Command to Run: npm run dev
- Run on - http://localhost:3001
- Swagger UI (OpenAPI docs) - http://localhost:3001/docs

- Added ESLint and Prettier for code quality and formatting.

- Installed Fastify to build the API server: npm install fastify
- Installed dotenv for environment configuration: npm install dotenv



### Root Setup
- npm install
- npm run dev

### Environment File
- Create .env file and add API key
- NASA_API_KEY=YOUR_NASA_API_KEY


---

## Screensort 

<img width="661" height="359" alt="image" src="https://github.com/user-attachments/assets/babeb2fe-4957-47ec-a630-79fc3c4c1bef" />


## Quick Start

```bash
git clone <repo>
cd aish-nasa-dashboard
npm install
npm run dev

Frontend: http://localhost:5173

Backend: http://localhost:3001

Swagger Docs: http://localhost:3001/docs

```
