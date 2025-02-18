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
// import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// // import './TableStyles.css';
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

// export const Status = () => {
//   const { setTotalResponses,role } = useContext(TotalResponsesContext); // Get the context value

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
//   const [dropdownOptions, setDropdownOptions] = useState([]);
//   const [selectedValue, setSelectedValue] = useState("");
//   const [otherDropdownOptions, setOtherDropdownOptions] = useState([]);
//   const [otherSelectedValue, setOtherSelectedValue] = useState("");
//   const [tableData, setTableData] = useState([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {

//       const token = localStorage.getItem("token");

//       let response;

//       // Fetch data based on role
//       if (role == 1) {
//         response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/status-of-children`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else if (role == 2) {
//         response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/status-of-children`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else if (role == 3) {
//         response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/status-of-children`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
//       console.log("fetch data", response.data); // Log the entire response data

//       if (Array.isArray(response.data.data)) {
//         const allSchools = response.data.data;

//         // Flatten all children from schools and branches
//         const allChildren = allSchools.flatMap(school =>
//           school.branches.flatMap(branch => branch.children)
//         );

//         // Function to parse dates in DD-MM-YYYY format
//         const parseDate = (dateString) => {
//           const [day, month, year] = dateString.split('-');
//           return new Date(`${year}-${month}-${day}`);
//         };

//         // Filter data based on the provided date range
//         const filteredData = startDate || endDate
//           ? allChildren.filter(child => {
//               const requestDate = parseDate(child.request.requestDate);
//               const start = startDate ? parseDate(startDate) : null;
//               const end = endDate ? parseDate(endDate) : null;

//               return (
//                 (!start || requestDate >= start) &&
//                 (!end || requestDate <= end)
//               );
//             })
//           : allChildren; // If no date range, use all children

//         const reversedData = filteredData.reverse();

//         // Log the filtered data
//         console.log(`Data fetched between ${startDate} and ${endDate}:`, filteredData);

//         // Update state with the fetched and filtered data
//         setFilteredRows(
//           reversedData.map((child) => ({ ...child, isSelected: false }))
//         );
//         setOriginalRows(allChildren.map((child) => ({ ...child, isSelected: false })));
//         setTotalResponses(reversedData.length);

//       } else {
//         console.error("Expected an array but got:", response.data);
//       }
//       // if (response?.data) {
//       //   let allData;

//       //   // Logic for role 1: Devices and stops
//       //   if (role == 1) {
//       //     allData = response.data.flatMap(school =>
//       //       school.branches.flatMap(branch =>
//       //         branch.children.map(child => ({
//       //           ...child, // Retain all child properties
//       //           schoolId: school.schoolId, // Add schoolId
//       //           schoolName: school.schoolName, // Add schoolName
//       //           branchId: branch.branchId, // Add branchId
//       //           branchName: branch.branchName, // Add branchName
//       //         }))
//       //       )
//       //     );
//       //   } else if (role == 2) {
//       //     allData = response?.data?.flatMap(school =>
//       //       school.branches.flatMap(branch =>
//       //         branch.children.map(child => ({
//       //           ...child, // Retain all child properties
//       //           branchId: branch.branchId, // Add branchId to each child
//       //           branchName: branch.branchName, // Add branchName to each child
//       //           schoolId: school.schoolId, // Add schoolId to each child
//       //           schoolName: school.schoolName, // Add schoolName to each child
//       //           // Add any additional properties you need from the child object
//       //         }))
//       //       )
//       //     );
//       //   }
//       //   else if (role == 3) {
//       //     allData = response?.data.flatMap(school =>
//       //       school.branches.flatMap(branch =>
//       //         branch.children.flatMap(child =>
//       //           child.requestType === "leave"
//       //             ? [{
//       //                 // Retain child properties
//       //                 ...child,
//       //                 childId: child.childId, // Add childId
//       //                 deviceId: child.deviceId, // Associate with deviceId
//       //                 branchId: branch.branchId, // Add branchId
//       //                 branchName: branch.branchName, // Add branchName
//       //                 schoolId: school.schoolId, // Add schoolId
//       //                 schoolName: school.schoolName, // Add schoolName
//       //               }]
//       //             : [{
//       //                 childId: child.childId,
//       //                 deviceId: child.deviceId,
//       //                 branchId: branch.branchId,
//       //                 branchName: branch.branchName,
//       //                 schoolId: school.schoolId,
//       //                 schoolName: school.schoolName,
//       //                 childName: child.childName,
//       //                 requestType: "No Leave Request",
//       //                 startDate: null,
//       //                 endDate: null,
//       //                 statusOfRequest: "N/A",
//       //               }]
//       //         )
//       //       )
//       //     );
//       //   }

//       //   console.log(allData);

//       //   // Filter data by date range, if applicable
//       //   const filteredData = startDate || endDate
//       //     ? allData.filter((row) => {
//       //         const registrationDate = parseDate(row.formattedRegistrationDate);
//       //         const start = parseDate(startDate);
//       //         const end = parseDate(endDate);

//       //         return (
//       //           (!startDate || registrationDate >= start) &&
//       //           (!endDate || registrationDate <= end)
//       //         );
//       //       })
//       //     : allData; // Use all data if no date range specified

//       //   const reversedData = filteredData.reverse();

