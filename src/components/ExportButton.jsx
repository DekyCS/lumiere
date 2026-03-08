import { useState } from 'react';
import { Download } from 'lucide-react';

export default function ExportButton({ onExport }) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);
    try {
      await onExport((p) => setProgress(p));
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="h-11 px-6 flex items-center gap-2.5 rounded-full bg-[#C8492A] text-white text-sm font-semibold hover:bg-[#A93D23] active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#C8492A]/20 cursor-pointer"
    >
      {exporting ? (
        <>
          <span className="font-['JetBrains_Mono'] text-xs font-medium">
            {Math.round(progress * 100)}%
          </span>
          <div className="w-16 bg-white/25 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-150 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </>
      ) : (
        <>
          <Download size={15} />
          <span>Export MP4</span>
        </>
      )}
    </button>
  );
}
