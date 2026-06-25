"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import toast from "react-hot-toast";

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type DragHandle = "tl" | "tr" | "bl" | "br" | "move" | null;

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef<DragHandle>(null);
  const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 });

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setOutputBlob(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    const img = new Image();
    img.onload = () => {
      setImgEl(img);
      setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = URL.createObjectURL(f);
  }, []);

  useEffect(() => {
    if (!imgEl || !displayRef.current) return;
    const canvas = displayRef.current;
    const maxW = Math.min(imgEl.naturalWidth, 700);
    const scale = maxW / imgEl.naturalWidth;
    const dispW = imgEl.naturalWidth * scale;
    const dispH = imgEl.naturalHeight * scale;
    canvas.width = dispW;
    canvas.height = dispH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, dispW, dispH);
    ctx.save();
    ctx.translate(dispW / 2, dispH / 2);
    if (rotation) ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(imgEl, -dispW / 2, -dispH / 2, dispW, dispH);
    ctx.restore();

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, dispW, dispH);

    const cx = crop.x * scale;
    const cy = crop.y * scale;
    const cw = crop.w * scale;
    const ch = crop.h * scale;

    ctx.save();
    ctx.translate(dispW / 2, dispH / 2);
    if (rotation) ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(imgEl, crop.x, crop.y, crop.w, crop.h, cx - dispW / 2, cy - dispH / 2, cw, ch);
    ctx.restore();

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cw, ch);

    const hs = 8;
    ctx.fillStyle = "#3b82f6";
    [[cx, cy], [cx + cw, cy], [cx, cy + ch], [cx + cw, cy + ch]].forEach(([hx, hy]) => {
      ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
    });
  }, [imgEl, crop, rotation, flipH, flipV]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = displayRef.current!.getBoundingClientRect();
    const scaleX = displayRef.current!.width / rect.width;
    const scaleY = displayRef.current!.height / rect.height;
    return { mx: (e.clientX - rect.left) * scaleX, my: (e.clientY - rect.top) * scaleY };
  };

  const getHandle = (mx: number, my: number): DragHandle => {
    if (!imgEl || !displayRef.current) return null;
    const scale = displayRef.current.width / imgEl.naturalWidth;
    const cx = crop.x * scale, cy = crop.y * scale, cw = crop.w * scale, ch = crop.h * scale;
    const hs = 12;
    if (Math.abs(mx - cx) < hs && Math.abs(my - cy) < hs) return "tl";
    if (Math.abs(mx - (cx + cw)) < hs && Math.abs(my - cy) < hs) return "tr";
    if (Math.abs(mx - cx) < hs && Math.abs(my - (cy + ch)) < hs) return "bl";
    if (Math.abs(mx - (cx + cw)) < hs && Math.abs(my - (cy + ch)) < hs) return "br";
    if (mx > cx && mx < cx + cw && my > cy && my < cy + ch) return "move";
    return null;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my } = getCanvasCoords(e);
    const handle = getHandle(mx, my);
    dragging.current = handle;
    dragStart.current = { mx, my, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging.current || !imgEl || !displayRef.current) return;
    const { mx, my } = getCanvasCoords(e);
    const scale = displayRef.current.width / imgEl.naturalWidth;
    const dx = (mx - dragStart.current.mx) / scale;
    const dy = (my - dragStart.current.my) / scale;
    const { cx, cy, cw, ch } = dragStart.current;
    const iw = imgEl.naturalWidth, ih = imgEl.naturalHeight;

    setCrop((prev) => {
      let nx = prev.x, ny = prev.y, nw = prev.w, nh = prev.h;
      if (dragging.current === "move") {
        nx = Math.max(0, Math.min(cx + dx, iw - cw));
        ny = Math.max(0, Math.min(cy + dy, ih - ch));
      } else if (dragging.current === "tl") {
        nx = Math.max(0, Math.min(cx + dx, cx + cw - 20));
        ny = Math.max(0, Math.min(cy + dy, cy + ch - 20));
        nw = cx + cw - nx;
        nh = cy + ch - ny;
      } else if (dragging.current === "tr") {
        ny = Math.max(0, Math.min(cy + dy, cy + ch - 20));
        nw = Math.max(20, Math.min(cw + dx, iw - cx));
        nh = cy + ch - ny;
      } else if (dragging.current === "bl") {
        nx = Math.max(0, Math.min(cx + dx, cx + cw - 20));
        nw = cx + cw - nx;
        nh = Math.max(20, Math.min(ch + dy, ih - cy));
      } else if (dragging.current === "br") {
        nw = Math.max(20, Math.min(cw + dx, iw - cx));
        nh = Math.max(20, Math.min(ch + dy, ih - cy));
      }
      return { x: nx, y: ny, w: nw, h: nh };
    });
  };

  const onMouseUp = () => { dragging.current = null; };

  const applyTransform = useCallback(() => {
    if (!imgEl) return;
    setLoading(true);
    try {
      const canvas = document.createElement("canvas");
      const iw = imgEl.naturalWidth, ih = imgEl.naturalHeight;
      const rad = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const rw = Math.round(iw * cos + ih * sin);
      const rh = Math.round(iw * sin + ih * cos);
      canvas.width = rw;
      canvas.height = rh;
      const ctx = canvas.getContext("2d")!;
      ctx.translate(rw / 2, rh / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(imgEl, -iw / 2, -ih / 2);
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = crop.w;
      croppedCanvas.height = crop.h;
      const ctx2 = croppedCanvas.getContext("2d")!;
      ctx2.drawImage(canvas, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      croppedCanvas.toBlob((blob) => {
        if (blob) setOutputBlob(blob);
        setLoading(false);
      }, file?.type ?? "image/png", 0.95);
    } catch {
      toast.error("Processing failed.");
      setLoading(false);
    }
  }, [imgEl, rotation, flipH, flipV, crop, file]);

  const download = () => {
    if (!outputBlob || !file) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cropped-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  return (
    <ToolLayout
      title="Crop & Rotate"
      description="Drag the crop box corners to select a region. Rotate or flip your image before cropping."
      currentHref="/crop"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} />

        {imgEl && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "↺ 90° Left", action: () => setRotation((r) => (r - 90 + 360) % 360) },
                { label: "↻ 90° Right", action: () => setRotation((r) => (r + 90) % 360) },
                { label: "⇄ Flip H", action: () => setFlipH((v) => !v) },
                { label: "⇅ Flip V", action: () => setFlipV((v) => !v) },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <canvas
                ref={displayRef}
                className="max-w-full cursor-crosshair"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Crop: {Math.round(crop.x)}, {Math.round(crop.y)} — {Math.round(crop.w)} × {Math.round(crop.h)} px
            </p>

            <button
              onClick={applyTransform}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : "Apply Crop & Transform"}
            </button>

            {outputBlob && (
              <button
                onClick={download}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                ⬇ Download Result
              </button>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload an image. Drag the blue corner handles to adjust the crop region. Use the rotation and flip buttons to transform the image first. Click &quot;Apply Crop &amp; Transform&quot; to process and then download.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
