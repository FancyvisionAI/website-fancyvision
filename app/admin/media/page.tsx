import Image from "next/image";

import { MediaUploader } from "@/components/admin/media-uploader";
import { db } from "@/lib/db";

export default async function MediaPage() {
  const items = await db.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-black/45">Administration</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">
            Médiathèque
          </h1>
          <p className="mt-3 text-sm text-black/50">
            Images et documents sécurisés via UploadThing.
          </p>
        </div>
        <MediaUploader />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-3xl bg-white"
          >
            <div className="relative aspect-[1.3/1] bg-canvas">
              {item.mimeType.startsWith("image/") ? (
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-3xl font-black text-cobalt">
                  PDF
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="truncate text-sm font-semibold">{item.name}</p>
              <p className="mt-1 truncate text-xs text-black/40">{item.alt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
