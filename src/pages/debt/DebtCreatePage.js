import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  BLUETOOTH_PRINTER_PORT,
  COLOR_APP,
  COLOR_APP_CANCEL,
  ETHERNET_PRINTER_PORT,
  URL_PHOTO_AW3,
  USB_PRINTER_PORT,
} from "../../constants";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAl } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Form,
  Modal,
  Card,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { Formik } from "formik";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd, MdRefresh } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { getBanners } from "../../services/banner";
import Upload from "../../components/Upload";
import { IoBeerOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import Select, { components } from "react-select";
import {
  createBillFark,
  getBillFarks,
  getMenuFarks,
} from "../../services/fark";

import { createBilldebt, getMenuDebt } from "../../services/debt";

import { useStore } from "../../store";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PopUpAddMenuForBillFark from "../../components/popup/PopUpAddMenuForBillFark";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import axios from "axios";
import BillDebt80 from "../../components/bill/BillDebt80";
import moment from "moment";
import { useTranslation } from "react-i18next";
import printFlutter from "../../helpers/printFlutter";
import { getMembersAll } from "./../../services/member.service";
import { getBillsNolimit } from "../../services/bill";

// let limitData = 100;

export default function DebtCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  const code = params?.code;

  // console.log(state?.key);

  // state
  const [isLoading, setIsLoading] = useState(true);
  const [loanDataList, setLoanDataList] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [totalDataList, setTotalDataList] = useState(0);
  const [backupFormData, setBackupFormData] = useState();
  const [billId, setBillId] = useState();
  const [amount, setAmount] = useState();
  const [menuDebtData, setMenuDebtData] = useState();
  const [popup, setPopup] = useState();
  const [customerName, setCustomerName] = useState();
  const [customerPhone, setCustomerPhone] = useState();
  const [startDate, setStartDate] = useState(
    moment(moment()).format("YYYY-MM-DD")
  );
  const [expirtDate, setExpirtDate] = useState(
    moment(moment()).add(7, "days").format("YYYY-MM-DD")
  );

  const [printCode, setPrintCode] = useState();
  const [membersData, setMembersData] = useState([]);

  // store
  const { storeDetail } = useStore();
  const { printerCounter, printers } = useStore();
  const [bills, setBills] = useState([]);

  // useEffect
  useEffect(() => {
    getMembersData();
    getBillsLits();
  }, []);

  useEffect(() => {
    getData();
  }, [billId]);

  // function
  const getData = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      let findby = "?";
      findby += `storeId=${storeDetail?._id}&`;
      findby += `billDebtId=${billId}`;
      const data = await getMenuDebt(findby, TOKEN);
      setMenuDebtData(data);
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleClickCreateDebt = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      const _body = {
        customerName: customerName,
        customerPhone: customerPhone,
        billId: billId,
        amount: amount,
        status: "DEBT",
        startDate: startDate,
        endDate: expirtDate,
        storeId: DATA?.storeId,
      };
      const data = await createBilldebt(_body, TOKEN);
      if (data.error) {
        errorAdd(`${t("save_fail")}`);
        return;
      }
      setPrintCode(data.code);
      // await onPrintBillFark();
      navigate("/debt");
      successAdd(`${t("save_success")}`);
    } catch (err) {
      console.log(err);
    }
  };

  const getMembersData = async () => {
    setIsLoading(true);
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      // findby += `skip=${(pagination - 1) * limitData}&`;
      // findby += `limit=${limitData}&`;
      const _data = await getMembersAll(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("err", err);
    }
  };
  const getBillsLits = async () => {
    try {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      // findby += `&code=${code}`;
      const data = await getBillsNolimit(findby);
      // console.log({ data });
      if (data.error) throw new Error("error");
      setBills(data);
    } catch (err) {
      console.log("err", err);
    }
  };

  const options = membersData.map((data) => {
    return {
      id: data?._id,
      value: data?.name,
      label: data?.phone,
      tel: data?.phone,
    };
  });

  const optionsBills = bills.map((data) => {
    return {
      id: data?._id,
      value: data?.code,
      label: data?.code,
    };
  });

  return (
    <>
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "calc(100% - 50%)",
            height: "calc(100%)",
            boxShadow: "0px 2px 8px 2px rgba(0,0,0,0.05)",
            borderBottom: "2px solid rgba(0,0,0,0.05)",
            borderRadius: 10,
            marginTop: "15px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              textAlign: "center",
              backgroundColor: COLOR_APP,
              padding: 20,
            }}
          >
            {t("debt_create")}
          </div>
          <div
            style={{
              padding: "0 30px 30px 30px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              marginBottom: "200px",
              marginTop: "20px",
            }}
          >
            <Form.Label>
              {t("ctm_tel")} <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <BoxInput>
              <div className="debt-input">
                <Select
                  options={options}
                  placeholder={t("ctm_tel")}
                  onChange={(e) => {
                    setCustomerPhone(e.tel);
                    setCustomerName(e.value);
                  }}
                />
              </div>
              <div className="debt-btn-group">
                <button
                  className="btn btn-primary"
                  onClick={() => getMembersData()}
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <MdRefresh />
                  )}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={
                    () => window.open("/create/members", "_blank").focus()
                    // navigate("/reports/members-report/create-member", "_blank", {
                    //   state: { key: "create-debt" },
                    // })
                  }
                >
                  ເພີ່ມໃໝ່
                </button>
              </div>
            </BoxInput>

            <Form.Label>{t("customer_name")}</Form.Label>
            <Form.Control
              placeholder={t("customer_name")}
              value={customerName}
              onChange={(e) => setCustomerPhone(e?.target.value)}
            />
            <Form.Label>
              {t("money_amount")} <span style={{ color: "red" }}>*</span>
            </Form.Label>

            <Form.Control
              placeholder={t("money_amount")}
              value={amount}
              onChange={(e) => setAmount(e?.target.value)}
            />
            <Form.Label>ລະຫັດບິນ</Form.Label>
            <Select
              options={optionsBills}
              placeholder={t("bills_code")}
              onChange={(e) => {
                setBillId(e.id);
              }}
            />

            <Form.Label>{t("start_date_debt")}</Form.Label>
            <Form.Control
              placeholder={t("exp_date")}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e?.target.value)}
            />
            <Form.Label>{t("end_date_debt")}</Form.Label>
            <Form.Control
              placeholder={t("exp_date")}
              type="date"
              value={expirtDate}
              onChange={(e) => setExpirtDate(e?.target.value)}
            />

            <Button
              style={{ width: "100%", height: 60, marginTop: 25 }}
              onClick={() => handleClickCreateDebt()}
            >
              {t("save_print")}
            </Button>
          </div>
        </div>
      </div>
      <PopUpAddMenuForBillFark
        open={popup?.PopUpAddMenuForBillFark}
        onClose={() => setPopup()}
        callback={() => {
          getData();
        }}
      />
    </>
  );
}

const BoxInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  gap: 5px;

  .debt-input {
    width: calc(100% - 23%);
  }
  .debt-btn-group {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    .debt-input {
      width: calc(100% - 40%);
    }
  }
`;
