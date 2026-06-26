import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

function AudioToggleFAB({ audioEnabled, onToggle }) {
  return (
    <button className="audio-fab" onClick={onToggle} aria-label="Toggle narration">
      {audioEnabled ? <Volume2 size={28} color="#1B1442" /> : <VolumeX size={28} color="#1B1442" />}
    </button>
  );
}

export default AudioToggleFAB;
