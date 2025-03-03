import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Button, Pagination, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaSearch, FaPlusCircle, FaTrash, FaEllipsisH } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import useWindowDimensions2 from "../../helpers/useWindowDimension2";
import { getLocalData } from "../../constants/api";
import {
  GetAllBranchRelation,
  GetAllBranchIncome,
  DeleteBranchRelation,
} from "../../services/branchRelation";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import Loading from "../../components/Loading";
import "./index.css";
import { COLOR_APP } from "../../constants";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import convertNumber from "../../helpers/convertNumber";
import PieChart from "./PieChart";

import { useStoreStore } from "../../zustand/storeStore";
import { DonutChart } from "./DonutChart";
import { Card } from "../../components/ui/Card";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { width, height } = useWindowDimensions2();
  const limitData = 4;
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
  const [paginations, setPaginations] = useState(1);
  const [paginationTotal, setPaginationTotal] = useState();

  // useEffect
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    GetAllBranchData();
  }, [
    endDate,
    startDate,
    endTime,
    startTime,
    filterValue,
    paginations,
    storeDetail?.branchStartDate,
    storeDetail?.branchEndDate,
    storeDetail?.branchStartTime,
    storeDetail?.branchEndTime,
  ]);

  useEffect(() => {
    GetAllBranchData();
  }, []);

  const GetAllBranchData = async () => {
    setLoadingData(true);
    try {
      const { DATA, TOKEN } = await getLocalData();

      if (TOKEN && DATA?._id) {
        let findby = "?";
        findby += `userId=${DATA?._id}&`;
        findby += `skip=${(paginations - 1) * limitData}&`;
        findby += `limit=${limitData}&`;
        if (filterValue) {
          findby += `storeName=${filterValue}`;
        }

        let findbyIncome = "?";
        findbyIncome += `userId=${DATA?._id}&`;
        if (filterValue) {
          findbyIncome += `storeName=${filterValue}&`;
        }
        if (storeDetail?.branchStartDate && storeDetail?.branchEndDate) {
          findbyIncome += `startDate=${storeDetail?.branchStartDate}&`;
          findbyIncome += `endDate=${storeDetail?.branchEndDate}`;
        } else {
          findbyIncome += `startDate=${startDate}&`;
          findbyIncome += `endDate=${endDate}`;
        }
        const [branchData, incomeData] = await Promise.all([
          GetAllBranchRelation(TOKEN, findby),
          GetAllBranchIncome(TOKEN, findbyIncome),
        ]);
        // Combine branchData and incomeData into one object
        const combinedData = branchData?.branchRelations?.map((branch) => {
          const income = incomeData?.data?.find(
            (inc) => inc._id === branch.storeId._id
          );
          return {
            ...branch,
            totalAmount: income?.totalAmount || 0,
            nameBranch: income?.storeDetails?.name || "",
          };
        });
        setBranchInCome(combinedData);
        setPaginationTotal(Math.ceil(branchData?.count / limitData));
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
      await DeleteBranchRelation(
        TOKEN,
        branchData?._id,
        branchData?.storeId?._id
      );
      setShowPopupDelete(false);
      await GetAllBranchData();
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const TotalInCome = () => {
    return branchInCome?.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.totalAmount;
    }, 0);
  };

  return (
    <div
      style={{
        padding: "16px 16px 24px 16px",
        overflowY: "auto",
        maxHeight: "100vh",
        height: "calc(100vh - 64px)",
        backgroundColor: "#f8f8f8",
      }}
    >
      <div style={{ height: 10 }} />

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
          <div className="flex w-full justify-between gap-4 lg:flex-row flex-col">
            <div className="flex items-center gap-2 flex-1 max-w-[480px] min-w-80">
              <Form.Control
                placeholder={`${t("name_branch")}...`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className=""
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    GetAllBranchData();
                  }
                }}
              />
              <Button
                onClick={() => GetAllBranchData()}
                variant="primary"
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <FaSearch /> {t("search")}
              </Button>
            </div>

            <div className="flex items-center gap-2">
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
                }}
              >
                <FaPlusCircle /> {t("add")}
              </Button>
            </div>
          </div>
          <div style={{ flex: 1 }} />
        </div>

        {loadingData ? (
          <Loading />
        ) : branchInCome?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-3">
              <Card className="bg-white rounded-xl overflow-hidden p-4">
                <h2 className="text-lg font-bold">ລາຍຮັບທັງໝົດ</h2>
                <h3 className="text-xl font-bold">
                  <span className="text-color-app text-3xl font-bold font-inter">
                    {convertNumber(TotalInCome())}
                  </span>{" "}
                  <span className="text-lg font-bold">{t("lak")}</span>
                </h3>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DonutChart
                className="bg-white rounded-xl"
                chartConfig={{
                  income: { label: "ສາຂາ" },
                  ...branchInCome.reduce(
                    (config, branch, index) => ({
                      ...config,
                      [branch.storeId.name]: {
                        label: branch.storeId.name,
                        color: `hsl(var(--chart-${(index % 9) + 1}))`,
                      },
                    }),
                    {}
                  ),
                }}
                chartData={branchInCome.map((branch, index) => ({
                  branch: branch.storeId.name,
                  income: branch.totalAmount,
                  fill: `hsl(var(--chart-${(index % 9) + 1}))`,
                }))}
              />

              <Card className="bg-white rounded-xl overflow-hidden">
                <div className="border rounded-md relative h-full">
                  <div className="overflow-y-auto max-h-[640px] overscroll-none">
                    <table className="w-full rounded-2xl">
                      <tr className="text-white bg-color-app hover:bg-color-app hover:text-white sticky top-0">
                        {/* <th style={{ textAlign: "left" }}>ລຳດັບ</th> */}
                        <th
                          style={{
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          ຊື່ຮ້ານ
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          ລາຍຮັບທັງໝົດ
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          ຈັດການ
                        </th>
                      </tr>
                      {branchInCome?.length > 0 &&
                        branchInCome?.map((data, index) => (
                          <tr key={data._id}>
                            {/* <td style={{ textAlign: "left" }}>{index + 1}</td> */}
                            <td
                              style={{ textAlign: "start", padding: "0 24px" }}
                            >
                              {data?.storeId?.name}
                            </td>
                            <td
                              style={{ textAlign: "center", padding: "0 16px" }}
                            >
                              {convertNumber(data?.totalAmount)} {t("lak")}
                            </td>
                            <td
                              style={{
                                textAlign: "start",
                                fontWeight: "bold",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 4,
                              }}
                            >
                              <Button
                                onClick={() =>
                                  navigate(
                                    `/branch/detail/${data?.storeId?._id}`,
                                    {
                                      state: { storeId: data?.storeId?._id },
                                    }
                                  )
                                }
                                variant="primary"
                                style={{ marginLeft: 10, fontWeight: "bold" }}
                              >
                                <FaEllipsisH />
                              </Button>
                              <Button
                                onClick={() => handleShowPopup(data)}
                                variant="primary"
                                style={{ marginLeft: 10, fontWeight: "bold" }}
                                hidden={data?.storeId?._id === storeDetail?._id}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </table>
                  </div>
                </div>
              </Card>
            </div>
          </>
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
        text={branchData?.storeId?.name}
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
