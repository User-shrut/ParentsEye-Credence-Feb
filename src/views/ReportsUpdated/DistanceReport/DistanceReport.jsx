


import React, { useState, useEffect, useContext, Component } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
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
// import { COLUMNS } from "./columns";
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
import Export from "./ExportDistanceReport"
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

export const DistanceReport = () => {
  const [dateColumn, setDateColumn] = useState(null); // Store the date range column header
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateColumns, setDateColumns] = useState([]); // Store the dynamically generated date columns

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth is zero-based, so we add 1
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`; // Formats as DD/MM/YYYY
  };
  
  const generateDateRange = (start, end) => {
    let startDate = new Date(start);
    let endDate = new Date(end);
    const dateArray = [];

    while (startDate <= endDate) {
      // Push the formatted date (MM-DD-YYYY) into the array
      dateArray.push(formatDate(startDate.toISOString()));
      // Increment the date
      startDate.setDate(startDate.getDate() + 1);
    }
    return dateArray;
  };
  const handleDateChange = () => {
    if (startDate && endDate) {
      const dateRange = generateDateRange(startDate, endDate);
      setDateColumns(dateRange); // Set the dynamic date columns
    }
  };

  useEffect(() => {
    handleDateChange(); // Update columns when dates are selected or changed
  }, [startDate, endDate]);
 


const COLUMNS = () => {
  const columns = [
    {
      Header: "Device Name",
      accessor: "deviceName", // Static column for deviceName
    },
  ];

  // Collect all unique dates from the data
  const dateColumns = [];
  filteredRows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "deviceName" && !dateColumns.includes(key)) {
        dateColumns.push(key); // Add the date as a column header if it doesn't already exist
      }
    });
  });
  const toSortableDate = (date) => {
    const [day, month, year] = date.split("/").map(Number);
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  };

  // Sort the dates using the sortable format
  dateColumns.sort((a, b) => {
    return new Date(toSortableDate(a)) - new Date(toSortableDate(b));
  });

  // Create columns for each date
  dateColumns.forEach((date) => {
    columns.push({
      Header: date, // Set the column header to the date
      accessor: `date_${date.replace(/\//g, '-')}`, // Use date as accessor (e.g., date_02-12-2024)
    });
  });

  return columns; // Return the columns array with dynamic date columns
};

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
 
  const [importData, setImportData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [originalRows, setOriginalRows] = useState([]);
  const token=localStorage.getItem("token");
  const role=localStorage.getItem("role");
  const username="schoolmaster";
  const password="123456";
  const[selectdevice,setdeviceselect]=useState(true);
  const[selectgroup,setselectgroup]=useState(true);


  

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



  

  // const handleExport = () => {
  //   const dataToExport = filteredRows.map((row) => {
  //     const { isSelected, ...rowData } = row;
  //     return rowData;
  //   });
  //   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   XLSX.writeFile(workbook, "DistanceReport.xlsx");
  // };

  

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

 





  const [mydevices, mysetDevices] = useState([]);
  const [devices, setDevices] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_ROCKETSALES_API;
  console.log("API URL from env:", apiUrl);  // Verify it's correct
  
    const myfetchDevices = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROCKETSALES_API}/devices`, {
          headers: {
            Authorization: 'Basic ' + btoa(`${username}:${password}`),
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("myyyyyyy",response)
        const data = await response.json();
        mysetDevices(data);
        console.log(data);
        // Ensure that data is an array before proceeding
        if (Array.isArray(data)) {
          return data; // Return the fetched devices
        } else {
          console.error('Fetched data is not an array:', data);
          return [];
        }
      } catch (err) {
        console.error('Error fetching devices:', err);
        return [];
      }
    };
  
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
          const mergedData = allData.map((device) => {
            const matchingDevice = myDevices.find((d) => String(d.id) === String(device.deviceId));
            return {
              ...device,
              groupId: matchingDevice ? matchingDevice.groupId : null,
            };
          });
  
          setDevices(mergedData);
          console.log('Merged Devices:', mergedData);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
      setdeviceselect(false);
    };
  
    const loadData = async () => {
      setLoading(true);
      const myDevices = await myfetchDevices();
      await fetchDevices(myDevices);
    };
  
    loadData();
  }, [role]);
   const [groups, setGroups] = useState([]);
const [mygroups, mysetGroups] = useState([]);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROCKETSALES_API}/groups`, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`) // Replace with actual credentials
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        mysetGroups(data); // Assuming the API returns { groups: [...] }
        console.log("my group data",data);
      } catch (error) {
        setError(error.message);
      }
      setselectgroup(false)
    };

    fetchGroups();
  }, []);
 
useEffect(() => {
  // Merge devices and groups when both are available
  if (devices.length > 0 && mygroups.length > 0) {
    const groupedData = {};

    // Iterate through the devices and group them by groupId
    devices.forEach((device) => {
      const matchingGroup = mygroups.find((group) => group.id === device.groupId);
      
      if (matchingGroup) {
        if (!groupedData[matchingGroup.name]) {
          groupedData[matchingGroup.name] = {
            id: device.groupId,
            name: matchingGroup.name,
            devices: [],
          };
        }
        groupedData[matchingGroup.name].devices.push({
          deviceId: device.deviceId,
          actualDeviceId: device.actualDeviceId,
          deviceName: device.deviceName,
        });
      }
    });

    // Convert the grouped data to an array
    const combinedData = Object.values(groupedData);

    setGroups(combinedData);
    console.log('Grouped Data:', combinedData);
  }
}, [devices, mygroups]);

 
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  const handleShowClick = () => {
  const formattedStartDate = formatToUTC(startDate);
  const formattedEndDate = formatToUTC(endDate);

  if (!formattedStartDate || !formattedEndDate || !selectedDevice || !selectedNotification) {
    alert('Please fill all fields');
    return;
  }

  // Construct the API URL
  const url = `
