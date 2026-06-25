# ImageTools

A collection of 10 free, browser-based image utilities. Every tool runs entirely in your browser — files are never uploaded to any server.

**Live site:** [imagetools.app](https://imagetools.app)

---

## Tools

| Tool | Route | Description |
|------|-------|-------------|
| Image Compressor | `/compress` | Reduce file size with a quality slider. Shows before/after sizes and % saved. |
| Image Resizer | `/resize` | Resize to exact pixel dimensions with optional aspect-ratio lock. |
| Format Converter | `/convert` | Batch convert up to 20 images to JPG, PNG, WebP, AVIF, or GIF. Downloads as ZIP. |
| Crop & Rotate | `/crop` | Drag-and-drop crop box with 90° rotation and horizontal/vertical flip. |
| Image to Base64 | `/base64` | Encode any image to a Base64 string. Toggle data URI prefix on/off. |
| Color Picker | `/color-picker` | Click any pixel on an image to get HEX, RGB, and HSL values. |
| EXIF Viewer | `/exif` | Read camera, GPS, and date metadata. Strip GPS data before sharing. |
| Image Watermarker | `/watermark` | Add text watermarks with custom font size, opacity, color, and 9 grid positions. |
| Bulk Image Renamer | `/rename` | Rename up to 20 images with a `{n}` pattern. Downloads as ZIP. |
| Background Remover | `/remove-bg` | Remove backgrounds via the remove.bg API using your own API key. |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Libraries:**
  - `browser-image-compression` — client-side compression
  - `exifr` — EXIF metadata parsing
  - `jszip` — ZIP file generation
  - `react-hot-toast` — toast notifications
- **Deployment:** Vercel (free tier)

All processing happens in the browser via the Canvas API and FileReader. No server-side image handling.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Security

- **File validation:** MIME type verified by reading magic bytes (not just file extension). Rejects double extensions, zero-byte files, and files over 10 MB.
- **Input sanitization:** All text inputs (watermark text, filenames, rename patterns) are sanitized. HTML tags stripped, output filenames restricted to `[a-z0-9-_.]`.
- **Content Security Policy:** Set via `next.config.js` headers.
- **Background Remover API key:** Stored in `localStorage` only, sent directly to remove.bg, never to this site's servers.

---

## Project Structure

```
app/
  layout.tsx          # Shared header, footer, AdSense script
  page.tsx            # Homepage with tool grid
  compress/           # Image Compressor
  resize/             # Image Resizer
  convert/            # Format Converter
  crop/               # Crop & Rotate
  base64/             # Image to Base64
  color-picker/       # Color Picker
  exif/               # EXIF Viewer
  watermark/          # Image Watermarker
  rename/             # Bulk Image Renamer
  remove-bg/          # Background Remover
  about/              # About page
  contact/            # Contact page
  privacy/            # Privacy Policy
components/
  ToolLayout.tsx      # Shared wrapper for every tool page
  DropZone.tsx        # Drag-and-drop file upload with preview
  AdSlot.tsx          # Google AdSense ad unit
lib/
  validators.ts       # File validation (MIME, size, count, extensions)
  sanitize.ts         # Input and filename sanitization
```

---

## Deployment

The project deploys to Vercel automatically on push to `main`.

To deploy manually:

```bash
npx vercel --prod --name image-tools
```

---

## License

MIT
