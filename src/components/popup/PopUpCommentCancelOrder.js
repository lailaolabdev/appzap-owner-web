import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations

const PopUpCommentCancelOrder = ({ open, onClose, onSaveComment }) => {
    const { t } = useTranslation();
    const [alertMessage, setAlertMessage] = useState(null);

    const handleCloseAdd = () => {
        onClose();
    };

    const _create = (values) => {
        // Save the comment
        onSaveComment(values.comment);
        onClose();
    };

    return (
        <div>
            <Modal
                show={open}
                onHide={onClose}
                backdrop="static"
                size="lg" // Fixed typo from "zise" to "size"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t("Reason_for_cancellation")}</Modal.Title>
                </Modal.Header>
                <Formik
                    enableReinitialize
                    initialValues={{
                        comment: "",
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.comment) {
                            errors.comment = t("Please_provide_a_reason_for_cancellation");
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        _create(values);
                        setSubmitting(false); // reset submitting status
                    }}
                >
                    {({
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        errors,
                        touched,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Modal.Body>
                                {alertMessage && (
                                    <div style={{ color: "red", marginBottom: "10px" }}>
                                        {alertMessage}
                                    </div>
                                )}
                                <Form.Group>
                                    <Form.Label style={{ fontWeight: "bold" }}>
                                        {t("Reason_for_cancellation")} <span style={{ color: "red" }}>*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="comment"
                                        onChange={handleChange}
                                        placeholder={t("Please_provide_a_reason_for_cancellation")}
                                        isInvalid={!!errors.comment && touched.comment}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.comment}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseAdd}>
                                    {t("cancel")}
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting}
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