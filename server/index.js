const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Database File if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ sessions: [] }, null, 2));
}

// Helper to read DB
const readDb = () => {
    try {
        const data = fs.readFileSync(DB_FILE);
        return JSON.parse(data);
    } catch (err) {
        return { sessions: [] };
    }
};

// Helper to write DB
const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Routes
app.get('/', (req, res) => {
    res.send('Focus Coaching Backend is Running 🚀');
});

// GET all sessions
app.get('/api/sessions', (req, res) => {
    const db = readDb();
    res.json(db.sessions);
});

// POST new session
app.post('/api/sessions', (req, res) => {
    const { duration, distractionCount, focusScore, timestamp } = req.body;

    if (!duration) {
        return res.status(400).json({ error: 'Missing session data' });
    }

    const db = readDb();
    const newSession = {
        id: Date.now(),
        duration, // in seconds
        distractionCount,
        focusScore, // 0-100
        timestamp: timestamp || new Date().toISOString()
    };

    db.sessions.push(newSession);
    writeDb(db);

    res.status(201).json({ message: 'Session saved', session: newSession });
});

const REWARDS_FILE = path.join(__dirname, 'rewards.json');

// Initialize Rewards File if not exists
if (!fs.existsSync(REWARDS_FILE)) {
    const initialRewards = {
        totalPoints: 0,
        currentStreak: 0,
        bestStreak: 0,
        level: "Beginner",
        history: []
    };
    fs.writeFileSync(REWARDS_FILE, JSON.stringify(initialRewards, null, 2));
}

const readRewards = () => {
    try {
        const data = fs.readFileSync(REWARDS_FILE);
        return JSON.parse(data);
    } catch (err) {
        return { totalPoints: 0, currentStreak: 0, bestStreak: 0, level: "Beginner" };
    }
};

const writeRewards = (data) => {
    fs.writeFileSync(REWARDS_FILE, JSON.stringify(data, null, 2));
};

// ... (Existing Routes) ...

// GET Rewards
app.get('/api/rewards', (req, res) => {
    const data = readRewards();
    res.json(data);
});

// UPDATE Rewards (After a session)
app.post('/api/rewards/update', (req, res) => {
    const { pointsUrl, sessionDuration, isGoodSession } = req.body;
    // isGoodSession = true if they met a goal (e.g. > 10 mins focused)

    let db = readRewards();

    // Update Points
    db.totalPoints = (db.totalPoints || 0) + (pointsUrl || 0);

    // Update Streak
    if (isGoodSession) {
        db.currentStreak = (db.currentStreak || 0) + 1;
        if (db.currentStreak > (db.bestStreak || 0)) {
            db.bestStreak = db.currentStreak;
        }
    } else {
        // Optional: Reset streak on bad session? Or maybe just don't increment.
        // For positive reinforcement, let's reset only on long inactivity (not implemented here)
        // or if they explicitly "Quit" early. 
        // For this simple version, we simply increment if good. 
        // If we want to be strict: 
        // db.currentStreak = 0; 
    }

    // Level Logix
    if (db.totalPoints > 1000) db.level = "Zen Master 🧘";
    else if (db.totalPoints > 500) db.level = "Focus Ninja 🥷";
    else if (db.totalPoints > 100) db.level = "Apprentice 🎓";

    writeRewards(db);
    res.json(db);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
