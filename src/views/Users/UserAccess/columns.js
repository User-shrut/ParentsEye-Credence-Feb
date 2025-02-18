export const COLUMNS = () => [

 
  {
    Header: "User Name",
    accessor: "username",
  },
  {
    Header: "Password",
    accessor: "password",
  },
  {
    Header: "Phone No",
    accessor: "phoneNo",
  },
  
  {
    Header: "School Name",
    accessor: "schoolName",
  },
 
  {
    Header: "Registration Date",
    accessor: "formattedRegistrationDate",
    Cell: ({ value }) => {
      const [day, month, year] = value.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY or your locale's format
    },
  },
];
