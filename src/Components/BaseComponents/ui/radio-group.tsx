"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { useController, FieldValues, Path, useFormContext } from "react-hook-form"; // Import Control and relevant types from react-hook-form

import { cn } from "@/lib/utils"; // Assuming "@/lib/utils" exports a cn function

// Define the props for the RadioGroup component
export interface RadioGroupProps<TFieldValues extends FieldValues = FieldValues>
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /**
   * The name of the form field this radio group is associated with, used by react-hook-form.
   */
  name: Path<TFieldValues>;
  /**
   * The control object from react-hook-form, used to register the radio group.
   */
  // className prop is already included in React.ComponentPropsWithoutRef
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>, // Specify the ref element type
  RadioGroupProps // Specify the component's props type
>(({ className, name, ...props }, ref) => {

  const methods = useFormContext(); // Use the useFormContext hook to access the form state and methods

  const { field } = useController({ name, control: methods.control });

  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      {...field} // Spread field props (like value, onChange, onBlur)
      onValueChange={field.onChange} // Explicitly map onValueChange to field.onChange
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

// Define the props for the RadioGroupItem component
export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  className?: string; // className is optional
  // className prop is already included in React.ComponentPropsWithoutRef
  // All other necessary props like 'value' are included in RadioGroupPrimitive.ItemProps
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>, // Specify the ref element type
  RadioGroupItemProps // Specify the component's props type
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square size-4 rounded-full border border-input shadow-sm shadow-black/5 ring-offset-background transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-current">
        <svg
          width="6"
          height="6"
          viewBox="0 0 6 6"
          fill="currentcolor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3" r="3" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };