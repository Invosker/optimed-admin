"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { cn } from "@/lib/utils"; // This import requires your project's path alias setup

// Define the props for the Checkbox component by extending the Radix UI CheckboxRootProps
// React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> already includes
// className, checked, onCheckedChange, disabled, etc.
export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>, // Specify the ref element type
  CheckboxProps // Specify the component's props type (which now solely relies on the Radix props)
>(({ className, checked, onCheckedChange, ...props }, ref) => {
  console.log("🚀 ~ checked:", checked, props.id)
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      // Use the props directly - their types are inherited from CheckboxProps which extends Radix's types
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={
        cn(
          "peer h-5 w-5 shrink-0 rounded border border-input shadow-sm shadow-bluePol/5 ring-offset-background transition-shadow focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:optimed data-[state=indeterminate]:border-blue-950 data-[state=checked]:bg-optimed-tiber data-[state=indeterminate]:bg-white",
          className,
        )
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {/* checked can be boolean or 'indeterminate', so we check explicitly */}
        {checked === "indeterminate" ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1 5C1 4.58579 1.33579 4.25 1.75 4.25H8.25C8.66421 4.25 9 4.58579 9 5C9 5.41421 8.66421 5.75 8.25 5.75H1.75C1.33579 5.75 1 5.41421 1 5Z"
            />
          </svg>
        ) : (
          // This SVG is rendered when checked is true (boolean)
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.97640 8.49358C3.75883 8.52167 3.53987 8.45309 3.37720 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.841050 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
            />
          </svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };