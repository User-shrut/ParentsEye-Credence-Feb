import React, { useState, useEffect } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";

const Export = ({ filteredRows, columnVisibility, COLUMNS,}) => {
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
    const tableColumnHeaders = ["SR. NO."];
    const tableRows = [];

    COLUMNS().forEach((column) => {
      if (columnVisibility[column.accessor]) {
        tableColumnHeaders.push(column.Header);
      }
    });
    tableColumnHeaders.push("Actions");
   
    filteredRows.forEach((row, index) => {
      const rowData = [index + 1];
      COLUMNS().forEach((column) => {
        if (columnVisibility[column.accessor]) {
          let value = column.accessor.split(".").reduce((acc, part) => acc && acc[part], row);
          // Check if the value is a JSON object (like Attributes or Protocols)
        if (typeof value === "object") {
            value = JSON.stringify(value, null, 2); // Pretty-print the JSON
          }
          rowData.push(value);
        }
      });
       // Check if the value is a JSON object (like Attributes or Protocols)
      // rowData.push(row.accessor)
      // rowData.push(row.statusOfRequest || ""); 
      // tableRows.push(rowData);
      rowData.push(row.statusOfRequest || ""); // Add statusOfRequest as the last column
      tableRows.push(rowData);
    });

    const title =  "LEAVE DETAIL";
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the page width
    const titleWidth = doc.getTextWidth(title); // Get the width of the title text
    const titleX = (pageWidth - titleWidth) / 2; // Calculate the x-coordinate to center the text
  
    doc.text(title, titleX, 10); // Center the title
    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
      theme: "striped",
      margin: { top: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      styles: { cellPadding: 3, fontSize: 8, halign: "center" },
     
    });
    doc.save("Leave.pdf");
  };

  const ExportToExcel = async () => {
    if (!filteredRows || filteredRows.length === 0) {
      alert("No data to export");
      return;
    }

    const tableColumnHeaders = ["SR. NO."];
    COLUMNS().forEach((column) => {
      if (columnVisibility[column.accessor]) {
        tableColumnHeaders.push(column.Header);
      }
    });
    tableColumnHeaders.push("Actions");
    const tableRows = filteredRows.map((row, index) => {
      const rowData = [index + 1];
      COLUMNS().forEach((column) => {
        if (columnVisibility[column.accessor]) {
          const value = column.accessor.split(".").reduce((acc, part) => acc && acc[part], row);
          rowData.push(value);
        }
      });
      rowData.push(row.statusOfRequest || "");
      return rowData;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = tableColumnHeaders.map((header) => ({
      header,
      key: header,
      width: Math.max(
        header.length + 5,
        ...tableRows.map((row) => String(row[tableColumnHeaders.indexOf(header)]).length + 5)
      ),
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
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    const totalRows = worksheet.rowCount;
    const totalCols = worksheet.columns.length;

    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= totalCols; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Leave.xlsx"; 
    link.click();
  };

  return (
    <div>
      <Button onClick={handleClick} variant="contained" color="success" sx={{marginRight: "5px"}} aria-haspopup="true" aria-label="Export options">
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
