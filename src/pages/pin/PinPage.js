import React, { useEffect, useState } from "react";
import { COLOR_APP, COLOR_APP_CANCEL, END_POINT } from "../../constants";
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
import { getStore, updateStorePin } from "../../services/store";
import { useTranslation } from "react-i18next";
import {useStoreStore} from "../../zustand/storeStore"

let limitData = 10;

export default function PinPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // state
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(0);
  const [PINs, setPINs] = useState();

  // zustand state store
  const {
    storeDetail, 
    fetchStoreDetail,
    updateStoreDetail} = useStoreStore()

  // store
  const { setStoreDetail } = useStore();

  // useEffect
  useEffect(() => {
    getPIN();
  }, []);
  const getPIN = async () => {
    try {
      setIsLoading(true);
      const { DATA, TOKEN } = await getLocalData();
      const url = `${END_POINT}/v4/pin/get-many`;
      const res = await Axios.get(url, {
        headers: TOKEN,
      });
      setPINs(res.data);
      setIsLoading(false);
      return res.data;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return { error: true };
    }
  };

  const handleRandomPassword = async () => {
    try {
      setIsLoading(true);
      const { DATA, TOKEN } = await getLocalData();
      const url = `${END_POINT}/v4/pin/random`;
      const res = await Axios.post(url, null, {
        headers: TOKEN,
      });
      getPIN();
      return res.data;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return { error: true };
    }
  };

  return (
    <>
      <div
        style={{
          maxHeight: "100vh",
          height: "100%",
          overflowY: "auto",
          padding: "20px 20px 80px 20px",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("setting_prod_code")}</Breadcrumb.Item>
        </Breadcrumb>
        {/* <div style={{ display: "flex", gap: 10, padding: "10px 0" }}>
          <Form.Control
            style={{ maxWidth: 220 }}
            placeholder="ຄົ້ນຫາພະນັກງານ"
          />
          <Button variant="primary">ຄົ້ນຫາ</Button>
        </div> */}

        <Card border="primary" style={{ margin: 0, marginBottom: 10 }}>
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
              <IoPeople /> {t("setting_prod_code")}
            </span>
          </Card.Header>
          <Card.Body>
            {[
              {
                title: `${t("enable_pin")}`,
                key: "pin",
                default: false,
                disabled: true,
              },
            ].map((item, index) => (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: `1px dotted ${COLOR_APP}`,
                }}
                key={index}
              >
                <div>{item?.title}</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  <Form.Label htmlFor={"switch-audio-" + item?.key}>
                    {storeDetail?.usePin ? `${t("oppen")}` : `${t("close")}`}
                  </Form.Label>
                  <Form.Check
                    type="switch"
                    checked={storeDetail?.usePin}
                    id={"switch-audio-" + item?.key}
                    onChange={(e) => {
                      const _run = async () => {
                        await updateStorePin(e.target.checked);
                        //zustand store
                        const data = await fetchStoreDetail(storeDetail?._id)
                        setStoreDetail(data);
                        // const data = await getStore(storeDetail?._id);
                        
                      };
                      _run();
                    }}
                  />
                </div>
              </div>
            ))}
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
            <span>
              <IoPeople /> {t("code_list")}
            </span>
            <Button
              variant="dark"
              bg="dark"
              onClick={() => {
                handleRandomPassword();
              }}
            >
              <MdAssignmentAdd /> {t("change_code")}
            </Button>
          </Card.Header>
          <Card.Body>
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
                  <th>{t("pin_code")}</th>
                </tr>
                {PINs?.map((e, i) => (
                  <tr>
                    <td style={{ textAlign: "start" }}>
                      {(pagination - 1) * limitData + i + 1}
                    </td>
                    <td style={{ textAlign: "start" }}>{e?.pin}</td>
                  </tr>
                ))}
              </table>
            )}
          </Card.Body>
          {/* <div
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
          </div> */}
        </Card>
      </div>
    </>
  );
}
