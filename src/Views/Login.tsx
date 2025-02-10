import { Box } from "@mui/material"
import LeftSide  from "../components/LeftSide"
import  RightSide  from "../components/RightSide"

export const Login: React.FC<{ setLogin: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setLogin }) => {
  return (
    <>
    <Box className="main">
        <Box className='mainContainer'>
          <Box className="loginPageContainer" >
            <Box className="leftSide"><LeftSide setLogin={setLogin}/></Box>
            <Box className="rightSide"><RightSide/></Box>
          </Box>
        </Box>
    </Box>
    
      
    </>
   
  )
}
