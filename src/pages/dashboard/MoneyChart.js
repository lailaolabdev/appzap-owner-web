import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { END_POINT_SEVER } from '../../constants/api'
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from 'chart.js';
import { moneyCurrency } from '../../helpers'
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

export default function MoneyChart({ startDate, endDate }) {
    const { history, match } = useReactRouter()

    const [data, setData] = useState();

    // =========>
    useEffect(() => {
        _fetchMenuData()
    }, [])
    // =========>
    useEffect(() => {
        _fetchMenuData()
    }, [endDate, startDate])
    // =========>

    useEffect(() => {
        if (data?.length > 0) {
            convertPieData()
        }
    }, [data])

    const _fetchMenuData = async () => {
        const getDataDashBoard = await axios
            .get(END_POINT_SEVER + "/v3/bill-report/?storeId=" + match?.params?.storeId + "&startDate=" + startDate + "&endDate=" + endDate, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            })
        setData(getDataDashBoard?.data)
    }
    const convertPieData = () => {
        let _labels = data?.map((d) => moment(d?.createdAt).format("DD/MM/yyyy") + ": " + moneyCurrency(d?.billAmount) +" ກີບ")
        let _data = data?.map((d) => d?.billAmount)
        return {
            labels: _labels,
            datasets: [
                {
                    data: _data,
                    label: "ລາຍຮັບ",
                    backgroundColor: [
                        'rgba(251, 110, 59, 0.2)',
                        'rgba(251, 110, 59, 0.3)',
                        'rgba(251, 110, 59, 0.4)',
                        'rgba(251, 110, 59, 0.5)',
                        'rgba(251, 110, 59, 0.6)',
                        'rgba(251, 110, 59, 0.7)',
                    ],
                    borderColor: [
                        'rgba(251, 110, 59, 1)',
                        'rgba(251, 110, 59, 1)',
                        'rgba(251, 110, 59, 1)',
                        'rgba(251, 110, 59, 1)',
                        'rgba(251, 110, 59, 1)',
                        'rgba(251, 110, 59, 1)',
                    ],
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    borderWidth: 1,
                },
            ],
        };
    }
    return (
        <div style={{ padding: 0 }}>
            <div style={{ width: '100%', padding: 20, borderRadius: 8 }}>
                <Chart
                    type='bar'
                    data={convertPieData()}
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
    )
}
