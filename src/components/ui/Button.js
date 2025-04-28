import * as React from "react";
import { cn } from "../../utils/cn";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = "button";

    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB6E3B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    const variantStyles = {
      primary: "bg-[#FB6E3B] text-white hover:bg-[#FB6E3B]/90",
      destructive: "bg-red-500 text-white hover:bg-red-500/90",
      outline:
        "border border-[#FB6E3B] !bg-transparent hover:!bg-[#FB6E3B]/10 !text-[#FB6E3B]",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      ghost: "hover:bg-gray-100 text-gray-700",
      link: "text-[#FB6E3B] underline-offset-4 hover:underline",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const buttonClass = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    return <Comp className={buttonClass} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };
