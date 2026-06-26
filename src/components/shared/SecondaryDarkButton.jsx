import React from 'react';

function SecondaryDarkButton({ icon, label, onClick, style = {} }) {
  return (
    <button className="secondary-btn" onClick={onClick} style={style}>
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

export default SecondaryDarkButton;
