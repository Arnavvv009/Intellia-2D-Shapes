import React, { useEffect } from 'react';
import Mascot from '../components/shared/Mascot';
import SpeechBubble from '../components/shared/SpeechBubble';
import ShapeRenderer from '../components/shared/ShapeRenderer';
import HintPill from '../components/shared/HintPill';
import PrimaryGoldButton from '../components/shared/PrimaryGoldButton';
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration } from '../utils/narration';

function WonderRoute({ onInvestigate, audioEnabled }) {
  useEffect(() => {
    // Wonder narration handled by App.js
  }, []);
  
  return (
    <div className="phase-screen">
      <div className="mascot-greeting">
        <Mascot mood="curious" />
        <SpeechBubble>Hmm... I wonder...🤔</SpeechBubble>
      </div>
      <div className="wonder-icon-badge">
        <ShapeRenderer type="square" size={40} rotation={15} />
        <ShapeRenderer type="circle" size={35} />
      </div>
      <div className="content-card">
        <h2 className="wonder-headline">
          A window grille has 4 straight sides and 4 corners that look exactly the same. A clock on the wall has no corners at all. What shapes are they?
        </h2>
        <p className="wonder-subquestion">
          What if we counted the sides and corners to find out?
        </p>
        <HintPill text="✨ We could count the sides and corners to be sure!" />
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <PrimaryGoldButton icon="🔍" label="Let's Investigate!" onClick={onInvestigate} />
      </div>
    </div>
  );
}

export default WonderRoute;
