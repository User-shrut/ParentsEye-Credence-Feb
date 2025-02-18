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
    Header: 'Child Name',
    accessor: 'childName',
  },
  
 
  {
    Header: 'Class',
    accessor: 'class',
  },
  {
    Header: 'Roll No.',
    accessor: 'rollno',
  },
  {
    Header: 'Section',
    accessor: 'section',
  },

  {
    Header: 'pickup Point',
    accessor: 'pickupPoint',
  },
  {
    Header: 'device Name',
    accessor: 'deviceName',
  },
  {
    Header: 'pickup Time',
    accessor: 'pickupTime',
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
  Header: 'Date',
  accessor: 'date',
  Cell: ({ value }) => {
    const [day, month, year] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY or your locale's format
  },
},
  
];
