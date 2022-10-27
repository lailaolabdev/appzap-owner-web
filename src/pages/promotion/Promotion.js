import React from 'react'
import {
    Image,
} from "react-bootstrap";
import devImages from '../../image/dev.png'

export default function Promotion() {
    return (
        <div style={{padding:20 ,fontSize:30,textAlign: 'center'}}>
            <Image src={devImages} alt="" width="100%"/>
        </div>
    )
}
