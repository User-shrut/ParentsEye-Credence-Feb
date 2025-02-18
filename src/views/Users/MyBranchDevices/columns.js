export const COLUMNS = () => [
  // {
  //   Header: '',
  //   accessor: 'select',
  //   Cell: ({ row }) => (
  //     <input
  //       type="checkbox"
  //       checked={row.original.isSelected}
  //       onChange={() => row.original.handleRowSelect(row.index)}
  //     />
  //   ),
  // },
  
  {
    Header: 'Device Id',
    accessor: 'deviceId',
  },
  {
    Header: 'Device Name',
    accessor: 'deviceName',
  },
  // {
  //   Header: 'Date',
  //   accessor: 'formattedDate',
  //   Cell: ({ value }) => {
  //     // Assuming the value is in MM/DD/YYYY format
  //     const [month, day, year] = value.split('/').map(Number);
  //     const date = new Date(year, month - 1, day);
  //     return date.toLocaleDateString(); // Adjusted based on locale
  //   },
  // },
];
