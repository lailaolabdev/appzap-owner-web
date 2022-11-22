import React from "react";
import { COLOR_APP } from "../../constants";
import styled from "styled-components";

export default function ButtonTab({ style, children, active, ...other }) {
  return (
    <div
      style={{
        color: active ? COLOR_APP : "#000000",
        fontWeight: active ? "bold":"lighter",
        position: "relative",
      }}
    >
      <Tab style={{ ...style }} {...other}>
        {children}
      </Tab>
      {active && (
        <div
          style={{
            backgroundColor: COLOR_APP,
            height: 5,
            borderRadius: 5,
            width: "100%",
            position: "absolute",
            bottom: "-3px",
          }}
        />
      )}
    </div>
  );
}

const Tab = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  height: 64,
  fontSize: 16,
  padding: 10,
  ":hover": {
    backgroundColor: "rgba(0,0,0,0.02)",
  },
});
