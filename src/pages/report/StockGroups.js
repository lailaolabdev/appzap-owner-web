import React from 'react';
import { Card, Table, Spinner } from 'react-bootstrap'; // Ensure you have these components imported
import { COLOR_APP } from '../../constants';
import { formatDateNow, numberFormat } from '../../helpers';
import { thousandSeparator } from '../../helpers/thousandSeparator';
import LoadingAppzap from '../../components/LoadingAppzap';

// Assuming COLOR_APP is a constant defined elsewhere
// const COLOR_APP = "#someColor";

function StockGroups({ dataExports, isLoading, filterName }) {

console.log("export:----999>", dataExports)


  // if (isLoading) return  

  // ຂໍ້ມູນທີ່ສະແດງຕາມການຄົ້ນຫາຊື່ສິນຄ້າ
//   const filteredData = dataExports?.filter((e) => e?.name?.includes(filterName)) || [];

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
              <th>ຊື່ສິນຄ້າ</th>
              <th style={{ textAlign:'center'}}>ນຳອອກ</th>
              <th style={{ textAlign:'center'}}>ນຳເຂົ້າ</th>
              <th style={{ textAlign:'center'}}>ສົ່ງຄືນ</th>
              <th style={{ textAlign:'center'}}>ຫົວໜ່ວຍ</th>
            </tr>
          </thead>
          <tbody>
            {dataExports.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign:'left'}}>{item?.stockDetails?.name}</td>
                {/* <td>{item?.stockId?.sellPrice ?? "-"}</td> */}
                <td 
                style={{
                    color: item?.totalQtyExport >= 1 ? "orange" : "red",textAlign:'center'
                  }}
                >
                  {numberFormat(item?.totalQtyExport)}  
                </td>
                <td 
                style={{
                    color: item?.totalQtyImport >= 1 ? "green" : "red",textAlign:'center'
                  }}
                >
                  {numberFormat(item?.totalQtyImport)}  
                </td>
                <td 
                style={{
                    color: item?.totalQtyReturn >= 1 ? "green" : "red",textAlign:'center'
                  }}
                >
                  {numberFormat(item?.totalQtyReturn)}  
                </td>
                <td style={{textAlign:'center'}}>{item?.stockDetails?.unit}</td>
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
