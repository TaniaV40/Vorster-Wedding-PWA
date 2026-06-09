import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#e1b382] text-black shadow-sm shadow-black/5 hover:bg-white",
        destructive:
          "bg-red-500 text-white shadow-sm shadow-black/5 hover:bg-red-500/90",
        outline:
          "border border-[#e1b382] bg-transparent text-[#e1b382] shadow-sm shadow-black/5 hover:bg-[#e1b382] hover:text-black",
        secondary:
          "bg-white/10 text-white shadow-sm shadow-black/5 hover:bg-white/20",
        ghost: "hover:bg-white/10 hover:text-white",
        link: "text-[#e1b382] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[5px] px-3 text-xs",
        lg: "h-12 rounded-[5px] px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
