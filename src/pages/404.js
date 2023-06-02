import React from "react";
import styled from "styled-components";

export default function _404() {
  return (
    <Root>
      <Container>
        <h1>404</h1>
        <p>Oops! The page you are looking for does not exist.</p>
        <a href="/">Go back to homepage</a>
      </Container>
    </Root>
  );
}

const Root = styled("div")({
  backgroundColor: "#F9D6B9",
  fontFamily: "Arial, sans-serif",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const Container = styled("div")({
  backgroundColor: "#FFA07A",
  borderRadius: 10,
  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
  color: "#FFF",
  maxWidth: 600,
  width: "100%",
  padding: 20,
  textAlign: "center",
  h1: {
    fontSize: 100,
    marginTop: 0,
  },

  a: {
    color: "#FFF",
    display: "block",
    marginTop: 20,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});
