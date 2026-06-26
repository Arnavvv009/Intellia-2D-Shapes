import React, { useState, useMemo, useEffect } from 'react';
import ShapeRenderer from '../components/shared/ShapeRenderer';
import Mascot from '../components/shared/Mascot';
import SpeechBubble from '../components/shared/SpeechBubble';
import SecondaryDarkButton from '../components/shared/SecondaryDarkButton';
import TapCounterTrack from '../components/shared/TapCounterTrack';
import ShapeTile from '../components/shared/ShapeTile';
import PrimaryGoldButton from '../components/shared/PrimaryGoldButton';
import { narrate, stopNarration } from '../utils/audio';
import {
  simulateStationAIntro,
  simulateStationBIntro,
  simulateStationCIntro,
  simulateStationDIntro
} from '../utils/narration';
import {
  defaultSquareVertices,
  randomPresetVertices,
  classifyShapeFromVertices,
  randomShapeSpec,
  generateSortingPool,
  shuffleArray
} from '../utils/shapeGeometry';

const STATIONS = [
  { letter: 'A', color: 'purple', icon: '🔷', label: 'Shape Builder' },
  { letter: 'B', color: 'green', icon: '👆', label: 'Side & Corner Counter' },
  { letter: 'C', color: 'gold', icon: '🗳️', label: 'Shape Sorter' },
  { letter: 'D', color: 'orange', icon: '🔎', label: 'Mystery Shape' }
];

const MYSTERY_CLUES = [
  { clue: "I have 3 straight sides and 3 corners. What shape am I?", answer: 'triangle' },
  { clue: "I have no straight sides and no corners at all. What shape am I?", answer: 'circle' },
  { clue: "I have 4 sides that are all exactly the same length. What shape am I?", answer: 'square' },
  { clue: "I have 4 straight sides, but only my opposite sides match in length. What shape am I?", answer: 'rectangle' }
];

const PRESETS = [
  { label: 'Triangle', vertices: [{ x: 50, y: 15 }, { x: 85, y: 85 }, { x: 15, y: 85 }] },
  { label: 'Square', vertices: defaultSquareVertices() },
  { label: 'Rectangle', vertices: [{ x: 20, y: 25 }, { x: 80, y: 25 }, { x: 80, y: 75 }, { x: 20, y: 75 }] },
];

