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

interface BackDrop{
  Backdrop:()=>void;
}

const SettingsTable:React.FC<BackDrop>= ({Backdrop}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [rows, setRows] = React.useState<any[]>([]); 
  const [newFirstName, setNewFirstName] = React.useState('');
  const [newLastName, setNewLastName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [edituserdetailsError, setEditUserDetailsError] = React.useState<edituserDetailError>({
    firstnameError: '',
    lastnameError: '',
  });

  const fetchUsers = async () => {
    try {
      Backdrop();
      const response = await axios.get('http://localhost:5000/users/users/');
      setTimeout(()=>{
        Backdrop();
        
      },6000)
      setRows(response.data); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [Backdrop]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
    {
      accessorKey: 'userName',
      header: 'Username',
      muiTableHeadCellProps: {
        style: {
        
        color: 'black',  
        fontSize: '16px', 
        height:"50px"

        },
      },
    },
    {
      accessorKey: 'email_id',
      header: 'Email',
      muiTableHeadCellProps: {
        style: {
        
        color: 'black', 
        fontSize: '16px',
        },
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      muiTableHeadCellProps: {
        style: {
        
        color: 'black', 
        fontSize: '16px',  
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
  ],[]);

  const handleView = (user: any) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDeleteDialogOpen = (user: any) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
       
     
         Backdrop()
         await new Promise(resolve => setTimeout(resolve, 50));

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
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedUser.id));
        setDeleteOpen(false);
        Backdrop()
        setLoading(false);
      } catch (error) {
        Backdrop()
        console.error('Error deleting user:', error);
        setLoading(false);
      }
    }
  };

  // Accept user (mark as verified)
  const handleAccept = async (id: string) => {

    try {
      Backdrop();
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
        Backdrop();
        // fetchUsers();
      }
    } catch (error) {
      Backdrop();
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
    console.log(user,'UserData')
    const id = user.id;
    try {
      Backdrop();
      const response = await axios.get(`http://localhost:5000/users/usersData/${id}`);
      const userData = response.data;
      setNewFirstName(userData.firstname);
      setNewLastName(userData.lastname);
      // setNewQuantity(userData.quantity)
      setEditOpen(true);
      Backdrop();
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
       fontSize:"13px !important" ,
       color:'white !important'
    }
     
    },
  
    muiTableBodyCellProps: {
      sx :{
        border : '1px solid gray',
       fontSize:'13px'
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

        <DialogContent className={styles.viewdailogs}>
             <p className={styles.labelforview}>Product</p>
             <TextField
              size="small"
              value={selectedUser?.userName}
             
              margin="normal"
             
              inputProps={{min:0}}
              className={`${styles.textFields} ${styles.inputBaseRoots}`}
             disabled
            />
             <p className={styles.labelforview}>Quantity</p>
             <TextField
              size="small"
              value={selectedUser?.email_id}
             
              margin="normal"
             
              inputProps={{min:0}}
              className={`${styles.textFields} ${styles.inputBaseRoots}`}
             disabled
            />
             <p className={styles.labelforview}>Price</p>
             <TextField
              size="small"
              value={selectedUser?.role}
             
              margin="normal"
             
              inputProps={{min:0}}
              className={`${styles.textFields} ${styles.inputBaseRoots}`}
             disabled
            />
             <p className={styles.labelforview}>Price</p>
             <TextField
              size="small"
              value={selectedUser?.is_verified ? 'Verified' : 'Not Verified'}
             
              margin="normal"
             
              inputProps={{min:0}}
              className={`${styles.textFields} ${styles.inputBaseRoots}`}
             disabled
            />
         
             

         
          </DialogContent>
        
        {/* <DialogContent>
          {selectedUser && (
            <div>
              <p><strong>Username:</strong> {selectedUser.userName}</p>
              <p><strong>Email:</strong> {selectedUser.email_id}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>isVerified:</strong> {selectedUser.is_verified ? 'Verified' : 'Not Verified'}</p>
            </div>
          )}
        </DialogContent> */}
        <DialogActions>
          <Button onClick={handleClose} color="primary" className="mainButton">
            <Typography textTransform={'none'}>Close</Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onClose={handleCloseDeleteDialog} className={styles.dialog}>
        <Box className={styles.closearrow}>
          <DialogTitle className='dialogTitle'>Delete Confirm</DialogTitle>
          <IconButton onClick={handleCloseDeleteDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent className='deltecontent'>
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
          <DialogTitle className="dialogTitle">Edit User</DialogTitle>
          <IconButton onClick={handleCloseEditDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent className={styles.addone}>
          {selectedUser && (
            <div className={styles.paragrap}>
              <p className={styles.labeles}>Email<span className='requiredAsterisk'> *</span></p>
              <TextField size="small" value={selectedUser.email_id} disabled className={styles.textField} />
              <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                {edituserdetailsError.firstnameError ? " " : " "}
              </FormHelperText>

              <p className={styles.labeles}>FirstName<span className='requiredAsterisk'> *</span></p>
              <TextField
                size="small"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className={`${styles.textField} ${styles.inputBaseRoot}`}
              />
              <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                {edituserdetailsError.firstnameError ? edituserdetailsError.firstnameError : " "}
              </FormHelperText>
              <p className={styles.labeles}>LastName<span className='requiredAsterisk'> *</span></p>
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
