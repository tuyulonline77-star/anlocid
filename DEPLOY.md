# AutoBlog Pro Deployment Guide

## 1. Prerequisites
- Node.js & npm
- Cloudflare Account
- Wrangler CLI (`npm install -g wrangler`)

## 2. Local Development (Frontend)
The frontend uses a Mock DB (localStorage) by default for instant preview.
1. Run `npm install` (react, react-dom, react-router-dom, etc.)
2. Run `npm start` (or your bundler command)

## 3. Deploy Frontend (Cloudflare Pages)
1. Initialize a Git repository.
2. Push code to GitHub.
3. Log in to Cloudflare Dashboard > Pages.
4. "Connect to Git" -> Select repo.
5. Build Settings:
   - Framework: Create React App (or generic)
   - Build Command: `npm run build`
   - Output Directory: `build` (or `dist`)
6. Deploy.

## 4. Setup Backend (Cloudflare Workers + D1)
1. Create a D1 Database:
   ```bash
   wrangler d1 create autoblog-db
   ```
2. Apply Schema:
   ```bash
   wrangler d1 execute autoblog-db --file=backend/schema.sql
   ```
3. Deploy Worker (`backend/worker.ts`):
   - You need to set up a `wrangler.toml` for the worker.
   - Copy content of `backend/worker.ts` to your worker's `src/index.ts`.
   - Bind D1 database in `wrangler.toml`:
     ```toml
     [[d1_databases]]
     binding = "DB"
     database_name = "autoblog-db"
     database_id = "<UUID_FROM_STEP_1>"
     ```
   - Run `wrangler deploy`.

## 5. Connect Frontend to Real Backend
1. Open `constants.ts`.
2. Set `IS_DEMO_MODE = false`.
3. Set `API_BASE` to your deployed Worker URL (e.g., `https://api.your-project.workers.dev`).
4. Redeploy Frontend.
