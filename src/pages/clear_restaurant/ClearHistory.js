import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import moment from "moment";
import { Calendar, AlertTriangle, Trash2, ListOrdered } from "lucide-react"
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import PopUpConfirmClearHistroy from "../../components/popup/PopUpConfirmClearHistroy"
import { COLOR_APP, COLOR_APP_CANCEL, END_POINT, padding } from "../../constants";
import { Breadcrumb, Tab, Tabs, Nav } from "react-bootstrap";
import { BsFillCalendarWeekFill  } from "react-icons/bs";
import { Button, Modal, Card, Table } from "react-bootstrap";
import LoadingAppzap from "../../components/LoadingAppzap"; 
import { set } from "lodash";
import { text } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faCoins,
  faPeopleArrows,
  faPrint,
  faTable,
  faHistory,
  faAddressCard,
  faBoxes,
  faListAlt
} from "@fortawesome/free-solid-svg-icons";
const RestaurantHistoryClear = () => {

  const { t } = useTranslation();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOptionText, setSelectedOptionText] = useState("")
  const [amountText, setAmountText] = useState("")
  const [amount, setAmount] = useState(0)

  const [filtterModele, setFiltterModele] = useState("clear-restaurant");
  const [filtterClear, setfiltterClear] = useState("historyUsage");

  const [orderHistory, setOrderHistory] = useState(true);
    const [isLoading, setIsLoading] = useState(false); 

  const [popup, setPopup] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");

  const handleOptionSelect = (text, amount, amountText) => {
    setSelectedOptionText(text)
    setAmount(amount)
    setAmountText(amountText)
    setShowConfirmation(true)
  }

  const [clearData , setClearData] = useState({
    text: "",
    anmount: "",
    startDate: 0,
    endDate: 0
  })


  const handleComfime = () =>{
    setClearData({
      text: text
    })
    setShowConfirmation(false)
  }


  return (
    <div
      style={{
        padding: "0 40px",
      }}
    >
      <div className="flex">
        <div className="flex-1">
          <Nav
            variant="tabs"
            defaultActiveKey="/clear-restaurant"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f8f8f8",
              border: "none",
              borderRadius: "5px",
              marginBottom: 10,
              overflowX: "scroll",
              display: "flex",
            }}
          >
            <Nav.Item className="">
              <Nav.Link
                eventKey="/clear-restaurant"
                style={{
                  color: "#FB6E3B",
                  border: "none",
                  display: "flex",
                  justifyContent: "center",
                  padding: "15px",
                  alignItems: "center",
                }}
                onClick={() => {
                  setFiltterModele("clear-restaurant");
                  setOrderHistory(true);
                }}
              >
                {t("clear_restaurant_data")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="">
              <Nav.Link
                eventKey="/historyUsage"
                style={{
                  color: "#FB6E3B",
                  border: "none",
                  display: "flex",
                  justifyContent: "center",
                  padding: "15px",
                  alignItems: "center",
                }}
                onClick={() => {
                  setFiltterModele("historyUsage");
                  setOrderHistory(true);
                }}
              >
                {t("clear_usage")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="">
              <Nav.Link
                eventKey="/historyClear"
                style={{
                  color: "#FB6E3B",
                  border: "none",
                  display: "flex",
                  justifyContent: "center",
                  padding: "15px",
                  alignItems: "center",
                }}
                onClick={() => {
                  setFiltterModele("historyClear");
                  setOrderHistory(true);
                }}
              >
                {t("history_clear")}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>
      {isLoading ? (
        <LoadingAppzap />
      ) : (
        <div>
          {filtterModele === "clear-restaurant" ? (
            <Tabs defaultActiveKey="clear_restaurant">
              <Tab eventKey="clear_restaurant" style={{ paddingTop: 20 }}>
                <Card border="primary" style={{ margin: 0 }}>
                  <Card.Header
                    style={{
                      padding: "10px 30px",
                      backgroundColor: COLOR_APP,
                      color: "#fff",
                    }}
                  >
                    <h4>
                      <b>{t("clear_restaurant_data")}</b>
                    </h4>
                    <p>ເລືອກຂໍ້ມູນທີ່ຕ້ອງການລົບ</p>
                  </Card.Header>
                  <Card.Body>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 ">
                      <p>
                        <b>{t("select_date")}:</b>
                      </p>
                      <Button
                        variant="outline-primary"
                        size="small"
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                        }}
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
                    <hr />
                    <div
                      style={{
                        padding: "0 20px",
                      }}
                    >
                      <div>
                        <p>
                          <b>
                            {" "}
                            ເລືອກ: {t("total_bill")} , {t("order_list")} ແລະ{" "}
                            {t("all_stock")}{" "}
                          </b>
                        </p>
                      </div>
                      <div
                        defaultActiveKey="currency-list"
                        className="grid grid-cols-1 md:grid-cols-3 md:p-[20px] md:gap-20 sm:grid-cols-1 sm:gap-6"
                      >
                        <Card className=" transition-all cursor-pointer overflow-hidden group hover:shadow-xl">
                          <div
                            className="p-6 flex flex-col items-center gap-4"
                            onClick={() =>
                              handleOptionSelect(
                                t("total_bill"),
                                20,
                                t("bill_amount")
                              )
                            }
                          >
                            <div className="w-16 h-16 bg-orange-100 group-hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                              <FontAwesomeIcon
                                style={{ fontSize: "1.7rem" }}
                                className="h-[30px] w-[30px] text-orange-500 group-hover:text-white transition-colors"
                                icon={faListAlt}
                              ></FontAwesomeIcon>
                            </div>
                            <div className="text-center">
                              <h5 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                                {t("total_bill")}
                              </h5>
                            </div>
                          </div>
                        </Card>
                        <Card className=" transition-all cursor-pointer overflow-hidden group hover:shadow-xl">
                          <div
                            className="p-6 flex flex-col items-center gap-4"
                            onClick={() =>
                              handleOptionSelect(
                                t("order"),
                                40,
                                t("order_amount")
                              )
                            }
                          >
                            <div className="w-16 h-16 bg-orange-100 group-hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                              <ListOrdered className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-center">
                              <h5 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                                {t("order")}
                              </h5>
                            </div>
                          </div>
                        </Card>
                        <Card className=" transition-all cursor-pointer overflow-hidden group hover:shadow-xl">
                          <div
                            className="p-6 flex flex-col items-center gap-4"
                            onClick={() =>
                              handleOptionSelect(
                                t("all_stock"),
                                60,
                                t("stock_amount")
                              )
                            }
                          >
                            <div className="w-16 h-16 bg-orange-100 group-hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                              <FontAwesomeIcon
                                className="h-[30px] w-[30px] text-orange-500 group-hover:text-white transition-colors"
                                style={{ fontSize: "1.7rem" }}
                                icon={faBoxes}
                              />
                            </div>
                            <div className="text-center">
                              <h5 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                                {t("all_stock")}
                              </h5>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          ) : filtterModele === "historyUsage" ? (
            <div>
              <Tabs defaultActiveKey="clear_restaurant">
                <Tab eventKey="clear_restaurant" style={{ paddingTop: 20 }}>
                  <Card border="primary" style={{ margin: 0 }}>
                    <Card.Header
                      style={{
                        padding: "10px 30px",
                        backgroundColor: COLOR_APP,
                        color: "#fff",
                      }}
                    >
                      <h4>
                        <b>{t("clear_usage")}</b>
                      </h4>
                      <p>ເລືອກຂໍ້ມູນທີ່ຕ້ອງການລົບ</p>
                    </Card.Header>
                    <Card.Body>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 ">
                        <p>
                          <b>{t("select_date")}:</b>
                        </p>
                        <Button
                          variant="outline-primary"
                          size="small"
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                          }}
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
                      <hr />
                      <div
                        style={{
                          padding: "0 20px",
                        }}
                      >
                        <div>
                          <p>
                            <b>
                              {" "}
                              ເລືອກລ້າງ: {t("calculate_money")} , {t("order_history")}
                            </b>
                          </p>
                        </div>
                        <div
                          defaultActiveKey="currency-list"
                          className="grid grid-cols-1 md:grid-cols-2 md:p-[20px] md:gap-20 sm:grid-cols-1 sm:gap-6"
                        >
                          <Card className=" transition-all cursor-pointer overflow-hidden group hover:shadow-xl">
                            <div
                              className="p-6 flex flex-col items-center gap-4"
                              onClick={() =>
                                handleOptionSelect(
                                  t("calculate_money"),
                                  20,
                                  t("calculate_money")
                                )
                              }
                            >
                              <div className="w-16 h-16 bg-orange-100 group-hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                                <FontAwesomeIcon
                                  style={{ fontSize: "1.7rem" }}
                                  className="h-[30px] w-[30px] text-orange-500 group-hover:text-white transition-colors"
                                  icon={faTable}
                                ></FontAwesomeIcon>
                              </div>
                              <div className="text-center">
                                <h5 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                                  {t("calculate_money")}
                                </h5>
                              </div>
                            </div>
                          </Card>
                          <Card className=" transition-all cursor-pointer overflow-hidden group hover:shadow-xl">
                            <div
                              className="p-6 flex flex-col items-center gap-4"
                              onClick={() =>
                                handleOptionSelect(
                                  t("order_history"),
                                  0,
                                  t("order_history")
                                )
                              }
                            >
                              <div className="w-16 h-16 bg-orange-100 group-hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                                <FontAwesomeIcon 
                                  style={{ fontSize: "1.7rem" }}
                                  className="h-[30px] w-[30px] text-orange-500 group-hover:text-white transition-colors"
                                 icon={faCoins} />
                              </div>
                              <div className="text-center">
                                <h5 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                                  {t("order_history")}
                                </h5>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          ) : filtterModele === "historyClear" ? (
            <div>
              <hr/>
              <Nav
               variant="tabs"
                defaultActiveKey="/historyClear"
                style={{
                  fontWeight: "bold",
                  backgroundColor: "#f8f8f8",
                  border: "none",
                  borderRadius: "5px",
                  overflowX: "scroll",
                  display: "flex",
                  gap: "20px",
                }}
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="/`historyClear`"
                    style={{
                      color: "#FB6E3B",
                      border: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setfiltterClear("historyClear");
                      setOrderHistory(true);
                    }}
                  >
                    {t("history_clear_bill")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item >
                  <Nav.Link
                    eventKey="/clear_order"
                    style={{
                      color: "#FB6E3B",
                      border: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setfiltterClear("clear_order");
                      setOrderHistory(true);
                    }}
                  >
                    {t("history_clear_order")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="/clear_stock"
                    style={{
                      color: "#FB6E3B",
                      border: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setfiltterClear("clear_stock");
                      setOrderHistory(true);
                    }}
                  >
                    {t("history_clear_stock")}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          ) : filtterClear === "historyClear" ? (
            <div>
              <div>Hello</div>
            </div>
          ):("")}

          <PopUpSetStartAndEndDate
            open={popup?.popupfiltter}
            onClose={() => setPopup()}
            startDate={startDate}
            setStartDate={setStartDate}
            setStartTime={setStartTime}
            startTime={startTime}
            setEndDate={setEndDate}
            setEndTime={setEndTime}
            endTime={endTime}
            endDate={endDate}
          />

          <PopUpConfirmClearHistroy
            open={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            text={selectedOptionText}
            textAmount={amountText}
            amount={amount}
            startData={startDate}
            endData={endDate}
            onSubmit={handleComfime}
          />
        </div>
      )}
    </div>
  );
};

export default RestaurantHistoryClear;
