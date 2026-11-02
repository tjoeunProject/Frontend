import pythonApi from '../../utils/pythonApi.js';
import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer.jsx';
import "../../resources/css/SurveyFourPage.css";
import '../../resources/css/LoadingModal.css';
import survey3 from './../../resources/img/survey3.png';
import { useNavigate, Link } from 'react-router-dom';
import useSurveyGuard from './useSurveyGuard.jsx';

function SurveyFourPage() {
  const navigate = useNavigate();

  // 설문 접근 가드
  useSurveyGuard('survey_step_1_completed', '/survey/SurveyFirstPage');

  // 태그 상태
  const [selectedTags, setSelectedTags] = useState([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 태그 토글
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const renderTag = (label) => (
    <button
      type="button"
      className={`survey4-tag ${selectedTags.includes(label) ? 'active' : ''}`}
      onClick={() => toggleTag(label)}
    >
      {label}
    </button>
  );

  /**
   * ✅ 완료 버튼 클릭 시 실행되는 핵심 로직
   * 1. 로딩 모달 표시
   * 2. 설문 데이터 조합
   * 3. AI 생성 요청
   * 4. 완료 시 MapPage로 자동 이동
   */
  const handleComplete = async () => {
    setIsLoading(true); // 🔥 로딩 시작

    try {
      // 1. 이전 설문 데이터 가져오기
      const destRaw = localStorage.getItem('survey_destination');
      const schedRaw = localStorage.getItem('survey_schedule');

      if (!destRaw || !schedRaw) {
        alert("이전 단계 정보가 없습니다. 처음부터 다시 진행해주세요.");
        navigate('/survey/SurveyFirstPage');
        return;
      }

      const destination = JSON.parse(destRaw);
      const schedule = JSON.parse(schedRaw);

      // 2. AI 요청 데이터 구성
      const generateRequest = {
        destination,
        days: schedule.diffDays + 1,
        tags: selectedTags
      };

      // 3. 🔥 AI 일정 생성 요청
      const response = await pythonApi.generate(generateRequest);
      const aiResult = response.data;

      // 4. 🔥 결과를 들고 Map 페이지로 이동
      navigate('/map', {
        state: {
          generateRequest,
          schedule,
          aiResult
        }
      });

      // 5. 임시 설문 데이터 정리
      localStorage.removeItem('survey_step_1_completed');
      localStorage.removeItem('survey_destination');
      localStorage.removeItem('survey_schedule');

    } catch (error) {
      console.error(error);
      alert("일정 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false); // 페이지 이동 후에는 의미 없지만 안전하게
    }
  };

  return (
    <div className="survey4-wrapper">
      <Header />

      {/* 🔄 로딩 모달 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-modal">
            <h3>AI가 여행 일정을 만들고 있어요 🤖</h3>
            <p>잠시만 기다려 주세요...</p>
            <div className="spinner" />
          </div>
        </div>
      )}

      <section className="survey4-content">
        <div className="survey4-title-box">
          <div>
            <h3>
              마지막으로<br />
              이번 여행의 테마를 정해볼까요?
            </h3>
            <h4>
              <br />
              여행의 <b>태그</b>를 선택해주세요.
            </h4>
          </div>
          <img src={survey3} width={250} alt="Survey 4" />
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
          <h4 className="survey4-tag-title">🚗 활동 타입</h4>
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

        {/* 버튼 영역 */}
        <div className="survey4-btn-box">
          <Link to="/survey/SurveyThreePage" className="survey4-back-btn">
            이전으로
          </Link>

          <button
            className="survey4-next-btn"
            onClick={handleComplete}
            disabled={isLoading}
          >
            완료하기
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default SurveyFourPage;
