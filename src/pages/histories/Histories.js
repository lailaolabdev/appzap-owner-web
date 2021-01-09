import React, { useEffect, useState } from 'react'
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  FormControl,
  InputGroup,
  Nav
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const date = new moment().format("LL");

// const toDay = () => {
//   moment.locale("LL");
//   var today = new Date();
//   var todays = moment(today).format("DD/MM/YYYY");
//   return todays;
// };

export default function History() {
  const [selectedDate, setSelectedDate] = useState()
  const [data, setData] = useState([])
  const [searchDate, setSearchDate] = useState()

  useEffect(() => {
    _searchDate()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      let _date = new Date(selectedDate).getFullYear() + "-" + (new Date(selectedDate).getMonth() + 1) + "-" + new Date(selectedDate).getDate()
      setSearchDate(_date)
    }
    if (searchDate) {
      _searchDate()
    }
    if(searchDate == null){
      _showAllDataHistories()
    }
  }, [searchDate, selectedDate])



  // function show all data of histories
  const _showAllDataHistories = () => {
    fetch('http://localhost:7070/orders?status=CHECKOUT')
        .then(response => response.json())
        .then(response => setData(response));
  }


  // Function of select date
  const _searchDate = () => {
    if (!searchDate) {
      fetch('http://localhost:7070/orders?status=CHECKOUT')
        .then(response => response.json())
        .then(response => setData(response));
    } else {
      fetch('http://localhost:7070/orders?status=CHECKOUT&createdAt=' + searchDate)
        .then(response => response.json())
        .then(response => setData(response));
    }

  }

  return (
    <div style={{ minHeight: 400 }}>
      <Container fluid>
        <div className="row mt-5">
          <Nav.Item>
            <h5><strong>ຍອດຂາຍ</strong></h5>
          </Nav.Item>
          <Nav.Item className="ml-auto row mr-5" style={{ paddingBottom: "3px" }}>
          
            <InputGroup className="mb-2">
            <Button className="mr-3" onClick={_showAllDataHistories}>ທັງໝົດ</Button>
              <DatePicker
                className="form-control"
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat='dd/MM/yyyy'
                filterDate={date => date.getDay() != 6 && date.getDay() != 0}
                isClearable
                showYearDropdown
                scrollableMonthYearDropdown
                placeholderText={date}
              />
              <InputGroup.Prepend>
                <InputGroup.Text style={{ background: "#FB6E3B" }} >
                  <FontAwesomeIcon icon={faCalendar} color="white" />
                </InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Nav.Item>

        </div>
        <Col xs={7}>
          <Table responsive className="staff-table-list table-borderless table-hover">
            <thead style={{ backgroundColor: "#F1F1F1" }}>
              <tr>
                <th>ລຳດັບ</th>
                <th>ຊື່ເມນູ</th>
                <th>ຈຳນວນ</th>
                <th>ເລກໂຕະ</th>
                <th>ຍອດຂາຍ/ມື້</th>
                <th>ວັນທີ</th>
              </tr>
            </thead>


            {data?.map((item, index) => {
              console.log("========>", data)
              return (
                <tr index={item}>
                  <td>{index + 1}</td>
                  <td><b>{item?.order_item[0].menu?.name}</b></td>
                  <td>{item?.order_item.length}</td>
                  <td>{item?.table_id}</td>
                  <td style={{color: "green"}}><b>{item?.order_item[0]?.menu?.price * item?.order_item.length} ກີບ</b></td>
                  <td>{new Date(item?.createdAt).toLocaleDateString()}</td>
                </tr>
              )
            }
            )}

          </Table>
        </Col>
      </Container>
    </div>
  )
}
