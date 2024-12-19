import React from "react";
import { Card, Table, Spinner } from "react-bootstrap"; // Ensure you have these components imported
import { COLOR_APP } from "../../constants";
import { formatDateNow, numberFormat } from "../../helpers";
import { thousandSeparator } from "../../helpers/thousandSeparator";
import LoadingAppzap from "../../components/LoadingAppzap";
import EmptyState from "../../components/EmptyState";
import { useTranslation } from "react-i18next";

// Assuming COLOR_APP is a constant defined elsewhere
// const COLOR_APP = "#someColor";

function StockGroups({
  datas,
  isLoadingTotal,
  filterName,
  totalStock,
  pageTotal,
  rowsPerPageTotal,
}) {
  const { t } = useTranslation();
  if (datas?.length < 1) return <EmptyState text={`${t("no_stoke_data")}`} />;
  if (isLoadingTotal) return <LoadingAppzap />;

  // ຂໍ້ມູນທີ່ສະແດງຕາມການຄົ້ນຫາຊື່ສິນຄ້າ
  // datas.sort(
  //   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  // );

  console.log("checkdatas44:-===>", datas);

  return (
    <Card className="w-100">
      <div
        style={{
          background: COLOR_APP,
          padding: "1em",
          width: "100%",
          color: "#fff",
        }}
      >
        <h5>
          <b>{t("stoke_transport")}</b>
        </h5>
      </div>

      <Card.Body>
        <Table responsive className="w-full">
          <thead className="thead-primary">
            <tr>
              <th>#</th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("date_day")}
              </th>
              <th style={{ textWrap: "nowrap" }}>{t("prod_name")}</th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("out_amount")}
              </th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("in_amount")}
              </th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("opening_stock")}
              </th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("closing_stock")}
              </th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("return_amount")}
              </th>
              <th style={{ textAlign: "center", textWrap: "nowrap" }}>
                {t("unit")}
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: "left", textWrap: "nowrap" }}>
                  {pageTotal * rowsPerPageTotal + index + 1}
                </td>
                <td style={{ textWrap: "nowrap" }}>
                  {" "}
                  {formatDateNow(item?.createdAt)}
                </td>
                <td style={{ textAlign: "left", textWrap: "nowrap" }}>
                  {item?.stockDetails?.name}
                </td>

                <td
                  style={{
                    textAlign: "center",
                    textWrap: "nowrap",
                  }}
                >
                  {numberFormat(item?.totalQtyExport)}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    textWrap: "nowrap",
                  }}
                >
                  {numberFormat(item?.totalQtyImport)}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    textWrap: "nowrap",
                  }}
                >
                  {numberFormat(item?.totalQtyOpening)}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    textWrap: "nowrap",
                  }}
                >
                  {numberFormat(item?.stockDetails?.quantity)}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    textWrap: "nowrap",
                  }}
                >
                  {numberFormat(item?.totalQtyReturn)}
                </td>

                <td style={{ textAlign: "center", textWrap: "nowrap" }}>
                  {item?.stockDetails?.unit}
                </td>
                {/* <td>{formatDateNow(item?.stockDetails?.createdAt)}</td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default StockGroups;
