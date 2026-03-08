import { useRef, useEffect, useCallback, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import ExportButton from './ExportButton';
import { drawFrame } from '@/lib/renderer';
import { exportMP4 } from '@/lib/exporter';

export default function PreviewCanvas({ settings }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [bgImageEl, setBgImageEl] = useState(null);

  // Load background image when settings.bgImage changes
  useEffect(() => {
    if (!settings.bgImage) {
      setBgImageEl(null);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(settings.bgImage);
    img.onload = () => {
      setBgImageEl(img);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setBgImageEl(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [settings.bgImage]);

  // Draw first frame (static preview) when settings change
  useEffect(() => {
    if (playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = settings.canvasWidth;
    canvas.height = settings.canvasHeight;
    const ctx = canvas.getContext('2d');
    drawFrame(ctx, settings.canvasWidth, settings.canvasHeight, 0, settings, bgImageEl);
  }, [settings, bgImageEl, playing]);

  // Play animation
  const handlePlay = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    const canvas = canvasRef.current;
    canvas.width = settings.canvasWidth;
    canvas.height = settings.canvasHeight;
    const ctx = canvas.getContext('2d');
    const startTime = performance.now();
    const durationMs = settings.duration * 1000;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      drawFrame(ctx, settings.canvasWidth, settings.canvasHeight, progress, settings, bgImageEl);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setPlaying(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [settings, bgImageEl, playing]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleExport = useCallback(
    async (onProgress) => {
      const canvas = canvasRef.current;
      await exportMP4(canvas, settings, bgImageEl, onProgress);
    },
    [settings, bgImageEl]
  );

  const aspectRatio = settings.canvasWidth / settings.canvasHeight;

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-6 flex-1 min-w-0">
      {/* Canvas with elegant frame */}
      <div className="w-full flex items-center justify-center flex-1 min-h-0">
        <div className="relative group canvas-frame">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[calc(100vh-180px)] rounded-2xl block"
            style={{
              aspectRatio,
              boxShadow:
                '0 1px 3px rgba(31,29,26,0.02), 0 4px 12px rgba(31,29,26,0.04), 0 16px 40px rgba(31,29,26,0.06), 0 32px 80px rgba(31,29,26,0.04)',
            }}
          />
          {/* Dimensions badge — shows on hover */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="text-[10px] text-white/90 font-['JetBrains_Mono'] tracking-wide">
              {settings.canvasWidth} × {settings.canvasHeight}
            </span>
          </div>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlay}
          disabled={playing}
          className="h-11 w-11 flex items-center justify-center rounded-full bg-[#1F1D1A] text-white hover:bg-[#3A3630] active:scale-95 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-[#1F1D1A]/15 cursor-pointer disabled:cursor-not-allowed"
          title="Play animation"
        >
          {playing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Play size={18} fill="white" className="ml-0.5" />
          )}
        </button>
        <ExportButton onExport={handleExport} />
      </div>
    </div>
  );
}
