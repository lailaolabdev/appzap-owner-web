import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Breadcrumb,
  Button,
  ButtonGroup,
  Form,
  Alert,
  Pagination
} from "react-bootstrap";
import {
  BsArrowCounterclockwise,
  BsFillCalendarWeekFill,
  BsInfoCircle
} from "react-icons/bs";
import { MdAssignmentAdd, MdOutlineCloudDownload } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import Box from "../../components/Box";
import ReportChartWeek from "../../components/report_chart/ReportChartWeek";
import moment from "moment";
import { COLOR_APP } from "../../constants";
import ButtonDropdown from "../../components/button/ButtonDropdown";
import { FaSearch, FaUser } from "react-icons/fa";
import {
  getMemberAllCount,
  getMemberCount,
  getMembers,
  getMemberBillCount,
  getMemberTotalMoney,
  getAllPoints,
  getAllBills,
  getMemberOrderMenu,
  getTotalPoint,
  getAllMoneys
} from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import { FaCoins } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { moneyCurrency } from "../../helpers/index";
import PopUpMemberEdit from "../../components/popup/PopUpMemberEdit";
import PopUpMemberOrder from "../../components/popup/PopUpMemberOrder";
import PopUpMemberOrderAll from "../../components/popup/PopUpMemberOrderAll";
import { use } from "i18next";
let limitData = 10;

