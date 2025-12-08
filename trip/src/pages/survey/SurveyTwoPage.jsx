import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import './SurveyFirstPage.jsx';
import 'rsuite/dist/rsuite.min.css';
import Footer from '../../components/common/Footer.jsx'
import survey1 from './../../resources/img/survey1.png';
import { Link } from 'react-router-dom'; // Link 임포트 띄어쓰기 수정

function SurveyTwoPage() {
    
    return (
        <div className="page-with-header">
            <Header />
            <section>
                <div className='k1'>
                    <div>
                        <h3>
                            이번 여행, 어디로 떠나볼까요?
                        </h3>
                        <br/>
                        <h4>
                            <b>여행을 떠나고 싶은 지역을</b> <br/>
                            선택해주세요.
                        </h4>
                    </div>
                    <div>
                        <img src={survey1} width={250} />
                    </div>
                </div>
                <div className='survey-grid'>
                    <button className='survey-button'>서울</button>
                    <button className='survey-button'>부산</button>
                    <button className='survey-button'>대구</button>
                    <button className='survey-button'>인천</button>
                    <button className='survey-button'>광주</button>
                    <button className='survey-button'>대전</button>
                    <button className='survey-button'>울산</button>
                    <button className='survey-button'>충북</button>
                    <button className='survey-button'>충남</button>
                    <button className='survey-button'>전북</button>
                    <button className='survey-button'>전남</button>
                    <button className='survey-button'>경북</button>
                    <button className='survey-button'>경남</button>
                    <button className='survey-button'>제주</button>
                </div>

                <div className='survey-grid2'>
                    <Link to="/survey/SurveyFirstPage" className="back-button">
                        뒤로가기
                    </Link>
                    <Link to="/survey/SurveyThreePage" className="next-button2">
                        다음으로
                    </Link>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default SurveyTwoPage;