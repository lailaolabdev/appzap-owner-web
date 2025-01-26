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
  const [totalPayment, setTotalPayment] = useState();
  const [amountIncrease, setAmountIncrease] = useState();
  const [selectInput, setSelectInput] = useState();
  const [remainingAmount, setRemainingAmount] = useState(
    billDebtData?.remainingAmount
  ); //update
  // const [amountBefore, setAmountBefore] = useState(billDebtData?.amountBefore || 0);

  useEffect(() => {
    if (open) {
      setTotalPayment();
      setAmountIncrease();
    }
  }, [open]);
  const handleAmountIncreaseChange = (e) => {
    const value = e.target.valueAsNumber;
    setAmountIncrease(value || 0);
  };

  // ตัวจัดการสำหรับช่องชำระเงินทั้งหมดs
  const handleTotalPaymentChange = (e) => {
    const value = e.target.valueAsNumber;
    setTotalPayment(value || 0);
  };
  


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
          <div>{t("table_code")}: {billDebtData?.code}</div>
          <div>{t("name")}: {billDebtData?.customerName}</div>
          <div>{t("tel")}: {billDebtData?.customerPhone}</div>
          <div>
            {t("status")}: {t ? convertBillDebtStatus(billDebtData?.status, t) : ""}
          </div>
          <div>
            {t("create_date")}: {moment(billDebtData?.createdAt).format("DD/MM/YYYY")}
          </div>
          <div>
            {t("expiration_date")}: {moment(billDebtData?.endDate).format("DD/MM/YYYY")}
          </div>
          {/* update by ton.......................................................................................... */}
          <div style={{ marginTop: "0.5rem" }}>
            {t("total_debt")}: {moneyCurrency(billDebtData?.amount)}
          </div>
          <div style={{ marginBottom: "2px" }}>
            {t("paid_already")}: {moneyCurrency(billDebtData?.amount -billDebtData?.remainingAmount )}
          </div>
          <div style={{ marginBottom: "2px" }}>
            {t("outstanding_money")}: {moneyCurrency(billDebtData?.remainingAmount)}
          </div>
          <Form.Group>
            <Form.Label style={{ margin: "5px", color: "MidnightBlue" }}>
              (+) {t("increase_utstanding_debt")}
            </Form.Label>
            <Form.Control
              type="number"
              value={amountIncrease}
              onChange={handleAmountIncreaseChange}
              placeholder={0}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ margin: "5px", color: "MidnightBlue" }}>
              (-) {t("money_has_pay")}
            </Form.Label>
            <Form.Control
              type="number"
              style={{ marginBottom: "0.5rem" }}
              value={totalPayment}
              onChange={handleTotalPaymentChange}
              placeholder={0}
            ></Form.Control>
          </Form.Group>
          {/* update by ton.......................................................................................... */}
          <div>
            {t("date_pay")}:{" "}
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
