import React, { useEffect, useState } from "react";
import {
  Card,
  Breadcrumb,
  Button,
  ButtonGroup,
  Form,
  Alert,
  Pagination,
} from "react-bootstrap";
import {
  BsArrowCounterclockwise,
  BsFillCalendarWeekFill,
  BsInfoCircle,
} from "react-icons/bs";
import { MdAssignmentAdd, MdOutlineCloudDownload } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import Box from "../../components/Box";
import ReportChartWeek from "../../components/report_chart/ReportChartWeek";
import moment from "moment";
import { COLOR_APP } from "../../constants";
import ButtonDropdown from "../../components/button/ButtonDropdown";
import { FaSearch } from "react-icons/fa";
import {
  getMemberAllCount,
  getMemberCount,
  getMembers,
  getMemberBillCount,
  getMemberTotalMoney,
} from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import { FaCoins } from "react-icons/fa";
import ReactPaginate from "react-paginate";

let limitData = 10;

export default function MemberPage() {
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

  const [paginationMember, setPaginationMember] = useState(1);
  const [totalPaginationMember, setTotalPaginationMember] = useState();

  // provider

  // useEffect
  useEffect(() => {
    getMembersData();
    getMemberCountData();
    getMemberCountByfilterData();
    getMemberBillCountData();
    getMemberTotalMoneyData();
  }, []);
  useEffect(() => {
    getMemberCountByfilterData();
    getMemberBillCountData();
    getMemberTotalMoneyData();
  }, [endDate, startDate, endTime, startTime]);

  useEffect(() => {
    getMembersData();
  }, [paginationMember]);

  // function
  const getMembersData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      findby += `skip=${(paginationMember - 1) * limitData}&`;
      findby += `limit=${limitData}&`;
      const _data = await getMembers(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data);
    } catch (err) {}
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
    const findBy = `?storeId=${DATA?.storeId}&startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const _data = await getMemberBillCount(findBy, TOKEN);
    if (_data.error) return;
    setMemberBillCount(_data.count);
  };
  const getMemberTotalMoneyData = async () => {
    const { TOKEN, DATA } = await getLocalData();
    const findBy = `?storeId=${DATA?.storeId}&startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const _data = await getMemberTotalMoney(findBy, TOKEN);
    if (_data.error) return;
    setMemberTotalMoney(_data.totalMoney);
  };

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>ລາຍງານ</Breadcrumb.Item>
          <Breadcrumb.Item active>ລາຍງານສະມາຊິກ</Breadcrumb.Item>
        </Breadcrumb>
        <Alert key="warning" variant="warning">
          ອັບເດດຄັ້ງລາສຸດ 2024/02/20 15:00 (ລາຍງານຈະອັບເດດທຸກໆມື້)
        </Alert>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
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
              ຈຳນວນສະມາຊິກທັງໝົດ
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <span>ຄະແນນສະສົມທັງໝົດ</span>

              <Button
                variant="dark"
                bg="dark"
                onClick={() => navigate("/report/members-report/setting-point")}
              >
               <FaCoins /> ຕັ້ງຄ່າການໃຫ້ຄະແນນ
              </Button>
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
                -
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
              padding: 10,
            }}
          >
            <span>ລາຍການສະມາຊິກ</span>

            <Button
              variant="dark"
              bg="dark"
              onClick={() => navigate("/report/members-report/create-member")}
            >
              <MdAssignmentAdd /> ເພີ່ມສະມາຊິກ
            </Button>
          </Card.Header>
          <Card.Body>
            <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Form.Control placeholder="ຄົ້ນຫາຊື່ສະມາຊິກ" />
                <Button
                  variant="primary"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <FaSearch /> ຄົ້ນຫາ
                </Button>
              </div>
            </div>
            <table style={{ width: "100%" }}>
              <tr>
                <th style={{ textAlign: "left" }}>ຊື່ສະມາຊິກ</th>
                <th style={{ textAlign: "center" }}>ເບີໂທ</th>
                <th style={{ textAlign: "center" }}>ຄະແນນສະສົມ</th>
                <th style={{ textAlign: "center" }}>ໃຊ້ບໍລິການ</th>
                <th style={{ textAlign: "center" }}>ວັນທີສະໝັກ</th>
                <th style={{ textAlign: "right" }}>ຈັດການ</th>
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
                    <Button>ແກ້ໄຂ</Button>
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
              bottom: 20,
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
            disabled
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ printReport: true })}
          >
            <AiFillPrinter /> ສະມາຊີກທຸກຄົນ
          </Button>
          <Button
            disabled
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
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
              ສະມາຊິກໃໝ່
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
              ຄະແນນ
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
                -
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
              ຈຳນວນບິນ
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
              ຍອດບິນລວມ
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
                {memberTotalMoney}
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
              ຍອດຂາຍເມນູ
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
                  <th style={{ textAlign: "left" }}>ຊື່ເມນູ</th>
                  <th style={{ textAlign: "center" }}>ຈຳນວນອໍເດີ</th>
                  <th style={{ textAlign: "center" }}>ຈຳນວນເງິນ</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
                {/* {userReport?.map((e) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{e?.userId?.userId}</td>
                    <td style={{ textAlign: "center" }}>{e?.served}</td>
                    <td style={{ textAlign: "center" }}>{e?.canceled}</td>
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.totalSaleAmount)}₭
                    </td>
                  </tr>
                ))} */}
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
    </>
  );
}

function ReportCard({ title, chart }) {
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
            <option>ຍອດຈຳນວນ</option>
            <option>ຍອດເງິນ</option>
          </ButtonDropdown>
          <Button variant="outline-primary">ເລືອກສິນຄ້າ 1 ລາຍການ</Button>
          <ButtonGroup aria-label="Basic example">
            <Button variant="outline-primary">{"<<"}</Button>
            <Button variant="outline-primary">01/03/2023 ~ 31/03/2023</Button>
            <Button variant="outline-primary">{">>"}</Button>
          </ButtonGroup>
          <div>ປຽບທຽບກັບ</div>
          <ButtonDropdown variant="outline-primary">
            <option value={"test"}>ເດືອນແລ້ວ</option>
            <option value={"test2"}>ຕົ້ນປີ</option>
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
