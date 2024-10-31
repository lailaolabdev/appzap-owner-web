import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Button, Card, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useWindowDimensions2 from "../../helpers/useWindowDimension2";

import { getLocalData } from "../../constants/api";
import {
  GetAllBranchRelation,
  GetAllBranchIncome,
  DeleteBranchRelation,
} from "../../services/branchRelation";

import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import Loading from "../../components/Loading";
import Box from "../../components/Box";
import "./index.css";
import { COLOR_APP } from "../../constants";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import convertNumber from "../../helpers/convertNumber";
import PieChart from "./PieChart";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions2();
  // state
  const [popup, setPopup] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [filterValue, setFilterValue] = useState("");
  const [branchData, setBranchData] = useState("");
  const [branchInCome, setBranchInCome] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  // useEffect
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    GetAllBranchData();
  }, [endDate, startDate, endTime, startTime, filterValue]);

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
        console.log("combinedData", combinedData);
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
  const handleShowPopup = (data) => {
    setShowPopupDelete(true);
    setBranchData(data);
  };

  const DeleteBranch = async () => {
    try {
      const { TOKEN } = await getLocalData();
      await DeleteBranchRelation(TOKEN, branchData?._id, branchData?.storeId);
      setShowPopupDelete(false);
      await GetAllBranchData();
    } catch (error) {
      console.error("Error deleting branch:", error);
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
    return branchInCome?.reduce((currentValue, nextValue) => {
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
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      GetAllBranchData();
                    }
                  }}
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
                <Button
                  onClick={() => navigate("/branch/create")}
                  variant="primary"
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginLeft: 25,
                  }}
                >
                  <FaPlusCircle /> {t("add")}
                </Button>
              </div>
            </CardHeader>
            <div style={{ flex: 1 }} />
          </div>

          <p style={{ fontWeight: "bold", fontSize: 18, color: COLOR_APP }}>
            {`${t("total_branch")} (${t("all_recieve")}
            ${convertNumber(TotalInCome())} ${t("lak")})`}
          </p>
          {branchInCome?.length > 0 ? (
            branchInCome?.map((value, index) =>
              value.totalAmount === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                    alignItems: "center",
                  }}
                  key={value._id}
                >
                  <h3 style={{ fontSize: 18, fontWeight: "bold" }}>
                    ບໍ່ມີຂໍ້ມູນ
                  </h3>
                </div>
              ) : (
                <>
                  <CardBody key={value._id}>
                    <div id="sub-card-body-left">
                      <table
                        style={{ width: width > 900 ? "60%" : "100%" }}
                        className="table-bordered"
                      >
                        <tr
                          style={{ backgroundColor: COLOR_APP, color: "white" }}
                        >
                          {/* <th style={{ textAlign: "left" }}>ລຳດັບ</th> */}
                          <th style={{ textAlign: "center" }}>ຊື່ຮ້ານ</th>
                          <th style={{ textAlign: "center" }}>ລາຍຮັບທັງໝົດ</th>
                          <th style={{ textAlign: "center" }}>ຈັດການ</th>
                        </tr>
                        {branchInCome?.length > 0 &&
                          branchInCome?.map((data, index) => (
                            <tr key={data._id} hidden={data?.totalAmount === 0}>
                              {/* <td style={{ textAlign: "left" }}>{index + 1}</td> */}
                              <td style={{ textAlign: "center" }}>
                                {data?.nameBranch}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {convertNumber(data?.totalAmount)} {t("lak")}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                <Button
                                  onClick={() => handleShowPopup(data)}
                                  variant="primary"
                                  style={{ marginLeft: 10, fontWeight: "bold" }}
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </table>
                    </div>
                    <div id="sub-card-body-right">
                      <PieChart
                        DatabranchInCome={branchInCome}
                        TotalInCome={TotalInCome}
                      />
                    </div>
                  </CardBody>
                </>
              )
            )
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: "bold" }}>ບໍ່ມີຂໍ້ມູນ</h3>
            </div>
          )}
          {/* ================== other branch ======================== */}
          {/* <div
            style={{
              height: 20,
              borderBottom: `1px solid ${COLOR_APP}`,
              width: "100%",
              margin: "20px 0",
            }}
          />
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
                <Card
                  border="primary"
                  style={{ margin: 0 }}
                  key={data._id}
                  hidden={data?.totalAmount === 0}
                >
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
                    {data?.nameBranch ? data?.nameBranch : "ບໍ່ມີຂໍ້ມູນຮ້ານ"}
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
          </Box> */}
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

      <PopUpConfirmDeletion
        open={showPopupDelete}
        onClose={() => setShowPopupDelete(false)}
        onSubmit={DeleteBranch}
        text={branchData?.nameBranch}
      />
    </div>
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

const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  grid-auto-flow: dense;

  /* display: flex;
  gap: 15px;
  width: 100%; */
  /* flex-wrap: wrap-reverse; */

  #sub-card-body-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #sub-card-body-right {
    width: calc(100% - 22%);
    height: calc(100% - 35%);
    /* width: calc(100% - 22%);
    height: calc(100% - 35%); */
  }

  @media (max-width: 768px) {
    display: block;
  }
`;
