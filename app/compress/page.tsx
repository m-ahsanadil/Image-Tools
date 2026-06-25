"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import { formatBytes } from "@/lib/validators";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [compressed, setCompressed] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
    setCompressed(null);
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await imageCompression(file, {
        maxSizeMB: 10,
        initialQuality: quality / 100,
        useWebWorker: true,
        fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
      });
      setCompressed(result);
    } catch {
      toast.error("Compression failed. Please try another image.");
    } finally {
      setLoading(false);
    }
  }, [file, quality]);

  const download = () => {
    if (!compressed || !file) return;
    const url = URL.createObjectURL(compressed);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  const savings =
    file && compressed
      ? Math.round((1 - compressed.size / file.size) * 100)
      : null;

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce image file size without visible quality loss — all processing happens in your browser."
      currentHref="/compress"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} />

        {file && (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="quality"
                className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <span>Compression quality</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{quality}</span>
              </label>
              <input
                id="quality"
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => { setQuality(Number(e.target.value)); setCompressed(null); }}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smallest file</span>
                <span>Best quality</span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Original</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatBytes(file.size)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Compressed</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {compressed ? formatBytes(compressed.size) : "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Saved</p>
                <p className={`font-semibold ${savings && savings > 0 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                  {savings !== null ? `${savings}%` : "—"}
                </p>
              </div>
            </div>

            <button
              onClick={compress}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : "Compress Image"}
            </button>

            {compressed && (
              <button
                onClick={download}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                ⬇ Download Compressed Image
              </button>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload a JPEG, PNG, or WebP image. Drag the quality slider — lower values mean smaller files, higher values mean better quality. Click &quot;Compress Image&quot; then download your result. No data ever leaves your browser.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
