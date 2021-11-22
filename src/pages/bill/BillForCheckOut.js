import React, { useState } from 'react'
import moment from "moment";
import { moneyCurrency } from "../../helpers"
import { URL_PHOTO_AW3 } from '../../constants'
import { Image } from "react-bootstrap";
import profileImage from "../../image/profile.png"

export class BillForCheckOut extends React.PureComponent {
    render() {
        let newData = this.props.newData;
        let dataStore = this.props.dataStore;
        let data = 0
        if (newData) {
            for (let i = 0; i < newData.length; i++) {
                data += (newData[i]?.price * newData[i]?.quantity)
            }
        }
        return (
            <div className="col-12 center">
                <div>
                    {dataStore?.image ? (
                        <center>
                            <Image src={URL_PHOTO_AW3 + dataStore?.image} alt="" width="150" height="150" style={{
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
                    <center>
                    <h3 style={{ fontWeight: "bold", fontSize: 20, padding: 10 }}> {dataStore?.name ? dataStore?.name : "-"}</h3>
                        <h3 style={{ padding: 5 }}>ເປີດບໍລິການ</h3>
                        <h3 style={{ padding: 5 }}>{dataStore?.dateClose + "  " + dataStore?.timeClose}</h3>
                        <h3 className="col-5">{dataStore?.detail ? dataStore?.detail : "-"}</h3>
                    </center>
                </div>
                <hr />
                <div className="col-sm-7">
                    <div>
                        <h3 className="col-5">ເບີໂທ : {dataStore?.phone ? dataStore?.phone : "-"}</h3>
                        <h3 className="col-5">whatsapp : {dataStore?.whatsapp ? dataStore?.whatsapp : "-"}</h3>
                    </div>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 30, paddingRight: 30}}>
                    <div>
                        <h3>ເລກຕູບ : {newData[0]?.orderId?.table_id}</h3>
                        <h3>ລະຫັດ : {newData[0]?.code}</h3>
                    </div>
                    <h3>ວັນທີ : {moment(newData[0]?.createdAt).format("DD/mm/YYYY")}</h3>
                </div>
                <table class="table">
                    <tbody>
                        {newData?.map((item, index) => {
                            return (
                                <tr>
                                    <th>{index + 1}</th>
                                    <td>{item?.name}</td>
                                    <td>{item?.quantity}</td>
                                    <td>{moneyCurrency(item?.price)}</td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>
                <hr />
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <h3>ລວມເປັນເງີນທັ້ງໝົດ : {moneyCurrency(data)}</h3>
                </div>
                <hr />
            </div>
        )
    }
}
