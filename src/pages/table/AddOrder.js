import React, { useState, useEffect, useRef } from 'react';
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import useReactRouter from "use-react-router";
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import Swal from 'sweetalert2'

/**
 * const
 **/
import {
  TITLE_HEADER,
  BODY,
  DIV_NAV,
  USER_KEY,
  URL_PHOTO_AW3,
} from "../../constants/index";

import { CATEGORY, END_POINT_SEVER, getLocalData, MENUS } from '../../constants/api'
import { moneyCurrency } from '../../helpers'
import { getHeaders } from '../../services/auth';
import Loading from '../../components/Loading';
import { BillForChef } from './components/BillForChef';
import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function AddOrder() {
  const { history, location, match } = useReactRouter();
  const componentRef = useRef();
  const code = match?.params?.code;
  const tableId = match?.params?.tableId;
  const [isLoading, setIsLoading] = useState(false)
  const [Categorys, setCategorys] = useState()
  const [Menus, setMenus] = useState()
  const [userData, setUserData] = useState({})

  const [selectedMenu, setSelectedMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allSelectedMenu, setAllSelectedMenu] = useState([]);



  useEffect(() => {
    const ADMIN = localStorage.getItem(USER_KEY)
    const _localJson = JSON.parse(ADMIN)
    setUserData(_localJson)

    const fetchData = async () => {
      const _localData = await getLocalData()
      if (_localData) {
        getData(_localData?.DATA?.storeId)
        getMenu(_localData?.DATA?.storeId)
      }
    }
    fetchData();
  }, [])


  useEffect(() => {
    // if (selectedCategory === "All") {
    //   setAllSelectedMenu(Menus);
    // } else {
    //   let array = Menus && Menus.filter(function (el) {
    //     return el.category._id == selectedCategory;
    //   });
    //   setAllSelectedMenu(array);
    // }
  }, [selectedCategory]);



  const getData = async (id) => {
    await fetch(CATEGORY + `storeId=${id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setCategorys(json));
  }
  const getMenu = async (id) => {
    setIsLoading(true)
    await fetch(MENUS + `storeId=${id}&${selectedCategory === "All" ? "" : "categoryId ="+ selectedCategory}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => {
        setMenus(json)
        setAllSelectedMenu(json)
        setIsLoading(false)
      });
  }



  const addToCart = (menu) => {
    setSelectedItem(menu)
    let allowToAdd = true;
    let itemIndexInSelectedMenu = 0;
    let data = {
      id: menu._id,
      name: menu.name,
      quantity: 1,
      price: menu.price
    };
    if (selectedMenu.length === 0) {
      setSelectedMenu([...selectedMenu, data]);
    } else {
      let thisSelectedMenu = [...selectedMenu];
      for (let index in thisSelectedMenu) {
        // console.log(thisSelectedMenu[index]);
        if (thisSelectedMenu[index]?.id === menu?._id) {
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
    let selectedMenuCopied = [...selectedMenu];
    for (let i = 0; i < selectedMenuCopied.length; i++) {
      var obj = selectedMenuCopied[i];
      if (obj.id === id) {
        selectedMenuCopied.splice(i, 1);
      }
    }
    setSelectedMenu([...selectedMenuCopied]);
  }

  const createOrder = async (data, header, isPrinted) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': header.authorization
      }
      axios.post(END_POINT_SEVER + "/v3/admin/bill/create", {
        orders: data,
        storeId: userData?.data?.storeId,
        tableId: tableId,
        code: code,
      }, {
        headers: headers
      })
        .then(async (response) => {
          if (response?.data) {
            await Swal.fire({
              icon: 'success',
              title: "ເພີ່ມອໍເດີສໍາເລັດ",
              showConfirmButton: false,
              timer: 1800
            })
            if (isPrinted) {
              await document.getElementById('btnPrint').click();
            }
            history.push(`/tables/pagenumber/1/tableid/${tableId}/${userData?.data?.storeId}`);
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'warning',
            title: "ອາຫານບໍ່ພຽງພໍ",
            showConfirmButton: false,
            timer: 1800
          })
        })
    } catch (error) {
      console.log("BBB", error);
    }
  }

  const onSubmit = async (isPrinted) => {
    if (selectedMenu.length == 0) {
      Swal.fire({
        icon: 'warning',
        title: "ເລືອກເມນູອໍເດີກ່ອນກົດສັ່ງອາຫານ",
        showConfirmButton: false,
        timer: 1800
      })
      return;
    }
    let header = await getHeaders();
    if (selectedMenu.length != 0) {
      await createOrder(selectedMenu, header, isPrinted);
    }
  }


  return <div style={TITLE_HEADER}>
    <div style={{ display: 'none' }}>
      <ReactToPrint
        trigger={() => <button id="btnPrint">Print this out!</button>}
        content={() => componentRef.current}
      />
      <div style={{ display: 'none' }}>
        <BillForChef ref={componentRef} selectedMenu={selectedMenu} code={code} />
      </div>
    </div>
    <div style={{ marginTop: -10, paddingTop: 10 }}>
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
          <div className="container">
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label>ເລືອກປະເພດ</label>
                  <select className="form-control" onChange={(e) => setSelectedCategory(e.target.value)} >
                    <option value="All">ທັງໝົດ</option>
                    {
                      Categorys && Categorys.map((data, index) => {
                        return (
                          <option key={"category" + index} value={data._id}>{data.name}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              {isLoading ? <Loading /> :
                 allSelectedMenu?.map((data, index) =>
                   data?.quantity > 0 ?
                    <div key={"menu" + index} className="col-3"
                      style={{ margin: 3, padding: 0, border: data._id == selectedItem?._id ? "4px solid #FB6E3B" : "4px solid rgba(0,0,0,0)" }}
                      onClick={() => addToCart(data)}>
                       <img src={data?.images[0] ? URL_PHOTO_AW3 + data?.images[0] :"https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="} style={{ width: '100%', height: 200, borderRadius: 5 }} />
                      <div style={{
                        backgroundColor: '#000',
                        color: '#FFF',
                        position: 'relative',
                        opacity: 0.5,
                        padding: 10
                      }}>
                        <span>{data?.name}</span>
                        <br />
                         <span>{moneyCurrency(data?.price)}</span>
                        <br />
                         <span>ຈຳນວນທີ່ມີ : {data?.quantity}</span>
                      </div>
                    </div>
                    : <div></div>
                )
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
          <div className="container">
            <div className="row">
              <div className="col-12">
                <Table responsive className="table">
                  <thead style={{ backgroundColor: "#F1F1F1" }}>
                    <tr style={{ fontSize: 'bold', border: "none" }}>
                      <th style={{ border: "none" }}>ລຳດັບ</th>
                      <th style={{ border: "none" }} className="text-center">ຊື່ເມນູ</th>
                      <th style={{ border: "none" }}>ຈຳນວນ</th>
                      <th style={{ border: "none" }}>ຈັດການ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      selectedMenu && selectedMenu.map((data, index) => {
                        return (
                          <tr key={"selectMenu" + index}>
                            <td>{index + 1}</td>
                            <td>{data.name}</td>
                            <td>
                              {data.quantity}
                            </td>
                            <td><i onClick={() => onRemoveFromCart(data.id)} className="fa fa-trash" aria-hidden="true" style={{ color: '#FB6E3B', cursor: "pointer" }}></i></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </div>
              <div className="col-12">
                <div className="row" style={{ margin: 0 }}>
                  <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => history.goBack()}>ຍົກເລີກ</Button>
                  <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", flex: 1 }} onClick={() => onSubmit(false)}>ສັ່ງອາຫານ</Button>
                </div>
                <div style={{ height: 10 }} />
                <div className="row" style={{ margin: 0 }}>
                  <Button variant="light" className="hover-me" style={{ height: 60, marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", flex: 1 }} onClick={() => onSubmit(true)}>ສັ່ງອາຫານ ແລະ ປຣິນບິນໄປຫາຄົວ + <FontAwesomeIcon icon={faCashRegister} style={{ color: "#fff" }} /> </Button>
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