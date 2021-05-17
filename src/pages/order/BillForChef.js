import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Image } from 'react-bootstrap';
import { END_POINT, URL_PHOTO_AW3 } from '../../constants'
import { STORE } from '../../constants/api'
import profileImage from "../../image/profile.png"
export const BillForChef = () => {
    const { history, location, match } = useReactRouter()
    const [datanew, setData] = useState()
    const [dataStore, setStore] = useState()

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
        await fetch(STORE + `/?id=6092b8c247b38de5af7275b2`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setStore(json));
    }
    useEffect(() => {
        if (datanew && dataStore) {
            setTimeout(() => {
                window.print()
                window.close()
            }, 500);
        }
    }, [datanew, dataStore])
    return (
        <div className="col-12 center">
            <div style={{ textAlign: "center", paddingTop: 30 }}>
                <Col>
                    {dataStore?.image ? (
                        <center>
                            <Image src={URL_PHOTO_AW3 + dataStore?.image} alt="AeonIcon" width="150" height="150" style={{
                                height: 200,
                                width: 200,
                                borderRadius: '50%',
                            }} />
                        </center>
                    ) : (<center>
                        <Image src={profileImage} alt="AeonIcon" width="150" height="150" style={{
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
                                <th>ຕູບ</th>
                                <th>ຊື່ຜູ້ສັ່ງ</th>
                                <th>ຊື່ເມນູ</th>
                                <th>ຈຳນວນ</th>
                                <th>ລະຫັດຕູບ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datanew?.map((item, index) => {
                                return (
                                    <tr index={item}>
                                        <td>{index + 1}</td>
                                        <td>{item?.orderId?.table_id}</td>
                                        <td>{item?.orderId?.customer_nickname}</td>
                                        <td>{item?.menu?.name}</td>
                                        <td>{item?.quantity}</td>
                                        <td>{item?.code}</td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </Table>
                </Col>
            </div>
        </div>
    )
}
