import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TbEdit } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";

import ButtonPrimary from "../../components/button/ButtonPrimary";
import PopUpAddPrinter from "../../components/popup/PopUpAddPrinter";
import { COLOR_APP } from "../../constants";
import {
  addPrinter,
  updatePrinter,
  deletePrinter,
} from "../../services/printer";
import { useStore } from "../../store/useStore";
import Loading from "../../components/Loading";
import PopUpConfirm from "../../components/popup/PopUpConfirm";
export default function PrinterList() {
  const navigate = useNavigate();

  // state
  const [popup, setPopup] = useState({ add: false });
  const [selectPrinter, setSelectPrinter] = useState();

  // store
  const { isPrintersLoading } = useStore();
  const { getPrintersState, printers } = useStore();

  // function
  const handleAddPrinter = async (value) => {
    
    const data = await addPrinter(value);
    getPrintersState();
    setPopup();
  };
  const handleEditPrinter = async (value) => {
    console.log("value edit printer: ", value)
    const data = await updatePrinter(value, selectPrinter?._id);
    getPrintersState();
    setPopup();
  };
  const handleDeleterinter = async (value) => {
    const data = await deletePrinter(selectPrinter?._id);
    getPrintersState();
    setPopup();
  };

  return (
    <>
      {isPrintersLoading ? <Loading /> : ""}
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
        <div style={{ width: "100%", overflow: "auto" }}>
          <TableComponent>
            <thead>
              <tr>
                <th>#</th>
                <th>ຊື່ປິນເຕີ້</th>
                <th>ຂະໜາດ</th>
                <th>IP</th>
                <th>ຈັດການ</th>
              </tr>
            </thead>
            <tbody>
              {printers?.map((e, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{e?.name}</td>
                  <td>{e?.width}</td>
                  <td>{e?.ip}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <ButtonPrimary
                        style={{ color: "white" }}
                        onClick={() => {
                          setSelectPrinter(e);
                          setPopup({ edit: true });
                        }}
                      >
                        <TbEdit />
                      </ButtonPrimary>
                      <ButtonPrimary
                        style={{ color: "white" }}
                        onClick={() => {
                          setSelectPrinter(e);
                          setPopup({ delete: true });
                        }}
                      >
                        <MdDeleteForever />
                      </ButtonPrimary>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableComponent>
        </div>
      </div>
      {/* popup */}
      <PopUpAddPrinter
        open={popup?.add}
        onClose={() => setPopup()}
        onSubmit={handleAddPrinter}
      />
      <PopUpAddPrinter
        open={popup?.edit}
        value={selectPrinter}
        onClose={() => setPopup()}
        onSubmit={handleEditPrinter}
      />
      <PopUpConfirm
        open={popup?.delete}
        onClose={() => setPopup()}
        text1="ທ່ານຕ້ອງການລົບເຄື່ອງປິນຫຼືບໍ່"
        text2={selectPrinter?.name}
        onSubmit={handleDeleterinter}
      />
    </>
  );
}

const TableComponent = styled("table")({
  width: "100%",
  minWidth: 400,
  thead: {
    backgroundColor: COLOR_APP,
    color: "white",
  },
});
