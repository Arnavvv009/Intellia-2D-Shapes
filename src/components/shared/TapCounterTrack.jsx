import React from 'react';

function TapCounterTrack({ label, filled, total }) {
  const pct = (filled / total) * 100;
  return (
    <div className="tap-counter">
      <label className="tap-counter__label">{label}</label>
      <div className="tap-counter__track">
        <div className="tap-counter__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default TapCounterTrack;
