import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
// 경로 재수정: ../components/common/Header로 수정
// CSS 경로 재수정
import '../../resources/css/SignupPage.css'; 


// 비밀번호 표시/숨김 아이콘 (Login.jsx에서 재사용)
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.73 0 1.45-.08 2.14-.23"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

const SignupComponent = () => {
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
  
  // 비밀번호 일치 여부와 8자 이상 여부를 동시에 관리
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true); // 8자 이상 유효성 상태

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    let newPassword = formData.password;
    let newConfirmPassword = formData.confirmPassword;

    if (id === 'password') { // 비밀번호 8개 이상일 때 가능 
        newPassword = value;
        setIsPasswordValid(value.length >= 8); // 비밀번호 길이 검사
    } else if (id === 'confirmPassword') {
        newConfirmPassword = value;
    }

    // 비밀번호 일치 검사 (현재 입력된 값과 다른 쪽 값 비교)
    if (id === 'password' || id === 'confirmPassword') {
      const p1 = id === 'password' ? value : formData.password;
      const p2 = id === 'confirmPassword' ? value : formData.confirmPassword;
      // 두 필드 모두 값이 있을 때만 일치 여부 확인, 아니면 true (오류 메시지 숨김)
      if (p1 && p2) {
        setPasswordMatch(p1 === p2);
      } else {
        setPasswordMatch(true);
      }
    }
  };

  const isFormValid = formData.password && formData.confirmPassword && passwordMatch && isPasswordValid;

  const handleSignup = (e) => {
    e.preventDefault();

    if (!isFormValid) {
        console.error('오류: 입력 필드를 확인해 주세요 (비밀번호 불일치 또는 길이 부족).');
        return;
    }

    // 실제 회원가입 로직이 여기에 들어갑니다.
    console.log('회원가입 시도:', formData);
    console.log('회원가입 성공 (데모)');
  };

  return (
    
    <div className="center-style">

        {/* 회원가입 제목 섹션 */}
        <h2 className="signup-title">
          회원가입 <br />
        </h2>

        <form onSubmit={handleSignup} className="form-style">
          
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
                // 비밀번호가 유효하지 않을 때만 input-error 클래스 적용
                className={`login-input ${!isPasswordValid ? 'input-error' : ''}`}
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
             {/* 8자 미만일 때 오류 메시지 표시 */}
            {!isPasswordValid && formData.password.length > 0 && (
                <p className="error-message">비밀번호는 8자 이상이어야 합니다.</p>
            )}
          </div>
          
          {/* 7. 비밀번호 확인 */}
          <div className="input-group">
            <label htmlFor="confirmPassword">비밀번호 확인 </label>
            <div className="input-container">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                // 비밀번호 불일치 시 input-error 클래스 적용
                className={`login-input ${!passwordMatch && formData.confirmPassword.length > 0 ? 'input-error' : ''}`}
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
            {/* 비밀번호가 다르고, 확인 필드에 내용이 있을 때만 오류 메시지 표시 */}
            {!passwordMatch && formData.confirmPassword.length > 0 && (
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
      </div>
  
  );
};

export default SignupComponent;