import React from 'react';
import moment from "moment";

export class BillForChef
 extends React.PureComponent {
    render() {
        let selectedMenu = this.props.selectedMenu;
        let code = this.props.code;
        return (
            <div className="col-12 center">
                {selectedMenu?.map((item, index) => {
                    return (
                        <div style={{ paddingLeft: 20, paddingRight: 20, color: "#000000", fontSize: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p>ຊື່ເມນູ : {item?.name}</p>
                                <p>ເລກໂຕະ : {code}</p>
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
        );
    }
}