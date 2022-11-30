import React from 'react'
import styled from 'styled-components'
import moment from "moment";


export default function BillForChef58({ selectedOrder, selectedTable, dataBill }) {
    console.log("selectedOrder=====>", selectedOrder)
    return (
        <Container>
            <div style={{ textAlign: "center" }}>
                <h1>{selectedTable?.tableName}</h1>
            </div>
            <div style={{ textAlign: "center" }}>
                <p>ວັນທີ: {moment(dataBill?.createdAt).format("DD-MMMM-YYYY HH:mm:ss")}</p>
            </div>
            <div style={{ textAlign: "center" }}>
                {
                    dataBill?.orderId?.map((item, index) => {
                        <h3>{item?.name}</h3>
                    })
                }
            </div>

        </Container>
    )
}

const Container = styled.div`
width: 58mm;
`


