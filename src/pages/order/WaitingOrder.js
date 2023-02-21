import React, { useState, useEffect, useRef, useMemo } from "react";
import { Image } from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import moment from "moment";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import Swal from "sweetalert2";
import axios from "axios";
import { usePubNub } from "pubnub-react";
import styled from "styled-components";

/**
 * import components
 */
import OrderNavbar from "./component/OrderNavbar";
import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";

import { orderStatus } from "../../helpers";
import { WAITING_STATUS } from "../../constants";
import { useStore } from "../../store";
import empty from "../../image/empty.png";
import ReactAudioPlayer from "react-audio-player";
import Notification from "../../vioceNotification/ding.mp3";
// import { socket } from "../../services/socket";

export default function WaitingOrder() {
  const {
    soundPlayer,
    orderItems,
    getOrderItemsStore,
    handleCheckbox,
    checkAllOrders,
    setNewOrderTransaction,
    setNewOrderUpdateStatusTransaction,
    newOrderTransaction,
    newOrderUpdateStatusTransaction,
  } = useStore();
  /**
   * Initial Component
   */
  const { storeDetail, selectOrderStatus, setSelectOrderStatus } = useStore();
  // const [dataBill, setDataBill] = useState();
  const [selectedMenu, setSelectedMenu] = useState([]);
  const { printers, selectedTable } = useStore();
  const arrLength = selectedMenu?.length;
  const billForCher80 = useRef([]);
  const billForCher58 = useRef([]);
  if (billForCher80.current.length !== arrLength) {
    // add or remove refs
    billForCher80.current = Array(arrLength)
      .fill()
      .map((_, i) => billForCher80.current[i]);
  }
  if (billForCher58.current.length !== arrLength) {
    // add or remove refs
    billForCher58.current = Array(arrLength)
      .fill()
      .map((_, i) => billForCher58?.current[i]);
  }
  const onPrintForCher = async () => {
    const orderSelect = orderItems?.filter((e) => e?.isChecked);
    let _index = 0;
    for (const _ref of billForCher80.current) {
      const _printer = printers.find((e) => {
        return e?._id === orderSelect?.[_index]?.printer;
      });

      try {
        let urlForPrinter = "";
        let dataUrl;
        if (_printer?.width === "80mm") {
          dataUrl = await html2canvas(billForCher80?.current[_index], {
            useCORS: true,
            scrollX: 10,
            scrollY: 0,
          });
        }
        if (_printer?.width === "58mm") {
          dataUrl = await html2canvas(billForCher58?.current[_index], {
            useCORS: true,
            scrollX: 10,
            scrollY: 0,
          });
        }

        if (_printer?.type === "ETHERNET") {
          urlForPrinter = "http://localhost:9150/ethernet/image";
        }
        if (_printer?.type === "BLUETOOTH") {
          urlForPrinter = "http://localhost:9150/bluetooth/image";
        }
        if (_printer?.type === "USB") {
          urlForPrinter = "http://localhost:9150/usb/image";
        }

        const _file = await base64ToBlob(dataUrl.toDataURL());
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        bodyFormData.append("port", "9100");
        bodyFormData.append("image", _file);
        await axios({
          method: "post",
          url: urlForPrinter,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        await Swal.fire({
          icon: "success",
          title: "ປິ້ນສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (err) {
        console.log(err);
        await Swal.fire({
          icon: "error",
          title: "ປິ້ນບໍ່ສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      _index++;
    }
  };

  useEffect(() => {
    getOrderItemsStore(WAITING_STATUS);
  }, []);
  const pubnub = usePubNub();
  const [channels] = useState([
    `ORDER_UPDATE_STATUS:${storeDetail._id}`,
    `ORDER:${storeDetail._id}`,
  ]);
  const handleMessage = (event) => {
    if (selectOrderStatus === WAITING_STATUS) {
      getOrderItemsStore(WAITING_STATUS);
    }
  };
  useMemo(() => {
    const run = () => {
      pubnub.addListener({ message: handleMessage });
      pubnub.subscribe({ channels });
    };
    return run();
  }, [pubnub, selectOrderStatus]);

  useEffect(() => {
    getOrderItemsStore(WAITING_STATUS);
    setSelectOrderStatus(WAITING_STATUS);
  }, []);

  useEffect(() => {
    if (newOrderTransaction || newOrderUpdateStatusTransaction) {
      handleMessage();
      setNewOrderTransaction(false);
      setNewOrderUpdateStatusTransaction(false);
    }
  }, [newOrderTransaction, newOrderUpdateStatusTransaction]);
  return (
    <div>
      <OrderNavbar />
      {orderItems?.length > 0 ? (
        <div>
          <div>
            <ReactAudioPlayer src={Notification} ref={soundPlayer} />
          </div>
          <div>
            <button
              style={{
                backgroundColor: "#FB6E3B",
                color: "#fff",
                border: "1px solid #FB6E3B",
                height: "40px",
                margin: "10px",
              }}
              onClick={() => onPrintForCher()}
            >
              ພິມບິນໄປຄົວ
            </button>
          </div>
          <TableCustom responsive>
            <thead style={{ backgroundColor: "#F1F1F1" }}>
              <tr>
                <th>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkedC"
                        onChange={(e) => checkAllOrders(e)}
                      />
                    }
                    style={{ marginLeft: 2 }}
                  />
                </th>
                <th>ລ/ດ</th>
                <th>ຊື່ເມນູ</th>
                <th>ຈຳນວນ</th>
                <th>ຈາກໂຕະ</th>
                <th>ລະຫັດໂຕະ</th>
                <th>ສະຖານະ</th>
                <th>ເວລາ</th>
                <th>ຄອມເມັ້ນ</th>
              </tr>
            </thead>
            <tbody>
              {orderItems &&
                orderItems?.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <Checkbox
                          checked={order?.isChecked ? true : false}
                          onChange={(e) => handleCheckbox(order)}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </td>
                      <td>{index + 1} </td>
                      <td>{order?.name ?? "-"} </td>
                      <td>{order?.quantity ?? "-"} </td>
                      <td>{order?.tableId?.name ?? "-"}</td>
                      <td>{order?.code ?? "-"} </td>
                      <td style={{ color: "red", fontWeight: "bold" }}>
                        {order?.status ? orderStatus(order?.status) : "-"}
                      </td>
                      <td>
                        {order?.createdAt
                          ? moment(order?.createdAt).format("HH:mm ")
                          : "-"}{" "}
                        ໂມງ
                      </td>
                      <td>{order?.note ?? "-"} </td>
                    </tr>
                  );
                })}
            </tbody>
          </TableCustom>
          {orderItems
            ?.filter((e) => e?.isChecked)
            .map((val, i) => {
              return (
                <div
                  style={{ width: "80mm", padding: 10 }}
                  ref={(el) => (billForCher80.current[i] = el)}
                >
                  <BillForChef80
                    storeDetail={storeDetail}
                    selectedTable={selectedTable}
                    // dataBill={dataBill}
                    val={val}
                  />
                </div>
              );
            })}
          <div>
            {orderItems
              ?.filter((e) => e?.isChecked)
              .map((val, i) => {
                return (
                  <div
                    style={{ width: "80mm", padding: 10 }}
                    ref={(el) => (billForCher58.current[i] = el)}
                  >
                    <BillForChef58
                      storeDetail={storeDetail}
                      selectedTable={selectedTable}
                      // dataBill={dataBill}
                      val={val}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <Image src={empty} alt="" width="100%" />
      )}
    </div>
  );
}

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 12,
  ["th,td"]: {
    padding: 0,
  },
  ["th:first-child"]: {
    maxWidth: 40,
    width: 40,
  },
  ["td:first-child"]: {
    maxWidth: 40,
    width: 40,
  },
  thead: {
    backgroundColor: "#e9e9e9",
  },
});
