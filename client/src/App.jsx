import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import FocusCoach from './components/FocusCoach';
import PomodoroControls from './components/PomodoroControls';
import PrivacyBadge from './components/PrivacyBadge';
import { useGamification } from './hooks/useGamification';
import { MotivationLayer, NudgeSystem } from './components/rewards/MotivationComponents';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Pomodoro State
  const [targetDuration, setTargetDuration] = useState(null); // null = stopwatch mode
  const [customInput, setCustomInput] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [autoPause, setAutoPause] = useState(true); // "Smart Pause" feature

  // Stats
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [focusedSeconds, setFocusedSeconds] = useState(0);
  const [distractionCount, setDistractionCount] = useState(0);

  const {
    points, totalPoints, streak, level, nudges,
    applyPenalty, saveRewards
  } = useGamification(isActive, isFocused);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
    document.body.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/sessions`);
      setHistory(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  // Timer & Logic Loop
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        // Smart Pause Logic: If AutoPause is ON and NOT focused, do not tick timer
        if (autoPause && !isFocused) {
          // Timer paused due to distraction...
          return;
        }

        setElapsedSeconds(prev => prev + 1);
        if (isFocused) {
          setFocusedSeconds(prev => prev + 1);
        }

        // Pomodoro Countdown Logic
        if (targetDuration) {
          setTimeLeft(prev => {
            if (prev <= 1) {
              // Timer Finished!
              endSession(true); // true = auto-finished
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isFocused, targetDuration, autoPause]);

  const handleFocusChange = (focused) => {
    if (isActive) {
      if (!focused && isFocused) {
        setDistractionCount(prev => prev + 1);
        applyPenalty();
      }
      setIsFocused(focused);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setSessionStartTime(new Date());
    setElapsedSeconds(0);
    setFocusedSeconds(0);
    setDistractionCount(0);
    setIsFocused(true);

    // Initialize Timer
    if (targetDuration) {
      setTimeLeft(targetDuration * 60);
    }
  };

  const endSession = async (auto = false) => {
    setIsActive(false);

    // Safety check for very short sessions to avoid divide by zero or noise
    if (elapsedSeconds < 2) {
      setIsActive(false);
      return;
    }

    const focusScore = elapsedSeconds > 0
      ? Math.round((focusedSeconds / elapsedSeconds) * 100)
      : 0;

    const sessionData = {
      duration: elapsedSeconds,
      distractionCount,
      focusScore,
      timestamp: sessionStartTime || new Date()
    };

    try {
      await axios.post(`${API_URL}/sessions`, sessionData);
      await saveRewards(elapsedSeconds);

      let msg = `Session Ended. Focus Score: ${focusScore}%`;
      if (auto) msg = "🎉 POMODORO COMPLETE! Take a break.";

      alert(msg);
      fetchHistory();
    } catch (err) {
      console.error("Failed to save session", err);
    }
  };

  // Select Mode Handler
  const handleModeSelect = (val) => {
    if (val === 'custom') {
      setTargetDuration(customInput);
    } else {
      setTargetDuration(val);
    }
  };

  // Analytics Calculation
  const getBestHour = () => {
    if (history.length === 0) return "N/A";
    const hours = {};
    history.forEach(s => {
      const h = new Date(s.timestamp).getHours();
      if (!hours[h]) hours[h] = { score: 0, count: 0 };
      hours[h].score += s.focusScore;
      hours[h].count += 1;
    });

    let best = -1;
    let maxAvg = -1;
    for (const h in hours) {
      const avg = hours[h].score / hours[h].count;
      if (avg > maxAvg) {
        maxAvg = avg;
        best = h;
      }
    }
    return best !== -1 ? `${best}:00 - ${best}:59` : "N/A";
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const currentScore = elapsedSeconds > 0
    ? Math.round((focusedSeconds / elapsedSeconds) * 100)
    : 100;

  return (
    <div className="app-layout">
      <PrivacyBadge />

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀ Light Mode' : '☾ Dark Mode'}
      </button>

      <MotivationLayer
        points={points}
        totalPoints={totalPoints}
        streak={streak}
        level={level}
      />
      <NudgeSystem nudges={nudges} />

      <div className="container">
        <header className="header">
          <h1>Focus Coach .v2</h1>
          <p>AI Pomodoro & Vision Control</p>
        </header>

        {/* Mode Selector (Only when not active) */}
        {!isActive && (
          <PomodoroControls
            currentMode={targetDuration === customInput ? 'custom' : targetDuration}
            onSelectMode={handleModeSelect}
            customMinutes={customInput}
            onCustomChange={(val) => { setCustomInput(Number(val)); setTargetDuration(Number(val)); }}
          />
        )}

        {/* Smart Pause Toggle */}
        {!isActive && targetDuration && (
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={autoPause}
              onChange={(e) => setAutoPause(e.target.checked)}
              id="smartPause"
            />
            <label htmlFor="smartPause" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Smart Pause (Halt timer when distracted)
            </label>
          </div>
        )}

        <div className="dashboard">
          <div className="card glass-card">
            <h3>Focus Integrity</h3>
            <div className="value" style={{
              color: currentScore > 80 ? 'var(--success)' : (currentScore > 50 ? 'var(--warning)' : 'var(--danger-real)')
            }}>
              {currentScore}%
            </div>
            <div className="subtitle">Real-time Quality</div>
          </div>

          <div className="card glass-card">
            <h3>{targetDuration ? 'Time Remaining' : 'Elapsed'}</h3>
            <div className="value" style={{ fontFamily: 'monospace' }}>
              {targetDuration ? formatTime(timeLeft) : formatTime(elapsedSeconds)}
            </div>
            {autoPause && !isFocused && isActive && (
              <div style={{ color: 'var(--danger-real)', fontSize: '0.8rem', fontWeight: 'bold' }}>⚠ TIMER PAUSED</div>
            )}
          </div>

          <div className="card glass-card analytics-card">
            <h3>Best Focus Hour</h3>
            <div className="value" style={{ fontSize: '1.5rem' }}>{getBestHour()}</div>
            <div className="subtitle">Based on history</div>
          </div>
        </div>

        <main className="webcam-section">
          <div className={`cam-frame ${!isFocused && isActive ? 'cam-alert' : ''}`}>
            <FocusCoach
              isSessionActive={isActive}
              onFocus={() => handleFocusChange(true)}
              onDistraction={() => handleFocusChange(false)}
            />
          </div>

          <div className="controls">
            {!isActive ? (
              <button className="btn" onClick={startSession}>
                Initialize {targetDuration ? `${targetDuration}m Pomodoro` : 'Session'}
              </button>
            ) : (
              <button className="btn btn-danger" onClick={() => endSession(false)}>
                Terminate Session
              </button>
            )}
          </div>
        </main>

        <section className="history-section">
          <h2>Log Archives</h2>
          <div className="history-list">
            {history.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No archives found.</p>
            ) : (
              history.slice(0, 5).map((s) => (
                <div key={s.id} className="history-item">
                  <div>
                    <span className="history-date">
                      {new Date(s.timestamp).toLocaleDateString()}
                    </span>
                    <span className="history-meta">
                      {formatTime(s.duration)} // {s.distractionCount} DRIFTS
                    </span>
                  </div>
                  <div className={`history-score ${s.focusScore > 80 ? 'good' : 'bad'}`}>
                    {s.focusScore}%
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
