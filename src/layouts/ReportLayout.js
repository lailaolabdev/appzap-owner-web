import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function ReportLayout() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          boxShadow: "1px 0px 10px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Button>ລາຍງານຍອດຂາຍ</Button>
          <Button variant="outline-primary">ລາຍງານສະຕ໊ອກ</Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/report/members-report")}
          >
            ລາຍງານສະມາຊິກ
          </Button>
          <Button variant="outline-primary">ການພະລິດ</Button>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
