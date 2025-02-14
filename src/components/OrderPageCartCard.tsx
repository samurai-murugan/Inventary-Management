

// import { Box,Grid} from '@mui/material';
// import React, { useState, useEffect } from 'react';

// import imageDetails from '../utils/imageDetails';
// import ProductCardForOrderPage from './CartComponent';

// interface Product {
//   productid: string;
//   productname: string;
//   // price: string;
//   price:string;
//   quantity:string;
// }
// interface OrderPageCartCardProps {
//     rows: any; // The rows from the parent component
//   }
  

// const OrderPageCartCard: React.FC<OrderPageCartCardProps>  = ( {rows}) => {
//   const [productDetails, setProductDetails] = useState<Product[]>([]);  
//   let loginperson = localStorage.getItem('userRole')
//   const userid = localStorage.getItem('userId')
//   console.log(loginperson,'Login Person ====>')
//   console.log(userid,'userid Person ====>')
  
//   useEffect(() => {
//     const fetchCardDataForCarts = async () => {
      
//       try {

//        const response = await fetch(`http://localhost:5000/productsData/cartData`);
        
//         const data: Product[] = await response.json();
//         setProductDetails(data);
//       } catch (error) {
//         console.error('Error fetching product data:', error);
//       }
//     };

//     fetchCardDataForCarts();
//   }, [rows]);

//   const getImageUrl = (productName: string): string => {
//     const productNameFormatted = productName.toLowerCase().replace(/\s+/g, '-');
//     return imageDetails[productNameFormatted] || '/images/default-image.jpg'; 
//   };

//   return (
//     <Box sx={{ marginTop: 2.5,marginLeft:"10px", marginRight:"10px",  fontSize: '0.6rem' }}>
//       <Grid container spacing={3} sx={{ marginTop: 3 }}>
//         {productDetails.map((product) => {
//           const imageUrl = product.productname ? getImageUrl(product.productname) : '/images/default-image.jpg';
          
//           return (
//             <Grid item xs={12} sm={6} md={2.4} key={product.productid} sx={{ marginBottom: 3 }}>
//               <ProductCardForOrderPage product={product} imageUrl={imageUrl} />
//             </Grid>
//           );
//         })}
//       </Grid>
   
//     </Box>
//   );
// };

// export default OrderPageCartCard;


// new one


import { Box, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart } from 'react-icons/fa'; // Importing icons for the product card
import imageDetails from '../utils/imageDetails';
import ProductCardForOrderPage from './CartComponent';
import { GiLaptop, GiMouse } from 'react-icons/gi';
import { BsFillKeyboardFill } from 'react-icons/bs';
import { FaHeadphonesSimple, FaMobileScreen } from 'react-icons/fa6';

interface Product {
  productid: string;
  productname: string;
  price: string;
  quantity: string;
}

interface OrderPageCartCardProps {
  rows: any; // The rows from the parent component
}

const OrderPageCartCard: React.FC<OrderPageCartCardProps> = ({ rows }) => {
  const [productDetails, setProductDetails] = useState<Product[]>([]);
  let loginperson = localStorage.getItem('userRole');
  const userid = localStorage.getItem('userId');
  console.log(loginperson, 'Login Person ====>');
  console.log(userid, 'userid Person ====>');

  useEffect(() => {
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
const getIcon = (productName: string) => {
 
    switch (productName.toLowerCase()) {
      case 'mouse':
        return <GiMouse size={30} color="#3f51b5" />;
      case 'laptop':
        return <GiLaptop size={30} color="#f44336" />;
      case 'keyboard':
        return <BsFillKeyboardFill size={30} color="rgb(149 24 138)" />;
      case 'mobile':
        return <FaMobileScreen size={30} color="rgb(199 90 10)" />;
      case 'headphone':
        return <FaHeadphonesSimple size={30} color="#4caf50" />;
      default:
        return <FaBox size={30} color="#9e9e9e" />;
    }
  };

  return (
    <Box sx={{ marginTop: 2.5, marginLeft: "10px", marginRight: "10px", fontSize: '0.6rem' }}>
      <Grid container spacing={1} sx={{ marginTop: 3 }}>
        {productDetails.map((product) => {
          const icon = getIcon(product.productname); // Get the icon based on product name
          return (
            <Grid item xs={12} sm={8} md={2.7} key={product.productid} sx={{marginLeft:"20px", marginBottom: 3,gap:'10px' }}>
              <ProductCardForOrderPage product={product} icon={icon} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default OrderPageCartCard;
