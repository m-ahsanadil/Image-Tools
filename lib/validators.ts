export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

const MAGIC_BYTES: { mime: AllowedMimeType; sig: number[] }[] = [
  { mime: "image/jpeg", sig: [0xff, 0xd8, 0xff] },
  { mime: "image/png",  sig: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/gif",  sig: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", sig: [0x52, 0x49, 0x46, 0x46] },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 20;
const DOUBLE_EXT_PATTERN = /\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

async function detectMimeFromBytes(file: File): Promise<AllowedMimeType | null> {
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    for (const { mime, sig } of MAGIC_BYTES) {
      if (sig.every((byte, i) => bytes[i] === byte)) {
        // Extra WebP check: bytes 8-11 must be "WEBP"
        if (mime === "image/webp") {
          const webpMark = [0x57, 0x45, 0x42, 0x50];
          if (!webpMark.every((b, i) => bytes[8 + i] === b)) continue;
        }
        return mime;
      }
    }

    // AVIF: box type "ftyp" at offset 4, brand "avif"/"avis" at offset 8
    if (
      bytes[4] === 0x66 && bytes[5] === 0x74 &&
      bytes[6] === 0x79 && bytes[7] === 0x70
    ) {
      return "image/avif";
    }

    return null;
  } catch {
    return null;
  }
}

function isMimeAllowed(mime: string): mime is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export async function validateFile(file: File): Promise<ValidationResult> {
  if (file.size === 0) {
    return { valid: false, error: `"${file.name}" is empty (zero bytes).` };
  }

  if (file.size > MAX_FILE_SIZE) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `"${file.name}" is ${mb} MB — max allowed is 10 MB.`,
    };
  }

  if (DOUBLE_EXT_PATTERN.test(file.name)) {
    return {
      valid: false,
      error: `"${file.name}" has a suspicious double extension and was rejected.`,
    };
  }

  // Primary: check magic bytes
  const detectedMime = await detectMimeFromBytes(file);
  if (detectedMime) return { valid: true };

  // Fallback: trust the browser's MIME type (covers edge cases like progressive JPEGs)
  if (file.type && isMimeAllowed(file.type)) return { valid: true };

  return {
    valid: false,
    error: `"${file.name}" doesn't look like a supported image (JPEG, PNG, WebP, GIF, AVIF).`,
  };
}

export async function validateFiles(
  files: File[]
): Promise<{ valid: File[]; errors: string[] }> {
  if (files.length > MAX_FILES) {
    return {
      valid: [],
      errors: [`Too many files. Maximum is ${MAX_FILES} at once.`],
    };
  }

  const valid: File[] = [];
  const errors: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      const result = await validateFile(file);
      if (result.valid) {
        valid.push(file);
      } else if (result.error) {
        errors.push(result.error);
      }
    })
  );

  return { valid, errors };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
