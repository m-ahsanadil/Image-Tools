import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Format Converter — Convert to JPG, PNG, WebP, AVIF",
  description:
    "Batch convert images to JPG, PNG, WebP, AVIF, or GIF online for free. Convert up to 20 images at once and download as a ZIP file.",
  openGraph: {
    title: "Image Format Converter — ImageTools",
    description: "Batch convert images to any format. Download as ZIP.",
    url: "https://imagetools.app/convert",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
