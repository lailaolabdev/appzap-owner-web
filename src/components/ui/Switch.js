import * as React from "react";
import { cn } from "../../utils/cn";

const Switch = React.forwardRef(
  ({ className, checked, onChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);

    // Sync internal state with external checked prop
    React.useEffect(() => {
      setIsChecked(checked || false);
    }, [checked]);

    const handleToggle = () => {
      if (disabled) return;
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      if (onChange) {
        onChange({ target: { checked: newChecked } });
      }
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        ref={ref}
        className={cn(
          "peer inline-flex h-6.5 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && isChecked
            ? "bg-primary shadow-inner"
            : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500",
          disabled && isChecked && "bg-primary opacity-50",
          disabled && !isChecked && "bg-gray-300 opacity-50",
          className
        )}
        onClick={handleToggle}
        disabled={disabled}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md",
            "ring-0 transition-all duration-300 ease-in-out transform",
            "dark:bg-gray-100",
            isChecked ? "translate-x-6" : "translate-x-0"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
