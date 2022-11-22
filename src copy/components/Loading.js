import React, { Component } from 'react'
import Spinner from 'react-bootstrap/Spinner'

export default class Loading extends Component {
    render() {
        return (
            <div style={{ position: 'absolute', zIndex: 10000, height: '100vh', width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ backgroundColor: 'white', marginLeft: -100, height: '100vh', width: '120%', opacity: 0.5, }}></div>
                <div style={{ zIndex: 2, position: 'absolute', alignSelf: 'center', display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Spinner animation="border" variant="danger" />
                </div>
            </div>
        )
    }
}
