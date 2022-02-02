import React, { useState, useEffect } from 'react'
import { Bar, Pie } from "react-chartjs-2";
import { Card, CardGroup } from 'react-bootstrap'
export default function Dashboard() {
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
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginLeft: 50 }}>
        <CardGroup>
          <CardGroup>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '18rem' }}
              className="mb-2"
            >
              <Card.Header>ການເງີນ</Card.Header>
              <Card.Body>
                <Card.Text>
                  <div>ແຈ້ງເຕືອນເຊັກບີນ : 9</div>
                  <div>ເຊັກບິນສຳເລັດ : 9</div>
                  <div>ມີແຂກ : 9</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
          <CardGroup>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '18rem' }}
              className="mb-2"
            >
              <Card.Header>ລາຍໄດ້ປະຈຳວັນ</Card.Header>
              <Card.Body>
                <Card.Text>
                  <div>ລາຍໄດ້ປະຈຳວັນ : 200.000</div>
                  <div>ລາຍໄດ້ປະຈຳເດືອນ : 200.000</div>
                  <div>ລາຍໄດ້ປະຈຳປີ : 200.000</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
          <CardGroup>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '18rem' }}
              className="mb-2"
            >
              <Card.Header>ອາຫານທີ່ສົ່ງຄືນ</Card.Header>
              <Card.Body>
                <Card.Text>
                  <div>ອາຫານທີ່ສົ່ງຄືນຈຳວັນ : 200.000</div>
                  <div>ອາຫານທີ່ສົ່ງຄືນຈຳເດືອນ : 200.000</div>
                  <div>ອາຫານທີ່ສົ່ງຄືນຈຳປີ : 200.000</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
          <CardGroup>
            <Card
              bg="Primary"
              text={"light" === 'light' ? 'dark' : 'white'}
              style={{ width: '18rem' }}
              className="mb-2"
            >
              <Card.Header>ສະຖານະຂອງໂຕະ</Card.Header>
              <Card.Body>
                <Card.Text>
                  <div>ໂຕະທັງໝົດ : 200.000</div>
                  <div>ໂຕະທີ່ເປິດທັງໝົດ : 200.000</div>
                  <div>ໂຕະທີ່ປິດທັງໝົດ : 200.000</div>
                  <div>ໂຕະທີ່ວ່າງເປິດທັງໝົດ : 200.000</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
        </CardGroup>
      </div>
      <div className="row">
        <div style={{ width: '50%', padding: 20 }}>
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
        </div>
        <div style={{ width: '50%', padding: 20 }}>
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
        </div>
      </div>
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
