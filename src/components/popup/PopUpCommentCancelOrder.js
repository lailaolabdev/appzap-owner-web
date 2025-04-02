import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

const PopUpCommentCancelOrder = ({ open, onClose, onSaveComment }) => {
    const { t } = useTranslation();
    const [alertMessage, setAlertMessage] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [customComment, setCustomComment] = useState("");

    const cancelReasons = [
        { id: 1, text: "ລູກຄ້າຍົກເລີກ" }, // Customer canceled
        { id: 2, text: "ຜິດເຫດອາຫານຜິດ" }, // Wrong food order
        { id: 3, text: "ພະນັກງານເຮັດ ຢືນອາຫານຜິດ" }, // Staff made mistake or wrong food
        { id: 4, text: "ອາຫານດິບ" }, // Raw food
        { id: 5, text: "ອາຫານໝົດ" }, // Food sold out
        { id: 6, text: "ເຄື່ອງດື່ມໝົດ" }, // Drinks sold out
    ];

    const handleCloseAdd = () => {
        onClose();
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setCustomComment("");
    };

    const handleCustomCommentChange = (e) => {
        setCustomComment(e.target.value);
        setSelectedOption("");
    };

    const _create = (values) => {
        const finalComment = selectedOption || values.comment;
        onSaveComment(finalComment);
        onClose();
    };

    return (
        <div>
            <Modal
                show={open}
                onHide={onClose}
                backdrop="static"
                size="lg"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t("Reason_for_cancellation")}</Modal.Title>
                </Modal.Header>
                <Formik
                    enableReinitialize
                    initialValues={{
                        comment: customComment,
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.comment && !selectedOption) {
                            errors.comment = t("Please_provide_a_reason_for_cancellation");
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        _create(values);
                        setSubmitting(false);
                    }}
                >
                    {({
                        values,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        errors,
                        touched,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Modal.Body>
                                {alertMessage && (
                                    <div style={{ color: "red", marginBottom: "10px" }}>
                                        {alertMessage}
                                    </div>
                                )}
                                <Form.Group>
                                    
                                    {/* Predefined options */}
                                    {cancelReasons?.map(reason => (
                                        <div 
                                            key={reason.id} 
                                            className="border-bottom py-2"
                                            style={{ 
                                                cursor: 'pointer',
                                                backgroundColor: selectedOption === reason.text ? '#f8f9fa' : 'transparent',
                                                padding: '10px'
                                            }}
                                            onClick={() => {
                                                handleOptionSelect(reason.text);
                                                setFieldValue('comment', '');
                                            }}
                                        >
                                            {reason.text}
                                        </div>
                                    ))}
                                    
                                    {/* Custom comment input */}
                                    <div className="border-bottom py-2">
                                        <Form.Label>
                                            {t("ອື່ນໆ")}:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="comment"
                                            value={values.comment}
                                            onChange={(e) => {
                                                handleCustomCommentChange(e);
                                                handleChange(e);
                                            }}
                                            placeholder={t("Please_provide_a_reason_for_cancellation")}
                                            isInvalid={!!errors.comment && touched.comment && !selectedOption}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.comment}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseAdd}>
                                    {t("cancel")}
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting || (!values.comment && !selectedOption)}
                                >
                                    {isSubmitting ? "ກຳລັງບັນທຶກ..." : t("save")}
                                </Button>
                            </Modal.Footer>
                        </form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default PopUpCommentCancelOrder;