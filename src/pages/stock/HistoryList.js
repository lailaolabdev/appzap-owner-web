import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import useReactRouter from "use-react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Form, Nav } from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import { CATEGORY, getLocalData, END_POINT_SEVER } from "../../constants/api";
import NavList from "./components/NavList";
import moment from "moment";
import { useParams } from "react-router-dom";

export default function Historylist() {
  const {id} = useParams();
  // state
  const [getTokken, setgetTokken] = useState();
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
        getData(_localData?.DATA?.storeId);
      }
    };
    fetchData();
  }, []);

  const getData = async (id) => {
    setIsLoading(true);
    const _resHistory = await axios({
      method: "get",
      url: END_POINT_SEVER + `/v3/stock-histories?storeId=${id}`,
    });
    setHistories(_resHistory?.data);
    setIsLoading(false);
  };
  return (
    <div style={BODY}>
      <NavList ActiveKey="/settingStore/stock/history" />
      <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ລາຍການຊະຕ໊ອກ</th>
                  <th scope="col">ປະເພດ</th>
                  <th scope="col">ຈຳນວນ</th>
                  <th scope="col">ວັນທີ</th>
                </tr>
              </thead>
              <tbody>
                {histories &&
                  histories.map((data, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{data?.stockId?.name}</td>
                        <td>{data?.type}</td>
                        <td>{data?.quantity}</td>
                        <td>{moment(data?.createdAt).format("DD/MM/YYYY")}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
