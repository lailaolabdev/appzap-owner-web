import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Table, Modal, Button } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { _statusCheckBill, orderStatus } from './../../helpers';

export default function DashboardFinance({ startDate, endDate }) {
  const { history, match } = useReactRouter()
  const [data, setData] = useState();
  const [disCountDataKib, setDisCountDataKib] = useState(0)
  const [disCountDataPercent, setDisCountDataPercent] = useState(0)
  const [dataNotCheckBill, setDataNotCheckBill] = useState({})
  const [dataCheckBill, setDataCheckBill] = useState({})
  const [moneyCash, setMoneyCash] = useState(0)
  const [moneyAon, setMoneyAon] = useState(0)
  const [show, setShow] = useState(false);
  const [dataModale, setDataModale] = useState([])
  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setShow(true)
    setDataModale(item)
  };
  useEffect(() => {
    _fetchFinanceData()
  }, [])
  useEffect(() => {
    _fetchFinanceData()
  }, [endDate, startDate])
  const _fetchFinanceData = async () => {
    const getDataDashBoard = await axios
      .get(END_POINT_SEVER + "/v3/dashboard/" + match?.params?.storeId + "/startTime/" + startDate + "/endTime/" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
  }
  useEffect(() => {
    let _disCountDataKib = 0;
    let _disCountDataAon = 0;
    let _cash = 0;
    let _aon = 0;
    let _notCheckBill = {
      total: 0,
      amount: 0,
      discountCash: 0,
      discountPercent: 0,
    }
    let _checkBill = {
      total: 0,
      amount: 0,
      discountCash: 0,
      discountPercent: 0,
      cash: 0,
      transfer: 0,
    }
    if (data?.checkOut?.length > 0) {
      for (let i = 0; i < data?.checkOut.length; i++) {
        if (["CALLTOCHECKOUT", "ACTIVE"].includes(data?.checkOut[i]?.status)) {
          _notCheckBill.total += 1
          if (data?.checkOut[i]?.discountType === "LAK") _notCheckBill.discountCash += data?.checkOut[i]?.discount
          if (data?.checkOut[i]?.discountType !== "LAK") _notCheckBill.discountPercent += data?.checkOut[i]?.discount
          _notCheckBill.amount += _countAmount(data?.checkOut[i]?.orderId)
        }
        if (["CHECKOUT"].includes(data?.checkOut[i]?.status)) {
          _checkBill.total += 1
          if (data?.checkOut[i]?.discountType === "LAK") _checkBill.discountCash += data?.checkOut[i]?.discount
          if (data?.checkOut[i]?.discountType !== "LAK") _checkBill.discountPercent += data?.checkOut[i]?.discount
          _checkBill.amount += _countAmount(data?.checkOut[i]?.orderId)
          if (data?.checkOut[i]?.discountType === "LAK") _checkBill.cash += data?.checkOut[i]?.discount
          if (data?.checkOut[i]?.discountType !== "LAK") _checkBill.transfer += data?.checkOut[i]?.discount
        }
        if (data?.checkOut[i]?.discountType === "LAK") _disCountDataKib += data?.checkOut[i]?.discount
        if (data?.checkOut[i]?.discountType !== "LAK") _disCountDataAon += data?.checkOut[i]?.discount
        if (data?.checkOut[i]?.paymentMethod === "CASH") _cash += data?.checkOut[i]?.billAmount
        if (data?.checkOut[i]?.paymentMethod !== "CASH") _aon += data?.checkOut[i]?.billAmount
      }
    }
    setDataCheckBill(_checkBill)
    setDataNotCheckBill(_notCheckBill)
    setMoneyAon(_aon)
    setMoneyCash(_cash)
    setDisCountDataKib(_disCountDataKib)
    setDisCountDataPercent(_disCountDataAon)
  }, [data])

  const _countOrder = (item) => {
    let _countOrderCancel = 0
    let _countOrderSuccess = 0
    if (item?.length > 0) {
      for (let i = 0; i < item.length; i++) {
        if (item[i]?.status === "SERVED") _countOrderSuccess += item[i]?.quantity
        if (item[i]?.status === "CANCELED") _countOrderCancel += item[i]?.quantity
      }
    }
    return { _countOrderSuccess, _countOrderCancel }
  }
  const _countAmount = (item) => {
    let _amount = 0
    if (item?.length > 0) {
      for (let i = 0; i < item.length; i++) {
        _amount += (item[i]?.price * item[i]?.quantity)
      }
    }
    return _amount
  }
  return (
    <div style={{ padding: 0 }}>
      <div className="row">
        <div style={{ width: '100%' }}>
          <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "row" }}>
            <div style={{ border: "solid 1px #FB6E3B", padding: 15, borderRadius: 8 }}>
              <div style={{ textAlign: "center" }}>
                <p>ຍອດທັ້ງໝົດ</p>
                <hr />
              </div>
              <div>ຈຳນວນບີນ : {data?.checkOut?.length} ບີນ</div>
              <div>ຍອດທັ້ງໝົດ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(data?.amount + dataNotCheckBill?.amount)} ກີບ</div>
              <div>ສ່ວນຫຼຸດເປັນເງີນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(disCountDataKib)} ກີບ</div>
              <div>ສ່ວນຫຼຸດເປັນເປີເຊັນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(disCountDataPercent)} %</div>
              <div>ຈ່າຍເງີນສົດ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(moneyCash)} ກີບ</div>
              <div>ຈ່າຍເງີນໂອນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(moneyAon)} ກີບ</div>
            </div>
            <div style={{ border: "solid 1px #FB6E3B", padding: 15, borderRadius: 8 }}>
              <div style={{ textAlign: "center" }}>
                <p>ຍອດບີນທີສຳເລັດ</p>
                <hr />
              </div>
              <div>ຈຳນວນບີນ : {dataCheckBill?.total} ບີນ</div>
              <div>ຍອດທັ້ງໝົດ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(dataCheckBill?.amount)} ກີບ</div>
              <div>ສ່ວນຫຼຸດເປັນເງີນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(dataCheckBill?.discountCash)} ກີບ</div>
              <div>ສ່ວນຫຼຸດເປັນເປີເຊັນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(dataCheckBill?.discountPercent)} %</div>
              <div>ຈ່າຍເງີນສົດ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(dataCheckBill?.cash)} ກີບ</div>
              <div>ຈ່າຍເງີນໂອນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(dataCheckBill?.transfer)} ກີບ</div>
            </div>
            <div style={{ border: "solid 1px #FB6E3B", padding: 15, borderRadius: 8 }}>
              <div style={{ textAlign: "center" }}>
                <p>ຍອດບີນທີຍັງຄ້າງ</p>
                <hr />
              </div>
              <div>ຈຳນວນບີນ : {dataNotCheckBill?.total} ບີນ</div>
              <div>ຍອດທັ້ງໝົດ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(dataNotCheckBill?.amount)} ກີບ</div>
              <div>ສ່ວນຫຼຸດເປັນເງີນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(dataNotCheckBill?.discountCash)} ກີບ</div>
              <div>ສ່ວນຫຼຸດເປັນເປີເຊັນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(dataNotCheckBill?.discountPercent)} %</div>
            </div>
          </div>
          <div style={{ height: 10 }}></div>
          <Table striped hover size="sm" style={{ fontSize: 15 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>ໂຕະ</th>
                <th>ເລກໂຕະ</th>
                <th>ສວ່ນຫຼຸດ</th>
                <th>ລາຄາ / ບີນ</th>
                <th>ເສີບແລ້ວ / ຍົກເລີກ</th>
                <th>ສະຖານະຂອງໂຕະ</th>
                <th>ສະຖານະຂອງເງີນ</th>
                <th>ເວລາ</th>
              </tr>
            </thead>
            <tbody>
              {data?.checkOut?.map((item, index) =>
                <tr key={"finance-" + index} onClick={() => handleShow(item?.orderId)} style={{ backgroundColor: ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status) ? "#0093b8" : "" }}>
                  <td>{index + 1}</td>
                  <td>{item?.tableId?.name ?? "-"}</td>
                  <td>{item?.code}</td>
                  <td>{item?.discountType === "LAK" ? new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.discount) + "ກີບ" : item?.discount + "%"}</td>
                  <td>{["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status) ? new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(_countAmount(item?.orderId)) : new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.billAmount)} ກີບ</td>
                  <td >
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
                      <p style={{ marginLeft: 5 }}>{_countOrder(item?.orderId)?._countOrderSuccess} </p>
                      <p style={{ marginLeft: 5 }}> / </p>
                      <p style={{ color: _countOrder(item?.orderId)?._countOrderCancel > 0 ? "red" : "", marginLeft: 5 }}> {_countOrder(item?.orderId)?._countOrderCancel}</p>
                    </div>
                  </td>
                  <td style={{
                    color:
                      item?.status === "CHECKOUT" ? "green" :
                        item?.status === "CALLTOCHECKOUT" ? "red" :
                          item?.status === "ACTIVE" ? "#00496e" : ""
                  }}>{_statusCheckBill(item?.status)}</td>
                  <td style={{
                    color:
                      item?.paymentMethod === "CASH" ? "#00496e" : "#fc8626"
                  }}>{item?.paymentMethod === "CASH" ? "ຈ່າຍເງີນສົດ" : item?.paymentMethod === "BCEL" ? "ຈ່າຍເງີນໂອນ" : "-"}</td>
                  <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div style={{ width: '50%', padding: 20 }}>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ລາຍການອາຫານ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover size="sm" style={{ fontSize: 15 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>ຊື່ເມນູ</th>
                <th>ຈຳນວນ</th>
                <th>ສະຖານະຂອງອາຫານ</th>
                <th>ລາຄາ</th>
                <th>ເວລາ</th>
              </tr>
            </thead>
            <tbody>
              {dataModale?.map((item, index) =>
                <tr key={1 + index}>
                  <td>{index + 1}</td>
                  <td>{item?.name ?? "-"}</td>
                  <td>{item?.quantity}</td>
                  <td style={{
                    color:
                      item?.status === "WAITING" ? "#2d00a8" :
                        item?.status === "DOING" ? "#c48a02" :
                          item?.status === "SERVED" ? "green" :
                            item?.status === "CART" ? "#00496e" :
                              item?.status === "FEEDBACK" ? "#00496e" : "#bd0d00"
                  }}>{orderStatus(item?.status)}</td>
                  <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.price)}</td>
                  <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            ປິດ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
