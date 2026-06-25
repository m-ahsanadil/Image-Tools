import Link from "next/link";
import AdSlot from "@/components/AdSlot";

const ALL_TOOLS = [
  { href: "/compress", label: "Image Compressor" },
  { href: "/resize", label: "Image Resizer" },
  { href: "/convert", label: "Format Converter" },
  { href: "/crop", label: "Crop & Rotate" },
  { href: "/base64", label: "Image to Base64" },
  { href: "/color-picker", label: "Color Picker" },
  { href: "/exif", label: "EXIF Viewer" },
  { href: "/watermark", label: "Watermarker" },
  { href: "/rename", label: "Bulk Renamer" },
  { href: "/remove-bg", label: "Background Remover" },
];

interface ToolLayoutProps {
  title: string;
  description: string;
  currentHref: string;
  children: React.ReactNode;
}

export default function ToolLayout({
  title,
  description,
  currentHref,
  children,
}: ToolLayoutProps) {
  const relatedTools = ALL_TOOLS.filter((t) => t.href !== currentHref).slice(0, 3);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <AdSlot slot="1234567890" format="horizontal" className="w-full" />

      {children}

      <AdSlot slot="0987654321" format="rectangle" className="w-full" />

      <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Try also
        </h2>
        <div className="flex flex-wrap gap-2">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