function SimulateRoute({ onCompleteSimulate, audioEnabled, activeStation, setActiveStation }) {

  return (
    <div className="phase-screen">
      <div className="station-tab-bar station-tab-bar--2x2">
        {STATIONS.map((s, i) => (
          <button
            key={s.letter}
            className={`station-tab ${i === activeStation ? 'station-tab--active' : ''}`}
            onClick={() => setActiveStation(i)}
          >
            <span className={`station-tab__badge station-tab__badge--${s.color}`}>{s.letter}</span>
            <span className="station-tab__icon">{s.icon}</span>
            <span className="station-tab__label">{s.label}</span>
          </button>
        ))}
      </div>
      
      <StationA isActive={activeStation === 0} audioEnabled={audioEnabled} />
      <StationB isActive={activeStation === 1} audioEnabled={audioEnabled} />
      <StationC isActive={activeStation === 2} audioEnabled={audioEnabled} />
      <StationD isActive={activeStation === 3} onCompleteSimulate={onCompleteSimulate} audioEnabled={audioEnabled} />
      
      {activeStation >= 0 && activeStation <= 2 && (
        <div className="station-nav">
          {activeStation > 0 && (
            <SecondaryDarkButton
              label="← Previous Station"
              onClick={() => setActiveStation(activeStation - 1)}
            />
          )}
          {activeStation < 3 && (
            <SecondaryDarkButton
              label="Next Station →"
              onClick={() => setActiveStation(activeStation + 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function StationA({ isActive, audioEnabled }) {
  const [vertices, setVertices] = useState(defaultSquareVertices());
  const detectedShape = useMemo(() => classifyShapeFromVertices(vertices), [vertices]);
  
  useEffect(() => {
    // Station A narration handled by App.js
  }, [isActive]);

  const handleRemoveVertex = () => {
    if (vertices.length > 3) {
      setVertices(vertices.slice(0, -1));
    }
  };

  const getShapeColor = () => {
    switch (detectedShape) {
      case 'square': return 'var(--shape-square-fill)';
      case 'rectangle': return 'var(--shape-rectangle-fill)';
      case 'triangle': return 'var(--shape-triangle-fill)';
      default: return 'var(--shape-circle-fill)';
    }
  };

  if (!isActive) return null;

  return (
    <div className="content-card station-content-card station-a-content">
      <h3 className="station-title">🔷 Shape Builder</h3>
      <p className="station-instruction">Change the shape by selecting presets or removing vertices!</p>
      <div className="shape-builder-canvas">
        <ShapeRenderer vertices={vertices} size={180} />
      </div>
      <div className="feedback-panel">
        <p className="feedback-equation">
          This shape has <strong>{vertices.length}</strong> sides and is currently a{' '}
          <strong style={{ color: getShapeColor() }}>
            {detectedShape}
          </strong>!
        </p>
      </div>
      <div className="status-banner status-banner--success">
        ✨ Try different presets to see how the shape changes!
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
        {PRESETS.map((preset, i) => (
          <SecondaryDarkButton
            key={i}
            label={preset.label}
            onClick={() => setVertices(preset.vertices)}
          />
        ))}
        <SecondaryDarkButton label="- Remove Vertex" onClick={handleRemoveVertex} />
        <SecondaryDarkButton label="Reset Shape" onClick={() => setVertices(defaultSquareVertices())} />
      </div>
    </div>
  );
}

function StationB({ isActive, audioEnabled }) {
  const [shape, setShape] = useState(randomShapeSpec());
  const [sidesTapped, setSidesTapped] = useState(0);
  const [cornersTapped, setCornersTapped] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('success');
  
  useEffect(() => {
    // Station B narration handled by App.js
  }, [isActive]);

  const handleTapSide = () => {
    const newCount = sidesTapped + 1;
    if (newCount <= shape.sideCount) {
      setSidesTapped(newCount);
      if (newCount === shape.sideCount && cornersTapped === shape.cornerCount) {
        setFeedback(`Great! You counted all sides and corners for the ${shape.type}! 🎉`);
        setFeedbackColor('success');
      } else if (newCount === shape.sideCount) {
        setFeedback(`Good! Now count the corners! 👆`);
        setFeedbackColor('success');
      }
    } else {
      setFeedback(`Oops! This ${shape.type} only has ${shape.sideCount} sides. Try again!`);
      setFeedbackColor('warning');
    }
  };

  const handleTapCorner = () => {
    const newCount = cornersTapped + 1;
    if (newCount <= shape.cornerCount) {
      setCornersTapped(newCount);
      if (sidesTapped === shape.sideCount && newCount === shape.cornerCount) {
        setFeedback(`Perfect! You counted all sides and corners for the ${shape.type}! 🎉`);
        setFeedbackColor('success');
      } else if (newCount === shape.cornerCount) {
        setFeedback(`Nice! Now count the sides! 👆`);
        setFeedbackColor('success');
      }
    } else {
      setFeedback(`Oops! This ${shape.type} only has ${shape.cornerCount} corners. Try again!`);
      setFeedbackColor('warning');
    }
  };

  const handleNewShape = () => {
    setShape(randomShapeSpec());
    setSidesTapped(0);
    setCornersTapped(0);
    setFeedback('');
  };

  const isComplete = sidesTapped === shape.sideCount && cornersTapped === shape.cornerCount;

  if (!isActive) return null;

  return (
    <div className="content-card station-content-card station-b-content">
      <h3 className="station-title">👆 Side & Corner Counter</h3>
      <p className="station-instruction">Count the sides and corners by tapping the buttons!</p>
      <div className="operand-row">
        <div className="operand operand--gold">
          <span className="operand__label">SIDES</span>
          <span className="operand__value">{sidesTapped}</span>
        </div>
        <div className="operand operand--purple">
          <span className="operand__label">CORNERS</span>
          <span className="operand__value">{cornersTapped}</span>
        </div>
      </div>
      <TapCounterTrack label={`Sides counted: ${sidesTapped} of ${shape.sideCount}`} filled={sidesTapped} total={shape.sideCount} />
      <TapCounterTrack label={`Corners counted: ${cornersTapped} of ${shape.cornerCount}`} filled={cornersTapped} total={shape.cornerCount} />
      <div className="feedback-panel">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <ShapeRenderer type={shape.type} size={70} />
        </div>
        {isComplete && (
          <p className="feedback-equation">
            {shape.sideCount} sides + {shape.cornerCount} corners = this is a <strong>{shape.type}</strong>! 🎉
          </p>
        )}
      </div>
      {feedback && (
        <div className={`status-banner status-banner--${feedbackColor}`}>
          {feedback}
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <SecondaryDarkButton
          label="Tap Side"
          onClick={handleTapSide}
          style={{ opacity: sidesTapped === shape.sideCount ? 0.5 : 1 }}
        />
        <SecondaryDarkButton
          label="Tap Corner"
          onClick={handleTapCorner}
          style={{ opacity: cornersTapped === shape.cornerCount ? 0.5 : 1 }}
        />
        <SecondaryDarkButton
          label="New Shape"
          onClick={handleNewShape}
        />
      </div>
    </div>
  );
}

function StationC({ isActive, audioEnabled }) {
  const [pool, setPool] = useState(generateSortingPool(8));
  const [bins, setBins] = useState({ square: [], rectangle: [], triangle: [], circle: [] });
  const [draggedShape, setDraggedShape] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('success');
  
  useEffect(() => {
    // Station C narration handled by App.js
  }, [isActive]);

  const handleDragStart = (e, shape) => {
    setDraggedShape(shape);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(shape));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, binName) => {
    e.preventDefault();
    if (!draggedShape) return;
    
    if (draggedShape.type === binName) {
      setPool(p => p.filter(s => s.id !== draggedShape.id));
      setBins(b => ({ ...b, [binName]: [...b[binName], draggedShape] }));
      setFeedback(`Great! That ${draggedShape.type} is in the right bin! ✨`);
      setFeedbackColor('success');
    } else {
      setFeedback(`Oops! That's a ${draggedShape.type}, not a ${binName}! Try again!`);
      setFeedbackColor('warning');
    }
    setDraggedShape(null);
  };

  const handleReset = () => {
    setPool(generateSortingPool(8));
    setBins({ square: [], rectangle: [], triangle: [], circle: [] });
    setFeedback('');
  };

  if (!isActive) return null;

  return (
    <div className="content-card station-content-card station-c-content">
      <h3 className="station-title">🗳️ Shape Sorter</h3>
      <p className="station-instruction">Drag shapes into the correct bins!</p>
      
      {feedback && (
        <div className={`status-banner status-banner--${feedbackColor}`}>
          {feedback}
        </div>
      )}

      <div className="sorter-pool">
        {pool.map((s) => (
          <div
            key={s.id}
            draggable
            onDragStart={(e) => handleDragStart(e, s)}
            style={{ cursor: 'grab' }}
          >
            <ShapeTile type={s.type} />
          </div>
        ))}
        {pool.length === 0 && <p style={{ color: 'var(--accent-success-green)', fontWeight: '700', fontSize: '15px' }}>All sorted! 🎉 Great job!</p>}
      </div>

      <div className="sorter-bins">
        {['square', 'rectangle', 'triangle', 'circle'].map((binName) => (
          <div
            key={binName}
            className="sorter-bin"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, binName)}
            style={{
              cursor: 'pointer',
              borderColor: draggedShape?.type === binName ? 'var(--accent-success-green)' : 'var(--surface-pill-active)'
            }}
          >
            <span className="sorter-bin__label">{binName[0].toUpperCase() + binName.slice(1)}</span>
            <div className="sorter-bin__contents">
              {bins[binName].map((s) => <ShapeTile key={s.id} type={s.type} small />)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
        <SecondaryDarkButton
          label="Reset Shapes"
          onClick={handleReset}
        />
      </div>
    </div>
  );
}

function StationD({ isActive, onCompleteSimulate, audioEnabled }) {
  const [clueIndex, setClueIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState(() => shuffleArray(['square', 'rectangle', 'triangle', 'circle']));
  const clue = MYSTERY_CLUES[clueIndex];
  
  useEffect(() => {
    // Station D narration handled by App.js
  }, [isActive]);

  const handleAnswer = (type) => {
    if (revealed) return;
    setSelectedAnswer(type);
    setRevealed(true);
  };

  const handleNextClue = () => {
    setClueIndex((clueIndex + 1) % MYSTERY_CLUES.length);
    setRevealed(false);
    setSelectedAnswer(null);
    setShuffledOptions(shuffleArray(['square', 'rectangle', 'triangle', 'circle']));
  };

  if (!isActive) return null;

  return (
    <div className="content-card station-content-card station-d-content">
      <h3 className="station-title">🔎 Mystery Shape</h3>
      <p className="station-instruction">Read the clue and pick the matching shape!</p>
      <div className="feedback-panel">
        <p className="mystery-clue">"{clue.clue}"</p>
      </div>
      <div className="answer-grid">
        {shuffledOptions.map((type) => {
          let btnClass = 'answer-btn shape-answer-btn';
          if (revealed) {
            if (type === clue.answer) btnClass += ' answer-btn--correct';
            else if (type === selectedAnswer) btnClass += ' answer-btn--wrong';
          }
          return (
            <button
              key={type}
              className={btnClass}
              onClick={() => handleAnswer(type)}
              disabled={revealed}
            >
              <ShapeRenderer type={type} size={48} />
            </button>
          );
        })}
      </div>

      {revealed && selectedAnswer && (
        <div className={`status-banner status-banner--${selectedAnswer === clue.answer ? 'success' : 'warning'}`}>
          {selectedAnswer === clue.answer
            ? "Perfect! That's exactly right! 🎉"
            : `Not quite! The correct answer was ${clue.answer}!`}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
        <SecondaryDarkButton
          label="Next Mystery"
          onClick={handleNextClue}
        />
        <PrimaryGoldButton
          icon="🎮"
          label="Proceed to Play"
          onClick={onCompleteSimulate}
        />
      </div>
    </div>
  );
}

export default SimulateRoute;
