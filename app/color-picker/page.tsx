"use client";

import { useState, useCallback, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import toast from "react-hot-toast";

interface PickedColor {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorPickerPage() {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [picked, setPicked] = useState<PickedColor | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setPicked(null);
    const img = new Image();
    img.onload = () => {
      setImgEl(img);
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const maxW = Math.min(img.naturalWidth, 700);
      const scale = maxW / img.naturalWidth;
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = URL.createObjectURL(f);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(x, y, 1, 1).data;
    const r = data[0], g = data[1], b = data[2];
    const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    const [h, s, l] = rgbToHsl(r, g, b);
    setPicked({ hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${h}, ${s}%, ${l}%)`, r, g, b });
  };

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`Copied ${value}`);
  };

  return (
    <ToolLayout
      title="Color Picker"
      description="Click anywhere on your image to pick a color. Get HEX, RGB, and HSL values instantly."
      currentHref="/color-picker"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} />

        {imgEl && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Click anywhere on the image to pick a color.</p>
            <div className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <canvas
                ref={canvasRef}
                className="max-w-full cursor-crosshair"
                onClick={handleCanvasClick}
                aria-label="Click to pick color from image"
              />
            </div>

            {picked && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div
                  className="h-20 w-full"
                  style={{ backgroundColor: picked.hex }}
                  aria-label={`Color swatch: ${picked.hex}`}
                />
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "HEX", value: picked.hex },
                    { label: "RGB", value: picked.rgb },
                    { label: "HSL", value: picked.hsl },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2"
                    >
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</p>
                        <p className="text-sm font-mono text-gray-900 dark:text-white">{item.value}</p>
                      </div>
                      <button
                        onClick={() => copy(item.value)}
                        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={`Copy ${item.label} value`}
                        title="Copy"
                      >
                        📋
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload any image. Move your cursor over it and click on any pixel to pick its color. The HEX, RGB, and HSL representations are shown instantly with a color swatch. Click the copy button next to each format to copy it to your clipboard.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
