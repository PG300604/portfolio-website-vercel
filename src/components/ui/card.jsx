import * as React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-xl border border-[#1e2d4a]/80 bg-[#0a0f1e]/90 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#38bdf8]/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.06)] group",
      className
    )}
    {...props}
  >
    {/* Specia1ne bracket corner accents */}
    <span className="absolute top-2 left-2 font-mono text-[9px] text-[#38bdf8]/40 pointer-events-none transition-colors group-hover:text-[#38bdf8]">[</span>
    <span className="absolute top-2 right-2 font-mono text-[9px] text-[#38bdf8]/40 pointer-events-none transition-colors group-hover:text-[#38bdf8]">]</span>
    <span className="absolute bottom-2 left-2 font-mono text-[9px] text-[#38bdf8]/40 pointer-events-none transition-colors group-hover:text-[#38bdf8]">[</span>
    <span className="absolute bottom-2 right-2 font-mono text-[9px] text-[#38bdf8]/40 pointer-events-none transition-colors group-hover:text-[#38bdf8]">]</span>
    
    {children}
  </div>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4 border-b border-[#1e2d4a]/50", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-sora text-lg font-bold tracking-tight text-[#f0f6ff]", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-mono text-xs text-[#8fa3c0]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-[#1e2d4a]/50 mt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
