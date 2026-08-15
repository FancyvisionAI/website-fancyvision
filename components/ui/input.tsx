import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "border-ink/15 bg-canvas/70 placeholder:text-ink/40 focus:ring-cobalt/10 flex h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-cobalt focus:ring-2",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
