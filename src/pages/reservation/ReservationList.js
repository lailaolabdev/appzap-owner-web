import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import moment from "moment";
import { COLOR_APP } from "../../constants";
import { getLocalData } from "../../constants/api";
import AnimationLoading from "../../constants/loading";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import PopUpAddReservation from "../../components/popup/PopUpAddReservation";
// services
import {
  addReservation,
  getReservation,
  updateReservation,
} from "../../services/reservation";
// popup
import PopUpConfirm from "../../components/popup/PopUpConfirm";
import ButtonTab from "../../components/button/ButtonTab";
import ButtonManamentReservation from "../../components/button/ButtonManamentReservation";

// ---------------------------------------------------------------------------------------------------------- //
export default function ReservationList() {
  const { history, location, match } = useReactRouter();
  const _limit = match.params.limit;
  const _page = match.params.page;
  const [isLoading, setIsLoading] = useState(false);

  //   state
  const [reservationsData, setReservationsData] = useState();
  const [select, setSelect] = useState();
  const [popup, setPopup] = useState({
    delete: false,
    add: false,
    confirm: false,
    edit: false,
  });

  // functions
  const onReject = (select) => {
    setPopup((prev) => ({ ...prev, delete: true }));
    setSelect(select);
  };
  const onSubmitReject = async () => {
    updateReservation({ status: "CANCEL" }, select?._id).then(() => {
      setPopup((prev) => ({ ...prev, delete: false }));
      getData();
    });
  };
  const onConfirm = (select) => {
    setPopup((prev) => ({ ...prev, confirm: true }));
    setSelect(select);
  };
  const onSubmitConfirm = async () => {
    updateReservation({ status: "STAFF_CONFIRM" }, select?._id).then(() => {
      setPopup((prev) => ({ ...prev, confirm: false }));
      getData();
    });
  };
  const getData = async () => {
    const _localData = await getLocalData();
    const storeId = _localData?.DATA?.storeId;
    console.log("_localData", _localData);
    getReservation(storeId).then((e) => {
      setReservationsData(e);
    });
  };
  // useEffect
  useEffect(() => {
    getData();
  }, []);

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
              <ButtonTab active>ລາຍການທັງໝົດ</ButtonTab>
              <ButtonTab>ລາຍການທີ່ລໍຖ້າອະນຸມັດ</ButtonTab>
              <ButtonTab>ລາຍການທີ່ອະນຸມັດ</ButtonTab>
              <ButtonTab>ປະຫວັດການຈອງ</ButtonTab>
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
                  <th style={{ color: COLOR_APP }}>ຈັດການ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reservationsData?.map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #EBEBEB" }}>
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
                    <td></td>
                    <td>
                      <ButtonManamentReservation status={item?.status} />
                    </td>
                    <td>
                      <div>00</div>
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
      <PopUpAddReservation
        open={popup?.add}
        onClose={() => setPopup((prev) => ({ ...prev, add: false }))}
        onSubmit={async (e) => {
          alert(JSON.stringify(e));
          await addReservation(e);
          getData();
          setPopup((prev) => ({ ...prev, add: false }));
        }}
      />
    </div>
  );
}

