import React, { useEffect, useState } from "react";
import IFrame from "../../components/IFrame";
// import { useNavigate } from 'react-router-dom'
import { converMoney } from "../../helpers/converMoney";
import jwt_decode from "jwt-decode";
import axios from "axios";

// icons
import { FaBowlFood } from "react-icons/fa";
import deCompileJson from "../../helpers/deCompileJson";
import compileJson from "../../helpers/compileJson";

// json
import homePageJson from "./presets/homePage";
import menuDetailPageJson from "./presets/menuDetailPage";
import cartPageJson from "./presets/cartPage";
import myBillPageJson from "./presets/myBillPage";
import myQRPageJson from "./presets/myQRPage";
import { getTheme } from "../../services/theme";

export default function SelfOrderingPage({
  storeDetail,
  token,
  environment,
  error,
}) {
  // const router = useRouter()
  const { _id } = storeDetail;

  // state
  const [isLoading, setIsloading] = useState(true); // status loadinng
  const [homePageJson, setHomePageJson] = useState(); // page home
  const [menuDetailPageJson, setMenuDetailPageJson] = useState(); // page menu detail
  const [cartPageJson, setCartPageJson] = useState(); // page cart
  const [myBillPageJson, setMyBillPageJson] = useState(); // page bill
  const [myQRPageJson, setMyQRPageJson] = useState(); // page qr

  const [ui, setUi] = useState({
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
      },
      children: "",
    },
  });
  const [menuCategory, setMenuCategory] = useState([]);
  const [menusBackup, setMenusBackup] = useState([]);
  const [menus, setMenus] = useState([]);
  const [menusRecommended, setMenusRecommended] = useState([]);
  const [selectMenuId, setSelectMenuId] = useState(); // id ຂອງເມນູທີ່ເລືອກ
  const [selectMenuCategoryId, setSelectMenuCategoryId] = useState("ALL"); // Categoryid ຂອງເມນູທີ່ເລືອກ
  const [selectMenuDetail, setSelectMenuDetail] = useState(); // ຂໍ້ມູນຂອງເມນູທີ່ເລືອກ
  const [cart, setCart] = useState([]); // ກະຕ໋າ
  const [cartLength, setCartLength] = useState({ num: 0 }); // ຈຳນວນອໍເດີໃນກະຕ໋າ
  const [myBill, setMyBill] = useState({ orderId: [] });
  const [tab, setTab] = useState("HOME");

  // useEffect
  // useEffect(() => {
  // 	console.log('router', router.pathname)
  // }, [])

  useEffect(() => {
    if (error) return;
    getDataCategory(_id);
    getDataMenus(_id);
  }, []);
  useEffect(() => {
    if (!isLoading) {
      getUi({ menus: [...menus], menuCategory: [...menuCategory] });
    }
  }, [isLoading, menus, menuCategory, selectMenuCategoryId]);

  useEffect(() => {
    if (selectMenuDetail) {
      showDatail();
      setTab("MENU_DETAIL");
    }
  }, [selectMenuDetail]);
  useEffect(() => {
    if (!isLoading) {
      if (tab == "HOME") {
        setSelectMenuDetail();
        getUi({ menus });
      } else if (tab == "MENU_DETAIL") {
        showDatail();
      } else if (tab == "BILL") {
        getUIMyBill();
        getMyBill().then(() => getUIMyBill());
      } else if (tab == "QR") {
        getUIMyQR();
      } else if (tab == "CART") {
        getUICart();
      }
    }
  }, [isLoading, tab, cart]);

  useEffect(() => {
    if (selectMenuCategoryId == "ALL") {
      setMenus(menusBackup);
    } else {
      const filterMenu = menusBackup.filter((e) => {
        if (e.categoryId._id == selectMenuCategoryId) {
          return true;
        } else {
          return false;
        }
      });
      setMenus(filterMenu);
    }
  }, [selectMenuCategoryId]);

  // function
  const getDataTheme = async () => {
    setIsloading(true);
    const _data = await getTheme();
    setIsloading(false);
  };
  const changeComment = (value) => {
    setSelectMenuDetail((prev) => ({ ...prev, note: value }));
  };
  const ChangeSelectMenuCategoryId = (menuCategoryId) => {
    console.log("menuCategoryId", menuCategoryId);
    setSelectMenuCategoryId(menuCategoryId);
    const _map = menuCategory.map((e) => {
      if (e?._id == menuCategoryId) {
        return { ...e, background: "orange", color: "white" };
      } else {
        return { ...e, color: "#000", background: "#fff" };
      }
    });
    setMenuCategory(_map);
  };
  const getMyBill = async () => {
    try {
      var decoded = jwt_decode(token);
      if (decoded?.data?.billId) {
        const res = await axios.get(
          environment + `/v3/bill/${decoded?.data?.billId}`
        );

        const _checkImg = res.data.orderId.map((e) => {
          if (e?.menuImage) {
            return e;
          } else {
            return {
              ...e,
              menuImage: "a8c2cef2-8bc2-4d97-ad53-b4b4e15bd58c.png",
            };
          }
        });
        setMyBill({ ...res?.data, orderId: _checkImg });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const confirmOrder = async () => {
    var decoded = jwt_decode(token);
    let _OrderR = [];
    for (let i = 0; i < cart?.length; i++) {
      _OrderR.push({
        id: cart[i]?._id,
        name: cart[i]?.name,
        quantity: cart[i]?.quantity,
        note: cart[i]?.note,
      });
    }
    const body = {
      orders: _OrderR,
      storeId: decoded?.data?.storeId,
      billId: decoded?.data?.billId,
    };

    await axios
      .post(environment + "/v3/user/bill/create", body)
      .then((res) => {
        if (res?.status === 200) {
          setCart([]);
          setCartLength({ num: 0 });
        }
      })
      .catch((err) => console.log(err));
  };
  const AddToCart = () => {
    let _num = cartLength.num + 1;
    setCartLength((prev) => ({ ...prev, num: _num }));
    setCart((prev) => [...prev, { ...selectMenuDetail }]);
    setTab("HOME");
  };
  const ChangeQuantity = (_num) => {
    let _quantity = selectMenuDetail.quantity + _num;
    if (_quantity < 1) {
      _quantity = 0;
    }
    setSelectMenuDetail((prev) => ({ ...prev, quantity: _quantity }));
  };
  const NavigateToDetail = (menuId) => {
    setSelectMenuDetail();
    const data = menus.find((e) => e?._id == menuId);
    setSelectMenuDetail({ ...data, quantity: 1 });
  };

  const getDataMenus = async (id) => {
    const _resMenus = await fetch(
      environment + `/v3/menus?isDeleted=false&storeId=${id}`
    );
    const _menusData = await _resMenus.json();

    const _checkImg = _menusData.map((e) => {
      if (e?.images?.length != 0) {
        return e;
      } else {
        return { ...e, images: ["a8c2cef2-8bc2-4d97-ad53-b4b4e15bd58c.png"] };
      }
    });
    const filterRecommended = _checkImg.filter((e) => e.recommended);
    setMenusRecommended(filterRecommended);
    setMenusBackup(_checkImg);
    setMenus(_checkImg);
  };
  const showCartNum = () => {
    if (cart.length > 0) {
      return "block";
    } else {
      return "none";
    }
  };
  const getDataCategory = async (id) => {
    const _resCategory = await fetch(
      environment + `/v3/categories?isDeleted=false&storeId=${id}`
    );
    const _categoriesData = await _resCategory.json();
    setMenuCategory(_categoriesData);
  };

  //
  const groupFunc = {
    NavigateToDetail,
    menus,
    menuCategory,
    selectMenuId,
    setSelectMenuId,
    selectMenuDetail,
    converMoney,
    cart,
    setCart,
    ChangeQuantity,
    AddToCart,
    showCartNum,
    cartLength,
    tab,
    setTab,
    confirmOrder,
    myBill,
    storeDetail,
    token,
    selectMenuCategoryId,
    setSelectMenuCategoryId,
    ChangeSelectMenuCategoryId,
    menusRecommended,
    setMenusRecommended,
    changeComment,
  };
  const getUi = ({ menus }) => {
    const data = compileJson(homePageJson);
    setUi(deCompileJson(data, groupFunc));
  };
  const showDatail = () => {
    const data = compileJson(menuDetailPageJson);

    setUi(deCompileJson(data, groupFunc));
  };
  const getUICart = () => {
    const data = compileJson(cartPageJson);
    setUi(deCompileJson(data, groupFunc));
  };
  const getUIMyBill = () => {
    const data = compileJson(myBillPageJson());
    setUi(deCompileJson(data, groupFunc));
  };
  const getUIMyQR = () => {
    const data = compileJson(myQRPageJson);
    setUi(deCompileJson(data, groupFunc));
  };

  return (
    <IFrame
      style={{
        width: "100%",
        height: "125%",
        border: "none",
        padding: 0,
        margin: 0,
      }}
      ui={ui}
    ></IFrame>
  );
}
