import * as React from 'react';
import { Backdrop, Box, CssBaseline} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Sidebar from './SideBar';
import Header from './Header';
import SettingsTable from '../components/SettingsTable';
import ProductTable from '../components/Product';
import OrderPage from "../components/OrderPage";
import HomePageData from '../components/HomePageData';
import styles from "./HomePage.module.css"
import SimpleBackdrop from '../components/Roatating';
import { toast } from 'react-toastify';

function HomePage() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showTable, setShowTable] = React.useState(false);
  const [productpage, setProductPage] = React.useState(false);
  const [orderPage, setOrderPage] = React.useState(false);
  const [homePageData, setHomePageData] = React.useState(true);
  const [loading, setLoading] = React.useState(true); // Loading state
 function login (){

   toast.success('Login Successfull', {
     position: "top-right",
     autoClose: 1000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
   });
 }
 
  const handleDrawerToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleUserAddClick = () => {
    setLoading(true);
    setProductPage(false);
    setOrderPage(false);
    setHomePageData(false);
    setShowTable(true); 
    // setTimeout(()=>{
    //   setLoading(false)
    // },3000)
  };

  const handleProductPage = () => {
    setLoading(true);
    setShowTable(false);
    setOrderPage(false);
    setHomePageData(false);
    setProductPage(true); 
    // setTimeout(()=>{
    //   setLoading(false)
    // },3000)
  };

  const handleOrderPage = () => {
    setLoading(true);
    setProductPage(false);
    setShowTable(false);
    setHomePageData(false);
    setOrderPage(true);
    // setTimeout(()=>{
    //   setLoading(false)
    // },3000)
  };

  const handleHomePage = () => {
    // setLoading(true);
  
    setProductPage(false);
    setShowTable(false);
    setOrderPage(false);
    setHomePageData(true);

    // setTimeout(()=>{
    //   setLoading(false)
    // },3000)
  };

  React.useEffect(() => {{login()}
    setTimeout(() => {
      
      setLoading(false);
    
    }, 3000);

    
  }, []);

  const handleBackdrop =()=>{
    setLoading(false);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar
        open={open}
        onToggle={handleDrawerToggle}
        onSettingsClick={handleUserAddClick}
        onProductPage={handleProductPage}
        onOrderProduct={handleOrderPage}
        onHomepageDatas={handleHomePage}
      />
      <Header open={open} onUserAddClick={handleUserAddClick} /> 

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 0,
          marginTop: theme.spacing(8),
          height: '100vh',  
          position: 'relative',
        }}
      >
      
        
       
         
          <>
            {showTable && <SettingsTable  Backdrop={handleBackdrop}/>}
            {productpage && <ProductTable BackDrop={handleBackdrop}/>}
            {orderPage && <OrderPage BackDrop={handleBackdrop} />}
            {homePageData && <HomePageData />}
          </>
         {loading && <SimpleBackdrop Open={loading}></SimpleBackdrop>}
      
      </Box>
    </Box>
  );
}

export default HomePage;
