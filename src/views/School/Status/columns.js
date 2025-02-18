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
    Header: 'Student Name',
    accessor: 'childName',
  },
  
 
  {
    Header: 'Class',
    accessor: 'childClass',
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
    Header: 'School Name',
    accessor: 'schoolName',
  },
  {
    Header:'branch Name',
    accessor:'branchName'
  },
  
  {
    Header: 'Child Age',
    accessor: 'childAge',
  },
  
  {
    Header: 'Parent Name',
    accessor: 'parentName', // accessing mapped field
  },
  {
    Header: 'Parent Email',
    accessor: 'email', // accessing mapped field
  },
  {
  Header: 'Phone Number',
  accessor: 'parentNumber', // accessing nested field
},
{
  Header: 'Password',
  accessor: 'password', // accessing nested field
  show:true,
},
  // {
  //   Header: 'Password',
  //   accessor: 'password',
  // },
  {
    Header: 'Gender',
    accessor: 'gender',
  },
  // {
  //   Header: 'DOB',
  //   accessor: 'dateOfBirth',
  // },
  {
    Header: 'Device id',
    accessor: 'deviceId',
  },
  {
    Header: 'Pick up point',
    accessor: 'pickupPoint',
  },
  
  // {
  //   Header: 'Registration Date',
  //   accessor: 'formattedRegistrationDate',
  //   Cell: ({ value }) => {
  //     const [day, month, year] = value.split('-').map(Number);
  //     const date = new Date(year, month - 1, day);
  //     return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY or your locale's format
  //   },
  // },
];
