
// import React, { useState, useEffect, useContext, Component } from "react";
// import axios from "axios";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import TextField from "@mui/material/TextField";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import Button from "@mui/material/Button";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Switch from "@mui/material/Switch";
// import { COLUMNS } from "./columns";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ImportExportIcon from "@mui/icons-material/ImportExport";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import * as XLSX from "xlsx";
// import Alert from "@mui/material/Alert";
// import Snackbar from "@mui/material/Snackbar";
// import { TotalResponsesContext } from "../../../../TotalResponsesContext";
// import CircularProgress from "@mui/material/CircularProgress";
// import CloseIcon from "@mui/icons-material/Close";
// import { IconButton } from "@mui/material";

// //import { TextField } from '@mui/material';

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   height: "80%",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   overflowY: "auto", // Enable vertical scrolling
//   display: "flex",
//   flexDirection: "column",
//   padding: "1rem",
// };

// export const Geofence = () => {
//   const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [filterText, setFilterText] = useState("");
//   const [filteredRows, setFilteredRows] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });
//   const [columnVisibility, setColumnVisibility] = useState(
//     Object.fromEntries(COLUMNS().map((col) => [col.accessor, true]))
//   );
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectAll, setSelectAll] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importData, setImportData] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [originalRows, setOriginalRows] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const { role } = useContext(TotalResponsesContext);

  
//   const fetchData = async (startDate = "", endDate = "") => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       let response;
      
//       // Fetch data based on role
//       if (role == 1) {
//         response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else if (role == 2) {
//         response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/geofences`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else if (role == 3) {
//         response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/geofences`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
  
//       console.log("fetch data", response.data);
  
//       if (response.data) {
//         // Flatten the data grouped by deviceId
//         const allData = Object.values(response.data).flat();
  
//         // Filter by date range if provided
//         const filteredData =
//           startDate || endDate
//             ? allData.filter((row) => {
//                 const registrationDate = parseDate(row.requestDate);
//                 const start = parseDate(startDate);
//                 const end = parseDate(endDate);
  
//                 return (
//                   (!startDate || registrationDate >= start) &&
//                   (!endDate || registrationDate <= end)
//                 );
//               })
//             : allData;
  
//         const reversedData = filteredData.reverse();
  
//         // Set the filtered and original rows
//         setFilteredRows(
//           reversedData.map((row) => ({ ...row, isSelected: false }))
//         );
//         setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
//         setTotalResponses(reversedData.length);
  
//         // Log the filtered data
//         console.log(`Data fetched between ${startDate} and ${endDate}:`);
//         console.log(filteredData);
//       } else {
//         console.error("Expected data but got:", response.data);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false); // Set loading to false after fetching completes
//     }
//   };
  
//   const parseDate = (dateString) => {
//     const [day, month, year] = dateString.split("-").map(Number);
//     return new Date(year, month - 1, day); // Months are 0-indexed
//   };

//   const handleApplyDateRange = () => {
//     const startDate = document.getElementById("startDate").value;
//     const endDate = document.getElementById("endDate").value;

//     // If either date is empty, fetch all data
//     if (!startDate && !endDate) {
//       fetchData(); // Fetch all data
//     } else {
//       // Convert to desired format if values are not empty
//       const formattedStartDate = startDate ? formatDate(startDate) : "";
//       const formattedEndDate = endDate ? formatDate(endDate) : "";

//       fetchData(formattedStartDate, formattedEndDate);
//     }
//   };

//   const formatDate = (dateString) => {
//     const [year, month, day] = dateString.split("-").map(Number);
//     return `${day}-${month}-${year}`;
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterData(filterText);
//   }, [filterText]);

//   useEffect(() => {
//     fetchData(); // Fetch data when startDate or endDate changes
//   }, [startDate, endDate]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleFilterChange = (event) => {
//     const text = event.target.value;
//     setFilterText(text);
//   };

//   const filterData = (text) => {
//     let dataToFilter = originalRows;

//     if (startDate && endDate) {
//       dataToFilter = dataToFilter.filter((row) => {
//         const rowDate = new Date(row.dateOfBirth); // Replace `row.date` with the actual date field
//         return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
//       });
//     }

//     if (text === "") {
//       setFilteredRows(dataToFilter); // Reset to filtered data
//     } else {
//       const filteredData = dataToFilter
//         .filter((row) =>
//           Object.values(row).some(
//             (val) =>
//               typeof val === "string" &&
//               val.toLowerCase().includes(text.toLowerCase())
//           )
//         )
//         .map((row) => ({ ...row, isSelected: false }));
//       setFilteredRows(filteredData);
//     }
//   };

//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleColumnVisibilityChange = (accessor) => {
//     setColumnVisibility((prevState) => ({
//       ...prevState,
//       [accessor]: !prevState[accessor],
//     }));
//   };

//   const handleRowSelect = (index) => {
//     const newFilteredRows = [...filteredRows];
//     newFilteredRows[index].isSelected = !newFilteredRows[index].isSelected;
//     setFilteredRows(newFilteredRows);
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     const newFilteredRows = filteredRows.map((row) => ({
//       ...row,
//       isSelected: newSelectAll,
//     }));
//     setFilteredRows(newFilteredRows);
//     setSelectAll(newSelectAll);
//   };

//   const handleEditButtonClick = () => {
//     const selected = filteredRows.find((row) => row.isSelected);
//     if (selected) {
//       setSelectedRow(selected);
//       setFormData(selected);
//       setEditModalOpen(true);
//     } else {
//       setSnackbarOpen(true);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     // Log filteredRows to check its structure
//     console.log("Filtered rows:", filteredRows);

//     // Get selected row IDs
//     const selectedIds = filteredRows
//       .filter((row) => row.isSelected)
//       .map((row) => {
//         // Log each row to check its structure
//         console.log("Processing row:", row);
//         return row._id; // Ensure id exists and is not undefined
//       });

//     console.log("Selected IDs:", selectedIds);

//     if (selectedIds.length === 0) {
//       alert("No rows selected for deletion.");
//       return;
//     }
//     const userConfirmed = window.confirm(
//       `Are you sure you want to delete ${selectedIds.length} record(s)?`
//     );

//     if (!userConfirmed) {
//       // If the user clicks "Cancel", exit the function
//       return;
//     }
//     try {
//       // Define the API endpoint and token
//       const apiUrl =
//         "https://schoolmanagement-4-pzsf.onrender.com/school/delete";
//       const token =
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0"; // Replace with actual token

//       // Send delete requests for each selected ID
//       const deleteRequests = selectedIds.map((id) =>
//         fetch(`${apiUrl}/${id}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }).then((response) => {
//           if (!response.ok) {
//             throw new Error(
//               `Error deleting record with ID ${id}: ${response.statusText}`
//             );
//           }
//           return response.json();
//         })
//       );

//       // Wait for all delete requests to complete
//       await Promise.all(deleteRequests);

//       // Filter out deleted rows
//       const newFilteredRows = filteredRows.filter((row) => !row.isSelected);

//       // Update state
//       setFilteredRows(newFilteredRows);
//       setSelectAll(false);

//       alert("Selected records deleted successfully.");
//     } catch (error) {
//       console.error("Error during deletion:", error);
//       alert("Failed to delete selected records.");
//     }
//     fetchData();
//   };

//   const handleExport = () => {
//     const dataToExport = filteredRows.map((row) => {
//       const { isSelected, ...rowData } = row;
//       return rowData;
//     });
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "ApprovedRequest.xlsx");
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetNames = workbook.SheetNames;
//         const sheet = workbook.Sheets[sheetNames[0]];
//         const parsedData = XLSX.utils.sheet_to_json(sheet);
//         setImportData(parsedData);
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   };

//   const sortedData = [...filteredRows];
//   if (sortConfig.key !== null) {
//     sortedData.sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? 1 : -1;
//       }
//       return 0;
//     });
//   }

//   const handleAddButtonClick = () => {
//     setFormData({});
//     setAddModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setEditModalOpen(false);
//     setAddModalOpen(false);
//     setFormData({});
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleEditSubmit = async () => {
//     // Define the API URL and authentication token
//     const apiUrl = `https://schoolmanagement-4-pzsf.onrender.com/school/update-child/${selectedRow._id}`; // Replace with your actual API URL
//     const token =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0"; // Replace with your actual authentication token

//     // Prepare the updated data
//     const updatedData = {
//       ...formData,
//       isSelected: false,
//     };

//     try {
//       // Perform the PUT request
//       const response = await fetch(apiUrl, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedData),
//       });

//       // Check if the response is okay (status code 200-299)
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Optionally: Process the response data if needed
//       const result = await response.json();
//       console.log("Update successful:", result);
//       alert("updated successfully");
//       // Update local state after successful API call
//       const updatedRows = filteredRows.map((row) =>
//         row.id === selectedRow.id
//           ? { ...row, ...formData, isSelected: false }
//           : row
//       );
//       setFilteredRows(updatedRows);

//       // Close the modal
//       handleModalClose();
//       fetchData();
//     } catch (error) {
//       console.error("Error updating row:", error);
//       alert("error updating code");
//       // Optionally: Handle the error (e.g., show a notification or message to the user)
//     }
//     fetchData();
//   };

//   const handleAddSubmit = async () => {
//     try {
//       const newRow = {
//         ...formData,
//         id: filteredRows.length + 1,
//         isSelected: false,
//       };

//       // POST request to the server
//       const response = await fetch(
//         "https://schoolmanagement-4-pzsf.onrender.com/parent/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(newRow),
//         }
//       );
//       alert("record created successfully");

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       // Assuming the server returns the created object
//       const result = await response.json();

//       // Update the state with the new row
//       setFilteredRows([...filteredRows, result]);

//       // Close the modal
//       handleModalClose();
//       fetchData();
//       console.log("error occured in post method");
//     } catch (error) {
//       console.error("Error during POST request:", error);
//       alert("unable to create record");
//       // Handle the error appropriately (e.g., show a notification to the user)
//     }
//   };

//   return (
//     <>
//       <h1 style={{ textAlign: "center", marginTop: "80px" }}>
//         Geofences
//       </h1>
//       <div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//           }}
//         >
//           <TextField
//             label="Search"
//             variant="outlined"
//             value={filterText}
//             onChange={handleFilterChange}
//             sx={{ marginRight: "10px", width: "300px" }}
//             InputProps={{
//               startAdornment: (
//                 <SearchIcon
//                   style={{
//                     cursor: "pointer",
//                     marginLeft: "10px",
//                     marginRight: "5px",
//                   }}
//                 />
//               ),
//             }}
//           />
//           <Button
//             onClick={() => setModalOpen(true)}
//             sx={{
//               backgroundColor: "rgb(85, 85, 85)",
//               color: "white",
//               fontWeight: "bold",
//               marginRight: "10px",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             <ImportExportIcon />
//             Column Visibility
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleDeleteSelected}
//             sx={{ marginRight: "10px" }}
//             startIcon={<DeleteIcon />}
//           >
//             Delete
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleEditButtonClick}
//             sx={{ marginRight: "10px" }}
//             startIcon={<EditIcon />}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleAddButtonClick}
//             sx={{ marginRight: "10px" }}
//             startIcon={<AddCircleIcon />}
//           >
//             Add
//           </Button>
//           <Button
//             variant="contained"
//             onClick={() => setImportModalOpen(true)}
//             sx={{ backgroundColor: "rgb(255, 165, 0)", marginRight: "10px" }}
//             startIcon={<CloudUploadIcon />}
//           >
//             Import
//           </Button>
//           <Button variant="contained" color="primary" onClick={handleExport}>
//             Export
//           </Button>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//           }}
//         >
//           <input
//             type="date"
//             id="startDate"
//             placeholder="DD-MM-YYYY"
//             style={{
//               width: "140px",
//               marginRight: "10px",
//               padding: "2px",
//               marginLeft: "3px",
//               border: " 0.1px solid black",
//               borderRadius: "3px",
//             }}
//           />
//           <input
//             type="date"
//             id="endDate"
//             placeholder="DD-MM-YYYY"
//             style={{
//               width: "140px",
//               marginRight: "10px",
//               padding: "2px",
//               marginLeft: "3px",
//               border: " 0.1px solid black",
//               borderRadius: "3px",
//             }}
//           />
//           <button
//             onClick={handleApplyDateRange}
//             style={{
//               backgroundColor: "#1976d2",
//               color: "white",
//               border: "none",
//               padding: "6px 10px",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Apply Date Range
//           </button>
//         </div>

