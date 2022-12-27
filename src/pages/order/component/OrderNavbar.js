import React, { useEffect, useState, useMemo, useRef } from "react";

import { Nav } from "react-bootstrap";
import { getLocalData } from "../../../constants/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useStore } from "../../../store";
import { WAITING_STATUS } from "../../../constants";
import { updateOrderItem } from "../../../services/order";
import PopupCancle from "../../../components/popup/PopupCancle";
// import { socket } from "../../../services/socket";
import { PubNubProvider, usePubNub } from "pubnub-react";

import axios from "axios";
import ReactToPrint from "react-to-print";
// import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../../helpers";
// import BillForCheckOut58 from "../../../components/bill/BillForCheckOut58";
// import BillForCheckOut80 from "../../../components/bill/BillForCheckOut80";
// import BillForChef58 from "../../../components/bill/BillForChef58";
// import BillForChef80 from "../../../components/bill/BillForChef80";

export default function OrderNavbar() {
  // const [isCheckedOrderItem, setIsCheckedOrderItem] = useState([]);
  // let bill80Ref = useRef(null);
  // let bill58Ref = useRef(null);
  // const [dataBill, setDataBill] = useState();
  // const [selectedMenu, setSelectedMenu] = useState([]);
  // const { storeDetaile, printers, selectedTable } = useStore();
  // const arrLength = selectedMenu?.length;
  // const billForCher80 = useRef([]);
  // const billForCher58 = useRef([]);
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
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { orderItems, setOrderItems, getOrderItemsStore } = useStore();

  const [popup, setPopup] = useState({
    cancel: false,
  });
  const fetchData = async () => {
    const _localData = await getLocalData();
    if (_localData) {
      setgetTokken(_localData);
    }
  };

  const [getTokken, setgetTokken] = useState();
  useEffect(() => {
    fetchData();
  }, []);
  // useMemo(
  //   () =>
  //     socket.on(`ORDER:${storeDetail._id}`, (data) => {
  //       getOrderItemsStore(WAITING_STATUS);
  //     }),
  //   []
  // );
  const _order = () => {
    navigate(`/orders/pagenumber/1/${getTokken?.DATA?.storeId}`);
  };
  const _doing = () => {
    navigate(`/orders/doing/pagenumber/1/${getTokken?.DATA?.storeId}`);
  };
  const _served = () => {
    navigate(`/orders/served/pagenumber/1/${getTokken?.DATA?.storeId}`);
  };
  const handleUpdateOrderStatus = async (status) => {
    getOrderItemsStore(WAITING_STATUS);
    const storeId = getTokken?.DATA?.storeId;
    let previousStatus = orderItems[0].status;
    let menuId;
    let _updateItems = orderItems
      .filter((item) => item.isChecked)
      .map((i) => {
        return {
          status: status,
          _id: i?._id,
          menuId: i?.menuId,
        };
      });
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId, menuId);
    if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
      let _newOrderItem = orderItems.filter((item) => !item.isChecked);
      // setOrderItems(_newOrderItem)
      if (previousStatus == WAITING_STATUS) getOrderItemsStore(WAITING_STATUS);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleUpdateOrderStatusgo = async (status) => {
    getOrderItemsStore(WAITING_STATUS);
    const storeId = getTokken?.DATA?.storeId;
    let previousStatus = orderItems[0].status;
    let menuId;
    let _updateItems = orderItems
      .filter((item) => item.isChecked)
      .map((i) => {
        console.log(i?._id);
        return {
          status: status,
          _id: i?._id,
          menuId: i?.menuId,
        };
      });
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId, menuId);
    if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
      let _newOrderItem = orderItems.filter((item) => !item.isChecked);
      // setOrderItems(_newOrderItem)
      if (previousStatus == WAITING_STATUS) getOrderItemsStore(WAITING_STATUS);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleUpdateOrderStatuscancel = async (status) => {
    getOrderItemsStore(WAITING_STATUS);
    const storeId = getTokken?.DATA?.storeId;
    let previousStatus = orderItems[0].status;
    let menuId;
    let _updateItems = orderItems
      .filter((item) => item.isChecked)
      .map((i) => {
        return {
          status: status,
          _id: i?._id,
          menuId: i?.menuId,
        };
      });
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId, menuId);
    if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
      let _newOrderItem = orderItems.filter((item) => !item.isChecked);
      // setOrderItems(_newOrderItem)
      if (previousStatus == WAITING_STATUS) getOrderItemsStore(WAITING_STATUS);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // const onPrintForCher = async () => {
  //   const orderSelect = selectedMenu;
  //   let _index = 0;
  //   for (const _ref of billForCher80.current) {
  //     console.log("qweryykmyrotk");

  //     // console.log("orderSelect?.[_index]", orderSelect?.[_index]);
  //     const _printer = printers.find((e) => {
  //       // console.log(`${e?._id} == ${orderSelect?.[_index]?._id}`)
  //       return e?._id == orderSelect?.[_index]?.printer;
  //     });
  //     console.log("_printer", _printer);

  //     try {
  //       let dataUrl;
  //       if (_printer?.width == "80mm") {
  //         dataUrl = await html2canvas(billForCher80?.current[_index], {
  //           useCORS: true,
  //           scrollX: 10,
  //           scrollY: 0,
  //           // scale: 530 / widthBill80,
  //         });
  //       }
  //       if (_printer?.width == "58mm") {
  //         dataUrl = await html2canvas(billForCher58?.current[_index], {
  //           useCORS: true,
  //           scrollX: 10,
  //           scrollY: 0,
  //           // scale: 350 / widthBill58,
  //         });
  //       }

  //       // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

  //       const _file = await base64ToBlob(dataUrl.toDataURL());
  //       var bodyFormData = new FormData();
  //       bodyFormData.append("ip", _printer?.ip);
  //       bodyFormData.append("port", "9100");
  //       bodyFormData.append("image", _file);
  //       await axios({
  //         method: "post",
  //         url: "http://localhost:9150/ethernet/image",
  //         data: bodyFormData,
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //       // axios.post("http://localhost:9150/ethernet/text", {
  //       //   config: {
  //       //     ip: "192.168.100.236",
  //       //     port: 9100,
  //       //   },
  //       //   text: "llsdflkldsfkdkfogowekfokdofsalwiwslkofs",
  //       // });
  //       await Swal.fire({
  //         icon: "success",
  //         title: "ປິນສຳເລັດ",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     } catch (err) {
  //       console.log(err);
  //       await Swal.fire({
  //         icon: "error",
  //         title: "ປິນບໍ່ສຳເລັດ",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     }
  //     _index++;
  //   }
  // };

  const pubnub = usePubNub();
  const [channels] = useState([`ORDER:${storeDetail._id}`]);
  const handleMessage = (event) => {
    console.log("event", event);
    // reLoadData();
    getOrderItemsStore(WAITING_STATUS);
  };
  useEffect(() => {
    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe({ channels });
  }, [pubnub, channels]);
  return (
    <div>
      <div style={{ backgroundColor: "#f8f8f8", border: "none" }}>
        <Nav
          variant="tabs"
          defaultActiveKey={location?.pathname}
          style={{
            fontWeight: "bold",
            backgroundColor: "#f8f8f8",
            border: "none",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex" }}>
            <Nav.Item>
              <Nav.Link
                eventKey={`/orders/pagenumber/1/` + params?.id}
                style={{ color: "#FB6E3B", border: "none" }}
                onClick={() => _order()}
              >
                ອໍເດີ້ເຂົ້າ
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={`/orders/doing/pagenumber/1/` + params?.id}
                style={{ color: "#FB6E3B", border: "none" }}
                onClick={() => _doing()}
              >
                ກຳລັງເຮັດ
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={`/orders/served/pagenumber/1/` + params?.id}
                style={{ color: "#FB6E3B", border: "none" }}
                onClick={() => _served()}
              >
                ເສີບແລ້ວ
              </Nav.Link>
            </Nav.Item>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between ",
              padding: "10px",
            }}
          >
            <div>
              <button
                style={{
                  backgroundColor: "#fff",
                  color: "#FB6E3B",
                  border: "1px solid #FB6E3B",
                }}
                onClick={() => handleUpdateOrderStatuscancel("CANCEL")}
              >
                ຍົກເລີກ
              </button>
            </div>
            <div style={{ width: "10px" }}></div>

            <div>
              <button
                style={{
                  backgroundColor: "#fff",
                  color: "#FB6E3B",
                  border: "1px solid #FB6E3B",
                }}
                onClick={() => handleUpdateOrderStatusgo("DOING")}
              >
                ສົ່ງໄປຄົວ
              </button>
            </div>
            <div style={{ width: "10px" }}></div>

            <div>
              <button
                style={{
                  backgroundColor: "#fff",
                  color: "#FB6E3B",
                  border: "1px solid #FB6E3B",
                }}
                onClick={() => handleUpdateOrderStatus("SERVED")}
              >
                ເສີບແລ້ວ
              </button>
            </div>
          </div>
        </Nav>
      </div>
      <PopupCancle
        open={popup?.cancel}
        onClose={() => setPopup()}
        onSubmit={() => setPopup()}
      />
      {/* <div>
        <button style={{ backgroundColor: "#FB6E3B", color: "#fff", border: "1px solid #FB6E3B", height: "40px", margin: "10px" }} onClick={() => onPrintForCher()} >ພິມບິນໄປຄົວ</button>
      </div> */}
      {/* <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
        <BillForCheckOut80
          storeDetail={storeDetail}
          selectedTable={selectedTable}
          dataBill={dataBill}
        />
      </div>
      <div style={{ width: "58mm", padding: 10 }} ref={bill58Ref}>
        <BillForCheckOut58
          storeDetail={storeDetail}
          selectedTable={selectedTable}
          dataBill={dataBill}
        />
      </div> */}
      {/* {orderItems
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
      </div> */}
    </div>
  );
}
