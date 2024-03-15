import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faTruck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Spinner,
  Form,
  ProgressBar,
  FormControl,
} from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import { getLocalData, END_POINT_SEVER } from "../../constants/api";
import { STATUS_MENU } from "../../helpers";
import PopUpAddStock from "./components/popup/PopUpAddStock";
import PopUpMinusStock from "./components/popup/PopUpMinusStock";
import PopUpCreateStock from "./components/popup/PopUpCreateStock";
import NavList from "./components/NavList";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { getHeaders } from "../../services/auth";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { thousandSeparator } from "../../helpers/thousandSeparator";
import PopUpPreViewsPage from "../../components/popup/PopUpPreViewsPage";

// ------------------------------------------------------------------------------- //

export default function MenuList() {
  // state
  const [popAddStock, setPopAddStock] = useState(false);
  const [popMinusStock, setPopMinusStock] = useState(false);
  const [popCreateStock, setPopCreateStock] = useState(false);
  const [popDeleteStock, setPopDeleteStock] = useState(false);
  const [isPreviewPage, setIsPreviewPage] = useState(false);

  const [select, setSelect] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line
  const [loadStatus, setLoadStatus] = useState("");
  const [stocks, setStocks] = useState([]);
  // eslint-disable-next-line
  const [categorys, setCategorys] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [storeData, setStoreData] = useState();
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("All");
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [prepaDatas, setPrepaDatas] = useState([]);


  // functions

  // eslint-disable-next-line
  const getCategory = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER}/v3/stock-categories?storeId=${_localData.DATA?.storeId}&isDeleted=false`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setCategorys(data.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const deleteStock = async (stock) => {
    try {
      const headers = await getHeaders();
      const _localData = await getLocalData();
      const _export = await axios
        .put(
          `${END_POINT_SEVER}/v3/stock-export`,
          {
            id: stock?._id,
            data: { quantity: stock.quantity },
            storeId: _localData?.DATA?.storeId,
          },
          { headers }
        )
        .then((e) => e)
        .catch((e) => e);
      const data = await axios.delete(
        `${END_POINT_SEVER}/v3/stock/delete/${stock?._id}`,
        {
          headers,
        }
      );
      if (data.status < 300) {
        successAdd(`ລົບ ${stock?.name} ສຳເລັດ`);
      }
    } catch (err) {
      console.log("err:", err);
      errorAdd(`ລົບ ບໍ່ສຳເລັດ`);
    }
  };

  const getStock = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        setStoreData(_localData?.DATA)
        const data = await axios.get(
          `${END_POINT_SEVER}/v3/stocks?storeId=${_localData?.DATA?.storeId}&isDeleted=false`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setStocks(data?.data?.stocks);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  // get shop data
  const getStoreData = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER}/v3/store?id=${_localData?.DATA?.storeId}&isDeleted=false`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setStoreData(data.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };


  // select mutiple stocks
  const onSelectStocksAll = async () => {
    if (isSelectAll) {
      setPrepaDatas([]);
      setIsSelectAll(false);
    } else {
      let _stocksNew = [];
      // console.log("stocks:--new-->", stocks);
      for (var i = 0; i < stocks.length; i++) {
        _stocksNew.push(stocks[i]);
      }
      setPrepaDatas(_stocksNew);
      setIsSelectAll(true);
    }
    return;
  };

  // select single stocks
  const onSelectSigleStoks = (selectedProduct) => {
    const exists = prepaDatas.some(
      (product) => product._id === selectedProduct._id
    );

    if (exists) {
      // If the product is already in the array, remove it
      const filteredProducts = prepaDatas.filter(
        (product) => product._id !== selectedProduct._id
      );
      setPrepaDatas(filteredProducts);
    } else {
      // If the product is not in the array, add it
      const updatedProducts = [...prepaDatas, selectedProduct];
      setPrepaDatas(updatedProducts);
    }
  };
  // console.log("prepaDatas updated666:", prepaDatas);

  // filter sort quantitys stocks
  useEffect(() => {
    let sorted = [];
    if (sortOrder === "asc") {
      sorted = [...stocks].sort((a, b) => a.quantity - b.quantity);
    } else if (sortOrder === "desc") {
      sorted = [...stocks].sort((a, b) => b.quantity - a.quantity);
    } else {
      sorted = [...stocks]; // Default or 'All' case, not sorted
    }
    setSortedData(sorted);
  }, [stocks, sortOrder]);

  // ------------------------------------------------------------ //

  useEffect(() => {
    const getData = async () => {
      // getCategory();
      getStock();
      getStoreData()
    };
    getData();
  }, []);


    console.log("datas:---->", stocks);
 
  // ------------------------------------------------------------ //

  return (
    <div style={BODY}>
      <NavList ActiveKey="/settingStore/stock" />
      <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
        <div
          style={{
            display: "flex",
            // gridTemplateColumns: "1fr 90px 200px"
            gap: 10,
          }}
        >
          <div style={{ width: "100%" }}>
            <label>ຄົ້ນຫາຊື່ສິນຄ້າ</label>
            <Form.Control
              type="text"
              placeholder="ຄົ້ນຫາຊື່..."
              value={filterName}
              onChange={(e) => {
                setFilterName(e.target.value);
              }}
            />
          </div>

          <div style={{ width: 200 }}>
            <label>ຄົ້ນຫາຈຳນວນ</label>
            <select
              className="form-control w-100"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="All">ທັງໝົດ</option>
              <option value="asc">ໜ້ອຍ ຫາ ຫຼາຍ</option>
              <option value="desc">ຫຼາຍ ຫາ ໜ້ອຍ</option>
            </select>
          </div>

          <div />

          <div style={{ width: 300 }}>
            <div style={{ height: 20 }}></div>
            {prepaDatas?.length >= 1 ? (
              <Button
                style={{
                  color: "#ffff",
                  border: 0,
                  width: "100%",
                  marginTop: 13,
                }}
                variant="success"
                onClick={() => setIsPreviewPage(true)}
              >
                Print
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                  width: "100%",
                  marginTop: 13,
                }}
                onClick={() => setPopCreateStock(true)}
              >
                ສ້າງສະຕ໊ອກ
              </Button>
            )}
          </div>
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div
            className="w-100"
            style={{ overflow: "auto", backgroundColor: "#fff" }}
          >
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">
                    <Form.Check
                      onClick={() => onSelectStocksAll()}
                      label={"ລຳດັບ"}
                    />
                  </th>
                  <th scope="col">ຊື່ສິນຄ້າ</th>
                  <th scope="col">ໝວດໝູ່ສິນຄ້າ</th>
                  <th scope="col">ຈຳນວນສະຕ໊ອກ</th>
                  <th scope="col">ຈັດການຂໍ້ມູນ</th>
                </tr>
              </thead>
              <tbody>
                {sortedData
                  ?.filter((e) => e?.name?.includes(filterName))
                  .map((data, index) => {
                    return (
                      <tr>
                        <td>
                          <div style={{ width: 30 }}>
                            {isSelectAll ? (
                              <Form.Check
                                checked={true}
                                label={index + 1}
                                readOnly
                              />
                            ) : (
                              <Form.Check
                                type="checkbox"
                                onChange={() => onSelectSigleStoks(data)}
                                label={index + 1}
                              />
                            )}
                          </div>
                        </td>
                        <td>{data?.name}</td>
                        <td>{data?.stockCategoryId?.name}</td>
                        <td
                          style={{
                            color: data?.quantity < 10 ? "red" : "green",
                            width: 500,
                          }}
                        >
                          {/* <ProgressBar
                            min={1}
                            now={data?.quantity ?? 0}
                            variant={data?.quantity >= 1 ? "success" : "danger"}
                            label={`${thousandSeparator(data?.quantity)} ${
                              data?.unit
                            }`}
                          /> */}

                          {thousandSeparator(data?.quantity)} {data?.unit}
                        </td>
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            padding: 3,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              width: "100%",
                              flexDirection: "end",
                            }}
                          >
                            <ButtonPrimary
                              onClick={() => {
                                setSelect(data);
                                setPopMinusStock(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faMinus}
                                style={{
                                  color: "white",
                                }}
                              />
                            </ButtonPrimary>
                            <ButtonPrimary
                              onClick={() => {
                                setSelect(data);
                                setPopAddStock(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                style={{
                                  color: "white",
                                }}
                              />
                            </ButtonPrimary>
                            <ButtonPrimary
                              onClick={() => {
                                setSelect(data);
                                setPopDeleteStock(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                style={{
                                  color: "white",
                                }}
                              />
                            </ButtonPrimary>
                          </div>
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
      </div>
      {/* >>>>>>>>>>> popup >>>>>>>>>>>>>>>> */}

      <PopUpPreViewsPage
        onClose={() => setIsPreviewPage(false)}
        open={isPreviewPage}
        datas={prepaDatas}
        storeData={storeData}
      />

      <PopUpAddStock
        open={popAddStock}
        onClose={() => setPopAddStock(false)}
        data={select}
        callback={() => getStock()}
      />
      <PopUpMinusStock
        open={popMinusStock}
        onClose={() => setPopMinusStock(false)}
        data={select}
        callback={() => getStock()}
      />
      <PopUpCreateStock
        open={popCreateStock}
        onClose={() => setPopCreateStock(false)}
        callback={() => getStock()}
      />
      <PopUpConfirmDeletion
        open={popDeleteStock}
        text={select?.name}
        onClose={() => setPopDeleteStock(false)}
        onSubmit={async () => {
          deleteStock(select).then(() => {
            getStock();
            setPopDeleteStock(false);
          });
        }}
      />
      {/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
    </div>
  );
}
