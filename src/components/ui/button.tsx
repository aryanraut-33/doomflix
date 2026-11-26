import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'ui-press ui-focus inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none',
  {
    variants: {
      variant: {
        default: 'bg-white text-doom-950 hover:bg-slate-200',
        destructive:
          'ui-press--on-dark bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25',
        outline:
          'ui-press--on-dark border border-white/14 bg-white/[0.04] text-slate-200 hover:text-white hover:bg-white/[0.08]',
        secondary:
          'ui-press--on-dark bg-white/[0.08] text-white border border-white/12 hover:bg-white/[0.14]',
        ghost: 'ui-press--on-dark hover:bg-white/[0.08] text-slate-300 hover:text-white',
        link: 'text-emerald-400 underline-offset-4 hover:underline',
        emerald:
          'bg-emerald-500 text-doom-950 font-semibold hover:bg-emerald-400',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6 text-sm',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
