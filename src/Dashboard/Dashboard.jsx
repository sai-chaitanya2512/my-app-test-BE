import { Button } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem("auth-token");
        setuserLoggedIn(false);
        navigate("/login");
    }

  return (
    <div>
        <h1>Dashboard</h1>
        <Button onClick={logOut}>Logout</Button>
    </div>
  )
}

export default Dashboard