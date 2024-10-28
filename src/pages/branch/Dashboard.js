import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Button, Card, Form } from "react-bootstrap";
import Box from "../../components/Box";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import { getLocalData } from "../../constants/api";
import { FaEye } from "react-icons/fa";
import "./index.css";
import { COLOR_APP } from "../../constants";
// import { useStore } from "../../store";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import {
  GetAllBranchRelation,
  GetAllBranchIncome,
} from "../../services/branchRelation";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import convertNumber from "../../helpers/convertNumber";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // state
  const [popup, setPopup] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [filterValue, setFilterValue] = useState("");
  // const [branch, setBranch] = useState([]);
  const [branchInCome, setBranchInCome] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // const { storeDetail } = useStore();

  console.log("branchInCome", branchInCome);

  // useEffect
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    GetAllBranchData();
  }, [endDate, startDate, endTime, startTime]);

  useEffect(() => {
    GetAllBranchData();
  }, []);

  const GetAllBranchData = async () => {
    setLoadingData(true);
    try {
      const { DATA, TOKEN } = await getLocalData();

      if (TOKEN && DATA?._id) {
        const [branchData, incomeData] = await Promise.all([
          GetAllBranchRelation(TOKEN, DATA._id, filterValue),
          GetAllBranchIncome(TOKEN, DATA._id, filterValue, startDate, endDate),
        ]);

        // Combine branchData and incomeData into one object
        const combinedData = branchData.map((branch) => {
          const income = incomeData?.data?.find(
            (inc) => inc._id === branch.storeId
          );
          return {
            ...branch,
            totalAmount: income?.totalAmount || 0,
            nameBranch: income?.storeDetails?.name || "",
          };
        });
        setBranchInCome(combinedData);
        setLoadingData(false);
      } else {
        console.error("Token or User ID not found");
        setLoadingData(false);
      }
    } catch (err) {
      console.error("Error fetching combined branch data:", err);
      setLoadingData(false);
    }
  };

  // const GetAllBranch = async () => {
  //   const { DATA, TOKEN } = await getLocalData();
  //   GetAllBranchRelation(TOKEN, DATA?._id)
  //     .then((data) => setBranch(data))
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  // const GetAllBranchInCome = async () => {
  //   const { DATA, TOKEN } = await getLocalData();
  //   GetAllBranchIncome(TOKEN, DATA?._id)
  //     .then((data) => setBranchInCome(data?.data))
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  const TotalInCome = () => {
    return branchInCome.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.totalAmount;
    }, 0);
  };

  return (
    <div style={{ padding: 10, overflow: "auto" }}>
      <div style={{ height: 10 }} />
      {loadingData ? (
        <Loading />
      ) : (
        <div
          sx={{
            fontWeight: "bold",
            backgroundColor: "#f8f8f8",
            border: "none",
            display: "grid",
            gridTemplateColumns: {
              md: "repeat(5,1fr)",
              sm: "repeat(3,1fr)",
              xs: "repeat(2,1fr)",
            },
          }}
        >
          <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
            <CardHeader>
              <div className="box-search">
                <Form.Control
                  placeholder={t("name_branch")}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="input-search"
                />
                <Button
                  onClick={() => GetAllBranchData()}
                  variant="primary"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <FaSearch /> {t("search")}
                </Button>
              </div>

              <div className="box-date-filter">
                <span>ເລືອກວັນທີ : </span>
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
              <Button
                onClick={() => navigate("/branch/create")}
                variant="primary"
                style={{ display: "flex", gap: 10, alignItems: "center" }}
              >
                <FaPlusCircle /> {t("add")}
              </Button>
            </CardHeader>
            <div style={{ flex: 1 }} />
          </div>

          <p style={{ fontWeight: "bold", fontSize: 18, color: COLOR_APP }}>
            {t("total_branch")}
          </p>
          <div
            style={{
              // height: 20,
              borderBottom: `1px solid ${COLOR_APP}`,
              width: "100%",
              marginBottom: 20,
            }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                md: "1fr 1fr 1fr",
                sm: "1fr 1fr",
                xs: "1fr",
              },
              gap: 10,
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
                {t("all_amount")}
              </Card.Header>
              <Card.Body>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p style={{ fontWeight: "bold", fontSize: 18 }}>
                    {convertNumber(TotalInCome())} {t("lak")}
                  </p>
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
                {t("income")}
              </Card.Header>
              <Card.Body>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p style={{ fontWeight: "bold", fontSize: 18 }}>
                    Coming soon
                  </p>
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
                {t("expe_lak")}
              </Card.Header>
              <Card.Body>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p style={{ fontWeight: "bold", fontSize: 18 }}>
                    Coming soon
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Box>
          {/* ================== other branch ======================== */}
          <div
            style={{
              // height: 20,
              borderBottom: `1px solid ${COLOR_APP}`,
              width: "100%",
              margin: "20px 0",
            }}
          />

          <p style={{ fontWeight: "bold", fontSize: 18, color: COLOR_APP }}>
            {t("list_branch")}
          </p>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                md: "1fr 1fr 1fr 1fr",
                sm: "1fr 1fr",
                xs: "1fr",
              },
              gap: 10,
            }}
          >
            {branchInCome?.length > 0 &&
              branchInCome?.map((data) => (
                <Card border="primary" style={{ margin: 0 }} key={data._id}>
                  <Card.Header
                    style={{
                      backgroundColor: COLOR_APP,
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* {t("branch")} {index + 1} :{" "} */}
                    {data?.nameBranch ? data?.nameBranch : "ບໍ່ມີຂໍ້ມູນຮ້ານ"}
                    {/* {data?.storeId?.name
                      ? data?.storeId?.name
                      : "ບໍ່ມີຂໍ້ມູນຮ້ານ"} */}
                    {/* <Button
                  variant="primary"
                  bg="primary"
                  onClick={() => navigate("/branch/detail/123")}
                >
                  <FaEye /> {t("detail")}
                </Button> */}
                  </Card.Header>
                  <Card.Body>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <p style={{ fontWeight: "bold", fontSize: 18 }}>
                        {t("all_recieve")} {convertNumber(data?.totalAmount)}{" "}
                        {t("lak")}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </Box>
        </div>
      )}

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
    </div>
  );
}

const Option = styled.option`
  cursor: pointer;
  padding: 10px;
  &:hover {
    background-color: #ffffff !important;
  }
`;
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
