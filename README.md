# Distraction Detection & Focus Coaching App .v2 🧠 

[![API Status](https://img.shields.io/badge/API-Online-green)](https://lockin-befocused.onrender.com) 
[![Frontend Status](https://img.shields.io/badge/Frontend-Deployed-blue)](https://vercel.com)

**Live Demo:** [Click Here to View App](https://vercel.com/dashboard) *(Replace with your specific Vercel URL)*

A full-stack AI Vision app that combines **Distraction Detection** with proper **Pomodoro Techniques**.
**NEW**: Now features "Antigravity" Design, Smart Pause, and Analytics.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd server
npm install
node index.js
```

### 2. Start the Frontend
```bash
cd client
npm install
npm run dev
```

---

## ⏱️ New Feature: Pomodoro & Vision Control

### 1. Pomodoro Timer
Select your mode before starting:
- **Stopwatch**: Standard open-ended session.
- **25 Min / 45 Min / 60 Min**: Preset focus blocks.
- **Custom**: Enter any duration (e.g., 50 mins).

### 2. Smart Pause AI 🧠
If enabled, the timer **Automatically Pauses** when you look away.
- *Why?* This enforces "Purified Focus". If you aren't looking at the screen, the time doesn't count.
- *Behavior*: A red "⚠ TIMER PAUSED" warning appears until you refocus.

### 3. Focus Analytics 📊
We now track your **"Best Focus Hour"** in the dashboard.
- It analyzes your past sessions to tell you when you are most productive (e.g., "10:00 - 10:59").

### 4. Privacy First 🔒
We have added a **Privacy Badge** to certify that all AI processing happens **Locally on your Browser**. 
- No video is ever sent to the server.
- Only statistical metadata (score/duration) is saved.

## 🏗 Stack & Architecture
- **Frontend**: React + Vite + face-api.js
- **Backend**: Node.js + Express + Local JSON DB
- **Design**: "Antigravity" Theme (Monochrome Glassmorphism)

## 📁 Project Structure
```
FOCUS COACHING APP/
├── client/
│   ├── src/components/
│   │   ├── PomodoroControls.jsx  # [NEW] Timer UI
│   │   ├── PrivacyBadge.jsx      # [NEW] Privacy UI
│   │   └── FocusCoach.jsx        # AI Vision Logic
│   ├── src/App.jsx               # Main Logic (Timer + AI)
├── server/
│   ├── rewards.json              # Gamification Data
│   └── database.json             # Analytics Data
```
