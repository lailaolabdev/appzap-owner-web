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
        let newDataItem = []
        if (newData?.orderId?.length > 0) {
            for (let i = 0; i < newData?.orderId.length; i++) {
                if (newData?.orderId[i]?.status === "SERVED") {
                    newDataItem.push(newData?.orderId[i])
                    data += (newData?.orderId[i]?.quantity * newData?.orderId[i]?.price )
                }
            }
        }
        console.log("newData===>", newData)
        return (
            <div>
                <table style={{ width: '40%', textAlign: 'center', fontSize: "18px", color: "#000000", display: "flex", justifyContent: "center" }}>
                    <tr style={{ textAlign: "center" }}>
                        {dataStore?.image ? (
                            <div style={{ textAlign: 'center', fontSize: "18px", color: "#000000" }}>
                                <Image src={URL_PHOTO_AW3 + dataStore?.image} alt="" width="150" height="150" style={{
                                    height: 200,
                                    width: 200,
                                    color: "#000000",
                                    fontSize: 18,
                                    borderRadius: '50%',
                                }} />
                            </div>
                        ) : (<div>
                            <Image src={profileImage} alt="" width="150" height="150" style={{
                                height: 200,
                                width: 200,
                                borderRadius: '50%',
                                textAlign: "center",

                                color: "#000000",
                                fontSize: 18
                            }} />
                        </div>)}
                    </tr>
                </table>
                <table style={{ textAlign: 'center', fontSize: "18px", color: "#000000" }}>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ fontSize: "15px", color: "#000000" }}>{dataStore?.name ? dataStore?.name : "-"} </th>
                    </tr>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ fontSize: "15px", color: "#000000" }}>ເປີດບໍລິການ </th>
                    </tr>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ fontSize: "15px", color: "#000000" }}>{dataStore?.dateClose + "  " + dataStore?.timeClose} </th>
                    </tr>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ fontSize: "15px", color: "#000000" }}>{dataStore?.detail ? dataStore?.detail : "-"} </th>
                    </tr>
                </table>
                <table style={{ width: '50%', fontSize: "18px", color: "#000000" }}>
                    <tr>
                        <th style={{ fontSize: "15px", color: "#000000" }}>ເບີໂທ :{dataStore?.phone ? dataStore?.phone : "-"} </th>
                    </tr>
                    <tr>
                        <th style={{ fontSize: "15px", color: "#000000" }}>whatsapp: {dataStore?.whatsapp ? dataStore?.whatsapp : "-"}</th>
                    </tr>
                    <tr>
                        <th>ໂຕະ :{newData?.orderId?.length > 0 ? newData?.orderId[0]?.tableId?.name:""} </th>
                    </tr>
                    <tr>
                        <th>ລະຫັດ: {newDataItem[0]?.code}</th>
                    </tr>
                    <tr>
                        <th>ຜູ້ຮັບຜິດຊອບ:   {newDataItem[0]?.updatedBy?.firstname && newDataItem[0]?.updatedBy?.lastname ? newDataItem[0]?.updatedBy?.firstname + " " + newDataItem[0]?.updatedBy?.lastname : ""}</th>
                    </tr>
                    <tr>
                        <th>ວັນທີ:  {moment(newDataItem[0]?.createdAt).format("DD/mm/YYYY")}</th>
                    </tr>
                </table>
                <hr style={{
                    color: "#000000",
                    height: 5,
                    borderTop: "solid 5px #000000"
                }} />
                <table style={{ width: '40%', fontSize: "18px", color: "#000000" }}>
                    <tr>
                        <th width="5%">ລຳດັບ</th>
                        <th width="15%">ຊື່ເມນູ</th>
                        <th width="5%">ຈຳນວນ</th>
                        <th width="6%">ລາຄາ</th>
                        <th width="6%">ລາຄາລວມ</th>
                    </tr>
                    {newDataItem?.map((item, index) => {
                        return (
                            <tr>
                                <th>{index + 1}</th>
                                <td>{item?.name}</td>
                                <td>{item?.quantity}</td>
                                <td>{moneyCurrency(item?.price)}</td>
                                <td>{moneyCurrency(item?.price * item?.quantity)}</td>
                            </tr>
                        )
                    }
                    )}
                </table>
                <hr style={{
                    color: "#000000",
                    height: 5,
                    borderTop: "solid 5px #000000"
                }} />
                <table style={{ width: '40%', fontSize: "18px", color: "#000000" }}>
                    <tr style={{ fontSize: "20px", color: "#000000" }}>
                        <th style={{ textAlign: "center" }} colspan="3">ລວມເປັນເງິນທັງໝົດ</th>
                        <th>{moneyCurrency(data)}</th>
                    </tr>
                    <tr style={{ fontSize: "20px", color: "#000000" }}>
                        <th style={{ textAlign: "center" }} colspan="3">ສ່ວນຫຼຸດ </th>
                        <th>{newData && newData?.discountType === "LAK" ? moneyCurrency(newData?.discount) + " " + "ກີບ" : newData?.discount + " " + "%"}</th>
                    </tr>
                    <tr style={{ fontSize: "20px", color: "#000000" }}>
                        <th style={{ textAlign: "center" }} colspan="3">ຕ້ອງຈ່າຍທັງໝົດ</th>
                        <th>{newData && newData?.discountType === "LAK" ? moneyCurrency(data - newData?.discount) : moneyCurrency(data - (data * newData?.discount) / 100)} ກີບ</th>
                    </tr>
                </table>
                <hr style={{
                    color: "#000000",
                    height: 5,
                    borderTop: "solid 5px #000000"
                }} />
                <table style={{ width: '40%', textAlign: "center", fontSize: "18px", color: "#000000" }}>
                    <tr style={{ fontSize: "20px", color: "#000000" }}>
                        <th>ຂອບໃຈທີ່ໃຊ້ບໍລິການ</th>
                    </tr>
                </table>
            </div>
        )
    }
}
