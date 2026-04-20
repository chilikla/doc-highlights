import { useRef } from "react";
import type { Highlight } from "../types";
import { getColor, COLOR_MAP } from "../colors";

interface Props {
  onUpload: (file: File) => void;
  loading: boolean;
  selectedColor: string;
  onColorChange: (color: string) => void;
  highlights: Highlight[];
  fileName: string | null;
}

export function Sidebar({ onUpload, loading, selectedColor, onColorChange, highlights, fileName }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);

  const uniqueColors = [...new Set(highlights.map((h) => h.color))].sort((a, b) => {
    const order = Object.keys(COLOR_MAP);
    return order.indexOf(a) - order.indexOf(b);
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      pendingFile.current = file;
      onUpload(file);
    }
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-5 p-5 border-r border-slate-700 bg-slate-900/60 min-h-screen">
      <div>
        <h1 className="text-lg font-bold text-slate-100 mb-1">הדגשות מסמך</h1>
        <p className="text-xs text-slate-400">טעני קובץ Word להצגת ההדגשות</p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">בחרי קובץ</span>
        <input
          ref={inputRef}
          type="file"
          accept=".docx"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm text-right transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed border border-slate-600"
        >
          {fileName ? (
            <span className="truncate block" title={fileName}>{fileName}</span>
          ) : (
            "בחרי קובץ .docx"
          )}
        </button>

        {loading && (
          <p className="text-xs text-slate-400 text-right">טוען הדגשות...</p>
        )}
      </div>

      {highlights.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">סנני לפי צבע</span>
          <select
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-200 text-sm text-right cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-500"
            dir="rtl"
          >
            <option value="">הכל ({highlights.length})</option>
            {uniqueColors.map((color) => {
              const info = getColor(color);
              const count = highlights.filter((h) => h.color === color).length;
              return (
                <option key={color} value={color}>
                  {info.label} ({count})
                </option>
              );
            })}
          </select>

          <div className="flex flex-wrap gap-1.5 mt-1">
            {uniqueColors.map((color) => {
              const info = getColor(color);
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  title={info.label}
                  onClick={() => onColorChange(active ? "" : color)}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer"
                  style={{
                    backgroundColor: info.hex,
                    borderColor: active ? "#e2e8f0" : "transparent",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
