import { useState } from "react";
import type { Highlight } from "./types";
import { Sidebar } from "./components/Sidebar";
import { HighlightList } from "./components/HighlightList";

export default function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setLoading(true);
    setError(null);
    setFileName(file.name);
    setSelectedColor("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? `שגיאה ${res.status}`);
      }
      const data = await res.json();
      setHighlights(data.highlights);
      setLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה לא ידועה");
      setHighlights([]);
      setLoaded(false);
    } finally {
      setLoading(false);
    }
  }

  const filtered = selectedColor
    ? highlights.filter((h) => h.color === selectedColor)
    : highlights;

  return (
    <div dir="rtl" className="min-h-screen flex flex-row bg-slate-950 text-slate-100">
      <Sidebar
        onUpload={handleUpload}
        loading={loading}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        highlights={highlights}
        fileName={fileName}
      />

      <HighlightList highlights={filtered} loaded={loaded} />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/80 border border-red-700 text-red-200 text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
