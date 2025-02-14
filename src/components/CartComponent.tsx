// import React from 'react';
// import { Card, CardContent, Typography, CardMedia } from '@mui/material';

// interface Product {
//   productid: string;
//   productname: string;
//   price: string;
//   quantity: string;
// }

// interface ProductCardProps {
//   product: Product;
//   imageUrl: string;
// }

// const ProductCardForOrderPage: React.FC<ProductCardProps> = ({ product, imageUrl }) => {
//   return (
//     <Card
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         height: '100%',
//         borderRadius:"20px",
//         transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//         ':hover': {
//           transform: 'scale(1)',
//           boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
//           cursor: 'pointer',
//         },
//       }}
//     >
//       {/* Container for the image with a smaller size */}
//       <div style={{ width: '150px', overflow: 'hidden', height: '90px',paddingLeft:"30px",marginLeft:'20px',marginTop:'20px',marginBottom:"10px" }}> {/* Reduced size */}
//         <CardMedia
//           component="img"
//           alt={product.productname}
//           image={imageUrl}
//           title={product.productname}
//           onError={(e) => {
//             e.currentTarget.src = '/images/default-image.jpg'; // Fallback if image fails to load
//           }}
//           sx={{
//             objectFit: 'contain', // Makes the image fit inside the container, maintaining its aspect ratio
//             width: '100%',
//             height: '100%',
//           }}
//         />
//       </div>

//       {/* Product details */}
//       <CardContent
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'space-between',
//           flexGrow: 1,
//         backgroundColor:"#ADE8F4"
//         }}
//       >
//         <Typography variant="body1" sx={{fontWeight:'bold', textAlign:"center", marginTop:"0px", marginBottom:"10px",color:'-moz-initial'}}>{product.productname}</Typography>
//         <Typography variant="body2" sx={{marginLeft:"10px" }}><strong style={{color:"green"}}>In Stock: </strong>{product.quantity}</Typography>
//         <Typography variant="body2" sx={{ marginTop: 1,marginLeft:"10px" }}>
//         <strong> Price Rs  :</strong>  {product.price}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductCardForOrderPage;

// new

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { IconBaseProps } from 'react-icons'; // Import IconBaseProps to type the icon prop
import { ReactElement } from 'react'; // Import ReactElement for more precise typing

interface Product {
  productid: string;
  productname: string;
  price: string;
  quantity: string;
}

interface ProductCardProps {
  product: Product;
  icon: ReactElement<IconBaseProps>; // The icon prop now expects a React icon component
}

const ProductCardForOrderPage: React.FC<ProductCardProps> = ({ product, icon }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row', // Change to row to place content on the right
        justifyContent: 'space-between',
        height: '100%',
        borderRadius: "20px",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'scale(1) ',
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
        },
      }}
    >

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px' }}>
        <div style={{ fontSize: '60px', color: '#3f51b5' }}>
          {icon} 
        </div>
      </div>

      {/* Product details */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
          backgroundColor: "#ADE8F4",
          padding: '20px',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: "center", marginTop: "0px", marginBottom: "10px", color: 'black' }}>
          {product.productname}
        </Typography>
        <Typography variant="body2" sx={{ marginLeft: "0px" }}>
          <strong style={{ color: "green" }}>In Stock:</strong> {product.quantity}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1, marginLeft: "0px" }}>
          <strong>Price Rs:</strong> {product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCardForOrderPage;
