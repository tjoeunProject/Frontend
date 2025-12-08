import React from 'react';
import RoutePick from '../../resources/img/RoutePick.png';
import '../../resources/css/Footer.css'; 

function Footer() {
    return(
        <footer className="footer-section">
            {/* 1. 로고 */}
            <img src={RoutePick} alt="RoutePick 로고" className="footer-logo"/> 
            
            {/* 2. 링크 */}
            <div className="footer-links">
                <a href="#" onClick={(e) => e.preventDefault()}>개인정보 처리방침</a>&emsp;&emsp;&emsp;
                <a href="#" onClick={(e) => e.preventDefault()}>서비스 이용 약관</a>&emsp;&emsp;&emsp;
                <a href="#" onClick={(e) => e.preventDefault()}>문의하기</a>&emsp;
            </div>
            
            {/* 3. 저작권 */}
            <div className="footer-links" >
                Copyright 2025 tjoeun proj 3팀 - RoutePick
            </div>
        </footer>
    );
}

export default Footer;