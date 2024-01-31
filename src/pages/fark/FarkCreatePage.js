import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { COLOR_APP, COLOR_APP_CANCEL, URL_PHOTO_AW3 } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Pagination } from "react-bootstrap";
import { Formik } from "formik";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { getBanners } from "../../services/banner";
import Upload from "../../components/Upload";
import { IoBeerOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import {
  createBillFark,
  getBillFarks,
  getMenuFarks,
} from "../../services/fark";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import PopUpAddMenuForBillFark from "../../components/popup/PopUpAddMenuForBillFark";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import axios from "axios";
import BillFark80 from "../../components/bill/BillFark80";
import moment from "moment";

let limitData = 50;

export default function FarkCreatePage() {
  const navigate = useNavigate();
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
  const [expirDate, setexpirDate] = useState(moment(moment()).add(5, 'days').format("YYYY-MM-DD"));
  const [printCode, setPrintCode] = useState();

  const [widthBill80, setWidthBill80] = useState(0);
  let billFark80Ref = useRef();
  // store
  const { storeDetail } = useStore();
  const { printerCounter, printers } = useStore();
  // useEffect
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const element = billFark80Ref.current;
    console.log(element); // 👈️ element here
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
        endDate: expirDate,
        storeId: DATA?.storeId,
      };
      const data = await createBillFark(_body, TOKEN);
      if (data.error) {
        errorAdd("ທັນຖືກບໍ່ສຳເລັດ");
        return;
      }
      setPrintCode(data.code);
      // await onPrintBillFark();
      // navigate("../", { replace: true });
      successAdd("ບັນທຶກສຳເລັດ");
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
      console.log("dataImageForPrint", dataImageForPrint);
      console.log("check 2");

      if (printerBillData?.type === "ETHERNET") {
        urlForPrinter = "http://localhost:9150/ethernet/image";
      }
      if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = "http://localhost:9150/bluetooth/image";
      }
      if (printerBillData?.type === "USB") {
        urlForPrinter = "http://localhost:9150/usb/image";
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
      console.log("check 4");
      await axios({
        method: "post",
        url: urlForPrinter,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("check 5");
      // setCodeShortLink(null);
      await Swal.fire({
        icon: "success",
        title: "ປິນສຳເລັດ",
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
        title: "ປິນບໍ່ສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 450px",
          height: "calc( 100dvh - 65px )",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 20 }}>
          <Breadcrumb>
            <Breadcrumb.Item>ຝັງຊັ້ນຝາກ</Breadcrumb.Item>
            <Breadcrumb.Item active>ສ້າງລາຍການ</Breadcrumb.Item>
          </Breadcrumb>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <span>
                <IoBeerOutline /> ລາຍການຝາກ
              </span>
              <Button
                variant="dark"
                bg="dark"
                onClick={() => setPopup({ PopUpAddMenuForBillFark: true })}
              >
                <MdAssignmentAdd /> ເພີ່ມລາຍການ
              </Button>
            </Card.Header>
            <Card.Body style={{ padding: 5 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "25% 25% 25% 25%",
                  overflow: "hidden",
                  maxWidth: "100%",
                }}
              >
                {menuFarkData?.map((e) => (
                  <div style={{ padding: 2 }}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        overflow: "hidden",
                        padding: 5,
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ height: 100, width: "100%" }}>
                        <img
                          src={
                            e?.images?.[0]
                              ? URL_PHOTO_AW3 + e?.images?.[0]
                              : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
                          }
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div style={{ textWrap: "nowrap" }}>{e?.name}</div>
                      <Button
                        style={{ width: "100%" }}
                        disabled={e?.addToCart}
                        onClick={() => addToCart(e?._id)}
                      >
                        ເພີ່ມ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            position: "relative",
            boxShadow: "0px -3px 5px 5px rgba(0,0,0,0.05)",
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
            ສ້າງລາຍການຝາກ
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
            <Form.Label>ຊື່ລູກຄ້າ</Form.Label>
            <Form.Control
              placeholder="ຊື່ລູກຄ້າ"
              value={customerName}
              onChange={(e) => setCustomerName(e?.target.value)}
            />
            <Form.Label>ເບີໂທລູກຄ້າ</Form.Label>
            <Form.Control
              placeholder="ເບີໂທລູກຄ້າ"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e?.target.value)}
            />
            <Form.Label>ວັນໝົດກຳໜົດ</Form.Label>
            <Form.Control
              placeholder="ວັນໝົດກຳໜົດ"
              type="date"
              value={expirDate}
              onChange={(e) => setexpirDate(e?.target.value)}
            />
            <div style={{ flex: 1 }}>
              <table style={{ width: "100%" }}>
                <tr>
                  <th>ຊື່</th>
                  <th style={{ textAlign: "center" }}>ຈຳນວນ</th>
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
              </table>
              <div
                style={{
                  width: "80mm",
                  padding: 10,
                }}
                ref={billFark80Ref}
              >
                <BillFark80
                  expirDate={expirDate}
                  customerPhone={customerPhone}
                  customerName={customerName}
                  menuFarkData={menuFarkData?.filter((e) => e?.addToCart)}
                  code={printCode}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              bottom: 0,
              right: 0,
              width: "450px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <Button
              style={{ width: "100%", height: 60 }}
              onClick={() => handleClickCreateBillFark()}
            >
              ບັນທຶກແລະປິນ
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
