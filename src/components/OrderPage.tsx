import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Select, MenuItem, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, TextField, Box } from '@mui/material';
import { IoAddCircleOutline, IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdModeEditOutline } from "react-icons/md";
import axios from 'axios';
import styles from './OrderPage.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { addingOrderError, addOrderError } from '../Interface/Login.interface';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { data } from 'react-router-dom';

const OrderTable: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [rows, setRows] = React.useState<any[]>([]);
  const [newProduct, setNewProduct] = React.useState('');
  const [newQuantity, setNewQuantity] = React.useState('');
  const [newPaymentMethod, setNewPaymentMethod] = React.useState('');
  const [newAddress, setNewAddress] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [addOrderOpen, setAddOrderOpen] = React.useState(false);
  const userId = localStorage.getItem('userId');

  const [addOrderError, setAddorderError] = React.useState<addOrderError>( 
    {productError:'',
    quantityError:'',
    paymenentmethodError:'',
    addressError:''
})
  const [addingOrderError, setAddingOrderError] = React.useState<addingOrderError>( 
    {productAddError:'',
    quantityAddError:'',
    paymenentmethodAddError:'',
    addressAddError:''
})

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders/allorders');
      console.log(response.data.orders)
      setRows(response.data.orders);
      // console.log(response.data.orders.orderid)
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddOrderDialogOpen = () => {
    setAddOrderOpen(true);
  };

  const handleCloseAddOrderDialog = () => {
    setAddOrderOpen(false);
    setNewProduct('');
    setNewQuantity('');
    setNewPaymentMethod('');
    setNewAddress('');
     
     
    setAddingOrderError({
      productAddError:'',
      quantityAddError:'',
      paymenentmethodAddError:'',
      addressAddError:''
    })
  };

  

  const handleInputChange = (field: string, value: string) => {
    if (field === 'product') setNewProduct(value);
    if (field === 'quantity') setNewQuantity(value);
    if (field === 'paymentMethod') setNewPaymentMethod(value);
    if (field === 'address') setNewAddress(value);
  };

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleDeleteDialogOpen = (order: any) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (selectedOrder) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/orders/deleteorder/${selectedOrder.orderid}`);
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedOrder.id));
        fetchOrders();
        setDeleteOpen(false);
        setLoading(false);
      } catch (error) {
        console.error('Error deleting order:', error);
        setLoading(false);
      }
    }
  };

  const handleEditDialogOpen = (order: any) => {
    setSelectedOrder(order);
    setNewProduct(order.product);
    setNewQuantity(order.quantity);
    setNewPaymentMethod(order.paymentMethod);
    setNewAddress(order.address);
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    let isValid = true;

    if (newProduct.trim() === '') {
      setAddorderError((prevState)=>({
        ...prevState,
        productError:"Product name is required"
      }))
      isValid = false;
    }

    if (newQuantity === '' ) {
      setAddorderError((prevState)=>({
        ...prevState,
        quantityError:"qunatity name is required"
      }))
      isValid = false;
      
    }

    if (newPaymentMethod.trim() === '') {
      setAddorderError((prevState)=>({
        ...prevState,
        paymenentmethodError:"payment method is required"
      }))
      isValid = false;
    }

    if (newAddress.trim() === '') {
      setAddorderError((prevState)=>({
        ...prevState,
        addressError:"Address is required"
      }))
      isValid = false;
    }

    if (isValid) {
      try {
        setLoading(true);

        console.log("update datra", newProduct, newQuantity, newPaymentMethod, newAddress)
        await axios.put(`http://localhost:5000/orders/updateOrder/${selectedOrder.orderid}`, {
          product: newProduct,
          quantity: Number(newQuantity),
          paymentMethod: newPaymentMethod,
          address: newAddress,
        });
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedOrder.id
              ? { ...row, product: newProduct, quantity: Number(newQuantity), paymentMethod: newPaymentMethod, address: newAddress }
              : row
          )
        );
        fetchOrders();
        setEditOpen(false);
        setLoading(false);
      } catch (error) {
        console.error('Error updating order:', error);
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAddOrderOpen(false);
    setNewProduct('');
    setNewQuantity('');
    setNewPaymentMethod('');
    setNewAddress('');
  };

  const handleCloseDeleteDialog = () => {
    setDeleteOpen(false);
  };

  const handleCloseEditDialog = () => {
    setEditOpen(false);
    setAddOrderOpen(false);
    setNewProduct('');
    setNewQuantity('');
    setNewPaymentMethod('');
    setNewAddress('');
    setAddorderError({
      productError:'',
      quantityError:'',
      paymenentmethodError:'',
      addressError:''
    })
  };

  const handleAddOrderSubmit = async () => {
    let isValid = true;

    if (newProduct.trim() === '') {

      setAddingOrderError((prevState)=>({
        ...prevState,
        productAddError:"product name is required",
      }
  ))
      isValid = false;
    }

    if (newQuantity === '' || isNaN(Number(newQuantity))) {
      setAddingOrderError((prevState)=>({
        ...prevState,
        quantityAddError:"Quantity is required",
      }
  ))
      isValid = false;
    }

    if (newPaymentMethod.trim() === '') {
      setAddingOrderError((prevState)=>({
        ...prevState,
        paymenentmethodAddError:"PaymentMethod is required",
      }
  ))
      isValid = false;
    }

    if (newAddress.trim() === '') {
      setAddingOrderError((prevState)=>({
        ...prevState,
        addressAddError:"Address name is required",
      }
  ))
      isValid = false;
    }

    if (isValid) {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/orders/addOrder', {
          userId:userId,
          product: newProduct,
          quantity: Number(newQuantity),
          paymentMethod: newPaymentMethod,
          address: newAddress,
        });

        console.log(response.data.orders)
        setAddOrderOpen(false);
        setLoading(false);
        setNewProduct('');
        setNewQuantity('');
        setNewPaymentMethod('');
        setNewAddress('');
        setAddingOrderError({
          productAddError:'',
          quantityAddError:'',
          paymenentmethodAddError:'',
          addressAddError:''
        })


        fetchOrders();
      } catch (error) {
        console.error('Error adding order:', error);
        setLoading(false);
      }
    }
  };
 

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(() => [
    {
      accessorKey: 'product',
      header: 'Product Name',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      size:150,
      muiTableBodyCellProps:{
        align:"right",

      }
    },
    {
      accessorKey: 'price',
      header: 'Price',
      size:150,
      muiTableBodyCellProps:{
        align:"right",

      }
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <Box>
          <IconButton onClick={() => handleView(row.original)}>
            <IoEyeOutline />
          </IconButton>
          <IconButton onClick={() => handleEditDialogOpen(row.original)}>
            <MdModeEditOutline />
          </IconButton>
          <IconButton onClick={() => handleDeleteDialogOpen(row.original)}>
            <RiDeleteBin7Line />
          </IconButton>
        </Box>
      ),
    },
  ], []);



  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableTopToolbar: true,
    renderTopToolbarCustomActions: () => (
      <Button
      variant="contained"
      color="primary"
      onClick={handleAddOrderDialogOpen}
      className={styles.handleAddOrderDialogOpen}
    >
      <IoAddCircleOutline style={{ marginRight: '4px' }} />
      <Typography textTransform={'none'}>Add Order</Typography>
    </Button>
    ),
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid gray',
        backgroundColor: 'rgb(156, 156, 233)',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid gray',

      },
    },
  });



  return (
    <>
      <div className={styles.addButtontop}>
        <h1 className={styles.heading}>Order Details</h1>

       

            <div style={{ marginLeft: '20px', marginRight: '20px' }}>
               <MaterialReactTable table={table} />
             </div>

        {/* Add Order Dialog */}
        <Dialog open={addOrderOpen} onClose={handleCloseAddOrderDialog} className={styles.dialog}>
        <Box className={styles.closearrow}>
          <DialogTitle className={styles.dialogTitle}>Add Order</DialogTitle>
                <IconButton onClick={handleCloseAddOrderDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent>
          <div className={styles.editdailogcontent}>
              
            <p className={styles.labeles}>Product</p>
            <Select
              value={newProduct}
              onChange={(e) => handleInputChange('product', e.target.value)}
              className={styles.selectsfields}
            >
              <MenuItem value="Laptop">Laptop</MenuItem>
              <MenuItem value="Mouse">Mouse</MenuItem>
              <MenuItem value="Keyboard">Keyboard</MenuItem>
              <MenuItem value="Headphone">HeadPhone</MenuItem>
              <MenuItem value="Mobile">Mobile</MenuItem>
            </Select>
            <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {addingOrderError.productAddError ? addingOrderError.productAddError: ' '}</p>
            <p className={styles.adrresLabels}>Quantity</p>
            <TextField
              size="small"
              value={newQuantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              margin="normal"
              type="number"
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
            <p style={{ marginTop: "-6px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {addingOrderError.quantityAddError ? addingOrderError.quantityAddError: ' '}</p>
            
            <p className={styles.labeles}>Payment Method</p>
          
                          <FormControl className={`${styles.radios} ${styles.inputBaseRoot}`}>
                  <RadioGroup
                    value={newPaymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    row
                    className={styles.radios}
                  >
                    <FormControlLabel
                      value="creditCard"
                      control={<Radio />}
                      label="Credit Card"
                      componentsProps={{
                        typography: {
                          style: {
                            fontSize: '0.8rem', // Reduce the size here
                          },
                        },
                      }}
                    />
                    <FormControlLabel
                      value="paypal"
                      control={<Radio />}
                      label="PayPal"
                      componentsProps={{
                        typography: {
                          style: {
                            fontSize: '0.8rem', // Reduce the size here
                          },
                        },
                      }}
                    />
                    <FormControlLabel
                      value="bankTransfer"
                      control={<Radio />}
                      label="Bank Transfer"
                      componentsProps={{
                        typography: {
                          style: {
                            fontSize: '0.8rem', // Reduce the size here
                          },
                        },
                      }}
                    />
                  </RadioGroup>
                </FormControl>

            <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
            {addingOrderError.paymenentmethodAddError ? addingOrderError.paymenentmethodAddError: ' '}</p>

            <p className={styles.adrresLabels}>Address</p>
            <TextField
              size="small"
              value={newAddress}
              onChange={(e) => handleInputChange('address', e.target.value)}
              margin="normal"
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
              <p style={{ marginTop: "-6px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
            {addingOrderError.addressAddError ? addingOrderError.addressAddError: ' '}</p>

         </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddOrderDialog} color="secondary" className={`${styles.button} ${styles.cancelButton}`} >
            <Typography textTransform={'none'}>Cancel</Typography>   
            </Button>
            <Button onClick={handleAddOrderSubmit } color="primary" className={`${styles.button} ${styles.addvalueButton}`}>
           <Typography textTransform={'none'}>{loading ? 'Adding...' : 'Add'}</Typography>   
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Order Dialog */}
        <Dialog open={open} onClose={handleClose}>
        <Box className={styles.closearrow}>
            <DialogTitle className={styles.dialogTitle}>Order Details</DialogTitle>
                <IconButton onClick={handleClose}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent className={styles.viewContent}>
            <Typography variant="body1"><strong>Product:</strong> {selectedOrder?.product}</Typography>
            <Typography variant="body1"><strong>Quantity:</strong> {selectedOrder?.quantity}</Typography>
            <Typography variant="body1"><strong>Price:</strong> {selectedOrder?.price}</Typography>
            <Typography variant="body1"><strong>Address:</strong> {selectedOrder?.address}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary"  className={`${styles.button} ${styles.cancelButton}`}>
             <Typography textTransform={'none'}>Close</Typography>
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog open={editOpen} onClose={handleCloseEditDialog}>
        <Box className={styles.closearrow}>
            <DialogTitle className={styles.dialogTitle}>Edit Product</DialogTitle>
                <IconButton onClick={handleCloseEditDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent>
            <p className={styles.labeles}>Product</p>
            <Select
              value={newProduct}
              onChange={(e) => handleInputChange('product', e.target.value)}
              className={styles.selectsfields}
            >
              <MenuItem value="Laptop">Laptop</MenuItem>
              <MenuItem value="Mouse">Mouse</MenuItem>
              <MenuItem value="Keyboard">Keyboard</MenuItem>
              <MenuItem value="Headphone">HeadPhone</MenuItem>
              <MenuItem value="Mobile">Mobile</MenuItem>
            </Select>
            <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
            {addOrderError.productError ? addOrderError.productError: ' '}</p>

            <p className={styles.adrresLabels}>Quantity</p>
            <TextField
              size="small"
              value={newQuantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              margin="normal"
              type="number"
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
              <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
              {addOrderError.quantityError ? addOrderError.quantityError: ' '}</p>
            <p className={styles.labeles}>Payment Method</p>
            <FormControl className={`${styles.radios} ${styles.inputBaseRoot}`}>
              <RadioGroup
                value={newPaymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                row
              >
                <FormControlLabel value="creditCard" control={<Radio />} label="Credit Card"  componentsProps={{
        typography: {
          style: {
            fontSize: '0.8rem', // Reduce the size here
          },
        },
      }} />
                <FormControlLabel value="paypal" control={<Radio />} label="PayPal"   componentsProps={{
        typography: {
          style: {
            fontSize: '0.8rem', // Reduce the size here
          },
        },
      }}/>
                <FormControlLabel value="bankTransfer" control={<Radio />} label="Bank Transfer"  componentsProps={{
        typography: {
          style: {
            fontSize: '0.8rem', // Reduce the size here
          },
        },
      }} />
              </RadioGroup>
            </FormControl>
            <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
            {addOrderError.paymenentmethodError ? addOrderError.paymenentmethodError: ' '}</p>

            <p className={styles.adrresLabels}>Address</p>
            <TextField
              size="small"
              value={newAddress}
              onChange={(e) => handleInputChange('address', e.target.value)}
              margin="normal"
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
               <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
               {addOrderError.addressError ? addOrderError.addressError: ' '}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary" className={`${styles.cancelButton} `}>
            <Typography textTransform={'none'}>Cancel</Typography>
            </Button>
            <Button onClick={handleEditSubmit} color="primary" className={`${styles.button} ${styles.updateButton}`}  >
             <Typography textTransform={'none'}> Update</Typography> 
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Order Dialog */}
        <Dialog open={deleteOpen} onClose={handleCloseDeleteDialog}>
        <Box className={styles.closearrow}>
            <DialogTitle className={styles.dialogTitle}>Delete Order</DialogTitle>
                <IconButton onClick={handleCloseDeleteDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent>
            <Typography variant="body1">Are you sure you want to delete this order?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="secondary" className={`${styles.button} ${styles.cancelButton}`}>
              <Typography textTransform={'none'}>Cancel</Typography>
            </Button>
            <Button onClick={handleDelete} color="primary" className={`${styles.button} ${styles.deleteButton}`}>
              <Typography textTransform={'none'}>Delete</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default OrderTable;
