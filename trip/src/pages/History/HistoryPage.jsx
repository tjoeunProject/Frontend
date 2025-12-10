// src/pages/History/History.jsx
import React from "react";
import HistoryComponent from "./HistoryComponent";
import '../../resources/css/HistoryPage.css';
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx"

const History = () => {
  return (
    <div className="history-page">
      <Header />
      <div className="history-title">
        “언제든 다시 꺼내보는 나의 여행 히스토리”
      </div>

      <HistoryComponent />

      <Footer />   
    </div>
  );
};

export default History;
