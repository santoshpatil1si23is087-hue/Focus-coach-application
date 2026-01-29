import React from 'react';

const PomodoroControls = ({ onSelectMode, currentMode, customMinutes, onCustomChange }) => {
    const modes = [
        { label: 'Stopwatch', value: null, desc: 'Count Up' },
        { label: '25 Min', value: 25, desc: 'Standard' },
        { label: '45 Min', value: 45, desc: 'Deep Work' },
        { label: '60 Min', value: 60, desc: 'Power Hr' },
    ];

    return (
        <div className="pomodoro-controls glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Session Mode</h3>
            <div className="mode-grid" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {modes.map((m) => (
                    <button
                        key={m.label}
                        className={`mode-btn ${currentMode === m.value ? 'active' : ''}`}
                        onClick={() => onSelectMode(m.value)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: `1px solid ${currentMode === m.value ? 'var(--text-main)' : 'var(--glass-border)'}`,
                            background: currentMode === m.value ? 'var(--glass-highlight)' : 'transparent',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            minWidth: '100px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontWeight: 700 }}>{m.label}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                    </button>
                ))}

                {/* Custom Input */}
                <div className={`mode-btn ${currentMode === 'custom' ? 'active' : ''}`}
                    onClick={() => onSelectMode('custom')}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '0.5rem', borderRadius: '8px',
                        border: `1px solid ${currentMode === 'custom' ? 'var(--text-main)' : 'var(--glass-border)'}`,
                        background: currentMode === 'custom' ? 'var(--glass-highlight)' : 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Custom (Min)</span>
                    <input
                        type="number"
                        value={customMinutes}
                        onChange={(e) => onCustomChange(e.target.value)}
                        style={{
                            width: '50px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--text-muted)',
                            color: 'var(--text-main)',
                            textAlign: 'center',
                            fontWeight: 700
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PomodoroControls;
