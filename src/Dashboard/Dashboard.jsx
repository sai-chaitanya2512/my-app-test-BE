import { Button } from 'antd';
import React from 'react'

const Dashboard = () => {

    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem("auth-token");
        navigate("/login");
    }

  return (
    <div>
        <h1>Dashboard</h1>
        {/* logout button */}
        <Button onClick={logOut}>Logout</Button>
    </div>
  )
}

export default Dashboard