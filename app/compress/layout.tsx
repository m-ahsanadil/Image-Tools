import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor — Reduce Image File Size Online Free",
  description:
    "Compress JPEG, PNG, and WebP images online for free. Adjust quality from 1–100 and see before/after file sizes instantly. No upload required.",
  openGraph: {
    title: "Image Compressor — ImageTools",
    description: "Compress images without visible quality loss, right in your browser.",
    url: "https://imagetools.app/compress",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
