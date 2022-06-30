import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router"
import { Nav } from 'react-bootstrap'
import moment from "moment";
import {
    TITLE_HEADER,
} from "../../constants/index";
import {
    END_POINT_SEVER
} from "../../constants/api";

export default function HistoryUse() {
    const { history, location, match } = useReactRouter()
    const [data, setData] = useState()
    const [filtterModele, setFiltterModele] = useState("checkBill")
    

    useEffect(() => {
        _getdataHistories();
    }, [])
    useEffect(() => {
        _getdataHistories();
    }, [filtterModele])
    const _getdataHistories = async () => {
        await fetch(END_POINT_SEVER + `/v3/logs/skip/0/limit/500?storeId=${match?.params?.id}&modele=${filtterModele}`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setData(json));
    }
    return (
        <div style={TITLE_HEADER}>
            <div className="col-sm-12">
                <Nav variant="tabs" defaultActiveKey="/checkBill">
                    <Nav.Item>
                        <Nav.Link eventKey="/checkBill" onClick={() => setFiltterModele("checkBill")}>ຄິດໄລ່ເງີນ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/canceled" onClick={() => setFiltterModele("canceled")}>ຍົກເລີກອາຫານ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/print" onClick={() => setFiltterModele("print")}>ປີນເຕີ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/resetBill" onClick={() => setFiltterModele("resetBill")}>ແກ້ໄຂບີນ</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            <div className="col-sm-12">
                <table className="table table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ຊື່ຜູ້ຈັດການ</th>
                            <th scope="col">ສະຖານະ</th>
                            <th scope="col">ລາຍລະອຽດ</th>
                            <th scope="col">ວັນເວລາ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item?.user}</td>
                                    <td style={{ color: item?.event==="INFO" ? "green":"red"}}>{item?.event}</td>
                                    <td>{item?.eventDetail}</td>
                                    <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
