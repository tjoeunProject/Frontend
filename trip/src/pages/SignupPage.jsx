import React, { useState } from 'react';

// Header 컴포넌트는 프로젝트 구조에 따라 주석 처리합니다.
import RoutePick from '../assets/RoutePick.png';

// 비밀번호 표시/숨김 아이콘 (Login.jsx에서 재사용)
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.73 0 1.45-.08 2.14-.23"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);


const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    nickname: '',
    birthdate: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    // 비밀번호 확인 로직
    if (id === 'password' || id === 'confirmPassword') {
        const newPassword = id === 'password' ? value : formData.password;
        const newConfirmPassword = id === 'confirmPassword' ? value : formData.confirmPassword;
        setPasswordMatch(newPassword === newConfirmPassword);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!passwordMatch || formData.password === '') {
        console.error('오류: 비밀번호가 일치하지 않거나 비어 있습니다.');
        return;
    }

    // 실제 회원가입 로직이 여기에 들어갑니다.
    console.log('회원가입 시도:', formData);
    console.log('회원가입 성공 (데모)');
  };

  return (
    <div className="page-container">
      <div className="header-logo-text">
                  <img src={RoutePick} alt="LOGO" className="header-logo"/>
              </div>
      <div className="login-container signup-container">

        {/* 회원가입 제목 섹션 */}
        <h2 className="signup-title">
          회원가입 <br />
        </h2>

        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          
          {/* 1. 이메일 */}
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className="login-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              required
            />
          </div>
          
          {/* 2. 이름 */}
          <div className="input-group">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              type="text"
              className="login-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* 3. 닉네임 */}
          <div className="input-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              type="text"
              className="login-input"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>

          {/* 4. 생년월일 */}
          <div className="input-group">
            <label htmlFor="birthdate">생년월일 </label>
            <input
              id="birthdate"
              type="date" // 캘린더 대신 date input 사용
              className="login-input"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* 5. 성별 */}
          <div className="input-group">
            <label htmlFor="gender">성별</label>
            <select 
              id="gender" 
              className="login-input" 
              value={formData.gender} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>
          
          {/* 6. 비밀번호 */}
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <div className="input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                value={formData.password}
                onChange={handleChange}
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
          
          {/* 7. 비밀번호 확인 */}
          <div className="input-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <div className="input-container">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`login-input ${!passwordMatch ? 'input-error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <div 
                className="password-toggle" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                role="button"
                aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </div>
            </div>
            {!passwordMatch && (
                <p className="error-message">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          

          {/* 회원가입 버튼 */}
          <button 
            type="submit" 
            className="login-button" 
            disabled={!passwordMatch}
            style={{ 
              backgroundColor: passwordMatch ? '#ff8c00' : '#cccccc',
              cursor: passwordMatch ? 'pointer' : 'not-allowed'
            }}
          >
            회원가입하기
          </button>
        </form>

        {/* 하단 푸터 영역 (Login.jsx와 동일) */}
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
};

export default SignupPage;