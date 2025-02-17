import * as React from 'react';
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Select, MenuItem, RadioGroup, FormControlLabel, Radio, FormControl, TextField, Box, FormHelperText, Autocomplete } from '@mui/material';
import { IoAddCircleOutline, IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdModeEditOutline } from "react-icons/md";
import axios, { AxiosError } from 'axios';
import styles from './OrderPage.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { addingOrderError, addOrderError } from '../Interface/Login.interface';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

import OrderPageCartCard from './OrderPageCartCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface ProductPriceDetails{
  [key: string]: string;  // This allows dynamic string keys to access prices (as strings)

}

// interface PoroductDropDown{
//   productName:string;

// }
// Example product prices for the calculation
// const productPrices = {
//   Laptop: 1000,
//   Mouse: 50,
//   Keyboard: 80,
//   Headphone: 120,
//   Mobile: 600,
// };
interface Product {
  productid: string;
  productname: string;
  price: string;
  quantity: string;
}
const OrderTable: React.FC = () => {

  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [rows, setRows] = React.useState<any[]>([]);
  const [newProduct, setNewProduct] = React.useState<string>('');
  const [newQuantity, setNewQuantity] = React.useState<string>('');
  const [newPaymentMethod, setNewPaymentMethod] = React.useState('');
  const [newAddress, setNewAddress] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [addOrderOpen, setAddOrderOpen] = React.useState(false);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [productPrice,setProductPrice]= React.useState<ProductPriceDetails| null>(null)
  const[productDropDown,setProductDropDown] = React.useState<string[]>([])
  const userId = localStorage.getItem('userId');
 const [productDetails, setProductDetails] = React.useState<Product[]>([]);

 const [availabelQuantity,setAvailabelQuantity]= React.useState<[]>([])
  // const [userOrderDetails,setUserOrderDetails]= React.useState<any[]>([])

  let loginperson = localStorage.getItem('userRole')
  const userid = localStorage.getItem('userId')
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


React.useEffect(() => {
  const fetchProductPrices = async () => {
    try {
      const response = await fetch('http://localhost:5000/product/product-prices');

      console.log('respons',response)
      if (!response.ok) {
        throw new Error('Failed to fetch product prices');
      }
      const data: ProductPriceDetails = await response.json();
      setProductPrice(data);
      setLoading(false);
    } catch (error: any) {
     
      setLoading(false);
    }
  };

  fetchProductPrices();
}, []);
// for the availabel quantity
  React.useEffect(() => {
    const fetchCardDataForCarts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/productsData/cartData`);
        const data: Product[] = await response.json();
        setProductDetails(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchCardDataForCarts();
  }, [rows]);


React.useEffect(()=>{
  const fetchproducts = async ()=>{
    try{

      const response = await axios.get('http://localhost:5000/product/productsName');
      const data = response.data;
      console.log(data)
      setProductDropDown(data);
    }
    catch(error){
      console.error('Error fetching orders:', error);
    }
  }
  fetchproducts ();

},[])
const fetchOrders = async () => {
  try {
      let response;
      if(loginperson ==='admin'){
       console.log("adminOrder====>"  )
         response = await axios.get('http://localhost:5000/orders/allorders');
      }
      else {
        response = await axios.get(`http://localhost:5000/orders/allUserOrders/${userid}`);
      }

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
    setTotalPrice(0);
    setAddOrderOpen(true);
  };

  const handleCloseAddOrderDialog = () => {
    setAddOrderOpen(false);
    setNewProduct('');
    setNewQuantity('');
    setNewPaymentMethod('');
    setNewAddress('');
    setTotalPrice(0);
     
     
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
    const response = await axios.delete(`http://localhost:5000/orders/deleteorder/${selectedOrder.orderid}`);

        if(response.status === 200){
          toast.success(response.data.message,{
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }
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
      
    }else if(Number(newQuantity) < 0){
      setAddorderError((prevState)=>({
        ...prevState,
        quantityError:"qunatity should be positive number"
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
       const response= await axios.put(`http://localhost:5000/orders/updateOrder/${selectedOrder.orderid}`, {
          product: newProduct,
          quantity: Number(newQuantity),
          paymentMethod: newPaymentMethod,
          address: newAddress,
        });
        if(response.status === 200){
          toast.success('Order update successfuly',{
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }
       
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

        if(error instanceof AxiosError){
          if(error.response?.status === 404){

            toast.error(error.response?.data.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              style: {
                backgroundColor: "white", 
                color: "crimson", 
              }
            });
          }
          else if(error.response?.status === 405){
            toast.error("please select lessthan stock item!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            })
            return;
          }
        }
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
    console.log(response.status,"Status for Add order")
    if(response.status ===201){
      toast.success("Order successful!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
      
   
    
        console.log(response.data.orders)
        setAddOrderOpen(false);
        setLoading(false);
        setNewProduct('');
        setNewQuantity('');
        setNewPaymentMethod('');
        setNewAddress('');
        setTotalPrice(0)
        setAddingOrderError({
          productAddError:'',
          quantityAddError:'',
          paymenentmethodAddError:'',
          addressAddError:'',
          
        })


        fetchOrders();
      } catch (error) {
        if(error instanceof AxiosError){
          if(error.response?.status === 400){

            toast.error("Order already exist!", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              style: {
                backgroundColor: "white", 
                color: "crimson", 
              }
            });
          }else if(error.response?.status === 404){
            toast.success("Product not availabel!", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            })
          }
          else if(error.response?.status === 405){
            toast.error("please select lessthan stock item!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            })
            return;
          }
        }
        console.error('Error adding order:', error);
        setLoading(false);
      }
      finally{
       

        fetchOrders();
      }
    }
  };
  React.useEffect(() => {
    
    if (newProduct && productPrice && newQuantity !=='') {
      const pricePerProduct = productPrice[newProduct];
      if (pricePerProduct) {
     
        const price = parseFloat(pricePerProduct); 
        if (!isNaN(price)) {
          setTotalPrice(price * parseFloat(newQuantity));  
        } else {
          setTotalPrice(0);  
        } 
      } else {
        setTotalPrice(0); 
      }
    }
  }, [newProduct, newQuantity, productPrice]);
  // Re-run whenever newProduct or newQuantity changes

  // const columns = React.useMemo<MRT_ColumnDef<any>[]>(() => [
    
   
  //   {
  //     accessorKey: 'product',
  //     header: 'Product Name',
  //   },
  //   {
  //     accessorKey: 'quantity',
  //     header: 'Quantity',
  //     size:150,
  //     muiTableBodyCellProps:{
  //       align:"right",

  //     }
  //   },
  //   {
  //     accessorKey: 'price',
  //     header: 'Price',
  //     size:150,
  //     muiTableBodyCellProps:{
  //       align:"right",

  //     }
  //   },
  //   {
  //     accessorKey: 'address',
  //     header: 'Address',
  //   },
  //   {
  //     accessorKey: 'actions',
  //     header: 'Actions',
  //     Cell: ({ row }) => (
  //       <Box>
  //         <IconButton onClick={() => handleView(row.original)} sx={{color:"green"}}>
  //           <IoEyeOutline />
  //         </IconButton>
  //         <IconButton onClick={() => handleEditDialogOpen(row.original)} sx={{color:"skyblue"}}>
  //           <MdModeEditOutline />
  //         </IconButton>
  //         <IconButton onClick={() => handleDeleteDialogOpen(row.original)} sx={{color:"#eb7777"}}>
  //           <RiDeleteBin7Line />
  //         </IconButton>
  //       </Box>
  //     ),
  //   },
  // ], []);


  const columns = React.useMemo<MRT_ColumnDef<any>[]>(() => {

  
    const baseColumns: MRT_ColumnDef<any>[] = [
      {
        accessorKey: 'product',
        header: 'Product Name',
      },
      {
        accessorKey: 'ordered_date',
        header: 'Order Date',
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        size: 150,
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 150,
        muiTableBodyCellProps: {
          align: 'right',
        },
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
            <IconButton onClick={() => handleView(row.original)} sx={{ color: 'green' }}>
              <IoEyeOutline />
            </IconButton>
            <IconButton onClick={() => handleEditDialogOpen(row.original)} sx={{ color: 'skyblue' }}>
              <MdModeEditOutline />
            </IconButton>
            <IconButton onClick={() => handleDeleteDialogOpen(row.original)} sx={{ color: '#eb7777' }}>
              <RiDeleteBin7Line />
            </IconButton>
          </Box>
        ),
      },
    ];

    if (loginperson === "admin") {
      baseColumns.splice(1, 0, { 
        accessorKey: 'username',
        header: 'Order By',
        Cell: ({ row }) => (
          <Box>
          
            {row.original.username} 
          </Box>
        ),
      });
    }
  
    return baseColumns;
  }, []);
  

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
      sx={{backgroundColor:'rgb(30, 78, 155)'}}
    >
      <IoAddCircleOutline style={{ marginRight: '4px'}} />
      <Typography textTransform={'none'}>Add Order</Typography>
    </Button>
    ),
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid gray',
        backgroundColor: 'rgb(30, 78, 155)',
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
       <ToastContainer></ToastContainer>
        <h1 className={styles.heading}>Order Details</h1>
        {/* <HomePageData></HomePageData> */}
     
        <OrderPageCartCard rows={rows}/>
        
     
      <div className={styles.addButtontop}>

        

            <div style={{ marginLeft: '20px', marginRight: '20px' }}>
               <MaterialReactTable table={table} />
             </div>

        {/* Add Order Dialog */}
        <Dialog open={addOrderOpen} onClose={handleCloseAddOrderDialog} className={styles.dialog}>
        <Box className={styles.closearrow}>
          <DialogTitle  className='dialogTitle'>Add Order</DialogTitle>
                <IconButton onClick={handleCloseAddOrderDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent>
          <div className={styles.editdailogcontent}>
              
            <p className={styles.labeles}>Product<span className='requiredAsterisk'> *</span></p>
            <Select
              value={newProduct}
              onChange={(e) => handleInputChange('product', e.target.value)}
              className={styles.selectsfields}
            >
              {/* <MenuItem value="Laptop">Laptop</MenuItem>
              <MenuItem value="Mouse">Mouse</MenuItem>
              <MenuItem value="Keyboard">Keyboard</MenuItem>
              <MenuItem value="Headphone">HeadPhone</MenuItem>
              <MenuItem value="Mobile">Mobile</MenuItem> */}

          {productDropDown.map((product, index) => (
            <MenuItem key={index} value={product}>
              {product}
            </MenuItem>
          ))}

            </Select>
            <FormHelperText style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {addingOrderError.productAddError ? addingOrderError.productAddError: ' '}</FormHelperText>
            <p className={styles.labeles}>Quantity<span className='requiredAsterisk'> *</span></p>
            <TextField
              size="small"
              value={newQuantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              margin="normal"
              type="number"
              inputProps={{min:0}}
              
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
            <FormHelperText style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {addingOrderError.quantityAddError ? addingOrderError.quantityAddError: ' '}</FormHelperText>
            
            <p className={styles.labeles}>Payment Method<span className='requiredAsterisk'> *</span></p>
          
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

            <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
            {addingOrderError.paymenentmethodAddError ? addingOrderError.paymenentmethodAddError: ' '}</FormHelperText>

            <p className={styles.labeles}>Address<span className='requiredAsterisk'> *</span></p>
            <TextField
              size="small"
              value={newAddress}
              onChange={(e) => handleInputChange('address', e.target.value)}
              margin="normal"
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
              <FormHelperText style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
            {addingOrderError.addressAddError ? addingOrderError.addressAddError: ' '}</FormHelperText>
                            {totalPrice > 0 && (
                  <>
                    <p className={styles.labeles}>Total Price</p>
                    <TextField
                      size="small"
                      value={`Rs: ${totalPrice.toFixed(2)}`}
                      margin="normal"
                      className={`${styles.textField} ${styles.inputBaseRoot}`}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </>
                )}
            
         </div>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseAddOrderDialog} color="secondary"  className='mainButton' >
            <Typography textTransform={'none'}>Cancel</Typography>   
            </Button>
            <Button onClick={handleAddOrderSubmit } color="primary"  className='mainButton'>
           <Typography textTransform={'none'}>Add</Typography>   
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Order Dialog */}
        <Dialog open={open} onClose={handleClose}>
        <Box className={styles.closearrow}>
            <DialogTitle  className='dialogTitle'>Order Details</DialogTitle>
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
            <Button onClick={handleClose} color="secondary"   className='mainButton'>
             <Typography textTransform={'none'}>Close</Typography>
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog open={editOpen} onClose={handleCloseEditDialog}>
        <Box className={styles.closearrow}>
            <DialogTitle className='dialogTitle'>Edit Product</DialogTitle>
                <IconButton onClick={handleCloseEditDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent>
            <p className={styles.labeles}>Product<span className='requiredAsterisk'> *</span></p>
            {/* <Select
              value={newProduct}
              onChange={(e) => handleInputChange('product', e.target.value)}
              className={styles.selectsfields}
            >
              <MenuItem value="Laptop">Laptop</MenuItem>
              <MenuItem value="Mouse">Mouse</MenuItem>
              <MenuItem value="Keyboard">Keyboard</MenuItem>
              <MenuItem value="Headphone">HeadPhone</MenuItem>
              <MenuItem value="Mobile">Mobile</MenuItem>
            </Select> */}

              <Autocomplete
              value={newProduct || ''}
              onChange={(e, newValue) => handleInputChange('product', newValue || '')}
              options={productDropDown}
              className={styles.auto}
              // freeSolo // Allow custom input (this allows users to type their own value)
              renderInput={(params) => <TextField {...params} size="small"   />}
              />
            <FormHelperText style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
            {addOrderError.productError ? addOrderError.productError: ' '}</FormHelperText>

            <p className={styles.labeles}>Availabel Quantity<span className='requiredAsterisk'> *</span></p>
            <TextField
              size="small"
              value={newQuantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              margin="normal"
              type="number"
              inputProps={{min:0}}
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
             <FormHelperText style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
             {addOrderError.quantityError ? addOrderError.quantityError: ' '}</FormHelperText>
             <p className={styles.labeles}>Quantity<span className='requiredAsterisk'> *</span></p>
            <TextField
              size="small"
              value={newQuantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              margin="normal"
              type="number"
              inputProps={{min:0}}
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
              <FormHelperText style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
              {addOrderError.quantityError ? addOrderError.quantityError: ' '}</FormHelperText>
            <p className={styles.labeles}>Payment Method<span className='requiredAsterisk'> *</span></p>
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
            <p style={{ margin:"0px", marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
            {addOrderError.paymenentmethodError ? addOrderError.paymenentmethodError: ' '}</p>

            <p className={styles.labeles}>Address<span className='requiredAsterisk'> *</span></p>
            <TextField
              size="small"
              value={newAddress}
              onChange={(e) => handleInputChange('address', e.target.value)}
              margin="normal"
              className={`${styles.textField} ${styles.inputBaseRoot}`}
            />
               <FormHelperText style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
               {addOrderError.addressError ? addOrderError.addressError: ' '}</FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}   className='mainButton' >
            <Typography textTransform={'none'}>Cancel</Typography>
            </Button>
            <Button onClick={handleEditSubmit} color="primary" className='mainButton'  >
             <Typography textTransform={'none'}> Update</Typography> 
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Order Dialog */}
        <Dialog open={deleteOpen} onClose={handleCloseDeleteDialog}>
        <Box className={styles.closearrow}>
            <DialogTitle className='dialogTitle'>Delete Order</DialogTitle>
                <IconButton onClick={handleCloseDeleteDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent>
            <Typography variant="body1">Are you sure you want to delete this order?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="secondary" className='mainButton'>
              <Typography textTransform={'none'}>Cancel</Typography>
            </Button>
            <Button onClick={handleDelete} color="primary" className='mainButton' >
              <Typography textTransform={'none'}>Delete</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default OrderTable;
