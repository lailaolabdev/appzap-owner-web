import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsPrinter } from "react-icons/bs";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { getMenus } from "../../services/menu";
import { useStore } from "../../store";
import { URL_PHOTO_AW3 } from "../../constants";
import Swal from "sweetalert2";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { convertBillDebtStatus } from "../../helpers/convertBillDebtStatus";
import { useTranslation } from "react-i18next";
export default function PopUpDetaillBillDebt({
  open,
  onClose,
  callback,
  billDebtData,
}) {
  const { t } = useTranslation();
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [menusData, setMenusData] = useState();
  const [orderDebtData, setOrderDebtData] = useState([]);
  // store
  const { storeDetail } = useStore();

  // console.log("billDebtData", billDebtData?.billId?.orderId);

  // useEffect
  // useEffect(() => {
  //   // getMenuData();
  //   getOrderFarkDate();
  // }, [open]);
  // // functions
  // const getMenuData = async () => {
  //   try {
  //     setIsLoading(true);
  //     let findby = "?";
  //     findby += `storeId=${storeDetail?._id}`;
  //     const data = await getMenus(findby);
  //     setMenusData(data);
  //     setIsLoading(false);
  //   } catch (err) {
  //     setIsLoading(false);
  //   }
  // };
  // const getOrderFarkDate = async (menuId) => {
  //   try {
  //     setOrderDebtData();
  //     if (billDebtData) {
  //       const { TOKEN, DATA } = await getLocalData();
  //       const url =
  //         END_POINT_SEVER + "/v4/order-farks?billFarkId=" + billDebtData?._id;
  //       const data = await Axios.get(url, { headers: TOKEN });
  //       console.log("data", data);
  //       setOrderDebtData(data.data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleClickConfirmDebt = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      await Axios.put(
        END_POINT_SEVER + "/v4/bill-debt/update",
        {
          id: billDebtData?._id,
          data: {
            status: "PAY_DEBT",
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
          <Form.Check // prettier-ignore
            type="checkbox"
            label={`ຍືນຍັນລູກຄ້າມາຊຳລະ`}
            disabled={billDebtData?.status !== "DEBT"}
          />
        </div>
        <Button
          onClick={() => handleClickConfirmDebt()}
          disabled={billDebtData?.status !== "DEBT"}
        >
          ຍືນຍັນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
