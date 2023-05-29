import React, { Component } from "react";
import Spinner from "react-bootstrap/Spinner";

export default class Loading extends Component {
  render() {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            height: "100%",
            width: "100%",
            opacity: 0.5,
          }}
        ></div>
        <div
          style={{
            zIndex: 2,
            position: "absolute",
            alignSelf: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner animation="border" variant="danger" />
        </div>
      </div>
    );
  }
}
