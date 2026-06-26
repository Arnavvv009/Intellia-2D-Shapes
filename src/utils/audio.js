import { audioMap } from './audioMap.js';

// Single source of truth for audio state
let currentPlaybackId = null;
let activeAudioElements = new Set();

// Preload all audio assets
const preloadedAudio = new Map();
Object.entries(audioMap).forEach(([text, url]) => {
  const audio = new Audio(url);
  audio.preload = 'auto';
  preloadedAudio.set(text, audio);
});

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

// Get audio URL (only local!)
function getAudioUrl(text) {
  return audioMap[text] || null;
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
    const url = getAudioUrl(segment.text);
    
    // Check again
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
