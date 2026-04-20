import type { Highlight } from "../types";
import { getColor } from "../colors";

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
          <p className="text-lg font-medium text-slate-400">טען קובץ Word</p>
          <p className="text-sm mt-1">בחר קובץ .docx עם הדגשות כדי להתחיל</p>
        </div>
      </div>
    );
  }

  if (highlights.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center text-slate-500">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium text-slate-400">לא נמצאו הדגשות</p>
          <p className="text-sm mt-1">נסה לבחור צבע אחר או טען מסמך אחר</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <p className="text-xs text-slate-500 mb-4 text-right">
        {highlights.length} הדגשות
      </p>
      <div className="flex flex-col gap-3">
        {highlights.map((h, i) => {
          const info = getColor(h.color);
          return (
            <div
              key={i}
              className="rounded-lg px-4 py-3 text-right text-slate-200 text-sm leading-relaxed border border-slate-700 bg-slate-800/50"
              style={{ borderRightWidth: "4px", borderRightColor: info.hex }}
            >
              <span
                className="inline-block rounded px-1 -mx-1"
                style={{ backgroundColor: info.hex + "26" }}
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
