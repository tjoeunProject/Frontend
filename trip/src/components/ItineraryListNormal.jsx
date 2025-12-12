// ItineraryListNormal.jsx
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SearchResultItem from "./SearchResultItem"; // 🔥 컴포넌트 import 12.10 추가

const ItineraryListNormal = ({ list, handleOnDragEnd, removeFromItinerary, onSelectPlace }) => {
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="normal-list">
        {(provided) => (
          <div
            className="normal-list-box"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.map((place, index) => (
              <Draggable key={place.id} draggableId={String(place.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={`place-item ${snapshot.isDragging ? "dragging" : ""}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    
                    {/* 🔥 복잡한 HTML 대신 이거 하나면 끝! */}
                    {/* 12/10 추가 */}
                    <SearchResultItem 
                      place={place} 
                      index={index + 1}          // 순서 전달
                      onDelete={removeFromItinerary} // 삭제 함수 전달 (이게 있으면 삭제버튼 뜸)
                      onClick={() => onSelectPlace(place)}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ItineraryListNormal;
