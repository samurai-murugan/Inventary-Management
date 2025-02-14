import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { FaHome, FaStore, FaBoxes } from 'react-icons/fa';
import { BsCart4 } from "react-icons/bs";

const drawerWidth = 240;

const icons = [
  <FaHome />,
  <BsCart4 />,
  <FaBoxes />,
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: 'rgb(10, 24, 47)',
    ...(open
      ? {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': {
            ...openedMixin(theme),
            backgroundColor: 'rgb(10, 24, 47)',
          },
        }
      : {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': {
            ...closedMixin(theme),
            backgroundColor: 'rgb(10, 24, 47)',
          },
        }),
  })
);

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onSettingsClick: () => void;
  onProductPage: () => void;
  onOrderProduct: () => void;
  onHomepageDatas: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onToggle,
  onSettingsClick,
  onProductPage,
  onOrderProduct,
  onHomepageDatas,
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  const sidebarRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && open) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onToggle]);

  React.useEffect(() => {
    const user = localStorage.getItem('userRole'); // Assuming user info is stored as a JSON string
    if (user === 'user') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleItemClick = (index: number, text: string) => {
    setActiveIndex(index);
    if (text === 'Products') {
      onProductPage();
    } else if (text === 'order') {
      onOrderProduct();
    } else if (text === 'Home') {
      onHomepageDatas();
    }
  };

  return (
    <Drawer variant="permanent" open={open} ref={sidebarRef}>
      <DrawerHeader>
        <IconButton color="inherit" aria-label="open drawer" onClick={onToggle} edge="start" sx={{ marginLeft: 0.5, color: "#53698c" }}>
          {open ? <ChevronLeftIcon sx={{ color: "white" }} /> : <MenuIcon sx={{color:'white'}} />}
       </IconButton>
      </DrawerHeader>

      <List>
        {['Home', 'order'].map((text, index) => (
          <Tooltip key={text} title={text} arrow placement="right-start">
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                  activeIndex === index ? { backgroundColor: '#53698c' } : {},
                  {
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Button hover color
                    },
                  },
                ]}
                onClick={() => handleItemClick(index, text)}
              >
                <ListItemIcon
                  sx={[
                    { minWidth: 0, justifyContent: 'center', fontSize: 'large' },
                    open ? { mr: 3 } : { mr: 'auto' },
                    { color: 'white' },
                    {
                      '&:hover': {
                        color: 'white', // Icon remains white on hover
                      },
                    },
                  ]}
                >
                  {icons[index]}
                </ListItemIcon>
                {open && <ListItemText primary={text} sx={{ color: 'white' }} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}

        {/* Conditionally render the Products menu item if user is not logged in */}
        {!isLoggedIn && (
          <Tooltip key="Products" title="Products" arrow placement="right-start">
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                  activeIndex === 2 ? { backgroundColor: '#53698c' } : {},
                  {
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Button hover color
                    },
                  },
                ]}
                onClick={() => handleItemClick(2, 'Products')}
              >
                <ListItemIcon
                  sx={[
                    { minWidth: 0, justifyContent: 'center', fontSize: 'large' },
                    open ? { mr: 3 } : { mr: 'auto' },
                    { color: 'white' },
                    {
                      '&:hover': {
                        color: 'white', // Icon remains white on hover
                      },
                    },
                  ]}
                >
                  {icons[2]}
                </ListItemIcon>
                {open && <ListItemText primary="Products" sx={{ color: 'white' }} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
