import React, { useState, useEffect } from 'react';

function TestConnection() {
  const [message, setMessage] = useState('백엔드 연결 시도 중...');
  
  // Spring Boot의 "/api/demo-web" 엔드포인트에 요청을 보냅니다.
  useEffect(() => {
    fetch("/sts/api/test") 
      .then((response) => {
        if (response.ok) {
          // 💡 수정: 응답이 문자열이므로 response.text()를 사용합니다.
          console.log("222");
          return response.text(); 
        } 
        console.log("3333");
        throw new Error(`서버 응답 코드 오류: ${response.status}`);
      })
      .then((data) => {
          // 성공적으로 문자열 데이터를 받으면 업데이트합니다.
          console.log("4444");
          setMessage(`✅ Spring 연결 성공: ${data}`);
      })
      .catch((error) => {
          console.error("Fetch 에러:", error);
          setMessage(`❌ Spring 연결 실패: ${error.message}.`);
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