//         {loading ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginTop: "20px",
//             }}
//           >
//             <CircularProgress />
//           </div>
//         ) : (
//           <>
//             <TableContainer
//               component={Paper}
//               sx={{
//                 maxHeight: 440,
//                 border: "1.5px solid black",
//                 borderRadius: "7px",
//               }}
//             >
//               <Table
//                 stickyHeader
//                 aria-label="sticky table"
//                 style={{ border: "1px solid black" }}
//               >
//                 <TableHead>
//                   <TableRow
//                     style={{
//                       borderBottom: "1px solid black",
//                       borderTop: "1px solid black",
//                     }}
//                   >
//                     <TableCell
//                       padding="checkbox"
//                       style={{
//                         borderRight: "1px solid #e0e0e0",
//                         borderBottom: "2px solid black",
//                       }}
//                     >
//                       <Switch
//                         checked={selectAll}
//                         onChange={handleSelectAll}
//                         color="primary"
//                       />
//                     </TableCell>
//                     <TableCell
//                       style={{
//                         minWidth: 70, // Adjust width if needed
//                         borderRight: "1px solid #e0e0e0",
//                         borderBottom: "2px solid black",
//                         padding: "4px 4px",
//                         textAlign: "center",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       S.No.
//                     </TableCell>
//                     {COLUMNS()
//                       .filter((col) => columnVisibility[col.accessor])
//                       .map((column) => (
//                         <TableCell
//                           key={column.accessor}
//                           align={column.align}
//                           style={{
//                             minWidth: column.minWidth,
//                             cursor: "pointer",
//                             borderRight: "1px solid #e0e0e0",
//                             borderBottom: "2px solid black",
//                             padding: "4px 4px",
//                             textAlign: "center",
//                             fontWeight: "bold",
//                           }}
//                           onClick={() => requestSort(column.accessor)}
//                         >
//                           {column.Header}
//                           {sortConfig.key === column.accessor ? (
//                             sortConfig.direction === "ascending" ? (
//                               <ArrowUpwardIcon fontSize="small" />
//                             ) : (
//                               <ArrowDownwardIcon fontSize="small" />
//                             )
//                           ) : null}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {sortedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={
//                           COLUMNS().filter(
//                             (col) => columnVisibility[col.accessor]
//                           ).length
//                         }
//                         style={{
//                           textAlign: "center",
//                           padding: "16px",
//                           fontSize: "16px",
//                           color: "#757575",
//                           // fontStyle: 'italic',
//                         }}
//                       >
//                         {/* <img src="emptyicon.png" alt="" /> */}
//                         <h4>No Data Available</h4>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     sortedData
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((row, index) => (
//                         <TableRow
//                           hover
//                           role="checkbox"
//                           tabIndex={-1}
//                           key={row.id}
//                           onClick={() =>
//                             handleRowSelect(page * rowsPerPage + index)
//                           }
//                           selected={row.isSelected}
//                           style={{
//                             backgroundColor:
//                               index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                             borderBottom: "none", // White for even rows, light grey for odd rows
//                           }}
//                         >
//                           <TableCell
//                             padding="checkbox"
//                             style={{ borderRight: "1px solid #e0e0e0" }}
//                           >
//                             <Switch checked={row.isSelected} color="primary" />
//                           </TableCell>
//                           <TableCell
//                             style={{
//                               minWidth: 70, // Adjust width if needed
//                               borderRight: "1px solid #e0e0e0",
//                               paddingTop: "4px",
//                               paddingBottom: "4px",
//                               borderBottom: "none",
//                               textAlign: "center",
//                               fontSize: "smaller",
//                               backgroundColor:
//                                 index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                               // borderBottom: "none",
//                             }}
//                           >
//                             {page * rowsPerPage + index + 1}{" "}
//                             {/* Serial number starts from 1 */}
//                           </TableCell>
//                           {COLUMNS()
//                             .filter((col) => columnVisibility[col.accessor])
//                             .map((column) => {
//                               const value = row[column.accessor];
//                               return (
//                                 <TableCell
//                                   key={column.accessor}
//                                   align={column.align}
//                                   style={{
//                                     borderRight: "1px solid #e0e0e0",
//                                     paddingTop: "4px",
//                                     paddingBottom: "4px",
//                                     borderBottom: "none",
//                                     backgroundColor:
//                                       index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                                     fontSize: "smaller", // White for even rows, light grey for odd rows
//                                   }}
//                                 >
//                                   {column.format && typeof value === "number"
//                                     ? column.format(value)
//                                     : value}
//                                 </TableCell>
//                               );
//                             })}
//                         </TableRow>
//                       ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[10, 25, 100]}
//               component="div"
//               count={sortedData.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//             {/* //</></div> */}
//           </>
//         )}
//         <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//           <Box sx={style}>
//             <h2>Column Visibility</h2>
//             {COLUMNS().map((col) => (
//               <div key={col.accessor}>
//                 <Switch
//                   checked={columnVisibility[col.accessor]}
//                   onChange={() => handleColumnVisibilityChange(col.accessor)}
//                   color="primary"
//                 />
//                 {col.Header}
//               </div>
//             ))}
//           </Box>
//         </Modal>
//         <Modal open={editModalOpen} onClose={handleModalClose}>
//           <Box sx={style}>
//             {/* <h2>Edit Row</h2> */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: "20px",
//               }}
//             >
//               <h2 style={{ flexGrow: 1 }}>Edit Row</h2>
//               <IconButton onClick={handleModalClose}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//             {COLUMNS()
//               .slice(0, -1)
//               .map((col) => (
//                 <TextField
//                   key={col.accessor}
//                   label={col.Header}
//                   variant="outlined"
//                   name={col.accessor}
//                   value={formData[col.accessor] || ""}
//                   onChange={handleInputChange}
//                   sx={{ marginBottom: "10px" }}
//                   fullWidth
//                 />
//               ))}
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleEditSubmit}
//             >
//               Submit
//             </Button>
//           </Box>
//         </Modal>
//         <Modal open={addModalOpen} onClose={handleModalClose}>
//           <Box sx={style}>
//             {/* <h2>Add Row</h2> */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: "20px",
//               }}
//             >
//               <h2 style={{ flexGrow: 1 }}>Add Row</h2>
//               <IconButton onClick={handleModalClose}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//             {COLUMNS()
//               .slice(0, -1)
//               .map((col) => (
//                 <TextField
//                   key={col.accessor}
//                   label={col.Header}
//                   variant="outlined"
//                   name={col.accessor}
//                   value={formData[col.accessor] || ""}
//                   onChange={handleInputChange}
//                   sx={{ marginBottom: "10px" }}
//                   fullWidth
//                 />
//               ))}
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleAddSubmit}
//             >
//               Submit
//             </Button>
//           </Box>
//         </Modal>
//         <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
//           <Box sx={style}>
//             <h2>Import Data</h2>
//             <input type="file" onChange={handleFileUpload} />
//             {importData.length > 0 && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() =>
//                   setFilteredRows([
//                     ...filteredRows,
//                     ...importData.map((row) => ({ ...row, isSelected: false })),
//                   ])
//                 }
//                 sx={{ marginTop: "10px" }}
//               >
//                 Import
//               </Button>
//             )}
//           </Box>
//         </Modal>
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={3000}
//           onClose={handleSnackbarClose}
//         >
//           <Alert onClose={handleSnackbarClose} severity="warning">
//             Please select a row to edit!
//           </Alert>
//         </Snackbar>
//       </div>
//     </>
//   );
// };



