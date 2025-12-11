import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SearchResultItem from "./SearchResultItem"; // 🔥 import

const ItineraryListOptimized = ({
  itineraryByDay,
  setItineraryByDay,
  removeFromItinerary,
  DAY_COLORS
}) => {

  // 12/11 수정 
 /** ---------------------------------------------------------
   * 🔥 1) [수정] 동적 방어 코드
   * 데이터가 아예 없을 때를 대비해 빈 객체({}) 처리만 해줍니다.
   * --------------------------------------------------------- */
  if (!itineraryByDay) return null; // 데이터 로딩 전이면 아무것도 안 그림

  // 키 목록을 동적으로 가져옵니다 (예: ["day1", "day2", "day3", "day4"])
  // 혹시 순서가 뒤죽박죽일 수 있으니 sort()로 정렬해줍니다.
  const dayKeys = Object.keys(itineraryByDay).sort();

 /** ---------------------------------------------------------
   * 🔥 2) onDragEnd 로직 (동적 처리)
   * --------------------------------------------------------- */
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDay = source.droppableId; 
    const destDay = destination.droppableId; 

    // [중요] 기존 state를 깊은 복사 (하드코딩된 키 없이 전체 복사)
    const newState = { ...itineraryByDay };
    
    // 배열 복사 (불변성 유지)
    newState[sourceDay] = [...(newState[sourceDay] || [])];
    newState[destDay] = [...(newState[destDay] || [])];

    // 1) 같은 날짜 안에서 이동
    if (sourceDay === destDay) {
      const [moved] = newState[sourceDay].splice(source.index, 1);
      newState[sourceDay].splice(destination.index, 0, moved);
    } 
    // 2) 다른 날짜로 이동
    else {
      const [moved] = newState[sourceDay].splice(source.index, 1);
      newState[destDay].splice(destination.index, 0, moved);
    }

    setItineraryByDay(newState);
  };
  /** ---------------------------------------------------------
   *  🔥 3) 렌더링
   * --------------------------------------------------------- */

return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="itinerary-wrapper">

        {/* dayKeys 배열을 map으로 돌려서 3일이든 5일이든 다 그려줌 */}
        {dayKeys.map((dayKey, dayIndex) => {
          // 해당 Day의 장소 목록 가져오기 (없으면 빈 배열)
          const dayPlaces = itineraryByDay[dayKey] || [];
          
          // 색상이 모자랄 경우를 대비해 % 연산자 사용
          const color = DAY_COLORS[dayIndex % DAY_COLORS.length];

          return (
            <Droppable droppableId={dayKey} key={dayKey}>
              {(provided) => (
                <div
                  className="day-box"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    borderLeft: `6px solid ${color}`,
                  }}
                >
                  <h3>Day {dayIndex + 1}</h3>

                  {dayPlaces.map((place, index) => (
                    <Draggable
                      key={place.id}
                      draggableId={String(place.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`place-item ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <SearchResultItem 
                            place={place}
                            index={index + 1}
                            indexColor={color}
                            onDelete={removeFromItinerary}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}

      </div>
    </DragDropContext>
  );
};

export default ItineraryListOptimized;
