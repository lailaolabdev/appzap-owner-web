import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import PopUpAddPrinter from "../../components/popup/PopUpAddPrinter";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import { addPrinter } from "../../services/printer";
import { useStore } from "../../store/useStore";
import Loading from "../../components/Loading";
import { Form } from "react-bootstrap";
import { updateCategory } from "../../services/menuCategory";

import { useMenuStore } from "../../zustand/menuStore";
import { useStoreStore } from "../../zustand/storeStore";

export default function PrinterMenuType() {
  const navigate = useNavigate();

  // state
  const [popup, setPopup] = useState({ add: false });

  const {
    printers
  } = useStore();

  const { menuCategories, getMenuCategories, isMenuCategoryLoading } = useMenuStore();
  const { storeDetail } = useStoreStore()

  // function
  const handleChangePrinterMenuCat = async (_id, event) => {
    const storeId = storeDetail?._id
    const idPinter = event?.target?.value;
    const data = await updateCategory({ printer: idPinter }, _id);
    getMenuCategories(storeId);
    return;
  };

  return (
    <>
      {isMenuCategoryLoading ? <Loading /> : ""}
      <div style={{ padding: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>ປະເພດເມນູທັງໝົດ ({menuCategories?.length}) ປະເພດ</div>
        </div>
        <div>
          <TableComponent>
            <thead>
              <tr>
                <th>#</th>
                <th>ຮູບ</th>
                <th>ຊື່ປະເພດເມນູ</th>
                <th>ໝາຍເຫດ</th>
                <th>ເລືອກປິນເຕີ້</th>
              </tr>
            </thead>
            <tbody>
              {menuCategories?.map((e, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    {e?.image ? (
                      <img
                        src={URL_PHOTO_AW3 + e?.image}
                        alt=""
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                  <td>{e?.name}</td>
                  <td>{e?.note}</td>
                  <td style={{ maxWidth: 20 }}>
                    <Form.Control
                      as="select"
                      name="type"
                      value={e?.printer}
                      onChange={(event) =>
                        handleChangePrinterMenuCat(e?._id, event)
                      }
                    >
                      <option value="">--ເລືອກປິນເຕີ--</option>
                      {printers?.map((e, i) => (
                        <option value={e?._id} key={i}>
                          {e?.name} ({e?.ip})
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableComponent>
        </div>
      </div>
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
