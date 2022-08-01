import React, { useState, useEffect } from "react";
import axios from "axios";
import useReactRouter from "use-react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Nav } from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import { MENUS, getLocalData, END_POINT_SEVER } from "../../constants/api";
import { moneyCurrency, STATUS_MENU } from "../../helpers";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import PopUpAddStock from "./components/popup/PopUpAddStock";
import PopUpMinusStock from "./components/popup/PopUpMinusStock";

// ------------------------------------------------------------------------------- //

export default function MenuList() {
  const { history, match } = useReactRouter();

  // state
  const [popAddStock, setPopAddStock] = useState(false);
  const [popMinusStock, setPopMinusStock] = useState(false);
  const [select, setSelect] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [getIdMenu, setGetIdMenu] = useState();
  const [qtyMenu, setQtyMenu] = useState(0);
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = (id) => {
    setGetIdMenu(id);
    setShow4(true);
  };

  const [getTokken, setgetTokken] = useState();

  // =====> getCategory
  const [Categorys, setCategorys] = useState();
  const [Menus, setMenus] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
        getcategory(_localData?.DATA?.storeId);
        getMenu(_localData?.DATA?.storeId);
      }
    };
    fetchData();
  }, []);
  const getcategory = async (id) => {
    await fetch(
      END_POINT_SEVER + `/v3/categories?storeId=${id}&isDeleted=false`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => setCategorys(json));
  };
  const getMenu = async (id) => {
    await fetch(MENUS + `/?isOpened=true&storeId=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setMenus(json));
  };
  const _menuList = () => {
    history.push(`/settingStore/stock/limit/40/page/1/${match?.params?.id}`);
  };
  const _category = () => {
    history.push(
      `/settingStore/stock/category/limit/40/page/1/${match?.params?.id}`
    );
  };

  // detele menu
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [dateDelete, setdateDelete] = useState("");
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };
  const _confirmeDelete = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const resData = await axios({
        method: "DELETE",
        url: END_POINT_SEVER + `/v3/menu/delete/${dateDelete?.id}`,
        headers: headers,
      });
      if (resData?.data) {
        setMenus(resData?.data);
        handleClose3();
        successAdd("ການລົບຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ການລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };
  // =======>
  // update
  const [show2, setShow2] = useState(false);
  const [dataUpdate, setdataUpdate] = useState("");

  const _updateQtyCategory = async (values) => {
    const resData = await axios({
      method: "PUT",
      url: END_POINT_SEVER + "/v3/menu-stock/update",
      data: {
        id: getIdMenu,
        data: {
          quantity: parseInt(qtyMenu),
        },
      },
    })
      .then(async function (response) {
        handleClose4();
        successAdd("ການເພີ່ມຈຳນວນສຳເລັດ");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(function (error) {
        errorAdd("ການເພີ່ມຈຳນວນບໍ່ສຳເລັດ !");
      });
  };
  return (
    <div style={BODY}>
      <div>
        <Nav variant='tabs' defaultActiveKey='/settingStore/stock'>
          <Nav.Item>
            <Nav.Link
              eventKey='/settingStore/stock'
              onClick={() => _menuList()}>
              ສະຕ໊ອກທັງໝົດ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey='/settingStore/stock/category'
              onClick={() => _category()}>
              ປະເພດສະຕ໊ອກ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey='/settingStore/stock/category'
              onClick={() => _category()}>
              ປະຫວັດສະຕ໊ອກ
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
        <div className='col-sm-12 text-right'>
          <Button
            className='col-sm-2'
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={handleShow}>
            ເພີ່ມສະຕ໊ອກ
          </Button>{" "}
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
                  <th scope='col'>ລາຄາ</th>
                  <th scope='col'>ສະຖານະ</th>
                  <th scope='col'>ຈຳນວນສະຕ໊ອກ</th>
                  <th scope='col'>ຈັດການຂໍ້ມູນ</th>
                </tr>
              </thead>
              <tbody>
                {Menus?.map((data, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data?.name}</td>
                      <td>{data?.categoryId?.name}</td>
                      <td>{moneyCurrency(data?.price)}</td>
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
          </div>
        </div>
      </div>
      {/* >>>>>>>>>>> popup >>>>>>>>>>>>>>>> */}
      <PopUpAddStock
        open={popAddStock}
        onClose={() => setPopAddStock(false)}
        data={select}
      />
      <PopUpMinusStock
        open={popMinusStock}
        onClose={() => setPopMinusStock(false)}
        data={select}
      />
      {/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
      <Modal show={show4} onHide={handleClose4}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <div>ປ້ອນຈຳນວນສີນຄ້າ </div>
            <div style={{ height: 20 }}></div>
            <input
              type='number'
              className='form-control'
              onChange={(e) => setQtyMenu(e?.target?.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='secondary' onClick={handleClose4}>
            ຍົກເລີກ
          </Button>
          <Button
            type='button'
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _updateQtyCategory()}>
            ຢືນຢັນການເພີ່ມ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
