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
import InputAdornment from "@mui/material/InputAdornment"; // Add this import
import SchoolIcon from '@mui/icons-material/School';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Export from "../../Export"

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
const orangeBtn ={ backgroundColor: "rgb(255, 165, 0)"}


const SchoolMaster = () => {
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

  // const fetchData = async (startDate = "", endDate = "") => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_SUPER_ADMIN_API}/getschools`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("fetch data", response.data); // Log the entire response data

  //     if (Array.isArray(response.data.schools)) {
  //       const allData = response.data.schools;

  //       // Apply local date filtering if dates are provided
  //       const filteredData =
  //         startDate || endDate
  //           ? allData.filter((row) => {
  //               const registrationDate = parseDate(
  //                 row.formattedRegistrationDate
  //               );
  //               const start = parseDate(startDate);
  //               const end = parseDate(endDate);

  //               return (
  //                 (!startDate || registrationDate >= start) &&
  //                 (!endDate || registrationDate <= end)
  //               );
  //             })
  //           : allData; // If no date range, use all data
  //       const reversedData = filteredData.reverse();
  //       // Log the date range and filtered data
  //       console.log(`Data fetched between ${startDate} and ${endDate}:`);
  //       console.log(filteredData);
  //       setFilteredRows(
  //         reversedData.map((row) => ({ ...row, isSelected: false }))
  //       );
  //       setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
  //       setTotalResponses(reversedData.length);
  //     } else {
  //       console.error("Expected an array but got:", response.data.supervisors);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false after fetching completes
  //   }
  // };
  // const transformData = (schools) => {
  //   if (!Array.isArray(schools)) {
  //     console.error("Expected schools to be an array, but got:", schools);
  //     return [];
  //   }

  //   return schools.flatMap((school) =>
  //     Array.isArray(school.branches)
  //       ? school.branches.flatMap((branch) =>
  //           Array.isArray(branch.devices)
  //             ? branch.devices.map((device) => ({
  //                 schoolName: school.schoolName,
  //                 branchName: branch.branchName,
  //                 username: school.username,
  //                 mobileNo: school.mobileNo,
  //                 email: school.email,
  //                 password: school.password,
  //                 deviceId: device.deviceId,
  //                 deviceName: device.deviceName,
  //               }))
  //             : []
  //         )
  //       : []
  //   );
  // };
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_SUPER_ADMIN_API}/getschools`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log(response.data)

  //     const { schools } = response.data;

  //     if (Array.isArray(schools)) {
  //       const transformedData = transformData(schools);

  //       setFilteredRows(transformedData.map((row) => ({ ...row, isSelected: false })));
  //       setOriginalRows(transformedData.map((row) => ({ ...row, isSelected: false })));
  //       setTotalResponses(transformedData.length);
  //     } else {
  //       console.error("Expected an array but got:", schools);
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
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_SUPER_ADMIN_API}/getschools`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("fetch data", response.data); // Log the entire response data

  //     if (Array.isArray(response.data.schools)) {
  //       const allData = response.data.schools;

  //       // Apply local date filtering if dates are provided
  //       const filteredData =
  //         startDate || endDate
  //           ? allData.filter((row) => {
  //               const registrationDate = parseDate(
  //                 row.formattedRegistrationDate
  //               );
  //               const start = parseDate(startDate);
  //               const end = parseDate(endDate);

  //               return (
  //                 (!startDate || registrationDate >= start) &&
  //                 (!endDate || registrationDate <= end)
  //               );
  //             })
  //           : allData; // If no date range, use all data
  //       const reversedData = filteredData.reverse();
  //       // Log the date range and filtered data
  //       console.log(`Data fetched between ${startDate} and ${endDate}:`);
  //       console.log(filteredData);
  //       setFilteredRows(
  //         reversedData.map((row) => ({ ...row, isSelected: false }))
  //       );
  //       setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
  //       setTotalResponses(reversedData.length);
  //     } else {
  //       console.error("Expected an array but got:", response.data.supervisors);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false after fetching completes
  //   }
  // };
  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true);
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

        // Map the data to include the first branch name
        const mappedData = reversedData.map((row) => {
          const firstBranchName =
            row.branches && row.branches.length > 0
              ? row.branches[0].branchName
              : "No Branch"; // Fallback if no branches are found
          return {
            ...row,
            branchName: firstBranchName, // Add first branch name to the row
            isSelected: false,
          };
        });

        // Log the date range and filtered data
        console.log(`Data fetched between ${startDate} and ${endDate}:`);
        console.log(filteredData);

        setFilteredRows(mappedData);
        setOriginalRows(
          allData.map((row) => {
            const firstBranchName =
              row.branches && row.branches.length > 0
                ? row.branches[0].branchName
                : "No Branch"; // Fallback if no branches
            return { ...row, branchName: firstBranchName, isSelected: false };
          })
        );
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

  // const handleDeleteSelected = async () => {
  //   // Log filteredRows to check its structure
  //   console.log("Filtered rows:", filteredRows);

  //   // Get selected row IDs
  //   const selectedIds = filteredRows
  //     .filter((row) => row.isSelected)
  //     .map((row) => {
  //       // Log each row to check its structure
  //       console.log("Processing row:", row);
  //       return row._id; // Ensure id exists and is not undefined
  //     });

  //   console.log("Selected IDs:", selectedIds);

  //   if (selectedIds.length === 0) {
  //     alert("No rows selected for deletion.");
  //     return;
  //   }
  //   const userConfirmed = window.confirm(
  //     `Are you sure you want to delete ${selectedIds.length} record(s)?`
  //   );

  //   if (!userConfirmed) {
  //     // If the user clicks "Cancel", exit the function
  //     return;
  //   }
  //   try {
  //     // Define the API endpoint and token
  //     const apiUrl =
  //       `${process.env.REACT_APP_SUPER_ADMIN_API}/delete-school`;
  //     const token = localStorage.getItem('token');
  //     // Send delete requests for each selected ID
  //     const deleteRequests = selectedIds.map((id) =>
  //       fetch(`${apiUrl}/${id}`, {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }).then((response) => {
  //         if (!response.ok) {
  //           throw new Error(
  //             `Error deleting record with ID ${id}: ${response.statusText}`
  //           );
  //         }
  //         return response.json();
  //       })
  //     );

  //     // Wait for all delete requests to complete
  //     await Promise.all(deleteRequests);

  //     // Filter out deleted rows
  //     const newFilteredRows = filteredRows.filter((row) => !row.isSelected);

  //     // Update state
  //     setFilteredRows(newFilteredRows);
  //     setSelectAll(false);

  //     alert("Selected records deleted successfully.");
  //   } catch (error) {
  //     console.error("Error during deletion:", error);
  //     alert("Failed to delete selected records.");
  //   }
  //   fetchData();
  // };
  const handleDeleteSelected = async () => {
    try {
      // Get selected row IDs
      const selectedIds = filteredRows
        .filter((row) => row.isSelected)
        .map((row) => row._id);

      if (selectedIds.length === 0) {
        alert("No rows selected for deletion.");
        return;
      }

      const userConfirmed = window.confirm(
        `Are you sure you want to delete ${selectedIds.length} record(s)?`
      );
      if (!userConfirmed) return;

      const apiUrl = `${process.env.REACT_APP_SUPER_ADMIN_API}/delete-school`;
      const token = localStorage.getItem("token");

      // Send DELETE requests
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

      // Wait for all deletions
      await Promise.all(deleteRequests);

      // Filter out deleted rows from UI
      const newFilteredRows = filteredRows.filter((row) => !row.isSelected);
      setFilteredRows(newFilteredRows);
      setSelectAll(false);

      alert("Selected records deleted successfully.");
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Failed to delete selected records.");
    }

    // Re-fetch data after deletion
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditSubmit = async () => {
    // Define the API URL and authentication token

    try {
      const apiUrl = `${process.env.REACT_APP_SUPER_ADMIN_API}/edit-school/${selectedRow._id}`;

      const token = localStorage.getItem("token");
      // Prepare the updated data
      const updatedData = {
        ...formData,
        isSelected: false,
      };

      console.log(updatedData);

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
        row._id === selectedRow._id
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

      let token = localStorage.getItem("token");

      // POST request to the server
      const response = await fetch(
        `${process.env.REACT_APP_SUPER_ADMIN_API}/school-register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRow),
        }
      );

      alert("record created successfully");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setFilteredRows([...filteredRows, result]);

      handleModalClose();
      fetchData();
      console.log("error occured in post method");
    } catch (error) {
      console.error("Error during POST request:", error);
      alert("unable to create record");
    }
  };
  // const handleAccessClick = async (id) => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await axios.put(
  //       `http://63.142.251.13:4000/superadmin/updateAccess/${id}`, // Pass row._id in the URL
  //       {
  //         fullAccess: false, // Payload
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Token for authorization
  //         },
  //       }
  //     );
  //     alert("access given");
  //     console.log("Access updated successfully", response.data);
  //   } catch (error) {
  //     console.error("Error updating access", error);
  //     alert("access false");
  //   }
  // };
  const handleAccessClick = async (id, currentFullAccess) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://63.142.251.13:4000/superadmin/updateAccess/${id}`, // Pass row._id in the URL
        {
          fullAccess: !currentFullAccess, // Toggle fullAccess based on current value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token for authorization
          },
        }
      );
      alert(
        currentFullAccess
          ? "Access revoked (Less Access)"
          : "Access granted (Full Access)"
      );
      console.log("Access updated successfully", response.data);
    } catch (error) {
      console.error("Error updating access", error);
      alert(
        currentFullAccess
          ? "Error revoking full access"
          : "Error granting full access"
      );
    }
    fetchData();
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>School Master</h1>
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
          {/* <Button
            variant="contained"
            onClick={() => setImportModalOpen(true)}
            sx={{ backgroundColor: "rgb(255, 165, 0)", marginRight: "10px" }}
            startIcon={<CloudUploadIcon />}
          >
            Import
          </Button> */}
          <Export orangeBtn={orangeBtn} columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"SCHOOL MASTER"} pdfFilename={"SchoolMaster.pdf"} excelFilename={"SchoolMaster.xlsx"}/>

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
                      Access
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
                        <img src="emptyicon.png" alt="" />
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
                          key={row._id}
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
                                    fontSize: "smaller",
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
                            {/* Pass row._id when calling handleAccessClick */}
                            <Button
                              onClick={() =>
                                handleAccessClick(row._id, row.fullAccess)
                              }
                              variant="contained"
                              color={row.fullAccess ? "success" : "error"} // Change color based on access status
                              size="small"
                              style={{
                                width: "160px", // Set fixed width for button
                                height: "40px", // Set fixed height for button
                                textTransform: "none", // Prevent button text from being uppercase
                                fontWeight: "bold",
                                whiteSpace: "nowrap", // Prevent text from wrapping
                                overflow: "hidden", // Hide overflow text if it's too long
                                textOverflow: "ellipsis", // Show ellipsis if text overflows
                              }}
                            >
                              {row.fullAccess
                                ? "Give Limited App access"
                                : "Give full App access"}
                            </Button>
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
              <h2 style={{ flexGrow: 1 }}>Edit Row</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {COLUMNS().map((col) => (
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
              <h2 style={{ flexGrow: 1 }}>Add School Master</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {COLUMNS().map((col) => (
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
                      {col.icon} {/* Add Face6Icon in the input field */}
                    </InputAdornment>
                  ),
                }}
              />
            ))}
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

export default SchoolMaster;
