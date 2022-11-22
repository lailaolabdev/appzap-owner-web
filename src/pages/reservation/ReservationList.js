import React, { useEffect, useState } from "react";
import moment from "moment";
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
// popup
import PopUpConfirm from "../../components/popup/PopUpConfirm";
import ButtonTab from "../../components/button/ButtonTab";
import ButtonManamentReservation from "../../components/button/ButtonManamentReservation";
import PopUpReservationAdd from "../../components/popup/PopUpReservationAdd";
import PopUpReservationDetail from "../../components/popup/PopUpReservationDetail";
import { Form, FormGroup, InputGroup, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

// ---------------------------------------------------------------------------------------------------------- //
export default function ReservationList() {
  const params = useParams();
  const storeId = params.storeId;

  // const _limit = params.limit;
  // const _page = params.page;

  //   state
  const [isLoading, setIsLoading] = useState(false);
  const [tabSelect, setTabSelect] = useState("ALL"); // ["ALL","WATTING","STAFF_CONFIRM","CANCEL"]
  const [reservationsData, setReservationsData] = useState();
  const [select, setSelect] = useState();
  const [search, setSearch] = useState();
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [popup, setPopup] = useState({
    cancel: false,
    detail: false,
    delete: false,
    add: false,
    confirm: false,
    edit: false,
  });

  // functions
  const handleReject = (select) => {
    setPopup({ delete: true });
    setSelect(select);
  };
  const onSubmitReject = async () => {
    updateReservation({ status: "CANCEL" }, select?._id).then(() => {
      setPopup();
      getData();
    });
  };
  const handleConfirm = (select) => {
    setPopup({ confirm: true });
    setSelect(select);
  };
  const onSubmitConfirm = async () => {
    updateReservation({ status: "STAFF_CONFIRM" }, select?._id).then(() => {
      setPopup();
      getData();
    });
  };
  const handleShowDetail = (select) => {
    setPopup((prev) => ({ ...prev, detail: true }));
    setSelect(select);
  };
  const getData = async (status) => {
    if (tabSelect != "ALL" && tabSelect != "") {
      status = tabSelect;
    }
    setIsLoading(true);
    console.log("status", status);
    let findBy = "";
    if (status) findBy += `&status=${status}`;
    if (search) findBy += `&search=${search}`;
    if (dateFrom) findBy += `&dateFrom=${dateFrom}`;
    if (dateTo) findBy += `&dateTo=${dateTo}`;
    const data = await getReservations(findBy, storeId);
    setReservationsData(data);
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
    }
  }, [tabSelect, dateFrom, dateTo]);

  return (
    <div>
      {isLoading ? (
        <AnimationLoading />
      ) : (
        <div style={{ paddingLeft: 10 }}>
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
                active={tabSelect == "ALL"}
                onClick={() => {
                  // getData();
                  setTabSelect("ALL");
                }}
              >
                ລາຍການທັງໝົດ
              </ButtonTab>
              <ButtonTab
                active={tabSelect == "WATTING"}
                onClick={() => {
                  // getData("WATTING");
                  setTabSelect("WATTING");
                }}
              >
                ລາຍການທີ່ລໍຖ້າອະນຸມັດ
              </ButtonTab>
              <ButtonTab
                active={tabSelect == "STAFF_CONFIRM"}
                onClick={() => {
                  // getData("STAFF_CONFIRM");
                  setTabSelect("STAFF_CONFIRM");
                }}
              >
                ລາຍການທີ່ອະນຸມັດ
              </ButtonTab>
              <ButtonTab
                active={tabSelect == "CANCEL"}
                onClick={() => {
                  // getData("CANCEL");
                  setTabSelect("CANCEL");
                }}
              >
                ລາຍການທີ່ຍົກເລີກ
              </ButtonTab>
            </div>
            <div>
              <ButtonPrimary
                style={{ color: "white" }}
                onClick={() => setPopup((prev) => ({ ...prev, add: true }))}
              >
                ເພີ່ມການຈອງ
              </ButtonPrimary>
            </div>
          </div>
          <div style={{ padding: 20, display: "flex", gap: 10 }}>
            <FormGroup>
              <Form.Label>ຄົ້ນຫາ</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Example: (ເບີໂທ) (ຊື່ຜູ້ຈອງ)"
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
                  Search
                </Button>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Form.Label>ວັນທີຈອງ</Form.Label>
              <Form.Control
                type="date"
                style={{ maxWidth: 100 }}
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>ຫາວັນທີ</Form.Label>
              <Form.Control
                type="date"
                style={{ maxWidth: 100 }}
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label></Form.Label>
              <Form.Control
                type="button"
                style={{ maxWidth: 100 }}
                value="ມື້ນີ້"
                onClick={() => {
                  setDateFrom(moment().format("YYYY-MM-DD"));
                  setDateTo(
                    moment(moment().add(1, "days")).format("YYYY-MM-DD")
                  );
                  // alert(moment(moment().add(1, "days")).format("YYYY-MM-DD"));
                }}
              />
            </FormGroup>
          </div>
          <div style={{ padding: 20, paddingTop: 0 }}>
            <div
              style={{
                borderRadius: 8,
                boxShadow: "0 0 3px 3px rgba(0,0,0,0.1)",
                overflow: "hidden",
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
                    borderBottom: "2px solid #EBEBEB",
                  }}
                >
                  <tr>
                    <th style={{ color: COLOR_APP }}>ລຳດັບ</th>
                    <th style={{ color: COLOR_APP }}>ຊື່ຜູ້ຈອງ</th>
                    <th style={{ color: COLOR_APP }}>ເບີໂທຂອງຜູ້ຈອງ</th>
                    <th style={{ color: COLOR_APP }}>
                      ວັນທີ / ເດືອນ / ປີ - ເວລາ
                    </th>
                    <th style={{ color: COLOR_APP }}>ສະຖານທີ່(ໂຕະ)</th>
                    <th style={{ color: COLOR_APP }}>ຈຳນວນຄົນ</th>
                    <th style={{ color: COLOR_APP, maxWidth: 250, width: 250 }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Form.Control
                          type="date"
                          style={{ maxWidth: 100 }}
                          disabled
                        />
                        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                          to
                        </div>
                        <Form.Control
                          type="date"
                          style={{ maxWidth: 100 }}
                          disabled
                        />
                      </div>
                    </th>
                    <th style={{ maxWidth: 50, width: 50 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {reservationsData?.map((item, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #EBEBEB" }}
                      onClick={(e) => {
                        if (
                          e.target.cellIndex > 5 ||
                          e.target.cellIndex == undefined
                        ) {
                          return;
                        }
                        handleShowDetail(item);
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{item?.clientNames?.[0]}</td>
                      <td>{item?.clientPhone}</td>
                      <td>
                        {item?.startTime &&
                          moment
                            .parseZone(item?.startTime)
                            .format("DD/MM/YYYY")}{" "}
                        -{" "}
                        {item?.startTime &&
                          moment.parseZone(item?.startTime).format("LT")}
                      </td>
                      <td>{item?.note}</td>
                      <td>{item?.clientNumber}</td>
                      <td>
                        <ButtonManamentReservation
                          status={item?.status}
                          handleConfirm={() => {
                            handleConfirm(item);
                          }}
                          handleReject={() => {
                            handleReject(item);
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
        text1="ທ່ານຕ້ອງການປະຕິເສດບໍ ?"
        text2={select?.clientPhone}
        open={popup?.delete}
        onClose={() => setPopup((prev) => ({ ...prev, delete: false }))}
        onSubmit={onSubmitReject}
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
        text1="ຍົກເລີກບໍ ?"
        text2={select?.clientPhone}
        open={popup?.cancel}
        onClose={() => setPopup((prev) => ({ ...prev, cancel: false }))}
        onSubmit={onSubmitReject}
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
    </div>
  );
}
