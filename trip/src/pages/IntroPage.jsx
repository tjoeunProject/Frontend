import React, { useState } from 'react';
import Header from '../components/common/Header';
import { Link, useNavigate } from 'react-router-dom';
import '../resources/css/IntroPage.css';

// 이미지 리소스
import MapImage from '../resources/img/map.png';
import PhoneTapImage from '../resources/img/Intro1.png';
import HotelRoomsPreview from '../resources/img/Intro2.png';
import FatiguePerson from '../resources/img/Intro3.png';
import SolutionBackground from '../resources/img/Intro4.png';
import HowToMapIcon from '../resources/img/Intro5.png';
import RoadMapInfographic from '../resources/img/Intro6.png';
import LoginV2Users from '../resources/img/Intro7.png';

function IntroPage() {

  // 검색 기능
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    navigate('/map', { state: { searchKeyword: keyword } });
  };

  return (
    <div className="page-centered-container">
      
      {/* ✔ 상단 고정 헤더 */}
      <Header />

      {/* ==========================
          1. 지도 섹션
      =========================== */}
      <section className="section-base map-section">
        <div
          className="map-placeholder"
          style={{ backgroundImage: `url(${MapImage})` }}
        >
          {/* 지도 마커 */}
          <div
            style={{
              position: 'absolute',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'red',
              border: '2px solid white',
              top: '20%',
              left: '20%',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>

          <div
            style={{
              position: 'absolute',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'red',
              border: '2px solid white',
              top: '75%',
              left: '70%',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>

          {/* 우측 컬러 블록 */}
          <div style={{ position: 'absolute', right: 0, top: '20%', width: 40, height: 40, background: '#FF0000', borderRadius: 4 }}></div>
          <div style={{ position: 'absolute', right: 0, top: '40%', width: 40, height: 40, background: '#FFFF00', borderRadius: 4 }}></div>
          <div style={{ position: 'absolute', right: 0, top: '60%', width: 40, height: 40, background: '#0000FF', borderRadius: 4 }}></div>
          <div style={{ position: 'absolute', right: 0, top: '80%', width: 40, height: 40, background: '#FF00FF', borderRadius: 4 }}></div>
        </div>
      </section>

      {/* ==========================
          2. 검색바 + 오렌지 CTA 버튼
      =========================== */}
      <section className="search-cta-section">

        <form onSubmit={handleSearch} className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="가시고 싶으신 여행지 혹은 맛집 있으세요??"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)} // 입력할 때마다 저장
          />
          <span className="search-icon" onClick={handleSearch}>🔍</span>
        </form>

        <Link to="/survey/SurveyFirstPage" className="cta-button">
          AI 콕콕 플래너 - 코스 만들기 !!!
        </Link>

        <Link to="#" className="info-link">AI 콕콕 플래너란??</Link>
      </section>

      {/* ==========================
          3. 경험 섹션
      =========================== */}
      <section className="section-base experience-section">
        <h2>여행 준비 할 때, 이런 경험 없으셨나요?</h2>

        <div className="experience-grid">
          
          {/* 왼쪽 */}
          <div className="experience-card">
            <h3>끝이 안 보이는 스크롤</h3>
            <p>
              단톡방에 쏟아지는 숙소 링크 <br />
              “여긴 어때?” “이건 뷰 좋대”
            </p>
          </div>

          {/* 가운데 이미지 */}
          <div>
            <img src={PhoneTapImage} className="phone-tap-image" />
          </div>

          {/* 오른쪽 */}
          <div className="hotel-section">
            <img src={HotelRoomsPreview} className="hotel-thumbnails-image" />
            <h3>호텔사이트 무한 접속</h3>
            <p>
              창을 열었다 닫았다 반복하며 가격·평점 확인 <br />
              비교하다 보면 어느새 머릿속은 뒤죽박죽
            </p>
          </div>

        </div>
      </section>

      {/* ==========================
          4. 피곤함 섹션
      =========================== */}
      <section className="section-base fatigue-section">
        <h2>결국. 설렘이 아닌 피곤함으로</h2>
        <p>
          늦어지는 결정, 원하는 숙소는 미리 솔드아웃 <br />
          결국 누군가 나서서 정리해야 하는 상황
        </p>

        <img src={FatiguePerson} className="fatigue-person-image" />
      </section>

      {/* ==========================
          5. 배경 이미지 (솔루션)
      =========================== */}
      <section
        className="section-base solution-section"
        style={{ backgroundImage: `url(${SolutionBackground})` }}
      >
        <h2 className="solution-title">여행 준비, 설렘보다 피곤함이 앞선다면?</h2>
      </section>

      {/* ==========================
          6. 여행 준비 이렇게 편합니다
      =========================== */}
      <section className="section-base how-to-section">
        <h2>여행 준비, 이렇게 편할 수 있어요.</h2>

        <div className="how-to-content">
          <img src={HowToMapIcon} className="how-to-map-icon" />

          <p>
            찾고 싶은 여행지가 있으면 그냥 검색만 해보세요. <br />
            선택하는 순간 정확한 위치 정보가 지도에 표시돼요. <br />
            영업시간, 사진, 평점까지 필요한 건 한눈에 싹 들어와요!!
          </p>
        </div>
      </section>

      {/* ==========================
          7. 코스 추천
      =========================== */}
      <section className="section-base where-to-go-section">
        <h2>
          답 없는 장소가 많아지면,<br/>“어디부터 가야 하지” 고민하지 마세요!!
        </h2>

        <div className="how-to-content">
          <p>
            실제로 걸리거나 이동하는 시간을 기준으로 가장 <br />
            효율적인 순서로 코스를 깔끔하게 정리해 드려요. <br />
            이동은 줄이고, 여행의 여유는 채워주는 방식으로요.
          </p>

          <img src={RoadMapInfographic} className="roadmap-infographic" />
        </div>
      </section>

      {/* ==========================
          8. Footer
      =========================== */}
      <footer className="footer">
        <p>Copyright 2023 RoutePick All rights reserved.</p>
      </footer>

    </div>
  );
}

export default IntroPage;
