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
import { saveAs } from 'file-saver'; // Save file to the user's machine
// import * as XLSX from 'xlsx'; // To process and convert the excel file to JSON
//import { TextField } from '@mui/material';
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import Select from "react-select";
import Export from "../../Export";
import { AllInbox } from "@mui/icons-material";
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

export const GeofenceReport = () => {
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
  const role=localStorage.getItem('role');
  const username = "schoolmaster";
  const password = "123456";
 const[loadingdevice,setloadingdevice]=useState(true);


  

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData(filterText);
  }, [filterText]);

 
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
    // let dataToFilter = originalRows;
  
    // // Apply date filter
    // if (startDate && endDate) {
    //   dataToFilter = dataToFilter.filter((row) => {
    //     const rowDate = new Date(row.dateOfBirth); // Adjust based on your date field
    //     return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
    //   });
    // }
  
    // // Apply text filter
    // if (text === "") {
    //   setFilteredRows(dataToFilter); // Reset to full filtered data
    // } else {
    //   const filteredData = dataToFilter
    //     .filter((row) =>
    //       Object.values(row).some(
    //         (val) =>
    //           typeof val === "string" &&
    //           val.toLowerCase().includes(text.toLowerCase())
    //       )
    //     )
    //     .map((row) => ({ ...row, isSelected: false }));
      
    //   setFilteredRows(filteredData); // Update filtered rows
    // }
    if (text === "") {
      // If no text is provided, reset to original rows
      setFilteredRows(originalRows.map(row => ({ ...row, isSelected: false })));
    } else {
      // Filter based on text
      const filteredData = originalRows
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
   
    setFormData({});
    setModalOpen(false);
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

 





  const [devices, setDevices] = useState([]);
  const [mydevices, mysetDevices] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
  useEffect(() => {
   
  
    const fetchDevices = async (myDevices) => {
      try {
        let response;
        const token = localStorage.getItem('token');
  
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
          response = await axios.get(`${process.env.REACT_APP_USERBRANCH}/getdevicebranchgroupuser`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
  
        if (response?.data) {
          const allData = role == 1
            ? response.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.devices) ? branch.devices : []
                )
              )
            : role == 2
            ? response.data.branches.flatMap((branch) =>
                Array.isArray(branch.devices) ? branch.devices : []
              )
            : role == 3
            ? response.data.devices
            : role == 4
            ? response.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.devices) ? branch.devices : []
                )
              )
            : [];
  
          // Combine the data from myfetchDevices and fetchDevices
          
  
          setDevices(allData);
          console.log('Merged Devices:', allData);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
      setloadingdevice(false);
    };
  
  
  fetchDevices();
   
  }, [role]);
  
    // Transform devices into options for React-Select
    // const options = devices.map((device) => ({
    //   value: device.deviceId,
    //   label: device.deviceName,
    // }));
 
    const handleChange = (selectedOptions) => {
      if (selectedOptions.some(option => option.value === "select_all")) {
        // When "Select All" is selected, display only the "Select All" label
        setSelectedDevice([{
          value: "select_all",
          label: "Select All", // Only display this label when "Select All" is selected
        }]);
      } else {
        // Otherwise, update with the selected devices
        setSelectedDevice(selectedOptions || []);
      }
    };
  
    // Options for the select dropdown
    const options = [
      { value: "select_all", label: "Select All" }, // One "Select All" option at the top
      ...devices.map((device) => ({
        value: device.deviceId,
        label: device.deviceName,
      })),
    ];
    
  
  
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  const [selectedDevice, setSelectedDevice] = useState([]);
 
  const [apiUrl, setApiUrl] = useState('');
  
  // const deviceIds = selectedDevice.map((device) => device.value).join(',');
  const deviceIds = selectedDevice.some(option => option.value === "select_all")
  ? devices.map(device => device.deviceId).join(',') // Get all device IDs if "Select All" is selected
  : selectedDevice.map(option => option.value); // Otherwise, get selected device IDs
  
  const handleShowClick = () => {
    const formattedStartDate = formatToUTC(startDate);
    const formattedEndDate = formatToUTC(endDate);

    if (!formattedStartDate || !formattedEndDate || !selectedDevice) {
      alert('Please fill all fields');
      return;
    }

    // Construct the API URL
    const url = `https://parentseyereplica.onrender.com/notificationalerthistory?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}&deviceIds=${encodeURIComponent(deviceIds)}`;
    
    setApiUrl(url); // Update the state with the generated URL
    fetchData(url); // Call fetchData with the generated URL
  };
  const formatToUTC = (localDateTime) => {
    if (!localDateTime) return '';
    const localDate = new Date(localDateTime);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  };
  
  


