"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import { sanitizeWatermarkText } from "@/lib/sanitize";
import toast from "react-hot-toast";

type Position = "tl" | "tc" | "tr" | "ml" | "mc" | "mr" | "bl" | "bc" | "br";

const POSITIONS: { value: Position; label: string }[] = [
  { value: "tl", label: "↖" },
  { value: "tc", label: "↑" },
  { value: "tr", label: "↗" },
  { value: "ml", label: "←" },
  { value: "mc", label: "⊙" },
  { value: "mr", label: "→" },
  { value: "bl", label: "↙" },
  { value: "bc", label: "↓" },
  { value: "br", label: "↘" },
];

function getCoords(pos: Position, cw: number, ch: number, textW: number, textH: number, pad: number) {
  const xMap: Record<string, number> = {
    l: pad,
    c: (cw - textW) / 2,
    r: cw - textW - pad,
  };
  const yMap: Record<string, number> = {
    t: pad + textH,
    m: (ch + textH) / 2,
    b: ch - pad,
  };
  return { x: xMap[pos[1]], y: yMap[pos[0]] };
}

export default function WatermarkPage() {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("© MyBrand");
  const [fontSize, setFontSize] = useState(36);
  const [opacity, setOpacity] = useState(70);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState<Position>("br");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setOutputBlob(null);
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = URL.createObjectURL(f);
  }, []);

  const drawPreview = useCallback(() => {
    if (!imgEl || !previewRef.current) return;
    const canvas = previewRef.current;
    const maxW = Math.min(imgEl.naturalWidth, 700);
    const scale = maxW / imgEl.naturalWidth;
    canvas.width = imgEl.naturalWidth * scale;
    canvas.height = imgEl.naturalHeight * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
    const safe = sanitizeWatermarkText(text);
    const scaledFont = Math.round(fontSize * scale);
    ctx.font = `bold ${scaledFont}px sans-serif`;
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    const metrics = ctx.measureText(safe);
    const textW = metrics.width;
    const textH = scaledFont;
    const { x, y } = getCoords(position, canvas.width, canvas.height, textW, textH, 16);
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 4;
    ctx.fillText(safe, x, y);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [imgEl, text, fontSize, opacity, color, position]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  const apply = useCallback(() => {
    if (!imgEl || !file) return;
    setLoading(true);
    const canvas = document.createElement("canvas");
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0);
    const safe = sanitizeWatermarkText(text);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    const metrics = ctx.measureText(safe);
    const textW = metrics.width;
    const { x, y } = getCoords(position, canvas.width, canvas.height, textW, fontSize, 24);
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 6;
    ctx.fillText(safe, x, y);
    canvas.toBlob((blob) => {
      if (blob) setOutputBlob(blob);
      setLoading(false);
    }, file.type, 0.95);
  }, [imgEl, text, fontSize, opacity, color, position, file]);

  const download = () => {
    if (!outputBlob || !file) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `watermarked-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  return (
    <ToolLayout
      title="Image Watermarker"
      description="Add a text watermark to your image with custom font size, opacity, color, and position."
      currentHref="/watermark"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} />

        {imgEl && (
          <div className="space-y-5">
            <div>
              <label htmlFor="wm-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Watermark text (max 100 chars)
              </label>
              <input
                id="wm-text"
                type="text"
                maxLength={100}
                value={text}
                onChange={(e) => setText(sanitizeWatermarkText(e.target.value))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="wm-size" className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Font size</span>
                  <span className="text-blue-600 dark:text-blue-400">{fontSize}px</span>
                </label>
                <input
                  id="wm-size"
                  type="range"
                  min={10}
                  max={200}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label htmlFor="wm-opacity" className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Opacity</span>
                  <span className="text-blue-600 dark:text-blue-400">{opacity}%</span>
                </label>
                <input
                  id="wm-opacity"
                  type="range"
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="wm-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <input
                  id="wm-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-1 w-28">
                  {POSITIONS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPosition(p.value)}
                      className={`h-9 rounded text-sm font-medium transition-colors ${
                        position === p.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Live preview:</p>
              <div className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <canvas ref={previewRef} className="max-w-full" />
              </div>
            </div>

            <button
              onClick={apply}
              disabled={loading || !text.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : "Apply Watermark"}
            </button>

            {outputBlob && (
              <button
                onClick={download}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                ⬇ Download Watermarked Image
              </button>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload an image, type your watermark text, then adjust size, opacity, color, and position. The live preview updates instantly. Click &quot;Apply Watermark&quot; to render the final image, then download.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
