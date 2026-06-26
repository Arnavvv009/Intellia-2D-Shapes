import React, { useState, useEffect } from 'react';
import { WORLDS } from '../data/worldMap';
import { Star } from 'lucide-react';
import Mascot from '../components/shared/Mascot';
import SpeechBubble from '../components/shared/SpeechBubble';
import PrimaryGoldButton from '../components/shared/PrimaryGoldButton';
import SecondaryDarkButton from '../components/shared/SecondaryDarkButton';
import ParticleBackground from '../components/shared/ParticleBackground';
import { narrate, stopNarration } from '../utils/audio';
import { reflectNarration } from '../utils/narration';

function ReflectRoute({ worldScores, onRestart, onHome, audioEnabled }) {
  useEffect(() => {
    // Reflect narration handled by App.js
  }, []);
  const getStars = (score) => {
    if (score === null) return 0;
    if (score >= 9) return 3;
    if (score >= 7) return 2;
    if (score >= 5) return 1;
    return 0;
  };

  const totalStars = worldScores.reduce((sum, score) => sum + getStars(score), 0);
  const totalQuestionsCorrect = worldScores.reduce((sum, score) => sum + (score || 0), 0);
  const completedWorlds = worldScores.filter(score => score !== null).length;
  const [reflectionText, setReflectionText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="phase-screen">
      <ParticleBackground />
      <div className="mascot-greeting" style={{ justifyContent: 'center' }}>
        <Mascot mood="celebrating" />
        <SpeechBubble>
          {submitted
            ? "You did it! You mastered 2D shapes! 🎉"
            : "Amazing work! Let's reflect a little! 📋"}
        </SpeechBubble>
      </div>
      <div className="content-card" style={{ textAlign: 'center' }}>
        {/* Show Performance Summary first, then reflection */}
        <div style={{ marginBottom: '24px' }}>
          <h2 className="lesson-title" style={{ fontSize: '28px', marginBottom: '20px' }}>
            <span className="lesson-title__white">Your</span>
            <span className="lesson-title__gold">Performance!</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--surface-card-nested)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>⭐</div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>{totalStars}</div>
              <div style={{ color: 'var(--text-muted-lavender)', fontSize: '13px' }}>Total Stars</div>
            </div>
            <div style={{ background: 'var(--surface-card-nested)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>✅</div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>{totalQuestionsCorrect}</div>
              <div style={{ color: 'var(--text-muted-lavender)', fontSize: '13px' }}>Correct Answers</div>
            </div>
            <div style={{ background: 'var(--surface-card-nested)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>🌍</div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>{completedWorlds}/10</div>
              <div style={{ color: 'var(--text-muted-lavender)', fontSize: '13px' }}>Worlds Completed</div>
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--text-primary)' }}>World Progress</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {WORLDS.map((world, idx) => {
                const stars = getStars(worldScores[idx]);
                return (
                  <div key={world.id} style={{ 
                    background: worldScores[idx] !== null ? 'var(--surface-pill-active)' : 'var(--surface-pill-dark)', 
                    borderRadius: '8px', 
                    padding: '8px 12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px'
                  }}>
                    <span>{world.emoji}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(3)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < stars ? '#F5B82E' : 'transparent'} 
                          color={i < stars ? '#F5B82E' : '#A89FC9'} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {!submitted ? (
          <>
            <h2 style={{ fontSize: '22px', marginBottom: '12px', color: 'var(--accent-gold)', fontWeight: '800' }}>
              Time to Reflect!
            </h2>
            <p style={{ color: 'var(--text-muted-lavender)', marginBottom: '20px' }}>
              Tell me one way to spot a shape in real life!
            </p>
            <textarea
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--surface-pill-dark)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '15px',
                marginBottom: '20px'
              }}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="I can spot a square by looking for 4 equal sides and 4 square corners..."
            />
            <PrimaryGoldButton
              icon="✅"
              label="Submit Reflection!"
              onClick={() => setSubmitted(true)}
            />
          </>
        ) : (
          <>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '10px', fontSize: '24px' }}>Lesson Complete!</h2>
            <p style={{ color: 'var(--text-muted-lavender)', marginBottom: '28px' }}>
              You've completed the entire 2D shapes lesson! Great job! 🎊
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <SecondaryDarkButton label="Back to Home" onClick={onHome} />
              <PrimaryGoldButton label="Restart Lesson" onClick={onRestart} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReflectRoute;
