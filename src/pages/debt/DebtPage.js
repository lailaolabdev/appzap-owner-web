import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
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
import Box from "../../components/Box";
import { getLocalData } from "../../constants/api";
import { debtsRemainingAmount, getBilldebts } from "../../services/debt";
import { getdebtHistory } from "../../services/debt";
import moment from "moment";
import { moneyCurrency } from "../../helpers";
import PopUpDetaillBillDebt from "../../components/popup/PopUpDetaillBillDebt";
import PopUpDebtExport from "../../components/popup/PopUpDebtExport";
import PopUpSetStartAndEndDateDebt from "../../components/popup/PopUpSetStartAndEndDateDebt";
import { useStoreStore } from "../../zustand/storeStore";
import { DebtListAll } from "./DebtListAll";
import { PayDebtListHistory } from "./PayDebtListHistory";

export default function DebtPage() {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
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
  const [searchCode, setSearchCode] = useState(null);
  const [exportType, setExportType] = useState('');
  const [activeTab, setActiveTab] = useState('billDebt-list');
  const [remainingAmountData, setRemainingAmountData] = useState([])
  const limitData = 50;

 
  useEffect(()=>{
    console.log("exportType: ",exportType)
  },[activeTab])


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


  useEffect(() => {
    getData();
    getDataHistory();
    //getDataReminning();
  }, [pagination, startDate, endDate, startTime, endTime]);

  // Calculate totals
  const amount = billDebtData.reduce((total, item) => {
    return total + (item.amount || 0);
  }, 0);

  const remainingAmount = billDebtData.reduce((total, item) => {
    return total + (item.remainingAmount || 0);
  }, 0);

  const getData = async () => {
    setIsLoading(true);
    try {
      const { TOKEN } = await getLocalData();
      let findby = `?skip=${(pagination - 1) * limitData}&limit=${limitData}&storeId=${storeDetail?._id}`;

      if (startDate && endDate) {
        const startDateTime = `${startDate}T${startTime || '00:00:00'}`;
        const endDateTime = `${endDate}T${endTime || '23:59:59'}`;
        findby += `&createdAt[$gte]=${startDateTime}&createdAt[$lte]=${endDateTime}`;
      }


      const data = await getBilldebts(findby, TOKEN);
      setBillDebtData(data?.data || []);
      setTotalPagination(Math.ceil(data?.totalCount / limitData));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
              {billDebtData?.length || 0} ລາຍການ
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

              {moneyCurrency(amount)} ກີບ
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
              {moneyCurrency(amount - remainingAmount)} ກີບ
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
              {moneyCurrency(remainingAmount)} ກີບ
            </div>
          </Card.Body>
        </Card>
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
          <DebtListAll
            t={t}
            getData={getData}
            startDate={startDate}
            startTime={startTime}
            endDate={endDate}
            endTime={endTime}
            setPopup={setPopup}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            isLoading={isLoading}
            billDebtData={billDebtData}
            pagination={pagination}
            limitData={limitData}
            totalPagination={totalPagination}
            setPagination={setPagination}
            setSelectBillDebt={setSelectBillDebt}
          />
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

      {popup?.PopUpDetaillBillDebt && (
        <PopUpDetaillBillDebt
          open={popup?.PopUpDetaillBillDebt}
          onClose={() => {
            setPopup();
            setSelectBillDebt();
          }}
          billDebtData={selectBillDebt}
          handleTabSelect={handleTabSelect}
          callback={async () => {
            setPopup();
            setSelectBillDebt();
            await getData();
            await getDataHistory();
          }}
        />
      )}

      {popup?.PopUpDebtExport && (
        <PopUpDebtExport
          open={popup?.PopUpDebtExport}
          exportType={exportType}
          onClose={() => {
            setPopup();
            setSelectDebtData();
          }}
          billDebtData={billDebtData}
          COLOR_APP={COLOR_APP}
          debtHistoryData={popup.exportData || debtHistoryData} 
          callback={async () => {
            setPopup();
            setSelectDebtData();
            await getData();
            await getDataHistory();
          }}
        />
      )}
      <PopUpSetStartAndEndDateDebt
        open={popup?.popupfiltter}
        onClose={() => {
          setPopup();
          getData(); // เพิ่มการเรียก getData เมื่อปิด popup
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

