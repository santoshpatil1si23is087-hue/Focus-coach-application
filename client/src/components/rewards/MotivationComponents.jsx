import React from 'react';

// Floating Toast Notifications
export const NudgeSystem = ({ nudges }) => {
    return (
        <div className="nudge-container">
            {nudges.map(n => (
                <div key={n.id} className="nudge-toast">
                    {n.msg}
                </div>
            ))}
        </div>
    );
};

// Top Bar HUD
export const MotivationLayer = ({ points, totalPoints, streak, level }) => {
    return (
        <div className="motivation-hud">
            <div className="hud-item level-badge">
                <span className="label">Level</span>
                <span className="value">{level}</span>
            </div>

            <div className="hud-item points-display">
                <span className="label">Session Pts</span>
                <span className="value active">+{points}</span>
                <span className="sub">Total: {totalPoints}</span>
            </div>

            <div className="hud-item streak-display">
                <span className="label">Streak</span>
                <span className="value">🔥 {streak}</span>
            </div>
        </div>
    );
};
