export interface Highlight {
  text: string;
  color: string;
  para_index: number;
  date: string | null;
  date_note: string | null;
}

export interface ColorInfo {
  hex: string;
  label: string;
}
