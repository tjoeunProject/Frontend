import React from 'react';
import './SearchResultItem.css';

const SearchResultItem = ({ place, onAdd, onDelete, index, indexColor, isToggleOptimized }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 1. 이미지 URL 처리 (완전 안전한 버전)
let photoUrl = '/noimage.png';

// 1) itinerary에 저장된 photoUrl 우선 사용
if (place.photoUrl) {
  photoUrl = place.photoUrl;
}

if (place.photoReferences && place.photoReferences.length > 0) {
             photoUrl = `https://places.googleapis.com/v1/${place.photoReferences[0]}/media?maxWidthPx=400&key=${API_KEY}`;
          }
          
// 2) 검색 결과(place.photos)가 있을 때 getUrl() 사용
if (
  place.photos &&
  place.photos.length > 0 &&
  typeof place.photos[0].getUrl === "function"
) {
  try {
    photoUrl = place.photos[0].getUrl({
      maxWidth: 300,
      maxHeight: 300,
    });
  } catch {}
}

  // 2. 뱃지 스타일 (점심: 주황, 저녁: 보라, 기타: 회색)
  const getBadgeStyle = (type) => {
    if (type.includes('점심')) return { backgroundColor: '#ff9800', color: 'white' };
    if (type.includes('저녁')) return { backgroundColor: '#673ab7', color: 'white' };
    return { backgroundColor: '#9e9e9e', color: 'white' };
  };

  // 3. 일정 모드 여부 (onDelete가 있으면 일정 모드)
  const isItineraryMode = !!onDelete;

  let actionButton = null; 

    // isToggleOptimized가 false일 때만 (버튼이 필요할 때만) 할당합니다.
    if (!isToggleOptimized) { 
        console.log(`[SearchResultItem] isToggleOptimized: ${isToggleOptimized} (버튼 렌더링)`);

        // 1. onDelete 프롭스가 있으면 => 삭제 버튼 (일정 목록)
        if (onDelete) {
            actionButton = (
                <button 
                    className="result-add-btn" 
                    style={{ backgroundColor: '#ffebee', color: '#c62828' }} 
                    onClick={() => onDelete(place.id || place.place_id)}
                >
                    ❌
                </button>
            );
        } 
        
        // 2. onAdd 프롭스가 있으면 => 추가 버튼 (검색 목록)
        else if (onAdd) { 
        	 actionButton = (
                <button
                    className="result-add-btn"
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onAdd(place);
                    }}
                >
                    추가
                </button>
            );
        }
    } else {
        console.log(`[SearchResultItem] isToggleOptimized: ${isToggleOptimized} (버튼 숨김)`);
    }

  return (
    <li className="result-card">

      {/* 🔥 1. 순서 번호 (일정 모드일 때만 표시) */}
      {index !== undefined && (
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '1.2rem',
            marginRight: '10px',
            color: indexColor || '#1976d2',
          }}
        >
          {index}
        </div>
      )}

      {/* 썸네일 이미지 */}
      <img className="result-thumb" src={photoUrl} alt={place.name} />

      <div className="result-info">
        
        {/* 🔥 [수정] 제목 및 뱃지 영역 */}
        <div className="result-title" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          {place.name}
          
          {/* (1) 뱃지: 검색 모드이고, meal_type이 있을 때만 표시 */}
          {!isItineraryMode && place.meal_type && (
            <span style={{
              fontSize: '0.7rem', 
              padding: '2px 6px', 
              borderRadius: '4px',
              ...getBadgeStyle(place.meal_type)
            }}>
              {place.meal_type}
            </span>
          )}
        </div>

        {/* 🔥 [추가] 카테고리: 검색 모드이고, category가 있을 때만 표시 */}
        {!isItineraryMode && place.category && (
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>
            {place.category}
          </div>
        )}

        {/* 주소 (항상 표시) */}
        <div className="result-sub">
          {place.formatted_address || place.address || place.vicinity || '주소 정보 없음'}
        </div>

        {/* 🔥 [수정] 영업 시간: 검색 모드일 때만 표시 */}
        {!isItineraryMode && place.opening_hours && place.opening_hours.length > 0 && (
          <div style={{ fontSize: '0.8rem', color: '#2e7d32', marginTop: '2px' }}>
            🕒 {place.opening_hours[0]}
          </div>
        )}

        {/* 평점 및 리뷰 (항상 표시) */}
        <div className="result-rating">
          ⭐ {place.rating || '-'} <span>({place.reviews || 0})</span>
        </div>

        {/* 🔥 [수정] 연락처/웹사이트: 검색 모드일 때만 표시 */}
        {!isItineraryMode && (
          <div style={{ marginTop: '4px', display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
            {place.formatted_phone_number && (
              <span style={{ color: '#555' }}>📞 {place.formatted_phone_number}</span>
            )}
            {place.website && (
              <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                🌐 웹사이트
              </a>
            )}
          </div>
        )}
      </div>
      
      {actionButton}
      </li>

  );
};

export default SearchResultItem;