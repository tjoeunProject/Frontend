import React, { useState, useRef, useEffect } from "react";
import "../../resources/css/HistoryPage.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import Modal from "react-modal";
import OwnCalendar from "./../survey/OwnCalendar";
import { Link, useNavigate } from "react-router-dom";
import useRouteLogic from "./../Route/useRouteLogic";
import RoutePick from "./../../../src/resources/img/RoutePick.png";

const HistoryComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const copyLinkRef = useRef(null);
  const [modalType, setModalType] = useState(null);

  


  const navigate = useNavigate();

  const {
    title, setTitle,
    startDate, setStartDate,
    endDate, setEndDate,
    schedule, addPlaceToDay,
    myRoutes, currentRoute,
    handleCreateRoute,
    handleGetMyRoutes,
    handleGetRouteDetail,
    handleDeleteRoute,
  } = useRouteLogic();

  const [detailId, setDetailId] = useState("");

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const mockRoute = {
    route_id: 999,
    name: "예시 여행 일정",
    place_id: 0,
  };

  const routesForView =
    myRoutes && myRoutes.length > 0
      ? myRoutes
      : [mockRoute];

  const cards = routesForView.map((item, idx) => ({
    id: idx + 1,
    title: item.title,
    placeId: item.place_id,
    routeId: item.routeId,
    detailId: item.route_id,
    date: item.startDate,
    starttime: item.startDate,
    endtime: item.endDate,
    temp: item.title,
    distance: item.place_name,
    region: item.mainPlaceName,
    tags: ["실내여행지", "바다"],
    liked: idx % 2 === 1,
    photoUrl: item.photoUrl
      ? `https://places.googleapis.com/v1/${item.photoUrl}/media?maxWidthPx=200&key=${API_KEY}`
      : RoutePick,
  }));

  
  useEffect(() => {
    console.log("📌 HistoryComponent mounted");
    handleGetMyRoutes();
  }, []);

const toggleLike = (id) => {
  setLikedIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};
// 기존에 작성하신 cards 변수 선언 바로 아래에 추가하세요
  const handleCopy = () => {
    if (copyLinkRef.current) {
      copyLinkRef.current.select();
      document.execCommand("copy");
      alert("링크가 복사되었습니다!");
    }
  };

  const [isDateSelected, setIsDateSelected] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleDateSelectComplete = (dateData) => {
    if (dateData) {
      setIsDateSelected(true);
      setSelectedSchedule(dateData);
    } else {
      setIsDateSelected(false);
      setSelectedSchedule(null);
    }
  };

  const handleMapCheck = (e) => {
    if (!isDateSelected) {
      e.preventDefault();
      alert("여행 기간을 먼저 선택해 주세요.");
      return;
    }

    navigate("/map", {
      state: {
        schedule: selectedSchedule,
      },
    });
  };

  console.log(myRoutes);

  return (
    <div className="history-wrapper">
      <div
        className="history-card2"
        onClick={() => {
          setModalType("create");
          setIsOpen(true);
        }}
      >
        <h1>➕</h1>
        <br />
        <br />
        <h4>새로운 여행 일정 만들기</h4>
      </div>

      {cards.map((item) => (
        <div key={item.id} className="history-card">
          <div className="history-img-box">
            <img src={item.photoUrl} alt="trip" />

            <FaTrash
              className="history-trash-icon"
              size={20}
              onClick={async (e) => {
                e.stopPropagation();
                if (window.confirm("정말 이 일정을 삭제하시겠습니까?")) {
                  await handleDeleteRoute(item.routeId);
                  await handleGetMyRoutes();
                }
              }}
            />
          </div>

          <div className="history-info">
            <div className="history-date-line">
              <span className="history-date-title">{item.title}</span>  
              <span 
    onClick={() => toggleLike(item.id)} 
    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
  >
    {item.liked ? (
  <FaHeart size={22} color="red" />
) : (
  <FaRegHeart size={22} color="#555" />
)}
  </span>           
            </div>  
            <div className="history-time-temp">
              <span>🕒 {item.starttime} ~ {item.endtime}</span>
              
            </div>
         
         

            {/* <div className="history-tags">
              {item.tags.map((t, index) => (
                <span key={index} className="tag">
                  태그 들어갈 예정
                </span>
              ))}
            </div> */}
            </div>

            <div className="history-btn-area">
              <button
                className="btn-detail"
                onClick={() => {
                  console.log("➡️ 상세보기 이동 detailId:", Number(item.routeId));
                  navigate(`/mapdetail/${Number(item.routeId)}`, {
                    state: { detailId: Number(item.routeId) },
                  });
                }}
              >
                자세히 보기
              </button>

              <button
                className="btn-share"
                onClick={() => {
                  setDetailId(String(item.routeId));
                  setModalType("share");
                  setIsOpen(true);
                }}
              >
                공유하기
              </button>
            </div>
          </div>
        
      ))}

      <Modal
        onRequestClose={() => setIsOpen(false)}
        isOpen={isOpen}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        {modalType === "share" && (
          <>
            <h2>👻 링크 만들기</h2>
            <br />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 0",
              }}
            >
              <input
                type="text"
                ref={copyLinkRef}
                value={`http://localhost:5173/mapdetail/${detailId}`}
                readOnly
                style={{
                  fontSize: "14px",
                  flexGrow: 1,
                  padding: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <button className="copy-btn" onClick={handleCopy}>
                복사하기
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button onClick={() => setIsOpen(false)}>닫기</button>
            </div>
          </>
        )}

        {modalType === "create" && (
          <>
            <h2>📝 새로운 일정 생성</h2>
            <br />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0px 10px",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              언제 떠나시나요?
            </div>

            <OwnCalendar onDateSelectComplete={handleDateSelectComplete} />

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button
                onClick={handleMapCheck}
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  background: isDateSelected ? "#ff8c00" : "#cccccc",
                  color: isDateSelected ? "#ffffff" : "#666666",
                  cursor: isDateSelected ? "pointer" : "not-allowed",
                  opacity: isDateSelected ? 1 : 0.6,
                  pointerEvents: isDateSelected ? "auto" : "none",
                }}
              >
                확인하기
              </button>

              &emsp;&emsp;&emsp;

              <button onClick={() => setIsOpen(false)}>취소하기</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default HistoryComponent;
