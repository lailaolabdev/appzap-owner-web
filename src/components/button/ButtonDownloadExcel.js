import React from "react";
import { JsonToExcel } from "react-json-to-excel";

function ButtonDownloadExcel({ jsonData }) {
  return (
    <>
      <JsonToExcel data={jsonData} title="Download as Excel" fileName="export" />
    </>
  );
}

export default ButtonDownloadExcel;
