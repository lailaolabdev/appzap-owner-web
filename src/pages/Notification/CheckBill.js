import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Image } from 'react-bootstrap';
import { END_POINT, URL_PHOTO_AW3 } from '../../constants'
import { STORE } from '../../constants/api'
import profileImage from "../../image/profile.png"
export default function CheckBill() {
    const { history, location, match } = useReactRouter()
    const [newData, setgetNewData] = useState()
    const [amount, setgetAmount] = useState()
    const [data, setData] = useState([])
    const [dataStore, setStore] = useState()
    useEffect(() => {
        _searchDate()
    }, [])
    const _searchDate = async () => {
        const url = END_POINT + `/orders/${location?.search}`;
        await fetch(url)
            .then(response => response.json())
            .then(response => {
                setData(response)
            })
        await fetch(STORE + `/?id=${match?.params?.id}`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setStore(json));
    }
    useEffect(() => {
        let amountAll = 0
        let allData = []
        for (let i = 0; i < data.length; i++) {
            for (let k = 0; k < data[i]?.order_item.length; k++) {
                allData.push(data[i]?.order_item[k])
                amountAll += data[i]?.order_item[k]?.quantity * data[i]?.order_item[k]?.menu?.price
            }
        }
        setgetAmount(amountAll)
        setgetNewData(allData)
    }, [data])
    useEffect(() => {
        if (dataStore && newData && amount && data) {
            setTimeout(() => {
                window.print()
                window.close()
            }, 500);
        }
    }, [dataStore, newData, amount, data])
    return (
        <div className="col-12 center">
            <div style={{ textAlign: "center", paddingTop: 30 }}>
                <Col>
                    {dataStore?.image ? (
                        <center>
                            <Image src={URL_PHOTO_AW3 + dataStore?.image} alt="" width="150" height="150" style={{
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
                <div style={{ padding: 10 }}>
                    <div className="row col-sm-12 text-center">
                        <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຕູບ :  {newData ? newData[0]?.orderId?.table_id : "-"}</div>
                        <div className="col-sm-6" style={{ fontWeight: "bold" }}>ເລກອໍເດີ : {newData ? newData[0]?.code : "-"}</div>
                    </div>
                    <div className="row col-sm-12 text-center">
                        <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຊື່ຜູ້ສັ່ງ : {newData ? newData[0]?.orderId?.customer_nickname : "-"}</div>
                        <div className="col-sm-6" style={{ fontWeight: "bold" }}>ວັນທີ : {new Date(newData ? newData[0]?.createdAt : '').toLocaleDateString()}</div>
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
                                <th>ລາຄາຕໍ່ອັນ</th>
                                <th>ລາຄາລ້ວມ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newData?.map((item, index) => {
                                return (
                                    <tr index={item}>
                                        <td>{index + 1}</td>
                                        <td><b>{item?.menu?.name}</b></td>
                                        <td>{item?.quantity}</td>
                                        <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.menu?.price)} ກີບ</b></td>
                                        <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.menu?.price * item?.quantity)} ກີບ</b></td>
                                    </tr>
                                )
                            }
                            )}
                            <tr>
                                <td colSpan={3} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ຍອດລ້ວມເງິນ : </td>
                                <td colSpan={2} style={{ color: "blue" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(amount)} .ກິບ</td>
                            </tr>
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
