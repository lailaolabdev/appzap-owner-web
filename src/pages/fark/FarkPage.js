import React, { useEffect, useState } from "react";
import Select from "react-select";
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
export default function FarkPage() {
  const { t } = useTranslation();
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
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");

  const [shiftData, setShiftData] = useState([]);
  const [shiftId, setShiftId] = useState([]);

  // provider
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { profile } = useStore();
  const { shiftCurrent } = useShiftStore();

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
                  placeholder={t("search_bill_code")}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
                {/* <Button variant="primary" onClick={getData}>
                  {t("search")}
                </Button> */}
              </div>
              <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
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
                      <div className="flex gap-1 items-center">
                        <span>{t("chose_shift")} : </span>
                        <Select
                          placeholder={t("chose_shift")}
                          className="w-40 border-orange-500"
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
      </div>
      <PopUpDetaillBillFark
        open={popup?.PopUpDetaillBillFark}
        onClose={() => {
          setPopup();
          setSelectBillFark();
        }}
        billFarkData={selectBillFark}
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
