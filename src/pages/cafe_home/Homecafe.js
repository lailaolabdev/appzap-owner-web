/* eslint-disable no-loop-func */
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import axios from "axios";
import ReactToPrint from "react-to-print";
import BillForCheckOutCafe80 from "../../components/bill/BillForCheckOutCafe80";
import PrintLabel from "./components/PrintLabel";
import _ from "lodash";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Button, Modal, Form, Nav, Image } from "react-bootstrap";
import { base64ToBlob } from "../../helpers";
import { RiListOrdered2 } from "react-icons/ri";
import { BsCartXFill } from "react-icons/bs";

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
  USB_LABEL_PRINTER_PORT,
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
import { getBillCafe, getBills } from "../../services/bill";
import { GetAllPromotion } from "../../services/promotion";
import { useStore } from "../../store";
import BillForChef80 from "../../components/bill/BillForChef80";
import BillForChef58 from "../../components/bill/BillForChef58";
import { MdMarkChatRead, MdDelete, MdAdd } from "react-icons/md";
import { RiChatNewFill } from "react-icons/ri";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import CheckOutPopupCafe from "../table/components/CheckOutPopupCafe";
import printFlutter from "../../helpers/printFlutter";
import matchRoundNumber from "../../helpers/matchRound";
import { cn } from "../../utils/cn";
import { fontMap } from "../../utils/font-map";

import { useStoreStore } from "../../zustand/storeStore";
import { useMenuStore } from "../../zustand/menuStore";
import { useShiftStore } from "../../zustand/ShiftStore";
import { useMenuSelectStore } from "../../zustand/menuSelectStore";

import theme from "../../theme";
import moment from "moment";
import url from "socket.io-client/lib/url";
import CheckOutPopupCafeNew from "../table/components/CheckOutPopupCafeNew";
import { getAllStorePoints } from "../../services/member.service";
import AnimationLoading from "../../constants/loading";

