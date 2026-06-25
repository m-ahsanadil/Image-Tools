const MAX_WATERMARK_LENGTH = 100;
const SAFE_FILENAME_PATTERN = /[^a-z0-9\-_.]/g;

export function sanitizeText(input: string): string {
  // Strip any HTML-like tags and limit length
  const stripped = input.replace(/<[^>]*>/g, "").trim();
  return stripped;
}

export function sanitizeWatermarkText(input: string): string {
  const clean = sanitizeText(input);
  return clean.slice(0, MAX_WATERMARK_LENGTH);
}

export function sanitizeFilename(name: string): string {
  const withoutExt = name.replace(/\.[^/.]+$/, "");
  const ext = name.slice(withoutExt.length);

  const safe = withoutExt
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(SAFE_FILENAME_PATTERN, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return (safe || "image") + ext;
}

export function sanitizeRenamePattern(pattern: string): string {
  const clean = sanitizeText(pattern);
  // Allow letters, numbers, dash, underscore, and {n} placeholder
  return clean.replace(/[^a-zA-Z0-9\-_{}\s]/g, "").slice(0, 80);
}

export function applyRenamePattern(
  pattern: string,
  index: number,
  originalExt: string
): string {
  const base = pattern.replace(/\{n\}/g, String(index + 1).padStart(3, "0"));
  return sanitizeFilename(base + originalExt);
}
