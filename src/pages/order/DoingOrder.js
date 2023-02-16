import React, { useState, useEffect, useMemo, useRef } from "react";
import Container from "react-bootstrap/Container";
import { Table, Button, Image } from "react-bootstrap";
import moment from "moment";
import OrderNavbar from "./component/OrderNavbar";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import * as _ from "lodash";
import empty from "../../image/empty.png";
import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import Swal from "sweetalert2";
import { usePubNub } from "pubnub-react";

/**
 * import components
 */
import UpdateModal from "./component/UpdateModal";
import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";
// import BillForCheckOut58 from "../../components/bill/BillForCheckOut58";
// import BillForCheckOut80 from "../../components/bill/BillForCheckOut80";
/**
 * import function
 */
// import { getOrders, updateOrderItem } from "../../services/order";
import { orderStatus } from "../../helpers";
import { SERVE_STATUS, END_POINT, DOING_STATUS } from "../../constants";
import { useStore } from "../../store";
import { socket } from "../../services/socket";

const Order = () => {
  // if (billForCher80.current.length !== arrLength) {
  //   // add or remove refs
  //   billForCher80.current = Array(arrLength)
  //     .fill()
  //     .map((_, i) => billForCher80.current[i]);
  // }
  // if (billForCher58.current.length !== arrLength) {
  //   // add or remove refs
  //   billForCher58.current = Array(arrLength)
  //     .fill()
  //     .map((_, i) => billForCher58?.current[i]);
  // }
  const { storeDetail } = useStore();
  const storeId = storeDetail._id;
  /**
   * routes
   */

  const {
    orderItems,
    getOrderItemsStore,
    handleCheckbox,
    checkAllOrders,
    handleUpdateOrderStatus,
  } = useStore();

  const [updateModal, setUpdateModal] = useState(false);
  const [dataBill, setDataBill] = useState();
  const [selectedMenu, setSelectedMenu] = useState([]);
  const {
    storeDetaile,
    printers,
    selectedTable,
    selectOrderStatus,
    setSelectOrderStatus,
    newOrderTransaction,
    newOrderUpdateStatusTransaction,
    setNewOrderTransaction,
    setNewOrderUpdateStatusTransaction,
  } = useStore();
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
    console.log("orderItems===>>>", orderItems)
    console.log("orderSelect===>>>", orderSelect)
    let _index = 0;
    for (const _ref of billForCher80.current) {
      const _printer = printers.find((e) => {
        return e?._id === orderSelect?.[_index]?.printer;
      });
      console.log("_printer", _printer);

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
        bodyFormData.append("port", "9100");
        bodyFormData.append("image", _file);
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        await axios({
          method: "post",
          url: urlForPrinter,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if(_index === 0) {
          await Swal.fire({
            icon: "success",
            title: "ປິ້ນສຳເລັດ",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (err) {
        console.log(err);
        if(_index ===0) {
          await Swal.fire({
            icon: "error",
            title: "ປິ້ນບໍ່ສຳເລັດ",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      _index++;
    }
  };

  const pubnub = usePubNub();
  const [channels] = useState([
    `ORDER_UPDATE_STATUS:${storeDetail._id}`,
    `ORDER:${storeDetail._id}`,
  ]);
  useEffect(() => {
    getOrderItemsStore(DOING_STATUS);
    setSelectOrderStatus(DOING_STATUS);
  }, []);
  const handleMessage = (event) => {
    // console.log("event", event);
    if (selectOrderStatus === DOING_STATUS) {
      getOrderItemsStore(DOING_STATUS);
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
          <div
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              display: "flex",
              paddingTop: 15,
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <div
              style={{
                alignItems: "end",
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }} >ເລືອກທັງໝົດ</div>} /> */}
            </div>
            {/* <div>
            <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(SERVE_STATUS, match?.params?.id)}>ເສີບແລ້ວ</Button>
          </div> */}
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
          <Container fluid className="mt-3">
            <Table
              responsive
              className="staff-table-list borderless table-hover"
            >
              <thead style={{ backgroundColor: "#F1F1F1" }}>
                <tr>
                  <th>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="checkedC"
                          onChange={(e) => checkAllOrders(e)}
                          style={{ marginLeft: 10 }}
                        />
                      }
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
                  orderItems?.map((order, index) => (
                    <tr key={index}>
                      <td>
                        <Checkbox
                          checked={order?.isChecked ? true : false}
                          onChange={(e) => handleCheckbox(order)}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </td>
                      <td>
                        <p style={{ margin: 0 }}>{index + 1}</p>
                      </td>
                      <td>
                        <p style={{ margin: 0 }}>{order?.name ?? "-"}</p>
                      </td>
                      <td>
                        <p style={{ margin: 0 }}>{order?.quantity ?? "-"}</p>
                      </td>
                      <td>
                        <p style={{ margin: 0 }}>
                          {order?.tableId?.name ?? "-"}
                        </p>
                      </td>
                      <td>
                        <p style={{ margin: 0 }}>{order?.code ?? "-"}</p>
                      </td>
                      <td>
                        <p style={{ margin: 0 }}>
                          {order?.status ? orderStatus(order?.status) : "-"}
                        </p>
                      </td>

                      <td>
                        <p style={{ margin: 0 }}>
                          {order?.createdAt
                            ? moment(order?.createdAt).format("HH:mm a")
                            : "-"}
                        </p>
                      </td>
                      <td>
                        <p style={{ margin: 0 }}>{order?.note ?? "-"}</p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
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
                      dataBill={dataBill}
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
                        dataBill={dataBill}
                        val={val}
                      />
                    </div>
                  );
                })}
            </div>
          </Container>
          <UpdateModal
            show={updateModal}
            hide={() => setUpdateModal(false)}
            // handleUpdate={_handleUpdate}
          />
        </div>
      ) : (
        <Image src={empty} alt="" width="100%" />
      )}
    </div>
  );
};

export default Order;
