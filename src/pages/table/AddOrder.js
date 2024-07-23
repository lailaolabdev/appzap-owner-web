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
  USB_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  ETHERNET_PRINTER_PORT,
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
import { MdMarkChatRead, MdDelete, MdAdd } from "react-icons/md";
import { RiChatNewFill } from "react-icons/ri";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";

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
  const [isPopup, setIsPupup] = useState(false);
  const [noteItems, setNoteItems] = useState();
  const [addComments, setAddComments] = useState();
  const [editComments, setEditComments] = useState();
  const inputRef = useRef(null); // Create a ref for the input element
  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [itemDeleting, setItemDeleting] = useState();

  const [selectedOptionsArray, setSelectedOptionsArray] = useState([]);
  const [totalPriceOfMenuWithOption, setTotalPriceOfMenuWithOption] = useState(0);

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
          urlForPrinter = ETHERNET_PRINTER_PORT;
        }
        if (_printer?.type === "BLUETOOTH") {
          urlForPrinter = BLUETOOTH_PRINTER_PORT;
        }
        if (_printer?.type === "USB") {
          urlForPrinter = USB_PRINTER_PORT;
        }

        // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

        console.log("dataUrl=5555==========>", dataUrl)
        const _file = await base64ToBlob(dataUrl.toDataURL());
        console.log("_file===========>", _file)
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("port", "9100");
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        bodyFormData.append("image", _file);
        bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);

        console.log("bodyFormData898989898997979>>>>>>>>", bodyFormData)
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


  const handleAddOption = (menuId, option) => {
    console.log({option})
    setSelectedOptionsArray(prevOptions => {
      const menuOptions = prevOptions[menuId] || [];
      const existingOption = menuOptions.find(opt => opt._id === option._id);
  
      if (existingOption) {
        return {
          ...prevOptions,
          [menuId]: menuOptions.map(opt =>
            opt._id === option._id ? { ...opt, quantity: opt.quantity + 1 } : opt
          )
        };
      }
  
      return {
        ...prevOptions,
        [menuId]: [...menuOptions, { ...option, quantity: 1 }]
      };
    });
  };
  
  const handleRemoveOption = (menuId, option) => {
    setSelectedOptionsArray(prevOptions => {
      const menuOptions = prevOptions[menuId] || [];
      const existingOption = menuOptions.find(opt => opt._id === option._id);
  
      if (existingOption && existingOption.quantity > 1) {
        return {
          ...prevOptions,
          [menuId]: menuOptions.map(opt =>
            opt._id === option._id ? { ...opt, quantity: opt.quantity - 1 } : opt
          )
        };
      }
  
      return {
        ...prevOptions,
        [menuId]: menuOptions.filter(opt => opt._id !== option._id)
      };
    });
  };
  
  

  const calculateTotalPrice = (menu, selectedOptionsArray) => {
    console.log({menu})
    if (!menu || !menu._id) {
      return 0;
    }
    
    const menuOptions = selectedOptionsArray[menu._id] || [];
    const optionsTotalPrice = menuOptions.reduce((sum, option) => sum + (option.price * option.quantity), 0);
    return menu.price + optionsTotalPrice;
  };
  


  const handleConfirmOptions = () => {
    console.log("menuOptions: ", menuOptions);
    console.log("selectedItem: ", selectedItem);
    console.log("SelectedOptionsArray: ", selectedOptionsArray);
    console.log("selectedMenu: ", selectedMenu);
  
    const filteredOptions = selectedOptionsArray[selectedItem._id].filter(option => option.quantity >= 1);
  
    const totalOptionPrice = filteredOptions.reduce((total, option) => total + (option.price * option.quantity), 0);
    const quantity = 1;
    
    // the totalPrice is the totalOptionPrice + (price * quantity)
    const data = {
      id: selectedItem._id,
      name: selectedItem.name,
      quantity: quantity,
      price: selectedItem.price,
      categoryId: selectedItem?.categoryId,
      printer: selectedItem?.categoryId?.printer,
      note: "",
      options: filteredOptions,
      totalOptionPrice: totalOptionPrice,
    };
  
    setSelectedMenu(prevMenu => {
      const existingMenuIndex = prevMenu.findIndex(item => item.id === selectedItem._id);
  
      if (existingMenuIndex !== -1) {
        // Menu is already in selectedMenu, increase the quantity and update options
        const updatedMenu = [...prevMenu];
        updatedMenu[existingMenuIndex].quantity += 1;
        updatedMenu[existingMenuIndex].options = filteredOptions;
        updatedMenu[existingMenuIndex].totalOptionPrice = filteredOptions.reduce((total, option) => total + (option.price * option.quantity), 0);
        // updatedMenu[existingMenuIndex].totalPrice = (updatedMenu[existingMenuIndex].price * updatedMenu[existingMenuIndex].quantity) + updatedMenu[existingMenuIndex].totalOptionPrice;
        return updatedMenu;
      } else {
        // Menu is not in selectedMenu, add it
        return [...prevMenu, data];
      }
    });
  
    handleClose();
  };
  
  
  
  



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

  const _checkMenuOption = (menu) => {
    try {
      return menu.menuOptions && menu.menuOptions.length > 0 ? menu.menuOptions : [];
    } catch (error) {
      return [];
    }
  };
  

  // const addToCart = async (menu) => {
  //   const _menuOptions = await _checkMenuOption(menu?._id);
  //   if (_menuOptions.length >= 1) {
  //     setMenuOptions(_menuOptions);
  //     handleShow();
  //     return;
  //   }
  //   setSelectedItem({ ...menu, printer: menu?.categoryId?.printer });
  //   let allowToAdd = true;
  //   let itemIndexInSelectedMenu = 0;
  //   let data = {
  //     id: menu._id,
  //     name: menu.name,
  //     quantity: 1,
  //     price: menu.price,
  //     categoryId: menu?.categoryId,
  //     printer: menu?.categoryId?.printer,
  //     note: "",
  //   };
  //   if (selectedMenu.length === 0) {
  //     setSelectedMenu([...selectedMenu, data]);
  //   } else {
  //     let thisSelectedMenu = [...selectedMenu];
  //     for (let index in thisSelectedMenu) {
  //       if (thisSelectedMenu[index]?.id === menu?._id) {
  //         allowToAdd = false;
  //         itemIndexInSelectedMenu = index;
  //       }
  //     }
  //     if (allowToAdd) {
  //       setSelectedMenu([...selectedMenu, data]);
  //     } else {
  //       let copySelectedMenu = [...selectedMenu];
  //       let currentData = copySelectedMenu[itemIndexInSelectedMenu];
  //       currentData.quantity += 1;
  //       copySelectedMenu[itemIndexInSelectedMenu] = currentData;
  //       setSelectedMenu(copySelectedMenu);
  //     }
  //   }
  // };

  const addToCart = async (menu) => {
    console.log("addToCart: ", menu);
  
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
      };
  
      const existingMenuIndex = selectedMenu.findIndex(item => item.id === menu._id);
  
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
      [menu._id]: _menuOptions.map(option => ({ ...option, quantity: 0 }))
    });
    handleShow();
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
    setIsRemoveItem(false)
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

      console.log("CreateOrder: ", _body)

      // axios
      //   .post(END_POINT_SEVER + "/v3/admin/bill/create", _body, {
      //     headers: headers,
      //   })
      //   .then(async (response) => {
      //     if (response?.data) {
      //       Swal.fire({
      //         icon: "success",
      //         title: "ເພີ່ມອໍເດີສໍາເລັດ",
      //         showConfirmButton: false,
      //         timer: 1800,
      //       });
      //       if (isPrinted) {
      //         //  print
      //         onPrintForCher().then(() => {
      //           onSelectTable(selectedTable);
      //           navigate(
      //             `/tables/pagenumber/1/tableid/${tableId}/${userData?.data?.storeId}`
      //           );
      //         });
      //       } else {
      //         onSelectTable(selectedTable);
      //         navigate(
      //           `/tables/pagenumber/1/tableid/${tableId}/${userData?.data?.storeId}`
      //         );
      //       }
      //     }
      //   })
      //   .catch((error) => {
      //     Swal.fire({
      //       icon: "warning",
      //       title: "ອາຫານບໍ່ພຽງພໍ",
      //       showConfirmButton: false,
      //       timer: 1800,
      //     });
      //     setDisabledButton(false);
      //   });
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
                      <th style={{ border: "none" }}>#</th>
                      <th style={{ border: "none", textAlign: "left" }}>
                        ຊື່ເມນູ
                      </th>
                      <th style={{ border: "none", textAlign: "center" }}>
                        ຈຳນວນ
                      </th>
                      <th style={{ border: "none", textAlign: "right" }}>
                        ຈັດການ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMenu &&
                      selectedMenu.map((data, index) => {
                        // Create the options string if options exist
                        const optionsString = data.options && data.options.length > 0
                          ? data.options
                              .map(option => (option.quantity > 1 ? `[${option.quantity} x ${option.name}]` : `[${option.name}]`))
                              .join(" ")
                          : "";

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
                                alignItems: 'center'
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
                              <p style={{ minWidth: 30, maxWidth: 50 }}>{data.quantity}</p>
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

<Modal show={show} onHide={handleClose} centered>
  <Modal.Header closeButton>
    <Modal.Title>
      <div style={{ fontSize: 24 }}>
        {selectedItem?.name} ({moneyCurrency(selectedItem?.price)} LAK)
      </div>
      <div style={{ fontSize: 18 }}>
        ອ໋ອບຊັນເສີມ: 
        {selectedOptionsArray[selectedItem?._id]?.map((option) => (
          option.quantity > 0 && (
            <span key={option._id} style={{ marginRight: '5px' }}>
              {option.quantity > 1 ? `[${option.quantity} x ${option.name}]` : `[${option.name}]`}
            </span>
          )
        ))}
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
            selectedOptionsArray[selectedItem?._id]?.find((selectedOption) => selectedOption._id === option._id)?.quantity >= 1
              ? { backgroundColor: "#fd8b66", borderRadius: '5px', padding: 5 }
              : {}
          }
        >
          <div>
            <strong>{option.name}</strong> - {moneyCurrency(option.price)} LAK
          </div>
          <div className="d-flex align-items-center">
            <Button variant="outline-secondary" size="sm" onClick={() => handleRemoveOption(selectedItem?._id, option)}>-</Button>
            <span className="mx-2">{selectedOptionsArray[selectedItem?._id]?.find((selectedOption) => selectedOption._id === option._id)?.quantity || 0}</span>
            <Button variant="outline-secondary" size="sm" onClick={() => handleAddOption(selectedItem?._id, option)}>+</Button>
          </div>
        </div>
      ))}
    </Form.Group>
    <div className="mt-3">
      <strong>ລາຄາລວມອ໋ອບຊັນ: {moneyCurrency(calculateTotalPrice(selectedItem, selectedOptionsArray))} LAK</strong>
    </div>
    <Form.Group className="mt-3">
      <Form.Label>
        {selectedItem?.note === "" ? "ຄອມເມັ້ນລົດຊາດອາຫານ" : "ແກ້ໄຂຄອມເມັ້ນ"}
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
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirmOptions}>Confirm</Button>
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
                ? "ຄອມເມັ້ນລົດຊາດອາຫານ"
                : "ແກ້ໄຂຄອມເມັ້ນ"}
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
              placeholder="ປ້ອນຄຳອະທິບາຍ..."
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
                ລຶບທັງໝົດ
              </Button>
            )}
            <Button className="w-100 p-2" onClick={handleAddCommentInCart}>
              {noteItems?.note !== "" ? (
                "ແກ້ໄຂ"
              ) : (
                <>
                  <MdAdd style={{fontSize:28}} />
                  ເພິ່ມໃໝ່
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
        onSubmit={ async () => onRemoveFromCart(itemDeleting.id)}
      />
    </div>
  );
}

export default AddOrder;
