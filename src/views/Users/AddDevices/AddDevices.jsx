




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
// import {Select, MenuItem, InputLabel, FormControl } from '@mui/material';
// import { Category } from "@mui/icons-material";
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

// export const AddDevices = () => {
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



// const fetchData = async () => {
//   console.log('Fetching data...');
//   setLoading(true); // Set loading to true when starting fetch

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     // First API call to fetch devices
//     const firstApiResponse = await axios.get("https://rocketsalestracker.com/api/devices", {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//     });

//     console.log('First API Data:', firstApiResponse.data);

//     // Second API call to fetch school, branch, and device info
//     const secondApiResponse = await axios.get("http://63.142.251.13:4000/superadmin/read-devices", {
//       headers: {
//         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJkN2NhZDllYzhkZjg5ZTc4ODU2MiIsInVzZXJuYW1lIjoiaGFyc2hhbF8xIiwiaWF0IjoxNzI2MTM4MTY3fQ.w2PbCygMIkVg77xzOYLJXONuysGjTVkITf-IAF9ahIo`, // Replace with actual token if necessary
//       },
//     });

//     console.log('Second API Data:', secondApiResponse.data.data);

//     // Check if the first API returns an array
//     if (Array.isArray(firstApiResponse.data)) {
//       // Map through the first API response
//       const wrappedData = firstApiResponse.data.map((device) => {
//         // Find matching school/branch device in the second API response
//         let schoolName = '';
//         let branchName = '';
//         let foundDevice = null;

//         // Loop through each school and its branches in the second API response
//         secondApiResponse.data.data.forEach(school => {
//           school.branches.forEach(branch => {
//             // Search for the device by deviceId
//             const matchingDevice = branch.devices.find(d => d.deviceId === device.id.toString());
//             if (matchingDevice) {
//               schoolName = school.schoolName;
//               branchName = branch.branchName;
//               foundDevice = matchingDevice;
//             }
//           });
//         });

//         // Return the combined data, including schoolName and branchName
//         return {
//           ...device,
//           isSelected: false,
//           schoolName: schoolName || 'Unknown School',
//           branchName: branchName || 'Unknown Branch',
//           deviceName: foundDevice ? foundDevice.deviceName : device.name
//         };
//       });

//       // Set the state with the combined data
//       setFilteredRows(wrappedData);
//       setTotalResponses(wrappedData.length);
//     } else {
//       console.error('Expected an array from the first API, but got:', firstApiResponse.data);
//       alert('Unexpected data format received from the first API.');
//     }
//   } catch (error) {
//     console.error('Fetch data error:', error);
//     alert('An error occurred while fetching data.');
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterData(filterText);
//   }, [filterText]);

 

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
//     // Apply text-based filtering
//     if (text === "") {
//       // If no text is provided, reset to original rows
//       setFilteredRows(originalRows.map(row => ({ ...row, isSelected: false })));
//     } else {
//       // Filter based on text
//       const filteredData = originalRows
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
//         return row.id; // Use 'id' if '_id' is not defined; ensure id exists and is not undefined
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
//       // Define the API endpoint and credentials
//       const apiUrl = "https://rocketsalestracker.com/api/devices"; // Replace with actual API endpoint
//       const username = "schoolmaster"; // Replace with your actual username
//       const password = "123456"; // Replace with your actual password
//       const token = btoa(`${username}:${password}`); // Encode credentials in Base64
  
//       // Send delete requests for each selected ID
//       const deleteRequests = selectedIds.map((id) =>
//         fetch(`${apiUrl}/${id}`, {
//           method: "DELETE",
//           headers: {
//             "Authorization": `Basic ${token}`, // Add Basic Auth header
//             "Content-Type": "application/json",
//           },
//         }).then((response) => {
//           if (!response.ok) {
//             throw new Error(
//               `Error deleting record with ID ${id}: ${response.statusText}`
//             );
//           }
//           return response; // No need to parse JSON for a 204 response
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
  
//     // Refresh data
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
//     XLSX.writeFile(workbook, "AddDevices.xlsx");
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

  

// const handleEditSubmit = async () => {
//   try {
//     const apiUrl1 = `https://rocketsalestracker.com/api/devices/${selectedRow.id}`;
//     const apiUrl2 = `http://63.142.251.13:4000/superadmin/add-device`;

//     const username = "schoolmaster";
//     const password = "123456";
//     const token1 = btoa(`${username}:${password}`);
//     const token2 = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJkN2NhZDllYzhkZjg5ZTc4ODU2MiIsInVzZXJuYW1lIjoiaGFyc2hhbF8xIiwiaWF0IjoxNzI2MTM4MTY3fQ.w2PbCygMIkVg77xzOYLJXONuysGjTVkITf-IAF9ahIo`;

//     const { isSelected, ...updatedData } = formData;

//     const updatedRow = {
//       name: updatedData.name,
//       uniqueId: updatedData.uniqueId,
//       groupId: updatedData.groupId,
//       attributes: updatedData.attributes || {},
//       calendarId: updatedData.calendarId,
//       status: updatedData.status,
//       phone: updatedData.phone,
//       model: updatedData.model,
//       expirationTime: updatedData.expirationTime,
//       contact: updatedData.contact,
//       category: updatedData.category,
//     };

//     // Send PUT request to the first API
//     const response1 = await fetch(apiUrl1, {
//       method: "PUT",
//       headers: {
//         "Authorization": `Basic ${token1}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedRow),
//     });

//     const result1 = await response1.json();
//     console.log("First API Response (result1):", result1);

//     if (response1.ok) {
//       console.log("Record updated successfully in the first API:", result1);

//       // Prepare data for the second API (POST)
//       const schoolData = {
//         deviceId: selectedRow.id,    // Ensure the correct deviceId
//         deviceName: result1.name,
//         schoolName: updatedData.schoolName,
//         branchName: updatedData.branchName,
//       };

//       // Log the data to be sent to the second API
//       console.log("Data being sent to the second API (POST):", schoolData);

//       // Send POST request to the second API
//       const response2 = await fetch(apiUrl2, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token2}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(schoolData),
//       });

//       // Try to parse the response as JSON only if the content type is JSON
//       const contentType = response2.headers.get("content-type");
//       if (contentType && contentType.includes("application/json")) {
//         const result2 = await response2.json();
//         console.log("Second API Response (result2):", result2);

