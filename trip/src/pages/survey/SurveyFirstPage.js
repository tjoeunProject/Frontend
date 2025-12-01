import React from 'react';
import Header from '../../components/common/Header';
import './SurveyTwoPage';

function SurveyFirstPage() {

    return (
        <div>
        <Header/>
        <h1>
            설문조사-1 들어갈 예정입니다.
        </h1>
        <a href = '..'>뒤로가기 버튼 들어갈 예정입니다.</a> &emsp;
        <a href = '/survey/SurveyTwoPage'>다음 단계 버튼 들어갈 예정입니다.</a>
        </div>
    )
}

export default SurveyFirstPage;