export const COLUMNS = () => [
 

 
  
  {
    Header: 'Child Name',
    accessor: 'childName',
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
  Header: 'Phone Number',
  accessor: 'phone', // accessing nested field
},
{
  Header: 'pickup status',
  accessor: 'pickupStatus', // accessing nested field

},
{
  Header: 'Pickup Time',
  accessor: 'pickupTime', // accessing nested field
},

// 

// {
//   Header: 'Pickup Status',
//   accessor: 'pickupStatus',// accessing nested field
//   Cell: ({ row }) => (
//     <div>
//       <div>Status: {row.original.pickupStatus}</div>
//       <div>Pickup Time: {row.original.pickupTime}</div>
//     </div>
//   ),
// },
// {
//   Header: 'Pickup Status & Time',
//   accessor: 'pickupStatus',
//   Cell: ({ row }) => {
//     const { pickupStatus, pickupTime } = row.original;
//     return (
//       <div>
//         <div>Status: {pickupStatus ? 'Picked Up' : 'Not Picked Up'}</div>
//         <div>Pickup Time: {pickupTime}</div>
//       </div>
//     );
//   },
// },
// {
//   Header: 'Pickup Status & Time',
//   accessor: 'pickupStatus', // This can be used as a dummy accessor to trigger the Cell render
//   Cell: ({ row }) => {
//     const { pickupStatus, pickupTime } = row.original;
//     return (
//       <div>
//         <div>Status: {pickupStatus ? 'Picked Up' : 'Not Picked Up'}</div>
//         <div>Pickup Time: {pickupTime || 'N/A'}</div>
//       </div>
//     );
//   },
// },

{
  Header: 'Drop status',
  accessor: 'dropStatus', // accessing nested field
},
{
  Header: 'Drop Time',
  accessor: 'dropTime'

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
