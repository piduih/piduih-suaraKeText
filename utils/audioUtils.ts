
// This Blob type is not exported from the SDK, so we define it locally.
interface GeminiBlob {
  data: string;
  mimeType: string;
}

/**
 * Encodes a Uint8Array into a base64 string.
 * This is a required utility for the Gemini Live API.
 */
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts raw audio data (Float32Array) to a 16-bit PCM Blob
 * in the format required by the Gemini Live API.
 * @param data The raw audio data from the microphone.
 * @returns A GeminiBlob object.
 */
export function createPcmBlob(data: Float32Array): GeminiBlob {
  const l = data.length;
  const int16 = new Int16Array(l);

  // Convert Float32 to Int16
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  
  const uint8 = new Uint8Array(int16.buffer);
  const base64Data = encode(uint8);

  return {
    data: base64Data,
    mimeType: 'audio/pcm;rate=16000',
  };
}
