import React, { useState } from 'react';
import Header from '../../components/common/Header';
import { Link, useNavigate } from 'react-router-dom';
import '../../resources/css/IntroPage.css';

// 이미지 리소스
import Modal from "react-modal";
import Dialog2 from "../../components/Dialog/Dialog";
import './Intro.css';
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer.jsx"

import '../survey/SurveyFirstPage';
import Backdrop from '../../components/Dialog/Backdrop';
import { Map } from '@vis.gl/react-google-maps';
import IntroCommponent from './IntroCommponent.jsx';


function IntroPage() {

  // 검색 기능
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    navigate('/map', { state: { searchKeyword: keyword } });
  };

  return (
    <div>   
      <Header />
      <IntroCommponent />
      <Footer />
    </div>   
  );
}

export default IntroPage;