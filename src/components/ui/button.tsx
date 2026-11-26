import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold uppercase tracking-wider transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-marvel select-none active:scale-[0.96]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-doom-red-bright border border-doom-red/50",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border bg-card/60 hover:bg-secondary hover:text-foreground hover:border-white/20",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 border border-border/80",
        ghost: "hover:bg-secondary/60 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        cinematic:
          "bg-primary text-white font-bold hover:bg-doom-red-bright border border-white/20 shadow-md",
        hud:
          "bg-doom-900 text-gray-300 border border-doom-border hover:border-doom-red/60 hover:text-white font-mono text-[11px]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-[11px]",
        lg: "h-11 rounded-xl px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
