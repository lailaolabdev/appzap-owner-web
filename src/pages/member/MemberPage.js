import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import {
  Card,
  Breadcrumb,
  Button,
  ButtonGroup,
  Form,
  Alert,
  Pagination,
  Nav,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import {
  faCertificate,
  faCoins,
  faPeopleArrows,
  faTable,
  faList,
  faBirthdayCake,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BsArrowCounterclockwise,
  BsFillCalendarWeekFill,
  BsInfoCircle,
} from "react-icons/bs";
import {
  MdAssignmentAdd,
  MdOutlineCloudDownload,
  MdRotateRight,
} from "react-icons/md";
import styled from "styled-components";
import { FaSearch, FaUser } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import moment from "moment";
import Box from "../../components/Box";
import ReportChartWeek from "../../components/report_chart/ReportChartWeek";
import { COLOR_APP } from "../../constants";
import ButtonDropdown from "../../components/button/ButtonDropdown";
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
  getAllMoneys,
  getMembersListTop,
  getMembersListBirthday,
} from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import PopUpExportExcel from "../../components/popup/PopUpExportExcel";
import { useStore } from "../../store";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";

import { moneyCurrency } from "../../helpers/index";
import PopUpMemberEdit from "../../components/popup/PopUpMemberEdit";
import PopUpMemberOrder from "../../components/popup/PopUpMemberOrder";
import PopUpMemberOrderAll from "../../components/popup/PopUpMemberOrderAll";
import { use } from "i18next";
import PopUpSetStartAndEndDateBirthDay from "../../components/popup/PopUpSetStartAndEndDateBirthDay";
import PopUpSetStartAndEndDateFilterPoint from "../../components/popup/PopUpSetStartAndEndDateFilterPoint";
import PopUpSetStartAndEndDateTop from "../../components/popup/PopUpSetStartAndEndDateTop";
import { set } from "lodash";

import EmptyImage from "../../image/empty-removebg.png";
import PopUpSetStartAndEndDateMember from "../../components/popup/PopUpSetStartAndEndDateMember";
import { GetRedeemPoint, GetEarnPoint } from "../../services/point";

