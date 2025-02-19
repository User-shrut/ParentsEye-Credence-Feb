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

export const Route = () => {
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
    const options = devices.map((device) => ({
      value: device.deviceId,
      label: device.deviceName,
    }));
 


  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
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
    const url = `${process.env.REACT_APP_ROCKETSALES_API}/reports/route?from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&deviceId=${encodeURIComponent(selectedDevice)}`;
    
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
    const username = "schoolmaster";
    const password = "123456";
    const token = btoa(`${username}:${password}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
      responseType: 'blob', // Downloading as binary data
    });

    // Log the content type of the response
    console.log('Content-Type:', response.headers['content-type']);

    const deviceIdToNameMap = devices.reduce((acc, device) => {
      acc[device.deviceId] = device.deviceName; // Use device.id and device.name as key-value pair
      return acc;
    }, {});

    // Handle JSON response
    if (response.headers['content-type'] === 'application/json') {
      const text = await response.data.text(); // Convert Blob to text
      console.log('JSON Response:', text); // Log JSON response
      const jsonResponse = JSON.parse(text); // Parse JSON

      // Process the JSON response
      console.log('Processed JSON Data:', jsonResponse);

      // Example: Set filtered rows and total responses from JSON data
      setFilteredRows(jsonResponse.map(data => ({
        deviceId: data.deviceId || 'N/A',
        deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
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
        odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
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
        adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
      })));
      setOriginalRows(jsonResponse.map(data => ({
        deviceId: data.deviceId || 'N/A',
        deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
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
        odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
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
        adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
      })));
      setTotalResponses(jsonResponse.length);

    } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Handle Excel response
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'report.xlsx'); // Save the file to the user's system

      // Process the file to extract data
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const reportWorkbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = reportWorkbook.SheetNames[0];
        const reportWorksheet = reportWorkbook.Sheets[firstSheetName];
        
        // Convert worksheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(reportWorksheet);

        console.log('Extracted JSON Data from Excel:', jsonData);

        // Process the data
        const processedEvents = jsonData.map(data => ({
          deviceId: data.deviceId,
          deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
          eventTime: new Date(data.fixTime).toLocaleString(),
          latitude: `${data.latitude.toFixed(6)}°`,
          longitude: `${data.longitude.toFixed(6)}°`,
          speed: `${data.speed.toFixed(2)} mph`,
          address: data.address || 'Show Address',
          course: data.course > 0 ? '↑' : '↓',
          altitude: `${data.altitude.toFixed(2)} m`,
          accuracy: `${data.accuracy.toFixed(2)}`,
          valid: data.valid ? 'Yes' : 'No',
          protocol: data.protocol,
          deviceTime: new Date(data.deviceTime).toLocaleString(),
          serverTime: new Date(data.serverTime).toLocaleString(),
          geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
          satellites: data.attributes.sat || '',
          RSSI: data.attributes.rssi || '',
          odometer: `${(data.attributes.odometer || 0).toFixed(2)} mi`,
          batteryLevel: data.attributes.batteryLevel || '',
          ignition: data.attributes.ignition ? 'Yes' : 'No',
          charge: data.attributes.charge ? 'Yes' : 'No',
          archive: data.attributes.archive ? 'Yes' : 'No',
          distance: `${(data.attributes.distance || 0).toFixed(2)} mi`,
          totalDistance: `${(data.attributes.totalDistance || 0).toFixed(2)} mi`,
          motion: data.attributes.motion ? 'Yes' : 'No',
          blocked: data.attributes.blocked ? 'Yes' : 'No',
          alarm1Status: data.attributes.alarm1Status || '',
          otherStatus: data.attributes.otherStatus || '',
          alarm2Status: data.attributes.alarm2Status || '',
          engineStatus: data.attributes.engineStatus ? 'On' : 'Off',
          adc1: data.attributes.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : ''
        }));

        console.log('Processed Events:', processedEvents);

        setFilteredRows(
          processedEvents.map((row) => ({ ...row, isSelected: false }))
        );
        setOriginalRows(processedEvents.map((row) => ({ ...row, isSelected: false })));
        
        setTotalResponses(processedEvents.length);

        // Optionally export the processed data back to an Excel file
        const outputWorksheet = XLSX.utils.json_to_sheet(processedEvents);
        const outputWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Processed Report');

        // Trigger file download
        XLSX.writeFile(outputWorkbook, 'processed_report.xlsx');
      };

      reader.readAsArrayBuffer(blob); // Read the Blob as an ArrayBuffer
    } else {
      throw new Error('Unexpected content type: ' + response.headers['content-type']);
    }
  } catch (error) {
    console.error('Error fetching the report:', error);
  
  } finally {
    setLoading(false);
  }
};



const handleChange = (selectedOption) => {
  setSelectedDevice(selectedOption ? selectedOption.value : null);
};
const [searchText, setSearchText] = useState("");
const filteredDevices = Array.isArray(devices)
  ? devices.filter((device) =>
      device.deviceName.toLowerCase().includes(searchText.toLowerCase())
    )
  : [];

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
       Route 
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

<Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"ROUTE REPORT"} pdfFilename={"RouteReport.pdf"} excelFilename={"RouteReport.xlsx"}/>

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
    placeholder={loadingdevice?"Loading devices...":"select Device"}
    isClearable
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


