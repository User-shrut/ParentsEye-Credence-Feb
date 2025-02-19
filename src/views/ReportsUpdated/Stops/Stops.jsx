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
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import Select from "react-select";
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

export const Stops = () => {
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
  const username = "schoolmaster";
  const password = "123456";
  const role=localStorage.getItem("role");
  const token=localStorage.getItem("token");
const[deviceloader,setdeviceloader]=useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData(filterText);
  }, [filterText]);

 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value;
    setFilterText(text);
  };

 
  const filterData = (text) => {
    // Apply text-based filtering
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
      setdeviceloader(false);
    };
  
  
  fetchDevices();
   
  }, [role]);
  


  
  const [selectedDevice, setSelectedDevice] = useState('');
 
  const [apiUrl, setApiUrl] = useState('');
  
  const handleShowClick = () => {
    const formattedStartDate = formatToUTC(startDate);
    const formattedEndDate = formatToUTC(endDate);

    if (!formattedStartDate || !formattedEndDate || !selectedDevice) {
      alert('Please fill all fields');
      return;
    }

    // Construct the API URL
    const url = `${process.env.REACT_APP_ROCKETSALES_API}/reports/route?deviceId=${encodeURIComponent(selectedDevice)}&from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}`;
    
    setApiUrl(url); // Update the state with the generated URL
    fetchData(url); // Call fetchData with the generated URL
  };
  const formatToUTC = (localDateTime) => {
    if (!localDateTime) return '';
    const localDate = new Date(localDateTime);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  };
  

