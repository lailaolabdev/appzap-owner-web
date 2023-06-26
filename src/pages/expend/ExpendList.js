import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * component
 */
import { useNavigate } from "react-router-dom";
import { TitleComponent, ButtonComponent } from "../../components";
import Filter from "./component/filter";

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
import { Breadcrumb, Stack, Table, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEdit, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { use } from "i18next";

export default function ExpendList() {
  //constant
  const navigate = useNavigate();

  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [expendData, setExpendData] = useState(null);

  //useEffect()
  useEffect(() => {
    fetchExpend();
  }, []);

  //function()
  const fetchExpend = async () => {
    try {
      setIsLoading(true);
      const _localData = await getLocalData();
      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expends`,
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

  console.log("expendData::", expendData);

  return (
    <div style={{ padding: 20 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="#">ລົງບັນຊີຮັບ-ຈ່າຍ</Breadcrumb.Item>
        <Breadcrumb.Item active>ລາຍລະອຽດ</Breadcrumb.Item>
      </Breadcrumb>

      <TitleComponent title="ລົງບັນຊີລາຍຮັບ-ລາຍຈ່າຍ" />

      <Filter />

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

      <Table responsive="xl" className="mt-3 table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>ວັນທີຈ່າຍ</th>
            <th width="20%">ລາຍລະອຽດ</th>
            <th>ຊື່ຜູ້ຈ່າຍ</th>
            <th>ຊື່ຜູ້ຮັບ</th>
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
              <tr style={{cursor:'pointer'}}>
                <td>{index + 1}</td>
                <td style={{ textAlign: "left" }}>
                  {formatDate(item?.dateExpend)}
                </td>
                <td style={{ textAlign: "left" }}>{item?.detail}</td>
                <td>{item?.paidBy}</td>
                <td>{item?.paidTo}</td>
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
                <td >
                    <div style={{display:"flex", gap:15, alignItems:"center", justifyContent:"center", flexDirection:"row"}}> 
                  <FontAwesomeIcon onClick={(event)=>{event.stopPropagation(); navigate(`/edit-expend/${item?._id}`)}} icon={faEdit} style={{cursor:"pointer"}} />
                  <FontAwesomeIcon icon={faTrash} style={{cursor:"pointer", color:"red"}} />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
