import React,{ useState} from 'react'
import useReactRouter from "use-react-router";
import { COLOR_APP } from '../../constants'
import { useStore } from "../../store";

export default function SettingTable() {
    const { history, location, match } = useReactRouter();

    const {
        tableList,
    } = useStore();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log("tableList===>", tableList[0]?.status)
    return (
        <div style={{ padding: 15 }} className="col-sm-12">
            <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
                <div className="col-sm-12 text-right">
                    <button className="col-sm-2" style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0,padding: 10}} onClick={handleShow}>ເພີ່ມໂຕະ</button>{' '}
                </div>
                <div style={{ height: 20 }}></div>
                <div>
                    <div className="col-sm-12">
                        <table className="table table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ເລກໂຕະ</th>
                                    <th scope="col">ລະຫັດໂຕະ</th>
                                    <th scope="col">ການເປີດ/ປິດ</th>
                                    <th scope="col">ມີແຂກເຂົ້າແລ້ວ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableList?.map((table, index) => {
                                    return (
                                        <tr >
                                            <td>{index + 1}</td>
                                            <td>ໂຕະ {table?.table_id}</td>
                                            <td>{table?.code}</td>
                                            <td style={{ color: table?.status === true ? "green" : ""}}>{table?.status === true ? "ເປີດໃຫ້ບໍລິການ" :"ປິດໃຫ້ບໍລິການ"}</td>
                                            <td style={{ color: table?.isOpened === true ? "green" : "red" }}>{table?.isOpened === true ? "ມີແລ້ວ" : "ຍັງບໍ່ມີແລ້ວ"}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
