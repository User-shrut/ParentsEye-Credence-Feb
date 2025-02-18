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
import { TotalResponsesContext } from "../../../../TotalResponsesContext";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Export from "../../Export";
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";


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
import { Autocomplete,Popper } from "@mui/material";
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

export const StudentDetail = () => {
  const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

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

  
  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true);
    try {
      let response;
      const token = localStorage.getItem("token");
  
      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/read-children`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/read-children`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/read-children`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (role == 4) {
        response = await axios.get(
          `http://63.142.251.13:4000/branchgroupuser/read-children`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
     
      }
  
      console.log("fetch data", response.data);
  const myarr=[];
      if (response?.data) {
        const allData =
          role == 1
            ? response.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.children) && branch.children.length > 0
                    ? branch.children.map((child) => ({
                        ...child,
                        schoolName: school.schoolName,
                        branchName: branch.branchName,
                      }))
                    : []
                )
              )
            : role == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.children) && branch.children.length > 0
                  ? branch.children
                  : []
              )
            : role == 3
            ? response?.data.data
            : role == 4
            ? response?.data.updatedChildData.map((child) => ({
                ...child,
                schoolName: child.schoolId?.schoolName || "N/A",
                branchName: child.branchId?.branchName || "N/A",
                parentName: child.parentId?.parentName || "N/A",
                 email:child.parentId?.email || "N/A",
                 password:child.parentId?.password || "N/A",
                formattedRegistrationDate: formatDate(child.registrationDate),
            
              }))
            : [];
  
        console.log("Processed allData:", allData);
  
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
            : allData;
  
        const reversedData = filteredData.reverse();
        console.log(`Data fetched between ${startDate} and ${endDate}:`, filteredData);
  
        setFilteredRows(
          reversedData.map((row) => ({ ...row, isSelected: false }))
        );
        setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
        setTotalResponses(reversedData.length);
      } else {
        console.error("Expected data but got:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to parse dates
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if single digit
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Add leading zero to month
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  function parseDate(dateString) {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  
  

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
        if(role==4){
          return row._id;
        }
        return row.childId; // Ensure id exists and is not undefined
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
          ? `${process.env.REACT_APP_SUPER_ADMIN_API}/delete/child`
          : role == 2
          ? `${process.env.REACT_APP_SCHOOL_API}/delete/child`
          : role==3
          ? `${process.env.REACT_APP_BRANCH_API}/delete/child`
          : `http://63.142.251.13:4000/branchgroupuser/deletechildbybranchgroup`;

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
          .post("http://63.142.251.13:4000/parent/import", parsedData)
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
    if(role==1){
      setBranches();
    }
    if (role != 3) {
      setBuses(undefined);  // assuming you're resetting buses state to an empty array or some other value
  }
    setImportModalOpen(false);
    setModalOpen(false);
    setFormData({});
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditSubmit = async () => {
    // Define the API URL and authentication token
    const token = localStorage.getItem("token");
    const apiUrl =
      role == 1
        ? `${process.env.REACT_APP_SUPER_ADMIN_API}/update-child`
        : role == 2
        ? `${process.env.REACT_APP_SCHOOL_API}/update-child`
        :role==3
        ? `${process.env.REACT_APP_BRANCH_API}/update-child`
        :`http://63.142.251.13:4000/branchgroupuser/updatechildbybranchgroup`

    // Prepare the updated data
    const updatedData = {
      ...formData,
      isSelected: false,
    };

    try {
      // Perform the PUT request
      const response = await fetch(role==4?`${apiUrl}/${updatedData._id}`:`${apiUrl}/${updatedData.childId}`, {
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
      alert("Updated successfully");

      // Update local state after successful API call
      const updatedRows = filteredRows.map((row) =>
        row._id === selectedRow._id // Make sure to use the correct ID property
          ? { ...row, ...formData, isSelected: false }
          : row
      );
      setFilteredRows(updatedRows);

      // Close the modal
      handleModalClose();

      // Fetch the latest data
      fetchData();
    } catch (error) {
      console.error("Error updating row:", error);
      alert(`Error updating row: ${error.message}`);
    }
  };

  const handleAddSubmit = async () => {
    try {
      const decoded = jwtDecode(localStorage.getItem("token"));
      let newRow;

      if (role == 1) {
        newRow = {
          ...formData,
          // id: filteredRows.length + 1,
          // isSelected: false,
        };
      } else if (role == 2) {
        newRow = {
          ...formData,
          schoolName: decoded.schoolName,
          // id: filteredRows.length + 1,
          // isSelected: false,
        };
      } else if(role==4){
        newRow={
          ...formData,
          schoolName:decoded.schoolName,
        }
      }
      
      else {
        newRow = {
          ...formData,
          schoolName: decoded.schoolName,
          branchName: decoded.branchName,
        };
      }

      console.log(newRow);

      // POST request to the server
      const response = await fetch(
        `${process.env.REACT_APP_API}/parent/register`,

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
      alert("record created successfully");

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
      pickupPoint: "", // Reset geofence selection
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
    }else if (role == 4) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "schoolName") {
      setFormData({
        ...formData,
        [name]: value,
        branchName: "", // Reset branch when school changes
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

      // Filter devices for the selected branch
      const filteredDevices = allDevices.filter((device) =>
        role === 1
          ? device.schoolName === formData.schoolName && device.branchName === value
          : device.branchName === value
      );
      setBuses(filteredDevices); // Update buses based on selected branch
    }
    if (name === "deviceId") {
      setSelectedDeviceId(value); // Set the selected device ID
      setFormData({
        ...formData,
        [name]: value,
      });

      // Filter geofences based on the selected bus (deviceId)
      const selectedDeviceGeofences = pickupPointsData[value] || []; // Access geofences using the deviceId as the key
      setFilteredGeofences(selectedDeviceGeofences); // Update geofences in state
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    if (name === "dateOfBirth" && value) {
      // Calculate the age based on Date of Birth
      const birthDate = new Date(value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const monthDifference = new Date().getMonth() - birthDate.getMonth();

      // Adjust the age if the birthday hasn't occurred this year yet
      const calculatedAge =
        monthDifference < 0 ||
        (monthDifference === 0 && new Date().getDate() < birthDate.getDate())
          ? age - 1
          : age;

      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: value,
        childAge: calculatedAge, // Set the calculated age
      }));
    } else {
      // For other inputs, just update the form data
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
//! 1st use effect
const [allDevices, setAllDevices] = useState([]);

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
  

//! 2st use effect
 /*  useEffect(() => {
    // Trigger the onChange when schoolName changes or on initial load
    if (formData.schoolName) {
      const event = {
        target: {
          name: "schoolName",
          value: formData.schoolName,
        },
      };
      handleInputChange(event); // Populate branches based on the selected school
    }
  }, [formData.schoolName, schools]); // Trigger when schoolName or schools list changes

  useEffect(() => {
    // Ensure the branchName is valid for the newly populated branches list
    if (formData.branchName && Array.isArray(branches) && branches.length > 0) {
      const selectedBranch = branches.find(
        (branch) => branch.branchName === formData.branchName
      );
  
      if (selectedBranch) {
        setFormData((prevData) => ({
          ...prevData,
          branchName: selectedBranch.branchName, // Set branchName to the selected branch if found
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          branchName: "", // Clear branch if it doesn't exist in the new branch list
        }));
      }
    }
  }, [branches, formData.branchName]); // Trigger when branches or branchName changes
   // Trigger when branches or branchName changes */
//! 3st use effect
/* useEffect(() => {
  if (formData.schoolName && role === 1) {
    // Find the selected school
    const selectedSchool = schools.find(
      (school) => school.schoolName === formData.schoolName
    );

    if (selectedSchool) {
      // Update branches based on the selected school
      const updatedBranches = selectedSchool.branches.map((branch) => ({
        branchName: branch.branchName,
        branchId: branch.branchId,
      }));
      setBranches(updatedBranches);

      // Validate or set default branchName
      const validBranch = updatedBranches.find(
        (branch) => branch.branchName === formData.branchName
      );

      setFormData((prevData) => ({
        ...prevData,
        branchName: validBranch
          ? formData.branchName
          : updatedBranches[0]?.branchName || "",
      }));
    } else {
      // Reset branches and branchName if no valid school is found
      setBranches([]);
      setFormData((prevData) => ({
        ...prevData,
        branchName: "",
      }));
    }
  }
}, [formData.schoolName, schools, role]); */
useEffect(() => {
  console.log("Selected School:", formData.schoolName);
  console.log("Available Branches:", branches);
  console.log("Selected Branch:", formData.branchName);
}, [formData.schoolName, branches, formData.branchName]);

  

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
            `${process.env.REACT_APP_SUPER_ADMIN_API}/getschools`,
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
            `${process.env.REACT_APP_SCHOOL_API}/branches`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Branch data fetched:", response.data);
          setBranches(response.data.school.branches);
          console.log("my response",branches)
        }
        
        catch (error) {
          console.error("Error fetching branches:", error);
        }
      }else if(role==4){
        try {
          const token=localStorage.getItem("token");
          const response=await axios.get(`http://63.142.251.13:4000/branchgroupuser/getdevicebranchgroupuser`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          })
         const branchname= response.data.data.flatMap((newdata)=>
          Array.isArray(newdata.branches)&&(newdata.branches.length)>0?
            newdata.branches.map((item)=>(
             {branchName:item.branchName}
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
            :`http://63.142.251.13:4000/branchgroupuser/getdevicebranchgroupuser`

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
      //   else if(role==4){
      //     allData=response.data.data.flatMap((item)=>
      //     Array.isArray(item.branches)&&item.branches>0?
      //   item.branches.flatMap((devicearray)=>(
      //     Array.isArray(devicearray.devices)&& devicearray.length>0?
      //     devicearray.devices.map((device)=>({
      //       ...device
      //     })):[]
      //   )):[]
      // )
      //   }
      else if (role == 4) {
        allData = response.data.data.flatMap((school) =>
            Array.isArray(school.branches) && school.branches.length > 0
                ? school.branches.flatMap((branch) =>
                      Array.isArray(branch.devices) && branch.devices.length > 0
                          ? branch.devices.map((device) => ({
                                ...device,
                                branchName: branch.branchName,
                                schoolName: school.schoolName,
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

    

    const fetchGeofence = async (startDate = "", endDate = "") => {
      // setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let response;

        // Fetch data based on role
        if (role == 1) {
          response = await axios.get(
            `${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else if (role == 2) {
          response = await axios.get(
            `${process.env.REACT_APP_SCHOOL_API}/geofences`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else if (role == 3) {
          response = await axios.get(
            `${process.env.REACT_APP_BRANCH_API}/geofences`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }else if (role == 4) {
          response = await axios.get(
            `http://63.142.251.13:4000/branchgroupuser/getgeofence`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
console.log("my geofences",response.data)
        if (response?.data) {
          let fetchedData = {};

          if (role == 1) {
            // Structure geofences by deviceId
            Object.entries(response.data).forEach(([deviceId, stops]) => {
              fetchedData[deviceId] = stops.map((stop) => ({
                ...stop,
                deviceId, // Include deviceId in each stop
              }));
            });
          } else if (role == 2) {
            // For role 2, assuming response contains branches with geofences
            response.data?.branches.forEach((branch) => {
              if (branch.geofences) {
                branch.geofences.forEach((geofence) => {
                  if (!fetchedData[geofence.deviceId]) {
                    // Use geofence.deviceId
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
          } if (role == 3) {
            // For role 3, handle geofences by device
            response.data.geofences.forEach((geofence) => {
              if (!fetchedData[geofence.deviceId]) {
                fetchedData[geofence.deviceId] = [];
              }
              fetchedData[geofence.deviceId].push({
                name: geofence.name,
                area: geofence.area,
                isCrossed: geofence.isCrossed,
                busStopTime: geofence.busStopTime,
                arrivalTime: geofence.arrivalTime,
                departureTime: geofence.departureTime,
                lastUpdated: geofence.lastUpdated,
                branchName: geofence.branchName,
                schoolName: geofence.schoolName,
              });
            });
          }if (role == 4) {
            // const fetchedData = {}; // Initialize an empty object to store the data
          
            response.data.branches.forEach((branch) => {
              if (branch.geofences) {
                branch.geofences.forEach((geofence) => {
                  if (!fetchedData[geofence.deviceId]) {
                    fetchedData[geofence.deviceId] = [];
                  }
                  fetchedData[geofence.deviceId].push({
                    ...geofence,
                    branchName: branch.branchName,
                    branchId: branch.branchId,
                  });
                });
              }
            });
          
            console.log("Fetched Data:", fetchedData);
          
            // Use fetchedData as needed in your application
          }
          
        
          

          console.log("role is:", role);
          console.log("geofences are IS:", fetchedData);
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
 
  const sampleData = [
    [
      "childName",
      "class",
      "rollno",
      "section",
      "schoolName",
      "branchName",
      "dateOfBirth",
      "childAge",
      "parentName",
      "email",
      "phone",
      "password",
      "gender",
      "pickupPoint",
      "deviceName",
      "deviceId",
    ],
    [
      "besap35",
      "10",
      "34",
      "A",
      "Podar",
      "Besa",
      "08-11-2009",
      "15",
      "parent1",
      "besap35",
      "8989898989",
      "123456",
      "male",
      "pickup1",
      "MH5667777",
      "2323",
    ],
    [
      "besap32",
      "9",
      "15",
      "B",
      "Podar",
      "Besa",
      "03-09-2008",
      "14",
      "parent2",
      "besap32",
      "8989898989",
      "123456",
      "female",
      "pickup2",
      "UP787878",
      "9090",
    ],
  ];

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "studentDetail.xlsx"; // Adjust the path here
    link.download = "StudentDetail.xlsx"; // Specify the download filename
    link.click();
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
        Student Detail{" "}
      </h1>
      <div >
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
          <Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"STUDENTS DETAIL"} pdfFilename={"StudentDetail.pdf"} excelFilename={"StudentDetail.xlsx"} />

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
         
          <Box sx={style}>
            {/* <h2>Add Row</h2> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Edit student</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              key={"childName"}
              label={"Student Name"}
              variant="outlined"
              name="childName"
              value={formData["childName"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DriveFileRenameOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />

            
            <FormControl
  sx={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "10px",
  }}
>
  <FormLabel
    id="demo-row-radio-buttons-group-label"
    sx={{ marginRight: 4 }} // Add some space between label and radio group
  >
    Gender
  </FormLabel>
  <RadioGroup
    row
    aria-labelledby="demo-row-radio-buttons-group-label"
    name="gender"
    value={formData.gender || ""} // Bind to formData.gender
    onChange={handleInputChange} // Update formData when selection changes
  >
    <FormControlLabel
      value="female"
      control={<Radio />}
      label="Female"
    />
    <FormControlLabel
      value="male"
      control={<Radio />}
      label="Male"
    />
  </RadioGroup>
</FormControl>


            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ marginRight: 4 }} // Add some space between label and radio group
              >
                Date of Birth
              </FormLabel>

              <TextField
                key={"childAge"}
                type="date"
                placeholder="Date of Birth"
                variant="outlined"
                name="dateOfBirth"
                value={formData["dateOfBirth"] || ""}
                onChange={handleInputChange}
                sx={{ marginBottom: "10px", width: "200px" }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon />
                    </InputAdornment>
                  ),}}
              />
            </FormControl>

            <TextField
              key={"childAge"}
              label={"Student Age"}
              variant="outlined"
              name="childAge"
              value={formData["childAge"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Face6Icon />  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />

          
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <Autocomplete
                id="searchable-select"
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // Array of values to choose from
                getOptionLabel={(option) => option.toString()} // Convert numeric values to string for display
                value={formData["class"] || null}
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: { name: "class", value: newValue },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Class"
                    variant="outlined"
                    name="class"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ClassIcon />  {/* Add SchoolIcon in the input field */}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
            <TextField
              key={"roleno"}
              label={"Roll No"}
              variant="outlined"
              name="rollno"
              value={formData["rollno"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PinIcon/>  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              key={"section"}
              label={"Section"}
              variant="outlined"
              name="section"
              value={formData["section"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HolidayVillageIcon />  {/* Add Face6Icon in the input field */}
                    </InputAdornment>
                  ),
                }}
            />
            {role == 1 ? (
              <>
             
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
                      Array.isArray(schools)
                        ? schools.find(
                            (school) =>
                              school.schoolName === formData["schoolName"]
                          )
                        : null
                    } // Safely find the selected school
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
                     key={`${formData.schoolName}-${formData.branchName}`} 
                    id="searchable-branch-select"
                    options={Array.isArray(branches) ? branches : []} // Ensure branches is an array
                    getOptionLabel={(option) => option.branchName || ""} // Display branch name
                    value={
                      Array.isArray(branches)
                        ? branches.find(
                            (branch) =>
                              branch.branchName === formData["branchName"]
                          )
                        : null
                    } // Safely find the selected branch
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
              </>
            ): role == 4 ? (
             
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
                    />
                  )}
                />
              </FormControl>
            ):role == 2 ? (
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
            ) : null}
            
           
            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <Autocomplete
                id="searchable-bus-select"
                options={Array.isArray(buses) ? buses : []} // Ensure buses is an array
                getOptionLabel={(option) => option.deviceName || ""} // Display bus name
                value={
                  Array.isArray(buses)
                    ? buses.find((bus) => bus.deviceId === formData["deviceId"])
                    : null
                } // Safely find the selected bus
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
          
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <Autocomplete
                id="geofence-autocomplete"
                options={filteredGeofences || []} // List of geofence objects
                getOptionLabel={(option) => option.name || ""} // Display geofence name
                value={
                  (filteredGeofences||[]).find(
                    (geofence) => geofence.name === formData["pickupPoint"]
                  ) || null
                } // Find the selected geofence
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "pickupPoint",
                      value: newValue?.name || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Geofence"
                    variant="outlined"
                    name="pickupPoint"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ShareLocationIcon />  {/* Add SchoolIcon in the input field */}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>

            <TextField
              key={"parent"}
              label={"Parent Name"}
              variant="outlined"
              name="parentName"
              value={formData["parentName"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AbcIcon />  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              key={"phone"}
              label={"Phone Number"}
              variant="outlined"
              name="phone"
              value={formData["phone"] || ""}
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
              key={"email"}
              label={"Parent's Email"}
              variant="outlined"
              name="email"
              value={formData["email"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon />  {/* Add Face6Icon in the input field */}
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
            {/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <InputLabel id="device-id-label">Select Device</InputLabel>
  <Select
    labelId="device-id-label"
    name="deviceId"
    value={selectedDeviceId}
    onChange={handleInputChange}
  >
    {pickupPointsData.map((item) => (
      <MenuItem key={item.deviceId} value={item.deviceId}>
        {item.deviceId} 
      </MenuItem>
    ))}
  </Select>
</FormControl>
{filteredGeofences.length > 0 && (
  <div>
    <h3>Geofences for Device {selectedDeviceId}:</h3>
    <ul>
      {filteredGeofences.map(geofence => (
        <li key={geofence._id}>{geofence.name}</li> // Display geofence name
      ))}
    </ul>
  </div>
)} */}

            
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
              <h2 style={{ flexGrow: 1 }}>Add Student</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              key={"childName"}
              label={"Student Name"}
              variant="outlined"
              name="childName"
              value={formData["childName"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DriveFileRenameOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ marginRight: 4 }} // Add some space between label and radio group
              >
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl>
           
           

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ marginRight: 4 }} // Add some space between label and radio group
              >
                Date of Birth
              </FormLabel>

              <TextField
                key={"childAge"}
                label={ "Date of Birth"}
                type="date"
                placeholder="Date of Birth"
                variant="outlined"
                name="dateOfBirth"
                value={formData["dateOfBirth"] || ""}
                onChange={handleInputChange}
                sx={{ marginBottom: "10px", width: "200px" }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon />
                    </InputAdornment>
                  ),}}
              />
            </FormControl>

            {/* <TextField
              key={"childAge"}
              label={"Student Age"}
              variant="outlined"
              name="childAge"
              value={formData["childAge"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            /> */}
 <TextField
        key={"childAge"}
        label={"Student Age"}
        variant="outlined"
        name="childAge"
        value={formData.childAge || ""}
        sx={{ marginBottom: "10px" }}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Face6Icon />  {/* Add Face6Icon in the input field */}
            </InputAdornment>
          ),
        }}
        // disabled // Disable the field since the age is calculated automatically
      />
            {/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="class"
                value={formData["class"] || ""}
                label="Class"
                onChange={handleInputChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl> */}

            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <Autocomplete
                id="searchable-select"
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // Array of values to choose from
                getOptionLabel={(option) => option.toString()} // Convert numeric values to string for display
                value={formData["class"] || null}
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: { name: "class", value: newValue },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Class"
                    variant="outlined"
                    name="class"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ClassIcon />  {/* Add SchoolIcon in the input field */}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
             
            <TextField
              key={"roleno"}
              label={"Roll No"}
              variant="outlined"
              name="rollno"
              value={formData["rollno"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" , zIndex: 1500 }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PinIcon/>  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              key={"section"}
              label={"Section"}
              variant="outlined"
              name="section"
              value={formData["section"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HolidayVillageIcon />  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />
            {role == 1 ? (
              <>
             
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
                      Array.isArray(schools)
                        ? schools.find(
                            (school) =>
                              school.schoolName === formData["schoolName"]
                          )
                        : null
                    } // Safely find the selected school
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
                    options={Array.isArray(branches) ? branches : []} // Ensure branches is an array
                    getOptionLabel={(option) => option.branchName || ""} // Display branch name
                    value={
                      Array.isArray(branches)
                        ? branches.find(
                            (branch) =>
                              branch.branchName === formData["branchName"]
                          )
                        : null
                    } // Safely find the selected branch
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
              </>
            ): role == 4 ? (
             
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
            ): role == 2 ? (
             
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
            ) : null}
          
            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <Autocomplete
                id="searchable-bus-select"
                options={Array.isArray(buses) ? buses : []} // Ensure buses is an array
                getOptionLabel={(option) => option.deviceName || ""} // Display bus name
                value={
                  Array.isArray(buses)
                    ? buses.find((bus) => bus.deviceId === formData["deviceId"])
                    : null
                } // Safely find the selected bus
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
          
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <Autocomplete
                id="geofence-autocomplete"
                options={filteredGeofences || []} // List of geofence objects
                getOptionLabel={(option) => option.name || ""} // Display geofence name
                value={
                  (filteredGeofences || []).find(
                    (geofence) => geofence.name === formData["pickupPoint"]
                  ) || null
                } // Find the selected geofence
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "pickupPoint",
                      value: newValue?.name || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Geofence"
                    variant="outlined"
                    name="pickupPoint"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ShareLocationIcon />  {/* Add SchoolIcon in the input field */}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>

            <TextField
              key={"parent"}
              label={"Parent Name"}
              variant="outlined"
              name="parentName"
              value={formData["parentName"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AbcIcon />  {/* Add Face6Icon in the input field */}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              key={"phone"}
              label={"Phone Number"}
              variant="outlined"
              name="phone"
              value={formData["phone"] || ""}
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
              key={"email"}
              label={"Parent's Email"}
              variant="outlined"
              name="email"
              value={formData["email"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon />  {/* Add Face6Icon in the input field */}
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
            {/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <InputLabel id="device-id-label">Select Device</InputLabel>
  <Select
    labelId="device-id-label"
    name="deviceId"
    value={selectedDeviceId}
    onChange={handleInputChange}
  >
    {pickupPointsData.map((item) => (
      <MenuItem key={item.deviceId} value={item.deviceId}>
        {item.deviceId} 
      </MenuItem>
    ))}
  </Select>
</FormControl>
{filteredGeofences.length > 0 && (
  <div>
    <h3>Geofences for Device {selectedDeviceId}:</h3>
    <ul>
      {filteredGeofences.map(geofence => (
        <li key={geofence._id}>{geofence.name}</li> // Display geofence name
      ))}
    </ul>
  </div>
)} */}

            {/* <TextField
              key={"fcmToken"}
              label={"fcm Token"}
              variant="outlined"
              name="fcmToken"
              value={formData["fcmToken"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
              
            /> */}
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubmit}
            >
              Submit
            </Button>
          </Box>
        </Modal>
        

        {/* <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
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
        </Modal> */}
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

            {/* Sample Excel Format Table */}
            {/* <Table>
          <TableHead>
            <TableRow>
              {sampleData[0].map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.slice(1).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
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
              our format. The required fields are: Email (must be unique),
              Parent Name, Password{" "}
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
