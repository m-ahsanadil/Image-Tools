import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Color Picker — Get HEX, RGB, HSL from Any Image",
  description:
    "Click anywhere on an image to pick a color. Get HEX, RGB, and HSL values instantly. Copy each value to clipboard.",
  openGraph: {
    title: "Color Picker — ImageTools",
    description: "Pick any color from an image and get HEX, RGB, HSL.",
    url: "https://imagetools.app/color-picker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
