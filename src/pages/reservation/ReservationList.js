import React, { useEffect, useState, useMemo } from "react";
import moment, { lang } from "moment";
import { COLOR_APP, USER_KEY } from "../../constants";
import { getLocalData } from "../../constants/api";
import AnimationLoading from "../../constants/loading";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { BiDotsVerticalRounded } from "react-icons/bi";
import ButtonIcon from "../../components/button/ButtonIcon";
// services
import {
  updateReservation,
  addReservation,
  getReservations,
} from "../../services/reservation";
import { updateStore } from "../../services/store";
import Box from "../../components/Box";
// popup
import PopUpConfirm from "../../components/popup/PopUpConfirm";
import ButtonTab from "../../components/button/ButtonTab";
import ButtonManamentReservation from "../../components/button/ButtonManamentReservation";
import PopUpReservationAdd from "../../components/popup/PopUpReservationAdd";
import PopUpReservationDetail from "../../components/popup/PopUpReservationDetail";
import { Form, FormGroup, InputGroup, Button } from "react-bootstrap";
import { socket } from "../../services/socket";
import { useStore } from "../../store";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import { fontMap } from "../../utils/font-map";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import PopUpSetStartAndEndDateRefine from "../../components/popup/PopUpSetStartAndEndDateRefine";

import { useStoreStore } from "../../zustand/storeStore";
import { useBookingStore } from "../../zustand/bookingStore";

