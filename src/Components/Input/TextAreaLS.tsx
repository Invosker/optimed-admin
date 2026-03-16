import { Label } from "@/Components/BaseComponents/ui/label"; // Assuming Label has been converted
import { Textarea, TextareaProps } from "@/Components/BaseComponents/ui/textarea"; // Assuming Textarea has been converted and exports TextareaProps
import { useFormContext, FieldValues, Path, RegisterOptions, FieldErrors } from "react-hook-form";

// Define the props for the TextAreaLS component, extending TextareaProps for any additional props passed to the Textarea
interface TextAreaLSProps<TFieldValues extends FieldValues = FieldValues> extends TextareaProps {
  /**
   * The name of the form field this textarea is associated with, used by react-hook-form.
   */
  name: Path<TFieldValues>;
  /**
   * The label text for the textarea.
   */
  label: string;
  /**
   * The placeholder text for the textarea.
   */
  placeholder?: string; // Make placeholder optional as in JS code
  /**
   * Validation rules for the textarea field, used by react-hook-form.
   */
  rules?: Omit<RegisterOptions<TFieldValues, Path<TFieldValues>>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate">;
  /**
   * Indicates if the field is required. Used for displaying an asterisk in the label.
   * Note: The `required` prop is also passed to the <Textarea> element.
   */
  required?: boolean; // Make required optional as in JS code
  // All other standard TextareaProps are inherited.

}

/**
 * A textarea form field component that integrates with react-hook-form.
 *
 * @template TFieldValues The type of the form values.
 * @param {TextAreaLSProps<TFieldValues>} param0 The component's props.
 * @param {Path<TFieldValues>} param0.name The name of the form field.
 * @param {string} param0.label The label for the textarea.
 * @param {string} [param0.placeholder] The placeholder text.
 * @param {RegisterOptions} [param0.rules] Validation rules.
 * @param {boolean} [param0.required] Whether the field is required.
 * @param {TextareaProps} [param0.props] Additional props for the Textarea component.
 * @returns {React.FC} A React functional component.
 */
export default function TextAreaLS<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder, // Keep placeholder destructured for direct use
  rules,
  required, // Keep required destructured for label asterisk
  ...props // Capture any additional props
}: TextAreaLSProps<TFieldValues>) {
  const { register, formState: { errors } } = useFormContext<TFieldValues>();

  // Type assertion for errors to handle nested properties safely
  const formErrors = errors as FieldErrors<TFieldValues>;
  const error = formErrors[name]; // Access error for the specific field name

  return (
    <div className="space-y-2">
      {/* Use htmlFor for accessibility, linking the label to the textarea by name */}
      <Label className='text-black dark:text-gray-400' htmlFor={name as string}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        id={name as string} // Use the field name as the id for accessibility
        placeholder={placeholder} // Pass placeholder directly
        {...register(name, rules)} // Register the textarea with react-hook-form
        {...props} // Spread any additional props
        required={required} // Pass the required prop to the native textarea element
      />
      {
        // Conditionally render error message
        error && (
          <p className="mt-2 text-xs text-destructive" role="alert" aria-live="polite">
            {error.message as string} {/* Display the error message */}
          </p>
        )
      }
    </div>
  );
}