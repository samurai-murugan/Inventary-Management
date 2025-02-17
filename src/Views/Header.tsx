import * as React from 'react';
import { AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { blue } from '@mui/material/colors';
import { IoIosSettings } from "react-icons/io";
import { FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Header.module.css"; 

interface HeaderProps {
  open: boolean;
  onUserAddClick: () => void; 
}

const Header: React.FC<HeaderProps> = ({ open, onUserAddClick }) => {
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const [anchorElSettings, setAnchorElSettings] = React.useState<null | HTMLElement>(null);
  const [anchorElAvatar, setAnchorElAvatar] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate(); // For navigation
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : '';

  // Handle Avatar menu click
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAvatar(event.currentTarget);
  };

  // Handle Settings menu click
  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElSettings(null);
    setAnchorElAvatar(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  
    sessionStorage.clear();
    
    toast.success("Logout successful!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${open ? 240 : 30}px)`,
        transition: 'width 0.3s ease',
        backgroundColor: 'white',
        color: 'black',
        boxShadow: "none"
      }}
    >
      <ToastContainer />
      <Toolbar sx={{ paddingLeft: "0px", boxShadow: "none" }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            paddingLeft: open ? "0px" : "25px",
            transition: 'padding-left 0.3s ease',
            fontWeight: 'bold'
          }}
        >
          Inventory Management
        </Typography>

        {userRole === "admin" && (
          <IconButton onClick={handleSettingsClick}>
            <IoIosSettings />
          </IconButton>
        )}

        <Avatar
          className={styles.avatar}
          sx={{ bgcolor: blue[700] }}
          onClick={handleAvatarClick}
        >
          {avatarLetter}
        </Avatar>
        <Menu
          anchorEl={anchorElSettings}
          id="settings-menu"
          open={Boolean(anchorElSettings)}  
          onClose={handleMenuClose}
          className={styles.settingbutton}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.0,
                '& .MuiAvatar-root': {
                  width: 25,
                  height: 25,
                  ml: -0.1,
                  mr: 1,
                  padding: "1px 10px",
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 8,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                  fontSize: 5
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} 
        >
          <MenuItem onClick={onUserAddClick}> 
            <FaUserPlus style={{ marginRight: 10 }} />
            Add User
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={anchorElAvatar}
          id="avatar-menu"
          open={Boolean(anchorElAvatar)}
          onClose={handleMenuClose}
          className={styles.settingbutton}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                padding: '10px',
                '& .MuiAvatar-root': {
                  width: 35,
                  height: 35,
                  ml: -0.1,
                  mr: 1,
                  padding: "1px 10px",
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 8,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                  fontSize: 5
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Details: Avatar, Name, and Email */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
            <Avatar sx={{ bgcolor: blue[700], marginRight: '10px' }}>
              {avatarLetter}
            </Avatar>
            <div>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {userName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                {userEmail}
              </Typography>
            </div>
          </div>
          <Divider sx={{ margin: '10px 0' }} />
          <MenuItem onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: 10 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
