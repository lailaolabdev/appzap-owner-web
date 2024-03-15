import React from "react";
import { Spinner } from "react-bootstrap";

export default function LoadingAppzap() {
  return (
    <div
      style={{
        width: "100%",
        height: 300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap:3
      }}
    >
      <Spinner variant="danger" animation="border" />
      <p>ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>
  );
}
