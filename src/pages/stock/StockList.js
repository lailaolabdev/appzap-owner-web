import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner } from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import { getLocalData, END_POINT_SEVER } from "../../constants/api";
import { STATUS_MENU } from "../../helpers";
import PopUpAddStock from "./components/popup/PopUpAddStock";
import PopUpMinusStock from "./components/popup/PopUpMinusStock";
import PopUpCreateStock from "./components/popup/PopUpCreateStock";
import NavList from "./components/NavList";

// ------------------------------------------------------------------------------- //

export default function MenuList() {
  // state
  const [popAddStock, setPopAddStock] = useState(false);
  const [popMinusStock, setPopMinusStock] = useState(false);
  const [popCreateStock, setPopCreateStock] = useState(false);
  const [select, setSelect] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState("");

  const [stocks, setStocks] = useState([]);
  const [categorys, setCategorys] = useState([]);

  // functions

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
  const getStock = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER}/v3/stocks?storeId=${_localData?.DATA?.storeId}&isDeleted=false`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setStocks(data.data);
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
      getStock();
    };
    getData();
  }, []);
  // ------------------------------------------------------------ //
  return (
    <div style={BODY}>
      <NavList ActiveKey='/settingStore/stock' />
      <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
        <div className='col-sm-12 text-right'>
          <Button
            className='col-sm-2'
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => setPopCreateStock(true)}>
            ສ້າງສະຕ໊ອກ
          </Button>
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className='col-sm-12'>
            <table className='table table-hover'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col'>ຊື່ສິນຄ້າ</th>
                  <th scope='col'>ໝວດໝູ່ສິນຄ້າ</th>
                  <th scope='col'>ສະຖານະ</th>
                  <th scope='col'>ຈຳນວນສະຕ໊ອກ</th>
                  <th scope='col'>ຈັດການຂໍ້ມູນ</th>
                </tr>
              </thead>
              <tbody>
                {stocks?.map((data, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data?.name}</td>
                      <td>{data?.stockCategoryId?.name}</td>
                      <td style={{ color: data?.isOpened ? "green" : "red" }}>
                        {STATUS_MENU(data?.isOpened)}
                      </td>
                      <td
                        style={{
                          color: data?.quantity < 10 ? "red" : "green",
                        }}>
                        {data?.quantity}
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faMinus}
                          style={{
                            marginLeft: 20,
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelect(data);
                            setPopMinusStock(true);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{
                            marginLeft: 20,
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelect(data);
                            setPopAddStock(true);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {isLoading ? <Spinner animation='border' /> : ""}
            </div>
          </div>
        </div>
      </div>
      {/* >>>>>>>>>>> popup >>>>>>>>>>>>>>>> */}
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
      {/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
    </div>
  );
}
