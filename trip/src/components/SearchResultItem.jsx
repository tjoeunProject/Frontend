import React from 'react';
import './SearchResultItem.css';

const SearchResultItem = ({ place, onAdd ,
  // 12/10 추가
  onDelete,    // 일정 모드일 때 사용 (삭제 함수)
  index,       // 일정 모드일 때 사용 (순서 번호)
  indexColor   // 일정 모드일 때 순서 번호 색상 (Day별 색상 등)


  
}) => {
  // 12/11 추가 - photos 가 있으면 photo 활용 없으면 url 조회 후 url 있으면 사용하고 없으면 default 이미지로 설정
  const photoUrl =
    place.photos && place.photos.length > 0
      ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 300 })
        : place.url && place.url.length > 0 ? place.url :  '/noimage.png';

  return (
    <li className="result-card">

      {/* 🔥 1. 순서 번호 (index가 있을 때만 표시) */}
      {/* 12/10 추가  */}
      {index !== undefined && (
        <div style={{ 
          fontWeight: "bold", 
          fontSize: "1.2rem", 
          marginRight: "10px", 
          color: indexColor || "#1976d2" 
        }}>
          {index}
        </div>
      )}

      <img className="result-thumb" src={photoUrl} alt={place.name} />

      <div className="result-info">
        <div className="result-title">{place.name}</div>
        <div className="result-sub">
        {place.address || place.formatted_address || place.vicinity || '주소 정보 없음'}
        </div>
        <div className="result-rating">
          ⭐ {place.rating || '-'} <span>({place.reviews || 0})</span>
        </div>
      </div>

      {/* 🔥 2. 버튼 분기 처리 (onDelete가 있으면 삭제버튼, 아니면 추가버튼) */}
      {/* 12/10 추가 */}
      {onDelete ? (
        <button 
          className="result-add-btn" 
          style={{ backgroundColor: '#ffebee', color: '#c62828' }} // 삭제 버튼 스타일 오버라이딩
          onClick={() => onDelete(place.id)}
        >
          ❌
        </button>
      ) : (
        <button className="result-add-btn" onClick={() => onAdd(place)}>
          추가
        </button>
      )}
    </li>
  );
};

export default SearchResultItem;
