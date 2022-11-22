import React, { useState, useEffect } from "react";
import PopUpAddMenu from "../../components/popup/PopUpAddMenu";
import PopUpEditMenu from "../../components/popup/PopUpEditMenu";
import { getMenuCategorys } from "../../services/menuCategory";
import { getMenus, addMenu, updateMenu, deleteMenu } from "../../services/menu";
import { useStore } from "../../store/useStore";
import { Image, Button } from "react-bootstrap";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import { moneyCurrency } from "../../helpers";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import PopUpConfirm from "../../components/popup/PopUpConfirm";
import Table from "../../components/Table";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";

import { Box } from "@material-ui/core";

export default function List() {
  // state
  const { isMenuCategoryLoading, setMenuCategoryLoading } = useStore();
  const { menuCategory, setMenuCategory } = useStore();
  const { isMenuLoading, setMenuLoading } = useStore();
  const { menu, setMenu } = useStore();

  const [popupAddMenu, setPopupAddMenu] = useState(false);
  const [popupEditMenu, setPopupEditMenu] = useState(false);
  const [popupDeleteMenu, setPopupDeleteMenu] = useState(false);
  const [select, setSelect] = useState();

  // functions
  const _getMenuCategory = async () => {
    setMenuCategoryLoading(true);
    const _menuCategory = await getMenuCategorys();
    setMenuCategory(_menuCategory);
    setMenuCategoryLoading(false);
  };

  const _addMenu = async (values) => {
    const _menu = await addMenu(values);
    if (!_menu) {
      warningAlert("ບໍ່ສາມາດເພີ່ມເມນູໄດ້");
    } else {
      successAdd("ເພີ່ມເມນູສຳເລັດ");
      setPopupAddMenu(false);
      _getMenus();
    }
  };
  const _updateMenu = async (values) => {
    const _menu = await updateMenu(values, select?._id);
    if (!_menu) {
      warningAlert("ບໍ່ສາມາດແກ້ໄຂເມນູໄດ້");
    } else {
      successAdd("ແກ້ໄຂເມນູສຳເລັດ");
      setPopupEditMenu(false);
      _getMenus();
    }
  };
  const _deleteMenu = async () => {
    const _menu = await deleteMenu(select?._id);
    if (!_menu) {
      warningAlert("ບໍ່ສາມາດລົບເມນູໄດ້");
    } else {
      successAdd("ລົບເມນູສຳເລັດ");
      setPopupDeleteMenu(false);
      _getMenus();
    }
  };
  const _getMenus = async () => {
    setMenuLoading(true);
    const _menu = await getMenus();
    setMenu(_menu);
    setMenuLoading(false);
  };

  // useEffect
  useEffect(() => {
    _getMenuCategory();
    _getMenus();
  }, []);
  return (
    <div>
      <div>
        <Button
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={() => setPopupAddMenu(true)}
        >
          ເພີ່ມເມນູອາຫານ
        </Button>
        <div>
          <Box sx={{ width: "100%" }}>
            <Table style={{ width: "100%" }}>
              <thead className="thead-light">
                <tr>
                  <Box
                    scope="col"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    #
                  </Box>
                  <Box
                    scope="col"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    ຮູບພາບ
                  </Box>
                  <Box
                    scope="col"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    ຊື່ປະເພດອາຫານ
                  </Box>
                  <th scope="col">ຊື່ອາຫານ</th>
                  <th scope="col">ລາຄາ</th>
                  {/* <th scope="col">ໝາຍເຫດ</th> */}
                  <th scope="col">ຈັດການຂໍ້ມູນ</th>
                </tr>
              </thead>
              <tbody>
                {menu?.map((data, index) => {
                  return (
                    <tr>
                      <Box
                        scope="col"
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <td>{index + 1}</td>
                      </Box>
                      <Box
                        scope="col"
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <td>
                          <Image
                            src={URL_PHOTO_AW3 + data?.images?.[0]}
                            width="150"
                            height="150"
                            style={{
                              height: 50,
                              width: 50,
                              borderRadius: 8,
                            }}
                          />
                        </td>
                      </Box>
                      <Box
                        scope="col"
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <td>{data?.categoryId?.name}</td>
                      </Box>
                      <td>{data?.name}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "end",
                          }}
                        >
                          <span>{moneyCurrency(data?.price)} ₭</span>
                          {data?.menuOptionId?.map((e, i) => (
                            <span key={i}>{moneyCurrency(e?.price)} ₭</span>
                          ))}
                        </div>
                      </td>
                      {/* <td>{data?.detail ? data?.detail : " "}</td> */}
                      <td>
                        <div style={{ display: "flex", gap: 10 }}>
                          <ButtonPrimary
                            onClick={() => {
                              setSelect(data);
                              setPopupEditMenu(true);
                            }}
                          >
                            <FaEdit style={{ color: "white" }} />
                          </ButtonPrimary>
                          <ButtonPrimary
                            onClick={() => {
                              setSelect(data);
                              setPopupDeleteMenu(true);
                            }}
                          >
                            <RiDeleteBin6Fill style={{ color: "white" }} />
                          </ButtonPrimary>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Box>
        </div>
      </div>
      {/* popup */}
      <PopUpAddMenu
        open={popupAddMenu}
        onClose={() => setPopupAddMenu(false)}
        onSubmit={(e) => {
          _addMenu(e);
          // setPopupAddMenu(false);
        }}
      />
      <PopUpEditMenu
        open={popupEditMenu}
        value={select}
        onClose={() => setPopupEditMenu(false)}
        onSubmit={(e) => {
          _updateMenu(e);
        }}
      />
      <PopUpConfirm
        open={popupDeleteMenu}
        text1="ທ່ານຕ້ອງການລົບເມນູຫຼືບໍ"
        text2={select?.name}
        onSubmit={_deleteMenu}
        onClose={() => setPopupDeleteMenu(false)}
      />
    </div>
  );
}
