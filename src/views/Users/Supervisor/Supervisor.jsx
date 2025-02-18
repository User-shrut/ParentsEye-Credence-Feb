// import React, { useState, useEffect,useContext } from 'react';
// import axios from 'axios';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import TextField from '@mui/material/TextField';
// import SearchIcon from '@mui/icons-material/Search';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import Button from '@mui/material/Button';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Switch from '@mui/material/Switch';
// import { COLUMNS } from './columns';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import ImportExportIcon from '@mui/icons-material/ImportExport';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import * as XLSX from 'xlsx';
// import Alert from '@mui/material/Alert';
// import Snackbar from '@mui/material/Snackbar';
// import { TotalResponsesContext } from '../../../../TotalResponsesContext';
// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '80%',
//   height: '80%',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   overflowY: 'auto', // Enable vertical scrolling
//   display: 'flex',
//   flexDirection: 'column',
//   padding:'1rem',
// };

// export const Supervisor = () => {
//   const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [filterText, setFilterText] = useState('');
//   const [filteredRows, setFilteredRows] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [columnVisibility, setColumnVisibility] = useState(Object.fromEntries(COLUMNS().map(col => [col.accessor, true])));
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectAll, setSelectAll] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importData, setImportData] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [formData, setFormData] = useState({});
//   //const[totalresponse,setTotalResponses]=useState(0);
//   const fetchData = async () => {
//     try {
//       const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0';
//       const response = await axios.get(
//         "https://schoolmanagement-4-pzsf.onrender.com/school/read/allsupervisors",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('fetch data', response.data); // Log the entire response data

//       if (Array.isArray(response.data.supervisors)) {
//         setFilteredRows(response.data.supervisors.map(row => ({ ...row, isSelected: false })));
//         setTotalResponses(response.data.supervisors.length);
//       } else {
//         console.error('Expected an array but got:', response.data.supervisors);
//       }
//     } catch (error) {
//       console.log('error:', error);
//     }
//     console.log('get data');
//   };

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
//     const filteredData = filteredRows.filter((row) =>
//       Object.values(row).some(val => typeof val === 'string' && val.toLowerCase().includes(text.toLowerCase()))
//     ).map(row => ({ ...row, isSelected: false }));
//     setFilteredRows(filteredData);
//   };

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleColumnVisibilityChange = (accessor) => {
//     setColumnVisibility(prevState => ({
//       ...prevState,
//       [accessor]: !prevState[accessor]
//     }));
//   };

//   const handleRowSelect = (index) => {
//     const newFilteredRows = [...filteredRows];
//     newFilteredRows[index].isSelected = !newFilteredRows[index].isSelected;
//     setFilteredRows(newFilteredRows);
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     const newFilteredRows = filteredRows.map(row => ({ ...row, isSelected: newSelectAll }));
//     setFilteredRows(newFilteredRows);
//     setSelectAll(newSelectAll);
//   };

//   const handleEditButtonClick = () => {
//     const selected = filteredRows.find(row => row.isSelected);
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
//       .filter(row => row.isSelected)
//       .map(row => {
//         // Log each row to check its structure
//         console.log("Processing row:", row);
//         return row._id; // Ensure id exists and is not undefined
//       });

//     console.log("Selected IDs:", selectedIds);

//     if (selectedIds.length === 0) {
//       alert("No rows selected for deletion.");
//       return;
//     }

//     try {
//       // Define the API endpoint and token
//       const apiUrl = 'https://schoolmanagement-4-pzsf.onrender.com/school/delete/supervisor';
//       const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0'; // Replace with actual token

//       // Send delete requests for each selected ID
//       const deleteRequests = selectedIds.map(id =>
//         fetch(`${apiUrl}/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }).then(response => {
//           if (!response.ok) {
//             throw new Error(`Error deleting record with ID ${id}: ${response.statusText}`);
//           }
//           return response.json();
//         })
//       );

//       // Wait for all delete requests to complete
//       await Promise.all(deleteRequests);

//       // Filter out deleted rows
//       const newFilteredRows = filteredRows.filter(row => !row.isSelected);

//       // Update state
//       setFilteredRows(newFilteredRows);
//       setSelectAll(false);

//       alert('Selected records deleted successfully.');
//     } catch (error) {
//       console.error('Error during deletion:', error);
//       alert('Failed to delete selected records.');
//     }
//     fetchData();
//   };

//   const handleExport = () => {
//     const dataToExport = filteredRows.map(row => {
//       const { isSelected, ...rowData } = row;
//       return rowData;
//     });
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "Supervisor.xlsx");
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
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
//         return sortConfig.direction === 'ascending' ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === 'ascending' ? 1 : -1;
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
//       [name]: value
//     });
//   };

