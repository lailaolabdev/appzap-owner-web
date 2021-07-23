import React, { useState, useEffect } from 'react';
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
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

import { CATEGORY, getLocalData, MENUS } from '../../constants/api'

function AddOrder() {
  const [isLoading, setIsLoading] = useState(false)
  const [Categorys, setCategorys] = useState()
  const [Menus, setMenus] = useState()
  const [getTokken, setgetTokken] = useState()

  const [selectedMenu, setSelectedMenu] = useState([]);

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

  const addToCart = (id, name) => {
    let allowToAdd = true;
    let itemIndexInSelectedMenu = 0;
    let data = {
      id,
      name,
      quantity: 1
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

  return <div style={TITLE_HEADER}>
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
          <div class="container">
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label>Choose type</label>
                  <select class="form-control">
                    <option>ALL</option>
                    {
                      Categorys && Categorys.map((data, index) => {
                        return (
                          <option key={index}>{data.name}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              {
                Menus && Menus.map((data, index) => {
                  return (
                    <div class="col-3" style={{ padding: 5 }} onClick={() => addToCart(data?._id, data?.name)}>
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
                <table class="table">
                  <tr>
                    <td>NO</td>
                    <td>Order Name</td>
                    <td>Table</td>
                    <td>Quantity</td>
                    <td>Status</td>
                  </tr>
                  {
                    selectedMenu && selectedMenu.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.name}</td>
                          <td>Table</td>
                          <td>{data.quantity}</td>
                          <td><button>DELETE</button></td>
                        </tr>
                      )
                    })
                  }
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div >
}

export default AddOrder;