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

  return (
    <div>
      <Container fluid>
        <div className="row mt-5">
          <Nav.Item>
            <h5><strong>ຍອດຂາຍ/ມື້</strong></h5>
          </Nav.Item>
          <Nav.Item className="ml-auto row mr-5" style={{ paddingBottom: "3px" }}>
            <InputGroup className="mb-2">

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
                // value={date}
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
            {/* <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th>ລຳດັບ</th>
              <th>ວັນເດືອນປີ</th>
              <th>ຈຳນວນ</th>
              <th>ຍອດຂາຍ/ມື້</th>
            </tr>
          </thead> */}
            {food.map((value, index) => {
              return (
                <tr index={value}>
                  <td>{index + 1}</td>
                  <td>{value.name}</td>
                  <td>{value.amount}</td>
                  <td><b>{value.price}</b></td>
                </tr>
              )
            })}
          </Table>
        </Col>
      </Container>
    </div>
  )
}


const food = [
  { name: "ອາຫານທະເລ", amount: "1", price: "100,000 kips" },
  { name: "ຕົ້ມຍຳ", amount: "2", price: "150,000 kips" },
  { name: "ຕົ້ມຍຳກຸ້ງມັງກອນໂຕແມ່ແສນອະລ່ອຍ", amount: "4", price: "400,000 kips" },
  { name: "ກຸ້ງມັງກອນ", amount: "5", price: "500,000 kips" },
  { name: "ກຸ້ງມັງກອນ", amount: "9", price: "1,500,000 kips" },
  { name: "ກຸ້ງມັງກອນ", amount: "9", price: "1,500,000 kips" },
  { name: "ກຸ້ງມັງກອນ", amount: "9", price: "1,500,000 kips" },
  { name: "ກຸ້ງມັງກອນ", amount: "9", price: "1,500,000 kips" },

]