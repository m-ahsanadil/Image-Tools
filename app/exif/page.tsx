"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import DropZone from "@/components/DropZone";
import toast from "react-hot-toast";

interface ExifData {
  Camera: Record<string, string>;
  Image: Record<string, string>;
  GPS: Record<string, string>;
  DateTime: Record<string, string>;
}

export default function ExifPage() {
  const [file, setFile] = useState<File | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [loading, setLoading] = useState(false);
  const [strippingGPS, setStrippingGPS] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
    setExifData(null);
  }, []);

  const readExif = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    try {
      const exifr = (await import("exifr")).default;
      const raw = await exifr.parse(file, true);

      if (!raw) {
        toast("No EXIF data found in this image.", { icon: "ℹ️" });
        setExifData({ Camera: {}, Image: {}, GPS: {}, DateTime: {} });
        setLoading(false);
        return;
      }

      const fmt = (v: unknown): string => {
        if (v === null || v === undefined) return "";
        if (typeof v === "object") return JSON.stringify(v).slice(0, 120);
        return String(v);
      };

      const categories: ExifData = {
        Camera: {},
        Image: {},
        GPS: {},
        DateTime: {},
      };

      const cameraKeys = ["Make", "Model", "LensModel", "FNumber", "ExposureTime", "ISO", "FocalLength", "Flash", "ExposureProgram", "MeteringMode", "WhiteBalance"];
      const imageKeys = ["ImageWidth", "ImageHeight", "ExifImageWidth", "ExifImageHeight", "Orientation", "ColorSpace", "BitsPerSample", "Compression", "ResolutionUnit", "XResolution", "YResolution"];
      const gpsKeys = ["latitude", "longitude", "GPSAltitude", "GPSSpeed", "GPSImgDirection", "GPSDestBearing"];
      const dtKeys = ["DateTimeOriginal", "CreateDate", "ModifyDate", "GPSDateStamp", "GPSTimeStamp", "OffsetTime"];

      for (const [key, val] of Object.entries(raw)) {
        const s = fmt(val);
        if (!s) continue;
        if (cameraKeys.includes(key)) categories.Camera[key] = s;
        else if (imageKeys.includes(key)) categories.Image[key] = s;
        else if (gpsKeys.includes(key)) categories.GPS[key] = s;
        else if (dtKeys.includes(key)) categories.DateTime[key] = s;
      }

      setExifData(categories);
    } catch {
      toast.error("Failed to read EXIF data.");
    } finally {
      setLoading(false);
    }
  }, [file]);

  const stripGPS = useCallback(async () => {
    if (!file) return;
    setStrippingGPS(true);
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `no-gps-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
          a.click();
          toast.success("Downloaded — GPS data stripped!");
          setStrippingGPS(false);
        }, "image/jpeg", 0.95);
      };
      img.src = url;
    } catch {
      toast.error("Failed to strip GPS.");
      setStrippingGPS(false);
    }
  }, [file]);

  const hasGPS = exifData && Object.keys(exifData.GPS).length > 0;

  return (
    <ToolLayout
      title="EXIF Viewer"
      description="Read camera, GPS, and date metadata embedded in your photos. Optionally strip GPS before downloading."
      currentHref="/exif"
    >
      <div className="space-y-6">
        <DropZone onFiles={handleFiles} />

        {file && (
          <div className="space-y-4">
            <button
              onClick={readExif}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Reading EXIF...
                </>
              ) : "Read EXIF Data"}
            </button>

            {exifData && (
              <div className="space-y-4">
                {(Object.entries(exifData) as [keyof ExifData, Record<string, string>][]).map(([category, entries]) => {
                  const rows = Object.entries(entries);
                  if (rows.length === 0) return null;
                  return (
                    <div key={category} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-sm text-gray-800 dark:text-gray-200">
                        {category === "DateTime" ? "Date & Time" : category}
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {rows.map(([key, val]) => (
                          <div key={key} className="flex px-4 py-2 text-sm">
                            <span className="w-48 shrink-0 text-gray-500 dark:text-gray-400 font-medium">{key}</span>
                            <span className="text-gray-900 dark:text-white break-all">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {hasGPS && (
                  <button
                    onClick={stripGPS}
                    disabled={strippingGPS}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    {strippingGPS ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Stripping...
                      </>
                    ) : "⚠ Strip GPS & Download"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Upload a JPEG or TIFF photo, then click &quot;Read EXIF Data&quot;. Camera model, exposure settings, GPS coordinates, and timestamps are shown in organized tables. If GPS data is present, use &quot;Strip GPS &amp; Download&quot; to remove it before sharing.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
