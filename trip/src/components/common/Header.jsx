import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/Login/AuthContext.jsx";
import RoutePick from "../../resources/img/RoutePick.png";
import "../../resources/css/Header.css";

function Header() {
  const { isLoggedIn, logout } = useAuth();  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           
    navigate("/");
  };
console.log("HEADER isLoggedIn =", isLoggedIn);

  return (
    <header className="main-header">
      <nav className="header-nav-left" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ marginRight: '30px' }}>
          <img src={RoutePick} alt="LOGO" className="header-logo"/>
        </Link>
        <Link to="/">소개</Link>
        <Link to="/history">히스토리</Link>
        <Link to="/ranking">랭킹</Link>
        <Link to="/mytravel">나의 여행지</Link>
      </nav>

      <nav className="header-nav-right">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        ) : (
          <Link to="/login">로그인하기</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
