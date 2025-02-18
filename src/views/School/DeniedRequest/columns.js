export const COLUMNS = () => [
  
  
  {
    Header: 'Child Name',
    accessor: 'childName',
  },
  
 
  {
    Header: 'class',
    accessor: 'class',
  },
 
  {
    Header: 'Status of request',
    accessor:'statusOfRequest',
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
  accessor: 'phone', // accessing nested field
},
{
  Header: 'school Name',
  accessor: 'schoolName', // accessing nested field
},
{
  Header: 'branch Name',
  accessor: 'branchName', // accessing nested field
},
{
  Header: 'Request Date',
  accessor: 'formattedRequestDate',
  Cell: ({ value }) => {
    const [day, month, year] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY or your locale's format
  },
},
  
];
