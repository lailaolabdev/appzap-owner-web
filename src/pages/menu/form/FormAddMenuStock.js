import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { PRESIGNED_URL } from "../../../constants/api";
import { getLocalData, END_POINT_SEVER_TABLE_MENU } from "../../../constants/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleRight,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import PopUpAddMenuStocks from "../components/popup/PopUpAddMenuStocks";
import PopUpEditMenuStocks from "../components/popup/PopUpEditMenuStocks";
import { getHeaders } from "../../../services/auth";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ---------------------------------------------- //
export default function FormAddMenuStock() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  // state
  const [popAddMenuStocks, setPopAddMenuStocks] = useState(false);
  const [popEditMenuStocks, setPopEditMenuStocks] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [menuOne, setMenuOne] = useState({});
  const [Categorys, setCategorys] = useState();
  const [namePhoto, setNamePhoto] = useState("");
  const [select, setSelect] = useState();
  const [editSelect, setEditSelect] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState("");
  const [menuStocks, setMenuStocks] = useState([]);
  const [menuStocksForShow, setMenuStocksForShow] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [file, setFile] = useState();
  const [imageLoading, setImageLoading] = useState("");

  const handleUpload = async (event) => {
    // setImageLoading("");
    try {
      setFile(event.target.files[0]);
      let fileData = event.target.files[0];
      const responseUrl = await axios({
        method: "post",
        url: PRESIGNED_URL,
        data: {
          name: event.target.files[0].type,
        },
      });
      setNamePhoto(responseUrl.data);
      let afterUpload = await axios({
        method: "put",
        url: responseUrl.data.url,
        data: fileData,
        headers: {
          "Content-Type": " file/*; image/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setImageLoading(percentCompleted);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const ImageThumb = ({ image }) => {
    return (
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
        style={{
          borderRadius: "10%",
          height: 200,
          width: 200,
        }}
      />
    );
  };
  // functions
  const onSubmit = async () => {
    setIsSubmit(true);
    const headers = await getHeaders();
    const _localData = await getLocalData();
    if (headers) {
      const res = await axios.put(
        `${END_POINT_SEVER_TABLE_MENU}/v3/menu-and-menu-stock/update`,
        {
          id: id,
          data: {
            menuStock: [
              ...menuStocks.map((e) => ({
                stockId: e.stockId,
                amount: e.amount,
              })),
            ],
            storeId: _localData?.DATA?.storeId,
          },
        },
        { headers }
      );
      if (res.status < 300) {
        navigate(
          `/settingStore/menu/limit/40/page/1/${_localData?.DATA?.storeId}`,
          { replace: true }
        );
      }
    }
    setIsSubmit(false);
  };

  const handleAddMenuStock = async (val) => {
    try {
      const headers = await getHeaders();
      const _localData = await getLocalData();
      if (headers) {
        const res = await axios.put(
          `${END_POINT_SEVER_TABLE_MENU}/v3/menu-and-menu-stock/update`,
          {
            id: id,
            data: {
              menuStock: [
                {
                  stockId: val?._id,
                  amount: val?.quantity,
                },
              ],
              storeId: _localData?.DATA?.storeId,
            },
          },
          { headers }
        );
        if (res.status < 300) {
          getMenuStock(id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMenuStock = async (id) => {
    try {
      const headers = await getHeaders();
      const _localData = await getLocalData();
      if (headers) {
        const res = await axios.delete(
          `${END_POINT_SEVER_TABLE_MENU}/v3/menu-stock/delete/${id}`,
          { headers }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStock = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER_TABLE_MENU}/v3/stocks?storeId=${_localData?.DATA?.storeId}&isDeleted=false&limit=1000`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setStocks(data?.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };
  const getMenuStock = async (id) => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER_TABLE_MENU}/v3/menu-stocks?menuId=${id}`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setMenuStocks([
            ...data.data.map((e) => {
              const st = stocks.find((e2) => e2?._id === e.stockId?._id);
              return {
                ...e,
                name: st?.name || "-",
                stockCategoryId: st?.stockCategoryId,
              };
            }),
          ]);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const getMenuOne = async (id) => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(`${END_POINT_SEVER_TABLE_MENU}/v3/menu/${id}`);
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setMenuOne(data.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };
  // ------------------------------------------------------------ //

  useEffect(() => {
    const getData = async () => {
      // getCategory();
      await getMenuOne(id);
      await getStock();
    };
    getData();
  }, []);
  useEffect(() => {
    const getData = async () => {
      getMenuStock(id);
    };
    getData();
  }, [stocks]);
  // ------------------------------------------------------------ //

  return (
    <div style={{ padding: 10 }}>
      <h2>{menuOne?.name}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <div>
          <div style={{ textAlign: "center" }}>{t('all_stoke')}</div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t('prod_name')}</th>
                  <th scope="col">{t('prod_mode')}</th>
                  {/* <th scope='col'>ສະຖານະ</th> */}
                  <th scope="col">{t('stoke_amount')}</th>
                  <th scope="col">{t('manage_data')}</th>
                </tr>
              </thead>
              <tbody>
                {stocks?.map((data, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data?.name}</td>
                      <td>{data?.stockCategoryId?.name}</td>
                      {/* <td
                              style={{
                                color: data?.isOpened ? "green" : "red",
                              }}>
                              {STATUS_MENU(data?.isOpened)}
                            </td> */}
                      <td
                        style={{
                          color: data?.quantity < 10 ? "red" : "green",
                        }}
                      >
                        {data?.quantity} {data?.unit}
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faAngleDoubleRight}
                          style={{
                            marginLeft: 20,
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelect(data);
                            setPopAddMenuStocks(true);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {isLoading ? <Spinner animation="border" /> : ""}
            </div>
          </div>
        </div>
        <div>
          <div style={{ textAlign: "center" }}>{t('stoke_needed')}</div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t('prod_name')}</th>
                  <th scope="col">{t('prod_mode')}</th>
                  {/* <th scope='col'>ສະຖານະ</th> */}
                  <th scope="col">{t('stoke_amount')}</th>
                  <th scope="col">{t('manage_data')}</th>
                </tr>
              </thead>
              <tbody>
                {menuStocks?.map((data, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data?.name}</td>
                      <td>{data?.stockCategoryId?.name}</td>
                      {/* <td
                              style={{
                                color: data?.isOpened ? "green" : "red",
                              }}>
                              {STATUS_MENU(data?.isOpened)}
                            </td> */}
                      <td
                        style={{
                          color: data?.amount < 10 ? "red" : "green",
                        }}
                      >
                        {data?.amount}
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{
                            marginLeft: 20,
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setMenuStocks((prev) => [
                              ...prev.filter((e, i) => i != index),
                            ]);
                            if (data?._id) {
                              handleDeleteMenuStock(data?._id);
                            }
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faPen}
                          style={{
                            marginLeft: 20,
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setEditSelect({
                              _id: data?.stockId,
                              stockCategoryId: data?.stockCategoryId?.name,
                              name: data?.name,
                              quantity: data?.amount,
                            });
                            setPopEditMenuStocks(true);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* >>>>>>>>>>> popup >>>>>>>>>>>>>>>> */}
      <PopUpAddMenuStocks
        open={popAddMenuStocks}
        data={select}
        onClose={() => setPopAddMenuStocks(false)}
        onSubmit={(val) => {
          handleAddMenuStock(val);
        }}
      />
      <PopUpEditMenuStocks
        open={popEditMenuStocks}
        data={editSelect}
        onClose={() => setPopEditMenuStocks(false)}
        onSubmit={(val) => {
          handleAddMenuStock(val);
        }}
      />
      {/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
    </div>
  );
}
