import React from "react";
import { Card, Table, Spinner } from "react-bootstrap"; // Ensure you have these components imported
import { COLOR_APP } from "../../constants";
import { formatDateNow, numberFormat } from "../../helpers";
import { thousandSeparator } from "../../helpers/thousandSeparator";
import LoadingAppzap from "../../components/LoadingAppzap";
import EmptyState from "../../components/EmptyState";

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
  if (datas?.length < 1) return <EmptyState text={`ບໍ່ມີຂໍ້ມູນສະຕ໋ອກ`} />;
  if (isLoadingTotal) return <LoadingAppzap />;

  // ຂໍ້ມູນທີ່ສະແດງຕາມການຄົ້ນຫາຊື່ສິນຄ້າ
  datas.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log("checkdatas44:-===>", datas);

  return (
    <Card className="w-100">
      <div className="w-100">
        <div
          style={{
            background: COLOR_APP,
            padding: "1em",
            width: "100%",
            color: "#fff",
          }}
        >
          <h5>
            <b>ສະຕ໋ອກທີ່ ນຳອອກ, ນຳເຂົ້າ ແລະ ສົ່ງຄືນ </b>
          </h5>
        </div>
        <Table>
          <thead className="thead-primary">
            <tr>
              <th>#</th>
              <th style={{ textAlign: "center" }}>ວັນທີ,ເດືອນ,ປີ​ (ເວລາ)</th>
              <th>ຊື່ສິນຄ້າ</th>
              <th style={{ textAlign: "center" }}>ຈຳນວນນຳອອກ</th>
              <th style={{ textAlign: "center" }}>ຈຳນວນນຳເຂົ້າ</th>
              <th style={{ textAlign: "center" }}>ຈຳນວນສົ່ງຄືນ</th>
              <th style={{ textAlign: "center" }}>ຫົວໜ່ວຍ</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: "left" }}>
                  {pageTotal * rowsPerPageTotal + index + 1}
                </td>
                <td> {formatDateNow(item?.createdAt)}</td>
                <td style={{ textAlign: "left" }}>
                  {item?.stockDetails?.name}
                </td>

                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {numberFormat(item?.totalQtyExport)}
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {numberFormat(item?.totalQtyImport)}
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {numberFormat(item?.totalQtyReturn)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {item?.stockDetails?.unit}
                </td>
                {/* <td>{formatDateNow(item?.stockDetails?.createdAt)}</td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}

export default StockGroups;