//   // const handleEditSubmit = () => {
//   //   const updatedRows = filteredRows.map(row =>
//   //     row.id === selectedRow.id ? { ...row, ...formData, isSelected: false } : row
//   //   );
//   //   setFilteredRows(updatedRows);
//   //   handleModalClose();
//   // };

//   const handleEditSubmit = async () => {
//     // Define the API URL and authentication token
//     const apiUrl = `https://schoolmanagement-4-pzsf.onrender.com/school/update/supervisor/${selectedRow._id}`; // Replace with your actual API URL
//     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0'; // Replace with your actual authentication token

//     // Prepare the updated data
//     const updatedData = {
//       ...formData,
//       isSelected: false
//     };

//     try {
//       // Perform the PUT request
//       const response = await fetch(apiUrl, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(updatedData)
//       });

//       // Check if the response is okay (status code 200-299)
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Optionally: Process the response data if needed
//       const result = await response.json();
//       console.log('Update successful:', result);

//       // Update local state after successful API call
//       const updatedRows = filteredRows.map(row =>
//         row.id === selectedRow.id ? { ...row, ...formData, isSelected: false } : row
//       );
//       setFilteredRows(updatedRows);

//       // Close the modal
//       handleModalClose();

//     } catch (error) {
//       console.error('Error updating row:', error);
//       // Optionally: Handle the error (e.g., show a notification or message to the user)
//     }
//     fetchData();
//   };

//   // const handleAddSubmit = () => {
//   //   const newRow = { ...formData, id: filteredRows.length + 1, isSelected: false };
//   //   setFilteredRows([...filteredRows, newRow]);
//   //   handleModalClose();
//   // };

//   const handleAddSubmit = async () => {
//     try {
//       const newRow = { ...formData, id: filteredRows.length + 1, isSelected: false };

//       // POST request to the server
//       const response = await fetch('https://schoolmanagement-4-pzsf.onrender.com/parent/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newRow),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       // Assuming the server returns the created object
//       const result = await response.json();

//       // Update the state with the new row
//       setFilteredRows([...filteredRows, result]);

//       // Close the modal
//       handleModalClose();
//       console.log('error occured in post method')
//     } catch (error) {
//       console.error('Error during POST request:', error);
//       // Handle the error appropriately (e.g., show a notification to the user)
//     }
//   };

//   return (
//     <>
//       <h1 style={{ textAlign: 'center',marginTop:'113px' }}>Supervisor Detail List </h1>
//       <div>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//           <TextField
//             label="Search"
//             variant="outlined"
//             value={filterText}
//             onChange={handleFilterChange}
//             sx={{ marginRight: '10px', width: '300px' }}
//             InputProps={{
//               startAdornment: (
//                 <SearchIcon style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '5px' }} />
//               ),
//             }}
//           />
//           <Button
//             onClick={() => setModalOpen(true)}
//             sx={{
//               backgroundColor: 'rgb(85, 85, 85)',
//               color: 'white',
//               fontWeight: 'bold',
//               marginRight: '10px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '10px'
//             }}
//           >
//             <ImportExportIcon />
//             Column Visibility
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleDeleteSelected}
//             sx={{ marginRight: '10px' }}
//             startIcon={<DeleteIcon />}
//           >
//             Delete
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleEditButtonClick}
//             sx={{ marginRight: '10px' }}
//             startIcon={<EditIcon />}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleAddButtonClick}
//             sx={{ marginRight: '10px' }}
//             startIcon={<AddCircleIcon />}
//           >
//             Add
//           </Button>
//           <Button
//             variant="contained"
//             onClick={() => setImportModalOpen(true)}
//             sx={{ backgroundColor: 'rgb(255, 165, 0)', marginRight: '10px' }}
//             startIcon={<CloudUploadIcon />}
//           >
//             Import
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleExport}
//           >
//             Export
//           </Button>
//         </div>
//         <TableContainer component={Paper} sx={{ maxHeight: 440 }}>

//           <Table stickyHeader aria-label="sticky table" style={{border:'1px solid black',borderBottom:'',borderRadius:'10px'}}>
//   <TableHead >
//     {/* <TableRow style={{borderBottom:'1px solid black'}} > */}
//     <TableRow >
//       {/* <TableCell padding="checkbox" style={{ borderRight: '1px solid #e0e0e0',borderBottom:'1px solid black', }}> */}
//       <TableCell padding="checkbox" >
//         <Switch
//           checked={selectAll}
//           onChange={handleSelectAll}
//           color="primary"
//         />
//       </TableCell>
//       {COLUMNS().filter(col => columnVisibility[col.accessor]).map((column) => (
//         <TableCell
//           key={column.accessor}
//           align={column.align}
//           // style={{ minWidth: column.minWidth, cursor: 'pointer', borderRight: '1px solid #e0e0e0',
//           //   borderBottom:'1px solid black',padding:'12px',textAlign:'center'}}
//           style={{ minWidth: column.minWidth, cursor: 'pointer',
//            padding:'12px',textAlign:'center',borderRight:'1px solid grey'}}

