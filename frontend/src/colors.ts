import type { ColorInfo } from "./types";

export const COLOR_MAP: Record<string, ColorInfo> = {
  yellow:        { hex: "#FFE066", label: "צהוב" },
  bright_green:  { hex: "#57FF57", label: "ירוק בהיר" },
  turquoise:     { hex: "#40E0D0", label: "טורקיז" },
  cyan:          { hex: "#00CFCF", label: "ציאן" },
  magenta:       { hex: "#FF69B4", label: "מגנטה" },
  red:           { hex: "#FF4444", label: "אדום" },
  dark_blue:     { hex: "#4169E1", label: "כחול כהה" },
  teal:          { hex: "#20B2AA", label: "טיל" },
  green:         { hex: "#3CB371", label: "ירוק" },
  violet:        { hex: "#9370DB", label: "סגול" },
  dark_red:      { hex: "#CD5C5C", label: "אדום כהה" },
  dark_yellow:   { hex: "#DAA520", label: "צהוב כהה" },
  dark_gray:     { hex: "#808080", label: "אפור כהה" },
  light_gray:    { hex: "#D3D3D3", label: "אפור בהיר" },
  black:         { hex: "#374151", label: "שחור" },
  white:         { hex: "#F1F5F9", label: "לבן" },
};

export function getColor(name: string): ColorInfo {
  return COLOR_MAP[name] ?? { hex: "#94a3b8", label: name };
}
