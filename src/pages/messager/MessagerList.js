import React, { useState, useEffect } from 'react'
import { USER_KEY, END_POINT } from "../../constants"
import axios from 'axios';
import { Table, Button, Form, InputGroup } from 'react-bootstrap'
import {
    warningAlert
} from "../../helpers/sweetalert"
import { socket } from '../../services/socket'
import AnimationLoading from "../../constants/loading"

export default function MessagerList() {
    const [userData, setUserData] = useState({})
    const [dataMessagerList, setdataMessagerList] = useState([])
    const [dataMessagerDetail, setdataMessagerDetail] = useState([])
    const [dataForSent, setDataForSent] = useState('')
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const ADMIN = localStorage.getItem(USER_KEY)
        const _localJson = JSON.parse(ADMIN)
        setUserData(_localJson)
    }, [])
    useEffect(() => {
        _getDataMessagerList();
    }, [userData])
    const _getDataMessagerList = async () => {
        const resData = await axios({
            method: 'get',
            url: END_POINT + `/v2/messagesList/?storeId=` + userData?.data?.storeId,
        })
        setdataMessagerList(resData?.data)
    }
    // =========>
    const _showMessageDetail = async (item) => {
        setIsLoading(true)
        const resDataDetail = await axios({
            method: 'get',
            url: END_POINT + `/v2/messageDetail/?messageListId=` + item?._id,
        })
        if (resDataDetail?.data?.length > 0) {
            const updateReadMessager = await axios({
                method: 'put',
                url: END_POINT + `/v2/readMessage/` + item?._id,
                data: {
                    "storeId": userData?.data?.storeId,
                    "table_id": resDataDetail?.data[0]?.table_id
                }
            })
        }
        setdataMessagerDetail(resDataDetail?.data)
        setIsLoading(false)
    }
    // =========>
    const _sentMessagerToCustomer = async () => {
        if(!dataForSent) {
            warningAlert("ກະລຸນາປ້ອນຂໍ້ຄວາມ");
            return
        }
        const resDataDetail = await axios({
            method: 'post',
            url: END_POINT + `/v2/createMessages`,
            data: {
                "storeId": userData?.data?.storeId,
                "table_id": dataMessagerDetail[0]?.table_id,
                "code": dataMessagerDetail[0]?.code,
                "from": "STORE",
                "text": dataForSent
            }
        })
        setdataMessagerDetail(resDataDetail?.data?.message)
        setDataForSent('')
    }

    socket.on(`READ_MESSAGER:${userData?.data?.storeId}`, (data) => {
        _getDataMessagerList();
    });
    socket.on(`MESSAGE_STORE:${userData?.data?.storeId}`, (data) => {
        _getDataMessagerList();
    });
    console.log("dataMessagerDetail==>", dataMessagerDetail)
    return (
        <div style={{ paddingLeft: 40, display: 'flex', flexDirection: 'row' }} className="row col-sm-12">
            <div style={{ width: '35%' }}>
                <Table  striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            {/* <th>ຊື່ຕູບ</th> */}
                            <th>ຈາກໂຕະ</th>
                            <th>ຂໍ້ຄວາມ</th>
                            <th>ອ່ານແລ້ວ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataMessagerList?.map((item, index) =>
                            <tr key={"message-"+index} onClick={() => _showMessageDetail(item)} style={{cursor: "pointer"}}>
                                <td>{index + 1}</td>
                                {/* <td>{item?.name}</td> */}
                                <td>{item?.code}</td>
                                <td>{item?.text}</td>
                                <td style={{ color: item?.read === "NOT" ? "red":"green" }}>{item?.read ==="NOT" ? "ຍັງບໍ່ໄດ້ອ່ານ":"ອ່ານແລ້ວ"}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <div style={{ width: 10 }}></div>
            <div style={{ width: '60%', border: '2px solid #E4E4E4', alignItems: 'flex-end', flexDirection: "column" }}>
                {dataMessagerDetail?.length <=0 ? "" :
                        isLoading ? <AnimationLoading/>:
                    <div style={{ padding: 10 }}>
                        {dataMessagerDetail?.map((item) =>
                            <p style={{
                                textAlign: item?.from === "TABLE" ? 'start' : 'end',
                                borderRadius: 8,
                                backgroundColor: item?.from === "TABLE" ? '#E3E3E3' : "#E4E4E4",
                                padding: 10,
                            }}>{item?.text}</p>
                            )}
                    </div>
                }
                <hr/>
                <InputGroup className="mb-12" style={{ padding: 10,marginLeft: 0 }}>
                    <Form.Control type="text" placeholder="ຂໍ້ຄວາມ..." className="col-10" value={dataForSent} onChange={(e) => setDataForSent(e?.target?.value)}/>
                    <Button  onClick={() => _sentMessagerToCustomer()} className="col-2" style={{ borderRadius: "0px 3px 3px 0px", marginRight: 0, backgroundColor:"#FB6E3B"}}>ສົ່ງຂໍ້ຄວາມ</Button>
                </InputGroup>
            </div>
        </div>
    )
}
