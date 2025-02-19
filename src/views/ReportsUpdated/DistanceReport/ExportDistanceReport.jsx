import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver'; // Save file to the user's machine


const Export = ({
  sortedData,
  columnVisibility,
  COLUMNS,
  pdfTitle,
  pdfFilename,
  excelFilename,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };
  
const exportToPDF = (orientation) => {
    if (!sortedData || sortedData.length === 0) {
          alert("No data to export");
          return;
        }
    
        const doc = new jsPDF(orientation === "landscape" ? "l" : "p", "mm", "a4");
  //const doc = new jsPDF("l", "mm", "a4"); // Landscape orientation
  const tableColumnHeaders = ["Sr. No"];
  const tableRows = [];

  // Add the column headers
  COLUMNS().forEach((column) => {
    tableColumnHeaders.push(column.Header);
  });
  tableColumnHeaders.push("Total Distance");

  // Add the data rows
  sortedData.forEach((row, index) => {
    const rowData = [index + 1]; // Add Sr. No column at the start

    // Add values for each column in a row
    COLUMNS().forEach((column) => {
      if (column.accessor.startsWith("date_")) {
        const dateKey = column.accessor.replace("date_", "").replace(/-/g, "/");
        rowData.push(row[dateKey] || "0");
      } else {
        rowData.push(row[column.accessor]);
      }
    });

    // Add the total distance for the row
    const totalDistance = Object.keys(row).reduce((sum, key) => {
      if (key !== "deviceName" && !key.startsWith("date_")) {
        const value = parseFloat(row[key]);
        return !isNaN(value) ? sum + value : sum;
      }
      return sum;
    }, 0);

    rowData.push(totalDistance.toFixed(2));
    tableRows.push(rowData);
  });

  // Calculate the total for each column
  const footerRow = [""];
  COLUMNS().forEach((column) => {
    if (column.accessor === "deviceName") {
      footerRow.push("Total");
    } else {
      const columnTotal = sortedData.reduce((sum, row) => {
        const dateKey = column.accessor.replace("date_", "").replace(/-/g, "/");
        const value = parseFloat(row[dateKey] || 0);
        return !isNaN(value) ? sum + value : sum;
      }, 0);
      footerRow.push(columnTotal.toFixed(2));
    }
  });
  

  // Grand total
  const grandTotal = sortedData.reduce((sum, row) => {
    return Object.keys(row).reduce((subtotal, key) => {
      if (key !== "deviceName") {
        const value = parseFloat(row[key] || 0);
        return !isNaN(value) ? subtotal + value : subtotal;
      }
      return subtotal;
    }, sum);
  }, 0);
  footerRow.push(grandTotal.toFixed(2));

  tableRows.push(footerRow);

  // Generate the table in PDF
  doc.text("Device Distance Report", 14, 10);
  doc.autoTable({
    head: [tableColumnHeaders],
    body: tableRows,
    startY: 20,
    theme: "striped",
    margin: { top: 10 },
    headStyles: { fillColor: [22, 160, 133] }, // Custom color for headers
    styles: { cellPadding: 3, fontSize: 8, halign: "center" },
  });

  // Save the PDF
  doc.save("DistanceReport.pdf");
};

const handleExport = async () => {
     if (!sortedData || sortedData.length === 0) {
          alert("No data to export");
          return;
        }
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("DistanceReport");

  // Sort the date columns in ascending order
  const dateColumns = COLUMNS()
    .filter((column) => column.accessor.startsWith("date_"))
    .sort((a, b) => {
      const dateA = new Date(a.accessor.replace("date_", "").replace(/-/g, "/"));
      const dateB = new Date(b.accessor.replace("date_", "").replace(/-/g, "/"));
      return dateA - dateB;
    });

  // Define the columns for the Excel sheet
  const columns = [
    { header: "Sr. No", key: "srNo", width: 10 }, // Add Sr. No column
    { header: "Device Name", key: "deviceName", width: 25 }, // Device Name as the first column
    ...dateColumns.map((column) => ({
      header: column.Header,
      key: column.accessor.replace("date_", "").replace(/-/g, "/"),
      width: 20,
    })),
    { header: "Total Distance", key: "TotalDistance", width: 20 }, // Total Distance as the last column
  ];
  worksheet.columns = columns;

  // Style the headers
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Bold and white font
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4F81BD" }, // Blue background for headers
    };
    cell.alignment = { vertical: "middle", horizontal: "center" }; // Center alignment
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }; // Apply border to header cells
  });

  // Add data rows
  sortedData.forEach((row, index) => {
    const totalDistance = Object.keys(row).reduce((sum, key) => {
      if (key !== "deviceName" && !key.startsWith("date_")) {
        const value = parseFloat(row[key]);
        return !isNaN(value) ? sum + value : sum;
      }
      return sum;
    }, 0);

    // Prepare the row data, filling missing values with 0
    const rowData = {
        srNo: index + 1, // Add serial number
      ...columns.reduce((acc, column) => {
        acc[column.key] = row[column.key] !== undefined ? row[column.key] : 0; // Add 0 for missing cells
        return acc;
      }, {}),
      deviceName: row.deviceName || "Unknown Device", // Default to "Unknown Device" if deviceName is missing
      TotalDistance: totalDistance.toFixed(2),
    };

    // Add the row to the worksheet
    const addedRow = worksheet.addRow(rowData);

    // Apply alternate row styling
    if (index % 2 === 1) {
      addedRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F9F9F9" }, // Light gray background for alternate rows
      };
    }

    // Apply alignment and borders to all cells in the row
    addedRow.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Add a summary row for totals
  const totalRow = columns.reduce((acc, column) => {
    if (column.key === "deviceName") {
      acc[column.key] = "Total";
    } else if (column.key === "TotalDistance") {
      acc[column.key] = sortedData.reduce((sum, row) => {
        return sum + Object.keys(row).reduce((subtotal, key) => {
          if (key !== "deviceName") {
            const value = parseFloat(row[key] || 0);
            return subtotal + (isNaN(value) ? 0 : value);
          }
          return subtotal;
        }, 0);
      }, 0).toFixed(2);
    } else {
      acc[column.key] = sortedData.reduce((sum, row) => {
        const value = parseFloat(row[column.key] || 0);
        return sum + (isNaN(value) ? 0 : value);
      }, 0).toFixed(2);
    }
    return acc;
  }, {});
  const addedSummaryRow = worksheet.addRow(totalRow);

  // Style the summary row
  addedSummaryRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9EAD3" }, // Light green for totals
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Save the workbook
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "DistanceReport.xlsx");
};
  return (
    <div>
      <Button onClick={handleClick} variant="contained" color="error">
        Export
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={(event) => setSubMenuAnchorEl(event.currentTarget)}>
          PDF
        </MenuItem>
        <MenuItem onClick={handleExport}>Excel</MenuItem>
      </Menu>
      <Menu
        anchorEl={subMenuAnchorEl}
        open={Boolean(subMenuAnchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            exportToPDF("portrait");
            handleClose();
          }}
        >
          Portrait
        </MenuItem>
        <MenuItem
          onClick={() => {
            exportToPDF("landscape");
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
