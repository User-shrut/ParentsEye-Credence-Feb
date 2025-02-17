/* eslint-disable prettier/prettier */
import React from 'react'
import { CHeaderNav } from '@coreui/react'

function VehicleCategory({ filter1, setFilter1 }) {
  return (
    <>
      <CHeaderNav className="ms-2 p-0 me-3">
        <select
          className="form-select header-inputs"
          aria-label="Default select example"
          value={filter1}
          onChange={(e) => setFilter1(e.target.value)}
        >
          <option disabled>Select by Category</option>
          <option selected>All</option>
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="motorcycle">Bike</option>
          <option value="truck">Truck</option>
          <option value="tractor">Tracktor</option>
          <option value="crean">Crean</option>
          <option value="jcb">JCB</option>
        </select>
      </CHeaderNav>
    </>
  )
}
export default VehicleCategory