//         if (response2.ok) {
//           console.log("Record updated successfully in the second API (POST):", result2);
//           alert("Record updated successfully");
//         } else {
//           console.error("Server responded with an error for the second API:", result2);
//           alert(`Unable to update record in the second API (POST): ${result2.message || response2.statusText}`);
//         }
//       } else {
//         // Handle cases where the response is not JSON
//         const textResponse = await response2.text();
//         console.error("Second API Response (non-JSON):", textResponse);
//         alert(`Error: ${textResponse}`);
//       }
//     } else {
//       console.error("Server responded with an error for the first API:", result1);
//       alert(`Unable to update record in the first API: ${result1.message || response1.statusText}`);
//     }
//   } catch (error) {
//     console.error("Error during requests:", error);
//     alert("Unable to update record");
//   }
// };





 


// const [groups, setGroups] = useState([]);
// // const [error, setError] = useState(null);
// const [error, setError] = useState(null);
// useEffect(() => {
//   const fetchGroups = async () => {
//     try {
//       const response = await fetch('https://rocketsalestracker.com/api/groups', {
//         method: 'GET',
//         headers: {
//           'Authorization': 'Basic ' + btoa('school:123456') // Replace with actual credentials
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       setGroups(data); // Assuming the API returns { groups: [...] }
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   fetchGroups();
// }, []);





// const [calendars, setCalendars] = useState([]); // State to store calendar data
// const [calendarError, setCalendarError] = useState(null); // State to store error

// useEffect(() => {
//   const fetchCalendars = async () => {
//     try {
//       const response = await fetch('https://rocketsalestracker.com/api/calendars', {
//         method: 'GET',
//         headers: {
//           'Authorization': 'Basic ' + btoa('school:123456') // Replace with actual credentials
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       setCalendars(data); // Assuming the API returns { calendars: [...] }
//     } catch (error) {
//       setCalendarError(error.message);
//     }
//   };

//   fetchCalendars();
// }, []);

// const [schools, setSchools] = useState([]); // State for schools
// const [branches, setBranches] = useState([]); // State for branches
// const handleInputChange = (e) => {
//   const { name, value } = e.target;
//   setFormData({
//     ...formData,
//     [name]: value,
//   });
//   if (name === "schoolName") {
//     const selectedSchoolData = schools.find(
//       (school) => school.schoolName === value
//     );

//     console.log(selectedSchoolData);
//     if (selectedSchoolData) {
//       // Combine branchName and branches
//       const allBranches = [];
//       if (selectedSchoolData.branchName) {
//         allBranches.push({
//           branchName: selectedSchoolData.branchName,
//           branchId: selectedSchoolData._id,
//         });
//       }

//       if (
//         selectedSchoolData.branches &&
//         selectedSchoolData.branches.length > 0
//       ) {
//         selectedSchoolData.branches.forEach((branch) => {
//           allBranches.push({
//             branchName: branch.branchName,
//             branchId: branch._id,
//           });
//         });
//       }

//       setBranches(allBranches);
//     }
//   }
// };
// useEffect(() => {
//   const fetchSchool = async (startDate = "", endDate = "") => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${process.env.REACT_APP_SUPER_ADMIN_API}/getschools`,
//         {
//           headers: {
//             Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJkN2NhZDllYzhkZjg5ZTc4ODU2MiIsInVzZXJuYW1lIjoiaGFyc2hhbF8xIiwiaWF0IjoxNzI1NTE5MTc3fQ.bdjnmN2c20DjmMAvNL1L_TN59iGOa_MnblhcQQK5d4w",
//           },
//         }
//       );

//       console.log("fetch data", response.data); // Log the entire response data

//       if (Array.isArray(response.data.schools)) {
//         const allData = response.data.schools;
//         setSchools(allData);

//         // console.log(school);

//         console.log(allData);
//       } else {
//         console.error(
//           "Expected an array but got:",
//           response.data.supervisors
//         );
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

 

//   fetchSchool();
// }, [addModalOpen]);



// const handleAddSubmit = async () => {
//   try {
//     // Define the API endpoints and credentials
//     const apiUrl1 = "https://rocketsalestracker.com/api/devices"; // First API endpoint
//     const apiUrl2 = "http://63.142.251.13:4000/superadmin/add-device"; // Second API endpoint
//     const username = "schoolmaster"; // Replace with your actual username
//     const password = "123456"; // Replace with your actual password
//     const token1 = btoa(`${username}:${password}`); // Encode credentials in Base64 for first URL
//     const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJkN2NhZDllYzhkZjg5ZTc4ODU2MiIsInVzZXJuYW1lIjoiaGFyc2hhbF8xIiwiaWF0IjoxNzI2MTM4MTY3fQ.w2PbCygMIkVg77xzOYLJXONuysGjTVkITf-IAF9ahIo"; // Token for the second URL

//     // Prepare the data for the first API
//     const newRow = {
//       name: formData.name,
//       uniqueId: formData.uniqueId,
//       groupId: formData.groupId,
//       attributes: formData.attributes || {},
//       calendarId: formData.calendarId,
//       status: formData.status,
//       phone: formData.phone,
//       model: formData.model,
//       expirationTime: formData.expirationTime,
//       contact: formData.contact,
//       category: formData.category,
//     };

//     // Post data to the first URL
//     const response1 = await fetch(apiUrl1, {
//       method: "POST",
//       headers: {
//         "Authorization": `Basic ${token1}`, // Add Basic Auth header for the first URL
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newRow),
//     });

//     const result1 = await response1.json();

//     if (response1.ok) {
//       console.log("Record created successfully in the first API:", result1);

//       // Prepare the data for the second API using the response from the first API
//       const schoolData = {
//         deviceId: result1.id, // Use the ID returned by the first API
//         deviceName: result1.name, // Use the name returned by the first API
//         schoolName: formData.schoolName, // From form data
//         branchName: formData.branchName, // From form data
//       };

//       // Post data to the second URL
//       const response2 = await fetch(apiUrl2, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token2}`, // Add Bearer Auth header for the second URL
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(schoolData),
//       });

//       const result2 = await response2.json();

//       if (response2.ok) {
//         // Update the state and close the modal if both requests succeed
//         setFilteredRows([...filteredRows, result1]);
//         handleModalClose();
//         fetchData();
//         console.log("Record created successfully in the second API:", result2);
//         alert("Record created successfully");
//       } else {
//         console.error("Server responded with an error for the second API:", result2);
//         alert(`Unable to create record in the second API: ${result2.message || response2.statusText}`);
//       }
//     } else {
//       console.error("Server responded with an error for the first API:", result1);
//       alert(`Unable to create record in the first API: ${result1.message || response1.statusText}`);
//     }
//   } catch (error) {
//     console.error("Error during POST requests:", error);
//     alert("Unable to create record");
//   }
// };



