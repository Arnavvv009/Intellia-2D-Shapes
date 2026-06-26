import React from 'react';

function PrimaryGoldButton({ icon, label, onClick }) {
  return (
    <button className="begin-journey-btn" onClick={onClick}>
      {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
      {label}
    </button>
  );
}

export default PrimaryGoldButton;
