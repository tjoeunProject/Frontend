import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import Footer from '../../components/common/Footer.jsx'
import survey2 from './../../resources/img/survey2.png';
import {Link} from 'react-router-dom';
import OwnCalendar from './OwnCalendar.jsx'; 

function SurveyThreePage(){
    
    // ... 이 컴포넌트에서 날짜 상태를 관리할 수도 있습니다. ...

    return (
        <div className="page-with-header">
            <Header />
            <section>
                <div className='k1'>
                    <div>
                        <h3>
                            이번 여행, 언제 떠나볼까요?
                        </h3>
                        <br/>    
                        <h4><b>여행 기간을</b> <br/>
                        선택해주세요.</h4>
                    </div>
                    <div>   
                        <img src={survey2} width={250} alt="설문조사 이미지"/>
                    </div>
                </div>
                
                <OwnCalendar/> 
                
                <div className='survey-grid2'>
                    <Link to="/survey/SurveyTwoPage" className="back-button">
                        뒤로가기
                    </Link>
                    <Link to="/survey/SurveyFourPage" className="next-button2">
                        다음으로
                    </Link>
                </div>
                
            </section>
            <br/>
            <Footer />
        </div>
    )
}

export default SurveyThreePage;