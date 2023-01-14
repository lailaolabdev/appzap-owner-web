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

export default function OrderNavbar() {
  const { storeDetail } = useStore();
  const storeId = storeDetail._id;
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const {
    orderItems,
    setOrderItems,
    getOrderItemsStore,
    selectOrderStatus,
    setSelectOrderStatus,
  } = useStore();

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
  const _order = () => {
    navigate(`/orders/waiting`);
  };
  const _doing = () => {
    navigate(`/orders/doing`);
  };
  const _served = () => {
    navigate(`/orders/served`);
  };
  const handleUpdateOrderStatus = async (status) => {
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
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      let _newOrderItem = orderItems.filter((item) => !item.isChecked);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
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
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                color: "#FFF",
                backgroundColor: "orange",
                border: "none",
                padding: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => _order()}
            >
              ອໍເດີ້ເຂົ້າ
            </div>

            <div
              style={{
                color: "#FFF",
                backgroundColor: "orange",
                border: "none",
                padding: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => _doing()}
            >
              ກຳລັງເຮັດ
            </div>

            <div
              style={{
                color: "#FFF",
                backgroundColor: "orange",
                border: "none",
                padding: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => _served()}
            >
              ເສີບແລ້ວ
            </div>
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
                onClick={() => handleUpdateOrderStatus("CANCEL")}
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
                onClick={() => handleUpdateOrderStatus("DOING")}
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
    </div>
  );
}
