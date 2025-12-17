import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Routes, Route } from 'react-router-dom';
// 경로 오류 수정
import '../resources/css/MyTravelPage.css';

// 하위 View 컴포넌트는 주석 처리 유지 (실제 개발 시 활성화)

function MyTravelPage() {
  // 사용자 정보는 실제로는 API 호출 등을 통해 가져와야 합니다.
  const userData = {
    nickname: "안녕 나는 여행자라네 <= 닉네임",
    statusMessage: "AI 여행 옵션을 짜는 중, 나랑 여행 갈 사람 🙋‍♂️🙋‍♂️",
    hashtags: ["# 🧍 혼자 여행하기 좋아요", "# 😄 힐링하기 좋은", "# 🤸 액티비티", "# 🍽️ 맛집 탐방"],
    savedPlansCount: 3,
    likesCount: 7,
    historyCount: 5,
    lastVisitedRegion: "제주",
    travelStyle: "☕ 카페 투어"
  };

  return (
    <>
      <Header />
      {/* 중앙 정렬 컨테이너 적용 */}
      <div className="main-content-wrapper mytravel-page">
        <div className="page-centered-container" style={{ padding: '20px 0' }}>
          {/* <div className="mytravel-header"> (헤더 영역은 주석 처리 또는 제거) */}

          <div className="mytravel-content-area">

            {/* 1. 프로필 카드 및 탭 메뉴 영역 */}
            <div className="profile-section">

              {/* 프로필 카드 */}
              <div className="profile-card">
                <div className="profile-info">
                  <p className="nickname">{userData.nickname}</p>
                  <p className="status-message">"{userData.statusMessage}"</p>
                  <div className="hashtags">
                    {userData.hashtags.map((tag, index) => (
                      <span key={index} className="hashtag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 탭 메뉴 (AT, 저장, 히스토리) */}
              <div className="tab-menu">
                <div className="tab-item">
                  <span role="img" aria-label="AT">✈️ 나의 계획</span>
                  <span className="count">{userData.savedPlansCount}개</span>
                </div>
                <div className="tab-item">
                  <span role="img" aria-label="저장">❤️ 관심 목록</span>
                  <span className="count">{userData.likesCount}</span>
                </div>
                <div className="tab-item">
                  <span role="img" aria-label="히스토리">📅 히스토리</span>
                  <span className="count">{userData.historyCount}지역</span>
                </div>
              </div>
            </div>

            {/* 2. 나의 여행 / 활동 요약 */}
            <div className="summary-section">
              <h2 className="section-title">나의 여행 / 활동 요약</h2>
              <ul className="summary-list">
                <li>내가 가장 많이 간 지역: {userData.lastVisitedRegion}</li>
                <li>내가 가장 많이 선택한 선호 스타일: {userData.travelStyle}</li>
                {/* 추가 요약 내용 */}
              </ul>
            </div>

            {/* 3. 계정 관리 */}
            <div className="account-section">
              <h2 className="section-title">계정 관리</h2>
              <ul className="account-list">
                <li><a href="/change-password">비밀번호 변경</a></li>
                <li><a href="/logout">로그아웃</a></li>
                {/* 추가 계정 관리 메뉴 */}
              </ul>
            </div>
            {/* 4. 문의하기 / 고객 지원 섹션 추가 */}
            <div className="support-section">
              <h2 className="section-title">궁금한 점이 있으신가요?</h2>
              <p>자주 묻는 질문(FAQ)을 확인하거나 1:1 문의를 남겨주세요.</p>
              <div className="support-links">
                <a href="/faq" className="support-button faq-button">자주 묻는 질문 (FAQ)</a>
                <a href="/inquiry" className="support-button inquiry-button">📞 1:1 문의하기</a>
              </div>
            </div>
            {/* Nested Route 영역은 유지하거나 필요에 따라 제거/조정 */}
            {/* <Routes> ... </Routes> */}

            {/* <p className="mytravel-placeholder"> ... </p> */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default MyTravelPage;