import React from "react";
import * as consts from "../../constants";

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
        backgroundColor: disabled
          ? "rgba(251, 110, 59,0.3)"
          : "rgb(251, 110, 59)",
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
