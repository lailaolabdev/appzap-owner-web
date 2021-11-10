import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Image } from 'react-bootstrap';
import { STORE } from '../../../constants/api'
import profileImage from "../../../image/profile.png"
import moment from 'moment';

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
        let StatusMoney = this.props.StatusMoney;
        let amount = this.props.amount;
        let billId = this.props.billId;
        return (
            <div className="center" style={{ width: '100%', fontSize: 42 }}>
                <div style={{ textAlign: "center", paddingTop: 30 }}>
                    <Col>
                        {userData?.image ? (
                            <center>
                                <Image src={URL_PHOTO_AW3 + userData?.image} alt="" width="150" height="150" style={{
                                    height: 200,
                                    width: 200,
                                    borderRadius: '50%',
                                }} />
                            </center>
                        ) : (<center>
                            <Image src={profileImage} alt="" width="150" height="150" style={{
                                height: 200,
                                width: 200,
                                borderRadius: '50%',
                            }} />
                        </center>)}
                        <div style={{ height: 30 }}></div>
                        <p style={{ fontWeight: "bold" }}>ຮ້ານທົ່ງສາງທອງ</p>
                        <p style={{ fontWeight: "bold" }}>  ຍີນດີຕ້ອນຮັບ  </p>
                    </Col>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <div className="row col-sm-12 text-center">
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຕູບ : {code} </div>
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ເລກອໍເດີ : {billId} </div>
                        </div>
                        <div className="row col-sm-12 text-center">
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຊື່ຜູ້ສັ່ງ : {userData?.data?.firstname}</div>
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ວັນທີ : {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <Col xs={12}>
                        <Table responsive className="table" id='printMe' style={{ fontSize: 42 }}>
                            <thead style={{ backgroundColor: "#F1F1F1" }}>
                                <tr>
                                    <th>ຊື່ຜູ້ສັ່ງ</th>
                                    <th>ຊື່ເມນູ</th>
                                    <th>ຈຳນວນ</th>
                                    <th>ລາຄາ</th>
                                    <th>ເລກຕູບ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedMenu?.map((item, index) => {
                                    return (
                                        <tr index={item}>
                                            <td><b>{item?.orderId?.customer_nickname}</b></td>
                                            <td><b>{item?.name}</b></td>
                                            <td>{item?.quantity}</td>
                                            <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.price * item?.quantity)} ກີບ</b></td>
                                            <td>{item?.orderId?.table_id}</td>
                                        </tr>
                                    )
                                }
                                )}
                                <tr>
                                    <td colSpan={2} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ຍອດລ້ວມເງິນ : </td>
                                    <td colSpan={1} style={{ color: StatusMoney === 'ຍັງບໍ່ຊຳລະ' ? "red" : "green" }}>{StatusMoney}</td>
                                    <td colSpan={2} style={{ color: "blue" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(amount)} .ກີບ</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </div>
            </div>
        );
    }
}