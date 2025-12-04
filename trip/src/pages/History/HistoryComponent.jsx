// src/pages/History/HistoryComponent.jsx
import React, { useState } from "react";
import '../../resources/css/HistoryPage.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaCloud } from "react-icons/fa6";

// 일단 mockData로 넣어둠 추후에 변경하기
const mockData = Array.from({ length: 6 }).map((_, idx) => ({
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
  const [cards, setCards] = useState(mockData);

  // ❤️ 좋아요 토글 기능
  const toggleLike = (id) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, liked: !card.liked } : card
      )
    );
  };

  return (
    <div className="history-wrapper">
      {cards.map((item) => (
        <div key={item.id} className="history-card">
          
          {/* 이미지 영역 */}
          <div className="history-img-box">
            <img src={item.image} alt="trip" />

            <div
              className="history-like-icon"
              onClick={() => toggleLike(item.id)}
            >
              {item.liked ? (
                <FaHeart size={22} color="red" />
              ) : (
                <FaRegHeart size={22} color="#555" />
              )}
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
              <button className="btn-share">공유하기</button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryComponent;
