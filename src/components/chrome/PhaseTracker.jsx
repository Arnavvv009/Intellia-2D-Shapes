import React from 'react';

const PHASES = [
  { key: 'wonder', num: '01', icon: '🔍', label: 'Wonder' },
  { key: 'story', num: '02', icon: '📖', label: 'Story' },
  { key: 'simulate', num: '03', icon: '✏️', label: 'Simulate' },
  { key: 'play', num: '04', icon: '🎮', label: 'Play' },
  { key: 'reflect', num: '05', icon: '📋', label: 'Reflect' },
];

function PhaseTracker({ currentPhase, phaseComplete, onPhaseClick }) {
  return (
    <nav className="phase-tracker">
      {PHASES.map((p) => {
        const isComplete = phaseComplete[p.key];
        const isActive = currentPhase === p.key;
        let stateClass = '';
        if (isActive) stateClass = 'phase-segment--active';
        else if (isComplete) stateClass = 'phase-segment--complete';

        return (
          <button
            key={p.key}
            className={`phase-segment ${stateClass}`}
            onClick={() => onPhaseClick && onPhaseClick(p.key)}
          >
            <span>{p.num}</span>
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default PhaseTracker;
