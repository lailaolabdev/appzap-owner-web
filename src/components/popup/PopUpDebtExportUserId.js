import React from "react";
import { Modal, Button, Card, Spinner } from "react-bootstrap";
import { MdOutlineCloudDownload } from "react-icons/md";
import ImageEmpty from "../../image/empty.png";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { moneyCurrency } from "../../helpers";

const PopUpDebtExportUserId = ({
    open,
    onClose,
    callback,
    billDebtData,
}) => {
    const debtDataArray = billDebtData ? [billDebtData] : [];
    const { t } = useTranslation();

    return (
        <Modal show={open} onHide={onClose} size="xl">
            <Modal.Header
                closeButton
                style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
                {t("debt_Export")}
            </Modal.Header>
            <Card border="none" style={{ margin: 0 }}>
                <Card.Header
                    style={{
                        background: "none",
                        fontSize: 16,
                        fontWeight: "bold",
                        alignItems: "center",
                        padding: 10,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <span>
                            {t("customer_name")}: {billDebtData?.customerName}
                        </span>
                        <Button
                            style={{
                                marginLeft: 'auto',
                                color: "white",
                                width: "10%",
                                fontWeight: "bold",
                            }}
                        >
                            <MdOutlineCloudDownload /> Export
                        </Button>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <span>
                            {t("phoneNumber")}: {billDebtData?.customerPhone}
                        </span>
                    </div>
                </Card.Header>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: 20,
                        height: "2rem"
                    }}
                >
                    <tr>
                        <th>
                            Total Debt Export
                        </th>
                    </tr>
                </div>

                <Card.Body>
                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ paddingRight: "3rem" }}>#</th>
                                <th style={{ paddingRight: "10rem" }}>{t("bill_no")}</th>
                                <th style={{ paddingRight: "5rem" }}>{t("money_remaining")}</th>
                                <th style={{ paddingRight: "5rem" }}>{t("debt_pay_remaining")}</th>
                                <th>{t("payment_datetime_debt")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!billDebtData ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center" }}>
                                        <img src={ImageEmpty} alt="" style={{ width: 300, height: 200 }} />
                                    </td>
                                </tr>
                            ) : (
                                debtDataArray.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.code}</td>
                                        <td>{moneyCurrency(item?.remainingAmount)}</td>
                                        <td style={{ color: "MediumSeaGreen" }}>
                                            {moneyCurrency(item?.totalPayment)}
                                        </td>
                                        <td>
                                            {item?.outStockDate
                                                ? moment(item?.outStockDate).format("DD/MM/YYYY - HH:mm:SS : a")
                                                : ""}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card.Body>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    bottom: 20
                }} />
            </Card>
        </Modal>
    );
};

export default PopUpDebtExportUserId;