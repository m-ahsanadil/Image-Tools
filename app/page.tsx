import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ImageTools — Free Online Image Utilities",
  description:
    "10 free browser-based image tools: compress, resize, convert, crop, watermark, remove background, color picker, EXIF viewer, Base64 encoder, and bulk renamer. No uploads required.",
  openGraph: {
    title: "ImageTools — Free Online Image Utilities",
    description: "10 free browser-based image tools. No uploads, 100% private.",
    url: "https://imagetools.app",
  },
};

const TOOLS = [
  {
    href: "/compress",
    icon: "🗜️",
    title: "Image Compressor",
    description: "Reduce file size without visible quality loss. Adjust quality from 1–100.",
    badge: "Popular",
  },
  {
    href: "/resize",
    icon: "↔️",
    title: "Image Resizer",
    description: "Resize to exact pixel dimensions with optional aspect-ratio lock.",
    badge: null,
  },
  {
    href: "/convert",
    icon: "🔄",
    title: "Format Converter",
    description: "Batch convert up to 20 images to JPG, PNG, WebP, AVIF, or GIF. Download as ZIP.",
    badge: "Batch",
  },
  {
    href: "/crop",
    icon: "✂️",
    title: "Crop & Rotate",
    description: "Crop with an interactive drag box. Rotate 90°, flip horizontal/vertical.",
    badge: null,
  },
  {
    href: "/base64",
    icon: "🔤",
    title: "Image to Base64",
    description: "Encode any image to a Base64 string. Toggle the data URI prefix on/off.",
    badge: null,
  },
  {
    href: "/color-picker",
    icon: "🎨",
    title: "Color Picker",
    description: "Click anywhere on an image to pick a color. Get HEX, RGB, and HSL values.",
    badge: null,
  },
  {
    href: "/exif",
    icon: "📷",
    title: "EXIF Viewer",
    description: "Read camera, GPS, and date metadata. Optionally strip GPS before download.",
    badge: null,
  },
  {
    href: "/watermark",
    icon: "🔏",
    title: "Image Watermarker",
    description: "Add text watermarks with custom font, opacity, color, and position.",
    badge: null,
  },
  {
    href: "/rename",
    icon: "📝",
    title: "Bulk Image Renamer",
    description: "Rename up to 20 images at once with a custom pattern. Download as ZIP.",
    badge: "Batch",
  },
  {
    href: "/remove-bg",
    icon: "🪄",
    title: "Background Remover",
    description: "Remove backgrounds using the remove.bg API. Uses your own free API key.",
    badge: "AI",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Free Online{" "}
          <span className="text-blue-600 dark:text-blue-400">Image Tools</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Compress, resize, convert, crop, watermark, and more — directly in your browser.
          No uploads. No sign-up. 100% private.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          {["No account required", "Files stay on your device", "100% free", "No watermarks"].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section aria-label="Available tools">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative flex flex-col p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-950/30 transition-all duration-200"
            >
              {tool.badge && (
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {tool.badge}
                </span>
              )}
              <span className="text-3xl mb-3" aria-hidden="true">{tool.icon}</span>
              <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {tool.description}
              </p>
              <span className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How it works</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Three steps — no friction.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Upload your image", text: "Drag & drop or click to select. JPEG, PNG, WebP, GIF, or AVIF — up to 10 MB." },
            { step: "2", title: "Adjust settings", text: "Choose quality, dimensions, format, or any other option relevant to your tool." },
            { step: "3", title: "Download", text: "Processing happens in your browser instantly. Click Download and you're done." },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
