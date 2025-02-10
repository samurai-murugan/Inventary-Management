
import {Box,Button} from '@mui/material';
import Typography from '@mui/material/Typography';
import styles from "./RegisterRightSide.module.css";

const RegisterRightSide = ({ setLogin }: { setLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {
  
  const handleLoginPage=()=>{
    console.log("I am going to the Login page")
    setLogin(true);
  }
  return (
    <>
    
            <Box className={styles.RegisterRightSideContainer} sx={{ width: '100%', maxWidth: 500 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight:'bold' }}>
            Welcome Back!
            </Typography>
            <Typography variant="body2" sx={{marginBottom:'20px'}} gutterBottom>
                Already have an account?
            </Typography>
            <Button variant="outlined" size='large' sx={{color: 'white', border: '2px solid white',borderRadius:'10px'}} onClick={handleLoginPage}><Typography style={{ textTransform: 'none', fontWeight:700 }}>Login</Typography></Button>
            </Box>
   
    
    </>
  )
}

export default RegisterRightSide;