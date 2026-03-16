"use client";

import { cn } from "@/lib/utils"; // Assuming "@/lib/utils" exports a cn function
import * as React from "react";


// Define the props for the Label component by extending the standard HTML label attributes
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>( // Specify the ref element type and component's props type
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-4 text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  ),
);

Label.displayName = "Label";

export { Label };