"use client";

import { Download, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { RichEditor } from "@/components/admin/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminModule } from "@/lib/admin-modules";

type Item = Record<string, unknown> & { id: string };

export function ContentManager({
  moduleKey,
  config,
  initialItems,
}: {
  moduleKey: string;
  config: AdminModule;
  initialItems: Item[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const filtered = useMemo(
    () =>
      initialItems.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [initialItems, query],
  );
  const open = creating || editing;
  const titleOf = (item: Item) =>
    String(
      item.title ??
        item.name ??
        item.question ??
        item.email ??
        item.key ??
        item.action ??
        item.id,
    );
  const subtitleOf = (item: Item) =>
    String(
      item.excerpt ??
        item.position ??
        item.company ??
        item.category ??
        item.status ??
        item.group ??
        "",
    );

  async function remove(id: string) {
    if (!window.confirm("Supprimer définitivement cet élément ?")) return;
    const response = await fetch(
      `/api/admin/content?module=${moduleKey}&id=${id}`,
      { method: "DELETE" },
    );
    if (!response.ok) return toast.error("Suppression impossible.");
    toast.success("Élément supprimé.");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-muted">Administration</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">
            {config.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {config.description}
          </p>
        </div>
        <div className="flex gap-2">
          {config.exportable && (
            <Button asChild variant="outline">
              <a href={`/api/admin/export/${moduleKey}`}>
                <Download className="mr-2 size-4" /> Exporter CSV
              </a>
            </Button>
          )}
          {!config.readonly && config.allowCreate !== false && (
            <Button
              onClick={() => {
                setEditing(null);
                setCreating(true);
              }}
            >
              <Plus className="mr-2 size-4" /> Ajouter
            </Button>
          )}
        </div>
      </div>
      <div className="mt-8 rounded-3xl bg-canvas p-5">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="pl-11"
          />
        </div>
        <div className="mt-5 divide-y divide-black/10">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-canvas text-xs font-bold">
                {titleOf(item).slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {titleOf(item)}
                </p>
                <p className="mt-1 truncate text-xs text-muted">
                  {subtitleOf(item)}
                </p>
              </div>
              <span className="hidden text-xs text-muted md:block">
                {String(item.updatedAt ?? item.createdAt ?? "")?.slice(0, 10)}
              </span>
              {(!config.readonly || config.allowDelete) && (
                <>
                  {!config.readonly && (
                    <button
                      onClick={() => {
                        setCreating(false);
                        setEditing(item);
                      }}
                      className="hover:bg-ink/5 grid size-9 place-items-center rounded-full border border-border"
                      aria-label="Modifier"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  )}
                  {config.allowDelete !== false && (
                    <button
                      onClick={() => remove(item.id)}
                      className="grid size-9 place-items-center rounded-full border border-red-100 text-red-500 hover:bg-red-50"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
          {!filtered.length && (
            <p className="py-12 text-center text-sm text-muted">
              Aucun élément.
            </p>
          )}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="ml-auto min-h-full w-full max-w-3xl rounded-[2rem] bg-canvas p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  {creating ? "Création" : "Modification"}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {creating ? `Nouveau ${config.singular}` : titleOf(editing!)}
                </h2>
              </div>
              <button
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                className="grid size-10 place-items-center rounded-full border border-border"
              >
                <X className="size-4" />
              </button>
            </div>
            <EditorForm
              key={editing?.id ?? "new"}
              config={config}
              item={editing}
              pending={pending}
              onSave={async (data) => {
                setPending(true);
                const response = await fetch("/api/admin/content", {
                  method: editing ? "PATCH" : "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    module: moduleKey,
                    id: editing?.id,
                    data,
                  }),
                });
                setPending(false);
                if (!response.ok) {
                  toast.error("Enregistrement impossible.");
                  return;
                }
                toast.success(
                  "Contenu enregistré et disponible immédiatement.",
                );
                setCreating(false);
                setEditing(null);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EditorForm({
  config,
  item,
  pending,
  onSave,
}: {
  config: AdminModule;
  item: Item | null;
  pending: boolean;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(item ?? {});
  return (
    <form
      className="mt-8 grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void onSave(values);
      }}
    >
      {config.fields.map((field) => (
        <label key={field.name} className="grid gap-2 text-sm font-semibold">
          {field.label}
          {field.type === "textarea" ? (
            <Textarea
              required={field.required}
              value={String(values[field.name] ?? "")}
              onChange={(e) =>
                setValues({ ...values, [field.name]: e.target.value })
              }
            />
          ) : field.type === "richtext" ? (
            <RichEditor
              value={values[field.name]}
              onChange={(value) =>
                setValues((current) => ({ ...current, [field.name]: value }))
              }
            />
          ) : field.type === "json" ? (
            <Textarea
              value={JSON.stringify(values[field.name] ?? null, null, 2)}
              onChange={(e) => {
                try {
                  setValues({
                    ...values,
                    [field.name]: JSON.parse(e.target.value),
                  });
                } catch {
                  // Preserve the last valid value until the JSON is valid.
                }
              }}
              className="min-h-44 font-mono text-xs"
            />
          ) : field.type === "select" ? (
            <select
              className="h-12 rounded-xl border border-border bg-canvas px-4"
              value={String(
                values[field.name] ?? field.options?.[0]?.value ?? "",
              )}
              onChange={(e) =>
                setValues({ ...values, [field.name]: e.target.value })
              }
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "boolean" ? (
            <input
              type="checkbox"
              checked={Boolean(values[field.name])}
              onChange={(e) =>
                setValues({ ...values, [field.name]: e.target.checked })
              }
              className="size-5 accent-cobalt"
            />
          ) : (
            <Input
              type={field.type === "number" ? "number" : "text"}
              required={field.required}
              value={String(values[field.name] ?? "")}
              onChange={(e) =>
                setValues({
                  ...values,
                  [field.name]:
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                })
              }
            />
          )}
        </label>
      ))}
      <Button size="lg" disabled={pending} className="mt-4 w-fit">
        <Save className="mr-2 size-4" />{" "}
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
