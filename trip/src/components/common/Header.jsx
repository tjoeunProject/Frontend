import React from 'react';
import { Link } from 'react-router-dom';
import RoutePick from '../../assets/RoutePick.png';     

// 스타일은 예시이며, 실제 CSS로 대체해야 함.
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#f8f8f8',
  borderBottom: '1px solid #eee',
};

const navItemStyle = {
  marginRight: '15px',
  textDecoration: 'none', 
  color: '#333',
};

function Header() {
  return (
    <header style={headerStyle}>
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ marginRight: '30px' }}>
          <img src={RoutePick} alt="LOGO" className="header-logo"/>
        </Link>
        <Link to="/" style={navItemStyle}>소개</Link>
        <Link to="/history" style={navItemStyle}>히스토리</Link>
        <Link to="/ranking" style={navItemStyle}>랭킹</Link>
        <Link to="/mytravel" style={navItemStyle}>나의 여행지</Link>
      </nav>
      <nav>
        <Link to="/login" style={navItemStyle}>로그인하기</Link>
      </nav>
    </header>
  );
}

export default Header;