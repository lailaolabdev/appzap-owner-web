import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { END_POINT_SEVER } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { getPrinters } from "../../services/printer";
import { useStore } from "../../store/useStore";
import { useTranslation } from "react-i18next";

import { useStoreStore } from "../../zustand/storeStore";

export default function PrinterCounter() {
  const { t } = useTranslation();
  // state
  const [printers, setPrinters] = useState();
  const [selectPrinterCounter, setSelectPrinterCounter] = useState();
  const [printsData, setPrintsData] = useState();

  const {  getPrinterCounterState } = useStore();
  const { storeDetail } = useStoreStore()

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
      setSelectPrinterCounter(data?.data?.[0]);
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
      <Form.Group>
        <Form.Label>
          ພິມບິນໜ້າໂຕະ <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          as="select"
          name="type"
          value={printsData?.BILL}
          onChange={(e) => handleChangePrinterCounter(e)}
        >
          <option value="">{t('chose_printer')}</option>
          {printers?.map((e, i) => (
            <option value={e?._id} key={i}>
              {e?.name} ({e?.ip})
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <br />
      <Form.Group>
        <Form.Label>
          {t('print_bill_history')} <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          as="select"
          name="type"
          value={printsData?.BILL_HISTORY}
          onChange={(e) => handleChangePrinterHistory(e)}
        >
          <option value="">{t('chose_printer')}</option>
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
