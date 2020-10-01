import React from "react"
import useReactRouter from "use-react-router"
import Nav from "react-bootstrap/Nav"
import CustomNav from './component/CustomNav'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
// import {BODY} from '../../constants/index'

const Order = () => {
  const { history, location, match } = useReactRouter();
  console.log("location: ", location)
  console.log("match: ", match)
  return (
    <div style={TITLE_HEADER}>
      <CustomNav default="/orders/pagenumber/1" />
    
    
    <div style={BODY}>
      <Container fluid>
            <Table
							responsive
							className="staff-table-list borderless table-hover"
						>
              <thead style={{ backgroundColor: '#F1F1F1' }}>
								<tr>
									<th style={{ width: 100 }}>ລຳດັບ</th>
									<th style={{ width: 200 }}>ຊື່ເມນູ</th>
									<th>ຈຳນວນ</th>
									<th style={{ width: 100 }}>ເບີໂຕະ</th>
									<th style={{ width: 100 }}>ສະຖານະ</th>
									<th>ຄຳອະທິບາຍ</th>
									<th />
								</tr>
	 						</thead>
               </Table>
       </Container>
     </div>
  </div>
  );
};

export default Order;

export const TITLE_HEADER = {
	paddingLeft: 55,
	paddingTop: 55,
	backgroundColor: '#F9F9F9',
	width: '100%',
	height: '100vh',
	overflowY: 'scroll',
}
export const BODY = {
	width: '97%',
	minHeight: '70vh',
	backgroundColor: 'white',
	marginRight: 32,
	marginLeft: 0,
	paddingLeft: 32,
	paddingTop: 32,
	paddingRight: 32,
	paddingBottom: 40,
}
