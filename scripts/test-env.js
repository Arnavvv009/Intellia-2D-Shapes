import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
console.log('All env vars:', Object.keys(process.env));
console.log('VITE_ELEVENLABS_API_KEY:', process.env.VITE_ELEVENLABS_API_KEY ? 'Yes' : 'No');
if (process.env.VITE_ELEVENLABS_API_KEY) {
  console.log('Key starts with:', process.env.VITE_ELEVENLABS_API_KEY.slice(0, 10));
}