//           onClick={() => requestSort(column.accessor)}
//         >
//           {column.Header}
//           {sortConfig.key === column.accessor ? (
//             sortConfig.direction === 'ascending' ? (
//               <ArrowUpwardIcon fontSize="small" />
//             ) : (
//               <ArrowDownwardIcon fontSize="small" />
//             )
//           ) : null}
//         </TableCell>
//       ))}
//     </TableRow>
//   </TableHead>
//   <TableBody>
//     {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//       <TableRow
//         hover
//         role="checkbox"
//         tabIndex={-1}
//         key={row.id}
//         onClick={() => handleRowSelect(page * rowsPerPage + index)}
//         selected={row.isSelected}
//       >
//         {/* <TableCell padding="checkbox" style={{ borderRight: '1px solid #e0e0e0' }}> */}
//         <TableCell padding="checkbox" >
//           <Switch
//             checked={row.isSelected}
//             color="primary"
//           />
//         </TableCell>
//         {COLUMNS().filter(col => columnVisibility[col.accessor]).map((column) => {
//           const value = row[column.accessor];
//           return (
//             <TableCell key={column.accessor} align={column.align} style={{ borderRight:'1px solid grey'}}>

//               {column.format && typeof value === 'number' ? column.format(value) : value}
//             </TableCell>
//           );
//         })}
//       </TableRow>
//     ))}
//   </TableBody>
// </Table>

//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 100]}
//           component="div"
//           count={sortedData.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </div>
//       <Modal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//       >
//         <Box sx={style}>
//           <h2>Column Visibility</h2>
//           {COLUMNS().map((col) => (
//             <div key={col.accessor}>
//               <Switch
//                 checked={columnVisibility[col.accessor]}
//                 onChange={() => handleColumnVisibilityChange(col.accessor)}
//                 color="primary"
//               />
//               {col.Header}
//             </div>
//           ))}
//         </Box>
//       </Modal>
//       <Modal
//         open={editModalOpen}
//         onClose={handleModalClose}
//       >
//         <Box sx={style}>
//           <h2>Edit Row</h2>
//           {COLUMNS().map((col) => (
//             <TextField
//               key={col.accessor}
//               label={col.Header}
//               variant="outlined"
//               name={col.accessor}
//               value={formData[col.accessor] || ''}
//               onChange={handleInputChange}
//               sx={{ marginBottom: '10px' }}
//               fullWidth
//             />
//           ))}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleEditSubmit}
//           >
//             Submit
//           </Button>
//         </Box>
//       </Modal>
//       <Modal
//         open={addModalOpen}
//         onClose={handleModalClose}
//       >
//         <Box sx={style}>
//           <h2>Add Row</h2>
//           {COLUMNS().map((col) => (
//             <TextField
//               key={col.accessor}
//               label={col.Header}
//               variant="outlined"
//               name={col.accessor}
//               value={formData[col.accessor] || ''}
//               onChange={handleInputChange}
//               sx={{ marginBottom: '10px' }}
//               fullWidth
//             />
//           ))}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleAddSubmit}
//           >
//             Submit
//           </Button>
//         </Box>
//       </Modal>
//       <Modal
//         open={importModalOpen}
//         onClose={() => setImportModalOpen(false)}
//       >
//         <Box sx={style}>
//           <h2>Import Data</h2>
//           <input type="file" onChange={handleFileUpload} />
//           {importData.length > 0 && (
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => setFilteredRows([...filteredRows, ...importData.map(row => ({ ...row, isSelected: false }))])}
//               sx={{ marginTop: '10px' }}
//             >
//               Import
//             </Button>
//           )}
//         </Box>
//       </Modal>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert onClose={handleSnackbarClose} severity="warning">
//           Please select a row to edit!
//         </Alert>
//       </Snackbar>
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
import { Autocomplete } from "@mui/material";
import Export from "./ExportSupervisor";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import InputAdornment from "@mui/material/InputAdornment"; // Add this import
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CakeIcon from '@mui/icons-material/Cake';
import Face6Icon from '@mui/icons-material/Face6';  // Import Face6Icon
import PinIcon from '@mui/icons-material/Pin';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import SchoolIcon from '@mui/icons-material/School';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import AbcIcon from '@mui/icons-material/Abc';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MailIcon from '@mui/icons-material/Mail';
import PasswordIcon from '@mui/icons-material/Password';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import ClassIcon from '@mui/icons-material/Class';
import WcIcon from '@mui/icons-material/Wc';
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

