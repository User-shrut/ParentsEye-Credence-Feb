import React, { useContext, useEffect, useState, useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
  Polygon,
  Circle,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import axios from 'axios'
import useVehicleTracker from './useVehicleTracker'
import { useNavigate, useParams } from 'react-router-dom'
import location from 'src/assets/location.png'
import { duration } from 'dayjs' // Importing all vehicle icons
import { Eye, EyeOff } from 'lucide-react'
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker'
import './IndividualTrack.css'
import Draggable from 'react-draggable'

import '../../Reports/style/remove-gutter.css'
import useGetVehicleIcon from '../../Reports/HistoryReport/useGetVehicleIcon'
import useVehicleImage from '../../Reports/HistoryReport/useVehicleImage'
import { IoMdSpeedometer } from 'react-icons/io'
import { HiOutlineStatusOnline } from 'react-icons/hi'
import { RxLapTimer } from 'react-icons/rx'
import { IoLocationSharp } from 'react-icons/io5'

import dayjs from 'dayjs'
import { FaSatellite } from 'react-icons/fa'
import Cookies from 'js-cookie'
import IconDropdown from '../../../components/ButtonDropdown'
import { HiOutlineLogout } from 'react-icons/hi'
import { MdDashboard } from 'react-icons/md'

const accessToken = Cookies.get('authToken')

const MapController = ({ individualSalesMan, previousPosition, setPath }) => {
  const map = useMap()
  const animationRef = useRef(null)

  useEffect(() => {
    if (individualSalesMan && map) {
      const { latitude, longitude } = individualSalesMan
      const targetPosition = [latitude, longitude]

      // Update the path with the new position
      setPath((prevPath) => [...prevPath, targetPosition])

      if (previousPosition) {
        const { latitude: prevLat, longitude: prevLon } = previousPosition
        const start = [prevLat, prevLon]
        const end = targetPosition
        const duration = 50000 // Total animation duration in milliseconds

        let startTime

        const animateMarker = (timestamp) => {
          if (!startTime) startTime = timestamp

          const elapsedTime = timestamp - startTime
          const progress = Math.min(elapsedTime / duration, 1) // Calculate progress between 0 and 1

          // Calculate intermediate positions
          const newLat = prevLat + (latitude - prevLat) * progress
          const newLon = prevLon + (longitude - prevLon) * progress

          map.setView([newLat, newLon], map.getZoom(), { animate: true })

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateMarker) // Continue animation
          } else {
            // Final position
            map.setView(targetPosition, 16, { animate: true })
          }
        }

        animationRef.current = requestAnimationFrame(animateMarker)

        return () => {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current) // Clean up animation
          }
        }
      } else {
        map.setView(targetPosition, 16, { animate: true })
      }
    }
  }, [individualSalesMan, map, previousPosition, setPath])

  return null
}

