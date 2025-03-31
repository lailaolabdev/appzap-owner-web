import React from "react";
import { cn } from "../../utils/cn";

const Label = React.forwardRef(function Label(props, ref) {
  const { className, children, ...otherProps } = props;

  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...otherProps}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

export { Label };
