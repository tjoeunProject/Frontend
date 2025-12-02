import React from 'react';
import Header from '../../components/common/Header';
import './SurveyFirstPage.jsx';

function SurveyTwoPage(){

const predefinedRanges = [
  {
    label: 'Today',
    value: [new Date(), new Date()],
    placement: 'left'
  },
  {
    label: 'Yesterday',
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: 'left'
  },
  {
    label: 'Last 7 Days',
    value: [addDays(new Date(), -7), new Date()],
    placement: 'left'
  }
];

const App = () => (
  <>
    <DateRangePicker showOneCalendar ranges={predefinedRanges} />
  </>
);

    return (
        <div>
            <Header />
            <h1>
                설문조사 2번 들어갈 예쩡
            </h1>
            <App />
            <a href = '..'>뒤로갈예정</a> &emsp;
            <a href = './SurveyThreePage'> 다음 페이지? </a>
        </div>
    )
}

export default SurveyTwoPage;