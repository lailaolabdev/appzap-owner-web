import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { TitleComponent } from "../../components";
import { Form } from "react-bootstrap";
import IncomeExpendatureChart from "./IncomeExpendatureChart";
import { COLOR_APP } from "../../constants";
import { END_POINT_SERVER_BUNSI, getLocalData } from "../../constants/api";
import PaginationComponent from "../../components/PaginationComponent";
import { getHeadersAccount } from "../../services/auth";
import { useParams } from "react-router-dom";

export default function IncomeExpendExport() {
  const parame = useParams();
  const time = new Date();
  const month = time.getMonth();
  const year = time.getFullYear();
  const [dateStart, setDateStart] = useState(
    new Date(year, month, 1)
  );
  const [dateEnd, setDateEnd] = useState(
    new Date(year, month + 1, 0)
  );
  const { _limit, _skip, Pagination_component } = PaginationComponent();
  const [isLoading, setIsLoading] = useState(false);
  const [expendGraphData, setExpendGraphData] = useState();
  const [incomeGraphData, setIncomeGraphData] = useState();

  const [series, setSeries] = useState([
    {
      name: "ລາຍຈ່າຍກີບ",
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 9, 5, 4, 6, 6, 7, 8, 3, 2, 3, 4, 5, 6,
      ],
    },
    {
      name: "ລາຍຮັບກີບ",
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 2, 4, , 9, 5, 3, 6, 6, 6, 9, 4, 4, 5, 4, 7, 8,
      ],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "area",
    },
    stroke: {
      curve: "straight",
    },
    colors: [COLOR_APP, "#00ABB3"],
    dataLabels: {
      enabled: true,
      formatter: function (value) {
        return value ? value?.toLocaleString('en-US') : 0;
      }
    },
    title: {
      text: "ລາຍຮັບ ແລະ ລາຍຈ່າຍ",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value ? value?.toLocaleString('en-US') : 0;
        }
      },
    },
    xaxis: {
      // type: 'datetime',
      categories: [
        
      ],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
    },
  });



  useEffect(() => {
    getIncomeExpendData()
  }, [])


  useEffect(() => {
    if (!expendGraphData) return;
    modifyData()
  }, [expendGraphData, incomeGraphData])

  const getIncomeExpendData = async () => {
    try {
      const _localData = await getLocalData();
      let findby = `accountId=${_localData?.DATA?.storeId}&platform=APPZAPP&limit=${_limit}&skip=${(parame?.skip - 1) * _limit}`;
      // if (filterByYear) findby += `&year=${filterByYear}`
      // if (filterByMonth) findby += `&month=${filterByMonth}`
      if (dateStart && dateEnd) findby += `&date_gte==${dateStart}&date_lt=${moment(moment(dateEnd).add(1, "days")).format("YYYY/MM/DD")}`
      // if (filterByPayment !== "ALL" && filterByPayment !== undefined) findby += `&payment=${filterByPayment}`


      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend-report?${findby}`,
        headers: headers,
      }).then((res) => {
        console.log(res)
        setExpendGraphData(res?.data?.data?.chartExpend)
      }).finally(() => {
        setIsLoading(false);
      });


      let findIncomeby = `${_localData?.DATA?.storeId}?`;
      if (dateStart && dateEnd) findIncomeby += `startDate=${moment(moment(dateStart)).format("YYYY-MM-DD")}&endDate=${moment(moment(dateEnd).add(1, "days")).format("YYYY-MM-DD")}`
      findIncomeby = findIncomeby + `&endTime=23:59:59&startTime=00:00:00`;
      await axios({
        method: "post",
        url: `https://api.appzap.la/v4/report-daily/${findIncomeby}`,
        headers: headers,
      }).then((res) => {
        console.log(res)
        setIncomeGraphData(res?.data)
        setIsLoading(false);
      }).finally(() => {
        setIsLoading(false);
      });



    } catch (err) {
      console.log("err:::", err);
    }
  }


  const modifyData = () => {
    console.log({ expendGraphData })
    let _createdAtGraph = expendGraphData?.createdAt
    let _xAxisData = []
    console.log(_createdAtGraph.reverse())
    _createdAtGraph.reverse().map((x) => _xAxisData.push(moment(x).format("YYYY/MM/DD")))
    let _options = options
    _options.xaxis.categories = _xAxisData;

    let _dataAtGraph = expendGraphData?.totalExpendLAK
    let _lakData = []
    _dataAtGraph.map((x) => _lakData.push(x))
    console.log(_dataAtGraph)
    console.log(_dataAtGraph.reverse())

    console.log({ incomeGraphData })

    if (!incomeGraphData) return;
    let _incomeData = []
    incomeGraphData.reverse().map((y) => {
      _incomeData.push(y?.billAmount)
    })

    let _series = [...series];
    _series[0] = {
      data: [..._lakData]
    }
    _series[1] = {
      data: [..._incomeData]
    }
    setOptions(_options)
    setSeries(_series)
    console.log(_options)
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 5,
          padding: 8
        }}
      >
        <TitleComponent title="ລາຍງານລາຍຮັບ ແລະ ລາຍຈ່າຍ" />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Form.Label>ວັນທີ</Form.Label>
          <Form.Control
            type="date"
            value={dateStart}
            // onChange={(e) => setDateStart(e?.target?.value)}
            style={{ width: 150 }}
          />{" "}
          ~
          <Form.Control
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e?.target?.value)}
            style={{ width: 150 }}
          />
          <Form.Control
            as="select"
            name="payment"
            // value={filterByPayment}
            // onChange={(e) => setFilterByPayment(e?.target?.value)}
            style={{ width: 150 }}
          >
            <option value="ALL">ສະແດງຮູບແບບ</option>
            <option value="CASH">ເງິນສົດ</option>
            <option value="TRANSFER">ເງິນໂອນ</option>
          </Form.Control>
        </div>
      </div>
      <IncomeExpendatureChart series={series} options={options} />

    </>
  );
}
