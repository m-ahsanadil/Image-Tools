"use client";

import { useCallback, useRef, useState } from "react";
import { validateFiles, formatBytes } from "@/lib/validators";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
}

export default function DropZone({
  onFiles,
  multiple = false,
  maxFiles = 1,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [previews, setPreviews] = useState<{ name: string; size: string; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (rawFiles: FileList | File[]) => {
      setErrors([]);
      const fileArray = Array.from(rawFiles).slice(0, maxFiles);
      const { valid, errors: errs } = await validateFiles(fileArray);
      setErrors(errs);

      if (valid.length > 0) {
        const newPreviews = valid.map((f) => ({
          name: f.name,
          size: formatBytes(f.size),
          url: URL.createObjectURL(f),
        }));
        setPreviews(newPreviews);
        onFiles(valid);
      }
    },
    [onFiles, maxFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  return (
    <div className="w-full space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center w-full min-h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 select-none
          ${isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.01]"
            : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple={multiple}
          className="sr-only"
          onChange={handleInputChange}
          aria-label="Upload image files"
        />
        <svg
          className={`w-10 h-10 mb-3 transition-colors ${isDragging ? "text-blue-500" : "text-gray-400"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDragging ? "Drop your image here" : "Drag & drop or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          JPEG, PNG, WebP, GIF, AVIF — max 10 MB{multiple ? ` (up to ${maxFiles} files)` : ""}
        </p>
      </div>

      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 space-y-1"
        >
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">&#x26A0;</span>
              {err}
            </p>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((p, i) => (
            <div
              key={i}
              className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-1.5">
                <p className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium">{p.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{p.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
