"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import { formatBytes } from "@/lib/validators";
import toast from "react-hot-toast";
import JSZip from "jszip";

type TargetFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/gif";

const FORMAT_OPTIONS: { value: TargetFormat; label: string; lossy: boolean }[] = [
  { value: "image/jpeg", label: "JPG", lossy: true },
  { value: "image/png", label: "PNG", lossy: false },
  { value: "image/webp", label: "WebP", lossy: true },
  { value: "image/avif", label: "AVIF", lossy: true },
  { value: "image/gif", label: "GIF", lossy: false },
];

const EXT_MAP: Record<TargetFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

function convertFile(file: File, targetFormat: TargetFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error("Conversion failed")),
        targetFormat,
        quality / 100
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Failed to load ${file.name}`)); };
    img.src = url;
  });
}

export default function ConvertPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("image/webp");
  const [quality, setQuality] = useState(85);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ name: string; blob: Blob }[]>([]);

  const handleFiles = useCallback((f: File[]) => { setFiles(f); setResults([]); }, []);

  const selectedFormat = FORMAT_OPTIONS.find((f) => f.value === targetFormat)!;

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const converted = await Promise.all(
        files.map(async (file) => {
          const blob = await convertFile(file, targetFormat, quality);
          const base = file.name.replace(/\.[^/.]+$/, "");
          return { name: `${base}.${EXT_MAP[targetFormat]}`, blob };
        })
      );
      setResults(converted);
      toast.success(`Converted ${converted.length} image${converted.length > 1 ? "s" : ""}!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setLoading(false);
    }
  }, [files, targetFormat, quality]);

  const downloadAll = async () => {
    if (results.length === 0) return;
    if (results.length === 1) {
      const url = URL.createObjectURL(results[0].blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = results[0].name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const zip = new JSZip();
      results.forEach((r) => zip.file(r.name, r.blob));
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-images.zip`;
      a.click();
      URL.revokeObjectURL(url);
    }
    toast.success("Download started!");
  };

  return (
    <ToolLayout
      title="Format Converter"
      description="Convert images to JPG, PNG, WebP, AVIF, or GIF. Batch convert up to 20 images and download as a ZIP file."
      currentHref="/convert"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} multiple maxFiles={20} />

        {files.length > 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Convert to
              </label>
              <div className="flex flex-wrap gap-2">
                {FORMAT_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setTargetFormat(f.value); setResults([]); }}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      targetFormat === f.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedFormat.lossy && (
              <div>
                <label htmlFor="conv-quality" className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span>Quality</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{quality}</span>
                </label>
                <input
                  id="conv-quality"
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => { setQuality(Number(e.target.value)); setResults([]); }}
                  className="w-full accent-blue-600"
                />
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {files.length} file{files.length > 1 ? "s" : ""} selected
              {files.length > 1 ? " — will be downloaded as a ZIP" : ""}
            </p>

            <button
              onClick={convert}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Converting...
                </>
              ) : `Convert to ${selectedFormat.label}`}
            </button>

            {results.length > 0 && (
              <button
                onClick={downloadAll}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                ⬇ Download {results.length > 1 ? `${results.length} Files (ZIP)` : results[0].name}
              </button>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload one or up to 20 images at once. Choose your target format, adjust quality for lossy formats (JPG/WebP/AVIF), then click Convert. Multiple files are packaged into a single ZIP for easy downloading.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
