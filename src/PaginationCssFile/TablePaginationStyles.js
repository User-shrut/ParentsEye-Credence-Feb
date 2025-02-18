// import { styled } from '@mui/material/styles';

// export const StyledTablePagination = styled('div')(({ theme }) => ({
//   "& .MuiTablePagination-selectLabel": {
//     marginBottom: 0,
//     color: "black",
//   },
//   "& .css-levciy-MuiTablePagination-displayedRows": {
//     marginBottom: 0,
//   },
//   "& .css-194a1fa-MuiSelect-select-MuiInputBase-input": {
//     padding: "9px 0 5px",
//   },
//   "& .MuiSelect-icon": {
//     //  pointerEvents: "auto", // Ensure the icon is clickable
//     cursor: "pointer", // Add pointer cursor to the icon
//   },
//   "& .MuiSelect-select": {
//     cursor: "pointer", // Set cursor to pointer when hovering over the select box
//   },
// }));
import { styled } from '@mui/material/styles';

export const StyledTablePagination = styled('div')(({ theme }) => ({
  "& .MuiTablePagination-selectLabel": {
    marginBottom: 0,
    color: "black",
  },
  "& .css-levciy-MuiTablePagination-displayedRows": {
    marginBottom: 0,
  },
  "& .css-194a1fa-MuiSelect-select-MuiInputBase-input": {
    padding: "9px 0 5px",
  },
  "& .MuiSelect-icon": {
    cursor: "pointer", // Add pointer cursor to the icon
  },
  "& .MuiSelect-select": {
    cursor: "pointer", // Set cursor to pointer when hovering over the select box
  },
}));
