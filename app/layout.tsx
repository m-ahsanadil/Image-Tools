import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://imagetools.app"),
  title: {
    default: "ImageTools — Free Online Image Utilities",
    template: "%s | ImageTools",
  },
  description:
    "Free browser-based image tools: compress, resize, convert, crop, watermark, remove background, and more — no uploads, 100% private.",
  keywords: [
    "image tools",
    "image compressor",
    "image resizer",
    "image converter",
    "crop image",
    "remove background",
    "free online tools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imagetools.app",
    siteName: "ImageTools",
  },
  twitter: {
    card: "summary_large_image",
    site: "@imagetools",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <Toaster position="bottom-right" />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
        >
          &#x1F5BC; ImageTools
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Primary navigation">
          {[
            { href: "/compress", label: "Compress" },
            { href: "/resize", label: "Resize" },
            { href: "/convert", label: "Convert" },
            { href: "/crop", label: "Crop" },
            { href: "/watermark", label: "Watermark" },
            { href: "/remove-bg", label: "Remove BG" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Tools</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {[
                { href: "/compress", label: "Compressor" },
                { href: "/resize", label: "Resizer" },
                { href: "/convert", label: "Converter" },
                { href: "/crop", label: "Crop & Rotate" },
                { href: "/base64", label: "Base64" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-blue-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">More Tools</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {[
                { href: "/color-picker", label: "Color Picker" },
                { href: "/exif", label: "EXIF Viewer" },
                { href: "/watermark", label: "Watermark" },
                { href: "/rename", label: "Bulk Rename" },
                { href: "/remove-bg", label: "Remove BG" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-blue-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              100% free, browser-based image utilities. Your files never leave your device.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-center text-xs text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} ImageTools. All processing happens in your browser — we never see your files.
        </div>
      </div>
    </footer>
  );
}
