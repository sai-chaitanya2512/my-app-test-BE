import { ToastContainer } from 'react-toastify';
import './App.css';
import Loginform from './LoginForm/Loginform';
import BoidBackground from './Background/BoidBackground';
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <BoidBackground />
        <Route path="/login" element={<Loginform />} />
        <Dashboard />
        <ToastContainer />
      </BrowserRouter>
    </div>

  );
}

export default App;
