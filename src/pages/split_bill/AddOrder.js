import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import axios from "axios";
import ReactToPrint from "react-to-print";
import _ from "lodash";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import { printItems } from "./printItems";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Button, Modal, Form, Nav, Image } from "react-bootstrap";
import { useLocation } from "react-router-dom";

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
  NOCUT_ETHERNET_PRINTER_PORT,
  NOCUT_BLUETOOTH_PRINTER_PORT,
  NOCUT_USB_PRINTER_PORT,
} from "../../constants/index";

import {
  CATEGORY,
  END_POINT_SEVER_TABLE_MENU,
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

import CombinedBillForChefNoCut from "../../components/bill/CombinedBillForChefNoCut";
import { MdMarkChatRead, MdDelete, MdAdd } from "react-icons/md";
import { RiChatNewFill } from "react-icons/ri";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import printFlutter from "../../helpers/printFlutter";

import { useStoreStore } from "../../zustand/storeStore";
import { useMenuStore } from "../../zustand/menuStore";

function AddOrder() {
  const { state } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const code = params?.code;
  const tableId = params?.tableId;
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);

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
  const [totalPriceOfMenuWithOption, setTotalPriceOfMenuWithOption] =
    useState(0);

  const [combinedBillRefs, setCombinedBillRefs] = useState({});
  const [groupedItems, setGroupedItems] = useState({});

  useEffect(() => {
    // Check if the modal is shown and if the ref is attached to an element
    if (isPopup && inputRef.current) {
      inputRef.current.focus(); // Set focus when the modal is shown
    }
  }, [isPopup]);

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setAddComments("");
    setShow(false);
  };

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

  const handleSetQuantity = (int, data) => {
    let dataArray = [];

    // Ensure data.options is defined and is an array
    const sortedDataOptionsForComparison = Array.isArray(data?.options)
      ? sortOptionsById([...data.options])
      : [];

    console.log({ selectedMenu });

    for (const i of selectedMenu) {
      let _data = { ...i };

      // Ensure i.options is defined and is an array
      const sortedItemOptionsForComparison = Array.isArray(i?.options)
        ? sortOptionsById([...i.options])
        : [];

      if (
        data?.id === i?.id &&
        JSON.stringify(sortedDataOptionsForComparison) ===
          JSON.stringify(sortedItemOptionsForComparison)
      ) {
        _data = { ..._data, quantity: (_data?.quantity || 0) + int };
      }

      if (_data.quantity > 0) {
        dataArray.push(_data);
      }
    }

    console.log("ORDER DATA: ", dataArray);

    setSelectedMenu(dataArray);
  };

  // Helper function to sort options by ID
  const sortOptionsById = (options) => {
    return options.sort((a, b) => {
      if (!a._id || !b._id) return 0;
      return a._id.localeCompare(b._id);
    });
  };

  const { printers, selectedTable, onSelectTable } = useStore();
  const { storeDetail } = useStoreStore();
  const [currency, setCurrency] = useState([]);

  const [search, setSearch] = useState("");

  const {
    menus,
    menuCategories,
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
  } = useMenuStore();

  // Get Menus & Categories, and persist it in localstorage.
  // Only no data in localstorage then fetch, if when to clear data just logout
  useEffect(() => {
    const fetchData = async () => {
      if (storeDetail?._id) {
        const storeId = storeDetail?._id;

        // Check if menus and categories are already in the zustand store
        if (!menus.length || !menuCategories.length) {
          // If menus or categories are not found, fetch them
          if (!menus.length) {
            const fetchedMenus = await getMenus(storeId);
            setMenus(fetchedMenus); // Save to zustand store
          }
          if (!menuCategories.length) {
            const fetchedCategories = await getMenuCategories(storeId);
            setMenuCategories(fetchedCategories); // Save to zustand store
          }
        }
      }
    };

    fetchData();
  }, [
    menus,
    menuCategories,
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
  ]);

  const afterSearch = _.filter(
    menus,
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

        console.log("dataUrl=5555==========>", dataUrl);
        const _file = await base64ToBlob(dataUrl.toDataURL());
        console.log("_file===========>", _file);
        var bodyFormData = new FormData();
        bodyFormData.append("isdrawer", false);
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("port", "9100");
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        bodyFormData.append("image", _file);
        bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);

        console.log("bodyFormData898989898997979>>>>>>>>", bodyFormData);
        console.log("onPrintFlutter: =======");
        await printFlutter(
          {
            imageBuffer: dataUrl.toDataURL(),
            ip: _printer?.ip,
            type: _printer?.type,
            port: "9100",
            beep: 1,
            width: _printer?.width === "58mm" ? 400 : 580,
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
        // await axios({
        //   method: "post",
        //   url: urlForPrinter,
        //   data: bodyFormData,
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
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

  /**
   * Group Items By Printer
   */
  useEffect(() => {
    const refs = {};
    const grouped = groupItemsByPrinter(selectedMenu);
    // Create refs for each printer IP
    Object.keys(grouped).forEach((printerIp) => {
      refs[printerIp] = React.createRef();
    });
    console.log("refs: ", refs);
    setCombinedBillRefs(refs);
    setGroupedItems(grouped);
  }, [selectedMenu]);

  // Function to group items by printer
  const groupItemsByPrinter = (items) => {
    return items.reduce((groups, item) => {
      const printer = printers.find((e) => e?._id === item.printer);
      const printerIp = printer?.ip || "unknown";
      if (!groups[printerIp]) {
        groups[printerIp] = [];
      }
      groups[printerIp].push(item);
      return groups;
    }, {});
  };

  useEffect(() => {
    // TODO: check selectTable
    if (!selectedTable) {
      navigate("/tables");
    }
  }, [selectedTable]);

  const handleAddOption = (menuId, option) => {
    console.log({ option });
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
    console.log("menuOptions: ", menuOptions);
    console.log("selectedItem: ", selectedItem);
    console.log("SelectedOptionsArray: ", selectedOptionsArray);
    console.log("selectedMenu: ", selectedMenu);

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

  const _checkMenuOption = (menu) => {
    try {
      return menu.menuOptions && menu.menuOptions.length > 0
        ? menu.menuOptions
        : [];
    } catch (error) {
      return [];
    }
  };

  const _checkSelectedMenuOption = (menu) => {
    try {
      return menu.options && menu.options.length > 0 ? menu.options : [];
    } catch (error) {
      return [];
    }
  };

  const addToCart = async (menu) => {
    console.log("addToCart: ", menu);

    const _menuOptions = _checkMenuOption(menu);

    console.log("menuOptions: ", _menuOptions);

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

  const createOrder = async (data, header, isPrinted) => {
    try {
      const _storeId = storeDetail._id;
      const _billId = selectedTable?.billId;

      if (!_billId) {
        Swal.fire({
          icon: "error",
          title: `${t("not_success")}`,
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

      const localZone = localStorage.getItem("selectedZone");

      const response = await axios.post(
        END_POINT_SEVER_TABLE_MENU + "/v3/admin/bill/create",
        _body,
        { headers }
      );

      if (response?.data) {
        Swal.fire({
          icon: "success",
          title: `${t("add_order_success")}`,
          showConfirmButton: false,
          timer: 1800,
        });

        if (isPrinted) {
          const selectedPrinterIds = selectedMenu.map((e) => e.printer);
          const pickedUpPrinters = printers.filter((printer) =>
            selectedPrinterIds.includes(printer._id)
          );

          const hasNoCut = pickedUpPrinters.some(
            (printer) => printer.cutPaper === "not_cut"
          );

          if (hasNoCut) {
            printItems(
              groupedItems,
              combinedBillRefs,
              printers,
              selectedTable
            ).then(() => {
              onSelectTable(selectedTable);
              navigate(
                `/tables/pagenumber/1/tableid/${tableId}/${storeDetail?._id}`,
                { state: { zoneId: localZone } }
              );
            });
          } else {
            onPrintForCher().then(() => {
              onSelectTable(selectedTable);
              navigate(
                `/tables/pagenumber/1/tableid/${tableId}/${storeDetail?._id}`,
                { state: { zoneId: localZone } }
              );
            });
          }
        } else {
          onSelectTable(selectedTable);
          navigate(
            `/tables/pagenumber/1/tableid/${tableId}/${storeDetail?._id}`,
            { state: { zoneId: localZone } }
          );
        }
      }
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "error",
        title: `${t("not_success")}`,
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
          title: `${t("please_chose_order_first")}`,
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

  const onEditOrder = (menu) => {
    console.log("onEditOrder: ", menu);
    const menuOptions = _checkMenuOption(menu);
    console.log("menuOptions: ", menuOptions);

    // Get the selected options from the menu with their quantities
    const selectedOptions = menu.options || [];

    // Menu has options, show popup
    setMenuOptions(menuOptions);
    setSelectedItem({ ...menu, printer: menu?.categoryId?.printer });

    setSelectedOptionsArray({
      [menu._id]: menuOptions.map((option) => {
        const selectedOption = selectedOptions.find(
          (opt) => opt._id === option._id
        );
        return {
          ...option,
          quantity: selectedOption ? selectedOption.quantity : 0,
        };
      }),
    });

    handleShow();

    // setIsPupup(true);
    // setNoteItems(menu);
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
              <label>{t("chose_food_type")}</label>
              <select
                className="form-control"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">{t("all")}</option>
                {menuCategories &&
                  menuCategories?.map((data, index) => {
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
                        <span>
                          {t("amount_exist")} : {data?.quantity}
                        </span>
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
                        {t("menu_name")}
                      </th>
                      <th style={{ border: "none", textAlign: "center" }}>
                        {t("amount")}
                      </th>
                      <th style={{ border: "none", textAlign: "right" }}>
                        {t("order_food")}
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
                              <p style={{ minWidth: 30, maxWidth: 50 }}>
                                {data.quantity}
                              </p>
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
                              {/* <i
                                onClick={() => onRemoveFromCart(data.id)}
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={{
                                  color: "#FB6E3B",
                                  cursor: "pointer",
                                }}
                              ></i> */}

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
                        `/tables/pagenumber/1/tableid/${tableId}/${storeDetail?._id}`
                      )
                    }
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
                    disabled={disabledButton}
                    onClick={() => {
                      setDisabledButton(true);
                      onSubmit(false);
                    }}
                  >
                    {t("order_food")}
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
                    {t("order_and_send_to_kitchen")} +{" "}
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

      {/* Bill Print for each item (Cut) */}
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

      {/* Render the combined bill for 80mm */}
      <div>
        {Object.entries(groupedItems).map(([printerIp, items]) => (
          <div key={printerIp}>
            <div
              style={{
                width: "80mm",
                paddingRight: "20px",
              }}
              ref={combinedBillRefs[printerIp]}
            >
              <CombinedBillForChefNoCut
                storeDetail={storeDetail}
                selectedTable={selectedTable}
                selectedMenu={items}
                table={{ tableId: { name: selectedTable?.tableName } }}
              />
            </div>
          </div>
        ))}
      </div>

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
              {t("total_price_with_options")}:{" "}
              {moneyCurrency(
                calculateTotalPrice(selectedItem, selectedOptionsArray)
              )}{" "}
              LAK
            </strong>
          </div>
          <Form.Group className="mt-3">
            <Form.Label>
              {selectedItem?.note === ""
                ? t("comment_taste")
                : t("edit_comment")}
            </Form.Label>
            <Form.Control
              ref={selectedItem?.note === "" ? inputRef : null}
              as="textarea"
              rows={3}
              value={addComments}
              onChange={(e) => setAddComments(e.target.value)}
              placeholder={t("fill_desc")}
              className="w-100"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmOptions}>
            Confirm
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
    </div>
  );
}

export default AddOrder;
