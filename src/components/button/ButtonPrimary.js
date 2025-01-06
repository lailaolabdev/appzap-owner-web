import React from "react";
import theme from "../../theme";

export default function ButtonPrimary({
  text,
  children,
  style,
  disabled,
  onClick,
  ...other
}) {
  return (
    <div
      style={{
        backgroundColor: disabled ? theme.mutedColor : theme.primaryColor,
        borderRadius: 8,
        padding: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        ...style,
      }}
      onClick={() => (disabled ? "" : onClick())}
      {...other}
    >
      {children || text || "Button"}
    </div>
  );
}
