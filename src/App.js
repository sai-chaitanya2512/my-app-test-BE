import { ToastContainer } from 'react-toastify';
import './App.css';
import Loginform from './LoginForm/Loginform';
import BoidBackground from './Background/BoidBackground';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <BoidBackground />
          <ToastContainer />
        <Routes>
          <Route path="/login" element={<Loginform />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