// import React, { useState, useEffect, useContext, Component } from "react";
// import axios from "axios";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import TextField from "@mui/material/TextField";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import Button from "@mui/material/Button";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Switch from "@mui/material/Switch";
// import { COLUMNS } from "./columns";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ImportExportIcon from "@mui/icons-material/ImportExport";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import * as XLSX from "xlsx";
// import Alert from "@mui/material/Alert";
// import Snackbar from "@mui/material/Snackbar";
// import { TotalResponsesContext } from "../../../../TotalResponsesContext";
// import CircularProgress from "@mui/material/CircularProgress";
// import CloseIcon from "@mui/icons-material/Close";
// import { IconButton } from "@mui/material";

// //import { TextField } from '@mui/material';

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   height: "80%",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   overflowY: "auto", // Enable vertical scrolling
//   display: "flex",
//   flexDirection: "column",
//   padding: "1rem",
// };

// export const Geofence = () => {
//   const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [filterText, setFilterText] = useState("");
//   const [filteredRows, setFilteredRows] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });
//   const [columnVisibility, setColumnVisibility] = useState(
//     Object.fromEntries(COLUMNS().map((col) => [col.accessor, true]))
//   );
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectAll, setSelectAll] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importData, setImportData] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [originalRows, setOriginalRows] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const { role } = useContext(TotalResponsesContext);

//   console.log("abhi dekh : ", role);

  
//   const fetchData = async (startDate = "", endDate = "") => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       let response;
      
//       // Fetch data based on role
//       if (role == 1) {
//         response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else if (role == 2) {
//         response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/geofences`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else if (role == 3) {
//         response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/geofences`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
  
//       console.log("fetch data", response.data);
//       if (response?.data) {
//         let allData;
      
//         // Logic for role 1: Devices and stops
//         if (role ==1) {
//           allData = Object.entries(response.data).flatMap(([deviceId, stops]) =>
//             stops.map((stop) => ({
//               ...stop, // Retain all stop properties
//               deviceId, // Add deviceId to each stop
//             }))
//           );
      
//         // Logic for role 2: Branches and geofences
//         } else if (role == 2) {
//           allData = response?.data?.branches.flatMap(branch => 
//             branch.geofences?.map(geofence => ({
//               ...geofence, // Retain all geofence properties
//               branchId: branch.branchId, // Add branchId to each geofence
//               branchName: branch.branchName, // Add branchName to each geofence
//             })) || [] // Handle the case where geofences is undefined or empty
//           );
      
//         // Logic for role 3: Branches and devices
//         } 
       
//         else if (role == 3) {
//           allData = response?.data.devices.flatMap((device) =>
//             device.geofences.length > 0
//               ? device.geofences.map((geofence) => ({
//                   // Retain geofence properties
//                   ...geofence,
//                   deviceId: device.deviceId, // Associate geofence with its deviceId
//                   // branchId: branch.branchId, // Uncomment if you need branchId
//                   // branchName: branch.branchName, // Uncomment if you need branchName
//                 }))
//               : [] // Simply return an empty array for devices with no geofences
//           );
        
        
//           console.log(allData);
//         }
        
        
        
   
      
//         console.log(allData);
      
//         // Filter data by date range, if applicable
//         const filteredData = startDate || endDate
//           ? allData.filter((row) => {
//               const registrationDate = parseDate(row.formattedRegistrationDate);
//               const start = parseDate(startDate);
//               const end = parseDate(endDate);
      
//               return (
//                 (!startDate || registrationDate >= start) &&
//                 (!endDate || registrationDate <= end)
//               );
//             })
//           : allData; // Use all data if no date range specified
      
//         const reversedData = filteredData.reverse();
      
//         // Set filtered data and original data with default selection
//         setFilteredRows(
//           reversedData.map((row) => ({ ...row, isSelected: false }))
//         );
//         setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
      
//         setTotalResponses(reversedData.length);
        
//         console.log(`Data fetched between ${startDate} and ${endDate}:`, filteredData);
      
//       } else {
//         console.error("Expected an array but got:", response.data.children);
//       }
    
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false); // Set loading to false after fetching completes
//     }
//   };
  
//   const parseDate = (dateString) => {
//     const [day, month, year] = dateString.split("-").map(Number);
//     return new Date(year, month - 1, day); // Months are 0-indexed
//   };

//   const handleApplyDateRange = () => {
//     const startDate = document.getElementById("startDate").value;
//     const endDate = document.getElementById("endDate").value;

//     // If either date is empty, fetch all data
//     if (!startDate && !endDate) {
//       fetchData(); // Fetch all data
//     } else {
//       // Convert to desired format if values are not empty
//       const formattedStartDate = startDate ? formatDate(startDate) : "";
//       const formattedEndDate = endDate ? formatDate(endDate) : "";

//       fetchData(formattedStartDate, formattedEndDate);
//     }
//   };

//   const formatDate = (dateString) => {
//     const [year, month, day] = dateString.split("-").map(Number);
//     return `${day}-${month}-${year}`;
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterData(filterText);
//   }, [filterText]);

//   useEffect(() => {
//     fetchData(); // Fetch data when startDate or endDate changes
//   }, [startDate, endDate]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleFilterChange = (event) => {
//     const text = event.target.value;
//     setFilterText(text);
//   };

//   const filterData = (text) => {
//     let dataToFilter = originalRows;

//     if (startDate && endDate) {
//       dataToFilter = dataToFilter.filter((row) => {
//         const rowDate = new Date(row.dateOfBirth); // Replace `row.date` with the actual date field
//         return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
//       });
//     }

//     if (text === "") {
//       setFilteredRows(dataToFilter); // Reset to filtered data
//     } else {
//       const filteredData = dataToFilter
//         .filter((row) =>
//           Object.values(row).some(
//             (val) =>
//               typeof val === "string" &&
//               val.toLowerCase().includes(text.toLowerCase())
//           )
//         )
//         .map((row) => ({ ...row, isSelected: false }));
//       setFilteredRows(filteredData);
//     }
//   };

//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleColumnVisibilityChange = (accessor) => {
//     setColumnVisibility((prevState) => ({
//       ...prevState,
//       [accessor]: !prevState[accessor],
//     }));
//   };

