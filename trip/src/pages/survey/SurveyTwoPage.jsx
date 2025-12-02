import React from 'react';
import Header from '../../components/common/Header';
import ReactDOM from "react-dom/client";
import './SurveyFirstPage.jsx';
import { DateRangePicker } from 'rsuite';
import { addDays } from 'date-fns';
import 'rsuite/dist/rsuite.min.css';

function SurveyTwoPage(){
  
    return (
        <div>
            <Header />
            <h1>
                설문조사 2번 들어갈 예쩡
            </h1>
            {/* // DateRangePicker 패키지 사용, 년 월 일 시간까지 추출 가능 */}
            <DateRangePicker showOneCalendar ranges={[]} format="MM/dd/yyyy HH:mm" />
            <a href = '..'>뒤로갈예정</a> &emsp;
            <a href = './SurveyThreePage'> 다음 페이지? </a>
        </div>
    )
}

export default SurveyTwoPage;