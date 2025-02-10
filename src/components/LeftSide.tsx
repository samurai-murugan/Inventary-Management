import * as React from 'react';
import {Box,Button} from '@mui/material';
import Typography from '@mui/material/Typography';
import styles from "./LeftSide.module.css"
const LeftSide = ({ setLogin }: { setLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const handleSwitchToRegister = () => {
    setLogin(false); 
  }

  return (
    <>
    
            <Box className={styles.leftsidecontainer} sx={{ width: '100%', maxWidth: 500 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight:'bold' }}>
            Hello, Welcome!
            </Typography>
            <Typography variant="body2" sx={{marginBottom:'20px'}} gutterBottom>
                Don't have an account?
            </Typography>
            <Button variant="outlined" size='large' sx={{color: 'white', border: '2px solid white',borderRadius:'10px'}} onClick={handleSwitchToRegister}><Typography style={{ textTransform: 'none', fontWeight:700 }}>Register</Typography></Button>
            </Box>
   
    
    </>
  )
}

export default LeftSide;