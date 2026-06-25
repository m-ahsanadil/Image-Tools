import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ImageTools",
  description: "ImageTools privacy policy — we never store or transmit your images.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-6 prose dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: June 2025</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Your Images</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          All image processing on ImageTools happens entirely within your web browser using JavaScript and
          the HTML5 Canvas API. Your images are never uploaded to, stored on, or transmitted to our servers.
          We have no access to your files at any time.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Background Remover Exception</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          The Background Remover tool sends your image directly to the remove.bg API using an API key you
          provide. This key is stored only in your browser&apos;s localStorage and is never transmitted to
          ImageTools servers. Please review the{" "}
          <a
            href="https://www.remove.bg/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            remove.bg Privacy Policy
          </a>{" "}
          for information about how they handle your data.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We may use privacy-respecting analytics to understand aggregate usage patterns (e.g. which tools are
          most popular). This data contains no personally identifiable information and no image content.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Advertising</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We display ads via Google AdSense to fund the free operation of this site. Google may use cookies
          to serve personalized ads based on your browsing history. You can opt out via{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Google&apos;s Ad Settings
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Cookies</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We use localStorage only to remember your remove.bg API key if you choose to save it. No
          session cookies or tracking cookies are set by ImageTools directly.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Contact</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          For privacy questions, email{" "}
          <a href="mailto:privacy@imagetools.app" className="text-blue-600 dark:text-blue-400 underline">
            privacy@imagetools.app
          </a>
          .
        </p>
      </section>
    </main>
  );
}