//       //   // Set filtered data and original data with default selection
//       //   setFilteredRows(
//       //     reversedData.map((row) => ({ ...row, isSelected: false }))
//       //   );
//       //   setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));

//       //   setTotalResponses(reversedData.length);

//       //   console.log(`Data fetched between ${startDate} and ${endDate}:`, filteredData);

//       // } else {
//       //   console.error("Expected an array but got:", response.data.children);
//       // }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false); // Stop loading indicator
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
//         "https://schoolmanagement-6-6tcs.onrender.com/school/delete";
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
//     XLSX.writeFile(workbook, "Status.xlsx");
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

//   const handleEditSubmit = async () => {
//     // Define the API URL and authentication token
//     const apiUrl = `https://schoolmanagement-6-6tcs.onrender.com/school/update-child/${selectedRow._id}`; // Replace with your actual API URL
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
//         "https://schoolmanagement-6-6tcs.onrender.com/parent/register",
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

//   useEffect(() => {
//     const fetchGeofenceData = async () => {
//       try {
//         const username = "hbgadget221@gmail.com"; // Replace with your actual username
//         const password = "123456"; // Replace with your actual password
//         const token = btoa(`${username}:${password}`); // Base64 encode the username and password

//         const response = await axios.get(
//           "http://104.251.216.99:8082/api/geofences",
//           {
//             headers: {
//               Authorization: `Basic ${token}`,
//             },
//           }
//         );

//         const data = response.data;
//         console.log(response.data);
//         // Transform data to create dropdown options
//         const options = data.map((item) => ({
//           value: item.name,
//           label: item.name,
//         }));

//         setDropdownOptions(options);
//       } catch (error) {
//         console.error("Error fetching geofence data:", error);
//       }
//     };

//     fetchGeofenceData();
//   }, []);

//   useEffect(() => {
//     const fetchOtherData = async () => {
//       try {
//         const username = "hbgadget221@gmail.com"; // Replace with your actual username
//         const password = "123456"; // Replace with your actual password
//         const token = btoa(`${username}:${password}`); // Base64 encode the username and password

//         const response = await axios.get(
//           "https://rocketsalestracker.com/api/devices", // Modify the endpoint if different
//           {
//             headers: {
//               Authorization: `Basic ${token}`,
//             },
//           }
//         );

//         const data = response.data;
//         console.log(response.data);

//         // Transform data to create dropdown options
//         const options = data.map((item) => ({
//           value: item.name,
//           label: item.name,
//         }));

//         setOtherDropdownOptions(options);
//       } catch (error) {
//         console.error("Error fetching other data:", error);
//       }
//     };

//     fetchOtherData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };
//   const handleSelectChange = (event) => {
//     setFormData({
//       ...formData,
//       [lastSecondColumn.accessor]: event.target.value,
//     });
//     setSelectedValue(event.target.value);
//   };
//   const handleOtherSelectChange = (event) => {
//     setFormData({
//       ...formData,
//       [lastThirdColumn.accessor]: event.target.value,
//     });
//     setOtherSelectedValue(event.target.value);
//   };

//   const columns = COLUMNS();
//   const lastSecondColumn = columns[columns.length - 2]; // Last second column
//   const lastThirdColumn = columns[columns.length - 3];
//   // const columns1 = COLUMNS();
//   // const lastthirdColumn = columns1[columns1.length - 3];

//   const [expandedRowId, setExpandedRowId] = useState(null);
//   const [detailedData, setDetailedData] = useState({});

//   const handleExpand = async (id) => {
//     try {
//       console.log("Expanding row with ID:", id); // Debugging statement
//       setExpandedRowId(id);

//       if (!id) {
//         console.error("ID is undefined or null");
//         return;
//       }
//       const token = localStorage.getItem("token");

//       let response;

//       // Fetch data based on role
//       if (role == 1) {
//         response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/status/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else if (role == 2) {
//         response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/status/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else if (role == 3) {
//         response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/status/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
//       // const token =
//       //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJkN2NhZDllYzhkZjg5ZTc4ODU2MiIsInVzZXJuYW1lIjoiaGFyc2hhbF8xIiwiaWF0IjoxNzI2MTM4MTY3fQ.w2PbCygMIkVg77xzOYLJXONuysGjTVkITf-IAF9ahIo"; // Replace with actual token
//       // const apiUrl = `http://63.142.251.13:4000/superadmin/status/${id}`;
//       // console.log("Fetching from URL:", apiUrl); // Debugging statement

//       // const response = await axios.get(apiUrl, {
//       //   headers: {
//       //     Authorization: `Bearer ${token}`,
//       //   },
//       // });
//       console.log(response.data);
//       const data = response.data.child;
//       console.log(data)
//       setDetailedData((prev) => ({
//         ...prev,
//         [id]: data,
//       }));
//     } catch (error) {
//       console.error("Error fetching detailed data:", error);
//     }
//   };

//   // const handleExpand = async (id) => {
//   //   if (expandedRowId === id) {
//   //     setExpandedRowId(null);
//   //     setDetailedData((prev) => {
//   //       const { [id]: _, ...rest } = prev;
//   //       return rest;
//   //     });
//   //   } else {
//   //     setExpandedRowId(id);

