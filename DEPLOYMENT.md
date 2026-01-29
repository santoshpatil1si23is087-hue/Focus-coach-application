# 🚀 Deployment Guide: Focus Coach App

Since this is a **Full-Stack App** (Frontend + Backend), we need to deploy it in two parts.

> **Why?**
> - **Vercel** is amazing for the Frontend (React).
> - **Render** is great for the Backend (Node.js) because it keeps the server running.

---

##  PART 1: Deploy Backend (Render)
**Goal**: Get your Node.js server running online so it has a URL like `https://focus-api.onrender.com`.

1.  **Register**: Go to [render.com](https://render.com) and Sign Up (GitHub login recommended).
2.  **New Web Service**:
    - Click **"New +"** -> **"Web Service"**.
    - Connect your GitHub repository (`Focus-coach-application`).
3.  **Configure**:
    - **Name**: `focus-coach-api` (or similar)
    - **Root Directory**: `server` (Important! This tells Render the backend is in the server subfolder).
    - **Build Command**: `npm install`
    - **Start Command**: `node index.js`
    - **Free Tier**: Select "Free".
4.  **Create**: Click "Create Web Service".
    - Wait for it to deploy (might take 2-3 mins).
    - **COPY THE URL** it gives you (e.g., `https://focus-coach-api.onrender.com`). You need this for Part 2.

> **⚠️ Important Note**: On the free tier, the "Local JSON Database" (database.json) will **RESET** every time the server restarts (about every 15 mins of inactivity). For a viva demo, this is fine, but mention it to your examiner!

---

## PART 2: Deploy Frontend (Vercel)
**Goal**: Get your React app running on a URL like `https://focus-coach.vercel.app`.

1.  **Register**: Go to [vercel.com](https://vercel.com) and Sign Up.
2.  **New Project**:
    - Click **"Add New..."** -> **"Project"**.
    - Import your GitHub repository.
3.  **Configure**:
    - **Framework Preset**: Vite (should detect auto).
    - **Root Directory**: Click "Edit" and select `client`.
    - **Environment Variables** (CRITICAL):
        - Click to add a variable:
        - Name: `VITE_API_URL`
        - Value: `[PASTE_YOUR_RENDER_URL_HERE]/api`
        - *Example Value*: `https://focus-coach-api.onrender.com/api`
4.  **Deploy**: Click "Deploy".
    - Wait about 1 minute.
    - You will get a live URL!

---

## 🎉 Done!
Open your Vercel URL. It should load the app and connect to your Render backend automatically.
