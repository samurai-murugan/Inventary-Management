import { Box } from "@mui/material";
import LeftSide from "../components/LeftSide";
import RightSide from "../components/RightSide";

interface LoginProps {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  open:()=> void;
}

export const Login: React.FC<LoginProps> = ({ setLogin, open }) => {
 

  return (
    <Box className="main">
      <Box className="mainContainer">
        <Box className="loginPageContainer">
          <Box className="leftSide">
            <LeftSide setLogin={setLogin} />
          </Box>
          <Box className="rightSide">
            <RightSide open={open} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
