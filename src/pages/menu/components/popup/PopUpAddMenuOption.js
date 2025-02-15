import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";
import useMenuOptionsStore from "../../../../zustand/menuOptionsStore";

function PopUpAddMenuOption({
  showSetting,
  handleClose,
  detailMenu,
  getTokken,
  updateMenuOptionsCount,
}) {
  const { t } = useTranslation();
  const storeId = getTokken?.DATA?.storeId;
  const menuId = detailMenu?.data?._id;

  // Zustand store
  const {
    allMenuOptions,
    specificMenuOptions,
    loadingOptionId,
    fetchAllMenuOptions,
    fetchSpecificMenuOptions,
    addMenuOption,
    deleteMenuOption,
  } = useMenuOptionsStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (showSetting && detailMenu) {
      fetchAllMenuOptions(storeId);
      fetchSpecificMenuOptions(menuId, updateMenuOptionsCount);
    }
  }, [
    showSetting,
    detailMenu,
    storeId,
    menuId,
    fetchAllMenuOptions,
    fetchSpecificMenuOptions,
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMenuOptions = allMenuOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSpecificOption = (optionId) =>
    specificMenuOptions.some((option) => option._id === optionId);

  const sortedMenuOptions = filteredMenuOptions.sort((a, b) => {
    return isSpecificOption(a._id) && !isSpecificOption(b._id) ? -1 : 1;
  });

  return (
    <Modal show={showSetting} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title style={{ color: "#fb6e3b", fontWeight: "800" }}>
          {t("additional_options_of")}: <q>{detailMenu?.data?.name}</q> (
          {specificMenuOptions.length})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <ListGroup>
          {sortedMenuOptions.map((option) => (
            <ListGroup.Item
              key={option._id}
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
                  onClick={() =>
                    deleteMenuOption(menuId, option._id, updateMenuOptionsCount)
                  }
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
                  onClick={() =>
                    addMenuOption(menuId, option._id, updateMenuOptionsCount)
                  }
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
  );
}

export default PopUpAddMenuOption;
