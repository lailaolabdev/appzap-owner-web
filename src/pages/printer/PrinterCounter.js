import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import PopUpAddPrinter from "../../components/popup/PopUpAddPrinter";
import { COLOR_APP } from "../../constants";
import { END_POINT_SEVER } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { addPrinter, getPrinters } from "../../services/printer";
import { useStore } from "../../store/useStore";

export default function PrinterCounter() {
  const navigate = useNavigate();

  // state
  const [popup, setPopup] = useState({ add: false });
  const [printers, setPrinters] = useState();
  const [selectPrinterCounter, setSelectPrinterCounter] = useState();

  const { storeDetail } = useStore();
  const _prints = JSON.parse(selectPrinterCounter?.prints);

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
  }, []);
  return (
    <div>
      <Form.Group>
        <Form.Label>
          ປະເພດປິນເຕີ <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          as="select"
          name="type"
          defaultValue={_prints?.BILL}
          onChange={(e) => handleChangePrinterCounter(e)}
        >
          <option value="">--ເລືອກປິນເຕີ--</option>
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
