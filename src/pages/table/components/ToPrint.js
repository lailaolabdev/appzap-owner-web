import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Image } from 'react-bootstrap';
import { STORE } from '../../../constants/api'
import profileImage from "../../../image/profile.png"

/**
 * const
 **/
import {
    URL_PHOTO_AW3,
} from "../../../constants/index";

export class ComponentToPrint extends React.PureComponent {
    render() {
        let userData = this.props.userData;
        let totalPrice = 0;
        let selectedMenu = this.props.selectedMenu;
        let tableId = this.props.tableId;
        let code = this.props.code;
        let note = this.props.note;
        return (
            <div className="center" style={{ width: '100%', fontSize: 74 }}>
                <div style={{ textAlign: "center", paddingTop: 30 }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <div className="row col-sm-12 text-center">
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຕູບ : {code} </div>
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ເລກອໍເດີ : {tableId} </div>
                        </div>
                        <div className="row col-sm-12 text-center">
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຊື່ຜູ້ສັ່ງ : {userData?.data?.firstname}</div>
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ວັນທີ : {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <Col xs={12}>
                        <Table responsive className="table" id='printMe' style={{ fontSize: 74 }}>
                            <thead style={{ backgroundColor: "#F1F1F1" }}>
                                <tr>
                                    <th>ລຳດັບAAAAA</th>
                                    <th>ຊື່ເມນູ</th>
                                    <th>ຈຳນວນ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    selectedMenu && selectedMenu.map((data, index) => {
                                        totalPrice = totalPrice + (data.quantity * data.price);
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.name}</td>
                                                <td>{data.quantity}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <div>
                            {note && `ຄອມເມັ້ນລົດຊາດ ${note}`}
                        </div>
                    </Col>
                </div>
            </div>
        );
    }
}