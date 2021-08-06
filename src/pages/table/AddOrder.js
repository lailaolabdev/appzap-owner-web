import React, { useState, useEffect, useRef } from 'react';
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import useReactRouter from "use-react-router";
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './components/ToPrint';


/**
 * const
 **/
import {
  TITLE_HEADER,
  BODY,
  NAV,
  DIV_NAV,
  half_backgroundColor,
  padding,
  PRIMARY_FONT_BLACK,
  BUTTON_EDIT,
  BUTTON_OUTLINE_DANGER,
  BUTTON_DELETE,
  BUTTON_OUTLINE_DARK,
  padding_white,
  USER_KEY,
  ACTIVE_STATUS,
  CANCEL_STATUS,
  DOING_STATUS,
  CHECKOUT_STATUS,
  SERVE_STATUS,
  BUTTON_EDIT_HOVER,
  END_POINT,
  URL_PHOTO_AW3,
} from "../../constants/index";

import { CATEGORY, END_POINT_SEVER, getLocalData, MENUS } from '../../constants/api'
import { getHeaders } from '../../services/auth';

// bills
import { Image } from 'react-bootstrap';
import { STORE } from '../../constants/api'
import profileImage from "../../image/profile.png"

function AddOrder() {
  const { history, location, match } = useReactRouter();
  const componentRef = useRef();
  const tableId = match?.params?.code;
  const code = match?.params?.tableId;
  const [isLoading, setIsLoading] = useState(false)
  const [Categorys, setCategorys] = useState()
  const [Menus, setMenus] = useState()
  const [getTokken, setgetTokken] = useState();
  const [note, setNote] = useState('');
  const [userData, setUserData] = useState({})

  const [selectedMenu, setSelectedMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [allSelectedMenu, setAllSelectedMenu] = useState([]);

  useEffect(() => {
    setAllSelectedMenu(Menus);
  }, [Menus])
  useEffect(() => {
    if (selectedCategory === "All") {
      setAllSelectedMenu(Menus);
    } else {
      let array = Menus && Menus.filter(function (el) {
        return el.category._id == selectedCategory;
      });
      setAllSelectedMenu(array);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData()
      if (_localData) {
        setgetTokken(_localData)
        getData(_localData?.DATA?.storeId)
        getMenu(_localData?.DATA?.storeId)
      }
    }
    fetchData();
    const ADMIN = localStorage.getItem(USER_KEY)
    const _localJson = JSON.parse(ADMIN)
    setUserData(_localJson)
  }, [])
  const getData = async (id) => {
    setIsLoading(true)
    await fetch(CATEGORY + `/?storeId=${id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setCategorys(json));
    setIsLoading(false)
  }
  const getMenu = async (id) => {
    await fetch(MENUS + `/?storeId=${id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setMenus(json));
  }

  const addToCart = (id, name, price) => {
    let allowToAdd = true;
    let itemIndexInSelectedMenu = 0;
    let data = {
      id,
      name,
      quantity: 1,
      price
    };
    if (selectedMenu.length === 0) {
      setSelectedMenu([...selectedMenu, data]);
    } else {
      let thisSelectedMenu = [...selectedMenu];
      for (let index in thisSelectedMenu) {
        // console.log(thisSelectedMenu[index]);
        if (thisSelectedMenu[index].id === id) {
          allowToAdd = false;
          itemIndexInSelectedMenu = index;
        }
      }
      if (allowToAdd) {
        setSelectedMenu([...selectedMenu, data]);
      } else {
        let copySelectedMenu = [...selectedMenu];
        let currentData = copySelectedMenu[itemIndexInSelectedMenu];
        currentData.quantity += 1;
        copySelectedMenu[itemIndexInSelectedMenu] = currentData;
        setSelectedMenu(copySelectedMenu);
      }
    }
  }

  const onRemoveFromCart = (id) => {
    // console.log(selectedMenu)
    let selectedMenuCopied = [...selectedMenu];
    for (let i = 0; i < selectedMenuCopied.length; i++){
      var obj = selectedMenuCopied[i];
      if(obj.id === id){
        selectedMenuCopied.splice(i, 1);
      }
    }
    setSelectedMenu([...selectedMenuCopied]);
  }

  const createOrder = async (data, header) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': header.authorization
      }

      axios.post(END_POINT_SEVER + "/orders", data, {
        headers: headers
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
    } catch (error) {
      console.log(error)
    }
  }
  const openTheTable = async (data, header) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': header.authorization
      }

      axios.post(END_POINT_SEVER + "/opens", data, {
        headers: headers
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
    } catch (error) {
      console.log(error)
    }
  }
  const onSubmit = async () => {
    let header = await getHeaders();
    if (selectedMenu.length != 0) {
      for (let index in selectedMenu) {
        let data = {
          menu: selectedMenu[index].id,
          storeId: userData?.data?.storeId,
          quantity: selectedMenu[index].quantity,
          note: note,
          table_id: code,
          code: tableId,
          customer_nickname: userData?.data?.firstname,
          is_from_website: true
        }
        createOrder(data, header);
      }
      let dataInfo = {
        code: tableId,
        customer_nickname: userData?.data?.firstname
      };
      openTheTable(dataInfo, header);
      document.getElementById('btnPrint').click();
      history.push(`/tables/pagenumber/1/tableid/${tableId}/${userData?.data?.storeId}`);
      // window.open(`/CheckBillOut/${userData?.data?.storeId}/?code=${tableId}`);
    }
  }

  let totalPrice = 0;
  return <div style={TITLE_HEADER}>
    <div style={{ display: 'none' }}>
      <ReactToPrint
        trigger={() => <button id="btnPrint">Print this out!</button>}
        content={() => componentRef.current}
      />
      <div style={{ display: 'none' }}>
        <ComponentToPrint ref={componentRef} note={note} userData={userData} selectedMenu={selectedMenu} tableId={tableId} code={code} />
      </div>
    </div>
    <div style={{ marginTop: -10, paddingTop: 10 }}>
      {/* <CheckBill /> */}
      <div style={DIV_NAV}>
        <Nav
          variant="tabs"
          style={{
            backgroundColor: "#F9F9F9",
            marginTop: -10,
            paddingTop: 10,
          }}
        >
          <Nav.Item>

          </Nav.Item>
          <Nav.Item
            className="ml-auto row mr-5"
            style={{ paddingBottom: "3px" }}
          >
            <Row>
              {" "}
              <div
                className="ml-2 mr-5"
                style={{ fontWeight: "bold", color: "#FB6E3B" }}
              >

              </div>
            </Row>
          </Nav.Item>
        </Nav>
      </div>
      <div
        style={BODY}
        style={{
          display: "flex",
          paddingBottom: 50,
          overflow: "hidden",
        }}
      >
        <div style={{
          width: "60%",
          backgroundColor: "#fff",
          border: 1,
          height: "90vh",
          overflowY: "scroll",
        }}>
          <div class="container">
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label>ເລືອກປະເພດ</label>
                  <select class="form-control" onChange={(e) => setSelectedCategory(e.target.value)} >
                    <option value="All">ທັງໝົດ</option>
                    {
                      Categorys && Categorys.map((data, index) => {
                        return (
                          <option key={index} value={data._id}>{data.name}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              {
                allSelectedMenu && allSelectedMenu.map((data, index) => {
                  return (
                    <div class="col-3" style={{ padding: 5 }} onClick={() => addToCart(data?._id, data?.name, data?.price)}>
                      <img src={URL_PHOTO_AW3 + data?.image} style={{ width: '100%', height: 200, borderRadius: 5 }} />
                      <div style={{
                        backgroundColor: '#000',
                        color: '#FFF',
                        position: 'relative',
                        opacity: 0.5,
                        // top: -10,
                        padding: 10
                      }}>
                        <span>{data?.name}</span>
                        <br />
                        <span>{data?.price}</span>
                      </div>
                    </div>

                  )
                })
              }
            </div>
          </div>
        </div>
        {/* Detail Table */}
        <div
          style={{
            width: "40%",
            backgroundColor: "#FFF",
            maxHeight: "90vh",
            borderColor: "black",
            overflowY: "scroll",
            borderWidth: 1,
            paddingLeft: 20,
            paddingTop: 20,
          }}
        >
          <div class="container">
            <div class="row">
              <div class="col-12">
                <Table responsive class="table">
                  <thead style={{ backgroundColor: "#F1F1F1" }}>
                    <tr style={{ fontSize: 'bold' }}>
                      <th>ລຳດັບ</th>
                      <th>ຊື່ອໍເດີ້</th>
                      <th>ຕູບ</th>
                      <th>ຈຳນວນ</th>
                      <th>ເລືອກ</th>
                    </tr>
                  </thead>
                  {
                    selectedMenu && selectedMenu.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.name}</td>
                          <td>{tableId}</td>
                          <td>
                            {/* <i class="fa fa-plus" aria-hidden="true"></i> */}
                            {data.quantity}
                            {/* <i class="fa fa-minus" aria-hidden="true"></i> */}
                          </td>
                          <td><i onClick={() => onRemoveFromCart(data.id)} class="fa fa-trash" aria-hidden="true" style={{ color: '#FB6E3B' }}></i></td>
                        </tr>
                      )
                    })
                  }
                </Table>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label>ຄອມເມັ້ນລົດຊາດ</label>
                  <textarea class="form-control" placeholder="ປ້ອນລົດຊາດທີ່ມັກ..." value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
              </div>
              <div class="col-12">
                <div class="form-group d-flex justify-content-center">
                  <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => null}>ຍົກເລີກ</Button>
                  <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => onSubmit()}>ສັ່ງອາຫານ</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div >
}

export default AddOrder;