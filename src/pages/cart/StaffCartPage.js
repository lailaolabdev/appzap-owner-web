import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsFillCaretLeftFill } from "react-icons/bs";
import { GoDash } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { END_POINT_APP } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { useStore } from "../../store";
function StaffCartPage() {
  const navigate = useNavigate();
  const { codeId } = useParams();

  // provider
  const { menuCategorys, menus, staffCart, setStaffCart } = useStore();
  // function
  const createOrderByStaff = async () => {
    let orders = [];
    for (const item of staffCart) {
      orders.push({
        id: item?._id,
        name: item?.name,
        quantity: item?.quantity,
        note: item?.quantity,
      });
    }
    const dataBody = {
      orders: [
        {
          id: "61de624b45a3a2002b61a7c2",
          name: "ເອາະໄກ່",
          quantity: 1,
          note: "",
        },
      ],
      billId: "64c9db5b968013001f917208",
      storeId: "61d8019f9d14fc92d015ee8e",
    };
    const url = `${END_POINT_APP}/v3/staff/bill/create`;
    await axios
      .post(url, dataBody, {
        headers: await getHeaders(),
      })
      .then(() => {
        navigate(`/staff/tableDetail/${codeId}`);
      });
  };

  useEffect(() => {}, [codeId]);
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        maxHeight: "100%",
        flexDirection: "column",
      }}
    >
      <NavContainer onBack={() => navigate(`/staff/cart/${codeId}`)} />
      <div
        style={{
          overflowY: "scroll",
          padding: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {[...new Array(100)].map((e) => (
          <dev
            style={{
              // border: "1px solid #909090",
              padding: 10,
              borderRadius: 8,
              width: "100%",
              display: "flex",
              gap: 10,
              boxShadow: "2px 2px 8px -1px rgba(0,0,0,0.2)",
              backgroundColor: "#fff",
            }}
          >
            <div>pakerpakerpakerpa kerpakerpaker</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontWeight: "bold" }}>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button>
                  <GoDash />
                </Button>
                <div>1</div>
                <Button>
                  <FiPlus />
                </Button>
              </div>
            </div>
          </dev>
        ))}
      </div>
      <div
        style={{
          padding: 10,
          display: "flex",
          gridGap: 10,
          gap: 10,
          paddingBottom: 30,
          justifyContent: "center",
        }}
      >
        <Button style={{ width: "100%" }}>ຍືນຍັນ</Button>
      </div>
    </div>
  );
}

export default StaffCartPage;

const NavContainer = ({ onBack, codeData, setPopup }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100%",
        padding: 10,
        boxShadow: "0 4px 2px -2px rgba(0,0,0,0.2)",
        borderBottom: "1px",
        borderColor: "rgba(0,0,0,0.2)",
        display: "flex",
        zIndex: 99,
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
      {/* <div style={{ fontWeight: "bold" }}>{codeData?.tableName}</div> */}
      <div style={{ flex: 1 }} />
    </div>
  );
};
