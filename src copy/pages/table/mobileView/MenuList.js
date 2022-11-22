import React, { useState, useEffect } from 'react'
import useReactRouter from "use-react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { MENUS, CATEGORY, END_POINT_SEVER } from '../../../constants/api'
import { Badge, Modal, Button } from "react-bootstrap";
import {
  URL_PHOTO_AW3,
} from "../../../constants/index";
import { moneyCurrency } from '../../../helpers'


export default function MenuList() {
  const { history, location, match } = useReactRouter();
  const [allSelectedMenu, setAllSelectedMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [Categorys, setCategorys] = useState([])
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [dataSelect, setDataSelect] = useState({})
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getMenu()
    // getData()
  }, [])
  useEffect(() => {
    if (location?.state?.length > 0) setSelectedMenu(location?.state)
  }, [location?.state])
  const getMenu = async () => {
    await fetch(MENUS + `?storeId=${match?.params?.storeId}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => {
        setAllSelectedMenu(json)
      });
    await fetch(END_POINT_SEVER + `/v3/categories?storeId=${match?.params?.storeId}&isDeleted=false`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setCategorys(json));
  }
  const addToCart = (menu) => {
    handleShow();
    setDataSelect(menu)
    // setSelectedItem(menu)
    // let allowToAdd = true;
    // let itemIndexInSelectedMenu = 0;
    // let data = {
    //   id: menu._id,
    //   name: menu.name,
    //   quantity: 1,
    //   price: menu.price
    // };
    // if (selectedMenu.length === 0) {
    //   setSelectedMenu([...selectedMenu, data]);
    // } else {
    //   let thisSelectedMenu = [...selectedMenu];
    //   for (let index in thisSelectedMenu) {
    //     // console.log(thisSelectedMenu[index]);
    //     if (thisSelectedMenu[index]?.id === menu?._id) {
    //       allowToAdd = false;
    //       itemIndexInSelectedMenu = index;
    //     }
    //   }
    //   if (allowToAdd) {
    //     setSelectedMenu([...selectedMenu, data]);
    //   } else {
    //     let copySelectedMenu = [...selectedMenu];
    //     let currentData = copySelectedMenu[itemIndexInSelectedMenu];
    //     currentData.quantity += 1;
    //     copySelectedMenu[itemIndexInSelectedMenu] = currentData;
    //     setSelectedMenu(copySelectedMenu);
    //   }
    // }
  }
  console.log("Categorys===>", Categorys)
  return (
    <div style={{ padding: 10 }}>
      {/* <div className="row">
        {
          Categorys && Categorys.map((data, index) => {
            return (
              <div
                style={{
                  padding: 8,
                  border: "solid 1px #E4E4E4",
                  backgroundColor: "#E4E4E4",
                  borderRadius: 50,
                  cursor: "pointer",
                  marginLeft: 8,
                  overflow: "scroll",
                }}
                key={"category" + index}
                value={data._id}>
                {data.name}
              </div>
            )
          })
        }
      </div> */}
      <div className="row">
        {
          allSelectedMenu?.map((data, index) =>
            <div key={"menu" + index} className="col-4"
              style={{ fontSize: 11, padding: 0, border: data._id == selectedItem?._id ? "4px solid #FB6E3B" : "4px solid rgba(0,0,0,0)" }}
              onClick={() => addToCart(data)}>
              <img src={data?.images?.length > 0 ? URL_PHOTO_AW3 + data?.images[0] : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="} style={{ width: '100%', height: 150, borderRadius: 5 }} />
              <div style={{
                backgroundColor: '#000',
                color: '#FFF',
                position: 'relative',
                opacity: 0.5,
                padding: 10
              }}>
                <span>{data?.name}</span>
                <br />
                <span>{moneyCurrency(data?.price)} ກີບ</span>
              </div>
            </div>
          )
        }
      </div>
      {/* ======> */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}>
        <Modal.Body closeButton>
          <div>
            <div>
              <img src={dataSelect?.images?.length > 0 ? URL_PHOTO_AW3 + dataSelect?.images[0] : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="} style={{ width: '100%', height: 200, borderRadius: 5 }} />
            </div>
            <div style={{ padding: 10 }}>
              <p>{dataSelect?.name}</p>
              <p>{moneyCurrency(dataSelect?.price)} ກີບ</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
