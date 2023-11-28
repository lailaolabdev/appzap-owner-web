import React from "react";
import { Card, Breadcrumb, Form, Button } from "react-bootstrap";
import { moneyCurrency } from "../../helpers";
import { COLOR_APP } from "../../constants";
import { MdAssignmentAdd } from "react-icons/md";
import { BsCurrencyExchange } from "react-icons/bs";

export default function ReportStockPage() {
  return (
    <div style={{ padding: 20 }}>
      <Breadcrumb>
        <Breadcrumb.Item>ລາຍງານ</Breadcrumb.Item>
        <Breadcrumb.Item active>ລາຍງານສະຕ໊ອກ</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          gridGap: 10,
          marginBottom: 20,
        }}
      >
        <Card border="secondary" bg="light">
          <Card.Header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Dashboard
          </Card.Header>
          <Card.Body>
            {[
              {
                title: "ລາຍການສະຕ໊ອກທັງໝົດ",
                value: 8089,
              },
              {
                title: "ລາຍການສະຕ໊ອກທັງໝົດ",
                value: 8089,
              },
              {
                title: "ລາຍການສະຕ໊ອກທັງໝົດ",
                value: 8089,
              },
              {
                title: "ລາຍການສະຕ໊ອກທັງໝົດ",
                value: 8089,
              },
            ].map((e) => (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: `1px dotted #000`,
                }}
              >
                <div>{e?.title}</div>
                <div>{e?.value}</div>
              </div>
            ))}
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
            ຂໍ້ມູນບິນ
          </Card.Header>
          <Card.Body></Card.Body>
        </Card>
      </div>
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, maxWidth: 240 }}>
          <Form.Control />
          <Button>Search</Button>
        </div>
        <div>
          <Form.Control as="select">
            <option>ທັງໝົດ</option>
            <option value="1">ເຄືອງດືມ</option>
            <option value="2">ເຄືອງປຸງ</option>
            <option value="3">ຫວັດຖຸດິບ</option>
          </Form.Control>
        </div>
        <Button>ໃບສັ່ງຊື້</Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
          gap: 10,
          gridGap: 10,
        }}
      >
        {[...new Array(60)].map((e) => (
          <Card border="secondary" bg="light">
            <Card.Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <span>
                <BsCurrencyExchange /> ສະກຸນເງິນ
              </span>
              <Button variant="dark" bg="dark" size="sm">
                <MdAssignmentAdd />
              </Button>
            </Card.Header>
            <Card.Body
              style={{
                padding: 10,
              }}
            >
              <div>ອອກລ້າສຸດ: 23/02/2023</div>
              <div>ເຂົ້າລ້າສຸດ: 23/02/2023</div>
              <div>
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    overflow: "hidden",
                    height: 20,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "green",
                      width: "90%",
                      height: "100%",
                    }}
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
