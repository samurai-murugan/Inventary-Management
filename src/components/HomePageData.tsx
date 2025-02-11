

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import imageDetails from '../utils/imageDetails';
import ProductCard from './CardComponent';

interface Product {
  orderid: string;
  product: string;
  // price: string;
  totalprice:string;
  totalquantity:string;
}

const HomePageData: React.FC = () => {
  const [productDetails, setProductDetails] = useState<Product[]>([]);  
  let loginperson = localStorage.getItem('userRole')
  const userid = localStorage.getItem('userId')
  console.log(loginperson,'Login Person ====>')
  console.log(userid,'userid Person ====>')
  
  useEffect(() => {
    const fetchProductData = async () => {
      let response:any;
      try {

        if(loginperson ==="admin"){
          console.log('Adming =====> fetching the data' )
          response = await fetch(`http://localhost:5000/productsData/adminpageCardData`);
        }else {
          console.log('user =====> userFetching the data' )
          response = await fetch(`http://localhost:5000/productsData/userData/${userid}`);

        }
        const data: Product[] = await response.json();
        setProductDetails(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  const getImageUrl = (productName: string): string => {
    const productNameFormatted = productName.toLowerCase().replace(/\s+/g, '-');
    return imageDetails[productNameFormatted] || '/images/default-image.jpg'; 
  };

  return (
    <Box sx={{ marginTop: 2.5,marginLeft:"10px", marginRight:"10px",  fontSize: '0.6rem' }}>
      

      <Typography sx={{fontWeight:"bold" ,fontSize:'20px' ,marginLeft:"10px"}}>Home Page</Typography>
      <Card sx={{ width: '100%', boxShadow: 'none', border: 'none' , marginRight:'10px',paddingRight:'30px'}}>
      <CardContent sx={{marginLeft:1}}>
       
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ height: '100%', boxShadow: 1, borderRadius: '8px',marginLeft:'20px','&:hover': {
          transform: 'scale(1.01)', 
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', 
          cursor: 'pointer',
        } }}>
              <CardContent>
                <Typography sx={{fontWeight:'bold'}}>Product Price Details</Typography>
                <PieChart />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ height: '100%', boxShadow: 1, borderRadius: '8px' ,'&:hover': {
          transform: 'scale(1.01)', 
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', 
          cursor: 'pointer',
        } }}>
              <CardContent>
              <Typography sx={{fontWeight:'bold'}}>Product Quantity Details</Typography>
                <BarChart />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {productDetails.map((product) => {
          const imageUrl = product.product ? getImageUrl(product.product) : '/images/default-image.jpg';
          
          return (
            <Grid item xs={12} sm={6} md={2.4} key={product.orderid} sx={{ marginBottom: 3 }}>
              <ProductCard product={product} imageUrl={imageUrl} />
            </Grid>
          );
        })}
      </Grid>
   
    </Box>
  );
};

export default HomePageData;
