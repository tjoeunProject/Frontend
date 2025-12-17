// components/ItineraryListOptimized.jsx
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SearchResultItem from "./SearchResultItem";

const ItineraryListOptimized = ({
  itineraryByDay,
  setItineraryByDay,
  removeFromItinerary,
  DAY_COLORS,
  onSelectDay,
  onSelectPlace,
  isToggleOptimized,
  onDragEnd, // MapPage에서 전달받은 핸들러 사용
}) => {
  // 1) 방어 코드
  if (!itineraryByDay) return null;

  const dayKeys = Object.keys(itineraryByDay).sort((a, b) => {
    // day1, day2 숫자 순서 정렬
    const numA = parseInt(a.replace('day', ''), 10);
    const numB = parseInt(b.replace('day', ''), 10);
    return numA - numB;
  });

  // 2) 랜더링
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* type="DAY"를 추가하여 Day끼리 드래그 가능하게 설정 */}
      <Droppable droppableId="all-days" type="DAY">
        {(provided) => (
          <div
            className="itinerary-wrapper"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {dayKeys.map((dayKey, dayIndex) => {
              const dayPlaces = itineraryByDay[dayKey] || [];

              return (
                // Day 자체를 Draggable로 감싸기
                <Draggable
                  key={dayKey}
                  draggableId={dayKey}
                  index={dayIndex}
                >
                  {(dayProvided, daySnapshot) => (
                    <div
                      className="day-box"
                      ref={dayProvided.innerRef}
                      {...dayProvided.draggableProps}
                      style={{
                        ...dayProvided.draggableProps.style,
                        // 드래그 중일 때 약간의 스타일 변화 (선택사항)
                        opacity: daySnapshot.isDragging ? 0.9 : 1,
                        marginBottom: '20px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #eee'
                      }}
                    >
                      {/* Day 헤더 (여기를 잡고 드래그해야 함 -> dragHandleProps) */}
                      <div
                        className="day-header"
                        {...dayProvided.dragHandleProps}
                        onClick={() => onSelectDay && onSelectDay(dayKey)}
                        style={{
                          cursor: 'grab', // 손바닥 모양 커서
                          padding: '12px',
                          borderBottom: '1px solid #eee',
                          background: '#fafafa',
                          borderRadius: '8px 8px 0 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <h3 className="day-title" style={{ margin: 0, fontSize: '18px' }}>
                           Day {dayIndex + 1}
                        </h3>
                        <span style={{ fontSize: '12px', color: '#999' }}>↕</span>
                      </div>

                      {/* 내부: 장소 리스트 (Droppable type="PLACE") */}
                      {/* 기존 droppableId={dayKey} 유지 */}
                      <Droppable droppableId={dayKey} type="PLACE">
                        {(listProvided) => (
                          <div
                            ref={listProvided.innerRef}
                            {...listProvided.droppableProps}
                            style={{ padding: '10px', minHeight: '50px' }}
                          >
                            {dayPlaces.length === 0 && (
                               <div style={{textAlign:'center', color:'#ccc', fontSize:'13px', padding:'10px'}}>
                                 장소를 추가해주세요
                               </div>
                            )}

                            {dayPlaces.map((place, index) => (
                              <Draggable
                                key={place.id}
                                draggableId={String(place.id)}
                                index={index}
                              >
                                {(placeProvided, placeSnapshot) => (
                                  <div
                                    className={`place-item ${
                                      placeSnapshot.isDragging ? "dragging" : ""
                                    }`}
                                    ref={placeProvided.innerRef}
                                    {...placeProvided.draggableProps}
                                    {...placeProvided.dragHandleProps}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectPlace(place, dayKey, index);
                                    }}
                                    style={{
                                      ...placeProvided.draggableProps.style,
                                      marginBottom: '8px'
                                    }}
                                  >
                                    <SearchResultItem
                                      place={place}
                                      index={index + 1}
                                      onDelete={removeFromItinerary}
                                      isToggleOptimized={isToggleOptimized}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {listProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ItineraryListOptimized;