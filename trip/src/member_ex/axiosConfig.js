import axios from 'axios';

// 1. baseURL 제거 (빈 껍데기만 생성)
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// [요청 인터셉터] - 토큰 넣기 (그대로 유지)
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

// [응답 인터셉터] - 토큰 갱신 (주소만 수정)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. 로그인 요청 에러는 재시도 금지
    if (originalRequest.url && originalRequest.url.includes('/auth/authenticate')) {
      return Promise.reject(error);
    }

    // 2. 403 에러 (토큰 만료) 처리
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔒 토큰 만료. 갱신 시도...");
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("리프레시 토큰 없음");

        // ★ 여기서도 전체 주소 사용 (/sts/api/v1/...)
        const response = await axios.post(
          '/sts/api/v1/auth/refresh-token', 
          {}, 
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        // (변수명 access_token 인지 accessToken 인지 꼭 확인!)
        const { access_token, refresh_token: newRefreshToken } = response.data;
        
        localStorage.setItem('access_token', access_token);
        if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);

        console.log("🔑 갱신 성공");

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("❌ 갱신 실패. 로그아웃");
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