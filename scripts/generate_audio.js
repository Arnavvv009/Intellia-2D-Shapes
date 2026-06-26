import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
console.log('API Key loaded:', API_KEY ? 'Yes (length: ' + API_KEY.length + ')' : 'No');
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

const phrases = [
  // Landing
  { text: "Ready for a shape-tastic adventure?", style: 'statement' },
  
  // Wonder
  { text: "Hey there! Ready to explore the world of shapes?", style: 'question' },
  { text: "Look closely at this image of a city.", style: 'instruction' },
  { text: "What shapes do you see?", style: 'question' },
  { text: "Let's count together!", style: 'cheer' },
  
  // Story
  { text: "Meet Zara and Leo, the shape explorers!", style: 'statement' },
  { text: "Zara loves squares and rectangles because they're so stable.", style: 'statement' },
  { text: "Leo adores triangles—they're the strongest shapes!", style: 'statement' },
  { text: "And circles? Well, they roll perfectly!", style: 'cheer' },
  
  // Station A
  { text: "Welcome to Shape Builder Station!", style: 'celebration' },
  { text: "Choose a shape to build:", style: 'instruction' },
  { text: "Drag the pieces to make your shape!", style: 'instruction' },
  
  // Station B
  { text: "Now, let's count sides and corners!", style: 'statement' },
  { text: "Tap the buttons to count sides or corners of the shape.", style: 'instruction' },
  
  // Station C
  { text: "Time to sort shapes!", style: 'cheer' },
  { text: "Drag each shape to the correct bin!", style: 'instruction' },
  
  // Station D
  { text: "Guess the mystery shape!", style: 'question' },
  { text: "Use the hints to figure it out!", style: 'instruction' },
  
  // Play
  { text: "Let's play!", style: 'celebration' },
  { text: "Choose a world to play!", style: 'instruction' },
  { text: "What shape is this?", style: 'question' },
  { text: "How many sides does this shape have?", style: 'question' },
  { text: "How many corners does this shape have?", style: 'question' },
  
  // Reflect
  { text: "Great job, shape explorer!", style: 'celebration' },
  { text: "Let's look at what you learned!", style: 'instruction' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 50);
}

async function generateAudio(text, style, index) {
  return new Promise((resolve, reject) => {
    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
    const payload = JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: settings
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    console.log('Requesting with headers:', { ...options.headers, 'xi-api-key': '***' });

    const req = https.request(options, (res) => {
      console.log('Response status:', res.statusCode);
      console.log('Response headers:', res.headers);
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (res.statusCode !== 200) {
          console.error('Error response body:', buffer.toString());
          reject(new Error(`HTTP ${res.statusCode}: ${buffer.toString()}`));
          return;
        }
        const filename = `${slugify(text)}_${index}.mp3`;
        const filepath = path.join(__dirname, '../public/assets/audio', filename);
        fs.writeFileSync(filepath, buffer);
        resolve(filename);
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  const audioDir = path.join(__dirname, '../public/assets/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const audioMap = {};
  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    console.log(`Generating audio ${i + 1}/${phrases.length}: "${text}"`);
    try {
      const filename = await generateAudio(text, style, i);
      audioMap[text] = `/assets/audio/${filename}`;
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(err);
    }
  }

  const audioMapCode = `export const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, '../src/utils/audioMap.js'), audioMapCode);
  console.log('Audio generation complete! audioMap.js updated.');
}

main();
