import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38bdf8] disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-[#030712]/80 text-[#f3f4f6] border border-[#1f293d] hover:border-[#38bdf8]/50 hover:bg-[#0f172a] shadow-lg shadow-black/40",
        bracket:
          "bg-transparent text-[#f0f6ff] border border-[#1e2d4a] hover:border-[#38bdf8] hover:text-[#38bdf8] px-5 py-2.5",
        accent:
          "bg-[#38bdf8] text-[#030712] font-semibold hover:bg-[#7dd3fc] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-[#38bdf8]",
        outline:
          "border border-[#1e2d4a] bg-transparent text-[#94a3b8] hover:bg-[#0f172a] hover:text-[#f8fafc] hover:border-[#334155]",
        ghost:
          "bg-transparent text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0f172a]/60",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3.5 text-[11px]",
        lg: "h-12 px-7 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, children, isBracketed = false, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {isBracketed ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="text-[#38bdf8] transition-transform duration-300 group-hover:-translate-x-1">[</span>
          <span>{children}</span>
          <span className="text-[#38bdf8] transition-transform duration-300 group-hover:translate-x-1">]</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
