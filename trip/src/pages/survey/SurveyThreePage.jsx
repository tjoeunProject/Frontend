import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import Footer from '../../components/common/Footer.jsx'
import survey2 from './../../resources/img/survey2.png';
import { Link } from 'react-router-dom';
import OwnCalendar from './OwnCalendar.jsx';
import useSurveyGuard from './useSurveyGuard.jsx';
import { useState } from 'react';

function SurveyThreePage() {

    // ... 이 컴포넌트에서 날짜 상태를 관리할 수도 있습니다. ...

    useSurveyGuard('survey_step_1_completed', '/survey/SurveyFirstPage');

    // [추가] 캘린더 데이터를 담을 State
    const [scheduleData, setScheduleData] = useState(null);

    // [추가] OwnCalendar에서 데이터를 받아오는 콜백 함수
    const handleDateSelect = (data) => {
        console.log("캘린더 선택 데이터:", data); // 확인용 로그
        setScheduleData(data);
    };

    // 유효성 검사 및 저장 로직
    const handleNextClick = (e) => {
        if (!scheduleData) {
            e.preventDefault(); // 페이지 이동 막기
            alert("여행 기간을 선택해주세요!");
            return;
        }

        // 데이터 저장
        localStorage.setItem('survey_schedule', JSON.stringify(scheduleData));
        localStorage.setItem('survey_step_1_completed', 'true');
    };

    return (
        <div className="page-with-header">
            <Header />
            <section className='k2'>
                <div className='k3'>
                    <div>
                        <h3>
                            이번 여행, 언제 떠나볼까요?
                        </h3>
                        <br />
                        <h4><b>여행 기간을</b> <br />
                            선택해주세요.</h4>
                    </div>
                    <div>
                        <img src={survey2} width={250} alt="설문조사 이미지" />
                    </div>
                </div>

                <OwnCalendar onDateSelectComplete={handleDateSelect} />

                <div className='survey-grid3'>
                    <Link to="/survey/SurveyTwoPage" className="back-button"
                        onClick={handleNextClick}>
                        뒤로가기
                    </Link>
                    <Link to="/survey/SurveyFourPage" className="next-button2"
                        onClick={handleNextClick}>
                        다음으로
                    </Link>
                </div>

            </section>
            <Footer />
        </div>
    )
}

export default SurveyThreePage;