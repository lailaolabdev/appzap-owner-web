import React, { useCallback, useEffect, useState } from "react";
// import useReactRouter from "use-react-router"
import { Nav } from "react-bootstrap";
import moment from "moment";
import { getHeaders } from "../../services/auth";
import { END_POINT_SEVER } from "../../constants/api";
import AnimationLoading from "../../constants/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faCoins,
  faPeopleArrows,
  faPrint,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingAppzap from "../../components/LoadingAppzap";
import PaginationAppzap from "../../constants/PaginationAppzap";

export default function HistoryUse() {
  // const { history, location, match } = useReactRouter();
  const params = useParams();
  const [data, setData] = useState([]);
  const [totalLogs, setTotalLogs] = useState();
  const [filtterModele, setFiltterModele] = useState("checkBill");

  const [isLoading, setIsLoading] = useState(false);

  const rowsPerPage = 100;
  const [page, setPage] = useState(0);
  const pageAll = totalLogs > 0 ? Math.ceil(totalLogs / rowsPerPage) : 1;
  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  useEffect(() => {
    _getdataHistories();
  }, []);
  useEffect(() => {
    _getdataHistories();
  }, [page]);

  useEffect(() => {
    _getdataHistories();
  }, [filtterModele]);
  const _getdataHistories = async () => {
    try {
      const headers = await getHeaders();
      setIsLoading(true);
      const res = await axios.get(
        END_POINT_SEVER +
          `/v3/logs/skip/${page * rowsPerPage}/limit/${rowsPerPage}?storeId=${
            params?.id
          }&modele=${filtterModele}`,
        { headers }
      );
      if (res?.status < 300) {
        setData(res?.data?.data);
        setTotalLogs(res?.data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div>
        <Nav
          fill
          variant="tabs"
          defaultActiveKey="/checkBill"
          style={{
            fontWeight: "bold",
            backgroundColor: "#f8f8f8",
            border: "none",
            height: 60,
            marginBottom:5
          }}
        >
          <Nav.Item>
            <Nav.Link
              eventKey="/checkBill"
              style={{
                color: "#FB6E3B",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setFiltterModele("checkBill")}
            >
              {" "}
              <FontAwesomeIcon icon={faTable}></FontAwesomeIcon>{" "}
              <div style={{ width: 8 }}></div> ຄິດໄລ່ເງິນ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/canceled"
              style={{
                color: "#FB6E3B",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setFiltterModele("canceled")}
            >
              <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>{" "}
              <div style={{ width: 8 }}></div> ຍົກເລີກອາຫານ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/print"
              style={{
                color: "#FB6E3B",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setFiltterModele("print")}
            >
              <FontAwesomeIcon icon={faPrint}></FontAwesomeIcon>{" "}
              <div style={{ width: 8 }}></div> ປີນເຕີ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/resetBill"
              style={{
                color: "#FB6E3B",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setFiltterModele("resetBill")}
            >
              <FontAwesomeIcon icon={faCertificate}></FontAwesomeIcon>{" "}
              <div style={{ width: 8 }}></div> ແກ້ໄຂບີນ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/transferTable"
              style={{
                color: "#FB6E3B",
                border: "none",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setFiltterModele("transferTable")}
            >
              <FontAwesomeIcon icon={faPeopleArrows}></FontAwesomeIcon>{" "}
              <div style={{ width: 8 }}></div> ຍ້າຍລວມໂຕະ
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      {isLoading ? (
        <LoadingAppzap />
      ) : (
        <div className="col-sm-12">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">ລຳດັບ</th>
                <th scope="col">ຊື່ຜູ້ຈັດການ</th>
                {/* <th scope="col">ສະຖານະ</th> */}
                <th scope="col">ລາຍລະອຽດ</th>
                <th scope="col">ເຫດຜົນ</th>
                <th scope="col">ວັນທີ, ເດືອນ, ປີ (ເວລາ)</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item, index) => {
                return (
                  <tr>
                    <td>{page * rowsPerPage + index + 1}</td>
                    <td>{item?.user}</td>
                    {/* <td
                      style={{
                        color: item?.event === "INFO" ? "green" : "red",
                      }}
                    >
                      {item?.event}
                    </td> */}
                    <td>{item?.eventDetail}</td>
                    <td>
                      {item?.reason === null ||
                      item?.reason === "" ||
                      item?.reason === undefined ||
                      item?.reason === "undefined" ||
                      item?.reason === "null"
                        ? "-"
                        : item?.reason}
                    </td>
                    <td>
                      {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <PaginationAppzap
            rowsPerPage={rowsPerPage}
            page={page}
            pageAll={pageAll}
            onPageChange={handleChangePage}
          />
        </div>
      )}
    </div>
  );
}
