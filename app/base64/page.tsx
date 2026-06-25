"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import toast from "react-hot-toast";

export default function Base64Page() {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState("");
  const [includePrefix, setIncludePrefix] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setBase64("");
  }, []);

  const encode = useCallback(() => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const rawBase64 = result.split(",")[1];
      const value = includePrefix ? result : rawBase64;
      setBase64(value ?? "");
      setLoading(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }, [file, includePrefix]);

  const copyToClipboard = async () => {
    if (!base64) return;
    await navigator.clipboard.writeText(base64);
    toast.success("Copied to clipboard!");
  };

  const charCount = base64.length;
  const estimatedSize = Math.round((charCount * 3) / 4);

  return (
    <ToolLayout
      title="Image to Base64"
      description="Encode any image to a Base64 string. Toggle the data URI prefix and copy to clipboard."
      currentHref="/base64"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} />

        {file && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setIncludePrefix((v) => !v); setBase64(""); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  includePrefix
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {includePrefix ? "✓" : "○"} Include data URI prefix
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {includePrefix ? "e.g. data:image/png;base64,..." : "Raw base64 only"}
              </span>
            </div>

            <button
              onClick={encode}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Encoding...
                </>
              ) : "Encode to Base64"}
            </button>

            {base64 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{charCount.toLocaleString()} characters ≈ {estimatedSize.toLocaleString()} bytes</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors"
                  >
                    📋 Copy to clipboard
                  </button>
                </div>
                <textarea
                  readOnly
                  value={base64}
                  rows={8}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-300 resize-y focus:ring-2 focus:ring-blue-500 outline-none"
                  aria-label="Base64 encoded output"
                />
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload an image, choose whether to include the data URI prefix (needed for use in HTML/CSS &lt;img src&gt; attributes), then click Encode. Copy the result to your clipboard with one click.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