const parseDate = (dateString) => {
  const [datePart, timePart] = dateString.split(', ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [time, ampm] = timePart.split(' ');
  const [hour, minute, second] = time.split(':').map(Number);

  // Convert hour to 24-hour format
  let hours = hour;
  if (ampm === 'pm' && hours < 12) hours += 12; // Convert PM to 24-hour format
  if (ampm === 'am' && hours === 12) hours = 0; // Convert 12 AM to 00 hours

  return new Date(year, month - 1, day, hours, minute, second);
};

const processGroupedEvents = (groupedEvents) => {
  const processedGroupedEvents = groupedEvents.map(group => {
    if (group.length === 0) return null; // Skip empty groups
    
    // Get the first and last object in the group
    const startEvent = group[0];
    const endEvent = group[group.length - 1];
    
    // Extract the necessary data from the start and end events
    const startLatitude = startEvent.latitude || 'N/A';
    const startLongitude = startEvent.longitude || 'N/A';
    const endLatitude = endEvent.latitude || 'N/A';
    const endLongitude = endEvent.longitude || 'N/A';
    
    const startOdometer = startEvent.odometer || 'N/A';
    const endOdometer = endEvent.odometer || 'N/A';
    
    // Manually parse the server times
    const startTime = parseDate(startEvent.serverTime);
    const endTime = parseDate(endEvent.serverTime);
    
    // Check for valid Date objects
    if (isNaN(startTime) || isNaN(endTime)) {
      console.error('Invalid start or end time:', startEvent.serverTime, endEvent.serverTime);
      return null;
    }
    
    // Calculate stop duration in minutes (convert milliseconds to minutes)
    const stopDuration = Math.abs((endTime - startTime) / 60000); // Difference in minutes
    
    // Extract the device name from the first event in the group
    const deviceName = startEvent.deviceName || 'Unknown Device';
  
    // Create the new object for the group with device name included
    const groupSummary = {
      deviceName,
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      startOdometer,
      endOdometer,
      startTime: startTime.toLocaleString(),
      endTime: endTime.toLocaleString(),
      stopDuration: stopDuration.toFixed(2), // Rounded to 2 decimal places
    };
    
    return groupSummary;
  }).filter(Boolean); // Remove any null values from the array
  
  return processedGroupedEvents;
};

  const fetchData = async (url) => {
    console.log('Fetching report...');
    setLoading(true);
    
    try {
     
      const token = btoa(`${username}:${password}`);
    
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${token}`,
        },
        responseType: 'blob', // Downloading as binary data
      });
    
      console.log('Content-Type:', response.headers['content-type']);
    
      const deviceIdToNameMap = devices.reduce((acc, device) => {
        acc[device.deviceId] = device.deviceName;
        return acc;
      }, {});
    
      let isIgnitionOffFound = false;
      let currentGroup = [];
      let groupedEvents = [];
    
      // Handle JSON response
      if (response.headers['content-type'] === 'application/json') {
        const text = await response.data.text(); // Convert Blob to text
        console.log('JSON Response:', text); // Log JSON response
        const jsonResponse = JSON.parse(text); // Parse JSON
    
        console.log('Processed JSON Data:', jsonResponse);
    
        const processedEvents = jsonResponse.map((data) => {
          if (data.attributes?.ignition === false && !isIgnitionOffFound) {
            isIgnitionOffFound = true;
            currentGroup = [
              {
                deviceId: data.deviceId || 'N/A',
                deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
                eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
                latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
                longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
                speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
                address: data.address || 'Show Address',
                course: data.course > 0 ? '↑' : '↓',
                altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
                accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
                valid: data.valid ? 'Yes' : 'No',
                protocol: data.protocol || 'N/A',
                deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
                serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
                fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
                geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
                satellites: data.attributes?.sat || 'N/A',
                RSSI: data.attributes?.rssi || 'N/A',
                odometer: data.attributes?.odometer|| 'N/A',
                // odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
                batteryLevel: data.attributes?.batteryLevel || 'N/A',
                ignition: data.attributes?.ignition ? 'Yes' : 'No',
                charge: data.attributes?.charge ? 'Yes' : 'No',
                archive: data.attributes?.archive ? 'Yes' : 'No',
                distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
                totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
                motion: data.attributes?.motion ? 'Yes' : 'No',
                blocked: data.attributes?.blocked ? 'Yes' : 'No',
                alarm1Status: data.attributes?.alarm1Status || 'N/A',
                otherStatus: data.attributes?.otherStatus || 'N/A',
                alarm2Status: data.attributes?.alarm2Status || 'N/A',
                engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
                adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
              }
            ];
            return null;
          }
    
          if (isIgnitionOffFound) {
            currentGroup.push({
              deviceId: data.deviceId || 'N/A',
              deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
              eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
              latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
              longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
              speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
              address: data.address || 'Show Address',
              course: data.course > 0 ? '↑' : '↓',
              altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
              accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
              valid: data.valid ? 'Yes' : 'No',
              protocol: data.protocol || 'N/A',
              deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
              serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
              fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
              geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
              satellites: data.attributes?.sat || 'N/A',
              RSSI: data.attributes?.rssi || 'N/A',
              odometer: data.attributes?.odometer|| 'N/A',
              batteryLevel: data.attributes?.batteryLevel || 'N/A',
              ignition: data.attributes?.ignition ? 'Yes' : 'No',
              charge: data.attributes?.charge ? 'Yes' : 'No',
              archive: data.attributes?.archive ? 'Yes' : 'No',
              distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
              totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
              motion: data.attributes?.motion ? 'Yes' : 'No',
              blocked: data.attributes?.blocked ? 'Yes' : 'No',
              alarm1Status: data.attributes?.alarm1Status || 'N/A',
              otherStatus: data.attributes?.otherStatus || 'N/A',
              alarm2Status: data.attributes?.alarm2Status || 'N/A',
              engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
              adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
            });
    
            if (data.attributes?.ignition === true) {
              groupedEvents.push(currentGroup);
              currentGroup = [];
              isIgnitionOffFound = false;
            }
          }
    
          return null;
        }).filter(Boolean); 
    
        if (currentGroup.length > 0) {
          groupedEvents.push(currentGroup);
        }
    
        // Process each group and create a summary object
        const finalProcessedEvents = processGroupedEvents(groupedEvents);
        console.log('Final Processed Events:', finalProcessedEvents);
    
        // Update the state with the processed data
        console.log('groupedEvents:',groupedEvents)
        setFilteredRows(finalProcessedEvents);
        setOriginalRows(finalProcessedEvents); 
        setTotalResponses(finalProcessedEvents.length);
      } else {
        throw new Error('Unexpected content type: ' + response.headers['content-type']);
      }
    } catch (error) {
      console.error('Error fetching the report:', error);
      // alert("Please select device and date");
    } finally {
      setLoading(false);
    }
  };
  
const options = devices.map((device) => ({
  value: device.deviceId,
  label: device.deviceName,
}));

const handleChange = (selectedOption) => {
  setSelectedDevice(selectedOption ? selectedOption.value : null);
};

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
       Stops 
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
         
<Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"STOPS REPORT"} pdfFilename={"StopsReport.pdf"} excelFilename={"StopsReport.xlsx"}/>

        </div>
       
        <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <div
  style={{
    width: "250px",
    position: "relative",
    zIndex: "10",
    border: "1px solid #000", // Add a black border
    
  }}
>
  <Select
    options={options}
    value={options.find((option) => option.value === selectedDevice) || null}
    onChange={handleChange}
    placeholder={deviceloader?"Loading Devices...":"Select Device"}
    isClearable
    isLoading={deviceloader}
    styles={{
      control: (provided) => ({
        ...provided,
        border: "none", // Remove react-select's default border if necessary
        boxShadow: "none", // Remove default focus outline
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "#000", // Set the dropdown arrow to black
      }),
      clearIndicator: (provided) => ({
        ...provided,
        color: "#000", // Set the clear icon to black
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
                maxHeight: 520,
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


