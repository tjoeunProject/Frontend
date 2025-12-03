// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import api from './axiosConfig';
import { useAuth } from './AuthContext';

const DashboardPage = () => {
  const { logout } = useAuth();
  const [msg, setMsg] = useState('버튼을 눌러 API를 테스트하세요.');

  const handleApiTest = async () => {
    try {
      // 토큰이 만료되어도 알아서 갱신 후 데이터를 가져옵니다.
      const res = await api.get('/auth/demo-controller'); // 백엔드에 존재하는 API 주소로 수정 필요
      setMsg(`성공 응답: ${JSON.stringify(res.data)}`);
    } catch (err) {
      setMsg(`실패: ${err.message}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎉 환영합니다!</h1>
      <p>여기는 로그인을 해야만 들어올 수 있는 보안 구역입니다.</p>
      
      <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <p>{msg}</p>
        <button onClick={handleApiTest} style={{ marginRight: '10px' }}>API 테스트</button>
        <button onClick={logout} style={{ backgroundColor: '#dc3545', color: 'white' }}>로그아웃</button>
      </div>
    </div>
  );
};

export default DashboardPage;