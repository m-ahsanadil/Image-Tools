"use client";

import { useState, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import { formatBytes } from "@/lib/validators";
import toast from "react-hot-toast";

const API_KEY_STORAGE = "imagetools_removebg_apikey";

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE);
    if (saved) setApiKey(saved);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  };

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResultUrl(null);
    setOriginalUrl(URL.createObjectURL(f));
  }, []);

  const removeBg = useCallback(async () => {
    if (!file || !apiKey.trim()) {
      toast.error("Please enter your remove.bg API key.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("size", "auto");

      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": apiKey.trim() },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = (err as { errors?: { title?: string }[] })?.errors?.[0]?.title ?? `API error (${res.status})`;
        throw new Error(msg);
      }

      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
      toast.success("Background removed!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove background.");
    } finally {
      setLoading(false);
    }
  }, [file, apiKey]);

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `no-bg-${file.name.replace(/\.[^/.]+$/, "")}.png`;
    a.click();
    toast.success("Download started!");
  };

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove image backgrounds using the remove.bg API. Uses your own API key — stored locally, never on our servers."
      currentHref="/remove-bg"
    >
      <div className="space-y-6">
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Privacy note:</strong> Your API key is stored only in your browser&apos;s localStorage and is sent directly to remove.bg — never to our servers. Get a free key at{" "}
            <a
              href="https://www.remove.bg/api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900"
            >
              remove.bg/api
            </a>{" "}
            (50 free images/month).
          </p>
        </div>

        <div>
          <label htmlFor="rbg-apikey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            remove.bg API Key
          </label>
          <input
            id="rbg-apikey"
            type="password"
            value={apiKey}
            onChange={(e) => saveApiKey(e.target.value)}
            placeholder="Paste your API key here"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Saved automatically to localStorage. Clear the field to remove it.
          </p>
        </div>

        <DropZone onFiles={handleFiles} />

        {file && (
          <div className="space-y-4">
            {originalUrl && resultUrl && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Before</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 object-contain max-h-64"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formatBytes(file.size)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">After</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Background removed"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 object-contain max-h-64 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjY2NjIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')]"
                  />
                </div>
              </div>
            )}

            {!resultUrl && originalUrl && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Selected image</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Selected"
                  className="w-full max-h-64 rounded-xl border border-gray-200 dark:border-gray-700 object-contain"
                />
              </div>
            )}

            <button
              onClick={removeBg}
              disabled={loading || !apiKey.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Removing background...
                </>
              ) : "Remove Background"}
            </button>

            {resultUrl && (
              <button
                onClick={download}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                ⬇ Download PNG (transparent background)
              </button>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Get a free API key from remove.bg (50 images/month free tier). Paste it in the field above — it is saved in your browser only. Upload your image, click &quot;Remove Background&quot;, and download the resulting PNG with a transparent background.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
