import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Form, Badge } from "react-bootstrap";
import PopUpQRToken from "../../components/popup/PopUpQRToken";
import Swal from "sweetalert2";

// icons
import { BsFillCaretLeftFill } from "react-icons/bs";
import { IoQrCode } from "react-icons/io5";
import { COLOR_APP } from "../../constants";
import { useStore } from "../../store";
import { tokenSelfOrderingPost } from "../../services/auth";
import StatusComponent from "../../components/StatusComponent";
import PopUpStaffUpdateOrder from "../../components/popup/PopUpStaffUpdateOrder";
import { updateOrderItem } from "../../services/order";
import { useNavigate } from "react-router-dom";
export default function StaffTableDetail() {
  const navigate = useNavigate();

  // useState
  const [selectOrders, setSelectOrders] = useState({});
  const [popup, setPopup] = useState({});
  const [qrToken, setQrToken] = useState("");
  const [disabledUpdateOrder, setDisabledUpdateOrder] = useState(false);

  // provider
  const { selectedTable, tableOrders, setReload } = useStore();
  // useEffect

  useEffect(() => {
    const select = tableOrders.filter((e) => selectOrders?.[e._id]);
    if (select.length == 0) {
      setDisabledUpdateOrder(true);
    } else {
      setDisabledUpdateOrder(false);
    }
  }, [selectOrders]);

  // function
  const updateOrderToServedByStaff = async () => {
    const selectOrderItems = tableOrders.filter((e) => selectOrders?.[e._id]);
    const storeId = selectedTable?.storeId;
    let menuId;
    let _updateItems = selectOrderItems.map((i) => {
      return {
        status: "SERVED",
        _id: i?._id,
        menuId: i?.menuId,
      };
    });
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId, menuId);
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      setReload(true);
      setPopup();
      setSelectOrders({});
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxHeight: "100%",
        }}
      >
        <NavContainer
          onBack={() => navigate("/tables")}
          codeData={selectedTable}
          setQrToken={setQrToken}
          setPopup={setPopup}
        />
        <div style={{ overflowY: "scroll", flex: 1 }}>
          <ListOrder
            tableOrders={tableOrders}
            selectOrders={selectOrders}
            setSelectOrders={setSelectOrders}
          />
        </div>
        <FooterComponent
          disabledUpdateOrder={disabledUpdateOrder}
          setPopup={setPopup}
          onAddOrder={() => navigate(`/add-order/${selectedTable?._id}`)}
        />
      </div>

      {/* popup */}
      <PopUpQRToken
        tableName={selectedTable?.tableName}
        open={popup?.qrToken}
        qr={qrToken}
        storeId={selectedTable?.storeId}
        onClose={() => setPopup()}
      />
      <PopUpStaffUpdateOrder
        open={popup?.updateOrder}
        onClose={() => setPopup()}
        tableName={selectedTable?.tableName}
        onSubmit={updateOrderToServedByStaff}
      />
    </>
  );
}

const NavContainer = ({ onBack, codeData, setQrToken, setPopup }) => {
  // function
  const getQrTokenForSelfOrdering = async () => {
    const data = await tokenSelfOrderingPost(codeData?.billId);
    if (data?.token) {
      setQrToken(data?.token);
      setPopup({ qrToken: true });
    }
  };
  return (
    <div
      style={{
        width: "100%",
        padding: 10,
        boxShadow: "0 4px 2px -2px rgba(0,0,0,0.2)",
        borderBottom: "1px",
        borderColor: "rgba(0,0,0,0.2)",
        display: "flex",
      }}
    >
      <Button
        variant="outlined"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#909090",
        }}
        onClick={onBack}
      >
        <BsFillCaretLeftFill style={{ fontSize: "22px" }} />
      </Button>
      <div style={{ fontWeight: "bold" }}>{codeData?.tableName}</div>
      <div style={{ flex: 1 }} />
      <Button
        variant="outlined"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#909090",
        }}
        onClick={getQrTokenForSelfOrdering}
      >
        <IoQrCode style={{ fontSize: "22px" }} />
      </Button>
    </div>
  );
};

const ListOrder = ({ tableOrders, selectOrders, setSelectOrders }) => {
  const checkDisabledOrder = (status) => {
    switch (status) {
      case "WAITING":
        return false;
      case "DOING":
        return false;
      case "SERVED":
        return true;
      case "CART":
        return true;
      case "FEEDBACK":
        return true;
      default:
        return true;
    }
  };
  return (
    <div style={{ padding: 10, paddingBottom: 50 }}>
      {tableOrders.map((e, i) => {
        const disabled = checkDisabledOrder(e?.status);
        return (
          <label
            for={`check:${e?._id}`}
            style={{
              // border: "1px solid #909090",
              padding: 10,
              borderRadius: 8,
              width: "100%",
              display: "flex",
              gap: 10,
              boxShadow: "2px 2px 8px -1px rgba(0,0,0,0.2)",
              backgroundColor: selectOrders?.[e?._id] ? COLOR_APP : "#fff",
            }}
          >
            <input
              name="group1"
              type="checkbox"
              disabled={disabled}
              checked={selectOrders?.[e?._id]}
              id={`check:${e?._id}`}
              onChange={(f) => {
                if (checkDisabledOrder(e?.status)) return; //disabled
                setSelectOrders((prev) => {
                  return { ...prev, [e?._id]: f.target.checked };
                });
              }}
            />
            <div>{e?.name}</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontWeight: "bold" }}>({e?.quantity})</div>
            <StatusComponent status={e?.status} />
          </label>
        );
      })}
    </div>
  );
};

const FooterComponent = ({ setPopup, disabledUpdateOrder, onAddOrder }) => {
  return (
    <div
      style={{
        padding: 10,
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gridGap: 10,
        gap: 10,
        paddingBottom: 30,
      }}
    >
      <Button
        style={{ width: "100%" }}
        onClick={() => setPopup({ updateOrder: true })}
        disabled={disabledUpdateOrder}
      >
        ອັບເດດ
      </Button>
      <Button style={{ width: "100%" }} onClick={onAddOrder}>
        ເພີ່ມອໍເດີ
      </Button>
    </div>
  );
};
