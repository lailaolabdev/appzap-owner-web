import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Formik } from "formik";
import * as Yup from "yup";
import {
    Form,
    Row,
    Col,
    Button,
    Container,
    FormControl,
    InputGroup
} from "react-bootstrap";
import { BUTTON_OUTLINE_BLUE, BUTTON_SUCCESS, currency } from '../../../constants';
import { updateOrderData } from '../../../services/table';




const UpdateOrderModal = ({ show, hide, data }) => {
    const [selectedStatus, setSelectedStatus] = useState('WAITING');
    const [list, setList] = useState();


    const options = [
        { value: 'WAITING', label: "ລໍຖ້າ" },
        { value: 'DOING', label: "ກໍາລັງຄົວ" },
        { value: 'ORDERED', label: "ອໍເດີ້" },
        { value: 'CANCELED', label: "ຍົກເລີກ" }
    ];
    const _onSelectedStatus = async (selected) => {
        setSelectedStatus(selected.value)
    }


    return (
        < Modal
            show={show}
            hide={hide}
            centered
            arialabelledby="contained-modal-title-vcenter"
        >
            <Formik
                initialValues={{ quantity: "", status: selectedStatus }}
                validationSchema={Yup.object({
                    status: Yup.string().required("ກາລຸນາເລືອກສະຖານະ")
                })}
                onSubmit={async (values) => {
                    values.status = selectedStatus
                    console.log("valuesAAA: ", values);
                    updateOrderData(data, values);
                }}
            >
                {({
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    errors,
                    values
                }) => (<Form>
                    <Modal.Header closeButton>
                        <Modal.Title>ເເກ້ໄຂອໍເດີ້</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            ລະຫັດໃບບິນອໍເດີ້ :
                            <span style={{ color: 'blue' }}> {data}</span>
                            <div>
                                <p>ຈໍານວນ</p>
                                <InputGroup>
                                    <FormControl
                                        id="inlineFormInputGroup1"
                                        placeholder="ຈໍານວນ"
                                        onChange={handleChange("quantity")}
                                        onBlur={handleBlur}
                                        isInvalid={!!errors.quantity}
                                        value={values.quantity}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {touched.quantity && errors.quantity}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </div>
                            <div style={{ height: 24 }} />
                            <p>ເລືອກສະຖານະ:</p>
                            <div>
                                <Select
                                    options={options}
                                    onChange={_onSelectedStatus}
                                    autoFocus={true}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            // variant={BUTTON_OUTLINE_DARK}
                            // style={{ width: MODAL_BUTTON_SIZE }}
                            onClick={hide}
                        >
                            ຍົກເລີກ
						</Button>
                        <Button
                            // variant={BUTTON_DANGER}
                            // style={{ width: MODAL_BUTTON_SIZE }}
                            onClick={handleSubmit}
                        >
                            ຕົກລົງ
				        </Button>
                    </Modal.Footer>
                </Form>)}
            </Formik>
        </Modal >
    )
}
UpdateOrderModal.propTypes = {
    show: PropTypes.bool,
    hide: PropTypes.func,
    data: PropTypes.string
};

export default UpdateOrderModal;

