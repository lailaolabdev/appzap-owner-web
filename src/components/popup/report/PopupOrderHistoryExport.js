import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Card, Spinner, Modal } from "react-bootstrap";
import moment from "moment";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ImageEmpty from "../../../image/empty.png";
import { MdOutlineCloudDownload } from "react-icons/md";
import { COLOR_APP } from "../../../constants";

export default function PopupOrderHistoryExport({
  open,
  onClose,
  data,
  filtterModele,
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [showMainModal, setShowMainModal] = useState(open);

  const limitData = 50;

  // Modal visibility effect
  useEffect(() => {
    setShowMainModal(open);
  }, [open]);

  /**
 * Formats order items to display as "* name / quantity" format
 * @param {string|array|object} orderItem - The order item data
 * @param {array} orderDetails - Optional: Additional order details with quantities
 * @returns {string} Formatted string with bullet points
 */
  const formatOrderItemsForDisplay = (orderItem, orderDetails = null) => {
    if (!orderItem) return "--";

    try {
      let items = [];

      // Handle different data formats
      if (typeof orderItem === 'string') {
        // If it's a comma-separated string like "item1, item2, item3"
        if (orderItem.includes(',')) {
          const itemNames = orderItem.split(',').map(name => name.trim());
          items = itemNames.map(name => ({ name, quantity: 1 }));
        } else {
          // Single item
          items = [{ name: orderItem.trim(), quantity: 1 }];
        }
      } else if (Array.isArray(orderItem)) {
        // If it's an array of objects or strings
        items = orderItem.map(item => {
          if (typeof item === 'string') {
            return { name: item, quantity: 1 };
          } else if (typeof item === 'object' && item.name) {
            return {
              name: item.name || item.itemName || item.menuName || 'Unknown Item',
              quantity: item.quantity || item.qty || 1,
              menuCode: item.menuCode
            };
          }
          return { name: 'Unknown Item', quantity: 1 };
        });
      } else if (typeof orderItem === 'object') {
        // If it's a single object
        items = [{
          name: orderItem.name || orderItem.itemName || orderItem.menuName || 'Unknown Item',
          quantity: orderItem.quantity || orderItem.qty || 1,
          menuCode: orderItem.menuCode
        }];
      }

      // If we have additional order details, try to match quantities
      if (orderDetails && Array.isArray(orderDetails)) {
        items = items.map(item => {
          const detail = orderDetails.find(detail =>
            detail.name?.toLowerCase().includes(item.name.toLowerCase()) ||
            detail.itemName?.toLowerCase().includes(item.name.toLowerCase())
          );
          return {
            ...item,
            quantity: detail?.quantity || detail?.qty || item.quantity
          };
        });
      }

      // Format as bullet points
      return items
        .filter(item => item.name && item.name !== 'Unknown Item')
        .map(item => `• ${item.name}${item.menuCode ? ` [${item.menuCode}]` : ''} / ${item.quantity}`)
        .join('\n');

    } catch (error) {
      console.error('Error formatting order items:', error);
      return orderItem.toString() || "--";
    }
  };

  /**
   * Enhanced function to format cancelled order data specifically
   * @param {object} logItem - The log item containing order information
   * @returns {string} Formatted cancelled orders
   */
  const formatCancelledOrdersForExcel = (logItem) => {
    // Handle different possible data structures
    const orderItem = logItem?.dataCancels;
    const orderDetails = logItem?.orderDetails || logItem?.details;
    // const orderAmount = logItem?.orderAmount || 0;

    if (!orderItem) return "--";

    // Try to parse if it's a JSON string
    let parsedOrderItem = orderItem;
    if (typeof orderItem === 'string') {
      try {
        parsedOrderItem = JSON.parse(orderItem);
      } catch (e) {
        // Not JSON, keep as string
        parsedOrderItem = orderItem;
      }
    }

    return formatOrderItemsForDisplay(parsedOrderItem, orderDetails);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Your Application";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("ລາຍງານອາຫານ", {
      properties: { defaultRowHeight: 20 },
    });

    const defaultFont = { name: "Noto Sans Lao", size: 11, family: 2 };
    const headerFont = { ...defaultFont, size: 20, bold: true };

    // Header setup
    const excelColor = COLOR_APP.replace("#", "FFFFFFFF");
    worksheet.mergeCells("A1:H1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = [
      t("order_history"),
      filtterModele === "order_history" ? "" : "ທີ",
      filtterModele === "order_history"
        ? ""
        : filtterModele === "served"
          ? t("served")
          : filtterModele === "doing"
            ? t("cooking")
            : t("cancel"),
      t("all"),
    ]
      .map((text) => text.trim())
      .join("");

    titleCell.font = headerFont;
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.height = 30;
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: excelColor },
    };

    // Column headers
    const headers = [
      t("no"),
      t("user"),
      t("table"),
      t("order_cancel"),
      t("amount"),
      t("detail"),
      t("cause"),
      t("date_time"),
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { ...defaultFont, bold: true };
    headerRow.height = 25;
    headerRow.alignment = { horizontal: "center", vertical: "middle" };

    // Style header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add data rows with improved formatting
    data.forEach((item, index) => {
      // Format the cancelled orders with improved display
      const formattedOrderItems = formatCancelledOrdersForExcel(item);

      const rowData = [
        (pagination - 1) * limitData + index + 1,
        item?.user || "",
        item?.table || "",
        formattedOrderItems, // Improved formatted data for cancels
        item?.orderAmount || 0,
        item?.eventDetail || "",
        item?.reason ? item.reason : "--",
        item?.createdAt
          ? moment(item.createdAt).format("DD/MM/YYYY - HH:mm:SS : a")
          : "",
      ];

      const row = worksheet.addRow(rowData);
      row.font = defaultFont;

      // Set dynamic row height based on content length
      const orderItemsLength = formattedOrderItems.split('\n').length;
      row.height = Math.max(20, orderItemsLength * 15);

      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Special formatting for the order items column (column 4)
        if (colNumber === 4) {
          cell.alignment = {
            horizontal: "left",
            vertical: "top",
            wrapText: true
          };
        } else {
          cell.alignment = {
            horizontal: "center",
            vertical: "middle"
          };
        }
      });
    });

    // Auto-fit columns with special handling for order items column
    worksheet.columns.forEach((column, index) => {
      let maxLength = 0;

      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        maxLength = Math.max(maxLength, length);
      });

      // Special width for order items column (column 4 - index 3)
      if (index === 3) {
        column.width = Math.max(25, Math.min(maxLength / 2, 40));
      } else {
        column.width = Math.min(Math.max(maxLength + 2, 15), 30);
      }
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const fileDate = moment().format("YYYYMMDD_HHmmss");
    const fileName = `ປະຫວັດອາຫານ_${filtterModele}_${fileDate}.xlsx`;

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName
    );
  };

  // Alternative: If you want to format data before the forEach loop
  const formatDataForExcel = (originalData) => {
    return originalData.map(item => ({
      ...item,
      formattedOrderItems: formatCancelledOrdersForExcel(item)
    }));
  };


  // const exportToExcel = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   workbook.creator = "Your Application";
  //   workbook.created = new Date();

  //   const worksheet = workbook.addWorksheet("ລາຍງານອາຫານ", {
  //     properties: { defaultRowHeight: 20 },
  //   });

  //   const defaultFont = { name: "Noto Sans Lao", size: 11, family: 2 };
  //   const headerFont = { ...defaultFont, size: 20, bold: true };

  //   // Header setup
  //   const excelColor = COLOR_APP.replace("#", "FFFFFFFF");
  //   worksheet.mergeCells("A1:H1");
  //   const titleCell = worksheet.getCell("A1");
  //   titleCell.value = [
  //     t("order_history"),
  //     filtterModele === "order_history" ? "" : "ທີ",
  //     filtterModele === "order_history"
  //       ? ""
  //       : filtterModele === "served"
  //         ? t("served")
  //         : filtterModele === "doing"
  //           ? t("cooking")
  //           : t("cancel"),
  //     t("all"),
  //   ]
  //     .map((text) => text.trim())
  //     .join("");

  //   titleCell.font = headerFont;
  //   titleCell.alignment = { horizontal: "center", vertical: "middle" };
  //   titleCell.height = 30;
  //   titleCell.fill = {
  //     type: "pattern",
  //     pattern: "solid",
  //     fgColor: { argb: excelColor },
  //   };

  //   // Column headers
  //   const headers = [
  //     t("no"),
  //     t("user"),
  //     t("table"),
  //     t("order_cancel"),
  //     t("amount"),
  //     t("detail"),
  //     t("cause"),
  //     t("date_time"),
  //   ];

  //   const headerRow = worksheet.addRow(headers);
  //   headerRow.font = { ...defaultFont, bold: true };
  //   headerRow.height = 25;
  //   headerRow.alignment = { horizontal: "center", vertical: "middle" };

  //   // Style header row
  //   headerRow.eachCell((cell) => {
  //     cell.fill = {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "FFE0E0E0" },
  //     };
  //     cell.border = {
  //       top: { style: "thin" },
  //       left: { style: "thin" },
  //       bottom: { style: "thin" },
  //       right: { style: "thin" },
  //     };
  //   });

  //   // Add data rows from the main table data
  //   data.forEach((item, index) => {
  //     const rowData = [
  //       (pagination - 1) * limitData + index + 1,
  //       item?.user || "",
  //       item?.table || "",
  //       item?.orderItem || "", // data cancels
  //       item?.orderAmount || 0,
  //       item?.eventDetail || "",
  //       item?.reason ? item.reason : "--",
  //       item?.createdAt
  //         ? moment(item.createdAt).format("DD/MM/YYYY - HH:mm:SS : a")
  //         : "",
  //     ];

  //     const row = worksheet.addRow(rowData);
  //     row.font = defaultFont;
  //     row.height = 20;
  //     row.eachCell((cell) => {
  //       cell.border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" },
  //       };
  //       cell.alignment = { horizontal: "center", vertical: "middle" };
  //     });
  //   });

  //   // Auto-fit columns
  //   worksheet.columns.forEach((column) => {
  //     let maxLength = 0;
  //     column.eachCell({ includeEmpty: true }, (cell) => {
  //       const length = cell.value ? cell.value.toString().length : 0;
  //       maxLength = Math.max(maxLength, length);
  //     });
  //     column.width = Math.min(Math.max(maxLength + 2, 15), 30);
  //   });

  //   // Save file
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const fileDate = moment().format("YYYYMMDD_HHmmss");
  //   const fileName = `ປະຫວັດອາຫານ_${filtterModele}_${fileDate}.xlsx`;

  //   saveAs(
  //     new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     }),
  //     fileName
  //   );
  // };

  return (
    <Modal show={showMainModal} onHide={onClose} size="xl">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <span>{`${t("order_history")}${filtterModele === "order_history" ? "" : "ທີ"
          } 
    ${filtterModele === "order_history"
            ? ""
            : filtterModele === "served"
              ? t("served")
              : filtterModele === "doing"
                ? t("cooking")
                : t("cencel")
          } ${t("all")} `}</span>
      </Modal.Header>
      <Card border="none" style={{ margin: 0 }}>
        <Card.Header
          style={{
            background: "none",
            fontSize: 16,
            fontWeight: "bold",
            padding: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <span></span>
            <Button
              onClick={exportToExcel}
              style={{
                marginLeft: "auto",
                color: "white",
                width: "10%",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                backgroundColor: COLOR_APP,
              }}
            >
              <MdOutlineCloudDownload style={{ marginRight: "10px" }} /> Export
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <table
            style={{ width: "100%", textAlign: "center", marginLeft: "auto" }}
          >
            <thead>
              <tr>
                <th style={{ paddingRight: "1rem", width: "5%" }}>{t("no")}</th>
                <th style={{ paddingRight: "2rem", width: "10%" }}>
                  {t("manager_name")}
                </th>
                <th style={{ paddingRight: "2rem", width: "10%" }}>
                  {t("table")}
                </th>
                <th style={{ paddingRight: "2rem", width: "10%" }}>
                  {t("order")}
                </th>
                <th style={{ paddingRight: "2rem", width: "10%" }}>
                  {t("amount")}
                </th>
                <th style={{ paddingRight: "3rem" }}>{t("detail")}</th>
                <th style={{ paddingRight: "1rem", width: "10%" }}>
                  {t("cause")}
                </th>
                <th style={{ width: "25%", paddingRight: "0" }}>
                  {t("date_time")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((e, i) => {
                  let _dataCancels = []
                  if (e?.dataCancels) {
                    _dataCancels = JSON.parse(e?.dataCancels);
                  }
                  return (
                    <tr key={i}>
                      <td style={{ textAlign: "left" }}>
                        {(pagination - 1) * limitData + i + 1}
                      </td>
                      <td style={{ textAlign: "left" }}>{e?.user}</td>
                      <td style={{ textAlign: "left" }}>{e?.table}</td>
                      <td style={{ textAlign: "left", minWidth: 200 }}>
                        {(_dataCancels && _dataCancels?.length > 0) ? <div >
                          {_dataCancels?.map((_item, _index) => (
                            <p key={_index} style={{ marginTop: -7, marginBottom: 0 }}>- {_item?.name || "-"} / {_item?.quantity || 0}</p>
                          ))}
                        </div> : <p>{e?.orderItem}</p>}
                      </td>
                      <td style={{ textAlign: "left" }}>{e?.orderAmount}</td>
                      <td style={{ textAlign: "left" }}>{e?.eventDetail}</td>
                      <td style={{ textAlign: "left" }}>
                        {e?.reason ? e?.reason : "--"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {moment(e?.createdAt).format("DD/MM/YYYY - HH:mm:SS : a")}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    <img
                      src={ImageEmpty}
                      alt=""
                      style={{ width: 300, height: 200 }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card.Body>
      </Card>
    </Modal>
  );
}
