import * as React from "react";

import { cn } from "src/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        // border-radius: 8px;
        // border: 1px solid var(--Gray-400, #464856);
        className={cn(
          "flex h-[42px] w-full rounded-[8px] border border-[#464856] bg-transparent px-3 py-2 text-[15px] outline-none",
          "file:border-0 file:bg-transparent file:text-[15px] file:font-medium file:text-foreground placeholder:text-muted-foreground ",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
