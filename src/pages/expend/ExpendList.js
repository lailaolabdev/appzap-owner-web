import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
/**
 * component
 */
import { useNavigate } from "react-router-dom";
import { TitleComponent, ButtonComponent } from "../../components";
import Filter from "./component/filter";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { successAdd, errorAdd, successDelete } from "../../helpers/sweetalert";
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
import { Breadcrumb, Stack, Table, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEdit,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { use } from "i18next";

export default function ExpendList() {
  //constant
  const navigate = useNavigate();

  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [expendData, setExpendData] = useState(null);

  const [expendDetail, setExpendDetail] = useState();
  const [shoConfirmDelete, setShowConfirmDelete] = useState(false);


  //filter
  const [filterByYear, setFilterByYear] = useState()
  const [filterByMonth, setFilterByMonth] = useState()
  const [dateStart, setDateStart] = useState()
  const [dateEnd, setDateEnd] = useState()

  //useEffect()
  useEffect(() => {
    fetchExpend();
  }, []);

  useEffect(() => {
    fetchExpend(filterByYear,filterByMonth,dateStart,dateEnd);
  }, [filterByYear,filterByMonth,dateStart,dateEnd]);


  // useEffect(()=>{
  //   if(expendData){
  //     const sumPriceLAK = array.reduce((accumulator, item) => accumulator + item.priceLAK, 0);
  //     const sumPriceBATH = array.reduce((accumulator, item) => accumulator + item.priceBATH, 0);
  //     const sumPriceUSD = array.reduce((accumulator, item) => accumulator + item.priceUSD, 0);
  //     const sumPriceCNY = array.reduce((accumulator, item) => accumulator + item.priceCNY, 0);
  //   }

  // },[])

  //function()
  const fetchExpend = async (filterByYear,filterByMonth,dateStart,dateEnd) => {
    try {
      setIsLoading(true);
      const _localData = await getLocalData();


      let _filter =`accountId=${_localData?.DATA?.storeId}&platform=APPZAPP${filterByMonth ? '&month=' + filterByMonth : ""}${filterByYear ? '&year='+filterByYear :""}${dateStart && dateEnd ? '&date_gte='+dateStart+"&date_lt="+moment(moment(dateEnd).add(1, "days")).format("YYYY/MM/DD") : ""}`;

  
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
        console.log("res:::", res);
        setExpendData(res.data);
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

  const sumPriceLAK = expendData?.data.reduce((accumulator, item) => accumulator + item.priceLAK, 0);
  const sumPriceBATH = expendData?.data.reduce((accumulator, item) => accumulator + item.priceTHB, 0);
  const sumPriceUSD = expendData?.data.reduce((accumulator, item) => accumulator + item.priceUSD, 0);
  const sumPriceCNY = expendData?.data.reduce((accumulator, item) => accumulator + item.priceCNY, 0);

  return (
    <div style={{ padding: 20 }}>
      {/* <Breadcrumb>
        <Breadcrumb.Item href="#">ລົງບັນຊີຮັບ-ຈ່າຍ</Breadcrumb.Item>
        <Breadcrumb.Item active>ລາຍລະອຽດ</Breadcrumb.Item>
      </Breadcrumb> */}

      <TitleComponent title="ບັນຊີລາຍຈ່າຍ" />

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
        <div className="p-2">ລວມກີບ: <span style={{fontWeight:900}}>{moneyCurrency(sumPriceLAK)}</span></div>
        <div className="p-2">ລວມບາດ:  <span style={{fontWeight:900}}>{moneyCurrency(sumPriceBATH)}</span></div>
        <div className="p-2">ລວມຢວນ:  <span style={{fontWeight:900}}>{moneyCurrency(sumPriceCNY)}</span></div>
        <div className="p-2">ລວມໂດລາ:  <span style={{fontWeight:900}}>{moneyCurrency(sumPriceUSD)}</span></div>
        <div className="p-2">
          <ButtonComponent
            title="ລົງບັນຊີປະຈຳວັນ"
            icon={faPlusCircle}
            colorbg={"darkorange"}
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
              <th>ກີບ</th>
              <th>ບາດ</th>
              <th>ຢວນ</th>
              <th>ໂດລາ</th>
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
                  <td>{index + 1}</td>
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
      <PopUpConfirmDeletion
        open={shoConfirmDelete}
        text={limitText(expendDetail?.detail, 50)}
        onClose={() => setShowConfirmDelete(false)}
        onSubmit={_confirmeDelete}
      />
    </div>
  );
}


