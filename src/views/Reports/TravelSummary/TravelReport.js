import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CFormLabel,
  CFormFeedback,
  CTooltip,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
  CTab,
  CCollapse,
} from '@coreui/react'
import { Plus, Minus } from 'lucide-react'
import Select from 'react-select'
import Cookies from 'js-cookie'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilSettings, cilChevronBottom, cilChevronRight } from '@coreui/icons'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { auto } from '@popperjs/core'
import idel from 'src/status/idel.png'
import ignitionOff from 'src/status/power-off.png'
import ignitionOn from 'src/status/power-on.png'
import Loader from '../../../components/Loader/Loader'
import '../style/remove-gutter.css'
import '../../../utils.css'
import IconDropdown from '../../../components/ButtonDropdown'
import { color } from 'framer-motion'
import { FaRegFilePdf, FaPrint } from 'react-icons/fa6'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaArrowUp } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { ContentPasteOffOutlined } from '@mui/icons-material'
const accessToken = Cookies.get('authToken')

const decodedToken = jwtDecode(accessToken)

import PropTypes from 'prop-types'

const SearchTravel = ({
  formData,
  handleInputChange,
  handleSubmit,
  users,
  groups,
  getGroups,
  selectedGroupName,
  devices,
  loading,
  getDevices,
  columns,
  showMap,
  setShowMap,
  handlePutName,
}) => {
  const [validated, setValidated] = useState(false)
  const [showDateInputs, setShowDateInputs] = useState(false)
  const [buttonText, setButtonText] = useState('SHOW NOW')
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [selectedU, setSelectedU] = useState()
  const [selectedG, setSelectedG] = useState()
  // For username show in pdf
  const [putName, setPutName] = useState('')

  useEffect(() => {
    handlePutName(putName)
  }, [putName])

  const handleFormSubmit = (event) => {
    const form = event.currentTarget
    console.log('handle submit ke pass hu')
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      handleSubmit()
      setShowMap(true) //Show the mapping
    }
    setValidated(true)
  }

  const handlePeriodChange = (value) => {
    handleInputChange('Periods', value)
    setShowDateInputs(value === 'Custom')
  }

  // Function to handle dropdown item clicks
  const handleDropdownClick = (text) => {
    setButtonText(text) // Change button text based on the clicked item
    setDropdownOpen(false) // Close the dropdown after selection
    handleSubmit() // Submit form
    setShowMap(true) // Show the map when form is valid and submitted
  }
  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      <CCol md={3}>
        <CFormLabel htmlFor="devices">User</CFormLabel>
        <Select
          id="user"
          options={
            loading
              ? [{ value: '', label: 'Loading Users...', isDisabled: true }]
              : users?.length > 0
                ? users.map((user) => ({ value: user._id, label: user.username }))
                : [{ value: '', label: 'No Users in this Account', isDisabled: true }]
          }
          value={
            selectedU
              ? { value: selectedU, label: users.find((user) => user._id === selectedU)?.username }
              : null
          }
          // In SearchTravel's User Select component
          onChange={(selectedOption) => {
            const selectedUser = selectedOption?.value
            const username = selectedOption?.label
            setSelectedU(selectedUser)
            handlePutName(username) // Update parent state
            getGroups(selectedUser)
          }}
          isLoading={loading} // Optionally show a loading spinner
          placeholder="Choose a user..."
        />
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="devices">Groups</CFormLabel>
        <Select
          id="group"
          options={
            loading
              ? [{ value: '', label: 'Loading Groups...', isDisabled: true }]
              : groups?.length > 0
                ? groups.map((group) => ({ value: group._id, label: group.name }))
                : [{ value: '', label: 'No Groups in this User', isDisabled: true }]
          }
          value={
            selectedG
              ? { value: selectedG, label: groups.find((group) => group._id === selectedG)?.name }
              : null
          }
          onChange={(selectedOption) => {
            const selectedGroup = selectedOption?.value
            setSelectedG(selectedGroup)
            console.log('Selected Group ID:', selectedGroup)
            getDevices(selectedGroup)
          }}
          isLoading={loading} // Optionally show a loading spinner
          placeholder="Choose a group..."
        />
        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        <CFormSelect
          id="devices"
          required
          value={formData.Devices}
          onChange={(e) => handleInputChange('Devices', e.target.value)}
        >
          <option value="">Choose a device...</option>
          {loading ? (
            <option disabled>Loading devices...</option>
          ) : devices?.length > 0 ? (
            devices?.map((device) => (
              <option key={device.id} value={device.deviceId}>
                {device.name}
              </option>
            ))
          ) : (
            <option disabled>No Device in this Group</option>
          )}
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="periods">Period</CFormLabel>
        <Select
          id="periods"
          options={[
            { value: '', label: 'Choose a period...', isDisabled: true },
            { value: 'Today', label: 'Today' },
            { value: 'Yesterday', label: 'Yesterday' },
            { value: 'This Week', label: 'This Week' },
            { value: 'Previous Week', label: 'Previous Week' },
            { value: 'This Month', label: 'This Month' },
            { value: 'Previous Month', label: 'Previous Month' },
            { value: 'Custom', label: 'Custom' },
          ]}
          value={formData.Periods ? { value: formData.Periods, label: formData.Periods } : null}
          onChange={(selectedOption) => handlePeriodChange(selectedOption.value)}
          placeholder="Choose a period..." // Displayed when no value is selected
        />

        <CFormFeedback invalid>Please select a valid period.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="columns">Columns</CFormLabel>
        <Select
          isMulti
          id="columns"
          options={[
            { value: 'all', label: 'All Columns' }, // Add "All Columns" option
            ...columns.map((column) => ({ value: column, label: column })),
          ]}
          value={
            formData.Columns.length === columns.length
              ? [{ value: 'all', label: 'All Columns' }] // Show "All Columns" if all columns are selected
              : formData.Columns.map((column) => ({ value: column, label: column }))
          }
          onChange={(selectedOptions) => {
            if (selectedOptions.find((option) => option.value === 'all')) {
              // If "All Columns" is selected, select all available columns
              handleInputChange('Columns', columns)
            } else {
              // Otherwise, update formData.Columns with selected values
              handleInputChange(
                'Columns',
                selectedOptions.map((option) => option.value),
              )
            }
          }}
        />
        <CFormFeedback invalid>Please select at least one column.</CFormFeedback>
      </CCol>
      {showDateInputs && (
        <>
          <CCol md={4}>
            <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
            <CFormInput
              type="date"
              id="fromDate"
              value={formData.FromDate}
              onChange={(e) => handleInputChange('FromDate', e.target.value)}
              required
            />
            <CFormFeedback invalid>Please provide a valid from date.</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="toDate">To Date</CFormLabel>
            <CFormInput
              type="date"
              id="toDate"
              value={formData.ToDate}
              onChange={(e) => handleInputChange('ToDate', e.target.value)}
              required
            />
            <CFormFeedback invalid>Please provide a valid to date.</CFormFeedback>
          </CCol>
        </>
      )}
      <CCol xs={12}>
        <div className="d-flex justify-content-end">
          <div className="btn-group">
            <button
              className="btn text-white"
              type="button"
              onClick={() => handleDropdownClick('SHOW NOW')}
              style={{ backgroundColor: '#0a2d63' }}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </CCol>
    </CForm>
  )
}