export const Supervisor = () => {
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
  const role = localStorage.getItem("role");
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [buses, setBuses] = useState([]);
  const [targetSchool, setTargetSchool] = useState();

  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;

      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else if (role == 4) {
        response = await axios.get(
         `${process.env.REACT_APP_USERBRANCH}/readSuperviserBybranchgroupuser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data); // Log the entire response data

      if (response?.data) {
        const allData =
          role == 1
            ? response?.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.supervisors) &&
                  branch.supervisors.length > 0
                    ? branch.supervisors
                    : []
                )
              )
            : role == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.supervisors) &&
                branch.supervisors.length > 0
                  ? branch.supervisors
                  : []
              )
            : response.data.supervisors;

        console.log("supervisirs", allData);
        // Apply local date filtering if dates are provided
        const filteredData =
          startDate || endDate
            ? allData.filter((row) => {
                const registrationDate = parseDate(
                  row.formattedRegistrationDate
                );
                const start = parseDate(startDate);
                const end = parseDate(endDate);

                return (
                  (!startDate || registrationDate >= start) &&
                  (!endDate || registrationDate <= end)
                );
              })
            : allData; // If no date range, use all data
        const reversedData = filteredData.reverse();
        // Log the date range and filtered data
        console.log(`Data fetched between ${startDate} and ${endDate}:`);
        console.log(filteredData);
        setFilteredRows(
          reversedData.map((row) => ({ ...row, isSelected: false }))
        );
        setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
        setTotalResponses(reversedData.length);
      } else {
        console.error("Expected an array but got:", response.data.supervisors);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching completes
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
    let selectedIds;
    if (role == 1) {
      selectedIds = filteredRows
        .filter((row) => row.isSelected)
        .map((row) => {
          // Log each row to check its structure
          console.log("Processing row:", row);
          return row.supervisorId; // Ensure id exists and is not undefined
        });
    } else if (role == 2) {
      selectedIds = filteredRows
        .filter((row) => row.isSelected)
        .map((row) => {
          // Log each row to check its structure
          console.log("Processing row:", row);
          return row.id; // Ensure id exists and is not undefined
        });
    } else {
      selectedIds = filteredRows
        .filter((row) => row.isSelected)
        .map((row) => {
          // Log each row to check its structure
          console.log("Processing row:", row);
          return row.id; // Ensure id exists and is not undefined
        });
    }

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
          ? `${process.env.REACT_APP_SUPER_ADMIN_API}/delete-supervisor`
          : role == 2
          ? `${process.env.REACT_APP_SCHOOL_API}/delete-supervisor`
          :role==3
          ? `${process.env.REACT_APP_BRANCH_API}/delete-supervisor`
          :`http://63.142.251.13:4000/branchgroupuser/deleteSupervisorByBranchGroupUser`

      const token = localStorage.getItem("token");
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

        // Log the parsed data for verification
        console.log("Uploaded file data:", parsedData);

        // Now make the POST request with parsedData
        axios
          .post(
            "http://63.142.251.13:4000/supervisor/importsupervisor",
            parsedData
          )
          .then((response) => {
            console.log("Data successfully posted:", response.data);
            alert("File imported and data posted successfully!");
          })
          .catch((error) => {
            console.error("Error posting data:", error);
            alert(
              "Error posting data. Please fill data in valid form as shown in sample excel sheet."
            );
          });
      };
      reader.readAsArrayBuffer(file);
    }

    fetchData();
    setImportModalOpen(false);
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
    setImportModalOpen(false);
    setFormData({});
    setModalOpen(false);
    if(role!=1)fetchData();
    // if(role==1)setBranches();
    // setBuses();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const [allDevices, setAllDevices] = useState([]);
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  //   if (name == "schoolName") {
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "schoolName") {
      setFormData({
        ...formData,
        [name]: value,
        // branchName: "", // Reset branch when school changes
      });

      // Filter branches for the selected school
      const selectedSchool = schools.find(
        (school) => school.schoolName === value
      );
      if (selectedSchool) {
        const branches = selectedSchool.branches.map((branch) => ({
          branchName: branch.branchName,
          branchId: branch.branchId,
        }));
        setBranches(branches);

        // Filter devices for the selected school
        const filteredDevices = allDevices.filter(
          (device) => device.schoolName === value
        );
        setBuses(filteredDevices); // Update buses based on selected school
      }
    } else if (name === "branchName") {
      setFormData({
        ...formData,
        [name]: value,
      });

      const filteredDevices = allDevices.filter((device) =>
        role === 1
          ? device.schoolName === formData.schoolName && device.branchName === value
          : device.branchName === value
      ); 
      setBuses(filteredDevices);
     
    // } else if ( name === "branchId") {
    //   setFormData({
    //     ...formData,
    //     [name]: value,
    //     deviceId: "",
    //   });

    //   const filteredDevices = allDevices.filter(
    //     (device) =>
    //       device.schoolName === formData.schoolName &&
    //       device.branchId === value
    //   );
    //   setBuses(filteredDevices);
     
    }
    else if (name === "deviceId") {
      // setSelectedDeviceId(value); // Set the selected device ID
      setFormData({
        ...formData,
        [name]: value,
      });

    }else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
    useEffect(() => {
        // Trigger the "onChange" behavior programmatically if a school is pre-selected
        if (formData.schoolName && role ==1) {
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
        }, [formData.branchName, allDevices]);
        useEffect(() => {
          console.log("Selected School:", formData.schoolName);
          console.log("Available Branches:", branches);
          console.log("Selected Branch:", formData.branchName);
          console.log("Available Devices (Buses):", buses);
          console.log("Selected Device (Bus):", formData.deviceId);
        }, [formData.schoolName, branches, formData.branchName, buses, formData.deviceId]);
  const handleBusChange = (e) => {
    const { value } = e.target;

    if (!buses || !Array.isArray(buses)) {
      console.error("Buses data is not available or not an array");
      return;
    }

    // Find the selected bus by its deviceId
    const selectedBus = buses.find((bus) => bus.deviceId === value);

    if (!selectedBus) {
      console.error("Selected bus not found");
      return;
    }

    // Update the form data with the selected device details
    setFormData((prevData) => ({
      ...prevData,
      deviceId: selectedBus.deviceId,
      deviceName: selectedBus.deviceName,
      // pickupPoint: '', // Reset geofence selection
    }));

    let geofencesForSelectedDevice = [];

    // Update the filtered geofences state
  };
  const handleEditSubmit = async () => {
    // Define the API URL and authentication token

    const token = localStorage.getItem("token");
    // Prepare the updated data
    const updatedData = {
      ...formData,
      isSelected: false,
    };

    console.log(updatedData);

    try {
      // Perform the PUT request
      let response;
      if (role == 1) {
        response = await fetch(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/update-supervisor/${updatedData.supervisorId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );
      } else if (role == 2) {
        response = await fetch(
          `${process.env.REACT_APP_SCHOOL_API}/update-supervisor/${updatedData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );
      }else if (role == 4) {
        response = await fetch(
          `${process.env.REACT_APP_USERBRANCH}/updateSupervisorByBranchGroupUser/${updatedData.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );
      } else {
        response = await fetch(
          `${process.env.REACT_APP_BRANCH_API}/update-supervisor/${updatedData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );
      }

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
        row.supervisorId === selectedRow.supervisorId
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
      let newRow;
      let decoded = jwtDecode(localStorage.getItem("token"));
      if (role == 1) {
        newRow = {
          ...formData,
          // id: filteredRows.length + 1,
          // isSelected: false,
        };
      }else if(role==4){
        newRow={
          ...formData,
          schoolName:decoded.schoolName,
        }
      }
       else if (role == 2) {
        newRow = {
          ...formData,
          schoolName: decoded.schoolName,
        };
      } else {
        newRow = {
          ...formData,
          schoolName: decoded.schoolName,
          branchName: decoded.branchName,
        };
      }

      console.log(newRow);

      // POST request to the server
      const response = await fetch(
        `${process.env.REACT_APP_API}/supervisor/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRow),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Assuming the server returns the created object
      const result = await response.json();

      alert("record created successfully");
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

  useEffect(() => {
    const fetchSchool = async (startDate = "", endDate = "") => {
      setLoading(true);
      if (role == 1) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${process.env.REACT_APP_SUPER_ADMIN_API}/getschools`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("fetch data", response.data); // Log the entire response data

          if (Array.isArray(response.data.schools)) {
            const allData = response.data.schools;
            setSchools(allData);

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
      } else if (role == 2) {
        const apiUrl = `${process.env.REACT_APP_SCHOOL_API}/branches`;
        const token = localStorage.getItem("token");

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("fetch data branches :", response.data); // Log the entire response data

        if (response.data) {
          setBranches(response.data.school.branches);
        }
      }else if(role==4){
        try {
          const token=localStorage.getItem("token");
          const response=await axios.get(`${process.env.REACT_APP_USERBRANCH}/getdevicebranchgroupuser`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          })
         const branchname= response.data.data.flatMap((newdata)=>
          Array.isArray(newdata.branches)&&(newdata.branches.length)>0?
            newdata.branches.map((item)=>(
             {branchName:item.branchName,
              branchId:item.branchId

             }

            )
          ):[]

        )
        console.log("mybranch:",branchname)
        setBranches(branchname)
        } catch (error) {
          console.log("error while fetching branch:",error)
        }
      }
    };

    const fetchBuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl =
          role == 1
            ? `${process.env.REACT_APP_SUPER_ADMIN_API}/read-devices`
            : role == 2
            ? `${process.env.REACT_APP_SCHOOL_API}/read-devices`
            :role==3
            ? `${process.env.REACT_APP_BRANCH_API}/read-devices`
             :`${process.env.REACT_APP_USERBRANCH}/getdevicebranchgroupuser`

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let allData = [];
        if (role == 1) {
          allData = response?.data.data.flatMap((school) =>
            school.branches.flatMap((branch) =>
              Array.isArray(branch.devices) && branch.devices.length > 0
                ? branch.devices.map((device) => ({
                    ...device,
                    schoolName: school.schoolName,
                    branchName: branch.branchName,
                  }))
                : []
            )
          );
        } else if (role == 2) {
          allData = response?.data.branches.flatMap((branch) =>
            Array.isArray(branch.devices) && branch.devices.length > 0
              ? branch.devices.map((device) => ({
                  ...device,
                  branchName: branch.branchName,
                  schoolName: response.data.schoolName,
                }))
              : []
          );
        } else if (role == 3) {
          const branchName = response.data.branchName;
          const schoolName = response.data.schoolName;

          allData = Array.isArray(response.data.devices)
            ? response.data.devices.map((device) => ({
                ...device,
                branchName,
                schoolName,
              }))
            : [];
        } else if (role == 4) {
          allData = response.data.data.flatMap((school) =>
              Array.isArray(school.branches) && school.branches.length > 0
                  ? school.branches.flatMap((branch) =>
                        Array.isArray(branch.devices) && branch.devices.length > 0
                            ? branch.devices.map((device) => ({
                                  ...device,
                                  branchName: branch.branchName,
                                  schoolName: school.schoolName,
                                  branchId:branch.branchId,
                              }))
                            : []
                    )
                  : []
          );
      }

        setAllDevices(allData); // Store all devices
        setBuses(allData); // Set initial buses as well
        console.log("filter devices according to branch", allData);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchBuses();

    fetchSchool();
  }, [addModalOpen, editModalOpen]);

  const [rowStatuses, setRowStatuses] = useState({});

  const handleApprove = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      let response;

      if (role == 1) {
        response = await axios.post(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/registerStatus-supervisor/${_id}`,
          { action: "approve" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.post(
          `${process.env.REACT_APP_SCHOOL_API}/registerStatus-supervisor/${_id}`,
          { action: "approve" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.post(
          `${process.env.REACT_APP_BRANCH_API}/registerStatus-supervisor/${_id}`,
          { action: "approve" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else if (role == 4) {
        response = await axios.post(
          `http://63.142.251.13:4000/branchgroupuser/approvesupervisor/${_id}`,
          { action: "approve" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }


      if (response && response.status === 200) {
        setSnackbarOpen(true);
        fetchData(); // Refresh data

        // Update the status for this row
        setRowStatuses((prevStatuses) => ({
          ...prevStatuses,
          [_id]: "approved",
        }));

        alert("Your request is approved");
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      let response;

      if (role == 1) {
        response = await axios.post(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/registerStatus-supervisor/${_id}`,
          { action: "reject" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.post(
          `${process.env.REACT_APP_SCHOOL_API}/registerStatus-supervisor/${_id}`,
          { action: "reject" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.post(
          `${process.env.REACT_APP_BRANCH_API}/registerStatus-supervisor/${_id}`,
          { action: "reject" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else if (role == 4) {
        response = await axios.post(
          `http://63.142.251.13:4000/branchgroupuser/approvesupervisor/${_id}`,
          { action: "reject" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response && response.status === 200) {
        setSnackbarOpen(true);
        fetchData(); // Refresh data

        // Update the status for this row
        setRowStatuses((prevStatuses) => ({
          ...prevStatuses,
          [_id]: "rejected",
        }));

        alert("Request is rejected");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };
  const sampleData = [
    [
      "supervisorName",
      "address",
      "phone_no",
      "password",
      "email",
      "deviceName",
      "deviceId",
      "schoolName",
      "branchName",
    ],
    [
      "supervisor1",
      "new nandanwan 1111",
      "7878787878",
      "123456",
      "youemail",
      "MH565656",
      "8978",
      "school1",
      "branch1",
    ],
    [
      "supervisor2",
      "krida square 234533",
      "7878787878",
      "123456",
      "youremail2",
      "MH343434",
      "5656",
      "school2",
      "branch2",
    ],
  ];
  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "supervisorDetail.xlsx"; // Adjust the path here
    link.download = "supervisorDetail.xlsx"; // Specify the download filename
    link.click();
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
        Supervisor Detail List
      </h1>
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
    "&:hover": {
      fontWeight: "bolder", // Make text even bolder on hover
      backgroundColor: "rgb(85, 85, 85)", // Maintain background color on hover
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
          <Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"SUPERVISOR DETAIL LIST"} pdfFilename={"Supervisor.pdf"} excelFilename={"Supervisor.xlsx"}/>

        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <input
            type="date"
            id="startDate"
            placeholder="DD-MM-YYYY"
            style={{
              width: "140px",
              marginRight: "10px",
              padding: "2px",
              marginLeft: "3px",
              border: " 0.1px solid black",
              borderRadius: "3px",
            }}
          />
          <input
            type="date"
            id="endDate"
            placeholder="DD-MM-YYYY"
            style={{
              width: "140px",
              marginRight: "10px",
              padding: "2px",
              marginLeft: "3px",
              border: " 0.1px solid black",
              borderRadius: "3px",
            }}
          />
          <button
            onClick={handleApplyDateRange}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "5px",
              cursor: "pointer",
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
                maxHeight: 450,
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
                    <TableCell
                      style={{
                        cursor: "pointer",
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "2px solid black",
                        padding: "4px 4px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Actions
                    </TableCell>
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
                         
                          <TableCell
                            style={{
                              borderRight: "1px solid #e0e0e0",
                              paddingTop: "4px",
                              paddingBottom: "4px",
                              borderBottom: "none",
                              display: "flex",
                              textAlign: "center",
                              justifyContent: "space-around",
                              backgroundColor:
                                index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                              fontSize: "smaller",
                            }}
                          >
                            {row.statusOfRegister === "pending" ? (
                              <>
                                <Button
                                  onClick={() =>
                                    handleApprove(
                                      role == 1 ? row.supervisorId : row.id
                                    )
                                  }
                                  color="primary"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleReject(
                                      role == 1 ? row.supervisorId : row.id
                                    )
                                  }
                                  color="secondary"
                                >
                                  Reject
                                </Button>
                              </>
                            ) : row.statusOfRegister === "approved" ? (
                              <span style={{ color: "green" }}>Approved</span>
                            ) : row.statusOfRegister === "rejected" ? (
                              <span style={{ color: "red" }}>Rejected</span>
                            ) : null}
                          </TableCell>
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
          <Box sx={style}>
            {/* <h2>Edit Row</h2> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Edit Supervisor</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {COLUMNS()
              .slice(0, -5)
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {col.icon}  {/* Add Face6Icon in the input field */}
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            {role == 1 && (
             <>
              <FormControl
                variant="outlined"
                sx={{ marginBottom: "10px" }}
                fullWidth
              >
                <Autocomplete
                  id="searchable-school-select"
                  options={schools || []} // List of school objects
                  getOptionLabel={(option) => option.schoolName || ""} // Display school name
                  value={
                    schools.find(
                      (school) => school.schoolName === formData["schoolName"]
                    ) || null
                  } // Find the selected school
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: "schoolName",
                        value: newValue?.schoolName || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="School Name"
                      variant="outlined"
                      name="schoolName"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SchoolIcon />  {/* Add SchoolIcon in the input field */}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <Autocomplete
                id="searchable-branch-select"
                options={branches || []} // List of branch objects
                getOptionLabel={(option) => option.branchName || ""} // Display branch name
                value={
                  branches.find(
                    (branch) => branch.branchName === formData["branchName"]
                  ) || null
                } // Find the selected branch
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "branchName",
                      value: newValue?.branchName || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch Name"
                    variant="outlined"
                    name="branchName"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountTreeIcon />  {/* Add SchoolIcon in the input field */}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormControl></>
            )}{(role == 4) && (
                         
                          <FormControl
                            variant="outlined"
                            sx={{ marginBottom: "10px" }}
                            fullWidth
                          >
                            <Autocomplete
                              id="searchable-branch-select"
                              options={branches || []} // Ensure branches is an array
                              getOptionLabel={(option) => option.branchName || ""} // Display branch name
                              value={
                                Array.isArray(branches)
                                  ? branches.find(
                                      (branch) =>
                                        branch.branchName === formData["branchName"]
                                    ) || null
                                  : null
                              } // Safeguard find method
                              onChange={(event, newValue) => {
                                handleInputChange({
                                  target: {
                                    name: "branchName",
                                    value: newValue?.branchName || "",
                                  },
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Branch Name"
                                  variant="outlined"
                                  name="branchName"
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccountTreeIcon />  {/* Add SchoolIcon in the input field */}
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            />
                          </FormControl>
              )}
              {(role == 2) && (
              <FormControl
                variant="outlined"
                sx={{ marginBottom: "10px" }}
                fullWidth
              >
                <Autocomplete
                  key={`${formData.schoolName}-${formData.branchName}`} 
                  id="searchable-branch-select"
                  options={branches || []} // Ensure branches is at least an empty array
                  getOptionLabel={(option) => option.branchName || ""} // Display branch name
                  value={
                    (branches || []).find(
                      (branch) => branch.branchName === formData["branchName"]
                    ) || null
                  } // Ensure branches is an array
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: "branchName",
                        value: newValue?.branchName || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Branch Name"
                      variant="outlined"
                      name="branchName"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountTreeIcon />  {/* Add SchoolIcon in the input field */}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
            )}

           
            <FormControl 
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <Autocomplete
                id="searchable-bus-select"
                options={buses || []} // List of bus objects
                getOptionLabel={(option) => option.deviceName || ""} // Display bus name
                value={
                  buses.find((bus) => bus.deviceId === formData["deviceId"]) ||
                  null
                } // Find the selected bus by deviceId
                onChange={(event, newValue) => {
                  handleBusChange({
                    target: {
                      name: "deviceId",
                      value: newValue?.deviceId || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bus Name"
                    variant="outlined"
                    name="deviceId"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsBusIcon />  {/* Add SchoolIcon in the input field */}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
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
              <h2 style={{ flexGrow: 1 }}>Add Supervisor</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {COLUMNS()
              .slice(0, -5)
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {col.icon}  {/* Add Face6Icon in the input field */}
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            {role == 1 && (<>             
              <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <Autocomplete
                id="searchable-school-select"
                options={schools || []} // Ensure schools is an array
                getOptionLabel={(option) => option.schoolName || ""} // Display school name
                value={
                  schools.find(
                    (school) => school.schoolName === formData["schoolName"]
                  ) || null
                } // Find the selected school
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "schoolName",
                      value: newValue?.schoolName || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="School Name"
                    variant="outlined"
                    name="schoolName"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon/> {/* Add SchoolIcon in the input field */}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>         
            </> )}

            {(role == 1 || role == 2 || role==4) && (
             
             <FormControl
             variant="outlined"
             sx={{ marginBottom: "10px" }}
             fullWidth
           >
             <Autocomplete
               //  key={`${formData.schoolName}-${formData.branchName}`} 
               id="searchable-branch-select"
               options={branches || []} // Ensure branches is an array
               getOptionLabel={(option) => option.branchName || ""} // Display branch name
               value={
                 branches.find(
                   (branch) => branch.branchName === formData["branchName"]
                 ) || null
               } // Find the selected branch
               onChange={(event, newValue) => {
                 handleInputChange({
                   target: {
                     name: "branchName",
                     value: newValue?.branchName || "",
                   },
                 });
               }}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label="Branch Name"
                   variant="outlined"
                   name="branchName"
                   InputProps={{
                     ...params.InputProps,
                     startAdornment: (
                       <InputAdornment position="start">
                         <AccountTreeIcon/> {/* Add SchoolIcon in the input field */}
                       </InputAdornment>
                     ),
                   }}
                 />
               )}
             />
           </FormControl>
            )}
            
            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <Autocomplete
                id="searchable-bus-select"
                options={buses || []} // Ensure buses is an array
                getOptionLabel={(option) => option.deviceName || ""} // Display bus name
                value={
                  buses.find((bus) => bus.deviceId === formData["deviceId"]) ||
                  null
                } // Find the selected bus
                onChange={(event, newValue) => {
                  handleBusChange({
                    target: {
                      name: "deviceId",
                      value: newValue?.deviceId || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bus Name"
                    variant="outlined"
                    name="deviceId"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsBusIcon/> {/* Add SchoolIcon in the input field */}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Import Data</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </div>
            {/* <h2>Import Data</h2>
        <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton> */}
            <p>Please upload the file in the following format:</p>

           
            <Box sx={{ overflowX: "auto" }}>
              {" "}
              {/* Makes table scrollable if needed */}
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {sampleData[0].map((header, index) => (
                      <TableCell
                        key={index}
                        sx={{ padding: "4px", fontSize: "0.85rem" }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleData.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          sx={{ padding: "4px", fontSize: "0.8rem" }}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            {/* Button to Download Sample Excel */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadSample}
              sx={{ marginTop: "10px" }}
            >
              Download Sample Excel
            </Button>
            <p>
              Note: Please do not make changes to the column headers. Follow the
              sample Excel sheet's headings and fill in your data according to
              our format. The required fields are: supervisor Name,address,
              Email (must be unique), phone, Password{" "}
            </p>
            {/* File Upload Input */}
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ marginTop: "10px" }}
            />

            {/* Import Button */}
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
