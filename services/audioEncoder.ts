"use client";

/**
 * Encodeur audio côté client — convertit n'importe quel Blob audio
 * (WebM/Opus, MP4, etc. capturé par MediaRecorder) en WAV 16 kHz mono.
 *
 * Pourquoi ? Les APIs Hugging Face (Whisper, MMS) acceptent nativement
 * le WAV/FLAC mais tolèrent mal les codecs propriétaires du navigateur.
 * En envoyant du WAV 16 kHz mono, on maximise les chances de bonne
 * transcription, quelle que soit la plateforme (Chrome, Firefox, Edge).
 */

export interface EncodeResult {
  wav: Blob;
  durationSeconds: number;
  sampleRate: number;
}

export async function encodeBlobAsWav16kMono(
  input: Blob
): Promise<EncodeResult> {
  const arrayBuffer = await input.arrayBuffer();

  const AudioContextCtor =
    typeof window !== "undefined"
      ? window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      : undefined;

  if (!AudioContextCtor) {
    throw new Error("AudioContext non supporté par ce navigateur.");
  }

  // 1) Décodage du blob compressé (WebM/Opus, etc.)
  const decodeCtx = new AudioContextCtor();
  let sourceBuffer: AudioBuffer;
  try {
    sourceBuffer = await decodeCtx.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    await decodeCtx.close().catch(() => {});
  }

  // 2) Rééchantillonnage à 16 kHz + downmix mono via OfflineAudioContext
  const targetSampleRate = 16000;
  const targetLength = Math.max(
    1,
    Math.ceil(sourceBuffer.duration * targetSampleRate)
  );

  const offline = new OfflineAudioContext(1, targetLength, targetSampleRate);

  // Downmix : on mixe tous les canaux dans le canal mono cible.
  const monoBuffer = offline.createBuffer(
    1,
    sourceBuffer.length,
    sourceBuffer.sampleRate
  );
  const monoData = monoBuffer.getChannelData(0);
  const channels = sourceBuffer.numberOfChannels;
  for (let ch = 0; ch < channels; ch++) {
    const data = sourceBuffer.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      monoData[i] += data[i] / channels;
    }
  }

  const source = offline.createBufferSource();
  source.buffer = monoBuffer;
  source.connect(offline.destination);
  source.start(0);

  const rendered = await offline.startRendering();
  const pcm = rendered.getChannelData(0);

  // 3) Encodage PCM 16-bit little-endian dans un conteneur WAV.
  const wav = encodePcmToWav(pcm, targetSampleRate);

  return {
    wav,
    durationSeconds: sourceBuffer.duration,
    sampleRate: targetSampleRate,
  };
}

function encodePcmToWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  // En-tête WAV / RIFF
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (PCM)
  view.setUint16(20, 1, true); // AudioFormat 1 = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // ByteRate
  view.setUint16(32, numChannels * bytesPerSample, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Corps : conversion float32 [-1, 1] → int16 signé.
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}
