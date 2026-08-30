type Node = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: Node[];
};

function nodeText(node: Node): string {
  if (node.text) return node.text;
  return node.content?.map(nodeText).join("") ?? "";
}

export function RichContent({ value }: { value: unknown }) {
  const document = value as Node | null;
  if (!document?.content) return null;
  return (
    <div className="rich-text">
      {document.content.map((node, index) => {
        const value = nodeText(node);
        if (!value) return null;
        if (node.type === "heading") {
          const level = Number(node.attrs?.level ?? 2);
          return level === 3 ? <h3 key={index}>{value}</h3> : <h2 key={index}>{value}</h2>;
        }
        if (node.type === "bulletList" || node.type === "orderedList") {
          const Comp = node.type === "bulletList" ? "ul" : "ol";
          return (
            <Comp key={index} className="my-6 space-y-2 pl-6 marker:font-medium">
              {node.content?.map((item, itemIndex) => (
                <li key={itemIndex}>{nodeText(item)}</li>
              ))}
            </Comp>
          );
        }
        return <p key={index}>{value}</p>;
      })}
    </div>
  );
}
