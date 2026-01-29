import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useGamification = (isSessionActive, isFocused) => {
    const [points, setPoints] = useState(0); // Current session points
    const [totalPoints, setTotalPoints] = useState(0); // From DB
    const [streak, setStreak] = useState(0);
    const [level, setLevel] = useState("Loading...");
    const [nudges, setNudges] = useState([]);

    // Refs for tracking time
    const lastPointTime = useRef(Date.now());
    const focusStreakTime = useRef(0); // Continuous focus in this session

    // 1. Fetch Initial Stats
    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            const res = await axios.get(`${API_URL}/rewards`);
            setTotalPoints(res.data.totalPoints);
            setStreak(res.data.currentStreak);
            setLevel(res.data.level);
        } catch (err) {
            console.error("Failed to fetch rewards", err);
        }
    };

    // 2. Point Calculation Loop
    useEffect(() => {
        let interval;
        if (isSessionActive) {
            interval = setInterval(() => {
                const now = Date.now();

                if (isFocused) {
                    // Add 10 points every 60 seconds (approx 0.16 per sec)
                    // Let's make it more granular: 1 point every 6 seconds
                    if (now - lastPointTime.current > 6000) {
                        setPoints(p => p + 1);
                        lastPointTime.current = now;

                        // Nudge logic
                        focusStreakTime.current += 6;
                        checkNudges(focusStreakTime.current);
                    }
                } else {
                    // Reset continuous focus time if distracted
                    focusStreakTime.current = 0;
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSessionActive, isFocused]);

    // 3. Penalty for Distraction (Called by App)
    const applyPenalty = () => {
        setPoints(p => Math.max(0, p - 5)); // Lose 5 points, floor at 0
        addNudge("Distraction Penalty: -5 pts 📉");
    };

    // 4. Save Session Rewards
    const saveRewards = async (duration) => {
        // Bonus for completing session > 1 min
        const isGoodSession = duration > 60;

        try {
            await axios.post(`${API_URL}/rewards/update`, {
                pointsUrl: points,
                sessionDuration: duration,
                isGoodSession
            });
            // Refresh local stats
            fetchRewards();
        } catch (err) {
            console.error("Failed to save rewards");
        }
    };

    // Helper: Nudges
    const checkNudges = (seconds) => {
        if (seconds === 60) addNudge("1 min of pure focus! 🔥");
        if (seconds === 300) addNudge("5 mins! You're in the zone 🧘");
        if (seconds === 900) addNudge("15 mins! Unstoppable 🚀");
    };

    const addNudge = (msg) => {
        const id = Date.now();
        setNudges(prev => [...prev, { id, msg }]);
        // Remove after 3s
        setTimeout(() => {
            setNudges(prev => prev.filter(n => n.id !== id));
        }, 4000);
    };

    return {
        points,      // Session points
        totalPoints, // Lifetime points
        streak,
        level,
        nudges,
        applyPenalty,
        saveRewards
    };
};
