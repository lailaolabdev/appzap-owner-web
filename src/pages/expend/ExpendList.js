import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
/**
 * component
 */
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { TitleComponent, ButtonComponent } from "../../components";
import Filter from "./component/filter";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import PaginationComponent from "../../components/PaginationComponent";
import queryString from "query-string";

/**
 * function
 */

import { getHeadersAccount } from "../../services/auth";
import { moneyCurrency, convertPayment, formatDate } from "../../helpers";
/**
 * api
 */
import { END_POINT_SERVER_BUNSI, getLocalData } from "../../constants/api";

/**
 * css
 */
import { Table, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEdit,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function ExpendList() {
  //constant
  const parame = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { _limit, _skip, Pagination_component } = PaginationComponent();
  const parsed = queryString?.parse(location?.state);

  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [expendData, setExpendData] = useState(null);

  const [expendDetail, setExpendDetail] = useState();
  const [shoConfirmDelete, setShowConfirmDelete] = useState(false);

  const [totalReport, setTotalReport] = useState()

  //filter
  const [filterByYear, setFilterByYear] = useState(
    !parsed?.filterByYear ? "" : parsed?.filterByYear
  );
  const [filterByMonth, setFilterByMonth] = useState(
    !parsed?.filterByMonth ? "" : parsed?.filterByMonth
  );
  const [dateStart, setDateStart] = useState(
    !parsed?.dateStart ? "" : parsed?.dateStart
  );
  const [dateEnd, setDateEnd] = useState(
    !parsed?.dateEnd ? "" : parsed?.dateEnd
  );

  //useEffect()
  useEffect(() => {
    fetchExpend();
  }, []);

    useEffect(() => {
      let filter ={
        filterByYear:filterByYear,
        filterByMonth:filterByMonth,
        dateStart:dateStart,
        dateEnd:dateEnd
      }
      fetchExpend(filter);
   // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterByYear,filterByMonth,dateStart,dateEnd, parame?.skip,]);

  //function()
  const fetchExpend = async (filter) => {
    try {
      setIsLoading(true);
      const _localData = await getLocalData();

      let _filter = `accountId=${_localData?.DATA?.storeId}&platform=APPZAPP${
        filter?.filterByMonth ? "&month=" + filter?.filterByMonth : ""
      }${filter?.filterByYear ? "&year=" + filter?.filterByYear : ""}${
        filter?.dateStart && filter?.dateEnd
          ? "&date_gte=" +
            filter?.dateStart +
            "&date_lt=" +
            moment(moment(filter?.dateEnd).add(1, "days")).format("YYYY/MM/DD")
          : ""
      }&limit=${_limit}&skip=${(parame?.skip - 1) * _limit}`;

      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expends?${_filter}`,
        headers: headers,
      }).then((res) => {
        setExpendData(res.data);
        setIsLoading(false);
      });

      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend-report?${_filter}`,
        headers: headers,
      }).then((res) => {
        console.log("resresresresresres:::",res)
        setTotalReport(res?.data?.data);
        setIsLoading(false);
      });


    } catch (err) {
      console.log("err:::", err);
    }
  };

  //_confirmeDelete
  const _confirmeDelete = async () => {
    try {
      await setIsLoading(true);
      await setShowConfirmDelete(false);
      const _localData = await getLocalData();
      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "delete",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend/${expendDetail?._id}`,
        headers: headers,
      }).then(async (res) => {
        await setExpendDetail();
        await successAdd("ລຶບສຳເລັດ");
        await fetchExpend();
        await setIsLoading(false);
      });
    } catch (err) {
      errorAdd("ລຶບບໍ່ສຳເລັດ");
      console.log("err:::", err);
    }
  };

  function limitText(text, limit) {
    if (!text) {
      return ""; // Return an empty string if the text is undefined or null
    }
    if (text.length <= limit) {
      return text; // Return the original text if it's within the limit
    } else {
      // If the text is longer than the limit, truncate it and append '...'
      return text.slice(0, limit) + "...";
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 5,
        }}
      >
        <TitleComponent title="ບັນຊີລາຍຈ່າຍ" />
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
            onChange={(e) => setDateStart(e?.target?.value)}
            style={{ width: 250 }}
          />{" "}
          ~
          <Form.Control
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e?.target?.value)}
            style={{ width: 250 }}
          />
        </div>
      </div>
      <Filter
        filterByYear={filterByYear}
        setFilterByYear={setFilterByYear}
        filterByMonth={filterByMonth}
        setFilterByMonth={setFilterByMonth}
        dateStart={dateStart}
        setDateStart={setDateStart}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="p-2">ທັງໝົດ {expendData?.total} ລາຍການ</div>
        <div className="p-2">
          ລວມກີບ:{" "}
          <span style={{ fontWeight: 900 }}>{moneyCurrency(totalReport?.priceLAK)}</span>
        </div>
        <div className="p-2">
          ລວມບາດ:{" "}
          <span style={{ fontWeight: 900 }}>{moneyCurrency(totalReport?.priceTHB)}</span>
        </div>
        <div className="p-2">
          ລວມຢວນ:{" "}
          <span style={{ fontWeight: 900 }}>{moneyCurrency(totalReport?.priceCNY)}</span>
        </div>
        <div className="p-2">
          ລວມໂດລາ:{" "}
          <span style={{ fontWeight: 900 }}>{moneyCurrency(totalReport?.priceUSD)}</span>
        </div>
        <div className="p-2">
          <ButtonComponent
            title="ລົງບັນຊີປະຈຳວັນ"
            icon={faPlusCircle}
            colorbg={"#fb6e3b"}
            hoverbg={"orange"}
            width={"150px"}
            handleClick={() => navigate("/add-expend")}
          />
        </div>
      </div>

      {isLoading ? (
        <div>
          <center>
            <Spinner animation="border" variant="warning" />
          </center>
        </div>
      ) : (
        <Table responsive="xl" className="mt-3 table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>ວັນທີຈ່າຍ</th>
              <th width="30%">ລາຍລະອຽດ</th>
              {/* <th>ຊື່ຜູ້ຈ່າຍ</th>
            <th>ຊື່ຜູ້ຮັບ</th> */}
              <th>ຮູບແບບການຈ່າຍ</th>
              <th style={{ textAlign: "right" }}>ກີບ</th>
              <th style={{ textAlign: "right" }}>ບາດ</th>
              <th style={{ textAlign: "right" }}>ຢວນ</th>
              <th style={{ textAlign: "right" }}>ໂດລາ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expendData?.data &&
              expendData?.data.length > 0 &&
              expendData?.data.map((item, index) => (
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/detail-expend/${item?._id}`)}
                >
                  <td>{index + 1 + _limit * (parame?.skip - 1)}</td>
                  <td style={{ textAlign: "left" }}>
                    {formatDate(item?.dateExpend)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {limitText(item?.detail, 50)}
                  </td>
                  {/* <td>{item?.paidBy}</td>
                <td>{item?.paidTo}</td> */}
                  <td>{convertPayment(item?.payment)}</td>
                  <td style={{ textAlign: "right" }}>
                    {moneyCurrency(item?.priceLAK)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {moneyCurrency(item?.priceTHB)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {moneyCurrency(item?.priceCNY)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {moneyCurrency(item?.priceUSD)}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesomeIcon
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/edit-expend/${item?._id}`);
                        }}
                        icon={faEdit}
                        style={{ cursor: "pointer" }}
                      />
                      <FontAwesomeIcon
                        onClick={(event) => {
                          event.stopPropagation();
                          setShowConfirmDelete(true);
                          setExpendDetail(item);
                        }}
                        icon={faTrash}
                        style={{ cursor: "pointer", color: "red" }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {Pagination_component(
        expendData?.total,
        "/expends",
        `filterByYear=${filterByYear}&&filterByMonth=${filterByMonth}&&dateStart=${dateStart}&&dateEnd=${dateEnd}`
      )}

      <PopUpConfirmDeletion
        open={shoConfirmDelete}
        text={limitText(expendDetail?.detail, 50)}
        onClose={() => setShowConfirmDelete(false)}
        onSubmit={_confirmeDelete}
      />
    </div>
  );
}
