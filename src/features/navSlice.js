// import { createSlice } from '@reduxjs/toolkit'

// const navSlice = createSlice({
//     name: 'navbar',
//     initialState: {
//         home: false,
//         master: false,
//         reports: false,
//         expense: false,
//         support:false,

//     },
//     reducers: {
//         // ?action?
//         setToggleSidebar: (state, action) => {
//             state.home = action.payload.home;
//             state.master = action.payload.master;
//             state.reports = action.payload.reports;
//             state.expense = action.payload.expense;
//             state.support = action.payload.support;

//         },
//     },
// })

// export const { setToggleSidebar } = navSlice.actions
// export default navSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const navSlice = createSlice({
  name: 'navbar',
  initialState: {
    home: false,
    school: true,
    users: false,
    schoolreports: false,
    master: false,
    reports: false,
    expense: false,
    support: false,
  },
  reducers: {
    // ?action?
    setToggleSidebar: (state, action) => {
      state.home = action.payload.home
      state.school = action.payload.school
      state.users = action.payload.users
      state.schoolreports = action.payload.schoolreports
      state.master = action.payload.master
      state.reports = action.payload.reports
      state.expense = action.payload.expense
      state.support = action.payload.support
    },
  },
})

export const { setToggleSidebar } = navSlice.actions
export default navSlice.reducer
