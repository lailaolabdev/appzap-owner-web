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
import { getCode } from "../../services/code";
import Spinner from "react-bootstrap/Spinner";
import PopUpSignalDisconnect from "../../components/popup/PopUpSignalDisconnect";
import PopUpOption from "./component/PopUpOption";
import { moneyCurrency } from "../../helpers";
import { t } from "i18next";

import { useMenuStore } from "../../zustand/menuStore";

function StaffCartPage() {
  const navigate = useNavigate();
  const { codeId } = useParams();

  // state
  const [isLoading, setIsLoading] = useState(true);
  const [codeData, setCodeData] = useState();
  const [popup, setPopup] = useState();

  const { staffCart, setStaffCart } = useMenuStore();
  // useEffect
  useEffect(() => {
    FetchCodeData();
  }, [codeId]);
  // function

  const FetchCodeData = async () => {
    setCodeData();

    setIsLoading(true);
    let _code = await getCode(codeId);
    if (_code?.error) {
      setPopup({ PopUpSignalDisconnect: true });
    } else {
      setPopup();
      setCodeData(_code);
    }
    setIsLoading(false);
  };
  const createOrderByStaff = async () => {
    setIsLoading(true);
    let orders = [];
    for (const item of staffCart) {
      orders.push({
        id: item?._id,
        name: item?.name,
        quantity: item?.quantity,
        note: item?.note,
        options: item?.options,
        menuOptions: item?.menuOptions,
        categoryId: item?.categoryId,
        printer: item?.printer,
        totalOptionPrice: item?.totalOptionPrice,
      });
    }
    const dataBody = {
      orders: orders,
      billId: codeData?.billId,
      storeId: codeData?.storeId,
    };
    const url = `${END_POINT_APP}/v3/staff/bill/create`;
    await axios
      .post(url, dataBody, {
        headers: await getHeaders(),
      })
      .then(() => {
        setStaffCart([]);
        navigate(`/staff/tableDetail/${codeId}`);
      });
    setIsLoading(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100%",
          maxHeight: "100%",
          flexDirection: "column",
        }}
      >
        <NavContainer
          onBack={() => {
            navigate(`/add-order/${codeId}`, { replace: true });
          }}
        />
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
          {staffCart?.map((e, index) => (
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
              <div>
                {e?.name} x {e?.price}
                {e?.note ? (
                  <>
                    <br />({e?.note})
                  </>
                ) : (
                  ""
                )}
                <br />
                {e?.options?.map((option, optIndex) => (
                  <li key={optIndex} style={{ marginTop: "5px" }}>
                    {option.name} {`[${option.quantity}]`} x{" "}
                    {moneyCurrency(option.quantity * option.price)}{" "}
                  </li>
                ))}
              </div>
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
                  <Button
                    disabled={isLoading}
                    onClick={() =>
                      setStaffCart((items) =>
                        items
                          .map((e, i) => {
                            if (i == index) {
                              return { ...e, quantity: e.quantity - 1 };
                            }
                            return e;
                          })
                          .filter((e) => e.quantity > 0)
                      )
                    }
                  >
                    <GoDash />
                  </Button>
                  <div>{e?.quantity}</div>
                  <Button
                    disabled={isLoading}
                    onClick={() =>
                      setStaffCart((items) =>
                        items
                          .map((e, i) => {
                            if (i == index) {
                              return { ...e, quantity: e.quantity + 1 };
                            }
                            return e;
                          })
                          .filter((e) => e.quantity > 0)
                      )
                    }
                  >
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
          <Button
            style={{ width: "100%" }}
            onClick={() => createOrderByStaff()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner animation="border" variant="white" size="sm" />
            ) : (
              ""
            )}
            {t("confirm")}
          </Button>
        </div>
      </div>
      {/* popup */}
      <PopUpSignalDisconnect
        open={popup?.PopUpSignalDisconnect}
        onSubmit={FetchCodeData}
      />
    </>
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
