import React, { useState, useEffect, useCallback } from "react";
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
  InputGroup,
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
import PaginationAppzap from "../../constants/PaginationAppzap";
import { getCountStocksAll, getStocksAll } from "../../services/stocks";
import LoadingAppzap from "../../components/LoadingAppzap";
import { MdSearch } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import PopUpChooseCategoryTypeComponent from "../../components/popup/PopUpChooseCategoryTypeComponent";
import { useTranslation } from "react-i18next";

// ------------------------------------------------------------------------------- //

export default function MenuList() {
  const { t } = useTranslation();
  // state
  const [popup, setPopup] = useState();
  const [popAddStock, setPopAddStock] = useState(false);
  const [popMinusStock, setPopMinusStock] = useState(false);
  const [isPreviewPage, setIsPreviewPage] = useState(false);

  const [select, setSelect] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line
  const [loadStatus, setLoadStatus] = useState("");
  const [stocks, setStocks] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  // eslint-disable-next-line
  const [categorys, setCategorys] = useState([]);
  const [storeData, setStoreData] = useState();
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("All");
  const [selectCategories, setSelectCategories] = useState("");
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [prepaDatas, setPrepaDatas] = useState([]);
  const _localData = getLocalData();

  const rowsPerPage = 50;
  const [page, setPage] = useState(0);
  const pageAll = totalStock > 0 ? Math.ceil(totalStock / rowsPerPage) : 1;
  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  useEffect(() => {

    const getData = async () => {
      getCategory();
    };
    getData();
  }, [_localData.DATA?.storeId]);

  // eslint-disable-next-line
  const getCategory = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        setIsLoading(true);
        const res = await axios.get(
          `${END_POINT_SEVER}/v3/stock-categories?storeId=${DATA?.storeId}&isDeleted=false`
        );
        if (res.status < 300) {
          setLoadStatus("SUCCESS");
          setCategorys(res.data);
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
      errorAdd(`${t('delete_fail')}`);
    }
  };

  const getStock = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        setStoreData(_localData?.DATA);
        let findby = "?";
        findby += `storeId=${_localData?.DATA?.storeId}&`;
        findby += `skip=${page * rowsPerPage}&`;
        findby += `limit=${rowsPerPage}&`;
        findby += `search=${filterName}&`;
        findby += `stockCategoryId=${selectCategories}&`;
        const res = await getStocksAll(findby);
        if (res.status === 200) {
          setStocks(res?.data);
          setIsLoading(true);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const getCountStocks = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        let findby = "?";
        findby += `storeId=${_localData?.DATA?.storeId}&`;
        findby += `search=${filterName}&`;
        findby += `stockCategoryId=${selectCategories}&`;
        const res = await getCountStocksAll(findby);
        if (res.status === 200) {
          setTotalStock(res?.data);
        }
      }
    } catch (err) {
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

    console.log("sorted:======>", sorted);
    setSortedData(sorted);
  }, [stocks, sortOrder]);

  // ------------------------------------------------------------ //

  useEffect(() => {
    const getData = async () => {
      // getCategory();
      getStoreData();
    };
    getData();
  }, []);

  useEffect(() => {
    getStock();
    getCountStocks();
  }, [page, filterName, selectCategories]);

  console.log("selectCategories:---->", selectCategories);

  // ------------------------------------------------------------ //

  return (
    <div style={BODY}>
      <NavList ActiveKey="/settingStore/stock" />
      <div
        style={{
          display: "flex",
          // gridTemplateColumns: "1fr 90px 200px"
          gap: 10,
          padding: "10px 0",
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <Form.Control
            placeholder={t('member_name')}
            value={filterName}
            onChange={(e) => setFilterName(e?.target?.value)}
          />
          <Button
            variant="primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <FaSearch /> {t('search')}
          </Button>
        </div>
        <Button
          variant="outline-primary"
          onClick={() => setPopup({ PopUpChooseCategoryTypeComponent: true })}
        >
          {t('chose_type')}
        </Button>
        <select
          className="btn btn-outline-primary"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="All">{t('arranged')}</option>
          <option value="asc">{t('ascend')}</option>
          <option value="desc">{t('descend')}</option>
        </select>
        <div style={{ flex: 1 }} />
        <Button onClick={() => setPopup({ PopUpCreateStock: true })}>
          {t('create_stock')}
        </Button>
        <Button
          variant="success"
          onClick={() => setPopup({ PopUpPreViewsPage: true })}
        >
          Print
        </Button>
      </div>
      <div>
        <div style={{ overflow: "auto", backgroundColor: "#fff" }}>
          {isLoading ? (
            <LoadingAppzap />
          ) : (
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col" style={{ width: 50 }}>
                    <Form.Check
                      onClick={() => onSelectStocksAll()}
                      label={t('no')}
                      id={t('no')}
                    />
                  </th>
                  <th scope="col" style={{ textAlign: "start" }}>
                    {t('product_name')}
                  </th>
                  <th scope="col">{t('product_type')}</th>
                  <th scope="col">{t('stock_amount')}</th>
                  <th scope="col" style={{ textAlign: "end" }}>
                    {t('manage_data')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((data, index) => {
                  return (
                    <tr>
                      <td>
                        <div style={{ width: 30 }}>
                          {isSelectAll ? (
                            <Form.Check
                              checked={true}
                              label={page * rowsPerPage + index + 1}
                              readOnly
                            />
                          ) : (
                            <Form.Check
                              type="checkbox"
                              id={page * rowsPerPage + index + 1}
                              onChange={() => onSelectSigleStoks(data)}
                              label={page * rowsPerPage + index + 1}
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
                            justifyContent: "flex-end",
                            textAlign: "end",
                          }}
                        >
                          <ButtonPrimary
                            onClick={() => {
                              setSelect(data);
                              setPopup({ PopUpMinusStock: true });
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
                              setPopup({ PopUpAddStock: true });
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
                              setPopup({ PopUpConfirmDeletion: true });
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
          )}
        </div>
        <PaginationAppzap
          rowsPerPage={rowsPerPage}
          page={page}
          pageAll={pageAll}
          onPageChange={handleChangePage}
        />
      </div>
      {/* >>>>>>>>>>> popup >>>>>>>>>>>>>>>> */}

      <PopUpPreViewsPage
        onClose={() => setPopup()}
        open={popup?.PopUpPreViewsPage}
        datas={prepaDatas}
        storeData={storeData}
      />

      <PopUpAddStock
        open={popup?.PopUpAddStock}
        onClose={() => setPopup()}
        data={select}
        callback={() => getStock()}
      />
      <PopUpMinusStock
        open={popup?.PopUpMinusStock}
        onClose={() => setPopup()}
        data={select}
        callback={() => getStock()}
      />
      <PopUpCreateStock
        open={popup?.PopUpCreateStock}
        onClose={() => setPopup()}
        callback={() => getStock()}
      />
      <PopUpConfirmDeletion
        open={popup?.PopUpConfirmDeletion}
        text={select?.name}
        onClose={() => setPopup()}
        onSubmit={async () => {
          deleteStock(select).then(() => {
            getStock();
            setPopup();
          });
        }}
      />
      <PopUpChooseCategoryTypeComponent
        open={popup?.PopUpChooseCategoryTypeComponent}
        onClose={() => setPopup()}
        categoryData={categorys}
        setSelectedCategory={(_array) => {
          let data = _array.join("||");
          setSelectCategories(data);
        }}
      />

      {/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
    </div>
  );
}
