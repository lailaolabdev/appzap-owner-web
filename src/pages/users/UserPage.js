import React, { useEffect, useState } from "react";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { Breadcrumb, Tab, Tabs, Pagination } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd, MdSettings } from "react-icons/md";
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
import PopUpUpdateUser from "../../components/popup/PopupUpdateUser";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { convertRole } from "../../helpers/convertRole";
import { useTranslation } from "react-i18next";
import { useStoreStore } from "../../zustand/storeStore";
import { Search, MoreHorizontal, Plus, Trash, Edit, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/DropdownMenu";

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
  const { profile } = useStore();

  // store
  const { storeDetail } = useStoreStore();
  const appzapStaff = "APPZAP_DEALER";

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

  const getRoleBadgeColor = (role) => {
    console.log({ role: role });
    switch (role.toLowerCase()) {
      case "appzap_counter":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "appzap_admin":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "appzap_dealer":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-green-100 text-green-800 hover:bg-green-100";
    }
  };

  return (
    <div className="m-8">
      <Card className="rounded-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("staff_report")}</CardTitle>
            </div>
            <Button
              onClick={() => setPopup({ PopUpCreateUser: true })}
              className="text-white font-semibold"
            >
              <Plus className="bg-color-app mr-2 h-4 w-4 text-white" />
              {t("add_list")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email or role..."
                className="p20"
                value={searchQuery}
                onChange={(staff) => setSearchQuery(staff.target.value)}
              />
            </div>
          </div> */}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-md">{t("no")}</TableHead>
                      {/* <TableHead>{t("image")}</TableHead> */}
                      <TableHead className="text-md">{t("name")}</TableHead>
                      <TableHead className="text-md">{t("tel")}</TableHead>
                      <TableHead className="text-md">{t("role")}</TableHead>
                      <TableHead className="text-right text-md">
                        {t("manage")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No staff members found
                        </TableCell>
                      </TableRow>
                    ) : (
                      userData.map((staff, i) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium text-md">
                            {(pagination - 1) * limitData + i + 1}
                          </TableCell>
                          <TableCell className="font-medium text-md">
                            {staff?.firstname} {staff?.lastname}
                          </TableCell>
                          <TableCell className="font-medium text-md">
                            {staff.phone}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getRoleBadgeColor(staff.role)}
                              variant="outline"
                            >
                              {staff?.role === appzapStaff
                                ? convertRole(
                                    staff?.permissionRoleId?.roleName
                                  ) || "---"
                                : convertRole(staff?.role)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              className="p-2 mr-2 bg-color-app "
                              onClick={() => {
                                setSelectUser(staff);
                                setPopup({ PopUpUpdateUser: true });
                              }}
                            >
                              <Edit className="h-4 w-4 text-muted-foreground text-white font-semibold" />
                            </Button>
                            <Button
                              className="p-2"
                              onClick={() => {
                                setSelectUser(staff);
                                setPopup({ PopUpConfirmDeletion: true });
                              }}
                            >
                              <Trash className="h-4 w-4 text-muted-foreground text-white font-semibold" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="w-full flex justify-center mt-4">
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
                  onPageChange={(staff) => {
                    console.log(staff);
                    setPagination(staff?.selected + 1);
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
            </>
          )}
        </CardContent>
      </Card>

      <PopUpConfirmDeletion
        open={popup?.PopUpConfirmDeletion}
        onClose={() => {
          setPopup();
          setSelectUser();
        }}
        onSubmit={handleDeleteUser}
      />
      <PopUpUpdateUser
        open={popup?.PopUpUpdateUser}
        onClose={() => {
          setPopup();
          setSelectUser(); // เพิ่มการเคลียร์ selectUser
        }}
        callback={() => {
          getData();
        }}
        userData={selectUser}
      />
      <PopUpCreateUser
        open={popup?.PopUpCreateUser}
        onClose={() => {
          setPopup();
        }}
        callback={() => {
          getData();
        }}
      />
    </div>

    // <>
    //   <div
    //     style={{
    //       padding: "20px 20px 80px 20px",
    //       maxHeight: "100vh",
    //       height: "100%",
    //       overflowY: "auto",
    //     }}
    //   >
    //     <Breadcrumb>
    //       <Breadcrumb.Item>{t("staff")}</Breadcrumb.Item>
    //       <Breadcrumb.Item active>{t("staff_setting")}</Breadcrumb.Item>
    //     </Breadcrumb>

    //     {/* <div style={{ display: "flex", gap: 10, padding: "10px 0" }}>
    //       <Form.Control
    //         style={{ maxWidth: 220 }}
    //         placeholder="ຄົ້ນຫາພະນັກງານ"
    //       />
    //       <Button variant="primary">ຄົ້ນຫາ</Button>
    //     </div> */}

    //     <Card border="primary" style={{ margin: 0 }}>
    //       <Card.Header
    //         style={{
    //           backgroundColor: COLOR_APP,
    //           color: "#fff",
    //           fontSize: 18,
    //           fontWeight: "bold",
    //           display: "flex",
    //           justifyContent: "space-between",
    //           alignItems: "center",
    //           padding: 10,
    //         }}
    //       >
    //         <span className="flex items-center gap-1">
    //           <IoPeople /> {t("staff_report")}
    //         </span>
    //         <div style={{ display: "flex", alignItems: "center" }}>
    //           <Button
    //             variant="dark"
    //             bg="dark"
    //             onClick={() => setPopup({ PopUpCreateUser: true })}
    //             className="flex items-center gap-1"
    //           >
    //             {t("add_list")}
    //           </Button>
    //         </div>
    //       </Card.Header>
    //       <Card.Body
    //         style={{
    //           overflowX: "auto",
    //         }}
    //       >
    //         {isLoading ? (
    //           <div
    //             style={{
    //               height: 300,
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //           >
    //             <Spinner animation="border" variant="danger" />
    //           </div>
    //         ) : (
    //           <table style={{ width: "100%" }}>
    //             <tr>
    //               <th>#</th>
    //               <th
    //                 style={{
    //                   textWrap: "nowrap",
    //                 }}
    //               >
    //                 {t("image")}
    //               </th>
    //               <th
    //                 style={{
    //                   textWrap: "nowrap",
    //                 }}
    //               >
    //                 {t("name")}
    //               </th>
    //               <th
    //                 style={{
    //                   textWrap: "nowrap",
    //                 }}
    //               >
    //                 {t("user_name")}
    //               </th>
    //               <th
    //                 style={{
    //                   textWrap: "nowrap",
    //                 }}
    //               >
    //                 {t("tel")}
    //               </th>
    //               <th
    //                 style={{
    //                   textWrap: "nowrap",
    //                 }}
    //               >
    //                 {t("permision")}
    //               </th>
    //               <th
    //                 style={{
    //                   textWrap: "nowrap",
    //                 }}
    //               >
    //                 {t("manage")}
    //               </th>
    //             </tr>
    //             {userData?.map((staff, i) => (
    //               <tr>
    //                 <td style={{ textAlign: "start" }}>
    //                   {(pagination - 1) * limitData + i + 1}
    //                 </td>
    //                 <td style={{ textAlign: "start" }}>
    //                   <div>
    //                     <img
    //                       src="/images/profile.png"
    //                       alt=""
    //                       style={{ width: 60, height: 60 }}
    //                     />
    //                   </div>
    //                 </td>
    //                 <td style={{ textAlign: "start" }}>
    //                   {staff?.firstname} {staff?.lastname}
    //                 </td>
    //                 <td
    //                   style={{
    //                     textAlign: "start",
    //                   }}
    //                 >
    //                   <span
    //                     style={{
    //                       color: COLOR_APP,
    //                       textDecoration: "underline",
    //                       cursor: "pointer",
    //                     }}
    //                   >
    //                     {staff?.userId}
    //                   </span>
    //                 </td>
    //                 <td style={{ textAlign: "start" }}>
    //                   <div>{staff?.phone}</div>
    //                 </td>
    //                 <td style={{ textAlign: "start" }}>
    //                   {staff?.role === appzapStaff
    //                     ? convertRole(staff?.permissionRoleId?.roleName) || "---"
    //                     : convertRole(staff?.role)}
    //                 </td>
    //                 <td style={{ textAlign: "start" }}>
    //                   <div style={{ display: "flex", gap: 10 }}>
    //                     {/* <Button>ລັອກ</Button> */}
    //                     <Button
    //                       onClick={() => {
    //                         setSelectUser(staff);
    //                         setPopup({ PopUpUpdateUser: true });
    //                       }}
    //                     >
    //                       {t("edit")}
    //                     </Button>
    //                     <Button
    //                       onClick={() => {
    //                         setSelectUser(staff);
    //                         setPopup({ PopUpConfirmDeletion: true });
    //                       }}
    //                     >
    //                       {t("remove")}
    //                     </Button>
    //                   </div>
    //                 </td>
    //               </tr>
    //             ))}
    //           </table>
    //         )}
    //       </Card.Body>
    //       <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "center",
    //           width: "100%",
    //           bottom: 20,
    //         }}
    //       >
    //         <ReactPaginate
    //           previousLabel={
    //             <span className="glyphicon glyphicon-chevron-left">{`${t(
    //               "previous"
    //             )}`}</span>
    //           }
    //           nextLabel={
    //             <span className="glyphicon glyphicon-chevron-right">{`${t(
    //               "next"
    //             )}`}</span>
    //           }
    //           breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
    //           breakClassName={"break-me"}
    //           pageCount={totalPagination} // Replace with the actual number of pages
    //           marginPagesDisplayed={1}
    //           pageRangeDisplayed={3}
    //           onPageChange={(staff) => {
    //             console.log(staff);
    //             setPagination(staff?.selected + 1);
    //           }}
    //           containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
    //           pageClassName={"page-item"}
    //           pageLinkClassName={"page-link"}
    //           activeClassName={"active"}
    //           previousClassName={"page-item"}
    //           nextClassName={"page-item"}
    //           previousLinkClassName={"page-link"}
    //           nextLinkClassName={"page-link"}
    //         />
    //       </div>
    //     </Card>
    //   </div>

    // </>
  );
}