//   const handleRowSelect = (index) => {
//     const newFilteredRows = [...filteredRows];
//     newFilteredRows[index].isSelected = !newFilteredRows[index].isSelected;
//     setFilteredRows(newFilteredRows);
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     const newFilteredRows = filteredRows.map((row) => ({
//       ...row,
//       isSelected: newSelectAll,
//     }));
//     setFilteredRows(newFilteredRows);
//     setSelectAll(newSelectAll);
//   };

 

 

//   const handleExport = () => {
//     const dataToExport = filteredRows.map((row) => {
//       const { isSelected, ...rowData } = row;
//       return rowData;
//     });
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "ApprovedRequest.xlsx");
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetNames = workbook.SheetNames;
//         const sheet = workbook.Sheets[sheetNames[0]];
//         const parsedData = XLSX.utils.sheet_to_json(sheet);
//         setImportData(parsedData);
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   };

//   const sortedData = [...filteredRows];
//   if (sortConfig.key !== null) {
//     sortedData.sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? 1 : -1;
//       }
//       return 0;
//     });
//   }

 

 

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

 

 

//   return (
//     <>
//       <h1 style={{ textAlign: "center", marginTop: "80px" }}>
//         Geofences
//       </h1>
//       <div>
//         {/* <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//           }}
//         >
//           <TextField
//             label="Search"
//             variant="outlined"
//             value={filterText}
//             onChange={handleFilterChange}
//             sx={{ marginRight: "10px", width: "300px" }}
//             InputProps={{
//               startAdornment: (
//                 <SearchIcon
//                   style={{
//                     cursor: "pointer",
//                     marginLeft: "10px",
//                     marginRight: "5px",
//                   }}
//                 />
//               ),
//             }}
//           />
//           <Button
//             onClick={() => setModalOpen(true)}
//             sx={{
//               backgroundColor: "rgb(85, 85, 85)",
//               color: "white",
//               fontWeight: "bold",
//               marginRight: "10px",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             <ImportExportIcon />
//             Column Visibility
//           </Button>
         
//           <Button variant="contained" color="success" onClick={handleExport}>
//             Export
//           </Button>
//            <input
//             type="date"
//             id="startDate"
//             placeholder="DD-MM-YYYY"
//             style={{
//               width: "140px",
//               marginRight: "10px",
//               padding: "2px",
//               marginLeft: "3px",
//               border: " 0.1px solid black",
//               borderRadius: "3px",
//             }}
//           />
//           <input
//             type="date"
//             id="endDate"
//             placeholder="DD-MM-YYYY"
//             style={{
//               width: "140px",
//               marginRight: "10px",
//               padding: "2px",
//               marginLeft: "3px",
//               border: " 0.1px solid black",
//               borderRadius: "3px",
//             }}
//           />
//           <button
//             onClick={handleApplyDateRange}
//             style={{
//               backgroundColor: "#1976d2",
//               color: "white",
//               border: "none",
//               padding: "6px 10px",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Apply Date Range
//           </button>
//         </div> */}
//         {/* <div
//   style={{
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "10px",
//     flexWrap: "wrap", // To wrap if the screen gets smaller
//   }}
// >
//   <TextField
//     label="Search"
//     variant="outlined"
//     value={filterText}
//     onChange={handleFilterChange}
//     sx={{ marginRight: "10px", width: "200px" }} // Reduced width
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

//   <Button
//     onClick={() => setModalOpen(true)}
//     sx={{
//       backgroundColor: "rgb(85, 85, 85)",
//       color: "white",
//       fontWeight: "bold",
//       marginRight: "10px",
//       display: "flex",
//       alignItems: "center",
//       gap: "5px", // Reduced gap
//       padding: "6px 12px", // Adjusted padding for a more compact look
//     }}
//   >
//     <ImportExportIcon />
//     Column Visibility
//   </Button>

//   <Button
//     variant="contained"
//     color="success"
//     onClick={handleExport}
//     sx={{
//       padding: "6px 12px", // Adjusted padding for consistency
//       marginRight: "10px",
//     }}
//   >
//     Export
//   </Button>

//   <input
//     type="date"
//     id="startDate"
//     placeholder="DD-MM-YYYY"
//     style={{
//       width: "130px", // Reduced width slightly
//       marginRight: "10px",
//       padding: "6px 10px",
//       marginLeft: "3px",
//       border: "0.1px solid black",
//       borderRadius: "3px",
//     }}
//   />
  
//   <input
//     type="date"
//     id="endDate"
//     placeholder="DD-MM-YYYY"
//     style={{
//       width: "130px", // Reduced width slightly
//       marginRight: "10px",
//       padding: "6px 10px",
//       marginLeft: "3px",
//       border: "0.1px solid black",
//       borderRadius: "3px",
//     }}
//   />

//   <button
//     onClick={handleApplyDateRange}
//     style={{
//       backgroundColor: "#1976d2",
//       color: "white",
//       border: "none",
//       padding: "6px 12px", // Adjusted padding for consistency
//       borderRadius: "5px",
//       cursor: "pointer",
//     }}
//   >
//     Apply Date Range
//   </button>
// </div> */}
// <div
//   style={{
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "10px",
//     flexWrap: "wrap", // To wrap if the screen gets smaller
//   }}
// >
//   <TextField
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

//   <Button
//     onClick={() => setModalOpen(true)}
//     sx={{
//       backgroundColor: "rgb(85, 85, 85)",
//       color: "white",
//       fontWeight: "bold",
//       marginRight: "10px",
//       display: "flex",
//       alignItems: "center",
//       gap: "5px",
//       padding: "6px 12px",
//       '&:hover': {
//         backgroundColor: "rgb(100, 100, 100)", // Lighter shade on hover
//       },
//     }}
//   >
//     <ImportExportIcon />
//     Column Visibility
//   </Button>

//   <Button
//     variant="contained"
//     color="success"
//     onClick={handleExport}
//     sx={{
//       padding: "6px 12px",
//       marginRight: "10px",
//     }}
//   >
//     Export
//   </Button>

//   <input
//     type="date"
//     id="startDate"
//     placeholder="DD-MM-YYYY"
//     style={{
//       width: "130px",
//       marginRight: "10px",
//       padding: "6px 10px",
//       marginLeft: "3px",
//       border: "0.1px solid black",
//       borderRadius: "3px",
//     }}
//   />

//   <input
//     type="date"
//     id="endDate"
//     placeholder="DD-MM-YYYY"
//     style={{
//       width: "130px",
//       marginRight: "10px",
//       padding: "6px 10px",
//       marginLeft: "3px",
//       border: "0.1px solid black",
//       borderRadius: "3px",
//     }}
//   />

//   <button
//     onClick={handleApplyDateRange}
//     style={{
//       backgroundColor: "#1976d2",
//       color: "white",
//       border: "none",
//       padding: "6px 12px",
//       borderRadius: "5px",
//       cursor: "pointer",
//     }}
//   >
//     Apply Date Range
//   </button>
// </div>


//         {/* <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//           }}
//         >
         
//         </div> */}

//         {loading ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginTop: "20px",
//             }}
//           >
//             <CircularProgress />
//           </div>
//         ) : (
//           <>
//             <TableContainer
//               component={Paper}
//               sx={{
//                 maxHeight: 440,
//                 border: "1.5px solid black",
//                 borderRadius: "7px",
//               }}
//             >
//               <Table
//                 stickyHeader
//                 aria-label="sticky table"
//                 style={{ border: "1px solid black" }}
//               >
//                 <TableHead>
//                   <TableRow
//                     style={{
//                       borderBottom: "1px solid black",
//                       borderTop: "1px solid black",
//                     }}
//                   >
//                     <TableCell
//                       padding="checkbox"
//                       style={{
//                         borderRight: "1px solid #e0e0e0",
//                         borderBottom: "2px solid black",
//                       }}
//                     >
//                       <Switch
//                         checked={selectAll}
//                         onChange={handleSelectAll}
//                         color="primary"
//                       />
//                     </TableCell>
//                     <TableCell
//                       style={{
//                         minWidth: 70, // Adjust width if needed
//                         borderRight: "1px solid #e0e0e0",
//                         borderBottom: "2px solid black",
//                         padding: "4px 4px",
//                         textAlign: "center",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       S.No.
//                     </TableCell>
//                     {COLUMNS()
//                       .filter((col) => columnVisibility[col.accessor])
//                       .map((column) => (
//                         <TableCell
//                           key={column.accessor}
//                           align={column.align}
//                           style={{
//                             minWidth: column.minWidth,
//                             cursor: "pointer",
//                             borderRight: "1px solid #e0e0e0",
//                             borderBottom: "2px solid black",
//                             padding: "4px 4px",
//                             textAlign: "center",
//                             fontWeight: "bold",
//                           }}
//                           onClick={() => requestSort(column.accessor)}
//                         >
//                           {column.Header}
//                           {sortConfig.key === column.accessor ? (
//                             sortConfig.direction === "ascending" ? (
//                               <ArrowUpwardIcon fontSize="small" />
//                             ) : (
//                               <ArrowDownwardIcon fontSize="small" />
//                             )
//                           ) : null}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {sortedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={
//                           COLUMNS().filter(
//                             (col) => columnVisibility[col.accessor]
//                           ).length
//                         }
//                         style={{
//                           textAlign: "center",
//                           padding: "16px",
//                           fontSize: "16px",
//                           color: "#757575",
//                           // fontStyle: 'italic',
//                         }}
//                       >
//                         {/* <img src="emptyicon.png" alt="" /> */}
//                         <h4>No Data Available</h4>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     sortedData
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((row, index) => (
//                         <TableRow
//                           hover
//                           role="checkbox"
//                           tabIndex={-1}
//                           key={row.id}
//                           onClick={() =>
//                             handleRowSelect(page * rowsPerPage + index)
//                           }
//                           selected={row.isSelected}
//                           style={{
//                             backgroundColor:
//                               index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                             borderBottom: "none", // White for even rows, light grey for odd rows
//                           }}
//                         >
//                           <TableCell
//                             padding="checkbox"
//                             style={{ borderRight: "1px solid #e0e0e0" }}
//                           >
//                             <Switch checked={row.isSelected} color="primary" />
//                           </TableCell>
//                           <TableCell
//                             style={{
//                               minWidth: 70, // Adjust width if needed
//                               borderRight: "1px solid #e0e0e0",
//                               paddingTop: "4px",
//                               paddingBottom: "4px",
//                               borderBottom: "none",
//                               textAlign: "center",
//                               fontSize: "smaller",
//                               backgroundColor:
//                                 index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                               // borderBottom: "none",
//                             }}
//                           >
//                             {page * rowsPerPage + index + 1}{" "}
//                             {/* Serial number starts from 1 */}
//                           </TableCell>
//                           {COLUMNS()
//                             .filter((col) => columnVisibility[col.accessor])
//                             .map((column) => {
//                               const value = row[column.accessor];
//                               return (
//                                 <TableCell
//                                   key={column.accessor}
//                                   align={column.align}
//                                   style={{
//                                     borderRight: "1px solid #e0e0e0",
//                                     paddingTop: "4px",
//                                     paddingBottom: "4px",
//                                     borderBottom: "none",
//                                     backgroundColor:
//                                       index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                                     fontSize: "smaller", // White for even rows, light grey for odd rows
//                                   }}
//                                 >
//                                   {column.format && typeof value === "number"
//                                     ? column.format(value)
//                                     : value}
//                                 </TableCell>
//                               );
//                             })}
//                         </TableRow>
//                       ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[10, 25, 100]}
//               component="div"
//               count={sortedData.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//             {/* //</></div> */}
//           </>
//         )}
//         <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//           <Box sx={style}>
//             <h2>Column Visibility</h2>
//             {COLUMNS().map((col) => (
//               <div key={col.accessor}>
//                 <Switch
//                   checked={columnVisibility[col.accessor]}
//                   onChange={() => handleColumnVisibilityChange(col.accessor)}
//                   color="primary"
//                 />
//                 {col.Header}
//               </div>
//             ))}
//           </Box>
//         </Modal>
       
    
//         <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
//           <Box sx={style}>
//             <h2>Import Data</h2>
//             <input type="file" onChange={handleFileUpload} />
//             {importData.length > 0 && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() =>
//                   setFilteredRows([
//                     ...filteredRows,
//                     ...importData.map((row) => ({ ...row, isSelected: false })),
//                   ])
//                 }
//                 sx={{ marginTop: "10px" }}
//               >
//                 Import
//               </Button>
//             )}
//           </Box>
//         </Modal>
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={3000}
//           onClose={handleSnackbarClose}
//         >
//           <Alert onClose={handleSnackbarClose} severity="warning">
//             Please select a row to edit!
//           </Alert>
//         </Snackbar>
//       </div>
//     </>
//   );
// };


import React, { useState, useEffect, useContext, Component } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { COLUMNS } from "./columns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { TotalResponsesContext } from "../../../../TotalResponsesContext";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import Export from "../../Export";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
//import { TextField } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents , useMap  } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import {
  // Box,
  FormControl,
  // InputLabel,
  MenuItem,
  // Modal,
  Select,
  Autocomplete,
  // TextField,
  InputAdornment,
} from "@mui/material";
import { DeviceHub, LocationOn, AccessTime } from "@mui/icons-material";
// Fix Leaflet's default icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: '500px',
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Enable vertical scrolling
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
};

export const Geofence = () => {
  const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterText, setFilterText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(COLUMNS().map((col) => [col.accessor, true]))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importData, setImportData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [originalRows, setOriginalRows] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const { role } = useContext(TotalResponsesContext);
const role=localStorage.getItem("role");
  console.log("abhi dekh : ", role);

  
  // const fetchData = async (startDate = "", endDate = "") => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     let response;
      
  //     // Fetch data based on role
  //     if (role == 1) {
  //       response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else if (role == 2) {
  //       response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else if (role == 3) {
  //       response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     }else if (role == 4) {
  //       response = await axios.get(`${process.env.REACT_APP_USERBRANCH}/getgeofence`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     }
  
  //     console.log("fetch data", response.data);
  //     if (response?.data) {
  //       let allData;
      
  //       // Logic for role 1: Devices and stops
  //       if (role == 1) {
  //         allData = Object.entries(response.data).flatMap(([deviceId, stops]) =>
  //           stops.map((stop) => {
  //             const match = stop.area.match(/Circle\(([\d.-]+)\s+([\d.-]+)/);
  //             const latlong = match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
        
  //             return {
  //               ...stop, // Retain all stop properties
  //               deviceId, // Add deviceId to each stop
  //               latlong, // Add latlong parameter
  //             };
  //           })
  //         );
  //       }
  //        else if (role == 2) {
  //         allData = response?.data?.branches.flatMap(branch => 
  //           branch.geofences?.map(geofence => ({
  //             ...geofence, // Retain all geofence properties
  //             branchId: branch.branchId, // Add branchId to each geofence
  //             branchName: branch.branchName, // Add branchName to each geofence
  //           })) || [] // Handle the case where geofences is undefined or empty
  //         );
      
  //       // Logic for role 3: Branches and devices
  //       } 
       
      
  //       else if (role == 3) {
  //         allData = response?.data.geofences.map((geofence) => ({
  //           ...geofence, // Keep all geofence properties
  //           branchId: response.data.branchId, // Add branchId from the response
  //           branchName: response.data.branchName, // Add branchName from the response
  //           schoolName: response.data.schoolName, // Add schoolName from the response
  //         }));
        
  //         console.log(allData);
  //       } else if (role == 4) {
  //         allData = response?.data?.branches.flatMap(branch =>
  //           branch.geofences?.map(geofence => ({
  //             ...geofence, // Retain all geofence properties
  //             branchId: branch.branchId, // Add branchId to each geofence
  //             branchName: branch.branchName, // Add branchName to each geofence
              
  //           })) || [] // Handle the case where geofences is undefined or empty
  //         );
  //       }
       
        
        
   
      
  //       console.log(allData);
      
  //       // Filter data by date range, if applicable
  //       const filteredData = startDate || endDate
  //         ? allData.filter((row) => {
  //             const registrationDate = parseDate(row.formattedRegistrationDate);
  //             const start = parseDate(startDate);
  //             const end = parseDate(endDate);
      
  //             return (
  //               (!startDate || registrationDate >= start) &&
  //               (!endDate || registrationDate <= end)
  //             );
  //           })
  //         : allData; // Use all data if no date range specified
      
  //       const reversedData = filteredData.reverse();
      
  //       // Set filtered data and original data with default selection
  //       setFilteredRows(
  //         reversedData.map((row) => ({ ...row, isSelected: false }))
  //       );
  //       setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
      
  //       setTotalResponses(reversedData.length);
        
  //       console.log(`Data fetched between ${startDate} and ${endDate}:`, filteredData);
      
  //     } else {
  //       console.error("Expected an array but got:", response.data.children);
  //     }
    
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false after fetching completes
  //   }
  // };
  // const fetchData = async (startDate = "", endDate = "") => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     let response;
  
  //     // Fetch data based on role
  //     if (role == 1) {
  //       response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else if (role == 2) {
  //       response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else if (role == 3) {
  //       response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else if (role == 4) {
  //       response = await axios.get(`${process.env.REACT_APP_USERBRANCH}/getgeofence`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     }
  
  //     if (response?.data) {
  //       let allData;
  
  //       if (role == 1) {
  //         allData = Object.entries(response.data).flatMap(([deviceId, stops]) =>
  //           stops.map((stop) => {
  //             const match = stop.area.match(/Circle\(([\d.-]+)\s+([\d.-]+)/);
  //             const latlong = match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
  
  //             return {
  //               ...stop,
  //               deviceId,
  //               latlong,
  //             };
  //           })
  //         );
  //       } else if (role == 2) {
  //         allData = response?.data?.branches.flatMap((branch) =>
  //           branch.geofences?.map((geofence) => ({
  //             ...geofence,
  //             branchId: branch.branchId,
  //             branchName: branch.branchName,
  //           })) || []
  //         );
  //       } else if (role == 3) {
  //         allData = response?.data.geofences.map((geofence) => ({
  //           ...geofence,
  //           branchId: response.data.branchId,
  //           branchName: response.data.branchName,
  //           schoolName: response.data.schoolName,
  //         }));
  //       } else if (role == 4) {
  //         allData = response?.data?.branches.flatMap((branch) =>
  //           branch.geofences?.map((geofence) => ({
  //             ...geofence,
  //             branchId: branch.branchId,
  //             branchName: branch.branchName,
  //           })) || []
  //         );
  //       }
  
  //       // Fetch addresses for each row
  //       for (const row of allData) {
  //         if (row.latlong) {
  //           const { latitude, longitude } = row.latlong;
  //           await fetchAddress(row.deviceId, longitude, latitude);
  //         }
  //       }
  
  //       console.log(allData);
  
  //       // Apply filters and update state
  //       const filteredData = startDate || endDate
  //         ? allData.filter((row) => {
  //             const registrationDate = parseDate(row.formattedRegistrationDate);
  //             const start = parseDate(startDate);
  //             const end = parseDate(endDate);
  
  //             return (
  //               (!startDate || registrationDate >= start) &&
  //               (!endDate || registrationDate <= end)
  //             );
  //           })
  //         : allData;
  
  //       const reversedData = filteredData.reverse();
  
  //       setFilteredRows(reversedData.map((row) => ({ ...row, isSelected: false })));
  //       setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
  
  //       setTotalResponses(reversedData.length);
  
  //       console.log(`Data fetched between ${startDate} and ${endDate}:`, filteredData);
  //     } else {
  //       console.error("Expected an array but got:", response.data.children);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // const updateAllDataWithAddresses = async (allData) => {
  //   const updatedData = [...allData];
  
  //   for (const row of updatedData) {
  //     if (row.latlong) {
  //       const { latitude, longitude } = row.latlong;
  
  //       try {
  //         // Fetch the address
  //         const apiKey = "DG2zGt0KduHmgSi2kifd"; // Replace with your actual MapTiler API key
  //         const response = await axios.get(
  //           `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`
  //         );
  
  //         // Extract the address
  //         const address =
  //           response.data.features.length > 0
  //             ? response.data.features[0].place_name_en
  //             : "Address not found";
  
  //         // Set the address in the row
  //         row.address = address;
  //       } catch (error) {
  //         console.error("Error fetching address:", error);
  //         row.address = "Error fetching address";
  //       }
  //     } else {
  //       row.address = "No latlong data available";
  //     }
  //   }
  
  //   return updatedData;
  // };
  
  // // Call this function after fetching allData
  // const fetchData = async (startDate = "", endDate = "") => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     let response;
  
  //     // Fetch data based on role (same as your existing code)
  //     if (role == 1) {
  //       response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else if (role == 2) {
  //       response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else if (role == 3) {
  //       response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/geofences`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else if (role == 4) {
  //       response = await axios.get(`${process.env.REACT_APP_USERBRANCH}/getgeofence`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     }
  
  //     if (response?.data) {
  //       let allData;
  
  //       // Process data (same as your existing logic)
  //       if (role == 1) {
  //         allData = Object.entries(response.data).flatMap(([deviceId, stops]) =>
  //           stops.map((stop) => {
  //             const match = stop.area.match(/Circle\(([\d.-]+)\s+([\d.-]+)/);
  //             const latlong = match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
  
  //             return {
  //               ...stop,
  //               deviceId,
  //               latlong,
  //             };
  //           })
  //         );
  //       } else if (role == 2) {
  //         allData = response?.data?.branches.flatMap((branch) =>
  //           branch.geofences?.map((geofence) => ({
  //             ...geofence,
  //             branchId: branch.branchId,
  //             branchName: branch.branchName,
  //           })) || []
  //         );
  //       } else if (role == 3) {
  //         allData = response?.data.geofences.map((geofence) => ({
  //           ...geofence,
  //           branchId: response.data.branchId,
  //           branchName: response.data.branchName,
  //           schoolName: response.data.schoolName,
  //         }));
  //       } else if (role == 4) {
  //         allData = response?.data?.branches.flatMap((branch) =>
  //           branch.geofences?.map((geofence) => ({
  //             ...geofence,
  //             branchId: branch.branchId,
  //             branchName: branch.branchName,
  //           })) || []
  //         );
  //       }
  
  //       // Add addresses to each row
  //       const allDataWithAddresses = await updateAllDataWithAddresses(allData);
  
  //       // Set data into state
  //       setFilteredRows(allDataWithAddresses.map((row) => ({ ...row, isSelected: false })));
  //       setOriginalRows(allDataWithAddresses.map((row) => ({ ...row, isSelected: false })));
  //       setTotalResponses(allDataWithAddresses.length);
  
  //       console.log("Updated Data with Addresses:", allDataWithAddresses);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
    const [open, setOpen] = React.useState(false);
  const [radius, setRadius] = useState("");
  const [devices, setDevices] = useState([]); // State to store fetched devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State to store selected device
  const [addGeoModalOpen,setAddGeoModalOpen] = useState(false);
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert("Location not found!  please Enter a valid location");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };
  const UpdateMapCenter = () => {
    const map = useMap();
    map.setView([location.lat, location.lng], map.getZoom());
    return null;
  };

  const handleAddGeoModalOpen=  ()=>{
    setAddGeoModalOpen(true)
  };
  const handleAddGeoModalClose=  ()=>{
    setAddGeoModalOpen(false)
  };
  const handleFormSubmit = () => {
    if (radius) {
      console.log(`Circle(${location.lat}, ${location.lng}, ${radius})`);
      setFormOpen(false);
      setRadius("");
    } else {
      alert("Please enter a radius.");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleGeofenceSubmit = async (e) => {
    e.preventDefault();
    console.log(location.lat,location.lng);
    console.log("ye hai geofence", formData);
    const circleFormat = `Circle(${location.lat} ${location.lng}, ${formData.radius})`;
    const geofenceData = {
      name: formData.name,
      area: circleFormat,
      busStopTime: formData.busStopTime,
      deviceId: selectedDevice,
    };
    console.log("formated data: ", geofenceData);

    try {
      const accessToken = localStorage.getItem("token");
      const response = await axios.post(`${process.env.REACT_APP_API}/geofence`, geofenceData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("successfully geofence is added");
        handleClose();
      }
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred");
    }
    handleClose(true);
    setAddGeoModalOpen(false)
    fetchData();
    setFormData([]);
  };
  const fetchDevices = async () => {
    try {
      let response;
      const token = localStorage.getItem("token");

      if (role == 1) {
        response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/read-devices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (role == 2) {
        response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/read-devices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (role == 3) {
        response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/read-devices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (role == 4) {
        response = await axios.get(
          `http://63.142.251.13:4000/branchgroupuser/getdevicebranchgroupuser`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      console.log("Fetched devices:", response.data);
      const allData =
      role == 1
        ? response.data.data.flatMap((school) =>
            school.branches.flatMap((branch) =>
              Array.isArray(branch.devices) && branch.devices.length > 0
                ? branch.devices.map((device) => ({
                    ...device,
                    schoolName: school.schoolName,
                    branchName: branch.branchName,
                  }))
                : []
            )
          )
          : role == 4
          ? response.data.data.flatMap((school) =>
              school.branches.flatMap((branch) =>
                Array.isArray(branch.devices) && branch.devices.length > 0
                  ? branch.devices.map((device) => ({
                      ...device,
                      branchName: branch.branchName,
                      schoolName: school.schoolName,
                    }))
                  : []
              )
            )
        : role == 2
        ? response.data.branches.flatMap((branch) =>
            Array.isArray(branch.devices) && branch.devices.length > 0
              ? branch.devices.map((device) => ({
                  ...device,
                  branchName: branch.branchName,
                }))
              : []
          )
        : role == 3
        ? response.data.devices.map((device) => ({
            ...device,
            schoolName: response.data.schoolName,
            branchName: response.data.branchName,
          }))
        : [];
    

        console.log(allData);
      setDevices(allData); // Store the devices in state
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };
  useEffect(() => {
    if (open) {
      fetchDevices();
    }
  }, [open]);
  const fetchAddressForRow = async (row) => {
    if (row.latlong) {
      const { latitude, longitude } = row.latlong;
      const apiKey = "DG2zGt0KduHmgSi2kifd"; // Replace with your actual MapTiler API key
  
      try {
        const response = await axios.get(
          `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`
        );
  
        // Extract address
        return response.data.features.length > 0
          ? response.data.features[0].place_name_en
          : "Address not found";
      } catch (error) {
        console.error("Error fetching address:", error);
        return "Error fetching address";
      }
    } else {
      return "No latlong data available";
    }
  };
  const [formOpen, setFormOpen] = useState(false);
  // const [location, setLocation] = useState({ lat: null, lng: null });[21.1458, 79.0882]
  const [location, setLocation] = useState({ lat: 21.1458, lng: 79.0882 });
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        setFormOpen(true);
        //  setOpen(true);
    // Open the form when the map is clicked
      },
    });
    return null;
  };
  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;
  
      // Fetch data based on role (same as your existing code)
      if (role == 1) {
        response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (role == 2) {
        response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/geofences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (role == 3) {
        response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/geofences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (role == 4) {
        response = await axios.get(`${process.env.REACT_APP_USERBRANCH}/getgeofence`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      if (response?.data) {
        let allData;
  
        // Process data (same as your existing logic)
        if (role == 1) {
          allData = Object.entries(response.data).flatMap(([deviceId, stops]) =>
            stops.map((stop) => {
              const match = stop.area.match(/Circle\(([\d.-]+)\s+([\d.-]+)/);
              const latlong = match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
  
              return {
                ...stop,
                deviceId,
                latlong,
                address: "Fetching Address...", // Initialize address
              };
            })
          );
        } 
        // else if (role == 2) {
        //   allData = response?.data?.branches.flatMap((branch) =>
        //     branch.geofences?.map((geofence) => ({
        //       ...geofence,
        //       branchId: branch.branchId,
        //       branchName: branch.branchName,
        //       address: "Fetching Address...", // Initialize address
        //     })) || []
        //   );
        // }
        else if (role == 2) {
          allData = response?.data?.branches.flatMap((branch) =>
            branch.geofences?.map((geofence) => {
              // Extract latitude and longitude from the "area" field
              const match = geofence.area?.match(/Circle\(([\d.-]+)\s+([\d.-]+)/);
              const latlong = match
                ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) }
                : null;
        
              return {
                ...geofence,
                branchId: branch.branchId,
                branchName: branch.branchName,
                latlong, // Add extracted latitude and longitude
                address: "Fetching Address...", // Initialize address
              };
            }) || []
          );
        }
        //  else if (role == 3) {
        //   allData = response?.data.geofences.map((geofence) => ({
        //     ...geofence,
        //     branchId: response.data.branchId,
        //     branchName: response.data.branchName,
        //     schoolName: response.data.schoolName,
        //     address: "Fetching Address...", // Initialize address
        //   }));
        // } 
        else if (role == 3) {
          allData = response?.data.geofences.map((geofence) => {
            // Extract latitude and longitude from the "area" field
            const match = geofence.area?.match(/Circle\(([\d.-]+)\s+([\d.-]+)/);
            const latlong = match
              ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) }
              : null;
        
            return {
              ...geofence,
              branchId: response.data.branchId,
              branchName: response.data.branchName,
              schoolName: response.data.schoolName,
              latlong, // Add extracted latitude and longitude
              address: "Fetching Address...", // Initialize address
            };
          });
        }
        
        // else if (role == 4) {
        //   allData = response?.data?.branches.flatMap((branch) =>
        //     branch.geofences?.map((geofence) => ({
        //       ...geofence,
        //       branchId: branch.branchId,
        //       branchName: branch.branchName,
        //       address: "Fetching Address...", // Initialize address
        //     })) || []
        //   );
        // }
        else if (role == 4) {
          allData = response?.data?.branches.flatMap((branch) =>
            branch.geofences?.map((geofence) => {
              // Extract latitude and longitude from the "area" field
              const match = geofence.area?.match(/Circle\(([\d.-]+)\s+([\d.-]+)/);
              const latlong = match
                ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) }
                : null;
        
              return {
                ...geofence,
                branchId: branch.branchId,
                branchName: branch.branchName,
                latlong, // Add extracted latitude and longitude
                address: "Fetching Address...", // Initialize address
              };
            }) || []
          );
        }
        console.log("my all data",allData)
        // Set data into state initially
        setFilteredRows(allData.map((row) => ({ ...row, isSelected: false })));
        setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
        setTotalResponses(allData.length);
  
        // Fetch addresses asynchronously for each row
        allData.forEach(async (row, index) => {
          const address = await fetchAddressForRow(row);
  
          // Update the specific row's address
          setFilteredRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = { ...updatedRows[index], address };
            return updatedRows;
          });
  
          setOriginalRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = { ...updatedRows[index], address };
            return updatedRows;
          });
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Months are 0-indexed
  };

  const handleApplyDateRange = () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    // If either date is empty, fetch all data
    if (!startDate && !endDate) {
      fetchData(); // Fetch all data
    } else {
      // Convert to desired format if values are not empty
      const formattedStartDate = startDate ? formatDate(startDate) : "";
      const formattedEndDate = endDate ? formatDate(endDate) : "";

      fetchData(formattedStartDate, formattedEndDate);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData(filterText);
  }, [filterText]);

  useEffect(() => {
    fetchData(); // Fetch data when startDate or endDate changes
  }, [startDate, endDate]);

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage); // Set to all rows if -1
    setPage(0); // Reset to the first page
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value;
    setFilterText(text);
  };

  const filterData = (text) => {
    let dataToFilter = originalRows;

    if (startDate && endDate) {
      dataToFilter = dataToFilter.filter((row) => {
        const rowDate = new Date(row.dateOfBirth); // Replace `row.date` with the actual date field
        return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
      });
    }

    if (text === "") {
      setFilteredRows(dataToFilter); // Reset to filtered data
    } else {
      const filteredData = dataToFilter
        .filter((row) =>
          Object.values(row).some(
            (val) =>
              typeof val === "string" &&
              val.toLowerCase().includes(text.toLowerCase())
          )
        )
        .map((row) => ({ ...row, isSelected: false }));
      setFilteredRows(filteredData);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleColumnVisibilityChange = (accessor) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [accessor]: !prevState[accessor],
    }));
  };

  const handleRowSelect = (index) => {
    const newFilteredRows = [...filteredRows];
    newFilteredRows[index].isSelected = !newFilteredRows[index].isSelected;
    setFilteredRows(newFilteredRows);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newFilteredRows = filteredRows.map((row) => ({
      ...row,
      isSelected: newSelectAll,
    }));
    setFilteredRows(newFilteredRows);
    setSelectAll(newSelectAll);
  };


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetNames = workbook.SheetNames;
        const sheet = workbook.Sheets[sheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setImportData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const sortedData = [...filteredRows];
  if (sortConfig.key !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

 

 

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Update formData
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
  
      // Handle "area" field for latitude and longitude update
      if (name === "area") {
        const match = value.match(/Circle\(([\d.]+) ([\d.]+), ([\d.]+)\)/);
        if (match) {
          const oldLatitude = parseFloat(prevData.latlong.latitude);
          const oldLongitude = parseFloat(prevData.latlong.longitude);
          const radius = parseFloat(match[3]);
  
          // Example: Adjust latitude/longitude slightly based on radius
          const newLatitude = oldLatitude + (radius / 111); // Approx 1° latitude ~ 111 km
          const newLongitude = oldLongitude + (radius / (111 * Math.cos((oldLatitude * Math.PI) / 180)));
  
          updatedData.latlong = {
            latitude: newLatitude.toFixed(6),
            longitude: newLongitude.toFixed(6),
          };
        }
      }
  
      return updatedData;
    });
  };
   const handleModalClose = () => {
    setEditModalOpen(false);
    // setAddModalOpen(false);
    setFormData({});
    setModalOpen(false);
  };

  // const handleEditSubmit = async () => {
  //   // Define the API URL and authentication token
  //   const token = localStorage.getItem("token");
  //   const apiUrl =
  //     role == 1
  //       ? `${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`
  //       : role == 2 ? `${process.env.REACT_APP_SCHOOL_API}/geofences` 
  //       :role==3?`${process.env.REACT_APP_BRANCH_API}/geofences`
  //       :`${process.env.REACT_APP_USERBRANCH}/updategeofence`

  //   // Prepare the updated data
  //   const updatedData = {
  //     ...formData,
  //     isSelected: false,
  //   };

  //   try {
  //     // Perform the PUT request
  //     const response = await fetch(`${apiUrl}/${updatedData._id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(updatedData),
  //     });

  //     // Check if the response is okay (status code 200-299)
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     // Optionally: Process the response data if needed
  //     const result = await response.json();
  //     console.log("Update successful:", result);
  //     alert("Updated successfully");

  //     // Update local state after successful API call
  //     const updatedRows = filteredRows.map((row) =>
  //       row._id === selectedRow._id // Make sure to use the correct ID property
  //         ? { ...row, ...formData, isSelected: false }
  //         : row
  //     );
  //     setFilteredRows(updatedRows);

  //     // Close the modal
  //     handleModalClose();

  //     // Fetch the latest data
  //     fetchData();
  //   } catch (error) {
  //     console.error("Error updating row:", error);
  //     alert(`Error updating row: ${error.message}`);
  //   }
  // };
  const handleEditSubmit = async () => {
    const token = localStorage.getItem("token");
    const apiUrl =
      role == 1
        ? `${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`
        : role == 2
        ? `${process.env.REACT_APP_SCHOOL_API}/geofences`
        : role == 3
        ? `${process.env.REACT_APP_BRANCH_API}/geofences`
        : `${process.env.REACT_APP_USERBRANCH}/updategeofence`;
  
    const updatedData = {
      ...formData,
      isSelected: false,
      latitude: formData.latlong.latitude,
      longitude: formData.latlong.longitude,
    };
  
    try {
      const response = await fetch(`${apiUrl}/${updatedData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Update successful:", result);
      alert("Updated successfully");
  
      const updatedRows = filteredRows.map((row) =>
        row._id === selectedRow._id
          ? { ...row, ...formData, isSelected: false }
          : row
      );
      setFilteredRows(updatedRows);
      handleModalClose();
      fetchData();
    } catch (error) {
      console.error("Error updating row:", error);
      alert(`Error updating row: ${error.message}`);
    }
  };
  const handleEditButtonClick = () => {
    const selected = filteredRows.find((row) => row.isSelected);
    if (selected) {
      setSelectedRow(selected);
      setFormData(selected);
      setEditModalOpen(true);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleDeleteSelected = async () => {
    // Log filteredRows to check its structure
    console.log("Filtered rows:", filteredRows);

    // Get selected row IDs
    const selectedIds = filteredRows
      .filter((row) => row.isSelected)
      .map((row) => {
        // Log each row to check its structure
        console.log("Processing row:", row);
        return row._id; // Ensure id exists and is not undefined
      });

    console.log("Selected IDs:", selectedIds);

    if (selectedIds.length === 0) {
      alert("No rows selected for deletion.");
      return;
    }
    const userConfirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} record(s)?`
    );

    if (!userConfirmed) {
      // If the user clicks "Cancel", exit the function
      return;
    }
    try {
      // Define the API endpoint and token

      const apiUrl =
        role == 1
          ? `${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`
          : role == 2
          ? `${process.env.REACT_APP_SCHOOL_API}/geofences`
          : role == 3
          ? `${process.env.REACT_APP_BRANCH_API}/geofences`
          :`http://63.142.251.13:4000/branchgroupuser//deletegeofence`

      const token = localStorage.getItem("token");
      // Send delete requests for each selected ID
      const deleteRequests = selectedIds.map((_id) =>
        fetch(`${apiUrl}/${_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error deleting record with ID ${_id}: ${response.statusText}`
            );
          }
          return response.json();
        })
      );

      // Wait for all delete requests to complete
      await Promise.all(deleteRequests);

      // Filter out deleted rows
      const newFilteredRows = filteredRows.filter((row) => !row.isSelected);

      // Update state
      setFilteredRows(newFilteredRows);
      setSelectAll(false);

      alert("Selected records deleted successfully.");
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Failed to delete selected records.");
    }
    fetchData();
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
        Geofences
      </h1>
      <div>
      