import { useStoreStore } from "../../zustand/storeStore";
import theme from "../../theme";

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
  const [startDateMenu, setStartDateMenu] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDateMenu, setEndDateMenu] = useState(moment().format("YYYY-MM-DD"));
  const [startTimeMenu, setStartTimeMenu] = useState("00:00:00");
  const [endTimeMenu, setEndTimeMenu] = useState("23:59:59");
  const [startDateTop, setStartDateTop] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDateTop, setEndDateTop] = useState(moment().format("YYYY-MM-DD"));
  const [startTimeTop, setStartTimeTop] = useState("00:00:00");
  const [endTimeTop, setEndTimeTop] = useState("23:59:59");
  const [startDateBirthDay, setStartDateBirthDay] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDateBirthDay, setEndDateBirthDay] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [startTimeBirthDay, setStartTimeBirthDay] = useState("00:00:00");
  const [endTimeBirthDay, setEndTimeBirthDay] = useState("23:59:59");
  const [startDatePoint, setStartDatePoint] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDatePoint, setEndDatePoint] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [startTimePoint, setStartTimePoint] = useState("00:00:00");
  const [endTimePoint, setEndTimePoint] = useState("23:59:59");
  const [startDateMember, setStartDateMember] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDateMember, setEndDateMember] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [startTimeMember, setStartTimeMember] = useState("00:00:00");
  const [endTimeMember, setEndTimeMember] = useState("23:59:59");
  const [popup, setPopup] = useState();
  const [membersData, setMembersData] = useState();
  const [allPoints, setallPoints] = useState();
  const [allBills, setAllBills] = useState();
  const [allMoneys, setAllMoneys] = useState();
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalPointsUsed, setTotalPointsUsed] = useState(0);
  const [orderMenu, setOrderMenu] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [paginationMember, setPaginationMember] = useState(1);
  const [totalPaginationMember, setTotalPaginationMember] = useState();
  const [totalPaginationMemberTop, setTotalPaginationMemberTop] = useState();
  const [totalPaginationMemberBirthday, setTotalPaginationMemberBirthday] =
    useState();
  const [selectedMember, setSelectedMember] = useState();
  const [memberName, setMemberName] = useState("");
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);
  const [selectedMemberOrders, setSelectedMemberOrders] = useState("");
  const [changeUi, setChangeUi] = useState("LIST_MEMBER");
  const [loading, setLoading] = useState([]);

  const [memberListTop, setMemberListTop] = useState();
  const [memberListBirthday, setMemberListBirthday] = useState();
  const [valueTopList, setValueTopList] = useState();
  const [redeemList, setRedeemList] = useState([]);
  const [redeemCount, setRedeemCount] = useState(0);
  const [EarnList, setEarnList] = useState([]);
  const [EarnCount, setEarnCount] = useState(0);

  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();

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
    getMemberListBirthday();
    getMemberListTop();
    setStoreDetail({
      changeUi: "LIST_MEMBER",
      startDay: moment(startDate).format("DD"),
      endDay: moment(endDate).format("DD"),
      month: moment(startDate).format("MM"),
    });
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
    getMemberListTop();
    getMemberListBirthday();
    getRedeemPointUser();
    getEarnPointUser();
  }, [paginationMember]);

  useEffect(() => {
    getMemberOrderMenus();
    getMemberTotalMoneyData();
    getMemberBillCountData();
    getTotalPoints();
  }, [selectedMemberOrders]);

  useEffect(() => {
    getMembersDataSearch();
  }, [
    endDateMember,
    startDateMember,
    endTimeMember,
    startTimeMember,
    // filterValue,
  ]);

  useEffect(() => {
    getMemberListTop();
  }, [endDateTop, startDateTop, endTimeTop, startTimeTop, valueTopList]);

  useEffect(() => {
    getMemberListBirthday();
    getRedeemPointUser();
    getEarnPointUser();
  }, [endDateBirthDay, startDateBirthDay, endTimeBirthDay, startTimeBirthDay]);
  useEffect(() => {
    getRedeemPointUser();
    getEarnPointUser();
  }, [endDatePoint, startDatePoint, endTimePoint, startTimePoint]);

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
    getMemberListTop();
    getMemberListBirthday();
  };

  const handleSelectMember = (memberOrders) => {
    // console.log("DATAID: ", selectedMemberOrders, memberOrders);
    setSelectedMemberOrders(memberOrders);
  };

  // function
  const getMembersData = async () => {
    setLoading(true);
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      findby += `skip=${(paginationMember - 1) * limitData}&`;
      findby += `limit=${limitData}&`;
      if (filterValue) {
        findby += `search=${filterValue}`;
      }
      // findby += `startDate=${startDateMember}&`;
      // findby += `endDate=${endDateMember}&`;
      // findby += `startTime=${startTimeMember}&`;
      // findby += `endTime=${endTimeMember}`;

      const _data = await getMembers(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data.data.data);
      setTotalPaginationMember(Math.ceil(_data?.data?.memberCount / limitData));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const getMembersDataSearch = async () => {
    setLoading(true);
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      findby += `skip=${(paginationMember - 1) * limitData}&`;
      findby += `limit=${limitData}&`;
      if (filterValue) {
        findby += `search=${filterValue}&`;
      }
      findby += `startDate=${startDateMember}&`;
      findby += `endDate=${endDateMember}&`;
      findby += `startTime=${startTimeMember}&`;
      findby += `endTime=${endTimeMember}`;

      const _data = await getMembers(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data.data.data);
      setTotalPaginationMember(Math.ceil(_data?.data?.memberCount / limitData));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getMemberListTop = async () => {
    setLoading(true);

    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      findby += `skip=${(paginationMember - 1) * limitData}&`;
      findby += `limit=${valueTopList ? valueTopList : 10}&`;
      findby += `startDate=${startDateTop}&`;
      findby += `endDate=${endDateTop}&`;
      findby += `startTime=${startTimeTop}&`;
      findby += `endTime=${endTimeTop}`;
      const _data = await getMembersListTop(findby, TOKEN);

      // console.log("Data Top", _data.data);

      if (_data.error) throw new Error("error");
      setMemberListTop(_data.data);
      setTotalPaginationMemberTop(
        storeDetail.limitData ? 1 : Math.ceil(10 / limitData)
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  // console.log(memberListTop);

  const getMemberListBirthday = async () => {
    setLoading(true);
    const start = moment(startDateBirthDay).format("DD");
    const end = moment(endDateBirthDay).format("DD");
    const month = moment(startDateBirthDay).format("MM");
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      findby += `skip=${(paginationMember - 1) * limitData}&`;
      findby += `limit=${limitData}&`;
      findby += `startDay=${start}&`;
      findby += `endDay=${end}&`;
      findby += `month=${month}&`;
      const _data = await getMembersListBirthday(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMemberListBirthday(_data.data.data);
      setTotalPaginationMemberBirthday(
        Math.ceil(_data?.data?.memberCount / limitData)
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
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
      setTotalPointsUsed(_data?.totalAllPointUsed);
    } catch (error) {}
  };

  const getMemberOrderMenus = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      // console.log({ TOKEN });
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
  const getMemberOrderMenusAll = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      // console.log({ TOKEN });
      const findBy = `&storeId=${DATA?.storeId}&startDate=${startDateMenu}&endDate=${endDateMenu}&endTime=${endTimeMenu}&startTime=${startTimeMenu}`;
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
      // console.log({ _data });
      if (_data.error) throw new Error("error");
      // setMemberAllCount(_data?.count);
      setMemberAllCount(_data?.count);
      // setTotalPaginationMember(Math.ceil(_data?.count / limitData));
    } catch (err) {}
  };

  const getMemberCountByfilterData = async () => {
    const { TOKEN, DATA } = await getLocalData();
    const findBy = `?storeId=${DATA?.storeId}&startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;

    const _data = await getMemberCount(findBy, TOKEN);

    // console.log("CountFilterData", _data);
    if (_data.error) return;
    setMemberCount(_data?.count);
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

    // console.log("MEMBERID: ", selectedMemberOrders);

    if (_data.error) return;
    setMemberTotalMoney(_data.totalMoney);
  };

  const getRedeemPointUser = async () => {
    setLoading(true);
    const { DATA } = await getLocalData();
    let findby = "?";
    findby += `storeId=${DATA?.storeId}&`;
    findby += `skip=${(paginationMember - 1) * limitData}&`;
    findby += `limit=${limitData}&`;
    findby += `startDay=${startDatePoint}&`;
    findby += `endDay=${endDatePoint}&`;
    findby += `startTime=${startTimePoint}&`;
    findby += `endTime=${endTimePoint}&`;
    const data = await GetRedeemPoint(findby)
      .then((res) => {
        setRedeemCount(Math.ceil(res?.data?.count / limitData));
        setRedeemList(res?.data?.data);
        setLoading(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error: ", err);
      });
  };
  const getEarnPointUser = async () => {
    setLoading(true);
    const { DATA } = await getLocalData();
    let findby = "?";
    findby += `storeId=${DATA?.storeId}&`;
    findby += `skip=${(paginationMember - 1) * limitData}&`;
    findby += `limit=${limitData}&`;
    findby += `startDate=${startDatePoint}&`;
    findby += `endDate=${endDatePoint}&`;
    findby += `startTime=${startTimePoint}&`;
    findby += `endTime=${endTimePoint}&`;
    const data = await GetEarnPoint(findby)
      .then((res) => {
        setEarnCount(Math.ceil(res?.data?.count / limitData));
        setEarnList(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error: ", err);
      });
  };

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("report")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("report_member")}</Breadcrumb.Item>
        </Breadcrumb>
        <Alert
          key="warning"
          variant="warning"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {t("report_member_updates_last")}
          <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ Export: true })}
            // onClick={downloadExcel}
            // disabled={loadingExportCsv}
          >
            <MdOutlineCloudDownload /> EXPORT
          </Button>
        </Alert>
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
              {t("all_member")}
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
                fontWeight: "bold",
              }}
            >
              {t("total_money_many")}
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
                fontWeight: "bold",
              }}
            >
              {t("total_bill_many")}
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
                padding: 10,
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
                  fontWeight: 400,
                }}
              >
                {allPoints?.pointAmmount}
              </div>
            </Card.Body>
          </Card>
        </Box>

        {/* Tab Select */}

        <Box
          sx={{
            fontWeight: "bold",
            backgroundColor: "#f2f2f0",
            border: "none",
            display: "grid",
            gridTemplateColumns: {
              md: "repeat(5,1fr)",
              sm: "repeat(3,1fr)",
              xs: "repeat(2,1fr)",
            },
            marginBottom: "10px",
          }}
        >
          <Nav.Item>
            <Nav.Link
              eventKey="/listMember"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "LIST_MEMBER"
                    ? theme.mutedColor
                    : "",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                setChangeUi("LIST_MEMBER");
                getMembersData();
                setStoreDetail({
                  changeUi: "LIST_MEMBER",
                  startDay: "",
                  endDay: "",
                  month: "",
                });
                setValueTopList("");
              }}
            >
              <FontAwesomeIcon icon={faList}></FontAwesomeIcon>{" "}
              <div style={{ width: 8 }}></div> <span>{t("member_list")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/listRedeem/Point"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "LIST_REDEEMPOINT"
                    ? theme.mutedColor
                    : "",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                setStoreDetail({
                  changeUi: "LIST_REDEEMPOINT",
                });
                getRedeemPointUser();
                setValueTopList("");
              }}
            >
              {/* <FontAwesomeIcon icon={faBirthdayCake}></FontAwesomeIcon>{" "} */}
              <div style={{ width: 8 }} />{" "}
              <span>{t("point_usage_history")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/listEearn/Point"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "LIST_EARNPOINT"
                    ? theme.mutedColor
                    : "",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                setStoreDetail({
                  changeUi: "LIST_EARNPOINT",
                });
                getEarnPointUser();
                setValueTopList("");
              }}
            >
              {/* <FontAwesomeIcon icon={faBirthdayCake}></FontAwesomeIcon>{" "} */}
              <div style={{ width: 8 }} />{" "}
              <span>{t("point_reception_history")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/listTop"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "LIST_TOP" ? theme.mutedColor : "",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                getMemberListTop();
                setStoreDetail({
                  changeUi: "LIST_TOP",
                  startDay: "",
                  endDay: "",
                  month: "",
                });
              }}
            >
              <FontAwesomeIcon icon={faList}></FontAwesomeIcon>{" "}
              <div style={{ width: 8 }}></div> <span>{t("lists_top")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/listeBirthday"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "LIST_BIRTHDAY"
                    ? theme.mutedColor
                    : "",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                getMemberListBirthday();
                setStoreDetail({ changeUi: "LIST_BIRTHDAY" });
                setValueTopList("");
              }}
            >
              <FontAwesomeIcon icon={faBirthdayCake}></FontAwesomeIcon>{" "}
              <div style={{ width: 8 }}></div>{" "}
              <span>{t("lists_birthday")}</span>
            </Nav.Link>
          </Nav.Item>
        </Box>

        {storeDetail.changeUi === "LIST_MEMBER" && (
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
                padding: 10,
              }}
            >
              <span>{t("member_list")}</span>

              <Button
                variant="dark"
                bg="dark"
                onClick={() =>
                  navigate("/reports/members-report/create-member")
                }
              >
                <MdAssignmentAdd /> {t("add_member")}
              </Button>
            </Card.Header>
            <Card.Body>
              <CardHeader>
                <div className="box-search">
                  <Form.Control
                    placeholder={t("search_member")}
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="input-search"
                  />
                  <Button
                    onClick={() => getMembersData()}
                    variant="primary"
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <FaSearch /> {t("search")}
                  </Button>
                </div>

                <div className="box-date-filter">
                  <div>{t("select_date")} : </div>
                  <Button
                    variant="outline-primary"
                    size="small"
                    className="btn-filter"
                    onClick={() => setPopup({ popupfiltterMember: true })}
                  >
                    <BsFillCalendarWeekFill />
                    <div>
                      {startDateMember} {startTimeMember}
                    </div>{" "}
                    ~{" "}
                    <div>
                      {endDateMember} {endTimeMember}
                    </div>
                  </Button>
                </div>
              </CardHeader>

              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("member_name")}</th>
                  <th style={{ textAlign: "center" }}>{t("phone")}</th>
                  <th style={{ textAlign: "center" }}>{t("total_point")}</th>
                  {/* <th style={{ textAlign: "center" }}>
                    {"ພ໋ອຍທີ່ສາມາດໃຊ້ໄດ້"}
                  </th> */}
                  <th style={{ textAlign: "center" }}>{t("use_service")}</th>
                  <th style={{ textAlign: "center" }}>{t("regis_date")}</th>
                  <th style={{ textAlign: "right" }}>{t("manage")}</th>
                </tr>
                {loading ? (
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                ) : membersData?.length > 0 ? (
                  membersData?.map((e) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{e?.name}</td>
                      <td style={{ textAlign: "center" }}>{e?.phone}</td>
                      <td style={{ textAlign: "center" }}>
                        {moneyCurrency(e?.point ?? 0)}
                      </td>
                      {/* <td style={{ textAlign: "center" }}>
                        {moneyCurrency(e?.availablePoint ?? 0)}
                      </td> */}
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
                  ))
                ) : (
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    <img src={EmptyImage} alt="" width={300} height={200} />
                  </td>
                )}
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
                previousLabel={
                  <span className="glyphicon glyphicon-chevron-left">
                    {t("previous")}
                  </span>
                }
                nextLabel={
                  <span className="glyphicon glyphicon-chevron-right">
                    {t("next")}
                  </span>
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
        )}
        {storeDetail.changeUi === "LIST_TOP" && (
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
                padding: 10,
              }}
            >
              <span>{t("lists_top")}</span>
            </Card.Header>
            <Card.Body>
              <CardHeader>
                <select
                  className="form-control"
                  id="form-control"
                  onChange={(e) => {
                    setValueTopList(e.target.value);
                    setStoreDetail({
                      limitData: e.target.value,
                    });
                  }}
                >
                  <option selected disabled>
                    {t("chose_top")}
                  </option>
                  <option value="10">10</option>
                  <option value="5">5</option>
                  <option value="3">3</option>
                  <option value="1">1</option>
                </select>
                <Button
                  variant="outline-primary"
                  size="small"
                  className="btn-fill-date"
                  onClick={() => setPopup({ popupfiltterTop: true })}
                >
                  <BsFillCalendarWeekFill />
                  <div>
                    {startDateTop} {startTimeTop}
                  </div>{" "}
                  ~{" "}
                  <div>
                    {endDateTop} {endTimeTop}
                  </div>
                </Button>
              </CardHeader>

              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("member_name")}</th>
                  <th style={{ textAlign: "center" }}>{t("phone")}</th>
                  <th style={{ textAlign: "center" }}>{t("point")}</th>
                  <th style={{ textAlign: "center" }}>{t("use_service")}</th>
                  <th style={{ textAlign: "center" }}>{t("money_amount")}</th>
                  <th style={{ textAlign: "right" }}>{t("manage")}</th>
                </tr>
                {loading ? (
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                ) : memberListTop?.length > 0 ? (
                  memberListTop?.map((e) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{e?.name}</td>
                      <td style={{ textAlign: "center" }}>{e?.phone}</td>
                      <td style={{ textAlign: "center" }}>{e?.point}</td>
                      <td style={{ textAlign: "center" }}>{e?.bill}</td>
                      <td style={{ textAlign: "center" }}>
                        {moneyCurrency(e?.money)}
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
                  ))
                ) : (
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    {" "}
                    <img src={EmptyImage} alt="" width={300} height={200} />
                  </td>
                )}
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
                previousLabel={
                  <span className="glyphicon glyphicon-chevron-left">
                    {t("previous")}
                  </span>
                }
                nextLabel={
                  <span className="glyphicon glyphicon-chevron-right">
                    {t("next")}
                  </span>
                }
                breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
                breakClassName={"break-me"}
                pageCount={totalPaginationMemberTop} // Replace with the actual number of pages
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
        )}
        {storeDetail.changeUi === "LIST_BIRTHDAY" && (
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
                padding: 10,
              }}
            >
              <span>{t("lists_birthday")}</span>
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div>{t("select_date")} :</div>
                <Button
                  variant="outline-primary"
                  size="small"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                  onClick={() => setPopup({ popupfiltterBD: true })}
                >
                  <BsFillCalendarWeekFill />
                  <div>
                    {startDateBirthDay} {startTimeBirthDay}
                  </div>{" "}
                  ~{" "}
                  <div>
                    {endDateBirthDay} {endTimeBirthDay}
                  </div>
                </Button>
              </div>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("member_name")}</th>
                  <th style={{ textAlign: "center" }}>{t("phone")}</th>
                  <th style={{ textAlign: "center" }}>{t("point")}</th>
                  <th style={{ textAlign: "center" }}>{t("use_service")}</th>
                  <th style={{ textAlign: "center" }}>{t("birth_day")}</th>
                  <th style={{ textAlign: "right" }}>{t("manage")}</th>
                </tr>
                {loading ? (
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                ) : memberListBirthday?.length > 0 ? (
                  memberListBirthday?.map((e) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{e?.name}</td>
                      <td style={{ textAlign: "center" }}>{e?.phone}</td>
                      <td style={{ textAlign: "center" }}>{e?.point}</td>
                      <td style={{ textAlign: "center" }}>{e?.bill}</td>
                      <td style={{ textAlign: "center" }}>
                        {moment(e?.birthday).format("DD/MM/YYYY")}
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
                  ))
                ) : (
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    <img src={EmptyImage} alt="" width={300} height={200} />
                  </td>
                )}
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
                previousLabel={
                  <span className="glyphicon glyphicon-chevron-left">
                    {t("previous")}
                  </span>
                }
                nextLabel={
                  <span className="glyphicon glyphicon-chevron-right">
                    {t("next")}
                  </span>
                }
                breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
                breakClassName={"break-me"}
                pageCount={totalPaginationMemberBirthday} // Replace with the actual number of pages
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
        )}

        {storeDetail.changeUi === "LIST_REDEEMPOINT" && (
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
                padding: 10,
              }}
            >
              <span>{t("point_usage_history_list")}</span>
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div>{t("select_date")} :</div>
                <Button
                  variant="outline-primary"
                  size="small"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                  onClick={() => setPopup({ popupfiltterPoint: true })}
                >
                  <BsFillCalendarWeekFill />
                  <div>
                    {startDateBirthDay} {startTimeBirthDay}
                  </div>{" "}
                  ~{" "}
                  <div>
                    {endDateBirthDay} {endTimeBirthDay}
                  </div>
                </Button>
              </div>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("member_name")}</th>
                  <th style={{ textAlign: "center" }}>{t("phone")}</th>
                  <th style={{ textAlign: "center" }}>{t("point_s")}</th>
                  <th style={{ textAlign: "center" }}>
                    {t("bill_point_balance")}
                  </th>
                  <th style={{ textAlign: "center" }}>{t("date")}</th>
                  {/* <th style={{ textAlign: "right" }}>{t("manage")}</th> */}
                </tr>
                {loading ? (
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                ) : redeemList?.length > 0 ? (
                  redeemList?.map((e) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{e?.memberId?.name}</td>
                      <td style={{ textAlign: "center" }}>
                        {e?.memberId?.phone}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {moneyCurrency(e?.point)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {moneyCurrency(e?.moneyTotal)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {moment(e?.createdAt).format("DD/MM/YYYY")}
                      </td>
                      {/* <td style={{ textAlign: "right" }}>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditClick(e)}
                        >
                          {t("edit")}
                        </Button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    <img src={EmptyImage} alt="" width={300} height={200} />
                  </td>
                )}
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
                previousLabel={
                  <span className="glyphicon glyphicon-chevron-left">
                    {t("previous")}
                  </span>
                }
                nextLabel={
                  <span className="glyphicon glyphicon-chevron-right">
                    {t("next")}
                  </span>
                }
                breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
                breakClassName={"break-me"}
                pageCount={redeemCount} // Replace with the actual number of pages
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={(e) => {
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
        )}

        {storeDetail.changeUi === "LIST_EARNPOINT" && (
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
                padding: 10,
              }}
            >
              <span>ລາຍການປະຫວັດໄດ້ຮັບພ໋ອຍ</span>
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div>{t("select_date")} :</div>
                <Button
                  variant="outline-primary"
                  size="small"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                  onClick={() => setPopup({ popupfiltterPoint: true })}
                >
                  <BsFillCalendarWeekFill />
                  <div>
                    {startDateBirthDay} {startTimeBirthDay}
                  </div>{" "}
                  ~{" "}
                  <div>
                    {endDateBirthDay} {endTimeBirthDay}
                  </div>
                </Button>
              </div>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("member_name")}</th>
                  <th style={{ textAlign: "center" }}>{t("phone")}</th>
                  <th style={{ textAlign: "center" }}>{t("point_g")}</th>
                  <th style={{ textAlign: "center" }}>
                    {t("bill_point_balance")}
                  </th>
                  <th style={{ textAlign: "center" }}>{t("date")}</th>
                  {/* <th style={{ textAlign: "right" }}>{t("manage")}</th> */}
                </tr>
                {loading ? (
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                ) : EarnList?.length > 0 ? (
                  EarnList?.map((e) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{e?.memberId?.name}</td>
                      <td style={{ textAlign: "center" }}>
                        {e?.memberId?.phone}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {moneyCurrency(e?.point)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {moneyCurrency(e?.totalAmount)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {moment(e?.createdAt).format("DD/MM/YYYY")}
                      </td>
                      {/* <td style={{ textAlign: "right" }}>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditClick(e)}
                        >
                          {t("edit")}
                        </Button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <img src={EmptyImage} alt="" width={300} height={200} />
                  </td>
                )}
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
                previousLabel={
                  <span className="glyphicon glyphicon-chevron-left">
                    {t("previous")}
                  </span>
                }
                nextLabel={
                  <span className="glyphicon glyphicon-chevron-right">
                    {t("next")}
                  </span>
                }
                breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
                breakClassName={"break-me"}
                pageCount={EarnCount} // Replace with the actual number of pages
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={(e) => {
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
        )}

        {/* filter */}
        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
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
            {startDate !== "" && endDate !== "" ? (
              <>
                <div>
                  {startDate} {startTime}
                </div>{" "}
                ~{" "}
                <div>
                  {endDate} {endTime}
                </div>
              </>
            ) : (
              "ເລືອກວັນທີ ແລະ ເວລາ "
            )}
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
            <FaUser /> {t("all_member")}
          </Button>
          <Button
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => {
              setStoreDetail({
                startDayFilter: "",
                endDayFilter: "",
                startTimeFilter: "",
                endTimeFilter: "",
                selectedMemberID: "",
              });
              setSelectedMemberOrders("");
              setStartDateMenu("");
              setEndDateMenu("");
              setStartTimeMenu("");
              setEndTimeMenu("");
              getMemberOrderMenusAll();
              setMemberName("");
            }}
          >
            <MdRotateRight /> {t("clear")}
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
              {t("new_member")}
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700,
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
                fontWeight: "bold",
              }}
            >
              {t("point_r")}
            </Card.Header>
            <Card.Body>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700,
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
                fontWeight: "bold",
              }}
            >
              {t("use_point")}
            </Card.Header>
            <Card.Body>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700,
                }}
              >
                {totalPointsUsed}
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
                  fontWeight: 700,
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
                fontWeight: "bold",
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
                  fontWeight: 700,
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
                fontWeight: "bold",
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
            {memberName && (
              <Card.Footer>
                <div
                  style={{ textAlign: "right", fontSize: 24, fontWeight: 700 }}
                >
                  ຍອດຂາຍເມນູຂອງ: {memberName}
                </div>
              </Card.Footer>
            )}
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
        startDateMenu={startDateMenu}
        setStartDateMenu={setStartDateMenu}
        setStartTimeMenu={setStartTimeMenu}
        startTimeMenu={startTimeMenu}
        setEndDateMenu={setEndDateMenu}
        setEndTimeMenu={setEndTimeMenu}
        endTimeMenu={endTimeMenu}
        endDateMenu={endDateMenu}
      />
      <PopUpSetStartAndEndDateMember
        open={popup?.popupfiltterMember}
        onClose={() => setPopup()}
        startDateMember={startDateMember}
        setStartDateMember={setStartDateMember}
        setStartTimeMember={setStartTimeMember}
        startTimeMember={startTimeMember}
        setEndDateMember={setEndDateMember}
        setEndTimeMember={setEndTimeMember}
        endTimeMember={endTimeMember}
        endDateMember={endDateMember}
      />
      <PopUpSetStartAndEndDateTop
        open={popup?.popupfiltterTop}
        onClose={() => setPopup()}
        startDateTop={startDateTop}
        setStartDateTop={setStartDateTop}
        setStartTimeTop={setStartTimeTop}
        startTimeTop={startTimeTop}
        setEndDateTop={setEndDateTop}
        setEndTimeTop={setEndTimeTop}
        endTimeTop={endTimeTop}
        endDateTop={endDateTop}
      />

      <PopUpSetStartAndEndDateFilterPoint
        open={popup?.popupfiltterPoint}
        onClose={() => setPopup()}
        startDatePoint={startDatePoint}
        setStartDatePoint={setStartDatePoint}
        setStartTimePoint={setStartTimePoint}
        startTimePoint={startTimePoint}
        setEndDatePoint={setEndDatePoint}
        setEndTimePoint={setEndTimePoint}
        endTimePoint={endTimePoint}
        endDatePoint={endDatePoint}
      />

      <PopUpSetStartAndEndDateBirthDay
        open={popup?.popupfiltterBD}
        onClose={() => setPopup()}
        startDateBirthDay={startDateBirthDay}
        setStartDateBirthDay={setStartDateBirthDay}
        setStartTimeBirthDay={setStartTimeBirthDay}
        startTimeBirthDay={startTimeBirthDay}
        setEndDateBirthDay={setEndDateBirthDay}
        setEndTimeBirthDay={setEndTimeBirthDay}
        endTimeBirthDay={endTimeBirthDay}
        endDateBirthDay={endDateBirthDay}
      />

      <PopUpMemberEdit
        open={popup?.PopUpMemberEdit}
        onClose={() => setPopup()}
        memberData={selectedMember}
        onUpdate={handleUpdate}
      />

      <PopUpExportExcel
        open={popup?.Export}
        setPopup={setPopup}
        onClose={() => setPopup()}
      />

      <PopUpMemberOrder
        open={popup?.popupmemberorder}
        onClose={() => setPopup()}
        onSelectMember={handleSelectMember}
        setData={setMemberName}
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
          fontWeight: "bold",
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
            padding: 10,
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

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  .box-search {
    width: 100%;
    display: flex;
    gap: 10px;
    .input-search {
      width: 100%;
    }
  }
  .box-date-filter {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10;
    .btn-filter {
      display: flex;
      gap: 10;
      align-items: "center";
      width: 82%;
      margin-left: 5px;
    }
  }

  #form-control {
    width: calc(100% - 40%);
  }
  .btn-fill-date {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  @media (max-width: 768px) {
    display: block;
    .box-search {
      width: 100%;
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      .input-search {
        width: 100%;
      }
    }
    .box-date-filter {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10;
      .btn-filter {
        margin-left: 5px;
        display: flex;
        gap: 10;
        align-items: center;
        width: 75%;
      }
    }
    #form-control {
      width: calc(100%);
      margin-bottom: 8px;
    }
    .btn-fill-date {
      display: flex;
      gap: 10px;
      align-items: center;
      width: 100%;
    }
  }
  @media (max-width: 820px) {
    .box-search {
      width: 100%;
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      .input-search {
        width: 100%;
      }
    }
    .box-date-filter {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10;
      .btn-filter {
        margin-left: 5px;
        display: flex;
        gap: 10;
        align-items: center;
        width: 75%;
      }
    }
    #form-control {
      width: calc(100%);
      margin-bottom: 8px;
    }
    .btn-fill-date {
      display: flex;
      gap: 10px;
      align-items: center;
      width: 100%;
    }
  }
  @media (max-width: 900px) {
    .box-search {
      width: 100%;
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      .input-search {
        width: 100%;
      }
    }
    .box-date-filter {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10;
      .btn-filter {
        margin-left: 5px;
        display: flex;
        gap: 10;
        align-items: center;
        width: 75%;
      }
    }
    #form-control {
      width: calc(100%);
      margin-bottom: 8px;
    }
    .btn-fill-date {
      display: flex;
      gap: 10px;
      align-items: center;
      width: 100%;
    }
  }
`;
