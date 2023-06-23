import React from "react";
import { Card } from "react-bootstrap";
import { COLOR_APP } from "../../constants";

export default function DashboardPage() {
  return (
    <div
      style={{
        padding: 20,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
      }}
    >
      <Card border="primary" style={{ margin: 0 }}>
        <Card.Header
          style={{
            backgroundColor: COLOR_APP,
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Sales Information
        </Card.Header>
        <Card.Body>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap:10
            }}
          >
            <div>Total Sales</div>
            <div>฿119440.00</div>
          </div>
        </Card.Body>
      </Card>
      <Card border="primary" style={{ margin: 0 }}>
        <Card.Header
          style={{
            backgroundColor: COLOR_APP,
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          testet
        </Card.Header>
        <Card.Body>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
              padding: 10,
            }}
          ></div>
        </Card.Body>
      </Card>
    </div>
  );
}