${process.env.REACT_APP_ROCKETSALES_API}/reports/summary?from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&daily=${encodeURIComponent(daily)}&deviceId=${encodeURIComponent(selectedDevice)}&groupId=${encodeURIComponent(selectedGroup)}`;
  
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
  
    const token = btoa(`${username}:${password}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
      responseType: 'blob', // Downloading as binary data
    });

    // Log the content type of the response
    console.log('Content-Type:', response.headers['content-type']);

    // Handle JSON response
    if (response.headers['content-type'] === 'application/json') {
      const text = await response.data.text(); // Convert Blob to text
      console.log('JSON Response:', text); // Log JSON response
      const jsonResponse = JSON.parse(text); // Parse JSON

      // Process the JSON data for events
      const processedEvents = jsonResponse.reduce((acc, event) => {
        const formattedStartDate = event.startTime ? new Date(event.startTime).toLocaleDateString('en-GB') : 'N/A'; // Format date as DD/MM/YYYY
        
        // Find the existing event for the same deviceName
        const existingEvent = acc.find(e => e.deviceName === event.deviceName);

        if (existingEvent) {
          // If deviceName already exists, aggregate the distance by date
          if (existingEvent[formattedStartDate]) {
            existingEvent[formattedStartDate] += event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2));
          } else {
            existingEvent[formattedStartDate] = event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2));
          }
        } else {
          // If deviceName is not found, create a new entry with the date and distance
          acc.push({
            deviceName: event.deviceName || 'N/A',
            [formattedStartDate]: event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2)),
          });
        }

        return acc;
      }, []); // Initialize accumulator as an empty array

      console.log('Processed Event Data:', processedEvents);

      // Set the filtered rows and the total responses
      setFilteredRows(processedEvents);
      setOriginalRows(processedEvents.map((row) => ({ ...row, isSelected: false })));

      setTotalResponses(processedEvents.length);

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
        const processedEvents = jsonData.reduce((acc, event) => {
          const formattedStartDate = event.eventTime ? new Date(event.eventTime).toLocaleDateString('en-GB') : 'N/A'; // Format date as DD/MM/YYYY

          const existingEvent = acc.find(e => e.deviceName === event.deviceName);

          if (existingEvent) {
            // If deviceName already exists, aggregate the distance by date
            if (existingEvent[formattedStartDate]) {
              existingEvent[formattedStartDate] += event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2));
            } else {
              existingEvent[formattedStartDate] = event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2));
            }
          } else {
            // If deviceName is not found, create a new entry with the date and distance
            acc.push({
              deviceName: event.deviceName || 'N/A',
              [formattedStartDate]: event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2)),
            });
          }

          return acc;
        }, []);

        console.log('Processed Events:', processedEvents);

        setFilteredRows(processedEvents);
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

 const [selectedNotification, setSelectedNotification] = useState('');
  const [daily, setDaily] = useState(false);

  const notificationTypes = [
    // { type: 'Summary' },
    { type: 'Daily Summary' }
  ];

  const handleNotificationChange = (e) => {
    const selectedType = e.target.value;
    setSelectedNotification(selectedType);

    // Set daily to true if 'Daily Summary', else set to false
    setDaily(selectedType === 'Daily Summary');
  };
  const options = devices.map((device) => ({
    value: device.deviceId,
    label: device.deviceName,
  }));
  
  const handleChange = (selectedOption) => {
    setSelectedDevice(selectedOption ? selectedOption.value : null);
  };
  const groupOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
  }));
  
  // Handle change for groups
  const handleGroupChange = (selectedOption) => {
    setSelectedGroup(selectedOption ? selectedOption.value : null);
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
       Distance Report 
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
         
<Export sortedData={sortedData} columnVisibility={columnVisibility} COLUMNS={COLUMNS} pdfTitle={"DISTANCE REPORT"} pdfFilename={"DistanceReport"} excelFilename={"DistanceReport.xlsx"}/>

          <div
  style={{
    width: "250px",
    position: "relative",
    zIndex: "10",
    border: "1px solid #000", // Add a black border
    marginLeft:"8px"
  }}
>

  <Select
    options={options}
    value={options.find((option) => option.value === selectedDevice) || null}
    onChange={handleChange}
    placeholder={selectdevice?"Loading Devices...":"Select Device"}
    isLoading={selectdevice}
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
<div style={{
   
    marginLeft:"8px"
  }}>
      <select
        value={selectedNotification}
        onChange={handleNotificationChange}
        style={{ marginRight: '10px',paddingTopTop:'7px',paddingBottom:'7px', padding: '5px' }}
      >
        <option value="">Select Notification Type</option>
        {notificationTypes.map((notification) => (
          <option key={notification.type} value={notification.type}>
            {notification.type}
          </option>
        ))}
      </select>


    </div>
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
        border: "1px solid #000",
        // borderRadius: "4px", // Optional rounded corners
      }}
    >
      <Select
        options={groupOptions}
        value={groupOptions.find((option) => option.value === selectedGroup) || null}
        onChange={handleGroupChange}
        placeholder={selectgroup?"Loading Group...":"Select Group"}
        isClearable
        styles={{
          control: (provided) => ({
            ...provided,
            border: "none", // Remove react-select's default border
            boxShadow: "none", // Remove focus outline
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: "#000", // Black dropdown arrow
          }),
          clearIndicator: (provided) => ({
            ...provided,
            color: "#000", // Black clear icon
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
  <Table stickyHeader aria-label="sticky table" style={{ border: "1px solid black" }}>
    <TableHead>
      <TableRow style={{ borderBottom: "1px solid black", borderTop: "1px solid black" }}>
        <TableCell padding="checkbox" style={{ borderRight: "1px solid #e0e0e0", borderBottom: "2px solid black" }}>
          <Switch checked={selectAll} onChange={() => setSelectAll(!selectAll)} color="primary" />
        </TableCell>

        {COLUMNS().map((column) => (
          <TableCell
            key={column.accessor}
            align="left"
            style={{
              minWidth: column.minWidth || "100px",
              cursor: "pointer",
              borderRight: "1px solid #e0e0e0",
              borderBottom: "2px solid black",
              padding: "4px 4px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {column.Header}
          </TableCell>
        ))}

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
          Total Distance
        </TableCell>
      </TableRow>
    </TableHead>

   
 <TableBody>
    {sortedData.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={COLUMNS().length + 1} 
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
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
        // Calculate the total distance for each row by summing the relevant columns
        const totalDistance = Object.keys(row).reduce((sum, key) => {
          // Exclude the 'deviceName' and any non-numeric values (like dates and "-")
          if (key !== 'deviceName' && !key.startsWith('date_')) {
            const columnValue = row[key];
            const numericValue = parseFloat(columnValue);

            if (!isNaN(numericValue)) {
              return sum + numericValue;  // Sum only valid numbers
            }
          }
          return sum;
        }, 0);

        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.deviceId + index}
            selected={selectAll}
            style={{
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
            }}
          >
            
            <TableCell padding="checkbox" style={{ borderRight: "1px solid #e0e0e0" }}>
              <Switch checked={selectAll} color="primary" />
            </TableCell>

           
            {COLUMNS().map((column) => {
              const columnValue = row[column.accessor];

              // Handle date columns
              if (column.accessor.startsWith('date_')) {
                const dateKey = column.accessor.replace('date_', '').replace(/-/g, '/');
                const dateValue = row[dateKey] || '0';
                return (
                  <TableCell
                    key={column.accessor}
                    align="left"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      padding: "4px",
                    }}
                  >
                    {dateValue !== undefined && dateValue !== null ? dateValue : '-'}
                  </TableCell>
                );
              } else {
                return (
                  <TableCell
                    key={column.accessor}
                    align="left"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      padding: "4px",
                    }}
                  >
                    {columnValue}
                  </TableCell>
                );
              }
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
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
              }}
            >
              {parseFloat((totalDistance).toFixed(2))}
             
            </TableCell>
          </TableRow>
        );
      })
    )}
  </TableBody>
  

