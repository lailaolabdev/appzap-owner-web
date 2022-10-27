import React from "react";
import * as consts from "../../constants";

export default function ButtonPrimary({ text, children,style, ...other }) {
  return (
    <div
      style={{
        backgroundColor: consts.COLOR_APP,
        borderRadius: 8,
        padding: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        ...style
      }}
      {...other}
    >
      {children || text || "Button"}
    </div>
  );
}
