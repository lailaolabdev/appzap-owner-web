import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import moment from "moment";
import { COLOR_APP } from "../../constants";
import { getLocalData } from "../../constants/api";
import AnimationLoading from "../../constants/loading";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { BiDotsVerticalRounded } from "react-icons/bi";
import ButtonIcon from "../../components/button/ButtonIcon";
// services
import {
  addReservation,
  getReservations,
  updateReservation,
} from "../../services/reservation";
// popup
import PopUpConfirm from "../../components/popup/PopUpConfirm";
import ButtonTab from "../../components/button/ButtonTab";
import ButtonManamentReservation from "../../components/button/ButtonManamentReservation";
import PopUpReservationAdd from "../../components/popup/PopUpReservationAdd";
import PopUpReservationDetail from "../../components/popup/PopUpReservationDetail";
import { Form } from "react-bootstrap";

// ---------------------------------------------------------------------------------------------------------- //
export default function ReservationList() {
  const { match } = useReactRouter();
  // const _limit = match.params.limit;
  // const _page = match.params.page;

  //   state
  const [isLoading, setIsLoading] = useState(false);
  const [tabSelect, setTabSelect] = useState("ALL"); // ["ALL","WATTING","STAFF_CONFIRM","CANCEL"]
  const [reservationsData, setReservationsData] = useState();
  const [select, setSelect] = useState();
  const [popup, setPopup] = useState({
    detail: false,
    delete: false,
    add: false,
    confirm: false,
    edit: false,
  });

  // functions
  const handleReject = (select) => {
    setPopup((prev) => ({ ...prev, delete: true }));
    setSelect(select);
  };
  const onSubmitReject = async () => {
    updateReservation({ status: "CANCEL" }, select?._id).then(() => {
      setPopup((prev) => ({ ...prev, delete: false }));
      getData();
    });
  };
  const handleConfirm = (select) => {
    setPopup((prev) => ({ ...prev, confirm: true }));
    setSelect(select);
  };
  const onSubmitConfirm = async () => {
    updateReservation({ status: "STAFF_CONFIRM" }, select?._id).then(() => {
      setPopup((prev) => ({ ...prev, confirm: false }));
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
    let findBy = "";
    if (status) findBy += `&status=${status}`;
    const data = await getReservations(findBy);
    setReservationsData(data);
    setIsLoading(false);
    return;
  };
  // useEffect
  useEffect(() => {
    getData();
  }, [tabSelect]);

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
              marginBottom: 20,
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
                  <th style={{ color: COLOR_APP }}>ວັນທີ / ເດືອນ / ປີ</th>
                  <th style={{ color: COLOR_APP }}>ເວລາ</th>
                  <th style={{ color: COLOR_APP }}>ຈຳນວນຄົນ</th>
                  <th style={{ color: COLOR_APP, maxWidth: 250, width: 250 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Form.Control type="date" style={{ maxWidth: 100 }} />
                      <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                        to
                      </div>
                      <Form.Control type="date" style={{ maxWidth: 100 }} />
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
                          .format("DD / MM / YYYY")}
                    </td>
                    <td>
                      {item?.startTime &&
                        moment.parseZone(item?.startTime).format("HH:ss")}
                    </td>
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
      )}
      {/* >>>>>>>>>>>>> popup <<<<<<<<<<<<<<< */}
      <PopUpConfirm
        text1="ຖ່ານຕ້ອງການປະຕິເສດບໍ?"
        text2={select?.clientPhone}
        open={popup?.delete}
        onClose={() => setPopup((prev) => ({ ...prev, delete: false }))}
        onSubmit={onSubmitReject}
      />
      <PopUpConfirm
        text1="ຍືນຍັນການຈອງ"
        text2={select?.clientPhone}
        open={popup?.confirm}
        onClose={() => setPopup((prev) => ({ ...prev, confirm: false }))}
        onSubmit={onSubmitConfirm}
      />
      <PopUpReservationAdd
        open={popup?.add}
        onClose={() => setPopup((prev) => ({ ...prev, add: false }))}
        onSubmit={async (e) => {
          // alert(JSON.stringify(e));
          await addReservation(e);
          getData();
          setPopup((prev) => ({ ...prev, add: false }));
        }}
      />
      <PopUpReservationDetail
        open={popup?.detail}
        onClose={() => setPopup((prev) => ({ ...prev, detail: false }))}
        data={select}
      />
    </div>
  );
}
