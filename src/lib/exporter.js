import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { drawFrame } from './renderer';

/**
 * Export animation as MP4 using WebCodecs + mp4-muxer.
 * @param {HTMLCanvasElement} canvas
 * @param {object} settings
 * @param {HTMLImageElement|null} bgImageEl
 * @param {function} onProgress - callback(0..1)
 * @returns {Promise<void>}
 */
export async function exportMP4(canvas, settings, bgImageEl, onProgress) {
  const width = settings.canvasWidth;
  const height = settings.canvasHeight;
  const fps = settings.fps;
  const totalFrames = Math.ceil(settings.duration * fps);
  const ctx = canvas.getContext('2d');

  // Ensure canvas matches export dimensions
  canvas.width = width;
  canvas.height = height;

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width,
      height,
    },
    fastStart: 'in-memory',
  });

  let encodedFrames = 0;

  const encoder = new VideoEncoder({
    output: (chunk, meta) => {
      muxer.addVideoChunk(chunk, meta);
    },
    error: (e) => {
      console.error('VideoEncoder error:', e);
    },
  });

  encoder.configure({
    codec: 'avc1.640028',
    width,
    height,
    bitrate: 8_000_000,
    framerate: fps,
  });

  for (let i = 0; i < totalFrames; i++) {
    const progress = totalFrames <= 1 ? 1 : i / (totalFrames - 1);
    drawFrame(ctx, width, height, progress, settings, bgImageEl);

    const frame = new VideoFrame(canvas, {
      timestamp: (i * 1_000_000) / fps,
      duration: 1_000_000 / fps,
    });

    const keyFrame = i % (fps * 2) === 0; // keyframe every ~2s
    encoder.encode(frame, { keyFrame });
    frame.close();

    encodedFrames++;
    onProgress(encodedFrames / totalFrames);

    // Yield to UI thread periodically
    if (i % 5 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  await encoder.flush();
  encoder.close();
  muxer.finalize();

  const buffer = muxer.target.buffer;
  const blob = new Blob([buffer], { type: 'video/mp4' });

  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'counter.mp4';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
