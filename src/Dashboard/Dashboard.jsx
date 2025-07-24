import { Button } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
// import Hyperspeed from "../Background/Hyperspeed";
import "../Most.scss";

const Dashboard = (props) => {
  const { setuserLoggedIn } = props;
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("auth-token");
    setuserLoggedIn(false);
    navigate("/");
  }

  const menubar = () => {
    const menuItems = ["Home", "My Account", "My Orders", "My Cart"];

    return (
      <ul className="menu-bar" style={{ listStyleType: "none" }}>
        {menuItems.map((item) => (
          <li key={item}>
            <button className="button">
              <strong>{item}</strong>
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
      <div className="whole-body">
      {/* <Hyperspeed /> */}

        {menubar()}

        {heroHeading()}
        <Button onClick={logOut}>Logout</Button>
      </div>
  )
}

export default Dashboard