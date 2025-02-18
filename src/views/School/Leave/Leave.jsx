

import React, { useState, useEffect, useContext } from "react";
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
import { Token } from "@mui/icons-material";
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import Export from "./ExportLeave";

import {
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

export const Leave = () => {
  const { settotalLeaveRequest } = useContext(TotalResponsesContext); // Get the context value

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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalRows, setOriginalRows] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const role = localStorage.getItem("role");

 
  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;
  
      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/pending-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/pending-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/pending-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else if (role == 4) {
        response = await axios.get(
          `http://63.142.251.13:4000/branchgroupuser/pendingrequests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
  
      console.log("fetch data", response.data); // Log the entire response data
  
      if (response.data) {
        // Parse the data differently for each role
        const allData =
          role == 1
            ? response?.data?.data?.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.requests) && branch.requests.length > 0
                    ? branch.requests
                    : []
                )
              )
            : role == 2
            ? response?.data?.branches.flatMap((branch) =>
                Array.isArray(branch.requests) && branch.requests.length > 0
                  ? branch.requests
                  : []
              )
           :role==4
           ?response.data.data.flatMap((leave)=>(
            Array.isArray(leave.requests)&&leave.requests.length>0?
            leave.requests.flatMap((child)=>(
              {
                ...child,
                childName:child.childId.childName,
                parentName:child.parentId.parentName,
                email:child.parentId.email,
                deviceId:child.childId.deviceId,
                deviceName:child.childId.deviceName,
                schoolName:child.schoolId.schoolName,
                branchName:leave.branchName,
                startDate:child.startDate?formatDate(child.startDate):'',
                endDate:child.endDate?formatDate(child.endDate):'',
                requestDate:child.requestDate?formatDate(child.requestDate):'',
              }
            ))
            :[]
           ))
            :role == 3
            ? Array.isArray(response.data.requests) && response.data.requests.length > 0
              ? response.data.requests
              : []
            : response.data.requests;
  
        console.log("Parsed allData:", allData);
  
        // Apply local date filtering if dates are provided
        const filteredData =
          startDate || endDate
            ? allData.filter((row) => {
                const registrationDate = parseDate(row.requestDate);
                const start = parseDate(startDate);
                const end = parseDate(endDate);
  
                return (
                  (!startDate || registrationDate >= start) &&
                  (!endDate || registrationDate <= end)
                );
              })
            : allData; // If no date range, use all data
  
        const reversedData = filteredData.reverse();
  
        console.log(`Data fetched between ${startDate} and ${endDate}:`);
        console.log(filteredData);
  
        setFilteredRows(
          reversedData.map((row) => ({ ...row, isSelected: false }))
        );
        setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
        settotalLeaveRequest(reversedData.length);
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
function formatDate(date){
const d=new Date(date);
const day=String(d.getDate()).padStart(2,"0");
const month=String(d.getMonth()+1).padStart(2,"0");
const year=d.getFullYear();
return `${day}-${month}-${year}`;
}

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

 

  

 
  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl =
        role == 1
          ? `${process.env.REACT_APP_SUPER_ADMIN_API}/review-request/${requestId}`
          :role==2
          ? `${process.env.REACT_APP_SCHOOL_API}/review-request/${requestId}`
         :role==3
          ? `${process.env.REACT_APP_BRANCH_API}/review-request/${requestId}`
          :`${process.env.REACT_APP_USERBRANCH}/changestatusofleaverequest/${requestId}`
      const response = await axios.post(
        apiUrl,
        {
          statusOfRequest: "approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your token
          },
        }
      );
      if (response.status === 200) {
        setSnackbarOpen(true);
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl =
        role == 1
          ? `${process.env.REACT_APP_SUPER_ADMIN_API}/review-request/${requestId}`
          :role==2
          ? `${process.env.REACT_APP_SCHOOL_API}/review-request/${requestId}`
          : role==3
          ?`${process.env.REACT_APP_BRANCH_API}/review-request/${requestId}`
          :`${process.env.REACT_APP_USERBRANCH}/changestatusofleaverequest/${requestId}`
      const response = await axios.post(
        apiUrl,
        {
          statusOfRequest: "denied",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your token
          },
        }
      );
      if (response.status === 200) {
        setSnackbarOpen(true);
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>Leave Detail </h1>
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

  <Export filteredRows={filteredRows} columnVisibility={columnVisibility} COLUMNS={COLUMNS}/>

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
                    {/* Heading for the first button column */}
                    {/* <TableCell style={{ borderRight: '1px solid #e0e0e0', borderBottom:'1px solid black' }}>
Approve      </TableCell>
    {/* Heading for the second button column */}
                    {/* <TableCell style={{ borderRight: '1px solid #e0e0e0', borderBottom:'1px solid black' }}>       Denied      </TableCell>  */}

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
                  {sortedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                            fontSize: "smaller", // White for even rows, light grey for odd rows
                          }}
                        >
                          <Button
                            onClick={() => handleApprove(role==4?`${row._id}`:`${row.requestId}`)}
                            color="primary"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(role==4?`${row._id}`:`${row.requestId}`)}
                            color="secondary"
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
