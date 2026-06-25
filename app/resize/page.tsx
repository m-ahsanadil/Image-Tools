"use client";

import { useState, useCallback, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import { formatBytes } from "@/lib/validators";
import toast from "react-hot-toast";

type OutputFormat = "original" | "image/jpeg" | "image/png" | "image/webp";

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("original");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const aspectRef = useRef(1);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setOutputBlob(null);
    const img = new Image();
    img.onload = () => {
      setImgEl(img);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      aspectRef.current = img.naturalWidth / img.naturalHeight;
    };
    img.src = URL.createObjectURL(f);
  }, []);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect) setHeight(Math.round(val / aspectRef.current));
    setOutputBlob(null);
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect) setWidth(Math.round(val * aspectRef.current));
    setOutputBlob(null);
  };

  const resize = useCallback(async () => {
    if (!file || !imgEl) return;
    setLoading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(imgEl, 0, 0, width, height);
      const mime = outputFormat === "original" ? (file.type as string) : outputFormat;
      canvas.toBlob(
        (blob) => {
          if (blob) setOutputBlob(blob);
          setLoading(false);
        },
        mime,
        0.92
      );
    } catch {
      toast.error("Resize failed.");
      setLoading(false);
    }
  }, [file, imgEl, width, height, outputFormat]);

  const download = () => {
    if (!outputBlob || !file) return;
    const ext = outputFormat === "original" ? file.name.split(".").pop() : outputFormat.split("/")[1];
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resized-${width}x${height}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize your image to exact pixel dimensions. Lock aspect ratio to avoid distortion."
      currentHref="/resize"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} />

        {file && imgEl && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="res-width" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Width (px)
                </label>
                <input
                  id="res-width"
                  type="number"
                  min={1}
                  max={16000}
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="res-height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Height (px)
                </label>
                <input
                  id="res-height"
                  type="number"
                  min={1}
                  max={16000}
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLockAspect((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  lockAspect
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {lockAspect ? "🔒" : "🔓"} Lock aspect ratio
              </button>
            </div>

            <div>
              <label htmlFor="res-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Output format
              </label>
              <select
                id="res-format"
                value={outputFormat}
                onChange={(e) => { setOutputFormat(e.target.value as OutputFormat); setOutputBlob(null); }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="original">Same as input</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Original: {imgEl.naturalWidth} × {imgEl.naturalHeight} px — {formatBytes(file.size)}
            </div>

            <button
              onClick={resize}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : `Resize to ${width}×${height}`}
            </button>

            {outputBlob && (
              <button
                onClick={download}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                ⬇ Download Resized Image ({formatBytes(outputBlob.size)})
              </button>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload an image, then enter your target width and height in pixels. Enable &quot;Lock aspect ratio&quot; to prevent distortion — changing one dimension automatically adjusts the other. Choose an output format and click Resize.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
