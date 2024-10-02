import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import Select from 'react-select';
import Cookies from 'js-cookie';
import axios from 'axios';

const CustomStyles = ({ formData, handleInputChange, handleSubmit, devices, columns, showMap, setShowMap }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    console.log("handle submit ke pass hu");
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

      handleSubmit();
      setShowMap(true); //Show the mapping
    }
    setValidated(true);
  };

  const handlePeriodChange = (value) => {
    handleInputChange('Periods', value);
    setShowDateInputs(value === 'Custom');
  };

  // State to manage button text
  const [buttonText, setButtonText] = useState('SHOW NOW');
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  // Function to handle dropdown item clicks
  const handleDropdownClick = (text) => {
    setButtonText(text); // Change button text based on the clicked item
    setDropdownOpen(false); // Close the dropdown after selection
    handleSubmit(); // Submit form
    // setShowMap(true); // Show the map when form is valid and submitted
  };
  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      <CCol md={4}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>

        <CFormSelect
          id="devices"
          required
          value={formData.Devices}
          onChange={(e) => handleInputChange('Devices', e.target.value)}
        >
          <option value="">Choose a device...</option>
          {devices.length > 0 ? (
            devices.map((device) => (
              <option key={device.id} value={device.deviceId}>{device.name}</option>
            ))
          ) : (
            <option disabled>Loading devices...</option>
          )}
        </CFormSelect>

        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>

      {/* <CCol md={6}>
        <CFormLabel htmlFor="details">Groups</CFormLabel>
        <CFormSelect
          id="details"
          required
          value={formData.Details}
          onChange={(e) => handleInputChange('Details', e.target.value)}
        >
          <option value="">Choose a group...</option>
          {groups.length > 0 ? (
            groups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))
          ) : (
            <option disabled>Loading groups...</option>
          )}
        </CFormSelect>
        <CFormFeedback invalid>Please provide valid details.</CFormFeedback>
      </CCol> */}

      <CCol md={4}>
        <CFormLabel htmlFor="periods">Periods</CFormLabel>
        <CFormSelect
          id="periods"
          required
          value={formData.Periods}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="">Choose a period...</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="This Week">This Week</option>
          <option value="Previous Week">Previous Week</option>
          <option value="This Month">This Month</option>
          <option value="Previous Month">Previous Month</option>
          <option value="Custom">Custom</option>
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid period.</CFormFeedback>
      </CCol>

      {/* <CCol md={4}>
        <CFormLabel htmlFor="type">Type</CFormLabel>
        <CFormSelect
          id="type"
          required
          value={formData.Type}
          onChange={(e) => handleInputChange('Type', e.target.value)}
        >
          <option value="">Choose a type...</option>
          <option value="Stop">Stop</option>
          <option value="Daily Stop">Daily Stop</option>
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid type.</CFormFeedback>
      </CCol> */}

      <CCol md={4}>
        <CFormLabel htmlFor="columns">Columns</CFormLabel>
        {/* Use React-Select component for multi-select */}
        <Select
          isMulti
          id="columns"
          options={columns.map((column) => ({ value: column, label: column }))}
          value={formData.Columns.map((column) => ({ value: column, label: column }))}
          onChange={(selectedOptions) => handleInputChange('Columns', selectedOptions.map(option => option.value))}
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

      <CCol xs={12} >
        <div className="d-flex justify-content-end">
          <div className="btn-group">
            <button className="btn btn-primary " type="button" onClick={() => handleDropdownClick('SHOW NOW')}>
              {buttonText}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split"
              onClick={toggleDropdown} // Toggle dropdown on click
              aria-expanded={isDropdownOpen} // Update aria attribute
            >
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            {isDropdownOpen && ( // Conditionally render dropdown menu
              <ul className="dropdown-menu show ">
                <li>
                  <a className="dropdown-item" href='' onClick={() => handleDropdownClick('Show Now')}>
                    Show Now
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href='' onClick={() => handleDropdownClick('Export')}>
                    Export
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href='' onClick={() => handleDropdownClick('Email Reports')}>
                    Email Reports
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href='' onClick={() => handleDropdownClick('Schedule')}>
                    Schedule
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </CCol>
    </CForm>
  );
};

