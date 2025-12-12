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
  /* ---------------------------------------------------------
   * 🔥 1) 방어 코드
   * --------------------------------------------------------- */
  if (!itineraryByDay) return null;

  const dayKeys = Object.keys(itineraryByDay).sort();

  /* ---------------------------------------------------------
   * 🔥 2) Drag & Drop 로직
   * --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
   * 🔥 3) 렌더링
   * --------------------------------------------------------- */
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="itinerary-wrapper">
        {dayKeys.map((dayKey, dayIndex) => {
          const dayPlaces = itineraryByDay[dayKey] || [];
          const color = DAY_COLORS[dayIndex % DAY_COLORS.length];

          return (
            <Droppable droppableId={dayKey} key={dayKey}>
              {(provided) => (
                <div
                  className="day-box"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  onClick={() => onSelectDay(dayKey)}   // ✅ Day 기준 검색
                  style={{
                    cursor: "pointer",
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
                          className={`place-item ${
                            snapshot.isDragging ? "dragging" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={(e) => {
                            e.stopPropagation();        // 🔥 Day 클릭 차단
                            onSelectPlace(place);       // 🔥 Place 기준 검색
                          }}
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
