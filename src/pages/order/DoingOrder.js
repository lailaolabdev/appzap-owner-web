import React from "react";
import useReactRouter from "use-react-router";
import CustomNav from "./component/CustomNav";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

const Order = () => {
  const { history, location, match } = useReactRouter();
  console.log("location: ", location);
  console.log("match: ", match);
  return (
    <div>
      <CustomNav default="/orders/doing/pagenumber/1" />
      <Container fluid>
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
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
  );
};

export default Order;
