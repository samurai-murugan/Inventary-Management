
import { useState } from 'react';

import { Login } from "./Login";
import { Register } from './Register';
import { Outlet } from 'react-router-dom';


const LoginPage: React.FC = () => {
  const [login, setLogin] = useState<boolean>(true);

  return (
    <>
    <div className="App">
      {login ? <Login setLogin={setLogin} /> : <Register setLogin={setLogin} />}
      <Outlet/>
    </div>

    </>
    
  );
}

export default LoginPage;
