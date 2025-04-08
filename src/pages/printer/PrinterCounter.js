import Axios from "axios";
import { Button } from "bootstrap";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { END_POINT_SEVER } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { getPrinters } from "../../services/printer";
import { useStore } from "../../store/useStore";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";

import { useStoreStore } from "../../zustand/storeStore";

export default function PrinterCounter() {
  const { t } = useTranslation();
  let navigate = useNavigate();
  // state
  const [printers, setPrinters] = useState();
  const [selectPrinterCounter, setSelectPrinterCounter] = useState("");
  const [printsData, setPrintsData] = useState();

  const { getPrinterCounterState } = useStore();
  const { storeDetail } = useStoreStore();

  useEffect(() => {
    if (selectPrinterCounter?.prints) {
      const _prints = JSON.parse(selectPrinterCounter?.prints);
      setPrintsData(_prints);
    }
  }, [selectPrinterCounter]);

  const getSelectPrinter = async () => {
    try {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      const data = await Axios.get(`${END_POINT_SEVER}/v3/settings${findby}`);
      let _setting = {};
      if (data?.data) {
        _setting = { ...data?.data?.[0] };
      }

      if (!_setting?.printer) {
        _setting = { ..._setting, printer: "6540c7782fe98cf0bff87433" };
      }
      if (!_setting?.prints) {
        _setting = {
          ..._setting,
          prints: JSON.stringify({
            BILL: "653897d424752d002a311260",
            BILL_HISTORY: "653897d424752d002a311260",
          }),
        };
      }
      setSelectPrinterCounter(_setting);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangePrinterCounter = async (e) => {
    const printerId = e.target.value;
    try {
      const _printerPrev = JSON.parse(selectPrinterCounter?.prints);
      const _printerForUpdate = {
        BILL: printerId,
        BILL_HISTORY: _printerPrev?.BILL_HISTORY,
      };
      const value = {
        id: selectPrinterCounter?._id,
        data: {
          prints: JSON.stringify(_printerForUpdate),
        },
      };
      const data = await Axios.put(
        `${END_POINT_SEVER}/v3/setting/update`,
        value,
        { headers: await getHeaders() }
      );
      getSelectPrinter();
      getPrinterCounterState();
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangePrinterHistory = async (e) => {
    const printerId = e.target.value;
    try {
      const _printerPrev = JSON.parse(selectPrinterCounter?.prints);
      const _printerForUpdate = {
        BILL: _printerPrev?.BILL,
        BILL_HISTORY: printerId,
      };
      const value = {
        id: selectPrinterCounter?._id,
        data: {
          prints: JSON.stringify(_printerForUpdate),
        },
      };
      const data = await Axios.put(
        `${END_POINT_SEVER}/v3/setting/update`,
        value,
        { headers: await getHeaders() }
      );
      getSelectPrinter();
      getPrinterCounterState();
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    let findby = "?";
    findby += `storeId=${storeDetail?._id}`;
    const data = await getPrinters(findby);
    setPrinters(data);
  };
  useEffect(() => {
    getData();
    getSelectPrinter();
    getPrinterCounterState();
  }, []);
  return (
    <div>
      <div
        className="mb-4 pl-2 pt-3 flex justify-start">
        <button
          className="bg-color-app hover:bg-orange-500 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>
      </div>
      <Form.Group style={{ padding: "0 5px" }}>
        <Form.Label>
          {t("print_table_bill")} <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          as="select"
          name="type"
          value={printsData?.BILL}
          onChange={(e) => handleChangePrinterCounter(e)}
        >
          <option value="">{t("chose_printer")}</option>
          {printers?.map((e, i) => (
            <option value={e?._id} key={i}>
              {e?.name} ({e?.ip})
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <br />
      <Form.Group style={{ padding: "0 5px" }}>
        <Form.Label>
          {t("print_bill_history")} <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          as="select"
          name="type"
          value={printsData?.BILL_HISTORY}
          onChange={(e) => handleChangePrinterHistory(e)}
        >
          <option value="">{t("chose_printer")}</option>
          {printers?.map((e, i) => (
            <option value={e?._id} key={i}>
              {e?.name} ({e?.ip})
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </div>
  );
}
