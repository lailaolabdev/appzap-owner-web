import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import axios from "axios";
import _ from "lodash";
import Swal from "sweetalert2";
import { base64ToBlob } from "../../helpers";
import { printItems } from "./printItems";
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
import PopUpAddDeliveryCode from "../../components/popup/PopUpAddDeliveryCode";
import printFlutter from "../../helpers/printFlutter";
import moment from "moment";
import { cn } from "../../utils/cn";
import { fontMap } from "../../utils/font-map";

import { useStoreStore } from "../../zustand/storeStore";
import { useMenuStore } from "../../zustand/menuStore"; 

function AddOrder() {
  const { state } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const code = params?.code;
  const tableId = params?.tableId;
  const [billId, setBillId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
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
  const { profile, setPrintBackground } = useStore();
  const [isPopup, setIsPupup] = useState(false);
  const [noteItems, setNoteItems] = useState();
  const [addComments, setAddComments] = useState();
  const [editComments, setEditComments] = useState();
  const inputRef = useRef(null); // Create a ref for the input element
  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [isShowDeliveryPopup, setIsShowDeliveryPopup] = useState(false);
  const [itemDeleting, setItemDeleting] = useState();

  const [selectedOptionsArray, setSelectedOptionsArray] = useState([]);
  const [disableNotDeliveryCode, setDisableNotDeliveryCode] = useState(true);

  const [combinedBillRefs, setCombinedBillRefs] = useState({});
  const [groupedItems, setGroupedItems] = useState({});

  const sliderRef = useRef();

  console.log({code})

  // Make the Category draggable
  useEffect(() => {
    const slider = sliderRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sliderRef]);

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


  const handleChangeConnectMenu = (e) => {
    setConnectMenuId(e.target.value);
  };

  const handleSetQuantity = (int, data) => {
    let dataArray = [];

    // Ensure data.options is defined and is an array
    const sortedDataOptionsForComparison = Array.isArray(data?.options)
      ? sortOptionsById([...data.options])
      : [];

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
    setSelectedMenu(dataArray);
  };

  // Helper function to sort options by ID
  const sortOptionsById = (options) => {
    return options.sort((a, b) => {
      if (!a._id || !b._id) return 0;
      return a._id.localeCompare(b._id);
    });
  };

  const {
    printers,
    selectedTable,
    onSelectTable,
    selectedBill,
    tableOrderItems,
  } = useStore();

  console.log({selectedTable})

  const { storeDetail } = useStoreStore()

  const [search, setSearch] = useState("");

  const { menus, menuCategories, getMenus, getMenuCategories, setMenus, setMenuCategories } = useMenuStore();

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
  }, [menus, menuCategories, getMenus, getMenuCategories, setMenus, setMenuCategories]);

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

  const [onPrinting, setOnPrinting] = useState(false);
  const [countError, setCountError] = useState("");
  const onPrintForCher = async () => {
    try {
      setOnPrinting(true);
      setCountError("");

      const base64ArrayAndPrinter = convertHtmlToBase64(selectedMenu);

      let arrayPrint = [];
      for (var index = 0; index < base64ArrayAndPrinter.length; index++) {
        arrayPrint.push(
          runPrint(
            base64ArrayAndPrinter[index].dataUrl,
            index,
            base64ArrayAndPrinter[index].printer
          )
        );
      }
      if (countError == "ERR") {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "ປິ້ນບໍ່ສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "ປິ້ນສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setOnPrinting(false);
      setPrintBackground((prev) => [...prev, ...arrayPrint]);
    } catch (error) {
      setIsLoading(false);
      setOnPrinting(false);
    }
  };

  const runPrint = async (dataUrl, index, printer) => {
    try {
      const printFile = base64ToBlob(dataUrl);
      var bodyFormData = new FormData();

      bodyFormData.append("ip", printer?.ip);
      if (index === 0) {
        bodyFormData.append("beep1", 1);
        bodyFormData.append("beep2", 9);
      }
      bodyFormData.append("isdrawer", false);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", printFile);
      bodyFormData.append("paper", printer?.width === "58mm" ? 58 : 80);

      let urlForPrinter = "";
      if (printer?.type === "ETHERNET") urlForPrinter = ETHERNET_PRINTER_PORT;
      if (printer?.type === "BLUETOOTH") urlForPrinter = BLUETOOTH_PRINTER_PORT;
      if (printer?.type === "USB") urlForPrinter = USB_PRINTER_PORT;

      await printFlutter(
        {
          imageBuffer: dataUrl,
          ip: printer?.ip,
          type: printer?.type,
          port: "9100",
          width: printer?.width === "58mm" ? 400 : 580,
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
      return true;
    } catch {
      return false;
    }
  };

  const convertHtmlToBase64 = (orderSelect) => {
    const base64ArrayAndPrinter = [];
    orderSelect.forEach((data, index) => {
      if (data) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Define base dimensions
        const baseHeight = 250;
        const extraHeightPerOption = 30;
        const extraHeightForNote = data?.note ? 40 : 0;
        const dynamicHeight =
          baseHeight +
          (data.options?.length || 0) * extraHeightPerOption +
          extraHeightForNote;
        const width = 510;

        canvas.width = width;
        canvas.height = dynamicHeight;

        // Set white background
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, dynamicHeight);

        // Helper function for text wrapping
        function wrapText(context, text, x, y, maxWidth, lineHeight) {
          const words = text.split(" ");
          let line = "";
          for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              context.fillText(line, x, y);
              line = words[n] + " ";
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          context.fillText(line, x, y);
          return y + lineHeight;
        }

        // Header: Table Name and Code
        // Draw the Table ID (left black block)
        context.fillStyle = "#000"; // Black background
        context.fillRect(0, 0, width / 2, 60); // Black block width / 2
        context.fillStyle = "#fff"; // White text
        context.font = "bold 36px NotoSansLao, Arial, sans-serif";
        context.fillText(selectedTable?.tableName, 10, 45); // Table ID text

        // Draw the Table Code (right side)
        context.fillStyle = "#000"; // Black text
        context.font = "bold 30px NotoSansLao, Arial, sans-serif";
        context.fillText(selectedTable?.code, width - 220, 45); // Code text on the right

        // Divider line below header
        context.strokeStyle = "#ccc";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, 65);
        context.lineTo(width, 65);
        context.stroke();

        // Content: Item Name and Quantity
        context.fillStyle = "#000";
        context.font = "bold 34px NotoSansLao, Arial, sans-serif";
        let yPosition = 100;
        yPosition = wrapText(
          context,
          `${data?.name} (${data?.quantity})`,
          10,
          yPosition,
          width - 20,
          36
        );

        // Content: Item Note
        if (data?.note) {
          const noteLabel = "note: ";
          const noteText = data.note;

          // Draw "Note:" label in bold
          context.fillStyle = "#666";
          context.font = " bold italic bold 24px Arial, sans-serif";
          context.fillText(noteLabel, 10, yPosition);

          // Measure width of the "Note:" label
          const noteLabelWidth = context.measureText(noteLabel).width;

          // Wrap the note text, starting after the "Note:" label
          context.font = "bold italic 24px Arial, sans-serif";
          yPosition = wrapText(
            context,
            noteText,
            10 + noteLabelWidth, // Start after the label width
            yPosition,
            width - 20 - noteLabelWidth, // Adjust wrapping width
            30
          );

          // Add spacing after the note
          yPosition += 10;
        }

        // Options
        if (data.options && data.options.length > 0) {
          context.fillStyle = "#000";
          context.font = "24px NotoSansLao, Arial, sans-serif";
          data.options.forEach((option, idx) => {
            const optionPriceText = option?.price
              ? ` - ${moneyCurrency(option?.price)}`
              : "";
            const optionText = `- ${option?.name}${optionPriceText} x ${
              option?.quantity || 1
            }`;
            yPosition = wrapText(
              context,
              optionText,
              10,
              yPosition,
              width - 20,
              30
            );
          });

          // Divider below options
          context.strokeStyle = "#ccc";
          context.setLineDash([4, 2]);
          context.beginPath();
          context.moveTo(0, yPosition);
          context.lineTo(width, yPosition);
          context.stroke();
          context.setLineDash([]);
          yPosition += 20;
        }

        context.fillStyle = "#000";
        context.font = " 24px NotoSansLao, Arial, sans-serif";
        // let yPosition = 100;
        yPosition = wrapText(
          context,
          `${t("total")} ${moneyCurrency(
            data?.price + (data?.totalOptionPrice ?? 0)
          )} ${t(storeDetail?.firstCurrency)}`,
          10,
          yPosition,
          width - 20,
          46
        );

        // Set text properties
        context.fillStyle = "#000"; // Black text color
        context.font = "28px NotoSansLao, Arial, sans-serif"; // Font style and size
        context.textAlign = "right"; // Align text to the right
        context.textBaseline = "bottom"; // Align text baseline to bottom

        // Draw delivery code at the bottom-right
        context.fillText(
          `${data?.deliveryCode ? `(DC : ${data?.deliveryCode})` : ""}`, // Delivery code text
          width - 10, // Position X: 10px from the right edge
          dynamicHeight - 86 // Position Y: 100px above the bottom edge
        );

        // Add a dotted line above the footer
        context.strokeStyle = "#000"; // Black dotted line
        context.setLineDash([4, 2]); // Dotted line style
        context.beginPath();
        context.moveTo(0, dynamicHeight - 70); // Position 70px above footer
        context.lineTo(width, dynamicHeight - 70); // Full-width dotted line
        context.stroke();
        context.setLineDash([]); // Reset line dash style

        // Footer Section
        context.font = "bold 24px NotoSansLao, Arial, sans-serif";
        context.fillStyle = "#000";

        // Draw "Created By" text at the bottom-left
        context.textAlign = "left"; // Align text to the left
        context.fillText(
          data?.createdBy?.firstname || data?.updatedBy?.firstname || "", // Footer text
          10, // 10px from the left edge
          dynamicHeight - 20 // Position Y: 20px above the bottom
        );

        // Draw date and time at the bottom-right
        context.textAlign = "right"; // Align text to the right
        context.fillStyle = "#6e6e6e"; // Gray color
        context.font = "22px NotoSansLao, Arial, sans-serif"; // Smaller font size
        context.fillText(
          `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
            data?.createdAt
          ).format("LT")}`, // Date and time
          width - 10, // 10px from the right edge
          dynamicHeight - 20 // Position Y: 20px above the bottom
        );

        // Convert canvas to base64
        const dataUrl = canvas.toDataURL("image/png");
        const printer = printers.find((e) => e?._id === data?.printer);
        if (printer) base64ArrayAndPrinter.push({ dataUrl, printer });
      }
    });

    return base64ArrayAndPrinter;
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
        deliveryCode: "", // Add delivery code field
        platform: "", // Add platform field
      };

      const existingMenuIndex = selectedMenu.findIndex(
        (item) => item.id === menu._id
      );

      if (selectedTable?.isOrderSplit) {
        setSelectedMenu([...selectedMenu, data]);
      } else if (existingMenuIndex !== -1) {
        // Menu is already in selectedMenu, increase the quantity
        const updatedMenu = [...selectedMenu];
        updatedMenu[existingMenuIndex].quantity += 1;
        setSelectedMenu(updatedMenu);
      } else {
        // Menu is not in selectedMenu, add it
        setSelectedMenu([...selectedMenu, data]);
      }

      setSelectedItem({ ...menu, printer: menu?.categoryId?.printer });
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

  const handleAddDeliveryCode = (code, platform) => {
    if (!code || !platform) {
      Swal.fire({
        icon: "error",
        title: `${t("not_success")}`,
        showConfirmButton: false,
        timer: 1800,
      });
      setDisableNotDeliveryCode(false);
      return;
    }

    if (typeof platform !== "string" || !platform.trim()) {
      Swal.fire({
        icon: "error",
        title: `${t("invalid_platform")}`,
        showConfirmButton: false,
        timer: 1800,
      });
      setDisableNotDeliveryCode(false);
      return;
    }

    if (tableOrderItems.length > 0) {
      if (tableOrderItems.some((list) => list.platform === platform)) {
        setSelectedMenu((prevMenu) =>
          prevMenu.map((item) => ({
            ...item,
            deliveryCode: code,
            platform: platform,
          }))
        );
        setIsShowDeliveryPopup(false);
        setDisableNotDeliveryCode(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "ເກີດຂໍ້ຜິດພາດ",
          text: `ໂຕະນີ້ເປັນຂອງ ${tableOrderItems[0]?.platform} platform`,
          showConfirmButton: false,
          timer: 1800,
        });
        setDisableNotDeliveryCode(false);
        return;
      }
    } else {
      setSelectedMenu((prevMenu) =>
        prevMenu.map((item) => ({
          ...item,
          deliveryCode: code,
          platform: platform,
        }))
      );
      setDisableNotDeliveryCode(false);
      setIsShowDeliveryPopup(false);
    }
  };

  const onRemoveFromCart = (index) => {
    const selectedMenuCopied = [...selectedMenu];

    if (index >= 0 && index < selectedMenuCopied.length) {
      selectedMenuCopied.splice(index, 1);
    }

    setSelectedMenu(selectedMenuCopied);
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
  
      const response = await axios.post(END_POINT_SEVER_TABLE_MENU + "/v3/admin/bill/create", _body, { headers });
  
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
  
          const hasNoCut = pickedUpPrinters.some((printer) => printer.cutPaper === "not_cut");
  
          if (hasNoCut) {
            printItems(groupedItems, combinedBillRefs, printers, selectedTable).then(() => {
              onSelectTable(selectedTable);
              navigate(`/tables/pagenumber/1/tableid/${tableId}/${storeDetail?._id}`, { state: { zoneId: localZone } });
            });
          } else {
            onPrintForCher().then(() => {
              onSelectTable(selectedTable);
              navigate(`/tables/pagenumber/1/tableid/${tableId}/${storeDetail?._id}`, { state: { zoneId: localZone } });
            });
          }
        } else {
          onSelectTable(selectedTable);
          navigate(`/tables/pagenumber/1/tableid/${tableId}/${storeDetail?._id}`, { state: { zoneId: localZone } });
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
  

  const validateBeforePrint = () => {
    for (const order of selectedMenu) {
      if (!order.deliveryCode || !order.platform) {
        Swal.fire({
          icon: "error",
          title: t("error"),
          text: t("ensure_enter_code_platform"),
          showConfirmButton: false,
          timer: 1800,
        });
        setDisableNotDeliveryCode(true);
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (isPrinted) => {
    try {
      if (selectedTable?.isDeliveryTable) {
        if (!validateBeforePrint()) {
          return; // Stop if validation fails
        }
        if (selectedMenu.some((item) => !item.deliveryCode || !item.platform)) {
          Swal.fire({
            icon: "error",
            title:
              "Please ensure all orders have a delivery code and platform selected.",
            showConfirmButton: false,
            timer: 1800,
          });
          return;
        }
      }
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
    const menuOptions = _checkMenuOption(menu);

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

  const onConfirmRemoveItem = (data, index) => {
    setIsRemoveItem(true);
    setItemDeleting({ data, index });
  };
  const onAddDeliveryCode = () => {
    setIsShowDeliveryPopup(true);
  };

  const {
    t,
    i18n: { language },
  } = useTranslation();

  console.log({ tableOrderItems });

  return (
    <div className="w-full h-screen">
      <div className="flex overflow-hidden mb-4">
        <div className="grow h-[90vh] overflow-y-scroll relative">
          <div className="py-2 sticky top-0 z-10 bg-white flex flex-col">
            <div className="w-full px-2 py-1">
              <input
                placeholder={t("search")}
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div
              ref={sliderRef}
              className="w-full overflow-x-auto flex flex-row whitespace-nowrap p-2 gap-2 flex-1"
            >
              <button
                key={"category-all"}
                className={cn(
                  `rounded-full px-3 py-2 shadow-button w-auto min-w-0 flex-shrink-0 font-semibold text-sm whitespace-nowrap float-none`,
                  selectedCategory === "All"
                    ? "text-orange-500"
                    : "text-gray-700",
                  fontMap[language]
                )}
                onClick={() => setSelectedCategory("All")}
              >
                {t("all")}
                <div className="ml-12"></div>
              </button>
              {menuCategories &&
                menuCategories.map((data, index) => {
                  return (
                    <button
                      key={"category" + index}
                      className={cn(
                        `rounded-full px-3 py-2 shadow-button w-auto min-w-0 flex-shrink-0 font-semibold text-sm whitespace-nowrap float-none`,
                        selectedCategory === data?._id
                          ? "text-orange-500"
                          : "text-gray-700",
                        fontMap[language]
                      )}
                      onClick={() => setSelectedCategory(data?._id)}
                    >
                      {data?.name}
                      <div className="ml-12"></div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 px-2">
            {isLoading ? (
              <Loading />
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
                        <span className="text-orange-600 font-medium text-base font-inter">
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
                        <span
                          className={cn(
                            "text-[13px] text-gray-500",
                            fontMap[language]
                          )}
                        >
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
        </div>
        {/* Detail Table */}
        <div className="hidden md:block w-[420px] min-w-[420px] lg:min-w-[50%] lg:w-1/2 xl:w-[640px] xl:max-w-[640px] xl:min-w-[640px] h-[calc(100dvh-64px)] overflow-y-scroll bg-white border-gray-500 ">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <Table responsive className="table">
                  <thead style={{ backgroundColor: "#F1F1F1" }}>
                    <tr style={{ fontSize: "bold", border: "none" }}>
                      <th style={{ border: "none" }}>#</th>
                      <th
                        style={{ border: "none", textAlign: "left" }}
                        className={fontMap[language]}
                      >
                        {t("menu_name")} YO
                      </th>
                      <th
                        style={{ border: "none", textAlign: "center" }}
                        className={fontMap[language]}
                      >
                        {t("amount")}
                      </th>
                      {selectedTable?.isDeliveryTable && (
                        <th
                          style={{ border: "none", textAlign: "center" }}
                          className={fontMap[language]}
                        >
                          {t("delivery")}
                        </th>
                      )}
                      <th
                        style={{ border: "none", textAlign: "right" }}
                        className={fontMap[language]}
                      >
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
                              {selectedTable?.isOrderSplit !== false ? (
                                ""
                              ) : (
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
                              )}
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: 10,

                                  margin: "0px 5px",
                                }}
                              >
                                {data.quantity}
                              </p>
                              {selectedTable?.isOrderSplit !== false ? (
                                ""
                              ) : (
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
                              )}
                            </td>
                            {selectedTable?.isDeliveryTable && (
                              <td style={{ padding: 0, textAlign: "right" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 10,
                                    paddingLeft: 10,
                                    paddingTop: 25,
                                  }}
                                >
                                  <p style={{ fontSize: 12 }}>
                                    {data && data.deliveryCode !== null
                                      ? data.deliveryCode
                                      : "--"}
                                  </p>
                                </div>
                              </td>
                            )}
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
                                  onClick={() =>
                                    onConfirmRemoveItem(data, index)
                                  }
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
                    disabled={selectedMenu.length === 0}
                    style={{
                      marginRight: 15,
                      border: "solid 1px #FB6E3B",
                      color: "#FB6E3B",
                      fontWeight: "bold",
                    }}
                    className={fontMap[language]}
                    onClick={() =>
                      navigate(
                        `/tables/pagenumber/1/tableid/${tableId}/${storeDetail?._id}`
                      )
                    }
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    hidden={!selectedTable?.isDeliveryTable}
                    variant="light"
                    disabled={selectedMenu.length === 0}
                    className={cn("hover-me", fontMap[language])}
                    style={{
                      marginRight: 15,
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                      fontWeight: "bold",
                      flex: 1,
                    }}
                    onClick={() => onAddDeliveryCode()}
                  >
                    {t("delivery")}
                  </Button>
                  <Button
                    variant="light"
                    hidden={!selectedTable?.isDeliveryTable}
                    disabled={
                      selectedMenu.length === 0 || disableNotDeliveryCode
                    }
                    className="hover-me"
                    style={{
                      marginRight: 15,
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                      fontWeight: "bold",
                      flex: 1,
                    }}
                    onClick={() => {
                      setDisabledButton(true);
                      onSubmit(false);
                    }}
                  >
                    {t("order_food")}
                  </Button>
                  <Button
                    hidden={selectedTable?.isDeliveryTable}
                    variant="light"
                    disabled={selectedMenu.length === 0}
                    className={cn("hover-me", fontMap[language])}
                    style={{
                      marginRight: 15,
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                      fontWeight: "bold",
                      flex: 1,
                    }}
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
                    hidden={!selectedTable?.isDeliveryTable}
                    variant="light"
                    disabled={
                      selectedMenu.length === 0 || disableNotDeliveryCode
                    }
                    className="hover-me"
                    style={{
                      height: 54,
                      marginRight: 15,
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                      fontWeight: "bold",
                      flex: 1,
                    }}
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
                  <Button
                    hidden={selectedTable?.isDeliveryTable}
                    variant="light"
                    disabled={selectedMenu.length === 0}
                    className={cn("hover-me", fontMap[language])}
                    style={{
                      height: 54,
                      marginRight: 15,
                      backgroundColor: "#FB6E3B",
                      color: "#ffffff",
                      fontWeight: "bold",
                      flex: 1,
                    }}
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
        text={itemDeleting?.data?.name}
        onClose={() => setIsRemoveItem(false)}
        onSubmit={async () => onRemoveFromCart(itemDeleting?.index)}
      />
      <PopUpAddDeliveryCode
        open={isShowDeliveryPopup}
        onClose={() => setIsShowDeliveryPopup(false)}
        onSubmit={(code, platform) =>
          handleAddDeliveryCode(code, platform, selectedItem?._id)
        }
      />
    </div>
  );
}

export default AddOrder;
