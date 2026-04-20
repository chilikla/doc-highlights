import type { ColorInfo } from "./types";

// Matches WD_COLOR_INDEX highlight colors from python-docx / Word
export const COLOR_MAP: Record<string, ColorInfo> = {
  yellow:        { hex: "#FFE066", label: "צהוב" },
  bright_green:  { hex: "#57FF57", label: "ירוק בהיר" },
  turquoise:     { hex: "#40E0D0", label: "טורקיז" },
  pink:          { hex: "#FF69B4", label: "ורוד" },
  red:           { hex: "#FF4444", label: "אדום" },
  blue:          { hex: "#4F8EF7", label: "כחול" },
  dark_blue:     { hex: "#1E3A8A", label: "כחול כהה" },
  teal:          { hex: "#20B2AA", label: "טיל" },
  green:         { hex: "#3CB371", label: "ירוק" },
  violet:        { hex: "#9370DB", label: "סגול" },
  dark_red:      { hex: "#CD5C5C", label: "אדום כהה" },
  dark_yellow:   { hex: "#DAA520", label: "צהוב כהה" },
  gray_50:       { hex: "#808080", label: "אפור כהה" },
  gray_25:       { hex: "#D3D3D3", label: "אפור בהיר" },
  black:         { hex: "#374151", label: "שחור" },
  white:         { hex: "#E2E8F0", label: "לבן" },
};

export function getColor(name: string): ColorInfo {
  return COLOR_MAP[name] ?? { hex: "#94a3b8", label: name };
}
