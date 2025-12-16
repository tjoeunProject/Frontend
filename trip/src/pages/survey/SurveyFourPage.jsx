import React, { useState } from 'react';
import Header from '../../components/common/Header';
import "../../resources/css/SurveyFourPage.css";
import Footer from '../../components/common/Footer.jsx';
import survey3 from './../../resources/img/survey3.png';
import { useNavigate, Link } from 'react-router-dom'; // 🚨 Link 추가!
import useSurveyGuard from './useSurveyGuard.jsx';

function SurveyFourPage() {
  const navigate = useNavigate();

  // 페이지 진입 권한 체크
  useSurveyGuard('survey_step_1_completed', '/survey/SurveyFirstPage');

  const [selectedTags, setSelectedTags] = useState([]);

  // 12/12 수정 [핵심] 완료 버튼 핸들러
  const handleComplete = () => {
    // 1. 로컬 스토리지 데이터 가져오기
    const destRaw = localStorage.getItem('survey_destination');
    const schedRaw = localStorage.getItem('survey_schedule');

    if (!destRaw || !schedRaw) {
      alert("이전 단계의 선택 정보가 없습니다. 처음부터 다시 시도해주세요.");
      navigate('/survey/SurveyFirstPage');
      return;
    }

    const destination = JSON.parse(destRaw);
    const schedule = JSON.parse(schedRaw);

    // 2. 데이터 구성 (서버로 보낼 준비)
    const generateRequest = {
      destination: destination, // ["Jeju", "서울"]
      days: schedule.diffDays + 1, // 박(night) + 1 = 일(day)
      tags: selectedTags // 현재 페이지에서 선택한 태그들
    };

    // 3. Map 페이지로 이동하며 데이터 전달
    navigate('/map', {
      state: {
        generateRequest: generateRequest, // AI 생성 요청 데이터
        schedule: schedule             // MapPage에서 날짜 표시용
      }
    });

    // 4. 사용한 플래그 및 임시 데이터 청소
    localStorage.removeItem('survey_step_1_completed');
    localStorage.removeItem('survey_destination');
    localStorage.removeItem('survey_schedule');
  };

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

      <section className="k2">

        <div className="survey4-title-box">
          <div>
            <h3>마지막으로<br /> 이번 여행의 테마를 정해볼까요?</h3>
            <h4> <br />
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

        {/* '건너 뛰기'는 태그 선택 없이 바로 완료하는 것과 같으므로 handleComplete 호출 */}
        {/* 필요 없다면 지우셔도 됩니다. */}
        <button className="survey4-next-btn" onClick={handleComplete} style={{ marginBottom: '10px', background: '#ccc' }}>
          건너 뛰기
        </button>

        {/* 버튼 영역 */}
        <div className='survey-grid2'>
          {/* 🚨 Back 버튼: handleNextClick 제거 (정의되지 않음) */}
          <Link to="/survey/SurveyThreePage" className="survey4-back-btn">
            이전으로
          </Link>

          {/* 🚨 완료 버튼: Link 대신 button 사용 -> onClick 핸들러 연결 */}
          <button className="survey4-next-btn" onClick={handleComplete}>
            완료하기
          </button>
        </div>

      </section>

      <Footer />
    </div>
  );
}

export default SurveyFourPage;