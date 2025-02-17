import { Box, Typography, TextField, Stack, InputAdornment, Button } from "@mui/material";
import styles from './RightSide.module.css';
import Tooltip from '@mui/material/Tooltip';
import { FaFacebookF, FaGithub, FaEyeSlash, FaEye, FaAt } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { getErrorMsg } from "../data/errorMsg";
import { UserDetailsError, UserDetailsType } from "../Interface/Login.interface";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const RightSide = () => {
  const [userDetailsError, setUserDetailsError] = useState<UserDetailsError>({ userNameError: '', passwordError: '' });
  const [userDetails, setUserDetails] = useState<UserDetailsType>({ userName: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: any) => {
    event.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = true;

    setUserDetailsError({ userNameError: '', passwordError: '' });

    // Validate email
    if (userDetails.userName.trim() === '') {
      setUserDetailsError((prevState) => ({
        ...prevState,
        userNameError: getErrorMsg('1.1', 'email_id_is_empty'),
      }));
      isValid = false;
    } else if (!emailRegex.test(userDetails.userName)) {
      setUserDetailsError((prevState) => ({
        ...prevState,
        userNameError: getErrorMsg('1.2', 'email_id_is_invalid'),
      }));
      isValid = false;
    }

    if (userDetails.password.trim() === '') {
      setUserDetailsError((prevState) => ({
        ...prevState,
        passwordError: getErrorMsg('1.3', 'password_is_empty'),
      }));
      isValid = false;
    }

    if (!isValid) {
      console.log("Form is not valid");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/users/login', {
        email: userDetails.userName,
        password: userDetails.password,
      });

      if (response.status === 200) {
        console.log("Login successful!");
        
        // Show success toast
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const { userName, id, role,email } = response.data.user;
        localStorage.setItem('userName', userName);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', id);
        localStorage.setItem("userEmail",email)

        if (role === 'admin') {
          console.log("Admin logged in successfully");
        }

        // setTimeout(() => {
        //   navigate('/homepage');
        // }, 2000);
        navigate('/homepage');
      } else {
        console.log('Login failed:', response.data.message);

        // Show error toast if login fails
        toast.error("Login failed: " + response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        if (response.data.message === "User not found") {
          setUserDetailsError((prevState) => ({
            ...prevState,
            userNameError: 'User does not exist.',
          }));
        }
      }
      // if(response.data.message ==='password incorrect'){
      //   setUserDetailsError((prevState) => ({
      //     ...prevState,
      //     passwordError: 'incorrect password.',
      //   }));
      //   return
      // }

    } catch (error: any) {
      console.error('Error during login:', error);
      if (error.response && error.response.data.message === 'password incorrect') {
        // Update state with error message for password field
        setUserDetailsError((prevState)=>({
          ...prevState,
          passwordError:'Incorrect password, please try again.'
        }));
      }
      if (error.response && error.response.data.message === 'User not found') {
        // Update state with error message for password field
        setUserDetailsError((prevState)=>({
          ...prevState,
          userNameError:'User not found.'
        }));
      }
      // Handle error during login
      // if (error.response) {
      //   console.error('Backend error message:', error.response.data);
      //   setUserDetailsError((prevState) => ({
      //     ...prevState,
      //     userNameError: error.response.data.message || 'An error occurred. Please try again.',
      //   }));
      // } else {
      //   setUserDetailsError((prevState) => ({
      //     ...prevState,
      //     userNameError: 'Network error. Please try again later.',
      //   }));
      // }

      // Show error toast for network error
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    // setUserDetails({ userName: '', password: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setUserDetails(prevState => ({
      ...prevState,
      [field]: value
    }));

    if (value.trim() !== '') {
      setUserDetailsError(prevState => ({
        ...prevState,
        [`${field}Error`]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Toast Container for showing notifications */}
      <ToastContainer />

      <Box className={styles.RightContainer} sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Sign in
        </Typography>
        <Stack direction={"column"} spacing={2} width={"80%"}>
          <p className={styles.inputLabels}>
            Email<span className={styles.requiredAsterisk}> *</span>
          </p>
          <TextField
            id="outlined-basic"
            size="small"
            className={styles.inputField}
            placeholder="Enter Email"
            variant="outlined"
            value={userDetails.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end"><FaAt  /></InputAdornment>,
            }}
          />

          <p className={styles.ErrorMessage} style={{ whiteSpace: "preserve", color: "red" }}>
            {userDetailsError.userNameError ? userDetailsError.userNameError : " "}
          </p>

          <p className={styles.inputLabels}>
            Password<span className={styles.requiredAsterisk}> *</span>
          </p>
          <TextField
            id="password"
            placeholder="Enter Password"
            size="small"
            className={styles.inputField}
            variant="outlined"
            type={passwordVisible ? "text" : "password"}
            value={userDetails.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            InputProps={{
              // endAdornment: <InputAdornment position="end"><FaLock /></InputAdornment>
              endAdornment:  <InputAdornment position="end" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash/> : <FaEye />} {/* Toggle the eye icon */}
            </InputAdornment>
            }}
          />
          <p style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: "12px" }}>
            {userDetailsError.passwordError ? userDetailsError.passwordError : " "}
          </p>
        </Stack>
        <Typography variant="body2" className={styles.ForgotPassword}>
          <a href="#">Forgot password?</a>
        </Typography>

        <Button
          variant="contained"
          sx={{ width: "80%", height: "40%" }}
          type="submit"
        >
          <Typography style={{ textTransform: 'none', fontWeight: 700 }}>Sign in</Typography>
        </Button>

        <Typography variant="body2" className={styles.orLogin}>
          or login with social platforms
        </Typography>

        <Stack direction={"row"} spacing={2} className={styles.iconbutton}>
          <Tooltip title="yet to implement this features" arrow>
            <Button variant="outlined" className={styles.IconButton} sx={{ minWidth: '10px' }}>
              <FcGoogle size={20} />
            </Button>
          </Tooltip>

          {/* <Tooltip title="Facebook" arrow> */}
          <Tooltip title="yet to implement this features" arrow>
            <Button variant="outlined" className={styles.IconButton2} sx={{ minWidth: '10px' }}>
              <FaFacebookF size={20} />
            </Button>
          </Tooltip>

          {/* <Tooltip title="Github" arrow> */}
          <Tooltip title="yet to implement this features" arrow>
            <Button variant="outlined" className={styles.IconButton} sx={{ minWidth: '10px' }}>
              <FaGithub size={20} />
            </Button>
          </Tooltip>

          {/* <Tooltip title="LinkedIn" arrow> */}
          <Tooltip title="yet to implement this features" arrow>
            <Button variant="outlined" className={styles.IconButton3} sx={{ minWidth: '10px' }}>
              <IoLogoLinkedin size={20} />
            </Button>
          </Tooltip>
        </Stack>
      </Box>
    </form>
  );
};

export default RightSide;
