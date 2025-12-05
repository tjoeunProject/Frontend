import React from 'react';
import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import Footer from '../../components/common/Footer.jsx';
import survey3 from './../../resources/img/survey3.png';
import survey4 from './../../resources/img/survey4.png';
import { Link } from 'react-router-dom';

function SurveyFourPage() {
    
    return (
        <div className="page-with-header">
            <Header />
            <section>
                <div className='k1'>
                    <div>
                        <h5>
                            마지막으로 이번 여행의 테마를 정해볼까요?
                        </h5>
                        <br/>    
                        <h4><b>여행의 @@@를</b> <br/>
                        선택해주세요.</h4>
                    </div>
                    <div>    
                        <img src={survey3} width={250} alt="Survey Image 3" />
                    </div>
                </div>
                <br/><br/>
                <div className="survey-center">
                    <img src={survey4} width={550} alt="Survey Image 4" />
                </div>
                <br/><br/><br/><br/>
                <div className='survey-grid2'>
                    <Link to="/survey/SurveyThreePage" className="back-button">
                        이전으로
                    </Link>
                    <Link to="/" className="next-button2">
                        완료하기
                    </Link>
                </div>               
            </section>
            <Footer />
        </div>
    )
}

export default SurveyFourPage;