//   return (
//     <>
//       <h1 style={{ textAlign: "center", marginTop: "80px" }}>
//       Add Devices      </h1>
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
//   stickyHeader
//   aria-label="sticky table"
//   style={{ border: "1px solid black" }}
// >
//   <TableHead>
//     <TableRow
//       style={{
//         borderBottom: "1px solid black",
//         borderTop: "1px solid black",
//       }}
//     >
//       <TableCell
//         padding="checkbox"
//         style={{
//           borderRight: "1px solid #e0e0e0",
//           borderBottom: "2px solid black",
//         }}
//       >
//         <Switch
//           checked={selectAll}
//           onChange={handleSelectAll}
//           color="primary"
//         />
//       </TableCell>
//       {COLUMNS()
//         .filter((col) => columnVisibility[col.accessor])
//         .map((column) => (
//           <TableCell
//             key={column.accessor}
//             align={column.align}
//             style={{
//               minWidth: column.minWidth,
//               cursor: "pointer",
//               borderRight: "1px solid #e0e0e0",
//               borderBottom: "2px solid black",
//               padding: "4px 4px",
//               textAlign: "center",
//               fontWeight: "bold",
//             }}
//             onClick={() => requestSort(column.accessor)}
//           >
//             {column.Header}
//             {sortConfig.key === column.accessor ? (
//               sortConfig.direction === "ascending" ? (
//                 <ArrowUpwardIcon fontSize="small" />
//               ) : (
//                 <ArrowDownwardIcon fontSize="small" />
//               )
//             ) : null}
//           </TableCell>
//         ))}
//     </TableRow>
//   </TableHead>
//   <TableBody>
//     {sortedData.length === 0 ? (
//       <TableRow>
//         <TableCell
//           colSpan={COLUMNS().filter((col) => columnVisibility[col.accessor]).length}
//           style={{
//             textAlign: 'center',
//             padding: '16px',
//             fontSize: '16px',
//             color: '#757575',
//           }}
//         >
//           <h4>No Data Available</h4>
//         </TableCell>
//       </TableRow>
//     ) : (
//       sortedData
//         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//         .map((row, index) => (
//           <TableRow
//             hover
//             role="checkbox"
//             tabIndex={-1}
//             key={row.id}
//             onClick={() =>
//               handleRowSelect(page * rowsPerPage + index)
//             }
//             selected={row.isSelected}
//             style={{
//               backgroundColor:
//                 index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//               borderBottom: "none",
//             }}
//           >
//             <TableCell
//               padding="checkbox"
//               style={{ borderRight: "1px solid #e0e0e0" }}
//             >
//               <Switch checked={row.isSelected} color="primary" />
//             </TableCell>
//             {COLUMNS()
//               .filter((col) => columnVisibility[col.accessor])
//               .map((column) => {
//                 // Debug output
//                 // console.log(`Row data: ${JSON.stringify(row)}, Column accessor: ${column.accessor}`);

//                 // Access the correct value from the row
//                 const value = column.accessor.split('.').reduce((acc, part) => acc && acc[part], row);

//                 return (
//                   <TableCell
//                     key={column.accessor}
//                     align={column.align}
//                     style={{
//                       borderRight: "1px solid #e0e0e0",
//                       paddingTop: "4px",
//                       paddingBottom: "4px",
//                       borderBottom: "none",
//                       backgroundColor:
//                         index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                       fontSize: "smaller",
//                     }}
//                   >
//                     {column.Cell ? column.Cell({ value }) : value}
//                   </TableCell>
//                 );
//               })}
//           </TableRow>
//         ))
//     )}
//   </TableBody>
// </Table>

//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[10, 25, 100,1000,3000]}
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
//        {/* Edit model dropdown */}
//         <Modal open={editModalOpen} onClose={handleModalClose}>
//   <Box sx={style}>
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         marginBottom: "20px",
//       }}
//     >
//       <h2 style={{ flexGrow: 1 }}>Edit Row</h2>
//       <IconButton onClick={handleModalClose}>
//         <CloseIcon />
//       </IconButton>
//     </Box>
//     {COLUMNS().map((col) => (
//         col.accessor === 'groupId' && col.Header === 'Group ID' ? (
//           <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
//             <InputLabel id="group-select-label">Group ID</InputLabel>
//             <Select
//               labelId="group-select-label"
//               label="Group ID"
//               name={col.accessor}
//               value={formData[col.accessor] || ''}
//               onChange={handleInputChange}
//             >
//               {groups.map((group) => (
//                 <MenuItem key={group.id} value={group.id}>
//                   {group.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         ) : col.accessor === 'category' && col.Header === 'Category' ? (
//           <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
//             <InputLabel id="category-select-label">Category</InputLabel>
//             <Select
//               labelId="category-select-label"
//               label="Category"
//               name={col.accessor}
//               value={formData[col.accessor] || ''}
//               onChange={handleInputChange}
//             >
//               <MenuItem value={"Default"}>Default</MenuItem>
//               <MenuItem value={"Animal"}>Animal</MenuItem>
//               <MenuItem value={"Bicycle"}>Bicycle</MenuItem>
//               <MenuItem value={"Boat"}>Boat</MenuItem>
//               <MenuItem value={"Bus"}>Bus</MenuItem>
//               <MenuItem value={"Car"}>Car</MenuItem>
//               <MenuItem value={"Camper"}>Camper</MenuItem>
//               <MenuItem value={"Crane"}>Crane</MenuItem>
//               <MenuItem value={"Helicopter"}>Helicopter</MenuItem>
//               <MenuItem value={"Motorcycle"}>Motorcycle</MenuItem>
//               <MenuItem value={"Offroad"}>Offroad</MenuItem>
//               <MenuItem value={"Person"}>Person</MenuItem>
//               <MenuItem value={"Pickup"}>Pickup</MenuItem>
//               <MenuItem value={"Plane"}>Plane</MenuItem>
//               <MenuItem value={"Ship"}>Ship</MenuItem>
//               <MenuItem value={"Tractor"}>Tractor</MenuItem>
//               <MenuItem value={"Train"}>Train</MenuItem>
//               <MenuItem value={"Tram"}>Tram</MenuItem>
//               <MenuItem value={"Trolleybus"}>Trolleybus</MenuItem>
//               <MenuItem value={"Truck"}>Truck</MenuItem>
//               <MenuItem value={"Van"}>Van</MenuItem>
//               <MenuItem value={"Scooter"}>Scooter</MenuItem>
//             </Select>
//           </FormControl>
//         ) : col.accessor === 'calendarId' && col.Header === 'Calendar ID' ? (
//           <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
//             <InputLabel id="calendar-select-label">Calendar ID</InputLabel>
//             <Select
//               labelId="calendar-select-label"
//               label="Calendar ID"
//               name={col.accessor}
//               value={formData[col.accessor] || ''}
//               onChange={handleInputChange}
//             >
//               {calendars.map((calendar) => (
//                 <MenuItem key={calendar.id} value={calendar.id}>
//                   {calendar.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         ) : (
//           <TextField
//             key={col.accessor}
//             label={col.Header}
//             variant="outlined"
//             name={col.accessor}
//             value={formData[col.accessor] || ""}
//             onChange={handleInputChange}
//             sx={{ marginBottom: "10px" }}
//             fullWidth
//           />
//         )
//       ))}
//         {/* School Name dropdown */}
//     <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
//       <InputLabel>School Name</InputLabel>
//       <Select
//         value={formData['schoolName'] || ''}
//         onChange={handleInputChange}
//         name="schoolName"
//         label="School Name"
//       >
//         {schools.map((option) => (
//           <MenuItem key={option._id} value={option.schoolName}>
//             {option.schoolName}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     {/* Branch Name dropdown */}
//     <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
//       <InputLabel>Branch Name</InputLabel>
//       <Select
//         value={formData['branchName'] || ''}
//         onChange={handleInputChange}
//         name="branchName"
//         label="Branch Name"
//       >
//         {branches?.map((option) => (
//           <MenuItem key={option.branchId} value={option.branchName}>
//             {option.branchName}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//     <Button
//       variant="contained"
//       color="primary"
//       onClick={handleEditSubmit}
//     >
//       Submit
//     </Button>
//   </Box>
// </Modal>

  

