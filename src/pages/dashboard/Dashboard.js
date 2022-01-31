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
          {[
            'Primary',
            'Success',
            'Danger',
            'Light',
          ].map((variant, idx) => (
            <CardGroup>
              <Card
                bg={variant.toLowerCase()}
                key={idx}
                text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                style={{ width: '18rem' }}
                className="mb-2"
              >
                <Card.Header>ອາຫານ</Card.Header>
                <Card.Body>
                  <Card.Title>{variant} Card Title </Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk
                    of the card's content.
                  </Card.Text>
                </Card.Body>
              </Card>
            </CardGroup>
          ))}
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
      <div className="row">
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
      </div>
    </div>
  )
}
