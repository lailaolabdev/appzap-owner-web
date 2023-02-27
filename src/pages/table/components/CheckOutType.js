import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Box from "../../../components/Box";
import { moneyCurrency } from "../../../helpers";
import axios from "axios";
import { COLOR_APP, END_POINT } from "../../../constants";
import { getHeaders } from "../../../services/auth";
import Swal from "sweetalert2";
import { errorAdd } from "../../../helpers/sweetalert";

import _ from "lodash";

import ButtonPrimary from "../../../components/button/ButtonPrimary";
import { useStore } from "../../../store";

export default function CheckOutType({
  open,
  onClose,
  onSubmit,
  dataBill,
  tableData,
}) {
  // state
  const [cash, setCash] = useState();
  const [transfer, setTransfer] = useState(0);
  const [tab, setTab] = useState("cash");
  const [forcus, setForcus] = useState("CASH");
  const [canCheckOut, setCanCheckOut] = useState(false);
  const [total, setTotal] = useState();

  const { setSelectedTable, getTableDataStore } = useStore();

  // val
  const totalBill = _.sumBy(dataBill?.orderId, (e) => e?.price * e?.quantity);
  useEffect(() => {
    for (let i = 0; i < dataBill?.orderId.length; i++) {
      _calculateTotal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBill]);
  // function
  const _checkBill = async () => {
    await axios
      .put(
        END_POINT + `/v3/bill-checkout`,
        {
          id: dataBill?._id,
          data: {
            isCheckout: "true",
            status: "CHECKOUT",
            payAmount: cash,
            transferAmount: transfer,
            billAmount: totalBill,
            paymentMethod: forcus,
          },
        },
        {
          headers: await getHeaders(),
        }
      )
      .then(async function (response) {
        setSelectedTable();
        getTableDataStore();
        setCash(0);
        setTransfer(0);
        onClose();
        Swal.fire({
          icon: "success",
          title: "ສໍາເລັດການເຊັກບິນ",
          showConfirmButton: false,
          timer: 1800,
        });
      })
      .catch(function (error) {
        errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ");
      });
  };
  const handleSubmit = () => {
    _checkBill();
    onSubmit();
  };

  const _calculateTotal = () => {
    let _total = 0;
    for (let i = 0; i < dataBill?.orderId.length; i++) {
      if (dataBill?.orderId[i]?.status === "SERVED") {
        _total += dataBill?.orderId[i]?.quantity * dataBill?.orderId[i]?.price;
      }
    }
    setTotal(_total);
  };

  // useEffect
  useEffect(() => {
    if ((cash - 0 + (transfer - 0) -
      (dataBill && dataBill?.discountType === "LAK"
        ? totalBill - (dataBill?.discount) > 0 ? totalBill - dataBill?.discount : 0
        : totalBill - (totalBill * dataBill?.discount / 100) > 0 ? (totalBill * dataBill?.discount / 100) : 0))
      >= 0) {
      setCanCheckOut(true);
    } else {
      setCanCheckOut(false);
    }
  }, [cash, transfer, totalBill]);

  let transferCal = dataBill?.discountType === "LAK"
  ? totalBill - dataBill?.discount > 0 ? totalBill - dataBill?.discount : 0
  : totalBill - totalBill * dataBill?.discount / 100 > 0 ? (totalBill * dataBill?.discount / 100) : 0

  return (
    <Modal
      show={open}
      onHide={() => {
        setCash(0);
        // setTransfer(0);
        onClose();
      }}
      keyboard={false}
      size="xl"
    >
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
                {/* {moneyCurrency(totalBill)} ກີບ */}
                {dataBill && dataBill?.discountType === "LAK"
                  ? moneyCurrency(total - dataBill?.discount > 0 ? total - dataBill?.discount : 0)
                  : moneyCurrency(total - (total * dataBill?.discount) / 100 > 0 ? total - (total * dataBill?.discount) / 100 : 0)} ກີບ
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ButtonPrimary
                style={{
                  color: "white",
                  backgroundColor: tab === "cash" ? COLOR_APP : "#ffac8e",
                }}
                onClick={() => {
                  setCash(0);
                  setTransfer(0);
                  setTab("cash");
                  setForcus("CASH");
                }}
              >
                ເງິນສົດ
              </ButtonPrimary>
              <ButtonPrimary
                style={{
                  color: "white",
                  backgroundColor: tab === "transfer" ? COLOR_APP : "#ffac8e",
                }}
                onClick={() => {
                  setCash(0);
                  setTransfer(transferCal);
                  setTab("transfer");
                }}
              >
                ເງິນໂອນ
              </ButtonPrimary>
              <ButtonPrimary
                style={{
                  color: "white",
                  backgroundColor:
                    tab === "cash_transfer" ? COLOR_APP : "#ffac8e",
                }}
                onClick={() => {
                  setCash(0);
                  setTransfer(0);
                  setTab("cash_transfer");
                  setForcus("TRANSFER_CASH");
                }}
              >
                ເງິນສົດ + ເງິນໂອນ
              </ButtonPrimary>
            </div>
            {/* ---------tabs--------- */}
            <div style={{ display: tab === "cash" ? "block" : "none" }}>
              <div>
                <div>ລາຄາທັງໝົດທີ່ຕ້ອງຊຳລະ (ເງິນສົດ)</div>
                <input
                  type="number"
                  style={{
                    backgroundColor: "#ccc",
                    padding: "flex",
                    padding: 10,
                    border: "none",
                    width: "100%",
                  }}
                  forcus={true}
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
                  {moneyCurrency(cash - (dataBill && dataBill?.discountType === "LAK"
                    ? (totalBill - dataBill?.discount > 0 ? totalBill - dataBill?.discount : 0)
                    : (totalBill - (totalBill * dataBill?.discount) / 100 > 0 ? totalBill - (totalBill * dataBill?.discount) / 100 : 0)) <= 0
                    ? 0 : cash -
                    (dataBill && dataBill?.discountType === "LAK"
                      ? (totalBill - dataBill?.discount > 0 ? totalBill - dataBill?.discount : 0)
                      : (totalBill - (totalBill * dataBill?.discount) / 100 > 0 ? totalBill - (totalBill * dataBill?.discount) / 100 : 0)))}{" "}
                  ກີບ
                </div>
              </div>
            </div>
            <div style={{ display: tab === "transfer" ? "block" : "none" }}>
              <div>
                <div>ລາຄາທັງໝົດທີ່ຕ້ອງຊຳລະ (ເງິນໂອນ)</div>
                <div
                  style={{
                    backgroundColor: "#ccc",
                    padding: "flex",
                    padding: 10,
                  }}
                >
                  {/* {moneyCurrency(totalBill)} ກີບ */}
                  {dataBill && dataBill?.discountType === "LAK"
                    ? moneyCurrency(totalBill - (dataBill?.discount) > 0 ? totalBill - dataBill?.discount : 0)
                    : moneyCurrency(totalBill - (totalBill * dataBill?.discount / 100) > 0 ? totalBill - (totalBill * dataBill?.discount / 100) : 0)} ກີບ
                </div>
              </div>
            </div>
            <div style={{ display: tab === "cash_transfer" ? "block" : "none" }}>
              <div>
                <div>(ເງິນສົດ)</div>
                <input
                  type="number"
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
                <div>(ເງິນໂອນ)</div>
                <input
                  type="number"
                  style={{
                    backgroundColor: "#ccc",
                    padding: "flex",
                    padding: 10,
                    border: "none",
                    width: "100%",
                  }}
                  value={transfer}
                  onChange={(e) => setTransfer(e.target.value)}
                />
                <div>ຈຳນວນທີ່ຕ້ອງທອນ</div>
                <div
                  style={{
                    backgroundColor: "#ccc",
                    padding: "flex",
                    padding: 10,
                  }}
                >
                  {moneyCurrency(
                    cash - 0 + (transfer - 0) -
                      (dataBill && dataBill?.discountType === "LAK"
                        ? total - dataBill?.discount > 0 ? total - dataBill?.discount : 0
                        : total - (total * dataBill?.discount) / 100 > 0 ? total - (total * dataBill?.discount) / 100 : 0) <= 0
                      ? 0
                      : cash - 0 + (transfer - 0) -
                      (dataBill && dataBill?.discountType === "LAK"
                        ? total - dataBill?.discount > 0 ? total - dataBill?.discount : 0
                        : total - (total * dataBill?.discount) / 100 > 0 ? total - (total * dataBill?.discount) / 100 : 0)
                  )}{" "}
                  ກີບ

                  {console.log("cash===>>>", cash - 0 + (transfer - 0) -
                      (dataBill && dataBill?.discountType === "LAK"
                        ? total - dataBill?.discount > 0 ? total - dataBill?.discount : 0
                        : total - (total * dataBill?.discount) / 100 > 0 ? total - (total * dataBill?.discount) / 100 : 0) <= 0
                      ? 0
                      : cash - 0 + (transfer - 0) -
                      (dataBill && dataBill?.discountType === "LAK"
                        ? total - dataBill?.discount > 0 ? total - dataBill?.discount : 0
                        : total - (total * dataBill?.discount) / 100 > 0 ? total - (total * dataBill?.discount) / 100 : 0))}
                </div>
              </div>
            </div>
            {/* ---------tabs--------- */}
          </div>

          <div style={{ padding: 20 }}>
            <KeyboardComponents
              onClickEvent={(e) => {
                setCash((prev) => (prev ? prev + e : e));
              }}
              onDelete={() =>
                setCash((prev) =>
                  prev?.length > 0 ? prev.substring(0, prev.length - 1) : ""
                )
              }
            />
          </div>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <ButtonPrimary
          style={{ color: "white" }}
          onClick={handleSubmit}
          disabled={!canCheckOut}
        >
          ໄລເງິນ
        </ButtonPrimary>
      </Modal.Footer>
    </Modal>
  );
}

const KeyboardComponents = ({ onClickEvent, onDelete }) => {
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
              cursor: "pointer",
            }}
            key={i}
            onClick={(event) => onClickEvent("" + e)}
          >
            {e}
          </div>
        );
      })}
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
          cursor: "pointer",
        }}
        onClick={onDelete}
      >
        ລົບ
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
          cursor: "pointer",
        }}
        onClick={() => onClickEvent("0")}
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
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => onClickEvent("000")}
      >
        ,000
      </div>
    </div>
  );
};

