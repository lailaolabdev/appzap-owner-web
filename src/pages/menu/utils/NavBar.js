import React from 'react'
import useReactRouter from "use-react-router"
import {
    Nav
} from "react-bootstrap";
export default function NavBar() {
    const { history } = useReactRouter()

    const _menuList = () => {
        history.push('/menu/limit/40/page/1')
    }
    const _category = () => {
        history.push('/category/limit/40/page/1')
    }
    return (
        <div>
            <Nav variant="tabs" defaultActiveKey="category">
                <Nav.Item>
                    <Nav.Link eventKey="category" onClick={() => _category()}>ປະເພດອາຫານ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1" onClick={() => _menuList()}>ເມນູອາຫານ</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}
