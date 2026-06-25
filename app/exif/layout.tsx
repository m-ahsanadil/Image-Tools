import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EXIF Viewer — Read & Strip Image Metadata Online",
  description:
    "Read EXIF metadata from photos: camera model, GPS location, exposure, and date. Strip GPS data before sharing.",
  openGraph: {
    title: "EXIF Viewer — ImageTools",
    description: "Read camera metadata and strip GPS from photos.",
    url: "https://imagetools.app/exif",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
