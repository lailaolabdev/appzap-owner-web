import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Image } from 'react-bootstrap';
import { END_POINT, URL_PHOTO_AW3 } from '../../constants'
import { STORE } from '../../constants/api'
import profileImage from "../../image/profile.png"
export const BillForChef = () => {
    const { location } = useReactRouter()
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
            setTimeout(() => {
                window.print()
                window.close()
            }, 500);
        }
    }, [datanew])
    return (
        <div className="col-12 center" style={{fontFamily:"phetsarath ot"}}>
            <div style={{ textAlign: "center" }}>
                <div style={{ padding: 10 }}>
                    <div className="row col-sm-12 text-center">
                        <div className="col-sm-6" style={{ fontWeight: "bold", fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>ວັນທີ : {new Date(datanew ? datanew[0]?.createdAt : '').toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
            <div style={{  }}>
                <Col xs={12}>
                    <Table responsive class="table" id='printMe'>
                        <thead style={{ backgroundColor: "#F1F1F1" }}>
                            <tr>
                                <th style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>ລຳດັບ</th>
                                <th style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>ຕູບ</th>
                                <th style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>ຊື່ຜູ້ສັ່ງ</th>
                                <th style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>ຊື່ເມນູ</th>
                                <th style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>ຈຳນວນ</th>
                                <th style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>ລະຫັດຕູບ</th>
                                <th style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>ຄອມເມັ້ນ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datanew?.map((item, index) => {
                                return (
                                    <tr index={item} >
                                        <td>{index + 1}</td>
                                        <td>{item?.orderId?.table_id}</td>
                                        <td>{item?.orderId?.customer_nickname}</td>
                                        <td style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>{item?.menu?.name}</td>
                                        <td>{item?.quantity}</td>
                                        <td>{item?.code}</td>
                                        <td style={{ fontFamily: "phetsarath OT",fontWeight:"bold",fontSize:50 }}>{item?.note}</td>
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
