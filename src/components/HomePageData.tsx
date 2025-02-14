

// import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
// import React, { useState, useEffect } from 'react';
// import PieChart from './PieChart';
import BarChart from './BarChart';
// import imageDetails from '../utils/imageDetails';
// import ProductCard from './CardComponent';
// import TimeLineChart from './TimeLineChart';
// import TimeLine from './TimeLine';
// import AlterChart from './AlterChart';
// import DonutChart from './DonutChart';
 
// interface Product {
//   orderid: string;
//   product: string;
//   // price: string;
//   totalprice:string;
//   totalquantity:string;
// }

// const HomePageData: React.FC = () => {
//   const [productDetails, setProductDetails] = useState<Product[]>([]);  
//   let loginperson = localStorage.getItem('userRole')
//   const userid = localStorage.getItem('userId')
//   console.log(loginperson,'Login Person ====>')
//   console.log(userid,'userid Person ====>')
  
//   useEffect(() => {
//     const fetchProductData = async () => {
//       let response:any;
//       try {

//         if(loginperson ==="admin"){
//           console.log('Adming =====> fetching the data' )
//           response = await fetch(`http://localhost:5000/productsData/adminpageCardData`);
//         }else {
//           console.log('user =====> userFetching the data' )
//           response = await fetch(`http://localhost:5000/productsData/userData/${userid}`);

//         }
//         const data: Product[] = await response.json();
//         setProductDetails(data);
//       } catch (error) {
//         console.error('Error fetching product data:', error);
//       }
//     };

//     fetchProductData();
//   }, []);

//   const getImageUrl = (productName: string): string => {
//     const productNameFormatted = productName.toLowerCase().replace(/\s+/g, '-');
//     return imageDetails[productNameFormatted] || '/images/default-image.jpg'; 
//   };

//   return (
//     <Box sx={{ marginTop: 2.5,marginLeft:"10px", marginRight:"10px",  fontSize: '0.6rem' }}>
      

//       <Typography sx={{fontWeight:"bold" ,fontSize:'20px' ,marginLeft:"10px"}}>Home Page</Typography>

    
//       {/* <TimeLine></TimeLine> */}
//       {/* <TimeLineChart></TimeLineChart> */}
    
    
   


//       <Card sx={{ width: '100%', boxShadow: 'none', border: 'none' , marginRight:'10px',paddingRight:'30px'}}>
//       <CardContent sx={{marginLeft:1}}>
       
        
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6} md={6}>
//             <Card sx={{ height: '100%', boxShadow: 1, borderRadius: '8px',marginLeft:'20px','&:hover': {
//           transform: 'scale(1.01)', 
//           boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', 
//           cursor: 'pointer',
//         } }}>
//               <CardContent>
//                 <Typography sx={{fontWeight:'bold'}}>Product Price Details</Typography>
//                 {/* <PieChart /> */}
//                 <DonutChart></DonutChart>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={6}>
//             <Card sx={{ height: '100%', boxShadow: 1, borderRadius: '8px' ,'&:hover': {
//           transform: 'scale(1.01)', 
//           boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', 
//           cursor: 'pointer',
//         } }}>
//               <CardContent>
//               <Typography sx={{fontWeight:'bold'}}>Product Quantity Details</Typography>
//                 <BarChart />
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//     {
//       loginperson==='admin'&&
//     <Card 
//   sx={{
//     width: '98%',
    
//     // boxShadow: 'none',
//     border: 'none',
//     marginRight: '10px',

//     margin:'10px', 

//     transition: 'all 0.3s ease', 
//     '&:hover': {
//       boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', 
     
//     }
//   }}
// >
//   <CardContent sx={{ width: "96%" }}>

//     <Grid container spacing={3} sx={{ marginTop: 3 }} >
//       <Grid item  xs={12} sm={12} md={12} >
//   <Typography sx={{fontWeight:'bold'}}>Order Details</Typography>
//     <AlterChart />

       
//       </Grid>
//     </Grid>
//   </CardContent>
//    </Card>
//     }  

//       <Grid container spacing={3} sx={{ marginTop: 3 }}>
//         {productDetails.map((product) => {
//           const imageUrl = product.product ? getImageUrl(product.product) : '/images/default-image.jpg';
          
