"use client";

import { generateUploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();

export function MediaUploader() {
  const router = useRouter();
  return (
    <UploadButton
      endpoint="mediaUploader"
      appearance={{
        button:
          "rounded-full bg-accent px-6 text-sm font-semibold text-white after:bg-transparent",
        allowedContent: "text-xs text-muted",
      }}
      onClientUploadComplete={() => {
        toast.success("Fichier ajouté à la médiathèque.");
        router.refresh();
      }}
      onUploadError={(error) => {
        toast.error(error.message);
      }}
    />
  );
}
