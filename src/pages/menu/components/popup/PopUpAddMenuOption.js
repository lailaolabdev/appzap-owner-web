import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
  master_menu_api_dev,
} from "../../../../constants/api";

import { useMenuStore } from "../../../../zustand/menuStore";

function PopUpAddMenuOption({
  showSetting,
  handleClose,
  detailMenu,
  getTokken,
  updateMenuOptionsCount,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allMenuOptions, setAllMenuOptions] = useState([]);
  const [specificMenuOptions, setSpecificMenuOptions] = useState([]);
  const [loadingOptionId, setLoadingOptionId] = useState(null);
  const [isAddingAll, setIsAddingAll] = useState(false);
  const [isRemovingAll, setIsRemovingAll] = useState(false);
  const { t } = useTranslation();
  const {
    addMunuOption,
    getMenusOptionByStoreId,
    getAllMenuOptione,
    deleteMenuOption,
  } = useMenuStore();

  useEffect(() => {
    if (showSetting && detailMenu) {
      const storeId = getTokken?.DATA?.storeId;

      const fetchAllMenuOptions = async () => {
        try {
          const response = await axios.get(
            END_POINT_SEVER_TABLE_MENU +
              `/v3/restaurant/${storeId}/menu-options`
          );
          setAllMenuOptions(response?.data);
        } catch (error) {
          console.error("Error fetching all menu options:", error);
        }
      };

      const fetchSpecificMenuOptions = async () => {
        try {
          const response = await axios.get(
            END_POINT_SEVER_TABLE_MENU +
              `/v3/menu/${detailMenu.data._id}/menu-options`
          );
          setSpecificMenuOptions(response?.data);
          updateMenuOptionsCount(detailMenu.data._id, response.data.length);
        } catch (error) {
          console.error("Error fetching specific menu options:", error);
        }
      };

      fetchAllMenuOptions();
      fetchSpecificMenuOptions();
    }
  }, [showSetting, detailMenu, getTokken]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddOption = async (optionId) => {
    setLoadingOptionId(optionId);
    try {
      await addMunuOption(detailMenu.data._id, optionId);
      const updatedOptions = await axios.get(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/menu/${detailMenu.data._id}/menu-options`
      );
      setSpecificMenuOptions(updatedOptions?.data);
      updateMenuOptionsCount(detailMenu.data._id, updatedOptions.data.length);
    } catch (error) {
      console.error("Error adding menu option:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding menu option. Please try again.",
      });
    } finally {
      setLoadingOptionId(null);
    }
  };

  const handleDeleteOption = async (optionId) => {
    setLoadingOptionId(optionId);
    try {
      await deleteMenuOption(detailMenu.data._id, optionId);
      const updatedOptions = await axios.get(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/menu/${detailMenu.data._id}/menu-options`
      );
      setSpecificMenuOptions(updatedOptions?.data);
      updateMenuOptionsCount(detailMenu.data._id, updatedOptions.data.length);
    } catch (error) {
      console.error("Error deleting menu option:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error deleting menu option. Please try again.",
      });
    } finally {
      setLoadingOptionId(null);
    }
  };

  const handleAddAllOptions = async () => {
    setIsAddingAll(true);
    try {
      for (const option of allMenuOptions) {
        if (!isSpecificOption(option._id)) {
          await addMunuOption(detailMenu.data._id, option._id);
        }
      }
      const updatedOptions = await axios.get(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/menu/${detailMenu.data._id}/menu-options`
      );
      setSpecificMenuOptions(updatedOptions?.data);
      updateMenuOptionsCount(detailMenu.data._id, updatedOptions.data.length);
    } catch (error) {
      console.error("Error adding all menu options:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding all menu options. Please try again.",
      });
    } finally {
      setIsAddingAll(false);
    }
  };

  const handleRemoveAllOptions = async () => {
    setIsRemovingAll(true);
    try {
      for (const option of specificMenuOptions) {
        await deleteMenuOption(detailMenu.data._id, option._id);
      }
      const updatedOptions = await axios.get(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/menu/${detailMenu.data._id}/menu-options`
      );
      setSpecificMenuOptions(updatedOptions?.data);
      updateMenuOptionsCount(detailMenu.data._id, updatedOptions.data.length);
    } catch (error) {
      console.error("Error removing all menu options:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error removing all menu options. Please try again.",
      });
    } finally {
      setIsRemovingAll(false);
    }
  };

  const filteredMenuOptions = allMenuOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSpecificOption = (optionId) => {
    return specificMenuOptions.some((option) => option._id === optionId);
  };

  const sortedMenuOptions = filteredMenuOptions.sort((a, b) => {
    if (isSpecificOption(a._id) && !isSpecificOption(b._id)) {
      return -1;
    } else if (!isSpecificOption(a._id) && isSpecificOption(b._id)) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <div>
      <Modal
        show={showSetting}
        onHide={handleClose}
        size="lg"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <Modal.Header>
          <Modal.Title style={{ color: "#fb6e3b", fontWeight: "800" }}>
            {t("additional_options_of")}:{" "}
            <q>{detailMenu && detailMenu?.data?.name}</q>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          <div className="flex flex-row justify-between mb-2 text-lg font-semibold">
            <span className="mt-1">
              ລາຍການທັງໝົດ {sortedMenuOptions?.length} ລາຍການ
            </span>
            <div>
              <button
                className="rounded-lg bg-color-app py-2 px-2 border border-transparent text-center text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-2"
                type="button"
                onClick={handleAddAllOptions}
                disabled={isAddingAll || isRemovingAll}
              >
                {isAddingAll ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  t("add_all")
                )}
              </button>
              <button
                className="rounded-lg bg-red-500 py-2 px-2 border border-transparent text-center text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={handleRemoveAllOptions}
                disabled={isRemovingAll || isAddingAll}
              >
                {isRemovingAll ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  t("remove_all")
                )}
              </button>
            </div>
          </div>
          <ListGroup>
            {sortedMenuOptions.map((option, index) => (
              <ListGroup.Item
                key={index}
                className={`d-flex justify-content-between align-items-center ${
                  isSpecificOption(option._id) ? "list-group-item-primary" : ""
                }`}
                style={
                  isSpecificOption(option._id)
                    ? { backgroundColor: "lightgrey" }
                    : {}
                }
              >
                <div>
                  <strong>{option.name}</strong> -{" "}
                  {new Intl.NumberFormat("lo-LA", {
                    style: "currency",
                    currency: "LAK",
                    minimumFractionDigits: 0,
                  }).format(option.price)}
                </div>
                {isSpecificOption(option._id) ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteOption(option._id)}
                    disabled={loadingOptionId === option._id}
                  >
                    {loadingOptionId === option._id ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      t("delete")
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAddOption(option._id)}
                    disabled={loadingOptionId === option._id}
                  >
                    {loadingOptionId === option._id ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      t("add")
                    )}
                  </Button>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopUpAddMenuOption;
