import React from 'react';

const PrivacyBadge = () => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '1rem',
            left: '1rem',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '0.5rem 1rem',
            borderRadius: '99px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 1000,
            opacity: 0.8
        }}>
            <span style={{ fontSize: '1rem' }}>🔒</span>
            <span>
                <strong>Privacy Active</strong><br />
                Local AI Processing Only
            </span>
        </div>
    );
};

export default PrivacyBadge;
