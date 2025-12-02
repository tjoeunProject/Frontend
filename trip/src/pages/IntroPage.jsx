import React from 'react';
import Header from '../components/common/Header';
import { BrowserRouter, Route, Routes, Link} from 'react-router-dom';
 
// 제공된 8개의 이미지 파일을 각각 import 
import MapImage from '../assets/map.png';                  
import PhoneTapImage from '../assets/Intro1.png';        
import HotelRoomsPreview from '../assets/Intro2.png'; 
import FatiguePerson from '../assets/Intro3.png';   
import SolutionBackground from '../assets/Intro4.png'; 
import HowToMapIcon from '../assets/Intro5.png';    
import RoadMapInfographic from '../assets/Intro6.png'; 
import LoginV2Users from '../assets/Intro7.png';   
import './survey/SurveyFirstPage';

function IntroPage() {
  //  App.css를 사용하므로, 복잡한 absolute position을 위한 스타일만 인라인으로 남깁니다.

  // 지도 섹션의 마커 및 컬러 블록 스타일 (최종 디자인 화면을 기준으로 조정)
  const mapMarkerStyle = {
    position: 'absolute',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'red',
    border: '2px solid white',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  };


  const mapMarker2Style = {
    ...mapMarkerStyle,
    top: '75%', // Image 1의 하단 마커 위치
    left: '70%', // Image 1의 하단 마커 위치
  };

  const colorBlockStyle = {
      position: 'absolute',
      right: '0px',
      width: '40px',
      height: '40px',
      borderRadius: '4px',
      transform: 'translateY(-50%)',
      zIndex: 2,
  };


  return (
    <div className="page-container">
      
      {/* 1. 상단 메뉴 (Header) */}
      <Header />

      {/* 2. 지도 섹션: 메인 비주얼 (Image 1: map.png) */}
      <section className="section-base map-section">
        <div className="map-placeholder" style={{ backgroundImage: `url(${MapImage})` }}>
          {/* 지도 마커 (Image 1의 마커 배치) */}
          <div style={{ ...mapMarkerStyle, top: '20%', left: '20%' }}></div>
          <div style={mapMarker2Style}></div>

          {/* 우측 컬러 블록 (최종 디자인에 따라 배치) */}
          <div style={{ ...colorBlockStyle, backgroundColor: '#FF0000', top: '20%' }}></div>
          <div style={{ ...colorBlockStyle, backgroundColor: '#FFFF00', top: '40%' }}></div>
          <div style={{ ...colorBlockStyle, backgroundColor: '#0000FF', top: '60%' }}></div>
          <div style={{ ...colorBlockStyle, backgroundColor: '#FF00FF', top: '80%' }}></div>
        </div>
      </section>

      <section className="search-cta-section">
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="가시고 싶으신 여행지 혹은 맛집 있으세요??" 
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <Link to="/survey/SurveyFirstPage" className="cta-button">
          AI 콕콕 플래너 - 코스 만들기 !!!
        </Link>
        <a href="#" className="info-link">AI 콕콕 플래너란??</a>
        <a href='/map'>지도 갈 버튼</a>
      </section>



      {/* 3. "여행 준비 할 때, 이런 경험 없으셨나요?" 섹션) */}
      <section className="section-base experience-section">
        <h2 className="section-title">여행 준비 할 때, 이런 경험 없으셨나요?</h2>

        <div className="experience-grid">
          {/* A. 끝이 안 보이는 스크롤 (텍스트) */}
          <div className="experience-card">
            <h3>끝이 안 보이는 스크롤</h3>
            <p className="experience-description">
              단톡방에 쏟아지는 숙소 링크 <br />
              "여긴 어때?" "이건 뷰 좋대"
            </p>
          </div>

          {/* B. 핸드폰 탭 이미지 (Image 2) */}
          <div className="phone-tap-image-container">
            <img src={PhoneTapImage} alt="핸드폰 스크롤 이미지" className="phone-tap-image" />
          </div>

          {/* C. 호텔 사이트 무한 접속 (텍스트 및 Image 3) */}
          <div className="hotel-section">
            <img src={HotelRoomsPreview} alt="호텔 썸네일" className="hotel-thumbnails-image" />
            <h3>호텔사이트 무한 접속</h3>
            <p className="experience-description">
              창을 열었다 닫았다 반복하며 가격·평점 확인 <br />
              비교하다 보면 어느새 머릿속은 뒤죽박죽
            </p>
          </div>
        </div>
      </section>

      {/* 4. "결국. 설렘이 아닌 피곤함으로" 섹션 (Image 4: fatigue-person.png) */}
      <section className="section-base fatigue-section">
        <h2 className="section-title">결국. 설렘이 아닌 <br /> 피곤함으로</h2>
        <p className="fatigue-description">
          늦어지는 결정, 원하는 숙소는 미리 솔드아웃 <br />
          결국 누군가 나서서 정리해야 하는 상황
        </p>
        <img src={FatiguePerson} alt="피곤한 여성" className="fatigue-person-image" />
      </section>

      {/* 5. "여행 준비, 설렘보다 피곤함이 앞선다면?" 섹션 (Image 5: solution-bg.png) */}
      <section className="section-base solution-section" style={{ backgroundImage: `url(${SolutionBackground})` }}>
        <h2 className="solution-title">여행 준비, 설렘보다 피곤함이 앞선다면?</h2>
        
        <div className="solution-grid">
          <div className="solution-item solution-item-remote">호텔 사이트 무한 탐색</div>
          <div className="solution-item solution-item-remote">한 사람에게 몰리는 정리 부담</div>
          <div className="solution-item solution-item-remote">이미 솔드아웃된 숙소</div>
          <div className="solution-item solution-item-remote solution-item-wide">단톡방에 쏟아지는 숙소 링크</div>
          <div className="solution-item solution-item-remote">늦어지는 결정</div>
        </div>
        <div className="solution-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
        </div>
      </section>

      {/* 6. "이제 귀찮음은 ____ 이 대신할게요!" 섹션 */}
      <section className="section-base call-to-action-section">
        <h2 className="call-to-action-title">이제 귀찮음은 ____ 이 대신할게요!</h2>
        <p className="call-to-action-description">여러분은 즐겁게 하세요.</p>
      </section>
      
      {/* 7. "여행 준비, 이렇게 편할 수 있어요." 섹션 (Image 6: how-to-map-icon.png) */}
      <section className="section-base how-to-section">
        <h2 className="section-title">여행 준비, 이렇게 편할 수 있어요.</h2>
        <div className="how-to-content">
            <img src={HowToMapIcon} alt="지도 아이콘" className="how-to-map-icon" />
            <div className="how-to-text">
                <p>
                  찾고 싶은 여행지가 있으면 그냥 검색만 해보세요. <br />
                  선택하는 순간, 정확한 위치 정보가 지도에 표시돼요. <br />
                  영업시간, 사진, 평점까지 필요한 건 한눈에 싹 들어와요!!
                </p>
            </div>
        </div>
      </section>

      {/* 8. "답없는 장소가 많아지면, "어디부터 가야 하지" 고민하지 마세요!!" 섹션 (Image 7: roadmap-infographic.png) */}
      <section className="section-base where-to-go-section">
        <h2 className="section-title">답 없는 장소가 많아지면,<br/>"어디부터 가야 하지" 고민하지 마세요!!</h2>
        <div className="where-to-go-grid">
            <div className="text-left">
                <p>
                  실제로 걸리거나 이동하는 시간을 기준으로 가장 <br />
                  효율적인 순서로 코스를 깔끔하게 정리해 드려요. <br />
                  이동은 줄이고, 여행의 여유는 채워주는 방식으로요.
                </p>
            </div>
            <img src={RoadMapInfographic} alt="로드맵 인포그래픽" className="roadmap-infographic" />
        </div>
      </section>

      
      {/* 11. 푸터 */}
      <footer className="footer">
        <p>Copyright 2023. Lorem and Ipsum All rights reserved.</p>
      </footer>      
    </div>
  );
}

export default IntroPage;