import React from "react";
import { JsonToExcel } from "react-json-to-excel";
import { COLOR_APP } from "../../constants";

function ButtonDownloadExcel({ jsonData }) {
  //   const [csvData, setCsvData] = useState(null);

  const exportToExcel = async () => {
    console.log("jsonData", jsonData);
    // const csvData = await JSONToCSV({ data: jsonData });
    // setCsvData(csvData);
    // console.log("csvData", csvData);
    // const handleDownload = () => {
    //   const fileName = "export.csv";
    //   const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    //   if (navigator.msSaveBlob) {
    //     // IE 10+
    //     navigator.msSaveBlob(blob, fileName);
    //   } else {
    //     const link = document.createElement("a");
    //     if (link.download !== undefined) {
    //       // feature detection
    //       // Browsers that support HTML5 download attribute
    //       const url = URL.createObjectURL(blob);
    //       link.setAttribute("href", url);
    //       link.setAttribute("download", fileName);
    //       link.style.visibility = "hidden";
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //     }
    //   }
    // };
    // handleDownload();
  };

  return (
    <>
      {/* <div
        style={{
          backgroundColor: COLOR_APP,
          padding: "10px 30px",
          borderRadius: 8,
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={exportToCsv}
      >
        Export CSV
      </div> */}

      <JsonToExcel data={jsonData} fileName="export" />
    </>
  );
}

export default ButtonDownloadExcel;
