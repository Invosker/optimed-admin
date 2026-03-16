import { Label } from "@/Components/BaseComponents/ui/label"; // Assuming Label has been converted
import { SelectNative, SelectNativeProps } from "@/Components/BaseComponents/ui/select-native"; // Assuming SelectNative has been converted and exports SelectNativeProps
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useMemo } from "react";
import { useFormContext, FieldValues, Path, RegisterOptions } from "react-hook-form";

// Define the structure for the options in the select dropdown
interface SelectOption {
  /**
   * The value of the option. This will be the value submitted with the form.
   */
  value: string | number | readonly string[] | undefined; // Allow various value types
  /**
   * The label displayed for the option.
   */
  label: string;
}

// Define the props for the SelectN component, extending SelectNativeProps for any additional props passed to the SelectNative
interface SelectNProps<TFieldValues extends FieldValues = FieldValues> extends Omit<SelectNativeProps, "children"> {
  // Omit children as we generate them internally
  /**
   * The name of the form field this select is associated with, used by react-hook-form.
   */
  name: Path<TFieldValues>;
  /**
   * Validation rules for the select field, used by react-hook-form.
   */
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  /**
   * An array of options to render in the select dropdown. Each option should have a value and a label.
   */
  options?: SelectOption[];
  /**
   * The label text for the select dropdown.
   */
  label: string;
  // All other standard SelectNativeProps (except children) are inherited via the Omit type.
}

/**
 * A native select dropdown component integrated with react-hook-form.
 * It renders a select element with options based on the provided items array.
 *
 * @template TFieldValues The type of the form values.
 * @param {SelectNProps<TFieldValues>} param0 The component's props.
 * @param {Path<TFieldValues>} param0.name The name of the form field.
 * @param {RegisterOptions} [param0.rules] Validation rules.
 * @param {SelectOption[]} [param0.options=[]] An array of select options with value and label.
 * @param {string} param0.label The label for the select dropdown.
 * @param {Omit<SelectNativeProps, 'children'>} [param0.props] Additional props for the SelectNative component.
 * @returns {React.FC} A React functional component.
 */
export default function SelectN<TFieldValues extends FieldValues = FieldValues>({
  name,
  rules,
  disabled,
  options = [], // Default to an empty array if options are not provided
  label,
  ...props // Capture any additional props
}: SelectNProps<TFieldValues>) {
  const { register } = useFormContext<TFieldValues>();

  const isFetching = useIsFetching() > 0;
  const isMutating = useIsMutating() > 0;

  const newDisabled = useMemo(() => isFetching || isMutating || disabled, [isFetching, isMutating, disabled]);

  return (
    <div className="space-y-2 text-left">
      {/* Use htmlFor for accessibility, linking the label to the select by name */}
      <Label className="text-black dark:text-gray-400" htmlFor={name as string}>
        {label} {rules?.required && <span className="text-destructive">*</span>}
      </Label>
      <SelectNative
        {...register(name, rules)} // Register the select with react-hook-form
        id={name as string} // Use the field name as the id for accessibility
        {...props} // Spread any additional props
        disabled={newDisabled} // Use the calculated disabled state
      >
        {/* Render a default empty option */}
        <option value={rules?.valueAsNumber === true ? 0 : ""}>{"Seleccione una opción"}</option>
        {
          // Map over the options array to render each option
          options.map((option, index) => {
            return (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            );
          })
        }
      </SelectNative>
    </div>
  );
}