const CustomStyles1 = ({ rows, selectedColumns }) => {
  return (
    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          {/* <CTableHeaderCell>Sr.No</CTableHeaderCell> */}
          {/* <CTableHeaderCell>Devices</CTableHeaderCell> */}

          {/* Dynamically render table headers based on selected columns */}
          {selectedColumns.map((column, index) => (
            <CTableHeaderCell key={index}>{column}</CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {rows.map((row, rowIndex) => (
          <CTableRow key={row.id} className="custom-row">
            {/* <CTableDataCell>{rowIndex + 1}</CTableDataCell> */}
            {/* <CTableDataCell>{row.Devices}</CTableDataCell> */}
            {/* Dynamically render table cells based on selected columns */}
            {selectedColumns.map((column, index) => (
              <CTableDataCell key={index}>{row[column]}</CTableDataCell>
            ))}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

const Validation = () => {
  const username = 'school';
  const password = '123456';
  const [rows, setRows] = useState([
    { Devices: 'MH43BB1234', Details: 'Nagpur', Type: 'Active', StartDate: '2024-01-01', Distance: '500 km' },
    { Devices: 'MH43BC1234', Details: 'Akola', Type: 'Active', StartDate: '2024-02-01', Distance: '600 km' },
  ]);
  const [formData, setFormData] = useState({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '', Columns: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState([]);
  // const [groups, setGroups] = useState([]);
  const [showMap, setShowMap] = useState(false); //show mapping data
  const [columns] = useState([
    'Latitude',
    'Longitude',
    'Speed',
    'Course',
    'Altitude',
    'Accuracy',
    'Valid',
    'Protocol',
    'Address',
    'Devices time',
    'Fix time',
    'Server time',
    'Geofences',
    'Satellites',
    'Rssi',
    'Event',
    'Status',
    'Odometer',
    'Hours',
    'Battery level',
    'Ignition',
    'Charge',
    'Archive',
    'Distance',
    'Total distance',
    'Motion',
    'Block',
    'Adc1',
    'Iccid',
    'Alarm1 status',
    'Other status',
    'Alarm2 status',
    'Alarm3 status',
    'Engine status'
  ]);

  const [selectedColumns, setSelectedColumns] = useState([]);
  const token = Cookies.get('authToken'); //

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://credence-tracker.onrender.com/device', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        setDevices(data.devices); // Assuming the data returned contains device info
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'Columns') {
      setSelectedColumns(value);
    }
  };

  const handleSubmit = async () => {
    const body = {
      deviceId: formData.Devices, // Use the device ID from the form data
      period: formData.Periods, // Use the selected period from the form data
    };

    // Convert the dates to ISO format if they're provided
    const fromDate = formData.FromDate ? new Date(formData.FromDate).toISOString() : '';
    const toDate = formData.ToDate ? new Date(formData.ToDate).toISOString() : '';

    
    console.log(token);
    console.log(body);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/custom?deviceId=${body.deviceId}&period=${body.period}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Replace with your actual token
          'Content-Type': 'application/json',
        },
      });

      console.log("ye hai albaksh")
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRows(data); // Assuming the data returned is what you want to display in the table
      console.log('Form submitted with data:', body);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  return (
    <>
      <CRow className='pt-3'>
        <h2 className='px-4'>Custom Report</h2>
        <CCol xs={12} md={12} className='px-4'>
          <CCard className="mb-4 p-0 shadow-lg rounded" >
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Custom Report</strong>

            </CCardHeader>
            <CCardBody>
              <CustomStyles
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                devices={devices}
                // groups={groups}
                showMap={showMap}
                setShowMap={setShowMap}
                columns={columns}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {showMap && (
        <CRow className="justify-content-center mt-4">
          <CCol xs={12} className="px-4" >
            <CCard className='p-0 mb-4 shadow-sm'>
              <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
                <strong>All Custom Report List</strong>
                <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                />
              </CCardHeader>
              <CCardBody>
                <CustomStyles1 rows={rows} selectedColumns={selectedColumns} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

    </>
  );
};

export default Validation;