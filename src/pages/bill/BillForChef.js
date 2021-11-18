import React from 'react'
import moment from "moment";
export class BillForChef extends React.PureComponent {
    render() {
        let newData = this.props.newData;
        return (
            <div className="col-12 center">
                {newData?.map((item, index) => {
                    return (
                        <div style={{ paddingLeft: 20, paddingRight: 20,color:"#000000",fontSize:18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p>ຊື່ເມນູ : {item?.name}</p>
                                <p>ເລກໂຕະ : {item?.orderId?.table_id}</p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p>ຈຳນວນ : {item?.quantity}</p>
                                <p>ເວລາ : {moment(item?.createdAt).format("HH:mm")}</p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p>ຄອມເມັ້ນ : {item?.note}</p>
                            </div>
                            <hr />
                        </div>
                    )
                }
                )}
            </div>
        )
    }
}
