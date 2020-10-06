import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Formik } from "formik"
import * as Yup from "yup"
import * as axios from 'axios'




const MenusDetail = ({ show, onHide, data }) => {

    const _onHandlerTable = async ({ values }) => {
        console.log("hello: ", values)
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            arialabelledby="contained-modal-title-vcenter"
            data={data}
        >
            <Formik
                initialValues={{ tableId: "" }}
                validationSchema={Yup.object({
                    tableId: Yup.string().required("ກາລຸນາເບີໂຕະ")
                })}
                onSubmit={async (values) => {
                    console.log("values: ", values);
                    await _onHandlerTable({ values });
                }}
            >
                {({
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    errors,
                    values
                }) => (
                        <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>ປ້ອນຂໍ້ມູນເບີໂຕະ {data}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="tableId">
                                    <Form.Label>ປ້ອນເບີໂຕະ:</Form.Label>
                                    <Form.Control
                                        type="tableId"
                                        placeholder="ປ້ອນເບີໂຕະ"
                                        onBlur={handleBlur}
                                        onChange={handleChange("tableId")}
                                        isInvalid={!!errors.tableId}
                                        value={values.tableId}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {touched.tableId && errors.tableId}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={onHide}
                                    style={{ width: 100, height: 50 }}>
                                    ຍົກເລີກ
                                </Button>
                                <Button
                                    variant="primary"
                                    style={{ width: 100, height: 50 }}
                                    onClick={handleSubmit}
                                >
                                    ບັນທຶກ
                            </Button>
                            </Modal.Footer>
                        </Form>
                    )}
            </Formik>
        </Modal>
    )
}

export default MenusDetail;