<TableFooter>
  <TableRow>
    {/* Label for total row */}
    <TableCell
      style={{
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      Total
    </TableCell>

    {/* Dynamically calculate totals for each date column */}
    {COLUMNS().map((column) => {
      if (column.accessor === "deviceName") {
        // Skip the deviceName column
        return <TableCell key={column.accessor}></TableCell>;
      }

      // Calculate the column total by summing up relevant values in `sortedData`
      // const columnTotal = sortedData.reduce((sum, row) => {
      //   const value = parseFloat(row[column.accessor] || 0); // Default to 0 if value is undefined
      //   return sum + (isNaN(value) ? 0 : value);
      // }, 0);

      const columnTotal = sortedData.reduce((sum, row) => {
        const formattedAccessor = column.accessor.replace("date_", "").replace(/-/g, "/"); // Convert "date_05-12-2024" to "05/12/2024"
        // Extract and parse the value for the column
        const value = parseFloat(row[formattedAccessor] || 0); // Default to 0 if the value is missing or undefined
        return sum + (isNaN(value) ? 0 : value); // Add only valid numeric values
      }, 0);


      return (
        <TableCell
          key={column.accessor}
          align="center"
          style={{
            fontWeight: "bold",
            backgroundColor: "#f5f5f5",
          }}
        >
          {columnTotal.toFixed(2)} {/* Format to 2 decimal places */}
        </TableCell>
      );
    })}

    {/* Calculate and display grand total */}
    <TableCell
      style={{
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      {sortedData
        .reduce((grandTotal, row) => {
          return Object.keys(row).reduce((sum, key) => {
            if (key !== "deviceName") {
              const value = parseFloat(row[key] || 0);
              return sum + (isNaN(value) ? 0 : value);
            }
            return sum;
          }, grandTotal);
        }, 0)
        .toFixed(2)}
    </TableCell>
  </TableRow>
</TableFooter>



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