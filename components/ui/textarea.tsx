import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "border-ink/15 bg-canvas/70 placeholder:text-ink/40 focus:ring-cobalt/10 flex min-h-32 w-full rounded-xl border px-4 py-3 text-sm text-ink outline-none transition focus:border-cobalt focus:ring-2",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
