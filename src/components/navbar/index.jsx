import React from 'react';
import axios from 'axios';
import './navbar.scss';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
const userId = localStorage.getItem("userId") ? localStorage.getItem('userId') : null;
// const accessToken = localStorage.getItem('token') ? localStorage.getItem('token') : null;

const Navbar = () => {

  const navigate = useNavigate();

  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async (e) => {
    e.preventDefault()

    try {
      await axios.post("http://localhost:3002/users/logout");
      localStorage.clear();
      window.location.reload();
      navigate("/login");
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  return (
    <div className='navbar'>
      <div className='left'>
        <Link to='/' style={{ textDecoration: "none" }}>
          <span>FakeBook</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? <WbSunnyOutlinedIcon onClick={toggle} /> : <DarkModeOutlinedIcon onClick={toggle} />}
        <AppsOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type='text' placeholder='Search' />
        </div>
      </div>
      <div className='right'>
        <div><button onClick={handleLogout}>Logout</button></div>
        <Link to={`/profile/${userId}`}>
          <PersonOutlinedIcon />
        </Link>
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img src={currentUser.profilePic} alt='' />
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar