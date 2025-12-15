import React from "react";
import "./FoodSidebar.css";

const FoodSidebar = ({
  basePlace,
  restaurants,
  radius,
  onClose,
  onRadiusChange,
  onAddRestaurant,
}) => {
  if (!basePlace) return null;

  return (
    <div className="food-sidebar">
      {/* 헤더 */}
      <div className="food-sidebar-header">
        <div>
          <h5>🍽️ 근처 음식점</h5>
          <p className="food-base-place">
            기준: <strong>{basePlace.name}</strong>
          </p>
        </div>

        <button className="food-close-btn" onClick={onClose}>
          ✖
        </button>
      </div>

      {/* 반경 */}
      <div className="food-radius-box">
        <label>
          검색 반경: <strong>{radius}m</strong>
        </label>
        <input
          type="range"
          min={300}
          max={2000}
          step={100}
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
        />
      </div>

      {/* 리스트 */}
      <div className="food-list">
        {restaurants.length === 0 ? (
          <p className="food-empty">근처에 음식점이 없습니다.</p>
        ) : (
          restaurants.map((r) => (
            <div key={r.id} className="food-item">
              {/* 🔥 이미지 */}
              {r.photoUrl ? (
                <img
                  src={r.photoUrl}
                  alt={r.name}
                  className="food-item-image"
                  loading="lazy"
                />
              ) : (
                <div className="food-item-image food-image-empty">
                  이미지 없음
                </div>
              )}

              {/* 이름 + 추가 */}
              <div className="food-item-top">
                <div className="food-item-title">{r.name}</div>
                <button
                  className="food-add-icon"
                  onClick={() => onAddRestaurant(r)}
                  title="일정에 추가"
                >
                  +
                </button>
              </div>

              <div className="food-item-sub">
                ⭐ {r.rating || "-"} · 리뷰 {r.reviews || 0}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodSidebar;
