import React, { useState, useEffect } from 'react';

function TestConnection() {
  const [message, setMessage] = useState('백엔드 연결 시도 중...');
  
  // Spring Boot의 "/api/demo-web" 엔드포인트에 요청을 보냅니다.
  useEffect(() => {
    fetch("/api/demo-web") 
      .then((response) => {
        // 응답이 성공적이면 JSON으로 변환합니다.
        if (response.ok) {
          return response.json();
        } 
        // 응답에 문제가 있으면 에러 메시지를 표시합니다.
        throw new Error('네트워크 응답 오류 또는 서버 문제');
      })
      .then((data) => {
          // 성공적으로 데이터를 받으면 메시지를 업데이트합니다.
          setMessage(`✅ Spring 연결 성공: ${data}`);
      })
      .catch((error) => {
          // 요청 실패 시 에러 메시지를 표시합니다.
          console.error("Fetch 에러:", error);
          setMessage(`❌ Spring 연결 실패: ${error.message}. 콘솔을 확인하세요.`);
      });
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Spring Boot API 연결 테스트</h2>
        <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{message}</p>
        <p>백엔드에서 문자열이 정상적으로 넘어오면 '✅ Spring 연결 성공...' 메시지가 뜹니다.</p>
    </div>
  );
}

export default TestConnection;