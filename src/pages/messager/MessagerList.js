import React, { useState, useEffect } from 'react'
import { USER_KEY, END_POINT } from "../../constants"
import axios from 'axios';
import { Table, Button, Form, InputGroup } from 'react-bootstrap'
import {
    warningAlert
} from "../../helpers/sweetalert"
import { socket } from '../../services/socket'
import AnimationLoading from "../../constants/loading"
import { getHeaders } from '../../services/auth';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
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
            url: END_POINT + `/v3/admin/chat-rooms?storeId=` + userData?.data?.storeId,
        })
        setdataMessagerList(resData?.data)
    }
    // =========>
    const _showMessageDetail = async (code) => {
        setIsLoading(true)
        const resDataDetail = await axios({
            method: 'get',
            url: END_POINT + `/v3/chat-room-messages/` + code,
        })
       
        if (resDataDetail?.data?.length > 0) {
            setdataMessagerDetail(resDataDetail?.data)
            let header = await getHeaders();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': header.authorization
            }
            let _data = {
                chatRoomId: resDataDetail?.data[0]?.chatRoomId,
                data: {
                    storeId: userData?.data?.storeId,
                    code: resDataDetail?.data[0]?.code,
                }
            }
            const _resDataDetail = await axios({
                method: 'put',
                url: END_POINT + `/v3/admin/chat-room/update`,
                data: _data,
                headers: headers
            })
        }
        setIsLoading(false)
    }
    // =========>
    const _sentMessagerToCustomer = async () => {
        if(!dataForSent) {
            warningAlert("ກະລຸນາປ້ອນຂໍ້ຄວາມ");
            return
        }
        let header = await getHeaders();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': header.authorization
        }
        const resDataDetail = await axios({
            method: 'post',
            url: END_POINT + `/v3/chat-room-message/create`,
            data: {
                "storeId": userData?.data?.storeId,
                "tableId": dataMessagerDetail[0]?.tableId,
                "code": dataMessagerDetail[0]?.code,
                "isFrom": "STORE",
                "type": "TEXT",
                "text": dataForSent
            },
             headers: headers
        })
        setdataMessagerDetail(resDataDetail?.data)
        setDataForSent('')
    }

    socket.on(`READ_MESSAGER:${userData?.data?.storeId}`, (data) => {
        _getDataMessagerList();
    });
    socket.on(`MESSAGE_STORE:${userData?.data?.storeId}`, (data) => {
        _getDataMessagerList();
    });
    return (
        <div style={{ paddingLeft: 40, display: 'flex', flexDirection: 'row' }} className="row col-sm-12">
            <div style={{ width: '35%' }}>
                <Table  striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ຊື່ຕູບ</th>
                            <th>ຈາກໂຕະ</th>
                            <th>ຂໍ້ຄວາມ</th>
                            <th>ສະຖານະ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataMessagerList?.map((item, index) =>
                            <tr key={"message-" + index} onClick={() => _showMessageDetail(item.code)} style={{cursor: "pointer"}}>
                                <td>{index + 1}</td>
                                <td>{item?.tableId?.name}</td>
                                <td>{item?.code}</td>
                                <td>{item?.text}</td>
                                <td style={{ color: !item?.isRead ? "red" : "green" }}>{!item?.isRead ?
                                    <FontAwesomeIcon
                                    icon={faCheck}
                                    />
                                    :
                                    <FontAwesomeIcon
                                        icon={faCheckDouble}
                                    />
                                }</td>
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
                                textAlign: item?.isFrom === "TABLE" ? 'start' : 'end',
                                borderRadius: 8,
                                backgroundColor: item?.isFrom === "TABLE" ? '#E3E3E3' : "#E4E4E4",
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
