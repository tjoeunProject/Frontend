import React from 'react';
import { Link } from 'react-router-dom';
import RoutePick from '../../resources/img/RoutePick.png';

import '../../resources/css/Header.css'; 


function Header() {
  return (
    <header className="main-header"> 
      <nav className="header-nav-left" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ marginRight: '30px' }}>
          {/* import한 RoutePick 변수를 src에 사용 */}
          <img src={RoutePick} alt="LOGO" className="header-logo"/>
        </Link>
        <Link to="/">소개</Link>
        <Link to="/history">히스토리</Link>
        <Link to="/ranking">랭킹</Link>
        <Link to="/mytravel">나의 여행지</Link>
      </nav>
      <nav className="header-nav-right">
        <Link to="/login">로그인하기</Link>
      </nav>
    </header>
  );
}

export default Header;