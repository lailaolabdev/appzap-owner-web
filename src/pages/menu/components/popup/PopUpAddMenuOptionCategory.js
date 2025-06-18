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
import { COLOR_APP } from "../../../../constants";
import { getHeaders } from '../../../../services/auth';
import { successAdd, errorAdd } from "../../../../helpers/sweetalert";

import { useMenuStore } from "../../../../zustand/menuStore";
import PopUpUpdateMenuOptionCategory from "./PopUpUpdateMenuOptionCategory";

function PopUpAddMenuOptionCategory({
    showSetting,
    handleClose,
    detailMenu,
    getTokken,
    updateMenuOptionsCount,
}) {
    const [allMenuOptions, setAllMenuOptions] = useState([]);
    const [specificMenuOptions, setSpecificMenuOptions] = useState([]);
    const [loadingOptionId, setLoadingOptionId] = useState(null);
    const [isAddingAll, setIsAddingAll] = useState(false);
    const [isRemovingAll, setIsRemovingAll] = useState(false);
    const [menuOptionCategory, setMenuOptionCategory] = useState([]);
    const [show2, setShow2] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null); 
    
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

            const getMenuOptionCategory = async (storeId) => {
                try {
                    const res = await axios.get(
                        END_POINT_SEVER_TABLE_MENU + `/v7/restaurant/${storeId}/menu-option-category`
                    );
                    setMenuOptionCategory(res.data);
                } catch (err) {
                    console.log(err);
                }
            };

            fetchAllMenuOptions();
            fetchSpecificMenuOptions();
            getMenuOptionCategory(storeId);
        }
    }, [showSetting, detailMenu, getTokken]);

    const handleEditOption = (option) => {
        setDataUpdate(option);
        setShow2(true);
    };

    const handleClose2 = () => {
        setShow2(false);
        setDataUpdate(null);
    };



    const refreshMenuOptionCategory = async () => {
        const storeId = getTokken?.DATA?.storeId;
        if (storeId) {
            try {
                const res = await axios.get(
                    END_POINT_SEVER_TABLE_MENU + `/v7/restaurant/${storeId}/menu-option-category`
                );
                setMenuOptionCategory(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };
    

    // add refresh option that was updated
    const refreshUpdatedOption = async (optionId) => {
        const isSelected = isSpecificOption(optionId);
        if (isSelected) {
            try {
                await deleteMenuOption(detailMenu.data._id, optionId);
                await addMunuOption(detailMenu.data._id, optionId);
                const updatedOptions = await axios.get(
                    END_POINT_SEVER_TABLE_MENU +
                    `/v3/menu/${detailMenu.data._id}/menu-options`
                );
                setSpecificMenuOptions(updatedOptions?.data);
                updateMenuOptionsCount(detailMenu.data._id, updatedOptions.data.length);
                
            } catch (error) {
                console.error("Error refreshing updated option:", error);
            }
        }
    };

    const handleUseOption = async (optionId) => {
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

    const handleDontUseOption = async (optionId) => {
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
            for (const option of menuOptionCategory) {
                if (!isSpecificOption(option._id)) {
                    await addMunuOption(detailMenu?.data._id, option._id);
                }
            }
            const updatedOptions = await axios.get(
                END_POINT_SEVER_TABLE_MENU +
                `/v3/menu/${detailMenu?.data._id}/menu-options`
            );
            setSpecificMenuOptions(updatedOptions?.data);
            updateMenuOptionsCount(detailMenu?.data._id, updatedOptions.data.length);
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
                await deleteMenuOption(detailMenu?.data._id, option._id);
            }
            const updatedOptions = await axios.get(
                END_POINT_SEVER_TABLE_MENU +
                `/v3/menu/${detailMenu?.data._id}/menu-options`
            );
            setSpecificMenuOptions(updatedOptions?.data);
            updateMenuOptionsCount(detailMenu?.data._id, updatedOptions.data.length);
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

    const handleDeleteClick = (option) => {
        Swal.fire({
            title: t("ຍືນຍັນການລົບ"),
            text: `${t("ຍືນຍັນການລົບ")} "${option.name}"?`,
            icon: "warning",
            showCancelButton: true,
            reverseButtons:true,
            confirmButtonColor: COLOR_APP,
            cancelButtonText: t("cancel"),
            confirmButtonText: t("delete"),
            cancelButtonColor: "secondary",
        }).then((result) => {
            if (result.isConfirmed) {
                _confirmeDeleteOptionCategory(option);
            }
        });
    };

     const _confirmeDeleteOptionCategory = async (option) => {
        try {
            const header = await getHeaders();
            const headers = {
                "Content-Type": "application/json",
                Authorization: header.authorization,
            };
            const resData = await axios.delete(
                `${END_POINT_SEVER_TABLE_MENU}/v7/menu-option-category/${option._id}/delete`,
                { headers: headers }
            );
            if (resData?.data) {
                await refreshMenuOptionCategory();
                await deleteMenuOption(detailMenu.data._id, option._id);
                successAdd(t("delete_success"));
            }
        } catch (err) {
            errorAdd(t("delete_failed"));
        }
    };

    const isSpecificOption = (optionId) => {
        return specificMenuOptions.some((option) => option?._id === optionId);
    };

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
                            ລາຍການທັງໝົດ {menuOptionCategory?.length} ລາຍການ
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
                                    t("ໃຊ້ອ໋ອບຊັນທັງໝົດ")
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
                                    t("ຍົກເລີກໃຊ້ອ໋ອບຊັນທັງໝົດ")
                                )}
                            </button>
                        </div>
                    </div>
                    <ListGroup>
                        {menuOptionCategory.map((option, index) => (
                            <ListGroup.Item
                                key={index}
                                className={`d-flex justify-content-between align-items-center ${isSpecificOption(option?._id) ? "list-group-item-primary" : ""
                                    }`}
                                style={
                                    isSpecificOption(option?._id)
                                        ? { backgroundColor: "lightgrey" }
                                        : {}
                                }
                            >
                                <div>
                                    <strong>{option?.name}</strong> -{" "}
                                    {option?.selectedOptions?.length > 0 && (
                                        <span style={{ marginLeft: 5 }}>
                                            (
                                            {option.selectedOptions.map((opt, idx) => (
                                                <span key={idx}>
                                                    {opt?.name}
                                                    {idx < option?.selectedOptions.length - 1 ? ", " : ""}
                                                </span>
                                            ))}
                                            )
                                        </span>
                                    )} : 
                                    {new Intl.NumberFormat("lo-LA", {
                                      minimumFractionDigits: 0,
                                    }).format(option?.price)} LAK
                                </div>
                                <div className="d-flex gap-2">
                                    <Button
                                        style={{
                                            margin:"0px"
                                        }}
                                        variant="warning" 
                                        size="sm"
                                        className=""
                                        onClick={() => handleEditOption(option)}
                                    >
                                        {t("edit")}
                                    </Button>

                                    {isSpecificOption(option?._id) ? (
                                        <Button
                                            //variant="orange"
                                            size="sm"
                                            className=" bg-orange"
                                            onClick={() => handleDontUseOption(option?._id)}
                                            disabled={loadingOptionId === option?._id}
                                        >
                                            {loadingOptionId === option?._id ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                t("ຍົກເລີກໃຊ້ອ໋ອບຊັນ")
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleUseOption(option?._id)}
                                            disabled={loadingOptionId === option?._id}
                                        >
                                            {loadingOptionId === option?._id ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                t("ໃຊ້ອ໋ອບຊັນ")
                                            )}
                                        </Button>
                                    )}
                                    <Button
                                        style={{
                                            margin:"0px"
                                        }}
                                        variant="danger" 
                                        size="sm"
                                        className=""
                                        onClick={() => handleDeleteClick(option)}
                                    >
                                        {t("delete")}
                                    </Button>
                                </div>
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
            
            <PopUpUpdateMenuOptionCategory
                show2={show2}
                handleClose2={handleClose2}
                dataUpdate={dataUpdate}
                getTokken={getTokken}
                refreshMenuOptionCategory={refreshMenuOptionCategory}
                refreshUpdatedOption={refreshUpdatedOption}
            />
        </div>
    );
}

export default PopUpAddMenuOptionCategory;
