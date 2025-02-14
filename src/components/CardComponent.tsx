// import React from 'react';
// import { Card, CardContent, Typography, CardMedia } from '@mui/material';

// interface Product {
//   orderid: string;
//   product: string;
//   totalprice: string;
//   totalquantity: string;
// }

// interface ProductCardProps {
//   product: Product;
//   imageUrl: string;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product, imageUrl }) => {
//   return (
//     <Card
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         height: '100%',
//         transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//         borderRadius:"20px",
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
//           alt={product.product}
//           image={imageUrl}
//           title={product.product}
//           onError={(e) => {
//             e.currentTarget.src = '/images/default-image.jpg'; // Fallback if image fails to load
//           }}
//           sx={{
//             objectFit: 'contain', 
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
//           backgroundColor:"#ADE8F4"
//         }}
//       >
//         <Typography variant="body1" sx={{fontWeight:'bold', textAlign:"center", marginTop:"0px", marginBottom:"10px"}}>{product.product}</Typography>
//         <Typography variant="body2" sx={{marginLeft:"10px"}}><strong  style={{color:"green"}}>Total Orders:</strong> {product.totalquantity}</Typography>
//         <Typography variant="body2" sx={{ marginTop: 1,marginLeft:"10px" }}>
//           <strong>Total Price:</strong> {product.totalprice}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductCard;
// new one
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { IconBaseProps } from 'react-icons'; 
import { ReactElement } from 'react'; 

interface Product {
  orderid: string;
  product: string;
  totalprice: string;
  totalquantity: string;
}

interface ProductCardProps {
  product: Product;
  icon: ReactElement<IconBaseProps>; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product, icon }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row', // Change to row for side-by-side layout
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        borderRadius: "20px",
        ':hover': {
          transform: 'scale(1)',
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
        },
      }}
    >
      {/* Container for the icon */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80px' }}>
        <div style={{ fontSize: '50px', color: '#3f51b5' }}> {/* Increased the font size of the icon */}
          {icon} {/* Display the icon */}
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
          padding: '0px',
          textAlign: 'left', // Align text to the right
          
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold',textAlign: "center", marginTop: "10px", marginBottom: "10px", color: 'black' }}>
          {product.product}
        </Typography>
        <Typography variant="body2" sx={{ marginLeft: "5px" ,textAlign:'left' }}>
          <strong style={{ color: "green" }}>Total Orders:</strong> {product.totalquantity}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1, textAlign:'left' ,marginLeft: "5px" }}>
          <strong>Total Price:</strong> {product.totalprice}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
