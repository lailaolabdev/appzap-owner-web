import React, { useState, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { PRESIGNED_URL } from "../../../constants/api";
import {
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../../constants/api";
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
import { get, update } from "lodash";
import { updateMenuStockAmount } from "../../../services/menu";
import { moneyCurrency } from "../../../helpers";
import { useStoreStore } from "../../../zustand/storeStore";
import Swal from "sweetalert2";
import {
  deleteStockMenu,
  getStocksAll,
  getStocksCategory,
} from "../../../services/stocks";
import PopUpChooseCategoryTypeComponent from "../../../components/popup/PopUpChooseCategoryTypeComponent";

// ---------------------------------------------- //
export default function FormAddMenuStock() {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const { id } = useParams();
  const navigate = useNavigate();
  // state
  const [popAddMenuStocks, setPopAddMenuStocks] = useState(false);
  const [popEditMenuStocks, setPopEditMenuStocks] = useState(false);
  const [popup, setPopup] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [menuOne, setMenuOne] = useState({});
  const [categorys, setCategorys] = useState();
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
  const [selectCategories, setSelectCategories] = useState("");

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

  const updateAmount = async (index, value) => {
    const data = {
      menuStock: [
        {
          stockId: menuStocks[index]?.stockId?._id,
          amount: value,
        },
      ],
      storeId: menuStocks[index]?.stockId?.storeId,
    };
    const res = await updateMenuStockAmount(id, data);
    console.log("res", res);
  };

  const getStocksCategoryData = async (storeId) => {
    try {
      const res = await getStocksCategory(storeId);
      if (res.status === 200) {
        setCategorys(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMenuStock = async (val) => {
    try {
      const data = {
        menuStock: [
          {
            stockId: val?._id,
            amount: 1,
          },
        ],
        storeId: storeDetail?._id,
      };
      const res = await updateMenuStockAmount(id, data);
      if (res.status === 200) {
        getMenuStock(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMenuStock = async (id) => {
    try {
      const res = await deleteStockMenu(id);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: `${t("delete_success")}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStock = async (storeId) => {
    try {
      let findby = "?";
      findby += `storeId=${storeId}&`;
      findby += `stockCategoryId=${selectCategories}&`;
      const res = await getStocksAll(findby);
      if (res.status === 200) {
        setLoadStatus("SUCCESS");
        setStocks(res?.data?.stockData);
      }
      setIsLoading(false);
      // const _localData = await getLocalData();
      // if (_localData) {
      //   setIsLoading(true);
      //   const data = await axios.get(
      //     `${END_POINT_SEVER_TABLE_MENU}/v3/stocks?storeId=${_localData?.DATA?.storeId}&isDeleted=false&limit=1000`
      //   );

      // }
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

  const handleAmountChange = (index, event) => {
    const { name, value } = event.target;
    setMenuStocks((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [name]: value,
      };
      return updatedData;
    });
  };

  const calculateTotalCostPrice = () => {
    return menuStocks.reduce((total, data) => {
      return total + (data?.amount * data?.stockId?.buyPrice || 0);
    }, 0);
  };

  const getMenuOne = async (id) => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${id}`
        );
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
      await getStock(storeDetail?._id);
      await getStocksCategoryData(storeDetail?._id);
    };
    getData();
  }, [selectCategories]);
  useEffect(() => {
    const getData = async () => {
      getMenuStock(id);
      // getStock(storeDetail?._id);
    };
    getData();
  }, [stocks]);
  // ------------------------------------------------------------ //

  return (
    <div style={{ padding: 10 }}>
      <h2 className="mx-3 flex flex-row justify-between text-color-app ">
        {t("menu_name")}
        {" : "}
        {menuOne?.name}
        <Button
          style={{ textWrap: "nowrap", marginTop: "1em" }}
          variant="outline-primary"
          onClick={() => setPopup({ PopUpChooseCategoryTypeComponent: true })}
        >
          {t("chose_type")}
        </Button>
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <div>
          <div style={{ textAlign: "center" }}>{t("all_stoke")}</div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t("prod_name")}</th>
                  <th scope="col">{t("prod_mode")}</th>
                  {/* <th scope='col'>ສະຖານະ</th> */}
                  <th scope="col">{t("stoke_amount")}</th>
                  <th scope="col">{t("manage_data")}</th>
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
                            console.log("data", data);
                            setSelect(data);
                            handleAddMenuStock(data);
                            // setPopAddMenuStocks(true);
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
          <div style={{ textAlign: "center" }}>{t("stoke_needed")}</div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t("prod_name")}</th>
                  <th scope="col">{t("buy_price")}</th>
                  <th scope="col">{t("amount")}</th>
                  <th scope="col">{t("cost_price")}</th>
                  <th scope="col">{t("unit")}</th>
                  <th scope="col">{t("manage_data")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center justify-center">
                      <Spinner animation="border" />
                    </td>
                  </tr>
                ) : (
                  menuStocks?.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data?.name}</td>
                      <td>
                        {moneyCurrency(data?.stockId?.buyPrice)}{" "}
                        {storeDetail?.firstCurrency}
                      </td>
                      {/* <td
                        style={{
                          color: data?.amount < 10 ? "red" : "green",
                        }}
                      >
                        {data?.amount}
                      </td> */}
                      <td style={{ width: 100 }}>
                        <Form.Control
                          type="number"
                          name="amount"
                          onBlur={(e) => updateAmount(index, e.target.value)}
                          onChange={(e) => handleAmountChange(index, e)}
                          value={data?.amount}
                          placeholder="0"
                          className="form-control"
                        />
                      </td>
                      <td>
                        {moneyCurrency(data?.amount * data?.stockId?.buyPrice)}{" "}
                        {storeDetail?.firstCurrency}
                      </td>
                      <td>{data?.stockId?.unit}</td>
                      <td className="justify-center text-center">
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{
                            justifyItems: "center",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setMenuStocks((prev) => [
                              ...prev.filter((e, i) => i !== index),
                            ]);
                            if (data?._id) {
                              handleDeleteMenuStock(data?._id);
                            }
                          }}
                        />
                        {/* <FontAwesomeIcon
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
                        /> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <hr className="mx-3"></hr>
          <div className="mx-3 text-right flex flex-row justify-end text-color-app font-bold text-2xl">
            {t("total_cost_price")}
            {" : "}
            {moneyCurrency(calculateTotalCostPrice())}{" "}
            {storeDetail?.firstCurrency}
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
      <PopUpChooseCategoryTypeComponent
        open={popup?.PopUpChooseCategoryTypeComponent}
        onClose={() => setPopup()}
        categoryData={categorys}
        setSelectedCategory={(_array) => {
          const data = _array.join("||");
          setSelectCategories(data);
        }}
      />
      {/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
    </div>
  );
}
