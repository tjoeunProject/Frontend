import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import '../../resources/css/Login.css';  

import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import LoginComponent from "./LoginComponent.jsx";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  // 추후 컨트롤러로 분리할 계획입니다.
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
      <div>
        <Header />
        <LoginComponent />       
        <Footer />    
      </div>
  );
}

export default LoginPage;