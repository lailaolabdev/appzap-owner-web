import React from "react";
import { Tabs, Table, Tab } from "react-bootstrap";
import ButtonPrimary from "../../components/button/ButtonPrimary";
export default function AddOder() {
  return (
    <>
      <h3 style={{ textAlign: "center", padding: "20px" }}>ເພີ່ມອໍເດີ</h3>
      <div className="order-left">
        <input
          type="text"
          className="form-control"
          placeholder="ຄົ້ນຫາຊື່ອາຫານ"
        />
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3 mt-3"
        >
          <Tab eventKey="all" title="ທັງໜົດ">
            dnd
          </Tab>
          <Tab eventKey="beer" title="ເບຍ">
            dfn
          </Tab>
          <Tab eventKey="kaeng" title="ເເກງ">
            dfnd
          </Tab>

          <Tab eventKey="sob" title="ທອດ">
            dfnd
          </Tab>
        </Tabs>
      </div>
      <div className="order-right">
        <Table striped>
          <thead style={{ backgroundColor: "wheat" }}>
            <tr>
              <th>ລຳດັບ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}
