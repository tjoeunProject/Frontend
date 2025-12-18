import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  // [수정 1] user 상태 선언 및 초기화 (새로고침 시 LocalStorage에서 복구)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // 새로고침 시 로그인 유지 확인
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/sts/api/v1/auth/authenticate', { email, password });
      
      const { access_token, refresh_token, user_id } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // [수정 2] 사용자 정보 객체 생성 및 저장
      const userInfo = { memberId: user_id };
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setUser(userInfo); // 이제 setUser가 정의되어 있어서 에러 안 남

      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("로그인 에러:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // [추가] 로그아웃 시 사용자 정보도 깨끗이 삭제
    localStorage.removeItem('user');
    setUser(null);

    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);