import type { Highlight } from "../types";
import { getColor, getTextColor } from "../colors";

interface Props {
  highlights: Highlight[];
  loaded: boolean;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${parseInt(day)}.${parseInt(month)}.${year}`;
}

interface DateGroup {
  date: string | null;
  date_note: string | null;
  items: Highlight[];
}

function groupByDate(highlights: Highlight[]): DateGroup[] {
  const groups: DateGroup[] = [];
  let current: DateGroup | null = null;

  for (const h of highlights) {
    if (!current || current.date !== h.date || current.date_note !== h.date_note) {
      current = { date: h.date, date_note: h.date_note, items: [] };
      groups.push(current);
    }
    current.items.push(h);
  }

  return groups;
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

  const groups = groupByDate(highlights);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <p className="text-xs text-slate-500 mb-4">
        {highlights.length} הארות
      </p>
      <div className="flex flex-col gap-6">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.date && (
              <div dir="rtl" className="mb-3 flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-slate-300">
                  {formatDate(group.date)}
                </span>
                {group.date_note && (
                  <span className="text-xs text-slate-500">{group.date_note}</span>
                )}
              </div>
            )}
            <div className="flex flex-col gap-3">
              {group.items.map((h, i) => {
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
        ))}
      </div>
    </div>
  );
}
