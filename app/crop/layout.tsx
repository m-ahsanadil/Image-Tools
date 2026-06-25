import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop & Rotate Image Online Free",
  description:
    "Crop images with a drag-and-drop crop box. Rotate 90° left/right and flip horizontally or vertically. No software needed.",
  openGraph: {
    title: "Crop & Rotate — ImageTools",
    description: "Interactive drag-to-crop with rotation and flip.",
    url: "https://imagetools.app/crop",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
