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

import styles from './CartComponent.module.css'
interface Product {
  productid: string;
  productname: string;
  price: string;
  quantity: string;
}

interface ProductCardProps {
  product: Product;
  icon: ReactElement<IconBaseProps>; // The icon prop now expects a React icon component
  OpenAdd:()=>void;
  productname:React.Dispatch<React.SetStateAction<string>>;
  availabelquantity:React.Dispatch<React.SetStateAction<string>>;
}


const ProductCardForOrderPage: React.FC<ProductCardProps> = ({ product, icon, OpenAdd,productname,availabelquantity }) => {

  function setProductName(){
    productname(product.productname);
    availabelquantity(product.quantity)
    

  }
  return (
    <div onClick={() => { OpenAdd(); setProductName(); }}> {/* Call both OpenAdd and setProductName */}

     
    <Card 
  
    className={styles.scards}
      sx={{
        display: 'flex',
        flexDirection: 'row', 
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

      <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px' }}>
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
        <Typography className={styles.heading} sx={{  textAlign: "center", marginTop: "0px", marginBottom: "10px", color: 'black' ,fontSize:"13px" }}>
          {product.productname}
        </Typography>
        <Typography variant="body2" sx={{ marginLeft: "0px",fontSize:"13px" }}>
          <strong style={{ color: "green" }}>In Stock:</strong>{Number(product.quantity).toLocaleString('en-IN')}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1, marginLeft: "0px",fontSize:"13px"  }}>
          <strong>Price Rs:</strong> {Number(product.price).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
    </div>

  );
};

export default ProductCardForOrderPage;
