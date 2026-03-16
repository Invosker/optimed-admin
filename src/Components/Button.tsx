import { Button as BaseButton, ButtonProps as BaseButtonProps } from "@/Components/BaseComponents/ui/button"; // Assuming your BaseButton is the converted ui/button and exports its props
import { LoaderCircle } from "lucide-react"; // Assuming lucide-react is installed
import { cn } from "@/lib/utils"; // Assuming "@/lib/utils" exports a cn function
import { useMemo } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

// Define the specific props for this enhanced Button component
interface ButtonProps extends Omit<BaseButtonProps, 'children' | 'disabled'> {
  /**
   * The text label displayed inside the button.
   */
  label?: string;
  /**
   * If true, a loading spinner is shown and the button is disabled.
   */
  loading?: boolean; // Optional loading state
  /**
   * If true, the button is disabled. Takes precedence over `loading`.
   */
  disabled?: boolean; // Optional disabled state
  // className, type, and onClick are already included in BaseButtonProps (after Omit)
  onClick?: () => void; // Optional click handler
  children?: React.ReactNode; // Optional children
}

/**
 * An enhanced Button component that includes a loading state with a spinner.
 * It wraps a BaseButton component and forwards relevant props.
 *
 * @param {ButtonProps} param0 The component's props.
 * @param {string} param0.label The text label for the button.
 * @param {boolean} [param0.loading] If true, shows a loader and disables the button.
 * @param {string} [param0.className] Additional CSS classes for the button.
 * @param {'button' | 'submit' | 'reset'} [param0.type] The button type.
 * @param {React.MouseEventHandler<HTMLButtonElement>} [param0.onClick] Click handler for the button.
 * @param {boolean} [param0.disabled] If true, disables the button.
 * @param {Omit<BaseButtonProps, 'children' | 'disabled'>} [param0.props] Additional props for the BaseButton component.
 * @returns {React.FC} A React functional component for the button.
 */
export default function Button({
  label,
  // loading,
  className,
  type,
  onClick,
  disabled,
  children,
  ...props // Capture any additional props not explicitly destructured
}: ButtonProps) {
  // Determine the disabled state: true if loading is true or if disabled prop is true

  const isFetching = useIsFetching() > 0
  const isMutating = useIsMutating() > 0

  const newDisabled = useMemo(() => isFetching || isMutating || disabled, [isFetching, isMutating, disabled]);

  const loading = useMemo(() => isFetching || isMutating, [isFetching, isMutating]);

  return (
    <BaseButton
      type={type}
      disabled={newDisabled} // Use the calculated disabled state
      onClick={onClick}
      className={cn(
        "w-full p-2 rounded hover:opacity-80 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed",
        className,
        // Optional: Add specific styling when loading
        loading && "flex items-center justify-center"
      )}
      {...props} // Spread any additional props to the BaseButton
    >
      {
        // Conditionally render the loading spinner
        loading && (
          <LoaderCircle
            className="-ms-1 me-2 animate-spin" // Check if bg-bluePol is intended for the loader or the button
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        )
      }
      {/* Render the button label */}
      {label || children}
    </BaseButton>
  );
}