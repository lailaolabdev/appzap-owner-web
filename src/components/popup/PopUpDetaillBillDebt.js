import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsPrinter } from "react-icons/bs";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { URL_PHOTO_AW3 } from "../../constants";
import Swal from "sweetalert2";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { convertBillDebtStatus } from "../../helpers/convertBillDebtStatus";
import { useTranslation } from "react-i18next";
import { moneyCurrency } from "../../helpers";

export default function PopUpDetailBillDebt({
  open,
  onClose,
  callback,
  billDebtData,
}) {
  const { t } = useTranslation();

  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [menusData, setMenusData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(""); //update
  const [amountIncrease, setAmountIncreease] = useState(""); // update
  const [selectInput, setSelectInput] = useState();
  const [remainingAmount, setRemainingAmount] = useState(
    billDebtData?.remainingAmount
  ); //update
  // const [amountBefore, setAmountBefore] = useState(billDebtData?.amountBefore || 0);

  useEffect(() => {
    //update
    if (open) {
      setTotalPayment("");
      setAmountIncreease("");
    }
  }, [open]);


  const handleClickConfirmDebt = async () => {
    try {
      const { TOKEN } = await getLocalData();

      const newStatus = remainingAmount <= 0 ? "PAY_DEBT" : "PARTIAL_PAYMENT";

      await Axios.put(
        END_POINT_SEVER + "/v4/bill-debt/update",
        {
          id: billDebtData?._id,
          data: {
            status: newStatus,
            payAmount: totalPayment,
            remainingAmount: remainingAmount,
            amountIncrease: amountIncrease,
          },
        },
        {
          headers: TOKEN,
        }
      );
      successAdd("ສຳເລັດ");
      callback();
    } catch (err) {
      errorAdd("ບໍ່ສຳເລັດ");
      console.log(err);
    }
  };

  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        ລາຍລະອຽດບິນ
      </Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <div>
          <div>ລະຫັດ: {billDebtData?.code}</div>
          <div>ຊື່: {billDebtData?.customerName}</div>
          <div>ເບີໂທ: {billDebtData?.customerPhone}</div>
          <div>
            ສະຖານາະ: {t ? convertBillDebtStatus(billDebtData?.status, t) : ""}
          </div>
          <div>
            ວັນທີສ້າງ: {moment(billDebtData?.createdAt).format("DD/MM/YYYY")}
          </div>
          <div>
            ວັນໝົດກຳນົດ: {moment(billDebtData?.endDate).format("DD/MM/YYYY")}
          </div>
          {/* update by ton.......................................................................................... */}
          <div style={{ marginTop: "0.5rem" }}>
            ຈຳນວນໜີ້ທັງໝົດ: {moneyCurrency(billDebtData?.amount)}
          </div>
          <div style={{ marginBottom: "2px" }}>
            ຍັງຄ້າງຊຳລະ: {moneyCurrency(billDebtData?.remainingAmount)}
          </div>
          <Form.Group>
            <Form.Label style={{ margin: "5px", color: "MidnightBlue" }}>
              (+) ເພີ່ມໜີ້ຄ້າງຊຳລະ
            </Form.Label>
            <Form.Control
              value={amountIncrease}
              onChange={(e) => setAmountIncreease(Number(e.target.value))}
              placeholder={t("ເພີ່ມຈຳນວນຕິດໜີ້")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ margin: "5px", color: "MidnightBlue" }}>
              (-) ປ້ອນຈຳນວນທີ່ຕ້ອງການຊຳລະ
            </Form.Label>
            <Form.Control
              style={{ marginBottom: "0.5rem" }}
              value={totalPayment}
              onChange={(e) => setTotalPayment(Number(e.target.value))}
              placeholder={t("ຈຳນວນທີ່ຕ້ອງການຊຳລະ")}
            ></Form.Control>
          </Form.Group>
          {/* update by ton.......................................................................................... */}
          <div>
            ວັນມາເອົາ:{" "}
            {billDebtData?.outStockDate
              ? moment(billDebtData?.outStockDate).format("DD/MM/YYYY")
              : ""}
          </div>
        </div>
        {billDebtData?.billId?.orderId?.length > 0 ? (
          <div>
            <table style={{ width: "100%" }}>
              <tr>
                <th>ຊື່</th>
                <th style={{ textAlign: "center" }}>ຈຳນວນ</th>
              </tr>
              {billDebtData?.billId?.orderId?.map((e) => (
                <tr>
                  <td style={{ textAlign: "start" }}>{e?.name}</td>
                  <td style={{ textAlign: "center" }}>{e?.quantity}</td>
                </tr>
              ))}
            </table>
          </div>
        ) : (
          ""
        )}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <Form.Check
            type="checkbox"
            label={"ຍືນຍັນລູກຄ້າມາຊຳລະ"}
            disabled={
              billDebtData?.status !== "DEBT" &&
              billDebtData?.status !== "PARTIAL_PAYMENT"
            }
          />
        </div>
        <Button
          onClick={() => handleClickConfirmDebt()}
          disabled={
            billDebtData?.status !== "DEBT" &&
            billDebtData?.status !== "PARTIAL_PAYMENT"
          }
        >
          ຍືນຍັນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
