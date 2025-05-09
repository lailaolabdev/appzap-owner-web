import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import PopUpAddPrinter from "../../components/popup/PopUpAddPrinter";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import { addPrinter } from "../../services/printer";
import { useStore } from "../../store/useStore";
import Loading from "../../components/Loading";
import { Form, Spinner } from "react-bootstrap";
import { getCategories, updateCategory } from "../../services/menuCategory";
import { useTranslation } from "react-i18next";

import { useMenuStore } from "../../zustand/menuStore";
import { useStoreStore } from "../../zustand/storeStore";

export default function PrinterMenuType() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // state
  const [popup, setPopup] = useState({ add: false });

  const { printers } = useStore();

  const { menuCategories, isMenuCategoryLoading, getMenuCategories } =
    useMenuStore();
  const { storeDetail } = useStoreStore();
  const [categories, setCategories] = useState([]);

  // function
  const handleChangePrinterMenuCat = async (_id, event) => {
    const storeId = storeDetail?._id;
    const idPinter = event?.target?.value;
    const data = await updateCategory({ printer: idPinter }, _id);
    getMenuCategories(storeId);
    return;
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategories(storeDetail?._id);
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <>
        <div
        className="mb-4 pl-2 pt-3 flex justify-start">
        <button
          className="bg-color-app hover:bg-orange-500 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>
      </div>
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
          <div>
            {t("all_menu_type")} ({categories?.length}) {t("type")}
          </div>
        </div>
        <div>
          <TableComponent>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("image")}</th>
                <th>{t("menu_type_name")}</th>
                <th>{t("note")}</th>
                <th>{t("chose_printer_")}</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((e, i) => (
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
                      <option value="">{t("chose_printer")}</option>
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
