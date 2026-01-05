import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Form,
  Modal,
  Card,
  Pagination,
  Breadcrumb,
  Tab,
  Tabs,
  Spinner,
} from "react-bootstrap";
import {
  BsFillCalendarWeekFill,
  BsFillCalendarEventFill,
} from "react-icons/bs";
import { Formik } from "formik";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { getBanners } from "../../services/banner";
import Upload from "../../components/Upload";
import { IoBeerOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { getBillFarks } from "../../services/fark";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import PopUpDetaillBillFark from "../../components/popup/PopUpDetaillBillFark";
import { convertBillFarkStatus } from "../../helpers/convertBillFarkStatus";
import EmptyImage from "../../image/empty-removebg.png";
import { useStoreStore } from "../../zustand/storeStore";
import PopUpSetStartAndEndDate from "./../../components/popup/PopUpSetStartAndEndDate";
import { useShiftStore } from "../../zustand/ShiftStore";
import { getAllShift } from "../../services/shift";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import printFlutter from "../../helpers/printFlutter";
import {
  ETHERNET_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  USB_PRINTER_PORT,
} from "../../constants/index";
import Swal from "sweetalert2";
import BillFark80 from "../../components/bill/BillFark80";
// import BillFark80 from "../../components/bill/BillFark80";

export default function FarkPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const limitData = 50;
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState();
  const [searchCode, setSearchCode] = useState("");
  const [billFarkData, setBillFarkData] = useState();
  const [selectBillFark, setSelectBillFark] = useState();
  const [popup, setPopup] = useState();
  const [startDate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");

  const [shiftData, setShiftData] = useState([]);
  const [shiftId, setShiftId] = useState([]);
  const [orderFarkData, setOrderFarkData] = useState();

  // provider
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { profile } = useStore();
  const { printerCounter, printers } = useStore();
  const { shiftCurrent } = useShiftStore();
  const [widthBill80, setWidthBill80] = useState(0);
  const billFark80Ref = useRef();

  // console.log("billFarkData", billFarkData);

  useEffect(() => {
    const element = billFark80Ref?.current;
    console.log(element); // 👈️ element here
  }, []);
  useLayoutEffect(() => {
    setWidthBill80(billFark80Ref?.current?.offsetWidth);
  }, [billFark80Ref]);

  const fetchShift = async () => {
    await getAllShift()
      .then((res) => {
        setShiftData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const optionsData = [
    {
      value: {
        shiftID: "ALL",
      },
      label: t("all_shifts"),
    },
    ...(shiftData ?? []).map((item) => {
      return {
        value: {
          shiftID: item._id,
        },
        label: item.shiftName,
      };
    }),
  ];

  const handleSearchInput = (option) => {
    if (option?.value?.shiftID === "ALL") {
      setShiftId(null);
      getData();
    } else {
      setShiftId(option?.value?.shiftID);
    }
  };

  // useEffect
  useEffect(() => {
    getData();
    fetchShift();
  }, []);

  useEffect(() => {
    if (selectBillFark) {
      getDate();
    }
  }, [selectBillFark]);

  // useEffect
  useEffect(() => {
    getData();
  }, [pagination, startDate, endDate, shiftId, searchCode]);
  // function
  const getData = async () => {
    setIsLoading(true);
    try {
      const { DATA, TOKEN } = await getLocalData();
      let findBy = "?";
      if (profile?.data?.role === "APPZAP_ADMIN") {
        findBy += `skip=${(pagination - 1) * limitData}&`;
        findBy += `limit=${limitData}&`;
        findBy += `storeId=${storeDetail?._id}&`;
        findBy += `startDate=${startDate}&`;
        findBy += `endDate=${endDate}&`;
        findBy += `startTime=${startTime}&`;
        findBy += `endTime=${endTime}&`;

        if (shiftId) {
          findBy += `shiftId=${shiftId}&`;
        }
      } else {
        findBy += `skip=${(pagination - 1) * limitData}&`;
        findBy += `limit=${limitData}&`;
        findBy += `storeId=${storeDetail?._id}&`;
        findBy += `startDate=${startDate}&`;
        findBy += `endDate=${endDate}&`;
        findBy += `startTime=${startTime}&`;
        findBy += `endTime=${endTime}&`;
        if (shiftCurrent[0]) {
          findBy += `shiftId=${shiftCurrent[0]?._id}&`;
        }
      }

      if (searchCode) {
        findBy += `code=${searchCode}&`;
      }

      const data = await getBillFarks(findBy, TOKEN);

      setBillFarkData(data?.data);
      // console.log(data);
      setTotalPagination(Math.ceil(data?.total / limitData));
      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
    }
  };

  console.log("orderFarkData", orderFarkData);

  const getDate = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const url =
        END_POINT_SEVER + "/v4/order-farks?billFarkId=" + selectBillFark?._id;
      const data = await Axios.get(url, { headers: TOKEN });
      console.log("data", data);
      setOrderFarkData(data.data);
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
      bodyFormData.append("isdrawer", false);
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
          width: printerBillData?.width === "58mm" ? 400 : 580,
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
      // setPrintCode();
      // navigate("../", { replace: true });
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
  return (
    <>
      <div
        style={{
          padding: "20px 20px 80px 20px",
          maxHeight: "100vh",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("bury_deposit")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("deposit_list")}</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="billFark-list">
          <Tab
            eventKey="billFark-list"
            title={t("all_deposit")}
            style={{ paddingTop: 20 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: "10px 0",
              }}
            >
              <div>
                <Form.Control
                  style={{ maxWidth: 180 }}
                  placeholder={`${t("search_bill_code")}...`}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
                {/* <Button variant="primary" onClick={getData}>
                  {t("search")}
                </Button> */}
              </div>
              <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div>{t("select_date")} : </div>
                  <Button
                    variant="outline-primary"
                    size="small"
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                    onClick={() => setPopup({ popupfiltter: true })}
                  >
                    <BsFillCalendarWeekFill />
                    <div>
                      {startDate} {startTime}
                    </div>{" "}
                    ~{" "}
                    <div>
                      {endDate} {endTime}
                    </div>
                  </Button>
                </div>
                {profile?.data?.role === "APPZAP_ADMIN"
                  ? storeDetail?.isShift && (
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span>{t("chose_shift")} : </span>
                        <Select
                          placeholder={t("chose_shift")}
                          className="min-w-[170px] w-full border-orange-500"
                          options={optionsData}
                          onChange={handleSearchInput}
                        />
                      </div>
                    )
                  : ""}
              </div>
            </div>

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
                <span className="flex gap-[10px]  items-center">
                  {/* <span style={{ display: "flex", gap: "10px" , alignItems:"center"}}> */}
                  <IoBeerOutline /> {t("deposit_list")}
                </span>
                <Button
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                  variant="dark"
                  bg="dark"
                  onClick={() => navigate("/fark/create")}
                >
                  <MdAssignmentAdd /> {t("add_deposit")}
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th style={{ textWrap: "nowrap" }}>#</th>
                    <th style={{ textWrap: "nowrap" }}>{t("bill_no")}</th>
                    {/* <th style={{textWrap: "nowrap"}}>{t('order_anount')}</th> */}
                    <th style={{ textWrap: "nowrap" }}>{t("status")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("date_add")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("expired")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("date_pick_up")}</th>
                  </tr>
                  {isLoading ? (
                    <td colSpan={9} style={{ textAlign: "center" }}>
                      <Spinner animation="border" variant="warning" />
                    </td>
                  ) : billFarkData?.length > 0 ? (
                    billFarkData?.map((e, i) => (
                      <tr
                        onClick={() => {
                          setPopup({ PopUpDetaillBillFark: true });
                          setSelectBillFark(e);
                        }}
                      >
                        <td style={{ textAlign: "start", textWrap: "nowrap" }}>
                          {(pagination - 1) * limitData + i + 1}
                        </td>
                        <td style={{ textAlign: "start", textWrap: "nowrap" }}>
                          {e?.code}
                        </td>
                        {/* <td style={{ textAlign: "start", textWrap: "nowrap" }}>0</td> */}
                        <td style={{ textAlign: "start", textWrap: "nowrap" }}>
                          <div>
                            {t ? convertBillFarkStatus(e?.stockStatus, t) : ""}
                          </div>
                        </td>
                        <td style={{ textAlign: "start", textWrap: "nowrap" }}>
                          {moment(e?.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td style={{ textAlign: "start", textWrap: "nowrap" }}>
                          {moment(e?.endDate).format("DD/MM/YYYY")}
                        </td>
                        <td style={{ textAlign: "start", textWrap: "nowrap" }}>
                          {e?.outStockDate
                            ? moment(e?.outStockDate).format("DD/MM/YYYY")
                            : ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td colSpan={6}>
                          <p className="flex justify-center items-center font-bold">
                            {t("no_data") + "..."}
                          </p>
                        </td>
                      </tr>
                    </>
                  )}
                </table>
              </Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  bottom: 20,
                }}
              >
                <ReactPaginate
                  previousLabel={
                    <span className="glyphicon glyphicon-chevron-left">
                      {t("previous")}
                    </span>
                  }
                  nextLabel={
                    <span className="glyphicon glyphicon-chevron-right">
                      {t("next")}
                    </span>
                  }
                  breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
                  breakClassName={"break-me"}
                  pageCount={totalPagination} // Replace with the actual number of pages
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={(e) => {
                    // console.log(e);
                    setPagination(e?.selected + 1);
                  }}
                  containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  activeClassName={"active"}
                  previousClassName={"page-item"}
                  nextClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                />
              </div>
            </Card>
          </Tab>
        </Tabs>
        <div
          style={{
            width: "80mm",
            padding: 10,
          }}
          ref={billFark80Ref}
        >
          <BillFark80
            expirDate={selectBillFark?.endDate}
            customerPhone={selectBillFark?.customerPhone}
            customerName={selectBillFark?.customerName}
            menuFarkData={orderFarkData}
            code={selectBillFark?.code}
            language={i18n.language}
          />
        </div>
      </div>
      <PopUpDetaillBillFark
        open={popup?.PopUpDetaillBillFark}
        onClose={() => {
          setPopup();
          setSelectBillFark();
        }}
        billFarkData={selectBillFark}
        onPrintBillFark={onPrintBillFark}
        callback={() => {
          setPopup();
          setSelectBillFark();
          getData();
        }}
      />

      <PopUpSetStartAndEndDate
        open={popup?.popupfiltter}
        onClose={() => setPopup()}
        startDate={startDate}
        setStartDate={setStartDate}
        setStartTime={setStartTime}
        startTime={startTime}
        setEndDate={setEndDate}
        setEndTime={setEndTime}
        endTime={endTime}
        endDate={endDate}
      />
    </>
  );
}
