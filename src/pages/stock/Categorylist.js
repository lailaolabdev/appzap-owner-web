import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner, Card } from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import { getLocalData, END_POINT_SEVER } from "../../constants/api";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import NavList from "./components/NavList";
import PopUpAddCategory from "./components/popup/PopUpAddCategory";
import PopUpEditCategory from "./components/popup/PopUpEditCategory";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { getHeaders } from "../../services/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";

export default function Categorylist() {
  // state
  const [popAddCategory, setPopAddCategory] = useState(false);
  const [popEditCategory, setPopEditCategory] = useState(false);
  const [popConfirmDeletion, setPopConfirmDeletion] = useState(false);
  const [select, setSelect] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState("");
  const { t } = useTranslation();
  const [Categorys, setCategorys] = useState([]);
  const navigate = useNavigate();
  const { profile } = useStore();
  const [hasManageStockEdit, setHasManageStockEdit] = useState(false);
  // functions
  const _confirmeDelete = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      let _resData = await axios.delete(
        `${END_POINT_SEVER}/v3/stock-category/delete/${select?._id}`,
        {
          headers: headers,
        }
      );
      if (_resData?.data) {
        setCategorys(_resData?.data);
        successAdd("ລົບຂໍ້ມູນສຳເລັດ");
        setPopConfirmDeletion(false);
        getCategory();
      }
    } catch (err) {
      console.log("Error:", err);
      errorAdd("ລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };
  const getCategory = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER}/v3/stock-categories?storeId=${DATA?.storeId}&isDeleted=false`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setCategorys(data.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };
  // -------------------------------------------------------------------------- //

  useEffect(() => {
    if (profile?.data?.permissionRoleId?.permissions) {
      const permissions = profile?.data?.permissionRoleId?.permissions;
      const permissionMap = [
        { set: setHasManageStockEdit, check: "MANAGE_STOCK_CAN_EDIT" },
      ];
      permissionMap.forEach(({ set, check }) => {
        set(permissions.includes(check));
      });
    }
  }, [profile?.data?.permissionRoleId?.permissions, profile]);

  useEffect(() => {
    const getData = async () => {
      getCategory();
    };
    getData();
  }, []);
  // -------------------------------------------------------------------------- //
  return (
    <div style={BODY}>
      <NavList ActiveKey="/settingStore/stock/category" />
      <div>
        <div className="col-sm-12 text-right">
          {
            <Button
              className="col-sm-2"
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => navigate("/settingStore/stock/addCategory")}
            >
              {t("add_stock_type")}
            </Button>
          }
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <Card>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              <h5>{t("stock_type")}</h5>
            </Card.Header>
            <Card.Body>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>{t("no")}</th>
                    <th>{t("stock_type_name")}</th>
                    <th>{t("note")}</th>
                    <th style={{ textAlign: "right" }}>{t("manage_data")}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  ) : loadStatus === "ERROR!!" ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <h1>{t("error")}</h1>
                      </td>
                    </tr>
                  ) : (
                    Categorys?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.note}</td>
                        <td style={{ textAlign: "right" }}>
                          {hasManageStockEdit && (
                            <div>
                              <Button
                                variant="outline-primary"
                                onClick={() => {
                                  setSelect(item);
                                  setPopEditCategory(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <span> </span>
                              <Button
                                variant="outline-danger"
                                onClick={() => {
                                  setSelect(item);
                                  setPopConfirmDeletion(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </div>
      </div>
      {/* >>>>>>>>>>> popup >>>>>>>>>>>>>>>> */}
      <PopUpAddCategory
        open={popAddCategory}
        onClose={() => setPopAddCategory(false)}
        callback={() => {
          successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
          getCategory();
        }}
      />
      <PopUpEditCategory
        open={popEditCategory}
        onClose={() => setPopEditCategory(false)}
        callback={() => {
          successAdd("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
          getCategory();
        }}
        data={select}
      />
      <PopUpConfirmDeletion
        open={popConfirmDeletion}
        onClose={() => setPopConfirmDeletion(false)}
        text={select?.name}
        onSubmit={_confirmeDelete}
      />
      {/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
    </div>
  );
}
