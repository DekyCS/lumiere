import { useState, useRef } from 'react';
import { Hash, Zap, Palette, Upload, X, Image as ImageIcon, Play } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { EASING_FUNCTIONS } from '@/lib/easing';

const CANVAS_SIZES = [
  { label: '1920 × 1080', w: 1920, h: 1080 },
  { label: '1080 × 1080', w: 1080, h: 1080 },
  { label: '1080 × 1920', w: 1080, h: 1920 },
];

const FONT_FAMILIES = [
  'Bebas Neue',
  'Anton',
  'Montserrat',
  'Poppins',
  'Oswald',
  'Raleway',
  'Roboto',
  'Bangers',
  'Permanent Marker',
  'Passion One',
  'Lilita One',
  'Arial Black',
  'Impact',
  'Helvetica',
  'Georgia',
];

const tabs = [
  { id: 'counter', label: 'Counter', icon: Hash },
  { id: 'motion', label: 'Motion', icon: Zap },
  { id: 'style', label: 'Style', icon: Palette },
];

/* ─── Helpers ─────────────────────────────────────── */

function SegmentedControl({ value, options, onChange }) {
  return (
    <div className="flex bg-[#F3EDE4] rounded-lg p-[3px] gap-[3px]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 px-2 text-[12px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
            value === opt.value
              ? 'bg-white text-[#1F1D1A] shadow-sm'
              : 'text-[#A9A29A] hover:text-[#6B6560]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="space-y-3.5">
      <h3 className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#B5AFA6]">
        {label}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FormField({ label, suffix, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-[#6B6560]">{label}</label>
        {suffix && (
          <span className="text-[11px] text-[#B5AFA6] font-['JetBrains_Mono'] font-medium">
            {suffix}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function ColorPicker({ color, onChange }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative shrink-0">
        <div
          className="w-9 h-9 rounded-full border-2 border-[#E2DAD0]"
          style={{ backgroundColor: color, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 flex-1 min-w-0 rounded-lg border border-[#E2DAD0] bg-[#F8F4ED] px-3 text-[12px] font-['JetBrains_Mono'] font-medium text-[#1F1D1A] uppercase focus:outline-none focus:border-[#C8492A] focus:ring-2 focus:ring-[#C8492A]/15 transition-colors"
      />
    </div>
  );
}

function EasingPreview({ easing }) {
  const easingFn = EASING_FUNCTIONS[easing]?.fn || EASING_FUNCTIONS.easeOut.fn;
  const points = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = easingFn(t);
    points.push(`${2 + t * 56},${42 - y * 40}`);
  }

  return (
    <div className="bg-[#FAF6F1] rounded-xl p-3 border border-[#EDE7DE]">
      <svg viewBox="0 0 60 44" className="w-full h-16">
        {/* Grid */}
        <line x1="2" y1="2" x2="2" y2="42" stroke="#E8E2D8" strokeWidth="0.5" />
        <line x1="2" y1="42" x2="58" y2="42" stroke="#E8E2D8" strokeWidth="0.5" />
        <line
          x1="2" y1="2" x2="58" y2="2"
          stroke="#E8E2D8" strokeWidth="0.5" strokeDasharray="2 2"
        />
        <line
          x1="58" y1="2" x2="58" y2="42"
          stroke="#E8E2D8" strokeWidth="0.5" strokeDasharray="2 2"
        />
        {/* Diagonal reference */}
        <line
          x1="2" y1="42" x2="58" y2="2"
          stroke="#E8E2D8" strokeWidth="0.5" strokeDasharray="3 3"
        />
        {/* Curve */}
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="#C8492A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Endpoints */}
        <circle cx="2" cy="42" r="2.5" fill="#C8492A" />
        <circle cx="58" cy="2" r="2.5" fill="#C8492A" />
      </svg>
    </div>
  );
}

/* ─── Main panel ──────────────────────────────────── */

const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-[#E2DAD0] bg-[#F8F4ED] px-3 text-sm text-[#1F1D1A] font-['JetBrains_Mono'] placeholder:text-[#C5BFB5] focus:outline-none focus:border-[#C8492A] focus:ring-2 focus:ring-[#C8492A]/15 transition-colors";

const SELECT_TRIGGER_CLASS =
  'h-10 w-full text-sm bg-[#F8F4ED] border-[#E2DAD0] hover:bg-[#F3EDE4] focus-visible:border-[#C8492A] focus-visible:ring-[#C8492A]/15';

export default function SettingsPanel({ settings, onChange }) {
  const [activeTab, setActiveTab] = useState('counter');
  const fileInputRef = useRef(null);
  const update = (key, value) => onChange({ ...settings, [key]: value });

  return (
    <div className="h-full flex flex-col panel-content">
      {/* Tab bar */}
      <div className="flex border-b border-[#E8E2D8] px-1 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-[12px] font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#C8492A] border-[#C8492A]'
                  : 'text-[#B5AFA6] border-transparent hover:text-[#6B6560]'
              }`}
            >
              <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-7">
        {/* ─── Counter ─────────────────────────── */}
        {activeTab === 'counter' && (
          <>
            <FormGroup label="Range">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Start">
                  <input
                    type="number"
                    value={settings.startNumber}
                    onChange={(e) => update('startNumber', parseFloat(e.target.value) || 0)}
                    className={INPUT_CLASS}
                  />
                </FormField>
                <FormField label="End">
                  <input
                    type="number"
                    value={settings.endNumber}
                    onChange={(e) => update('endNumber', parseFloat(e.target.value) || 0)}
                    className={INPUT_CLASS}
                  />
                </FormField>
              </div>
            </FormGroup>

            <FormGroup label="Format">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Prefix">
                  <input
                    type="text"
                    value={settings.prefix}
                    onChange={(e) => update('prefix', e.target.value)}
                    placeholder="$"
                    className={INPUT_CLASS}
                  />
                </FormField>
                <FormField label="Suffix">
                  <input
                    type="text"
                    value={settings.suffix}
                    onChange={(e) => update('suffix', e.target.value)}
                    placeholder="m"
                    className={INPUT_CLASS}
                  />
                </FormField>
              </div>
              <FormField label="Icon Prefix">
                <button
                  onClick={() =>
                    update(
                      'prefixIcon',
                      settings.prefixIcon === 'tiktok-play' ? 'none' : 'tiktok-play'
                    )
                  }
                  className={`flex items-center gap-2.5 w-full h-10 px-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    settings.prefixIcon === 'tiktok-play'
                      ? 'border-[#C8492A] bg-[#FDF0EC] text-[#C8492A]'
                      : 'border-[#E2DAD0] bg-[#F8F4ED] text-[#A9A29A] hover:border-[#C8492A]/40'
                  }`}
                >
                  <Play size={14} fill="currentColor" />
                  <span className="text-[12px] font-semibold">TikTok Views</span>
                  <span
                    className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${
                      settings.prefixIcon === 'tiktok-play' ? 'text-[#C8492A]' : 'text-[#C5BFB5]'
                    }`}
                  >
                    {settings.prefixIcon === 'tiktok-play' ? 'ON' : 'OFF'}
                  </span>
                </button>
              </FormField>
              <FormField label="Decimal Places">
                <SegmentedControl
                  value={settings.decimals}
                  options={[
                    { value: 0, label: '0' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                  ]}
                  onChange={(v) => update('decimals', v)}
                />
              </FormField>
            </FormGroup>
          </>
        )}

        {/* ─── Motion ──────────────────────────── */}
        {activeTab === 'motion' && (
          <>
            <FormGroup label="Timing">
              <FormField label="Duration" suffix={`${settings.duration}s`}>
                <Slider
                  value={[settings.duration]}
                  onValueChange={([v]) => update('duration', Math.round(v * 10) / 10)}
                  min={0.5}
                  max={10}
                  step={0.1}
                />
              </FormField>
              <FormField label="Frame Rate">
                <SegmentedControl
                  value={settings.fps}
                  options={[
                    { value: 24, label: '24 fps' },
                    { value: 30, label: '30 fps' },
                    { value: 60, label: '60 fps' },
                  ]}
                  onChange={(v) => update('fps', v)}
                />
              </FormField>
            </FormGroup>

            <FormGroup label="Easing">
              <Select
                value={settings.easing}
                onValueChange={(v) => update('easing', v)}
              >
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EASING_FUNCTIONS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <EasingPreview easing={settings.easing} />
            </FormGroup>
          </>
        )}

        {/* ─── Style ───────────────────────────── */}
        {activeTab === 'style' && (
          <>
            <FormGroup label="Colors">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Text">
                  <ColorPicker
                    color={settings.textColor}
                    onChange={(c) => update('textColor', c)}
                  />
                </FormField>
                <FormField label="Background">
                  <ColorPicker
                    color={settings.bgColor}
                    onChange={(c) => update('bgColor', c)}
                  />
                </FormField>
              </div>
            </FormGroup>

            <FormGroup label="Typography">
              <FormField label="Font Family">
                <Select
                  value={settings.fontFamily}
                  onValueChange={(v) => update('fontFamily', v)}
                >
                  <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((f) => (
                      <SelectItem key={f} value={f}>
                        <span style={{ fontFamily: f }}>{f}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField
                label="Font Size"
                suffix={settings.fontSize === 0 ? 'Auto' : `${settings.fontSize}px`}
              >
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([v]) => update('fontSize', v)}
                  min={0}
                  max={500}
                  step={1}
                />
              </FormField>
            </FormGroup>

            <FormGroup label="Canvas">
              <FormField label="Resolution">
                <Select
                  value={`${settings.canvasWidth}x${settings.canvasHeight}`}
                  onValueChange={(v) => {
                    const [w, h] = v.split('x').map(Number);
                    onChange({ ...settings, canvasWidth: w, canvasHeight: h });
                  }}
                >
                  <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CANVAS_SIZES.map((s) => (
                      <SelectItem key={s.label} value={`${s.w}x${s.h}`}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Background Image">
                {settings.bgImage ? (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E2DAD0] bg-[#F8F4ED]">
                    <ImageIcon size={16} className="text-[#A9A29A] shrink-0" />
                    <span className="text-[12px] font-medium text-[#6B6560] truncate flex-1">
                      {settings.bgImage.name}
                    </span>
                    <button
                      onClick={() => update('bgImage', null)}
                      className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg hover:bg-[#E2DAD0] text-[#A9A29A] hover:text-[#6B6560] transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#E2DAD0] rounded-xl p-5 text-center cursor-pointer hover:border-[#C8492A] hover:bg-[#FDF0EC] transition-all duration-200 group"
                  >
                    <Upload
                      size={18}
                      className="mx-auto mb-2 text-[#C5BFB5] group-hover:text-[#C8492A] transition-colors"
                    />
                    <p className="text-[12px] font-medium text-[#6B6560]">Click to upload</p>
                    <p className="text-[10px] text-[#B5AFA6] mt-1">PNG, JPG, WebP</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    update('bgImage', file);
                  }}
                />
              </FormField>
            </FormGroup>
          </>
        )}
      </div>
    </div>
  );
}
