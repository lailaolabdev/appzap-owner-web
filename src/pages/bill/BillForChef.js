import React from 'react'
import styled from 'styled-components'

export default function BillForChef() {
  return (
    <Container>
        <div style={{textAlign: "center" }}>
        <h1>Table3</h1>
        </div>
        <div style={{textAlign: "center" }}>
            <p>ວັນທີ: 29/11/2022 15:35:00</p>
        </div>
        <div style={{textAlign: "center" }}>
        <h3>Beerlao</h3>
        </div>
        <hr></hr>

    </Container>
  )
}

// const Name = styled.div`
// display: grid;
// grid-template-columns: 1fr 1fr 1fr 1fr;
// `
// const Price = styled.div`
// display: flex;
// `
const Container = styled.div`
width: 80mm;
`
// const Img = styled.div`
// width: 90px;
// height: 90px;
// `

