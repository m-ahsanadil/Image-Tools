import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background Remover — Remove Image Background Free",
  description:
    "Remove image backgrounds using the remove.bg API. Use your own free API key. Download transparent PNG. Before/after preview included.",
  openGraph: {
    title: "Background Remover — ImageTools",
    description: "AI-powered background removal. Use your own remove.bg API key.",
    url: "https://imagetools.app/remove-bg",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
