import React, { useState, useEffect } from "react";
import useReactRouter from "use-react-router";
import { COLOR_APP } from "../../constants";
import { useStore } from "../../store";
import axios from "axios";
import { END_POINT } from "../../constants";
import { Modal, Button, Form } from "react-bootstrap";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";

export default function SettingTable() {
  const { history, location, match } = useReactRouter();
  const { tableListCheck, setTableListCheck, getTableDataStoreList } =
    useStore();
  useEffect(() => {
    getTableDataStoreList();
  }, []);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tableNumber, setTableNumber] = useState();
  const [sortNumber, setSortNumber] = useState(0);
  const [selectTatle, setSelectTatle] = useState();
  console.log("selectTatle", selectTatle);
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
          storeId: match?.params?.id,
        },
        headers: headers,
      });
      handleClose();
      if (createTable?.data?.message === "INVALID_NAME") {
        warningAlert("ໂຕະນີ້ໄດ້ມີແລ້ວ");
      } else {
        setTableListCheck([...tableListCheck, createTable?.data]);
        successAdd("ການເພີ່ມໂຕະສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ການເພີ່ມໂຕະບໍ່ສຳເລັດ");
    }
  };
  const [show4, setShow4] = useState(false);

  const _updateTable = async () => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    try {
      if (!selectTatle?.name) {
        warningAlert("ກະລຸນາປ້ອນລະຫັດ");
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
          },
        },
        headers: headers,
      });
      setShow4(false);
      if (createTable?.data?.message === "INVALID_NAME") {
        warningAlert("ໂຕະນີ້ໄດ້ມີແລ້ວ");
      } else {
        setTableListCheck([...tableListCheck, createTable?.data]);
        successAdd("ການເພີ່ມໂຕະສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ການເພີ່ມໂຕະບໍ່ສຳເລັດ");
    }
  };
  const _changeStatusTable = async (data) => {
    try {
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
      setTableListCheck((prev) =>
        prev.map((e) => {
          if (e._id == data._id) {
            return {
              ...e,
              status,
            };
          } else {
            return e;
          }
        })
      );
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
      id: item?.tableId,
      name: item?.tableName || "",
      sort: item?.sort || 0,
      codeId: item?._id,
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
      warningAlert("ລົບຂໍ້ມູນບໍ່ສຳເລັດເພາະກຳລັງໃຊ້ງານ");
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
      successAdd("ລົບຂໍ້ມູນສຳເລັດ");
    }
  };
  return (
    <div style={{ padding: 15 }} className="col-sm-12">
      <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
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
            ເພີ່ມໂຕະ
          </button>
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ລະຫັດ</th>
                  <th scope="col">ລະຫັດໂຕະ</th>
                  <th scope="col">ການເປີດ/ປິດ</th>
                  <th scope="col">ມີແຂກເຂົ້າແລ້ວ</th>
                  <th scope="col">ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {tableListCheck?.map((table, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{table?.tableName}</td>
                      <td>{table?.code}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            defaultChecked={
                              table?.status === true ? true : false
                            }
                            onClick={(e) => _changeStatusTable(table)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td
                        style={{
                          color: table?.isOpened === true ? "green" : "red",
                        }}
                      >
                        {table?.isOpened === true ? "ມີແລ້ວ" : "ຍັງບໍ່ມີ"}
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          style={{ marginLeft: 20, color: "red" }}
                          onClick={() => handleShow3(table)}
                        />
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ marginLeft: 20, color: "red" }}
                          onClick={() => handleShow4(table)}
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ເພີ່ມໂຕະ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ລຳດັບ</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="number"
              placeholder="ກະລຸນາປ້ອນລຳດັບ"
              onChange={(e) => setSortNumber(e?.target?.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ລະຫັດ</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="text"
              placeholder="ກະລຸນາປ້ອນລະຫັດ"
              onChange={(e) => setTableNumber(e?.target?.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ຍົກເລີກ
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _createTable()}
          >
            ບັກທືກ
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ===== edit ===== */}
      <Modal show={show4} onHide={() => setShow4(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ແກ້ໄຂໂຕະ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ລຳດັບ</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="number"
              placeholder="ກະລຸນາປ້ອນລຳດັບ"
              value={selectTatle?.sort || 0}
              onChange={(e) =>
                setSelectTatle({ ...selectTatle, sort: e.target.value || 0 })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ລະຫັດ</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Control
              type="text"
              placeholder="ກະລຸນາປ້ອນລະຫັດ"
              value={selectTatle?.name}
              onChange={(e) =>
                setSelectTatle({ ...selectTatle, name: e?.target?.value })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow4(false)}>
            ຍົກເລີກ
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _updateTable()}
          >
            ບັກທືກ
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ===== delete ===== */}
      <PopUpConfirmDeletion
        open={show3}
        onClose={() => setShow3(false)}
        onSubmit={_confirmeDelete}
        text={dateDelete?.code}
      />
    </div>
  );
}
