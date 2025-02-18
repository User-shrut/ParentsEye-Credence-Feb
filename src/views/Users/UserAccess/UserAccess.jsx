
//oct08
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
import { TotalResponsesContext } from '../../../views/ParentContext/TotalResponsesContext'
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import InputAdornment from "@mui/material/InputAdornment"; // Add this import
import SchoolIcon from '@mui/icons-material/School';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import PasswordIcon from '@mui/icons-material/Password';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Chip from "@mui/material/Chip";
import Export from "./ExportUserAccess";
// import excelfileUserAccess from "../../../../../public/UserAccess.xlsx";
import {
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { jwtDecode } from "jwt-decode";
//import { TextField } from '@mui/material';
import { Autocomplete } from "@mui/material";
import { StyledTablePagination } from '../../../../src/PaginationCssFile/TablePaginationStyles'

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

const UserAccess = () => {
  // const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterText, setFilterText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const role = localStorage.getItem("role");
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

  const [schools, setSchools] = useState();
  const [branches, setBranches] = useState();
  const [buses, setBuses] = useState();

  // const [dropdownOptions1, setDropdownOptions1] = useState([]);
  // const [selectedValue1, setSelectedValue1] = useState("");
  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true);
    try {
      let response;
      if (role == 1) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `http://63.142.251.13:4000/superadmin/branchgroup`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${import.meta.env.VITE_SCHOOL_API}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${import.meta.env.VITE_BRANCH_API}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data); // Log the entire response data
      // fetchgeofencepoint();
      if (response?.data) {
      
              const allData = 
              role==1
              ?response.data.branchGroups.map((group) => ({
                //  schoolName: group.school.schoolName,
                schoolName: group.school && group.school.schoolName ? group.school.schoolName : "N/A",
                school: group.school && group.school._id ? group.school._id : "N/A",
                  _id: group._id,

                username: group.username,
                password: group.password,
                phoneNo: group.phoneNo,
                formattedRegistrationDate:group.createdAt,
                branches: group.branches.map((branch) => ({
                  branchId: branch._id,
                  branchName: branch.branchName,
                })),
                // branches: group.branches, // Keep the branches as a nested array
              }))
            : role == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.children) && branch.children.length > 0
                  ? branch.children
                  : []
              )
            : response?.data.data;

        console.log("alldata of users",allData);

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
        // setTotalResponses(reversedData.length);
        // Log the date range and filtered data
        console.log(`Data fetched between ${startDate} and ${endDate}:`);
        console.log(filteredData);

      
      } else {
        console.error("Expected an array but got:", response.data.children);
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
          ? `http://63.142.251.13:4000/superadmin/branchgroup`
          : role == 2
          ? `${import.meta.env.VITE_SCHOOL_API}/delete/child`
          : `${import.meta.env.VITE_BRANCH_API}/delete/child`;

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


  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = new Uint8Array(e.target.result);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetNames = workbook.SheetNames;
  //       const sheet = workbook.Sheets[sheetNames[0]];
  //       const parsedData = XLSX.utils.sheet_to_json(sheet);
  //       setImportData(parsedData);
  //       console.log("uploadedfile",parsedData);
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  //   alert("file imported successfully");
  // };



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
      axios.post('http://63.142.251.13:4000/parent/import', parsedData)
        .then(response => {
          console.log('Data successfully posted:', response.data);
          alert('File imported and data posted successfully!');
        })
        .catch(error => {
          console.error('Error posting data:', error);
          alert('Error posting data. Please fill data in valid form as shown in sample excel sheet.');
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
    setModalOpen(false);
    setFormData({});
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // const handleEditSubmit = async () => {
  //   // Define the API URL and authentication token
  //   const token = localStorage.getItem("token");
  //   const apiUrl =
  //     role == 1
  //       ? `http://63.142.251.13:4000/superadmin/branchgroup`
  //       : role == 2 ? `${import.meta.env.VITE_SCHOOL_API}/update-child` : `${import.meta.env.VITE_BRANCH_API}/update-child`

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

  // const handleAddSubmit = async () => {
  //   try {
  //     const decoded = jwtDecode(localStorage.getItem('token'));
  //     let newRow;

  //     if(role == 1){
  //       newRow = {
  //         ...formData,
        
  //       };
  //     }
  //     else if(role == 2){
  //       newRow = {
  //         ...formData,
  //         schoolName: decoded.schoolName,
  //         // id: filteredRows.length + 1,
  //         // isSelected: false,
  //       };
  //     }else{
  //       newRow = {
  //         ...formData,
  //         schoolName: decoded.schoolName,
  //         branchName: decoded.branchName,
  //       };
  //     }
      

  //     console.log(newRow);

  //     // POST request to the server
  //     const response = await fetch(

  //       `http://63.142.251.13:4000/superadmin/branchgroup`,

  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newRow),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     alert("record created successfully");

  //     // Assuming the server returns the created object
  //     const result = await response.json();

  //     // Update the state with the new row
  //     setFilteredRows([...filteredRows, result]);

  //     // Close the modal
  //     handleModalClose();
  //     fetchData();
  //     console.log("error occured in post method");
  //   } catch (error) {
  //     console.error("Error during POST request:", error);
  //     alert("unable to create record");
  //     // Handle the error appropriately (e.g., show a notification to the user)
  //   }
  // };

  // When setting up `formData` for editing
const handleEditClick = (selectedRowData) => {
  setFormData({ ...selectedRowData, isSelected: false });
  setEditModalOpen(true);
};

// During the submission
// const handleEditSubmit = async () => {
//   const token = localStorage.getItem("token");
//   const apiUrl =
//     role == 1
//       ? `http://63.142.251.13:4000/superadmin/branchgroup`
//       : role === 2
//       ? `${import.meta.env.VITE_SCHOOL_API}/update-child`
//       : `${import.meta.env.VITE_BRANCH_API}/update-child`;

//   const updatedData = {
//     ...formData,

//     isSelected: false,
//   };

//   if (!updatedData._id) {
//     alert("Error: Missing ID for update.");
//     return;
//   }

//   try {
//     const response = await fetch(`${apiUrl}/${updatedData._id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(updatedData),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log("Update successful:", result);
//     alert("Updated successfully");
//     handleModalClose();
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
      ? `http://63.142.251.13:4000/superadmin/branchgroup`
      : role === 2
      ? `${import.meta.env.VITE_SCHOOL_API}/update-child`
      : `${import.meta.env.VITE_BRANCH_API}/update-child`;

  // Ensure `branchName` is in the correct format for the API
  const updatedData = {
    ...formData,
    // branchName: Array.isArray(formData.branchName) ? formData.branchName : [formData.branchName],
    branchName: formData.branchIds || [],
    isSelected: false,
  };

  if (!updatedData._id) {
    alert("Error: Missing ID for update.");
    return;
  }

  try {
    console.log("Updated data to be sent:", updatedData); // Log data to check structure
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
    handleModalClose();
    fetchData();
  } catch (error) {
    console.error("Error updating row:", error);
    alert(`Error updating row: ${error.message}`);
  }
};

  const handleAddSubmit = async () => {
    try {
      const decoded = jwtDecode(localStorage.getItem('token'));
      let newRow;
  
      if (role == 1) {
        newRow = {
          username: formData["username"],
          password: formData["password"],
          schoolName: formData["schoolName"], // Send school _id here
          branchName: formData["branchIds"], // Send array of branch _ids
          branchIds: formData["branchIds"],
          //  phone: formData["phone"]
        };
      } else if (role == 2) {
        newRow = {
          username: formData["username"],
          password: formData["password"],
          school: decoded.schoolId,
          branches: formData["branchIds"],
          // phone: formData["phone"]
        };
      } else {
        newRow = {
          username: formData["username"],
          password: formData["password"],
          school: decoded.schoolId,
          branches: formData["branchIds"],
          // phone: formData["phone"]
        };
      }
  
      console.log(newRow);
  
      const response = await fetch(
        `http://63.142.251.13:4000/superadmin/branchgroup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newRow),
        }
      );
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      alert("Record created successfully");
  
      const result = await response.json();
      setFilteredRows([...filteredRows, result]);
  
      handleModalClose();
      fetchData();
    } catch (error) {
      console.error("Error during POST request:", error);
      alert("Unable to create record");
    }
  };
  
  const [open, setOpen] = useState(false); // State to control dropdown open/close


const handleBusChange = (e) => {
  const { value } = e.target;

  if (!buses || !Array.isArray(buses)) {
      console.error("Buses data is not available or not an array");
      return;
  }

  // Find the selected bus by its deviceId
  const selectedBus = buses.find(bus => bus.deviceId === value);

  if (!selectedBus) {
      console.error("Selected bus not found");
      return;
  }

  // Update the form data with the selected device details
  setFormData((prevData) => ({
      ...prevData,
      deviceId: selectedBus.deviceId,
      deviceName: selectedBus.deviceName,
      pickupPoint: '', // Reset geofence selection
  }));

  let geofencesForSelectedDevice = [];

  if (role == 2) {
      // For role == 2, look up geofences in pickupPointsData by the selectedBus.deviceId
      geofencesForSelectedDevice = pickupPointsData[selectedBus.deviceId] || [];

      if (geofencesForSelectedDevice.length === 0) {
          console.error("No geofences found for this deviceId");
      }
  } else if (role == 1) {
      const geofenceKey = `deviceId: ${selectedBus.deviceId}`;
      geofencesForSelectedDevice = pickupPointsData[geofenceKey] || [];

      if (geofencesForSelectedDevice.length === 0) {
          console.error("No geofences found for this deviceId");
      }
  } else if (role == 3) {
    // Handling for role 3
    geofencesForSelectedDevice = pickupPointsData[selectedBus.deviceId] || [];

      if (geofencesForSelectedDevice.length === 0) {
          console.error("No geofences found for this deviceId");
      }
  }

  // Update the filtered geofences state
  setFilteredGeofences(geofencesForSelectedDevice);
  console.log("Filtered Geofences:", geofencesForSelectedDevice);
};
const [allDevices, setAllDevices] = useState([]);



const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "schoolName") {
    setFormData({
      ...formData,
      [name]: value, // Store the _id in formData
      branchIds: [], // Reset branch IDs when school changes
    });

    const selectedSchool = schools.find(school => school._id === value);
    if (selectedSchool) {
      const branches = selectedSchool.branches.map(branch => ({
        branchName: branch.branchName,
        branchId: branch._id, // Store branch _id as branchId
      }));
      setBranches(branches);

      const filteredDevices = allDevices.filter(device => device.schoolName === selectedSchool.schoolName);
      setBuses(filteredDevices);
    }
  } else if (name === "branchIds") {
    setFormData({
      ...formData,
      [name]: value, // Update branch IDs in formData
    });

    const selectedBranchNames = branches
      .filter(branch => value.includes(branch.branchId))
      .map(branch => branch.branchName);
      
    const filteredDevices = allDevices.filter(device => selectedBranchNames.includes(device.branchName));
    setBuses(filteredDevices);
  } else if (name === "deviceId") {
    setSelectedDeviceId(value);
    setFormData({
      ...formData,
      [name]: value,
    });

    const selectedDeviceGeofences = pickupPointsData[value] || [];
    setFilteredGeofences(selectedDeviceGeofences);
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};
 
  
  

  const [selectedValues, setSelectedValues] = useState({});

  // Handle the change for the dropdown, updating the selected branch for each school
  const handleSelectChange = (schoolId) => (event) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [schoolId]: event.target.value,
    }));
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
  const [pickupPointsData, setPickupPointsData] = useState([]); // Use descriptive state name
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [filteredGeofences, setFilteredGeofences] = useState([]); 
  useEffect(() => {
    const fetchSchool = async (startDate = "", endDate = "") => {
      setLoading(true);
      if (role == 1) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_SUPER_ADMIN_API}/getschools`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          console.log("School data fetched:", response.data);

          if (Array.isArray(response.data.schools)) {
            setSchools(response.data.schools);
          }
        } catch (error) {
          console.error("Error fetching schools:", error);
        } finally {
          setLoading(false);
        }
      } else if (role == 2) {
        // Fetch branches for role 2 (School Admin)
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_SCHOOL_API}/branches`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Branch data fetched:", response.data);
          setBranches(response.data.school.branches);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      }
    };

    const fetchBuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl =
          role == 1
            ? `${import.meta.env.VITE_SUPER_ADMIN_API}/read-devices`
            : role == 2
            ? `${import.meta.env.VITE_SCHOOL_API}/read-devices`
            : `${import.meta.env.VITE_BRANCH_API}/read-devices`;
    
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
        }
    
        setAllDevices(allData); // Store all devices
        setBuses(allData); // Set initial buses as well
        console.log("filter devices according to branch",allData)
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };
   
    // const fetchGeofence = async (startDate = "", endDate = "") => {
    //   // setLoading(true);
    //   try {
    //     const token = localStorage.getItem("token");
    //     let response;
    
    //     // Fetch data based on role
    //     if (role == 1) {
    //       response = await axios.get(`${import.meta.env.VITE_SUPER_ADMIN_API}/geofences`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //       });
    //     } else if (role == 2) {
    //       response = await axios.get(`${import.meta.env.VITE_SCHOOL_API}/geofences`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //       });
    //     } else if (role == 3) {
    //       response = await axios.get(`${import.meta.env.VITE_BRANCH_API}/geofences`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //       });
    //     }
    
    //     if (response?.data) {
    //       let fetchedData = {};
    
    //       if (role == 1) {
    //         // Structure geofences by deviceId
    //         Object.entries(response.data).forEach(([deviceId, stops]) => {
    //           fetchedData[deviceId] = stops.map(stop => ({
    //             ...stop,
    //             deviceId, // Include deviceId in each stop
    //           }));
    //         });
    //       } else if (role == 2) {
    //         // For role 2, assuming response contains branches with geofences
    //         response.data?.branches.forEach(branch => {
    //           if (branch.geofences) {
    //             branch.geofences.forEach(geofence => {
    //               if (!fetchedData[branch.deviceId]) {
    //                 fetchedData[branch.deviceId] = [];
    //               }
    //               fetchedData[branch.deviceId].push({
    //                 ...geofence,
    //                 branchId: branch.branchId,
    //                 branchName: branch.branchName,
    //               });
    //             });
    //           }
    //         });
    //       } else if (role == 3) {
    //         // For role 3, handle geofences by device
    //         response.data.devices.forEach(device => {
    //           device.geofences.forEach(geofence => {
    //             if (!fetchedData[device.deviceId]) {
    //               fetchedData[device.deviceId] = [];
    //             }
    //             fetchedData[device.deviceId].push({
    //               ...geofence,
    //               deviceId: device.deviceId,
    //             });
    //           });
    //         });
    //       }
    
    //       console.log("role is:", role);
    //       console.log("geofences are:", fetchedData);
    //       // Update the state with fetched data
    //       setPickupPointsData(fetchedData);
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };
    
    const fetchGeofence = async (startDate = "", endDate = "") => {
      // setLoading(true);
      try {
          const token = localStorage.getItem("token");
          let response;
  
          // Fetch data based on role
          if (role == 1) {
              response = await axios.get(`${import.meta.env.VITE_SUPER_ADMIN_API}/geofences`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
          } else if (role == 2) {
              response = await axios.get(`${import.meta.env.VITE_SCHOOL_API}/geofences`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
          } else if (role == 3) {
              response = await axios.get(`${import.meta.env.VITE_BRANCH_API}/geofences`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
          }
  
          if (response?.data) {
              let fetchedData = {};
  
              if (role == 1) {
                  // Structure geofences by deviceId
                  Object.entries(response.data).forEach(([deviceId, stops]) => {
                      fetchedData[deviceId] = stops.map(stop => ({
                          ...stop,
                          deviceId, // Include deviceId in each stop
                      }));
                  });
              } else if (role == 2) {
                  // For role 2, assuming response contains branches with geofences
                  response.data?.branches.forEach(branch => {
                      if (branch.geofences) {
                          branch.geofences.forEach(geofence => {
                              if (!fetchedData[geofence.deviceId]) { // Use geofence.deviceId
                                  fetchedData[geofence.deviceId] = [];
                              }
                              fetchedData[geofence.deviceId].push({
                                  ...geofence,
                                  branchId: branch.branchId,
                                  branchName: branch.branchName,
                              });
                          });
                      }
                  });
              } else if (role == 3) {
                  // For role 3, handle geofences by device
                  response.data.devices.forEach(device => {
                      device.geofences.forEach(geofence => {
                          if (!fetchedData[device.deviceId]) {
                              fetchedData[device.deviceId] = [];
                          }
                          fetchedData[device.deviceId].push({
                              ...geofence,
                              deviceId: device.deviceId,
                          });
                      });
                  });
              }
  
              console.log("role is:", role);
              console.log("geofences are:", fetchedData);
              // Update the state with fetched data
              setPickupPointsData(fetchedData);
          }
      } catch (error) {
          console.error("Error:", error);
      }
  };
    
    fetchBuses();
    fetchSchool();
    fetchGeofence();
  }, [role]);
  // const sampleData = [
  //   ["Student Name", "Class", "Roll No.", "Section","School Name","Branch Name","DOB","Child Age","Parent Name","User Name","Phone Numnber","Password"],
  //   ["John Doe", "10", "16", "A","Study Point","Branch1","13-03-2009","12","Vicky Doe","Vicky Doe","8989898989","5678"],
  //   ["Jane Doe", "10", "16", "A","Udemy","Branch6","11-03-2008","13","Vicky Doe","username","8989898989","5678"],
  // ];
  const sampleData = [
    ["childName", "class", "rollno", "section", "schoolName", "branchName", "dateOfBirth", "childAge", "parentName", "email", "phoneNo", "password","gender","pickupPoint","deviceName","deviceId"],
    ["besap35", "10", "34", "A", "Podar", "Besa", "08-11-2009", "15", "parent1", "besap35", "8989898989", "123456","male","pickup1","MH5667777","2323"],
    ["besap32", "9", "15", "B", "Podar", "Besa", "03-09-2008", "14", "parent2", "besap32", "8989898989", "123456","female","pickup2","UP787878","9090"],
   
];
// const [selectedValues, setSelectedValues] = useState({}); // Use object to track selected devices per row


  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "UserAccess.xlsx";  // Adjust the path here
    link.download = "UserAccess.xlsx";  // Specify the download filename
    link.click();
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        User Access{" "}
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
          <Export filteredRows={filteredRows} COLUMNS={COLUMNS} columnVisibility={columnVisibility}/>

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
                        minWidth: 70, // Adjust width if needed
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "2px solid black",
                        padding: "4px 4px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                     Assign Branches
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
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                fontSize: "smaller",
              }}
            >
              <Select
                value={selectedValues[row.id] || ""}
                onChange={handleSelectChange(row.id)}
                displayEmpty
                fullWidth
                variant="outlined"
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
                <MenuItem value="">
                  Assign Branches
                </MenuItem>
                {row.branches.map((branch) => (
                  <MenuItem key={branch.branchId} value={branch.branchId} disabled>
                    {branch.branchName}
                  </MenuItem>
                ))}
              </Select>
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
            {/* <h2>Add Row</h2> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Edit User Access</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              key={"username"}
              label={"user name"}
              variant="outlined"
              name="username"
              value={formData["username"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PermIdentityIcon/>  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />

        

          
            {role == 1 ? (
              <>
              
           <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-school-select"
    options={schools || []} // Ensure schools is an array
    getOptionLabel={(option) => option.schoolName || ""} // Display school name
    value={Array.isArray(schools) ? schools.find(school => school._id === formData["schoolName"]) : null} // Find selected school by _id   
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "schoolName", value: newValue?._id || "" }, // Store _id instead of schoolName
      });  

      if (newValue) {
        const branches = newValue.branches.map(branch => ({
          branchName: branch.branchName,
          branchId: branch._id, // Store branch _id as branchId
        }));
        setBranches(branches);

        // Filter devices for the selected school
        const filteredDevices = allDevices.filter(device => device.schoolName === newValue.schoolName);
        setBuses(filteredDevices); // Update buses based on selected school
      }
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

              

{/* <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-branch-select"
    multiple
    options={branches || []} // Ensure branches is an array
    getOptionLabel={(option) => option.branchName || ""} // Display branch name
    value={Array.isArray(branches)
      ? branches.filter(branch => formData["branchIds"]?.includes(branch.branchId)) // Filter selected branches by _id
      : []}
    onChange={(event, newValue) => {
      // Update formData with selected branch IDs
      handleInputChange({
        target: { name: "branchIds", value: newValue.map(branch => branch.branchId) }, // Store selected branch IDs
      });
    }}
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    disableCloseOnSelect
    renderInput={(params) => (
      <TextField
        {...params}
        label="Branch Name"
        variant="outlined"
        name="branchIds"
      />
    )}
  />
</FormControl> */}
<FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-branch-select"
    multiple
    options={branches || []} // Ensure branches is an array
    getOptionLabel={(option) => option.branchName || ""} // Display branch name
    value={
      Array.isArray(branches)
        ? branches.filter(branch => formData["branchIds"]?.includes(branch.branchId)) // Filter selected branches by branchId
        : []
    }
    onChange={(event, newValue) => {
      // Update formData with selected branch IDs
      handleInputChange({
        target: { name: "branchIds", value: newValue.map(branch => branch.branchId) }, // Store selected branch IDs
      });
    }}
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    disableCloseOnSelect
    isOptionEqualToValue={(option, value) => option.branchId === value.branchId} // Ensure matching by branchId
    renderTags={(selected, getTagProps) => 
      selected.map((option, index) => (
        <Chip 
          key={option.branchId} 
          label={option.branchName} 
          {...getTagProps({ index })} 
        />
      ))
    } // Customize how selected items are shown
    renderInput={(params) => (
      <TextField
        {...params}
        label="Branch Name"
        variant="outlined"
        name="branchIds"
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <>
              <InputAdornment position="start">
                <AccountTreeIcon /> {/* Add SchoolIcon in the input field */}
              </InputAdornment>
              {params.InputProps.startAdornment}
            </>
          ),
        }}
      />
    )}
  />
</FormControl>

              </>
            ) : role == 2 ? (
             
              <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
              <Autocomplete
                id="searchable-branch-select"
                multiple // Enable multiple selections
                options={branches || []} // Ensure branches is an array
                getOptionLabel={(option) => option.branchName || ""} // Display branch name
                value={Array.isArray(branches)
                  ? branches.filter(branch => formData["branchName"]?.includes(branch.branchName)) // Filter selected branches
                  : []}
                onChange={(event, newValue) => {
                  // Update formData with selected branch names
                  handleInputChange({
                    target: { name: "branchName", value: newValue.map(branch => branch.branchName) }, // Store the selected branch names
                  });
                }}
                open={open} // Control dropdown open state
                onOpen={() => setOpen(true)} // Open dropdown when user interacts with it
                onClose={() => setOpen(false)} // Close dropdown when interaction ends
                disableCloseOnSelect // Prevent dropdown from closing after selection
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


            ) : null}
          
            <TextField
              key={"phone No"}
              label={"Phone Number"}
              variant="outlined"
              name="phoneNo"
              value={formData["phoneNo"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneInTalkIcon />  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />
           
            <TextField
              key={"password"}
              label={"Password"}
              variant="outlined"
              name="password"
              value={formData["password"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon />  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />
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
              <h2 style={{ flexGrow: 1 }}>Add Users</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              key={"username"}
              label={"user name"}
              variant="outlined"
              name="username"
              value={formData["username"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PermIdentityIcon/>  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />

        

          
            {role == 1 ? (
              <>
              
           <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-school-select"
    options={schools || []} // Ensure schools is an array
    getOptionLabel={(option) => option.schoolName || ""} // Display school name
    value={Array.isArray(schools) ? schools.find(school => school._id === formData["schoolName"]) : null} // Find selected school by _id
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "schoolName", value: newValue?._id || "" }, // Store _id instead of schoolName
      });

      if (newValue) {
        const branches = newValue.branches.map(branch => ({
          branchName: branch.branchName,
          branchId: branch._id, // Store branch _id as branchId
        }));
        setBranches(branches);

        // Filter devices for the selected school
        const filteredDevices = allDevices.filter(device => device.schoolName === newValue.schoolName);
        setBuses(filteredDevices); // Update buses based on selected school
      }
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

              

{/* <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-branch-select"
    multiple
    options={branches || []} // Ensure branches is an array
    getOptionLabel={(option) => option.branchName || ""} // Display branch name
    value={Array.isArray(branches)
      ? branches.filter(branch => formData["branchIds"]?.includes(branch.branchId)) // Filter selected branches by _id
      : []}
    onChange={(event, newValue) => {
      // Update formData with selected branch IDs
      handleInputChange({
        target: { name: "branchIds", value: newValue.map(branch => branch.branchId) }, // Store selected branch IDs
      });
    }}
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    disableCloseOnSelect
    renderInput={(params) => (
      <TextField
        {...params}
        label="Branch Name"
        variant="outlined"
        name="branchIds"
      />
    )}
  />
</FormControl> */}
<FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-branch-select"
    multiple
    options={branches || []} // Ensure branches is an array
    getOptionLabel={(option) => option.branchName || ""} // Display branch name
    value={
      Array.isArray(branches)
        ? branches.filter(branch => formData["branchIds"]?.includes(branch.branchId)) // Filter selected branches by branchId
        : []
    }
    onChange={(event, newValue) => {
      // Update formData with selected branch IDs
      handleInputChange({
        target: { name: "branchIds", value: newValue.map(branch => branch.branchId) }, // Store selected branch IDs
      });
    }}
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    disableCloseOnSelect
    isOptionEqualToValue={(option, value) => option.branchId === value.branchId} // Ensure matching by branchId
    renderTags={(selected, getTagProps) => 
      selected.map((option, index) => (
        <Chip 
          key={option.branchId} 
          label={option.branchName} 
          {...getTagProps({ index })} 
        />
      ))
    } // Customize how selected items are shown
    renderInput={(params) => (
      <TextField
        {...params}
        label="Branch Name"
        variant="outlined"
        name="branchIds"
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <>
              <InputAdornment position="start">
                <AccountTreeIcon /> {/* Add SchoolIcon in the input field */}
              </InputAdornment>
              {params.InputProps.startAdornment}
            </>
          ),
        }}
      />
    )}
  />
</FormControl>


              </>
            ) : role == 2 ? (
             
              <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
              <Autocomplete
                id="searchable-branch-select"
                multiple // Enable multiple selections
                options={branches || []} // Ensure branches is an array
                getOptionLabel={(option) => option.branchName || ""} // Display branch name
                value={Array.isArray(branches)
                  ? branches.filter(branch => formData["branchName"]?.includes(branch.branchName)) // Filter selected branches
                  : []}
                onChange={(event, newValue) => {
                  // Update formData with selected branch names
                  handleInputChange({
                    target: { name: "branchName", value: newValue.map(branch => branch.branchName) }, // Store the selected branch names
                  });
                }}
                open={open} // Control dropdown open state
                onOpen={() => setOpen(true)} // Open dropdown when user interacts with it
                onClose={() => setOpen(false)} // Close dropdown when interaction ends
                disableCloseOnSelect // Prevent dropdown from closing after selection
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


            ) : null}
          
            <TextField
               key={"phone No"}
               label={"Phone Number"}
               variant="outlined"
               name="phoneNo"
               value={formData["phoneNo"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneInTalkIcon />  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}  
            />
           
            <TextField
              key={"password"}
              label={"Password"}
              variant="outlined"
              name="password"
              value={formData["password"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon />  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />
      

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
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <h2>Import Data</h2>
        <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
        </div>
       
        <p>Please upload the file in the following format:</p>

       
  <Box sx={{ overflowX: "auto" }}> {/* Makes table scrollable if needed */}
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {sampleData[0].map((header, index) => (
              <TableCell key={index} sx={{ padding: "4px", fontSize: "0.85rem" }}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.slice(1).map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} sx={{ padding: "4px", fontSize: "0.8rem" }}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
        {/* Button to Download Sample Excel */}
        <Button variant="contained" color="primary" onClick={handleDownloadSample} sx={{ marginTop: "10px" }}>
          Download Sample Excel
        </Button>
<p>


Note: Please do not make changes to the column headers. Follow the sample Excel sheet's headings and fill in your data according to our format. The required fields are:

Email (must be unique),
Parent Name,
Password </p>
        {/* File Upload Input */}
        <input type="file" onChange={handleFileUpload} style={{ marginTop: "10px" }} />

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
export default UserAccess