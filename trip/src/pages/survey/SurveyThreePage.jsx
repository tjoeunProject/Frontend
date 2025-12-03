import React from 'react';
import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
function SurveyThreePage(){
   
    return (
        <div className="page-with-header">
            <Header />
            <h1>
                설문조사 파이널 번 들어갈 예쩡
            </h1>
            <a href = '..'>뒤로갈예정</a>
            <a href = '../map'> 완ㄹ뇨하기 </a>
        </div>
    );
}

export default SurveyThreePage;