import type { ColorInfo } from "./types";

// Exact hex values used by Microsoft Word for highlight colors (WD_COLOR_INDEX)
export const COLOR_MAP: Record<string, ColorInfo> = {
  yellow:        { hex: "#FFFF00", label: "צהוב" },
  bright_green:  { hex: "#00FF00", label: "ירוק בהיר" },
  turquoise:     { hex: "#00FFFF", label: "טורקיז" },
  pink:          { hex: "#FF00FF", label: "ורוד" },
  red:           { hex: "#FF0000", label: "אדום" },
  blue:          { hex: "#0000FF", label: "כחול" },
  dark_blue:     { hex: "#000080", label: "כחול כהה" },
  teal:          { hex: "#008080", label: "טיל" },
  green:         { hex: "#008000", label: "ירוק" },
  violet:        { hex: "#800080", label: "סגול" },
  dark_red:      { hex: "#800000", label: "אדום כהה" },
  dark_yellow:   { hex: "#808000", label: "צהוב כהה" },
  gray_50:       { hex: "#808080", label: "אפור כהה" },
  gray_25:       { hex: "#C0C0C0", label: "אפור בהיר" },
  black:         { hex: "#000000", label: "שחור" },
  white:         { hex: "#FFFFFF", label: "לבן" },
};

export function getColor(name: string): ColorInfo {
  return COLOR_MAP[name] ?? { hex: "#94a3b8", label: name };
}
