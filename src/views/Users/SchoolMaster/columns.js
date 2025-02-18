import SchoolIcon from '@mui/icons-material/School';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonIcon from '@mui/icons-material/Person';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MailIcon from '@mui/icons-material/Mail';
import PasswordIcon from '@mui/icons-material/Password';

export const COLUMNS = () => [
  
  
  {
    Header: 'School Name',
    accessor: 'schoolName',
    icon: <SchoolIcon />,
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName',
    icon: <AccountTreeIcon />,
  },
  {
    Header: 'User Name',
    accessor: 'username',
    icon: <PersonIcon />,
  },
  {
    Header: 'Phone',
    accessor: 'schoolMobile',
    Cell: ({ value }) => (value ? value.toString() : 'N/A'),
    icon: <PhoneInTalkIcon />,
  },
  {
    Header: 'Email',
    accessor: 'email',
    icon: <MailIcon />,
  },
  {
    Header: 'Password',
    accessor: 'password',
    icon: <PasswordIcon />,
  },
  // {
  //   Header: 'deviceId',
  //   accessor: 'deviceId',
  // },
  // {
  //   Header: 'deviceName',
  //   accessor: 'deviceName',
  // },
];
