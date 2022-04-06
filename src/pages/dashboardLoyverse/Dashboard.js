import React, { useState } from 'react'
import moment from 'moment';
import useReactRouter from "use-react-router"
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import DashboardMenu from './DashboardMenu';
import DashboardCategory from './DashboardCategory';
import DashboardFinance from './DashboardFinance';
import DashboardtypeMoney from './DashboardTypeMoney';
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
        <DropdownButton
          as={ButtonGroup}
        key="down"
          id={`dropdown-split-variants-Info`}
        drop="down"
          variant="secondary"
          title="ເລືອກລາຍງານ"
        >
        <Dropdown.Item eventKey="1" onClick={() => setChangeUi("CHECKBILL")}>ສະຫຼຸບຍອດຂາຍ</Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={() => setChangeUi("MENUS")}>ລາຍງານເມນູ</Dropdown.Item>
        <Dropdown.Item eventKey="3" onClick={() => setChangeUi("CATEGORY")}>ລາຍງານໝວດອາຫານ</Dropdown.Item>
        <Dropdown.Item eventKey="4" onClick={() => setChangeUi("STAFF")}>ລາຍງານພະນັກງານ</Dropdown.Item>
        <Dropdown.Item eventKey="5" onClick={() => setChangeUi("TYPE_MONEY")}>ລາຍງານຕາມປະເພດການຊຳລະ</Dropdown.Item>
        <Dropdown.Item eventKey="6" onClick={() => setChangeUi("INCOME")}>ລາຍຮັບ</Dropdown.Item>
        <Dropdown.Item eventKey="7" onClick={() => setChangeUi("DISCOUNT")}>ສ່ວນຫຼຸດ</Dropdown.Item>
        </DropdownButton>
      <div style={{ height: 20 }}></div>
      {
        changeUi === "CHECKBILL" && <DashboardFinance
          startDate={startDate}
          endDate={endDate}
        />
      }
      {
        changeUi === "TYPE_MONEY" && <DashboardtypeMoney
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
