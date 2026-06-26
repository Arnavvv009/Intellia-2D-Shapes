import React, { useState, useEffect } from 'react';
import { WORLDS } from '../data/worldMap';
import { QUESTION_BANK } from '../data/questionBank';
import { Lock, Star, Heart, Flame } from 'lucide-react';
import ShapeRenderer from '../components/shared/ShapeRenderer';
import Mascot from '../components/shared/Mascot';
import SpeechBubble from '../components/shared/SpeechBubble';
import SecondaryDarkButton from '../components/shared/SecondaryDarkButton';
import { narrate, stopNarration } from '../utils/audio';
import { playNarration } from '../utils/narration';

// Helper function to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function PlayRoute({ worldScores: propWorldScores, setWorldScores, onCompletePlay, audioEnabled }) {
  useEffect(() => {
    stopNarration();
    if (audioEnabled) {
      narrate(playNarration());
    }
  }, [audioEnabled]);
  const [mode, setMode] = useState('select'); // 'select' | 'quiz'
  const [currentWorldId, setCurrentWorldId] = useState(0);
  // Initialize worldUnlocked: first world is always unlocked, then any world with a score is unlocked
  const [worldUnlocked, setWorldUnlocked] = useState(() => {
    const unlocked = Array(10).fill(false);
    unlocked[0] = true;
    propWorldScores.forEach((score, idx) => {
      if (score !== null) {
        unlocked[idx] = true;
        if (idx < 9 && score >= 5) {
          unlocked[idx + 1] = true;
        }
      }
    });
    return unlocked;
  });
  const [worldScores, setLocalWorldScores] = useState(propWorldScores);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [scoreInWorld, setScoreInWorld] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const currentWorld = WORLDS[currentWorldId];
  
  // Get world questions and shuffle them for variety
  const getWorldQuestions = (worldId) => {
    const world = WORLDS[worldId];
    const questions = QUESTION_BANK.filter((_, idx) => idx >= world.questionRange[0] && idx <= world.questionRange[1]);
    return shuffleArray(questions);
  };

  const handleStartWorld = (worldId) => {
    if (!worldUnlocked[worldId]) return;
    const shuffled = getWorldQuestions(worldId);
    setShuffledQuestions(shuffled);
    setCurrentWorldId(worldId);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setAnswerRevealed(false);
    setScoreInWorld(0);
    setLives(3);
    setStreak(0);
    setMode('quiz');
  };

  const handleBackToWorlds = () => {
    setMode('select');
  };

  const handleAnswer = (answerIdx) => {
    if (answerRevealed) return;
    setSelectedAnswerIndex(answerIdx);
    const q = shuffledQuestions[currentQuestionIndex];
    if (answerIdx === q.correctIndex) {
      setScoreInWorld(s => s + 1);
      setStreak(s => s + 1);
    } else {
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setStreak(0);
      // If no lives left, go back to world select after a short delay
      if (newLives === 0) {
        setTimeout(() => {
          setMode('select');
        }, 1500);
      }
    }
    setAnswerRevealed(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswerIndex(null);
      setAnswerRevealed(false);
    } else {
      // Complete world
      const newScores = [...worldScores];
      newScores[currentWorldId] = scoreInWorld;
      setLocalWorldScores(newScores);
      setWorldScores(newScores);
      if (currentWorldId < 9 && scoreInWorld >= 5) {
        const newUnlocked = [...worldUnlocked];
        newUnlocked[currentWorldId + 1] = true;
        setWorldUnlocked(newUnlocked);
      }
      // If it's the last world, call onCompletePlay
      if (currentWorldId === 9) {
        onCompletePlay();
      } else {
        setMode('select');
      }
    }
  };

  if (mode === 'select') {
    return <WorldSelect
      worlds={WORLDS}
      worldUnlocked={worldUnlocked}
      worldScores={worldScores}
      onStartWorld={handleStartWorld}
      onCompletePlay={onCompletePlay}
    />;
  }

  const q = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="phase-screen" style={{ paddingTop: '28px' }}>
      {/* Back to Worlds button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
        <SecondaryDarkButton
          icon="←"
          label="Back to Worlds"
          onClick={handleBackToWorlds}
          style={{ padding: '5px 10px', fontSize: '11px' }}
        />
      </div>
      
      {/* World badge with score and hearts */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 12px'
        }}>
          {/* Left: Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontSize: '13px' }}>
            <Star fill="#F5B82E" color="#F5B82E" style={{ width: '16px', height: '16px' }} />
            <span>{scoreInWorld} / {shuffledQuestions.length}</span>
          </div>

          {/* Center: World badge */}
          <div style={{
            background: 'var(--surface-pill-dark)',
            padding: '3px 10px',
            borderRadius: '999px',
            fontWeight: '600',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: 'var(--accent-gold)'
          }}>
            <span>{currentWorld.emoji}</span>
            <span>{currentWorld.name}</span>
          </div>

          {/* Right: Hearts */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                fill={i < lives ? '#EC4D78' : 'transparent'}
                color={i < lives ? '#EC4D78' : '#A89FC9'}
                style={{ width: '20px', height: '20px' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px', color: 'var(--text-muted-lavender)' }}>
        <span>Question {currentQuestionIndex + 1}/{shuffledQuestions.length}</span>
        <span>{Math.round(((currentQuestionIndex + 1) / shuffledQuestions.length) * 100)}%</span>
      </div>
      <div style={{
        height: '5px',
        width: '100%',
        background: 'var(--surface-pill-dark)',
        borderRadius: '999px',
        marginBottom: '18px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%`,
          background: 'linear-gradient(90deg, #F5B82E, #F0A830)',
          borderRadius: '999px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Question card */}
      <div style={{
        background: 'var(--surface-card)',
        borderRadius: '18px',
        padding: '22px 20px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '800',
          marginBottom: q.visualShape ? '14px' : '20px',
          lineHeight: '1.3'
        }}>
          {q.questionText}
        </h2>

        {q.visualShape && (
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            background: 'var(--surface-card-nested)',
            borderRadius: '14px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ShapeRenderer type={q.visualShape} size={110} />
          </div>
        )}

        <div className="answer-grid">
          {q.options.map((opt, i) => {
            let btnClass = 'answer-btn';
            if (answerRevealed) {
              if (i === q.correctIndex) btnClass += ' answer-btn--correct';
              else if (i === selectedAnswerIndex) btnClass += ' answer-btn--wrong';
            }
            const isShapeOption = ['square', 'rectangle', 'triangle', 'circle'].includes(opt.toLowerCase());
            return (
              <button
                key={i}
                className={isShapeOption ? `${btnClass} shape-answer-btn` : btnClass}
                onClick={() => handleAnswer(i)}
                disabled={answerRevealed}
                style={{ padding: '14px' }}
              >
                {isShapeOption ? <ShapeRenderer type={opt.toLowerCase()} size={40} /> : opt}
              </button>
            );
          })}
        </div>

        {answerRevealed && (
          <div style={{ marginTop: '16px' }}>
            <div className="mascot-greeting" style={{ justifyContent: 'center', marginBottom: '10px' }}>
              <Mascot mood={selectedAnswerIndex === q.correctIndex ? 'celebrating' : 'happy'} small />
              <SpeechBubble>
                {selectedAnswerIndex === q.correctIndex
                  ? "Great job! You got it right! 🎉"
                  : "No worries! The correct answer is highlighted! 😊"}
              </SpeechBubble>
            </div>
            <SecondaryDarkButton
              label={currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question →' : 'See Results →'}
              onClick={handleNextQuestion}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function WorldSelect({ worlds, worldUnlocked, worldScores, onStartWorld, onCompletePlay }) {
  const getStars = (score) => {
    if (score === null) return 0;
    if (score >= 9) return 3;
    if (score >= 7) return 2;
    if (score >= 5) return 1;
    return 0;
  };

  return (
    <div className="phase-screen" style={{ overflow: 'hidden' }}>
      <div className="world-choose-header" style={{ flexShrink: 0 }}>
        <h2>🎮 Choose Your World!</h2>
        <p>Beat each world to unlock the next. Earn stars and XP!</p>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px', minHeight: 0, maxHeight: '60vh' }}>
      {worlds.map((world) => {
        const unlocked = worldUnlocked[world.id];
        const stars = getStars(worldScores[world.id]);
        const state = worldScores[world.id] !== null ? 'completed' : unlocked ? 'unlocked' : 'locked';
        return (
          <div key={world.id} className={`world-card world-card--${state}`}>
            <div className={`world-card__icon world-card__icon--${world.color}`}>
              {unlocked ? world.emoji : <Lock />}
            </div>
            <div className="world-card__info">
              <h3 className={`world-card__name ${state === 'locked' ? 'is-muted' : ''}`}>{world.name}</h3>
              <p className="world-card__desc">{world.descriptor}</p>
              {state === 'completed' && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} fill={i < stars ? '#F5B82E' : 'transparent'} color={i < stars ? '#F5B82E' : '#A89FC9'} />
                  ))}
                </div>
              )}
            </div>
            {state === 'unlocked' && (
              <button className="world-card__play-btn" onClick={() => onStartWorld(world.id)}>
                ▶ PLAY
              </button>
            )}
            {state === 'completed' && (
              <button className="world-card__play-btn world-card__play-btn--secondary" onClick={() => onStartWorld(world.id)}>
                REPLAY
              </button>
            )}
          </div>
        );
      })}
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px', flexShrink: 0 }}>
        <SecondaryDarkButton label="Continue to Reflect →" onClick={onCompletePlay} />
      </div>
    </div>
  );
}

export default PlayRoute;
