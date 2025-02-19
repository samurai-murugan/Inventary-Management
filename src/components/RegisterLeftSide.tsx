import { Box, Typography, TextField, Stack, InputAdornment, Button, Tooltip } from "@mui/material";
import styles from './RegisterLeftSide.module.css';
import { FaFacebookF, FaUser, FaGithub, FaEyeSlash, FaEye, FaAt } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect, useCallback } from "react";
import { RegisterUserDetailError, RegisterUserDetailType } from "../Interface/Login.interface";
import { getErrorMsg } from '../data/errorMsg';
import { toast, ToastContainer } from "react-toastify";

const RightSide = ({ setLogin }: { setLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [registerUserDetails, setRegisterUserDetails] = useState<RegisterUserDetailType>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const [registerUserDetailsError, setRegisterUserDetailsError] = useState<RegisterUserDetailError>({
    firstnameError: '',
    lastnameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const handleLoginPage=()=>{
    console.log("I am going to the Login page")
    setLogin(true);
  }

  useEffect(() => {
    console.log("RightSide");
  }, []); 

  const handleInputChange = useCallback((field: keyof typeof registerUserDetails, value: string) => {
    if (registerUserDetails[field] !== value) {
      setRegisterUserDetails(prevState => ({
        ...prevState,
        [field]: value
      }));
    }

    if (value.trim() !== '') {
      setRegisterUserDetailsError(prevState => ({
        ...prevState,
        [`${field}Error`]: '' 
      }));
    }
  }, [registerUserDetails]); // Memoize the function to avoid re-creation.

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    let isValid = true;
    const errorMessages = {
      firstnameError: '',
      lastnameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: ''
    };
    const errors: string[] = [];
    
    // Validate fields
    if (registerUserDetails.firstname.trim() === '') {
      errorMessages.firstnameError = getErrorMsg('2.1', 'firstname_is_empty'); 
      isValid = false;
    }
    if (registerUserDetails.lastname.trim() === '') {
      errorMessages.lastnameError = getErrorMsg('2.9', 'lastname_is_empty'); 
      isValid = false;
    }
    if (registerUserDetails.email.trim() === '') {
      errorMessages.emailError = getErrorMsg('2.2', 'email_id_is_empty');
      isValid = false;
    } else if (!emailRegex.test(registerUserDetails.email)) {
      errorMessages.emailError = getErrorMsg('2.3', 'email_id_is_invalid');
      errors.push(getErrorMsg('2.3', 'email_id_is_invalid'));
      isValid = false;
    }
    if (registerUserDetails.password.trim() === '') {
      errorMessages.passwordError = getErrorMsg('2.4', 'password_is_empty');
      isValid = false;
    } else if (!passwordRegex.test(registerUserDetails.password)) {
      errorMessages.passwordError = getErrorMsg('2.5', 'password_is_Weak');
      isValid = false;
    }
    if (registerUserDetails.confirmpassword.trim() === '') {
      errorMessages.confirmPasswordError = getErrorMsg('2.7', 'confirm_password');
      errors.push(getErrorMsg('2.7', 'confirm_password'));
      isValid = false;
    } else if (registerUserDetails.password !== registerUserDetails.confirmpassword) {
      errorMessages.confirmPasswordError = getErrorMsg('2.8', 'confirm_password_mismatch');
      isValid = false;
    }

    setRegisterUserDetailsError(errorMessages);

    if (isValid) {
      console.log(registerUserDetails); // For debugging purposes

      try {
        const response:any = await fetch('http://localhost:5000/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "firstname": registerUserDetails.firstname,
            "lastname": registerUserDetails.lastname,
            "email": registerUserDetails.email,
            "password": registerUserDetails.password,
            "confirmpassword": registerUserDetails.confirmpassword,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Registration successful:', data);
          // alert(data.message);
           toast.success(data.message, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });

                setTimeout(()=>{  
                  handleLoginPage();
                  setRegisterUserDetails({
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirmpassword: ''
                  });
                },2000);
          setRegisterUserDetailsError({
            firstnameError: '',
            lastnameError: '',
            emailError: '',
            passwordError: '',
            confirmPasswordError: ''
          });
        } else {
          console.log('Registration failed:', data.message);
          alert(data.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };
  const YettoImplement =()=>{
    toast.warning("Yet to implement this feature",{
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    
      

    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />

      <Box className={styles.RegisterLeftSideContainer} sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" ,color:'rgb(118, 173, 235)'}}>
        Sign Up
        </Typography>
        <Stack direction={"column"} spacing={2} width={"80%"}>
          <p className={styles.inputLabels}>
            Firstname<span className={styles.requiredAsterisk}> *</span>
          </p>
          <TextField
            id="outlined-basic"
            size='small'
            className={styles.inputField}
            variant="outlined"
            value={registerUserDetails.firstname}
            placeholder="Enter Username"
            onChange={(e) => handleInputChange('firstname', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position='end'><FaUser /></InputAdornment>,
            }}
          />
          <p style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: "12px" }}>
            {registerUserDetailsError.firstnameError ? registerUserDetailsError.firstnameError : " "}
          </p>

          <p className={styles.inputLabels}>
            Lastname<span className={styles.requiredAsterisk}> *</span>
          </p>
          <TextField
            id="outlined-basic"
            size='small'
            className={styles.inputField}
            variant="outlined"
            value={registerUserDetails.lastname}
            placeholder="Enter lastname"
            onChange={(e) => handleInputChange('lastname', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position='end'><FaUser /></InputAdornment>,
            }}
          />
          <p style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: "12px" }}>
            {registerUserDetailsError.lastnameError ? registerUserDetailsError.lastnameError : " "}
          </p>

          <p className={styles.inputLabels}>
            Email <span className={styles.requiredAsterisk}> *</span>
          </p>
          <TextField
            id="outlined-basic"
            size='small'
            className={styles.inputField}
            placeholder="Enter Email"
            variant="outlined"
            value={registerUserDetails.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position='end'><FaAt /></InputAdornment>,
            }}
          />
          <p style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: "12px" }}>
            {registerUserDetailsError.emailError ? registerUserDetailsError.emailError : ' '}
          </p>

          <p className={styles.inputLabels}>
            Password<span className={styles.requiredAsterisk}> *</span>
          </p>
          <TextField
            id="password"
            size='small'
            className={styles.inputField}
            variant="outlined"
            value={registerUserDetails.password}
            placeholder="Enter Password"
            onChange={(e) => handleInputChange('password', e.target.value)}
            type={passwordVisible ? "text" : "password"}
            InputProps={{
              endAdornment: <InputAdornment position="end" onClick={togglePasswordVisibility}>
                            {passwordVisible ? <FaEyeSlash/> : <FaEye />} {/* Toggle the eye icon */}
                          </InputAdornment>
            }}
          />
          <p style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: "12px" }}>
            {registerUserDetailsError.passwordError ? registerUserDetailsError.passwordError : ' '}
          </p>

          <p className={styles.inputLabels}>
            Confirm Password<span className={styles.requiredAsterisk}> *</span>
          </p>
          <TextField
            id="confirmpassword"
            size='small'
            className={styles.inputField}
            variant="outlined"
            value={registerUserDetails.confirmpassword}
            placeholder="Enter Confirm Password"
            onChange={(e) => handleInputChange('confirmpassword', e.target.value)}
            type={passwordConfirmVisible ? "text" : "password"}
            InputProps={{
            endAdornment: <InputAdornment position="end" onClick={toggleConfirmPasswordVisibility}>
              {passwordConfirmVisible ? <FaEyeSlash/> : <FaEye />} {/* Toggle the eye icon */}
            </InputAdornment>
            }}
          />
          <p style={{ marginTop: "0px", whiteSpace: "preserve", color: 'red', fontSize: "12px" }}>
            {registerUserDetailsError.confirmPasswordError ? registerUserDetailsError.confirmPasswordError : " "}
          </p>
        </Stack>

        <Button variant="contained" sx={{ width: "80%", height: "40%" }} type="submit">
          <Typography style={{ textTransform: 'none', fontWeight: 700 }}>Sign up</Typography>
        </Button>

        <Typography variant="body2" className={styles.orLogin}>
          or Signup with social platforms
        </Typography>
        <Stack direction={"row"} spacing={2} className={styles.iconbutton}>
          <Tooltip  title="Google" arrow>
            <Button variant="outlined" className={styles.IconButton} sx={{ minWidth: '10px' }}onClick={YettoImplement} >
              <FcGoogle size={20} />
            </Button>
          </Tooltip>
          <Tooltip  title="FaceBook" arrow>
            <Button variant="outlined" className={styles.IconButton2} sx={{ minWidth: '10px' }} onClick={YettoImplement} >
              <FaFacebookF size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="GitHub" arrow>
            <Button variant="outlined" className={styles.IconButton} sx={{ minWidth: '10px' }} onClick={YettoImplement} >
              <FaGithub size={20} />
            </Button>
          </Tooltip>
          <Tooltip  title="Linkedin" arrow>
            <Button variant="outlined" className={styles.IconButton3} sx={{ minWidth: '10px' }} onClick={YettoImplement} >
              <IoLogoLinkedin size={20} />
            </Button>
          </Tooltip>
        </Stack>
      </Box>
    </form>
  );
};

export default RightSide;
