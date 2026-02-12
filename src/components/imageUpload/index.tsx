import { CloudUpload } from "lucide-react";
import React, { useCallback, useMemo, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

export type FileDropzoneProps = {
  value: File[]; // controlled files (newly selected)
  onChange: (files: File[]) => void; // update files
  onReject?: (rejections: FileRejection[]) => void;
  accept?: { [mime: string]: string[] };
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  disabled?: boolean;
  name?: string;
  error?: string;
  helperText?: string;
  className?: string;
  dropLabel?: React.ReactNode;
  // Existing server media to show as previews (absolute URLs)
  previews?: string[];
  // New: callback to remove an existing server preview by URL
  onRemoveExisting?: (url: string) => void;
};

const isImage = (urlOrType: string) =>
  /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(urlOrType) ||
  urlOrType.startsWith("image/");
const isVideo = (urlOrType: string) =>
  /\.(mp4|webm|ogg|mov|m4v)$/i.test(urlOrType) ||
  urlOrType.startsWith("video/");

const revokeAll = (urls: string[]) => {
  urls.forEach((u) => {
    try {
      if (u.startsWith("blob:")) URL.revokeObjectURL(u);
    } catch {}
  });
};

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  value,
  onChange,
  onReject,
  accept,
  maxFiles = 1,
  maxSize,
  minSize = 0,
  disabled = false,
  name,
  error,
  helperText,
  className,
  dropLabel = "Glissez-déposez les fichiers ici, ou cliquez pour sélectionner",
  previews = [],
  onRemoveExisting,
}) => {
  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (accepted.length) {
        const next =
          maxFiles === 1
            ? accepted.slice(0, 1)
            : [...value, ...accepted].slice(0, maxFiles);
        onChange(next);
      }
      if (rejected.length && onReject) onReject(rejected);
    },
    [onChange, onReject, value, maxFiles]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    minSize,
    disabled,
    multiple: maxFiles > 1,
  });

  const internalError =
    isDragReject || fileRejections.length
      ? fileRejections
          .flatMap((rej) => rej.errors.map((e) => e.message))
          .filter(Boolean)
          .join(", ")
      : "";

  // Object URLs for newly selected files
  const newFilePreviews = useMemo(
    () =>
      value.map((f) => ({
        key: `${f.name}-${f.size}-${f.lastModified}`,
        url: URL.createObjectURL(f),
        type: f.type || "",
        isNew: true,
      })),
    [value]
  );

  // Cleanup object URLs (revoke only blobs)
  useEffect(() => {
    const urls = newFilePreviews.map((p) => p.url);
    return () => revokeAll(urls);
  }, [newFilePreviews]);

  // Existing server previews
  const existingPreviews = useMemo(
    () =>
      (previews || []).map((u, i) => ({
        key: `existing-${i}-${u}`,
        url: u,
        type: "",
        isNew: false,
      })),
    [previews]
  );

  const allPreviews = useMemo(
    () => [...existingPreviews, ...newFilePreviews],
    [existingPreviews, newFilePreviews]
  );

  // Remove only newly-added file by index among new ones
  const removeNewFileAt = (newIndex: number) => {
    const next = value.slice();
    next.splice(newIndex, 1);
    onChange(next);
  };

  // Remove an existing server preview by URL (delegated to parent)
  const removeExistingByUrl = (url: string) => {
    if (onRemoveExisting) onRemoveExisting(url);
  };

  return (
    <div className={className}>
      <div
        {...getRootProps({
          className: [
            "rounded border p-4 cursor-pointer",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            isDragActive ? "border-blue-500" : "border-gray-300 dark:border-neutral-700",
            isDragReject ? "border-red-500" : "",
            error ? "border-red-500" : "",
          ].join(" "),
        })}
      >
        <input {...getInputProps({ name })} />
        <div className="text-sm flex flex-col items-center gap-4 dark:text-neutral-300">
          <CloudUpload size={50} className="text-gray-400" />
          {dropLabel}
        </div>

        {allPreviews.length ? (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allPreviews.map((p, idx) => {
              const showImage = isImage(p.type || p.url);
              const showVideo = isVideo(p.type || p.url);
              const isNew = p.isNew;
              const newIndex = isNew
                ? newFilePreviews.findIndex((n) => n.url === p.url)
                : -1;
              return (
                <div
                  key={p.key}
                  className="relative rounded overflow-hidden"
                >
                  {showImage && (
                    <img
                      src={p.url}
                      alt="preview"
                      className="w-full h-28 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  )}
                  {!showImage && showVideo && (
                    <video
                      src={p.url}
                      className="w-full h-28 object-cover"
                      controls
                    />
                  )}
                  {!showImage && !showVideo && (
                    <div className="w-full h-28 flex flex-col items-center justify-center gap-1 text-xs text-gray-700 px-2 text-center">
                      <span className="font-medium break-all">
                        {p.isNew
                          ? value[newIndex]?.name
                          : p.url.split("/").pop()}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {p.isNew
                          ? `${Math.round(value[newIndex]?.size / 1024)} KB`
                          : "Existing file"}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      if (newIndex >= 0) {
                        removeNewFileAt(newIndex);
                      } else {
                        removeExistingByUrl(p.url);
                      }
                    }}
                    className="absolute top-1 right-1 text-xs px-2 py-1 rounded bg-black/60 text-white hover:bg-black/70 cursor-pointer"
                    aria-label="Remove file"
                    title={isNew ? "Supprimer le nouveau fichier" : "Supprimer le fichier existant"}
                  >
                    Supprimer
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="mt-1 text-xs text-gray-500">{helperText}</div>
      <div className="mt-1 text-xs text-red-600">{error || internalError}</div>
    </div>
  );
};

export default FileDropzone;
