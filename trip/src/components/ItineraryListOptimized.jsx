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
}) => {
  // 1) 방어 코드
  if (!itineraryByDay) return null;

  const dayKeys = Object.keys(itineraryByDay).sort();

  // 2) Drag & Drop 로직
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDay = source.droppableId;
    const destDay = destination.droppableId;

    const newState = { ...itineraryByDay };
    newState[sourceDay] = [...(newState[sourceDay] || [])];
    newState[destDay] = [...(newState[destDay] || [])];

    const [moved] = newState[sourceDay].splice(source.index, 1);
    newState[destDay].splice(destination.index, 0, moved);

    setItineraryByDay(newState);
  };

  // 3) 랜더링 
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="itinerary-wrapper">
        {dayKeys.map((dayKey, dayIndex) => {
          const dayPlaces = itineraryByDay[dayKey] || [];

          return (
            <Droppable droppableId={dayKey} key={dayKey}>
              {(provided) => (
                <div
                  className="day-box"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  onClick={() => onSelectDay(dayKey)}  // Day 기준 검색
                >
                  {/* Day 헤더 (디자인 수정 영역) */}
                  <div className="day-header">
                    <h3 className="day-title">Day {dayIndex + 1}</h3>
                  </div>

                  {dayPlaces.map((place, index) => (
                    <Draggable
                      key={place.id}
                      draggableId={String(place.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`place-item ${
                            snapshot.isDragging ? "dragging" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={(e) => {
                            e.stopPropagation();   // Day 클릭 차단
                            onSelectPlace(place, dayKey, index);  // place 기준 검색
                          }}
                        >
                          <SearchResultItem
                            place={place}
                            index={index + 1}
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