// <Modal open={addModalOpen} onClose={handleModalClose}>
//   <Box sx={style}>
//     <Box
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         marginBottom: '20px',
//       }}
//     >
//       <h2 style={{ flexGrow: 1 }}>Add Row</h2>
//       <IconButton onClick={handleModalClose}>
//         <CloseIcon />
//       </IconButton>
//     </Box>

//     {COLUMNS().map((col) =>
//       col.accessor === 'groupId' && col.Header === 'Group ID' ? (
//         <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
//           <InputLabel id="group-select-label">Group ID</InputLabel>
//           <Select
//             labelId="group-select-label"
//             label="Group ID"
//             name={col.accessor}
//             value={formData[col.accessor] || ''}
//             onChange={handleInputChange}
//           >
//             {groups.map((group) => (
//               <MenuItem key={group.id} value={group.id}>
//                 {group.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       ) : col.accessor === 'category' && col.Header === 'Category' ? (
//         <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
//           <InputLabel id="category-select-label">Category</InputLabel>
//           <Select
//             labelId="category-select-label"
//             label="Category"
//             name={col.accessor}
//             value={formData[col.accessor] || ''}
//             onChange={handleInputChange}
//           >
//             <MenuItem value={"Default"}>Default</MenuItem>
//             <MenuItem value={"Animal"}>Animal</MenuItem>
//             <MenuItem value={"Bicycle"}>Bicycle</MenuItem>
//             <MenuItem value={"Boat"}>Boat</MenuItem>
//             <MenuItem value={"Bus"}>Bus</MenuItem>
//             <MenuItem value={"Car"}>Car</MenuItem>
//             <MenuItem value={"Camper"}>Camper</MenuItem>
//             <MenuItem value={"Crane"}>Crane</MenuItem>
//             <MenuItem value={"Helicopter"}>Helicopter</MenuItem>
//             <MenuItem value={"Motorcycle"}>Motorcycle</MenuItem>
//             <MenuItem value={"Offroad"}>Offroad</MenuItem>
//             <MenuItem value={"Person"}>Person</MenuItem>
//             <MenuItem value={"Pickup"}>Pickup</MenuItem>
//             <MenuItem value={"Plane"}>Plane</MenuItem>
//             <MenuItem value={"Ship"}>Ship</MenuItem>
//             <MenuItem value={"Tractor"}>Tractor</MenuItem>
//             <MenuItem value={"Train"}>Train</MenuItem>
//             <MenuItem value={"Tram"}>Tram</MenuItem>
//             <MenuItem value={"Trolleybus"}>Trolleybus</MenuItem>
//             <MenuItem value={"Truck"}>Truck</MenuItem>
//             <MenuItem value={"Van"}>Van</MenuItem>
//             <MenuItem value={"Scooter"}>Scooter</MenuItem>
//           </Select>
//         </FormControl>
//       ) : col.accessor === 'calendarId' && col.Header === 'Calendar ID' ? (
//         <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
//           <InputLabel id="calendar-select-label">Calendar ID</InputLabel>
//           <Select
//             labelId="calendar-select-label"
//             label="Calendar ID"
//             name={col.accessor}
//             value={formData[col.accessor] || ''}
//             onChange={handleInputChange}
//           >
//             {calendars.map((calendar) => (
//               <MenuItem key={calendar.id} value={calendar.id}>
//                 {calendar.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       ) : (
//         <TextField
//           key={col.accessor}
//           label={col.Header}
//           variant="outlined"
//           name={col.accessor}
//           value={formData[col.accessor] || ''}
//           onChange={handleInputChange}
//           sx={{ marginBottom: '10px' }}
//           fullWidth
//         />
//       )
//     )}

//     {/* School Name dropdown */}
//     <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
//       <InputLabel>School Name</InputLabel>
//       <Select
//         value={formData['schoolName'] || ''}
//         onChange={handleInputChange}
//         name="schoolName"
//         label="School Name"
//       >
//         {schools.map((option) => (
//           <MenuItem key={option._id} value={option.schoolName}>
//             {option.schoolName}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     {/* Branch Name dropdown */}
//     <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
//       <InputLabel>Branch Name</InputLabel>
//       <Select
//         value={formData['branchName'] || ''}
//         onChange={handleInputChange}
//         name="branchName"
//         label="Branch Name"
//       >
//         {branches?.map((option) => (
//           <MenuItem key={option.branchId} value={option.branchName}>
//             {option.branchName}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     {/* Submit button */}
//     <Button variant="contained" color="primary" onClick={handleAddSubmit}>
//       Submit
//     </Button>
//   </Box>
// </Modal>


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




