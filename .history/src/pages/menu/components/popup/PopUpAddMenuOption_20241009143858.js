import React, { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
  master_menu_api_dev,
} from "../../../../constants/api";

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
  const { t } = useTranslation();

  useEffect(() => {
    if (showSetting && detailMenu) {
      const storeId = getTokken?.DATA?.storeId;

      const fetchAllMenuOptions = async () => {
        try {
          const response = await axios.get(
            END_POINT_SEVER_TABLE_MENU +
              `/v3/restaurant/${storeId}/menu-options`
          );
          setAllMenuOptions(response.data);
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
          setSpecificMenuOptions(response.data);
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
      await axios.post(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/menu/${detailMenu.data._id}/menu-option/${optionId}/add`
      );
      const updatedOptions = await axios.get(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/menu/${detailMenu.data._id}/menu-options`
      );
      setSpecificMenuOptions(updatedOptions.data);
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
      await axios.delete(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/menu/${detailMenu.data._id}/menu-option/${optionId}/remove`
      );
      const updatedOptions = await axios.get(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/menu/${detailMenu.data._id}/menu-options`
      );
      setSpecificMenuOptions(updatedOptions.data);
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
            {t("list_of_optional")}
            <q>{detailMenu && detailMenu?.data?.name}</q> (
            {specificMenuOptions.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
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
                  <strong>{option.name}</strong> - {option.price}
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
                      "ລຶບ"
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
                      "ເພີ່ມ"
                    )}
                  </Button>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ປິດອອກ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopUpAddMenuOption;
