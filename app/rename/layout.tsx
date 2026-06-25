import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Image Renamer — Rename Multiple Images with a Pattern",
  description:
    "Rename up to 20 images at once using a custom pattern with auto-numbering. Preview new names before downloading as a ZIP file.",
  openGraph: {
    title: "Bulk Image Renamer — ImageTools",
    description: "Rename multiple images with a pattern and download as ZIP.",
    url: "https://imagetools.app/rename",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
