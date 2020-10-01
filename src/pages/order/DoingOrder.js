import React from "react"
import useReactRouter from "use-react-router"
// import Nav from "react-bootstrap/Nav"
import Container from 'react-bootstrap/Container'
import CustomNav from './component/CustomNav'
import Table from 'react-bootstrap/Table'

const OrderList = () => {
    const { history, location, match } = useReactRouter();
    console.log("location: ", location)
    console.log("match: ", match)
    return <div>
	<CustomNav default="/orders/doing/pagenumber/1" />
  </div>
};

export default OrderList;