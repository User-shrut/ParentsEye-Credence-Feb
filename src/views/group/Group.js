import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import CloseIcon from '@mui/icons-material/Close'
import { MdConnectWithoutContact } from 'react-icons/md'
import { AiOutlineUpload } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'

const Group = () => {
  const [addModalOpen, setAddModalOpen] = useState(false) // Modal for adding a new row
  const [editModalOpen, setEditModalOpen] = useState(false) // Modal for adding a new row
  const [formData, setFormData] = useState({}) // Form data state
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const [filteredRows, setFilteredRows] = useState([])

  const handleEditModalClose = () => setEditModalOpen(false)
  const handleAddModalClose = () => setAddModalOpen(false)
  const [filteredData, setFilteredData] = useState([])

  const columns = [
    { Header: 'Name', accessor: 'name' },
    // { Header: 'Unique ID', accessor: 'uniqueId' },
  ]

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    color: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const fetchData = async (currentPage) => {
    setLoading(true); // Start loading
    try {
      const skip = currentPage * limit;
      const username = 'hbtrack';
      const password = '123456@';
      const token = btoa(`${username}:${password}`);

      const response = await axios.get(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=title,price`
      );

      if (response.data) {
        setData(response.data.products); // Set fetched data
        console.log('Paginated data', response.data);
      } else {
        console.error('Expected an array but got:', response.data);
        alert('Unexpected data format received.');
      }
    } catch (error) {
      console.error('Fetch data error:', error);
      alert('An error occurred while fetching data.');
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      const apiUrl = 'https://rocketsalestracker.com/api/groups'
      const username = 'school'
      const password = '123456'
      const token = btoa(`${username}:${password}`)

      const newRow = {
        name: formData.name,
        uniqueId: formData.uniqueId,
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      })

      const result = await response.json()

      if (response.ok) {
        setFilteredRows([...filteredRows, result])
        handleModalClose()
        fetchData()

        console.log('Record created successfully:', result)
        alert('Record created successfully')
      } else {
        console.error('Server responded with:', result)
        alert(`Unable to create record: ${result.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error during POST request:', error)
      alert('Unable to create record')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
  }

  const handleDeleteSelected = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const username = 'school'
        const password = '123456'
        const token = btoa(`${username}:${password}`)

        const response = await fetch(`https://rocketsalestracker.com/api/groups/${id}`, {
          method: 'DELETE',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        })

        if (response.ok) {
          setFilteredData(filteredData.filter((item) => item.id !== id))
          alert('Record deleted successfully')
        } else {
          const result = await response.json()
          console.error('Server responded with:', result)
          alert(`Unable to delete record: ${result.message || response.statusText}`)
        }
      } catch (error) {
        console.error('Error during DELETE request:', error)
        alert('Unable to delete record. Please check the console for more details.')
      }
    }
  }

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(10)

  // pagination code
  const handlePageClick = async (e) => {
    console.log(e)
    setLoading(true) // Start loading
    try {
      const username = 'hbtrack'
      const password = '123456@'
      const token = btoa(`${username}:${password}`)

      const response = await axios.get(
        `https://dummyjson.com/products?limit=${limit}&skip=${page}&select=title,price`,
      )

      if (response.data) {
        console.log('paginated data')
        console.log(response.data)
        setData(response.data.products)
      } else {
        console.error('Expected an array but got:', response.data)
        alert('Unexpected data format received.')
      }
    } catch (error) {
      console.error('Fetch data error:', error)
      alert('An error occurred while fetching data.')
    } finally {
      setLoading(false) // Stop loading once data is fetched
    }
  }

  useState(() => {
    handlePageClick()
  }, [])

  return (
    <div className="m-3">
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Groups</h2>
        </div>

        <div className="d-flex">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => setAddModalOpen(true)}
              variant="contained"
              className="btn btn-success text-white"
            >
              Add Group
            </button>
          </div>
        </div>
      </div>
      <div className="d-md-none mb-2">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TableContainer component={Paper} style={{ maxHeight: '800px', overflowY: 'scroll' }}>
        {loading ? (
          <>
            <div className="text-nowrap mb-2" style={{ width: '70vw' }}>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-7" />
                <span className="placeholder col-4" />
                <span className="placeholder col-4" />
                <span className="placeholder col-6" />
                <span className="placeholder col-8" />
              </p>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-7" />
                <span className="placeholder col-4" />
                <span className="placeholder col-4" />
                <span className="placeholder col-6" />
                <span className="placeholder col-8" />
              </p>
            </div>
          </>
        ) : (
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                {columns.map((column, index) => (
                  <CTableHeaderCell
                    key={index}
                    className="bg-body-tertiary text-center"
                    style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                  >
                    {column.Header}
                  </CTableHeaderCell>
                ))}
                <CTableHeaderCell
                  className="bg-body-tertiary text-center"
                  style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                >
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              { data?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center">
                    {item.title}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-center d-flex"
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <IconButton aria-label="edit">
                      <RiEdit2Fill
                        style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }}
                      />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteSelected(item.id)}>
                      <AiFillDelete style={{ fontSize: '25px', color: 'red', margin: '5.3px' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </TableContainer>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={10} // Set based on the total pages from the API
        previousLabel="< previous"
        marginPagesDisplayed={2}
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
      />

      {/* Add Modal */}

      {/* <Modal open={addModalOpen} onClose={handleAddModalClose}>
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleAddModalClose}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Add New Record
          </Typography>
          <TextField
            label="Name"
            name="name"
            onChange={handleInputChange}
            value={formData.name || ''}
            margin="normal"
            required
          />
          <TextField
            label="Group ID"
            name="uniqueId"
            onChange={handleInputChange}
            value={formData.uniqueId || ''}
            margin="normal"
            required
          />
          <FormControl fullWidth>
            <Button onClick={handleAddSubmit} variant="contained" color="primary">

              Submit
            </Button>
          </FormControl>
        </Box>
      </Modal>  */}

      <Modal
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Group
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleAddModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Group Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Group
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleEditModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Group Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}

export default Group
