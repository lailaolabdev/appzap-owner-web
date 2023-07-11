import React from "react";
import { Modal, Button, InputGroup, Table, Form } from "react-bootstrap";
import { MdOutlineCloudDownload } from "react-icons/md";

export default function PopupDaySplitView({ open, onClose, reportData }) {
  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>Day Split View</Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <div style={{ padding: "10px 0", display: "flex" }}>
          <InputGroup>
            <Form.Control
              type="input"
              style={{ maxWidth: "150px" }}
              placeholder="Ex: 654321"
            />
            <Button variant="outline-primary">SEARCH</Button>
          </InputGroup>
          <div style={{ flex: 1 }} />
          <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <MdOutlineCloudDownload /> EXPORT
          </Button>
        </div>
        <div
          style={{
            border: "1px solid #fb6e3b",
            borderRadius: 8,
            overflow: "auto",
          }}
        >
          <Table
            style={{
              width: "100%",
              margin: 0,
            }}
            responsive
            variant="primary"
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Order</th>
                <th>Discount</th>
                <th>Bill</th>
                <th>Total</th>
              </tr>
            </thead>
          </Table>
          <div
            style={{
              width: "100%",
              margin: 0,
              overflow: "auto",
              maxHeight: 500,
              height: 500,
            }}
          >
            <Table
              style={{
                width: "100%",
                margin: 0,
              }}
              responsive
              variant="primary"
            >
              <tbody>
                {reportData?.map((e) => (
                  <tr>
                    <td>{e?.date}</td>
                    {/* <td>{e?.order}</td> */}
                    <td>{e?.discount}</td>
                    <td>{e?.billBefore}</td>
                    <td>{e?.billAmount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
