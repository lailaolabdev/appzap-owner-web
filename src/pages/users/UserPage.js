import React, { useEffect, useState } from "react";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Pagination } from "react-bootstrap";
import { Formik } from "formik";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { getBanners } from "../../services/banner";
import Upload from "../../components/Upload";
import { IoBeerOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { getBillFarks } from "../../services/fark";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import PopUpDetaillBillFark from "../../components/popup/PopUpDetaillBillFark";
import { convertBillFarkStatus } from "../../helpers/convertBillFarkStatus";
import { IoPeople } from "react-icons/io5";
import {
  deleteUser,
  getUserCountV5,
  getUsers,
  getUsersV5,
} from "../../services/user";
import Spinner from "react-bootstrap/Spinner";
import PopUpCreateUser from "../../components/popup/PopUpCreateUser";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { convertRole } from "../../helpers/convertRole";
import { useTranslation } from "react-i18next";

import {
  fetchPermissionUsers,
  createPermissionUser,
  updatePermissionUser,
  deletePermissionUser,
} from "../../services/permission_user";

const limitData = 10;

export default function UserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // state
  const [isLoading, setIsLoading] = useState(true);
  const [loanDataList, setLoanDataList] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [totalDataList, setTotalDataList] = useState(0);
  const [backupFormData, setBackupFormData] = useState();
  const [userData, setUserData] = useState();
  const [selectUser, setSelectUser] = useState();
  const [popup, setPopup] = useState();
  const [permissionUsers, setPermissionUsers] = useState([]);
  

  // store
  const { storeDetail } = useStore();
  const storeId = storeDetail._id
   //console.log("storeId:", storeId)
   console.log("permissionUsers:", permissionUsers)

   const fetchAllPermissionUsers = async () => {
    try {
      const data = await fetchPermissionUsers(storeDetail?._id);
      setPermissionUsers(data);
    } catch (error) {
      console.error("Error fetching permission Users:", error);
    }
  };

  useEffect(() => {
    fetchAllPermissionUsers();
  }, [storeDetail?._id]);


  // useEffect
  useEffect(() => {
    getCountData();
  }, []);
  useEffect(() => {
    getData();
  }, [pagination]);
  // function
  const getData = async () => {
    try {
      setIsLoading(true);
      const { DATA, TOKEN } = await getLocalData();
      let findby = "?";
      findby += `storeId=${storeDetail?._id}&`;
      findby += `skip=${(pagination - 1) * limitData}&`;
      findby += `limit=${limitData}&`;

      const _data = await getUsersV5(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setUserData(_data);
      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
    }
  };
  const getCountData = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      let findby = "?";
      findby += `storeId=${storeDetail?._id}&`;

      const _data = await getUserCountV5(findby, TOKEN);
      console.log("newLimit:---->", _data?.count);
      setTotalPagination(Math.ceil(_data?.count / limitData));
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleDeleteUser = async () => {
    const { DATA, TOKEN } = await getLocalData();
    await deleteUser(selectUser?._id, TOKEN);
    setPopup();
    setSelectUser();
    getData();
  };


  return (
    <>
      <div
        style={{
          padding: "20px 20px 80px 20px",
          maxHeight: "100vh",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("staff")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("staff_report")}</Breadcrumb.Item>
        </Breadcrumb>
        {/* <div style={{ display: "flex", gap: 10, padding: "10px 0" }}>
          <Form.Control
            style={{ maxWidth: 220 }}
            placeholder="ຄົ້ນຫາພະນັກງານ"
          />
          <Button variant="primary">ຄົ້ນຫາ</Button>
        </div> */}

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
            <span>
              <IoPeople /> {t("staff_report")}
            </span>
            <div>
              <Button
                style={{marginRight:'5px'}}
                variant="dark"
                bg="dark"
                onClick={() => {
                  navigate(`/user/permission-user/${storeId}`)
                  
                }}
              >
                <MdAssignmentAdd /> {t("ສ້າງສິດ")}
              </Button>
              <Button
                variant="dark"
                bg="dark"
                onClick={() => setPopup({ PopUpCreateUser: true })}
              >
                <MdAssignmentAdd /> {t("add_list")}
              </Button>
            </div>
          </Card.Header>
          <Card.Body
            style={{
              overflowX: "auto",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner animation="border" variant="danger" />
              </div>
            ) : (
              <table style={{ width: "100%" }}>
                <tr>
                  <th>#</th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("image")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("name")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("user_name")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("tel")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("permision")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("manage")}
                  </th>
                </tr>
                {userData?.map((e, i) => (
                  <tr>
                    <td style={{ textAlign: "start" }}>
                      {(pagination - 1) * limitData + i + 1}
                    </td>
                    <td style={{ textAlign: "start" }}>
                      <div>
                        <img
                          src="/images/profile.png"
                          alt=""
                          style={{ width: 60, height: 60 }}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "start" }}>
                      {e?.firstname} {e?.lastname}
                    </td>
                    <td
                      style={{
                        textAlign: "start",
                      }}
                    >
                      <span
                        style={{
                          color: COLOR_APP,
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {e?.userId}
                      </span>
                    </td>
                    <td style={{ textAlign: "start" }}>
                      <div>{e?.phone}</div>
                    </td>
                    <td style={{ textAlign: "start" }}>
                      {convertRole(e?.role)}
                    </td>
                    <td style={{ textAlign: "start" }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        {/* <Button>ແກ້ໄຂ</Button>
                        <Button>ລັອກ</Button> */}
                        <Button
                          onClick={() => {
                            setSelectUser(e);
                            setPopup({ PopUpConfirmDeletion: true });
                          }}
                        >
                          {t("delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </table>
            )}
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
                <span className="glyphicon glyphicon-chevron-left">{`${t(
                  "previous"
                )}`}</span>
              }
              nextLabel={
                <span className="glyphicon glyphicon-chevron-right">{`${t(
                  "next"
                )}`}</span>
              }
              breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
              breakClassName={"break-me"}
              pageCount={totalPagination} // Replace with the actual number of pages
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={(e) => {
                console.log(e);
                setPagination(e?.selected + 1);
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
      </div>
      <PopUpConfirmDeletion
        open={popup?.PopUpConfirmDeletion}
        onClose={() => {
          setPopup();
          setSelectUser();
        }}
        onSubmit={handleDeleteUser}
      />
      <PopUpCreateUser
        open={popup?.PopUpCreateUser}
        permissionUsers={permissionUsers}
        onClose={() => {
          setPopup();
        }}
        callback={() => {
          getData();
        }}
      />
    </>
  );
}
