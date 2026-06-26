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

  // When phase changes, reset nested state
  useEffect(() => {
    if (phase === 'story') setStorySlideIndex(0);
    if (phase === 'simulate') setSimulateStation(0);
    stopNarration();
  }, [phase]);
  
  // When audio toggles from OFF to ON, replay current narration
  const prevAudioEnabled = useRef(audioEnabled);
  useEffect(() => {
    if (audioEnabled && !prevAudioEnabled.current) {
      // Get current narration based on phase
      let currentNarration = [];
      if (phase === 'landing') currentNarration = landingNarration();
      else if (phase === 'wonder') currentNarration = wonderNarration();
      else if (phase === 'story') currentNarration = getStoryNarration(storySlideIndex);
      else if (phase === 'simulate') {
        switch(simulateStation) {
          case 0: currentNarration = simulateStationAIntro(); break;
          case 1: currentNarration = simulateStationBIntro(); break;
          case 2: currentNarration = simulateStationCIntro(); break;
          case 3: currentNarration = simulateStationDIntro(); break;
        }
      }
      else if (phase === 'play') currentNarration = playNarration();
      else if (phase === 'reflect') currentNarration = reflectNarration();
      
      if (currentNarration.length > 0) {
        narrate(currentNarration);
      }
    }
    prevAudioEnabled.current = audioEnabled;
  }, [audioEnabled, phase, storySlideIndex, simulateStation]);

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
