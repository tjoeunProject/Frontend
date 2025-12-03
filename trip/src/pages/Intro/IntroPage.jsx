import '../../resources/css/IntroPage.css';

// 이미지 리소스
import './Intro.css';
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx"
import IntroCommponent from './IntroCommponent.jsx';


function IntroPage() {

  return (
    <div>   
      <Header />
      <IntroCommponent />
      <Footer />
    </div>   
  );
}

export default IntroPage;