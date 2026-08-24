"use client";

import { Download, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { MediaPicker } from "@/components/admin/media-picker";
import { RichEditor } from "@/components/admin/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminField, AdminModule } from "@/lib/admin-modules";

type Item = Record<string, unknown> & { id: string };
type RelationOptions = Record<string, Array<{ label: string; value: string }>>;

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SCHEDULED: "Planifié",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
};

function formatDateTime(value: unknown) {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function ContentManager({
  moduleKey,
  config,
  initialItems,
  relationOptions,
  translatable = false,
}: {
  moduleKey: string;
  config: AdminModule;
  initialItems: Item[];
  relationOptions?: RelationOptions;
  translatable?: boolean;
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
  const subtitleOf = (item: Item) => {
    const raw =
      item.excerpt ??
      item.position ??
      item.company ??
      item.category ??
      item.status ??
      item.group ??
      "";
    return typeof raw === "string" ? raw : "";
  };

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
                <p className="flex items-center gap-2 truncate text-sm font-semibold">
                  <span className="truncate">{titleOf(item)}</span>
                  {translatable && item.locale === "en" && (
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      EN — orpheline
                    </span>
                  )}
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
                  {creating
                    ? "Création"
                    : editing?.locale === "en"
                      ? "Modification — version anglaise"
                      : "Modification"}
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
              moduleKey={moduleKey}
              config={config}
              item={editing}
              pending={pending}
              relationOptions={relationOptions}
              translatable={translatable}
              onOpenTranslation={(translation) => {
                setCreating(false);
                setEditing(translation);
              }}
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

function TranslationBlock({
  moduleKey,
  item,
  onOpenTranslation,
}: {
  moduleKey: string;
  item: Item;
  onOpenTranslation: (translation: Item) => void;
}) {
  const router = useRouter();
  const [regenerating, setRegenerating] = useState(false);
  const translations = Array.isArray(item.translations)
    ? (item.translations as Item[])
    : [];
  const translation = translations[0] ?? null;
  // Le bouton n'est actif que pour Service (P2) et Training (P3), et
  // seulement une fois la version anglaise déjà modifiée manuellement :
  // régénérer une traduction jamais éditée n'a pas de sens (elle se met
  // déjà à jour toute seule à chaque sauvegarde du FR).
  const TRANSLATION_ENGINE_MODULES = new Set(["services", "trainings"]);
  const canRegenerate =
    TRANSLATION_ENGINE_MODULES.has(moduleKey) &&
    Boolean(translation?.translationEditedAt);

  async function regenerate() {
    if (
      !window.confirm(
        "Cette version anglaise a été modifiée manuellement. La régénérer effacera ces modifications et les remplacera par une nouvelle traduction automatique. Continuer ?",
      )
    )
      return;
    setRegenerating(true);
    const response = await fetch("/api/admin/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: moduleKey, id: item.id }),
    });
    setRegenerating(false);
    if (!response.ok) {
      toast.error("Régénération impossible.");
      return;
    }
    toast.success(
      "Régénération lancée — la traduction sera prête sous quelques instants.",
    );
    router.refresh();
  }

  return (
    <div className="mt-2 grid gap-3 rounded-2xl border border-border bg-bg p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
        Version anglaise
      </p>
      {!translation ? (
        <p className="text-sm text-muted">Version anglaise : Non générée</p>
      ) : (
        <div className="grid gap-1.5 text-sm text-muted">
          <p>
            <span className="font-semibold text-ink">Statut : </span>
            {STATUS_LABELS[String(translation.status)] ??
              String(translation.status ?? "—")}
            {translation.translationStatus === "FAILED" && (
              <span className="ml-2 font-mono text-xs font-semibold text-red-500">
                échec de la dernière génération
              </span>
            )}
            {translation.translationStatus === "PENDING" && (
              <span className="ml-2 font-mono text-xs font-semibold text-amber-700">
                génération en cours
              </span>
            )}
          </p>
          <p>
            <span className="font-semibold text-ink">Générée le : </span>
            {formatDateTime(translation.translationGeneratedAt) ??
              "Non renseigné (traduction existante)"}
          </p>
          <p>
            <span className="font-semibold text-ink">
              Dernière modification :{" "}
            </span>
            {formatDateTime(translation.translationEditedAt) ?? "Jamais"}
          </p>
        </div>
      )}
      <div className="mt-1 flex flex-wrap gap-2">
        {translation && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenTranslation(translation)}
          >
            Relire l’anglais
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canRegenerate || regenerating}
          onClick={canRegenerate ? regenerate : undefined}
          title={
            canRegenerate
              ? undefined
              : moduleKey !== "services"
                ? "Bientôt disponible pour ce module"
                : "Disponible uniquement après une modification manuelle de la version anglaise"
          }
        >
          {regenerating ? "Régénération…" : "Régénérer"}
        </Button>
      </div>
    </div>
  );
}

function EditorForm({
  moduleKey,
  config,
  item,
  pending,
  relationOptions,
  translatable,
  onOpenTranslation,
  onSave,
}: {
  moduleKey: string;
  config: AdminModule;
  item: Item | null;
  pending: boolean;
  relationOptions?: RelationOptions;
  translatable: boolean;
  onOpenTranslation: (translation: Item) => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(item ?? {});
  const showTranslationBlock =
    translatable && Boolean(item) && !item?.translationOfId;

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
          <FieldInput
            field={field}
            value={values[field.name]}
            options={
              field.relationOptionsKey
                ? relationOptions?.[field.relationOptionsKey]
                : undefined
            }
            onChange={(value) => setValues({ ...values, [field.name]: value })}
          />
        </label>
      ))}
      <Button size="lg" disabled={pending} className="mt-4 w-fit">
        <Save className="mr-2 size-4" />{" "}
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
      {showTranslationBlock && item && (
        <TranslationBlock
          moduleKey={moduleKey}
          item={item}
          onOpenTranslation={onOpenTranslation}
        />
      )}
    </form>
  );
}

function FieldInput({
  field,
  value,
  options,
  onChange,
}: {
  field: AdminField;
  value: unknown;
  options?: Array<{ label: string; value: string }>;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "textarea") {
    return (
      <Textarea
        required={field.required}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "list") {
    const items = Array.isArray(value) ? (value as string[]) : [];
    return (
      <Textarea
        value={items.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0),
          )
        }
        className="min-h-32"
      />
    );
  }
  if (field.type === "richtext") {
    return <RichEditor value={value} onChange={onChange} />;
  }
  if (field.type === "json") {
    return (
      <Textarea
        value={JSON.stringify(value ?? null, null, 2)}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // Preserve the last valid value until the JSON is valid.
          }
        }}
        className="min-h-44 font-mono text-xs"
      />
    );
  }
  if (field.type === "media") {
    return (
      <MediaPicker
        value={String(value ?? "")}
        mediaKind={field.mediaKind ?? "image"}
        onChange={onChange}
      />
    );
  }
  if (field.type === "relation") {
    return (
      <select
        className="h-12 rounded-xl border border-border bg-canvas px-4"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">— Aucune —</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "select") {
    return (
      <select
        className="h-12 rounded-xl border border-border bg-canvas px-4"
        value={String(value ?? field.options?.[0]?.value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      >
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "boolean") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 accent-cobalt"
      />
    );
  }
  return (
    <Input
      type={field.type === "number" ? "number" : "text"}
      required={field.required}
      value={String(value ?? "")}
      onChange={(e) =>
        onChange(
          field.type === "number" ? Number(e.target.value) : e.target.value,
        )
      }
    />
  );
}
