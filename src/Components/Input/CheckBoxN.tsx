import { Checkbox, CheckboxProps } from "@/Components/BaseComponents/ui/checkbox"; // Assuming Checkbox has been converted and exports CheckboxProps
import { Label } from "@/Components/BaseComponents/ui/label"; // Assuming Label has been converted
// import React from "react"; // Import React for FC

// Define the props for the CheckboxField component, extending CheckboxProps but omitting onCheckedChange
interface CheckboxFieldProps extends Omit<CheckboxProps, 'onCheckedChange'> {
    /**
     * The name of the checkbox field. Used for the id and htmlFor attributes.
     */
    name: string;
    /**
     * The label text for the checkbox.
     */
    label: string;
    /**
     * Indicates if the field is required. Used for displaying an asterisk in the label.
     */
    required?: boolean;
    /**
     * Callback function triggered when the checked state of the checkbox changes.
     * It receives the new checked state (boolean or 'indeterminate') as an argument.
     */
    onCheckedChange?: (checked: boolean) => void;
    // All other standard CheckboxProps (except onCheckedChange) are inherited via the Omit type.
}

/**
 * A simple Checkbox form field component.
 *
 * @param {CheckboxFieldProps} param0 The component's props.
 * @param {string} param0.name The name and id of the checkbox.
 * @param {string} param0.label The label for the checkbox.
 * @param {boolean} [param0.required] Whether the field is required.
 * @param {function(checked: boolean | 'indeterminate'): void} [param0.onChange] Callback for when the checked state changes.
 * @param {Omit<CheckboxProps, 'onCheckedChange'>} [param0.props] Additional props for the Checkbox component.
 * @returns {React.FC} A React functional component.
 */
export default function CheckboxField({ name, label, required, onCheckedChange, ...props }: CheckboxFieldProps) {
    return (
        <div className="flex items-center gap-2">
            <Checkbox
                {...props}
                onCheckedChange={onCheckedChange}
                id={name}
                className="peer"
            />
            {/* Use htmlFor for accessibility, linking the label to the checkbox by id */}
            <Label htmlFor={name}>
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
        </div>
    );
}