//   //     if (!id) {
//   //       console.error("ID is undefined or null");
//   //       return;
//   //     }

//   //     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJkN2NhZDllYzhkZjg5ZTc4ODU2MiIsInVzZXJuYW1lIjoiaGFyc2hhbF8xIiwiaWF0IjoxNzI2MTM4MTY3fQ.w2PbCygMIkVg77xzOYLJXONuysGjTVkITf-IAF9ahIo"; // Replace with actual token
//   //     const apiUrl = `http://63.142.251.13:4000/superadmin/status/${id}`;
//   //     console.log("Fetching from URL:", apiUrl);

//   //     try {
//   //       const response = await axios.get(apiUrl, {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       });
//   //       console.log(response.data);
//   //       const data = response.data.children;
//   //       setDetailedData((prev) => ({
//   //         ...prev,
//   //         [id]: data,
//   //       }));
//   //     } catch (error) {
//   //       console.error("Error fetching detailed data:", error);
//   //     }
//   //   }
//   // };

//   // const handleExpand = async (id) => {
//   //   if (expandedRowId === id) {
//   //     // Collapse the row
//   //     setExpandedRowId(null);
//   //     setDetailedData((prev) => {
//   //       const { [id]: _, ...rest } = prev; // Remove the data for the current row
//   //       return rest;
//   //     });
//   //   } else {
//   //     // Expand the row
//   //     setExpandedRowId(id);

//   //     if (!id) {
//   //       console.error("ID is undefined or null");
//   //       return;
//   //     }

//   //     const token = "your-token-here"; // Replace with actual token
//   //     const apiUrl = `http://63.142.251.13:4000/superadmin/status/${id}`;
//   //     console.log("Fetching from URL:", apiUrl);

//   //     try {
//   //       const response = await axios.get(apiUrl, {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       });

//   //       const data = response.data.child; // Access the `child` key from the response
//   //       console.log(data);

//   //       // Update detailed data with the new data
//   //       setDetailedData((prev) => ({
//   //         ...prev,
//   //         [id]: data,
//   //       }));
//   //     } catch (error) {
//   //       console.error("Error fetching detailed data:", error);
//   //     }
//   //   }
//   // };

