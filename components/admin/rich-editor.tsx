"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading2, Italic, List } from "lucide-react";

export function RichEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Rédigez votre contenu…" }),
    ],
    content: value as never,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: "min-h-52 px-4 py-3 outline-none prose prose-neutral max-w-none",
      },
    },
  });
  if (!editor) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-black/15 bg-white">
      <div className="flex gap-1 border-b border-black/10 p-2">
        {[
          {
            label: "Gras",
            icon: Bold,
            action: () => editor.chain().focus().toggleBold().run(),
            active: editor.isActive("bold"),
          },
          {
            label: "Italique",
            icon: Italic,
            action: () => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive("italic"),
          },
          {
            label: "Titre",
            icon: Heading2,
            action: () =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            active: editor.isActive("heading"),
          },
          {
            label: "Liste",
            icon: List,
            action: () => editor.chain().focus().toggleBulletList().run(),
            active: editor.isActive("bulletList"),
          },
        ].map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={item.action}
            className={`grid size-9 place-items-center rounded-lg ${item.active ? "bg-ink text-white" : "hover:bg-black/5"}`}
            title={item.label}
          >
            <item.icon className="size-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