<div
  style={{
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap", // To wrap if the screen gets smaller
  }}
>
  <TextField
    label="Search"
    variant="outlined"
    value={filterText}
    onChange={handleFilterChange}
    sx={{
      marginRight: "10px",
      width: "200px", // Smaller width
      '& .MuiOutlinedInput-root': {
        height: '36px', // Set a fixed height to reduce it
        padding: '0px', // Reduce padding to shrink height
      },
      '& .MuiInputLabel-root': {
        top: '-6px', // Adjust label position
        fontSize: '14px', // Slightly smaller label font
      }
    }}
    InputProps={{
      startAdornment: (
        <SearchIcon
          style={{
            cursor: "pointer",
            marginLeft: "10px",
            marginRight: "5px",
          }}
        />
      ),
    }}
  />

  <Button
    onClick={() => setModalOpen(true)}
    sx={{
      backgroundColor: "rgb(85, 85, 85)",
      color: "white",
      fontWeight: "bold",
      marginRight: "10px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      padding: "6px 12px",
      '&:hover': {
        backgroundColor: "rgb(100, 100, 100)", // Lighter shade on hover
      },
    }}
  >
    <ImportExportIcon />
    Column Visibility
  </Button>
  <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            sx={{ marginRight: "10px" }}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
             <Button
            variant="contained"
            color="primary"
            onClick={handleEditButtonClick}
            sx={{ marginRight: "10px" }}
            startIcon={<EditIcon />}
          >
            Edit
          </Button> <Button
            variant="contained"
            color="success"
            onClick={handleAddGeoModalOpen}
            sx={{ marginRight: "10px" }}
            startIcon={<AddCircleIcon />}
          >
            Add
          </Button>
          <Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"GEOFENCES LIST"} pdfFilename={"Geofences.pdf"} excelFilename={"Geofences.xlsx"}/>


  <input
    type="date"
    id="startDate"
    placeholder="DD-MM-YYYY"
    style={{
      width: "130px",
      marginRight: "10px",
      padding: "6px 10px",
      marginLeft: "3px",
      border: "0.1px solid black",
      borderRadius: "3px",
    }}
  />

  <input
    type="date"
    id="endDate"
    placeholder="DD-MM-YYYY"
    style={{
      width: "130px",
      marginRight: "10px",
      padding: "6px 10px",
      marginLeft: "3px",
      border: "0.1px solid black",
      borderRadius: "3px",
    }}
  />

  <button
    onClick={handleApplyDateRange}
    style={{
      backgroundColor: "#1976d2",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    Apply Date Range
  </button>
</div>


        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
         
        </div> */}

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 470,
                border: "1.5px solid black",
                borderRadius: "7px",
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
                style={{ border: "1px solid black" }}
              >
                <TableHead>
                  <TableRow
                    style={{
                      borderBottom: "1px solid black",
                      borderTop: "1px solid black",
                    }}
                  >
                    <TableCell
                      padding="checkbox"
                      style={{
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "2px solid black",
                      }}
                    >
                      <Switch
                        checked={selectAll}
                        onChange={handleSelectAll}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell
                      style={{
                        minWidth: 70, // Adjust width if needed
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "2px solid black",
                        padding: "4px 4px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      S.No.
                    </TableCell>
                    {COLUMNS()
                      .filter((col) => columnVisibility[col.accessor])
                      .map((column) => (
                        <TableCell
                          key={column.accessor}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            cursor: "pointer",
                            borderRight: "1px solid #e0e0e0",
                            borderBottom: "2px solid black",
                            padding: "4px 4px",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                          onClick={() => requestSort(column.accessor)}
                        >
                          {column.Header}
                          {sortConfig.key === column.accessor ? (
                            sortConfig.direction === "ascending" ? (
                              <ArrowUpwardIcon fontSize="small" />
                            ) : (
                              <ArrowDownwardIcon fontSize="small" />
                            )
                          ) : null}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          COLUMNS().filter(
                            (col) => columnVisibility[col.accessor]
                          ).length
                        }
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          fontSize: "16px",
                          color: "#757575",
                          // fontStyle: 'italic',
                        }}
                      >
                        {/* <img src="emptyicon.png" alt="" /> */}
                        <h4>No Data Available</h4>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                          onClick={() =>
                            handleRowSelect(page * rowsPerPage + index)
                          }
                          selected={row.isSelected}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                            borderBottom: "none", // White for even rows, light grey for odd rows
                          }}
                        >
                          <TableCell
                            padding="checkbox"
                            style={{ borderRight: "1px solid #e0e0e0" }}
                          >
                            <Switch checked={row.isSelected} color="primary" />
                          </TableCell>
                          <TableCell
                            style={{
                              minWidth: 70, // Adjust width if needed
                              borderRight: "1px solid #e0e0e0",
                              paddingTop: "4px",
                              paddingBottom: "4px",
                              borderBottom: "none",
                              textAlign: "center",
                              fontSize: "smaller",
                              backgroundColor:
                                index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                              // borderBottom: "none",
                            }}
                          >
                            {page * rowsPerPage + index + 1}{" "}
                            {/* Serial number starts from 1 */}
                          </TableCell>
                          {COLUMNS()
                            .filter((col) => columnVisibility[col.accessor])
                            .map((column) => {
                              const value = row[column.accessor];
                              return (
                                <TableCell
                                  key={column.accessor}
                                  align={column.align}
                                  style={{
                                    borderRight: "1px solid #e0e0e0",
                                    paddingTop: "4px",
                                    paddingBottom: "4px",
                                    borderBottom: "none",
                                    backgroundColor:
                                      index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                                    fontSize: "smaller", // White for even rows, light grey for odd rows
                                  }}
                                >
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <StyledTablePagination>
  <TablePagination
    rowsPerPageOptions={[{ label: "All", value: -1 }, 10, 25, 100, 1000]}
    component="div"
    count={sortedData.length}
    rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage}
    page={page}
    onPageChange={(event, newPage) => {
      console.log("Page changed:", newPage);
      handleChangePage(event, newPage);
    }}
    onRowsPerPageChange={(event) => {
      console.log("Rows per page changed:", event.target.value);
      handleChangeRowsPerPage(event);
    }}
  />
</StyledTablePagination>
            {/* //</></div> */}
          </>
        )}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
            {/* <h2></h2> */}
            <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <h2 style={{ flexGrow: 1 }}>Column Visibility</h2>
      <IconButton onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </Box>
            {COLUMNS().map((col) => (
              <div key={col.accessor}>
                <Switch
                  checked={columnVisibility[col.accessor]}
                  onChange={() => handleColumnVisibilityChange(col.accessor)}
                  color="primary"
                />
                {col.Header}
              </div>
              
            ))}
          </Box>
        </Modal>
        <Modal open={editModalOpen} onClose={handleModalClose}>
  <Box
    sx={{
      ...style,
      maxHeight: '300px', // Adjust the height
      overflowY: 'auto',
      top:'31%'  // Ensure scrolling if content exceeds height
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ flexGrow: 1 }}>Edit Row</h2>
      <IconButton onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </Box>


   {/* {COLUMNS()
      .filter((col) => col.accessor === "name")
      .map((col) => (
        <TextField
          key={col.accessor}
          label={col.Header}
          variant="outlined"
          name={col.accessor}
          value={formData[col.accessor] || ""}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
          fullWidth
        />
      ))} */}

{COLUMNS()
      .filter((col) => col.accessor === "name" || col.accessor === "area")
      .map((col) => (
        <TextField
          key={col.accessor}
          label={col.Header}
          variant="outlined"
          name={col.accessor}
          value={formData[col.accessor] || ""}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
          fullWidth
        />
      ))}

    <Button variant="contained" color="primary" onClick={handleEditSubmit}>
      Submit
    </Button>
  </Box>
</Modal>
<Modal open={addGeoModalOpen} onClose={handleAddGeoModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "90%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          marginTop: 5,
        }}
      >
        <h3>Select Location on Map</h3>
        <div style={{ height: "100%", marginBottom: "16px" }}>
          {/* Search bar */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Enter location name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "70%", marginRight: "8px", padding: "8px" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 16px" , marginRight:"10px" }}>
          Search
        </button>
        <button onClick={()=>setOpen(true)} style={{ padding: "8px 16px" }}>
          Add geofence here
        </button>
      </div>
          {/* <MapContainer  center={[21.1458, 79.0882]} zoom={13} style={{ height: "80%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Hb'
            />
            <MapClickHandler />
            {location.lat && location.lng && (
              <Marker position={[location.lat, location.lng]}></Marker>
            )}
          </MapContainer> */}
          {/* Map container */}
      <div style={{ height: "100%", marginBottom: "16px" }}>
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: "80%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Hb'
          />
          <UpdateMapCenter />
          <MapClickHandler />
          {location.lat && location.lng && (
            <Marker position={[location.lat, location.lng]}></Marker>
          )}
        </MapContainer>
      </div>
        </div>
        {location.lat && location.lng && (
          <p>
            Selected Location: Latitude: {location.lat}, Longitude: {location.lng}
          </p>
        )}
        {formOpen && (
      //     <Modal
      //     open={open}
      //     onClose={handleClose}
      //     aria-labelledby="modal-modal-title"
      //     aria-describedby="modal-modal-description"
      //   >
      //     <Box sx={style}>
      //       <div className="d-flex justify-content-between">
      //         <Typography id="modal-modal-title" variant="h6" component="h2">
      //           Add New Geofence
      //         </Typography>
      //         <IconButton onClick={handleClose}>
      //           <CloseIcon />
      //         </IconButton>
      //       </div>
      //       <DialogContent>
      //         <form onSubmit={handleGeofenceSubmit}>
      //           <FormControl
      //             style={{
      //               display: "flex",
      //               flexDirection: "column",
      //               gap: "10px",
      //             }}
      //           >
      //             {/* <Select
      //           labelId="device-select-label"
      //           value={selectedDevice}
      //           onChange={(e) => setSelectedDevice(e.target.value)}
      //         >
      //           {devices.map((device) => (
      //             <MenuItem key={device.deviceId} value={device.deviceId}>
      //               {device.deviceName}
      //             </MenuItem>
      //           ))}
      //         </Select> */}
      //         {/* <Autocomplete
      //     options={devices}
      //     getOptionLabel={(device) => device.deviceName || ""}
      //     value={selectedDevice}
      //     onChange={(event, newValue) => setSelectedDevice(newValue)}
      //     renderInput={(params) => <TextField {...params} label="Select Device" />}
      //     disablePortal // Ensures dropdown closes after selection
      //   />  */}
      //   <Autocomplete
      //   options={devices}
      //   getOptionLabel={(device) => device.deviceName || ""}
      //   value={devices.find(device => device.deviceId === selectedDevice) || null} // Show the selected device by deviceId
      //   onChange={(event, newValue) => {
      //     setSelectedDevice(newValue ? newValue.deviceId : null); // Store only the deviceId
      //   }}
      //   renderInput={(params) => <TextField {...params} label="Select Device" />}
      //   disablePortal
      // />
      //             <TextField
      //               label="Bus Stop Name"
      //               name="name"
      //               value={formData.name !== undefined ? formData.name : ""}
      //               onChange={(e) =>
      //                 setFormData({ ...formData, name: e.target.value })
      //               }
      //               required
      //             />
      //             <TextField
      //               label="Radius of Area"
      //               name="radius"
      //               type="number"
      //               value={formData.radius !== undefined ? formData.radius : ""}
      //               onChange={(e) =>
      //                 setFormData({ ...formData, radius: e.target.value })
      //               }
      //               required
      //             />
      //             <TextField
      //               label="Bus Time"
      //               name="time"
      //               type="time"
      //               InputLabelProps={{
      //                 shrink: true,
      //               }}
      //               value={
      //                 formData.busStopTime !== undefined
      //                   ? formData.busStopTime
      //                   : ""
      //               }
      //               onChange={(e) =>
      //                 setFormData({ ...formData, busStopTime: e.target.value })
      //               }
      //               required
      //             />
      //             <Button
      //               variant="contained"
      //               color="primary"
      //               type="submit"
      //               style={{ marginTop: "20px" }}
      //             >
      //               Submit
      //             </Button>
      //           </FormControl>
      //         </form>
      //       </DialogContent>
      //     </Box>
      //   </Modal>
      <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={{
    ...style,
    maxHeight: '600px',
    height:'auto',
    maxWidth: '600px', // Limits the width
    width: '300px', // Allows width to adjust according to content
    padding: '30px', // Adds padding for better spacing inside
    margin: 'auto', // Centers the modal on the screen
  }}>
    <div className="d-flex justify-content-between">
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Add New Geofence
      </Typography>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </div>
    <DialogContent>
      <form onSubmit={handleGeofenceSubmit}>
        <FormControl
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px", // Adjusted gap for better visual flow
          }}
        >
          {/* <Autocomplete
            options={devices}
            getOptionLabel={(device) => device.deviceName || ""}
            value={devices.find(device => device.deviceId === selectedDevice) || null} // Show the selected device by deviceId
            onChange={(event, newValue) => {
              setSelectedDevice(newValue ? newValue.deviceId : null); // Store only the deviceId
            }}
            renderInput={(params) => <TextField {...params} label="Select Device" />}
            disablePortal
          /> */}
          <Autocomplete
  options={devices}
  getOptionLabel={(device) => device.deviceName || ""}
  value={devices.find(device => device.deviceId === selectedDevice) || null} // Show the selected device by deviceId
  onChange={(event, newValue) => {
    setSelectedDevice(newValue ? newValue.deviceId : null); // Store only the deviceId
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Device"
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <DeviceHub /> {/* Device icon */}
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  )}
  disablePortal
/>
          <TextField
            label="Bus Stop Name"
            name="name"
            value={formData.name !== undefined ? formData.name : ""}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn /> {/* Bus stop icon */}
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            label="Radius of Area"
            name="radius"
            type="number"
            value={formData.radius !== undefined ? formData.radius : ""}
            onChange={(e) =>
              setFormData({ ...formData, radius: e.target.value })
            }
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn /> {/* Radius icon */}
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            label="Bus Time"
            name="time"
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.busStopTime !== undefined ? formData.busStopTime : ""}
            onChange={(e) =>
              setFormData({ ...formData, busStopTime: e.target.value })
            }
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime /> {/* Clock icon */}
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "20px" }}
          >
            Submit
          </Button>
        </FormControl>
      </form>
    </DialogContent>
  </Box>
</Modal>

        )}
      </Box>
    </Modal>
       
    
        <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
          <Box sx={style}>
            <h2>Import Data</h2>
            <input type="file" onChange={handleFileUpload} />
            {importData.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setFilteredRows([
                    ...filteredRows,
                    ...importData.map((row) => ({ ...row, isSelected: false })),
                  ])
                }
                sx={{ marginTop: "10px" }}
              >
                Import
              </Button>
            )}
          </Box>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="warning">
            Please select a row to edit!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};