//new code for search






import React, { useState, useEffect, useContext, Component, useMemo } from "react";
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
import {Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Category } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment"; // Add this import

import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import SchoolIcon from '@mui/icons-material/School';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import HelpIcon from '@mui/icons-material/Help';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PinDropIcon from '@mui/icons-material/PinDrop';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AodIcon from '@mui/icons-material/Aod';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CategoryIcon from '@mui/icons-material/Category';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
//import { TextField } from '@mui/material';
import Export from "../../Export";

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

export const AddDevices = () => {
  const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

  const [rowsPerPage, setRowsPerPage] = useState(10); // Default to 10 initially
const [page, setPage] = useState(0);
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
  const role = localStorage.getItem("role");

  // Update rowsPerPage to sortedData.length once sortedData is initialized

const fetchData = async () => {
  console.log('Fetching data...');
  setLoading(true); // Set loading to true when starting fetch

  try {
    const username = "schoolmaster";
    const password = "123456";
    const token = btoa(`${username}:${password}`);
    const tokenschool = localStorage.getItem("token");
    // First API call to fetch devices
    const firstApiResponse = await axios.get("https://rocketsalestracker.com/api/devices", {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    console.log('First API Data:', firstApiResponse.data);

    // Second API call to fetch school, branch, and device info
    const secondApiResponse = await axios.get("http://63.142.251.13:4000/superadmin/read-devices", {
      headers: {
        Authorization: `Bearer ${tokenschool}`, // Replace with actual token if necessary
      },
    });

    console.log('Second API Data:', secondApiResponse.data.data);

    // Check if the first API returns an array
    if (Array.isArray(firstApiResponse.data)) {
      // Map through the first API response
      const wrappedData = firstApiResponse.data.map((device) => {
        // Find matching school/branch device in the second API response
        let schoolName = '';
        let branchName = '';
        let foundDevice = null;

        // Loop through each school and its branches in the second API response
        secondApiResponse.data.data.forEach(school => {
          school.branches.forEach(branch => {
            // Search for the device by deviceId
            const matchingDevice = branch.devices.find(d => d.deviceId === device.id.toString());
            if (matchingDevice) {
              schoolName = school.schoolName;
              branchName = branch.branchName;
              foundDevice = matchingDevice;
            }
          });
        });

        // Return the combined data, including schoolName and branchName
        return {
          ...device,
          isSelected: false,
          schoolName: schoolName || 'Unknown School',
          branchName: branchName || 'Unknown Branch',
          deviceName: foundDevice ? foundDevice.deviceName : device.name
        };
      });

      // Set the state with the combined data
      // setFilteredRows(wrappedData);
      setFilteredRows(
        wrappedData.map((row) => ({ ...row, isSelected: false }))
      );
      setOriginalRows(wrappedData.map((row) => ({ ...row, isSelected: false })));
      setTotalResponses(wrappedData.length);
    } else {
      console.error('Expected an array from the first API, but got:', firstApiResponse.data);
      alert('Unexpected data format received from the first API.');
    }
  } catch (error) {
    console.error('Fetch data error:', error);
    alert('An error occurred while fetching data.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData(filterText); // Apply the filter when the text changes
  }, [filterText, startDate, endDate]); 

 

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  
 


const handleChangeRowsPerPage = (event) => {
  const newRowsPerPage = parseInt(event.target.value, 10);
  setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage); // Set to all rows if -1
  setPage(0); // Reset to the first page
};

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

  // useEffect(() => {
  //   filterData(filterText);
  // }, [filterText]);
  // const filterData = (text) => {
  //   // Apply text-based filtering
  //   if (text === "") {
  //     // If no text is provided, reset to original rows
  //     setFilteredRows(originalRows.map(row => ({ ...row, isSelected: false })));
  //   } else {
  //     // Filter based on text
  //     const filteredData = originalRows
  //       .filter((row) =>
  //         Object.values(row).some(
  //           (val) =>
  //             typeof val === "string" &&
  //             val.toLowerCase().includes(text.toLowerCase())
  //         )
  //       )
  //       .map((row) => ({ ...row, isSelected: false }));
  
  //     setFilteredRows(filteredData);
  //   }
  // };
  const filterData = (text) => {
    let dataToFilter = originalRows;
  
    // Apply date filter
    if (startDate && endDate) {
      dataToFilter = dataToFilter.filter((row) => {
        const rowDate = new Date(row.dateOfBirth); // Adjust based on your date field
        return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
      });
    }
  
    // Apply text filter
    if (text === "") {
      setFilteredRows(dataToFilter); // Reset to full filtered data
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
      
      setFilteredRows(filteredData); // Update filtered rows
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
        return row.id; // Use 'id' if '_id' is not defined; ensure id exists and is not undefined
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
      // Define the API endpoint and credentials
      const apiUrl = "https://rocketsalestracker.com/api/devices"; // Replace with actual API endpoint
      const username = "schoolmaster"; // Replace with your actual username
      const password = "123456"; // Replace with your actual password
      const token = btoa(`${username}:${password}`); // Encode credentials in Base64
  
      // Send delete requests for each selected ID
      const deleteRequests = selectedIds.map((id) =>
        fetch(`${apiUrl}/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Basic ${token}`, // Add Basic Auth header
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error deleting record with ID ${id}: ${response.statusText}`
            );
          }
          return response; // No need to parse JSON for a 204 response
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
  
    // Refresh data
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
  
  // const sortedData = [...filteredRows];
  // if (sortConfig.key !== null) {
  //   sortedData.sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key]) {
  //       return sortConfig.direction === "ascending" ? -1 : 1;
  //     }
  //     if (a[sortConfig.key] > b[sortConfig.key]) {
  //       return sortConfig.direction === "ascending" ? 1 : -1;
  //     }
  //     return 0;
  //   });
  // }

  const handleAddButtonClick = () => {
    setFormData({});
    setAddModalOpen(true);

  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);

    setFormData({});
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  

const handleEditSubmit = async () => {
  try {
    const apiUrl1 = `https://rocketsalestracker.com/api/devices/${selectedRow.id}`;
    const apiUrl2 = `http://63.142.251.13:4000/superadmin/add-device`;

    const username = "schoolmaster";
    const password = "123456";
    const token1 = btoa(`${username}:${password}`);
    const token2 =  localStorage.getItem("token");

    const { isSelected, ...updatedData } = formData;

    const updatedRow = {
      name: updatedData.name,
      uniqueId: updatedData.uniqueId,
      groupId: updatedData.groupId,
      attributes: updatedData.attributes || {},
      calendarId: updatedData.calendarId,
      status: updatedData.status,
      phone: updatedData.phone,
      model: updatedData.model,
      expirationTime: updatedData.expirationTime,
      contact: updatedData.contact,
      category: updatedData.category,
    };

    // Send PUT request to the first API
    const response1 = await fetch(apiUrl1, {
      method: "PUT",
      headers: {
        "Authorization": `Basic ${token1}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRow),
    });

    const result1 = await response1.json();
    console.log("First API Response (result1):", result1);

    if (response1.ok) {
      console.log("Record updated successfully in the first API:", result1);

      // Prepare data for the second API (POST)
      const schoolData = {
        deviceId: selectedRow.id,    // Ensure the correct deviceId
        deviceName: result1.name,
        schoolName: updatedData.schoolName,
        branchName: updatedData.branchName,
      };

      // Log the data to be sent to the second API
      console.log("Data being sent to the second API (POST):", schoolData);

      // Send POST request to the second API
      const response2 = await fetch(apiUrl2, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token2}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schoolData),
      });

      // Try to parse the response as JSON only if the content type is JSON
      const contentType = response2.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result2 = await response2.json();
        console.log("Second API Response (result2):", result2);

        if (response2.ok) {
          console.log("Record updated successfully in the second API (POST):", result2);
          alert("Record updated successfully");
        } else {
          console.error("Server responded with an error for the second API:", result2);
          alert(`Unable to update record in the second API (POST): ${result2.message || response2.statusText}`);
        }
      } else {
        // Handle cases where the response is not JSON
        const textResponse = await response2.text();
        console.error("Second API Response (non-JSON):", textResponse);
        alert(`Error: ${textResponse}`);
      }
    } else {
      console.error("Server responded with an error for the first API:", result1);
      alert(`Unable to update record in the first API: ${result1.message || response1.statusText}`);
    }
       // Close the modal
       handleModalClose();

       // Fetch the latest data
       fetchData();
  } catch (error) {
    console.error("Error during requests:", error);
    alert("Unable to update record");
  }
};





 


const [groups, setGroups] = useState([]);
// const [error, setError] = useState(null);
const [error, setError] = useState(null);
useEffect(() => {
  const fetchGroups = async () => {
    try {
      const response = await fetch('https://rocketsalestracker.com/api/groups', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('schoolmaster:123456') // Replace with actual credentials
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setGroups(data); // Assuming the API returns { groups: [...] }
    } catch (error) {
      setError(error.message);
    }
  };

  fetchGroups();
}, []);





const [calendars, setCalendars] = useState([]); // State to store calendar data
const [calendarError, setCalendarError] = useState(null); // State to store error

useEffect(() => {
  const fetchCalendars = async () => {
    try {
      const response = await fetch('https://rocketsalestracker.com/api/calendars', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('schoolmaster:123456') // Replace with actual credentials
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCalendars(data); // Assuming the API returns { calendars: [...] }
    } catch (error) {
      setCalendarError(error.message);
    }
  };

  fetchCalendars();
}, []);

const [schools, setSchools] = useState([]); // State for schools
const [branches, setBranches] = useState([]); // State for branches
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
  if (name === "schoolName") {
    const selectedSchoolData = schools.find(
      (school) => school.schoolName === value
    );

    console.log(selectedSchoolData);
    if (selectedSchoolData) {
      // Combine branchName and branches
      const allBranches = [];
      if (selectedSchoolData.branchName) {
        allBranches.push({
          branchName: selectedSchoolData.branchName,
          branchId: selectedSchoolData._id,
        });
      }

      if (
        selectedSchoolData.branches &&
        selectedSchoolData.branches.length > 0
      ) {
        selectedSchoolData.branches.forEach((branch) => {
          allBranches.push({
            branchName: branch.branchName,
            branchId: branch._id,
          });
        });
      }

      setBranches(allBranches);
    }
  }
};
 useEffect(() => {
        // Trigger the "onChange" behavior programmatically if a school is pre-selected
        if (formData.schoolName) {
          const event = {
            target: {
              name: "schoolName",
              value: formData.schoolName,
            },
          };
          handleInputChange(event); // Call the handleInputChange with the pre-selected school
        }
      }, [formData.schoolName, schools]);
        useEffect(() => {
          if (formData.branchName) {
            const event = {
              target: {
                name: "branchName",
                value: formData.branchName,
              },
            };
            handleInputChange(event); // Trigger fetching buses when branchName changes
          }
        }, [formData.branchName]);
        useEffect(() => {
          console.log("Selected School:", formData.schoolName);
          console.log("Available Branches:", branches);
          console.log("Selected Branch:", formData.branchName);
        }, [formData.schoolName, branches, formData.branchName]);
useEffect(() => {
  const fetchSchool = async (startDate = "", endDate = "") => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_SUPER_ADMIN_API}/getschools`,
        {
          headers: {
            Authorization:`Bearer ${token}`,
          },
        }
      );

      console.log("fetch data", response.data); // Log the entire response data

      if (Array.isArray(response.data.schools)) {
        const allData = response.data.schools;
        setSchools(allData);

        // console.log(school);

        console.log(allData);
      } else {
        console.error(
          "Expected an array but got:",
          response.data.supervisors
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

 

  fetchSchool();
}, [addModalOpen]);



const handleAddSubmit = async () => {
  try {
    // Define the API endpoints and credentials
    const apiUrl1 = "https://rocketsalestracker.com/api/devices"; // First API endpoint
    const apiUrl2 = "http://63.142.251.13:4000/superadmin/add-device"; // Second API endpoint
    const username = "schoolmaster"; // Replace with your actual username
    const password = "123456"; // Replace with your actual password
    const token1 = btoa(`${username}:${password}`); // Encode credentials in Base64 for first URL
    const token2 = localStorage.getItem("token");

    // Prepare the data for the first API
    const newRow = {
      name: formData.name,
      uniqueId: formData.uniqueId,
      groupId: formData.groupId,
      attributes: formData.attributes || {},
      calendarId: formData.calendarId,
      status: formData.status,
      phone: formData.phone,
      model: formData.model,
      expirationTime: formData.expirationTime,
      contact: formData.contact,
      category: formData.category,
    };

    // Post data to the first URL
    const response1 = await fetch(apiUrl1, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${token1}`, // Add Basic Auth header for the first URL
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRow),
    });

    const result1 = await response1.json();

    if (response1.ok) {
      console.log("Record created successfully in the first API:", result1);

      // Prepare the data for the second API using the response from the first API
      const schoolData = {
        deviceId: result1.id, // Use the ID returned by the first API
        deviceName: result1.name, // Use the name returned by the first API
        schoolName: formData.schoolName, // From form data
        branchName: formData.branchName, // From form data
      };

      // Post data to the second URL
      const response2 = await fetch(apiUrl2, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token2}`, // Add Bearer Auth header for the second URL
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schoolData),
      });

      const result2 = await response2.json();

      if (response2.ok) {
        // Update the state and close the modal if both requests succeed
        setFilteredRows([...filteredRows, result1]);
        handleModalClose();
        fetchData();
        console.log("Record created successfully in the second API:", result2);
        alert("Record created successfully");
      } else {
        console.error("Server responded with an error for the second API:", result2);
        alert(`Unable to create record in the second API: ${result2.message || response2.statusText}`);
      }
    } else {
      console.error("Server responded with an error for the first API:", result1);
      alert(`Unable to create record in the first API: ${result1.message || response1.statusText}`);
    }
  } catch (error) {
    console.error("Error during POST requests:", error);
    alert("Unable to create record");
  }
};
const [searchTerm, setSearchTerm] = useState('');

// Filter the data based on the search term
const filteredData = sortedData.filter(row =>
  COLUMNS().some(column => {
    const value = column.accessor.split('.').reduce((acc, part) => acc && acc[part], row);
    return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
  })
);

const handleFilterChange = (event) => {
  const text = event.target.value;
  setFilterText(text);
};
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
      Add Devices      </h1>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
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
              gap: "10px",
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
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddButtonClick}
            sx={{ marginRight: "10px" }}
            startIcon={<AddCircleIcon />}
          >
            Add
          </Button>
          <Button
            variant="contained"
            onClick={() => setImportModalOpen(true)}
            sx={{ backgroundColor: "rgb(255, 165, 0)", marginRight: "10px" }}
            startIcon={<CloudUploadIcon />}
          >
            Import
          </Button>
          <Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"ADD DEVICE LIST"} pdfFilename={"AddDevice.pdf"} excelFilename={"AddDevice.xlsx"}/>

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
          maxHeight: 453,
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
                  colSpan={COLUMNS().filter((col) => columnVisibility[col.accessor]).length}
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    fontSize: '16px',
                    color: '#757575',
                  }}
                >
                  <h4>No Data Available</h4>
                </TableCell>
              </TableRow>
            ) : (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={() => handleRowSelect(page * rowsPerPage + index)}
                    selected={row.isSelected}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                      borderBottom: "none",
                    }}
                  >
                    <TableCell padding="checkbox" style={{ borderRight: "1px solid #e0e0e0" }}>
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
                        const value = column.accessor.split('.').reduce((acc, part) => acc && acc[part], row);

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
                              fontSize: "smaller",
                            }}
                          >
                            {column.Cell ? column.Cell({ value }) : value}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
            {/* <TablePagination
             All={sortedData.length}
              rowsPerPageOptions={[10, 25, 100,1000,3000]}
              component="div"
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
         
{/* <TablePagination
  rowsPerPageOptions={[{ label: "All", value: -1 }, 10, 25, 100, 1000]}
  component="div"
  count={sortedData.length}
  rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage} // Display "All" if all rows are selected
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/> */}
<TablePagination
  rowsPerPageOptions={[{ label: "All", value: -1 }, 10, 25, 100, 1000]}
  component="div"
  count={sortedData.length}
  rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage} // Display "All" if all rows are selected
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>

            {/* //</></div> */}
          </>
        )}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={style}>
            <h2>Column Visibility</h2>
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
       {/* Edit model dropdown */}
        <Modal open={editModalOpen} onClose={handleModalClose}>
  <Box sx={style}>
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
    {COLUMNS().map((col) => (
        col.accessor === 'groupId' && col.Header === 'Group ID' ? (
          <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
            <InputLabel id="group-select-label">Group ID</InputLabel>
            <Select
              labelId="group-select-label"
              label="Group ID"
              name={col.accessor}
              value={formData[col.accessor] || ''}
              onChange={handleInputChange}
              startAdornment={
                <InputAdornment position="start">
                 {col.icon} {/* Add SchoolIcon as the adornment */}
                </InputAdornment>
              }
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : col.accessor === 'category' && col.Header === 'Category' ? (
          <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              label="Category"
              name={col.accessor}
              value={formData[col.accessor] || ''}
              onChange={handleInputChange}
              startAdornment={
                <InputAdornment position="start">
                 {col.icon} {/* Add SchoolIcon as the adornment */}
                </InputAdornment>
              }
            >
              <MenuItem value={"Default"}>Default</MenuItem>
              <MenuItem value={"Animal"}>Animal</MenuItem>
              <MenuItem value={"Bicycle"}>Bicycle</MenuItem>
              <MenuItem value={"Boat"}>Boat</MenuItem>
              <MenuItem value={"Bus"}>Bus</MenuItem>
              <MenuItem value={"Car"}>Car</MenuItem>
              <MenuItem value={"Camper"}>Camper</MenuItem>
              <MenuItem value={"Crane"}>Crane</MenuItem>
              <MenuItem value={"Helicopter"}>Helicopter</MenuItem>
              <MenuItem value={"Motorcycle"}>Motorcycle</MenuItem>
              <MenuItem value={"Offroad"}>Offroad</MenuItem>
              <MenuItem value={"Person"}>Person</MenuItem>
              <MenuItem value={"Pickup"}>Pickup</MenuItem>
              <MenuItem value={"Plane"}>Plane</MenuItem>
              <MenuItem value={"Ship"}>Ship</MenuItem>
              <MenuItem value={"Tractor"}>Tractor</MenuItem>
              <MenuItem value={"Train"}>Train</MenuItem>
              <MenuItem value={"Tram"}>Tram</MenuItem>
              <MenuItem value={"Trolleybus"}>Trolleybus</MenuItem>
              <MenuItem value={"Truck"}>Truck</MenuItem>
              <MenuItem value={"Van"}>Van</MenuItem>
              <MenuItem value={"Scooter"}>Scooter</MenuItem>
            </Select>
          </FormControl>
        ) : col.accessor === 'calendarId' && col.Header === 'Calendar ID' ? (
          <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
            <InputLabel id="calendar-select-label">Calendar ID</InputLabel>
            <Select
              labelId="calendar-select-label"
              label="Calendar ID"
              name={col.accessor}
              value={formData[col.accessor] || ''}
              onChange={handleInputChange}
              startAdornment={
                <InputAdornment position="start">
                 {col.icon} {/* Add SchoolIcon as the adornment */}
                </InputAdornment>
              }
            >
              {calendars.map((calendar) => (
                <MenuItem key={calendar.id} value={calendar.id}>
                  {calendar.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            key={col.accessor}
            label={col.Header}
            variant="outlined"
            name={col.accessor}
            value={formData[col.accessor] || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: "10px" }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {col.icon} {/* Render the icon dynamically */}
                </InputAdornment>
              ),
            }}
          />
        )
      ))}
        {/* School Name dropdown */}
    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <InputLabel>School Name</InputLabel>
      <Select
        value={formData['schoolName'] || ''}
        onChange={handleInputChange}
        name="schoolName"
        label="School Name"
        startAdornment={
          <InputAdornment position="start">
          <SchoolIcon/> {/* Add SchoolIcon as the adornment */}
          </InputAdornment>
        }
      >
        {schools.map((option) => (
          <MenuItem key={option._id} value={option.schoolName}>
            {option.schoolName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Branch Name dropdown */}
    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <InputLabel>Branch Name</InputLabel>
      <Select
        value={formData['branchName'] || ''}
        onChange={handleInputChange}
        name="branchName"
        label="Branch Name"
        startAdornment={
          <InputAdornment position="start">
          <AccountTreeIcon/> {/* Add SchoolIcon as the adornment */}
          </InputAdornment>
        }
      >
        {branches?.map((option) => (
          <MenuItem key={option.branchId} value={option.branchName}>
            {option.branchName}
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <h2 style={{ flexGrow: 1 }}>Add Row</h2>
      <IconButton onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </Box>

    {COLUMNS().map((col) =>
      col.accessor === 'groupId' && col.Header === 'Group ID' ? (
        <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
          <InputLabel id="group-select-label">Group ID</InputLabel>
          <Select
            labelId="group-select-label"
            label="Group ID"
            name={col.accessor}
            value={formData[col.accessor] || ''}
            onChange={handleInputChange}
            startAdornment={
              <InputAdornment position="start">
                {col.icon} {/* Add SchoolIcon as the adornment */}
              </InputAdornment>
            }
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : col.accessor === 'category' && col.Header === 'Category' ? (
        <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            label="Category"
            name={col.accessor}
            value={formData[col.accessor] || ''}
            onChange={handleInputChange}
            startAdornment={
              <InputAdornment position="start">
                {col.icon} {/* Add SchoolIcon as the adornment */}
              </InputAdornment>
            }
          >
            <MenuItem value={"Default"}>Default</MenuItem>
            <MenuItem value={"Animal"}>Animal</MenuItem>
            <MenuItem value={"Bicycle"}>Bicycle</MenuItem>
            <MenuItem value={"Boat"}>Boat</MenuItem>
            <MenuItem value={"Bus"}>Bus</MenuItem>
            <MenuItem value={"Car"}>Car</MenuItem>
            <MenuItem value={"Camper"}>Camper</MenuItem>
            <MenuItem value={"Crane"}>Crane</MenuItem>
            <MenuItem value={"Helicopter"}>Helicopter</MenuItem>
            <MenuItem value={"Motorcycle"}>Motorcycle</MenuItem>
            <MenuItem value={"Offroad"}>Offroad</MenuItem>
            <MenuItem value={"Person"}>Person</MenuItem>
            <MenuItem value={"Pickup"}>Pickup</MenuItem>
            <MenuItem value={"Plane"}>Plane</MenuItem>
            <MenuItem value={"Ship"}>Ship</MenuItem>
            <MenuItem value={"Tractor"}>Tractor</MenuItem>
            <MenuItem value={"Train"}>Train</MenuItem>
            <MenuItem value={"Tram"}>Tram</MenuItem>
            <MenuItem value={"Trolleybus"}>Trolleybus</MenuItem>
            <MenuItem value={"Truck"}>Truck</MenuItem>
            <MenuItem value={"Van"}>Van</MenuItem>
            <MenuItem value={"Scooter"}>Scooter</MenuItem>
          </Select>
        </FormControl>
      ) : col.accessor === 'calendarId' && col.Header === 'Calendar ID' ? (
        <FormControl fullWidth sx={{ marginBottom: '10px' }} key={col.accessor}>
          <InputLabel id="calendar-select-label">Calendar ID</InputLabel>
          <Select
            labelId="calendar-select-label"
            label="Calendar ID"
            name={col.accessor}
            value={formData[col.accessor] || ''}
            onChange={handleInputChange}
            startAdornment={
              <InputAdornment position="start">
                {col.icon} {/* Add SchoolIcon as the adornment */}
              </InputAdornment>
            }
          >
            {calendars.map((calendar) => (
              <MenuItem key={calendar.id} value={calendar.id}>
                {calendar.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          key={col.accessor}
          label={col.Header}
          variant="outlined"
          name={col.accessor}
          value={formData[col.accessor] || ''}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {col.icon} {/* Render the icon dynamically */}
              </InputAdornment>
            ),
          }}
        />
      )
    )}

    {/* School Name dropdown */}
    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <InputLabel>School Name</InputLabel>
      <Select
        value={formData['schoolName'] || ''}
        onChange={handleInputChange}
        name="schoolName"
        label="School Name"
        startAdornment={
          <InputAdornment position="start">
           <SchoolIcon/> {/* Add SchoolIcon as the adornment */}
          </InputAdornment>
        }
      >
        {schools.map((option) => (
          <MenuItem key={option._id} value={option.schoolName}>
            {option.schoolName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Branch Name dropdown */}
    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <InputLabel>Branch Name</InputLabel>
      <Select
        value={formData['branchName'] || ''}
        onChange={handleInputChange}
        name="branchName"
        label="Branch Name"
        startAdornment={
          <InputAdornment position="start">
           <AccountTreeIcon/> {/* Add SchoolIcon as the adornment */}
          </InputAdornment>
        }
      >
        {branches?.map((option) => (
          <MenuItem key={option.branchId} value={option.branchName}>
            {option.branchName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Submit button */}
    <Button variant="contained" color="primary" onClick={handleAddSubmit}>
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
