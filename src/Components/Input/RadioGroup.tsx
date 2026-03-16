import { Label } from "@/Components/BaseComponents/ui/label"; // Assuming Label has been converted
import { RadioGroup, RadioGroupItem } from "@/Components/BaseComponents/ui/radio-group"; // Assuming RadioGroup and RadioGroupItem have been converted and RadioGroupProps is exported
import { useId } from "react"; // Import useId and React
import { Control, FieldValues, Path } from "react-hook-form"; // Import necessary types from react-hook-form

// Define the structure for the items in the radio group
interface RadioItem {
  /**
   * The value of the radio item. This will be the value submitted with the form.
   * Radix UI RadioGroup expects values to be strings.
   */
  value: string;
  /**
   * The label displayed next to the radio button.
   */
  label: string;
}

// Define the props for the RadioGroupLS component
interface RadioGroupLSProps<TFieldValues extends FieldValues = FieldValues> {
  /**
   * The control object from react-hook-form, used to register the radio group.
   */
  control: Control<TFieldValues>;
  /**
   * The name of the form field this radio group is associated with, used by react-hook-form.
   */
  name: Path<TFieldValues>;
  /**
   * An array of items to render as radio buttons. Each item should have a value and a label.
   */
  items: RadioItem[];
  /**
   * The label for the radio group (used as the fieldset legend).
   */
  label: string;
  // Additional props for the RadioGroup component can be added here if needed,
  // or they can be spread directly onto the RadioGroup if they are part of RadioGroupProps.
  // For this example, we'll rely on the spread of control and name.
}

/**
 * A radio group component integrated with react-hook-form.
 * It renders a set of radio buttons based on the provided items array.
 *
 * @template TFieldValues The type of the form values.
 * @param {RadioGroupLSProps<TFieldValues>} param0 The component's props.
 * @param {Control<TFieldValues>} param0.control The react-hook-form control object.
 * @param {Path<TFieldValues>} param0.name The name of the form field.
 * @param {RadioItem[]} param0.items An array of radio items with value and label.
 * @param {string} param0.label The label for the radio group.
 * @returns {React.FC} A React functional component.
 */
export default function RadioGroupLS<TFieldValues extends FieldValues = FieldValues>({
  name,
  items,
  label,
}: RadioGroupLSProps<TFieldValues>) {
  const id = useId(); // Use useId hook for generating unique IDs

  return (
    <fieldset className="space-y-4">
      {/* Use the label prop as the fieldset legend */}
      <legend className="text-sm font-medium leading-none text-foreground">{label}</legend>
      <RadioGroup name={name} className="flex flex-wrap gap-2" defaultValue="1">
        {items.map((item) => (
          <div
            key={`${id}-${item.value}`} // Use the generated id combined with item value for unique keys
            className="relative flex flex-col items-start gap-4 rounded-lg border border-input p-3 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                id={`${id}-${item.value}`} // Use the generated id combined with item value for the id attribute
                value={item.value}
                className="after:absolute after:inset-0"
              />
              {/* Use htmlFor for accessibility, linking the label to the radio item by id */}
              <Label htmlFor={`${id}-${item.value}`}>{item.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
