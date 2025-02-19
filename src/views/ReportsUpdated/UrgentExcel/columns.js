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
    Header: "Student Name",
    accessor: "childName",
  },

  {
    Header: "Class",
    accessor: "class",
  },

  {
    Header: "Roll No.",
    accessor: "rollno",
  },
  {
    Header: "Section",
    accessor: "section",
  },
  {
    Header: "School Name",
    accessor: "schoolName",
  },
  {
    Header: "Branch Name",
    accessor: "branchName",
  },
  {
    Header: "DOB",
    accessor: "dateOfBirth",
  },
  {
    Header: "Child Age",
    accessor: "childAge",
  },

  {
    Header: "Parent Name",
    accessor: "parentName", // accessing mapped field
  },
  {
    Header: "User Name",
    accessor: "email", // accessing mapped field
  },
  {
    Header: "Phone Number",
    accessor: "phone", // accessing nested field
  },
  {
    Header: "Password",
    accessor: "password", // accessing nested field
    show: true,
  },

  {
    Header: "Gender",
    accessor: "gender",
  },

  {
    Header: "Device id",
    accessor: "deviceId",
  },
  {
    Header: "Bus No.",
    accessor: "deviceName",
  },
  {
    Header: "Pick up point",
    accessor: "pickupPoint",
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
