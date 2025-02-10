

import { Box, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import imageDetails from '../utils/imageDetails'; // Import the image details file
import ProductCard from './CardComponent'; // Import the new ProductCard component

interface Product {
  orderid: string;
  product: string;
  // price: string;
  totalprice:string;
  totalquantity:string;
}

const HomePageData: React.FC = () => {
  const [productDetails, setProductDetails] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // const response = await fetch('http://localhost:5000/productsData/cardsData');
        const response = await fetch('http://localhost:5000/productsData/adminpageCardData');
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
    <Box sx={{ marginTop: 2.5, marginLeft: 2, fontSize: '0.6rem' }}>
      <h1>Home Page</h1>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <PieChart />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <BarChart />
        </Grid>
      </Grid>

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
