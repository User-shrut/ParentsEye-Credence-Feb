export const COLUMNS = () => [
  
  
  {
    Header: 'Parent Name',
    accessor: 'parentName',
  },
  {
    Header: 'Username or Email',
    accessor: 'email',
  },
  {
    Header: 'Password',
    accessor: 'password',
  },
  {
    Header: 'Phone',
    accessor: 'phone',
    Cell: ({ value }) => (value ? value.toString() : 'N/A'),
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
    Header: 'Registration Date',
    accessor: 'registrationDate',
  },
  
];
