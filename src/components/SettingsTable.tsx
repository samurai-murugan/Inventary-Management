import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, IconButton, TextField, Typography } from '@mui/material';
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin7Line } from "react-icons/ri";
import { VscVerified } from "react-icons/vsc";
import { MdModeEditOutline } from "react-icons/md";
import axios from 'axios';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useMemo } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { edituserDetailError } from '../Interface/Login.interface';
import styles from './SettingsTable.module.css';
import { toast, ToastContainer } from 'react-toastify';

const SettingsTable: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [rows, setRows] = React.useState<any[]>([]); // Data for the table
  const [newFirstName, setNewFirstName] = React.useState('');
  const [newLastName, setNewLastName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [edituserdetailsError, setEditUserDetailsError] = React.useState<edituserDetailError>({
    firstnameError: '',
    lastnameError: '',
  });

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users/users/');
      setRows(response.data); // Set fetched data into rows
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Define columns for MaterialReactTable
  const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
    {
      accessorKey: 'userName',
      header: 'Username',
      muiTableHeadCellProps: {
        style: {
        
        color: 'black',  // Text color set to black
        fontSize: '16px',  // Adjust the font size of the header
        height:"50px"

        },
      },
    },
    {
      accessorKey: 'email_id',
      header: 'Email',
      muiTableHeadCellProps: {
        style: {
        
        color: 'black',  // Text color set to black
        fontSize: '16px',  // Adjust the font size of the header
        },
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      muiTableHeadCellProps: {
        style: {
        
        color: 'black',  // Text color set to black
        fontSize: '16px',  // Adjust the font size of the header
        },
      },
    },
    {
      accessorKey: 'is_verified',
      header: 'isVerified',
      Cell: ({ cell }: any) => (cell.getValue() ? 'Verified' : 'Not Verified'),
      muiTableHeadCellProps: {
        style: {
        
        color: 'black',  
        fontSize: '16px', 

        },
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }: any) => (
        <Box>
          <IconButton onClick={() => handleView(row.original)} sx={{ color: 'green' }}>
            <IoEyeOutline />
          </IconButton>
          {row.original.is_verified && (
            <IconButton onClick={() => handleEditDialogOpen(row.original)} sx={{ color: 'skyblue' }}>
              <MdModeEditOutline />
            </IconButton>
          )}
          {!row.original.is_verified && (
            <IconButton onClick={() => handleAccept(row.original.id)}  sx={{ color: '#eb7777' }}>
              <VscVerified />
            </IconButton>
          )}
          <IconButton onClick={() => handleDeleteDialogOpen(row.original)} className='deleteIcon' sx={{ color: '#eb7777' }}>
            <RiDeleteBin7Line />
          </IconButton>
        </Box>
      ),
      muiTableHeadCellProps: {
        style: {
         
        color: 'black',  
        fontSize: '16px',  
        
        },
      },
    },
  ], []);

  // Handle view user data
  const handleView = (user: any) => {
    setSelectedUser(user);
    setOpen(true);
  };

  // Handle open delete dialog
  const handleDeleteDialogOpen = (user: any) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  // Delete user
  const handleDelete = async () => {
    if (selectedUser) {
      try {
        setLoading(true);
      const response=  await axios.delete(`http://localhost:5000/users/users/${selectedUser.id}`);

         if(response.status ===200){
                  toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
               
                }
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedUser.id)); // Update rows after deletion
        setDeleteOpen(false);
        setLoading(false);
      } catch (error) {
        console.error('Error deleting user:', error);
        setLoading(false);
      }
    }
  };

  // Accept user (mark as verified)
  const handleAccept = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/users/verify/${id}`, { isVerified: true });
      if (response.status === 200) {
        console.log("verify  toasting",)
          toast.success("user Verified", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
       
          
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, is_verified: true } : row
          )
        );
        fetchUsers();
      }
    } catch (error) {
      console.error('Error accepting user:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteOpen(false);
  };

  // Open edit user dialog and fetch user details
  const handleEditDialogOpen = async (user: any) => {
    setSelectedUser(user);
    const id = user.id;
    try {
      const response = await axios.get(`http://localhost:5000/users/usersData/${id}`);
      const userData = response.data;
      setNewFirstName(userData.firstname);
      setNewLastName(userData.lastname);
      setEditOpen(true);
    } catch (error) {
      console.error('Error fetching user details for edit:', error);
    }
  };

  // Handle edit user submit
  const handleEditSubmit = async () => {
    let isValid = true;
    if (newFirstName.trim() === '') {
      setEditUserDetailsError((prevState) => ({
        ...prevState,
        firstnameError: 'First name is required.',
      }));
      isValid = false;
    }
    if (newLastName.trim() === '') {
      setEditUserDetailsError((prevState) => ({
        ...prevState,
        lastnameError: 'Last name is required.',
      }));
      isValid = false;
    }

    if (isValid) {
      try {
        setLoading(true);
     const response =  await axios.put(`http://localhost:5000/users/users/updateUser/${selectedUser.id}`, {
          firstname: newFirstName,
          lastname: newLastName,
        });
        if (response.status === 200) {
        
            toast.success("user updated successfully", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedUser.id
              ? { ...row, firstname: newFirstName, lastname: newLastName }
              : row
          )
        );
        fetchUsers();
        setEditOpen(false);
        setLoading(false);
      } catch (error) {
        console.error('Error updating user:', error);
        setLoading(false);
      }
    }
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditOpen(false);
    setEditUserDetailsError({
      firstnameError: '',
      lastnameError: '',
    });
  };

  const tabel = useMaterialReactTable({
    columns,
    data: rows,
    enableTopToolbar: true,
    muiTableHeadCellProps :{
    sx : {
      border : '1px solid gray',
      backgroundColor: 'rgb(30, 78, 155)',
    }
    

    },
    muiTableBodyCellProps: {
      sx :{
        border : '1px solid gray',
       
      }
    } // data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <>
    <ToastContainer/>
      <h1 className={styles.heading}>User Details</h1>
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <MaterialReactTable table={tabel} />
      </div>

      {/* View user data dialog */}
      <Dialog open={open} onClose={handleClose} className={styles.dialog}>
        <Box className={styles.closearrow}>
          <DialogTitle className='dialogTitle'>User Details</DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          {selectedUser && (
            <div>
              <p><strong>Username:</strong> {selectedUser.userName}</p>
              <p><strong>Email:</strong> {selectedUser.email_id}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>isVerified:</strong> {selectedUser.is_verified ? 'Verified' : 'Not Verified'}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" className="mainButton">
            <Typography textTransform={'none'}>Close</Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onClose={handleCloseDeleteDialog} className={styles.dialog}>
        <Box className={styles.closearrow}>
          <DialogTitle className={styles.dialogTitle}>Delete Confirm</DialogTitle>
          <IconButton onClick={handleCloseDeleteDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          {selectedUser && (
            <div>
              <p><strong>Are you sure you want to delete this user?</strong> {selectedUser.userName}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary" className="mainButton">
            <Typography textTransform={'none'}>Cancel</Typography>
          </Button>
          <Button onClick={handleDelete} color="secondary" className="mainButton" disabled={loading}>
            <Typography textTransform={'none'}>Delete</Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onClose={handleCloseEditDialog} className={styles.dialog}>
        <Box className={styles.closearrow}>
          <DialogTitle className={styles.dialogTitle}>Edit User</DialogTitle>
          <IconButton onClick={handleCloseEditDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          {selectedUser && (
            <div className={styles.paragrap}>
              <p className={styles.labeles}>Email</p>
              <TextField size="small" value={selectedUser.email_id} disabled className={styles.textField} />
              <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                {edituserdetailsError.firstnameError ? " " : " "}
              </FormHelperText>

              <p className={styles.labeles}>FirstName</p>
              <TextField
                size="small"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className={`${styles.textField} ${styles.inputBaseRoot}`}
              />
              <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                {edituserdetailsError.firstnameError ? edituserdetailsError.firstnameError : " "}
              </FormHelperText>
              <p className={styles.labeles}>LastName</p>
              <TextField
                size="small"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                className={`${styles.textField} ${styles.inputBaseRoot}`}
              />
              <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                {edituserdetailsError.lastnameError ? edituserdetailsError.lastnameError : " "}
              </FormHelperText>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary" className="mainButton">
            <Typography textTransform={'none'}>Cancel</Typography>
          </Button>
          <Button onClick={handleEditSubmit} color="secondary" className="mainButton" disabled={loading}>
            <Typography textTransform={'none'}>Update</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsTable;
