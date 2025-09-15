import React, { useEffect, useState, useRef, useLayoutEffect} from "react";
import { useTranslation } from "react-i18next";
import { BLUETOOTH_PRINTER_PORT, COLOR_APP, ETHERNET_PRINTER_PORT, USB_PRINTER_PORT } from "../../constants";
import {
  Button,
  Form,
  Card,
  Pagination,
  Tab,
  Tabs,
  Spinner,
} from "react-bootstrap";
import { FaCoins } from "react-icons/fa";
import axios from "axios";
import Box from "../../components/Box";
import { getLocalData } from "../../constants/api";
import { debtsRemainingAmount, getBillDebtDatas, getBilldebtReport } from "../../services/debt";
import { getdebtHistory } from "../../services/debt";
import moment from "moment";
import { base64ToBlob, moneyCurrency } from "../../helpers";
import PopUpDetaillBillDebt from "../../components/popup/PopUpDetaillBillDebt";
import PopUpDebtExport from "../../components/popup/PopUpDebtExport";
import PopUpSetStartAndEndDateDebt from "../../components/popup/PopUpSetStartAndEndDateDebt";
import { useStoreStore } from "../../zustand/storeStore";
import { DebtListAll } from "./DebtListAll";
import { useStore } from "../../store";
import { PayDebtListHistory } from "./PayDebtListHistory";
import { useQuery } from "@tanstack/react-query";
import BillDebt80 from "../../components/bill/BillDebt80";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import printFlutter from "../../helpers/printFlutter";

