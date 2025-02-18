import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import PasswordIcon from '@mui/icons-material/Password';
import MailIcon from '@mui/icons-material/Mail';
import SchoolIcon from '@mui/icons-material/School';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
export const COLUMNS = () => [
 
  
  {
    Header: 'Supervisor Name',
    accessor: 'supervisorName',
    icon: <PermIdentityIcon />,
  },
  
  {
    Header: 'Phone Number',
    accessor: 'phone_no',
    icon: <PhoneInTalkIcon />,
  },
  {
    Header: 'Address',
    accessor: 'address',
    icon: <EditLocationIcon />,
  },
  {
    Header: 'Email',
    accessor: 'email',
    icon: <MailIcon />,
  },
  {
    Header: 'password',
    accessor: 'password',
    icon: <PasswordIcon />,
  },
  {
    Header: 'Device Id',
    accessor: 'deviceId',
    icon: <DirectionsBusIcon/>,
  },
  {
    Header: 'Bus Name',
    accessor: 'deviceName',
    icon: <DirectionsBusIcon/>,
  },
  {
    Header: 'School Name',
    accessor: 'schoolName',
    icon: <SchoolIcon/>,
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName',
    icon: <AccountTreeIcon/>,
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