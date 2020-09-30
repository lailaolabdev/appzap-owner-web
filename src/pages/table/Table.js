import React from "react"
import useReactRouter from "use-react-router"
import Nav from "react-bootstrap/Nav"

const Table = () => {
  const { history, location, match } = useReactRouter();
  console.log("location: ", location)
  console.log("match: ", match)
  return (

    <div>
      <Nav
        variant="tabs"
        style={NAV}
      //   defaultActiveKey={
      //     location.pathname.split("/")[3] == "tables"
      //       ? `tables/`
      // }
      >
        <Nav.Item>
          <Nav.Link
          // href={`/orders/${orderId}/orders_detail_post/pagenumber/${numberPage}`}
          >
            ໂຕະທັງໜົດ
					</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>

  );
};

export default Table;

const NAV = {
  backgroundColor: '#F9F9F9',
  marginTop: -10,
  paddingTop: 10,
}
