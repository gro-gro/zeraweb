"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ── Types ─────────────────────────────────────────────── */
interface Element {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  type: "word" | "emoji";
}

/* ── Initial elements (match NarrativeSection words) ───── */
const INITIAL: Element[] = [
  { id: "construimos", text: "Construimos", x: 0, y: 120, fontSize: 72, type: "word" },
  { id: "narrativa", text: "narrativa", x: 0, y: 200, fontSize: 72, type: "word" },
  { id: "desde", text: "desde", x: 370, y: 200, fontSize: 72, type: "word" },
  { id: "emoji-puzzle", text: "🧩", x: 0, y: 240, fontSize: 96, type: "emoji" },
  { id: "tematicas", text: "temáticas", x: 0, y: 340, fontSize: 72, type: "word" },
  { id: "plus", text: "+", x: 380, y: 340, fontSize: 72, type: "word" },
  { id: "emoji-people", text: "👥", x: 430, y: 240, fontSize: 96, type: "emoji" },
  { id: "personas", text: "personas", x: 430, y: 340, fontSize: 72, type: "word" },
];

/* ── Component ─────────────────────────────────────────── */
export default function LayoutBuilder() {
  const [elements, setElements] = useState<Element[]>(INITIAL);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  /* ── Drag handlers ───────────────────────────────────── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      const el = elements.find((el) => el.id === id);
      if (!el) return;
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      dragRef.current = {
        id,
        offsetX: e.clientX - el.x,
        offsetY: e.clientY - el.y,
      };
      setSelected(id);
    },
    [elements]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const { id, offsetX, offsetY } = dragRef.current;
      const newX = Math.round(e.clientX - offsetX);
      const newY = Math.round(e.clientY - offsetY);
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, x: newX, y: newY } : el))
      );
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  /* ── Keyboard nudge (arrow keys, 1px precision) ──────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selected) return;
      const step = e.shiftKey ? 10 : 1;
      let dx = 0,
        dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      if (e.key === "ArrowRight") dx = step;
      if (e.key === "ArrowUp") dy = -step;
      if (e.key === "ArrowDown") dy = step;
      if (dx === 0 && dy === 0) return;
      e.preventDefault();
      setElements((prev) =>
        prev.map((el) =>
          el.id === selected ? { ...el, x: el.x + dx, y: el.y + dy } : el
        )
      );
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected]);

  /* ── Font size change ────────────────────────────────── */
  const changeFontSize = (id: string, delta: number) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? { ...el, fontSize: Math.max(12, el.fontSize + delta) }
          : el
      )
    );
  };

  /* ── Copy positions as JSON ──────────────────────────── */
  const copyPositions = () => {
    const data = elements.map(({ id, text, x, y, fontSize, type }) => ({
      id,
      text,
      x,
      y,
      fontSize,
      type,
    }));
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Deselect on canvas click ────────────────────────── */
  const handleCanvasClick = () => setSelected(null);

  /* ── Selected element data ───────────────────────────── */
  const selectedEl = elements.find((el) => el.id === selected);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* ── Toolbar ────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-neutral-900 border-b border-neutral-800 px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold tracking-wide uppercase text-neutral-400">
            Layout Builder
          </h1>
          {selectedEl && (
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="bg-neutral-800 px-2 py-1 rounded">
                {selectedEl.text}
              </span>
              <span>
                x: <strong className="text-white">{selectedEl.x}</strong>
              </span>
              <span>
                y: <strong className="text-white">{selectedEl.y}</strong>
              </span>
              <span>
                size: <strong className="text-white">{selectedEl.fontSize}px</strong>
              </span>
              <button
                onClick={() => changeFontSize(selectedEl.id, -2)}
                className="bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded text-white"
              >
                A-
              </button>
              <button
                onClick={() => changeFontSize(selectedEl.id, 2)}
                className="bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded text-white"
              >
                A+
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-neutral-500">
            Drag to move / Arrow keys to nudge (Shift+Arrow = 10px)
          </span>
          <button
            onClick={copyPositions}
            className="bg-violet text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy positions"}
          </button>
        </div>
      </div>

      {/* ── Canvas ─────────────────────────────────────── */}
      <div
        ref={canvasRef}
        className="relative pt-[72px] min-h-screen cursor-default"
        onClick={handleCanvasClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* ── Guide area (simulates the section width) ── */}
        <div className="absolute top-[72px] left-[120px] right-[120px] bottom-0 border border-dashed border-neutral-800 pointer-events-none">
          <span className="absolute top-2 left-3 text-[10px] text-neutral-700 uppercase tracking-widest">
            NarrativeSection area
          </span>
        </div>

        {/* ── Draggable elements ───────────────────────── */}
        {elements.map((el) => (
          <div
            key={el.id}
            onPointerDown={(e) => handlePointerDown(e, el.id)}
            onClick={(e) => e.stopPropagation()}
            className="absolute select-none touch-none"
            style={{
              left: el.x + 120,
              top: el.y + 72,
              fontSize: el.fontSize,
              lineHeight: 1,
              cursor: "grab",
              outline:
                selected === el.id
                  ? "2px solid #8650FC"
                  : "1px solid transparent",
              outlineOffset: 4,
              borderRadius: 4,
              zIndex: selected === el.id ? 10 : 1,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontWeight: el.type === "word" ? 400 : undefined,
              color: el.type === "emoji" ? undefined : "#fff",
            }}
          >
            {el.text}
          </div>
        ))}
      </div>
    </div>
  );
}
