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
        return (
            <div className="center" style={{ width: '100%', fontSize: 74 }}>
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
                        <h3 style={{ fontWeight: "bold" }}>ຮ້ານທົ່ງສາງທອງ</h3>
                        <p style={{ fontWeight: "bold" }}>  ຍີນດີຕ້ອນຮັບ  </p>
                    </Col>
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
                        <Table responsive class="table" id='printMe' style={{fontSize: 74}}>
                            <thead style={{ backgroundColor: "#F1F1F1" }}>
                                <tr>
                                    <th>ລຳດັບ</th>
                                    <th>ຊື່ເມນູ</th>
                                    <th>ຈຳນວນ</th>
                                    <th>ລາຄາຕໍ່ອັນ</th>
                                    <th>ລາຄາລ້ວມ</th>
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
                                                <td>{tableId}</td>
                                                <td>
                                                    {/* <i class="fa fa-plus" aria-hidden="true"></i> */}
                                                    {data.quantity}
                                                    {/* <i class="fa fa-minus" aria-hidden="true"></i> */}
                                                </td>

                                                <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(data.quantity * data.price)} .ກິບ</td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td colSpan={3} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ຍອດລວມເງິນ : </td>
                                    <td colSpan={2} style={{ color: "blue" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(totalPrice)} .ກິບ</td>
                                </tr>
                            </tbody>
                        </Table>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontWeight: "bold" }}>ຂອຍໃຈທີ່ໃຊ້ບໍລິການ</p>
                            <p style={{ fontWeight: "bold" }}>Thank you !</p>
                        </div>
                    </Col>
                </div>
            </div>
        );
    }
}