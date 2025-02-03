import React, { useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { IoBeerOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { moneyCurrency } from "../../helpers";
import ImageEmpty from "../../image/empty.png";
import moment from "moment";
import { COLOR_APP } from "../../constants";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import Box from "../../components/Box";

export const DebtListAll = ({
  t,
  getData,
  startDate,
  startTime,
  endDate,
  endTime,
  setPopup,
  isHovered,
  setIsHovered,
  isLoading,
  billDebtData,
  pagination,
  limitData,
  totalPagination,
  setPagination,
  setSelectBillDebt
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // คำนวณผลรวม remainingAmount สำหรับลูกค้าที่ค้นหา
  const getSearchResults = () => {
    if (!searchTerm || searchTerm.length < 2) return {
      filteredData: billDebtData,
      totalRemaining: 0,
      customerInfo: null
    };

    const filtered = billDebtData.filter(item =>
      item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerPhone?.includes(searchTerm)
    );

    if (filtered.length > 0) {
      const totalRemaining = filtered.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);
      const customerInfo = {
        name: filtered[0].customerName,
        phone: filtered[0].customerPhone
      };
      return { filteredData: filtered, totalRemaining, customerInfo };
    }

    return { filteredData: [], totalRemaining: 0, customerInfo: null };
  };

  const { filteredData, totalRemaining, customerInfo } = getSearchResults();

  const sortedData = filteredData.sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <>
      <div style={{ display: "flex", gap: 10, padding: "10px 0", justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: "flex", gap: 10, padding: "10px 0", alignItems: 'center' }}>
          <Form.Control
            style={{ maxWidth: 220 }}
            placeholder={t("ຄົນຫາຊື່ຫຼຶເບີໂທ")}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={getData}
            style={{ color: "white" }}
          >
            {t("search")}
          </Button>
        </div>

        <Button
          variant="outline-primary"
          size="small"
          style={{ display: "flex", gap: 10, alignItems: "center" }}
          onClick={() => setPopup({ popupfiltter: true })}
        >
          <BsFillCalendarWeekFill />
          <div>
            {startDate} {startTime}
          </div>{" "}
          ~{" "}
          <div>
            {endDate} {endTime}
          </div>
        </Button>
      </div>

      {/* แสดงผลรวม remainingAmount สำหรับลูกค้าที่ค้นหา */}
      {searchTerm && searchTerm.length >= 2 && customerInfo && (
        <Card style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px', fontWeight:'bold'}}>
           {t("name")}: {customerInfo.name} 
          </div>
          <div style={{ fontSize: '18px', marginBottom: '10px', fontWeight:'bold'}}>
             {t("phoneNumber")} :{customerInfo.phone}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLOR_APP }}>
            {t("outstanding_money")}: {moneyCurrency(totalRemaining)} ກິບ
          </div>
        </Card>
      )}

      <Card border="primary" style={{ margin: 0 }}>
        <Card.Header
          style={{
            backgroundColor: COLOR_APP,
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <span>
            {t("debt_list")}
          </span>
          <Button
            style={{
              background: isHovered ? "Moccasin" : "SandyBrown",
              color: isHovered ? "Black" : "White",
              fontSize: "17px",
            }}
            variant="dark"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              setPopup({
                PopUpDebtExport: true,
                exportData: sortedData,
                exportType: 'all'
              });
            }}
          >
            {t("debt_Export")}
          </Button>
        </Card.Header>
        <Card.Body>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("bill_no")}</th>
                <th>{t("name")}</th>
                <th>{t("phoneNumber")}</th>
                <th>{t("money_remaining")}</th>
                <th>{t("status")}</th>
                <th>{t("date_add")}</th>
                <th>{t("expired")}</th>
                <th>{t("payment_date_debt")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                </tr>
              ) : sortedData.length > 0 ? (
                sortedData.map((e, i) => (
                  <tr
                    key={e?._id}
                    onClick={() => {
                      setPopup({ PopUpDetaillBillDebt: true });
                      setSelectBillDebt(e);
                    }}
                    style={{cursor: 'pointer'}}
                  >
                    <td>{(pagination - 1) * limitData + i + 1}</td>
                    <td>{e?.code}</td>
                    <td>{e?.customerName}</td>
                    <td>{e?.customerPhone}</td>
                    <td>{moneyCurrency(e?.remainingAmount)}</td>
                    <td style={{color:`${e?.status === 'DEBT' ? "red": e?.status === "PAY_DEBT" ? "green": "orange"}`}}>
                      {e?.status === "DEBT" ? t("debt") : e?.status === "PAY_DEBT" ? t("debt_pay"): t("partial_payment") }
                    </td>
                    <td>{moment(e?.createdAt).format("DD/MM/YYYY - HH:mm:SS")}</td>
                    <td>{moment(e?.endDate).format("DD/MM/YYYY - HH:mm:SS")}</td>
                    <td>
                      {e?.remainingAmount === 0 ? moment(e?.outStockDate).format("DD/MM/YYYY - HH:mm:ss ") : ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <img
                      src={ImageEmpty}
                      alt=""
                      style={{ width: 300, height: 200 }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            bottom: 20,
          }}
        >
          <ReactPaginate
            previousLabel={<span>Previous</span>}
            nextLabel={<span>Next</span>}
            pageCount={totalPagination}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={(e) => setPagination(e.selected + 1)}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
          />
        </div>
      </Card>
    </>
  );
};