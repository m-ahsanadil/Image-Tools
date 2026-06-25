import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Watermarker — Add Text Watermark to Photos",
  description:
    "Add custom text watermarks to images. Control font size, opacity, color, and position (9 grid positions). Live preview before download.",
  openGraph: {
    title: "Image Watermarker — ImageTools",
    description: "Add text watermarks with full control over style and position.",
    url: "https://imagetools.app/watermark",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
