import * as React from 'react';
import { AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { blue } from '@mui/material/colors';
import { IoIosSettings } from "react-icons/io";
import { FaUserPlus, FaSignOutAlt } from 'react-icons/fa'; // Import the logout icon
import { useNavigate } from 'react-router-dom'; // Make sure you have react-router-dom installed
import styles from "./Header.module.css"; // Your CSS module for styling

interface HeaderProps {
  open: boolean;
  onUserAddClick: () => void; 
}

const Header: React.FC<HeaderProps> = ({ open, onUserAddClick }) => {
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
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
  
    sessionStorage.clear();

    navigate('/', { replace: true });
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
      <Toolbar sx={{ paddingLeft: "0px", boxShadow: "none" }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            paddingLeft: open ? "0px" : "25px",
            transition: 'padding-left 0.3s ease',
          }}
        >
          Inventory Management
        </Typography>

        {/* Settings Icon (Visible only for admin users) */}
        {userRole === "admin" && (
          <IconButton onClick={handleSettingsClick}>
            <IoIosSettings />
          </IconButton>
        )}

        {/* Avatar Icon for User Options (Logout) */}
        <Avatar 
          className={styles.avatar} 
          sx={{ bgcolor: blue[700] }} 
          onClick={handleAvatarClick} // Open the menu on Avatar click
        >
          {avatarLetter}
        </Avatar>

        {/* Settings Menu (Only for admin users) */}
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

        {/* Avatar Menu for Logout */}
        <Menu
          anchorEl={anchorElAvatar}
          id="avatar-menu"
          open={Boolean(anchorElAvatar)}  
          onClose={handleMenuClose}
          className={styles.avatarMenu}
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
