import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsPrinter } from "react-icons/bs";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { getMenus } from "../../services/menu";
import { URL_PHOTO_AW3 } from "../../constants";
import Swal from "sweetalert2";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { convertBillFarkStatus } from "../../helpers/convertBillFarkStatus";
import { useTranslation } from "react-i18next";

import { useStoreStore } from "../../zustand/storeStore";

export default function PopUpDetaillBillFark({
  open,
  onClose,
  callback,
  billFarkData,
}) {
  const { t } = useTranslation();
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [menusData, setMenusData] = useState();
  const [Data, setData] = useState([]);
  // store
  const { storeDetail } = useStoreStore()

  // useEffect
  useEffect(() => {
    // getMenuData();
    getDate();
  }, [open]);
  // functions
  const getMenuData = async () => {
    try {
      setIsLoading(true);
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      const data = await getMenus(findby);
      setMenusData(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };
  const getDate = async (menuId) => {
    try {
      setData();
      if (billFarkData) {
        const { TOKEN, DATA } = await getLocalData();
        const url =
          END_POINT_SEVER + "/v4/order-farks?billFarkId=" + billFarkData?._id;
        const data = await Axios.get(url, { headers: TOKEN });
        console.log("data", data);
        setData(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickConfirmFark = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      await Axios.put(
        END_POINT_SEVER + "/v4/bill-fark/update",
        {
          id: billFarkData?._id,
          data: {
            stockStatus: "OUT_STOCK",
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
          <div>ລະຫັດ: {billFarkData?.code}</div>
          <div>ຊື່: {billFarkData?.customerName}</div>
          <div>ເບີໂທ: {billFarkData?.customerPhone}</div>
          <div>
            ສະຖານາະ:{" "}
            {t ? convertBillFarkStatus(billFarkData?.stockStatus, t) : ""}
          </div>
          <div>
            ວັນທີສ້າງ: {moment(billFarkData?.createdAt).format("DD/MM/YYYY")}
          </div>
          <div>
            ວັນໝົດກຳນົດ: {moment(billFarkData?.endDate).format("DD/MM/YYYY")}
          </div>
          <div>
            ວັນມາເອົາ:{" "}
            {billFarkData?.outStockDate
              ? moment(billFarkData?.outStockDate).format("DD/MM/YYYY")
              : ""}
          </div>
        </div>
        <div>
          <table style={{ width: "100%" }}>
            <tr>
              <th>ຊື່</th>
              <th style={{ textAlign: "center" }}>ຈຳນວນ</th>
            </tr>
            {Data?.map((e) => (
              <tr>
                <td style={{ textAlign: "start" }}>{e?.nameMenu}</td>
                <td style={{ textAlign: "center" }}>{e?.amount}</td>
              </tr>
            ))}
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <Form.Check // prettier-ignore
            type="checkbox"
            label={`ຍືນຍັນລູກຄ້າມາຮັບແລ້ວ`}
          />
        </div>
        <Button
          onClick={() => handleClickConfirmFark()}
          disabled={billFarkData?.stockStatus != "INSTOCK"}
        >
          ຍືນຍັນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
