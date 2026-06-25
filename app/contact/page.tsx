import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — ImageTools",
  description: "Get in touch with the ImageTools team.",
};

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact</h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        Have a question, found a bug, or want to suggest a new tool? We&apos;d love to hear from you.
      </p>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email us at:</p>
          <a
            href="mailto:hello@imagetools.app"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            hello@imagetools.app
          </a>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We typically respond within 48 hours on business days.
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        For bug reports, please include your browser name and version, the image type you were using,
        and a description of what happened versus what you expected.
      </p>
    </main>
  );
}
