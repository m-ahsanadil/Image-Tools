import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ImageTools",
  description: "Learn about ImageTools — 10 free browser-based image utilities built with privacy in mind.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About ImageTools</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          ImageTools is a collection of 10 free, browser-based image utilities. Every tool runs entirely
          in your browser — your images are never uploaded to a server, never stored, and never shared.
          We believe privacy-first tools shouldn&apos;t cost anything.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What we offer</h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          {[
            "Image Compressor — reduce file size without visible quality loss",
            "Image Resizer — resize to exact pixel dimensions",
            "Format Converter — batch convert to JPG, PNG, WebP, AVIF, GIF",
            "Crop & Rotate — interactive drag-to-crop with rotation and flip",
            "Image to Base64 — encode images to Base64 strings",
            "Color Picker — click any pixel to get HEX, RGB, and HSL values",
            "EXIF Viewer — read and optionally strip camera metadata",
            "Image Watermarker — add text watermarks with full control",
            "Bulk Image Renamer — rename up to 20 images with a pattern",
            "Background Remover — AI-powered background removal via remove.bg",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Technology</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Built with Next.js 14, TypeScript, and Tailwind CSS. Processing is handled entirely by browser APIs —
          the Canvas API, FileReader, and WebAssembly where available. No data ever leaves your device
          (except the Background Remover, which sends your image to the remove.bg API using your own key).
        </p>
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
        >
          ← Back to tools
        </Link>
      </div>
    </main>
  );
}
