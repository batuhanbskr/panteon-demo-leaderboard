# 🏆  Demo Leaderboard System

A high-performance, stateless leaderboard and weekly reward distribution system designed to handle high concurrency (conceptually scaling to 2M+ DAU). Built completely with TypeScript across the stack.

## 🚀 Live Demo
- **Frontend (Vercel):** https://panteon-demo-leaderboard.vercel.app/
- **Backend API (Render):** https://panteon-backend.onrender.com/api

*(Note: The backend is deployed on a free Render instance, so the initial request might take ~50 seconds to spin up if the server has been idle.)*

## 🏗️ Architecture & Tech Stack

The project is structured as a monorepo containing two fully isolated environments to strictly separate client and server concerns.

**Backend (`/panteon-server`)**
- **Node.js & Express:** Lightweight and fast RESTful API.
- **TypeScript:** For strict type safety and better developer experience.
- **Redis (Upstash):** Core engine for the leaderboard. Uses `ZSET` (Sorted Sets) for $O(\log N)$ time complexity insertions and rankings, making the leaderboard instantly accessible regardless of player count.
- **PostgreSQL (Neon.tech):** Persistent storage for user data and wallet balances.
- **Node-Cron:** Automated weekly task runner for prize pool distribution and system resets.

**Frontend (`/panteon-client`)**
- **React (Vite) & TypeScript:** Fast, modern UI development.
- **Tailwind CSS:** Utility-first styling for a sleek, gamified interface.
- **Lucide React:** Iconography.

## ✨ Key Features

1. **Instant Top 100:** Fetches the top 100 players from Redis in milliseconds.
2. **Dynamic Prize Pool:** Accumulates 2% of all earned points into a weekly prize pool.
3. **Smart Reward Distribution:** Automatically distributes the pool (20% to 1st, 15% to 2nd, 10% to 3rd, and 55% distributed to ranks 4-100) via a weekly Cron Job.
4. **Sticky Player Bar:** If a user is not in the Top 100, a sticky bar appears at the bottom displaying their exact rank, along with the 3 players above and 2 players below them using Redis `ZREVRANK` and `ZRANGE`.

## 🤖 AI Workflow
As an AI-Native development process, various AI tools were utilized for architectural brainstorming, boilerplate generation, and debugging. Please refer to the `AI_WORKFLOW.md` file in the root directory for a detailed breakdown of the AI integration methodology.

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Local or Cloud PostgreSQL Database
- Local or Cloud Redis instance

### 1. Backend Setup
```bash
cd panteon-server
npm install
Create a .env file in the panteon-server directory:

PORT=5000
DATABASE_URL=your_postgresql_connection_string
REDIS_URL=your_redis_connection_string
Run the server:

Bash
npm run dev
(Optional): You can populate the database and Redis with 10,000 mock users by sending a POST request to http://localhost:5000/api/leaderboard/seed.

2. Frontend Setup
Open a new terminal window:

Bash
cd panteon-client
npm install
Create a .env file in the panteon-client directory:

VITE_API_URL=http://localhost:5000/api
Run the client:

Bash
npm run dev
