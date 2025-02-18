export const COLUMNS = () => [
 
  {
    Header: 'device Name',
    accessor: 'deviceName', // Each geofence is associated with a deviceId
  },
  
  {
    Header: 'Geofence Name',
    accessor: 'name', // The name of the geofence (e.g., "Krida Square")
  },
  {
    Header: 'School Name',
    accessor: 'schoolName', // The name of the geofence (e.g., "Krida Square")
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName', // The name of the geofence (e.g., "Krida Square")
  },
  {
    Header:'Address',
    accessor:'address'
  },
  {
    Header: 'Geofence Area',
    accessor: 'area', // Area in Circle or Polygon format
    Cell: ({ value }) => {
      // Display area differently based on if it's a circle or polygon
      if (value.startsWith('Circle')) {
        return `Circle - ${value}`;
      } else if (value.startsWith('Polygon')) {
        return `Polygon - ${value}`;
      } else {
        return value;
      }
    },
  },
  
 
];
