import { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import '../../resources/css/Login.css';  

// 🚨 에셋 경로 오류 해결: 임포트 구문을 제거하고 이미지 URL을 인라인으로 사용하거나,
// 서버에 업로드된 login.jpg의 ID를 사용하여 대체합니다.
import LoginImg from '../../resources/img/login.png';
import Naver from '../../resources/img/naver1.png';
import Kakao from '../../resources/img/kakao2.png';
import Google from '../../resources/img/google1.png';

const LoginComponent = () => {
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
      <div className="login-container">
        {/* 이미지 섹션 */}
        <div className="login-image-container">
          <img 
            src={LoginImg} 
            alt="여행 친구들과 함께하는 모습" 
            className="login-image"
            
          />
        </div>

        {/* 메시지 섹션 */}
        <p className="login-message">
          지금 떠나볼까?<br />
          <strong>맛있는 추억과 재미</strong>를 한 번에!
        </p>

        <form onSubmit={handleLogin} style={{ width: '80%' }}>
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
          <img src={Naver} alt="네이버 로고" className="sns-icons"/> 
          <img src={Kakao} alt="카카오 로고" className="sns-icons"/> 
          <img src={Google} alt="구글 로고" className="sns-icons"/> 
        </div>        
      </div>
  );
}

export default LoginComponent;