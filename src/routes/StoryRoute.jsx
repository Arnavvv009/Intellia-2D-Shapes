import React, { useState, useEffect } from 'react';
import { STORY_SLIDES } from '../data/storyContent';
import Mascot from '../components/shared/Mascot';
import SpeechBubble from '../components/shared/SpeechBubble';
import HintPill from '../components/shared/HintPill';
import SecondaryDarkButton from '../components/shared/SecondaryDarkButton';
import { narrate, stopNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';

function StoryRoute({ onCompleteStory, audioEnabled, slideIndex, setSlideIndex }) {
  const slide = STORY_SLIDES[slideIndex];
  const total = STORY_SLIDES.length;
  const pct = Math.round(((slideIndex + 1) / total) * 100);

  // Story narration handled by App.js
  useEffect(() => {
  }, [slideIndex]);
  
  return (
    <div className="phase-screen">
      <div className="slide-progress-row">
        <span>Slide {slideIndex + 1} of {total}</span>
        <div className="slide-progress-dots">
          {STORY_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`slide-dot ${i === slideIndex ? 'slide-dot--current' : ''}`}
            />
          ))}
        </div>
        <span>{pct}%</span>
      </div>
      <div className="content-card story-card" style={{ marginBottom: '20px' }}>
        <div className="story-illustration">
  <img
    src={slide.illustrationImage}
    alt={slide.title}
    style={{
      width: '100%',
      height: '268px',
      borderRadius: '12px',
      objectFit: 'cover'
    }}
  />
</div>
        <h2 className="story-title">{slide.title}</h2>
        <p className="story-body">{slide.body}</p>
        <HintPill text={slide.fact} />
        <div className="mascot-greeting" style={{ marginTop: '20px' }}>
          <Mascot mood="happy" small />
          <SpeechBubble>{slide.mascotNudge}</SpeechBubble>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {slideIndex > 0 && (
          <SecondaryDarkButton
            label="← Previous"
            onClick={() => setSlideIndex(slideIndex - 1)}
          />
        )}
        <SecondaryDarkButton
          label={slideIndex === total - 1 ? 'Continue to Simulate →' : 'Next →'}
          onClick={() => {
            if (slideIndex < total - 1) {
              setSlideIndex(slideIndex + 1);
            } else {
              onCompleteStory();
            }
          }}
        />
      </div>
    </div>
  );
}

export default StoryRoute;
