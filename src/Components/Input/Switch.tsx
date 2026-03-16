"use client";

import { Label } from "@/Components/BaseComponents/ui/label.jsx"; // Assuming Label has been converted
import { Switch, SwitchProps } from "@/Components/BaseComponents/ui/switch"; // Assuming Switch has been converted and exports SwitchProps
import { useController, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

// Define the props for the SwitchLS component, extending SwitchProps for any additional props passed to the Switch
interface SwitchLSProps<TFieldValues extends FieldValues = FieldValues> extends Omit<SwitchProps, 'checked' | 'onCheckedChange'> {
  /**
   * The control object from react-hook-form, used to register the switch.
   */
  control: Control<TFieldValues>;
  /**
   * The name of the form field this switch is associated with, used by react-hook-form.
   */
  name: Path<TFieldValues>;
  /**
   * An array of two strings for the labels displayed on the switch thumb's positions.
   * labels[0] is for the checked state, labels[1] for the unchecked state.
   */
  labels?: [string, string]; // Tuple for exactly two strings
  /**
   * The primary label for the switch group (above the switch itself).
   */
  pLabel?: string;
  /**
   * Validation rules for the switch field, used by react-hook-form.
   */
  rules?: Omit<RegisterOptions<TFieldValues, Path<TFieldValues>>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate">;
  // All other standard SwitchProps (except checked and onCheckedChange) are inherited via the Omit type.
}

/**
 * A switch component integrated with react-hook-form, with custom labels on the thumb.
 *
 * @template TFieldValues The type of the form values.
 * @param {SwitchLSProps<TFieldValues>} param0 The component's props.
 * @param {Control<TFieldValues>} param0.control The react-hook-form control object.
 * @param {Path<TFieldValues>} param0.name The name of the form field.
 * @param {[string, string]} [param0.labels=['', '']] An array of two labels for the switch states.
 * @param {string} [param0.pLabel=''] The primary label for the switch group.
 * @param {RegisterOptions} [param0.rules=undefined] Validation rules.
 * @param {Omit<SwitchProps, 'checked' | 'onCheckedChange'>} [param0.props] Additional props for the Switch component.
 * @returns {React.FC} A React functional component.
 */
export default function SwitchLS<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  labels = ['', ''], // Default labels as an array of two empty strings
  pLabel = '', // Default pLabel to an empty string
  rules, // No default needed, let it be undefined by default
  ...props // Capture any additional props
}: SwitchLSProps<TFieldValues>) {

  const { field } = useController<TFieldValues>({
    control,
    name,
    // Remove defaultValue here to let the parent form or useController handle it appropriately
    shouldUnregister: rules?.shouldUnregister,
    rules,
  });

  return (
    <div className='grid grid-cols-12 space-y-2 mt-1 mx-1'>
      {/* Use htmlFor for accessibility, linking the label to the switch by id */}
      <Label htmlFor={name as string} className="col-span-full text-left mb-1 text-gray-400">
        {pLabel}
      </Label>
      <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium col-span-5 max-w-56 md:max-w-40">
        <Switch
          {...props} // Spread any additional props
          id={name as string} // Use the field name as the id for accessibility
          checked={field.value as boolean} // Cast value to boolean, assuming switch values are boolean
          onCheckedChange={field.onChange} // Map onCheckedChange to react-hook-form's onChange
          className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
        />
        {/* Display label for unchecked state */}
        <span className="min-w-6 flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
          <span className="text-[10px] font-medium uppercase">{labels[1]}</span>
        </span>
        {/* Display label for checked state */}
        <span className="min-w-6 flex pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background rtl:peer-data-[state=checked]:translate-x-full">
          <span className="text-[10px] font-medium uppercase">{labels[0]}</span>
        </span>
      </div>
      {/* Note: Error handling is not included in this component based on the original JS code.
                 If you need error display, you would typically access formState.errors
                 from useFormContext or useController as shown in previous examples. */}
    </div>
  );
}