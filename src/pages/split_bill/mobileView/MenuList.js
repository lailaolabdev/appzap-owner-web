import React, { useState, useEffect } from "react";
import { MENUS, END_POINT_SEVER } from "../../../constants/api";
import { Modal } from "react-bootstrap";
import { URL_PHOTO_AW3 } from "../../../constants/index";
import { moneyCurrency } from "../../../helpers";
import { useParams } from "react-router-dom";
import { useStore } from "../../../store";

export default function MenuList() {
  const params = useParams();
  const [allSelectedMenu, setAllSelectedMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [Categorys, setCategorys] = useState([]);
  const [dataSelect, setDataSelect] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { storeDetail } = useStore();

  useEffect(() => {
    getMenu();
  }, []);
  const getMenu = async () => {
    await fetch(MENUS + `?storeId=${params?.storeId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        setAllSelectedMenu(json);
      });
    await fetch(
      END_POINT_SEVER +
        `/v3/categories?storeId=${params?.storeId}&isDeleted=false`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => setCategorys(json));
  };
  const addToCart = (menu) => {
    handleShow();
    setDataSelect(menu);
    setSelectedItem(menu);
  };
  return (
    <div style={{ padding: 10 }}>
      <div className="row">
        {allSelectedMenu?.map((data, index) => (
          <div
            key={"menu" + index}
            className="col-4"
            style={{
              fontSize: 11,
              padding: 0,
              border:
                data._id === selectedItem?._id
                  ? "4px solid #FB6E3B"
                  : "4px solid rgba(0,0,0,0)",
            }}
            onClick={() => addToCart(data)}
          >
            <img
              src={
                data?.images?.length > 0
                  ? URL_PHOTO_AW3 + data?.images[0]
                  : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
              }
              style={{ width: "100%", height: 150, borderRadius: 5 }}
              alt=""
            />
            <div
              style={{
                backgroundColor: "#000",
                color: "#FFF",
                position: "relative",
                opacity: 0.5,
                padding: 10,
              }}
            >
              <span>{data?.name}</span>
              <br />
              <span>
                {moneyCurrency(data?.price)} {storeDetail?.firstCurrency}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* ======> */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Body closeButton>
          <div>
            <div>
              <img
                src={
                  dataSelect?.images?.length > 0
                    ? URL_PHOTO_AW3 + dataSelect?.images[0]
                    : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
                }
                style={{ width: "100%", height: 200, borderRadius: 5 }}
                alt=""
              />
            </div>
            <div style={{ padding: 10 }}>
              <p>{dataSelect?.name}</p>
              <p>
                {moneyCurrency(dataSelect?.price)} {storeDetail?.firstCurrency}
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
