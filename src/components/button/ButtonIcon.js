import React from "react";
import styled from "styled-components";
import { Dropdown } from "react-bootstrap";

export default function ButtonIcon({ children, ...other }) {
  return <Button {...other}>{children}</Button>;
}

const Button = styled(Dropdown.Menu)({
  width: 40,
  height: 40,
  borderRadius: 40,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "rgba(0,0,0,0.02)",
  },
});
