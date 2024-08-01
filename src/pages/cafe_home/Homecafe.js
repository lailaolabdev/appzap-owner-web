/* eslint-disable no-loop-func */
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import axios from "axios";
import ReactToPrint from "react-to-print";
import BillForCheckOutCafe80 from "../../components/bill/BillForCheckOutCafe80";
import _ from "lodash";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Button, Modal, Form, Nav, Image } from "react-bootstrap";
import { base64ToBlob } from "../../helpers";

/**
 * const
 **/

import {
  TITLE_HEADER,
  BODY,
  DIV_NAV,
  USER_KEY,
  URL_PHOTO_AW3,
  USB_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  ETHERNET_PRINTER_PORT,
} from "../../constants/index";

import {
  CATEGORY,
  END_POINT_SEVER,
  getLocalData,
  MENUS,
  USERS,
  END_POINT_APP,
} from "../../constants/api";
import { moneyCurrency } from "../../helpers";
import { getHeaders } from "../../services/auth";
import Loading from "../../components/Loading";
// import { BillForChef } from "./components/BillForChef";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { json, useNavigate, useParams } from "react-router-dom";
import { getBillCafe } from "../../services/bill";
import { useStore } from "../../store";
import BillForChef80 from "../../components/bill/BillForChef80";
import BillForChef58 from "../../components/bill/BillForChef58";
import { MdMarkChatRead, MdDelete, MdAdd } from "react-icons/md";
import { RiChatNewFill } from "react-icons/ri";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import CheckOutPopupCafe from "../table/components/CheckOutPopupCafe";
import { callCheckOutPrintBillOnly } from "../../services/code";

