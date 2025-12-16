import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import React, { useState } from 'react'; // useEffect는 안 써서 제거함
import 'rsuite/dist/rsuite.min.css';
import Footer from '../../components/common/Footer.jsx'
import survey1 from './../../resources/img/survey1.png';
import { Link } from 'react-router-dom';
import useSurveyGuard from './useSurveyGuard.jsx';

function SurveyTwoPage() {

    // 🔥 [수정 포인트] 변수명을 selectedTags로 통일했습니다.
    // 기존: const [selectedRegions, setSelectedRegions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useSurveyGuard('survey_step_1_completed', '/survey/SurveyFirstPage');

    // ✅ [수정 완료] 지역 선택용 핸들러로 변경
    const handleNextClick = (e) => {
        // 지역이 하나도 선택되지 않았을 때 방어
        if (selectedTags.length === 0) {
            e.preventDefault(); // 이동 막기
            alert("여행할 지역을 최소 1곳 선택해주세요!");
            return;
        }

        // 1. 지역 데이터 저장 (키값: survey_destination)
        console.log("📍 저장되는 지역 데이터:", selectedTags);
        localStorage.setItem('survey_destination', JSON.stringify(selectedTags));

        // 2. 가드 플래그 저장
        localStorage.setItem('survey_step_1_completed', 'true');
    };

    // 최대 선택 갯수
    const MAX_SELECTION = 2;

    const toggleTag = (tag) => {
        // 🔥 [수정 포인트] setSelectedRegions -> setSelectedTags 로 변경됨 (위에서 이름을 바꿨으므로 자동 해결)
        setSelectedTags((prev) => {
            if (prev.includes(tag)) {
                return prev.filter((t) => t !== tag);
            }
            // 만약 2개 이상이면 선택 XX
            else {
                if (prev.length < MAX_SELECTION) {
                    return [...prev, tag];
                } else {
                    alert(`최대 ${MAX_SELECTION}개 까지만 선택 가능해요`);
                    return prev;
                }
            }
        });
    };

    const renderTag = (label) => (
        <button
            // 🔥 [수정 포인트] selectedTags 사용 가능해짐
            className={`survey4-tag ${selectedTags.includes(label) ? "active" : ""}`}
            onClick={() => toggleTag(label)}
        >
            {label}
        </button>
    );

    return (
        <div className="page-with-header">
            <Header />
            <section className='k2'>
                <div className='k1'>
                    <div>
                        <h3>
                            이번 여행, 어디로 떠나볼까요?
                        </h3>
                        <br />
                        <h4>
                            <b>여행을 떠나고 싶은 지역을</b> <br />
                            선택해주세요. (최대 {MAX_SELECTION}개)
                        </h4>
                    </div>
                    <div>
                        <img src={survey1} width={250} alt="설문 이미지" />
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