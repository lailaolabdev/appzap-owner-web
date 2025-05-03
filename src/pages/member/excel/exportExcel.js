import ExcelJS from "exceljs";
import moment from "moment";
import { saveAs } from "file-saver";

/**
 * Export member data to Excel
 * @param {Array} data - Array of member objects
 * @param {String} fileName - Name for the exported file
 * @param {Object} storeDetail - Store details including isStatusCafe
 * @param {Function} t - Translation function
 */
export const exportMembersToExcel = async (
  data,
  fileName = "members",
  storeDetail,
  t
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Members");

    // Define columns based on store type
    const columns = [
      { header: t("member_name") || "Member Name", key: "Name", width: 20 },
      { header: t("phone") || "Phone", key: "Phone", width: 15 },
      { header: "ພ໋ອຍທັງໝົດ", key: "Point", width: 10 },
    ];

    // Add conditional columns based on store type
    if (!storeDetail?.isStatusCafe) {
      columns.push({
        header: t("date_expirt_point") || "Expiration Date",
        key: "PointDateExpirt",
        width: 15,
      });
    } else {
      columns.push({
        header: t("member_discount") || "Discount",
        key: "discountPercentage",
        width: 10,
      });
    }

    // Add remaining columns
    columns.push(
      {
        header: t("use_service") || "Service Usage",
        key: "bill",
        width: 15,
      },
      {
        header: t("regis_date") || "Registration Date",
        key: "createdAt",
        width: 15,
      }
    );

    worksheet.columns = columns;

    // Add header style
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    // Add data rows
    data.forEach((item, index) => {
      const row = {
        Name: item.name || "",
        Phone: item.phone || "",
        Point: item.point || 0,
        bill: item.bill || 0,
        createdAt: item.createdAt
          ? moment(item.createdAt).format("DD/MM/YYYY")
          : "",
      };

      // Add conditional fields based on store type
      if (!storeDetail?.isStatusCafe) {
        row.PointDateExpirt = item?.pointDateExpirt
          ? moment(item.pointDateExpirt).format("DD/MM/YYYY")
          : "-";
      } else {
        row.discountPercentage = item.discountPercentage || 0;
      }

      worksheet.addRow(row);
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}_${moment().format("YYYY-MM-DD")}.xlsx`);

    return true;
  } catch (error) {
    console.error("Error exporting members to Excel:", error);
    return false;
  }
};

/**
 * Export top members list to Excel
 * @param {Array} data - Array of top member objects
 * @param {String} fileName - Name for the exported file
 * @param {Function} t - Translation function
 *
 */
export const exportTopMembersToExcel = async (
  data,
  t,
  fileName = "top_members"
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Top Members");

    // Define columns based on provided headers
    worksheet.columns = [
      { header: t("member_name") || "Member Name", key: "Name", width: 20 },
      { header: t("phone") || "Phone", key: "Phone", width: 15 },
      { header: t("point") || "Point", key: "Point", width: 10 },
      {
        header: t("use_service") || "Service Usage",
        key: "ServiceUsage",
        width: 15,
      },
      {
        header: t("money_amount") || "Total Amount",
        key: "totalAmount",
        width: 15,
      },
    ];

    // Add header style
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    // Add data rows
    data.forEach((item, index) => {
      worksheet.addRow({
        Name: item.name || "",
        Phone: item.phone || "",
        Point: item.point || 0,
        ServiceUsage: item.bill || 0,
        totalAmount: item.money || 0,
      });
    });

    // Format currency for totalAmount column
    worksheet.getColumn("totalAmount").numFmt = "#,##0.00";

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}_${moment().format("YYYY-MM-DD")}.xlsx`);

    return true;
  } catch (error) {
    console.error("Error exporting top members to Excel:", error);
    return false;
  }
};

/**
 * Export member orders to Excel
 * @param {Array} data - Array of member order objects
 * @param {String} fileName - Name for the exported file
 * @param {Function} t - Translation function
 */
export const exportMemberOrdersToExcel = async (
  data,
  t,
  fileName = "member_orders"
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Member Orders");

    // Define columns for orders based on provided headers
    worksheet.addRow([
      t("menu_name") || "Menu Name",
      t("order_amount") || "Order Amount",
      t("total_money") || "Total Money",
    ]);

    // Style the header row
    const headerRow = worksheet.lastRow;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };
    });

    // Add data rows
    data.forEach((order, index) => {
      worksheet.addRow([
        order.name || "",
        order.served || 0,
        order.totalSaleAmount || 0,
      ]);
    });

    // Adjust column widths
    worksheet.columns = [
      { width: 30 }, // Menu Name
      { width: 15 }, // Order Amount
      { width: 15 }, // Total Money
    ];

    // Format currency for total money column
    worksheet.getColumn(3).numFmt = "#,##0.00";

    // Align columns
    worksheet.getColumn(1).alignment = { horizontal: "left" };
    worksheet.getColumn(2).alignment = { horizontal: "center" };
    worksheet.getColumn(3).alignment = { horizontal: "right" };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `${fileName}_${data?.Name || "unknown"}_${moment().format(
        "YYYY-MM-DD"
      )}.xlsx`
    );

    return true;
  } catch (error) {
    console.error("Error exporting member orders to Excel:", error);
    return false;
  }
};

export default {
  exportMembersToExcel,
  exportTopMembersToExcel,
  exportMemberOrdersToExcel,
};
