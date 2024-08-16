/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
// import ReactToPrint from "react-to-print";
import { useTranslation } from "react-i18next";
// import { Formik } from "formik";
import { Table, Button, Modal, Pagination } from "react-bootstrap";
import ReactPaginate from "react-paginate";

/**
 * const
 **/
import {
  TITLE_HEADER,
  BODY,
  DIV_NAV,
  USER_KEY,
  URL_PHOTO_AW3,
  USB_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  ETHERNET_PRINTER_PORT,
} from "../../constants/index";

import {
  CATEGORY,
  END_POINT_SEVER,
  getLocalData,
  MENUS,
} from "../../constants/api";
import Loading from "../../components/Loading";
import { json, useNavigate, useParams } from "react-router-dom";
import { getBills } from "../../services/bill";
import { useStore } from "../../store";
import { moneyCurrency } from "../../helpers";

function HistorySale() {
  const params = useParams();
  const navigate = useNavigate();
  const code = params?.code;
  const [billId, setBillId] = useState();
  const tableId = params?.tableId;
  const [isLoading, setIsLoading] = useState(false);
  const [Categorys, setCategorys] = useState();
  const [total, setTotal] = useState();
  const [totalHistoryPrices, setTotalHistoryPrices] = useState();
  const [userData, setUserData] = useState({});

  const [show, setShow] = useState(false);

  const [isPopup, setIsPupup] = useState(false);
  const inputRef = useRef(null); // Create a ref for the input element
  const [dataModale, setDataModale] = useState([]);
  const [historyCafe, setHistoryCafe] = useState([]);

  const [pagination, setPagination] = useState(1);
  const limitData = 20;
  const [totalPagination, setTotalPagination] = useState();

  // console.log("historyCafe" ,historyCafe)

  useEffect(() => {
    // Check if the modal is shown and if the ref is attached to an element
    if (isPopup && inputRef.current) {
      inputRef.current.focus(); // Set focus when the modal is shown
    }
  }, [isPopup]);

  const handleShow = (item) => {
    setShow(true);
    setDataModale(item);
  };

  useEffect(() => {
    _calculateTotal();
  }, [dataModale]);

  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataModale || []) {
      const totalOptionPrice = _data?.totalOptionPrice || 0;
      const itemPrice = _data?.price + totalOptionPrice;
      // _total += _data?.totalPrice || (_data?.quantity * itemPrice);
      _total += _data?.quantity * itemPrice;
    }
    setTotal(_total);
  };

  // console.log("dataModale", dataModale);

  // console.log("historyCafe", historyCafe.orderId);
  // console.log("totalHistoryPrices", totalHistoryPrices);

  const handleClose = () => setShow(false);

  // const TotalPrice = () => {
  //   return dataModale.reduce((currentValue, nextValue) => {
  //     return currentValue + nextValue.price * nextValue.quantity;
  //   }, 0);
  // };

  const { storeDetail } = useStore();

  useEffect(() => {
    const ADMIN = localStorage.getItem(USER_KEY);
    // const ADMIN = profile;
    const _localJson = JSON.parse(ADMIN);
    setUserData(_localJson);
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        getData(_localData?.DATA?.storeId);
      }
    };
    fetchData();
    getHistoryCafe();
  }, []);

  useEffect(() => {
    (async () => {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      findby += `&code=${code}`;
      const data = await getBills(findby);
      setBillId(data?.[0]);
    })();
  }, []);

  const getHistoryCafe = async () => {
    setIsLoading(true);
    try {
      let data = await axios.get(
        END_POINT_SEVER +
          `/v3/bills?skip=${(pagination - 1) * limitData}&limit=${limitData}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );
      let billCount = await axios.get(
        END_POINT_SEVER + `/v3/bills/count/cafe`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );
      setHistoryCafe(data.data);
      setTotalPagination(
        Math.ceil(billCount.data.countCafeHistory / limitData)
      );
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  // console.log("historyCafe", historyCafe);

  const getData = async (id) => {
    await fetch(CATEGORY + `?storeId=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setCategorys(json));
  };

  const { t } = useTranslation();

  return (
    <div>
      <div
        style={{
          display: "flex",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            height: "90vh",
            overflowY: "scroll",
          }}
        >
          <div>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <div className="m-2" style={{ marginBottom: 20 }}>
                  <h5>{t("history_sales")}</h5>
                  <div style={{ flex: 1 }} />
                </div>
                <div style={{ padding: 0 }}>
                  <div style={{ padding: 10 }}>
                    <Table striped hover size="sm" style={{ fontSize: 15 }}>
                      <thead>
                        <tr>
                          <th>ລຳດັບ</th>
                          <th>ລະຫັດສິນຄ້າ</th>
                          <th>ຈຳນວນລາຍການ</th>
                          <th>ລາຄາລວມ</th>
                          <th>ວັນທີ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyCafe
                          .filter((e) => e.saveCafe == true)
                          .map((item, index) => (
                            <tr
                              onClick={() => {
                                handleShow(item.orderId);
                              }}
                              key={index}
                            >
                              <td>
                                {(pagination - 1) * limitData + index + 1}
                              </td>
                              <td>{item.code}</td>
                              <td>{item.orderId.length}</td>
                              <td>{moneyCurrency(item.billAmount)}</td>
                              <td>
                                {moment(item.createdAt).format(
                                  "YYYY-MM-DD, h:mm:ss a"
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
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
                        breakLabel={
                          <Pagination.Item disabled>...</Pagination.Item>
                        }
                        breakClassName={"break-me"}
                        pageCount={totalPagination} // Replace with the actual number of pages
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={(e) => {
                          // console.log("onPageChange",e);
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
                  </div>
                  <Modal show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                      <Modal.Title>{t("menuModal")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {dataModale.length > 0 ? (
                        <Table
                          striped
                          bordered
                          hover
                          size="sm"
                          style={{ fontSize: 15 }}
                        >
                          <thead>
                            <tr>
                              <th>ລຳດັບ</th>
                              <th>ຊື່</th>
                              <th>ຈຳນວນ</th>
                              <th>ລາຄາ</th>
                              <th>ລາຄາລວມ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataModale?.map((item, index) => {
                              // console.log("options", item?.options);

                              const optionsNames =
                                item?.options
                                  ?.map((option) =>
                                    option.quantity > 1
                                      ? `[${option.quantity} x ${option.name}]`
                                      : `[${option.name}]`
                                  )
                                  .join("") || "";
                              const totalOptionPrice =
                                item?.totalOptionPrice || 0;
                              const itemPrice = item?.price + totalOptionPrice;
                              // const itemTotal = item?.totalPrice || (itemPrice * item?.quantity);
                              const itemTotal = itemPrice * item?.quantity;
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <th>
                                    {item.name} {optionsNames}
                                  </th>
                                  <td>{item.quantity}</td>
                                  <td>{moneyCurrency(itemPrice)}</td>
                                  <td>{moneyCurrency(itemTotal)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="my-3 row d-flex justify-content-center">
                          ບໍ່ມີລາຍການ
                        </div>
                      )}

                      {dataModale.length > 0 && (
                        <div className="container my-3 row d-flex justify-content-between">
                          <div>
                            {/* <span>{t("date")} </span>
                          <span>24-07-2024 17:08</span> */}
                          </div>
                          <div>
                            <span>{t("pricesTotal")} </span>
                            <span>
                              {moneyCurrency(total)} {t("nameCurrency")}
                            </span>
                          </div>
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="danger" onClick={handleClose}>
                        {t("close")}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Detail Table */}
        <div
          style={{
            minWidth: 380,
            backgroundColor: "#FFF",
            maxHeight: "90vh",
            borderColor: "black",
            overflowY: "scroll",
            borderWidth: 1,
            paddingLeft: 20,
            paddingTop: 20,
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12 mx-auto">
                <div className="row" style={{ margin: 0 }}></div>
                <div style={{ height: 10 }} />
                <div className="row" style={{ margin: 0 }}>
                  <Button
                    variant="light"
                    className="hover-me"
                    style={{
                      height: 60,
                      marginRight: 15,
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                      fontWeight: "bold",
                      flex: 1,
                    }}
                    onClick={() => navigate(`/home-cafe`)}
                  >
                    {t("product_sales")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistorySale;
