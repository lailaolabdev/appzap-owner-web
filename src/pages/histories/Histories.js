import React from 'react'
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
const history = () => {
    return (
        <div>
            <Container fluid>
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th style={{ width: 100 }}>ລຳດັບ</th>
              <th style={{ width: 200 }}>ວັນເດືອນປີ</th>
              <th style={{ width: 100 }}>ຍອດຂາຍ/ມື້</th>
              <th style={{ width: 700 }}></th>
              <th />
            </tr>
          </thead>
          {food.map((value, index) => {
                  return (
                    <tr index={value}>
                      <td>{index + 1}</td>
                      <td>{value.datetime}</td>
                      <td>{value.amount}</td>
				  	  {/* <td>{value.table}</td>
                      <td>{value.status}</td>
                      <td>{value.datetime}</td> */}
                    </tr>
                  )
                })}
        </Table>
      </Container>
        </div>
    )
}

export default history;

const food = [
	{ datetime: "11-09-2020", amount: "100,000kips" },
	{ datetime: "11-09-2020", amount: "150,000kips" },
	{ datetime: "11-09-2020", amount: "400,000kips" },
	{ datetime: "11-09-2020", amount: "500,000kips" },
	{ datetime: "11-09-2020", amount: "1,500,000kips" },
  
  ]