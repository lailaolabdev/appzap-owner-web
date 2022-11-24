import React, { useEffect, useState } from "react";

import { Nav } from "react-bootstrap";
import { getLocalData } from "../../../constants/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function OrderNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [getTokken, setgetTokken] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
      }
    };
    fetchData();
  }, []);
  const _order = () => {
    navigate(`/orders/pagenumber/1/${getTokken?.DATA?.storeId}`);
  };
  const _doing = () => {
    navigate(`/orders/doing/pagenumber/1/${getTokken?.DATA?.storeId}`);
  };
  const _served = () => {
    navigate(`/orders/served/pagenumber/1/${getTokken?.DATA?.storeId}`);
  };
  return (
    <div style={{ backgroundColor: "#f8f8f8", border: "none" }}>
      <Nav
        variant="tabs"
        defaultActiveKey={location?.pathname}
        style={{
          fontWeight: "bold",
          backgroundColor: "#f8f8f8",
          border: "none",
        }}
      >
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
        <div style={{ display: "flex", justifyContent: "space-between ", padding: "10px", }}>
        <div>
          <button style={{ backgroundColor: "#fff", color: "#FB6E3B", border: "1px solid #FB6E3B" }}>ຍົກເລີກ</button>
        </div>
        <div style={{ width: "10px" }}></div>

        <div>
          <button style={{ backgroundColor: "#fff", color: "#FB6E3B", border: "1px solid #FB6E3B" }}>ສົ່ງໄປຄົວ</button>
        </div>
        <div style={{ width: "10px" }}></div>

        <div>
          <button style={{ backgroundColor: "#fff", color: "#FB6E3B", border: "1px solid #FB6E3B" }}>ເສີບແລ້ວ</button>
        </div>
        </div>
      </Nav>
    </div>
  );
}
// let _resOrderUpdate = await updateOrderItem(_updateItems, storeId);
// if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
//     let _newOrderItem = orderItems.filter((item) => !item.isChecked);
//     setOrderItems(_newOrderItem)
//     if (previousStatus == WAITING_STATUS) getOrderItemsStore(WAITING_STATUS)
//     Swal.fire({
//         icon: 'success',
//         title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
//         showConfirmButton: false,
//         timer: 2000
//     })
// }
