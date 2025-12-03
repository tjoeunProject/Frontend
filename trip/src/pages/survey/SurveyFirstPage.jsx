import React from 'react';
import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import './SurveyTwoPage';
import {Link} from 'react-router-dom';

function SurveyFirstPage() {

    return (
        <div className="page-with-header">
        <Header/>
            <h1>
            설문조사 1페이지 들어갈 예정입니다.
        </h1>
        <Link to = '..'>뒤로가기 버튼 들어갈 예정입니다.</Link> &emsp;
        <Link to = '/survey/SurveyTwoPage'>다음 단계 버튼 들어갈 예정입니다.</Link>
        
        </div>

        
    )
}

export default SurveyFirstPage;