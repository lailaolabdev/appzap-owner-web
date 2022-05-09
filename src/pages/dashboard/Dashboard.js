import React, { useState, useEffect } from 'react'
import moment from 'moment';
import useReactRouter from "use-react-router"
import { Card, CardGroup, Nav } from 'react-bootstrap'
import { faAmericanSignLanguageInterpreting, faCashRegister, faMagic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardMenu from './DashboardMenu';
import DashboardCategory from './DashboardCategory';
import DashboardFinance from './DashboardFinance';
import MoneyChart from './MoneyChart';
import DashboardUser from './DashboardUser';
import "./index.css";
export default function Dashboard() {
  const { history, match } = useReactRouter()
  const newDate = new Date();

  const [startDate, setStartDate] = useState(moment(moment(newDate)).format("YYYY-MM-DD"))
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
      <Nav fill variant="tabs" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link eventKey="/home" onClick={() => setChangeUi("CHECKBILL")}>ສະຖານະຂອງໂຕະ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1" onClick={() => setChangeUi("MONEY_CHART")}>ສະຖິຕິການເງີນ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2" onClick={() => setChangeUi("CATEGORY")}>ຫມວດຂາຍດີ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3" onClick={() => setChangeUi("MENUS")}>ເມນູຂາຍດີ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-4" onClick={() => setChangeUi("STAFF")}>ລາຍງານພະນັກງານ</Nav.Link>
        </Nav.Item>
      </Nav>
      <div style={{ height: 20}}></div>
      <div style={{ marginLeft: 0 }}>
        <CardGroup>
          <button type="button" className='btn btn-outline-info' onClick={() => _click1day()}>1ວັນລ່າສຸດ</button>
          <div style={{ width: 10 }}></div>
          <button type="button" className='btn btn-outline-info' onClick={() => _click7days()}>7ວັນລ່າສຸດ</button>
          <div style={{ width: 10 }}></div>
          <button type="button" className='btn btn-outline-info' onClick={() => _click30days()}>30ວັນລ່າສຸດ</button>
          <div style={{ width: 10 }}></div>
          <input type="date" className='btn btn-outline-info' value={startDate} onChange={(e) => setStartDate(e?.target?.value)} />
          <input type="date" className='btn btn-outline-info' value={endDate} style={{ marginLeft: 10 }} onChange={(e) => setEndDate(e?.target?.value)} />
        </CardGroup>
      </div>
      <hr />

      {
        changeUi === "MONEY_CHART" && <MoneyChart
          startDate={startDate}
          endDate={endDate}
        />
      }
      {
        changeUi === "CHECKBILL" && <DashboardFinance
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
      {
        changeUi === "STAFF" && <DashboardUser
          startDate={startDate}
          endDate={endDate}
        />
      }
    </div>
  )
}