const IndividualTrack = () => {
  const { deviceId, category, name } = useParams()
  const { vehicleData, loading, error } = useVehicleTracker(deviceId)
  const [individualSalesMan, setIndividualSalesMan] = useState(null)
  const [address, setAddress] = useState(null)
  const previousPosition = useRef(null) // Ref to store the previous position
  const [path, setPath] = useState([]) // State for polyline path
  const [geofences, setGeofences] = useState([]) // state for geofence radius
  const [polygonData, setPolygonData] = useState([]) // state for geofence polygon
  // Toggle state for geofence display
  const [showGeofence, setShowGeofence] = useState(true)

  // Toggle handler
  const handleToggleGeofence = () => {
    setShowGeofence((prevState) => !prevState)
  }

  // fetch vehicle data
  useEffect(() => {
    if (vehicleData) {
      setIndividualSalesMan(vehicleData[0])
      console.log(vehicleData[0])
    }
  }, [vehicleData])

  // Fetch address using vehicle coordinates
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const apiKey = 'DG2zGt0KduHmgSi2kifd' // Replace with your actual MapTiler API key
        const response = await axios.get(
          `https://api.maptiler.com/geocoding/${individualSalesMan?.longitude},${individualSalesMan?.latitude}.json?key=${apiKey}`,
        )
        if (response.data.features.length <= 5) {
          setAddress(response.data.features[0].place_name_en)
        } else {
          setAddress(response.data.features[1].place_name_en)
        }
        // console.log(response.data)
      } catch (error) {
        console.error('Error fetching the address:', error)
        setAddress('Error fetching address')
      }
    }

    if (individualSalesMan?.latitude && individualSalesMan?.longitude) {
      fetchAddress()
    }
  }, [individualSalesMan])

  // NEW: Fetch geofence data for this vehicle
  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        // Update the endpoint and parameters as per your API
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/geofence/${deviceId}`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
        const circleData = (data) => {
          return data
            .filter((item) => item.area.length == 1 && item.area[0].circle)
            .map((item) => {
              const match = item.area[0].circle.match(/Circle\(([\d.]+) ([\d.]+), ([\d.]+)\)/)
              if (match) {
                return {
                  name: item.name,
                  lat: parseFloat(match[1]), // Extract latitude
                  lng: parseFloat(match[2]), // Extract longitude
                  radius: parseFloat(match[3]), // Extract radius
                }
              }
              return null
            })
            .filter(Boolean) // Remove null values if any parsing fails
        }

        const polygon = (data) => {
          return data
            .filter((item) => item.area.length > 1)
            .map((item, index) => {
              const coordinates = item.area.map((coord) => [coord.lat, coord.lng])
              if (coordinates) {
                return {
                  name: item.name,
                  coordinates,
                }
              }
            })
            .filter(Boolean)
        }

        console.log('Fetch GEOFENCE', response.data)
        console.log('FETCH GEOFENCE POLYGON', polygon(response.data))
        setGeofences(circleData(response.data))
        setPolygonData(polygon(response.data))
      } catch (error) {
        console.error('Error fetching geofences:', error)
      }
    }

    fetchGeofences()
  }, [deviceId])

  console.log('SETTING GEOFENCE', geofences)

  const navigate = useNavigate()
  const iconImage = (item, category) => useGetVehicleIcon(item, category)
  const vehicleImage = (category, item) => useVehicleImage(category, item)
  const handleClickOnTrack = (vehicle) => {
    console.log('trcak clicked')
    navigate(`/history/${deviceId}/${category}/${name}`)
  }
  const [isSatelliteView, setIsSatelliteView] = useState(false)

  const toggleMapView = () => {
    setIsSatelliteView((prev) => !prev)
  }

  const handleLogout = () => {
    Cookies.remove('authToken')
    window.location.href = '/login'
  }

  const backToDashboard = () => {
    navigate(-1)
  }

  const dropdownItems = [
    {
      icon: MdDashboard,
      label: 'Back To Dashboard',
      onClick: () => backToDashboard(),
    },
    {
      icon: HiOutlineLogout,
      label: 'Logout',
      onClick: () => handleLogout(),
    },
  ]

  return (
    <>
      <div className="row gutter-0">
        <div className="col-12 position-relative">
          <div className="individualMap position-relative border border-5 ">
            <MapContainer
              center={[21.1458, 79.0882]} // Default center in case data isn't available
              zoom={13}
              style={{
                height: '87vh',
                marginTop: '7px',
                border: '1px solid black',
                borderRadius: '5px',
              }}
            >
              <div className="toggle-map-view" onClick={toggleMapView}>
                <FaSatellite />
              </div>
              <TileLayer
                url={
                  isSatelliteView
                    ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                    : // Satellite View
                      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' // Normal View
                }
                attribution="&copy; Credence Tracker, HB Gadget Solutions Nagpur"
              />

              <button
                title={showGeofence ? 'Hide Geofence' : 'View Geofence'}
                onClick={handleToggleGeofence}
                className="geofence-button btn"
              >
                {showGeofence ? (
                  <EyeOff color="black" size={18} />
                ) : (
                  <Eye color="black" size={18} />
                )}
              </button>

              {/* Render Polygon Dynamically */}
              {showGeofence &&
                polygonData.map((polygon, index) => (
                  <Polygon
                    key={index}
                    positions={polygon.coordinates}
                    pathOptions={{
                      color: '#0a2d63',
                      fillColor: '#A1E3F9',
                      fillOpacity: 0.3,
                    }}
                  >
                    <Popup>
                      <strong>{polygon.name}</strong>
                    </Popup>
                  </Polygon>
                ))}

              {/* Render Circles Dynamically */}
              {showGeofence
                ? geofences.map((location, index) => (
                    <Circle
                      key={index}
                      center={[location.lat, location.lng]}
                      radius={location.radius} // Radius in meters
                      pathOptions={{
                        color: '#0a2d63',
                        fillColor: '#A1E3F9',
                        fillOpacity: 0.3,
                      }}
                    >
                      <Popup>
                        <strong>{location.name}</strong> <br />
                        Radius: {location.radius} m
                      </Popup>
                    </Circle>
                  ))
                : null}

              <Draggable bounds="parent">
                <CCard className="mb-4 parametersContainer shadow" style={{ zIndex: '555' }}>
                  <CCardBody>
                    <div className="row">
                      <div className="col-7 mt-3">
                        <h6 className="fw-bold text-decoration-underline">
                          {name ? name : 'User Name'}
                        </h6>
                        <p>{address ? `${address}` : 'Address of User'}</p>
                        <p>{individualSalesMan?.lastUpdate}</p>
                      </div>
                      <div className="col-5">
                        <img
                          src={vehicleImage(category, individualSalesMan)}
                          className="nimg "
                          alt="vehicle"
                        />
                      </div>
                    </div>
                    <div className="row gap-3 justify-content-center">
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${individualSalesMan?.attributes?.ignition ? 'On' : 'Off'}`}</strong>
                        <br />
                        <p className="p-0 m-0">Ignition</p>
                      </div>
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${Math.round(individualSalesMan?.speed * 1.6).toFixed(2)}`}</strong>
                        <small> km/h</small>
                        <br />
                        <p className="p-0 m-0">Speed</p>
                      </div>
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${Math.round(individualSalesMan?.attributes?.distance)}`}</strong>
                        <small> M</small>
                        <br />
                        <p className="p-0 m-0">Distance</p>
                      </div>
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${individualSalesMan?.attributes?.motion ? 'Yes' : 'No'}`}</strong>
                        <br />
                        <p className="p-0 m-0">Moving</p>
                      </div>
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${category}`}</strong>
                        <br />
                        <p className="p-0 m-0">
                          <small>Category</small>
                        </p>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </Draggable>
              {individualSalesMan && (
                <ReactLeafletDriftMarker
                  position={[individualSalesMan.latitude, individualSalesMan.longitude]}
                  icon={iconImage(individualSalesMan, category)}
                  duration={2000}
                >
                  <Popup>
                    <div className="toolTip">
                      <span style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                        <strong> {name ? name : 'User Name'}</strong>
                      </span>
                      <hr
                        style={{
                          width: '100%',
                          height: '3px',
                          marginBottom: '0px',
                          marginTop: '5px',
                          borderRadius: '5px',
                          backgroundColor: '#000',
                        }}
                      />
                      <div className="toolTipContent">
                        <div>
                          <strong>
                            <RxLapTimer size={17} color="#FF7A00" />
                          </strong>{' '}
                          {dayjs(individualSalesMan.lastUpdate).format('YYYY-MM-DD HH:mm')}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            gap: '10px',
                          }}
                        >
                          <div>
                            <strong>
                              <IoMdSpeedometer size={17} color="#FF7A00" />
                            </strong>{' '}
                            {(individualSalesMan?.speed * 1.6).toFixed(2)} km/h{' '}
                          </div>
                        </div>
                        <div>
                          <strong>
                            <HiOutlineStatusOnline size={17} color="#FF7A00" />
                          </strong>{' '}
                          {(() => {
                            const sp = individualSalesMan.speed
                            const ig = individualSalesMan.attributes.ignition
                            if (sp < 1 && ig == false) {
                              return 'Stoped'
                            }
                            if (sp < 2 && ig == true) {
                              return 'Idle'
                            }
                            if (sp > 2 && sp < 60 && ig == true) {
                              return 'Running'
                            }
                            if (sp > 60 && ig == true) {
                              return 'Over Speed'
                            } else {
                              return 'Inactive'
                            }
                          })()}
                        </div>

                        <span>
                          <strong>
                            <IoLocationSharp size={17} color="#FF7A00" />
                          </strong>{' '}
                          {'Loading...'}
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                          }}
                        >
                          <button
                            className="btn"
                            style={{
                              width: '100%',
                              color: 'white',
                              fontSize: '0.8rem',
                              backgroundColor: '#000000',
                            }}
                            onClick={() => handleClickOnTrack(individualSalesMan)}
                          >
                            View History
                          </button>
                        </div>
                      </div>
                      {/* <strong></strong> {device.lastUpdate} km/h */}
                    </div>
                  </Popup>
                </ReactLeafletDriftMarker>
              )}
              {/* Draw polyline based on path */}
              <Polyline positions={path} color="blue" />
              <MapController
                individualSalesMan={individualSalesMan}
                previousPosition={previousPosition.current}
                setPath={setPath}
              />
            </MapContainer>
          </div>
        </div>
      </div>
      <div className="position-fixed bottom-0 end-0 mb-5 m-3 z-5" style={{ 'z-index': '1000' }}>
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default IndividualTrack
