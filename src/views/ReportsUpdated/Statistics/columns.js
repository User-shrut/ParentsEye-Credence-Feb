export const COLUMNS = () => [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Attributes',
    accessor: 'attributes',
    // Custom rendering for attributes to avoid rendering an object directly
    Cell: ({ value }) => (value ? JSON.stringify(value) : 'N/A'), // Convert to a string, or show 'N/A' if undefined
  },
  {
    Header: 'Capture Time',
    accessor: 'captureTime',
  },
  {
    Header: 'Active Users',
    accessor: 'activeUsers',
  },
  {
    Header: 'Active Devices',
    accessor: 'activeDevices',
  },
  {
    Header: 'Requests',
    accessor: 'requests',
  },
  {
    Header: 'Messages Received',
    accessor: 'messagesReceived',
  },
  {
    Header: 'Messages Stored',
    accessor: 'messagesStored',
  },
  {
    Header: 'Mail Sent',
    accessor: 'mailSent',
  },
  {
    Header: 'SMS Sent',
    accessor: 'smsSent',
  },
  {
    Header: 'Geocoder Requests',
    accessor: 'geocoderRequests',
  },
  {
    Header: 'Geolocation Requests',
    accessor: 'geolocationRequests',
  },
  {
    Header: 'Protocols',
    accessor: 'protocols',
    // Custom rendering for protocols to avoid rendering an object directly
    Cell: ({ value }) => (value ? JSON.stringify(value) : 'N/A'), // Convert to a string, or show 'N/A' if undefined
  }
];
