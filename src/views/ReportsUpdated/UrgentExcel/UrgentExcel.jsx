


// import React, { useState } from "react";
// import { Table, TableHead, TableBody, TableRow, TableCell, Button, Modal, Box, Paper, TableContainer, IconButton, Switch } from "@mui/material";
// import { CloudUpload as CloudUploadIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon, Close as CloseIcon } from "@mui/icons-material";
// import * as XLSX from "xlsx";

// export const UrgentExcel = () => {
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [headers, setHeaders] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const firstSheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[firstSheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//       const importedHeaders = jsonData[0];
//       const importedData = jsonData.slice(1).map((row) => {
//         const rowData = {};
//         importedHeaders.forEach((header, index) => {
//           rowData[header] = row[index] || "";
//         });
//         return { ...rowData, isSelected: false };
//       });

//       setHeaders(importedHeaders);
//       setTableData(importedData);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleSelectAll = () => {
//     setSelectAll(!selectAll);
//     setTableData((prevData) =>
//       prevData.map((row) => ({ ...row, isSelected: !selectAll }))
//     );
//   };

//   const handleRowSelect = (index) => {
//     const newData = [...tableData];
//     newData[index].isSelected = !newData[index].isSelected;
//     setTableData(newData);
//   };

//   return (
//     <div>
//       <Button
//         variant="contained"
//         onClick={() => setImportModalOpen(true)}
//         sx={{ backgroundColor: "rgb(255, 165, 0)", marginRight: "10px" }}
//         startIcon={<CloudUploadIcon />}
//       >
//         Import
//       </Button>

//       <TableContainer component={Paper} sx={{ maxHeight: 470, border: "1.5px solid black", borderRadius: "7px" }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Switch checked={selectAll} onChange={handleSelectAll} color="primary" />
//               </TableCell>
//               {headers.map((header, index) => (
//                 <TableCell key={index} style={{ fontWeight: "bold", textAlign: "center" }}>
//                   {header}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {tableData.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={headers.length + 1} style={{ textAlign: "center", padding: "16px", fontSize: "16px", color: "#757575" }}>
//                   <h4>No Data Available</h4>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               tableData.map((row, index) => (
//                 <TableRow key={index} hover onClick={() => handleRowSelect(index)} selected={row.isSelected}>
//                   <TableCell padding="checkbox">
//                     <Switch checked={row.isSelected} color="primary" />
//                   </TableCell>
//                   {headers.map((header, cellIndex) => (
//                     <TableCell key={cellIndex} style={{ textAlign: "center" }}>
//                       {row[header]}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
//         <Box sx={{ width: "500px", margin: "100px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
//             <h2>Import Data</h2>
//             <IconButton onClick={() => setImportModalOpen(false)}>
//               <CloseIcon />
//             </IconButton>
//           </div>
//           <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//         </Box>
//       </Modal>
//     </div>
//   );
// };


// import React, { useState } from "react";
// import {
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Button,
//   Modal,
//   Box,
//   Paper,
//   TableContainer,
//   IconButton,
//   Switch,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
// } from "@mui/material";
// import {
//   CloudUpload as CloudUploadIcon,
//   Close as CloseIcon,
// } from "@mui/icons-material";
// import * as XLSX from "xlsx";

// export const UrgentExcel = () => {
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [headers, setHeaders] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // List of files available in the public folder
//   const availableFiles = [
//     "BS4 Nov-24 (1).xlsx",
//     "SOS Nov GPS Km.xlsx",
//   ];

//   // Fetch and load the selected file
//   const handleFileLoadFromPublic = async (fileName) => {
//     try {
//       const response = await fetch(`/${fileName}`);
//       const data = await response.arrayBuffer();
//       const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
//       const firstSheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[firstSheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//       const importedHeaders = jsonData[0];
//       const importedData = jsonData.slice(1).map((row) => {
//         const rowData = {};
//         importedHeaders.forEach((header, index) => {
//           rowData[header] = row[index] || "";
//         });
//         return { ...rowData, isSelected: false };
//       });

//       setHeaders(importedHeaders);
//       setTableData(importedData);
//       setImportModalOpen(false);
//     } catch (error) {
//       console.error("Error loading Excel file:", error);
//     }
//   };

//   const handleSelectAll = () => {
//     setSelectAll(!selectAll);
//     setTableData((prevData) =>
//       prevData.map((row) => ({ ...row, isSelected: !selectAll }))
//     );
//   };

//   const handleRowSelect = (index) => {
//     const newData = [...tableData];
//     newData[index].isSelected = !newData[index].isSelected;
//     setTableData(newData);
//   };

//   return (
//     <div>
//        <h1 style={{ textAlign: "center", marginTop: "80px" }}>
//         Student Detail{" "}
//       </h1>
//       <div >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//           }}
//         >
       
//            <TextField
//     label="Search"
//     variant="outlined"
//     value={filterText}
//     onChange={handleFilterChange}
//     sx={{
//       marginRight: "10px",
//       width: "200px", // Smaller width
//       '& .MuiOutlinedInput-root': {
//         height: '36px', // Set a fixed height to reduce it
//         padding: '0px', // Reduce padding to shrink height
//       },
//       '& .MuiInputLabel-root': {
//         top: '-6px', // Adjust label position
//         fontSize: '14px', // Slightly smaller label font
//       }
//     }}
//     InputProps={{
//       startAdornment: (
//         <SearchIcon
//           style={{
//             cursor: "pointer",
//             marginLeft: "10px",
//             marginRight: "5px",
//           }}
//         />
//       ),
//     }}
//   />
        
        

//           <Button
//             variant="contained"
//             color="error"
           
//             sx={{ marginRight: "10px" }}
//             startIcon={<DeleteIcon />}
//           >
//             Delete
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
         
//             sx={{ marginRight: "10px" }}
//             startIcon={<EditIcon />}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="contained"
//             color="success"
          
//             sx={{ marginRight: "10px" }}
//             startIcon={<AddCircleIcon />}
//           >
//             Add
//           </Button>
          
//           <Button variant="contained" color="primary" >
//             Export
//           </Button>
//         </div>
//         </div>
//       <Button
//         variant="contained"
//         onClick={() => setImportModalOpen(true)}
//         sx={{ backgroundColor: "rgb(255, 165, 0)", marginRight: "10px" }}
//         startIcon={<CloudUploadIcon />}
//       >
//         Import
//       </Button>

//       <TableContainer
//         component={Paper}
//         sx={{ maxHeight: 470, border: "1.5px solid black", borderRadius: "7px" }}
//       >
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Switch checked={selectAll} onChange={handleSelectAll} color="primary" />
//               </TableCell>
//               {headers.map((header, index) => (
//                 <TableCell key={index} style={{ fontWeight: "bold", textAlign: "center" }}>
//                   {header}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {tableData.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={headers.length + 1}
//                   style={{ textAlign: "center", padding: "16px", fontSize: "16px", color: "#757575" }}
//                 >
//                   <h4>No Data Available</h4>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               tableData.map((row, index) => (
//                 <TableRow
//                   key={index}
//                   hover
//                   onClick={() => handleRowSelect(index)}
//                   selected={row.isSelected}
//                 >
//                   <TableCell padding="checkbox">
//                     <Switch checked={row.isSelected} color="primary" />
//                   </TableCell>
//                   {headers.map((header, cellIndex) => (
//                     <TableCell key={cellIndex} style={{ textAlign: "center" }}>
//                       {row[header]}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
//         <Box
//           sx={{
//             width: "400px",
//             margin: "100px auto",
//             padding: "20px",
//             backgroundColor: "#fff",
//             borderRadius: "8px",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
//             <h2>Select a File to Import</h2>
//             <IconButton onClick={() => setImportModalOpen(false)}>
//               <CloseIcon />
//             </IconButton>
//           </div>
//           <List>
//             {availableFiles.map((fileName, index) => (
//               <ListItem key={index} disablePadding>
//                 <ListItemButton onClick={() => handleFileLoadFromPublic(fileName)}>
//                   <ListItemText primary={fileName} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Modal>
//     </div>
//   );
// };
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  Box,
  Paper,
  TableContainer,
  IconButton,
  Switch,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AddCircle as AddCircleIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";

export const UrgentExcel = () => {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterText, setFilterText] = useState("");

  // List of files available in the public folder
  const availableFiles = ["BS4 Nov-24 (1).xlsx", "SOS Nov GPS Km.xlsx","hbtrack_Vehicle List.xlsx","studentDetail.xlsx","jnmc-01_11_24-30_11_24-TSR.xlsx","Hansa GPS Km Nov-2024.xlsx"];

  // Fetch and load the selected file
  const handleFileLoadFromPublic = async (fileName) => {
    try {
      const response = await fetch(`/${fileName}`);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const importedHeaders = jsonData[0];
      const importedData = jsonData.slice(1).map((row) => {
        const rowData = {};
        importedHeaders.forEach((header, index) => {
          rowData[header] = row[index] || "";
        });
        return { ...rowData, isSelected: false };
      });

      setHeaders(importedHeaders);
      setTableData(importedData);
      setImportModalOpen(false);
    } catch (error) {
      console.error("Error loading Excel file:", error);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setTableData((prevData) =>
      prevData.map((row) => ({ ...row, isSelected: !selectAll }))
    );
  };

  const handleRowSelect = (index) => {
    const newData = [...tableData];
    newData[index].isSelected = !newData[index].isSelected;
    setTableData(newData);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Kilometer and GPS</h1>

      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <TextField
            label="Search"
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
            sx={{
              marginRight: "10px",
              width: "200px",
              "& .MuiOutlinedInput-root": {
                height: "36px",
              },
              "& .MuiInputLabel-root": {
                top: "-6px",
                fontSize: "14px",
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon style={{ cursor: "pointer", marginRight: "5px" }} />,
            }}
          />

          <Button variant="contained" color="error" sx={{ marginRight: "10px" }} startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button variant="contained" color="primary" sx={{ marginRight: "10px" }} startIcon={<EditIcon />}>
            Edit
          </Button>
          <Button variant="contained" color="success" sx={{ marginRight: "10px" }} startIcon={<AddCircleIcon />}>
            Add
          </Button>
          <Button variant="contained" color="primary">
            Export
          </Button>
          <Button
        variant="contained"
        onClick={() => setImportModalOpen(true)}
        sx={{ backgroundColor: "rgb(255, 165, 0)", marginRight: "10px",marginLeft:"4px" }}
        startIcon={<CloudUploadIcon />}
      >
        Import
      </Button>
        </div>
      </div>

     

      <TableContainer component={Paper} sx={{ maxHeight: 470, border: "1.5px solid black", borderRadius: "7px" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Switch checked={selectAll} onChange={handleSelectAll} color="primary" />
              </TableCell>
              {headers.map((header, index) => (
                <TableCell key={index} style={{ fontWeight: "bold", textAlign: "center" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length + 1} style={{ textAlign: "center", padding: "16px", fontSize: "16px", color: "#757575" }}>
                  <h4>No Data Available</h4>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow key={index} hover onClick={() => handleRowSelect(index)} selected={row.isSelected}>
                  <TableCell padding="checkbox">
                    <Switch checked={row.isSelected} color="primary" />
                  </TableCell>
                  {headers.map((header, cellIndex) => (
                    <TableCell key={cellIndex} style={{ textAlign: "center" }}>
                      {row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
        <Box sx={{ width: "400px", margin: "100px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <h2>Select a File to Import</h2>
            <IconButton onClick={() => setImportModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <List>
            {availableFiles.map((fileName, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleFileLoadFromPublic(fileName)}>
                  <ListItemText primary={fileName} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </div>
  );
};
