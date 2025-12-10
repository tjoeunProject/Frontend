import React, { useState, useRef } from "react";
import '../../resources/css/HistoryPage.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaCloud } from "react-icons/fa6";
import Modal from 'react-modal';
import OwnCalendar from './../survey/OwnCalendar';
import { Link } from 'react-router-dom';

// 일단 mockData로 넣어둠 추후에 변경하기
const mockData = Array.from({ length: 5 }).map((_, idx) => ({
  id: idx + 1,
  date: "2025. 03. 12",
  time: "약 5시간",
  temp: "-2°C",
  distance: "7km",
  region: "대구",
  tags: ["실내여행지", "바다"],
  liked: idx % 2 === 1, // 일부는 기본 좋아요 상태
  image:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
}));

const HistoryComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState(mockData);
  const copyLinkRef = useRef(null);
  const [modalType, setModalType] = useState(null);

  // ❤️ 좋아요 토글 기능
  const toggleLike = (id) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, liked: !card.liked } : card))
    );
  };

  const handleCopy = () => {
    if (copyLinkRef.current) {
      copyLinkRef.current.select(); // 텍스트 선택
      document.execCommand('copy'); // 클립보드에 복사
      // 사용자에게 복사 완료 메시지 표시 (예: alert 또는 상태 변경)
      alert("링크가 복사되었습니다!");
    }
  };

  const [isDateSelected, setIsDateSelected] = useState(false); 

    // 🚨 OwnCalendar에서 호출될 콜백 함수
    const handleDateSelectComplete = (isValid) => {
        setIsDateSelected(isValid);
    };

    // '확인하기' 링크 클릭 핸들러 (선택 사항: alert 제거 및 모달 닫기)
    const handleMapCheck = (e) => {
        // isDateSelected가 false인 경우 클릭을 막기 위해 이미 CSS로 막았지만,
        // 혹시 모를 상황을 대비해 추가적인 확인 로직을 둘 수 있습니다.
        if (!isDateSelected) {
            e.preventDefault(); // 기본 이동 방지
            alert("여행 기간을 먼저 선택해 주세요.");
            return;
        }
        // setIsOpen(false); // 모달 닫기 (고객님 코드에 있던 로직)
        
        // 유효하면 정상적으로 to="/map"으로 이동합니다.
    };

  return (
    <div className="history-wrapper">
      <div
        className="history-card2"
        onClick={() => {
          setModalType('create');
          setIsOpen(true);
        }}
      >
        <h1>➕</h1>
        <br />
        <br />
        <h4>새로운 여행 일정 만들기</h4>
      </div>

      {cards.map((item) => (
        <div key={item.id} className="history-card">
          {/* 이미지 영역 */}
          <div className="history-img-box">
            <img src={item.image} alt="trip" />

            <div className="history-like-icon" onClick={() => toggleLike(item.id)}>
              {item.liked ? <FaHeart size={22} color="red" /> : <FaRegHeart size={22} color="#555" />}
            </div>
          </div>

          {/* 내용 영역 */}
          <div className="history-info">
            <div className="history-date-line">
              <span className="history-date">{item.date}</span>
              <FaCloud size={18} />
            </div>

            <div className="history-time-temp">
              <span>🕒 {item.time}</span>
              <span>{item.temp}</span>
            </div>

            <div className="history-detail-line">
              <span>· 총 이동거리</span> | <span>{item.distance}</span>
            </div>

            <div className="history-detail-line">
              <span>· 여행지역</span> | <span>{item.region}</span>
            </div>

            <div className="history-detail-line highlight">
              <span>· 여행지 / 음식점 추천!!</span>
            </div>

            {/* 태그 */}
            <div className="history-tags">
              {item.tags.map((t, index) => (
                <span key={index} className="tag">
                  #{t}
                </span>
              ))}
            </div>

            {/* 버튼 */}
            <div className="history-btn-area">
              <button className="btn-detail">자세히 보기</button>

              <button
                className="btn-share"
                onClick={() => {
                  setModalType('share');
                  setIsOpen(true);
                }}
              >
                공유하기
              </button>

              <Modal
                onRequestClose={() => setIsOpen(false)}
                isOpen={isOpen}
                className="custom-modal"
                overlayClassName="custom-modal-overlay"
              >
                {/* 🎯 모달 내용 조건부 렌더링 시작 */}
                {modalType === 'share' && (
                  <>
                    <h2>👻 링크 만들기</h2>
                    <br />

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 0', // 링크 표시 영역에 적절한 패딩 부여
                      }}
                    >
                      {/* 1. 링크를 보여주는 입력란 (읽기 전용) */}
                      <input
                        type="text"
                        ref={copyLinkRef}
                        value={"http://RoutePick/boards/{}?code=?"}
                        readOnly // 사용자가 수정하지 못하도록 설정
                        style={{
                          fontSize: '14px',
                          flexGrow: 1, // 남은 공간을 채우도록 설정
                          padding: '8px',
                          border: '1px solid #ccc',
                        }}
                      />

                      {/* 2. 복사 버튼 */}
                      <button className="copy-btn" onClick={handleCopy} style={{ whiteSpace: 'nowrap' }}>
                        복사하기
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      <button onClick={() => setIsOpen(false)}>닫기</button>
                    </div>
                  </>
                )}

                {modalType === 'create' && (
                  <>
                    <h2>📝 새로운 일정 생성</h2>
                    <br />

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0px 10px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                      }}
                    >
                      언제 떠나시나요?
                    </div>

                    <OwnCalendar onDateSelectComplete={handleDateSelectComplete} />

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      <Link
                        to="/map"
                        onClick={handleMapCheck}
                        style={{
                          display: 'inline-block',
                          padding: '8px 14px',
                          borderRadius: '6px',
                          textDecoration: 'none',

                          // 1. 배경색 (활성화/비활성화)
                          background: isDateSelected ? '#ff8c00' : '#cccccc', // 주황색(활성) 또는 회색(비활성)
                          // 2. 글자색 (대비 강조)
                          color: isDateSelected ? '#ffffff' : '#666666', // 흰색(활성) 또는 어두운 회색(비활성)
                          // 3. 마우스 커서 (클릭 가능/불가 시각화)
                          cursor: isDateSelected ? 'pointer' : 'not-allowed',
                          // 4. 투명도 (선택 사항: 비활성 시 더 흐리게)
                          opacity: isDateSelected ? 1 : 0.6,
                          // 5. 클릭 이벤트 차단 (기능적 비활성화)
                          pointerEvents: isDateSelected ? 'auto' : 'none',
                        }}
                      >
                        확인하기
                      </Link>

                      &emsp;&emsp;&emsp;

                      <button onClick={() => setIsOpen(false)}>취소하기</button>
                    </div>
                  </>
                )}
              </Modal>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryComponent;