//   return (
//     <>
//       <h1 style={{ textAlign: "center", marginTop: "80px" }}>Status</h1>
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
//         <TableContainer
//       component={Paper}
//       sx={{
//         maxHeight: 440,
//         border: "1.5px solid black",
//         borderRadius: "7px",
//       }}
//     >
//       <Table stickyHeader aria-label="sticky table" style={{ border: "1px solid black" }}>
//         <TableHead>
//           <TableRow style={{ borderBottom: "1px solid black", borderTop: "1px solid black" }}>
//             <TableCell
//               padding="checkbox"
//               style={{ borderRight: "1px solid #e0e0e0", borderBottom: "2px solid black" }}
//             >
//               <Switch
//                 checked={selectAll}
//                 onChange={handleSelectAll}
//                 color="primary"
//               />
//             </TableCell>
//             <TableCell
//               style={{
//                 minWidth: 70,
//                 borderRight: "1px solid #e0e0e0",
//                 borderBottom: "2px solid black",
//                 padding: "4px 4px",
//                 textAlign: "center",
//                 fontWeight: "bold",
//               }}
//             >
//               S.No.
//             </TableCell>
//             <TableCell
//               style={{
//                 minWidth: 70,
//                 borderRight: "1px solid #e0e0e0",
//                 borderBottom: "2px solid black",
//                 padding: "4px 4px",
//                 textAlign: "center",
//                 fontWeight: "bold",
//               }}
//             >
//               More About
//             </TableCell>
//             {COLUMNS()
//               .filter((col) => columnVisibility[col.accessor])
//               .map((column) => (
//                 <TableCell
//                   key={column.accessor}
//                   align={column.align}
//                   style={{
//                     minWidth: column.minWidth,
//                     cursor: "pointer",
//                     borderRight: "1px solid #e0e0e0",
//                     borderBottom: "2px solid black",
//                     padding: "4px 4px",
//                     textAlign: "center",
//                     fontWeight: "bold",
//                   }}
//                   onClick={() => requestSort(column.accessor)}
//                 >
//                   {column.Header}
//                   {sortConfig.key === column.accessor ? (
//                     sortConfig.direction === "ascending" ? (
//                       <ArrowUpwardIcon fontSize="small" />
//                     ) : (
//                       <ArrowDownwardIcon fontSize="small" />
//                     )
//                   ) : null}
//                 </TableCell>
//               ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {sortedData.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={
//                   COLUMNS().filter((col) => columnVisibility[col.accessor]).length + 2
//                 }
//                 style={{
//                   textAlign: "center",
//                   padding: "16px",
//                   fontSize: "16px",
//                   color: "#757575",
//                 }}
//               >
//                 <h4>No Data Available</h4>
//               </TableCell>
//             </TableRow>
//           ) : (
//             sortedData
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row, index) => (
//     //             <React.Fragment key={row.id}>
//     //               <TableRow
//     //                 hover
//     //                 role="checkbox"
//     //                 tabIndex={-1}
//     //                 onClick={() => handleRowSelect(page * rowsPerPage + index)}
//     //                 selected={row.isSelected}
//     //                 style={{
//     //                   backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//     //                   borderBottom: "none",
//     //                 }}
//     //               >
//     //                 <TableCell
//     //                   padding="checkbox"
//     //                   style={{ borderRight: "1px solid #e0e0e0" }}
//     //                 >
//     //                   <Switch checked={row.isSelected} color="primary" />
//     //                 </TableCell>
//     //                 <TableCell
//     //                   style={{
//     //                     minWidth: 70,
//     //                     borderRight: "1px solid #e0e0e0",
//     //                     paddingTop: "4px",
//     //                     paddingBottom: "4px",
//     //                     borderBottom: "none",
//     //                     textAlign: "center",
//     //                     fontSize: "smaller",
//     //                     backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//     //                   }}
//     //                 >
//     //                   {page * rowsPerPage + index + 1}
//     //                 </TableCell>
//     //                 <TableCell
//     //                   style={{
//     //                     minWidth: 70,
//     //                     borderRight: "1px solid #e0e0e0",
//     //                     paddingTop: "4px",
//     //                     paddingBottom: "4px",
//     //                     borderBottom: "none",
//     //                     textAlign: "center",
//     //                     fontSize: "smaller",
//     //                     backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//     //                   }}
//     //                 >
//     //                   <button
//     //                     style={{border: 'none',            // Removes any border
//     //                       backgroundColor: 'transparent', // Ensures no background color
//     //                       color: 'inherit',           // Inherits color from parent, ensuring it blends in
//     //                       fontSize: '20px',           // Makes the symbol larger
//     //                       lineHeight: '1',            // Keeps the symbol vertically aligned
//     //                       cursor: 'pointer',          // Indicates it's clickable
//     //                       padding: '0',               // Removes any default padding
//     //                       margin: '0',                // Removes any default margin
//     //                       display: 'inline-flex',     // Aligns the content properly
//     //                       alignItems: 'center',       // Centers the content vertically
//     //                       justifyContent: 'center', }}
//     //                     onClick={(e) => {
//     //                       e.stopPropagation();
//     //                       handleExpand(row.childId);
//     //                     }}
//     //                   >
//     //                     {expandedRowId === row.childId ? '-' : '+'}
//     //                   </button>
//     //                 </TableCell>
//     //                 {COLUMNS()
//     //                   .filter((col) => columnVisibility[col.accessor])
//     //                   .map((column) => {
//     //                     const value = row[column.accessor];
//     //                     return (
//     //                       <TableCell
//     //                         key={column.accessor}
//     //                         align={column.align}
//     //                         style={{
//     //                           borderRight: "1px solid #e0e0e0",
//     //                           paddingTop: "4px",
//     //                           paddingBottom: "4px",
//     //                           borderBottom: "none",
//     //                           backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//     //                           fontSize: "smaller",
//     //                         }}
//     //                       >
//     //                         {column.format && typeof value === "number"
//     //                           ? column.format(value)
//     //                           : value}
//     //                       </TableCell>
//     //                     );
//     //                   })}
//     //               </TableRow>
//     //               {expandedRowId === row._id && detailedData[row._id] && (
//     //                 <TableRow>
//     //                   <TableCell
//     //                     colSpan={
//     //                       COLUMNS().filter((col) => columnVisibility[col.accessor]).length + 2
//     //                     }
//     //                     style={{ padding: 0 }}
//     //                   >
//     //                     <Table className="styledetailtable" style={{ border: '1px solid black' }}>
//     //                       <TableHead>
//     //                         <TableRow>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Child Name</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Child Class</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Parent Name</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Parent Number</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Pickup Status</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Drop Status</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Pickup Time</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Drop Time</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Date</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Request</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Supervisor Name</TableCell>
//     //                         </TableRow>
//     //                       </TableHead>
//     //                       <TableBody>
//     //                         <TableRow>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].childName}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].childClass}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].parentName}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].parentNumber}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].pickupStatus}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].dropStatus}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].pickupTime}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].dropTime || "N/A"}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].date}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].request}</TableCell>
//     //                           <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].supervisorName}</TableCell>
//     //                         </TableRow>
//     //                       </TableBody>
//     //                     </Table>
//     //                      {/* <div className="table-container">
//     //   <table className="table">
//     //     <thead>
//     //       <tr>
//     //         <th>Child Name</th>
//     //         <th>Child Class</th>
//     //         <th>Parent Name</th>
//     //         <th>Parent Number</th>
//     //         <th>Pickup Status</th>
//     //         <th>Drop Status</th>
//     //         <th>Pickup Time</th>
//     //         <th>Drop Time</th>
//     //         <th>Date</th>
//     //         <th>Request</th>
//     //         <th>Supervisor Name</th>
//     //       </tr>
//     //     </thead>
//     //     <tbody>
//     //       <tr>
//     //         <td>{detailedData[row._id].childName}</td>
//     //         <td>{detailedData[row._id].childClass}</td>
//     //         <td>{detailedData[row._id].parentName}</td>
//     //         <td>{detailedData[row._id].parentNumber}</td>
//     //         <td>{detailedData[row._id].pickupStatus}</td>
//     //         <td>{detailedData[row._id].dropStatus}</td>
//     //         <td>{detailedData[row._id].pickupTime}</td>
//     //         <td>{detailedData[row._id].dropTime || 'N/A'}</td>
//     //         <td>{detailedData[row._id].date}</td>
//     //         <td>{detailedData[row._id].request}</td>
//     //         <td>{detailedData[row._id].supervisorName}</td>
//     //       </tr>
//     //     </tbody>
//     //   </table>
//     // </div> */}
//     //                   </TableCell>
//     //                 </TableRow>
//     //               )}
//     //             </React.Fragment>
//     <React.Fragment key={row.childId}>
//   <TableRow
//     hover
//     role="checkbox"
//     tabIndex={-1}
//     onClick={() => handleRowSelect(page * rowsPerPage + index)}
//     selected={row.isSelected}
//     style={{
//       backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//       borderBottom: "none",
//     }}
//   >
//     <TableCell
//       padding="checkbox"
//       style={{ borderRight: "1px solid #e0e0e0" }}
//     >
//       <Switch checked={row.isSelected} color="primary" />
//     </TableCell>
//     <TableCell
//       style={{
//         minWidth: 70,
//         borderRight: "1px solid #e0e0e0",
//         paddingTop: "4px",
//         paddingBottom: "4px",
//         borderBottom: "none",
//         textAlign: "center",
//         fontSize: "smaller",
//         backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//       }}
//     >
//       {page * rowsPerPage + index + 1}
//     </TableCell>
//     <TableCell
//       style={{
//         minWidth: 70,
//         borderRight: "1px solid #e0e0e0",
//         paddingTop: "4px",
//         paddingBottom: "4px",
//         borderBottom: "none",
//         textAlign: "center",
//         fontSize: "smaller",
//         backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//       }}
//     >
//       <button
//         style={{
//           border: 'none',
//           backgroundColor: 'transparent',
//           color: 'inherit',
//           fontSize: '20px',
//           lineHeight: '1',
//           cursor: 'pointer',
//           padding: '0',
//           margin: '0',
//           display: 'inline-flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//         onClick={(e) => {
//           e.stopPropagation();
//           handleExpand(row.childId);  // Use consistent row childId here
//         }}
//       >
//         {expandedRowId === row.childId ? '-' : '+'}
//       </button>
//     </TableCell>
//     {COLUMNS()
//       .filter((col) => columnVisibility[col.accessor])
//       .map((column) => {
//         const value = row[column.accessor];
//         return (
//           <TableCell
//             key={column.accessor}
//             align={column.align}
//             style={{
//               borderRight: "1px solid #e0e0e0",
//               paddingTop: "4px",
//               paddingBottom: "4px",
//               borderBottom: "none",
//               backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//               fontSize: "smaller",
//             }}
//           >
//             {column.format && typeof value === "number"
//               ? column.format(value)
//               : value}
//           </TableCell>
//         );
//       })}
//   </TableRow>
//   {expandedRowId === row.childId && detailedData[row.childId] && (
//     <TableRow>
//       <TableCell
//         colSpan={
//           COLUMNS().filter((col) => columnVisibility[col.accessor]).length + 2
//         }
//         style={{ padding: 0 }}
//       >
//         <Table className="styledetailtable" style={{ border: '1px solid black' }}>
//           <TableHead>
//             <TableRow>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Child Name</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Child Class</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Parent Name</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Parent Number</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Pickup Status</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Drop Status</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Pickup Time</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Drop Time</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Date</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Request</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}>Supervisor Name</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].childName}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].childClass}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].parentName}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].parentNumber}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].pickupStatus}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].dropStatus}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].pickupTime}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].dropTime || "N/A"}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].date}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].request}</TableCell>
//               <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>{detailedData[row.childId].supervisorName}</TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableCell>
//     </TableRow>
//   )}
// </React.Fragment>

//               ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
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
//               .slice(0, -3)
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
//             {/* Dropdown for the last column */}
//             {/* <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
//       <InputLabel>{lastColumn.Header}</InputLabel>
//       <Select
//         value={formData[lastColumn.accessor] || ""}
//         onChange={handleInputChange}
//         name={lastColumn.accessor}
//         label={lastColumn.Header}
//       >
//         {dropdownOptions.map((option) => (
//           <MenuItem key={option.value} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl> */}
//             <FormControl
//               variant="outlined"
//               sx={{ marginBottom: "10px" }}
//               fullWidth
//             >
//               <InputLabel>{lastThirdColumn.Header}</InputLabel>

//               <Select
//                 value={formData[lastThirdColumn.accessor] || ""}
//                 onChange={handleOtherSelectChange}
//                 name={lastThirdColumn.accessor}
//                 label={lastThirdColumn.Header}
//               >
//                 {otherDropdownOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl
//               variant="outlined"
//               sx={{ marginBottom: "10px" }}
//               fullWidth
//             >
//               <InputLabel>{lastSecondColumn.Header}</InputLabel>

//               <Select
//                 value={formData[lastSecondColumn.accessor] || ""}
//                 onChange={handleSelectChange}
//                 name={lastSecondColumn.accessor}
//                 label={lastSecondColumn.Header}
//               >
//                 {dropdownOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             {/* <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
//       <InputLabel>{lastthirdColumn.Header}</InputLabel>

//        <Select
//           value={formData[lastthirdColumn.accessor] || ""}
//           onChange={handleSelectChange2}
//           name={lastthirdColumn.accessor}
//           label={lastthirdColumn.Header}
//         >
//         {dropdownOptions.map(option => (
//           <MenuItem key={option.value} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>     */}
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
//               .slice(0, -3)
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
//             <FormControl
//               variant="outlined"
//               sx={{ marginBottom: "10px" }}
//               fullWidth
//             >
//               <InputLabel>{lastThirdColumn.Header}</InputLabel>

//               <Select
//                 value={formData[lastThirdColumn.accessor] || ""}
//                 onChange={handleOtherSelectChange}
//                 name={lastThirdColumn.accessor}
//                 label={lastThirdColumn.Header}
//               >
//                 {otherDropdownOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl
//               variant="outlined"
//               sx={{ marginBottom: "10px" }}
//               fullWidth
//             >
//               <InputLabel>{lastSecondColumn.Header}</InputLabel>
//               {/* <Select
//         value={selectedValue}
//         onChange={handleChange}
//         label="Select Geofence"
//       > */}
//               <Select
//                 value={formData[lastSecondColumn.accessor] || ""}
//                 onChange={handleSelectChange}
//                 name={lastSecondColumn.accessor}
//                 label={lastSecondColumn.Header}
//               >
//                 {dropdownOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
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
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import Export from "./ExportStatus";

// import './TableStyles.css';
//import { TextField } from '@mui/material';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Enable vertical scrolling
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
};

