
import { useState } from 'react';

import { Login } from "./Login";
import { Register } from './Register';
import { Outlet } from 'react-router-dom';
import SimpleBackdrop from '../components/Roatating';


const LoginPage: React.FC = () => {
  const [login, setLogin] = useState<boolean>(true);
  const [open,setOpen] = useState(false);
const handleimage =()=>{
  setOpen(true);
}
  return (
    <>
    <div className="App">
      {login ? <Login open={handleimage} setLogin={setLogin} /> : <Register setLogin={setLogin} />}
      {/* {login && open && <SimpleBackdrop Open={open}/>} */}
      <Outlet/>
    </div>

    </>
    
  );
}

export default LoginPage;
