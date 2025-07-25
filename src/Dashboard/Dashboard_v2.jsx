import React from 'react'
import Hyperspeed from '../Background/Hyperspeed'
import "../Most.scss"
import { useNavigate } from 'react-router-dom';

const Dashboard_v2 = (props) => {
  const { setuserLoggedIn } = props;
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("auth-token");
    setuserLoggedIn(false);
    navigate("/");
  }


  const menubar = () => {
    const menuItems = [
      { name: "Home", onClick: () => { console.log("Home clicked"); } },
      { name: "About Me", onClick: () => { console.log("About Me clicked"); } },
      { name: "My Projects", onClick: () => { console.log("My Projects clicked"); } },
      { name: "LOG OUT", onClick: () => { logOut() } }
    ];

    return (
      <ul className="menu-bar" style={{ listStyleType: "none" }}>
        {menuItems.map((item) => (
          <li key={item}>
            <button className="button" onClick={item.onClick}>
              <strong>{item.name}</strong>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const heroHeading = () => {
    return (
      <div className="hero-heading">
        <h1>Chaithu Porto</h1>
      </div>
    );
  };

  return (
    <div className="App">
      <Hyperspeed />

      <div className="whole-body">
        {menubar()}

        {heroHeading()}
      </div>
    </div>
  );
}

export default Dashboard_v2