const fetchData = async (url) => {
  console.log('Fetching report...');
  setLoading(true);

  try {
   
   const token= localStorage.getItem("token");

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    
    });
console.log("mydata of geofence",response.data)
    // Log the content type of the response
    // const allData=response.data;
    if (response?.data) {
      const allData =response.data.data.map((item)=>({
        ...item,
        createdAt: formatDateTimeAMPM(item.createdAt),
      }))
      setFilteredRows(
        allData.map((row) => ({ ...row, isSelected: false }))
      );
      setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
      setTotalResponses(allData.length);
    }
          
    // const reversedData = allData.reverse();
  
  } catch (error) {
    console.error('Error fetching the report:', error);
  
  } finally {
    setLoading(false);
  }
};
function formatDateTimeAMPM(dateString) {
  const d = new Date(dateString); // Use the date as it is
  
  // Extract day, month, and year
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  
  // Extract hours and minutes in UTC
  let hours = d.getUTCHours();
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const seconds = String(d.getUTCSeconds()).padStart(2, "0");
  
  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12 for midnight
  
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}


// Example usage



function parseDate(dateString) {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}


// const handleChange = (selectedOption) => {
//   setSelectedDevice(selectedOption ? selectedOption.value : null);
// };
// const handleChange = (selectedOptions) => {
//   setSelectedDevice(selectedOptions || []); // Handle empty selection
// };
const [searchText, setSearchText] = useState("");
const filteredDevices = Array.isArray(devices)
  ? devices.filter((device) =>
      device.deviceName.toLowerCase().includes(searchText.toLowerCase())
    )
  : [];
  const isSelectAllSelected = selectedDevice.length === 1 && selectedDevice[0].value === "select_all";
 
  const calculateWidth = (text) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '12px Arial'; // Match the font used in the dropdown
    const width = context.measureText(text).width;
    return width + 20; // Add some padding
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
       Geofence Report 
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

<Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"GeofenceReport REPORT"} pdfFilename={"GeofenceReportReport.pdf"} excelFilename={"GeofenceReportReport.xlsx"}/>

        </div>
       
     <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      {/* <div
  style={{
    width: "250px",
    position: "relative",
    zIndex: "10",
    border: "1px solid #000", // Add a black border
    
  }}
>
<Select
      options={options}
      value={selectedDevice} // Array of selected options
      onChange={handleChange}
      isMulti // Enables multi-select
      placeholder={loadingdevice ? 'Loading devices...' : 'Select Devices'}
      isClearable
      closeMenuOnSelect={false}  
      styles={{
        control: (provided) => ({
          ...provided,
          border: 'none',
          boxShadow: 'none',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: '#000',
        }),
        clearIndicator: (provided) => ({
          ...provided,
          color: '#000',
        }),
      }}
    />
</div> */}
     {/* <div
      style={{
        width: '250px',
        position: 'relative',
        border: '1px solid #000',
        zIndex: 1000,
        backgroundColor: '#fff',
      }}
    >
      <Select
        options={options}
        value={selectedDevice}
        onChange={handleChange}
        isMulti
        placeholder="Select Devices"
        isClearable
        closeMenuOnSelect={false}
        hideSelectedOptions={false} // Keep selected options in the dropdown
        styles={{
          control: (provided) => ({
            ...provided,
            border: 'none',
            boxShadow: 'none',
            minHeight: '45px',
            maxHeight: '60px',
            overflowX: 'auto',
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            width: '100%',
          }),
          valueContainer: (provided) => ({
            ...provided,
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'transparent',
            color: '#000',
            minWidth:'130px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding:'0px'
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: '#000',
            fontSize: '14px',
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: '#888',
            ':hover': {
              color: '#000',
            },
          }),
          option: (provided, { isSelected }) => ({
            ...provided,
            backgroundColor: isSelected ? '#ADD8E6' : '#fff', // Grey background for selected items
            color: '#000',
            // fontWeight: isSelected ? 'bold' : 'normal', // Bold text for selected devices
            ':hover': {
              backgroundColor: '#ddd',
            },
          }),
        }}
      />
    </div> */}
      <div
      style={{
        width: '250px',
        position: 'relative',
        border: '1px solid #000',
        zIndex: 1000,
        backgroundColor: '#fff',
      }}
    >
      <Select
        options={options}
        value={selectedDevice}
        onChange={handleChange}
        isMulti
        placeholder="Select Devices"
        isClearable
        closeMenuOnSelect={false}
        hideSelectedOptions={false} // Keep selected options in the dropdown
        styles={{
          control: (provided) => ({
            ...provided,
            border: 'none',
            boxShadow: 'none',
            minHeight: '45px',
            maxHeight: '60px',
            overflowX: 'auto',
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            width: '100%',
          }),
          valueContainer: (provided) => ({
            ...provided,
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
          }),
          multiValue: (provided, { data }) => ({
            ...provided,
            backgroundColor: 'transparent',
            color: '#000',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: `${calculateWidth(data.label)}px`,
            // padding: '0px',
            fontSize: "12px",
            padding: '0px 0px',
            paddingLeft:'0px',
   
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: '#000',
            fontSize: '12px',
             padding: '0px 0px',
             paddingLeft:'0px',
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: '#888',
            ':hover': {
              color: '#000',
            },
          }),
          option: (provided, { isSelected }) => ({
            ...provided,
            backgroundColor: isSelected ? '#ADD8E6' : '#fff', // Light blue background for selected items
            color: '#000',
            ':hover': {
              backgroundColor: '#ddd',
            },
          }),
        }}
      />
    </div>
      <div style={{ marginRight: "10px", padding: "5px" }}>
        <label htmlFor="start-date">Start Date & Time:</label>
        <input
          id="start-date"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        
        <label htmlFor="end-date">End Date & Time:</label>
        <input
          id="end-date"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: "5px" }}
        />
      </div>

      <button
        onClick={handleShowClick}
        style={{
          padding: "5px 10px",
        }}
      >
        Show
      </button>

      {/* {apiUrl && (
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="api-url">Generated API URL:</label>
          <textarea
            id="api-url"
            rows="3"
            value={apiUrl}
            readOnly
            style={{ width: '100%', padding: '5px' }}
          ></textarea>
        </div>
      )} */}
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
                maxHeight: 500,
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
          {COLUMNS()
            .filter((col) => columnVisibility[col.accessor])
            .map((column) => (
              <TableCell
                key={column.accessor}
                align={column.align || 'left'}
                style={{
                  minWidth: column.minWidth || '100px',
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
                key={row.deviceId + index} // Ensure uniqueness for the key
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
              
                  {COLUMNS()
  .filter((col) => columnVisibility[col.accessor])
  .map((column) => {
    // Ensure column.accessor is a string before calling split
    const accessor = typeof column.accessor === 'string' ? column.accessor : '';
    const value = accessor.split('.').reduce((acc, part) => acc && acc[part], row);

    return (
      <TableCell
        key={accessor}
        align={column.align || 'left'}
        style={{
          borderRight: "1px solid #e0e0e0",
          paddingTop: "4px",
          paddingBottom: "4px",
          borderBottom: "none",
          backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
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


