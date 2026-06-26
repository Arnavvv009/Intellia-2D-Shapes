import { audioMap } from './audioMap.js';

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  cheer: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
};

// Single source of truth for audio state
let currentPlaybackId = null;
let activeAudioElements = new Set();

// Segment helpers
export function say(text) {
  return { text, style: 'statement' };
}
export function ask(text) {
  return { text, style: 'question' };
}
export function cheer(text) {
  return { text, style: 'cheer' };
}
export function emphasize(text) {
  return { text, style: 'emphasis' };
}
export function think(text) {
  return { text, style: 'thinking' };
}
export function celebrate(text) {
  return { text, style: 'celebration' };
}
export function instruct(text) {
  return { text, style: 'instruction' };
}

// Get audio URL (only local or API)
async function getAudioUrl(text, style) {
  if (audioMap[text]) {
    return audioMap[text];
  }
  
  if (!API_KEY) return null;
  
  const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: settings,
      }),
    });
    
    if (!response.ok) return null;
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('Error fetching audio:', e);
    return null;
  }
}

// Stop narration completely and instantly
export function stopNarration() {
  // Invalidate the current playback ID to prevent any future audio from playing
  currentPlaybackId = null;
  
  // Stop ALL active audio elements
  activeAudioElements.forEach((audio) => {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
    } catch (e) {
      console.error('Error stopping audio element:', e);
    }
  });
  
  // Clear all active elements
  activeAudioElements.clear();
}

// Narrate an array of segments (only one narration active at a time)
export async function narrate(segments) {
  // 1. FIRST: Stop EVERYTHING that's playing
  stopNarration();
  
  // 2. Check if we have segments to play
  if (!segments || segments.length === 0) return;
  
  // 3. Generate a unique ID for this new playback session
  const playbackId = Math.random().toString(36).substring(7);
  currentPlaybackId = playbackId;
  
  // 4. Play each segment one by one
  for (let i = 0; i < segments.length; i++) {
    // Before each step, check if we should still be playing
    if (currentPlaybackId !== playbackId) {
      return; // Exit immediately if a new playback has started
    }
    
    const segment = segments[i];
    const url = await getAudioUrl(segment.text, segment.style);
    
    // Check again after the async audio URL fetch
    if (currentPlaybackId !== playbackId) {
      return;
    }
    
    // Play the segment if we have a URL
    if (url) {
      await new Promise((resolve) => {
        const audio = new Audio(url);
        activeAudioElements.add(audio);
        
        const cleanup = () => {
          activeAudioElements.delete(audio);
          audio.onended = null;
          audio.onerror = null;
        };
        
        audio.onended = () => {
          cleanup();
          resolve();
        };
        
        audio.onerror = () => {
          cleanup();
          resolve();
        };
        
        audio.play().catch(() => {
          cleanup();
          resolve();
        });
        
        // Double-check before resolving - if playback ID changed, resolve immediately
        const checkInterval = setInterval(() => {
          if (currentPlaybackId !== playbackId) {
            clearInterval(checkInterval);
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch (e) {}
            cleanup();
            resolve();
          }
        }, 50);
        
        // Clear interval when done
        audio.onended = () => {
          clearInterval(checkInterval);
          cleanup();
          resolve();
        };
        audio.onerror = () => {
          clearInterval(checkInterval);
          cleanup();
          resolve();
        };
      });
    }
  }
}
