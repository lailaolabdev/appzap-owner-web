import React,{ useState } from "react";
import useReactRouter from "use-react-router";
import CustomNav from "./component/CustomNav";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Checkbox from "@material-ui/core/Checkbox";
import { getOrders } from '../../services/order'

const Order = () => {
  const { history, location, match } = useReactRouter();

 const [orders,setOrders] = useState([]);
  React.useEffect(() => {
    const fetchOrder = async () => {
      const res = await getOrders();
      setOrders(res);
    }
    fetchOrder();
  }, [])
  if(orders){
    console.log("12345: ", orders);
  }
  return (
    <div>
      <CustomNav default="/orders/pagenumber/1" />
      <Container fluid>
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
            <th style={{ width: 50 }}></th>
              <th style={{ width: 100 }}>ລຳດັບ</th>
              <th style={{ width: 200 }}>ຊື່ເມນູ</th>
              <th style={{ width: 100}}>ຈຳນວນ</th>
              <th style={{ width: 100 }}>ເບີໂຕະ</th>
              <th style={{ width: 100 }}>ສະຖານະ</th>
              <th style={{ width: 100 }}></th>
              <th />
            </tr>
          </thead>
          {food.map((value, index) => {
                  return (
                    <tr index={value}>
                      <td >
                        <Checkbox
                          // hidden={isAdmin}
                          color="primary"
                          name="selectAll"
                        // onChange={(e) => _checkAll(e)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{value.menu}</td>
                      <td>{value.quantity}</td>
				  	          <td>{value.table}</td>
                      <td>{value.status}</td>
                      <td>{value.datetime}</td>
                    </tr>
                  )
                })}
        </Table>
      </Container>
    </div>
  );
};

export default Order;

const food = [
	{ menu: "ຕົ້ມຊໍາກຸ້ງ", quantity: "3", table: 1 , status: "ລໍຖ້າ", datetime: "11-09-2020" },
	{ menu: "ຕົ້ມຊໍາກຸ້ງ", quantity: "3", table: 2 , status: "ລໍຖ້າ", datetime: "11-09-2020" },
	{ menu: "ຕົ້ມຊໍາກຸ້ງ", quantity: "3", table: 3 , status: "ລໍຖ້າ", datetime: "11-09-2020" },
	{ menu: "ຕົ້ມຊໍາກຸ້ງ", quantity: "3", table: 4 , status: "ລໍຖ້າ", datetime: "11-09-2020" },
	{ menu: "ຕົ້ມຊໍາກຸ້ງ", quantity: "3", table: 5 , status: "ລໍຖ້າ", datetime: "11-09-2020" },
  
  ]