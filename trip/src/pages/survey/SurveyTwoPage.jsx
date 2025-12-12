import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import React, { useState } from 'react';
import 'rsuite/dist/rsuite.min.css';
import Footer from '../../components/common/Footer.jsx'
import survey1 from './../../resources/img/survey1.png';
import { Link } from 'react-router-dom';
import useSurveyGuard from './useSurveyGuard.jsx';

function SurveyTwoPage() {
    
    // 1. 상태 통일: 선택된 지역을 관리하는 단일 State
    const [selectedRegions, setSelectedRegions] = useState([]);

    useSurveyGuard('survey_step_1_completed', '/survey/SurveyFirstPage');

    
    // 최대 선택 갯수 정의
    const MAX_SELECTION = 2;

    // 2. 통합된 지역 토글 함수: 선택/해제 및 최대 개수 제한 로직 포함
    const handleRegionToggle = (regionName) => {
        
        setSelectedRegions((prev) => {
            if (prev.includes(regionName)) {
                // 이미 선택된 경우: 제거 (선택 해제)
                return prev.filter((r) => r !== regionName);
            }
            
            // 새로 선택하는 경우
            else {
                if (prev.length < MAX_SELECTION) {
                    // 최대 개수 미만이면 추가
                    return [...prev, regionName];
                } else {
                    // 최대 개수 초과 시 경고 후 현재 상태 유지
                    alert(`최대 ${MAX_SELECTION}개 까지만 선택 가능해요.`);
                    return prev;
                }
            }
        });
    };

    // 3. renderTag 함수: 통합된 State와 로직 사용
    const renderTag = (regionName) => {
        // 선택 상태 확인 (selectedRegions 사용)
        const isSelected = selectedRegions.includes(regionName);

        return (
            <button
                key={regionName}
                // 클래스 확인 로직 통일 (selectedRegions 사용)
                className={`survey4-tag ${isSelected ? "active" : ""}`}
                // 토글 함수 연결
                onClick={() => handleRegionToggle(regionName)}
            >
                {regionName}
            </button>
        );
    };

    // 4. 다음 버튼 클릭 시 로직
    const handleNextClick = () => {
        console.log("최종 선택된 지역:", selectedRegions); 
        
        // **********************************************
        // TODO: 유효성 검사 추가 (선택된 지역이 최소 1개 이상인지 등)
        if (selectedRegions.length === 0) {
            alert("지역을 1개 이상 선택해주세요!");
            return;
        }
        // **********************************************
        console.log("최종 선택된 지역:", selectedRegions);
        // 핵심: 다음 페이지 접근 허용 플래그 저장 및 이동 준비
        localStorage.setItem('places', JSON.stringify(selectedRegions));
        localStorage.setItem('survey_step_1_completed', 'true');
        // 참고: Link 컴포넌트가 이동을 처리하므로 별도 Navigate는 필요 없습니다.
    };
    
    // 사용하지 않는 불필요한 함수 및 변수 제거
    // - handleNext 제거 (handleNextClick이 대체)
    // - toggleTag 제거 (handleRegionToggle이 통합)
    // - selectedTags 제거 (selectedRegions로 통일)


    return (
        <div className="page-with-header">
            <Header />
            <section>
                <div className='k1'>
                    <div>
                        <h3>
                            이번 여행, 어디로 떠나볼까요?
                        </h3>
                        <br/>
                        <h4>
                            <b>여행을 떠나고 싶은 지역을</b> <br/>
                            선택해주세요. (최대 {MAX_SELECTION}개)
                        </h4>
                    </div>
                    <div>
                        <img src={survey1} width={250} alt="여행지 선택 일러스트" />
                    </div>
                </div>
                <div className='survey-grid'>
                    {renderTag("서울")}
                    {renderTag("부산")}
                    {renderTag("대구")}
                    {renderTag("인천")}
                    {renderTag("광주")}
                    {renderTag("대전")}
                    {renderTag("울산")}
                    {renderTag("충북")}
                    {renderTag("충남")}
                    {renderTag("전북")}
                    {renderTag("전남")}
                    {renderTag("경북")}
                    {renderTag("경남")}
                    {renderTag("제주")}
                </div>

                <div className='survey-grid2'>
                    <Link to="/survey/SurveyFirstPage" className="back-button">
                        뒤로가기
                    </Link>
                    <Link 
                        to="/survey/SurveyThreePage" 
                        className="next-button2"
                        onClick={handleNextClick} // Link가 이동하기 전에 클릭 이벤트 처리
                    >
                        다음으로
                    </Link>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default SurveyTwoPage;