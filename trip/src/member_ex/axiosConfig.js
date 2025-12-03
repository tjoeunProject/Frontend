import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // 백엔드 주소 확인!
  headers: {
    'Content-Type': 'application/json',
  },
});

// [요청 인터셉터] 헤더에 Access Token 싣기
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [응답 인터셉터] 403 에러(만료) 시 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 403 Forbidden이 뜨고, 재시도한 적이 없다면 (토큰 만료 의심)
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔒 토큰 만료됨. 리프레시 시도 중...");
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) throw new Error("리프레시 토큰 없음");

        // ★ 백엔드 요구사항: Refresh Token을 헤더에 넣어서 요청
        const response = await axios.post(
          'http://localhost:8080/api/v1/auth/refresh-token',
          {}, // Body는 비움
          {
            headers: { Authorization: `Bearer ${refreshToken}` }
          }
        );

        // 새 토큰 갈아끼우기
        const { access_token, refresh_token: newRefreshToken } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);

        console.log("🔑 토큰 갱신 성공! 이전 요청 재전송");

        // 실패했던 요청의 헤더 수정 후 재전송
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("❌ 리프레시 실패. 로그아웃 처리");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login1';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;