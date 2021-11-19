import React, { useEffect, useState} from 'react'
import useReactRouter from "use-react-router";

import { Nav } from "react-bootstrap";
import { getLocalData } from '../../../constants/api'

export default function OrderNavbar() {
    const { location,history,match } = useReactRouter();
    const [getTokken, setgetTokken] = useState()
    useEffect(() => {
        const fetchData = async () => {
            const _localData = await getLocalData()
            if (_localData) {
                setgetTokken(_localData)
            }
        }
        fetchData();
    }, [])
    const _order = () => {
        history.push(`/orders/pagenumber/1/${getTokken?.DATA?.storeId}`)
    }
    const _doing = () => {
        history.push(`/orders/doing/pagenumber/1/${getTokken?.DATA?.storeId}`)
    }
    const _served = () => {
        history.push(`/orders/served/pagenumber/1/${getTokken?.DATA?.storeId}`)
    }
    return (
        <div style={{ backgroundColor: "#f8f8f8",border:"none" }}>
            <Nav variant="tabs" defaultActiveKey={location?.pathname} style={{ fontWeight: "bold",backgroundColor: "#f8f8f8",border:"none" }}>
                <Nav.Item>
                    <Nav.Link eventKey={`/orders/pagenumber/1/` + match?.params?.id} style={{ color: "#FB6E3B", border: "none"  }} onClick={() => _order()}>ອໍເດີ້ເຂົ້າ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey={`/orders/doing/pagenumber/1/` + match?.params?.id} style={{ color: "#FB6E3B", border: "none"  }} onClick={() => _doing()}>ກຳລັງເຮັດ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey={`/orders/served/pagenumber/1/` + match?.params?.id} style={{ color: "#FB6E3B",  border: "none" }} onClick={() => _served()}>ເສີບແລ້ວ</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}
