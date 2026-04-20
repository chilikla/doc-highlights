import type { Highlight } from "../types";
import { getColor, getTextColor } from "../colors";

interface Props {
  highlights: Highlight[];
  loaded: boolean;
}

export function HighlightList({ highlights, loaded }: Props) {
  if (!loaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center text-slate-500">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg font-medium text-slate-400">טעני קובץ Word</p>
          <p className="text-sm mt-1">בחרי קובץ docx. עם הארות כדי להתחיל</p>
        </div>
      </div>
    );
  }

  if (highlights.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center text-slate-500">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium text-slate-400">לא נמצאו הארות</p>
          <p className="text-sm mt-1">נסי לבחור צבע אחר או טעני מסמך אחר</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <p className="text-xs text-slate-500 mb-4">
        {highlights.length} הארות
      </p>
      <div className="flex flex-col gap-3">
        {highlights.map((h, i) => {
          const info = getColor(h.color);
          return (
            <div
              key={i}
              dir="auto"
              className="rounded-lg px-4 py-3 text-slate-900 text-sm leading-relaxed border border-slate-200 bg-white"
              style={{ borderRightWidth: "4px", borderRightColor: info.hex }}
            >
              <span
                className="inline-block rounded px-1 -mx-1"
                style={{ backgroundColor: info.hex, color: getTextColor(info.hex) }}
              >
                {h.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
