import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import '../resources/css/Login.css';  

// 🚨 에셋 경로 오류 해결: 임포트 구문을 제거하고 이미지 URL을 인라인으로 사용하거나,
// 서버에 업로드된 login.jpg의 ID를 사용하여 대체합니다.
import RoutePick from '../resources/img/RoutePick.png';
import LoginImg from '../resources/img/login.png';

// Lucide-react 아이콘을 사용하여 시각적 요소를 추가합니다.
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.73 0 1.45-.08 2.14-.23"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);
const NaverIcon = () => (<span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>N</span>);
const KakaoIcon = () => (<span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>K</span>);
const GoogleIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11h7.5"/><path d="M12 13h7.5"/><path d="M12 9h7.5"/><circle cx="5.5" cy="12" r="4.5"/></svg>);


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // TODO: 실제 로그인 로직 구현
  };

  const handleSnsLogin = (platform) => {
    console.log(`${platform} 로그인 시도`);
    // TODO: SNS 로그인 로직 구현
  };

  const goToSignup = () => {
    navigate('/signup'); 
  };
  
  const goToFindPassword = (e) => {
    e.preventDefault();
    console.log("비밀번호 찾기 페이지로 이동합니다.");
    // TODO: 비밀번호 찾기 로직 구현
  };

  return (
    <div className="page-container">
      {/* Login 페이지에는 Header를 추가하지 않았습니다. */}
      {/* <Header /> */}
      <div className="login-container">
        <div className="header-logo-text">
            <img src={RoutePick} alt="LOGO" className="header-logo"/> 
        </div>

        {/* 이미지 섹션 */}
        <div className="login-image-container">
          <img 
            src={LoginImg} 
            alt="여행 친구들과 함께하는 모습" 
            className="login-image"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src="https://placehold.co/250x350/e0e0e0/555?text=Login+Image" 
            }}
          />
        </div>

        {/* 메시지 섹션 */}
        <p className="login-message">
          지금 떠나볼까?<br />
          <strong>맛있는 추억과 재미</strong>를 한 번에!
        </p>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          {/* 이메일 입력 그룹 */}
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
            />
          </div>

          {/* 비밀번호 입력 그룹 */}
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <div className="input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </div>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

         {/* 링크 그룹 */}
        <div className="link-group">
          <Link to="/signup">회원가입 하기</Link> 
          <a href="#" onClick={goToFindPassword}>비밀번호 찾기</a>
        </div>

        {/* SNS 로그인 */}
        <p className="sns-login-title">SNS 계정 간편 로그인</p>

        <div className="sns-icons">
          <a href="#" className="sns-icon-button sns-icon-naver" onClick={(e) => { e.preventDefault(); handleSnsLogin('Naver'); }}>
            <NaverIcon />
          </a>
          <a href="#" className="sns-icon-button sns-icon-kakao" onClick={(e) => { e.preventDefault(); handleSnsLogin('Kakao'); }}>
            <KakaoIcon />
          </a>
          <a href="#" className="sns-icon-button sns-icon-google" onClick={(e) => { e.preventDefault(); handleSnsLogin('Google'); }}>
            <GoogleIcon />
          </a>
        </div>

        {/* 하단 푸터 영역 */}
        <div className="footer-section">
          <div className="logo-ver">로고 ver.2</div>
          <div className="footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>개인정보 처리방침</a>
            <a href="#" onClick={(e) => e.preventDefault()}>서비스 이용 약관</a>
            <a href="#" onClick={(e) => e.preventDefault()}>문의하기 @gmail.com</a>
          </div>
          <div className="copyright">
            Copyright 2025 tjeun proj<br />
            All right reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;