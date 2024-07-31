import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Card } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import Box from "../Box";
import { useStore } from "../../store";
import { FaAngleDoubleRight } from "react-icons/fa";
import { getBills } from "../../services/bill";
import moment from "moment";
import StatusComponent from "../StatusComponent";
import Axios from "axios";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { useTranslation } from "react-i18next";

export default function PopUpTranferTable({
  open,
  onClose,
  onSubmit,
  tableList,
}) {
  const { t } = useTranslation()
  // state

  const [FromBillData, setFromBillData] = useState();
  const [ToBillData, setToBillData] = useState();
  const [orderData, setOrderData] = useState();
  const [selectOrder, setSelectOrder] = useState([]);
  const [selectToBillId, setSelectToBillId] = useState();

  const [FormData, setFormData] = useState({
    storeId: "",
    fromBillId: "",
    toBillId: "",
    orderId: [],
  });

  const { storeDetail, selectedTable } = useStore();

  useEffect(() => {
    if (open) {
      getDataBill();
      if (!selectedTable?.billId) {
        onClose();
      }
    } else {
      setFromBillData();
      setFormData({
        storeId: storeDetail?._id,
        fromBillId: "",
        toBillId: "",
        orderId: [],
      });
    }
  }, [open, selectedTable, storeDetail]);
  // const handleSelectToBill = (billId) => {
  //   console.log(billId)
  //   if (!billId) return setSelectToTable("");
  //   const _bill = tableList.find((e) => e?._id === billId);
  //   setSelectToTable(_bill);
  // };

  const handleSelectOrder = (order) => {
    setFormData((prev) => {
      let orders = prev?.orderId || [];

      const findOrder = orders.find((e) => e?._id == order?._id);
      console.log("findOrder", findOrder);
      if (findOrder) {
        orders = orders.filter((e) => e?._id !== order?._id);
        console.log(orders);
        setFromBillData((prev) => {
          const orderId = prev?.orderId?.map((e) => {
            if (e._id === order?._id) {
              return { ...e, selectOrder: false };
            }
            return e;
          });
          return {
            ...prev,
            storeId: storeDetail?._id,
            fromBillId: selectedTable?.billId,
            orderId,
          };
        });
      } else {
        orders.push(order);
        setFromBillData((prev) => {
          const orderId = prev?.orderId?.map((e) => {
            if (e._id === order?._id) {
              return {
                ...e,
                selectOrder: true,
              };
            }
            return e;
          });
          return {
            ...prev,
            storeId: storeDetail?._id,
            fromBillId: selectedTable?.billId,
            orderId,
          };
        });
      }

      return {
        ...prev,
        storeId: storeDetail?._id,
        fromBillId: selectedTable?.billId,
        orderId: orders,
      };
    });
  };

  const getDataBill = async () => {
    if (selectedTable?.billId) {
      const _billsOld = await getBills(`?_id=${selectedTable?.billId}`);
      const _billIdOld = _billsOld?.[0];
      console.log(_billIdOld);
      setFromBillData(_billIdOld);
    }
  };
  const handleSubmit = async () => {
    try {
      const url = "/v4/transfer-order";
      const { TOKEN } = await getLocalData();
      await Axios.post(END_POINT_SEVER + url, FormData, { headers: TOKEN });
      onSubmit();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={open} onHide={onClose} keyboard={false} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{t('transfer_table')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{t('how_to_move')}</h5>
        <li>{t('chose_move_table')}</li>
        <li>{t('chose_move_order')}</li>
        <li>{t('approve_move_order')}</li>
        <br />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 10,
          }}
        >
          <Box>
            <select className="form-control" disabled>
              <option value="">{FromBillData?.tableId?.name}</option>
            </select>
            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {t('from_table')}: {FromBillData?.tableId?.name}
              </Card.Header>
              <Card.Body style={{ padding: 0 }}>
                <Table>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('order_name')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('time')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FromBillData?.orderId?.map((e, i) => (
                        <tr
                          key={i}
                          onClick={() => handleSelectOrder(e)}
                          style={{
                            backgroundColor: e?.selectOrder
                              ? COLOR_APP
                              : "#fff",
                          }}
                        >
                          <td>{i + 1}</td>
                          <td>
                            <div>
                              {e?.name}
                              <br />
                              <StatusComponent
                                status={e?.status}
                                style={{ display: "inline", fontSize: 12 }}
                              />
                            </div>
                          </td>
                          <td>{e?.quantity}</td>
                          <td>
                            {moment(e?.createdAt).format("DD/MM/YYYY LT")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Table>
              </Card.Body>
            </Card>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <FaAngleDoubleRight
              style={{
                width: 25,
                height: 25,
                color: COLOR_APP,
              }}
            />
            <FaAngleDoubleRight
              style={{
                width: 25,
                height: 25,
                color: COLOR_APP,
              }}
            />
            <FaAngleDoubleRight
              style={{
                width: 25,
                height: 25,
                color: COLOR_APP,
              }}
            />
          </Box>
          <Box>
            <select
              className="form-control"
              value={FormData?.toBillId || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, toBillId: e.target.value }))
              }
            >
              <option value="">{t('chose_table')}</option>
              {tableList?.map((item, index) => (
                <option
                  key={"talbe-" + index}
                  value={item?.billId}
                  disabled={
                    (FromBillData?.tableName === item?.tableName
                      ? true
                      : false) || !item?.billId
                  }
                >
                  ໂຕະ {item?.tableName}
                </option>
              ))}
            </select>
            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {t('move_to')}:{" "}
                {tableList.find((e) => e?.billId == FormData?.toBillId)?.tableName}
              </Card.Header>
              <Card.Body style={{ padding: 0 }}>
                <Table>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('move_order_name')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('time')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FormData?.orderId?.map((e, i) => (
                        <tr key={i} onClick={() => handleSelectOrder(e)}>
                          <td>{i + 1}</td>
                          <td>
                            <div>
                              {e?.name}
                              <br />
                              <StatusComponent
                                status={e?.status}
                                style={{ display: "inline", fontSize: 12 }}
                              />
                            </div>
                          </td>
                          <td>{e?.quantity}</td>
                          <td>
                            {moment(e?.createdAt).format("DD/MM/YYYY LT")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Table>
              </Card.Body>
            </Card>
          </Box>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          {t('approve_move_order')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
