import { Input, InputProps } from "@/Components/BaseComponents/ui/input"; // Assuming Input has been converted and exports InputProps
import { Label } from "@/Components/BaseComponents/ui/label"; // Assuming Label has been converted
import { cn } from "@/lib/utils"; // Assuming "@/lib/utils" exports a cn function
import { useMemo, useState } from "react"; // Import useState and React
import { useFormContext, FieldValues, Path, RegisterOptions, FieldErrors } from "react-hook-form";

import { EyeIcon, EyeOffIcon } from "lucide-react"; // Assuming lucide-react is installed
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

// Define the props for the TextField component, extending InputProps for any additional props passed to the Input
interface TextFieldProps<TFieldValues extends FieldValues = FieldValues> extends InputProps {
  /**
   * The name of the form field this input is associated with, used by react-hook-form.
   */
  name: Path<TFieldValues>;
  /**
   * The label text for the input.
   */
  label: string;
  /**
   * The placeholder text for the input.
   */
  placeholder?: string;
  /**
   * Validation rules for the input field, used by react-hook-form.
   */
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;

  type?: string;
  // All other standard InputProps are inherited.
}

/**
 * A form field component that integrates an Input with react-hook-form,
 * including optional password visibility toggle.
 *
 * @template TFieldValues The type of the form values.
 * @param {TextFieldProps<TFieldValues>} param0 The component's props.
 * @param {Path<TFieldValues>} param0.name The name of the form field.
 * @param {string} param0.label The label for the input.
 * @param {string} [param0.placeholder=''] The placeholder text.
 * @param {RegisterOptions} [param0.rules] Validation rules.
 * @param {InputProps} [param0.props] Additional props for the Input component, including 'type'.
 * @returns {React.FC} A React functional component.
 */
export default function TextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = "",
  rules,
  disabled,
  className,
  ...props
}: TextFieldProps<TFieldValues>) {
  const { register, formState: { errors } } = useFormContext<TFieldValues>();
  // Initialize isVisible based on the initial type prop
  const [isVisible, setIsVisible] = useState<boolean>(!(props.type === 'password'));

  const isFetching = useIsFetching() > 0
  const isMutating = useIsMutating() > 0

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  // Type assertion for errors to handle nested properties safely
  const formErrors = errors as FieldErrors<TFieldValues>;
  const error = formErrors[name]; // Access error for the specific field name

  // Determine the input type dynamically based on the original type prop and isVisible state
  const inputType =
    props.type === "password" ? (isVisible ? "text" : "password") : props.type;

  const newDisabled = useMemo(() => isFetching || isMutating || disabled, [isFetching, isMutating, disabled]);

  return (
    <div className="space-y-2 text-left">
      {/* Use htmlFor for accessibility, linking the label to the input by id */}
      <Label
        className="text-black dark:text-gray-400 font-caviar"
        htmlFor={name as string}
      >
        {label} {rules?.required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          // Use the field name as the id for accessibility
          id={name as string}
          className={cn(
            className,
            "font-caviar",
            error &&
            "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/30"
          )}
          placeholder={placeholder}
          {...register(name, rules)} // Register the input with react-hook-form
          {...props} // Spread the rest of the props
          disabled={newDisabled} // Apply the disabled state
          type={inputType} // Use the dynamically determined input type
        />
        {
          // Conditionally render the visibility toggle button for password fields
          props.type === "password" && (
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button" // Set type to button to prevent form submission
              onClick={toggleVisibility}
            // aria-label={isVisible ? "Hide password" : "Show password"}
            // aria-pressed={isVisible}
            >
              {isVisible ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          )
        }
      </div>
      {
        // Conditionally render error message
        error && (
          <p
            className="mt-2 text-xs text-destructive"
            role="alert"
            aria-live="polite"
          >
            {error.message as string} {/* Display the error message */}
          </p>
        )
      }
    </div>
  );
}