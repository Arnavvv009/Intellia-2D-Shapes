import React from 'react';

function HomePill({ onNavigateHome }) {
  return (
    <button className="home-pill" onClick={onNavigateHome}>
      <span>🏠</span>
      <span>Home</span>
    </button>
  );
}

export default HomePill;
