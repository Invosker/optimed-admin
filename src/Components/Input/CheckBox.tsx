import { useFormContext, useController, FieldValues, Path, RegisterOptions, FieldErrors } from "react-hook-form";
import { Checkbox, CheckboxProps } from "../BaseComponents/ui/checkbox";
// import React from "react"; // Import React for FC

// Define the props for the CheckboxField component, extending CheckboxProps for any additional props passed to the Checkbox
interface CheckboxFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<CheckboxProps, "checked" | "onCheckedChange"> {
  /**
   * The name of the form field this checkbox is associated with, used by react-hook-form.
   */
  name: Path<TFieldValues>;
  /**
   * The label text for the checkbox.
   */
  label: string;
  /**
   * Validation rules for the checkbox field, used by react-hook-form.
   */
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
  >;
  /**
   * Indicates if the field is required. Used for displaying an asterisk in the label.
   */
  required?: boolean;
  // All other standard CheckboxProps are inherited via the Omit type.
}

/**
 * A form field component that integrates a Checkbox with react-hook-form.
 *
 * @template TFieldValues The type of the form values.
 * @param {CheckboxFieldProps<TFieldValues>} param0 The component's props.
 * @param {Path<TFieldValues>} param0.name The name of the form field.
 * @param {string} param0.label The label for the checkbox.
 * @param {RegisterOptions} [param0.rules] Validation rules.
 * @param {boolean} [param0.required] Whether the field is required.
 * @param {Omit<CheckboxProps, 'checked' | 'onCheckedChange'>} [param0.props] Additional props for the Checkbox component.
 * @returns {React.FC} A React functional component.
 */
export default function CheckboxField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  required,
  ...props
}: CheckboxFieldProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const { field } = useController<TFieldValues>({
    name,
    rules,
    control: control,
  });

  // Type assertion for errors to handle nested properties safely
  const formErrors = errors as FieldErrors<TFieldValues>;
  const error = formErrors[name]; // Access error for the specific field name

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        {...props}
        {...field} // Spreads value, onChange, onBlur from react-hook-form field
        checked={field.value as boolean} // Cast value to boolean, assuming checkbox values are boolean
        onCheckedChange={(checked: boolean | "indeterminate") => field.onChange(checked)} // Ensure correct type for onCheckedChange
        id={name as string} // Cast name to string for the id attribute
        className="peer"
      />
      {/* Use htmlFor for accessibility, linking the label to the checkbox by id */}
      <label htmlFor={name as string}>
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {error && ( // Conditionally render error message
        <p className="mt-2 text-xs text-destructive" role="alert" aria-live="polite">
          {error.message as string} {/* Display the error message */}
        </p>
      )}
    </div>
  );
}