function Homecafe() {
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
  const [usersData, setUsersData] = useState({});

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
  const [isPopup, setIsPupup] = useState(false);
  const [noteItems, setNoteItems] = useState();
  const [addComments, setAddComments] = useState();
  const [editComments, setEditComments] = useState();
  const inputRef = useRef(null); // Create a ref for the input element
  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [itemDeleting, setItemDeleting] = useState();
  const [dataBill, setDataBill] = useState();
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [taxPercent, setTaxPercent] = useState(0);
  const [popup, setPopup] = useState({
    CheckOutType: false,
  });
  useEffect(() => {
    // Check if the modal is shown and if the ref is attached to an element
    if (isPopup && inputRef.current) {
      inputRef.current.focus(); // Set focus when the modal is shown
    }
  }, [isPopup]);

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
  const {
    storeDetail,
    printerCounter,
    printers,
    selectedTable,
    setSelectedTable,
    getTableDataStore,
    onSelectTable,
  } = useStore();
  const [search, setSearch] = useState("");
  const afterSearch = _.filter(
    allSelectedMenu,
    (e) =>
      (e?.name?.indexOf(search) > -1 && selectedCategory === "All") ||
      e?.categoryId?._id === selectedCategory
  );
  // console.log("afterSearch",afterSearch)
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
          urlForPrinter = ETHERNET_PRINTER_PORT;
        }
        if (_printer?.type === "BLUETOOTH") {
          urlForPrinter = BLUETOOTH_PRINTER_PORT;
        }
        if (_printer?.type === "USB") {
          urlForPrinter = USB_PRINTER_PORT;
        }

        // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

        console.log("dataUrl=5555==========>", dataUrl);
        const _file = await base64ToBlob(dataUrl.toDataURL());
        console.log("_file===========>", _file);
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("port", "9100");
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        bodyFormData.append("image", _file);
        bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);

        console.log("bodyFormData898989898997979>>>>>>>>", bodyFormData);
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
    getUserData();
    // getcurrency();
  }, []);

  useEffect(() => {
    (async () => {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      // findby += `&code=${code}`;
      const data = await getBillCafe(findby);
      setBillId(data?.[0]);
    })();
  }, []);

  const getUserData = async () => {
    // setIsLoading(true);
    await fetch(USERS + `/skip/0/limit/0/?storeId=${storeDetail?._id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setUsersData(json));
    // setIsLoading(false);
  };

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
      note: "",
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

  const AlertMessage = () =>{
    Swal.fire({
          icon: "error",
          title: "ກະລຸນາເລຶອກລາຍການສິນຄ້າກ່ອນ",
          showConfirmButton: false,
          timer: 2500,
        });
  }

  const TotalAmount = () => {
    return selectedMenu.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.quantity;
    }, 0);
  };

  const TotalPrice = () => {
    return selectedMenu.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.price * nextValue.quantity;
    }, 0);
  };

  // console.log("TotalAmount", TotalAmount());
  // console.log("TotalPrice", TotalPrice());

  const onRemoveFromCart = (id) => {
    let selectedMenuCopied = [...selectedMenu];
    for (let i = 0; i < selectedMenuCopied.length; i++) {
      var obj = selectedMenuCopied[i];
      if (obj.id === id) {
        selectedMenuCopied.splice(i, 1);
      }
    }
    setSelectedMenu([...selectedMenuCopied]);
    setIsRemoveItem(false);
  };
  useEffect(() => {
    const getDataTax = async () => {
      const { DATA } = await getLocalData();
      const _res = await axios.get(
        END_POINT_SEVER + "/v4/tax/" + DATA?.storeId
      );
      setTaxPercent(_res?.data?.taxPercent);
    };
    getDataTax();
  }, []);

  // const createOrder = async (data, header, isPrinted) => {
  //   try {
  //     const _storeId = userData?.data?.storeId;
  //     let findby = "?";
  //     findby += `storeId=${_storeId}`;
  //     // findby += `&code=${code}`;
  //     // findby += `&tableId=${tableId}`;
  //     const _bills = await getBillCafe(findby);

  //     console.log("_bills", _bills);

  //     const _billId = _bills?.[0]?._id;
  //     if (!_billId) {
  //       Swal.fire({
  //         icon: "error",
  //         title: `${t("not_success")}`,
  //         showConfirmButton: false,
  //         timer: 1800,
  //       });
  //       setDisabledButton(false);
  //       return;
  //     }
  //     const headers = {
  //       "Content-Type": "application/json",
  //       Authorization: header.authorization,
  //     };
  //     const _body = {
  //       orders: data,
  //       storeId: _storeId,
  //       // tableId: tableId,
  //       // code: code,
  //       billId: _billId,
  //     };
  //     axios
  //       .post(END_POINT_SEVER + "/v3/admin/bill-cafe/create", _body, {
  //         headers: headers,
  //       })
  //       .then(async (response) => {
  //         if (response?.data) {
  //           Swal.fire({
  //             icon: "success",
  //             title: `${t("add_order_success")}`,
  //             showConfirmButton: false,
  //             timer: 1800,
  //           });
  //           if (isPrinted) {
  //             //  print
  //             onPrintForCher().then(() => {
  //               onSelectTable(selectedTable);
  //               navigate(`/history-cafe-sale`);
  //             });
  //           } else {
  //             onSelectTable(selectedTable);
  //             navigate(`/history-cafe-sale`);
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         Swal.fire({
  //           icon: "warning",
  //           title: `${t("food_not_enouch")}`,
  //           showConfirmButton: false,
  //           timer: 1800,
  //         });
  //         setDisabledButton(false);
  //       });
  //   } catch (error) {
  //     console.log("error", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: `${t("not_success")}`,
  //       showConfirmButton: false,
  //       timer: 1800,
  //     });
  //     setDisabledButton(false);
  //   }
  // };

  // const onSubmit = async (isPrinted) => {
  //   try {
  //     setIsLoading(true);
  //     if (selectedMenu.length === 0) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: `${t("please_chose_order")}`,
  //         showConfirmButton: false,
  //         timer: 1800,
  //       });
  //       setIsLoading(false);
  //       setDisabledButton(false);
  //       return;
  //     }
  //     let header = await getHeaders();
  //     if (selectedMenu.length != 0) {
  //       await createOrder(selectedMenu, header, isPrinted);
  //     }
  //     setDisabledButton(false);
  //     setIsLoading(false);
  //     setSelectedMenu([]);
  //   } catch (err) {
  //     setDisabledButton(false);
  //     setIsLoading(false);
  //     console.log(err);
  //   }
  // };

  const onAddCommentItems = (values) => {
    setIsPupup(true);
    setNoteItems(values);
  };

  const onEditCommentItems = (values) => {
    setIsPupup(true);
    setNoteItems(values);
    setEditComments(values?.note);
  };

  const handleAddCommentInCart = () => {
    let dataArray = [];
    for (const i of selectedMenu) {
      let _data = { ...i };
      if (noteItems?.id === i?.id) {
        if (noteItems?.note === "") {
          _data = { ..._data, note: addComments };
        } else {
          _data = { ..._data, note: editComments };
        }
      }
      dataArray.push(_data);
    }
    setSelectedMenu(dataArray);
    setIsPupup(false);
    setAddComments("");
    setEditComments("");
  };

  const handleUpdateCommentInCart = () => {
    let dataArray = [];
    for (const i of selectedMenu) {
      let _data = { ...i };
      if (noteItems?.id === i?.id) {
        if (noteItems?.note === "") {
          _data = { ..._data, note: "" };
        } else {
          _data = { ..._data, note: "" };
        }
      }
      dataArray.push(_data);
    }
    setSelectedMenu(dataArray);
    setIsPupup(false);
    setAddComments("");
    setEditComments("");
  };

  const onConfirmRemoveItem = (data) => {
    setIsRemoveItem(true);
    setItemDeleting(data);
  };
  const onPrintDrawer = async () => {
    try {
      let urlForPrinter = "";
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );

      if (printerBillData?.type === "ETHERNET") {
        urlForPrinter = "http://localhost:9150/ethernet/drawer";
      }
      if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = "http://localhost:9150/bluetooth/drawer";
      }
      if (printerBillData?.type === "USB") {
        urlForPrinter = "http://localhost:9150/usb/drawer";
      }

      var bodyFormData = new FormData();
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");

      // await axios({
      //   method: "post",
      //   url: urlForPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      await axios.post(urlForPrinter, {
        ip: printerBillData?.ip,
        port: 9100,
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: `${t("open_drawer_fail")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const [widthBill80, setWidthBill80] = useState(0);
  const [widthBill58, setWidthBill58] = useState(0);

  let qrSmartOrder80Ref = useRef(null);

  let bill80Ref = useRef(null);
  let bill58Ref = useRef(null);

  useLayoutEffect(() => {
    setWidthBill80(bill80Ref.current.offsetWidth);
    // setWidthBill58(bill58Ref.current.offsetWidth);
  }, [bill80Ref, bill58Ref]);

  // ສ້າງປະຫວັດການພິມບິນຂອງແຕ່ລະໂຕະ
  const _createHistoriesPrinter = async (data) => {
    try {
      let headers = await getHeaders();
      const _url = `${END_POINT_APP}/v3/logs/create-histories-printer`;
      const updateTable = await axios({
        method: "post",
        url: _url,
        data: data,
        headers: headers,
      });

      if (updateTable?.status < 300) {
        console.log("success create printer bil...");
      }
    } catch (err) {
      console.log({ err });
    }
  };

  // console.log("bill80Ref CaFe",bill80Ref)

  const onPrintBill = async () => {
    try {
      let _dataBill = {
        ...dataBill,
        typePrint: "PRINT_BILL_CHECKOUT",
      };
      await _createHistoriesPrinter(_dataBill);

      let urlForPrinter = "";
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );
      let dataImageForPrint;
      if (printerBillData?.width === "80mm") {
        dataImageForPrint = await html2canvas(bill80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
      }

      if (printerBillData?.width === "58mm") {
        dataImageForPrint = await html2canvas(bill58Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 350 / widthBill58,
        });
      }
      if (printerBillData?.type === "ETHERNET") {
        urlForPrinter = ETHERNET_PRINTER_PORT;
      }
      if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = BLUETOOTH_PRINTER_PORT;
      }
      if (printerBillData?.type === "USB") {
        urlForPrinter = USB_PRINTER_PORT;
      }

      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      var bodyFormData = new FormData();
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      bodyFormData.append("paper", printerBillData?.width === "58mm" ? 58 : 80);

      // printFlutter({imageBuffer:dataImageForPrint.toDataURL(),ip:printerBillData?.ip,type:printerBillData?.type,port:"9100"});
      await axios({
        method: "post",
        url: urlForPrinter,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        icon: "success",
        title: "ປິນສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });

      // update bill status to call check out
      // callCheckOutPrintBillOnly(selectedTable?._id);
      setSelectedTable();
      getTableDataStore();
    } catch (err) {
      console.log("err printer", err);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fial")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return err;
    }
  };
  

  // const canCheckOut = !tableOrderItems.find(
  //   (e) =>
  //     e?.status === "DOING" ||
  //     e?.status === "WAITING" ||
  //     e?.tableOrderItems?.length === 0
  // )?._id;

  const _onCheckOut = async () => {
    setMenuItemDetailModal(true);
  };

  const { t } = useTranslation();

  return (
    <div>
      <CafeContent>
        <CafeMenu>
          <div
            style={{
              padding: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: 20,
            }}
          >
            <div>
              <label>{t("chose_food_type")}</label>
              <select
                className="form-control"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">{t("all")}</option>
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
              <label>{t("search")}</label>
              <input
                placeholder={t("search")}
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <SubCafeMenu
          >
            {isLoading ? (
              <Loading />
            ) : (

              afterSearch.length === 0 ? 
              
              <div className="container">
                  <p>ຍັງບໍ່ມີລາຍການນີ້</p>
              </div>
              :
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
                          // height: 200,
                          objectFit: "cover",
                          borderRadius: 5,
                        }}
                        alt="images-menu"
                        className="images-menu-cafe"
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
                          {moneyCurrency(data?.price)}{" "}
                          {storeDetail?.firstCurrency}
                          {/* {currency?.map(
                            (e) =>
                              " / " +
                            (data?.price / e.sell).toFixed(2) +
                            " " +
                            e?.currencyCode
                            )} */}
                        </span>
                        <br />
                        <span>
                          {t("amount_exist")} : {data?.quantity}
                        </span>
                      </div>
                    </div>
                  );
              })

            )}
          </SubCafeMenu>
        </CafeMenu>
  
        <CafeCart
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <Table responsive className="table">
                  <thead style={{ backgroundColor: "#F1F1F1" }}>
                    <tr style={{ fontSize: "bold", border: "none" }}>
                      <th style={{ border: "none" }}>#</th>
                      <th style={{ border: "none", textAlign: "left" }}>
                        {t("menu_name")}
                      </th>
                      <th style={{ border: "none", textAlign: "center" }}>
                        {t("amount")}
                      </th>
                      <th style={{ border: "none", textAlign: "center" }}>
                        {t("prices")}
                      </th>
                      <th style={{ border: "none", textAlign: "right" }}>
                        {t("manage")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMenu &&
                      selectedMenu.map((data, index) => {
                        return (
                          <tr key={"selectMenu" + index}>
                            <td style={{ width: 20 }}>{index + 1}</td>
                            <td style={{ textAlign: "left", paddingBottom: 0 }}>
                              <p>{data.name}</p>

                              <p style={{ fontSize: 12, marginTop: "-1.5em" }}>
                                {data?.note ?? ""}
                              </p>
                            </td>
                            <td
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                marginTop: "-.05em",
                                alignItems: "center",
                              }}
                            >
                              <button
                                style={{
                                  color: "blue",
                                  border: "none",
                                  width: 25,
                                  marginTop: -15,
                                }}
                                onClick={() => handleSetQuantity(-1, data)}
                              >
                                -
                              </button>
                              <p
                                style={{
                                  minWidth: 30,
                                  maxWidth: 50,
                                  paddingLeft: 10,
                                }}
                              >
                                {data.quantity}
                              </p>
                              <button
                                style={{
                                  color: "red",
                                  border: "none",
                                  width: 25,
                                  marginTop: -15,
                                }}
                                onClick={() => handleSetQuantity(1, data)}
                              >
                                +
                              </button>
                            </td>
                            <td>
                              <p>{moneyCurrency(data.quantity * data.price)}</p>
                            </td>

                            <td style={{ padding: 0, textAlign: "right" }}>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "end",
                                  gap: 10,
                                  paddingLeft: 10,
                                  paddingTop: 5,
                                }}
                              >
                                {data?.note === "" ? (
                                  <div
                                    style={{
                                      cursor: "pointer",
                                      fontSize: 25,
                                      color: "gray",
                                    }}
                                    onClick={() => onAddCommentItems(data)}
                                  >
                                    <RiChatNewFill />
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      cursor: "pointer",
                                      fontSize: 25,
                                      color: "green",
                                    }}
                                    onClick={() => onEditCommentItems(data)}
                                  >
                                    <MdMarkChatRead />
                                  </div>
                                )}

                                <div
                                  style={{
                                    cursor: "pointer",
                                    fontSize: 25,
                                    color: "#FB6E3B",
                                  }}
                                  onClick={() => onConfirmRemoveItem(data)}
                                >
                                  <MdDelete />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                {selectedMenu.length > 0 ? (
                  <div className="mb-3">
                    <div>
                      <span>{t("amountTotal")} : </span>
                      <span>{TotalAmount()}</span>
                    </div>
                    <div>
                      <span>{t("pricesTotal")} : </span>
                      <span>
                        {moneyCurrency(TotalPrice())} {t("nameCurrency")}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="col-12">
                <div className="row" style={{ margin: 0 }}>
                  <Button
                    variant="outline-warning"
                    className="hover-me"
                    style={{
                      marginRight: 15,
                      border: "solid 1px #FB6E3B",
                      fontWeight: "bold",
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                    }}
                    onClick={() => setSelectedMenu([])}
                  >
                    {t("cancel")}
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
                    onClick={() => {
                      selectedMenu.length === 0 ?
                      AlertMessage()
                      :
                      setPopup({ CheckOutType: true });
                    }}
                  >
                    {/* {t("print_bill")} */}
                    CheckOut
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
                    onClick={() => navigate(`/history-cafe-sale`)}
                  >
                    {t("history_sales")}
                  </Button>

                </div>
              </div>
            </div>
          </div>
        </CafeCart>
      </CafeContent>
      {/* <div className="mt-3">
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
      </div> */}
      <Modal
        show={show}
        onHide={handleClose}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("menu_option")}</Modal.Title>
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
              errors.name = `${t("please_fill_menu_name")}`;
            }
            // if (!values.name_en) {
            //   errors.name_en = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
            // }
            if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
              errors.price = `${t("please_fill_price")}`;
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
                      {item?.name} {t("price")} {item?.price} LAK
                    </button>
                  ))}
                  {/* </Form.Control> */}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  {t("cancel")}
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
                  {t("save")}
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>

      {/* modal comment of items   */}
      <Modal centered show={isPopup} onHide={() => setIsPupup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{noteItems?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form.Group>
            <Form.Label>
              {noteItems?.note === ""
                ? `${t("commend_how_is_food")}`
                : `${t("edit_commend")}`}
            </Form.Label>
            <Form.Control
              ref={noteItems?.note === "" ? inputRef : null}
              as="textarea"
              rows={3}
              value={noteItems?.note === "" ? addComments : editComments}
              onChange={(e) =>
                noteItems?.note === ""
                  ? setAddComments(e.target.value)
                  : setEditComments(e.target.value)
              }
              placeholder={t("fill_desc")}
              className="w-100"
            />
          </Form.Group>
          <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
            {noteItems?.note !== "" && (
              <Button
                variant="outline-danger"
                className="w-100 p-2"
                onClick={handleUpdateCommentInCart}
              >
                {t("delete_all")}
              </Button>
            )}
            <Button className="w-100 p-2" onClick={handleAddCommentInCart}>
              {noteItems?.note !== "" ? (
                `${t("edit")}`
              ) : (
                <>
                  <MdAdd style={{ fontSize: 28 }} />
                  {t("add_new")}
                </>
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* modal confirm delete item from cart */}
      <PopUpConfirmDeletion
        open={isRemoveItem}
        text={itemDeleting?.name}
        onClose={() => setIsRemoveItem(false)}
        onSubmit={async () => onRemoveFromCart(itemDeleting.id)}
      />
      <CheckOutPopupCafe
        onPrintBill={onPrintBill}
        onPrintDrawer={onPrintDrawer}
        dataBill={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        tableData={selectedTable}
        open={popup?.CheckOutType}
        onClose={() => setPopup()}
        setDataBill={setDataBill}
        taxPercent={taxPercent}
        TotalPrice={TotalPrice()}
      />
      <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
        <BillForCheckOutCafe80
          storeDetail={storeDetail}
          dataBill={selectedMenu}
          taxPercent={taxPercent}
          profile={profile}
        />
      </div>
    </div>
  );
}

const CafeContent = styled.div`
  display: flex;
  overflow: hidden;
`;

const CafeMenu = styled.div`
  width : 80rem;
  /* flex-grow: 1; */
  height: 90vh;
  overflow-y: scroll;

`;
const SubCafeMenu = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  .images-menu-cafe {
    height: 200px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);

    .images-menu-cafe {
      height: 150px;
    }
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);

    .images-menu-cafe {
      height: 100px;
    }
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);

    .images-menu-cafe {
      height: 100px;
    }
  }
  @media (max-width: 820px) {
    grid-template-columns: repeat(3, 1fr);

    .images-menu-cafe {
      height: 100px;
    }
  }
`;

const CafeCart = styled.div`
  width: 60rem;
  background-color: #fff;
  max-height: 90vh;
  border-color: black;
  overflow-y: scroll;
  border-width: 1;
  padding-left: 20;
  padding-top: 20;
  margin-top : 15px;


  @media (max-width: 768px) {
    width: 80rem;
    margin-top : 15px
  }
  @media (max-width: 820px) {
    width: 80rem;
    margin-top : 15px
  }
  @media (max-width: 900px) {
    width: 80rem;
    margin-top : 15px
  }
`;
export default Homecafe;
