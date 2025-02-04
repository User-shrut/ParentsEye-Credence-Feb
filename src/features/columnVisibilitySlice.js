import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  srNo: true,
  vehicle: true,
  deviceName: true,
  address: true,
  lastUpdate: true,
  cd: true,
  sp: true,
  distance: true,
  fuelConsumption: true,
  td: true,
  sat: true,
  ig: true,
  gps: true,
  power: true,
}

const columnVisibilitySlice = createSlice({
  name: 'columnVisibility',
  initialState,
  reducers: {
    toggleColumn: (state, action) => {
      const { column, isVisible } = action.payload // Destructure payload
      state[column] = isVisible // Update visibility based on the column name
    },
    // Optionally, you can add a reset or setVisibility action
    setVisibility: (state, action) => {
      return { ...state, ...action.payload } // Set multiple visibility states at once
    },
  },
})

export const { toggleColumn, setVisibility } = columnVisibilitySlice.actions
export default columnVisibilitySlice.reducer
