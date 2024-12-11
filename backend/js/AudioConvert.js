require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

class AudioConverter {
  constructor() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set in environment variables');
    }
    
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech';
    this.dataDir = path.join(process.cwd(), 'data');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  async generateAndConvertAudio(text, voiceId, outputFilename = 'output') {
    try {
      // Generate paths for audio files
      const mp3File = path.join(this.dataDir, `${outputFilename}.mp3`);
      const wavFile = path.join(this.dataDir, `${outputFilename}.wav`);

      // Generate audio using ElevenLabs API
      const response = await fetch(`${this.baseUrl}/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      // Get the audio buffer and save as MP3
      const audioBuffer = await response.arrayBuffer();
      await fs.promises.writeFile(mp3File, Buffer.from(audioBuffer));

      // Convert to WAV using fluent-ffmpeg
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(mp3File)
          .audioCodec('pcm_mulaw')
          .audioChannels(1)
          .audioFrequency(8000)
          .on('end', resolve)
          .on('error', reject)
          .save(wavFile);
      });

      // Clean up MP3 file
      await fs.promises.unlink(mp3File);

      // Read the WAV file as a buffer
      const wavBuffer = await fs.promises.readFile(wavFile);
      
      return {
        buffer: wavBuffer,
        filepath: wavFile
      };

    } catch (error) {
      throw new Error(`Error processing audio: ${error.message}`);
    }
  }
}

module.exports = AudioConverter;