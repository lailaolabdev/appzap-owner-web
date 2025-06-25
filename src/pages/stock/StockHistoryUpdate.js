import React, { useEffect, useState } from 'react'
import NavList from './components/NavList'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table"
import { useTranslation } from "react-i18next"
import { Form } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { BsFillCalendarWeekFill } from "react-icons/bs";
import moment from "moment";
import { useStoreStore } from "../../zustand/storeStore";
import { stockType } from "../../helpers/stockType";
import { getStocksHistoriesUpdate } from "../../services/stocks";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import { formatDateNow } from '../../helpers'
import LoadingAppzap from '../../components/LoadingAppzap'


export default function StockHistoryUpdate() {
  const { t } = useTranslation()
  const { storeDetail } = useStoreStore();
  const [openGetDate, setOpenGetDate] = useState(false);
  const _stDate = moment().startOf("day").format("YYYY-MM-DD");
  const _edDate = moment().endOf("day").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(_stDate);
  const [endDate, setEndDate] = useState(_edDate);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [historiesUpdate, setHistoriesUpdate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getStockHistoriesUpdateData();
  }, [startDate, endDate, startTime, endTime]);

  const getStockHistoriesUpdateData = async () => {
    try {
      setIsLoading(true);
      const findBy = `&startDate=${startDate}&endDate=${endDate}&startTime=${startTime}&endTime=${endTime}`;
      const response = await getStocksHistoriesUpdate(storeDetail?._id, findBy);
      console.log("response:-->", response);
      if (response.status === 200) {
        console.log("response:-->", response);
        setHistoriesUpdate(response?.data?.data);
      }
    } catch (error) {
      console.error("error:-->", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <LoadingAppzap />;

  return (
    <div className="p-3">
      <NavList ActiveKey="/settingStore/stock/historyEdit" />
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
      <Card className="my-3">
        <CardHeader>
          <CardTitle>{t("stock_history_edit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-left">{t("name")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("previousQuantity")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("inputQuantity")}</TableHead>
                <TableHead className="w-[120px] text-center">{t("type")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("updatedQuantity")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("quantity")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("stock")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("reason")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("createdBy")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("createdAt")}</TableHead>
                <TableHead className="w-[100px] text-center">{t("updatedAt")}</TableHead>
                <TableHead className="w-[100px] text-right">{t("updatedBy")}</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {historiesUpdate?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[100px] text-left">{item?.name ?? "ບໍ່ມີຊື່"}</TableCell>
                  <TableCell className="w-[100px] text-center">{item?.previousQuantity}</TableCell>
                  <TableCell className="w-[100px] text-center">{item?.inputQuantity}</TableCell>
                  <TableCell className="w-[120px] text-center">
                    <Badge
                      variant={item.type === "EXPORT" || item.type === "SALE" ? "destructive" : "default"}
                      className={item.type === "EXPORT" || item.type === "SALE" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}
                    >
                      {stockType(item?.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[100px] text-center">{item?.updatedQuantity}</TableCell>
                  <TableCell className="w-[100px] text-center">{item?.quantity}</TableCell>
                  <TableCell className="w-[100px] text-center">{item?.stockId?.name}</TableCell>
                  <TableCell className="w-[100px] text-center">{item?.reason}</TableCell>
                  <TableCell className="w-[100px] text-center">{item?.createdBy?.firstname}</TableCell>
                  <TableCell className="w-[100px] text-center">{item?.updatedBy?.firstname}</TableCell>
                  <TableCell className="w-[100px] text-center">{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                  <TableCell className="w-[100px] text-right">{moment(item?.updatedAt).format("DD/MM/YYYY HH:mm")}</TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
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

  )
}
