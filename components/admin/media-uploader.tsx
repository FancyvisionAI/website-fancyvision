"use client";

import { generateUploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();

export function MediaUploader({
  label = "Importer un fichier",
  compact = false,
  expectedKind,
  onUploaded,
}: {
  label?: string;
  compact?: boolean;
  /** Rejette côté client tout fichier dont le type ne correspond pas. */
  expectedKind?: "image" | "pdf";
  /** Appelé en plus du toast/refresh par défaut, avec l'URL du fichier déposé. */
  onUploaded?: (file: { url: string; name: string; mediaId: string }) => void;
}) {
  const router = useRouter();
  return (
    <UploadButton
      endpoint="mediaUploader"
      content={{ button: label }}
      appearance={{
        button: compact
          ? "rounded-xl border border-border bg-canvas px-4 text-xs font-semibold text-ink after:bg-transparent"
          : "rounded-full bg-accent px-6 text-sm font-semibold text-white after:bg-transparent",
        allowedContent: "text-xs text-muted",
      }}
      onBeforeUploadBegin={(files) => {
        if (!expectedKind) return files;
        const mismatch = files.find((file) =>
          expectedKind === "pdf"
            ? file.type !== "application/pdf"
            : !file.type.startsWith("image/"),
        );
        if (mismatch) {
          toast.error(
            expectedKind === "pdf"
              ? "Seuls les fichiers PDF sont acceptés ici."
              : "Seules les images sont acceptées ici.",
          );
          return [];
        }
        return files;
      }}
      onClientUploadComplete={(res) => {
        const file = res[0];
        if (!file) return;
        toast.success("Fichier ajouté à la médiathèque.");
        onUploaded?.({
          url: file.serverData.url,
          name: file.name,
          mediaId: file.serverData.mediaId,
        });
        router.refresh();
      }}
      onUploadError={(error) => {
        toast.error(error.message);
      }}
    />
  );
}