export const Status = () => {
  const { setTotalResponses} = useContext(TotalResponsesContext); // Get the context value

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
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [otherDropdownOptions, setOtherDropdownOptions] = useState([]);
  const [otherSelectedValue, setOtherSelectedValue] = useState("");
  const [tableData, setTableData] = useState([]);
const role=localStorage.getItem("role");
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");

  //     let response;

  //     // Fetch data based on role
  //     if (role == 1) {
  //       response = await axios.get(
  //         `${process.env.REACT_APP_SUPER_ADMIN_API}/status-of-children`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //     } else if (role == 2) {
  //       response = await axios.get(
  //         `${process.env.REACT_APP_SCHOOL_API}/status-of-children`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //     } else if (role == 3) {
  //       response = await axios.get(
  //         `${process.env.REACT_APP_BRANCH_API}/status-of-children`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //     }
  //     console.log("fetch data", response.data); // Log the entire response data

  //     if (Array.isArray(response.data.data)) {
  //       const allSchools = response.data.data;

  //       // Flatten all children from schools and branches
  //       const allChildren = allSchools.flatMap((school) =>
  //         school.branches.flatMap((branch) => branch.children)
  //       );

  //       // Function to parse dates in DD-MM-YYYY format
  //       const parseDate = (dateString) => {
  //         const [day, month, year] = dateString.split("-");
  //         return new Date(`${year}-${month}-${day}`);
  //       };

  //       // Filter data based on the provided date range
  //       const filteredData =
  //         startDate || endDate
  //           ? allChildren.filter((child) => {
  //               const requestDate = parseDate(child.request.requestDate);
  //               const start = startDate ? parseDate(startDate) : null;
  //               const end = endDate ? parseDate(endDate) : null;

  //               return (
  //                 (!start || requestDate >= start) &&
  //                 (!end || requestDate <= end)
  //               );
  //             })
  //           : allChildren; // If no date range, use all children

  //       const reversedData = filteredData.reverse();

  //       // Log the filtered data
  //       console.log(
  //         `Data fetched between ${startDate} and ${endDate}:`,
  //         filteredData
  //       );

  //       // Update state with the fetched and filtered data
  //       setFilteredRows(
  //         reversedData.map((child) => ({ ...child, isSelected: false }))
  //       );
  //       setOriginalRows(
  //         allChildren.map((child) => ({ ...child, isSelected: false }))
  //       );
  //       setTotalResponses(reversedData.length);
  //     } else {
  //       console.error("Expected an array but got:", response.data);
  //     }

  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false); // Stop loading indicator
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let response;

      // Fetch data based on role
      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/status-of-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Process response for role 1
        if (Array.isArray(response.data.data)) {
          const allSchools = response.data.data;

          // Flatten all children from schools and branches
          const allChildren = allSchools.flatMap((school) =>
            school.branches.flatMap((branch) => branch.children)
          );

          processAndSetData(allChildren);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/status-of-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Process response for role 2 (single school, with branches)
        const school = response.data;
        if (school && Array.isArray(school.branches)) {
          // Flatten all children from branches
          const allChildren = school.branches.flatMap(
            (branch) => branch.children
          );

          processAndSetData(allChildren);
        } else {
          console.error("Expected branches array but got:", response.data);
        }
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/status-of-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Process response for role 3 (array of children directly)
        if (Array.isArray(response.data)) {
          processAndSetData(response.data); // Directly use the children data
        } else {
          console.error("Expected an array but got:", response.data);
        }
      }

      console.log("fetch data", response.data); // Log the entire response data
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Helper function to process and filter the data
  const processAndSetData = (allChildren) => {
    // Function to parse dates in DD-MM-YYYY format
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split("-");
      return new Date(`${year}-${month}-${day}`);
    };

    // Filter data based on the provided date range
    const filteredData =
      startDate || endDate
        ? allChildren.filter((child) => {
            const requestDate = parseDate(child.requestDate);
            const start = startDate ? parseDate(startDate) : null;
            const end = endDate ? parseDate(endDate) : null;

            return (
              (!start || requestDate >= start) && (!end || requestDate <= end)
            );
          })
        : allChildren; // If no date range, use all children

    const reversedData = filteredData.reverse();

    // Update state with the fetched and filtered data
    setFilteredRows(
      reversedData.map((child) => ({ ...child, isSelected: false }))
    );
    setOriginalRows(
      allChildren.map((child) => ({ ...child, isSelected: false }))
    );
    setTotalResponses(reversedData.length);

    // Log the filtered data
    console.log(
      `Data fetched between ${startDate} and ${endDate}:`,
      filteredData
    );
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
        "https://schoolmanagement-6-6tcs.onrender.com/school/delete";
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0"; // Replace with actual token

      // Send delete requests for each selected ID
      const deleteRequests = selectedIds.map((id) =>
        fetch(`${apiUrl}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error deleting record with ID ${id}: ${response.statusText}`
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

  const handleAddButtonClick = () => {
    setFormData({});
    setAddModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    setModalOpen(false);
    setFormData({});
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditSubmit = async () => {
    // Define the API URL and authentication token
    const apiUrl = `https://schoolmanagement-6-6tcs.onrender.com/school/update-child/${selectedRow._id}`; // Replace with your actual API URL
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0"; // Replace with your actual authentication token

    // Prepare the updated data
    const updatedData = {
      ...formData,
      isSelected: false,
    };

    try {
      // Perform the PUT request
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      // Check if the response is okay (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Optionally: Process the response data if needed
      const result = await response.json();
      console.log("Update successful:", result);
      alert("updated successfully");
      // Update local state after successful API call
      const updatedRows = filteredRows.map((row) =>
        row.id === selectedRow.id
          ? { ...row, ...formData, isSelected: false }
          : row
      );
      setFilteredRows(updatedRows);

      // Close the modal
      handleModalClose();
      fetchData();
    } catch (error) {
      console.error("Error updating row:", error);
      alert("error updating code");
      // Optionally: Handle the error (e.g., show a notification or message to the user)
    }
    fetchData();
  };

  const handleAddSubmit = async () => {
    try {
      const newRow = {
        ...formData,
        id: filteredRows.length + 1,
        isSelected: false,
      };

      // POST request to the server
      const response = await fetch(
        "https://schoolmanagement-6-6tcs.onrender.com/parent/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRow),
        }
      );
      alert("record created successfully");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Assuming the server returns the created object
      const result = await response.json();

      // Update the state with the new row
      setFilteredRows([...filteredRows, result]);

      // Close the modal
      handleModalClose();
      fetchData();
      console.log("error occured in post method");
    } catch (error) {
      console.error("Error during POST request:", error);
      alert("unable to create record");
      // Handle the error appropriately (e.g., show a notification to the user)
    }
  };

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSelectChange = (event) => {
    setFormData({
      ...formData,
      [lastSecondColumn.accessor]: event.target.value,
    });
    setSelectedValue(event.target.value);
  };
  const handleOtherSelectChange = (event) => {
    setFormData({
      ...formData,
      [lastThirdColumn.accessor]: event.target.value,
    });
    setOtherSelectedValue(event.target.value);
  };

  const columns = COLUMNS();
  const lastSecondColumn = columns[columns.length - 2]; // Last second column
  const lastThirdColumn = columns[columns.length - 3];
  // const columns1 = COLUMNS();
  // const lastthirdColumn = columns1[columns1.length - 3];

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [detailedData, setDetailedData] = useState({});

  const handleExpand = async (id) => {
    try {
      console.log("Expanding row with ID:", id); // Debugging statement
      setExpandedRowId(id);

      if (!id) {
        console.error("ID is undefined or null");
        return;
      }
      const token = localStorage.getItem("token");

      let response;

      // Fetch data based on role
      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/status/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/status/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/status/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log(response.data);
      const data = response.data.child;
      console.log(data);
      setDetailedData((prev) => ({
        ...prev,
        [id]: data,
      }));
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>Status</h1>
      <div>
      <div
  style={{
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap", // Allow items to wrap on smaller screens
  }}
>
  <TextField
    label="Search"
    variant="outlined"
    value={filterText}
    onChange={handleFilterChange}
    sx={{
      marginRight: "10px",
      width: "200px", // Adjusted width for consistency
      '& .MuiOutlinedInput-root': {
        height: '36px', // Reduced height
        padding: '0px', // Remove padding to compact it
      },
      '& .MuiInputLabel-root': {
        top: '-6px', // Adjust label position for smaller size
        fontSize: '14px', // Slightly smaller font
      },
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
      gap: "5px", // Consistent gap
      padding: "6px 12px", // Added padding for better click area
      '&:hover': {
        backgroundColor: "rgb(100, 100, 100)", // Lighter shade on hover
      },
    }}
  >
    <ImportExportIcon />
    Column Visibility
  </Button>

  <Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} style={{marginRight:'5px'}}/>


  <input
    type="date"
    id="startDate"
    placeholder="DD-MM-YYYY"
    style={{
      width: "130px",
      marginRight: "10px",
      padding: "6px 10px", // Increased padding for better click area
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
      padding: "6px 12px", // Increased padding for better click area
      borderRadius: "5px",
      cursor: "pointer",
      '&:hover': {
        backgroundColor: "#115293", // Darker blue on hover
      },
    }}
  >
    Apply Date Range
  </button>
</div>

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
                maxHeight: 550,
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
                        minWidth: 70,
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "2px solid black",
                        padding: "4px 4px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      S.No.
                    </TableCell>
                    <TableCell
                      style={{
                        minWidth: 70,
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "2px solid black",
                        padding: "4px 4px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      More About
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
                          ).length + 2
                        }
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          fontSize: "16px",
                          color: "#757575",
                        }}
                      >
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
                        <React.Fragment key={row.childId}>
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            onClick={() =>
                              handleRowSelect(page * rowsPerPage + index)
                            }
                            selected={row.isSelected}
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                              borderBottom: "none",
                            }}
                          >
                            <TableCell
                              padding="checkbox"
                              style={{ borderRight: "1px solid #e0e0e0" }}
                            >
                              <Switch
                                checked={row.isSelected}
                                color="primary"
                              />
                            </TableCell>
                            <TableCell
                              style={{
                                minWidth: 70,
                                borderRight: "1px solid #e0e0e0",
                                paddingTop: "4px",
                                paddingBottom: "4px",
                                borderBottom: "none",
                                textAlign: "center",
                                fontSize: "smaller",
                                backgroundColor:
                                  index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                              }}
                            >
                              {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell
                              style={{
                                minWidth: 70,
                                borderRight: "1px solid #e0e0e0",
                                paddingTop: "4px",
                                paddingBottom: "4px",
                                borderBottom: "none",
                                textAlign: "center",
                                fontSize: "smaller",
                                backgroundColor:
                                  index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                              }}
                            >
                              <button
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                  color: "inherit",
                                  fontSize: "20px",
                                  lineHeight: "1",
                                  cursor: "pointer",
                                  padding: "0",
                                  margin: "0",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExpand(row.childId); // Use consistent row childId here
                                }}
                              >
                                {expandedRowId === row.childId ? "-" : "+"}
                              </button>
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
                                        index % 2 === 0
                                          ? "#ffffff"
                                          : "#eeeeefc2",
                                      fontSize: "smaller",
                                    }}
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                          </TableRow>
                          {expandedRowId === row.childId &&
                            detailedData[row.childId] && (
                              <TableRow>
                                <TableCell
                                  colSpan={
                                    COLUMNS().filter(
                                      (col) => columnVisibility[col.accessor]
                                    ).length + 2
                                  }
                                  style={{ padding: 0 }}
                                >
                                  <Table
                                    className="styledetailtable"
                                    style={{ border: "1px solid black" }}
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Child Name
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Child Class
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Parent Name
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Parent Number
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Pickup Status
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Drop Status
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Pickup Time
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Drop Time
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Date
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Request
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Supervisor Name
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {detailedData[row.childId].childName}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {detailedData[row.childId].childClass}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {detailedData[row.childId].parentName}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {
                                            detailedData[row.childId]
                                              .parentNumber
                                          }
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {
                                            detailedData[row.childId]
                                              .pickupStatus
                                          }
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {detailedData[row.childId].dropStatus}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {detailedData[row.childId].pickupTime}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {detailedData[row.childId].dropTime ||
                                            "N/A"}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {detailedData[row.childId].date}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {detailedData[row.childId].request}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            borderRight: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {
                                            detailedData[row.childId]
                                              .supervisorName
                                          }
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableCell>
                              </TableRow>
                            )}
                        </React.Fragment>
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
          <Box sx={style}>
            {/* <h2>Edit Row</h2> */}
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
            {COLUMNS()
              .slice(0, -3)
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

            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <InputLabel>{lastThirdColumn.Header}</InputLabel>

              <Select
                value={formData[lastThirdColumn.accessor] || ""}
                onChange={handleOtherSelectChange}
                name={lastThirdColumn.accessor}
                label={lastThirdColumn.Header}
              >
                {otherDropdownOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <InputLabel>{lastSecondColumn.Header}</InputLabel>

              <Select
                value={formData[lastSecondColumn.accessor] || ""}
                onChange={handleSelectChange}
                name={lastSecondColumn.accessor}
                label={lastSecondColumn.Header}
              >
                {dropdownOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSubmit}
            >
              Submit
            </Button>
          </Box>
        </Modal>
        <Modal open={addModalOpen} onClose={handleModalClose}>
          <Box sx={style}>
            {/* <h2>Add Row</h2> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Add Row</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {COLUMNS()
              .slice(0, -3)
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
            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <InputLabel>{lastThirdColumn.Header}</InputLabel>

              <Select
                value={formData[lastThirdColumn.accessor] || ""}
                onChange={handleOtherSelectChange}
                name={lastThirdColumn.accessor}
                label={lastThirdColumn.Header}
              >
                {otherDropdownOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <InputLabel>{lastSecondColumn.Header}</InputLabel>

              <Select
                value={formData[lastSecondColumn.accessor] || ""}
                onChange={handleSelectChange}
                name={lastSecondColumn.accessor}
                label={lastSecondColumn.Header}
              >
                {dropdownOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubmit}
            >
              Submit
            </Button>
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
