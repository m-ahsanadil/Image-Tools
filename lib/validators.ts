export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

const MAGIC_BYTES: Record<AllowedMimeType, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  "image/avif": [[0x00, 0x00, 0x00]],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 20;
const DOUBLE_EXT_PATTERN = /\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

async function detectMimeFromBytes(file: File): Promise<string | null> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  for (const [mime, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const sig of signatures) {
      if (sig.every((byte, i) => bytes[i] === byte)) {
        if (mime === "image/webp") {
          const riff = bytes.slice(0, 4);
          const webp = bytes.slice(8, 12);
          const riffMatch = [0x52, 0x49, 0x46, 0x46].every(
            (b, i) => riff[i] === b
          );
          const webpMatch = [0x57, 0x45, 0x42, 0x50].every(
            (b, i) => webp[i] === b
          );
          if (riffMatch && webpMatch) return mime;
          continue;
        }
        return mime;
      }
    }
  }
  return null;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export async function validateFile(file: File): Promise<ValidationResult> {
  if (file.size === 0) {
    return { valid: false, error: "File is empty (zero bytes)." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds 10 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`,
    };
  }

  if (DOUBLE_EXT_PATTERN.test(file.name)) {
    return {
      valid: false,
      error: `File "${file.name}" has a suspicious double extension and was rejected.`,
    };
  }

  const detectedMime = await detectMimeFromBytes(file);
  if (
    !detectedMime ||
    !ALLOWED_MIME_TYPES.includes(detectedMime as AllowedMimeType)
  ) {
    return {
      valid: false,
      error: `File "${file.name}" is not a supported image type. Accepted: JPEG, PNG, WebP, GIF, AVIF.`,
    };
  }

  return { valid: true };
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
