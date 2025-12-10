import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import React, { useState, useEffect } from 'react';
import 'rsuite/dist/rsuite.min.css';
import Footer from '../../components/common/Footer.jsx'
import survey1 from './../../resources/img/survey1.png';
import { Link, Navigate } from 'react-router-dom'; // Link 임포트 띄어쓰기 수정
import useSurveyGuard from './useSurveyGuard.jsx';

function SurveyTwoPage() {
    
    const [selectedTags, setSelectedTags] = useState([]);

    useSurveyGuard('survey_step_1_completed', '/survey/SurveyFirstPage');

    // 유효성 검사 등 필요한 로직
    const handleNextClick = () => {
    
    // 핵심: 다음 페이지 접근 허용 플래그 저장
    localStorage.setItem('survey_step_1_completed', 'true');
    };

    // 최대 선택 갯수
    const MAX_SELECTION = 2;

      const toggleTag = (tag) => {
        setSelectedTags((prev) =>{
            if (prev.includes(tag)){
                return prev.filter((t) => t !== tag);
            }
            // 만약 2개 이상이면 선택 XX
            else{
                if (prev.length < MAX_SELECTION){
                    return [...prev, tag];
                }
                else {
                    alert(`최대 : ${MAX_SELECTION}개 까지만 선택 가능해요`);
                    return prev;
                }
            }
        }
        );
      };
    
      const renderTag = (label) => (
        <button
          className={`survey4-tag ${selectedTags.includes(label) ? "active" : ""}`}
          onClick={() => toggleTag(label)
          }
        >
          {label}
        </button>
      );

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
                            선택해주세요.
                        </h4>
                    </div>
                    <div>
                        <img src={survey1} width={250} />
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
                    <Link to="/survey/SurveyThreePage" className="next-button2"
                    onClick={handleNextClick}>
                        다음으로
                    </Link>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default SurveyTwoPage;