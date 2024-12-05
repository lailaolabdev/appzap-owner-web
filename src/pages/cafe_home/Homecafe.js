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
import { RiListOrdered2 } from "react-icons/ri";

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
import printFlutter from "../../helpers/printFlutter";
import matchRoundNumber from "../../helpers/matchRound";

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
  const [menuOptions, setMenuOptions] = useState([]);
  const { profile } = useStore();
  const [isPopup, setIsPupup] = useState(false);
  const [noteItems, setNoteItems] = useState();
  const [addComments, setAddComments] = useState();
  const [editComments, setEditComments] = useState();
  const inputRef = useRef(null); // Create a ref for the input element
  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [itemDeleting, setItemDeleting] = useState();
  const [dataBill, setDataBill] = useState();
  const [taxPercent, setTaxPercent] = useState(0);
  const [popup, setPopup] = useState({
    CheckOutType: false,
  });
  const [selectedOptionsArray, setSelectedOptionsArray] = useState([]);
  const [total, setTotal] = useState();

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 767px)").matches
  );

  const [cartModal, setCartModal] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null); // Track the row being edited

  useEffect(() => {
    // Function to update state on window resize
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  function handleSetQuantity(int, data) {
    const dataArray = [];
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
    await fetch(`${USERS}/skip/0/limit/0/?storeId=${storeDetail?._id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setUsersData(json));
    // setIsLoading(false);
  };
  const getData = async (id) => {
    await fetch(`${CATEGORY}?storeId=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setCategorys(json));
  };
  const getMenu = async (id) => {
    setIsLoading(true);
    await fetch(
      `${MENUS}?storeId=${id}&${
        selectedCategory === "All" ? "" : `categoryId =${selectedCategory}`
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

  useEffect(() => {
    _calculateTotal();
  }, [selectedMenu]);

  const _calculateTotal = () => {
    let _total = 0;
    for (const _data of selectedMenu || []) {
      const totalOptionPrice = _data?.totalOptionPrice || 0;
      const itemPrice = _data?.price + totalOptionPrice;
      // _total += _data?.totalPrice || (_data?.quantity * itemPrice);
      _total += _data?.quantity * itemPrice;
    }

    const roundedNumber = matchRoundNumber(_total);
    setTotal(roundedNumber);
  };
  // Helper function to sort options by ID
  const sortOptionsById = (options) => {
    return options.sort((a, b) => {
      if (!a._id || !b._id) return 0;
      return a._id.localeCompare(b._id);
    });
  };

  const _checkMenuOption = (menu) => {
    try {
      return menu.menuOptions && menu.menuOptions.length > 0
        ? menu.menuOptions
        : [];
    } catch (error) {
      return [];
    }
  };

  const addToCart = async (menu) => {
    const _menuOptions = _checkMenuOption(menu);

    // If there is no menu options in the selected menu
    if (_menuOptions.length === 0) {
      // Menu has no options, add to cart immediately
      const data = {
        id: menu._id,
        name: menu.name,
        quantity: 1,
        price: menu.price,
        categoryId: menu?.categoryId,
        printer: menu?.categoryId?.printer,
        note: "",
        isWeightMenu: menu?.isWeightMenu,
      };

      const existingMenuIndex = selectedMenu.findIndex(
        (item) => item.id === menu._id
      );

      if (existingMenuIndex !== -1) {
        // Menu is already in selectedMenu, increase the quantity
        const updatedMenu = [...selectedMenu];
        updatedMenu[existingMenuIndex].quantity += 1;
        setSelectedMenu(updatedMenu);
      } else {
        // Menu is not in selectedMenu, add it
        setSelectedMenu([...selectedMenu, data]);
      }

      // setSelectedItem({ ...menu, printer: menu?.categoryId?.printer });
      return;
    }

    // Menu has options, show popup
    setMenuOptions(_menuOptions);
    setSelectedItem({ ...menu, printer: menu?.categoryId?.printer });
    setSelectedOptionsArray({
      [menu._id]: _menuOptions.map((option) => ({ ...option, quantity: 0 })),
    });
    handleShow();
  };
  const handleAddOption = (menuId, option) => {
    setSelectedOptionsArray((prevOptions) => {
      const menuOptions = prevOptions[menuId] || [];
      const existingOption = menuOptions.find((opt) => opt._id === option._id);

      if (existingOption) {
        return {
          ...prevOptions,
          [menuId]: menuOptions.map((opt) =>
            opt._id === option._id
              ? { ...opt, quantity: opt.quantity + 1 }
              : opt
          ),
        };
      }

      return {
        ...prevOptions,
        [menuId]: [...menuOptions, { ...option, quantity: 1 }],
      };
    });
  };

  const handleRemoveOption = (menuId, option) => {
    setSelectedOptionsArray((prevOptions) => {
      const menuOptions = prevOptions[menuId] || [];
      const existingOption = menuOptions.find((opt) => opt._id === option._id);

      if (existingOption && existingOption.quantity > 1) {
        return {
          ...prevOptions,
          [menuId]: menuOptions.map((opt) =>
            opt._id === option._id
              ? { ...opt, quantity: opt.quantity - 1 }
              : opt
          ),
        };
      }

      return {
        ...prevOptions,
        [menuId]: menuOptions.filter((opt) => opt._id !== option._id),
      };
    });
  };

  const calculateTotalPrice = (menu, selectedOptionsArray) => {
    if (!menu || !menu._id) {
      return 0;
    }

    const menuOptions = selectedOptionsArray[menu._id] || [];
    const optionsTotalPrice = menuOptions.reduce(
      (sum, option) => sum + option.price * option.quantity,
      0
    );
    return menu.price + optionsTotalPrice;
  };

  const handleConfirmOptions = () => {
    const filteredOptions =
      selectedOptionsArray[selectedItem._id]?.filter(
        (option) => option.quantity >= 1
      ) || [];

    const sortedFilteredOptionsForComparison = sortOptionsById([
      ...filteredOptions,
    ]);

    const totalOptionPrice = filteredOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0
    );
    const quantity = 1;

    const data = {
      id: selectedItem._id,
      name: selectedItem.name,
      quantity: quantity,
      price: selectedItem.price,
      categoryId: selectedItem?.categoryId,
      printer: selectedItem?.categoryId?.printer,
      note: addComments,
      menuOptions: selectedItem.menuOptions,
      options: filteredOptions,
      totalOptionPrice: totalOptionPrice,
      isWeightMenu: selectedItem?.isWeightMenu,
    };

    setSelectedMenu((prevMenu) => {
      // Check if the menu item with the same ID and options already exists
      const existingMenuIndex = prevMenu.findIndex((item) => {
        const sortedItemOptionsForComparison = item.options
          ? sortOptionsById([...item.options])
          : [];
        return (
          item.id === selectedItem._id &&
          JSON.stringify(sortedItemOptionsForComparison) ===
            JSON.stringify(sortedFilteredOptionsForComparison)
        );
      });

      if (existingMenuIndex !== -1) {
        // Menu is already in selectedMenu, increase the quantity and update options
        const updatedMenu = [...prevMenu];
        updatedMenu[existingMenuIndex].quantity += 1;
        updatedMenu[existingMenuIndex].options = filteredOptions;
        updatedMenu[existingMenuIndex].totalOptionPrice =
          filteredOptions.reduce(
            (total, option) => total + option.price * option.quantity,
            0
          );
        updatedMenu[existingMenuIndex].totalPrice =
          updatedMenu[existingMenuIndex].price *
            updatedMenu[existingMenuIndex].quantity +
          updatedMenu[existingMenuIndex].totalOptionPrice;
        return updatedMenu;
      } else {
        // Menu is not in selectedMenu, add it
        return [...prevMenu, data];
      }
    });

    handleClose();
  };

  const AlertMessage = () => {
    Swal.fire({
      icon: "error",
      title: "ກະລຸນາເລຶອກລາຍການສິນຄ້າກ່ອນ",
      showConfirmButton: false,
      timer: 2500,
    });
  };

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
    const selectedMenuCopied = [...selectedMenu];
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

  const handleAddCommentInCart = () => {
    const dataArray = [];
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
    const dataArray = [];
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

  const qrSmartOrder80Ref = useRef(null);

  const bill80Ref = useRef(null);
  const bill58Ref = useRef(null);

  useLayoutEffect(() => {
    setWidthBill80(bill80Ref.current.offsetWidth);
    // setWidthBill58(bill58Ref.current.offsetWidth);
  }, [bill80Ref, bill58Ref]);

  // ສ້າງປະຫວັດການພິມບິນຂອງແຕ່ລະໂຕະ
  const _createHistoriesPrinter = async (data) => {
    try {
      const headers = await getHeaders();
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
      const _dataBill = {
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
      await printFlutter(
        {
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9100",
          width: printerBillData?.width === "58mm" ? 400 : 580,
        },
        async () => {
          await axios({
            method: "post",
            url: urlForPrinter,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      );

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

  const { t } = useTranslation();

  // const handleQuantityChange = (e, row) => {
  //   const updatedQuantity = Number.parseFloat(e.target.value) || 0; // Ensure it's a valid number
  //   const updatedMenu = selectedMenu.map((item) =>
  //     item.id === row.id ? { ...item, quantity: updatedQuantity } : item
  //   );
  //   setSelectedMenu(updatedMenu);
  // };
  const handleQuantityChange = (e, row) => {
    const floatQuantity = Number.parseFloat(e.target.value) || 0; // Ensure it's a valid number
    const index = selectedMenu.findIndex((item) => item.id === row.id); // Find the index of the item

    if (index !== -1) {
      // Update the item at the found index
      const updatedMenu = [...selectedMenu];
      updatedMenu[index] = { ...updatedMenu[index], quantity: floatQuantity };

      setSelectedMenu(updatedMenu);
    }
  };

  const saveQuantity = () => {
    setEditingRowId(null); // Exit editing mode
  };

  return (
    <div>
      <CafeContent
        style={{
          position: "relative",
        }}
      >
        <CafeMenu>
          {/* <div
            style={{
              padding: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: 20,
            }}
          >
            <div>
              <label>{t("choose_food_type")}</label>
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
          </div> */}

          <div className="py-2 sticky top-0 z-10 bg-white flex flex-col">
            <div className="w-full px-2 py-1">
              <input
                placeholder={t("search")}
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full overflow-x-scroll flex flex-row whitespace-nowrap p-2 gap-2">
              <button
                key={"category-all"}
                className={`${
                  selectedCategory === "All"
                    ? "text-orange-500"
                    : "text-gray-700"
                } rounded-full px-3 py-2 shadow-button min-w-20 w-fit font-semibold text-sm whitespace-nowrap`}
                onClick={() => setSelectedCategory("All")}
              >
                {t("all")}
              </button>
              {Categorys &&
                Categorys.map((data, index) => {
                  return (
                    <button
                      key={"category" + index}
                      className={`${
                        selectedCategory === data?._id
                          ? "text-orange-500"
                          : "text-gray-700"
                      } rounded-full px-3 py-2 shadow-button !min-w-20 font-semibold text-sm whitespace-nowrap`}
                      onClick={() => setSelectedCategory(data?._id)}
                    >
                      {data?.name}
                    </button>
                  );
                })}
            </div>
          </div>

          <div
            className={
              afterSearch.length === 0
                ? "grid grid-cols-1 px-2"
                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-2"
            }
          >
            {isLoading ? (
              <Loading />
            ) : afterSearch.length === 0 ? (
              <div className="w-full pt-36 flex justify-center items-center">
                <p>ຍັງບໍ່ມີລາຍການນີ້</p>
              </div>
            ) : (
              afterSearch?.map((data, index) => {
                if (data?.type === "MENU") {
                  return (
                    <div
                      key={"menu" + index}
                      onClick={() => {
                        addToCart(data);
                      }}
                      className="rounded-lg border border-orange-400 shadow-sm cursor-pointer overflow-hidden"
                    >
                      <div className="relative w-full pt-[75%] overflow-hidden">
                        <img
                          src={
                            data?.images[0]
                              ? URL_PHOTO_AW3 + data?.images[0]
                              : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
                          }
                          alt=""
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-white h-full text-gray-700 relative px-2 py-1">
                        <span className="text-sm">{data?.name}</span>
                        <br />
                        <span className="text-orange-600 font-medium text-base">
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
                        <span className="text-[13px] text-gray-500">
                          {t("amount_exist")} : {data?.quantity || 0}
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })
            )}
          </div>
        </CafeMenu>

        {!isMobile ? (
          <div className="w-[480px] lg:w-[560px] max-w-[480px] lg:max-w-[560px] min-w-[480px] lg:min-w-[560px] h-[90vh] overflow-y-scroll bg-white border-gray-500 ">
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
                          {t("price")}
                        </th>
                        <th style={{ border: "none", textAlign: "right" }}>
                          {t("manage")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMenu &&
                        selectedMenu.map((data, index) => {
                          // Create the options string if options exist
                          const optionsString =
                            data.options && data.options.length > 0
                              ? data.options
                                  .map((option) =>
                                    option.quantity > 1
                                      ? `[${option.quantity} x ${option.name}]`
                                      : `[${option.name}]`
                                  )
                                  .join(" ")
                              : "";
                          const totalOptionPrice = data?.totalOptionPrice || 0;
                          const itemPrice = data?.price + totalOptionPrice;
                          return (
                            <tr key={"selectMenu" + index}>
                              <td style={{ width: 20 }}>{index + 1}</td>
                              <td
                                style={{ textAlign: "left", paddingBottom: 0 }}
                              >
                                <p>{`${data.name} ${optionsString}`}</p>
                                <p
                                  style={{ fontSize: 12, marginTop: "-1.5em" }}
                                >
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
                                  }}
                                  onClick={() => handleSetQuantity(-1, data)}
                                >
                                  -
                                </button>
                                {editingRowId === data.id ? (
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={data.quantity}
                                    autoFocus
                                    onChange={(e) =>
                                      handleQuantityChange(e, data)
                                    }
                                    onBlur={() => saveQuantity()}
                                    style={{
                                      width: "60px",
                                      textAlign: "center",
                                      border: "2px solid #fb6e3b",
                                      borderRadius: "5px",
                                      padding: "2px",
                                      outline: "none",
                                    }}
                                  />
                                ) : data?.isWeightMenu ? (
                                  <p
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      gap: 10,
                                      margin: "0px 5px",
                                      cursor: "pointer",
                                      border: "2px solid #fb6e3b",
                                      borderRadius: "5px",
                                      padding: "2px",
                                    }}
                                    onClick={() => setEditingRowId(data?.id)}
                                  >
                                    {Number.parseFloat(data?.quantity).toFixed(
                                      3
                                    )}
                                  </p>
                                ) : (
                                  <p
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      gap: 10,
                                      margin: "0px 5px",
                                    }}
                                  >
                                    {data?.quantity}
                                  </p>
                                )}
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
                                <p>{moneyCurrency(itemPrice)}</p>
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
                        <span>
                          {Number.parseFloat(TotalAmount()).toFixed(3)}
                        </span>
                      </div>
                      <div>
                        <span>{t("pricesTotal")} : </span>
                        <span>
                          {moneyCurrency(total)} {t("nameCurrency")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-12">
                  <div className="row" style={{ margin: 0 }}>
                    {selectedMenu.length > 0 ? (
                      <>
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
                            selectedMenu.length === 0
                              ? AlertMessage()
                              : setPopup({ CheckOutType: true });
                          }}
                        >
                          {/* {t("print_bill")} */}
                          CheckOut
                        </Button>
                      </>
                    ) : (
                      ""
                    )}
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
          </div>
        ) : null}
      </CafeContent>

      {isMobile ? (
        <button
          className="d-flex justify-content-center align-items-center"
          type="button"
          style={{
            position: "absolute",
            bottom: "5%",
            display: "fixed",
            right: "5%",
            backgroundColor: "#FB6E3B",
            color: "#ffffff",
            fontWeight: "bold",
            border: "none",
            padding: "10px 20px",
            fontSize: 20,
          }}
          onClick={() => setCartModal(true)}
        >
          <RiListOrdered2 />
          ກະຕ່າລາຍການ
          <span style={{ marginLeft: "5px" }}>({selectedMenu.length})</span>
        </button>
      ) : null}

      <Modal
        show={cartModal}
        centered
        size="lg"
        onHide={() => setCartModal(false)}
      >
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div
                className="col-lg-12 col-md-12"
                style={{
                  maxHeight: 500,
                  overflow: "auto",
                }}
              >
                <Table responsive className="table">
                  <thead style={{ backgroundColor: "#F1F1F1" }}>
                    <tr style={{ fontSize: "bold", border: "none" }}>
                      <th style={{ border: "none", textWrap: "nowrap" }}>#</th>
                      <th
                        style={{
                          border: "none",
                          textWrap: "nowrap",
                          textAlign: "left",
                        }}
                      >
                        {t("menu_name")}
                      </th>
                      <th
                        style={{
                          border: "none",
                          textWrap: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {t("amount")}
                      </th>
                      <th
                        style={{
                          border: "none",
                          textWrap: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {t("price")}
                      </th>
                      <th
                        style={{
                          border: "none",
                          textWrap: "nowrap",
                          textAlign: "right",
                        }}
                      >
                        {t("manage")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMenu?.map((data, index) => {
                      // Create the options string if options exist
                      const optionsString =
                        data.options && data.options.length > 0
                          ? data.options
                              .map((option) =>
                                option.quantity > 1
                                  ? `[${option.quantity} x ${option.name}]`
                                  : `[${option.name}]`
                              )
                              .join(" ")
                          : "";
                      const totalOptionPrice = data?.totalOptionPrice || 0;
                      const itemPrice = data?.price + totalOptionPrice;
                      return (
                        <tr key={"selectMenu" + index}>
                          <td style={{ width: 20 }}>{index + 1}</td>
                          <td style={{ textAlign: "left", paddingBottom: 0 }}>
                            <p>{`${data.name} ${optionsString}`}</p>
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
                              }}
                              onClick={() => handleSetQuantity(-1, data)}
                            >
                              -
                            </button>
                            {editingRowId === data.id ? (
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={data.quantity}
                                autoFocus
                                onChange={(e) => handleQuantityChange(e, data)}
                                onBlur={() => saveQuantity()}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "2px",
                                  margin: "0px 5px",
                                  cursor: "pointer",
                                  border: "2px solid #fb6e3b",
                                  borderRadius: "5px",
                                  fontSize: 14,
                                }}
                              />
                            ) : data?.isWeightMenu ? (
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: 10,
                                  margin: "0px 5px",
                                  cursor: "pointer",
                                  border: "2px solid #fb6e3b",
                                  borderRadius: "5px",
                                  fontSize: 14,
                                }}
                                onClick={() => setEditingRowId(data?.id)}
                              >
                                {Number.parseFloat(data?.quantity).toFixed(3)}
                              </p>
                            ) : (
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: 10,
                                  margin: "0px 5px",
                                }}
                              >
                                {data?.quantity}
                              </p>
                            )}
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
                            <p>{moneyCurrency(itemPrice)}</p>
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
              </div>
              <div className="col-12">
                {selectedMenu.length > 0 ? (
                  <div className="mb-3">
                    <div>
                      <span>{t("amountTotal")} : </span>
                      <span>
                        {Number.parseFloat(TotalAmount()).toFixed(3)}{" "}
                      </span>
                    </div>
                    <div>
                      <span>{t("pricesTotal")} : </span>
                      <span>
                        {moneyCurrency(total)} {t("nameCurrency")}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="row" style={{ margin: 0 }}>
                  {selectedMenu.length > 0 ? (
                    <>
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
                          selectedMenu.length === 0
                            ? AlertMessage()
                            : setPopup({ CheckOutType: true });
                        }}
                      >
                        {/* {t("print_bill")} */}
                        CheckOut
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
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
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div style={{ fontSize: 24 }}>
              {selectedItem?.name} ({moneyCurrency(selectedItem?.price)} LAK)
            </div>
            <div style={{ fontSize: 18 }}>
              {t("menu_option")}:
              {selectedOptionsArray[selectedItem?._id]?.map(
                (option) =>
                  option.quantity > 0 && (
                    <span key={option._id} style={{ marginRight: "5px" }}>
                      {option.quantity > 1
                        ? `[${option.quantity} x ${option.name}]`
                        : `[${option.name}]`}
                    </span>
                  )
              )}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            {menuOptions.map((option, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center mb-2"
                style={
                  selectedOptionsArray[selectedItem?._id]?.find(
                    (selectedOption) => selectedOption._id === option._id
                  )?.quantity >= 1
                    ? {
                        backgroundColor: "#fd8b66",
                        borderRadius: "5px",
                        padding: 5,
                      }
                    : {}
                }
              >
                <div>
                  <strong>{option.name}</strong> - {moneyCurrency(option.price)}{" "}
                  LAK
                </div>
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      handleRemoveOption(selectedItem?._id, option)
                    }
                  >
                    -
                  </Button>
                  <span className="mx-2">
                    {selectedOptionsArray[selectedItem?._id]?.find(
                      (selectedOption) => selectedOption._id === option._id
                    )?.quantity || 0}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleAddOption(selectedItem?._id, option)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </Form.Group>
          <div className="mt-3">
            <strong>
              ລາຄາລວມອ໋ອບຊັນ:{" "}
              {moneyCurrency(
                calculateTotalPrice(selectedItem, selectedOptionsArray)
              )}{" "}
              LAK
            </strong>
          </div>
          <Form.Group className="mt-3">
            <Form.Label>
              {selectedItem?.note === ""
                ? "ຄອມເມັ້ນລົດຊາດອາຫານ"
                : "ແກ້ໄຂຄອມເມັ້ນ"}
            </Form.Label>
            <Form.Control
              ref={selectedItem?.note === "" ? inputRef : null}
              as="textarea"
              rows={3}
              value={addComments}
              onChange={(e) => setAddComments(e.target.value)}
              placeholder="ປ້ອນຄຳອະທິບາຍ..."
              className="w-100"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button variant="primary" onClick={handleConfirmOptions}>
            {t("confirm")}
          </Button>
        </Modal.Footer>
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
        setIsLoading={setIsLoading}
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
  width: 80rem;
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
  margin-top: 15px;

  @media (max-width: 768px) {
    width: 80rem;
    margin-top: 15px;
  }
  @media (max-width: 820px) {
    width: 80rem;
    margin-top: 15px;
  }
  @media (max-width: 900px) {
    width: 80rem;
    margin-top: 15px;
  }
`;
export default Homecafe;
