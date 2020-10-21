import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import Checkbox from "@material-ui/core/Checkbox";
import Button from 'react-bootstrap/Button'
import { BUTTON_OUTLINE_BLUE, BUTTON_SUCCESS, currency } from '../../../constants';
import { getOrderData } from '../../../services/table';


const MenusItemDetail = (props) => {
    const [orderData, setOrderData] = useState();
    const [menuItemData, setMenuItemData] = useState();

    // React.useEffect(() => {
    //     if (props) {
    //         let _menuItemData = props.value;
    //         setMenuItemData(_menuItemData)
    //     }
    // }, [props]);

    React.useEffect(() => {
        if (props) {
            let _menuItemData = props.value;
            const fetchData = async () => {
                let res = await getOrderData(_menuItemData);
                setOrderData(res);
            }
            fetchData();
        }
    }, [props]);



    return (
        < Modal
            show={props.show}
            onHide={props.hide}
            centered
            arialabelledby="contained-modal-title-vcenter"
            style={{ minHeight: "100vh", width: "100%" }}
        >
            <Modal.Header closeButton>
                <Modal.Title>ລາຍລະອຽດເມນູອໍເດີ້</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table
                    style={{ minHeight: "50vh", width: "100%" }}
                    responsive
                    className="staff-table-list borderless table-hover"
                >
                    <thead style={{ backgroundColor: '#F1F1F1', }}>
                        <tr>
                            <th >ລຳດັບ</th>
                            <th >ຊື່ເມນູ</th>
                            <th>ຈຳນວນ</th>
                            <th >ລາຄາ</th>
                        </tr>
                    </thead>
                    {orderData && orderData.map((value, index) => {
                        return (
                            <tr
                                key={index}
                            >
                                <td>{index + 1}</td>
                                <td>{value?.order_item[0]?.menu.name ?? ""}</td>
                                <td>{currency(value?.order_item[0]?.quantity ?? "")}</td>
                                <td>{currency(value?.order_item[0]?.menu?.price ?? "")}</td>
                            </tr>
                        )
                    })}
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-end">
                    <div className="p-2 col-example text-left">ລາຄາລວມ:</div>
                    <div className="p-2 col-example text-left"
                        style={{
                            backgroundColor: "#F1F1F1",
                            width: 140,
                            height: 40
                        }}
                    >
                        <span>{currency(1234)}</span>
                        <span style={{ justifyContent: "flex-end", display: "row" }}>ກີບ</span>
                    </div>
                </div>
            </Modal.Footer>
        </Modal >
    )
}
MenusItemDetail.propTypes = {
    show: PropTypes.bool,
    hide: PropTypes.func,
    value: PropTypes.string,
};
export default MenusItemDetail;

