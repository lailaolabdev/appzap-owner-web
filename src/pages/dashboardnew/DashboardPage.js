import React from "react";
import { Card, Breadcrumb } from "react-bootstrap";
import { COLOR_APP } from "../../constants";

export default function DashboardPage() {
  return (
    <div style={{ padding: 20 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
          Library
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
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
            {[
              {
                title: "Total Sales",
                amount: 119440,
              },
              {
                title: "Tipping Amount",
                amount: 119440,
              },
              {
                title: "Total Cost",
                amount: 119440,
              },
              {
                title: "Gross Profit",
                amount: 119440,
              },
              {
                title: "No. of Sales Transactions",
                amount: 119440,
              },
              {
                title: "Average Sales/Transaction",
                amount: 119440,
              },
              {
                title: "No. of Voided Transactions",
                amount: 119440,
              },
              {
                title: "Total Amount Voided",
                amount: 119440,
              },
              {
                title: "Unpaid Transaction(s)",
                amount: 119440,
              },
            ].map((e) => (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: `1px dotted ${COLOR_APP}`,
                }}
              >
                <div>{e?.title}</div>
                <div>฿119440.00</div>
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
            Voucher Information
          </Card.Header>
          <Card.Body>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
                padding: "10px 0",
                borderBottom: `1px dotted ${COLOR_APP}`,
              }}
            >
              <div>Total Voucher Amount Redeemed</div>
              <div>฿119440.00</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
                padding: "10px 0",
                borderBottom: `1px dotted ${COLOR_APP}`,
              }}
            >
              <div>Number Of Voucher Redeemed</div>
              <div>2</div>
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
            Total Settlement by Payment Method
          </Card.Header>
          <Card.Body>
            <table style={{ width: "100%" }}>
              <tr>
                <th>Method</th>
                <th style={{ textAlign: "center" }}>Quantity</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
              {[
                {
                  method: "Visa",
                  qty: 9,
                  amount: 56789,
                },
                {
                  method: "Mastercard",
                  qty: 2,
                  amount: 56789,
                },
                {
                  method: "American Express",
                  qty: 9,
                  amount: 56789,
                },
                {
                  method: "Cash",
                  qty: 9,
                  amount: 56789,
                },
                {
                  method: "Voucher",
                  qty: 9,
                  amount: 56789,
                },
                {
                  method: "Total Settlement",
                  qty: 9,
                  amount: 56789,
                },
              ].map((e) => (
                <tr>
                  <td style={{ textAlign: "left" }}>{e?.method}</td>
                  <td>{e?.qty}</td>
                  <td style={{ textAlign: "right" }}>{e?.amount}</td>
                </tr>
              ))}
            </table>
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
            Sales by Tab
          </Card.Header>
          <Card.Body>
            <table style={{ width: "100%" }}>
              <tr>
                <th style={{ textAlign: "left" }}>Tab</th>
                <th style={{ textAlign: "center" }}>Quantity Sold</th>
                <th style={{ textAlign: "center" }}>Gross Sales</th>
                <th style={{ textAlign: "right" }}>Total Discount Given</th>
              </tr>
              {[
                {
                  tab: "Jacynthe",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Connor",
                  qty: 2,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Maida",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Joel",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Madisyn",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Krystal",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
              ].map((e) => (
                <tr>
                  <td style={{ textAlign: "left" }}>{e?.tab}</td>
                  <td style={{ textAlign: "center" }}>{e?.qty}</td>
                  <td style={{ textAlign: "center" }}>{e?.grossSales}</td>
                  <td style={{ textAlign: "right" }}>{e?.total}</td>
                </tr>
              ))}
            </table>
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
            Sales by Tab
          </Card.Header>
          <Card.Body>
            <table style={{ width: "100%" }}>
              <tr>
                <th style={{ textAlign: "left" }}>Tab</th>
                <th style={{ textAlign: "center" }}>Quantity Sold</th>
                <th style={{ textAlign: "center" }}>Gross Sales</th>
                <th style={{ textAlign: "right" }}>Total Discount Given</th>
              </tr>
              {[
                {
                  tab: "Jacynthe",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Connor",
                  qty: 2,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Maida",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Joel",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Madisyn",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
                {
                  tab: "Krystal",
                  qty: 9,
                  grossSales: 56789,
                  total: 4567,
                },
              ].map((e) => (
                <tr>
                  <td style={{ textAlign: "left" }}>{e?.tab}</td>
                  <td style={{ textAlign: "center" }}>{e?.qty}</td>
                  <td style={{ textAlign: "center" }}>{e?.grossSales}</td>
                  <td style={{ textAlign: "right" }}>{e?.total}</td>
                </tr>
              ))}
            </table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
