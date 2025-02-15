import { faListAlt, faPlusCircle, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Dropdown, Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaListCheck } from "react-icons/fa6";
import { ButtonComponent } from "../../components";
import { END_POINT_SERVER_SHOWSALES, END_POINT_SEVER, getLocalData } from "../../constants/api";
import { errorAdd, successAdd } from "../../helpers/sweetalert";

export default function HistoryBankTransferClaim({ data }) {
    const { t } = useTranslation();
    const [totalLogs, setTotalLogs] = useState(0);
    const [selctedType, setSelectedType] = useState("PAYMENT");
    const [selctedPayment, setSelectedPayment] = useState([]);
    const [claimData, setClaimData] = useState([]);
    const [page, setPage] = useState(0);
    const rowsPerPage = 100;
    const pageAll = totalLogs > 0 ? Math.ceil(totalLogs / rowsPerPage) : 1;
    useEffect(() => {
        getClaimData()
    }, []);

    const getClaimData = async () => {
        try {
            console.log("IAMWORK")
            const { DATA } = await getLocalData();
            const _res = await axios.get(`${END_POINT_SERVER_SHOWSALES}/v5/claim-payments?storeId=${DATA?.storeId}`);
            // setTaxPercent(_res?.data?.taxPercent);
            console.log(_res?.data)
            setClaimData(_res?.data?.data)
        } catch (err) {
            console.log(err)
        }

    };

    const selectPayment = (payment) => {
        let _selctedPayment = [...selctedPayment];
        let _index = _selctedPayment.findIndex((x) => x._id == payment._id)
        if (_index === -1) {
            // If not found, add the payment record
            _selctedPayment.push(payment);
        } else {
            // If found, remove the payment record
            _selctedPayment.splice(_index, 1);
        }
        setSelectedPayment(_selctedPayment);
    }

    const checkPaymentSelected = (payment) => {
        let _index = selctedPayment.findIndex((x) => x._id == payment._id)
        return _index >= 0;
    }

    const claimSelectedPayment = async () => {
        try {

            console.log("claimSelectedPayment")
            let _selctedPayment = [...selctedPayment];

            let _billIds = _selctedPayment.map((x) => {
                return x['_id']
            })

            const { DATA } = await getLocalData();
            const _res = await axios.post(
                END_POINT_SERVER_SHOWSALES + "/v5/claim-payment/create",
                {
                    storeId: DATA?.storeId,
                    billIds: _billIds
                }
            );
            console.log(_res)
            successAdd(`ສ້າງເຄລມສຳເລັດ`);
        } catch (err) {
            console.log(err)
            errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃຫມ່`);
        }

    }
    const claimAllPayment = async() => {
        console.log("claimAllPayment")
        try {
            const { DATA } = await getLocalData();
            const _res = await axios.post(
                END_POINT_SERVER_SHOWSALES + "/v5/claim-payment/create-all",
                {
                    storeId: DATA?.storeId,
                }
            );
            console.log(_res)
            successAdd(`ສ້າງເຄລມທັງຫມົດສຳເລັດ`);
        } catch (err) {
            console.log(err)
            errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃຫມ່`);
        }

    }

    return <div>
        <Nav
            fill
            variant="tabs"
            defaultActiveKey="/checkBill"
            style={{
                fontWeight: "bold",
                backgroundColor: "#f8f8f8",
                border: "none",
                marginBottom: 5,
                overflowX: "scroll",
                display: "flex",
            }}
        >
            <Nav.Item>
                <Nav.Link
                    style={{
                        color: "#FB6E3B",
                        border: "none",
                        height: 60,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onClick={() => setSelectedType("PAYMENT")}
                >
                    <FontAwesomeIcon icon={faListAlt} /> <div style={{ width: 8 }}></div>{" "}
                    ລາຍການຊຳລະ
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    style={{
                        color: "#FB6E3B",
                        border: "none",
                        height: 60,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onClick={() => setSelectedType("CLAIM")}
                >
                    <FontAwesomeIcon icon={faTable} /> <div style={{ width: 8 }}></div>{" "}
                    ລາຍການເຄລມເງິນ
                </Nav.Link>
            </Nav.Item>
        </Nav>
        {selctedType == "PAYMENT" && <div>
            <div style={{ height: 10 }}></div>
            <div>
                <div className="flex justify-end flex-wrap gap-3">
                    {selctedPayment.length > 0 && <ButtonComponent
                        title={"ເຄລມຕາມເລືອກ"}
                        icon={faPlusCircle}
                        colorbg={"#f97316"}
                        // hoverbg={"orange"}
                        width={"150px"}
                        handleClick={() => claimSelectedPayment()}
                    />}
                    <ButtonComponent
                        title={"ເຄລມທັງຫມົດ"}
                        icon={faPlusCircle}
                        colorbg={"#f97316"}
                        // hoverbg={"orange"}
                        width={"150px"}
                        handleClick={() => claimAllPayment()}
                    />
                </div>
            </div>
            <div style={{ height: 10 }}></div>
            <table className="table table-hover">
                <thead className="thead-light">
                    <tr>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            {t("no")}
                        </th>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            {t("tableNumber")}
                        </th>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            {t("tableCode")}
                        </th>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            {t("amount")}
                        </th>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            {t("detail")}
                        </th>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            {t("status")}
                        </th>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            ສະຖານະເຄລມ
                        </th>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            {t("date_time")}
                        </th>
                        <th style={{ textWrap: "nowrap" }} scope="col">
                            ຈັດການ
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {data?.map((item, index) => {
                        return (
                            <tr key={index} style={{ backgroundColor: checkPaymentSelected(item) ? "#616161" : "", }}>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    {page * rowsPerPage + index + 1}
                                </td>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    {item?.tableName ?? "-"}
                                </td>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    {item?.code ?? "-"}
                                </td>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    {item?.totalAmount
                                        ? `${item?.totalAmount.toLocaleString()} ${item?.currency ?? "LAK"
                                        }`
                                        : "-"}
                                </td>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    {t("checkout") ?? "-"}
                                </td>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    {t(item.status) ?? "-"}
                                </td>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    {t(item.claimStatus) ?? "-"}
                                </td>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                                </td>
                                <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                    <Button onClick={() => selectPayment(item)} >{checkPaymentSelected(item) ? "ຍົກເລີກ" : "ເລືອກ"}</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table></div>}

        {selctedType == "CLAIM" && <div>
            <div style={{}}>
                <table className="table table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th style={{ textWrap: "nowrap" }} scope="col">
                                {t("no")}
                            </th>
                            <th style={{ textWrap: "nowrap" }} scope="col">
                                ລະຫັດເຄລມ
                            </th>
                            <th style={{ textWrap: "nowrap" }} scope="col">
                                ຈຳນວນບິນ
                            </th>
                            <th style={{ textWrap: "nowrap" }} scope="col">
                                {t("amount")}
                            </th>
                            <th style={{ textWrap: "nowrap" }} scope="col">
                                {t("status")}
                            </th>
                            <th style={{ textWrap: "nowrap" }} scope="col">
                                {t("date_time")}
                            </th>
                            <th style={{ textWrap: "nowrap" }} scope="col">
                                ຈັດການ
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {claimData?.map((item, index) => {
                            return (
                                <tr key={index} style={{ backgroundColor: checkPaymentSelected(item) ? "#616161" : "", }}>
                                    <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                        {page * rowsPerPage + index + 1}
                                    </td>
                                    <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                        {item?.code ?? "-"}
                                    </td>
                                    <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                        {item.billIds.length}
                                    </td>
                                    <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                        {item?.totalAmount
                                            ? `${item?.totalAmount.toLocaleString()} ${item?.currency ?? "LAK"
                                            }`
                                            : "-"}
                                    </td>
                                    
                                    <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                        {t(item.status) ?? "-"}
                                    </td>
                                    <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                        {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                                    </td>
                                    <td style={{ textWrap: "nowrap", color: checkPaymentSelected(item) ? "white" : "" }}>
                                        {item?.claimStatus}
                                        {/* <Dropdown>
                                            <Dropdown.Toggle variant="warning" id="dropdown-basic">
                                                ອັບເດດ
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#/action-1">ສຳເລັດ</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">ປະຕິເສດ</Dropdown.Item>
                                                <Dropdown.Item href="#/action-3">ຍົກເລີກ</Dropdown.Item>
                                                <Dropdown.Item href="#/action-3">ກຳລັງດຳເນີນ</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown> */}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table></div>
        </div>}
    </div>
}