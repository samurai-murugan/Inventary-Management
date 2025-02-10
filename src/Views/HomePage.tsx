import * as React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Sidebar from './SideBar';
import Header from './Header';
import SettingsTable from '../components/SettingsTable';
import ProductTable from '../components/Product';
import OrderPage from "../components/OrderPage";
import HomePageData from '../components/HomePageData';

function HomePage() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showTable, setShowTable] = React.useState(false); 
  const [productpage, setProductPage] = React.useState(false);
  const [orderPage, setOrderPage] = React.useState(false);
  const [homePageData, setHomePageData] = React.useState(true);

  const handleDrawerToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleUserAddClick = () => {
    setProductPage(false);
    setOrderPage(false);
    setHomePageData(false);
    setShowTable(true); 
  };

  const handleProductPage = () => {
    setShowTable(false);
    setOrderPage(false)
    setHomePageData(false);
    setProductPage(true); 
  };
  const handleOrderPage =()=>{
    setProductPage(false);
    setShowTable(false);
    setHomePageData(false);
    setOrderPage(true)
  }
  const handleHomePage =()=>{
    setProductPage(false);
    setShowTable(false);
    setOrderPage(false)
    setHomePageData(true);
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
        }}
      >
        {showTable && <SettingsTable />}
        {productpage && <ProductTable />}
        {orderPage && <OrderPage/>}
        {homePageData && <HomePageData/>}
      </Box>
    </Box>
  );
}

export default HomePage;