//           return (
//             <Grid item xs={12} sm={6} md={2.4} key={product.orderid} sx={{ marginBottom: 3 }}>
//               <ProductCard product={product} imageUrl={imageUrl} />
//             </Grid>
//           );
//         })}
//       </Grid>
   
//     </Box>
//   );
// };

// export default HomePageData;




// new one

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { FaCartPlus, FaBox, FaShoppingBag } from 'react-icons/fa'; // Import the icons you want to use
import ProductCard from './CardComponent';
import TimeLineChart from './TimeLineChart';
import TimeLine from './TimeLine';
import AlterChart from './AlterChart';
import DonutChart from './DonutChart';
import { FaMobileScreen } from "react-icons/fa6";
import { GiMouse } from "react-icons/gi";
import { GiLaptop } from "react-icons/gi";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { BsFillKeyboardFill } from "react-icons/bs";

interface Product {
  orderid: string;
  product: string;
  totalprice: string;
  totalquantity: string;
}

const HomePageData: React.FC = () => {
  const [productDetails, setProductDetails] = useState<Product[]>([]);  
  let loginperson = localStorage.getItem('userRole')
  const userid = localStorage.getItem('userId')
  console.log(loginperson, 'Login Person ====>')
  console.log(userid, 'userid Person ====>')

  useEffect(() => {
    const fetchProductData = async () => {
      let response: any;
      try {
        if (loginperson === "admin") {
          console.log('Admin =====> fetching the data' )
          response = await fetch(`http://localhost:5000/productsData/adminpageCardData`);
        } else {
          console.log('User =====> fetching the data' )
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

  const getIcon = (productName: string) => {
 
    switch (productName.toLowerCase()) {
      case 'mouse':
        return <GiMouse size={30} color="#3f51b5" />;
      case 'laptop':
        return <GiLaptop size={30} color="#f44336" />;
      case 'keyboard':
        return <BsFillKeyboardFill size={30} color="rgb(149 24 138)"  />;
      case 'mobile':
        return <FaMobileScreen size={30} color="rgb(199 90 10)"/>;
      case 'headphone':
        return <FaHeadphonesSimple size={30} color="#4caf50" />;
      default:
        return <FaBox size={30} color="#9e9e9e" />;
    }
  };

  return (
    <Box sx={{ marginTop: 2.5, marginLeft: "10px", marginRight: "10px", fontSize: '0.6rem' }}>
      <Typography sx={{ fontWeight: "bold", fontSize: '20px', marginLeft: "10px" }}>Home Page</Typography>

      <Card sx={{ width: '100%', boxShadow: 'none', border: 'none', marginRight: '10px', paddingRight: '30px' }}>
        <CardContent sx={{ marginLeft: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ height: '100%', boxShadow: 1, borderRadius: '8px', marginLeft: '20px', '&:hover': {
                  transform: 'scale(1.01)', boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', cursor: 'pointer',
                }}}>
                <CardContent>
                  <Typography sx={{ fontWeight: 'bold' }}>Product Price Details</Typography>
                  <DonutChart />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ height: '100%', boxShadow: 1, borderRadius: '8px', '&:hover': {
                  transform: 'scale(1.01)', boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', cursor: 'pointer',
                }}}>
                <CardContent>
                  <Typography sx={{ fontWeight: 'bold' }}>Product Quantity Details</Typography>
                  <BarChart />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loginperson === 'admin' &&
        <Card sx={{
          width: '98%',
          border: 'none',
          marginRight: '10px',
          margin: '10px',
          transition: 'all 0.3s ease', '&:hover': {
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
          }
        }}>
          <CardContent sx={{ width: "96%" }}>
            <Grid container spacing={1} sx={{ marginTop: 3 }} >
              <Grid item xs={12} sm={12} md={12} >
                <Typography sx={{ fontWeight: 'bold' }}>Order Details</Typography>
                <AlterChart />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      }

      <Grid container spacing={1} sx={{ marginTop: 3 }}>
        {productDetails.map((product) => {
          return (
            <Grid item xs={12} sm={8} md={2.7} key={product.orderid} sx={{ marginBottom: 3 ,marginLeft:"20px",}}>
              <ProductCard product={product} icon={getIcon(product.product)} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default HomePageData;
