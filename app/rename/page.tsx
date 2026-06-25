"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import { sanitizeRenamePattern, applyRenamePattern } from "@/lib/sanitize";
import toast from "react-hot-toast";
import JSZip from "jszip";

export default function RenamePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pattern, setPattern] = useState("photo-{n}");
  const [loading, setLoading] = useState(false);

  const handleFiles = useCallback((f: File[]) => setFiles(f), []);

  const previews = files.map((f, i) => {
    const ext = "." + (f.name.split(".").pop() ?? "jpg");
    return applyRenamePattern(sanitizeRenamePattern(pattern), i, ext);
  });

  const download = useCallback(async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const zip = new JSZip();
      files.forEach((f, i) => zip.file(previews[i], f));
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "renamed-images.zip";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to create ZIP.");
    } finally {
      setLoading(false);
    }
  }, [files, previews]);

  return (
    <ToolLayout
      title="Bulk Image Renamer"
      description="Upload up to 20 images and rename them with a custom pattern. Download all as a ZIP file."
      currentHref="/rename"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} multiple maxFiles={20} />

        {files.length > 0 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="rename-pattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rename pattern — use <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{"{n}"}</code> for auto-incrementing number
              </label>
              <input
                id="rename-pattern"
                type="text"
                value={pattern}
                onChange={(e) => setPattern(sanitizeRenamePattern(e.target.value))}
                placeholder="photo-{n}"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Allowed: letters, numbers, dash, underscore. Example: <span className="font-mono">vacation-{"{n}"}</span> → vacation-001.jpg
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 grid grid-cols-2">
                <span>Original name</span>
                <span>New name</span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-80 overflow-y-auto">
                {files.map((f, i) => (
                  <div key={i} className="px-4 py-2 text-sm grid grid-cols-2 gap-2">
                    <span className="text-gray-600 dark:text-gray-400 truncate">{f.name}</span>
                    <span className="text-green-700 dark:text-green-400 font-medium truncate">{previews[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={download}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating ZIP...
                </>
              ) : `⬇ Download ${files.length} Renamed File${files.length > 1 ? "s" : ""} (ZIP)`}
            </button>
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload up to 20 images. Enter a rename pattern using <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">{"{n}"}</code> as a placeholder for the auto-incrementing number (e.g. <em>beach-{"{n}"}</em> → beach-001.jpg, beach-002.jpg…). Preview the new names, then download all as a ZIP.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
