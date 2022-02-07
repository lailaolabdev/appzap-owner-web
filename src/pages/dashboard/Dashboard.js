import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Bar, Pie } from "react-chartjs-2";
import { Card, CardGroup, Table } from 'react-bootstrap'
export default function Dashboard() {
  const { history, match } = useReactRouter()
  let _spitHistory = history?.location?.search.split("=")

  const newDate = new Date();

  const [data, setData] = useState();
  const [startDate, setSelectedDateStart] = useState('2021-04-01')
  const [endDate, setSelectedDateEnd] = useState(moment(moment(newDate)).format("YYYY-MM-DD"))
  const [changeUi, setChangeUi] = useState("CHECKBILL");
  useEffect(() => {
    _data()
  }, [])
  useEffect(() => {
    _data()
  }, [changeUi, endDate, startDate])
  const _data = async () => {
    if (changeUi === "CHECKBILL") {
      const getDataDashBoard = await axios
        .get("http://localhost:7070/v3/dashboard/" + _spitHistory[1] + "/startTime/" + startDate + "/endTime/" + endDate, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
      setData(getDataDashBoard?.data)
    }
    if (changeUi === "CATEGORY") {
      const getDataDashBoard = await axios
        .get("http://localhost:7070/v3/dashboard-best-sell-category/" + _spitHistory[1] + "/startTime/" + startDate + "/endTime/" + endDate, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
      setData(getDataDashBoard?.data)
    }
    if (changeUi === "MENUS") {
      const getDataDashBoard = await axios
        .get("http://localhost:7070/v3/dashboard-best-sell-menu/" + _spitHistory[1] + "/startTime/" + startDate + "/endTime/" + endDate, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
      setData(getDataDashBoard?.data)
    }
  }
  const [dataChartBar, setDataChartBar] = useState({
    labels: ["ນ້ຳດື່ມ", "ເບຍ", "ຕຳ", "ທອດ", "ຍຳ", "ແກງສົ້ມ", "ຂົ້ວຜັກ"],
    datasets: [{
      label: 'ສະຫຼຸບຕາມໝວດສິນຄ້າ',
      data: [65, 59, 80, 81, 56, 55, 100],
      backgroundColor: [
        'red',
        'green',
        'blue',
        'yellow',
        '#E4E4E4',
        '#898989',
        '#EF4Ef4'
      ],
      borderWidth: 1
    }]
  })
  console.log("data===>", data);
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginLeft: 50 }}>
        <CardGroup>
          <CardGroup onClick={() => setChangeUi("CHECKBILL")}>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '20rem' }}
              className="mb-2"
            >
              <Card.Body>
                <Card.Text style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <div>ເຊັກບິນສຳເລັດ</div>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
          <CardGroup onClick={() => setChangeUi("CATEGORY")}>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '20rem' }}
              className="mb-2"
            >
              <Card.Body>
                <Card.Text style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <div>ລາຍງານຕາມໝວດ</div>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
          <CardGroup onClick={() => setChangeUi("MENUS")}>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '20rem' }}
              className="mb-2"
            >
              <Card.Body>
                <Card.Text style={{ alignItems: 'center', display: "flex", flexDirection: "column" }}>
                  <div style={{ justifyContent: "center", flexDirection: "row", display: "flex" }}>
                    <div>ລາຍງານຕາມເມນູ</div>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
        </CardGroup>
      </div>
      <hr />
      {changeUi === "CHECKBILL" ?
        <div className="row">
          <div style={{ marginLeft: 30 }}>
            <div>ຄົ້ນຫາຕາມວັນທີ</div>
            <CardGroup>
              <input type="date" value={startDate} onChange={(e) => setSelectedDateStart(e?.target?.value)} />
              <input type="date" value={endDate} style={{ marginLeft: 10 }} onChange={(e) => setSelectedDateEnd(e?.target?.value)} />
            </CardGroup>
          </div>
          <div style={{ width: '100%', padding: 20 }}>
            <div>ແຕ່ວັນທີ {startDate} ຫາວັນທີ {endDate}</div>
            <div style={{ height: 10}}></div>
            <div>ຈຳນວນຢອດເງີນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(data?.amount)} ກີບ</div>
            <div style={{ height: 20 }}></div>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ເລກໂຕະ</th>
                  <th>ສວ່ນຫຼຸດ</th>
                  <th>ລາຄາ / ບີນ</th>
                </tr>
              </thead>
              <tbody>
                {data?.checkOut?.map((item, index) =>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item?.code}</td>
                    <td>{item?.discount} {item?.discountType === "LAK" ? "ກີບ" : "%"}</td>
                    <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.billAmount)} ກີບ</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {/* <div style={{ width: '50%', padding: 20 }}>
            <Bar
              data={dataChartBar}
              options={{
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
                tooltips: {
                  mode: 'label',
                  label: 'mylabel',
                  callbacks: {
                    label: function (tooltipItem) {
                      return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    },
                  },
                },
              }}
            />
          </div> */}
        </div> : changeUi === "CATEGORY" ? <div className="row">
          <div style={{ width: '100%', padding: 20, border: "solid 2px #FB6E3B" }}>
            {data?.length > 0 ? data?.map((item) =>
              <div>
                <p style={{ fontWeight: "bold" }}>ລາຍງານຕາມໝວດປະຈຳວັນທີ່ : {moment(item?.time).format('YYYY-MM-DD')}</p>
                {item?.data?.map((itemB) =>
                  <p>{itemB?.name} : {itemB?.quantity}</p>
                )}
                <hr />
              </div>
            ) : ""}
          </div>
        </div> :
          <div style={{ width: '100%', padding: 20, border: "solid 2px #FB6E3B" }}>
            {data?.length > 0 ? data?.map((item) =>
              <div>
                <p style={{ fontWeight: "bold" }}>ລາຍງານຕາມໝວດປະຈຳວັນທີ່ : {moment(item?.time).format('YYYY-MM-DD')}</p>
                {item?.data?.map((itemB) =>
                  <p>{itemB?.name} : {itemB?.quantity}</p>
                )}
                <hr />
              </div>
            ) : ""}
          </div>
      }
      {/* <div className="row">
        <div style={{ width: '50%', padding: 20 }}>
          <Pie
            data={dataChartBar}
          />
        </div>
        <div style={{ width: '50%', padding: 20 }}>
          <Pie
            data={dataChartBar}
          />
        </div>
      </div> */}
    </div>
  )
}
