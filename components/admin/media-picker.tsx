"use client";

import { FileText, FolderOpen, ImageOff, Trash2 } from "lucide-react";
import { useState } from "react";

import { MediaUploader } from "@/components/admin/media-uploader";

type MediaItem = {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  alt: string;
};

function filenameFromUrl(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop() ?? url);
  } catch {
    return url;
  }
}

export function MediaPicker({
  value,
  onChange,
  mediaKind,
}: {
  value: string;
  onChange: (url: string) => void;
  mediaKind: "image" | "pdf";
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<MediaItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function openLibrary() {
    setLibraryOpen(true);
    if (library) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/content?module=media&kind=${mediaKind}`,
      );
      const items = response.ok ? ((await response.json()) as MediaItem[]) : [];
      setLibrary(items);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-canvas p-3">
        {mediaKind === "image" ? (
          value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="size-16 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="grid size-16 shrink-0 place-items-center rounded-lg border border-dashed border-border text-muted">
              <ImageOff className="size-5" />
            </div>
          )
        ) : (
          <div className="grid size-16 shrink-0 place-items-center rounded-lg border border-border text-cobalt">
            <FileText className="size-6" />
          </div>
        )}
        <div className="min-w-0 flex-1 text-xs text-muted">
          {value ? (
            <span className="break-all">{filenameFromUrl(value)}</span>
          ) : (
            <span>Aucun fichier sélectionné.</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <MediaUploader
          label={
            mediaKind === "image" ? "Importer une image" : "Importer un PDF"
          }
          compact
          expectedKind={mediaKind}
          onUploaded={(file) => onChange(file.url)}
        />
        <button
          type="button"
          onClick={openLibrary}
          className="hover:bg-ink/5 inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-canvas px-4 text-xs font-semibold text-ink"
        >
          <FolderOpen className="size-3.5" /> Choisir dans la médiathèque
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-100 px-4 text-xs font-semibold text-red-500 hover:bg-red-50"
          >
            <Trash2 className="size-3.5" /> Supprimer
          </button>
        )}
      </div>

      {libraryOpen && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setLibraryOpen(false)}
        >
          <div
            className="max-h-[70vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-canvas p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Médiathèque —{" "}
                {mediaKind === "image" ? "images" : "documents PDF"}
              </h3>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="text-xs font-semibold text-muted hover:text-ink"
              >
                Fermer
              </button>
            </div>
            {loading ? (
              <p className="py-8 text-center text-sm text-muted">Chargement…</p>
            ) : !library?.length ? (
              <p className="py-8 text-center text-sm text-muted">
                Aucun fichier {mediaKind === "image" ? "image" : "PDF"} dans la
                médiathèque pour l’instant.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {library.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.url);
                      setLibraryOpen(false);
                    }}
                    className="grid gap-2 rounded-xl border border-border p-2 text-left hover:border-accent"
                  >
                    {mediaKind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="grid aspect-square place-items-center rounded-lg bg-bg text-cobalt">
                        <FileText className="size-8" />
                      </div>
                    )}
                    <span className="truncate text-[11px] text-muted">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
