import React, { useEffect } from 'react';
import ParticleBackground from '../components/shared/ParticleBackground';
import Mascot from '../components/shared/Mascot';
import SpeechBubble from '../components/shared/SpeechBubble';
import PrimaryGoldButton from '../components/shared/PrimaryGoldButton';
import { narrate, stopNarration } from '../utils/audio';
import { landingNarration } from '../utils/narration';

function LandingRoute({ onStartJourney, audioEnabled }) {
  useEffect(() => {
    // Landing narration handled by App.js
  }, []);
  
  return (
    <div className="landing-screen">
      <ParticleBackground />
      <div className="landing-card">
        <div className="curriculum-badge">
          ✨ Singapore MOE Curriculum · Grade 2
        </div>
        <div className="lesson-title">
          <span className="lesson-title__white">Exploring 2D</span>
          <span className="lesson-title__gold">Shapes!</span>
        </div>
        <div className="mascot-greeting">
          <Mascot mood="happy" />
          <SpeechBubble>
            Ready to go shape-spotting! Let's go! 🚀
          </SpeechBubble>
        </div>
        <p className="landing-description">
          Join Pip the Penguin and discover the secrets of squares, rectangles, triangles, and circles — through stories, simulations, and exciting games!
        </p>
        <div className="journey-map-panel">
          <div className="journey-map-panel__label">Your Learning Journey</div>
          <div className="journey-chips">
            <div className="journey-chip">🔍 Wonder</div>
            <div className="journey-chip">📖 Story</div>
            <div className="journey-chip">✏️ Simulate</div>
            <div className="journey-chip">🎮 Play</div>
            <div className="journey-chip">📋 Reflect</div>
          </div>
        </div>
        <PrimaryGoldButton icon="🚀" label="Begin Your Journey!" onClick={onStartJourney} />
        <div className="feature-card-row">
          <div className="feature-card">
            <div className="feature-card__icon">🔺</div>
            <div className="feature-card__label">4 Shapes to Master</div>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">✏️</div>
            <div className="feature-card__label">4 Simulations</div>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">🎮</div>
            <div className="feature-card__label">10 Shape Worlds</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingRoute;
