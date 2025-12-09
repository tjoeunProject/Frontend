// src/pages/Login/LoginPage.jsx
import React from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import LoginComponent from "./LoginComponent.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // LoginComponent가 호출하는 실제 로그인 함수
  const handleLogin = async (email, password) => {
    const success = await login(email, password);

    if (success) {
      alert("로그인 성공!");
      navigate('/'); // 로그인 성공 시 메인으로 이동
    } else {
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <>
      <Header />
      <LoginComponent onLogin={handleLogin} />
      <Footer />
    </>
  );
};

export default LoginPage;
