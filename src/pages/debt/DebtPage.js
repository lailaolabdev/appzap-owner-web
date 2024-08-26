import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Form,
  Modal,
  Card,
  Pagination,
  Breadcrumb,
  Tab,
  Tabs,
  Spinner,
} from "react-bootstrap";
import { Formik } from "formik";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { getBanners } from "../../services/banner";
import Upload from "../../components/Upload";
import { IoBeerOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { getBillFarks } from "../../services/fark";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import PopUpDetaillBillFark from "../../components/popup/PopUpDetaillBillFark";
import { convertBillFarkStatus } from "../../helpers/convertBillFarkStatus";

export default function DebtPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  let limitData = 50;
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState();
  const [searchCode, setSearchCode] = useState("");
  const [billFarkData, setBillFarkData] = useState();
  const [selectBillFark, setSelectBillFark] = useState();
  const [popup, setPopup] = useState();
  console.log("totalPagination", totalPagination);
  // store
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    getData();
  }, []);

  // useEffect
  useEffect(() => {
    getData();
  }, [pagination]);
  // function
  const getData = async () => {
    setIsLoading(true);
    try {
      const { DATA, TOKEN } = await getLocalData();
      let findby = "?";

      if (searchCode) {
        findby += `code=${searchCode}&`;
      }
      findby += `skip=${(pagination - 1) * limitData}&`;
      findby += `limit=${limitData}&`;
      findby += `storeId=${storeDetail?._id}`;
      const data = await getBillFarks(findby, TOKEN);
      setBillFarkData(data?.data);
      // console.log(data);
      setTotalPagination(Math.ceil(data?.total / limitData));
      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
    }
  };
  return (
    <>
      <div style={{ padding: 20 }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("debt_deposit")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("debt_list")}</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="billDebt-list">
          <Tab
            eventKey="billDebt-list"
            title={t("debt_list_all")}
            style={{ paddingTop: 20 }}
          >
            <div style={{ display: "flex", gap: 10, padding: "10px 0" }}>
              <Form.Control
                style={{ maxWidth: 220 }}
                placeholder={t("search_bill_code")}
                onChange={(e) => setSearchCode(e.target.value)}
              />
              <Button variant="primary" onClick={getData}>
                {t("search")}
              </Button>
            </div>

            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <span>
                  <IoBeerOutline /> {t("debt_list")}
                </span>
                <Button
                  variant="dark"
                  bg="dark"
                  onClick={() => navigate("/debt/create")}
                >
                  <MdAssignmentAdd /> {t("debt_create")}
                </Button>
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>#</th>
                    <th>{t("bill_no")}</th>
                    {/* <th>{t('order_anount')}</th> */}
                    <th>{t("status")}</th>
                    <th>{t("date_add")}</th>
                    <th>{t("expired")}</th>
                    <th>{t("payment_date_debt")}</th>
                  </tr>
                  {isLoading ? (
                    <td colSpan={9} style={{ textAlign: "center" }}>
                      <Spinner animation="border" variant="warning" />
                    </td>
                  ) : (
                    billFarkData?.map((e, i) => (
                      <tr
                        onClick={() => {
                          setPopup({ PopUpDetaillBillFark: true });
                          setSelectBillFark(e);
                        }}
                      >
                        <td style={{ textAlign: "start" }}>
                          {(pagination - 1) * limitData + i + 1}
                        </td>
                        <td style={{ textAlign: "start" }}>{e?.code}</td>
                        {/* <td style={{ textAlign: "start" }}>0</td> */}
                        <td style={{ textAlign: "start" }}>
                          <div>
                            {t ? convertBillFarkStatus(e?.stockStatus, t) : ""}
                          </div>
                        </td>
                        <td style={{ textAlign: "start" }}>
                          {moment(e?.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td style={{ textAlign: "start" }}>
                          {moment(e?.endDate).format("DD/MM/YYYY")}
                        </td>
                        <td style={{ textAlign: "start" }}>
                          {e?.outStockDate
                            ? moment(e?.outStockDate).format("DD/MM/YYYY")
                            : t("avaliable")}
                        </td>
                      </tr>
                    ))
                  )}
                </table>
              </Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  bottom: 20,
                }}
              >
                <ReactPaginate
                  previousLabel={
                    <span className="glyphicon glyphicon-chevron-left">{`ກ່ອນໜ້າ`}</span>
                  }
                  nextLabel={
                    <span className="glyphicon glyphicon-chevron-right">{`ຕໍ່ໄປ`}</span>
                  }
                  breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
                  breakClassName={"break-me"}
                  pageCount={totalPagination} // Replace with the actual number of pages
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={(e) => {
                    // console.log(e);
                    setPagination(e?.selected + 1);
                  }}
                  containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  activeClassName={"active"}
                  previousClassName={"page-item"}
                  nextClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                />
              </div>
            </Card>
          </Tab>
          <Tab
            disabled
            eventKey="currency-list"
            title={t("debt_list_history")}
            style={{ paddingTop: 20 }}
          >
            <div style={{ display: "flex", gap: 10, padding: "10px 0" }}>
              <Form.Control
                style={{ maxWidth: 220 }}
                placeholder={t("search_bill_code")}
              />
              <Button variant="primary">{t("search")}</Button>
            </div>

            <Card border="secondary" bg="light" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                <IoBeerOutline /> {t("deposit_history")}
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>#</th>
                    <th>{t("bill_no")}</th>
                    <th>{t("order_anount")}</th>
                    <th>{t("status")}</th>
                    <th>{t("date_add")}</th>
                    <th>{t("expired")}</th>
                    <th>{t("date_pick_up")}</th>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "start" }}>1</td>
                    <td style={{ textAlign: "start" }}>1</td>
                    <td style={{ textAlign: "start" }}>1</td>
                    <td style={{ textAlign: "start" }}>
                      <div>
                        <Button
                          variant="dark"
                          bg="dark"
                          disabled
                          style={{ backgroundColor: "green" }}
                        >
                          {t("deposit")}
                        </Button>
                      </div>
                    </td>
                    <td style={{ textAlign: "start" }}>1</td>
                    <td style={{ textAlign: "start" }}>1</td>
                    <td style={{ textAlign: "start" }}>1</td>
                  </tr>
                </table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>
      <PopUpDetaillBillFark
        open={popup?.PopUpDetaillBillFark}
        onClose={() => {
          setPopup();
          setSelectBillFark();
        }}
        billFarkData={selectBillFark}
        callback={() => {
          setPopup();
          setSelectBillFark();
          getData();
        }}
      />
    </>
  );
}