export default function DebtPage() {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const { printerCounter, printers } = useStore();

  const [isHovered, setIsHovered] = useState(false);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(0);
  const [billDebtData, setBillDebtData] = useState([]);
  const [selectBillDebt, setSelectBillDebt] = useState();
  const [selectDebtData, setSelectDebtData] = useState();
  const [popup, setPopup] = useState();
  const [debtHistoryData, setDebtHistoryData] = useState([]);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [exportType, setExportType] = useState('');
  const [activeTab, setActiveTab] = useState('billDebt-list');
  const [reportData, setReportData] = useState({
    isLoadingReport: false,
    summary: null
  })
  const limitData = 50;
  const [widthBill80, setWidthBill80] = useState(0);
  const billDebt80Ref = useRef();

   useEffect(() => {
    const element = billDebt80Ref?.current;
    console.log(element); // 👈️ element here
  }, []);
  useLayoutEffect(() => {
    setWidthBill80(billDebt80Ref?.current?.offsetWidth);
  }, [billDebt80Ref]);

  // On select tab
  const handleTabSelect = (key) => {
    setActiveTab(key);
    switch (key) {
      case 'billDebt-list':
        setExportType('');
        break;
      case 'Pay-debt-list':
        setExportType('payment');
        break;
      case 'Incress-debt-list':
        setExportType('increase');
        break;
      default:
        setExportType('');
    }
  };

  // Handle fetch function
  useEffect(() => {
    getDataHistory();
  }, [pagination, startDate, endDate, startTime, endTime]);

  // Query bill debt history datas
  const getDataHistory = async () => {
    setIsLoading(true);
    try {
      const { TOKEN } = await getLocalData();

      // Build the base query parameters
      const baseParams = new URLSearchParams({
        skip: ((pagination - 1) * limitData).toString(),
        limit: limitData.toString(),
        storeId: storeDetail?._id || ''
      });

      // Add date range parameters if they exist
      if (startDate && endDate) {
        const formattedStartDate = `${startDate}T${startTime || '00:00:00'}`;
        const formattedEndDate = `${endDate}T${endTime || '23:59:59'}`;
        baseParams.append('startDate', formattedStartDate);
        baseParams.append('endDate', formattedEndDate);
      }


      // Create the final query string
      const queryString = `?${baseParams.toString()}`;

      // Fetch data with pagination
      const response = await getdebtHistory(queryString, TOKEN);

      // Check if response has the expected structure
      if (response && Array.isArray(response.data)) {
        // If the API returns paginated data directly
        setDebtHistoryData(response.data);
        setTotalPagination(Math.ceil(response.totalCount / limitData));
      } else if (Array.isArray(response)) {
        // If the API returns all data, we need to handle pagination on the client side
        const filteredData = response.filter(item => {
          // Filter by date range
          const itemDate = new Date(item.updatedAt || item.createdAt);
          const start = new Date(`${startDate}T${startTime || '00:00:00'}`);
          const end = new Date(`${endDate}T${endTime || '23:59:59'}`);
          return itemDate >= start && itemDate <= end;
        });

        // Sort data by latest date first
        const sortedData = filteredData.sort((a, b) => {
          const dateA = new Date(b.updatedAt || b.createdAt);
          const dateB = new Date(a.updatedAt || a.createdAt);
          return dateA - dateB;
        });

        // Calculate pagination
        const startIndex = (pagination - 1) * limitData;
        const paginatedData = sortedData.slice(startIndex, startIndex + limitData);

        setDebtHistoryData(paginatedData);
        setTotalPagination(Math.ceil(sortedData.length / limitData));
      }

    } catch (err) {
      console.error("Error fetching debt history:", err);
      setDebtHistoryData([]);
      setTotalPagination(0);
    } finally {
      setIsLoading(false);
    }
  };

  const onPrintBillDebt = async () => {
    try {
      console.log("selectBillDebt");
      // if (!tokenQR) {
      //   return;
      // }
      // alert(tokenQR);
      // setTokenForSmartOrder(tokenQR, (ee) => {
      //   console.log(tokenForSmartOrder, "tokenForSmartOrder");
      // });
      // if (!tokenForSmartOrder) {
      //   setTokenForSmartOrder(tokenQR);
      //   await delay(1000);
      //   return;
      // }
      // if (!tokenForSmartOrder) {
      //   return;
      // }
      let urlForPrinter = "";
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );
      let dataImageForPrint;
      console.log("check 1");
      if (printerBillData?.width === "80mm") {
        dataImageForPrint = await html2canvas(billDebt80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
      }

      if (printerBillData?.width === "58mm") {
        dataImageForPrint = await html2canvas(billDebt80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
      }
      console.log("dataImageForPrint", dataImageForPrint);
      console.log("check 2");

      if (printerBillData?.type === "ETHERNET") {
        urlForPrinter = ETHERNET_PRINTER_PORT;
      }
      if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = BLUETOOTH_PRINTER_PORT;
      }
      if (printerBillData?.type === "USB") {
        urlForPrinter = USB_PRINTER_PORT;
      }
      console.log(dataImageForPrint.toDataURL());
      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      console.log("check 3");
      var bodyFormData = new FormData();

      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("isdrawer", false);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      bodyFormData.append("paper", printerBillData?.width === "58mm" ? 58 : 80);

      console.log("check 4");
      await printFlutter(
        {
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9100",
          width: printerBillData?.width === "58mm" ? 400 : 580,
        },
        async () => {
          await axios({
            method: "post",
            url: urlForPrinter,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      );
      // await axios({
      //   method: "post",
      //   url: urlForPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      console.log("check 5");
      // setCodeShortLink(null);
      await Swal.fire({
        icon: "success",
        title: `${t("print_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      // setPrintCode();
      // navigate("../", { replace: true });
      // setCodeShortLink(null);
    } catch (err) {
      // setCodeShortLink(null);
      console.log("onprint:", err);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fail")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Fecth for report
  const fetchReportDebtBill = async ({ storeId, startDate, endDate, startTime, endTime }) => {
    let findby = `?storeId=${storeId}`;

    if (startDate && endDate) {
      const startDateTime = `${startDate}T${startTime || '00:00:00'}`;
      const endDateTime = `${endDate}T${endTime || '23:59:59'}`;
      findby += `&startDate=${startDateTime}&endDate=${endDateTime}`;
    }

    const response = await getBilldebtReport(findby);

    return response?.summary || null;
  };

  // Fetch for data list
  const fetchBillDebtion = async ({ storeId, startDate, endDate, startTime, endTime }) => {
    let findby = `?storeId=${storeId}`;

    if (startDate && endDate) {
      const startDateTime = `${startDate}T${startTime || '00:00:00'}`;
      const endDateTime = `${endDate}T${endTime || '23:59:59'}`;
      findby += `&startDate=${startDateTime}&endDate=${endDateTime}`;
    }

    const response = await getBillDebtDatas(findby);
    return response;
  };

  // Query bill report
  const {
    data: reportSummary,
    isLoading: isLoadingReport,
  } = useQuery({
    queryKey: ['reportDebtBill', storeDetail?._id, startDate, endDate, startTime, endTime],
    queryFn: () => fetchReportDebtBill({
      storeId: storeDetail?._id,
      startDate,
      endDate,
      startTime,
      endTime
    }),
    // enabled: !!storeDetail?._id, // Only run query when storeId exists
  });

  // Query bill data lists
  const {
    data: billDebtionData,
    isLoading: isLoadingBilldebtion,
  } = useQuery({
    queryKey: ['bill_debtion_data', storeDetail?._id, startDate, endDate, startTime, endTime],
    queryFn: () => fetchBillDebtion({
      storeId: storeDetail?._id,
      startDate,
      endDate,
      startTime,
      endTime
    }),
    // enabled: !!storeDetail?._id, // Only run query when storeId exists
  });


  return (
    <div style={{ padding: 20 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "0.5fr 0.5fr 0.5fr 0.5fr", xs: "1fr" },
          gap: 20,
          gridTemplateRows: "masonry",
          marginBottom: 20,
        }}
      >
        <Card border="primary" style={{ margin: 0 }}>
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {t("debt_list_all")}
          </Card.Header>
          <Card.Body>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
                // fontWeight: 700
              }}
            >
              {reportSummary?.count || 0} ລາຍການ
            </div>
          </Card.Body>
        </Card>
        <Card border="primary" style={{ margin: 0 }}>
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {t("total_debt")}
          </Card.Header>
          <Card.Body>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
                // fontWeight: 700
              }}
            >

              {moneyCurrency(reportSummary?.totalPrice || 0)} ກີບ
            </div>
          </Card.Body>
        </Card>
        <Card border="primary" style={{ margin: 0 }}>
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {t("paid_already")}
          </Card.Header>
          <Card.Body>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
                // fontWeight: 700
              }}
            >
              {/* {moneyCurrency(totalPayment)} ກີບ */}
              {moneyCurrency(reportSummary?.totalPaied > 0 ? reportSummary?.totalPaied : reportSummary?.totalTransfer || 0)} ກີບ
            </div>
          </Card.Body>
        </Card>
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
            <span>{t("outstanding_money")}</span>
          </Card.Header>
          <Card.Body>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
                fontWeight: 400,
              }}
            >
              {moneyCurrency(reportSummary?.totalRemaining || 0)} ກີບ
            </div>
          </Card.Body>
        </Card>
        <div
          style={{
            width: "80mm",
            padding: 10,
          }}
          // ref={billDebt80Ref}
        >
          <BillDebt80
            storeDetail={storeDetail}
            billDebtData={selectBillDebt}
          />
        </div>
      </Box>

      <Tabs
        defaultActiveKey="billDebt-list"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >

        <Tab
          eventKey="billDebt-list"
          title={t("debt_list_all")}
          style={{ paddingTop: 20 }}

        >
          {isLoadingBilldebtion || isLoadingReport ? (
            <Spinner animation="border" variant="warning" />
          ) : (
            <DebtListAll
              t={t}
              startDate={startDate}
              startTime={startTime}
              endDate={endDate}
              endTime={endTime}
              setPopup={setPopup}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              billDebtData={billDebtionData?.data}
              pagination={pagination}
              limitData={limitData}
              totalPagination={billDebtionData?.totalCount}
              setPagination={setPagination}
              setSelectBillDebt={setSelectBillDebt}
            />
          )}
        </Tab>

        <Tab
          eventKey="Pay-debt-list"
          title={t("paydebt_list_history")}
          style={{ paddingTop: 20 }}
        >
          <PayDebtListHistory
            t={t}
            getDataHistory={getDataHistory}
            startDate={startDate}
            startTime={startTime}
            endDate={endDate}
            endTime={endTime}
            setPopup={setPopup}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            isLoading={isLoading}
            debtHistoryData={debtHistoryData}
            pagination={pagination}
            limitData={limitData}
            setPagination={setPagination}
            totalPagination={totalPagination}
          />
        </Tab>
        </Tabs>

        <div
          style={{
            width: "80mm",
            padding: 10,
          }}
          ref={billDebt80Ref}
        >
          <BillDebt80
            storeDetail={storeDetail}
            billDebtData={selectBillDebt}
            onPrintBillDebt={onPrintBillDebt}
          />
        </div>
        
        <PopUpDetaillBillDebt
          open={popup?.PopUpDetaillBillDebt}
          onClose={() => {
            setPopup();
            setSelectBillDebt();
          }}
          billDebtData={selectBillDebt}
          handleTabSelect={handleTabSelect}
          onPrintBillDebt={onPrintBillDebt}
          callback={async () => {
            setPopup();
            setSelectBillDebt();
            // await getReportDebtBill()
            // await getData();
            await getDataHistory();
          }}
        />
      

      {popup?.PopUpDebtExport && (
        <PopUpDebtExport
          open={popup?.PopUpDebtExport}
          exportType={exportType}
          onClose={() => {
            setPopup();
            setSelectDebtData();
          }}
          billDebtData={billDebtionData?.data}
          COLOR_APP={COLOR_APP}
          debtHistoryData={popup.exportData || debtHistoryData}
          callback={async () => {
            setPopup();
            setSelectDebtData();
            // await getReportDebtBill()
            // await getData();
            await getDataHistory();
          }}
        />
      )}

      <PopUpSetStartAndEndDateDebt
        open={popup?.popupfiltter}
        onClose={() => {
          setPopup();
          // getData(); // เพิ่มการเรียก getData เมื่อปิด popup
        }}
        startDate={startDate}
        setStartDate={setStartDate}
        setStartTime={setStartTime}
        startTime={startTime}
        setEndDate={setEndDate}
        setEndTime={setEndTime}
        endTime={endTime}
        endDate={endDate}
      />
    </div>
  );
}

