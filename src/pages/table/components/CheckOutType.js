import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { COLOR_APP } from "../../../constants";
import Box from "../../../components/Box";
import { moneyCurrency } from "../../../helpers";
import _ from "lodash";

import ButtonPrimary from "../../../components/button/ButtonPrimary";

export default function CheckOutType({
  open,
  onClose,
  onSubmit,
  dataBill,
  tableData,
}) {
  // state
  const [cash, setCash] = useState();

  // val
  const totalBill = _.sumBy(dataBill?.orderId, (e) => e?.price * e?.quantity);

  const handleSubmit = () => {
    // onSubmit();
    alert(JSON.stringify());
    console.log(dataBill);
  };
  return (
    <Modal show={open} onHide={onClose} keyboard={false} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          ຄິດໄລເງິນ ໂຕະ ({tableData?.tableName}) - ລະຫັດ {tableData?.code}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <div
            style={{
              padding: 20,
              display: "flex",
              gap: 10,
              flexDirection: "column",
            }}
          >
            <div>
              <div>ລາຄາທັງໝົດທີ່ຕ້ອງຊຳລະ</div>
              <div
                style={{
                  backgroundColor: "#ccc",
                  padding: "flex",
                  padding: 10,
                }}
              >
                {moneyCurrency(totalBill)} ກີບ
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ButtonPrimary style={{ color: "white" }}>ເງິນສົດ</ButtonPrimary>
              <ButtonPrimary style={{ color: "white" }}>ເງິນໂອນ</ButtonPrimary>
              <ButtonPrimary style={{ color: "white" }}>
                ເງິນສົດ + ເງິນໂອນ
              </ButtonPrimary>
            </div>
            <div>
              <div>ລາຄາທັງໝົດທີ່ຕ້ອງຊຳລະ</div>
              <input
                style={{
                  backgroundColor: "#ccc",
                  padding: "flex",
                  padding: 10,
                  border: "none",
                  width: "100%",
                }}
                value={cash}
                onChange={(e) => setCash(e.target.value)}
              />
              <div>ຈຳນວນທີ່ຕ້ອງທອນ</div>
              <div
                style={{
                  backgroundColor: "#ccc",
                  padding: "flex",
                  padding: 10,
                }}
              >
                500,000 ກີບ
              </div>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <KeyboardComponents />
          </div>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <ButtonPrimary style={{ color: "white" }} onClick={handleSubmit}>
          ໄລເງິນ
        </ButtonPrimary>
      </Modal.Footer>
    </Modal>
  );
}

const KeyboardComponents = () => {
  const _num = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}
    >
      {_num?.map((e, i) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
              padding: 10,
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontWeight: "bold",
            }}
            key={i}
          >
            {e}
          </div>
        );
      })}
      <div />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
          padding: 10,
          backgroundColor: COLOR_APP,
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        0
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
          padding: 10,
          backgroundColor: COLOR_APP,
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        ,000
      </div>
    </div>
  );
};