// ---------------------------------------------------------------------------------------------------------- //
export default function ReservationList() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const {
    newOreservationTransaction,
    setNewOreservationTransaction,
    setProfile,
  } = useStore();
  const { storeDetail, fetchStoreDetail } = useStoreStore();
  const storeId = storeDetail._id;
  const { allBooking, setBookingItems, fetchBookingByStatus } =
    useBookingStore();

  //   state
  const [isLoading, setIsLoading] = useState(false);
  const [tabSelect, setTabSelect] = useState("ALL"); // ["ALL","WATTING","STAFF_CONFIRM","CANCEL"]
  const [reservationsData, setReservationsData] = useState();
  const [select, setSelect] = useState();
  const [search, setSearch] = useState();
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [startDate, setStartDate] = useState(
    moment().startOf("year").format("YYYY-MM-DD") + "T00:00:00Z"
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("year").format("YYYY-MM-DD") + "T23:59:59Z"
  );
  const [isSetDatePopUpOpen, setIsSetDatePopUpOpen] = useState(false);
  const [popup, setPopup] = useState({
    cancel: false,
    detail: false,
    delete: false,
    add: false,
    confirm: false,
    edit: false,
    success: false,
  });

  const [remark, setRemark] = useState(storeDetail?.remark || "");
  const [isRemarkEditable, setIsRemarkEditable] = useState(false);

  // functions
  const handleReject = (select) => {
    setPopup({ delete: true });
    setSelect(select);
  };
  const onSubmitReject = async (value) => {
    updateReservation(
      { status: "CANCEL", cancelReason: value },
      select?._id
    ).then(() => {
      setPopup();
      getData();
    });
  };
  const onSubmitSuccess = async () => {
    updateReservation({ status: "SUCCESS" }, select?._id).then(() => {
      setPopup();
      getData();
    });
  };
  const handleConfirm = (select) => {
    setPopup({ confirm: true });
    setSelect(select);
  };
  const onSubmitConfirm = async () => {
    updateReservation(
      { status: "STAFF_CONFIRM", cancelReason: "" },
      select?._id
    ).then(() => {
      setPopup();
      getData();
    });
  };
  const handleShowDetail = (select) => {
    setPopup((prev) => ({ ...prev, detail: true }));
    setSelect(select);
  };

  const handleSaveRemark = async (value) => {
    if (value === storeDetail?.remark) return setIsRemarkEditable(false);

    try {
      updateStore({ remark: value }, storeDetail?._id);
      fetchStoreDetail(storeDetail?._id);
      setIsRemarkEditable(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async (status) => {
    if (tabSelect != "ALL" && tabSelect != "") {
      status = tabSelect;
    }
    setIsLoading(true);
    let findBy = "";
    if (status) findBy += `&status=${status}`;
    if (search) findBy += `&search=${search}`;

    try {
      const data = await getReservations(findBy, storeId);
      // Only set booking items if data exists
      if (data) {
        setReservationsData(data);
        setBookingItems(data);
      }
      fetchBookingByStatus("WAITING");
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    }
    setIsLoading(false);
    return;
  };
  // useEffect
  useEffect(() => {
    getData();
    const queryData = window?.location?.href
      ?.split("?")?.[1]
      ?.split("&")
      ?.map((e) => e.split("="));
    const token = queryData?.find((e) => e[0] === "token")[1];
    if (token) {
      localStorage.setItem(USER_KEY, JSON.stringify({ accessToken: token }));
      // setProfile({ accessToken: token });
    }
  }, [tabSelect, startDate, endDate]);
  useEffect(() => {
    if (newOreservationTransaction) {
      getData();
      setNewOreservationTransaction(false);
    }
  }, [newOreservationTransaction]);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          style={{
            paddingLeft: 10,
            maxHeight: "100vh",
            height: "100%",
            overflow: "auto",
            paddingBottom: 80,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "2px solid #ccc",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <ButtonTab
                active={tabSelect === "ALL"}
                onClick={() => {
                  // getData();
                  setTabSelect("ALL");
                }}
              >
                <span className={fontMap[language]}>{t("lists")}</span>
              </ButtonTab>
              <ButtonTab
                active={tabSelect === "WAITING"}
                onClick={() => {
                  // getData("WATTING");
                  setTabSelect("WAITING");
                }}
              >
                <span className={fontMap[language]}>
                  {t("waitingForApprove")}
                </span>
              </ButtonTab>
              <ButtonTab
                active={tabSelect === "STAFF_CONFIRM"}
                onClick={() => {
                  // getData("STAFF_CONFIRM");
                  setTabSelect("STAFF_CONFIRM");
                }}
              >
                <span className={fontMap[language]}>{t("approve")}</span>
              </ButtonTab>
              <ButtonTab
                active={tabSelect === "CANCEL"}
                onClick={() => {
                  // getData("CANCEL");
                  setTabSelect("CANCEL");
                }}
              >
                <span className={fontMap[language]}>{t("canceled")}</span>
              </ButtonTab>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingRight: 10,
              }}
            >
              <ButtonPrimary
                style={{ color: "white" }}
                onClick={() => setPopup((prev) => ({ ...prev, add: true }))}
              >
                <span className={fontMap[language]}>+ {t("addBooking")}</span>
              </ButtonPrimary>
            </div>
          </div>
          <div className="p-5 flex w-full flex-col justify-between md:flex-row">
            <div className="flex gap-3">
              <FormGroup>
                <Form.Label className={fontMap[language]}>
                  {t("search")}
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder={t("ex_phone")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    style={{
                      borderRadius: 0,
                      backgroundColor: COLOR_APP,
                      border: COLOR_APP,
                    }}
                    // variant="outline-secondary"
                    id="button-addon1"
                    onClick={() => getData()}
                  >
                    <span className={fontMap[language]}>{t("search")}</span>
                  </Button>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Form.Label className={fontMap[language]}>
                  {t("bookingDate")}
                </Form.Label>
                <Button
                  variant="outline-primary"
                  size="small"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                  onClick={() => setIsSetDatePopUpOpen(true)}
                >
                  <BsFillCalendarWeekFill />
                  <div>{moment(startDate).format("YYYY-MM-DD")}</div> ~{" "}
                  <div>{moment(endDate).format("YYYY-MM-DD")}</div>
                </Button>
              </FormGroup>
            </div>
            <FormGroup>
              <Form.Label className={fontMap[language]}>{t("note")}</Form.Label>
              {!isRemarkEditable ? (
                <InputGroup>
                  <Form.Control
                    placeholder={""}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    disabled={!isRemarkEditable}
                  />
                  <Button
                    style={{
                      borderRadius: 0,
                      backgroundColor: COLOR_APP,
                      border: COLOR_APP,
                    }}
                    // variant="outline-secondary"
                    id="button-addon1"
                    onClick={() => setIsRemarkEditable(true)}
                  >
                    <span className={fontMap[language]}>{t("edit")}</span>
                  </Button>
                </InputGroup>
              ) : (
                <InputGroup>
                  <Form.Control
                    placeholder={""}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    disabled={!isRemarkEditable}
                  />
                  <Button
                    style={{
                      borderRadius: 0,
                      backgroundColor: COLOR_APP,
                      border: COLOR_APP,
                    }}
                    // variant="outline-secondary"
                    id="button-addon1"
                    onClick={() => handleSaveRemark(remark)}
                  >
                    <span className={fontMap[language]}>{t("save")}</span>
                  </Button>
                </InputGroup>
              )}
            </FormGroup>
          </div>
          <div style={{ padding: 20, paddingTop: 0 }}>
            <div
              style={{
                borderRadius: 8,
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#F9F9F9",
                    height: 57,
                    whiteSpace: "nowrap",
                  }}
                >
                  <tr>
                    <th
                      style={{ color: COLOR_APP }}
                      className={fontMap[language]}
                    >
                      {t("no")}
                    </th>
                    <th
                      style={{ color: COLOR_APP }}
                      className={fontMap[language]}
                    >
                      {t("bookedBy")}
                    </th>
                    <th
                      style={{ color: COLOR_APP }}
                      className={fontMap[language]}
                    >
                      {t("phoneNumberOfBooked")}
                    </th>
                    <th
                      style={{ color: COLOR_APP }}
                      className={fontMap[language]}
                    >
                      {t("dateAndTime")}
                    </th>
                    <th
                      style={{ color: COLOR_APP }}
                      className={fontMap[language]}
                    >
                      {t("comment")}
                    </th>
                    <th
                      style={{ color: COLOR_APP }}
                      className={fontMap[language]}
                    >
                      {t("tableStatus2")}
                    </th>
                    <th
                      style={{ color: COLOR_APP }}
                      className={fontMap[language]}
                    >
                      {t("numberOfPeople")}
                    </th>
                    <th
                      style={{
                        color: COLOR_APP,
                        maxWidth: 250,
                        width: 250,
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </th>
                    <th style={{ maxWidth: 50, width: 50 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {allBooking?.map((item, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #EBEBEB" }}
                      onClick={(e) => {
                        if (
                          e.target.cellIndex > 5 ||
                          e.target.cellIndex === undefined
                        ) {
                          return;
                        }
                        handleShowDetail(item);
                      }}
                    >
                      <td>{index + 1}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {item?.clientNames?.[0]}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {item?.clientPhone}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {item?.startTime &&
                          moment(item?.startTime).format("DD/MM/YYYY")}{" "}
                        -{" "}
                        {item?.startTime &&
                          moment(item?.startTime).format("LT")}
                      </td>
                      <td style={{ minWidth: "200px" }}>
                        {item?.clientComment || "-"}
                      </td>
                      <td style={{ minWidth: "200px" }}>{item?.note || "-"}</td>
                      <td>{item?.partySize}</td>
                      <td>
                        <ButtonManamentReservation
                          status={item?.status}
                          handleConfirm={() => {
                            handleConfirm(item);
                          }}
                          handleReject={() => {
                            handleReject(item);
                          }}
                          handleEdit={() => {
                            setSelect(item);
                            setPopup((prev) => ({ ...prev, edit: true }));
                          }}
                        />
                      </td>
                      <td>
                        <ButtonIcon>
                          <BiDotsVerticalRounded
                            style={{ width: 18, height: 18 }}
                          />
                        </ButtonIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* >>>>>>>>>>>>> popup <<<<<<<<<<<<<<< */}
      <PopUpConfirm
        text1="ທ່ານຕ້ອງການປະຕິເສດບໍ?"
        text2={select?.clientPhone}
        open={popup?.delete}
        onClose={() => setPopup((prev) => ({ ...prev, delete: false }))}
        onSubmit={onSubmitReject}
        isRejected
      />
      <PopUpConfirm
        text1="ຢືນຢັນການຈອງ"
        text2={select?.clientPhone}
        open={popup?.confirm}
        onClose={() => setPopup((prev) => ({ ...prev, confirm: false }))}
        onSubmit={onSubmitConfirm}
      />
      <PopUpReservationAdd
        // value={}
        open={popup?.add}
        onClose={() => setPopup((prev) => ({ ...prev, add: false }))}
        onSubmit={async (e) => {
          // alert(JSON.stringify(e));
          await addReservation(e);
          getData();
          setPopup((prev) => ({ ...prev, add: false }));
        }}
      />
      <PopUpReservationAdd
        value={select}
        open={popup?.edit}
        onClose={() => setPopup()}
        onSubmit={async (e) => {
          // alert(JSON.stringify(e));
          await updateReservation(e, e._id);
          getData();
          setPopup();
        }}
      />
      <PopUpConfirm
        text1="ຍົກເລີກບໍ?"
        text2={select?.clientPhone}
        open={popup?.cancel}
        onClose={() => setPopup((prev) => ({ ...prev, cancel: false }))}
        onSubmit={onSubmitReject}
        isRejected
      />
      <PopUpConfirm
        text1="ຢືນຢັນການຈອງສຳເລັດແລ້ວ"
        // text2={select?.clientPhone}
        open={popup?.success}
        onClose={() => setPopup((prev) => ({ ...prev, success: false }))}
        onSubmit={onSubmitSuccess}
      />
      <PopUpReservationDetail
        open={popup?.detail}
        buttonCancel={() => {
          setPopup((prev) => ({ ...prev, cancel: true }));
        }}
        buttonConfirm={() => {
          setPopup((prev) => ({ ...prev, confirm: true }));
        }}
        buttonEdit={() => {
          setPopup((prev) => ({ ...prev, detail: false, edit: true }));
        }}
        onClose={() => setPopup((prev) => ({ ...prev, detail: false }))}
        data={select}
      />
      <PopUpSetStartAndEndDateRefine
        open={isSetDatePopUpOpen}
        onClose={() => setIsSetDatePopUpOpen(false)}
        setStartDate={setStartDate}
        startDate={startDate}
        setEndDate={setEndDate}
        endDate={endDate}
      />
    </div>
  );
}
