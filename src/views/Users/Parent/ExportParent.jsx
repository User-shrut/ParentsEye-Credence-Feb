import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";

const Export = ({
  filteredRows,
  columnVisibility,
  COLUMNS,
  pdfTitle,
  pdfFilename,
  excelFilename,
  
}) => {
  const [anchorEl, setAnchorEl] = useState(null); // Main export menu
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null); // Sub-menu for PDF

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  // Utility: Filter visible columns based on columnVisibility
  const getVisibleColumns = () => {
    const allColumns = [
      { Header: "S.No.", accessor: "sno" },
      { Header: "Parent Name", accessor: "parentName" },
      { Header: "Username or Email", accessor: "email" },
      { Header: "Password", accessor: "password" },
      { Header: "Phone", accessor: "phone" },
      { Header: "School Name", accessor: "schoolName" },
      { Header: "Branch Name", accessor: "branchName" },
      { Header: "Registration Date", accessor: "registrationDate" },
      { Header: "All Children", accessor: "allChildren" },
      { Header: "No. of Children", accessor: "numChildren" },
      { Header: "Actions", accessor: "actions" },
    ];
    return allColumns.filter((col) => columnVisibility[col.accessor] !== false);
  };

  const ExportToPdf = (orientation) => {
    if (!filteredRows || filteredRows.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF(orientation === "landscape" ? "l" : "p", "mm", "a4");
    const visibleColumns = getVisibleColumns();
    const tableColumnHeaders = visibleColumns.map((col) => col.Header);
    const tableRows = [];

    filteredRows.forEach((row, index) => {
      const rowData = [];
      visibleColumns.forEach((col) => {
        switch (col.accessor) {
          case "sno":
            rowData.push(index + 1); // Serial number
            break;
          case "allChildren":
            rowData.push(row.children.map((child) => child.childName).join(", "));
            break;
          case "actions":
            rowData.push(row.statusOfRegister || "N/A"); // Status in Actions
            break;
          default:
            rowData.push(row[col.accessor] || ""); // Other columns
        }
      });
      tableRows.push(rowData);
    });
    

    // Title
    const title = pdfTitle || "Report";
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
    doc.text(title, titleX, 10);

    // Table
    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
      theme: "striped",
      styles: { fontSize: 8, halign: "center" },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(pdfFilename || "Report.pdf");
  };

  const ExportToExcel = async () => {
    if (!filteredRows || filteredRows.length === 0) {
      alert("No data to export");
      return;
    }

    const visibleColumns = getVisibleColumns();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = visibleColumns.map((col) => ({
      header: col.Header,
      key: col.accessor,
      width: col.Header.length + 5,
    }));

    filteredRows.forEach((row, index) => {
      const rowData = {};
      visibleColumns.forEach((col) => {
        switch (col.accessor) {
          case "sno":
            rowData[col.accessor] = index + 1; // Serial number
            break;
          case "allChildren":
            rowData[col.accessor] = row.children.map((child) => child.childName).join(", ");
            break;
          case "actions":
            rowData[col.accessor] = row.statusOfRegister || "N/A"; // Status
            break;
          default:
            rowData[col.accessor] = row[col.accessor] || ""; // Other columns
        }
      });
      worksheet.addRow(rowData);
    });

    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4F81BD" },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = excelFilename || "Report.xlsx";
    link.click();
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        variant="contained"
        style={
          { backgroundColor: "#d32f2f", color: "white" }
        }
      >
        Export
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={(event) => setSubMenuAnchorEl(event.currentTarget)}>
          PDF
        </MenuItem>
        <MenuItem onClick={ExportToExcel}>Excel</MenuItem>
      </Menu>
      <Menu anchorEl={subMenuAnchorEl} open={Boolean(subMenuAnchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            ExportToPdf("portrait");
            handleClose();
          }}
        >
          Portrait
        </MenuItem>
        <MenuItem
          onClick={() => {
            ExportToPdf("landscape");
            handleClose();
          }}
        >
          Landscape
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Export;
