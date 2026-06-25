import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to Base64 Encoder — Free Online Tool",
  description:
    "Convert any image to a Base64 string online. Toggle the data URI prefix on or off. Copy to clipboard instantly.",
  openGraph: {
    title: "Image to Base64 — ImageTools",
    description: "Encode images to Base64 strings with one click.",
    url: "https://imagetools.app/base64",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
