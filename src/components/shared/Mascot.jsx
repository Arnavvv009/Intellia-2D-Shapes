import React from 'react';

const MAScotMoods = {
  idle: '🐧',
  happy: '🐧',
  thinking: '🤔',
  curious: '🧐',
  celebrating: '🎉🐧',
};

function Mascot({ mood = 'happy', small = false }) {
  const size = small ? 40 : 56;

  return (
    <div
      className="mascot-avatar"
      style={{ width: size, height: size, fontSize: small ? 22 : 32 }}
    >
      {MAScotMoods[mood] || MAScotMoods.happy}
    </div>
  );
}

export default Mascot;
