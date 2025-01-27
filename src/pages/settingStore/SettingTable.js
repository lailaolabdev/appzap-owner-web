import React, { useState, useEffect } from "react";
import { COLOR_APP } from "../../constants";
import { useStore } from "../../store";
import axios from "axios";
import { END_POINT } from "../../constants";
import { Modal, Button, Form } from "react-bootstrap";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { useParams } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import { END_POINT_SEVER, END_POINT_WEB_CLIENT } from "../../constants/api";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { useTranslation } from "react-i18next";

import { useStoreStore } from "../../zustand/storeStore";

export default function SettingTable() {
  const { t } = useTranslation();
  const [data, setData] = useState("No result");
  const params = useParams();
  const { tableListCheck, setTableListCheck, getTableDataStoreList } =
    useStore();
  const { storeDetail } = useStoreStore();
  useEffect(() => {
    getTableDataStoreList();
    getDataZone();
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tableNumber, setTableNumber] = useState();
  const [sortNumber, setSortNumber] = useState(0);
  const [zoneData, setZoneData] = useState();
  const [zoneId, setZoneId] = useState();
  const [selectTatle, setSelectTatle] = useState();
  const [isDeliveryTable, setIsDeliveryTable] = useState(false); // For create
  const [isOrderSplit, setIsOrderSplit] = useState(false);
  const [isDeliveryTableEdit, setIsDeliveryTableEdit] = useState(false); // For edit
  const [isOrderSplitEdit, setIsOrderSplitEdit] = useState(false); // For edit

  const getDataZone = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const data = await axios({
        method: "get",
        url: END_POINT_SEVER + `/v3/zones`,
        params: {
          storeId: storeDetail?._id,
          limit: 100,
        },
        headers: headers,
      });
      if (data?.status == 200) {
        setZoneData(data?.data?.data);
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _createTable = async () => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    try {
      if (!tableNumber) {
        warningAlert("ກະລຸນາປ້ອນລະຫັດ");
        return;
      }
      const createTable = await axios({
        method: "post",
        url: END_POINT + `/v3/table/create`,
        data: {
          sort: sortNumber,
          name: tableNumber,
          zone: zoneId,
          storeId: params?.id,
          isDeliveryTable,
          isOrderSplit,
        },
        headers: headers,
      });
      setIsDeliveryTable(false);
      handleClose();
      if (createTable?.data?.message === "INVALID_NAME") {
        warningAlert(`${t("table_exist")}`);
      } else {
        getTableDataStoreList();
        successAdd(`${t("table_add_success")}`);
      }
    } catch (err) {
      errorAdd(`${t("table_add_fail")}`);
    }
  };
  const [show4, setShow4] = useState(false);
  const [popup, setPopup] = useState({ qr: false });

  const _updateTable = async () => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    try {
      if (!selectTatle?.name) {
        warningAlert(`${t("p_fill_code")}`);
        return;
      }
      const createTable = await axios({
        method: "put",
        url: END_POINT + `/v3/table/update`,
        data: {
          id: selectTatle?.id,
          data: {
            sort: selectTatle?.sort || 0,
            name: selectTatle?.name || "null",
            codeId: selectTatle?.codeId,
            zone: selectTatle?.zone,
            isDeliveryTable: selectTatle?.isDeliveryTable,
            isOrderSplit: isOrderSplitEdit,
          },
        },
        headers: headers,
      });
      setShow4(false);
      if (createTable?.data?.message === "INVALID_NAME") {
        warningAlert(`${t("table_exist")}`);
      } else {
        getTableDataStoreList();
        successAdd(`${t("table_add_success")}`);
      }
    } catch (err) {
      errorAdd(`${t("table_add_fail")}`);
    }
  };
  const _changeStatusTable = async (data) => {
    try {
      if (data?.isOpened) {
        errorAdd(`${t("can_not_open_table")}`);
        return;
      }
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const status = !data?.status ? "true" : "false";
      let res = await axios({
        method: "PUT",
        url: END_POINT + `/v3/code/update/`,
        data: {
          id: data._id,
          data: {
            status,
          },
        },
        headers: headers,
      });
      getTableDataStoreList();
    } catch (err) {
      console.log("err:", err);
    }
  };
  // ======> delete ====> delete
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [dateDelete, setdateDelete] = useState("");
  const handleShow3 = (item) => {
    setdateDelete(item);
    setShow3(true);
  };
  const handleShow4 = (item) => {
    console.log(item);
    setSelectTatle({
      ...item,
      id: item?.tableId,
      name: item?.tableName || "",
      sort: item?.sort || 0,
      codeId: item?._id,
      zone: item?.zone?._id,
    });
    setShow4(true);
  };
  const _confirmeDelete = async () => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    if (dateDelete?.isOpened === true) {
      handleClose3();
      warningAlert(t("delete_using_table_fail"));
      return;
    }
    const resData = await axios({
      method: "DELETE",
      url: END_POINT + `/v3/code/delete/` + dateDelete?._id,
      headers: headers,
    });
    if (resData.status < 300) {
      handleClose3();
      setTableListCheck((prev) => prev.filter((e) => e._id != dateDelete?._id));
      successAdd(t("delete_success"));
    }
  };

  const handleChangeIstableDelivery = async (e) => {
    setSelectTatle({
      ...selectTatle,
      isDeliveryTable: e,
    });
  };

  return (
    <div
      style={{
        padding: "10px 10px 80px 10px",
        maxHeight: "100vh",
        height: "100%",
        overflow: "auto",
      }}
      className="col-sm-12"
    >
      <div style={{ padding: 10, borderRadius: 8 }}>
        <div className="col-sm-12 text-right">
          <button
            className="col-sm-2"
            style={{
              backgroundColor: COLOR_APP,
              color: "#ffff",
              border: 0,
              padding: 10,
            }}
            onClick={handleShow}
          >
            {t("add_table")}
          </button>
        </div>
        <div style={{ height: 20 }}></div>
        <div style={{ width: "100%", overflow: "auto" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                {/* <th scope="col">#</th> */}
                <th scope="col">{t("tablecode")}</th>
                <th scope="col">{t("zone")}</th>
                {storeDetail?.isDelivery && (
                  <th scope="col">{t("deliveryTable")}</th>
                )}
                <th scope="col">{t("is_order_split")}</th>
                <th scope="col" style={{ textAlign: "right" }}>
                  {t("manage")}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableListCheck?.map((table, index) => {
                return (
                  <tr>
                    <td>
                      {table?.tableName}
                      {/* {table?.isOpened ? (
                        ""
                      ) : (
                        <span style={{ color: "red" }}> - (ປິດ)</span>
                      )} */}
                    </td>
                    <td>{table?.zone?.name ?? "-"}</td>
                    {storeDetail?.isDelivery && (
                      <td
                        style={{
                          color:
                            table?.isDeliveryTable === true ? "green" : "red",
                        }}
                      >
                        {table?.isDeliveryTable === true
                          ? t("deliveryTable")
                          : "-"}
                      </td>
                    )}
                    <td>{table?.isOrderSplit ? t("is_order_split") : "-"}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          justifyContent: "flex-end",
                        }}
                      >
                        <ButtonPrimary
                          onClick={() => handleShow3(table)}
                          disabled={table?.isOpened}
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{
                              color: "white",
                            }}
                          />
                        </ButtonPrimary>
                        <ButtonPrimary
                          onClick={() => handleShow4(table)}
                          disabled={table?.isOpened}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{
                              color: "white",
                            }}
                          />
                        </ButtonPrimary>
                        <ButtonPrimary
                          onClick={() => {
                            setSelectTatle(table);
                            setPopup({ qr: true });
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faQrcode}
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
        </div>
      </div>
      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("add_table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("no")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="number"
              placeholder={t("fill_table_no")}
              onChange={(e) => setSortNumber(e?.target?.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("tablecode")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="text"
              placeholder={t("fill_code")}
              onChange={(e) => setTableNumber(e?.target?.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("fill_zone")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              as="select"
              onChange={(e) => setZoneId(e?.target?.value)}
            >
              <option value="">{t("choose_zone")}</option>
              {zoneData?.map((item, index) => (
                <option key={index} value={item?._id}>
                  {item?.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _createTable()}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("add_table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("no")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="number"
              placeholder={t("fill_table_no")}
              onChange={(e) => setSortNumber(e?.target?.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("tablecode")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="text"
              placeholder={t("fill_code")}
              onChange={(e) => setTableNumber(e?.target?.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("fill_zone")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              as="select"
              onChange={(e) => setZoneId(e?.target?.value)}
            >
              <option value="">{t("choose_zone")}</option>
              {zoneData?.map((item, index) => (
                <option key={index} value={item?._id}>
                  {item?.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {storeDetail?.isDelivery && (
            <Form.Group className="mb-3">
              <Form.Label>{t("is_delivery_table")}</Form.Label>
              <div style={{ height: 10 }} />
              <Form.Check
                type="switch"
                id="is-delivery-table"
                // label={isDeliveryTable ? t("yes") : t("no")}
                checked={isDeliveryTable}
                onChange={(e) => setIsDeliveryTable(e.target.checked)}
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>{t("is_order_split")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Check
              type="switch"
              id="is_order_split"
              // label={isDeliveryTable ? t("yes") : t("no")}
              checked={isOrderSplit}
              onChange={(e) => setIsOrderSplit(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _createTable()}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show4} onHide={() => setShow4(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("edit_table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t()}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="number"
              placeholder={t("fill_table_no")}
              value={selectTatle?.sort || 0}
              onChange={(e) =>
                setSelectTatle({ ...selectTatle, sort: e.target.value || 0 })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("tablecode")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="text"
              placeholder={t("fill_code")}
              value={selectTatle?.name}
              onChange={(e) =>
                setSelectTatle({ ...selectTatle, name: e?.target?.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("fill_zone")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              as="select"
              value={selectTatle?.zone}
              onChange={(e) =>
                setSelectTatle({ ...selectTatle, zone: e?.target?.value })
              }
            >
              <option value="">{t("choose_zone")}</option>
              {zoneData?.map((item, index) => (
                <option key={index} value={item?._id}>
                  {item?.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("enable")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Check
              type="switch"
              // id="is-delivery-table-edit"
              checked={selectTatle?.status === true ? true : false}
              onClick={(e) => {
                _changeStatusTable(selectTatle);
                setShow4(false);
              }}
            />
            {/* <input
              type="checkbox"
              checked={selectTatle?.status === true ? true : false}
              onClick={(e) => {
                _changeStatusTable(selectTatle);
                setShow4(false);
              }}
            /> */}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("is_delivery_table")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Check
              type="switch"
              id="is-delivery-table-edit"
              // label={isDeliveryTableEdit ? t("yes") : t("no")}
              checked={selectTatle?.isDeliveryTable}
              onChange={(e) => handleChangeIstableDelivery(e.target.checked)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("is_order_split")}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Check
              type="switch"
              id="is_order_split_edit"
              // label={isDeliveryTableEdit ? t("yes") : t("no")}
              checked={isOrderSplitEdit}
              onChange={(e) => {
                setIsOrderSplitEdit(e.target.checked);
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow4(false)}>
            {t("cancel")}
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _updateTable()}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== delete ===== */}
      <PopUpConfirmDeletion
        open={show3}
        onClose={() => setShow3(false)}
        onSubmit={_confirmeDelete}
        text={dateDelete?.tableName}
      />
      {/* ===== qr ===== */}

      <Modal show={popup?.qr} onHide={() => setPopup()} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR CODE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QrReader
            onResult={(result, error) => {
              console.log(result);
              if (!!result) {
                axios
                  .put(result?.text, {
                    type: "LINK",
                    "details.redirect": `${END_POINT_WEB_CLIENT}${selectTatle?.storeId}?tableId=${selectTatle?.tableId}`,
                  })
                  .then(() => {
                    setPopup();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }

              // if (!!error) {
              //   console.info(error);
              // }
            }}
            constraints={{
              facingMode: "environment",
            }}
            style={{ width: "100%" }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
