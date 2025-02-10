import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './Views/LoginPage';
import HomePage from './Views/HomePage';
import "./App.css"
const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/homepage', 
    element: <HomePage />,
  },
]);

const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
