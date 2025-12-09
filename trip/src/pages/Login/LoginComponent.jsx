// src/pages/Login/LoginComponent.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../resources/css/Login.css';

import LoginImg from '../../resources/img/login.png';
import Naver from '../../resources/img/naver1.png';
import Kakao from '../../resources/img/kakao2.png';
import Google from '../../resources/img/google1.png';

const LoginComponent = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);  // AuthContext.login() 호출됨
  };

  return (
    <div className="login-container">
      {/* 이미지 영역 */}
      <div className="login-image-container">
        <img src={LoginImg} alt="여행 친구들과 함께하는 모습" className="login-image" />
      </div>

      {/* 문구 */}
      <p className="login-message">
        지금 떠나볼까?<br />
        <strong>맛있는 추억과 재미</strong>를 한 번에!
      </p>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} style={{ width: '80%' }}>
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
            />
          </div>
        </div>

        <button type="submit" className="login-button">
          로그인
        </button>
      </form>

      {/* 링크 */}
      <div className="link-group">
        <Link to="/signup">회원가입 하기</Link>
        <a href="#" onClick={(e) => e.preventDefault()}>비밀번호 찾기</a>
      </div>

      {/* SNS 로그인 */}
      <p className="sns-login-title">SNS 계정 간편 로그인</p>
      <div className="sns-icons">
        <img src={Naver} alt="네이버 로고" className="sns-icons" />
        <img src={Kakao} alt="카카오 로고" className="sns-icons" />
        <img src={Google} alt="구글 로고" className="sns-icons" />
      </div>
    </div>
  );
};

export default LoginComponent;