function Homecafe() {
  const params = useParams();
  const [billId, setBillId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [show, setShow] = useState(false);
  const [menuOptions, setMenuOptions] = useState([]);
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
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [bill, setBill] = useState(0);
  const [promotion, setPromotion] = useState([]);

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 767px)").matches
  );

  const [cartModal, setCartModal] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null); // Track the row being edited

  const { shiftCurrent } = useShiftStore();
  const { setSelectedMenus, SelectedMenus, clearSelectedMenus } =
    useMenuSelectStore();

  const sliderRef = useRef();
  useEffect(() => {
    const storedState = localStorage.getItem("menuSlected");
    if (storedState) {
      const newState = JSON.parse(storedState);
      setSelectedMenus(newState.state.SelectedMenus);
    }

    const handleStorageChange = (event) => {
      if (event.key === "menuSlected") {
        const newState = JSON.parse(event.newValue);
        setSelectedMenus(newState.state.SelectedMenus);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setSelectedMenus]);

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

  const handleSetQuantity = (int, data, index) => {
    const updatedMenus = [...SelectedMenus];

    if (index >= 0 && index < updatedMenus.length) {
      let item = updatedMenus[index];
      if (
        data?.id === item?.id &&
        JSON.stringify(data?.options) === JSON.stringify(item?.options)
      ) {
        item.quantity += int;
        if (item.quantity <= 0) {
          updatedMenus.splice(index, 1);
        }
      }
    }
    setSelectedMenu(updatedMenus);
    setSelectedMenus(updatedMenus);
  };

  const {
    printerCounter,
    printers,
    setSelectedTable,
    getTableDataStore,
    profile,
  } = useStore();
  const { storeDetail, setStoreDetail } = useStoreStore();
  const [search, setSearch] = useState("");

  const {
    menus,
    menuCategories,
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
    isMenuLoading,
  } = useMenuStore();

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

  useEffect(() => {
    billData();
    fetchPointsData();
  }, []);

  const fetchPointsData = async () => {
    try {
      const data = await getAllStorePoints();
      if (!data.error) {
        const { DATA } = await getLocalData();
        const filteredData = data.filter(
          (point) => point.storeId === DATA.storeId
        );
        setStoreDetail({
          pointStore: filteredData[0].money,
        });
      }
    } catch (error) {
      console.error("Failed to fetch points data: ", error);
    }
  };

  const billData = async () => {
    try {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}&`;
      findby += `startDate=${startDate}&`;
      findby += `endDate=${endDate}&`;
      findby += `startTime=${startTime}&`;
      findby += `endTime=${endTime}`;
      const res = await getBills(findby);
      const filteredBills = res?.filter((bill) => bill.isCafe === true) || [];
      setBill(filteredBills.length);
    } catch (error) {
      console.log(error);
    }
  };

  const afterSearch = _.filter(
    menus,
    (e) =>
      (e?.name?.indexOf(search) > -1 && selectedCategory === "All") ||
      e?.categoryId?._id === selectedCategory
  );

  const arrLength = SelectedMenus?.length;
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
    (async () => {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      // findby += `&code=${code}`;
      const data = await getBillCafe(findby);
      setBillId(data?.[0]);
    })();
  }, []);

  useEffect(() => {
    if (selectedMenu && selectedMenu.length > 0) {
      setSelectedMenus(selectedMenu);
    }
  }, [selectedMenu]);

  useEffect(() => {
    _calculateTotal();
  }, [SelectedMenus]);

  const _calculateTotal = () => {
    let _total = 0;
    for (const _data of SelectedMenus || []) {
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

  // const addToCart = async (menu) => {
  //   const _menuOptions = _checkMenuOption(menu);
  //   let updatedSelectedMenus = [...SelectedMenus];

  //   if (_menuOptions.length > 0) {
  //     setMenuOptions(_menuOptions);
  //     setSelectedItem({ ...menu, printer: menu?.categoryId?.printer });
  //     setSelectedOptionsArray({
  //       [menu._id]: _menuOptions.map((option) => ({ ...option, quantity: 0 })),
  //     });
  //     handleShow();
  //     return;
  //   }

  //   const finalPrice = calculateDiscount(menu);

  //   const mainMenuData = {
  //     id: menu._id,
  //     name: menu.name,
  //     quantity: 1,
  //     price: finalPrice,
  //     priceDiscount: Math.max(menu?.price - finalPrice, 0),
  //     categoryId: menu?.categoryId,
  //     printer: menu?.categoryId?.printer,
  //     shiftId: shiftCurrent[0]?._id,
  //     discount: menu.promotionId?.reduce(
  //       (sum, promo) => sum + (promo.discountValue || 0),
  //       0
  //     ),
  //     note: "",
  //     isWeightMenu: menu?.isWeightMenu,
  //   };

  //   const existingMenuIndex = updatedSelectedMenus.findIndex(
  //     (item) => item.id === menu._id
  //   );
  //   if (existingMenuIndex !== -1) {
  //     updatedSelectedMenus[existingMenuIndex].quantity += 1;
  //   } else {
  //     updatedSelectedMenus.push(mainMenuData);
  //   }

  //   // ✅ Handle BUY_X_GET_Y promotions and ensure free items match their mainMenuId
  //   // biome-ignore lint/complexity/noForEach: <explanation>
  //   menu.promotionId?.forEach((promotion) => {
  //     if (
  //       promotion?.type === "BUY_X_GET_Y" &&
  //       promotion.freeItems?.length > 0
  //     ) {
  //       // biome-ignore lint/complexity/noForEach: <explanation>
  //       promotion.freeItems.forEach((freeItem) => {
  //         const freeItemId = freeItem?._id?._id || freeItem?._id;
  //         const freeItemName = freeItem?._id?.name || "Unknown";
  //         const mainMenuId = freeItem?.mainMenuId?._id;

  //         if (mainMenuId && mainMenuId !== menu._id) {
  //           console.log(
  //             `❌ Free item ${freeItemName} incorrect Main Menu ${menu.name}`
  //           );
  //           return;
  //         }

  //         const existingFreeItemIndex = updatedSelectedMenus.findIndex(
  //           (item) =>
  //             item.id === freeItemId &&
  //             item.isFree &&
  //             item.mainMenuId === menu._id
  //         );

  //         if (existingFreeItemIndex !== -1) {
  //           updatedSelectedMenus[existingFreeItemIndex].quantity +=
  //             promotion.getQuantity;
  //         } else {
  //           const freeItemData = {
  //             id: freeItemId,
  //             name: freeItemName,
  //             price: 0,
  //             quantity: 1,
  //             categoryId: menu?.categoryId,
  //             printer: menu?.categoryId?.printer,
  //             shiftId: shiftCurrent[0]?._id,
  //             isWeightMenu: menu?.isWeightMenu,
  //             isFree: true,
  //             mainMenuId: menu._id,
  //           };
  //           updatedSelectedMenus.push(freeItemData);
  //         }
  //       });
  //     }
  //   });

  //   setSelectedMenus(updatedSelectedMenus);
  // };

  const addToCart = async (menu) => {
    const _menuOptions = _checkMenuOption(menu);
    let updatedSelectedMenus = [...SelectedMenus];

    if (_menuOptions.length > 0) {
      setMenuOptions(_menuOptions);
      setSelectedItem({ ...menu, printer: menu?.categoryId?.printer });
      setSelectedOptionsArray({
        [menu._id]: _menuOptions.map((option) => ({ ...option, quantity: 0 })),
      });
      handleShow();
      return;
    }

    const activePromotions =
      menu.promotionId?.filter((promo) => promo.status === "ACTIVE") || [];

    const finalPrice = calculateDiscount(menu);

    const mainMenuData = {
      id: menu._id,
      name: menu.name,
      quantity: 1,
      price: finalPrice,
      priceDiscount: Math.max(menu?.price - finalPrice, 0),
      categoryId: menu?.categoryId,
      printer: menu?.categoryId?.printer,
      shiftId: shiftCurrent[0]?._id,
      discount: activePromotions.reduce(
        (sum, promo) => sum + (promo.discountValue || 0),
        0
      ),
      note: "",
      isWeightMenu: menu?.isWeightMenu,
    };

    // const existingMenuIndex = updatedSelectedMenus.findIndex(
    //   (item) => item.id === menu._id
    // );
    // if (existingMenuIndex !== -1) {
    //   updatedSelectedMenus[existingMenuIndex].quantity += 1;
    // } else {
    //updatedSelectedMenus.push(mainMenuData);
    // }

    updatedSelectedMenus.push(mainMenuData);

    // biome-ignore lint/complexity/noForEach: <explanation>
    activePromotions.forEach((promotion) => {
      if (
        promotion?.type === "BUY_X_GET_Y" &&
        promotion.freeItems?.length > 0
      ) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        promotion.freeItems.forEach((freeItem) => {
          const freeItemId = freeItem?._id?._id || freeItem?._id;
          const freeItemName = freeItem?._id?.name || "Unknown";
          const mainMenuId = freeItem?.mainMenuId?._id;

          if (mainMenuId && mainMenuId !== menu._id) {
            console.log(
              `❌ Free item ${freeItemName} ไม่ตรงกับ Main Menu ${menu.name}`
            );
            return;
          }

          const existingFreeItemIndex = updatedSelectedMenus.findIndex(
            (item) =>
              item.id === freeItemId &&
              item.isFree &&
              item.mainMenuId === menu._id
          );

          if (existingFreeItemIndex !== -1) {
            updatedSelectedMenus[existingFreeItemIndex].quantity +=
              promotion.getQuantity;
          } else {
            const freeItemData = {
              id: freeItemId,
              name: freeItemName,
              price: 0,
              quantity: promotion.getQuantity,
              categoryId: menu?.categoryId,
              printer: menu?.categoryId?.printer,
              shiftId: shiftCurrent[0]?._id,
              isWeightMenu: menu?.isWeightMenu,
              isFree: true,
              mainMenuId: menu._id,
            };
            updatedSelectedMenus.push(freeItemData);
          }
        });
      }
    });

    setSelectedMenus(updatedSelectedMenus);
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
    return calculateDiscount(menu) + optionsTotalPrice;
  };

  // const handleConfirmOptions = () => {
  //   const filteredOptions =
  //     selectedOptionsArray[selectedItem._id]?.filter(
  //       (option) => option.quantity >= 1
  //     ) || [];

  //   const sortedFilteredOptionsForComparison = sortOptionsById([
  //     ...filteredOptions,
  //   ]);

  //   const totalOptionPrice = filteredOptions.reduce(
  //     (total, option) => total + option.price * option.quantity,
  //     0
  //   );

  //   const finalPrice = calculateDiscount(selectedItem);

  //   const mainMenuData = {
  //     id: selectedItem._id,
  //     name: selectedItem.name,
  //     quantity: 1,
  //     price: finalPrice,
  //     priceDiscount: Math.max(selectedItem?.price - finalPrice, 0),
  //     categoryId: selectedItem?.categoryId,
  //     printer: selectedItem?.categoryId?.printer,
  //     note: addComments,
  //     menuOptions: selectedItem.menuOptions,
  //     options: filteredOptions,
  //     shiftId: shiftCurrent[0]?._id,
  //     discount: selectedItem?.promotionId?.reduce(
  //       (sum, promo) => sum + (promo.discountValue || 0),
  //       0
  //     ),
  //     totalOptionPrice: totalOptionPrice,
  //     totalPrice: finalPrice + totalOptionPrice,
  //     isWeightMenu: selectedItem?.isWeightMenu,
  //   };

  //   setSelectedMenu((prevMenu) => {
  //     let updatedMenu = [...prevMenu];

  //     const existingMenuIndex = updatedMenu.findIndex((item) => {
  //       const sortedItemOptionsForComparison = item.options
  //         ? sortOptionsById([...item.options])
  //         : [];
  //       return (
  //         item.id === selectedItem._id &&
  //         JSON.stringify(sortedItemOptionsForComparison) ===
  //           JSON.stringify(sortedFilteredOptionsForComparison)
  //       );
  //     });

  //     if (existingMenuIndex !== -1) {
  //       updatedMenu[existingMenuIndex].quantity += 1;
  //       updatedMenu[existingMenuIndex].options = filteredOptions;
  //       updatedMenu[existingMenuIndex].totalOptionPrice = totalOptionPrice;
  //       updatedMenu[existingMenuIndex].totalPrice =
  //         updatedMenu[existingMenuIndex].price *
  //           updatedMenu[existingMenuIndex].quantity +
  //         totalOptionPrice;

  //       console.log(
  //         "🆙 Updated Existing Menu:",
  //         updatedMenu[existingMenuIndex]
  //       );
  //     } else {
  //       updatedMenu.push(mainMenuData);
  //     }

  //     if (selectedItem.promotionId?.length > 0) {
  //       // biome-ignore lint/complexity/noForEach: <explanation>
  //       selectedItem.promotionId.forEach((promotion) => {
  //         if (
  //           promotion.type === "BUY_X_GET_Y" &&
  //           promotion.freeItems?.length > 0
  //         ) {
  //           // biome-ignore lint/complexity/noForEach: <explanation>
  //           promotion.freeItems.forEach((freeItem) => {
  //             const freeItemId = freeItem?._id?._id || freeItem?._id;
  //             const freeItemName = freeItem?._id?.name || "Unknown";
  //             const mainMenuId = freeItem?.mainMenuId?._id;

  //             if (mainMenuId && mainMenuId !== selectedItem._id) {
  //               console.log(
  //                 `❌ Free item ${freeItemName} incorrect Main Menu ${selectedItem.name}`
  //               );
  //               return;
  //             }

  //             const existingFreeItemIndex = updatedMenu.findIndex(
  //               (item) =>
  //                 item.id === freeItemId &&
  //                 item.isFree &&
  //                 item.mainMenuId === selectedItem._id
  //             );

  //             if (existingFreeItemIndex !== -1) {
  //               updatedMenu[existingFreeItemIndex].quantity +=
  //                 promotion.getQuantity;
  //             } else {
  //               updatedMenu.push({
  //                 id: freeItemId,
  //                 name: freeItemName,
  //                 price: 0,
  //                 quantity: 1,
  //                 categoryId: selectedItem?.categoryId,
  //                 printer: selectedItem?.categoryId?.printer,
  //                 shiftId: shiftCurrent[0]?._id,
  //                 isWeightMenu: selectedItem?.isWeightMenu,
  //                 isFree: true,
  //                 mainMenuId: selectedItem._id,
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }

  //     return updatedMenu;
  //   });

  //   handleClose();
  //   setAddComments("");
  //   setEditComments("");
  // };

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

    const activePromotions =
      selectedItem.promotionId?.filter((promo) => promo.status === "ACTIVE") ||
      [];

    const finalPrice = calculateDiscount(selectedItem);

    const mainMenuData = {
      id: selectedItem._id,
      name: selectedItem.name,
      quantity: 1,
      price: finalPrice,
      priceDiscount: Math.max(selectedItem?.price - finalPrice, 0),
      categoryId: selectedItem?.categoryId,
      printer: selectedItem?.categoryId?.printer,
      note: addComments,
      menuOptions: selectedItem.menuOptions,
      options: filteredOptions,
      shiftId: shiftCurrent[0]?._id,
      discount: activePromotions.reduce(
        (sum, promo) => sum + (promo.discountValue || 0),
        0
      ),
      totalOptionPrice: totalOptionPrice,
      totalPrice: finalPrice + totalOptionPrice,
      isWeightMenu: selectedItem?.isWeightMenu,
    };

    setSelectedMenu((prevMenu) => {
      let updatedMenu = [...prevMenu];

      const existingMenuIndex = updatedMenu.findIndex((item) => {
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
        updatedMenu[existingMenuIndex].quantity += 1;
        updatedMenu[existingMenuIndex].options = filteredOptions;
        updatedMenu[existingMenuIndex].totalOptionPrice = totalOptionPrice;
        updatedMenu[existingMenuIndex].totalPrice =
          updatedMenu[existingMenuIndex].price *
            updatedMenu[existingMenuIndex].quantity +
          totalOptionPrice;

        console.log(
          "🆙 Updated Existing Menu:",
          updatedMenu[existingMenuIndex]
        );
      } else {
        updatedMenu.push(mainMenuData);
      }

      // biome-ignore lint/complexity/noForEach: <explanation>
      activePromotions.forEach((promotion) => {
        if (
          promotion.type === "BUY_X_GET_Y" &&
          promotion.freeItems?.length > 0
        ) {
          // biome-ignore lint/complexity/noForEach: <explanation>
          promotion.freeItems.forEach((freeItem) => {
            const freeItemId = freeItem?._id?._id || freeItem?._id;
            const freeItemName = freeItem?._id?.name || "Unknown";
            const mainMenuId = freeItem?.mainMenuId?._id;

            if (!mainMenuId || mainMenuId !== selectedItem._id) {
              console.log(
                `❌ Free item ${freeItemName}  Main Menu ${selectedItem.name}`
              );
              return;
            }

            const existingFreeItemIndex = updatedMenu.findIndex(
              (item) =>
                item.id === freeItemId &&
                item.isFree &&
                item.mainMenuId === selectedItem._id
            );

            if (existingFreeItemIndex !== -1) {
              updatedMenu[existingFreeItemIndex].quantity +=
                promotion.getQuantity;
            } else {
              updatedMenu.push({
                id: freeItemId,
                name: freeItemName,
                price: 0,
                quantity: promotion.getQuantity,
                categoryId: selectedItem?.categoryId,
                printer: selectedItem?.categoryId?.printer,
                shiftId: shiftCurrent[0]?._id,
                isWeightMenu: selectedItem?.isWeightMenu,
                isFree: true,
                mainMenuId: selectedItem._id,
              });
            }
          });
        }
      });

      return updatedMenu;
    });

    handleClose();
    setAddComments("");
    setEditComments("");
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
    return SelectedMenus?.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.quantity;
    }, 0);
  };

  const TotalPrice = () => {
    return SelectedMenus?.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.price * nextValue.quantity;
    }, 0);
  };

  const onRemoveFromCart = (id) => {
    const selectedMenuCopied = [...SelectedMenus];
    for (let i = 0; i < selectedMenuCopied.length; i++) {
      var obj = selectedMenuCopied[i];
      if (obj.id === id) {
        selectedMenuCopied.splice(i, 1);
      }
    }
    setSelectedMenu([...selectedMenuCopied]);
    setSelectedMenus([...selectedMenuCopied]);
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
    fetchDataProduction();
  }, []);

  const fetchDataProduction = async () => {
    setIsLoading(true);
    const { data } = await GetAllPromotion();
    setPromotion(data);
    setIsLoading(false);
  };

  const handleAddCommentInCart = () => {
    const dataArray = [];
    for (const i of SelectedMenus) {
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
    setSelectedMenus(dataArray);
    setIsPupup(false);
    setAddComments("");
    setEditComments("");
  };

  const handleUpdateCommentInCart = () => {
    const dataArray = [];
    for (const i of SelectedMenus) {
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
    setSelectedMenus(dataArray);
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

  const convertHtmlToBase64 = (orderSelect) => {
    const base64ArrayAndPrinter = [];
    // biome-ignore lint/complexity/noForEach: <explanation>
    orderSelect.forEach((data) => {
      if (data) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

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

        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, dynamicHeight);

        function wrapText(context, text, x, y, maxWidth, lineHeight) {
          const words = text.split(" ");
          let line = "";
          for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            let metrics = context.measureText(testLine);
            const testWidth = metrics.width;
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

        context.fillStyle = "#000";
        context.font = "bold 32px NotoSansLao, Arial, sans-serif";
        let yPosition = 30;

        // Render "Queue no" at the top and center it
        context.textAlign = "center"; // Center align the text
        context.fillText(`Queue No ${bill}`, width / 2, yPosition);
        yPosition += 40; // Add some space after "Queue no"
        // Render data.name below "Queue no"
        context.textAlign = "left"; // Reset alignment to left for other text
        yPosition = wrapText(
          context,
          `${data?.name} (${data?.quantity})`,
          10,
          yPosition,
          width - 20,
          36
        );

        if (data?.note) {
          const noteLabel = "note: ";
          const noteText = data.note;

          context.fillStyle = "#666";
          context.font = "bold italic 24px Arial, sans-serif";
          context.fillText(noteLabel, 10, yPosition);

          const noteLabelWidth = context.measureText(noteLabel).width;

          context.font = "italic 24px Arial, sans-serif";
          yPosition = wrapText(
            context,
            noteText,
            10 + noteLabelWidth,
            yPosition,
            width - 20 - noteLabelWidth,
            30
          );

          yPosition += 10;
        }

        if (data.options && data.options.length > 0) {
          context.fillStyle = "#000";
          context.font = "24px NotoSansLao, Arial, sans-serif";
          // biome-ignore lint/complexity/noForEach: <explanation>
          data.options.forEach((option) => {
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
        context.font = "24px NotoSansLao, Arial, sans-serif";
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

        context.fillStyle = "#000";
        context.font = "28px NotoSansLao, Arial, sans-serif";
        context.textAlign = "right";
        context.textBaseline = "bottom";

        context.strokeStyle = "#000";
        context.setLineDash([4, 2]);
        context.beginPath();
        context.moveTo(0, yPosition - 25);
        context.lineTo(width, yPosition - 25);
        context.stroke();
        context.setLineDash([]);

        context.font = "bold 24px NotoSansLao, Arial, sans-serif";
        context.fillStyle = "#000";

        context.textAlign = "left";
        context.fillText(
          data?.createdBy?.data?.firstname || profile?.data?.firstname,
          10,
          yPosition + 10
        );

        context.textAlign = "right";
        context.fillStyle = "#6e6e6e";
        context.font = "22px NotoSansLao, Arial, sans-serif";
        context.fillText(
          `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
            data?.createdAt
          ).format("LT")}`,
          width - 10,
          yPosition + 10
        );

        // Add Queue no
        context.fillStyle = "#000";
        context.font = "bold 28px NotoSansLao, Arial, sans-serif";
        context.textAlign = "center";

        const dataUrl = canvas.toDataURL("image/png");
        console.log("dataUrl", dataUrl);
        const printer = printers.find((e) => e?._id === data?.printer);
        if (printer) base64ArrayAndPrinter.push({ dataUrl, printer });
      }
    });

    // console.log("base64ArrayAndPrinter", base64ArrayAndPrinter);

    return base64ArrayAndPrinter;
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

  const onPrintForCher = async () => {
    try {
      const base64ArrayAndPrinter = convertHtmlToBase64(SelectedMenus);

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

      const result = await Promise.all(arrayPrint);
      const hasError = result.some((result) => !result.success);

      if (hasError) {
        Swal.fire({
          icon: "success",
          title: t("print_success"),
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("print_fail"),
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };

  // console.log("bill80Ref CaFe",bill80Ref)

  const billForCherCancel80 = useRef([]);

  if (billForCherCancel80.current.length !== arrLength) {
    // add or remove refs
    billForCherCancel80.current = Array(arrLength)
      .fill()
      .map((_, i) => billForCherCancel80.current[i]);
  }

  const onPrintForCherLaBel = async () => {
    // setOnPrinting(true);

    let _dataBill = {
      ...bill,
      typePrint: "PRINT_BILL_LABEL",
    };
    await _createHistoriesPrinter(_dataBill);

    const orderSelect = selectedMenu?.filter((e) => e);
    console.log("ORDER", orderSelect);
    let _index = 0;
    const printDate = [...billForCherCancel80.current];
    console.log("printDate", printDate);
    let dataUrls = [];
    for (const _ref of printDate) {
      if (_ref) {
        // Ensure _ref is a valid element
        const dataUrl = await html2canvas(_ref, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
        dataUrls.push(dataUrl);
      }
    }

    for (const _ref of printDate) {
      const _printer = printers.find((e) => {
        return e?._id === orderSelect?.[_index]?.printer;
      });

      try {
        let urlForPrinter = "";
        let dataUrl = dataUrls[_index];

        urlForPrinter = USB_LABEL_PRINTER_PORT;

        const _file = await base64ToBlob(dataUrl.toDataURL());

        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("isdrawer", false);
        bodyFormData.append("port", "9100");
        bodyFormData.append("image", _file);
        bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        await axios({
          method: "post",
          url: urlForPrinter,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        // if (_index === 0) {
        //   await Swal.fire({
        //     icon: "success",
        //     title: `${t("print_success")}`,
        //     showConfirmButton: false,
        //     timer: 1500,
        //   });
        // }
      } catch (err) {
        console.log(err);
        if (_index === 0) {
          // setOnPrinting(false);
          await Swal.fire({
            icon: "error",
            title: "ປິ້ນສະຕິກເກີ້ບໍ່ສຳເລັດ",
            showConfirmButton: false,
            timer: 1500,
          });
          return { error: true, err };
        }
      }
      _index++;
    }
    // setOnPrinting(false);
  };

  const onPrintBill = async () => {
    try {
      setIsLoading(true);
      const _dataBill = {
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
      await onPrintForCherLaBel();
      setIsLoading(false);
      setSelectedTable();
      getTableDataStore();
      setSelectedMenu([]);
      setSelectedMenus([]);
      clearSelectedMenus();

      await Swal.fire({
        icon: "success",
        title: `${t("print_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      setIsLoading(false);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fial")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return err;
    }
  };

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const handleQuantityChange = (e, row) => {
    const floatQuantity = Number.parseFloat(e.target.value) || 0; // Ensure it's a valid number
    const index = SelectedMenus.findIndex((item) => item.id === row.id); // Find the index of the item

    if (index !== -1) {
      // Update the item at the found index
      const updatedMenu = [...SelectedMenus];
      updatedMenu[index] = { ...updatedMenu[index], quantity: floatQuantity };

      setSelectedMenu(updatedMenu);
      setSelectedMenus(updatedMenu);
    }
  };

  const saveQuantity = () => {
    setEditingRowId(null); // Exit editing mode
  };

  // const calculateDiscount = (menu) => {
  //   if (
  //     !menu ||
  //     !menu.price ||
  //     !Array.isArray(menu.promotionId) ||
  //     menu.promotionId.length === 0
  //   ) {
  //     return menu?.price || 0;
  //   }

  //   let finalPrice = menu.price;

  //   // biome-ignore lint/complexity/noForEach: <explanation>
  //   menu.promotionId.forEach((promotion) => {
  //     if (
  //       !promotion ||
  //       !promotion.discountType ||
  //       promotion.discountValue == null
  //     ) {
  //       console.error("Invalid promotion data", promotion);
  //       return;
  //     }

  //     let discountAmount = 0;

  //     if (promotion.discountType === "PERCENTAGE") {
  //       if (promotion.discountValue < 0 || promotion.discountValue > 100) {
  //         console.warn("Invalid discount percentage:", promotion.discountValue);
  //         return;
  //       }
  //       discountAmount = (finalPrice * promotion.discountValue) / 100;
  //     } else if (promotion.discountType === "FIXED_AMOUNT") {
  //       discountAmount = promotion.discountValue;
  //     }

  //     // Apply the discount
  //     finalPrice = Math.max(finalPrice - discountAmount, 0);
  //   });

  //   return finalPrice;
  // };

  const calculateDiscount = (menu) => {
    if (
      !menu ||
      !menu.price ||
      !Array.isArray(menu.promotionId) ||
      menu.promotionId.length === 0
    ) {
      return menu?.price || 0;
    }

    let finalPrice = menu.price;

    const activePromotions = menu.promotionId.filter(
      (promotion) => promotion.status === "ACTIVE"
    );

    if (activePromotions.length === 0) {
      return finalPrice;
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    activePromotions.forEach((promotion) => {
      if (
        !promotion ||
        !promotion.discountType ||
        promotion.discountValue == null
      ) {
        return;
      }

      let discountAmount = 0;

      if (promotion.discountType === "PERCENTAGE") {
        if (promotion.discountValue < 0 || promotion.discountValue > 100) {
          console.warn("Invalid discount percentage:", promotion.discountValue);
          return;
        }
        discountAmount = (finalPrice * promotion.discountValue) / 100;
      } else if (promotion.discountType === "FIXED_AMOUNT") {
        if (promotion.discountValue < 0) {
          console.warn(
            "Invalid fixed discount amount:",
            promotion.discountValue
          );
          return;
        }
        discountAmount = promotion.discountValue;
      }
      finalPrice = Math.max(finalPrice - discountAmount, 0);
    });

    return finalPrice;
  };

  return (
    <div>
      <CafeContent
        style={{
          position: "relative",
        }}
      >
        <CafeMenu>
          <div className="py-2 sticky top-0 z-10 bg-white flex flex-col">
            <div className="w-full px-2 py-1">
              <input
                placeholder={t("search")}
                className={cn("form-control", fontMap[language])}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div
              ref={sliderRef}
              className="w-full overflow-x-auto flex flex-row whitespace-nowrap p-2 gap-2 flex-1"
            >
              <button
                type="button"
                key={"category-all"}
                className={cn(
                  `rounded-full px-3 py-2 shadow-button w-auto min-w-0 flex-shrink-0 font-semibold text-sm whitespace-nowrap float-none`,
                  selectedCategory === "All"
                    ? "text-color-app"
                    : "text-gray-700",
                  fontMap[language]
                )}
                onClick={() => setSelectedCategory("All")}
              >
                {t("all")}
                <div className="ml-12"></div>
              </button>
              {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
              {menuCategories &&
                menuCategories?.map((data, index) => {
                  return (
                    <button
                      type="button"
                      key={"category" + index}
                      className={cn(
                        `rounded-full px-3 py-2 shadow-button w-auto min-w-0 flex-shrink-0 font-semibold text-sm whitespace-nowrap float-none`,
                        selectedCategory === data?._id
                          ? "text-color-app"
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

          <div
            className={
              afterSearch.length === 0
                ? "grid grid-cols-1 px-2"
                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-2"
            }
          >
            {isLoading || isMenuLoading ? (
              <Loading />
            ) : afterSearch.length === 0 ? (
              <div className="w-full pt-36 flex justify-center items-center">
                {AnimationLoading()}
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
                            data?.images?.length > 0
                              ? URL_PHOTO_AW3 + data?.images[0]
                              : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
                          }
                          alt=""
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                        {data?.promotionId?.discountValue && (
                          <span className="rounded-bl-lg absolute text-center top-0 right-0 bg-color-app text-white w-[45px] h-[30px] text-[16px]">
                            <span>
                              {" "}
                              {data?.promotionId?.discountValue}{" "}
                              {data?.promotionId?.discountType === "PERCENTAGE"
                                ? "%"
                                : "kip"}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="bg-white h-full text-gray-700 relative px-2 py-1">
                        <span className="text-sm">{data?.name}</span>
                        <br />

                        {/* {data?.promotionId?.length > 0 ? (
                          data.promotionId.map((promotion, index) => {
                            const filteredFreeItems =
                              promotion?.freeItems?.filter(
                                (freeItem) =>
                                  freeItem?.mainMenuId?._id === data._id
                              ) || [];

                            return (
                              <div
                                key={promotion._id}
                                className="flex flex-col"
                              >
                                {promotion?.discountValue ? (
                                  <div className="flex flex-col">
                                    <span className="text-color-app font-medium text-base">
                                      {moneyCurrency(calculateDiscount(data))}{" "}
                                      {storeDetail?.firstCurrency}
                                    </span>

                                    <div className="flex justify-between items-center">
                                      <>
                                        <span className="text-[14px] text-gray-500 line-through text-end">
                                          {moneyCurrency(data?.price)}{" "}
                                          {storeDetail?.firstCurrency}
                                        </span>
                                        <span className="flex flex-col text-center font-bold text-red-500 text-[12px] ">
                                          <span>ສ່ວນຫຼຸດ</span>
                                          <span>
                                            {moneyCurrency(
                                              promotion?.discountValue
                                            )}{" "}
                                            {promotion?.discountType ===
                                            "PERCENTAGE"
                                              ? "%"
                                              : storeDetail?.firstCurrency}
                                          </span>
                                        </span>
                                      </>
                                    </div>
                                  </div>
                                ) : null}

                               
                                {filteredFreeItems.length > 0 && (
                                  <>
                                    <span className="text-color-app font-medium text-base">
                                      {moneyCurrency(data?.price)}
                                      {storeDetail?.firstCurrency}
                                    </span>
                                    <span className="flex flex-col font-bold text-red-500 text-[14px]">
                                      {`ແຖມ ${filteredFreeItems.length} ລາຍການ`}
                                    </span>
                                  </>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-color-app font-medium text-base">
                            {moneyCurrency(data?.price)}
                            {storeDetail?.firstCurrency}
                          </span>
                        )} */}
                        {data?.promotionId?.length > 0 &&
                        data.promotionId.some(
                          (promotion) => promotion?.status === "ACTIVE"
                        ) ? (
                          data.promotionId
                            .filter(
                              (promotion) => promotion?.status === "ACTIVE"
                            )
                            .map((promotion, index) => {
                              const filteredFreeItems =
                                promotion?.freeItems?.filter(
                                  (freeItem) =>
                                    freeItem?.mainMenuId?._id === data._id
                                ) || [];

                              return (
                                <div
                                  key={promotion._id}
                                  className="flex flex-col"
                                >
                                  {/* ส่วนลด */}
                                  {promotion?.discountValue ? (
                                    <div className="flex flex-col">
                                      <span className="text-color-app font-medium text-base">
                                        {moneyCurrency(calculateDiscount(data))}{" "}
                                        {storeDetail?.firstCurrency}
                                      </span>

                                      <div className="flex justify-between items-center">
                                        <>
                                          <span className="text-[14px] text-gray-500 line-through text-end">
                                            {moneyCurrency(data?.price)}{" "}
                                            {storeDetail?.firstCurrency}
                                          </span>
                                          <span className="flex flex-col text-center font-bold text-red-500 text-[12px] ">
                                            <span>ສ່ວນຫຼຸດ</span>
                                            <span>
                                              {moneyCurrency(
                                                promotion?.discountValue
                                              )}{" "}
                                              {promotion?.discountType ===
                                              "PERCENTAGE"
                                                ? "%"
                                                : storeDetail?.firstCurrency}
                                            </span>
                                          </span>
                                        </>
                                      </div>
                                    </div>
                                  ) : null}

                                  {/* เมนูแถม */}
                                  {filteredFreeItems.length > 0 && (
                                    <>
                                      <span className="text-color-app font-medium text-base">
                                        {moneyCurrency(data?.price)}{" "}
                                        {storeDetail?.firstCurrency}
                                      </span>
                                      <span className="flex flex-col font-bold text-red-500 text-[14px]">
                                        {`ແຖມ ${filteredFreeItems.length} ລາຍການ`}
                                      </span>
                                    </>
                                  )}
                                </div>
                              );
                            })
                        ) : (
                          <span className="text-color-app font-medium text-base">
                            {moneyCurrency(data?.price)}{" "}
                            {storeDetail?.firstCurrency}
                          </span>
                        )}
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
                        <th
                          style={{ border: "none", textAlign: "left" }}
                          className={fontMap[language]}
                        >
                          {t("menu_name")}
                        </th>
                        <th
                          style={{ border: "none", textAlign: "center" }}
                          className={fontMap[language]}
                        >
                          {t("amount")}
                        </th>
                        <th
                          style={{ border: "none", textAlign: "center" }}
                          className={fontMap[language]}
                        >
                          {t("price")}
                        </th>
                        <th
                          style={{ border: "none", textAlign: "right" }}
                          className={fontMap[language]}
                        >
                          {t("manage")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {SelectedMenus?.length > 0 ? (
                        SelectedMenus?.map((data, index) => {
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
                            <tr key={`selectMenu${index}`}>
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
                                  onClick={() =>
                                    handleSetQuantity(-1, data, index)
                                  }
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
                                      border: `2px solid ${theme.primaryColor}`,
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
                                      border: `2px solid ${theme.primaryColor}`,
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
                                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                                <button
                                  style={{
                                    color: "red",
                                    border: "none",
                                    width: 25,
                                  }}
                                  onClick={() =>
                                    handleSetQuantity(1, data, index)
                                  }
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
                                      color: theme.primaryColor,
                                    }}
                                    onClick={() => onConfirmRemoveItem(data)}
                                  >
                                    <MdDelete />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <div className="h-[400px] flex justify-center items-center">
                              <div className="flex flex-col items-center">
                                <BsCartXFill className="text-[100px] text-orange-500 animate-bounce" />
                                <p className="text-[16] mt-3 font-bold text-orange-500">
                                  {t("no_order_list")}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  {SelectedMenus?.length > 0 ? (
                    <div className="mb-3">
                      <div>
                        <span className={fontMap[language]}>
                          {t("amountTotal")} :{" "}
                        </span>
                        <span>{Number.parseFloat(TotalAmount())}</span>
                      </div>
                      <div>
                        <span className={fontMap[language]}>
                          {t("pricesTotal")} :{" "}
                        </span>
                        <span className={fontMap[language]}>
                          {moneyCurrency(matchRoundNumber(total))}{" "}
                          {t("nameCurrency")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-12">
                  <div className="row" style={{ margin: 0 }}>
                    {SelectedMenus?.length > 0 ? (
                      <>
                        <Button
                          variant="outline-warning"
                          className={cn("hover-me", fontMap[language])}
                          style={{
                            marginRight: 15,
                            border: `solid 1px ${theme.primaryColor}`,
                            fontWeight: "bold",
                            backgroundColor: theme.primaryColor,
                            color: "#ffffff",
                          }}
                          onClick={() => {
                            clearSelectedMenus();
                            setSelectedMenu([]);
                          }}
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          variant="light"
                          className={cn("hover-me", fontMap[language])}
                          style={{
                            marginRight: 15,
                            backgroundColor: theme.primaryColor,
                            color: "#ffffff",
                            fontWeight: "bold",
                            flex: 1,
                          }}
                          onClick={() => {
                            SelectedMenus.length === 0
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
            backgroundColor: theme.primaryColor,
            color: "#ffffff",
            fontWeight: "bold",
            border: "none",
            padding: "10px 20px",
            fontSize: 20,
          }}
          onClick={() => setCartModal(true)}
        >
          <RiListOrdered2 /> ກະຕ່າລາຍການ
          <span style={{ marginLeft: "5px" }}>({SelectedMenus.length})</span>
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
                    {SelectedMenus?.length > 0 ? (
                      SelectedMenus?.map((data, index) => {
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
                                onClick={() =>
                                  handleSetQuantity(-1, data, index)
                                }
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
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "2px",
                                    margin: "0px 5px",
                                    cursor: "pointer",
                                    border: `2px solid ${theme.primaryColor}`,
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
                                    border: `2px solid ${theme.primaryColor}`,
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
                                onClick={() =>
                                  handleSetQuantity(1, data, index)
                                }
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
                                    color: theme.primaryColor,
                                  }}
                                  onClick={() => onConfirmRemoveItem(data)}
                                >
                                  <MdDelete />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <div className="h-[400] flex justify-center items-center">
                            <div className="flex flex-col items-center">
                              <BsCartXFill className="text-[100px] text-orange-500 animate-bounce" />
                              <p className="text-[16] mt-2 font-bold text-orange-500">
                                {t("no_order_list")}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="col-12">
                {SelectedMenus.length > 0 ? (
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
                  {SelectedMenus.length > 0 ? (
                    <>
                      <Button
                        variant="outline-warning"
                        className="hover-me"
                        style={{
                          marginRight: 15,
                          border: `solid 1px ${theme.primaryColor}`,
                          fontWeight: "bold",
                          backgroundColor: theme.primaryColor,
                          color: "#ffffff",
                        }}
                        onClick={() => {
                          setSelectedMenus([]);
                          setSelectedMenu([]);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        variant="light"
                        className="hover-me"
                        style={{
                          marginRight: 15,
                          backgroundColor: theme.primaryColor,
                          color: "#ffffff",
                          fontWeight: "bold",
                          flex: 1,
                        }}
                        onClick={() => {
                          SelectedMenus.length === 0
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
              {selectedItem?.name} (
              {moneyCurrency(calculateDiscount(selectedItem))}{" "}
              {storeDetail?.firstCurrency})
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
                  {storeDetail?.firstCurrency}
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
              {storeDetail?.firstCurrency}
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
        bill={bill}
        onPrintForCher={onPrintForCher}
        onQueue={billData}
        onPrintBill={onPrintBill}
        onPrintForCherLaBel={onPrintForCherLaBel}
        onPrintDrawer={onPrintDrawer}
        dataBill={SelectedMenus}
        open={popup?.CheckOutType}
        onClose={() => setPopup()}
        setDataBill={setDataBill}
        taxPercent={taxPercent}
        TotalPrice={TotalPrice()}
        setIsLoading={setIsLoading}
      />

      <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
        <BillForCheckOutCafe80
          data={bill}
          storeDetail={storeDetail}
          dataBill={SelectedMenus}
          taxPercent={taxPercent}
          profile={profile}
          meberData={dataBill}
        />
      </div>
      {SelectedMenus?.map((val, i) => {
        const totalPrice = () => {
          const totalOptionPrice = val?.totalOptionPrice || 0;
          return val?.price + totalOptionPrice;
        };
        return Array.from({ length: val?.quantity }).map((_, index) => {
          const key = `${val._id}-${index}`;
          return (
            <div
              key={key}
              // style={{
              //   width: "80mm",
              //   paddingRight: "20px",
              //   paddingBottom: "10px",
              // }}
              className="w-[80mm] pr-[20px pb-[10px]"
              ref={(el) => {
                if (el) {
                  billForCherCancel80.current[i] = el;
                }
              }}
            >
              <PrintLabel
                data={bill}
                bill={{ ...val }}
                totalPrice={totalPrice}
              />
            </div>
          );
        });
      })}
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
