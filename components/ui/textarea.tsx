import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-32 w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm outline-none transition placeholder:text-black/40 focus:border-cobalt focus:ring-2 focus:ring-cobalt/10",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
