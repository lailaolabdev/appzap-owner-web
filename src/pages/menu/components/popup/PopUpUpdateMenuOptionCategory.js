import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import {
    MENUS,
    getLocalData,
    END_POINT_SEVER_TABLE_MENU,
    master_menu_api_dev,
} from "../../../../constants/api";
import { COLOR_APP } from "../../../../constants";
import { getHeaders } from '../../../../services/auth';
import { successAdd, errorAdd } from "../../../../helpers/sweetalert";
// import { successAdd, errorAdd } from "../../helpers/sweetalert";

const PopUpUpdateMenuOptionCategory = ({
    show2,
    handleClose2,
    dataUpdate,
    getTokken,
    refreshMenuOptionCategory,
    refreshUpdatedOption
}) => {
    const { t } = useTranslation();
    const [menuOptions, setMenuOptions] = useState([]);
    const [isChooseOnlyOne, setChooseOnlyOne] = useState(false);

    // load menu options when component mount
    useEffect(() => {
        if (show2 && getTokken?.DATA?.storeId) {
            getMenuOptions(getTokken.DATA.storeId);
        }
    }, [show2, getTokken]);

    // setting initial state when received dataUpdate
    useEffect(() => {
        if (dataUpdate) {
            setChooseOnlyOne(dataUpdate.isChooseOnlyOne || false);
        }
    }, [dataUpdate]);

    const getMenuOptions = async (storeId) => {
        try {
            const response = await axios.get(
                END_POINT_SEVER_TABLE_MENU + `/v3/restaurant/${storeId}/menu-options`
            );
            setMenuOptions(response.data);
        } catch (error) {
            console.error("Error fetching menu options:", error);
        }
    };

    const _updateMenuOption = async (values) => {
        try {
            const _localData = await getLocalData();
            const header = await getHeaders();
            const headers = {
                "Content-Type": "application/json",
                Authorization: header.authorization,
            };
            const selectedOptions = values?.selectedOptions || [];
            if (selectedOptions.length === 0) {
                console.warn("No options selected");
            }
            const selectedOptionsWithPrice = selectedOptions.map(optionName => {
                const option = menuOptions.find(opt => opt.name === optionName);
                return {
                    name: optionName,
                    price: option ? option.price : 0
                };
            });
            const totalPrice = selectedOptionsWithPrice.reduce((total, option) => {
                return total + option.price;
            }, 0);
            const requestData = {
                data: {
                    name: values?.name,
                    selectedOptions: selectedOptionsWithPrice,
                    price: totalPrice,
                    isChooseOnlyOne: values?.isChooseOnlyOne || false,
                }
            };
            const resData = await axios.put(
                `${END_POINT_SEVER_TABLE_MENU}/v7/restaurant/menu-option-category/${dataUpdate._id}/update`,
                requestData,
                { headers: headers }
            );
            if (resData?.data) {
                handleClose2();
                if (refreshMenuOptionCategory) {
                    refreshMenuOptionCategory();
                }
                if (refreshUpdatedOption) {
                    refreshUpdatedOption(dataUpdate._id);
                }
                successAdd(t("edit_success"));
            }
        } catch (err) {
            console.error("Error updating menu option category:", err);
            errorAdd(t("edit_failed"));
        }
    };

    if (!dataUpdate) {
        return null; 
    }

    return (
        <div>
            <Modal show={show2} onHide={handleClose2} keyboard={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t("update_options")}</Modal.Title>
                </Modal.Header>
                
                <Formik
                    initialValues={{
                        name: dataUpdate?.name || "",
                        selectedOptions: dataUpdate?.selectedOptions?.map(option => option.name) || [],
                        isChooseOnlyOne: dataUpdate?.isChooseOnlyOne || false,
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = "ກະລຸນາປ້ອນຊື່ອ໋ອບຊັນ...";
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        _updateMenuOption(values);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>{t("options_name")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                        placeholder={t("enter_options_name")}
                                        style={{
                                            border:
                                                errors.name && touched.name && errors.name
                                                    ? "solid 1px red"
                                                    : "",
                                        }}
                                    />
                                </Form.Group>
                                
                                

                                <Form.Group controlId="allowMultipleSelection" style={{ marginBottom: "20px" }}>
                                    <Form.Check
                                        type="checkbox"
                                        id="allowMultipleSelection"
                                        label="ສາມາດເລືອກໄດ້ອັນດຽວ"
                                        checked={values.isChooseOnlyOne}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setChooseOnlyOne(isChecked);
                                            setFieldValue("isChooseOnlyOne", isChecked);
                                        }}
                                        style={{ fontSize: "16px", fontWeight: "500" }}
                                    />
                                </Form.Group>

                                {/* ສະແດງ Menu Options */}
                                <Form.Group controlId="menuOptionsSelectUpdate">
                                    <Form.Label>ເລືອກລາຍການອ໋ອບຊັນ</Form.Label>
                                    <div style={{ 
                                        maxHeight: "200px", 
                                        overflowY: "auto", 
                                        border: "1px solid #dee2e6", 
                                        borderRadius: "4px", 
                                        padding: "10px" 
                                    }}>
                                        {menuOptions && menuOptions.length > 0 ? (
                                            menuOptions.map((option, index) => (
                                                <Form.Check
                                                    key={option._id}
                                                    type="checkbox"
                                                    id={`update-option-${option._id}`}
                                                    label={
                                                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                                            <span>{option?.name}</span>
                                                        </div>
                                                    }
                                                    checked={values.selectedOptions.includes(option.name)}
                                                    onChange={(e) => {
                                                        const optionName = option.name;
                                                        const currentSelected = values.selectedOptions;

                                                        if (e.target.checked) {
                                                            setFieldValue("selectedOptions", [...currentSelected, optionName]);
                                                        } else {
                                                            setFieldValue("selectedOptions", currentSelected.filter(name => name !== optionName));
                                                        }
                                                    }}
                                                    style={{ marginBottom: "8px" }}
                                                />
                                            ))
                                        ) : (
                                            <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
                                                ບໍ່ມີລາຍການອ໋ອບຊັນໃນລາຍການນີ້
                                            </div>
                                        )}
                                    </div>
                                </Form.Group>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleClose2}>
                                    {t("cancel")}
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: COLOR_APP,
                                        color: "#ffff",
                                        border: 0,
                                    }}
                                    onClick={() => handleSubmit()}
                                >
                                    {t("save")}
                                </Button>
                            </Modal.Footer>
                        </form>
                    )}
                </Formik>
            </Modal>
        </div>
    )
}

export default PopUpUpdateMenuOptionCategory;