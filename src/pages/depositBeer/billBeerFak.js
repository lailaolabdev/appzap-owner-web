import React from "react";
import { Image } from "react-bootstrap";
import { STATUS_BEERFAK, formatDateDay } from "../../helpers";

export class ComponentToPrintBill extends React.PureComponent {
    render() {
        let _data = this?.props?.data;
        console.log("🚀 ~ file: billBeerFak.js:7 ~ ComponentToPrintBill ~ render ~ _data:", _data)
        return (
            <div
                style={{
                    color: "#000000",
                    width: "100%",
                    fontSize: 45,
                    fontWeight: "bold",
                    padding:40
                }}
            >
                <p>ເລກທີບີນຝາກ : {_data?.billCode}</p>
                <p>ຊື່ລູກຄ້າ : {_data?.customerName}</p>
                <p>
                    ວັນທີຝາກເບຍ {formatDateDay(_data?.startDate)}: ,
                    ກຳນົດຝາກ : {formatDateDay(_data?.endDate)}
                </p>
                <p>ສະຖານະ : {STATUS_BEERFAK(_data?.status)}</p>
                <p>ຈຳນວນເມນູທັ້ງໝົດ : {_data?.menu?.length}</p>
                <table className='table' striped bordered hover>
                    <thead className='thead-dark' style={{ textAlign: "center" }}>
                        <tr>
                            <th>#</th>
                            <th>ຊື່ສີນຄ້າ</th>
                            <th>ຈຳນວນ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_data?.menu?.map((item, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item?.name}</td>
                                <td>{item?.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
