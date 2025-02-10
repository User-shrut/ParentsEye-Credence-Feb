/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Select from 'react-select'
import axios from 'axios'
import Cookies from 'js-cookie'
import { IconButton, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormSelect,
  CInputGroupText,
  CInputGroup,
  CFormTextarea,
  CButton,
} from '@coreui/react'
// import './index.css'
import './raise.css'
import DateRangeFilter from '../../../components/DateRangeFIlter/DateRangeFIlter'
import { Pagination } from 'react-bootstrap'
import { jwtDecode } from 'jwt-decode'
import { FaRegFilePdf, FaPrint } from 'react-icons/fa6'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaArrowUp } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import IconDropdown from '../../../components/ButtonDropdown'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const TICKET_TYPES = [
  'Vehicle Offline',
  'Account Related',
  'Software Demo',
  'Video Demo Request',
  'Explain Software Feature',
  'Software Error',
  'Other',
]

function Contact() {
  const { deviceId: urlDeviceId } = useParams()
  const navigate = useNavigate()
  const token = Cookies.get('authToken')
  let decodedToken
  if (token) {
    decodedToken = jwtDecode(token)
  }
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', decodedToken)

  // State
  const [activeButton, setActiveButton] = useState(null)
  const [vehicleData, setVehicleData] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [vehicleId, setVehicleId] = useState(urlDeviceId || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [formData, setFormData] = useState({
    vehicle: '',
    ticketType: '',
    description: '',
  })
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    answered: 0,
    closed: 0,
  })
  const [ticketData, setTicketData] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  // Fetch vehicles
  const fetchDevices = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/device`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const devices = response.data.devices.map((device) => ({
        value: device._id,
        label: device.name,
      }))
      setVehicleData(devices)
    } catch (error) {
      console.error('Error fetching devices:', error.message)
    }
  }, [token])

  // Fetch Post Raise ticket
  const fetchRaiseTicket = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/help-and-support/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        },
      )
      setVisible(false)
      setFormData({ vehicle: '', ticketType: '', description: '' })
    } catch (error) {
      console.error('Error raising ticket:', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Get Raise Ticket
  const fetchRaiseTicketGet = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/help-and-support/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('Ticket Data Response:', response.data.issues) // Check the structure
      const filteredTicketsRaisedBy = response.data.issues.filter(
        (ticket) => ticket.raisedBy === decodedToken.username,
      )
      setTicketData(filteredTicketsRaisedBy)
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    fetchRaiseTicket()
    fetchRaiseTicketGet()
    console.log('FETCH HUA')
  }

  const handleDeviceChange = (selectedOption) => {
    setVehicleId(selectedOption ? selectedOption.value : '')
    setFormData((prev) => ({ ...prev, vehicle: selectedOption ? selectedOption.value : '' }))
  }

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  const handleButtonClick = (buttonType) => {
    setActiveButton(activeButton === buttonType ? null : buttonType)
    setFilterStatus(buttonType)
  }

  const handleDateRangeChange = (startDate, endDate) => {
    console.log('Date range changed:', { startDate, endDate })
    setStartDate(startDate)
    setEndDate(endDate)
  }

  useEffect(() => {
    fetchDevices()
    fetchRaiseTicketGet()
  }, [])

  useEffect(() => {
    // Calculate counts for each status
    const counts = {
      all: ticketData.length,
      pending: ticketData.filter((ticket) => ticket.status === 'pending').length,
      answered: ticketData.filter((ticket) => ticket.status === 'answered').length,
      closed: ticketData.filter((ticket) => ticket.status === 'closed').length,
    }
    setStatusCounts(counts)
    console.log('counts', counts)
    console.log('assssssssssssssssssssssss', vehicleData)
    console.log('lllllllllllllllllllllllllllllllllllllllllllllll', decodedToken.username)
  }, [ticketData])

  const filteredTickets = ticketData.filter((ticket) => {
    if (!ticket) return false

    // Ticket type filter
    const matchesTicketType = formData.ticketType ? ticket.ticketType === formData.ticketType : true

    // Status filter
    const matchesStatus = filterStatus === 'all' ? true : ticket.status === filterStatus

    // Search term filter
    const matchesSearchTerm = searchTerm
      ? ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    // Date range filter
    const processedStartDate = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null
    const processedEndDate = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null
    const ticketDateAdded = new Date(ticket.createdAt)
    const ticketDateUpdated = new Date(ticket.updatedAt)

    const matchesDateRange =
      (processedStartDate ? ticketDateAdded >= processedStartDate : true) &&
      (processedEndDate ? ticketDateAdded <= processedEndDate : true) &&
      (processedStartDate ? ticketDateUpdated >= processedStartDate : true) &&
      (processedEndDate ? ticketDateUpdated <= processedEndDate : true)

    // Combine all filters
    return matchesTicketType && matchesStatus && matchesSearchTerm && matchesDateRange
  })

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const { key, direction } = sortConfig
    if (!key) return 0

    let aValue = a[key]
    let bValue = b[key]

    // Handle null/undefined values
    aValue = aValue ?? ''
    bValue = bValue ?? ''

    // Special handling for date fields
    if (key === 'createdAt' || key === 'updatedAt') {
      const aDate = new Date(aValue)
      const bDate = new Date(bValue)
      return direction === 'asc' ? aDate - bDate : bDate - aDate
    }

    // String comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    // Numeric comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    // Fallback to string comparison
    return direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  // PAGINATION LOGIN
  const [rowsPerPage, setRowsPerPage] = useState(5) // Default to 5 rows per page

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // Change as needed
  const totalPages = rowsPerPage === 'All' ? 1 : Math.ceil(sortedTickets.length / rowsPerPage)
  const paginatedTickets =
    rowsPerPage === 'All'
      ? sortedTickets
      : sortedTickets.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  // Function to export table data to Excel
  const exportToExcel = async () => {
    try {
      // Validate that there is data to export
      if (!Array.isArray(sortedTickets) || sortedTickets.length === 0) {
        throw new Error('No data available for Excel export')
      }

      // Configuration constants for styling and columns
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
        // Define columns to match your UI table
        columns: [
          { header: 'Ticket ID', width: 15 },
          { header: 'Raised By', width: 20 },
          { header: 'Vehicle No', width: 20 },
          { header: 'Ticket Type', width: 20 },
          { header: 'Status', width: 15 },
          { header: 'Added', width: 25 },
          { header: 'Updated', width: 25 },
          { header: 'Description', width: 50 },
        ],
        company: {
          name: 'Credence Tracker',
          copyright: `© ${new Date().getFullYear()} Credence Tracker`,
        },
      }

      // Helper function to format date strings (adjust as needed)
      const formatExcelDate = (dateString) => {
        if (!dateString) return '--'
        const date = new Date(dateString)
        return isNaN(date) ? '--' : date.toLocaleString('en-GB')
      }

      // Initialize workbook and worksheet using ExcelJS
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Tickets Report')

      // Add header section: company title, report title, and metadata
      const addHeaderSection = () => {
        // Company title row
        const titleRow = worksheet.addRow([CONFIG.company.name])
        titleRow.font = { ...CONFIG.styles.titleFont, color: { argb: CONFIG.styles.textColor } }
        titleRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: CONFIG.styles.primaryColor },
        }
        titleRow.alignment = { horizontal: 'center' }
        worksheet.mergeCells('A1:H1')

        // Report title row
        const reportTitleRow = worksheet.addRow(['Tickets Report'])
        reportTitleRow.font = {
          ...CONFIG.styles.titleFont,
          size: 14,
          color: { argb: CONFIG.styles.textColor },
        }
        reportTitleRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: CONFIG.styles.secondaryColor },
        }
        reportTitleRow.alignment = { horizontal: 'center' }
        worksheet.mergeCells('A2:H2')

        // Metadata rows (adjust these as needed)
        worksheet.addRow([`Generated by: ${decodedToken?.username || 'N/A'}`])
        // worksheet.addRow([`Selected User: ${selectedUserName || 'N/A'}`])
        worksheet.addRow([`Date: ${new Date().toLocaleString()}`])
        worksheet.addRow([]) // Spacer row
      }

      // Add the data table with headers and rows
      const addDataTable = () => {
        // Add column headers from the configuration
        const headerRow = worksheet.addRow(CONFIG.columns.map((col) => col.header))
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

        // Add a row for each ticket in sortedTickets
        sortedTickets.forEach((ticket) => {
          const rowData = [
            ticket.ticketId,
            ticket.raisedBy || 'N/A',
            ticket.vehicleName || 'N/A',
            ticket.ticketType,
            ticket.status,
            formatExcelDate(ticket.createdAt),
            formatExcelDate(ticket.updatedAt),
            ticket.description,
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

        // Set the column widths based on the configuration
        worksheet.columns = CONFIG.columns.map((col) => ({
          width: col.width,
          style: { alignment: { horizontal: 'left' } },
        }))
      }

      // Add footer section
      const addFooter = () => {
        worksheet.addRow([]) // Spacer row
        const footerRow = worksheet.addRow([CONFIG.company.copyright])
        footerRow.font = { italic: true }
        worksheet.mergeCells(`A${footerRow.number}:H${footerRow.number}`)
      }

      // Build the Excel document
      addHeaderSection()
      addDataTable()
      addFooter()

      // Generate the workbook as a buffer and create a Blob
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const filename = `Tickets_Report_${new Date().toISOString().split('T')[0]}.xlsx`
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
      // Ensure that we have data to export
      if (!Array.isArray(sortedTickets) || sortedTickets.length === 0) {
        throw new Error('No data available for PDF export')
      }

      // Configuration constants
      const CONFIG = {
        colors: {
          primary: [10, 45, 99],
          secondary: [70, 70, 70],
          border: [220, 220, 220],
          background: [249, 250, 251],
        },
        company: {
          name: 'Credence Tracker',
          logo: { x: 15, y: 15, size: 8 },
        },
        layout: {
          margin: 15,
          lineHeight: 6,
        },
        fonts: {
          primary: 'helvetica',
          secondary: 'courier',
        },
      }

      // Initialize jsPDF in landscape mode for an A4 page
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Helper functions
      const applyPrimaryColor = () => {
        doc.setFillColor(...CONFIG.colors.primary)
        doc.setTextColor(...CONFIG.colors.primary)
      }

      const applySecondaryColor = () => {
        doc.setTextColor(...CONFIG.colors.secondary)
      }

      const addHeader = () => {
        // Draw company logo (as a filled rectangle for example) and company name
        doc.setFillColor(...CONFIG.colors.primary)
        doc.rect(
          CONFIG.company.logo.x,
          CONFIG.company.logo.y,
          CONFIG.company.logo.size,
          CONFIG.company.logo.size,
          'F',
        )
        doc.setFont(CONFIG.fonts.primary, 'bold')
        doc.setFontSize(16)
        doc.text(CONFIG.company.name, 28, 21)

        // Draw a header line
        doc.setDrawColor(...CONFIG.colors.primary)
        doc.setLineWidth(0.5)
        doc.line(CONFIG.layout.margin, 25, doc.internal.pageSize.width - CONFIG.layout.margin, 25)
      }

      // (Optional) Metadata – adjust or remove if not needed
      const addMetadata = () => {
        const metadata = [
          { label: 'User:', value: decodedToken?.username || 'N/A' },
          // Add more metadata fields here if needed
        ]

        doc.setFontSize(10)
        doc.setFont(CONFIG.fonts.primary, 'bold')

        let yPosition = 45
        const xPosition = 15

        metadata.forEach((item) => {
          doc.text(`${item.label} ${item.value.toString()}`, xPosition, yPosition)
          yPosition += CONFIG.layout.lineHeight
        })
      }

      const addFooter = () => {
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          // Draw a footer line
          doc.setDrawColor(...CONFIG.colors.border)
          doc.setLineWidth(0.5)
          doc.line(
            CONFIG.layout.margin,
            doc.internal.pageSize.height - 15,
            doc.internal.pageSize.width - CONFIG.layout.margin,
            doc.internal.pageSize.height - 15,
          )
          // Copyright text
          doc.setFontSize(9)
          applySecondaryColor()
          doc.text(
            `© ${CONFIG.company.name}`,
            CONFIG.layout.margin,
            doc.internal.pageSize.height - 10,
          )
          // Page number
          const pageNumber = `Page ${i} of ${pageCount}`
          const pageNumberWidth = doc.getTextWidth(pageNumber)
          doc.text(
            pageNumber,
            doc.internal.pageSize.width - CONFIG.layout.margin - pageNumberWidth,
            doc.internal.pageSize.height - 10,
          )
        }
      }

      // Date formatting function matching your table format
      const formatDate = (dateString) => {
        if (!dateString) return '--'
        const date = new Date(dateString)
        return isNaN(date)
          ? '--'
          : date
            .toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            .replace(',', '')
      }

      // Begin PDF creation
      addHeader()

      // Title and generation date
      doc.setFontSize(24)
      doc.setFont(CONFIG.fonts.primary, 'bold')
      doc.text('Tickets Report', CONFIG.layout.margin, 35)

      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      const dateText = `Generated: ${currentDate}`
      applySecondaryColor()
      doc.setFontSize(10)
      doc.text(
        dateText,
        doc.internal.pageSize.width - CONFIG.layout.margin - doc.getTextWidth(dateText),
        21,
      )

      addMetadata()

      // Prepare table columns to match your UI table
      const tableColumns = [
        'Ticket ID',
        'Raised By',
        'Vehicle No',
        'Ticket Type',
        'Status',
        'Added',
        'Updated',
        'Description',
      ]

      // Map your sortedTickets to table rows
      const tableRows = sortedTickets.map((ticket) => [
        ticket.ticketId,
        ticket.raisedBy || 'N/A',
        ticket.vehicleName || 'N/A',
        ticket.ticketType,
        ticket.status,
        formatDate(ticket.createdAt),
        formatDate(ticket.updatedAt),
        ticket.description,
      ])

      // Generate the table using autoTable
      doc.autoTable({
        startY: 65,
        head: [tableColumns],
        body: tableRows,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
          halign: 'center',
          lineColor: CONFIG.colors.border,
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: CONFIG.colors.primary,
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: CONFIG.colors.background,
        },
        margin: { left: CONFIG.layout.margin, right: CONFIG.layout.margin },
        didDrawPage: (data) => {
          // Optionally add a title on subsequent pages
          if (doc.getCurrentPageInfo().pageNumber > 1) {
            doc.setFontSize(15)
            doc.setFont(CONFIG.fonts.primary, 'bold')
            doc.text('Tickets Report', CONFIG.layout.margin, 10)
          }
        },
      })

      addFooter()

      // Save the PDF file
      const filename = `Tickets_Report_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />

      {/* Header */}
      <div
        className="shadow d-flex align-items-center ps-3 mb-3 "
        style={{ height: '50px' }}
      >
        <h5 className="m-0">Raise Ticket</h5>
      </div>

      <div className="px-3 mt-3">
        {/* Button Filters */}
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-2">
            {['all', 'pending', 'answered', 'closed'].map((type) => (
              <button
                key={type}
                className={`btn button-${type}-filter fw-bold ${activeButton === type ? 'active' : ''
                  }`}
                onClick={() => handleButtonClick(type)}
                style={{ fontSize: '14px' }}
              >
                {type.toUpperCase()} : {statusCounts[type] || 0}
              </button>
            ))}
          </div>
          {/* <button
            className="btn border-0 back-hover fw-semibold"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button> */}
        </div>
        <hr />
        {/* Table */}
        <CRow>
          <CCol xs>
            <CCard className="mb-4">
              <CCardHeader className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3">
                  <div className="d-flex align-items-center">
                    <InputBase
                      type="search"
                      className="form-control border-end-0 rounded-0"
                      style={{ height: '40px', width: '250px' }}
                      placeholder="Search for Tickets"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton
                      className="bg-white rounded-0 border disable"
                      style={{ height: '40px' }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                  {/* Filters */}
                  <div className="d-flex gap-3 align-items-center">
                    <CFormSelect
                      style={{ width: '300px', height: '40px' }}
                      value={formData.ticketType}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, ticketType: e.target.value }))
                      }
                    >
                      <option value="" disabled>
                        Ticket Types
                      </option>
                      <option value="">All</option>

                      {TICKET_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </CFormSelect>

                    <div className="d-flex gap-3">
                      <DateRangeFilter
                        onDateRangeChange={handleDateRangeChange}
                        title="Added Date Filter"
                      />
                      <DateRangeFilter
                        onDateRangeChange={handleDateRangeChange}
                        title="Update Date Filter"
                      />
                    </div>
                  </div>
                </div>
                <button className="btn add" onClick={() => setVisible(true)}>
                  <Plus size={18} /> Add
                </button>
              </CCardHeader>

              <CCardBody>
                <CTable bordered hover responsive className="mb-0 border rounded-4">
                  <CTableHead>
                    <CTableRow>
                      {[
                        'ticketId',
                        'raisedBy',
                        'vehicleNo',
                        'ticketType',
                        'status',
                        'createdAt', // Changed from 'added'
                        'updatedAt', // Changed from 'updated'
                        'description',
                      ].map((key) => (
                        <CTableHeaderCell
                          style={{ backgroundColor: '#0a2d63' }}
                          key={key}
                          onClick={() => handleSort(key)}
                          className="text-center text-white cursor-pointer"
                        >
                          {/* Update display text for date columns */}
                          {key === 'createdAt'
                            ? 'Added'
                            : key === 'updatedAt'
                              ? 'Updated'
                              : key.charAt(0).toUpperCase() + key.slice(1)}
                          {getSortIcon(key)}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>

                  <CTableBody style={{ fontSize: '14px' }}>
                    {loading ? (
                      <CTableRow>
                        <CTableDataCell colSpan={8} className="text-center">
                          <div className="placeholder-glow">
                            {[...Array(4)].map((_, index) => (
                              <p key={index} className="card-text placeholder-glow">
                                <span className="placeholder col-12" />
                              </p>
                            ))}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : paginatedTickets.length > 0 ? (
                      paginatedTickets.map((ticket) => (
                        <CTableRow key={ticket.id}>
                          <CTableDataCell>{ticket.ticketId}</CTableDataCell>
                          <CTableDataCell>{ticket.raisedBy || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{ticket.vehicleName || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{ticket.ticketType}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              className={`badge ${ticket.status === 'pending'
                                ? 'bg-danger'
                                : ticket.status === 'answered'
                                  ? 'bg-warning'
                                  : ticket.status === 'closed'
                                    ? 'bg-success'
                                    : 'bg-info'
                                }`}
                            >
                              {ticket.status}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{formatDate(ticket.createdAt)}</CTableDataCell>
                          <CTableDataCell>{formatDate(ticket.updatedAt)}</CTableDataCell>
                          <CTableDataCell>{ticket.description}</CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={8} className="text-center">
                          No Tickets Available
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                {/* Pagination */}
                {rowsPerPage !== 'All' && (
                  <div className="mt-3 d-flex justify-content-center">
                    <Pagination>
                      <Pagination.Prev
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />

                      {/* Add "First" and ellipsis if needed */}
                      {currentPage > 3 && (
                        <>
                          <Pagination.Item onClick={() => setCurrentPage(1)}>1</Pagination.Item>
                          {currentPage > 4 && <Pagination.Ellipsis />}
                        </>
                      )}

                      {/* Generate pages around the current page */}
                      {Array.from({ length: 5 }, (_, i) => {
                        const page = currentPage - 2 + i
                        if (page > 0 && page <= totalPages) {
                          return (
                            <Pagination.Item
                              key={page}
                              active={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Pagination.Item>
                          )
                        }
                        return null
                      })}

                      {/* Add ellipsis and "Last" if needed */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && <Pagination.Ellipsis />}
                          <Pagination.Item onClick={() => setCurrentPage(totalPages)}>
                            {totalPages}
                          </Pagination.Item>
                        </>
                      )}

                      <Pagination.Next
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
                {/* Rows Per Page Selector */}
                <div className="mb-3 mt-3 d-flex justify-content-center gap-3 align-items-center">
                  <span>
                    Showing {paginatedTickets.length} of {filteredTickets.length} tickets
                  </span>
                  <div className="d-flex align-items-center gap-2">
                    <CFormSelect
                      value={rowsPerPage}
                      onChange={(e) => {
                        const value =
                          e.target.value === 'Custom'
                            ? 'Custom'
                            : e.target.value === 'All'
                              ? 'All'
                              : parseInt(e.target.value, 10)
                        setRowsPerPage(value)
                        setCurrentPage(1) // Reset to first page when rows per page changes
                      }}
                      style={{ width: '80px' }}
                    >
                      <option value="All">All</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </CFormSelect>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {/* Add Ticket Modal */}
      <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>User Support Tickets</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={handleFormSubmit}>
            <CCol md={6}>
              <CFormLabel htmlFor="vehicle">Vehicle (optional)</CFormLabel>
              <Select
                id="vehicle-type"
                value={vehicleData.find((option) => option.value === formData.vehicle)}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({ ...prev, vehicle: selectedOption?.label || '' }))
                }
                options={vehicleData}
                placeholder="Search for Vehicle"
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect
                id="ticketType"
                label="Ticket Type *"
                required
                value={formData.ticketType}
                onChange={(e) => setFormData((prev) => ({ ...prev, ticketType: e.target.value }))}
              >
                <option value="">Select Ticket Type</option>
                {TICKET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CInputGroup>
              <CInputGroupText>Description</CInputGroupText>
              <CFormTextarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </CInputGroup>
            <CButton
              type="submit"
              className="text-white"
              style={{ backgroundColor: '#0a2d63' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
      <div className="position-fixed bottom-0 end-0 mb-5 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default Contact
