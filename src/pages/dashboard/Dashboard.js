import React, { useState, useEffect } from 'react'
import moment from 'moment';
import useReactRouter from "use-react-router"
import { Card, CardGroup, Table } from 'react-bootstrap'
import { faAmericanSignLanguageInterpreting, faCashRegister, faMagic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardMenu from './DashboardMenu';
import DashboardCategory from './DashboardCategory';
import DashboardFinance from './DashboardFinance';
export default function Dashboard() {
  const { history, match } = useReactRouter()
  const newDate = new Date();

  const [startDate, setSelectedDateStart] = useState(moment(moment(newDate).add(-7, 'days')).format("YYYY-MM-DD"))
  const [endDate, setSelectedDateEnd] = useState(moment(moment(newDate)).format("YYYY-MM-DD"))
  const [changeUi, setChangeUi] = useState("CHECKBILL");

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginLeft: 50 }}>
        <CardGroup>
          <CardGroup onClick={() => setChangeUi("CHECKBILL")}>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '15rem', cursor: 'pointer' }}
              className="sm-4"
            >
              <Card.Body>
                <Card.Text style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <FontAwesomeIcon icon={faCashRegister} style={{ color: "#FB6E3B", marginTop: 3 }} />
                    <div style={{ width: 5 }} />
                    <div>ສະຖິຕິລາຍຮັບ</div>
                  </div>
                </Card.Text>
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
                <Card.Text style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <FontAwesomeIcon icon={faMagic} style={{ color: "#FB6E3B", marginTop: 3 }} />
                    <div style={{ width: 5 }} />
                    <div>ຫມວດຂາຍດີ</div>
                  </div>
                </Card.Text>
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
                <Card.Text style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} style={{ color: "#FB6E3B", marginTop: 3 }} />
                    <div style={{ width: 5 }} />
                    <div>ເມນູຂາຍດີ</div>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
        </CardGroup>
      </div>
      <hr />
      <div style={{ marginLeft: 30 }}>
        <div>ຄົ້ນຫາຕາມວັນທີ</div>
        <CardGroup>
          <input type="date" value={startDate} onChange={(e) => setSelectedDateStart(e?.target?.value)} />
          <input type="date" value={endDate} style={{ marginLeft: 10 }} onChange={(e) => setSelectedDateEnd(e?.target?.value)} />
        </CardGroup>
      </div>
      <hr />
      
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
    </div>
  )
}
