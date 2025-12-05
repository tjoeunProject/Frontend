import Header from '../../components/common/Header';
import "../../resources/css/SurveyPage.css";
import './SurveyTwoPage';
import {Link} from 'react-router-dom';
import survey from './../../resources/img/welcome.png';
import Footer from '../../components/common/Footer';

function SurveyFirstPage() {

    return (
        <div className="page-with-header">
        <Header/>
        <div className="survey-center">
        <img src={survey} width={400} />
            <h1>
            AI 콕콕 플래너에<br/> 오신것을 환영합니다.
            </h1>
            <br/><br/> 
            <h3>
                국내 여행을 계획 중이신가요?<br/>
                여행을 떠날 지역, 기간, 테마만 알려주시면<br/>
                자동으로 맞춤형 코스를 만들어 드립니다.
            </h3>

            <br/>
            <Link to="/survey/SurveyTwoPage" className="cta-button">
                START!
            </Link>
            <br/>       
            </div>  
            <Footer/>
        </div>       
    )
}

export default SurveyFirstPage;