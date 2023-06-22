import React from "react";
import styled from "styled-components";
import { Card, Button } from "react-bootstrap";

export default function ReportMenuPage() {
  return (
    <div
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ReportCard />
    </div>
  );
}

function ReportCard() {
  return (
    <Card style={{ margin: 0 }}>
      <Card.Header>ລາຍເດືອນ</Card.Header>
      <Card.Body>
        <Card.Title>Special title treatment</Card.Title>
        <Card.Text>
          With supporting text below as a natural lead-in to additional content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}
