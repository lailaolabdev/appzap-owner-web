import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import PopUpAddPrinter from "../../components/popup/PopUpAddPrinter";
import { COLOR_APP } from "../../constants";
import { addPrinter, getPrinters } from "../../services/printer";
import { useStore } from "../../store/useStore";

export default function PrinterList() {
  const navigate = useNavigate();

  // state
  const [popup, setPopup] = useState({ add: false });
  const [printers, setPrinters] = useState();

  const { storeDetail } = useStore();

  const handleAddPrinter = async (value) => {
    const data = await addPrinter(value);
    getData();
    setPopup();
  };

  const getData = async () => {
    let findby = "?";
    findby += `storeId=${storeDetail?._id}`;
    const data = await getPrinters(findby);
    setPrinters(data);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div style={{ padding: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>ປິນເຕີ້ທັງໝົດ ({printers?.length})</div>
          <ButtonPrimary
            style={{ color: "white" }}
            onClick={() => setPopup({ add: true })}
          >
            ເພີ່ມປິນເຕີ້
          </ButtonPrimary>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <ButtonPrimary
            style={{ color: "white" }}
            onClick={() => navigate("/printer/counter")}
          >
            ຕັ້ງປິນເຕີເຄົ້າເຕີ້
          </ButtonPrimary>
          <ButtonPrimary
            style={{ color: "white" }}
            onClick={() => navigate("/printer/menu-type")}
          >
            ຕັ້ງປິນປະເພດເມນູ
          </ButtonPrimary>
        </div>
        <div>
          <TableComponent>
            <thead>
              <tr>
                <th>#</th>
                <th>ຊື່ປິນເຕີ້</th>
                <th>ຂະໜາດ</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {printers?.map((e, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{e?.name}</td>
                  <td>{e?.width}</td>
                  <td>{e?.ip}</td>
                </tr>
              ))}
            </tbody>
          </TableComponent>
        </div>
      </div>
      <PopUpAddPrinter
        open={popup?.add}
        onClose={() => setPopup()}
        onSubmit={handleAddPrinter}
      />
    </>
  );
}

const TableComponent = styled("table")({
  width: "100%",
  thead: {
    backgroundColor: COLOR_APP,
    color: "white",
  },
});
