import React, { useState, useEffect } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";

const Export = ({ filteredRows, columnVisibility, COLUMNS, pdfTitle, pdfFilename, excelFilename, orangeBtn }) => {
  const [anchorEl, setAnchorEl] = useState(null); // For the main export menu
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null); // For the PDF sub-menu

  // Open the main export menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the main export menu
  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const ExportToPdf = (orientation) => {
    if (!filteredRows || filteredRows.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF(orientation === "landscape" ? "l" : "p", "mm", "a4");

    // Add DEVICEID to table headers
    const tableColumnHeaders = ["SR. NO.", ...COLUMNS().filter((col) => columnVisibility[col.accessor]).map(col => col.Header), "DEVICEID"];
    const tableRows = [];

    filteredRows.forEach((row, index) => {
      const rowData = [index + 1];

      COLUMNS().forEach((column) => {
        if (columnVisibility[column.accessor]) {
          let value = column.accessor.split(".").reduce((acc, part) => acc && acc[part], row);

          // If value is an object, stringify it
          if (typeof value === "object") {
            value = JSON.stringify(value, null, 2);
          }
          rowData.push(value);
        }
      });

      // Add DEVICEID
      const deviceId = row.devices?.map((device) => device.deviceName).join(", ") || "N/A";
      rowData.push(deviceId);

      tableRows.push(rowData);
    });

    const title = pdfTitle || "Report";
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;

    doc.text(title, titleX, 10);

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
      theme: "striped",
      margin: { top: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      styles: { cellPadding: 3, fontSize: 8, halign: "center" },
      columnStyles: {
        [tableColumnHeaders.length - 1]: { halign: "left" }, // Align DEVICEID column to the left
      },
    });

    doc.save(pdfFilename || "Report.pdf");
  };

  const ExportToExcel = async () => {
    if (!filteredRows || filteredRows.length === 0) {
      alert("No data to export");
      return;
    }

    // Add DEVICEID to headers
    const tableColumnHeaders = ["SR. NO.", ...COLUMNS().filter((col) => columnVisibility[col.accessor]).map(col => col.Header), "DEVICEID"];

    const tableRows = filteredRows.map((row, index) => {
      const rowData = [index + 1];

      COLUMNS().forEach((column) => {
        if (columnVisibility[column.accessor]) {
          const value = column.accessor.split(".").reduce((acc, part) => acc && acc[part], row);
          rowData.push(value);
        }
      });

      // Add DEVICEID
      const deviceId = row.devices?.map((device) => device.deviceName).join(", ") || "N/A";
      rowData.push(deviceId);

      return rowData;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = tableColumnHeaders.map((header) => ({
      header,
      key: header,
      width: Math.max(header.length + 5, ...tableRows.map((row) => String(row[tableColumnHeaders.indexOf(header)]).length + 5)),
    }));

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    tableRows.forEach((row, rowIndex) => {
      const addedRow = worksheet.addRow(row);

      if (rowIndex % 2 === 1) {
        addedRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F9F9F9" },
        };
      }

      addedRow.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = excelFilename || "Report.xlsx";
    link.click();
  };

  return (
    <div>
      <Button onClick={handleClick} variant="contained" color="error" style={orangeBtn} aria-haspopup="true" aria-label="Export options">
        Export
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={(event) => setSubMenuAnchorEl(event.currentTarget)}>PDF</MenuItem>
        <MenuItem onClick={ExportToExcel}>Excel</MenuItem>
      </Menu>
      <Menu anchorEl={subMenuAnchorEl} open={Boolean(subMenuAnchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => { ExportToPdf("portrait"); handleClose(); }}>Portrait</MenuItem>
        <MenuItem onClick={() => { ExportToPdf("landscape"); handleClose(); }}>Landscape</MenuItem>
      </Menu>
    </div>
  );
};

export default Export;
