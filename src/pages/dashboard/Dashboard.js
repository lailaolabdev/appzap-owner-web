import React, { useState, useEffect } from 'react'
import moment from 'moment';
import useReactRouter from "use-react-router"
import { Card, CardGroup, Table } from 'react-bootstrap'
import { faAmericanSignLanguageInterpreting, faCashRegister, faMagic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardMenu from './DashboardMenu';
import DashboardCategory from './DashboardCategory';
import DashboardFinance from './DashboardFinance';
import MoneyChart from './MoneyChart';
import "./index.css";
export default function Dashboard() {
  const { history, match } = useReactRouter()
  const newDate = new Date();

  const [startDate, setStartDate] = useState(moment(moment(newDate).add(-7, 'days')).format("YYYY-MM-DD"))
  const [endDate, setEndDate] = useState(moment(moment(newDate)).format("YYYY-MM-DD"))
  const [changeUi, setChangeUi] = useState("CHECKBILL");

  const _click1day = () => {
    setStartDate(moment(moment(newDate).add(-1, 'days')).format("YYYY-MM-DD"))
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"))
  }

  const _click7days = () => {
    setStartDate(moment(moment(newDate).add(-7, 'days')).format("YYYY-MM-DD"))
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"))
  }
  const _click30days = () => {
    setStartDate(moment(moment(newDate).add(-30, 'days')).format("YYYY-MM-DD"))
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"))
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginLeft: 0 }}>
        <CardGroup>
          <CardGroup onClick={() => setChangeUi("CHECKBILL")}>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '15rem', cursor: 'pointer' }}
              className="sm-4"
            >
              <Card.Body>
                <div style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <FontAwesomeIcon icon={faCashRegister} style={{ color: "#FB6E3B", marginTop: 3 }} />
                    <div style={{ width: 5 }} />
                    <p style={{ margin: 0 }}>ສະຖິຕິລາຍຮັບ</p>
                  </div>
                  <p style={{ fontSize: 8, color: "#777777" }}>ລາຍຮັບປະຈໍາຊ່ວງເວລາການບໍລິການ</p>
                </div>
              </Card.Body>
            </Card>
          </CardGroup>
          <CardGroup onClick={() => setChangeUi("CATEGORY")}>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '15rem', cursor: 'pointer' }}
              className="sm-4"
            >
              <Card.Body>
                <div style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <FontAwesomeIcon icon={faMagic} style={{ color: "#FB6E3B", marginTop: 3 }} />
                    <div style={{ width: 5 }} />
                    <p style={{ margin: 0 }}>ຫມວດຂາຍດີ</p>
                  </div>
                  <p style={{ fontSize: 8, color: "#777777" }}>ຫມວດອາຫານທີ່ໄດ້ຮັບຄວາມນິຍົມ</p>
                </div>
              </Card.Body>
            </Card>
          </CardGroup>
          <CardGroup onClick={() => setChangeUi("MENUS")}>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '15rem', cursor: 'pointer' }}
              className="sm-4"
            >
              <Card.Body>
                <div style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} style={{ color: "#FB6E3B", marginTop: 3 }} />
                    <div style={{ width: 5 }} />
                    <p style={{ margin: 0 }}>ເມນູຂາຍດີ</p>
                  </div>
                  <p style={{ fontSize: 8, color: "#777777" }}>ຫມວດປະເພດອາຫານທີ່ໄດ້ຮັບຄວາມນິຍົມ</p>
                </div>
              </Card.Body>
            </Card>
          </CardGroup>
        </CardGroup>
      </div>
      <hr />
      <div style={{ marginLeft: 0 }}>
        <div>ຄົ້ນຫາຕາມວັນທີ</div>
        <CardGroup>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e?.target?.value)} />
          <input type="date" value={endDate} style={{ marginLeft: 10 }} onChange={(e) => setEndDate(e?.target?.value)} />
          <div style={{ width: 10 }}></div>
          <button type="button" className='btn btn-outline-info' onClick={() => _click1day()}>1ວັນລ່າສຸດ</button>
          <div style={{ width: 10 }}></div>
          <button type="button" className='btn btn-outline-info' onClick={() => _click7days()}>7ວັນລ່າສຸດ</button>
          <div style={{ width: 10 }}></div>
          <button type="button" className='btn btn-outline-info' onClick={() => _click30days()}>30ວັນລ່າສຸດ</button>
          <div style={{ width: 10 }}></div>
          <button type="button" className='btn btn-outline-info' onClick={() => setChangeUi("MONEY_CHART")}>MoneyChart</button>
        </CardGroup>
      </div>
      <hr />

      {
        changeUi === "MONEY_CHART" && <DashboardFinance
          startDate={startDate}
          endDate={endDate}
        />
      }
      {
        changeUi === "CHECKBILL" && <MoneyChart
          startDate={startDate}
          endDate={endDate}
        />
      }
      {
        changeUi === "MENUS" && <DashboardMenu
          startDate={startDate}
          endDate={endDate}
        />
      }
      {
        changeUi === "CATEGORY" && <DashboardCategory
          startDate={startDate}
          endDate={endDate}
        />
      }
    </div>
  )
}
