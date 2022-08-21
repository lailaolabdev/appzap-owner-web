import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faTruck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner, Form } from "react-bootstrap";
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

// ------------------------------------------------------------------------------- //

export default function MenuList() {
  // state
  const [popAddStock, setPopAddStock] = useState(false);
  const [popMinusStock, setPopMinusStock] = useState(false);
  const [popCreateStock, setPopCreateStock] = useState(false);
  const [popDeleteStock, setPopDeleteStock] = useState(false);
  const [select, setSelect] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line
  const [loadStatus, setLoadStatus] = useState("");
  const [stocks, setStocks] = useState([]);
  // eslint-disable-next-line
  const [categorys, setCategorys] = useState([]);
  const [filterName, setFilterName] = useState("");

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
      await axios.put(
        `${END_POINT_SEVER}/v3/stock-export`,
        {
          id: stock?._id,
          data: { quantity: stock.quantity },
          storeId: _localData?.DATA?.storeId,
        },
        { headers }
      );
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
      <NavList ActiveKey="/settingStore/stock" />
      <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 190px" }}>
          <Form.Control
            type="text"
            placeholder="ຄົ້ນຫາຊື່..."
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
            }}
          />
          <div />
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => setPopCreateStock(true)}
          >
            ສ້າງສະຕ໊ອກ
          </Button>
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12" style={{ overflow: "auto" }}>
            <table className="table table-hover" style={{ minWidth: 700 }}>
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ຊື່ສິນຄ້າ</th>
                  <th scope="col">ໝວດໝູ່ສິນຄ້າ</th>
                  {/* <th scope='col'>ສະຖານະ</th> */}
                  <th scope="col">ຈຳນວນສະຕ໊ອກ</th>
                  <th scope="col">ຈັດການຂໍ້ມູນ</th>
                </tr>
              </thead>
              <tbody>
                {stocks
                  ?.filter((e) => e?.name?.startsWith(filterName))
                  .map((data, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{data?.name}</td>
                        <td>{data?.stockCategoryId?.name}</td>
                        {/* <td style={{ color: data?.isOpened ? "green" : "red" }}>
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
                          <div style={{ display: "flex", gap: 10 }}>
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
