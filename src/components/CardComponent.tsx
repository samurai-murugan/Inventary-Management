// ProductCard.tsx
import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

interface Product {
  orderid: string;
  product: string;
  totalprice: string;
  totalquantity:string
}

interface ProductCardProps {
  product: Product;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, imageUrl }) => {
  return (
    <Card 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'scale(1)', // Adjust scale on hover
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', // Add shadow on hover
          cursor: 'pointer', // Change cursor to pointer
        },
      }}
    >
      <div style={{width:"80%"}}>

      <CardMedia
        component="img"
        alt={product.product}
        height="220"
        image={imageUrl}
        title={product.product}
        onError={(e) => {
          e.currentTarget.src = '/images/default-image.jpg'; // Fallback if image fails to load
        }}
        sx={{
          objectFit: 'cover',
          width: '100%',
        }}
      />
      </div>
      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
      }}>
        <Typography variant="body1">{product.product}</Typography>
        <Typography variant="body2">Total Orders: {product.totalquantity}</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Total Price: {product.totalprice}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
