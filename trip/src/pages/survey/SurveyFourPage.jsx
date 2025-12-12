import React, { useState } from 'react';
import Header from '../../components/common/Header';
import "../../resources/css/SurveyFourPage.css"; // 🔥 전용 CSS
import Footer from '../../components/common/Footer.jsx';
import survey3 from './../../resources/img/survey3.png';
import { Link } from 'react-router-dom';
import useSurveyGuard from './useSurveyGuard.jsx';

function SurveyFourPage() {

    useSurveyGuard('survey_step_1_completed', '/survey/SurveyFirstPage');

    // 유효성 검사 등 필요한 로직
    const handleNextClick = () => {
    
    // 핵심: 다음 페이지 접근 허용 플래그 저장
    localStorage.setItem('survey_step_1_completed', 'true');
    };

  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const renderTag = (label) => (
    <button
      className={`survey4-tag ${selectedTags.includes(label) ? "active" : ""}`}
      onClick={() => toggleTag(label)}
    >
      {label}
    </button>
  );

  const TagsNextClick = () => {
        console.log("최종 선택된 태그들:", selectedTags); 
        
        // **********************************************
        // TODO: 유효성 검사 추가 (선택된 지역이 최소 1개 이상인지 등)
        // **********************************************
        console.log("최종 선택된 태그들:", selectedTags);
        // 핵심: 다음 페이지 접근 허용 플래그 저장 및 이동 준비
        localStorage.setItem('tags', JSON.stringify(selectedTags));
        localStorage.setItem('survey_step_1_completed', 'true');
        // 참고: Link 컴포넌트가 이동을 처리하므로 별도 Navigate는 필요 없습니다.
    };

  return (
    <div className="survey4-wrapper">
      <Header />

      <section className="survey4-content">

        <div className="survey4-title-box">
          <div>
            <h3>마지막으로<br/> 이번 여행의 테마를 정해볼까요?</h3>
            <h4> <br/>
              여행의 <b>태그를 </b>선택해주세요.
            </h4>
          </div>
          <img src={survey3} width={250} alt="Survey 3" />
        </div>

        {/* 동행 타입 */}
        <div className="survey4-tag-section">
          <h4 className="survey4-tag-title">👨‍👩‍👧‍👦 동행 타입</h4>
          <div className="survey4-tag-grid">
            {renderTag("👨‍👩‍👧 부모님과 가기 좋아요")}
            {renderTag("🧍 혼자 여행하기 좋아요")}
            {renderTag("👩 친구와 가기 좋아요")}
            {renderTag("👩‍👧 아이와 함께 가기 좋아요")}
          </div>
        </div>

        {/* 분위기 타입 */}
        <div className="survey4-tag-section">
          <h4 className="survey4-tag-title">🌇 분위기 타입</h4>
          <div className="survey4-tag-grid">
            {renderTag("💏 데이트하기 좋은")}
            {renderTag("😊 감성적인 / 잔잔한")}
            {renderTag("😄 힐링하기 좋은")}
            {renderTag("🤫 조용한 / 한적한")}
            {renderTag("📷 인스타 감성 / 사진 맛집")}
            {renderTag("🌃 야경이 예쁜")}
          </div>
        </div>

        {/* 활동 타입 */}
        <div className="survey4-tag-section">
          <h4 className="survey4-tag-title"> 🚗 활동 타입</h4>
          <div className="survey4-tag-grid">
            {renderTag("🍽️ 맛집 탐방")}
            {renderTag("🏕️ 캠핑 / 글램핑 가능")}
            {renderTag("🚐 드라이브 코스 좋음")}
            {renderTag("☕ 카페 투어")}
            {renderTag("🖼️ 전시회 탐방")}
            {renderTag("🤸 액티비티")}
            {renderTag("🛍️ 쇼핑하기 좋은")}
            {renderTag("🏙️ 도심 분위기 / 시티뷰")}
          </div>
        </div>

        <Link to="/map" className="survey4-next-btn">
            건너 뛰기 
        </Link>
        {/* 버튼 영역 */}
        <div className="survey4-btn-box">
          <Link to="/survey/SurveyThreePage" className="survey4-back-btn"
          onClick={handleNextClick}>
            이전으로
          </Link>

          <Link to="/map" className="survey4-next-btn"
          onClick={TagsNextClick}>
            완료하기
          </Link>
        </div>

      </section>

      <Footer />
    </div>
  );
}

export default SurveyFourPage;
