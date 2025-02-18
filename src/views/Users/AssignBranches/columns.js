
export const COLUMNS = () => [
  
  {
    Header: 'Bus Name',
    accessor: 'deviceName',
  },
  {
    Header: 'Driver Name',
    accessor: 'driverName',
  },
  {
    Header: 'Address',
    accessor: 'address',
  },
  {
    Header: 'Phone Number',
    accessor: 'driverMobile',
  },
  {
    Header: 'password',
    accessor: 'password',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'School Name',
    accessor: 'schoolName',
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName',
  },
  
  {
    Header: 'Device Id',
    accessor: 'deviceId',
  },
  {
    Header: 'Registration Date',
    accessor: 'formattedRegistrationDate',
    Cell: ({ value }) => {
      const [day, month, year] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY or your locale's format
    },
  },
]