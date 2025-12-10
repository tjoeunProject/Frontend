import React, { useState } from 'react';
import {
  StyledCalendarWrapper,
  StyledCalendar,
  StyledDate,
  StyledDot,
} from "./CalendarStyle";
import moment from 'moment';

const OwnCalendar = () => {
  // 1. 상태를 기간 선택 [시작일, 종료일] 배열로 변경
  // 초기값은 현재 날짜 (today)를 포함한 배열로 설정하거나, [null, null]로 설정할 수 있습니다.
  const today = new Date();
  const [dateRange, setDateRange] = useState([today, today]); 
  
  // activeStartDate는 월(Month) 포커스를 위해 유지
  const [activeStartDate, setActiveStartDate] = useState(today);
  
  // 특정 날짜 예시는 그대로 유지
  const attendDay = ["2024-09-06", "2024-09-17"]; 
  const MAX_DAY = 4;
  // 2. onChange 핸들러를 기간 배열을 받도록 수정
  const handleDateChange = (newDateRange) => {
       
    // 만약 기간 선택이 완료되면 (배열 길이가 2이면)
    // 부모 컴포넌트에 기간을 전달하는 로직을 여기에 추가할 수 있습니다.
    if (newDateRange && newDateRange.length === 2 && newDateRange[1]) {
        console.log(moment(newDateRange[0]).format('YYYY-MM-DD'));
        console.log(moment(newDateRange[1]).format('YYYY-MM-DD'));
        
        const daysDifference = moment(newDateRange[1]).diff(moment(newDateRange[0]), 'days');
        console.log(daysDifference);
        if(daysDifference > MAX_DAY){
          alert("최대 5일까지만 선택이 가능해요");
          return;
        }
    }

    // newDateRange는 [Date, Date] 형태의 배열입니다.
    setDateRange(newDateRange);
  };

  return (
    <StyledCalendarWrapper>
      <StyledCalendar
        // 3. value 속성을 dateRange 상태로 연결
        value={dateRange} 
        // 4. onChange 속성을 새로운 handleDateChange 함수로 연결
        onChange={handleDateChange}
        
        // 5. 핵심: 기간 선택 모드 활성화 (react-calendar의 기능)
        selectRange={true} 
        
        // 포맷팅 및 기타 설정은 그대로 유지
        formatDay={(locale, date) => moment(date).format("D")}
        formatYear={(locale, date) => moment(date).format("YYYY")}
        formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
        formatShortWeekday={(locale, date) => moment(date).format("ddd")}
        calendarType="gregory"
        showNeighboringMonth={true}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        activeStartDate={activeStartDate === null ? undefined : activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
        
        // tileContent 로직은 그대로 유지 (특정 날짜에 점 표시)
        tileContent={({ date, view }) => {
          let html = [];
          if (view === "month") {
            if (attendDay.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
              html.push(<StyledDot key={moment(date).format("YYYY-MM-DD")} />);
            }
          }
          return <>{html}</>;
        }}
      />
      
    </StyledCalendarWrapper>
  );
};

export default OwnCalendar;