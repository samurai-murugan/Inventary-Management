
import { Box } from "@mui/material"
import RegisterLeftSide from '../components/RegisterLeftSide'
import RegisterRightSide from'../components/RegisterRightSide'
import styles from './Register.module.css'
import { FC } from "react"


export const Register:FC<{ setLogin: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setLogin }) => {
  return (
    <>
    <Box className="main">
        <Box className='mainContainer'>
          <Box className={styles.loginPageContainer} >
            <Box className={styles.leftSide}><RegisterLeftSide /></Box>
            <Box className={styles.rightSide}><RegisterRightSide setLogin={setLogin}/></Box>
          </Box>
        </Box>
    </Box>
    
      
    </>
  )
}
