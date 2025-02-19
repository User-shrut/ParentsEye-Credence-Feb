// export const COLUMNS = () => [
//   {
//     Header: 'Device ID',
//     accessor: 'deviceId',
//   },
//   {
//     Header:'type',
    
//   }
// ];
export const COLUMNS = () => [
  {
    Header: 'Device',
    accessor: 'deviceId',  // Adjust if you need a different format
  },
  {
    Header: 'Device Name',
    accessor: 'deviceName',
  },
  // {
  //   Header: 'Server Time',
  //   accessor: 'serverTime',
  // },
  {
    Header: 'Fix Time',
    accessor: 'eventTime',
  },
  {
    Header: 'server Time',
    accessor: 'serverTime',
  },
  {
    Header: 'Type',
    accessor: 'type',
  },
  
];

  // {
  //   Header: 'Route',
  //   accessor: 'route',
  //   Cell: ({ value }) => value.map(([lon, lat], index) => (
  //     <div key={index}>
  //       {`Longitude: ${lon !== undefined ? lon.toFixed(5) : 'N/A'}, Latitude: ${lat !== undefined ? lat.toFixed(5) : 'N/A'}`}
  //     </div>
  //   )),
  // },
//   {
//     Header: 'Event ID',
//     accessor: 'events.id',
//   },
//   {
//     Header: 'Event Type',
//     accessor: 'events[0].type',
//   },
//   {
//     Header: 'Event Time',
//     accessor: 'events[0].eventTime',
//     Cell: ({ value }) => new Date(value).toLocaleString(), // Convert to local date string
//   },
//   {
//     Header: 'Position ID',
//     accessor: 'positions[0].id',
//   },
//   {
//     Header: 'Position Latitude',
//     accessor: 'positions[0].latitude',
//     Cell: ({ value }) => {
//       // Ensure value is a number before calling toFixed
//       return (typeof value === 'number' ? value.toFixed(5) : 'N/A');
//     },
//   },
//   {
//     Header: 'Position Longitude',
//     accessor: 'positions[0].longitude',
//     Cell: ({ value }) => {
//       // Ensure value is a number before calling toFixed
//       return (typeof value === 'number' ? value.toFixed(5) : 'N/A');
//     },
//   },
//   {
//     Header: 'Position Speed',
//     accessor: 'positions[0].speed',
//     Cell: ({ value }) => {
//       // Ensure value is a number before calling toFixed
//       return (typeof value === 'number' ? value.toFixed(2) : 'N/A');
//     },
//   },
//   {
//     Header: 'Position Date/Time',
//     accessor: 'positions[0].deviceTime',
//     Cell: ({ value }) => new Date(value).toLocaleString(), // Convert to local date string
//   },
//   // {
//   //   Header: 'Total Distance',
//   //   accessor: 'positions[0].attributes.totalDistance',
//   //   Cell: ({ value }) => (typeof value === 'number' ? (value / 1000).toFixed(2) + ' km' : 'N/A'),
//   // },
//   {
//     Header: 'Odometer',
//     accessor: 'positions[0].attributes.odometer',
//   },
//   {
//     Header: 'Motion',
//     accessor: 'positions[0].attributes.motion',
//     Cell: ({ value }) => (value ? 'Yes' : 'No'),
//   },
//   {
//     Header: 'Charge',
//     accessor: 'positions[0].attributes.charge',
//     Cell: ({ value }) => (value ? 'Yes' : 'No'),
//   },
//   {
//     Header: 'Altitude',
//     accessor: 'positions[0].altitude',
//     Cell: ({ value }) => {
//       // Ensure value is a number before calling toFixed
//       return (typeof value === 'number' ? value.toFixed(2) : 'N/A');
//     },
//   },
//   {
//     Header: 'Speed Unit',
//     accessor: 'attributes.speedUnit',
//   },
//   {
//     Header: 'Timezone',
//     accessor: 'attributes.timezone',
//   },
//   {
//     Header: 'Logo',
//     accessor: 'attributes.logo',
//     Cell: ({ value }) => <img src={value} alt="Logo" style={{ width: '50px', height: 'auto' }} />,
//   },
//   {
//     Header: 'Primary Color',
//     accessor: 'attributes.colorPrimary',
//   },
//   {
//     Header: 'Map Type',
//     accessor: 'attributes.map',
//   },
//   {
//     Header: 'Zoom',
//     accessor: 'attributes.zoom',
//   },

