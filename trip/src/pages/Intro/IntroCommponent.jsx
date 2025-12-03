import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 이미지 리소스
import Modal from "react-modal";
import './Intro.css';
import '../../resources/css/IntroPage.css'

// 제공된 8개의 이미지 파일을 각각 import 
import MapImage from '../../resources/img/map.png';                  
import PhoneTapImage from '../../resources/img/Intro1.png';        
import HotelRoomsPreview from '../../resources/img/Intro2.png'; 
import FatiguePerson from '../../resources/img/Intro3.png';   
import SolutionBackground from '../../resources/img/Intro4.png'; 
import HowToMapIcon from '../../resources/img/Intro5.png';    
import RoadMapInfographic from '../../resources/img/Intro6.png'; 
import LoginV2Users from '../../resources/img/Intro7.png';   
import survey from '../../pages/survey/SurveyFirstPage';
import IntroPage from './IntroPage';
import { Center } from 'rsuite';

function IntroCommponent() {

  // 검색 기능
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!keyword.trim()) {
            alert("검색어를 입력해주세요!");
            return;
        }
        navigate('/map', { state: { searchKeyword: keyword } });
    };
  

  return (

    <div className="page-container">
            {/* AI 톡톡 플래너 설명 모달 */}
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                contentLabel="AI 톡톡 플래너 설명"
                // CSS 클래스로 대체
                className="custom-modal" 
                overlayClassName="custom-modal-overlay"
            >
                <h2>🤖 AI 톡톡 플래너란 ❓</h2><br></br>
                <h4>AI가 여행 고민 대신 해결하는 스마트 도우미</h4><br></br>
                <ul>
                    <li>AI가 여행 고민 대신 해결! 간단한 설문만으로 최적 동선 자동 생성</li><br></br>
                    <li>숙소·맛집·관광지 정보(사진, 평점, 영업시간) 한눈에 ❗❗</li><br></br>
                    <li>단톡방 혼란, 사이트 무한탐색 → 1분 맞춤 코스 완성</li><br></br>
                    <li>이제 설렘만 챙기고, 귀찮음은 AI에게 맡기세요! ✨</li><br></br>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button onClick={() => setIsOpen(false)}>닫기</button>
                </div>
            </Modal>
      <div>

      {/* 2. 지도 섹션 */}
        <section className="section-base map-section">
          <div
            className="map-placeholder"
            style={{ backgroundImage: `url(${MapImage})` }}
          >
      
          </div>
        </section>

      {/* ==========================
          2. 검색바 + 오렌지 CTA 버튼
      =========================== */}
     
      
        <section className="search-cta-section">
          
          {/* 🚨 오류 수정 1 & 2: 검색 기능을 <form>으로 감싸고 닫는 태그를 명확히 함 */}
          <form onSubmit={handleSearch} className="search-bar-container"> 
            <input 
              type="text" 
              placeholder="가시고 싶으신 여행지 혹은 맛집 있으세요??" 
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <span className="search-icon" onClick={handleSearch}>🔍</span>
          </form>
        
          <Link to="/survey/SurveyFirstPage" className="cta-button">
            AI 콕콕 플래너 - 코스 만들기 !!!
          </Link>

          {/* AI 콕콕 플래너란?? 링크 - 중복 제거 및 모달 트리거 유지 */}
          <a 
            href="#"
            className="info-link"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
          >
            AI 콕콕 플래너란??
          </a>


       </section>

      {/* ==========================
          3. 경험 섹션
      =========================== */}
      <section className="section-base experience-section">
        <h2>여행 준비 할 때, 이런 경험 없으셨나요?</h2>
<br/>
        <div className="experience-grid">
          
          {/* 왼쪽 */}
          <div className="experience-card">
            <h2>끝이 안 보이는 스크롤</h2>
            <p>
              단톡방에 쏟아지는 숙소 링크 <br />
              “여긴 어때?” “이건 뷰 좋대”
            </p>
          </div>

          <div className="experience-card">
            <img src={PhoneTapImage} className="phone-tap-image" />
          </div>

          {/* 오른쪽 */}
          
         <div className="experience-card">
            <img src={HotelRoomsPreview} className="hotel-thumbnails-image" />
           
         </div>
          
          <div className="experience-card">
                 <h2>호텔사이트 무한 접속</h2>
            
            <p>
              창을 열었다 닫았다 반복하며 가격·평점 확인 <br />
              비교하다 보면 어느새 머릿속은 뒤죽박죽
            </p>
          </div>
          

      {/* ==========================
          4. 피곤함 섹션
      =========================== */}
        <div className="experience-card">
        <h2>결국. 설렘이 아닌 피곤함으로</h2>
        
        
        <p>
          늦어지는 결정, 원하는 숙소는 미리 솔드아웃 <br />
          결국 누군가 나서서 정리해야 하는 상황
        </p>

    </div>
        <div className="experience-card">
        <img src={FatiguePerson} className="fatigue-person-image" />
      
      
         </div>
         </div>
          <br/>
        <h2>여행 준비, 설렘보다 피곤함이 앞선다면?</h2>
        
        <section
        className="section-base solution-section"
        style={{ backgroundImage: `url(${SolutionBackground})` }}
      > </section>
      <br/>
       
        <div className="experience-grid">
            <div className="experience-card">
          <img src={HowToMapIcon} className="how-to-map-icon" />
        </div>
        <div className="experience-card">
            <h3>여행 준비, 이렇게 편할 수 있어요.</h3><br/>
          <p>
            찾고 싶은 여행지가 있으면 그냥 검색만 해보세요. <br />
            선택하는 순간 정확한 위치 정보가 지도에 표시돼요. <br />
            영업시간, 사진, 평점까지 필요한 건 한눈에 싹 들어와요!!
          </p>
        </div>
        <div className="experience-card">
            <h3>
          답 없는 장소가 많아지면,<br/>“어디부터 가야 하지” 고민하지 마세요!!
        </h3>
<br/>
          <p>
            실제로 걸리거나 이동하는 시간을 기준으로 가장 <br />
            효율적인 순서로 코스를 깔끔하게 정리해 드려요. <br />
            이동은 줄이고, 여행의 여유는 채워주는 방식으로요.
          </p>
        </div>
        <div className="experience-card">
            <img src={RoadMapInfographic} className="roadmap-infographic" />
        </div>
        <div className="experience-card">
            <img src={LoginV2Users} className="how-to-map-icon"/>
        </div>
        <div className="experience-card">
            <h3>근처에 뭐 있지?</h3>
            <br/>
            <p>
                일정이나 순서 바꾸고 싶으면 그냥 
드래그만 하면 끝이에요.<br/>동선도 억지로 맞출 필요도 없고, 완전 “내” 여행답게 만드는 거죠!
            </p>
        </div>
        </div>
      </section>
      {/* ==========================
          5. 배경 이미지 (솔루션)
      =========================== */}


      {/* 6. "이제 귀찮음은 ____ 이 대신할게요!" 섹션 */}
      
      {/* 7. "여행 준비, 이렇게 편할 수 있어요." 섹션 (Image 6: how-to-map-icon.png) */}
     

      {/* ==========================
          7. 코스 추천
      =========================== */}
      
    </div>    
    </div>
  );
}

export default IntroCommponent;