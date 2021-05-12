import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Image } from 'react-bootstrap';
import { END_POINT } from '../../constants'
import profileImage from "../../image/profile.png"
export const BillForChef = () => {
    const { history, location, match } = useReactRouter()
    const [datanew, setData] = useState()
    useEffect(() => {
        queryData()
    }, [])
    const queryData = async () => {
        const resData = await axios({
            method: 'GET',
            url: END_POINT + `/orderItemArray/${location?.search}`,
        }).then(async function (response) {
            setData(response?.data)
        }).catch(function (error) {
        })
    }
    useEffect(() => {
        if (datanew) {
            window.print()
            window.close()
        }
    }, [datanew])
    return (
        <div className="col-12 center">
            <div style={{ textAlign: "center", paddingTop: 30 }}>
                <Col>
                    <Image src={profileImage} roundedCircle style={{ height: 180, width: 180 }} />
                    <div style={{ height: 30 }}></div>
                    <h3 style={{ fontWeight: "bold" }}>ຮ້ານທົ່ງສາງທອງ</h3>
                    <p style={{ fontWeight: "bold" }}>  ຍີນດີຕ້ອນຮັບ  </p>
                </Col>
                <div style={{ padding: 10 }}>
                    <div className="row col-sm-12 text-center">
                        <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຕູບ :  {datanew ? datanew[0]?.orderId?.table_id : "-"}</div>
                        <div className="col-sm-6" style={{ fontWeight: "bold" }}>ເລກອໍເດີ : {datanew ? datanew[0]?.code : "-"}</div>
                    </div>
                    <div className="row col-sm-12 text-center">
                        <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຊື່ຜູ້ສັ່ງ : {datanew ? datanew[0]?.orderId?.customer_nickname : "-"}</div>
                        <div className="col-sm-6" style={{ fontWeight: "bold" }}>ວັນທີ : {new Date(datanew ? datanew[0]?.createdAt : '').toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
            <div style={{ paddingLeft: 200, paddingRight: 200 }}>
                <Col xs={12}>
                    <Table responsive class="table" id='printMe'>
                        <thead style={{ backgroundColor: "#F1F1F1" }}>
                            <tr>
                                <th>ລຳດັບ</th>
                                <th>ຊື່ເມນູ</th>
                                <th>ຈຳນວນ</th>
                                <th>ວັນທີ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datanew?.map((item, index) => {
                                return (
                                    <tr index={item}>
                                        <td>{index + 1}</td>
                                        <td><b>{item?.menu?.name}</b></td>
                                        <td>{item?.quantity}</td>
                                        {/* <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.menu?.price * item?.quantity)} ກີບ</b></td> */}
                                        <td>{new Date(item?.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                )
                            }
                            )}
                            {/* <tr>
                                <td colSpan={3} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ຍອດລ້ວມເງິນ : </td>
                                <td colSpan={2} style={{ color: "blue" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(amount)} .ກິບ</td>
                            </tr> */}
                        </tbody>
                    </Table>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: "bold" }}>ຂອຍໃຈທີ່ໃຊ້ບໍບລິການ</p>
                        <p style={{ fontWeight: "bold" }}>Thank you !</p>
                    </div>
                </Col>
            </div>
        </div>
    )
}
