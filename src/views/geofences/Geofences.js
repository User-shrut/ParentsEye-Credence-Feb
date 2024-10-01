import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import Gmap from '../Googlemap/Gmap'
import CloseIcon from '@mui/icons-material/Close'
import { GoogleMap, Marker, Polygon, useLoadScript } from '@react-google-maps/api'

const Geofences = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState()

  const handleEditModalClose = () => setEditModalOpen(false)
  const handleAddModalClose = () => setAddModalOpen(false)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    bgcolor: 'background.paper',
    color: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  // ############ map code #################################

  const [selectedLocation, setSelectedLocation] = useState({ lat: 21.1458, lng: 79.0882 })
  const [polygonCoords, setPolygonCoords] = useState([])

  // Load Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAvHHoPKPwRFui0undeEUrz00-8w6qFtik', // Replace with your API key
  })

  const onMapClick = (event) => {
    const newCoords = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
    setPolygonCoords((prev) => [...prev, newCoords]) // Add new coordinates to the polygon
    setSelectedLocation(newCoords)
  }

  if (polygonCoords) {
    console.log('this is selected points', polygonCoords)
  }

  // ######################### get geofences ##############################################
  const fetchGeofenceData = async (page = 1) => {
    const accessToken = Cookies.get('authToken')
    const url = `${import.meta.env.VITE_API_URL}/geofence?page=${page}&limit=${limit}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data.geofences) {
        setData(response.data.geofences)
        setPageCount(response.data.pagination.totalPages)
        console.log(response.data.geofences)
        console.log(response.data.pagination.totalPages)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  useEffect(() => {
    fetchGeofenceData()
  }, [])

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setLoading(true)
    fetchGeofenceData(page)
  }

  // ################ add geofence #########################################

  const handleAddGeofence = async (e) => {
    e.preventDefault()
    console.log(polygonCoords)
    console.log(formData)
    const updatedFormData = {
      ...formData,
      area: polygonCoords, // Add your polygonCoords here
    };

    console.log("this is updated formdata: ", updatedFormData);

    try {
      const accessToken = Cookies.get('authToken');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/geofence`, updatedFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status == 201) {
        alert('Geofence is created successfully')
        fetchGeofenceData()
        setFormData({})
        setPolygonCoords([]);
        setAddModalOpen(false)
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }


  // ###########################################################################
  // ######################  Edit Geofence ###################################

  const EditGeofenceSubmit = async (e) => {
    e.preventDefault()
    console.log(formData);
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/Geofence/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        alert('Geofence is edited successfully')
        fetchGeofenceData();
        setFormData({})
        setPolygonCoords([]);
        setEditModalOpen(false)
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const handleEditGeofence = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({...item})
    console.log("this is before edit",formData)
  }


  // #########################################################################

  // ######################## Delete Geofence ################################

  const deleteGeofenceSubmit = async(item) => {
    alert("you want to delete this Geofence");
    console.log(item)

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/Geofence/${item._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        },
      )

      if (response.status === 200) {
        alert('Geofence is deleted successfully');
        fetchGeofenceData();
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  //  ###############################################################


  return (
    <div className="m-3">
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Geofence</h2>
        </div>

        <div className="d-flex">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => setAddModalOpen(true)}
              variant="contained"
              className="btn btn-success text-white"
            >
              Add Geofence
            </button>
          </div>
        </div>
      </div>
      <div className="d-md-none mb-2">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <TableContainer component={Paper} style={{ maxHeight: '800px', marginBottom: '10px' }}>
            {loading ? (
              <>
                <div className="text-nowrap mb-2" style={{ width: '240px' }}>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-6" />
                    <span className="placeholder col-8" />
                  </p>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-6" />
                    <span className="placeholder col-8" />
                  </p>
                </div>
              </>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell
                      className="bg-body-tertiary text-center"
                      style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                    >
                      Geofence Name
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="bg-body-tertiary text-center"
                      style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                    >
                      Type
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="bg-body-tertiary text-center"
                      style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                    >
                      Assign To
                    </CTableHeaderCell>

                    <CTableHeaderCell
                      className="bg-body-tertiary text-center"
                      style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                    >
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data?.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">{item.name}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.type}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.assignType}</CTableDataCell>
                      <CTableDataCell
                        className="text-center d-flex"
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                      >
                        <IconButton aria-label="edit" onClick={() => handleEditGeofence(item)}>
                          <RiEdit2Fill
                            style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }}
                          />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => deleteGeofenceSubmit(item)}>
                          <AiFillDelete
                            style={{ fontSize: '25px', color: 'red', margin: '5.3px' }}
                          />
                        </IconButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </TableContainer>
          {pageCount > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount} // Set based on the total pages from the API
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              marginPagesDisplayed={2}
              containerClassName="pagination justify-content-center"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          )}
        </div>
        <div className="col-12 col-md-6">
          <div style={{ flex: 1 }}>{data.length > 0 && <Gmap data={data} />}</div>
        </div>
      </div>
      
      <Modal
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Geofence
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleAddModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddGeofence}>
              <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
                Select Geofence Location:
              </Typography>
              {/* Check if Google Maps is loaded */}
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ height: '300px', width: '100%' }}
                  center={selectedLocation}
                  zoom={13}
                  onClick={onMapClick} // Set marker on click
                >
                  {polygonCoords.length > 0 && (
                    <Polygon
                      paths={polygonCoords}
                      options={{
                        fillColor: 'lightblue',
                        fillOpacity: 0.5,
                        strokeColor: 'blue',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                      }}
                    />
                  )}
                  <Marker position={selectedLocation} />
                </GoogleMap>
              ) : (
                <div>Loading Google Maps...</div>
              )}
              <br />
              <TextField
              fullWidth
                label="Geofence Name"
                name="name"
                value={formData.name !== undefined ? formData.name : ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Placetype</InputLabel>
                <Select
                  value={formData.type !== undefined ? formData.type : ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  fullWidth
                >
                  <MenuItem value="ATM">ATM</MenuItem>
                  <MenuItem value="Airport">Airport</MenuItem>
                  <MenuItem value="Bank">Bank</MenuItem>
                  <MenuItem value="Beach">Beach</MenuItem>
                  <MenuItem value="Bus_Stop">Bus Stop</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Dairy">Dairy</MenuItem>
                  <MenuItem value="District">District</MenuItem>
                  <MenuItem value="Facility">Facility</MenuItem>
                  <MenuItem value="Factory">Factory</MenuItem>
                  <MenuItem value="Fuel_Station">Fuel Station</MenuItem>
                  <MenuItem value="Highway_point">Highway Point</MenuItem>
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Hospital">Hospital</MenuItem>
                  <MenuItem value="Hotel">Hotel</MenuItem>
                  <MenuItem value="Mosque">Mosque</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Police_Station">Police Station</MenuItem>
                  <MenuItem value="Post_Office">Post Office</MenuItem>
                  <MenuItem value="Railway_Station">Railway Station</MenuItem>
                  <MenuItem value="Recycle_Station">Recycle Station</MenuItem>
                  <MenuItem value="School">School</MenuItem>
                  <MenuItem value="Traffic_Signal">Traffic Signal</MenuItem>
                  <MenuItem value="State_Border">State Border</MenuItem>
                  <MenuItem value="Sub_Division">Sub Division</MenuItem>
                  <MenuItem value="Temple">Temple</MenuItem>
                  <MenuItem value="Theater">Theater</MenuItem>
                  <MenuItem value="Theme_Park">Theme Park</MenuItem>
                  <MenuItem value="Toll_Gate">Toll Gate</MenuItem>
                  <MenuItem value="Tunnel">Tunnel</MenuItem>
                  <MenuItem value="University">University</MenuItem>
                  <MenuItem value="Way_Bridge">Way Bridge</MenuItem>
                  <MenuItem value="Sensative_Points">Sensitive Points</MenuItem>
                  <MenuItem value="Dumping_Yard">Dumping Yard</MenuItem>
                  <MenuItem value="Mine">Mine</MenuItem>
                  <MenuItem value="No_POI_Report">No POI Report</MenuItem>
                  <MenuItem value="Entry_Restriction">Entry Restriction</MenuItem>
                  <MenuItem value="Tyre_Shop">Tyre Shop</MenuItem>
                  <MenuItem value="Workshop">Workshop</MenuItem>
                  <MenuItem value="Yard">Yard</MenuItem>
                  <MenuItem value="Parking_Place">Parking Place</MenuItem>
                  <MenuItem value="Driver_Home">Driver Home</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Puspakom">Puspakom</MenuItem>
                  <MenuItem value="Exit_Restriction">Exit Restriction</MenuItem>
                  <MenuItem value="Gurudwara">Gurudwara</MenuItem>
                  <MenuItem value="Church">Church</MenuItem>
                  <MenuItem value="Distributor">Distributor</MenuItem>
                  <MenuItem value="State">State</MenuItem>
                  <MenuItem value="WaterFall">WaterFall</MenuItem>
                  <MenuItem value="Depot">Depot</MenuItem>
                  <MenuItem value="Terminal">Terminal</MenuItem>
                  <MenuItem value="Port">Port</MenuItem>
                </Select>
              </FormControl>
              

              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit New Geofence
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleEditModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={EditGeofenceSubmit}>
              <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
                Select Geofence Location:
              </Typography>
              {/* Check if Google Maps is loaded */}
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ height: '300px', width: '100%' }}
                  center={selectedLocation}
                  zoom={13}
                  onClick={onMapClick} // Set marker on click
                >
                  {polygonCoords.length > 0 && (
                    <Polygon
                      paths={polygonCoords}
                      options={{
                        fillColor: 'lightblue',
                        fillOpacity: 0.5,
                        strokeColor: 'blue',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                      }}
                    />
                  )}
                  <Marker position={selectedLocation} />
                </GoogleMap>
              ) : (
                <div>Loading Google Maps...</div>
              )}
              <br />
              <TextField
              fullWidth
                label="Geofence Name"
                name="name"
                value={formData.name !== undefined ? formData.name : ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Placetype</InputLabel>
                <Select
                  value={formData.type !== undefined ? formData.type : ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  fullWidth
                >
                  <MenuItem value="ATM">ATM</MenuItem>
                  <MenuItem value="Airport">Airport</MenuItem>
                  <MenuItem value="Bank">Bank</MenuItem>
                  <MenuItem value="Beach">Beach</MenuItem>
                  <MenuItem value="Bus_Stop">Bus Stop</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Dairy">Dairy</MenuItem>
                  <MenuItem value="District">District</MenuItem>
                  <MenuItem value="Facility">Facility</MenuItem>
                  <MenuItem value="Factory">Factory</MenuItem>
                  <MenuItem value="Fuel_Station">Fuel Station</MenuItem>
                  <MenuItem value="Highway_point">Highway Point</MenuItem>
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Hospital">Hospital</MenuItem>
                  <MenuItem value="Hotel">Hotel</MenuItem>
                  <MenuItem value="Mosque">Mosque</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Police_Station">Police Station</MenuItem>
                  <MenuItem value="Post_Office">Post Office</MenuItem>
                  <MenuItem value="Railway_Station">Railway Station</MenuItem>
                  <MenuItem value="Recycle_Station">Recycle Station</MenuItem>
                  <MenuItem value="School">School</MenuItem>
                  <MenuItem value="Traffic_Signal">Traffic Signal</MenuItem>
                  <MenuItem value="State_Border">State Border</MenuItem>
                  <MenuItem value="Sub_Division">Sub Division</MenuItem>
                  <MenuItem value="Temple">Temple</MenuItem>
                  <MenuItem value="Theater">Theater</MenuItem>
                  <MenuItem value="Theme_Park">Theme Park</MenuItem>
                  <MenuItem value="Toll_Gate">Toll Gate</MenuItem>
                  <MenuItem value="Tunnel">Tunnel</MenuItem>
                  <MenuItem value="University">University</MenuItem>
                  <MenuItem value="Way_Bridge">Way Bridge</MenuItem>
                  <MenuItem value="Sensative_Points">Sensitive Points</MenuItem>
                  <MenuItem value="Dumping_Yard">Dumping Yard</MenuItem>
                  <MenuItem value="Mine">Mine</MenuItem>
                  <MenuItem value="No_POI_Report">No POI Report</MenuItem>
                  <MenuItem value="Entry_Restriction">Entry Restriction</MenuItem>
                  <MenuItem value="Tyre_Shop">Tyre Shop</MenuItem>
                  <MenuItem value="Workshop">Workshop</MenuItem>
                  <MenuItem value="Yard">Yard</MenuItem>
                  <MenuItem value="Parking_Place">Parking Place</MenuItem>
                  <MenuItem value="Driver_Home">Driver Home</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Puspakom">Puspakom</MenuItem>
                  <MenuItem value="Exit_Restriction">Exit Restriction</MenuItem>
                  <MenuItem value="Gurudwara">Gurudwara</MenuItem>
                  <MenuItem value="Church">Church</MenuItem>
                  <MenuItem value="Distributor">Distributor</MenuItem>
                  <MenuItem value="State">State</MenuItem>
                  <MenuItem value="WaterFall">WaterFall</MenuItem>
                  <MenuItem value="Depot">Depot</MenuItem>
                  <MenuItem value="Terminal">Terminal</MenuItem>
                  <MenuItem value="Port">Port</MenuItem>
                </Select>
              </FormControl>
              

              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}

export default Geofences
