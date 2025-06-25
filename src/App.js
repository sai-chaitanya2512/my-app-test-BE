import { ToastContainer } from 'react-toastify';
import './App.css';
import Loginform from './LoginForm/Loginform';
import BoidBackground from './Background/BoidBackground';
import { BrowserRouter, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <BoidBackground />
        <Route path="/login" element={<Loginform />} />
         <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <ToastContainer />
      </BrowserRouter>
    </div>

  );
}

export default App;
