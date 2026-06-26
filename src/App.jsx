import React, { useState, useEffect } from 'react';
import './App.css';
import HomePill from './components/chrome/HomePill';
import PhaseTracker from './components/chrome/PhaseTracker';
import AudioToggleFAB from './components/chrome/AudioToggleFAB';
import LandingRoute from './routes/LandingRoute';
import WonderRoute from './routes/WonderRoute';
import StoryRoute from './routes/StoryRoute';
import SimulateRoute from './routes/SimulateRoute';
import PlayRoute from './routes/PlayRoute';
import ReflectRoute from './routes/ReflectRoute';
import { stopNarration } from './utils/audio';

function App() {
  const [phase, setPhase] = useState('landing');
  const [phaseComplete, setPhaseComplete] = useState({
    wonder: false,
    story: false,
    simulate: false,
    play: false,
    reflect: false
  });
  const [worldScores, setWorldScores] = useState(Array(10).fill(null));
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    stopNarration();
  }, [phase]);

  const handleStartJourney = () => {
    setPhase('wonder');
  };

  const handleInvestigate = () => {
    setPhaseComplete(p => ({ ...p, wonder: true }));
    setPhase('story');
  };

  const handleCompleteStory = () => {
    setPhaseComplete(p => ({ ...p, story: true }));
    setPhase('simulate');
  };

  const handleCompleteSimulate = () => {
    setPhaseComplete(p => ({ ...p, simulate: true }));
    setPhase('play');
  };

  const handleCompletePlay = () => {
    setPhaseComplete(p => ({ ...p, play: true }));
    setPhase('reflect');
  };

  const handleRestart = () => {
    setPhase('landing');
    setPhaseComplete({ wonder: false, story: false, simulate: false, play: false, reflect: false });
    setWorldScores(Array(10).fill(null));
  };

  const handleHome = () => {
    setPhase('landing');
  };

  const handlePhaseClick = (phaseKey) => {
    setPhase(phaseKey);
  };

  const handleAudioToggle = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    if (!newState) {
      stopNarration();
    }
  };

  const shouldShowPhaseTracker = phase !== 'landing';

  return (
    <div className="app">
      {shouldShowPhaseTracker && (
        <>
          <HomePill onNavigateHome={handleHome} />
          <PhaseTracker
            currentPhase={phase}
            phaseComplete={phaseComplete}
            onPhaseClick={handlePhaseClick}
          />
          <AudioToggleFAB
            audioEnabled={audioEnabled}
            onToggle={handleAudioToggle}
          />
        </>
      )}
      {phase === 'landing' && <LandingRoute onStartJourney={handleStartJourney} audioEnabled={audioEnabled} />}
      {phase === 'wonder' && <WonderRoute onInvestigate={handleInvestigate} audioEnabled={audioEnabled} />}
      {phase === 'story' && <StoryRoute onCompleteStory={handleCompleteStory} audioEnabled={audioEnabled} />}
      {phase === 'simulate' && <SimulateRoute onCompleteSimulate={handleCompleteSimulate} audioEnabled={audioEnabled} />}
      {phase === 'play' && <PlayRoute worldScores={worldScores} setWorldScores={setWorldScores} onCompletePlay={handleCompletePlay} audioEnabled={audioEnabled} />}
      {phase === 'reflect' && <ReflectRoute worldScores={worldScores} onRestart={handleRestart} onHome={handleHome} audioEnabled={audioEnabled} />}
    </div>
  );
}

export default App;
