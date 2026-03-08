import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import SettingsPanel from './components/SettingsPanel';
import PreviewCanvas from './components/PreviewCanvas';

const DEFAULT_SETTINGS = {
  startNumber: 0,
  endNumber: 17.2,
  prefix: '',
  suffix: 'm',
  decimals: 1,
  duration: 2.5,
  fps: 30,
  easing: 'easeOut',
  textColor: '#ffffff',
  fontSize: 0, // 0 = auto
  fontFamily: 'Poppins',
  prefixIcon: 'none', // 'none' | 'tiktok-play'
  bgColor: '#000000',
  bgImage: null,
  canvasWidth: 1920,
  canvasHeight: 1080,
};

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#FAF6F1]">
      {/* Header */}
      <header className="h-[56px] shrink-0 flex items-center justify-between px-5 border-b border-[#E8E2D8] bg-white/70 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#C8492A] flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold font-mono">#</span>
          </div>
          <h1 className="text-[19px] font-['Instrument_Serif'] text-[#1F1D1A] italic tracking-tight leading-none">
            Lumière
          </h1>
          <div className="w-px h-5 bg-[#E8E2D8]" />
          <span className="text-[10px] text-[#B5AFA6] font-semibold tracking-[0.18em] uppercase">
            Counter Studio
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-[#B5AFA6]">
            by{' '}
            <a
              href="https://omarlahloumimi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8492A] hover:text-[#A93D23] font-medium transition-colors"
            >
              Omar Lahlou Mimi
            </a>
          </span>
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`h-8 px-3.5 flex items-center gap-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              panelOpen
                ? 'bg-[#C8492A] text-white shadow-sm shadow-[#C8492A]/20'
                : 'bg-[#F3EDE4] text-[#6B6560] hover:bg-[#EBE4DA]'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Preview area */}
        <div className="flex-1 flex min-w-0">
          <PreviewCanvas settings={settings} />
        </div>

        {/* Settings panel */}
        <div
          className={`shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
            panelOpen ? 'w-[380px] border-l border-[#E8E2D8]' : 'w-0'
          }`}
        >
          <div className="w-[380px] h-full bg-white">
            <SettingsPanel settings={settings} onChange={setSettings} />
          </div>
        </div>
      </div>
    </div>
  );
}
