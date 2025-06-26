import { ToastContainer } from 'react-toastify';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Loginform from './LoginForm/Loginform';
import BoidBackground from './LoginBackground/BoidBackground';
import Dashboard from './Dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';

// import Home from './Pages/Home';
// import About from './Pages/About';
// Add more imports as needed

function App() {
  const [userLoggedIn, setuserLoggedIn] = useState(localStorage.getItem("auth-token") !== null);

  const privateRoutes = [
    { path: '/', element: <Dashboard setuserLoggedIn={setuserLoggedIn} /> },
    // { path: '/home', element: <Home /> },
    // { path: '/about', element: <About /> },
  ];

  return (
    <div className="App">
      <BrowserRouter>
        {!userLoggedIn && <BoidBackground />}
        <ToastContainer />
        <Routes>

          <Route path="/login" element={<Loginform setuserLoggedIn={setuserLoggedIn} />} />

          {privateRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
          ))}

          <Route
            path="*"
            element={
              userLoggedIn
                ? <Navigate to="/" replace />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
