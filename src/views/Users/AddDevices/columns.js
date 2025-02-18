// export const COLUMNS = () => [
//   {
//     Header: '',
//     accessor: 'select',
//     Cell: ({ row }) => (
//       <input
//         type="checkbox"
//         checked={row.original.isSelected}
//         onChange={() => row.original.handleRowSelect(row.index)}
//       />
//     ),
//   },
  
//   {
//     Header: 'Child Name',
//     accessor: 'childName',
//   },
  
 
//   {
//     Header: 'Class',
//     accessor: 'class',
//   },
//   {
//     Header: 'Roll No.',
//     accessor: 'rollno',
//   },
//   {
//     Header: 'Section',
//     accessor: 'section',
//   },

// {
//   Header: 'Date',
//   accessor: 'formattedDate',
//   Cell: ({ value }) => {
//     const [day, month, year] = value.split('-').map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY or your locale's format
//   },
// },
  
// ];
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import SchoolIcon from '@mui/icons-material/School';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import HelpIcon from '@mui/icons-material/Help';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PinDropIcon from '@mui/icons-material/PinDrop';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AodIcon from '@mui/icons-material/Aod';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CategoryIcon from '@mui/icons-material/Category';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
export const COLUMNS = () => [
  {
    Header: 'ID',
    accessor: 'id',
    icon: <Grid3x3Icon/>,
  },
  {
    Header: 'Group ID',
    accessor: 'groupId',
    icon: <PeopleOutlineIcon/>,
  },
  {
    Header: 'Calendar ID',
    accessor: 'calendarId',
    icon: <PermContactCalendarIcon/>,
  },
  {
    Header: 'School Master',
    accessor: 'schoolName',
    icon: <SchoolIcon/>,
  },
  {
    Header: 'Branch Master',
    accessor: 'branchName',
    icon: <AccountTreeIcon/>,
  },
  {
    Header: 'Name',
    accessor: 'name',
    icon: <DriveFileRenameOutlineIcon/>,
  },
  {
    Header: 'Unique ID',
    accessor: 'uniqueId',
    icon: <ContactEmergencyIcon/>,
  },
  {
    Header: 'Status',
    accessor: 'status',
    icon: <HelpIcon/>,
  },
  {
    Header: 'Last Update',
    accessor: 'lastUpdate',
    Cell: ({ value }) => new Date(value).toLocaleString(),
    icon: <WorkHistoryIcon/>,
  },
  {
    Header: 'Position ID',
    accessor: 'positionId',
    icon: <PinDropIcon/>,
  },
  {
    Header: 'Phone',
    accessor: 'phone',
    icon: <LocalPhoneIcon/>,
  },
  {
    Header: 'Model',
    accessor: 'model',
    icon: <AodIcon/>,
  },
  {
    Header: 'Contact',
    accessor: 'contact',
    icon: <ContactPhoneIcon/>,
  },
  {
    Header: 'Category',
    accessor: 'category',
    icon: <CategoryIcon/>,
  },
  {
    Header: 'Disabled',
    accessor: 'disabled',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
    icon: <NotInterestedIcon/>,
  },
  {
    Header: 'Expiration Time',
    accessor: 'expirationTime',
    Cell: ({ value }) => value ? new Date(value).toLocaleString() : 'N/A',
    icon: <QueryBuilderIcon/>,
  },
];
