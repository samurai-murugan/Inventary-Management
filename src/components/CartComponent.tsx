import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

interface Product {
  productid: string;
  productname: string;
  price: string;
  quantity: string;
}

interface ProductCardProps {
  product: Product;
  imageUrl: string;
}

const ProductCardForOrderPage: React.FC<ProductCardProps> = ({ product, imageUrl }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'scale(1)',
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
        },
      }}
    >
      {/* Container for the image with a smaller size */}
      <div style={{ width: '150px', overflow: 'hidden', height: '150px',paddingLeft:"30px",marginLeft:'20px' }}> {/* Reduced size */}
        <CardMedia
          component="img"
          alt={product.productname}
          image={imageUrl}
          title={product.productname}
          onError={(e) => {
            e.currentTarget.src = '/images/default-image.jpg'; // Fallback if image fails to load
          }}
          sx={{
            objectFit: 'contain', // Makes the image fit inside the container, maintaining its aspect ratio
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Product details */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <Typography variant="body1" sx={{fontWeight:'bold', textAlign:"center", marginTop:"-20px", marginBottom:"10px"}}>{product.productname}</Typography>
        <Typography variant="body2" sx={{marginLeft:"10px" }}><strong>Total Quantity: </strong>{product.quantity}</Typography>
        <Typography variant="body2" sx={{ marginTop: 1,marginLeft:"10px" }}>
        <strong> Price        :</strong>  {product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCardForOrderPage;
