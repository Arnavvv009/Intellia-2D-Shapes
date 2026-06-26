import React, { useState, useEffect, useRef } from 'react';
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
import { narrate, stopNarration } from './utils/audio';
import { 
  landingNarration, 
  wonderNarration, 
  getStoryNarration,
  simulateStationAIntro,
  simulateStationBIntro,
  simulateStationCIntro,
  simulateStationDIntro,
  playNarration,
  reflectNarration
} from './utils/narration';
import { STORY_SLIDES } from './data/storyContent';

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
  
  // Track additional state for audio replay
  const [storySlideIndex, setStorySlideIndex] = useState(0);
  const [simulateStation, setSimulateStation] = useState(0);

  // Helper function to get current narration
  const getCurrentNarration = () => {
    if (phase === 'landing') return landingNarration();
    else if (phase === 'wonder') return wonderNarration();
    else if (phase === 'story') return getStoryNarration(storySlideIndex);
    else if (phase === 'simulate') {
      switch(simulateStation) {
        case 0: return simulateStationAIntro();
        case 1: return simulateStationBIntro();
        case 2: return simulateStationCIntro();
        case 3: return simulateStationDIntro();
        default: return [];
      }
    }
    else if (phase === 'play') return playNarration();
    else if (phase === 'reflect') return reflectNarration();
    return [];
  };

  // When phase changes, reset nested state and play narration
  useEffect(() => {
    if (phase === 'story') setStorySlideIndex(0);
    if (phase === 'simulate') setSimulateStation(0);
    stopNarration();
    if (audioEnabled) {
      const nar = getCurrentNarration();
      if (nar.length > 0) narrate(nar);
    }
  }, [phase]);
  
  // When story slide changes
  useEffect(() => {
    if (phase === 'story' && audioEnabled) {
      const nar = getCurrentNarration();
      if (nar.length > 0) narrate(nar);
    }
  }, [storySlideIndex, phase, audioEnabled]);
  
  // When simulate station changes
  useEffect(() => {
    if (phase === 'simulate' && audioEnabled) {
      const nar = getCurrentNarration();
      if (nar.length > 0) narrate(nar);
    }
  }, [simulateStation, phase, audioEnabled]);
  
  // When audio toggles from OFF to ON, replay current narration
  const prevAudioEnabled = useRef(audioEnabled);
  useEffect(() => {
    if (audioEnabled && !prevAudioEnabled.current) {
      const currentNarration = getCurrentNarration();
      if (currentNarration.length > 0) {
        narrate(currentNarration);
      }
    }
    prevAudioEnabled.current = audioEnabled;
  }, [audioEnabled]);

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
      {phase === 'story' && <StoryRoute onCompleteStory={handleCompleteStory} audioEnabled={audioEnabled} slideIndex={storySlideIndex} setSlideIndex={setStorySlideIndex} />}
      {phase === 'simulate' && <SimulateRoute onCompleteSimulate={handleCompleteSimulate} audioEnabled={audioEnabled} activeStation={simulateStation} setActiveStation={setSimulateStation} />}
      {phase === 'play' && <PlayRoute worldScores={worldScores} setWorldScores={setWorldScores} onCompletePlay={handleCompletePlay} audioEnabled={audioEnabled} />}
      {phase === 'reflect' && <ReflectRoute worldScores={worldScores} onRestart={handleRestart} onHome={handleHome} audioEnabled={audioEnabled} />}
    </div>
  );
}

export default App;
