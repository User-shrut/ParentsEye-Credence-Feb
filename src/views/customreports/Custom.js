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

const CustomStyles = ({ formData, handleInputChange, handleSubmit, devices, groups, columns }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      handleSubmit();
    }
    setValidated(true);
  };

  const handlePeriodChange = (value) => {
    handleInputChange('Periods', value);
    setShowDateInputs(value === 'Custom');
  };

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      <CCol md={6}>
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
              <option key={device.id} value={device.id}>{device.name}</option>
            ))
          ) : (
            <option disabled>Loading devices...</option>
          )}
        </CFormSelect>

        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>

      <CCol md={6}>
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
      </CCol>

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

      <CCol md={4}>
        <CFormLabel htmlFor="type">Type</CFormLabel>
        <CFormSelect
          id="type"
          required
          value={formData.Type}
          onChange={(e) => handleInputChange('Type', e.target.value)}
        >
          <option value="">Choose a type...</option>
          <option value="Summary">Summary</option>
          <option value="Daily Summary">Daily Summary</option>
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid type.</CFormFeedback>
      </CCol>

      <CCol md={4}>
        <CFormLabel htmlFor="columns">Columns</CFormLabel>
        <CFormSelect
          id="columns"
          required
          value={formData.Columns}
          onChange={(e) => handleInputChange('Columns', e.target.value)}
        >
          <option value="">Choose a column...</option>
          {columns.map((column, index) => (
            <option key={index} value={column}>{column}</option>
          ))}
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid column.</CFormFeedback>
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
          <CButton color="primary" type="submit">
            SHOW NOW
          </CButton>
        </div>
      </CCol>
    </CForm>
  );
};

const CustomStyles1 = ({ rows, selectedColumn }) => {
  return (
    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Sr.No</CTableHeaderCell>
          <CTableHeaderCell>Devices</CTableHeaderCell>
          <CTableHeaderCell>Fix Time</CTableHeaderCell>
          <CTableHeaderCell>{selectedColumn}</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {rows.map((row) => (
          <CTableRow key={row.id} className="custom-row">
            <CTableDataCell>{row.id}</CTableDataCell>
            <CTableDataCell>{row.Devices}</CTableDataCell>
            <CTableDataCell>{row.Details}</CTableDataCell>
            <CTableDataCell>{row[selectedColumn]}</CTableDataCell>
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
    { id: 1, Devices: 'MH43BB1234', Details: 'Nagpur', Type: 'Active', StartDate: '2024-01-01', Distance: '500 km' },
    { id: 2, Devices: 'MH43BC1234', Details: 'Akola', Type: 'Active', StartDate: '2024-02-01', Distance: '600 km' },
  ]);
  const [formData, setFormData] = useState({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '', Columns: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState([]);
  const [groups, setGroups] = useState([]);
  const [columns] = useState(['Start Date', 'Distance', 'Odometer Start', 'Odometer End', 'Average Speed', 'Maximum Speed', 'Engine Hours', 'Spent Fuel']);
  const [selectedColumn, setSelectedColumn] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/devices', {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDevices(data); // Adjust if the structure of the response is different
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/groups', {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setGroups(data); // Adjust if the structure of the response is different
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchDevices();
    fetchGroups();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'Columns') {
      setSelectedColumn(value);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted with data:', formData);
  };

  return (
    <>
      <CRow>
        
          <h3>Custom Reports</h3>
        <CCol xs={12} md={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Validation</strong> <small>Custom styles</small>
            </CCardHeader>
            <CCardBody>
              <CustomStyles
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                devices={devices}
                groups={groups}
                columns={columns}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CustomStyles1 rows={rows} selectedColumn={selectedColumn} />
        </CCol>
      </CRow>
    </>
  );
};

export default Validation;
