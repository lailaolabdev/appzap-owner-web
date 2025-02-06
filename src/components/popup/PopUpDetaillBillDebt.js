import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form,Spinner } from "react-bootstrap";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import convertNumber from "../../helpers/convertNumber";
import convertNumberReverse from "../../helpers/convertNumberReverse";
import { useTranslation } from "react-i18next";
import { moneyCurrency } from "../../helpers";
import axios from "axios";
import _ from "lodash";
import styled from "styled-components";
import { useStore } from "../../store";
import { useStoreStore } from "../../zustand/storeStore";
import { COLOR_APP, END_POINT } from "../../constants";
import { getHeaders } from "../../services/auth";
import useQuery from "../../helpers/useQuery";


export default function PopUpDetailBillDebt({
  open,
  onClose,
  callback,
  billDebtData,
}) {
  const { t } = useTranslation();
  const [numericValue, setNumericValue] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [forcus, setForcus] = useState("CASH");
  const [transfer, setTransfer] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [tab, setTab] = useState("cash_transfer");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const { profile } = useStore();
  const { storeDetail } = useStoreStore()
  const { accessToken } = useQuery();
  const [disabledEditBill, setDisabledEditBill] = useState(false);
  const [errorAdd, setErrorAdd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentExceeded, setIsPaymentExceeded] = useState(false);



  useEffect(() => {
    if (open) {
      setTotalPayment(0);
      setNumericValue(0);
      setErrorAdd("");
      setIsPaymentExceeded(false);
    }
  }, [open]);

  const calculateAmounts = () => {
    const totalAmount = totalPayment + transfer;
    const newRemainingAmount = billDebtData?.remainingAmount - totalAmount || 0;
    setRemainingAmount(newRemainingAmount);

    // Check if payment exceeds bill amount
    setIsPaymentExceeded(totalAmount > billDebtData?.remainingAmount);
  };

  useEffect(() => {
    calculateAmounts();
  }, [transfer, totalPayment, paymentMethod, remainingAmount, disabledEditBill]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "TRANSFER") {
      setTotalPayment(0);
    } else if (method === "TRANSFER_CASH") {
      setTotalPayment(0);
      setTransfer(0);
    } else if (method === "CASH") {
      setTransfer(0);
    }
  };

  //handle submit
  const handleSubmit = async () => {
    if (totalPayment === 0 && transfer === 0) {
      setErrorAdd(t("please_enter_the_amount_you_wish_to_pay"));
      return;
    }

    setIsLoading(true);

    try {
      await billReset();
      handleClickConfirmDebt();
      _checkBill();
      successAdd(t("paymentCompleted"));
    } catch (error) {
      errorAdd(t("checkbill_fial"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const billReset = async () => {
    try {
      const url = END_POINT_SEVER + "/v3/bill-reset";
      const _body = {
        id: billDebtData?.billId?._id,
        storeId: storeDetail?._id,
      };
      const res = await axios.post(url, _body, {
        headers: await getHeaders(accessToken),
      });
    } catch (err) {
      console.log(err);
    }
  }

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
            payAmount: totalPayment + transfer, // Use numeric value for API
            remainingAmount: remainingAmount,
          },
        },
        {
          headers: TOKEN,
        }
      );
      callback();
    } catch (err) {
      console.log(err);
    }
  };


  const _checkBill = async () => {
    const staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));
    const currentDateTime = new Date().toISOString();

    try {
      await axios.put(
        `${END_POINT}/v6/bill-checkout`,
        {
          id: billDebtData?.billId?._id,
          data: {
            isCheckout: "true",
            status: "CHECKOUT",
            isDebtPayment: true,
            payAmount: totalPayment,
            transferAmount: transfer,
            remainingAmount: remainingAmount,
            paymentMethod: paymentMethod,
            customerId: billDebtData?._id,
            userNanme: billDebtData?.customerName,
            phone: billDebtData?.customerPhone,
            tableCode: billDebtData?.code,
            fullnameStaffCheckOut:
              `${profile?.data?.firstname} ${profile?.data?.lastname}` ?? "-",
            staffCheckOutId: staffConfirm?.id,
            debtPaymentDateTime: [{
              payAmount: totalPayment,
              transferAmount: transfer,
              billAmount:totalPayment + transfer,
              billAmountBefore:totalPayment + transfer,
              dateTime: currentDateTime
            }]
          },
        },
        {
          headers: await getHeaders(),
        }
      );
      setTransfer();
      localStorage.removeItem("STAFFCONFIRM_DATA");
      onClose();
      return true;
    } catch (error) {
      errorAdd(`${t("checkbill_fial")}`);
      return false;
    }
  };

  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        {t("billDetail")}
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
          <div style={{ color: `${billDebtData?.status === 'DEBT' ? "red" : billDebtData?.status === "PAY_DEBT" ? "green" : "orange"}`, fnWeight: "bold" }}>
            <span style={{ color: 'black' }}>{t("status")}:</span>{billDebtData?.status === "DEBT" ? t("debt") : billDebtData?.status === "PAY_DEBT" ? t("debt_pay") : t("partial_payment")}
          </div>
          <div>
            {moment(billDebtData?.createdAt).format("DD/MM/YYYY")}
          </div>
          <div>
            {t("expiration_date")}: {moment(billDebtData?.endDate).format("DD/MM/YYYY")}
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            {t("total_debt")}: {moneyCurrency(billDebtData?.amount)}
          </div>
          <div style={{ marginBottom: "2px" }}>
            {t("paid_already")}: {moneyCurrency(billDebtData?.amount - billDebtData?.remainingAmount)}
          </div>
          <div style={{ marginBottom: "2px" }}>
            {t("outstanding_money")}: {moneyCurrency(billDebtData?.remainingAmount)}
          </div>

          {disabledEditBill ? (
            <div>
              <Form.Group hidden={paymentMethod !== "CASH" && paymentMethod !== "TRANSFER_CASH"}>
                <Form.Label style={{ margin: "5px", color: "MidnightBlue" }}>
                  (-) {t("cash")}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={convertNumber(totalPayment)}
                  onChange={(e) => {
                    convertNumberReverse(e.target.value, (value) => {
                      setTotalPayment(Number(value) || 0);
                    });
                  }}
                  placeholder="0"
                />
                 <div style={{ color: "red" }}>{errorAdd}</div>
              </Form.Group>

              <Form.Group hidden={paymentMethod !== "TRANSFER" && paymentMethod !== "TRANSFER_CASH"}>
                <Form.Label style={{ margin: "5px", color: "MidnightBlue" }}>
                  (-) {t("transfer")}
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ marginBottom: "0.5rem" }}
                  value={convertNumber(transfer)}
                  onChange={(e) => {
                    convertNumberReverse(e.target.value, (value) => {
                      setTransfer(Number(value) || 0);
                    });
                  }}
                  placeholder="0"
                />
              </Form.Group>

              <Form hidden={tab !== "cash_transfer"}>
                {['radio'].map((type) => (
                  <div key={`inline-${type}`} className="mb-3">
                    <CustomCheck
                      inline
                      defaultChecked
                      label={t("cash")}
                      name="paymentMethod"
                      type={type}
                      id={`inline-${type}-1`}
                      onChange={() => handlePaymentMethodChange("CASH")}
                    />
                    <CustomCheck
                      inline
                      label={t("transfer")}
                      name="paymentMethod"
                      type={type}
                      id={`inline-${type}-3`}
                      onChange={() => handlePaymentMethodChange("TRANSFER")}
                    />
                    <CustomCheck
                      inline
                      label={t("transfercash")}
                      name="paymentMethod"
                      type={type}
                      id={`inline-${type}-2`}
                      onChange={() => handlePaymentMethodChange("TRANSFER_CASH")}
                    />
                  </div>
                ))}
              </Form>
            </div>
          ) : ""}
          <div>
            {t("date_pay")}:{" "}
            {billDebtData?.outStockDate
              ? moment(billDebtData?.outStockDate).format("DD/MM/YYYY")
              : ""}
          </div>
        </div>
        <hr />

        {billDebtData?.billId?.orderId?.length > 0 ? (
          <div>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>{t("name")}</th>
                  <th style={{ textAlign: "center" }}>{t("count")}</th>
                </tr>
              </thead>
              <tbody>
                {billDebtData?.billId?.orderId?.map((e) => (
                  <tr key={e?.id}>
                    <td style={{ textAlign: "start" }}>{e?.name}</td>
                    <td style={{ textAlign: "center" }}>{e?.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
      {!disabledEditBill ? (
        <Button onClick={() => setDisabledEditBill(true)}>
          {t("Do_you_want_to_make_a_payment")}?
        </Button>
      ) : (
        <>
          <Button
            onClick={handleSubmit}
            disabled={
              (billDebtData?.status !== "DEBT" &&
                billDebtData?.status !== "PARTIAL_PAYMENT") ||
              isLoading || isPaymentExceeded
            }
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "8px" }}
                />
                {t("processing")}
              </>
            ) : (
              `${t("confirm")}`
            )}
          </Button>
          <Button variant="secondary" onClick={() => setDisabledEditBill(false)}>
            {t("cancel")}
          </Button>
        </>
      )}
    </Modal.Footer>
    </Modal>
  );
}
const CustomCheck = styled(Form.Check)`
  .form-check-input:checked {
    background-color: red;
    border-color: red;
  }
`;