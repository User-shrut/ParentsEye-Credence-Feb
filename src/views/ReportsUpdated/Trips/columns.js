// export const COLUMNS = () => [
//   {
//     Header: 'Device ID',
//     accessor: 'deviceId',
//   },
//   {
//     Header:'type',
    
//   }
// ];
// export const COLUMNS = () => [
//   {
//     Header: 'ID',
//     accessor: 'id',
//   },
//   {
//     Header: 'Device ID',
//     accessor: 'deviceId',
//   },
//   {
//     Header: 'Protocol',
//     accessor: 'protocol',
//   },
//   {
//     Header: 'Server Time',
//     accessor: 'serverTime',
//   },
//   {
//     Header: 'Device Time',
//     accessor: 'deviceTime',
//   },
//   {
//     Header: 'Fix Time',
//     accessor: 'fixTime',
//   },
//   {
//     Header: 'Outdated',
//     accessor: 'outdated',
//   },
//   {
//     Header: 'Valid',
//     accessor: 'valid',
//   },
//   {
//     Header: 'Latitude',
//     accessor: 'latitude',
//   },
//   {
//     Header: 'Longitude',
//     accessor: 'longitude',
//   },
//   {
//     Header: 'Altitude',
//     accessor: 'altitude',
//   },
//   {
//     Header: 'Speed',
//     accessor: 'speed',
//   },
//   {
//     Header: 'Course',
//     accessor: 'course',
//   },
//   {
//     Header: 'Address',
//     accessor: 'address',
//   },
//   {
//     Header: 'Accuracy',
//     accessor: 'accuracy',
//   },
//   {
//     Header: 'Network Radio Type',
//     accessor: row => row.network.radioType,
//   },
//   {
//     Header: 'Network Consider IP',
//     accessor: row => row.network.considerIp,
//   },
//   {
//     Header: 'Geofence IDs',
//     accessor: row => row.geofenceIds.join(', '),
//   },
//   {
//     Header: 'Satellite',
//     accessor: 'attributes.sat',
//   },
//   {
//     Header: 'Ignition',
//     accessor: 'attributes.ignition',
//   },
//   {
//     Header: 'Event',
//     accessor: 'attributes.event',
//   },
//   {
//     Header: 'Archive',
//     accessor: 'attributes.archive',
//   },
//   {
//     Header: 'Odometer',
//     accessor: 'attributes.odometer',
//   },
//   {
//     Header: 'Distance',
//     accessor: 'attributes.distance',
//   },
//   {
//     Header: 'Total Distance',
//     accessor: 'attributes.totalDistance',
//   },
//   {
//     Header: 'Motion',
//     accessor: 'attributes.motion',
//   },
//   {
//     Header: 'Charge',
//     accessor: 'attributes.charge',
//   },
//   {
//     Header: 'Hours',
//     accessor: 'attributes.hours',
//   },
// ];


export const COLUMNS = () => [
  {
    Header: "Device Name",
    accessor: "deviceName",
    align: "left"
  },
  {
    Header: "Start Time",
    accessor: "startTime",
    align: "left"
  },
  {
    Header: "Start Latitude",
    accessor: "startLatitude",
    align: "left"
  },
  {
    Header: "Start Longitude",
    accessor: "startLongitude",
    align: "left"
  },
  {
    Header: "End Time",
    accessor: "endTime",
    align: "left"
  },
  {
    Header: "End Latitude",
    accessor: "endLatitude",
    align: "left"
  },
  {
    Header: "End Longitude",
    accessor: "endLongitude",
    align: "left"
  },
 
  
  // {
  //   Header: "Total Distance",
  //   accessor: "totalDistance",
  //   align: "right"
  // }
  {
    Header: "distance",
    accessor: "distance1",
    align: "left",
    Cell: ({ value }) => {
      // Convert meters to kilometers
      const distanceInKm = value / 1000; // Divide by 1000 to convert meters to kilometers
      return `${distanceInKm.toFixed(2)} km`; // Format the value to 2 decimal places and append "km"
    }
  },
    // {
    //   Header: "Total Distance",
    //   accessor: "totalDistance",
    //   align: "right",
    //   Cell: ({ value }) => {
    //     // Convert meters to kilometers
    //     const distanceInKm = value / 1000; // Divide by 1000 to convert meters to kilometers
    //     return `${distanceInKm.toFixed(2)} km`; // Format the value to 2 decimal places and append "km"
    //   }
    // }
  
  
];
