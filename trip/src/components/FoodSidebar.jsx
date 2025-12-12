// components/FoodSidebar.jsx
import React from "react";
import "./FoodSidebar.css";

const FoodSidebar = ({
  basePlace,
  restaurants,
  radius,
  onClose,
  onRadiusChange,
  onSelectRestaurant, // (다음 단계 대비)
}) => {
  if (!basePlace) return null;

  return (
    <div className="food-sidebar">
      {/* 헤더 */}
      <div className="food-sidebar-header">
        <div>
          <h3>🍜 근처 음식점</h3>
          <p className="food-base-place">
            기준: <strong>{basePlace.name}</strong>
          </p>
        </div>

        <button className="food-close-btn" onClick={onClose}>
          ✖
        </button>
      </div>

      {/* 반경 조절 */}
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
            <div
              key={r.id}
              className="food-item"
              onClick={() => onSelectRestaurant?.(r)}
            >
              <div className="food-item-title">{r.name}</div>
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
