import React, { useState, useEffect, useContext, Component } from 'react'
import axios from 'axios'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import { COLUMNS } from './columns'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import * as XLSX from 'xlsx'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { TotalResponsesContext } from '../../../views/ParentContext/TotalResponsesContext'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { StyledTablePagination } from '../../../../src/PaginationCssFile/TablePaginationStyles'
import Export from './ExportNotification'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { FormControl, FormControlLabel, FormGroup, Checkbox } from '@mui/material'
import { InputLabel, MenuItem, Select } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment' // Add this import
import SchoolIcon from '@mui/icons-material/School'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Enable vertical scrolling
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
}

const Notification = () => {
  const role = localStorage.getItem('role')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [filterText, setFilterText] = useState('')
  const [filteredRows, setFilteredRows] = useState([])
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(COLUMNS().map((col) => [col.accessor, true])),
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  // const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importData, setImportData] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  // const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true)
  const [originalRows, setOriginalRows] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [schools, setSchools] = useState([])

  const [selectedSchool, setSelectedSchool] = useState(null)
  const [branches, setBranches] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [formData, setFormData] = useState({
    schoolId: '',
    branchId: '',
    deviceId: [],
    ignitionOn: false,
    ignitionOff: false,
    geofenceEnter: false,
    geofenceExit: false,
    studentPresent: false,
    studentAbsent: false,
    leaveRequestStatus: false,
  })
  const [editFormData, setEditFormData] = useState({})
  const [filteredBranches, setFilteredBranches] = useState([])
  const [devices, setDevices] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSchools, setFilteredSchools] = useState(schools)

  const notificationOptions = [
    'ignitionOn',
    'ignitionOff',
    'geofenceEnter',
    'geofenceExit',
    'studentPresent',
    'studentAbsent',
    'leaveRequestStatus',
  ]
  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearchTerm(value)

    setFilteredSchools(
      schools.filter((school) => school.schoolName.toLowerCase().includes(value.toLowerCase())),
    )
  }

  const handleOpenModal = () => setAddModalOpen(true)
  const handleCloseModal = () => {
    setAddModalOpen(false)
    setEditModalOpen(false)
    setFormData([])
  }
  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target
    setSelectedNotifications((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    )
  }

  const handleSubmit = async () => {
    // Prepare the updated form data
    const selectedDeviceNames = formData.deviceId
      ? formData.deviceId.map((deviceId) => {
          const device = devices.find((d) => d.deviceId === deviceId)
          return device ? device.deviceName : ''
        })
      : []

    const selectedSchoolName = formData.schoolId
      ? schools.find((school) => school._id === formData.schoolId)?.schoolName
      : ''

    const selectedBranchName = formData.branchId
      ? branches.find((branch) => branch._id === formData.branchId)?.branchName
      : ''

    // Add names to the formData
    const updatedFormData = {
      ...formData,
      deviceNames: selectedDeviceNames,
      schoolName: selectedSchoolName,
      branchName: selectedBranchName,
    }

    console.log('Updated form data', updatedFormData) // Check the updated form data before sending

    // Send the form data to the server using axios
    try {
      const response = await axios.post(
        'http://63.142.251.13:4000/createnotification',
        updatedFormData,
        {
          headers: {
            'Content-Type': 'application/json', // Indicate that the request body is JSON
          },
        },
      )

      console.log('Notification created successfully:', response.data)
      // Optionally, you can show a success message or handle the result here
      fetchData()
      setFormData([])
    } catch (error) {
      console.error('Error:', error)
      // Optionally, show an error message or handle the error here
    }
    setAddModalOpen(false)
  }

  const handleSelectAllChange = (event) => {
    const { checked } = event.target
    setSelectAllChecked(checked)

    if (checked) {
      setSelectedNotifications(notificationOptions) // Select all
    } else {
      setSelectedNotifications([]) // Deselect all
    }
  }
  const handleSchoolChange = (event) => {}

  // Handle branch change
  const handleBranchChange = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  useEffect(() => {
    // Initialize filtered branches if needed (optional)
    if (formData.schoolId) {
      const initialBranches = branches.filter((branch) => branch.schoolId === formData.schoolId)
      setFilteredBranches(initialBranches)
    }
  }, [branches, formData.schoolId])

  const fetchBranch = (schoolId) => {
    console.log('Selected School ID:', schoolId)

    // Find the matching school from the schools array
    const selectedSchool = schools.find((school) => school._id === schoolId)

    if (selectedSchool) {
      console.log('Matching School:', selectedSchool)

      // Extract the branches array from the selected school
      const branches = selectedSchool.branches || [] // Fallback to empty array if no branches

      // Log the branches for verification
      console.log('Branches for the selected school:', branches)

      // Store the branches in the state (assuming setBranch is the setter function)
      setBranches(branches)
    } else {
      console.log('No school found with the selected ID')
    }
  }
  const fetchDevices = (branchId) => {
    console.log('Selected Branch ID:', branchId)

    // Assuming devices are stored in a state or fetched from an API based on branchId
    // For example, let's say devices are stored in an array in the selected branch object.
    const selectedBranch = branches.find((branch) => branch._id === branchId)

    if (selectedBranch) {
      console.log('Matching Branch:', selectedBranch)

      // Assuming devices are an array within the branch object
      const devices = selectedBranch.devices || [] // Default to empty array if no devices exist

      // Log the devices to verify
      console.log('Devices for the selected branch:', devices)
      console.log('formdata', formData)
      // Store the devices in the state (assuming setDevices is the setter function)
      setDevices(devices)
    } else {
      console.log('No branch found with the selected ID')
    }
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  }

  const parseDate = (dateStr) => {
    if (!dateStr) return null
    const [month, day, year] = dateStr.split('/').map(Number) // Assuming MM/DD/YYYY format
    return new Date(year, month - 1, day)
  }
  useEffect(() => {
    const fetchSchool = async (startDate = '', endDate = '') => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${import.meta.env.VITE_SUPER_ADMIN_API}/getschools`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('fetch data', response.data) // Log the entire response data

        if (Array.isArray(response.data.schools)) {
          const allData = response.data.schools
          setSchools(allData)
          console.log(allData)
        } else {
          console.error('Expected an array but got:', response.data.schools)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchool()
  }, [addModalOpen])

  const fetchData = async (startDate = '', endDate = '') => {
    setLoading(true)
    try {
      let response
      if (role == 1) {
        const token = localStorage.getItem('token')
        response = await axios.get(
          // `${import.meta.env.VITE_SUPER_ADMIN_API}/read-devices`,
          `${process.env.REACT_APP_API}/getnotificationtypes`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      } else if (role == 2) {
        const token = localStorage.getItem('token')
        response = await axios.get(
          `${import.meta.env.VITE_SCHOOL_API}/read-devices`,
          // `${process.env.REACT_APP_API}/getnotificationtypes`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      } else if (role == 3) {
        const token = localStorage.getItem('token')
        response = await axios.get(
          `${import.meta.env.VITE_BRANCH_API}/read-devices`,
          // `${process.env.REACT_APP_API}/getnotificationtypes`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      }

      console.log('fetch data', response.data) // Log the entire response data
      // fetchgeofencepoint();
      if (response?.data) {
        console.log('fetch AAAAAAAA', response.data.data)
        // const allData = response.data.data;
        const allData = response.data.data.map((item) => ({
          ...item,
          schoolName: item.schoolId?.schoolName || '',
          branchName: item.branchId?.branchName || '',
        }))

        console.log('final data to show', allData)

        const filteredData =
          startDate || endDate
            ? allData.filter((row) => {
                const registrationDate = parseDate(row.formattedRegistrationDate)
                const start = parseDate(startDate)
                const end = parseDate(endDate)

                return (
                  (!startDate || registrationDate >= start) && (!endDate || registrationDate <= end)
                )
              })
            : allData // If no date range, use all data
        const reversedData = filteredData.reverse()
        // Log the date range and filtered data
        console.log(`Data fetched between ${startDate} and ${endDate}:`)
        console.log(filteredData)
        setFilteredRows(reversedData.map((row) => ({ ...row, isSelected: false })))
        setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })))
        setTotalResponses(reversedData.length)
        // Log the date range and filtered data
        console.log(`Data fetched between ${startDate} and ${endDate}:`)
        console.log(filteredData)
      } else {
        console.error('Expected an array but got:', response.data.children)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false) // Set loading to false after fetching completes
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterData(filterText)
  }, [filterText])

  useEffect(() => {
    fetchData() // Fetch data when startDate or endDate changes
  }, [startDate, endDate])

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage) // Set to all rows if -1
    setPage(0) // Reset to the first page
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleFilterChange = (event) => {
    const text = event.target.value
    setFilterText(text)
  }

  const filterData = (text) => {
    let dataToFilter = originalRows

    if (startDate && endDate) {
      dataToFilter = dataToFilter.filter((row) => {
        const rowDate = new Date(row.dateOfBirth) // Replace `row.date` with the actual date field
        return rowDate >= new Date(startDate) && rowDate <= new Date(endDate)
      })
    }

    if (text === '') {
      setFilteredRows(dataToFilter) // Reset to filtered data
    } else {
      const filteredData = dataToFilter
        .filter((row) =>
          Object.values(row).some(
            (val) => typeof val === 'string' && val.toLowerCase().includes(text.toLowerCase()),
          ),
        )
        .map((row) => ({ ...row, isSelected: false }))
      setFilteredRows(filteredData)
    }
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleColumnVisibilityChange = (accessor) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [accessor]: !prevState[accessor],
    }))
  }

  const handleRowSelect = (index) => {
    const newFilteredRows = [...filteredRows]
    newFilteredRows[index].isSelected = !newFilteredRows[index].isSelected
    setFilteredRows(newFilteredRows)
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    const newFilteredRows = filteredRows.map((row) => ({
      ...row,
      isSelected: newSelectAll,
    }))
    setFilteredRows(newFilteredRows)
    setSelectAll(newSelectAll)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetNames = workbook.SheetNames
        const sheet = workbook.Sheets[sheetNames[0]]
        const parsedData = XLSX.utils.sheet_to_json(sheet)
        setImportData(parsedData)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const sortedData = [...filteredRows]
  if (sortConfig.key !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }

  const handleGrantAccess = () => {
    console.log('handleGrantAccess')
    handleOpenModal()
  }

  const handleEditAccess = () => {
    console.log('handleEditAccess')
    const selected = filteredRows.find((row) => row.isSelected)
    if (selected) {
      setSelectedRow(selected)
      console.log('Selecteeeed is trueeeee')
      setEditFormData({
        _id: selected._id,
        deviceId: selected.deviceId,
        schoolName: selected.schoolName || selected.schoolId.schoolName, // Handle `schoolId` object
        branchName: selected.branchName || selected.branchId.branchName, // Handle `branchId` object
        deviceName: selected.deviceName,
        ignitionOn: selected.ignitionOn,
        ignitionOff: selected.ignitionOff,
        geofenceEnter: selected.geofenceEnter,
        geofenceExit: selected.geofenceExit,
        studentPresent: selected.studentPresent,
        studentAbsent: selected.studentAbsent,
        leaveRequestStatus: selected.leaveRequestStatus,
      })
      setSelectedRow(selected)
      setEditModalOpen(true)
    } else {
      setSnackbarOpen(true)
    }
    console.log('Selected', selected)
    // console.log("Selected edit form data",editFormData)
  }
  useEffect(() => {
    console.log('Selected edit form data', editFormData)
  }, [editFormData])

  const handleRevokeAccess = async () => {
    console.log('Filtered rows:', filteredRows)
    const selectedIds = filteredRows
      .filter((row) => row.isSelected)
      .map((row) => {
        // Log each row to check its structure
        console.log('Processing row:', row)
        return row.deviceId // Ensure id exists and is not undefined
      })

    console.log('Selected IDs:', selectedIds)

    if (selectedIds.length === 0) {
      alert('No rows selected for deletion.')
      return
    }
    const userConfirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} record(s)?`,
    )
    if (!userConfirmed) {
      // If the user clicks "Cancel", exit the function
      return
    }
    try {
      // Convert array to a comma-separated string
      const idsString = selectedIds.join(',')
      const url = `http://63.142.251.13:4000/deletenotification?ids=${idsString}`

      console.log('Constructed URL:', url)

      // Make the DELETE request
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error deleting record with ID  ${response.statusText}`)
      }
      const result = await response.json()
      console.log('Access revoked successfully:', result)

      const newFilteredRows = filteredRows.filter((row) => !row.isSelected)
      setFilteredRows(newFilteredRows)
      setSelectAll(false)
      fetchData()
      return response
    } catch (error) {
      console.error('Error during deletion:', error)
      alert('Failed to delete selected records.')
    }
    console.log('handleRevokeAccess')
  }

  const handleModalClose = () => {
    setEditModalOpen(false)
    setAddModalOpen(false)
    setModalOpen(false)
    setFormData({})
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleEditSubmit = async () => {
    // Define the API URL and authentication token
    const apiUrl = `http://63.142.251.13:4000/updatenotification/${selectedRow._id}` // Replace with your actual API URL
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0' // Replace with your actual authentication token
    console.log('URL', apiUrl)
    // Prepare the updated data
    const updatedData = {
      ...editFormData,
      isSelected: false,
    }

    try {
      // Perform the PUT request
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      })

      // Check if the response is okay (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Optionally: Process the response data if needed
      const result = await response.json()
      console.log('Update successful:', result)
      alert('updated successfully')
      // Update local state after successful API call
      const updatedRows = filteredRows.map((row) =>
        row.id === selectedRow.id ? { ...row, ...formData, isSelected: false } : row,
      )
      setFilteredRows(updatedRows)

      // Close the modal
      handleModalClose()
      fetchData()
    } catch (error) {
      console.error('Error updating row:', error)
      alert('error updating code')
      // Optionally: Handle the error (e.g., show a notification or message to the user)
    }
    fetchData()
  }

  return (
    <>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Notification Access</h1>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
            sx={{
              marginRight: '10px',
              width: '200px', // Smaller width
              '& .MuiOutlinedInput-root': {
                height: '36px', // Set a fixed height to reduce it
                padding: '0px', // Reduce padding to shrink height
              },
              '& .MuiInputLabel-root': {
                top: '-6px', // Adjust label position
                fontSize: '14px', // Slightly smaller label font
              },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  style={{
                    cursor: 'pointer',
                    marginLeft: '10px',
                    marginRight: '5px',
                  }}
                />
              ),
            }}
          />
          <Button
            onClick={() => setModalOpen(true)}
            sx={{
              backgroundColor: 'rgb(85, 85, 85)',
              color: 'white',
              fontWeight: 'bold',
              marginRight: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              '&:hover': {
                fontWeight: 'bolder', // Make text even bolder on hover
                backgroundColor: 'rgb(85, 85, 85)', // Maintain background color on hover
              },
            }}
          >
            <ImportExportIcon />
            Column Visibility
          </Button>

          {role == 1 && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleGrantAccess}
                sx={{ marginRight: '10px' }}
                startIcon={<CheckCircleIcon />}
              >
                Grant Access
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditAccess}
                sx={{ marginRight: '10px' }}
                startIcon={<EditIcon />}
              >
                Edit Access
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleRevokeAccess}
                sx={{ marginRight: '10px' }}
                startIcon={<RemoveCircleIcon />}
              >
                Revoke Access
              </Button>
            </>
          )}

          <Export
            filteredRows={filteredRows}
            COLUMNS={COLUMNS}
            columnVisibility={columnVisibility}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        ></div>

        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 460,
                border: '1.5px solid black',
                borderRadius: '7px',
              }}
            >
              <Table stickyHeader aria-label="sticky table" style={{ border: '1px solid black' }}>
                <TableHead>
                  <TableRow
                    style={{
                      borderBottom: '1px solid black',
                      borderTop: '1px solid black',
                    }}
                  >
                    <TableCell
                      padding="checkbox"
                      style={{
                        borderRight: '1px solid #e0e0e0',
                        borderBottom: '2px solid black',
                      }}
                    >
                      <Switch checked={selectAll} onChange={handleSelectAll} color="primary" />
                    </TableCell>
                    {COLUMNS()
                      .filter((col) => columnVisibility[col.accessor])
                      .map((column) => (
                        <TableCell
                          key={column.accessor}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            cursor: 'pointer',
                            borderRight: '1px solid #e0e0e0',
                            borderBottom: '2px solid black',
                            padding: '4px 4px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                          }}
                          onClick={() => requestSort(column.accessor)}
                        >
                          {column.Header}
                          {sortConfig.key === column.accessor ? (
                            sortConfig.direction === 'ascending' ? (
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
                        borderRight: '1px solid #e0e0e0',
                        borderBottom: '2px solid black',
                        padding: '4px 4px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Assigned Notifications
                    </TableCell>
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
                          key={row.deviceId}
                          onClick={() => handleRowSelect(page * rowsPerPage + index)}
                          selected={row.isSelected}
                          style={{
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                            borderBottom: 'none', // White for even rows, light grey for odd rows
                          }}
                        >
                          <TableCell
                            padding="checkbox"
                            style={{ borderRight: '1px solid #e0e0e0' }}
                          >
                            <Switch checked={row.isSelected} color="primary" />
                          </TableCell>
                          {COLUMNS()
                            .filter((col) => columnVisibility[col.accessor])
                            .map((column) => {
                              const value = row[column.accessor]
                              return (
                                <TableCell
                                  key={column.accessor}
                                  align={column.align}
                                  style={{
                                    borderRight: '1px solid #e0e0e0',
                                    paddingTop: '4px',
                                    paddingBottom: '4px',
                                    borderBottom: 'none',
                                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                                    fontSize: 'smaller',
                                  }}
                                >
                                  {value || 'N/A'}
                                </TableCell>
                              )
                            })}
                          <TableCell
                            style={{
                              minWidth: 70,
                              borderRight: '1px solid #e0e0e0',
                              padding: '4px 4px',
                              textAlign: 'center',
                              backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                              fontSize: 'smaller',
                            }}
                          >
                            <Select
                              value=""
                              displayEmpty
                              fullWidth
                              variant="outlined"
                              style={{
                                textAlign: 'center',
                                fontSize: 'smaller',
                                backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                              }}
                            >
                              <MenuItem value="" disabled>
                                Notification Options
                              </MenuItem>
                              {/* Dynamically filter and render only true fields */}
                              {[
                                { key: 'ignitionOn', label: 'Ignition On' },
                                { key: 'ignitionOff', label: 'Ignition Off' },
                                { key: 'geofenceEnter', label: 'Geofence Enter' },
                                { key: 'geofenceExit', label: 'Geofence Exit' },
                                { key: 'studentPresent', label: 'Student Present' },
                                { key: 'studentAbsent', label: 'Student Absent' },
                                { key: 'leaveRequestStatus', label: 'Leave Request Status' },
                              ]
                                .filter((option) => row[option.key]) // Include only the fields with true value
                                .map((option) => (
                                  <MenuItem key={option.key} value={option.key}>
                                    {option.label}
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
                rowsPerPageOptions={[{ label: 'All', value: -1 }, 10, 25, 100, 1000]}
                component="div"
                count={sortedData.length}
                rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => {
                  console.log('Page changed:', newPage)
                  handleChangePage(event, newPage)
                }}
                onRowsPerPageChange={(event) => {
                  console.log('Rows per page changed:', event.target.value)
                  handleChangeRowsPerPage(event)
                }}
              />
            </StyledTablePagination>
            {/* //</></div> */}
          </>
        )}

        <Modal open={addModalOpen} onClose={handleCloseModal}>
          <Box sx={style}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Grant Access</h2>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            {role == 1 ? (
              <>
                <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                  <InputLabel>{'School Name'}</InputLabel>
                  <Select
                    value={formData['schoolId'] || ''}
                    onChange={(event) => {
                      const selectedSchoolId = event.target.value

                      // Handle school change
                      handleSchoolChange(event)

                      // Update the formData with the selected schoolId
                      setFormData((prevData) => ({
                        ...prevData,
                        schoolId: selectedSchoolId,
                      }))

                      // Fetch branches with the selected schoolId
                      fetchBranch(selectedSchoolId) // Pass the selected schoolId to fetchBranch
                    }}
                    name="schoolName"
                    label={'School Name'}
                    startAdornment={
                      <InputAdornment position="start">
                        <SchoolIcon />
                      </InputAdornment>
                    }
                  >
                    {schools.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.schoolName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                  <InputLabel>{'Branch Name'}</InputLabel>

                  <Select
                    value={formData['branchId'] || ''}
                    onChange={(event) => {
                      const selectedBranchId = event.target.value

                      // Handle school change
                      handleBranchChange(event)

                      // Update the formData with the selected schoolId
                      setFormData((prevData) => ({
                        ...prevData,
                        branchId: selectedBranchId,
                      }))

                      // Fetch branches with the selected schoolId
                      fetchDevices(selectedBranchId) // Pass the selected schoolId to fetchBranch
                    }}
                    name="branchNames"
                    label={'Branch Name'}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountTreeIcon />
                      </InputAdornment>
                    }
                  >
                    {branches.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.branchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                  <InputLabel>{'Devices'}</InputLabel>

                  <Select
                    multiple // Allow multiple selections
                    value={formData['deviceId'] || []} // Ensure this is an array of deviceId
                    onChange={(event) => {
                      const selectedDeviceIds = event.target.value // Array of selected deviceIds

                      // Update the formData with the selected deviceIds (not _id)
                      setFormData((prevData) => ({
                        ...prevData,
                        deviceId: selectedDeviceIds, // Store array of selected deviceIds
                      }))
                    }}
                    name="deviceName"
                    label={'Device Name'}
                    startAdornment={
                      <InputAdornment position="start">
                        <DirectionsBusIcon />
                      </InputAdornment>
                    }
                    renderValue={(selected) => {
                      // Custom render to display selected device names based on deviceId
                      return selected
                        .map((deviceId) => {
                          const device = devices.find(
                            (device) => device.deviceId === deviceId, // Match by deviceId instead of _id
                          )
                          return device ? device.deviceName : ''
                        })
                        .join(', ') // Join selected device names with commas
                    }}
                  >
                    {/* "Select All" MenuItem */}
                    <MenuItem
                      onClick={() => {
                        const selectedDeviceIds = formData['deviceId'] || []

                        if (selectedDeviceIds.length !== devices.length) {
                          // If not all devices are selected, select all deviceIds
                          const allDeviceIds = devices.map((device) => device.deviceId) // Use deviceId here
                          setFormData((prevData) => ({
                            ...prevData,
                            deviceId: allDeviceIds, // Select all deviceIds
                          }))
                        } else {
                          // If all devices are selected, deselect all
                          setFormData((prevData) => ({
                            ...prevData,
                            deviceId: [], // Deselect all
                          }))
                        }
                      }}
                    >
                      <Checkbox
                        checked={formData['deviceId']?.length === devices.length} // Check if all deviceIds are selected
                      />
                      Select All
                    </MenuItem>

                    {/* Devices Menu Items */}
                    {devices.map((option) => (
                      <MenuItem key={option.deviceId} value={option.deviceId}>
                        {' '}
                        {/* Use deviceId as value */}
                        <Checkbox
                          checked={formData['deviceId']?.includes(option.deviceId) || false} // Check if deviceId is selected
                        />
                        {option.deviceName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                  <InputLabel>{'Notification Options'}</InputLabel>
                  <Select
                    multiple
                    value={notificationOptions.filter((option) => formData[option])} // Only selected options will be included
                    onChange={(event) => {
                      const selectedValues = event.target.value // Array of selected notification options

                      // Update the formData to store true for selected and false for unselected
                      setFormData((prevData) => {
                        const newFormData = { ...prevData }
                        notificationOptions.forEach((option) => {
                          newFormData[option] = selectedValues.includes(option) // True for selected, false for others
                        })
                        return newFormData
                      })
                    }}
                    name="notificationOptions"
                    label={'Notification Options'}
                    startAdornment={
                      <InputAdornment position="start">
                        <CircleNotificationsIcon />
                      </InputAdornment>
                    }
                    renderValue={(selected) => selected.join(', ')} // Render selected options
                  >
                    {/* Individual Options */}
                    {notificationOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        <Checkbox checked={formData[option]} />
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : null}
            {role == 2 && <h1>hello</h1>}

            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </Box>
        </Modal>

        <Modal open={editModalOpen} onClose={handleCloseModal}>
          <Box sx={style}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Edit Access</h2>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
              <InputLabel>{'School Name'}</InputLabel>
              <Select
                value={editFormData.schoolName || ''}
                name="schoolName"
                label={'School Name'}
                startAdornment={
                  <InputAdornment position="start">
                    <SchoolIcon /> {/* Add SchoolIcon as the adornment */}
                  </InputAdornment>
                }
              >
                <MenuItem value={editFormData.schoolName || ''}>
                  {editFormData.schoolName || ''}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
              <InputLabel>{'Branch Name'}</InputLabel>
              <Select
                value={editFormData.branchName || ''}
                name="branchNames"
                label={'Branch Name'}
                startAdornment={
                  <InputAdornment position="start">
                    <AccountTreeIcon /> {/* Add SchoolIcon as the adornment */}
                  </InputAdornment>
                }
              >
                <MenuItem value={editFormData.branchName || ''}>
                  {editFormData.branchName || ''}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
              <InputLabel>{'Device Name'}</InputLabel>
              <Select
                value={editFormData.deviceName || ''}
                name="deviceName"
                label={'Device Name'}
                startAdornment={
                  <InputAdornment position="start">
                    <DirectionsBusIcon /> {/* Add SchoolIcon as the adornment */}
                  </InputAdornment>
                }
              >
                <MenuItem value={editFormData.deviceName || ''}>
                  {editFormData.deviceName || ''}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
              <InputLabel>{'Notification Options'}</InputLabel>
              <Select
                multiple
                value={notificationOptions.filter((option) => editFormData[option])} // Only selected options will be included
                onChange={(event) => {
                  const selectedValues = event.target.value // Array of selected notification options

                  // Update editFormData directly
                  setEditFormData((prevData) => {
                    const updatedFormData = { ...prevData }
                    notificationOptions.forEach((option) => {
                      updatedFormData[option] = selectedValues.includes(option) // True for selected, false for others
                    })
                    return updatedFormData
                  })
                }}
                name="notificationOptions"
                label={'Notification Options'}
                startAdornment={
                  <InputAdornment position="start">
                    <CircleNotificationsIcon />
                  </InputAdornment>
                }
                renderValue={(selected) => selected.join(', ')} // Render selected options
              >
                {/* Individual Options */}
                {notificationOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    <Checkbox
                      checked={editFormData[option] || false} // Pre-check if true in editFormData
                    />
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={handleEditSubmit} fullWidth>
              Submit
            </Button>
          </Box>
        </Modal>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="warning">
            Please select a row to edit!
          </Alert>
        </Snackbar>
      </div>
    </>
  )
}
export default Notification
