import React from 'react'
import moment from "moment";
export class BillForChef extends React.PureComponent {
    render() {
        let newData = this.props.newData;
        return (
            <div className="col-12 center">
                {newData?.map((item, index) => {
                    return (
                        <div style={{ paddingLeft: 20, paddingRight: 20, color: "#000000", fontSize: 18 }}>
                            <table style={{ width: '40%', fontSize: "18px", color: "#000000" }}>
                                <tr style={{ fontSize: "20px", color: "#000000" }}>
                                    <td>ຊື່ເມນູ : {item?.name}</td>
                                    <td>ເວລາ : {moment(item?.createdAt).format("HH:mm")}</td>
                                </tr>
                                <tr style={{ fontSize: "20px", color: "#000000" }}>
                                    <td>ຈຳນວນ :  {item?.quantity}</td>
                                    <td>ລະຫັດ :  {item?.orderId?.table_id}</td>
                                </tr>
                                <tr style={{ fontSize: "20px", color: "#000000" }}>
                                    <td>ຄອມເມັ້ນ : {item?.note}</td>
                                </tr>
                            </table>
                            <hr style={{
                                color: "#000000",
                                height: 2,
                                borderTop: "solid 5px #000000"
                            }} />
                        </div>
                    )
                }
                )}
            </div>
        )
    }
}
