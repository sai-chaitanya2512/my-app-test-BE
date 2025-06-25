import { ToastContainer } from 'react-toastify';
import './App.css';
import Loginform from './LoginForm/Loginform';
import BoidBackground from './Background/BoidBackground';
import AnimatedMouseBackground from './Mouse/MouseAnimation';

function App() {
  return (
    <div className="App">
      <BoidBackground />
      {/* <AnimatedMouseBackground/> */}
      <Loginform />
      <ToastContainer />
    </div>

  );
}

export default App;
