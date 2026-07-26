import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 tracking-wider uppercase",
  {
    variants: {
      variant: {
        default:
          "border-[#1e2d4a] bg-[#0a0f1e] text-[#38bdf8] hover:border-[#38bdf8]/50",
        accent:
          "border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8]",
        secondary:
          "border-[#1e2d4a] bg-[#1e2d4a]/40 text-[#8fa3c0]",
        outline:
          "text-[#f0f6ff] border-[#1e2d4a]",
        active:
          "border-[#4fcea6]/40 bg-[#4fcea6]/10 text-[#4fcea6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, children, isBracketed = false, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {isBracketed ? `[ ${children} ]` : children}
    </div>
  );
}

export { Badge, badgeVariants };
