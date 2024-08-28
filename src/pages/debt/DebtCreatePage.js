import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  BLUETOOTH_PRINTER_PORT,
  COLOR_APP,
  COLOR_APP_CANCEL,
  ETHERNET_PRINTER_PORT,
  URL_PHOTO_AW3,
  USB_PRINTER_PORT,
} from "../../constants";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAl } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Pagination } from "react-bootstrap";
import { Formik } from "formik";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd, MdRefresh } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { getBanners } from "../../services/banner";
import Upload from "../../components/Upload";
import { IoBeerOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import Select, { components } from "react-select";
import {
  createBillFark,
  getBillFarks,
  getMenuFarks,
} from "../../services/fark";
import { useStore } from "../../store";
import { useNavigate, useLocation } from "react-router-dom";
import PopUpAddMenuForBillFark from "../../components/popup/PopUpAddMenuForBillFark";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import axios from "axios";
import BillFark80 from "../../components/bill/BillFark80";
import moment from "moment";
import { useTranslation } from "react-i18next";
import printFlutter from "../../helpers/printFlutter";
import { getMembers } from "./../../services/member.service";

// let limitData = 100;

export default function DebtCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();

  // console.log(state?.key);

  // state
  const [isLoading, setIsLoading] = useState(true);
  const [loanDataList, setLoanDataList] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [totalDataList, setTotalDataList] = useState(0);
  const [backupFormData, setBackupFormData] = useState();
  const [menuFarkData, setMenuFarkData] = useState();
  const [popup, setPopup] = useState();
  const [customerName, setCustomerName] = useState();
  const [customerPhone, setCustomerPhone] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [printCode, setPrintCode] = useState();
  const [membersData, setMembersData] = useState([]);

  const [widthBill80, setWidthBill80] = useState(0);
  let billFark80Ref = useRef();
  // store
  const { storeDetail } = useStore();
  const { printerCounter, printers } = useStore();

  // useEffect
  useEffect(() => {
    getData();
    getMembersData();
  }, []);

  useEffect(() => {
    getMembersData();
  }, [state?.key]);

  useEffect(() => {
    const element = billFark80Ref.current;
    // console.log(element); // 👈️ element here
  }, []);
  useLayoutEffect(() => {
    setWidthBill80(billFark80Ref.current.offsetWidth);
  }, [billFark80Ref]);
  useEffect(() => {
    if (printCode) {
      onPrintBillFark();
    }
  }, [printCode]);
  // function
  const getData = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      const data = await getMenuFarks(findby, TOKEN);
      setMenuFarkData(data);
    } catch (err) {
      console.log("err", err);
    }
  };
  const addCartCount = (menuId) => {
    const _menu = menuFarkData.map((e) => {
      if (e?._id == menuId) {
        let cartCount = e?.cartCount || 0;
        cartCount += 1;
        if (cartCount <= 0) {
          return { ...e, cartCount: 0, addToCart: false };
        }
        return { ...e, cartCount };
      } else {
        return e;
      }
    });
    setMenuFarkData(_menu);
  };
  const minCartCount = (menuId) => {
    const _menu = menuFarkData.map((e) => {
      if (e?._id == menuId) {
        let cartCount = e?.cartCount || 0;
        cartCount -= 1;
        if (cartCount <= 0) {
          return { ...e, cartCount: 0, addToCart: false };
        }
        return { ...e, cartCount };
      } else {
        return e;
      }
    });
    setMenuFarkData(_menu);
  };

  const addToCart = (menuId) => {
    const _menu = menuFarkData.map((e) => {
      if (e?._id == menuId) {
        return { ...e, cartCount: 1, addToCart: true };
      } else {
        return e;
      }
    });
    setMenuFarkData(_menu);
  };

  const handleClickCreateBillFark = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      console.log("DATA", DATA);
      let menus = menuFarkData.filter((e) => e?.addToCart);
      let menusFormat = menus.map((e) => ({
        menuId: e?._id,
        amount: e?.cartCount,
      }));
      const _body = {
        menus: menusFormat,
        customerName: customerName,
        customerPhone: customerPhone,
        startDate: startDate,
        endDate: endDate,
        storeId: DATA?.storeId,
      };
      const data = await createBillFark(_body, TOKEN);
      if (data.error) {
        errorAdd(`${t("save_fail")}`);
        return;
      }
      setPrintCode(data.code);
      // await onPrintBillFark();
      // navigate("../", { replace: true });
      successAdd(`${t("save_success")}`);
    } catch (err) {
      console.log(err);
    }
  };
  const onPrintBillFark = async () => {
    try {
      // if (!tokenQR) {
      //   return;
      // }
      // alert(tokenQR);
      // setTokenForSmartOrder(tokenQR, (ee) => {
      //   console.log(tokenForSmartOrder, "tokenForSmartOrder");
      // });
      // if (!tokenForSmartOrder) {
      //   setTokenForSmartOrder(tokenQR);
      //   await delay(1000);
      //   return;
      // }
      // if (!tokenForSmartOrder) {
      //   return;
      // }
      let urlForPrinter = "";
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );
      let dataImageForPrint;
      console.log("check 1");
      if (printerBillData?.width === "80mm") {
        dataImageForPrint = await html2canvas(billFark80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
      }

      if (printerBillData?.width === "58mm") {
        dataImageForPrint = await html2canvas(billFark80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
      }
      // console.log("dataImageForPrint", dataImageForPrint);
      // console.log("check 2");

      if (printerBillData?.type === "ETHERNET") {
        urlForPrinter = ETHERNET_PRINTER_PORT;
      }
      if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = BLUETOOTH_PRINTER_PORT;
      }
      if (printerBillData?.type === "USB") {
        urlForPrinter = USB_PRINTER_PORT;
      }
      console.log(dataImageForPrint.toDataURL());
      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      console.log("check 3");
      var bodyFormData = new FormData();

      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      bodyFormData.append("paper", printerBillData?.width === "58mm" ? 58 : 80);

      console.log("check 4");
      await printFlutter(
        {
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9100",
        },
        async () => {
          await axios({
            method: "post",
            url: urlForPrinter,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      );
      // await axios({
      //   method: "post",
      //   url: urlForPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      console.log("check 5");
      // setCodeShortLink(null);
      await Swal.fire({
        icon: "success",
        title: `${t("print_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      setPrintCode();
      navigate("../", { replace: true });
      // setCodeShortLink(null);
    } catch (err) {
      // setCodeShortLink(null);
      console.log("onprint:", err);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fail")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const getMembersData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      // findby += `skip=${(pagination - 1) * limitData}&`;
      // findby += `limit=${limitData}&`;
      const _data = await getMembers(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data.data.data);
    } catch (err) {}
  };

  const options = membersData.map((data) => {
    return {
      id: data?._id,
      value: data?.name,
      label: data?.phone,
      tel: data?.phone,
    };
  });

  return (
    <>
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "calc(100% - 50%)",
            height: "calc(100%)",
            boxShadow: "0px 2px 8px 2px rgba(0,0,0,0.05)",
            borderBottom: "2px solid rgba(0,0,0,0.05)",
            borderRadius: 10,
            marginTop: "15px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              textAlign: "center",
              backgroundColor: COLOR_APP,
              padding: 20,
            }}
          >
            {t("debt_create")}
          </div>
          <div
            style={{
              padding: "0 30px 30px 30px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              marginBottom: "200px",
            }}
          >
            <Form.Label>{t("ctm_tel")}</Form.Label>
            <BoxInput>
              <div className="debt-input">
                <Select
                  options={options}
                  placeholder={t("ctm_tel")}
                  onChange={(e) => {
                    setCustomerPhone(e.tel);
                    setCustomerName(e.value);
                  }}
                />
              </div>
              <div className="debt-btn-group">
                <button
                  className="btn btn-primary"
                  onClick={() => getMembersData()}
                >
                  <MdRefresh />
                </button>
                <button
                  className="btn btn-primary"
                  onClick={
                    () => window.open("/create/members", "_blank").focus()
                    // navigate("/reports/members-report/create-member", "_blank", {
                    //   state: { key: "create-debt" },
                    // })
                  }
                >
                  ເພີ່ມໃໝ່
                </button>
              </div>
            </BoxInput>

            <Form.Label>{t("customer_name")}</Form.Label>
            <Form.Control
              placeholder={t("ctm_tel")}
              value={customerName}
              onChange={(e) => setCustomerPhone(e?.target.value)}
            />
            <Form.Label>ລະຫັດບິນ</Form.Label>
            <Select
              options={options}
              placeholder={t("ctm_tel")}
              onChange={(e) => {
                setCustomerPhone(e.tel);
                setCustomerName(e.value);
              }}
            />
            <Form.Label>{t("money_amount")}</Form.Label>
            <Form.Control
              placeholder={t("money_amount")}
              value={customerName}
              onChange={(e) => setCustomerPhone(e?.target.value)}
            />
            <Form.Label>{t("start_date_debt")}</Form.Label>
            <Form.Control
              placeholder={t("exp_date")}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e?.target.value)}
            />
            <Form.Label>{t("end_date_debt")}</Form.Label>
            <Form.Control
              placeholder={t("exp_date")}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e?.target.value)}
            />
            <div style={{ flex: 1 }}>
              {/* <table style={{ width: "100%" }}>
                <tr>
                  <th>{t("name")}</th>
                  <th style={{ textAlign: "center" }}>{t("amount")}</th>
                </tr>
                {menuFarkData
                  ?.filter((e) => e?.addToCart)
                  .map((e) => (
                    <tr>
                      <td style={{ textAlign: "start" }}>{e?.name}</td>
                      <td style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Button onClick={() => minCartCount(e?._id)}>
                            -
                          </Button>
                          {e?.cartCount || 0}
                          <Button onClick={() => addCartCount(e?._id)}>
                            +
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </table> */}
              <div
                style={{
                  width: "80mm",
                  padding: 10,
                }}
                ref={billFark80Ref}
              >
                <BillFark80
                  expirDate={endDate}
                  customerPhone={customerPhone}
                  customerName={customerName}
                  // menuFarkData={menuFarkData?.filter((e) => e?.addToCart)}
                  code={printCode}
                />
              </div>
            </div>
            <Button
              style={{ width: "100%", height: 60 }}
              onClick={() => handleClickCreateBillFark()}
            >
              {t("save_print")}
            </Button>
          </div>
        </div>
      </div>
      <PopUpAddMenuForBillFark
        open={popup?.PopUpAddMenuForBillFark}
        onClose={() => setPopup()}
        callback={() => {
          getData();
        }}
      />
    </>
  );
}

const BoxInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  gap: 5px;

  .debt-input {
    width: calc(100% - 23%);
  }
  .debt-btn-group {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    .debt-input {
      width: calc(100% - 40%);
    }
  }
`;
