import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Select, MenuItem, Box } from '@mui/material';
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


const ProductTable: React.FC = () => {
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
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

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
    setNewProduct((prevState) => ({
      ...prevState,
      [field]: value,
    }));
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
        await axios.delete(`http://localhost:5000/product/deleteProduct/${selectedProduct.id}`);
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
    console.log('Opening edit dialog for:', product);
    setSelectedProduct(product);
    setNewName(product.productname);
    setNewQuantity(product.quantity);
    setNewPrice(product.price);
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    let isValid = true;

    if (newName.trim() === '') {
      setEditProductDetailsError((prevState) => ({
        ...prevState,
        productnameError: 'Product name is required.',
      }));
      isValid = false;
    }
    if (newQuantity.trim() === '' || isNaN(Number(newQuantity))) {
      setEditProductDetailsError((prevState) => ({
        ...prevState,
        quantityError: 'Quantity should be a valid number.',
      }));
      isValid = false;
    }
    if (newPrice.trim() === '' || isNaN(Number(newPrice))) {
      setEditProductDetailsError((prevState) => ({
        ...prevState,
        priceError: 'Price should be a valid number.',
      }));
      isValid = false;
    }

    if (isValid) {
      try {
        console.log(newName, newQuantity, newPrice)
        setLoading(true);
        await axios.put(`http://localhost:5000/product/updateproduct/${selectedProduct.id}`, {
          productname: newName,
          quantity: newQuantity,
          price: newPrice,
        });
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

        setLoading(true);
        const response = await axios.post('http://localhost:5000/product/addProduct', {
          productname: newProduct.name,
          quantity: Number(newProduct.quantity),
          price: Number(newProduct.price),
        });
        const product = response.data.product

        // setRows((prevRows) => [...prevRows, product]);
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
    },
    {
      accessorKey: 'price',
      header: 'Price',
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
      >
        <IoAddCircleOutline style={{ marginRight: '4px' }} />
        <Typography textTransform={'none'}>Add Product</Typography>
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
        <h1 className={styles.heading}>Product Details</h1>

        <div style={{ marginLeft: '20px', marginRight: '20px' }}>
               <MaterialReactTable table={tabel} />
             </div>

        {/* View Product Dialog */}
        <Dialog open={open} onClose={handleClose} className={styles.dialog}>
          <Box className={styles.closearrow}>

            <DialogTitle className={styles.dialogTitle}>Product Details</DialogTitle>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent>
            {selectedProduct && (
              <div>
                <p><strong>Product Name:</strong> {selectedProduct.productname}</p>
                <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
                <p><strong>Price:</strong> {selectedProduct.price}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" className={`${styles.button} ${styles.cancelButton}`}><Typography textTransform={'none'}>Close</Typography></Button>
          </DialogActions>
        </Dialog>

        {/* Delete Product Dialog */}
        <Dialog open={deleteOpen} onClose={handleCloseDeleteDialog} className={styles.dialog}>

        <Box className={styles.closearrow}>
          <DialogTitle className={styles.dialogTitle}>Delete Confirm</DialogTitle>
           
                <IconButton onClick={handleCloseDeleteDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent>
            {selectedProduct && (
              <div>
                <p><strong>Are you sure you want to delete this product?</strong> {selectedProduct.productname}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary" className={`${styles.button} ${styles.cancelButton}`}><Typography textTransform={'none'}>Cancel</Typography></Button>
            <Button onClick={handleDelete} color="secondary" className={`${styles.button} ${styles.deleteButton}`} disabled={loading}><Typography textTransform={'none'}>Delete</Typography></Button>
          </DialogActions>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={editOpen} onClose={handleCloseEditDialog} className={styles.dialog}>
          <Box className={styles.closearrow}>
            <DialogTitle className={styles.dialogTitle}>Edit Product</DialogTitle>
                <IconButton onClick={handleCloseEditDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent >
            {selectedProduct && (
              <div className={styles.editdailogcontent}>
                <p className={styles.labeles}>Product Name</p>

                <Select
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={styles.selectsfields}
                >
                  <MenuItem value="Laptop">Laptop</MenuItem>
                  <MenuItem value="Mouse">Mouse</MenuItem>
                  <MenuItem value="Keyboard">Keyboard</MenuItem>
                  <MenuItem value="Headphone">HeadPhone</MenuItem>
                  <MenuItem value="Mobile">Mobile</MenuItem>
                </Select>



                <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {editProductDetailsError.productnameError ? editProductDetailsError.productnameError : ' '}</p>

                <p className={styles.labeles}>Quantity</p>
                <TextField
                  size="small"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className={`${styles.textField} ${styles.inputBaseRoot}`}
                />
                <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {editProductDetailsError.quantityError ? editProductDetailsError.quantityError : ' '}</p>

                <p className={styles.labeles}>Price</p>
                <TextField
                  size="small"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className={`${styles.textField} ${styles.inputBaseRoot}`}
                />
                <p style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>
                  {editProductDetailsError.priceError ? editProductDetailsError.priceError : " "}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary" className={`${styles.button} ${styles.cancelButton}`}><Typography textTransform={'none'}>Cancel</Typography></Button>
            <Button onClick={handleEditSubmit} color="primary" className={`${styles.button} ${styles.updateButton}`} disabled={loading}><Typography textTransform={'none'}>Update</Typography></Button>
          </DialogActions>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog open={addProductOpen} onClose={handleCloseAddProductDialog} className={styles.dialog}>
          <Box className={styles.closearrow}>
          <DialogTitle className={styles.dialogTitle}>Add Product</DialogTitle>
                <IconButton onClick={handleCloseAddProductDialog}>
                     <CloseIcon />
                </IconButton> 
          </Box>
          <DialogContent>
            <div className={styles.paragrap}>
              <p className={styles.addlabels}>Product Name</p>

              <Select
                value={newProduct.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={styles.selectsfields}
              >
                <MenuItem value="Laptop">Laptop</MenuItem>
                <MenuItem value="Mouse">Mouse</MenuItem>
                <MenuItem value="Keyboard">Keyboard</MenuItem>
                <MenuItem value="Headphone">HeadPhone</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
              </Select>
           <p  style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>{ProductDetailsAddError.productnameAddError ? ProductDetailsAddError.productnameAddError : ' '}</p>
              <p className={styles.addlabels}>Quantity</p>
              <TextField
                size="small"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`${styles.textField} ${styles.inputBaseRoot}`}
              />
               <p  style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>{ProductDetailsAddError.quantityAddError ? ProductDetailsAddError.quantityAddError : ' '}</p>
              <p  className={styles.addlabels}>Price</p>
              <TextField
                size="small"
                type="number"
                value={newProduct.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`${styles.textField} ${styles.inputBaseRoot}`}
              />
               <p  style={{ marginTop: "-2px", whiteSpace: "preserve", color: 'red', fontSize: '11px' }}>{ProductDetailsAddError.priceAddError? ProductDetailsAddError.priceAddError: ' '}</p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddProductDialog} color="primary" className={`${styles.button} ${styles.cancelButton}`}><Typography textTransform={'none'}>Cancel</Typography></Button>
            <Button onClick={handleAddProductSubmit} color="primary" className={` ${styles.addvalueButton}`} disabled={loading}><Typography textTransform={'none'}>Add</Typography></Button>
          </DialogActions>
        </Dialog>

      </div>
    </>
  );
};

export default ProductTable;
