import { ToastContainer } from 'react-toastify';
import './App.css';
import Loginform from './LoginForm/Loginform';
import BoidBackground from './Background/BoidBackground';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';
import { useState } from 'react';

function App() {

  const [userLoggedIn, setuserLoggedIn] = useState(localStorage.getItem("auth-token") !== null);

  return (
    <div className="App">
      <BrowserRouter>
        {!userLoggedIn && <BoidBackground />}
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Loginform setuserLoggedIn={setuserLoggedIn} />} />
          <Route path="/" element={<PrivateRoute><Dashboard setuserLoggedIn={setuserLoggedIn} /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
