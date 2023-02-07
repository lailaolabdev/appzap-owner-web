import React from "react";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Image } from "react-bootstrap";
import profileImage from "../../../image/profile.png";

/**
 * const
 **/
import {
    URL_PHOTO_AW3,
} from "../../../constants/index";
import { t } from 'i18next';

export class ComponentToPrintBillInTable extends React.PureComponent {
    render() {
        let newData = this.props.newData;
        let tableId = this.props.tableId;
        let generateCode = this.props.generateCode;
        let firstname = this.props.firstname;
        let userData = this.props.userData;
        let amount = 0;
        return (
          <div> <div> <div>
            <div className="center" style={{ width: '100%', fontSize: 42 }}>
                <div style={{ textAlign: "center", paddingTop: 30 }}>
                    <Col>
                        {userData?.image ? (
                            <center>
                                <Image src={URL_PHOTO_AW3 + userData?.image} alt="" width="150" height="150" style={{
                                    height: 200,
                                    width: 200,
                                    borderRadius: '50%',
                                }} />
                            </center>
                        ) : (<center>
                            <Image src={profileImage} alt="" width="150" height="150" style={{
                                height: 200,
                                width: 200,
                                borderRadius: '50%',
                            }} />
                        </center>)}
                        <div style={{ height: 30 }}></div>
                        <p style={{ fontWeight: "bold" }}>ຮ້ານທົ່ງສາງທອງ</p>
                        <p style={{ fontWeight: "bold" }}>  ຍີນດີຕ້ອນຮັບ  </p>
                    </Col>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <div className="row col-sm-12 text-center">
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ໂຕະ : {tableId} </div>
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ເລກອໍເດີ : {generateCode} </div>
                        </div>
                        <div className="row col-sm-12 text-center">
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ຊື່ຜູ້ສັ່ງ : {firstname}</div>
                            <div className="col-sm-6" style={{ fontWeight: "bold" }}>ວັນທີ : {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <Col xs={12}>
                        <Table responsive className="table" id='printMe' style={{ fontSize: 42 }}>
                            <thead style={{ backgroundColor: "#F1F1F1" }}>
                                <tr>
                                    <th>ຊື່ຜູ້ສັ່ງ</th>
                                    <th>ຊື່ເມນູ</th>
                                    <th>ຈຳນວນ</th>
                                    <th>ລາຄາ</th>
                                    <th>ລະຫັດ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newData?.map((item, lindex) => {
                                    amount = amount + (item?.price * item?.quantity);
                                    return (
                                        <tr key={"order"+lindex}>
                                            <td><b>{item?.orderId?.customer_nickname}</b></td>
                                            <td><b>{item?.name}</b></td>
                                            <td>{item?.quantity}</td>
                                            <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.price * item?.quantity)} ກີບ</b></td>
                                            <td>{item?.orderId?.table_id}</td>
                                        </tr>
                                    )
                                }
                                )}
                                <tr>
                                    <td colSpan={2} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>{t('totalPrice2')} : </td>

                                    <td colSpan={2} style={{ color: "blue" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(amount)} .ກີບ</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </div>
            </div>
            <div className="row col-sm-12 text-center">
              <div className="col-sm-6" style={{ fontWeight: "bold" }}>
                ຊື່ຜູ້ສັ່ງ : {firstname}
              </div>
              <div className="col-sm-6" style={{ fontWeight: "bold" }}>
                ວັນທີ : {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        <div>
          <Col xs={12}>
            <Table
              responsive
              className="table"
              id="printMe"
              style={{ fontSize: 42 }}
            >
              <thead style={{ backgroundColor: "#F1F1F1" }}>
                <tr>
                  <th>ຊື່ຜູ້ສັ່ງ</th>
                  <th>ຊື່ເມນູ</th>
                  <th>ຈຳນວນ</th>
                  <th>ລາຄາ</th>
                  <th>ລະຫັດ</th>
                </tr>
              </thead>
              <tbody>
                {newData?.map((item, lindex) => {
                  amount = amount + item?.price * item?.quantity;
                  return (
                    <tr key={"order" + lindex}>
                      <td>
                        <b>{item?.orderId?.customer_nickname}</b>
                      </td>
                      <td>
                        <b>{item?.name}</b>
                      </td>
                      <td>{item?.quantity}</td>
                      <td style={{ color: "green" }}>
                        <b>
                          {new Intl.NumberFormat("ja-JP", {
                            currency: "JPY",
                          }).format(item?.price * item?.quantity)}{" "}
                          ກີບ
                        </b>
                      </td>
                      <td>{item?.orderId?.table_id}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    ຍອດລວມເງິນ :{" "}
                  </td>

                  <td colSpan={2} style={{ color: "blue" }}>
                    {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                      amount
                    )}{" "}
                    .ກີບ
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </div>
      </div>
    );
  }
}
