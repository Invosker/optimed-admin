import { cn } from "@/lib/utils"; // Assuming "@/lib/utils" exports a cn function
import { ChevronDown } from "lucide-react"; // Assuming lucide-react is installed
import * as React from "react";

// Define the props for the SelectNative component by extending the standard HTML select attributes
export type SelectNativeProps = React.SelectHTMLAttributes<HTMLSelectElement>

const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>( // Specify the ref element type and component's props type
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "peer inline-flex w-full cursor-pointer appearance-none items-center rounded-lg border border-input bg-background text-sm text-foreground shadow-sm shadow-black/5 ring-offset-background transition-shadow focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[option[disabled]:checked]:text-muted-foreground",
            props.multiple
              ? "py-1 [&>*]:px-3 [&>*]:py-1 [&_option:checked]:bg-accent"
              : "h-9 pe-8 ps-3",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {!props.multiple && ( // Conditionally render the ChevronDown icon
          <span className="pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50">
            <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        )}
      </div>
    );
  },
);

SelectNative.displayName = "SelectNative";

export { SelectNative };