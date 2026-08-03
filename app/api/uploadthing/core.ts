import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 8 },
    pdf: { maxFileSize: "16MB", maxFileCount: 2 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const media = await db.media.create({
        data: {
          name: file.name,
          url: file.ufsUrl,
          key: file.key,
          mimeType: file.type,
          size: file.size,
          alt: file.name.replace(/\.[^.]+$/, "").replaceAll("-", " "),
          folder: "/",
        },
      });
      await db.auditLog.create({
        data: {
          userId: metadata.userId,
          action: "UPLOAD",
          entity: "media",
          entityId: media.id,
        },
      });
      return { mediaId: media.id, url: media.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
