// src/hooks/useSurveyGuard.js (수정된 코드)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useSurveyGuard = (requiredStepKey, redirectToPath) => {
    const navigate = useNavigate();
    // 렌더링 시 깜빡임을 방지하기 위해 로딩 상태를 사용합니다.
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const status = localStorage.getItem(requiredStepKey);
        const isCompleted = status === 'true';

        console.log(`[GUARD LOG] ${requiredStepKey} 상태: ${status} (완료 여부: ${isCompleted})`);

        if (!isCompleted) {
            // 🛑 조건 불충족: FirstPage나 이전 페이지로 리다이렉트
            console.log("🛑 [REDIRECT] 조건 불충족: 즉시 이동 시작.");
            navigate(redirectToPath, { replace: true });
        } else {
            // ✅ 조건 충족: 페이지 접근 허가 및 플래그 파괴
            console.log("✅ [ACCESS GRANTED] 조건 충족. 플래그 즉시 삭제.");
            localStorage.removeItem(requiredStepKey); // 🚨 여기서 플래그를 지웁니다!
            setIsLoading(false); // 로딩 완료
        }
    }, [requiredStepKey, redirectToPath, navigate]);

    // 조건이 확인될 때까지 렌더링을 막습니다. (깜빡임 방지)
    return isLoading; 
};

export default useSurveyGuard;