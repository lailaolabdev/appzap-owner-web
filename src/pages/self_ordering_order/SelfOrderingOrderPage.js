import React, { useEffect, useState } from "react";
import { ListGroup, Breadcrumb, Card, Button } from "react-bootstrap";
import Masonry from "react-masonry-css";
import { COLOR_APP } from "../../constants";
import {
  selfOrderingBillDelete,
  selfOrderingBillsStoreGet,
} from "../../services/selfOrderingBill";
import moment from "moment";
import PopUpSelfOrderingConfirm from "../../components/popup/PopUpSelfOrderingConfirm";
import { useStore } from "../../store";
const breakpointColumnsObj = {
  default: 4,
  1100: 2,
  700: 1,
};

export default function SelfOrderingOrderPage() {
  // state
  const [selfOrderingOrders, setSelfOrderingOrders] = useState([]);
  const [selectSelfOrderingOrder, setSelectSelfOrderingOrder] = useState();
  const [popup, setPopup] = useState();

  // provider
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    fetchSelfOrderingOrder();
  }, []);

  // function
  const fetchSelfOrderingOrder = async () => {
    const data = await selfOrderingBillsStoreGet(storeDetail?._id);
    if (!data?.error) {
      setSelfOrderingOrders(data);
    }
  };
  const deleteSelfOrderingOrder = async () => {
    const data = await selfOrderingBillDelete(selectSelfOrderingOrder?._id);
    if (data?.error) return;
    setPopup();
    setSelectSelfOrderingOrder();
    fetchSelfOrderingOrder();
  };
  return (
    <>
      <div style={{ padding: 20 }}>
        <Breadcrumb>
          <Breadcrumb.Item>ຈັດການອໍເດີ</Breadcrumb.Item>
          <Breadcrumb.Item active>ຈັດເດີລູກຄ້າສັ່ງເອງ</Breadcrumb.Item>
        </Breadcrumb>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          style={{
            display: "flex",
            width: "auto",
            gap: "10px",
          }}
        >
          {selfOrderingOrders?.map((e) => (
            <Card bg="primary" border="primary" style={{ marginBottom: 10 }}>
              <Card.Header
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div>ໂຕະ: {e?.tableName}</div>
                  <div style={{ fontSize: 12 }}>
                    {moment(e?.createdAt).format("YYYY/MM/DD LT")}
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setSelectSelfOrderingOrder(e);
                      setPopup({ PopUpSelfOrderingConfirm: true });
                    }}
                  >
                    ຍືນຍັນ
                  </Button>
                </div>
              </Card.Header>
              <ListGroup variant="flush">
                {e?.orders?.map((order) => (
                  <ListGroup.Item action>
                    {order?.menuName} x{order?.quantity}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          ))}
        </Masonry>
      </div>
      {/* popup */}
      <PopUpSelfOrderingConfirm
        orders={selectSelfOrderingOrder?.orders}
        title={`ໂຕະ: ${selectSelfOrderingOrder?.tableName} ${moment(
          selectSelfOrderingOrder?.createdAt
        ).format("YYYY/MM/DD LT")}`}
        open={popup?.PopUpSelfOrderingConfirm}
        onSubmit={deleteSelfOrderingOrder}
        onClose={() => setPopup()}
      />
    </>
  );
}
