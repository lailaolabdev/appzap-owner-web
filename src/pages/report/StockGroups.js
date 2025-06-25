import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Form, Button } from "react-bootstrap";
import { cn } from "../../utils/cn";
import { formatDateNow, numberFormat } from "../../helpers";
import { thousandSeparator } from "../../helpers/thousandSeparator";
import useWindowDimensions2 from "../../helpers/useWindowDimension2";
import LoadingAppzap from "../../components/LoadingAppzap";
import EmptyState from "../../components/EmptyState";
import { useTranslation } from "react-i18next";
import { useStoreStore } from "../../zustand/storeStore";
import { getStocksHistories } from "../../services/stocks";
import moment from "moment";
import NavList from "../stock/components/NavList";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import { BsFillCalendarWeekFill } from "react-icons/bs";

// Assuming COLOR_APP is a constant defined elsewhere
// const COLOR_APP = "#someColor";

function StockGroups({
  datas,
  // isLoadingTotal,
  filterName,
  totalStock,
  // pageTotal,
  // rowsPerPageTotal,
}) {
  const { t } = useTranslation();
  const [historiesExport, setHistoriesExport] = useState([]);
  const [isLoadingTotal, setIsLoadingTotal] = useState(false);
  const { storeDetail } = useStoreStore();
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const _stDate = moment().startOf("day").format("YYYY-MM-DD");
  const _edDate = moment().endOf("day").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(_stDate);
  const [endDate, setEndDate] = useState(_edDate);
  const [openGetDate, setOpenGetDate] = useState(false);
  const { height, width } = useWindowDimensions2();

  useEffect(() => {
    getStockHistories();
  }, [startDate, endDate, startTime, endTime]);

  const getStockHistories = async () => {
    try {
      setIsLoadingTotal(true);
      const storeId = storeDetail?._id;

      const findBy = `&dateFrom=${startDate}&dateTo=${endDate}&timeFrom=${startTime}&timeTo=${endTime}`;
      const response = await getStocksHistories(storeId, findBy);

      if (response.status === 200 && response.data) {
        const findBest = (key) => {
          return response?.data?.data.reduce(
            (prev, current) => (prev[key] > current[key] ? prev : current),
            response?.data?.data[0]
          );
        };

        // const bestStockImport = findBest("totalQtyImport");
        // const bestStockExport = findBest("totalQtyExport");
        // const bestStockReturn = findBest("totalQtyReturn");

        // setBestStockImport(bestStockImport);
        // setBestStockExport(bestStockExport);
        // setBestStockReturn(bestStockReturn);

        setHistoriesExport(response?.data?.data);
        // setTotalStockGroups(response?.data?.total);
      }
    } catch (error) {
      console.error("error:-->", error);
    } finally {
      setIsLoadingTotal(false);
    }
  };
  // if (datas?.length < 1) return <EmptyState text={`${t("no_stoke_data")}`} />;
  if (isLoadingTotal) return <LoadingAppzap />;

  // ຂໍ້ມູນທີ່ສະແດງຕາມການຄົ້ນຫາຊື່ສິນຄ້າ
  historiesExport.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log("historiesExport", historiesExport);

  return (

    <div className="p-3">
      <NavList ActiveKey="/settingStore/stockGroup" />
      <Form.Group className="lg:w-1/3 md:w-1/2 sm:w-full mt-3">
        <Button
          variant="outline-primary"
          size="small"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            width: "100%",
          }}
          onClick={() => setOpenGetDate({ popupfiltter: true })}
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
      </Form.Group>
      <Card className={cn("my-3")}>
        <CardHeader className="items-start p-0">
          <CardTitle className="m-4 text-2xl">{t("stoke_transport")}</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent>
        <div className="rounded-md border">
          <Table responsive className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("date_day")}</TableHead>
                <TableHead>{t("prod_name")}</TableHead>
                <TableHead>{t("out_amount")}</TableHead>
                <TableHead>{t("in_amount")}</TableHead>
                <TableHead>{t("sale")}</TableHead>
                <TableHead>{t("return_amount")}</TableHead>
                <TableHead>{t("unit")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historiesExport.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDateNow(item?.createdAt)}</TableCell>
                  <TableCell>{item?.stockDetails?.name}</TableCell>
                  <TableCell>{item?.totalQtyExport}</TableCell>
                  <TableCell>{item?.totalQtyImport}</TableCell>
                  <TableCell>{item?.totalQtySale}</TableCell>
                  <TableCell>{item?.totalQtyReturn}</TableCell>
                  <TableCell>{item?.stockDetails?.unit}</TableCell>
                </TableRow>
              ))} 
            </TableBody>
            {/* <tr>
              <th>#</th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("date_day")}
              </th>
              <th style={{ textWrap: "nowrap" }}>{t("prod_name")}</th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("out_amount")}
              </th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("in_amount")}
              </th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("sale")}
              </th>
              
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("return_amount")}
              </th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("unit")}
              </th>
              {/* <th style={{ textAlign: "center" }}>{t("wastes")}</th> */}
            {/* </tr> */} 
            {/* <thead className="thead-primary">
          
        </thead> */}
            {/* <tbody>
              {historiesExport.map((item, index) => (
                <tr key={index}> */}
                  {/* <td style={{ textAlign: "left", textWrap: "nowrap" }}>
                    {index + 1}
                  </td>
                  <td style={{ textWrap: "nowrap", textAlign: "center" }}>
                    {" "}
                    {formatDateNow(item?.createdAt)}
                  </td>
                  <td style={{ textAlign: "left", textWrap: "nowrap" }}>
                    {item?.stockDetails?.name ?? "-"}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      textWrap: "nowrap",
                    }}
                  >
                    {numberFormat(item?.totalQtyExport)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      textWrap: "nowrap",
                    }}
                  >
                    {numberFormat(item?.totalQtyImport)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      textWrap: "nowrap",
                    }}
                  >
                    {numberFormat(item?.totalQtySale)}
                  </td> */}
                  {/* <td
                style={{
                  textAlign: "center",
                  textWrap: "nowrap",
                }}
              >
                {numberFormat(item?.stockDetails?.quantity)}
              </td> */}
                  {/* <td
                    style={{
                      textAlign: "center",
                      textWrap: "nowrap",
                    }}
                  >
                    {numberFormat(item?.totalQtyReturn)}
                  </td>
                  <td style={{ textAlign: "center", textWrap: "nowrap" }}>
                    {item?.stockDetails?.unit}
                  </td> */}
                  {/* <td style={{ textAlign: "center", textWrap: "nowrap" }}>
                {item?.stockDetails?.wastes}
              </td> */}
                  {/* <td>{formatDateNow(item?.stockDetails?.createdAt)}</td> */}
                {/* </tr>
              ))}
            </tbody> */}
          </Table>
          </div>
        </CardContent>
      </Card>
      <PopUpSetStartAndEndDate
        open={openGetDate?.popupfiltter}
        onClose={() => setOpenGetDate()}
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

export default StockGroups;
