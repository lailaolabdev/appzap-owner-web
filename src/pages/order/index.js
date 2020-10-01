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
    <div>
      <CustomNav default="/orders/pagenumber/1" />
    
    
    <div>
      <Container fluid>
            <Table
							responsive
							className="staff-table-list borderless table-hover"
						>
              <thead style={{ backgroundColor: '#F1F1F1' }}>
								<tr>
									<th style={{ width: 100 }}>ລຳດັບ</th>
									<th style={{ width: 140 }}>ຊື່ເມນູ</th>
									<th>ຈຳນວນ</th>
									<th style={{ width: 140 }}>ເບີໂຕະ</th>
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


