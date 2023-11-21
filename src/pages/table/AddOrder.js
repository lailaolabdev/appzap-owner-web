import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import axios from "axios";
import ReactToPrint from "react-to-print";
import _ from "lodash";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Button, Modal, Form, Nav, Image } from "react-bootstrap";

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

import {
  CATEGORY,
  END_POINT_SEVER,
  getLocalData,
  MENUS,
} from "../../constants/api";
import { moneyCurrency } from "../../helpers";
import { getHeaders } from "../../services/auth";
import Loading from "../../components/Loading";
import { BillForChef } from "./components/BillForChef";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { json, useNavigate, useParams } from "react-router-dom";
import { getBills } from "../../services/bill";
import { useStore } from "../../store";
import BillForChef80 from "../../components/bill/BillForChef80";
import BillForChef58 from "../../components/bill/BillForChef58";

function AddOrder() {
  const params = useParams();
  const navigate = useNavigate();
  const code = params?.code;
  const [billId, setBillId] = useState();
  const tableId = params?.tableId;
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [Categorys, setCategorys] = useState();
  const [Menus, setMenus] = useState();
  const [userData, setUserData] = useState({});

  const [selectedMenu, setSelectedMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allSelectedMenu, setAllSelectedMenu] = useState([]);
  const [show, setShow] = useState(false);
  const [menuType, setMenuType] = useState("MENU");
  const [connectMenues, setConnectMenues] = useState([]);
  const [connectMenuId, setConnectMenuId] = useState("");
  const [menuOptions, setMenuOptions] = useState([]);
  const [selectedOptions, setselectedOptions] = useState();
  const { profile } = useStore();

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleChangeMenuType = async (e) => {
    setMenuType(e.target.value);

    if (e.target.value == "MENUOPTION") {
      await fetch(
        MENUS + `/?isOpened=true&storeId=${storeDetail?._id}&type=MENU`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setConnectMenues(json);
        });
    }
  };

  const handleChangeConnectMenu = (e) => {
    setConnectMenuId(e.target.value);
  };

  function handleSetQuantity(int, data) {
    let dataArray = [];
    for (const i of selectedMenu) {
      let _data = { ...i };
      if (data?.id === i?.id) {
        _data = { ..._data, quantity: _data?.quantity + int };
      }
      if (_data.quantity > 0) {
        dataArray.push(_data);
      }
    }
    setSelectedMenu(dataArray);
  }

  const { storeDetail, printers, selectedTable, onSelectTable } = useStore();
  const [currency, setCurrency] = useState([]);

  const [search, setSearch] = useState("");
  const afterSearch = _.filter(
    allSelectedMenu,
    (e) =>
      (e?.name?.indexOf(search) > -1 && selectedCategory === "All") ||
      e?.categoryId?._id === selectedCategory
  );

  const arrLength = selectedMenu?.length;
  const billForCher80 = useRef([]);
  const billForCher58 = useRef([]);
  if (billForCher80.current.length !== arrLength) {
    // add or remove refs
    billForCher80.current = Array(arrLength)
      .fill()
      .map((_, i) => billForCher80.current[i]);
  }
  if (billForCher58.current.length !== arrLength) {
    // add or remove refs
    billForCher58.current = Array(arrLength)
      .fill()
      .map((_, i) => billForCher58?.current[i]);
  }
  const onPrintForCher = async () => {
    const orderSelect = selectedMenu;
    let _index = 0;
    for (const _ref of billForCher80.current) {
      const _printer = printers.find((e) => {
        return e?._id === orderSelect?.[_index]?.printer;
      });

      try {
        let urlForPrinter = "";
        let dataUrl;
        if (_printer?.width === "80mm") {
          dataUrl = await html2canvas(billForCher80?.current[_index], {
            useCORS: true,
            scrollX: 10,
            scrollY: 0,
            // scale: 530 / widthBill80,
          });
        }
        if (_printer?.width === "58mm") {
          dataUrl = await html2canvas(billForCher58?.current[_index], {
            useCORS: true,
            scrollX: 10,
            scrollY: 0,
            // scale: 350 / widthBill58,
          });
        }
        if (_printer?.type === "ETHERNET") {
          urlForPrinter = "http://localhost:9150/ethernet/image";
        }
        if (_printer?.type === "BLUETOOTH") {
          urlForPrinter = "http://localhost:9150/bluetooth/image";
        }
        if (_printer?.type === "USB") {
          urlForPrinter = "http://localhost:9150/usb/image";
        }

        // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

        const _file = await base64ToBlob(dataUrl.toDataURL());
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("port", "9100");
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        bodyFormData.append("image", _file);
        await axios({
          method: "post",
          url: urlForPrinter,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        // axios.post("http://localhost:9150/ethernet/text", {
        //   config: {
        //     ip: "192.168.100.236",
        //     port: 9100,
        //   },
        //   text: "llsdflkldsfkdkfogowekfokdofsalwiwslkofs",
        // });
        // await Swal.fire({
        //   icon: "success",
        //   title: "ປິນສຳເລັດ",
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
      } catch (err) {
        console.log(err);
        // await Swal.fire({
        //   icon: "error",
        //   title: "ປິນບໍ່ສຳເລັດ",
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
      }
      _index++;
    }
  };

  useEffect(() => {
    const ADMIN = localStorage.getItem(USER_KEY);
    // const ADMIN = profile;
    const _localJson = JSON.parse(ADMIN);
    setUserData(_localJson);

    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        getData(_localData?.DATA?.storeId);
        getMenu(_localData?.DATA?.storeId);
      }
    };
    fetchData();
    // getcurrency();
  }, []);
  useEffect(() => {
    // TODO: check selectTable
    if (!selectedTable) {
      navigate("/tables");
    }
  }, [selectedTable]);

  useEffect(() => {
    (async () => {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      findby += `&code=${code}`;
      const data = await getBills(findby);

      setBillId(data?.[0]);
    })();
  }, []);

  // const getcurrency = async () => {
  //   try {
  //     let x = await axios.get(
  //       END_POINT_SEVER + `/v4/currencies?storeId=${storeDetail?._id}`,
  //       {
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json;charset=UTF-8",
  //         },
  //       }
  //     );
  //     setCurrency(x.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const getData = async (id) => {
    await fetch(CATEGORY + `?storeId=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setCategorys(json));
  };
  const getMenu = async (id) => {
    setIsLoading(true);
    await fetch(
      MENUS +
        `?storeId=${id}&${
          selectedCategory === "All" ? "" : "categoryId =" + selectedCategory
        }`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setMenus(json);
        setAllSelectedMenu(json);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const _checkMenuOption = async (menuId) => {
    try {
      var _menuOptions = [];
      // await fetch(
      //   MENUS +
      //   `?storeId=${storeDetail?._id}&type=MENUOPTION&&menuId=${menuId}`,
      //   {
      //     method: "GET",
      //   }
      // )
      //   .then((response) => response.json())
      //   .then((json) => {
      //     _menuOptions = json;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      _menuOptions = _.filter(
        allSelectedMenu,
        (e) => e?.menuId?._id === menuId
      );
      return _menuOptions;
    } catch (error) {
      return [];
    }
  };

  const addToCart = async (menu) => {
    const _menuOptions = await _checkMenuOption(menu?._id);
    if (_menuOptions.length >= 1) {
      setMenuOptions(_menuOptions);
      handleShow();
      return;
    }
    setSelectedItem({ ...menu, printer: menu?.categoryId?.printer });
    let allowToAdd = true;
    let itemIndexInSelectedMenu = 0;
    let data = {
      id: menu._id,
      name: menu.name,
      quantity: 1,
      price: menu.price,
      categoryId: menu?.categoryId,
      printer: menu?.categoryId?.printer,
    };
    if (selectedMenu.length === 0) {
      setSelectedMenu([...selectedMenu, data]);
    } else {
      let thisSelectedMenu = [...selectedMenu];
      for (let index in thisSelectedMenu) {
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
  };

  const onRemoveFromCart = (id) => {
    let selectedMenuCopied = [...selectedMenu];
    for (let i = 0; i < selectedMenuCopied.length; i++) {
      var obj = selectedMenuCopied[i];
      if (obj.id === id) {
        selectedMenuCopied.splice(i, 1);
      }
    }
    setSelectedMenu([...selectedMenuCopied]);
  };

  const createOrder = async (data, header, isPrinted) => {
    try {
      const _storeId = userData?.data?.storeId;

      let findby = "?";
      findby += `storeId=${_storeId}`;
      findby += `&code=${code}`;
      findby += `&tableId=${tableId}`;
      const _bills = await getBills(findby);
      const _billId = _bills?.[0]?._id;
      if (!_billId) {
        Swal.fire({
          icon: "error",
          title: "ບໍ່ສຳເລັດ",
          showConfirmButton: false,
          timer: 1800,
        });
        setDisabledButton(false);
        return;
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const _body = {
        orders: data,
        storeId: _storeId,
        tableId: tableId,
        code: code,
        billId: _billId,
      };
      axios
        .post(END_POINT_SEVER + "/v3/admin/bill/create", _body, {
          headers: headers,
        })
        .then(async (response) => {
          if (response?.data) {
            Swal.fire({
              icon: "success",
              title: "ເພີ່ມອໍເດີສໍາເລັດ",
              showConfirmButton: false,
              timer: 1800,
            });
            if (isPrinted) {
              //  print
              onPrintForCher().then(() => {
                onSelectTable(selectedTable);
                navigate(
                  `/tables/pagenumber/1/tableid/${tableId}/${userData?.data?.storeId}`
                );
              });
            } else {
              onSelectTable(selectedTable);
              navigate(
                `/tables/pagenumber/1/tableid/${tableId}/${userData?.data?.storeId}`
              );
            }
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "warning",
            title: "ອາຫານບໍ່ພຽງພໍ",
            showConfirmButton: false,
            timer: 1800,
          });
          setDisabledButton(false);
        });
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "error",
        title: "ບໍ່ສຳເລັດ",
        showConfirmButton: false,
        timer: 1800,
      });
      setDisabledButton(false);
    }
  };

  const onSubmit = async (isPrinted) => {
    try {
      setIsLoading(true);
      if (selectedMenu.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "ເລືອກເມນູອໍເດີກ່ອນກົດສັ່ງອາຫານ",
          showConfirmButton: false,
          timer: 1800,
        });
        setIsLoading(false);
        setDisabledButton(false);
        return;
      }
      let header = await getHeaders();
      if (selectedMenu.length != 0) {
        await createOrder(selectedMenu, header, isPrinted);
      }
      setIsLoading(false);
    } catch (err) {
      setDisabledButton(false);
      setIsLoading(false);
      console.log(err);
    }
  };

  const { t } = useTranslation();

  return (
    <div>
      <div
        style={{
          display: "flex",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            height: "90vh",
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              padding: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: 20,
            }}
          >
            <div>
              <label>ເລືອກປະເພດ</label>
              <select
                className="form-control"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">ທັງໝົດ</option>
                {Categorys &&
                  Categorys?.map((data, index) => {
                    return (
                      <option key={"category" + index} value={data?._id}>
                        {data?.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div>
              <label>ຄົ້ນຫາ</label>
              <input
                placeholder="ຄົ້ນຫາ"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}
          >
            {isLoading ? (
              <Loading />
            ) : (
              afterSearch?.map((data, index) => {
                if (data?.type === "MENU")
                  return (
                    <div
                      key={"menu" + index}
                      style={{
                        border:
                          data._id === selectedItem?._id
                            ? "4px solid #FB6E3B"
                            : "4px solid rgba(0,0,0,0)",
                      }}
                      onClick={() => {
                        addToCart(data);
                      }}
                    >
                      <img
                        src={
                          data?.images[0]
                            ? URL_PHOTO_AW3 + data?.images[0]
                            : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
                        }
                        style={{
                          width: "100%",
                          height: 200,
                          borderRadius: 5,
                        }}
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
                          {moneyCurrency(data?.price)} LAK{" "}
                          {/* {currency?.map(
                            (e) =>
                              " / " +
                              (data?.price / e.sell).toFixed(2) +
                              " " +
                              e?.currencyCode
                          )} */}
                        </span>
                        <br />
                        <span>ຈຳນວນທີ່ມີ : {data?.quantity}</span>
                      </div>
                    </div>
                  );
              })
            )}
          </div>
        </div>
        {/* Detail Table */}
        <div
          style={{
            minWidth: 500,
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
                    <tr style={{ fontSize: "bold", border: "none" }}>
                      <th style={{ border: "none" }}>ລຳດັບ</th>
                      <th style={{ border: "none" }} className="text-center">
                        ຊື່ເມນູ
                      </th>
                      <th style={{ border: "none" }}>ຈຳນວນ</th>
                      <th style={{ border: "none" }}>ຈັດການ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMenu &&
                      selectedMenu.map((data, index) => {
                        return (
                          <tr key={"selectMenu" + index}>
                            <td>{index + 1}</td>
                            <td>{data.name}</td>
                            <td
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <button
                                style={{
                                  color: "blue",
                                  border: "none",
                                  width: 25,
                                }}
                                onClick={() => handleSetQuantity(-1, data)}
                              >
                                -
                              </button>
                              {data.quantity}
                              <button
                                style={{
                                  color: "red",
                                  border: "none",
                                  width: 25,
                                }}
                                onClick={() => handleSetQuantity(1, data)}
                              >
                                +
                              </button>
                            </td>
                            <td>
                              <i
                                onClick={() => onRemoveFromCart(data.id)}
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={{
                                  color: "#FB6E3B",
                                  cursor: "pointer",
                                }}
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
              <div className="col-12">
                <div className="row" style={{ margin: 0 }}>
                  <Button
                    variant="outline-warning"
                    style={{
                      marginRight: 15,
                      border: "solid 1px #FB6E3B",
                      color: "#FB6E3B",
                      fontWeight: "bold",
                    }}
                    onClick={() =>
                      navigate(
                        `/tables/pagenumber/1/tableid/${tableId}/${userData?.data?.storeId}`
                      )
                    }
                  >
                    ຍົກເລີກ
                  </Button>
                  <Button
                    variant="light"
                    className="hover-me"
                    style={{
                      marginRight: 15,
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                      fontWeight: "bold",
                      flex: 1,
                    }}
                    disabled={disabledButton}
                    onClick={() => {
                      setDisabledButton(true);
                      onSubmit(false);
                    }}
                  >
                    ສັ່ງອາຫານ
                  </Button>
                </div>
                <div style={{ height: 10 }} />
                <div className="row" style={{ margin: 0 }}>
                  <Button
                    variant="light"
                    className="hover-me"
                    style={{
                      height: 60,
                      marginRight: 15,
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                      fontWeight: "bold",
                      flex: 1,
                    }}
                    disabled={disabledButton}
                    onClick={() => {
                      // onPrint();
                      setDisabledButton(true);
                      onSubmit(true);
                    }}
                  >
                    ສັ່ງອາຫານ ແລະ ປຣິນບິນໄປຫາຄົວ +{" "}
                    <FontAwesomeIcon
                      icon={faCashRegister}
                      style={{ color: "#fff" }}
                    />{" "}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedMenu?.map((val, i) => {
        return (
          <div
            style={{
              width: "80mm",
              paddingRight: "20px",
              paddingBottom: "10px",
            }}
            ref={(el) => (billForCher80.current[i] = el)}
          >
            <BillForChef80
              storeDetail={storeDetail}
              selectedTable={selectedTable}
              // dataBill={dataBill}
              val={{ ...val, tableId: { name: selectedTable?.tableName } }}
            />
          </div>
        );
      })}
      <div>
        {selectedMenu?.map((val, i) => {
          return (
            <div
              style={{
                width: "58mm",
                paddingRight: "20px",
                paddingBottom: "10px",
              }}
              ref={(el) => (billForCher58.current[i] = el)}
            >
              <BillForChef58
                storeDetail={storeDetail}
                selectedTable={selectedTable}
                // dataBill={dataBill}
                val={{ ...val, tableId: { name: selectedTable?.tableName } }}
              />
            </div>
          );
        })}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Option ເມນູອາຫານ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: menuOptions?.name,
            name_en: menuOptions?.name_en,
            images: menuOptions?.images,
            quantity: menuOptions?.quantity,
            menuOptionId: menuOptions?.menuOptions,
            categoryId: menuOptions?.categoryId?._id,
            price: menuOptions?.price,
            detail: menuOptions?.detail,
            unit: menuOptions?.unit,
            isOpened: menuOptions?.isOpened,
            type: menuOptions?.type,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
            }
            // if (!values.name_en) {
            //   errors.name_en = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
            // }
            if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
              errors.price = "ກະລຸນາປ້ອນລາຄາ...";
            }
            return errors;
          }}
          // onSubmit={(values, { setSubmitting }) => {
          //   const getData = async () => {
          //     await _updateCategory(values);
          //     const _localData = await getLocalData();
          //     if (_localData) {
          //       setgetTokken(_localData);
          //       getMenu(_localData?.DATA?.storeId);
          //       // getMenu(getTokken?.DATA?.storeId);
          //     }
          //   };
          //   getData();
          // }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  {menuOptions.map((item) => (
                    <button
                      className="form-control mb-2"
                      key=""
                      onClick={() => {
                        setselectedOptions(item);
                      }}
                    >
                      {item?.name} ລາຄາ {item?.price} LAK
                    </button>
                  ))}
                  {/* </Form.Control> */}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  ຍົກເລີກ
                </Button>
                <Button
                  style={{
                    backgroundColor: "orange",
                    color: "#ffff",
                    border: 0,
                  }}
                  onClick={() => {
                    addToCart(selectedOptions);
                    handleClose();
                  }}
                >
                  ບັນທືກ
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default AddOrder;
