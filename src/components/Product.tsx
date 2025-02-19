import * as React from 'react';
import {IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box, FormHelperText, Autocomplete } from '@mui/material';
import { IoAddCircleOutline, IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdModeEditOutline } from "react-icons/md";
import axios from 'axios';
import styles from './Product.module.css';
import { edituserproductError, productAddError } from '../Interface/Login.interface';  // Import your interface for error handling
import CloseIcon from '@mui/icons-material/Close';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
interface BackDrop{
  BackDrop:()=>void;
}

const ProductTable: React.FC<BackDrop> = ({BackDrop}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [rows, setRows] = React.useState<any[]>([]);
  const [newName, setNewName] = React.useState('');
  const [newQuantity, setNewQuantity] = React.useState('');
  const [newPrice, setNewPrice] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [addProductOpen, setAddProductOpen] = React.useState(false);
     const [productList, setProductList] = React.useState([
    "Laptop", "Mouse", "Keyboard", "Headphone", "Mobile"
  ]);
  

 


  const [newProduct, setNewProduct] = React.useState({ name: '', quantity: '', price: '' });
  const [editProductDetailsError, setEditProductDetailsError] = React.useState<edituserproductError>({
    productnameError: '',
    quantityError: '',
    priceError: '',
  });
  const [ProductDetailsAddError, setProductDetailsAddError] = React.useState<productAddError>({
    productnameAddError: '',
    quantityAddError: '',
    priceAddError: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/product/allproducts');

      setRows(response.data.products);
      BackDrop()
    } catch (error) {
      BackDrop()
      console.error('Error fetching products:', error);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, [BackDrop]);

  const handleAddProductDialogOpen = () => {
    setAddProductOpen(true);
  };

  const handleCloseAddProductDialog = () => {
    setNewProduct({ name: '', quantity: '', price: '' });
    setProductDetailsAddError({
      productnameAddError: '',
      quantityAddError: '',
      priceAddError: '',
    })
    setAddProductOpen(false);

  };

  const handleInputChange = (field: string, value: string) => {
    // console.log("Updated Field: ", field, " New Value: ", value);
    // console.log("new Product===>", field,value)
    setNewProduct((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (field === 'name') {
      setNewName(value);  // Update name directly
    } else if (field === 'quantity') {
      setNewQuantity(value);  // Update quantity
    } else if (field === 'price') {
      setNewPrice(value);  // Update price
    }
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDeleteDialogOpen = (product: any) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        setLoading(true);
       const response= await axios.delete(`http://localhost:5000/product/deleteProduct/${selectedProduct.id}`);
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
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedProduct.id));
        setDeleteOpen(false);
        setLoading(false);
      } catch (error) {
        console.error('Error deleting product:', error);
        setLoading(false);
      }
    }
  };

  const handleEditDialogOpen = (product: any) => {
    // console.log('Opening edit dialog for:', product);
    // console.log(newQuantity,'before ')
    // setNewQuantity('')
    // console.log('Opening edit dialog for:', product);
    setSelectedProduct(product);
    setNewName(product.productname);
    setNewQuantity(product.quantity);
    // console.log("product qunaity",product.quantity,'new',newQuantity)
    setNewPrice(product.price);
    
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {

    // console.log('Submitting:', { newName, newQuantity, newPrice });
    let isValid = true;
      // console.log(newName,'newon')
    if (newName.trim() === '') {
      setEditProductDetailsError((prevState) => ({
        ...prevState,
        productnameError: 'Product name is required.',
      }));
      isValid = false;
    }
    if (newQuantity.trim() === '') {
      setEditProductDetailsError((prevState) => ({
        ...prevState,
        quantityError: 'Quantity should be a valid number.',
      }));
      isValid = false;
    }else if(Number(newQuantity) <= 0){
      setEditProductDetailsError((prevState) => ({
        ...prevState,
        quantityError: 'Quantity should be a greaterthan 0.',
      }));
      isValid = false;
    }
    if (newPrice.trim() === '' || isNaN(parseFloat(newPrice))) {
      console.log("NOt valid price")
      setEditProductDetailsError((prevState) => ({
        ...prevState,
        priceError: 'Price should be a valid number.',
      }));
      isValid = false;
    }   

    if (isValid) {
      let number = parseInt(newQuantity.replace(/,/g, ''));
      try {
        // console.log(newName, newQuantity, newPrice)
        setLoading(true);
      const response= await axios.put(`http://localhost:5000/product/updateproduct/${selectedProduct.id}`, {
          productname: newName,
          quantity: number,
          price: parseInt(newPrice),
        });
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
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedProduct.id
              ? { ...row, productname: newName, quantity: Number(newQuantity), price: Number(newPrice) }
              : row
          )
        );
        fetchProducts();
        setEditOpen(false);
        setLoading(false);
        setNewQuantity('');
        setNewName('');
        setNewPrice('');
        
      } catch (error) {
        console.error('Error updating product:', error);
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteOpen(false);
  };

  const handleCloseEditDialog = () => {
    setNewQuantity('')
     setNewName('')
     setNewPrice('')
    setEditOpen(false);
   
        setEditProductDetailsError({
      productnameError: '',
      quantityError: '',
      priceError: '',
    });
  };

  const handleAddProductSubmit = async () => {
    let isValid = true;

    if (newProduct.name.trim() === '') {
      setProductDetailsAddError((prevState) => ({
        ...prevState,
        productnameAddError: 'Product name is required.',
      }));
      isValid = false;
    }

    if (newProduct.quantity.trim() === '' || isNaN(Number(newProduct.quantity))) {
      setProductDetailsAddError((prevState) => ({
        ...prevState,
        quantityAddError: 'Quantity should be a valid number.',
      }));
      isValid = false;
    }

    if (newProduct.price.trim() === '' || isNaN(Number(newProduct.price))) {
      setProductDetailsAddError((prevState) => ({
        ...prevState,
        priceAddError: 'Price should be a valid number.',
      }));
      isValid = false;
    }

    if (isValid) {
      try {
  //  console.log("valid the addd", newProduct.name)
        setLoading(true);
        const response = await axios.post('http://localhost:5000/product/addProduct', {
          productname: newProduct?.name,
          quantity: Number(newProduct.quantity),
          price: Number(newProduct.price),
        });
        if(response.status ===201){
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
       
        }

        // console.log(response.data)
        const product = response.data.newProduct
        // console.log(product)
        // const newProductData = response.data.product;
      
        // Add the new product to the table rows
        setProductList((prevList) => [...prevList, product.productname]);
        setRows((prevRows) => [...prevRows, product]);

        // Add the new product name to the productList for autocomplete if it's not already there
      
        
        setRows((prevRows) => [...prevRows, product]);
        fetchProducts();
        setAddProductOpen(false);
        setLoading(false);
        setNewProduct({ name: '', quantity: '', price: '' });
        setProductDetailsAddError({
          productnameAddError: '',
          quantityAddError: '',
          priceAddError: '',
        })
      } catch (error) {
        console.error('Error adding product:', error);
        setLoading(false);
      }
    }
  };

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(() => [
    {
      accessorKey: 'productname',
      header: 'Product Name',
    },
   
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      size:130,
      muiTableBodyCellProps:{
        align:"right",

      }
    },
    {
      accessorKey: 'price',
      header: 'Price',
      size:130,
      muiTableBodyCellProps:{
        align:"right",

      }
    },
    {
      accessorKey: 'productAddedDate',
      header: 'Product_Added_date',
      size:130,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <Box>
          <IconButton onClick={() => handleView(row.original)} sx={{color:'green'}}>
            <IoEyeOutline />
          </IconButton>
          <IconButton onClick={() => handleEditDialogOpen(row.original)}  sx={{color:'skyblue'}}> 
            <MdModeEditOutline />
          </IconButton>
          <IconButton onClick={() => handleDeleteDialogOpen(row.original)}  sx={{color:'#eb7777'}}>
            <RiDeleteBin7Line />
          </IconButton>
        </Box>
      ),
    },
  ], []);



  const tabel = useMaterialReactTable({
    columns,
    data: rows,
    enableTopToolbar: true,
    renderTopToolbarCustomActions: () => (
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProductDialogOpen}
        className={styles.handleAddProductDialogOpen}
        sx={{backgroundColor:'rgb(30, 78, 155)'}}
      >
        <IoAddCircleOutline style={{ marginRight: '4px' }} />
        <Typography textTransform={'none'}>Add Product</Typography>
      </Button>
    ),
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid gray',
        backgroundColor: 'rgb(30, 78, 155)',
        fontSize:'13px',
        color:"white"
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid gray',
        fontSize:'13px'
      },
    },
  });
  
  
  return (
    <>

    <ToastContainer/>
      <div className={styles.addButtontop}>
        <h1 className={styles.heading}>Product Details</h1>

        <div style={{ marginLeft: '20px', marginRight: '20px' }}>
               <MaterialReactTable table={tabel} />
             </div>


   


        {/* View Product Dialog */}
        <Dialog open={open} onClose={handleClose} className={styles.dialog}>
          <Box className={styles.closearrow}>

            <DialogTitle className='dialogTitle'>Product Details</DialogTitle>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

            {/* {selectedProduct && (
              <div>
              <p><strong>Product Name:</strong> {selectedProduct.productname}</p>
              <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
              <p><strong>Price:</strong> {selectedProduct.price}</p>
              </div>
            )} */}
              <DialogContent className={styles.viewdailogs}>
             <p className={styles.labelforview}>Product</p>
             <TextField
              size="small"
              value={selectedProduct?.productname}
             
              margin="normal"
             
              inputProps={{min:0}}
              className={`${styles.textFields} ${styles.inputBaseRoots}`}
             disabled
            />
             <p className={styles.labelforview}>Quantity</p>
             <TextField
              size="small"
              value={selectedProduct?.quantity}
             
              margin="normal"
             
              inputProps={{min:0}}
              className={`${styles.textFields} ${styles.inputBaseRoots}`}
             disabled
            />
             <p className={styles.labelforview}>Price</p>
             <TextField
              size="small"
              value={selectedProduct?.price}
             
              margin="normal"
             
              inputProps={{min:0}}
              className={`${styles.textFields} ${styles.inputBaseRoots}`}
             disabled
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" className="mainButton"><Typography textTransform={'none'}>Close</Typography></Button>
          </DialogActions>
        </Dialog>

        {/* Delete Product Dialog */}
        <Dialog open={deleteOpen} onClose={handleCloseDeleteDialog} >

        <Box className={styles.closearrow}>
          <DialogTitle  className='dialogTitle'>Delete Confirm</DialogTitle>
           
                <IconButton onClick={handleCloseDeleteDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent className='deltecontent'>
            {selectedProduct && (
              <div >
                <p><strong>Are you sure you want to delete this product?</strong> {selectedProduct?.productname}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary" className="mainButton"><Typography textTransform={'none'}>Cancel</Typography></Button>
            <Button onClick={handleDelete} color="secondary"className="mainButton" disabled={loading}><Typography textTransform={'none'}>Delete</Typography></Button>
          </DialogActions>
        </Dialog>



        {/* Edit Product Dialog */}
        <Dialog open={editOpen} onClose={handleCloseEditDialog} className={styles.dialog}>
          <Box className={styles.closearrow}>
            <DialogTitle  className='dialogTitle'>Edit Product</DialogTitle>
                <IconButton onClick={handleCloseEditDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent className={styles.edit} >
            {selectedProduct && (
              <div className={styles.editdailogcontent}>
                <p className={styles.labeles}>Product Name<span className='requiredAsterisk'> *</span></p>

                <Autocomplete
              value={newName || ''}
              onChange={(e, newValue) => handleInputChange('name', newValue || '')}
              options={productList}
              className={styles.auto}
              // freeSolo // Allow custom input (this allows users to type their own value)
              renderInput={(params) => <TextField {...params} size="small"   />}
/>


                <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {editProductDetailsError.productnameError ? editProductDetailsError.productnameError : ' '}</FormHelperText>

                <p className={styles.labeles}>Quantity<span className='requiredAsterisk'> *</span></p>
                <TextField
                  size="small"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity((e.target.value))}
                  className={`${styles.textField} ${styles.inputBaseRoot}`}
                  
                  InputProps={{ inputProps: { min: 0,step: 1 } }}
                 />
                <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {editProductDetailsError.quantityError ? editProductDetailsError.quantityError : ' '}</FormHelperText>

                <p className={styles.labeles}>Price<span className='requiredAsterisk'> *</span></p>
                <TextField
                  size="small"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className={`${styles.textField} ${styles.inputBaseRoot}`}
                />
                <FormHelperText style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {editProductDetailsError.priceError ? editProductDetailsError.priceError : " "}</FormHelperText>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary"className="mainButton"><Typography textTransform={'none'}>Cancel</Typography></Button>
            <Button onClick={handleEditSubmit} color="primary" className="mainButton" disabled={loading}><Typography textTransform={'none'}>Update</Typography></Button>
          </DialogActions>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog open={addProductOpen} onClose={handleCloseAddProductDialog} className={styles.dialog}>
          <Box className={styles.closearrow}>
          <DialogTitle  className='dialogTitle'>Add Product</DialogTitle>
                <IconButton onClick={handleCloseAddProductDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent className={styles.addone}>
            <div className={styles.paragrap}>
              <p className={styles.addlabels}>Product Name<span className='requiredAsterisk'> *</span></p>

              {/* <Select
                value={newProduct.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={styles.selectsfields}
              >
                <MenuItem value="Laptop">Laptop</MenuItem>
                <MenuItem value="Mouse">Mouse</MenuItem>
                <MenuItem value="Keyboard">Keyboard</MenuItem>
                <MenuItem value="Headphone">HeadPhone</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
              </Select> */}

      <Autocomplete
          value={newProduct.name || ''}
          onChange={(e, newValue) => handleInputChange('name', newValue||'')}
          options={productList}
          className={styles.auto}
          freeSolo  // Allows custom input
          renderInput={(params) => <TextField {...params} size="small" onChange={(e) => handleInputChange('name',e.target.value)} />}
        />
           <FormHelperText  style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: '10px !important' }}>{ProductDetailsAddError.productnameAddError ? ProductDetailsAddError.productnameAddError : ' '}</FormHelperText>
              <p className={styles.addlabels}>Quantity<span className='requiredAsterisk'> *</span></p>
              <TextField
                size="small"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`${styles.textField} ${styles.inputBaseRoot}`}
                inputProps={{min:0}}
              />
               <FormHelperText  style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>{ProductDetailsAddError.quantityAddError ? ProductDetailsAddError.quantityAddError : ' '}</FormHelperText>
              <p  className={styles.addlabels}>Price<span className='requiredAsterisk'> *</span></p>
              <TextField
                size="small"
                type="number"
                value={newProduct.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`${styles.textField} ${styles.inputBaseRoot}`}
              />
               <FormHelperText  style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>{ProductDetailsAddError.priceAddError? ProductDetailsAddError.priceAddError: ' '}</FormHelperText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddProductDialog} color="primary" className="mainButton"><Typography textTransform={'none'}>Cancel</Typography></Button>
            <Button onClick={handleAddProductSubmit} color="primary" className='mainButton' disabled={loading}><Typography textTransform={'none'}>Add</Typography></Button>
          </DialogActions>
        </Dialog>

      </div>
    </>
  );
};

export default ProductTable;
