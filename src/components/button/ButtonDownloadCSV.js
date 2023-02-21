import React from "react";
import CsvDownloadButton from "react-json-to-csv";

function ButtonDownloadCSV({ jsonData }) {
  return (
    <>

      <CsvDownloadButton data={jsonData} />
    </>
  );
}
export default ButtonDownloadCSV;
