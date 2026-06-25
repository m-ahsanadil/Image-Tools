import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resizer — Resize Images to Exact Dimensions",
  description:
    "Resize JPEG, PNG, WebP images to exact pixel dimensions for free. Lock aspect ratio to prevent distortion. Outputs JPG, PNG, or WebP.",
  openGraph: {
    title: "Image Resizer — ImageTools",
    description: "Resize images to any dimension while keeping aspect ratio.",
    url: "https://imagetools.app/resize",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
