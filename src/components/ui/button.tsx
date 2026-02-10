import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PropsWithChildren } from "react";
import { cn } from "src/lib/utils";

// Note: gap-2 has been removed from base class. If you need icon+text spacing,
// add gap via the Button's className prop (e.g., <Button className="gap-2">)
const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[#5676DF] text-white shadow-sm hover:bg-[#5676DF]/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-[#fff] text-[#6A83FF] shadow-sm hover:bg-[#fff]/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[42px] px-4 py-3 rounded-[8px] text-[15px]",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-14 px-5 py-4 rounded-lg text-xl",
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

const Button = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