export default function MemberPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // state
  const [memberAllCount, setMemberAllCount] = useState(); // member all
  const [memberCount, setMemberCount] = useState();
  const [memberBillCount, setMemberBillCount] = useState();
  const [memberTotalMoney, setMemberTotalMoney] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [popup, setPopup] = useState();
  const [membersData, setMembersData] = useState();
  const [allPoints, setallPoints] = useState();
  const [allBills, setAllBills] = useState();
  const [allMoneys, setAllMoneys] = useState();
  const [totalPoints, setTotalPoints] = useState();
  const [orderMenu, setOrderMenu] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [paginationMember, setPaginationMember] = useState(1);
  const [totalPaginationMember, setTotalPaginationMember] = useState();
  const [selectedMember, setSelectedMember] = useState();
  const [searchMember, setSearchMember] = useState([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);
  const [selectedMemberOrders, setSelectedMemberOrders] = useState("");
  const [memberOrdersToTalMoney, setMemberOrdersToTalMoney] = useState([]);
  const [memberOrdersTotalBill, setMemberOrdersTotalBill] = useState([]);

  const { storeDetail } = useStore();
  // provider

  // useEffect
  useEffect(() => {
    getMembersData();
    getMemberCountData();
    getMemberCountByfilterData();
    getMemberBillCountData();
    getMemberTotalMoneyData();
    getAllPoint();
    getAllBill();
    getMemberOrderMenus();
    getAllMoney();
    getTotalPoints();
  }, []);
  useEffect(() => {
    getMemberCountByfilterData();
    getMemberBillCountData();
    getMemberTotalMoneyData();
    getTotalPoints();
    getMemberOrderMenus();
    getMemberTotalMoneyData();
    getMemberBillCountData();
  }, [endDate, startDate, endTime, startTime, selectedMenuIds]);

  useEffect(() => {
    getMembersData();
  }, [paginationMember]);

  useEffect(() => {
    getMemberOrderMenus();
    getMemberTotalMoneyData();
    getMemberBillCountData();
    getTotalPoints();
  }, [selectedMemberOrders]);

  // useEffect(() => {
  //   console.log(object)
  // }, [selectedMenuIds]);

  // useEffect(() => {
  //   console.log("memberOrders: ", memberOrders.data);
  // }, [memberOrders]);

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setPopup({ PopUpMemberEdit: true });
  };

  const handleUpdate = () => {
    getMembersData(); // Refresh the members data
  };

  const handleSelectMember = (memberOrders) => {
    console.log("DATAID: ", selectedMemberOrders, memberOrders);
    setSelectedMemberOrders(memberOrders);
  };

  // function
  const getMembersData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      findby += `skip=${(paginationMember - 1) * limitData}&`;
      findby += `limit=${limitData}&`;
      if (filterValue) {
        findby += `search=${filterValue}&`;
      }
      const _data = await getMembers(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data);
    } catch (err) {}
  };

  const getAllPoint = async () => {
    try {
      const { TOKEN } = await getLocalData();
      const _data = await getAllPoints(TOKEN);
      if (_data.error) throw new Error("error");
      setallPoints(_data);
    } catch (error) {}
  };

  const getAllBill = async () => {
    try {
      const { TOKEN } = await getLocalData();
      const _data = await getAllBills(TOKEN);
      if (_data.error) throw new Error("error");
      setAllBills(_data);
    } catch (error) {}
  };

  const getAllMoney = async () => {
    try {
      const { TOKEN } = await getLocalData();
      const _data = await getAllMoneys(TOKEN);
      if (_data.error) throw new Error("error");
      setAllMoneys(_data);
    } catch (error) {}
  };

  const getTotalPoints = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const findBy = `&storeId=${DATA?.storeId}&startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const _data = await getTotalPoint(selectedMemberOrders, findBy, TOKEN);
      if (_data.error) throw new Error("error");
      setTotalPoints(_data?.totalPoint);
    } catch (error) {}
  };

  const getMemberOrderMenus = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const findBy = `&storeId=${DATA?.storeId}&startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const _data = await getMemberOrderMenu(
        selectedMemberOrders,
        findBy,
        TOKEN
      );
      if (_data.error) throw new Error("error");
      setOrderMenu(_data || []);
    } catch (error) {}
  };

  const getMemberCountData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const _data = await getMemberAllCount(DATA?.storeId, TOKEN);
      if (_data.error) throw new Error("error");
      setMemberAllCount(_data.count);
      setTotalPaginationMember(Math.ceil(_data?.count / limitData));
    } catch (err) {}
  };
  const getMemberCountByfilterData = async () => {
    const { TOKEN, DATA } = await getLocalData();
    const findBy = `?storeId=${DATA?.storeId}&startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;

    const _data = await getMemberCount(findBy, TOKEN);
    if (_data.error) return;
    setMemberCount(_data.count);
  };
  const getMemberBillCountData = async () => {
    const { TOKEN, DATA } = await getLocalData();
    const findBy = `&storeId=${DATA?.storeId}&startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const _data = await getMemberBillCount(selectedMemberOrders, findBy, TOKEN);
    if (_data.error) return;
    setMemberBillCount(_data.billAmount);
  };
  const getMemberTotalMoneyData = async () => {
    const { TOKEN, DATA } = await getLocalData();
    const findBy = `&storeId=${DATA?.storeId}&startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const _data = await getMemberTotalMoney(
      selectedMemberOrders,
      findBy,
      TOKEN
    );

    console.log("MEMBERID: ", selectedMemberOrders);

    if (_data.error) return;
    setMemberTotalMoney(_data.totalMoney);
  };

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("report")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("report_member")}</Breadcrumb.Item>
        </Breadcrumb>
        <Alert key="warning" variant="warning">
          ອັບເດດຄັ້ງລາສຸດ 04:00 (ລາຍງານຈະອັບເດດທຸກໆມື້)
        </Alert>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "0.5fr 0.5fr 0.5fr 0.5fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
            marginBottom: 20
          }}
        >
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              {t("all_member")}
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32
                  // fontWeight: 700
                }}
              >
                {memberAllCount}
              </div>
            </Card.Body>
          </Card>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              ຈຳນວນເງີນທັງໝົດ
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32
                  // fontWeight: 700
                }}
              >
                {moneyCurrency(allMoneys?.moneyAmount)}{" "}
                {storeDetail?.firstCurrency}
              </div>
            </Card.Body>
          </Card>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              ຈຳນວນບີນທັງໝົດ
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32
                  // fontWeight: 700
                }}
              >
                {allBills?.billAmount}
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
                padding: 10
              }}
            >
              <span>{t("all_point")}</span>

              <Button
                variant="dark"
                bg="dark"
                onClick={() =>
                  navigate("/reports/members-report/setting-point")
                }
              >
                <FaCoins /> {t("point_setting")}
              </Button>
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 400
                }}
              >
                {allPoints?.pointAmmount}
              </div>
            </Card.Body>
          </Card>
        </Box>
        <Card border="primary" style={{ margin: 0, marginBottom: 20 }}>
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10
            }}
          >
            <span>{t("member_list")}</span>

            <Button
              variant="dark"
              bg="dark"
              onClick={() => navigate("/reports/members-report/create-member")}
            >
              <MdAssignmentAdd /> {t("add_member")}
            </Button>
          </Card.Header>
          <Card.Body>
            <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Form.Control
                  placeholder={t("search_name")}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
                <Button
                  onClick={() => getMembersData()}
                  variant="primary"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <FaSearch /> {t("search")}
                </Button>
              </div>
            </div>
            <table style={{ width: "100%" }}>
              <tr>
                <th style={{ textAlign: "left" }}>{t("member_name")}</th>
                <th style={{ textAlign: "center" }}>{t("phone")}</th>
                <th style={{ textAlign: "center" }}>{t("point")}</th>
                <th style={{ textAlign: "center" }}>{t("use_service")}</th>
                <th style={{ textAlign: "center" }}>{t("regis_date")}</th>
                <th style={{ textAlign: "right" }}>{t("manage")}</th>
              </tr>
              {membersData?.map((e) => (
                <tr>
                  <td style={{ textAlign: "left" }}>{e?.name}</td>
                  <td style={{ textAlign: "center" }}>{e?.phone}</td>
                  <td style={{ textAlign: "center" }}>{e?.point}</td>
                  <td style={{ textAlign: "center" }}>{e?.bill}</td>
                  <td style={{ textAlign: "center" }}>
                    {moment(e?.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleEditClick(e)}
                    >
                      {t("edit")}
                    </Button>
                  </td>
                </tr>
              ))}
            </table>
          </Card.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              bottom: 20
            }}
          >
            <ReactPaginate
              previousLabel={
                <span className="glyphicon glyphicon-chevron-left">{`ກ່ອນໜ້າ`}</span>
              }
              nextLabel={
                <span className="glyphicon glyphicon-chevron-right">{`ຕໍ່ໄປ`}</span>
              }
              breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
              breakClassName={"break-me"}
              pageCount={totalPaginationMember} // Replace with the actual number of pages
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={(e) => {
                console.log(e);
                setPaginationMember(e?.selected + 1);
              }}
              containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
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

        {/* filter */}
        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
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
          {/* <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ PopupDaySplitView: true })}
          >
            <BsFillCalendarEventFill /> DAY SPLIT VIEW
          </Button> */}
          <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ popupmemberorder: true })}
          >
            <AiFillPrinter /> {t("all_member")}
          </Button>
          <Button
            disabled
            // variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            // onClick={() => setPopup({ popupmemberorderall: true })}
          >
            <MdOutlineCloudDownload /> ທຸກເມນູ
          </Button>
        </div>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr 1fr 1fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
            marginBottom: 20
          }}
        >
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              {t("new_member")}
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700
                }}
              >
                {memberCount}
              </div>
            </Card.Body>
          </Card>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              {t("point")}
            </Card.Header>
            <Card.Body>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700
                }}
              >
                {totalPoints}
              </div>
            </Card.Body>
          </Card>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              {t("bill_amount")}
            </Card.Header>
            <Card.Body>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700
                }}
              >
                {memberBillCount}
              </div>
            </Card.Body>
          </Card>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              {t("total_price")}
            </Card.Header>
            <Card.Body>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700
                }}
              >
                {moneyCurrency(memberTotalMoney)} {storeDetail?.firstCurrency}
              </div>
            </Card.Body>
          </Card>
        </Box>
        <div>
          <Card border="primary" style={{ margin: 0, marginBottom: 20 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              {t("menu_amount")}
            </Card.Header>
            <Card.Body>
              {/* <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <Form.Control placeholder="ຄົ້ນຫາຊື່ເມນູ" />
                  <Button
                    variant="primary"
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <FaSearch /> ຄົ້ນຫາ
                  </Button>
                </div>
              </div> */}
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("menu_name")}</th>
                  <th style={{ textAlign: "center" }}>{t("order_amount")}</th>
                  <th style={{ textAlign: "right" }}>{t("total_money")}</th>
                  {/* <th style={{ textAlign: "right" }}></th> */}
                </tr>

                {orderMenu?.map((e) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{e?.name}</td>
                    <td style={{ textAlign: "center" }}>{e?.served}</td>
                    {/* <td style={{ textAlign: "center" }}>{e?.canceled}</td> */}
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.totalSaleAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </td>
                  </tr>
                ))}
              </table>
            </Card.Body>
          </Card>
          {/* <ReportCard title={"ກຣາຟ"} chart={<ReportChartWeek />} /> */}
        </div>
      </Box>
      {/* popup */}
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
      <PopUpMemberEdit
        open={popup?.PopUpMemberEdit}
        onClose={() => setPopup()}
        memberData={selectedMember}
        onUpdate={handleUpdate}
      />
      <PopUpMemberOrder
        open={popup?.popupmemberorder}
        onClose={() => setPopup()}
        onSelectMember={handleSelectMember}
        // setData={setSelectedMemberOrders}
      />
      <PopUpMemberOrderAll
        open={popup?.popupmemberorderall}
        onClose={() => setPopup()}
        setSelectedMenu={setSelectedMenuIds}
      />
    </>
  );
}

function ReportCard({ title, chart }) {
  const { t } = useTranslation();
  return (
    <Card border="primary" style={{ margin: 0 }}>
      <Card.Header
        style={{
          backgroundColor: COLOR_APP,
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold"
        }}
      >
        {title} <BsInfoCircle />
      </Card.Header>
      <Card.Body>
        {/* <Card.Title>Special title treatment</Card.Title>
          <Card.Text>
            With supporting text below as a natural lead-in to additional content.
          </Card.Text> */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 10,
            padding: 10
          }}
        >
          <ButtonDropdown variant="outline-primary">
            <option>{t("amount")}</option>
            <option>{t("price")}</option>
          </ButtonDropdown>
          <Button variant="outline-primary">{t("chose_one_prod")}</Button>
          <ButtonGroup aria-label="Basic example">
            <Button variant="outline-primary">{"<<"}</Button>
            <Button variant="outline-primary">01/03/2023 ~ 31/03/2023</Button>
            <Button variant="outline-primary">{">>"}</Button>
          </ButtonGroup>
          <div>{t("compare")}</div>
          <ButtonDropdown variant="outline-primary">
            <option value={"test"}>{t("last_month")}</option>
            <option value={"test2"}>{t("bg_year")}</option>
            <option value={"test3"}>01/03/2023 ~ 31/03/2023</option>
          </ButtonDropdown>
          <Button variant="outline-primary">
            <BsArrowCounterclockwise />
          </Button>
        </div>
        <div>{chart}</div>
      </Card.Body>
    </Card>
  );
}