const ShowSummary = ({
  statusLoading,
  apiData,
  selectedDeviceName,
  selectedColumns,
  selectedGroupName,
  selectedUserName,
  selectedFromDate,
  selectedToDate,
  selectedPeriod,
}) => {
  const [expandedRows, setExpandedRows] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10) // Default to 10 rows
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [addressData, setAddressData] = useState({})
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa', selectedUserName)
  const [newAddressData, setnewAddressData] = useState()

  const toggleRow = (vehicleName) => {
    setExpandedRows((prev) =>
      prev.includes(vehicleName)
        ? prev.filter((name) => name !== vehicleName)
        : [...prev, vehicleName],
    )
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '--'
    const date = new Date(dateString)
    return isNaN(date)
      ? '--'
      : date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
  }

  // Transform apiData to match reportData structure
  const reportData =
    apiData?.reportData?.map((vehicle) => ({
      name: selectedDeviceName,
      distance: vehicle.distance,
      running: vehicle.running || '--',
      idle: vehicle.idle || '--',
      stop: vehicle.stop || '--',
      maxSpeed: vehicle.maxSpeed,
      avgSpeed: vehicle.avgSpeed,
      startLat: vehicle.startLat,
      startLong: vehicle.startLong,
      endLat: vehicle.endLat,
      endLog: vehicle.endLong,
      dayWiseTrips: vehicle.dayWiseTrips || [], // Adjust based on your API structure
    })) || []

  const getAddress = async (latitude, longitude) => {
    try {
      const apiKey = 'CWVeoDxzhkO07kO693u0' // Replace with your actual MapTiler API key
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`,
      )

      if (response.data && response.data.features && response.data.features.length > 0) {
        const address = response.data.features[0].place_name
        console.log('Fetched address:', address) // Debugging: log the address
        return address // Return place_name from the features array
      } else {
        console.error('Error fetching address: No data found')
        return 'Address not available'
      }
    } catch (error) {
      console.error('Error:', error.message)
      return 'Address not available'
    }
  }

  useEffect(() => {
    const fetchAddresses = async () => {
      // Fetch all addresses concurrently
      const promises = apiData.reportData.map(async (data) => {
        // Split the startLocation and endLocation strings into latitudes and longitudes
        const [startLat, startLon] = data.startLocation
          ? data.startLocation.split(',').map((coord) => coord.trim())
          : [null, null]
        const [endLat, endLon] = data.endLocation
          ? data.endLocation.split(',').map((coord) => coord.trim())
          : [null, null]
        // Fetch the start and end addresses only if coordinates are valid
        const startAddress =
          startLat && startLon ? await getAddress(startLat, startLon) : 'Invalid start location'
        const endAddress =
          endLat && endLon ? await getAddress(endLat, endLon) : 'Invalid end location'
        // Store the addresses in the addressData state
        return {
          ouid: data.ouid,
          startAddress: startAddress || 'Address not found',
          endAddress: endAddress || 'Address not found',
        }
      })
      // Wait for all promises to resolve
      const results = await Promise.all(promises)
      // Update the addressData state with the fetched addresses
      results.forEach((result) => {
        setnewAddressData({
          startAddress: result.startAddress,
          endAddress: result.endAddress,
        })
      })
      console.log('Updated addressData:', newAddressData) // Debugging: log addressData
      setAddressData(newAddressData)
    }
    if (apiData?.reportData?.length > 0) {
      fetchAddresses()
    }
  }, [apiData])

  if (newAddressData) {
    console.log(newAddressData)
  }
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setSortBy(column)
  }

  const sortedData = [...(apiData?.reportData || [])].sort((a, b) => {
    if (!sortBy) return 0

    // Extract values for comparison based on the column
    const getValue = (row, column) => {
      switch (column) {
        case 'Vehicle Name':
          return selectedDeviceName
        case 'Vehicle Status':
          return row.vehicleStatus
        case 'Start Date Time':
          return new Date(row.startDateTime)
        case 'End Date Time':
          return new Date(row.endDateTime)
        case 'Distance':
        case 'Total Distance':
          return row.distance
        case 'Maximum Speed':
          return row.maxSpeed
        // case 'Total KM':
        //   return row.totalKm
        case 'Duration':
          return row.time
        default:
          return row[column]
      }
    }

    const aValue = getValue(a, sortBy)
    const bValue = getValue(b, sortBy)

    // Compare values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
  })
  // Calculate pagination boundaries
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)

  // Function to get date range based on selectedPeriod
  const getDateRangeFromPeriod = (selectedPeriod) => {
    const today = new Date()
    let fromDate, toDate

    switch (selectedPeriod) {
      case 'Today':
        fromDate = new Date()
        toDate = new Date()
        break
      case 'Yesterday':
        fromDate = new Date()
        fromDate.setDate(today.getDate() - 1)
        toDate = new Date(fromDate)
        break
      case 'This Week':
        fromDate = new Date(today)
        const dayOfWeek = today.getDay() // 0 (Sunday) to 6 (Saturday)
        const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert Sunday to previous Monday
        fromDate.setDate(today.getDate() - daysSinceMonday) // Start from Monday of this week
        toDate = new Date() // Ends at today's date
        break
      case 'Previous Week':
        fromDate = new Date(today)
        const prevWeekDayOfWeek = today.getDay()
        const daysSinceLastMonday = prevWeekDayOfWeek === 0 ? 7 : prevWeekDayOfWeek // Ensure previous Monday calculation
        fromDate.setDate(today.getDate() - daysSinceLastMonday - 6) // Start of previous week (Monday)
        toDate = new Date(fromDate)
        toDate.setDate(fromDate.getDate() + 6) // End of previous week (Sunday)
        break
      case 'This Month':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1)
        toDate = new Date()
        break
      case 'Previous Month':
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        toDate = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      default:
        return 'N/A'
    }

    // Format dates as DD-MM-YYYY
    const formattedFromDate = `${fromDate.getDate().toString().padStart(2, '0')}-${(fromDate.getMonth() + 1).toString().padStart(2, '0')}-${fromDate.getFullYear()}`
    const formattedToDate = `${toDate.getDate().toString().padStart(2, '0')}-${(toDate.getMonth() + 1).toString().padStart(2, '0')}-${toDate.getFullYear()}`

    return ` ${formattedFromDate} To ${formattedToDate}`
  }

  // Function to export table data to Excel
  const exportToExcel = async () => {
    try {
      // Validate data before proceeding
      if (!Array.isArray(sortedData) || sortedData.length === 0) {
        throw new Error('No data available for Excel export')
      }

      // Configuration constants
      const CONFIG = {
        styles: {
          primaryColor: 'FF0A2D63', // Company blue
          secondaryColor: 'FF6C757D', // Gray for secondary headers
          textColor: 'FFFFFFFF', // White text for headers
          borderStyle: 'thin',
          titleFont: { bold: true, size: 16 },
          headerFont: { bold: true, size: 12 },
          dataFont: { size: 11 },
        },
        travelSummaryColumns: [
          { header: 'SN', width: 8 },
          { header: 'Vehicle Number', width: 25 },
          { header: 'Start Address', width: 20 },
          { header: 'Total Distance', width: 25 },
          { header: 'Running Time', width: 35 },
          { header: 'Idle Time', width: 25 },
          { header: 'Stop Time', width: 25 },
          { header: 'End Address', width: 35 },
          { header: 'End Coordinates', width: 25 },
          { header: 'Total Distance', width: 20 },
          { header: 'Duration', width: 20 },
          { header: 'Maximum Speed', width: 20 },
        ],
        daywiseSummaryColumn: [
          { header: 'SN', width: 8 },
          { header: 'Report Date', width: 25 },
          { header: 'Ignition Start', width: 25 },
          { header: 'Start Location', width: 25 },
          { header: 'Distance', width: 25 },
          { header: 'Running', width: 25 },
          { header: 'Idle', width: 25 },
          { header: 'Stop', width: 25 },
          { header: 'Total Working Hours', width: 25 },
          { header: 'Max. Speed(km/h)', width: 25 },
          { header: 'Avg. Speed(km/h)', width: 25 },
          { header: 'End Location', width: 25 },
          { header: 'Ignition Stop', width: 25 },
        ],
        company: {
          name: 'Credence Tracker',
          copyright: `© ${new Date().getFullYear()} Credence Tracker`,
        },
      }

      // Helper functions
      const formatExcelDate = (dateString) => {
        if (!dateString) return '--'
        const date = new Date(dateString)
        return isNaN(date) ? '--' : date.toLocaleString('en-GB')
      }

      const formatCoordinates = (coords) => {
        if (!coords) return '--'
        const [lat, lon] = coords.split(',').map((coord) => parseFloat(coord.trim()).toFixed(5))
        return lat && lon ? `${lat}, ${lon}` : '--'
      }

      // Initialize workbook and worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Travel Summary')

      // Add title and metadata
      const addHeaderSection = () => {
        // Company title
        const titleRow = worksheet.addRow([CONFIG.company.name])
        titleRow.font = { ...CONFIG.styles.titleFont, color: { argb: 'FFFFFFFF' } }
        titleRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: CONFIG.styles.primaryColor },
        }
        titleRow.alignment = { horizontal: 'center' }
        worksheet.mergeCells('A1:L1')

        // Report title
        const subtitleRow = worksheet.addRow(['Travel Summary'])
        subtitleRow.font = {
          ...CONFIG.styles.titleFont,
          size: 14,
          color: { argb: CONFIG.styles.textColor },
        }
        subtitleRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: CONFIG.styles.secondaryColor },
        }
        subtitleRow.alignment = { horizontal: 'center' }
        worksheet.mergeCells('A2:L2')

        // Metadata
        worksheet.addRow([`Generated by: ${decodedToken.username || 'N/A'}`])
        worksheet.addRow([
          `User: ${selectedUserName || 'N/A'}`,
          `Group: ${selectedGroupName || 'N/A'}`,
        ])
        worksheet.addRow([
          `Date Range: ${selectedFromDate && selectedToDate
            ? `${selectedFromDate} - ${selectedToDate}`
            : getDateRangeFromPeriod(selectedPeriod)
          }`,
          `Selected Vehicle: ${selectedDeviceName || '--'}`,
        ])
        worksheet.addRow([`Generated: ${new Date().toLocaleString()}`])
        worksheet.addRow([]) // Spacer
      }

      // Add data table
      const addDataTable = () => {
        // Add column headers
        const headerRow = worksheet.addRow(CONFIG.columns.map((c) => c.header))
        headerRow.eachCell((cell) => {
          cell.font = { ...CONFIG.styles.headerFont, color: { argb: CONFIG.styles.textColor } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: CONFIG.styles.primaryColor },
          }
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.border = {
            top: { style: CONFIG.styles.borderStyle },
            bottom: { style: CONFIG.styles.borderStyle },
            left: { style: CONFIG.styles.borderStyle },
            right: { style: CONFIG.styles.borderStyle },
          }
        })

        // Add data rows
        sortedData.forEach((item, index) => {
          const rowData = [
            index + 1,
            selectedDeviceName || '--',
            item.vehicleStatus?.toString() ?? '--',
            formatExcelDate(item.startDateTime),
            newAddressData?.startAddress || '--',
            formatCoordinates(item.startLocation),
            formatExcelDate(item.endDateTime),
            newAddressData?.endAddress || '--',
            formatCoordinates(item.endLocation),
            typeof item.distance === 'number' ? `${(item.distance / 1000).toFixed(2)} km` : '--',
            item.time?.toString() ?? '--',
            typeof item.maxSpeed === 'number' ? `${item.maxSpeed} km/h` : '--',
          ]

          const dataRow = worksheet.addRow(rowData)
          dataRow.eachCell((cell) => {
            cell.font = CONFIG.styles.dataFont
            cell.border = {
              top: { style: CONFIG.styles.borderStyle },
              bottom: { style: CONFIG.styles.borderStyle },
              left: { style: CONFIG.styles.borderStyle },
              right: { style: CONFIG.styles.borderStyle },
            }
          })
        })

        // Set column widths
        worksheet.columns = CONFIG.columns.map((col) => ({
          width: col.width,
          style: { alignment: { horizontal: 'left' } },
        }))
      }

      // Add footer
      const addFooter = () => {
        worksheet.addRow([]) // Spacer
        const footerRow = worksheet.addRow([CONFIG.company.copyright])
        footerRow.font = { italic: true }
        worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`)
      }

      // Build the document
      addHeaderSection()
      addDataTable()
      addFooter()

      // Generate and save file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const filename = `Status_Report_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, filename)
      toast.success('Excel file downloaded successfully')
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error.message || 'Failed to export Excel file')
    }
  }

  // Function to export table data to PDF
  const exportToPDF = () => {
    try {
      // Validate data before proceeding
      if (!Array.isArray(sortedData) || sortedData.length === 0) {
        throw new Error('No data available for PDF export');
      }

      // Constants and configuration
      const CONFIG = {
        colors: {
          primary: [10, 45, 99],
          secondary: [70, 70, 70],
          accent: [0, 112, 201],
          border: [220, 220, 220],
          background: [249, 250, 251],
        },
        company: {
          name: 'Credence Tracker',
          logo: { x: 15, y: 15, size: 8 },
        },
        layout: {
          margin: 15,
          pagePadding: 15,
          lineHeight: 6,
        },
        fonts: {
          primary: 'helvetica',
          secondary: 'courier',
        },
      };

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Helper functions
      const applySecondaryColor = () => {
        doc.setTextColor(...CONFIG.colors.secondary);
      };

      const addHeader = () => {
        doc.setFillColor(...CONFIG.colors.primary);
        doc.rect(CONFIG.company.logo.x, CONFIG.company.logo.y, CONFIG.company.logo.size, CONFIG.company.logo.size, 'F');
        doc.setFont(CONFIG.fonts.primary, 'bold');
        doc.setFontSize(16);
        doc.text(CONFIG.company.name, 28, 21);

        doc.setDrawColor(...CONFIG.colors.primary);
        doc.setLineWidth(0.5);
        doc.line(CONFIG.layout.margin, 25, doc.internal.pageSize.width - CONFIG.layout.margin, 25);
      };

      const addMetadata = () => {
        const metadata = [
          { label: 'User:', value: decodedToken.username || 'N/A', x: 15 },
          { label: 'Selected User:', value: selectedUserName || 'N/A', x: 15 },
          {
            label: 'Group:',
            value: selectedGroupName || 'N/A',
            x: doc.internal.pageSize.width / 2,
          },
          {
            label: 'Date Range:',
            value:
              selectedFromDate && selectedToDate
                ? `${selectedFromDate} To ${selectedToDate}`
                : getDateRangeFromPeriod(selectedPeriod),
            x: doc.internal.pageSize.width / 2,
          },
          {
            label: 'Vehicle:',
            value: selectedDeviceName || 'N/A',
            x: 80,
          },
        ];

        doc.setFontSize(10);
        let yPosition = 45;

        metadata.forEach((item, index) => {
          doc.setFont(CONFIG.fonts.primary, 'bold');
          doc.text(item.label, item.x, yPosition + (index % 2) * 6);
          doc.setFont(CONFIG.fonts.primary, 'normal');
          doc.text(item.value.toString(), item.x + 25, yPosition + (index % 2) * 6);
        });
      };

      const addFooter = () => {
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setDrawColor(...CONFIG.colors.border);
          doc.setLineWidth(0.5);
          doc.line(CONFIG.layout.margin, doc.internal.pageSize.height - 15, doc.internal.pageSize.width - CONFIG.layout.margin, doc.internal.pageSize.height - 15);
          doc.setFontSize(9);
          applySecondaryColor();
          doc.text(`© ${CONFIG.company.name}`, CONFIG.layout.margin, doc.internal.pageSize.height - 10);

          const pageNumber = `Page ${i} of ${pageCount}`;
          const pageNumberWidth = doc.getTextWidth(pageNumber);
          doc.text(pageNumber, doc.internal.pageSize.width - CONFIG.layout.margin - pageNumberWidth, doc.internal.pageSize.height - 10);
        }
      };

      const formatDate = (dateString) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return isNaN(date)
          ? '--'
          : date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).replace(',', '');
      };

      const formatCoordinates = (coords) => {
        if (!coords) return '--';
        const [lat, lon] = coords.split(',').map((coord) => parseFloat(coord.trim()));
        return `${lat?.toFixed(5) ?? '--'}, ${lon?.toFixed(5) ?? '--'}`;
      };

      // Main document creation
      addHeader();
      doc.setFontSize(24);
      doc.setFont(CONFIG.fonts.primary, 'bold');
      doc.text('Travel Summary', CONFIG.layout.margin, 35);

      addMetadata();

      // Separate Column Definitions
      const tableColumns = [
        'SN',
        'Vehicle',
        'Start Address',
        'Total Distance',
        'Running',
        'Idle',
        'Stop',
        'End Address',
        'Max. Speed (km/h)',
        'Avg. Speed (km/h)',
        // 'Total Working Hours',
      ];

      const daywiseSummaryColumn = [
        'SN',
        'Report Date',
        'Ignition Start',
        'Start Location',
        'Distance',
        'Running',
        'Idle',
        'Stop',
        'Total Working Hours',
        'Max. Speed (km/h)',
        'Avg. Speed (km/h)',
        'End Location',
        'Ignition Stop',
      ];

      // Table Rows for Vehicle Summary
      const tableRows = sortedData.map((item, index) => [
        index + 1,
        item.name || '--',
        newAddressData?.startAddress || '--',
        typeof item.distance === 'string' ? `${item.distance} km` : '--',
        item.running || '--',
        item.idle || '--',
        item.stop || '--',
        newAddressData?.endAddress || '--',
        typeof item.maxSpeed === 'number' ? `${item.maxSpeed.toFixed(2)} km/h` : '--',
        typeof item.avgSpeed === 'number' ? `${item.avgSpeed.toFixed(2)} km/h` : '--',
        item.dayWiseTrips?.reduce((acc, trip) => acc + ` ${trip.workingHours}`, '') || '--',
      ]);

      // Add Vehicle Summary Table
      doc.autoTable({
        startY: 65,
        head: [tableColumns],
        body: tableRows,
        theme: 'grid',
      });

      // Add Daywise Summary Table
      const addDaywiseSummaryTable = () => {
        if (!sortedData || sortedData.length === 0) return;
        let yPosition = doc.lastAutoTable.finalY + 10;

        sortedData.forEach((item, vehicleIndex) => {
          if (!item.dayWiseTrips || item.dayWiseTrips.length === 0) return;
          doc.setFontSize(12);
          doc.setFont(CONFIG.fonts.primary, 'bold');
          doc.text(`Day-wise Summary - ${item.name}`, CONFIG.layout.margin, yPosition);
          yPosition += 8;

          const daywiseRows = item.dayWiseTrips.map((trip, index) => [
            index + 1,
            trip.date || '--',
            formatDate(trip.startTime) || '--',
            formatCoordinates(`${trip.startLatitude}, ${trip.startLongitude}`),
            trip.distance || '--',
            trip.runningTime || '--',
            trip.idleTime || '--',
            trip.stopTime || '--',
            trip.workingHours || '--',
            `${trip.maxSpeed?.toFixed(2) ?? '--'} km/h`,
            `${trip.avgSpeed?.toFixed(2) ?? '--'} km/h`,
            formatCoordinates(`${trip.endLatitude}, ${trip.endLongitude}`),
            formatDate(trip.endTime) || '--',
          ]);

          doc.autoTable({
            startY: yPosition,
            head: [daywiseSummaryColumn],
            body: daywiseRows,
            theme: 'grid',
          });

          yPosition = doc.lastAutoTable.finalY + 10;
        });
      };

      addDaywiseSummaryTable();
      addFooter();

      doc.save(`Travel_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error(error.message || 'Failed to export PDF');
    }
  };


  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage) // Update rows per page
    setCurrentPage(1) // Reset to first page
  }

  const handleLogout = () => {
    Cookies.remove('authToken')
    window.location.href = '/login'
  }

  const handlePageUp = () => {
    window.scrollTo({
      top: 0, // Scroll up by one viewport height
      behavior: 'smooth', // Smooth scrolling effect
    })
  }

  const handlePrintPage = () => {
    // Add the landscape style to the page temporarily
    const style = document.createElement('style')
    style.innerHTML = `
      @page {
        size: landscape;
      }
    `
    document.head.appendChild(style)

    // Zoom out for full content
    document.body.style.zoom = '50%'

    // Print the page
    window.print()

    // Remove the landscape style and reset zoom after printing
    document.head.removeChild(style)
    document.body.style.zoom = '100%'
  }

  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => exportToPDF(),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => exportToExcel(),
    },
    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => handlePrintPage(),
    },
    {
      icon: HiOutlineLogout,
      label: 'Logout',
      onClick: () => handleLogout(),
    },
    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => handlePageUp(),
    },
  ]

  console.log('REPORTED DATA', reportData)
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', width: '50px' }}
                ></CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  SN
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  Vehicle Number
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  Start Address
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  Total Distance
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  Running Time
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  Idle Time
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  Stop Time
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  End Address
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  Max Speed
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="text-center"
                  style={{ background: '#0a2d63', color: 'white' }}
                >
                  Avg Speed
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {statusLoading ? (
                <CTableRow style={{ position: 'relative' }}>
                  <CTableDataCell
                    colSpan={selectedColumns.length + 2}
                    style={{
                      backgroundColor: '#f8f9fa',
                      color: '#6c757d',
                      fontStyle: 'italic',
                      padding: '16px',
                      textAlign: 'center',
                      border: '1px dashed #dee2e6',
                      height: '100px',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Loader />
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ) : (
                reportData.map((vehicle, index) => (
                  <React.Fragment key={vehicle.name}>
                    <CTableRow>
                      <CTableDataCell className="text-center">
                        <CButton
                          className="border-0" // Reduce padding
                          style={{
                            width: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onClick={() => toggleRow(vehicle.name)}
                        >
                          {expandedRows.includes(vehicle.name) ? (
                            <div className="rounded-circle bg-danger d-flex align-items-center justify-content-center">
                              <Minus color="white" size={15} /> {/* Reduce icon size */}
                            </div>
                          ) : (
                            <div className="rounded-circle bg-success d-flex align-items-center justify-content-center">
                              <Plus color="white" size={15} /> {/* Reduce icon size */}
                            </div>
                          )}
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                      <CTableDataCell className="text-center">{vehicle.name}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {vehicle.startLat}
                        {vehicle.startLong}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{vehicle.distance} KM</CTableDataCell>
                      <CTableDataCell className="text-center">{vehicle.running}</CTableDataCell>
                      <CTableDataCell className="text-center">{vehicle.idle}</CTableDataCell>
                      <CTableDataCell className="text-center">{vehicle.stop}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {vehicle.endLat}
                        {vehicle.endLong}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {vehicle.maxSpeed.toFixed(2)} km/h
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {vehicle.avgSpeed.toFixed(2)} km/h
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell colSpan={12} className="p-0">
                        <CCollapse visible={expandedRows.includes(vehicle.name)}>
                          <CCard className="m-3">
                            <CCardBody>
                              <CTable hover responsive bordered>
                                <CTableHead>
                                  <CTableRow>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{ background: '#0a2d63', color: 'white' }}
                                    >
                                      SN
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Report Date
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Ignition Start
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Start Location
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Distance
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Running
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Idle
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Stop
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '200px',
                                      }}
                                    >
                                      Total Working Hours
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Max. Speed(km/h)
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Avg. Speed(km/h)
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      End Location
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      className="text-center"
                                      style={{
                                        background: '#0a2d63',
                                        color: 'white',
                                        minWidth: '120px',
                                      }}
                                    >
                                      Ignition Stop
                                    </CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                  {vehicle.dayWiseTrips.map((trip, index) => (
                                    <CTableRow key={index}>
                                      <CTableDataCell className="text-center">
                                        {index + 1}
                                      </CTableDataCell>{' '}
                                      {/**SN */}
                                      {/**Report Date */}
                                      <CTableDataCell className="text-center">
                                        {new Date(trip.date).toLocaleDateString()}
                                      </CTableDataCell>
                                      {/**Ignition Start*/}
                                      <CTableDataCell className="text-center">
                                        {formatDateTime(trip.startTime)}
                                      </CTableDataCell>
                                      {/**Start Locations */}
                                      <CTableDataCell className="text-center">
                                        {trip.startLatitude.toFixed(2)}
                                        {trip.startLongitude.toFixed(2)}
                                      </CTableDataCell>
                                      {/**Distance */}
                                      <CTableDataCell className="text-center">
                                        {trip.distance}
                                      </CTableDataCell>
                                      {/**Running */}
                                      <CTableDataCell className="text-center">
                                        {trip.runningTime}
                                      </CTableDataCell>
                                      {/**Idle */}
                                      <CTableDataCell className="text-center">
                                        {trip.idleTime}
                                      </CTableDataCell>
                                      {/**Stop */}
                                      <CTableDataCell className="text-center">
                                        {trip.stopTime}
                                      </CTableDataCell>
                                      {/**Working hours */}
                                      <CTableDataCell className="text-center">
                                        {trip.workingHours}
                                      </CTableDataCell>
                                      {/**Max Speed */}
                                      <CTableDataCell className="text-center">
                                        {trip.maxSpeed.toFixed(2)}
                                      </CTableDataCell>
                                      {/**Avg KM */}
                                      <CTableDataCell className="text-center">
                                        {trip.avgSpeed.toFixed(2)}
                                      </CTableDataCell>
                                      {/**End Location */}
                                      <CTableDataCell className="text-center">
                                        {trip.endLatitude}
                                        {trip.endLongitude}
                                      </CTableDataCell>
                                      {/**Ignition Stop */}
                                      <CTableDataCell className="text-center">
                                        {formatDateTime(trip.endTime)}
                                      </CTableDataCell>
                                    </CTableRow>
                                  ))}
                                </CTableBody>
                              </CTable>
                            </CCardBody>
                          </CCard>
                        </CCollapse>
                      </CTableDataCell>
                    </CTableRow>
                  </React.Fragment>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
        <div className="d-flex justify-content-center align-items-center">
          <CPagination align="center">
            <CPaginationItem
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </CPaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <CPaginationItem
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </CPaginationItem>
          </CPagination>
        </div>
      </CCard>
      <div className="position-fixed bottom-0 end-0 mb-5 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

const TravelReport = () => {
  const [formData, setFormData] = useState({
    Devices: '',
    Details: '',
    Periods: '',
    FromDate: '',
    ToDate: '',
    Columns: [],
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState([])
  const [selectedUserName, setSelectedUserName] = useState('')
  const [groups, setGroups] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false) //show mapping data
  const [columns] = useState([
    'Vehicle',
    'Start Address',
    'Total Distance',
    'Running',
    'Idle',
    'Stop',
    'End Address',
    'Max. Speed (km/h)',
    'Avg. Speed (km/h)',
  ])
  const [daywiseSummaryColumn] = useState([
    'Report Date',
    'Ignition Start',
    'Start Location',
    'Distance',
    'Running',
    'Idle',
    'Stop',
    'Total Working Hours',
    'Max. Speed (km/h)',
    'Avg. Speed (km/h)',
    'End Location',
    'Ignition Stop',
  ])
  const [selectedColumns, setSelectedColumns] = useState([])
  const token = Cookies.get('authToken')
  const [apiData, setApiData] = useState()
  const [statusLoading, setStatusLoading] = useState(false)
  const [putName, setPutName] = useState('')

  useEffect(() => {
    console.log('BHAIYAAAAAAAA PUTTTTT HOOOOOO GAYAAAAAAAAA', putName)
  }, [putName])

  // Get the selected device name from the device list based on formData.Devices
  const selectedDevice = devices.find((device) => device.deviceId === formData.Devices)
  const selectedDeviceName = selectedDevice ? selectedDevice.name : ''

  const handlePutName = (name) => {
    setPutName(name)
    console.log('putName', putName)
  }

  const getDevices = async (selectedGroup) => {
    const accessToken = Cookies.get('authToken')
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/device/getDeviceByGroup/${selectedGroup}`,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      if (response.data.success) {
        setDevices(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log('Error fetching data:', error)
      setDevices([])
      setLoading(false)
      throw error
    }
  }

  const selectedGroup = groups.find((group) => group.groupId === formData.Groups)
  const selectedGroupName = selectedGroup ? selectedGroup.name : ''

  // Function to get date range based on selectedPeriod
  const getDateRangeFromPeriod = (selectedPeriod) => {
    const today = new Date()
    let fromDate, toDate

    switch (selectedPeriod) {
      case 'Today':
        fromDate = new Date(today)
        toDate = new Date(today)
        break
      case 'Yesterday':
        fromDate = new Date(today)
        fromDate.setDate(today.getDate() - 1)
        toDate = new Date(fromDate)
        break
      case 'This Week':
        fromDate = new Date(today)
        const dayOfWeek = today.getDay() // 0 (Sunday) to 6 (Saturday)
        const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert Sunday to previous Monday
        fromDate.setDate(today.getDate() - daysSinceMonday) // Start from Monday of this week
        toDate = new Date(today) // Ends at today's date
        break
      case 'Previous Week':
        fromDate = new Date(today)
        const prevWeekDayOfWeek = today.getDay()
        const daysSinceLastMonday = prevWeekDayOfWeek === 0 ? 7 : prevWeekDayOfWeek // Ensure previous Monday calculation
        fromDate.setDate(today.getDate() - daysSinceLastMonday - 6) // Start of previous week (Monday)
        toDate = new Date(fromDate)
        toDate.setDate(fromDate.getDate() + 6) // End of previous week (Sunday)
        break
      case 'This Month':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1)
        toDate = new Date(today)
        break
      case 'Previous Month':
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        toDate = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      default:
        return 'N/A'
    }

    // Convert to UTC format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const toUTCString = (date) => date.toISOString()

    return `${toUTCString(fromDate)}&to=${toUTCString(toDate)}`
  }

  const getGroups = async (selectedUser = ' ') => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/group/${selectedUser}`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      if (response.data.groupsAssigned) {
        setGroups(response.data.groupsAssigned)
        setLoading(false)
        console.log('Perticular user ke groups')
      } else if (response.data.groups) {
        setGroups(response.data.groups)
        setLoading(false)
        console.log('All groups')
      }
    } catch (error) {
      setLoading(false)
      toast.error('Failed to load groups')
    }
  }

  const getUser = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data) {
        setUsers(response.data.users)
        setLoading(false)
        console.log('User fetch successfully')

        // After users are set, update selectedUserName based on formData.User
        const selectedUser = users.find((user) => user.userId === formData.User)
        const selectedUserName = selectedUser ? selectedUser.username : ''
        setSelectedUserName(selectedUserName)
        console.log('Selected Userrerrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:', selectedUserName)
      }
    } catch (error) {
      console.log('Error fetching data: ', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getUser()
    getGroups()
  }, [])

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    if (name === 'Columns') {
      setSelectedColumns(value)
    }
  }

  const handleSubmit = async () => {
    setStatusLoading(true)
    try {
      console.log(
        'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
        formData.Devices,
        formData.FromDate,
        formData.ToDate,
        formData.Periods,
      )
      const date =
        formData.FromDate && formData.ToDate
          ? `${toUTCString(formData.FromDate)}&to=${toUTCString(formData.ToDate)}`
          : getDateRangeFromPeriod(formData.Periods)
      console.log(date, 'DATE HAI YE')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reports/travel-summary-report?deviceIds=${formData.Devices}&from=${date}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (response.data) {
        setApiData(response.data) // Store API response
        setStatusLoading(false)
      }
    } catch (error) {
      setStatusLoading(false)
      toast.error('Failed to fetch data')
    }
  }

  // Example of extracting values similar to `selectedGroup`
  const selectedFromDate = formData.FromDate ? new Date(formData.FromDate).toLocaleDateString() : ''
  const selectedToDate = formData.ToDate ? new Date(formData.ToDate).toLocaleDateString() : ''
  const selectedPeriod = formData.Periods || ''

  console.log('Selected From Date:', selectedFromDate)
  console.log('Selected To Date:', selectedToDate)
  console.log('Selected Period:', selectedPeriod)

  console.log('API Data:', apiData)

  return (
    <>
      <CRow className="pt-3 gutter-0">
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader
              className="d-flex justify-content-between align-items-center text-white"
              style={{
                background: '#0a2d63',
                color: 'white',
              }}
            >
              <strong>Travel Summary</strong>
            </CCardHeader>
            <CCardBody>
              <SearchTravel
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                users={users}
                getGroups={getGroups}
                groups={groups}
                getDevices={getDevices}
                loading={loading}
                devices={devices}
                showMap={showMap}
                setShowMap={setShowMap}
                columns={columns}
                daywiseSummaryColumn={daywiseSummaryColumn}
                handlePutName={handlePutName}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {showMap && (
        <>
          <CRow className="justify-content-center mt-4 gutter-0">
            <CCol xs={12} className="px-4">
              <CCard className="p-0 mb-4 shadow-sm">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <strong>
                    Travel Summary {selectedDeviceName && `for ${selectedDeviceName}`}
                  </strong>{' '}
                </CCardHeader>
                <CCardBody>
                  <ShowSummary
                    formData={formData}
                    apiData={apiData}
                    statusLoading={statusLoading}
                    selectedDeviceName={selectedDeviceName}
                    selectedColumns={selectedColumns}
                    selectedGroupName={selectedGroupName}
                    daywiseSummaryColumn={daywiseSummaryColumn}
                    selectedUserName={putName}
                    selectedFromDate={selectedFromDate}
                    selectedToDate={selectedToDate}
                    selectedPeriod={selectedPeriod}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

SearchTravel.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  getGroups: PropTypes.func.isRequired,
  devices: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  getDevices: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  showMap: PropTypes.bool.isRequired,
  setShowMap: PropTypes.func.isRequired,
  handlePutName: PropTypes.func.isRequired,
}

export default TravelReport
