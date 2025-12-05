import Calendar from "react-calendar";
import styled from "styled-components";
import "react-calendar/dist/Calendar.css";


export const StyledCalendarWrapper = styled.div`
  width: 445px;
  height: 426px;
  display: flex;
  justify-content: center;
  position: relative;
  margin: auto;
  margin-top: 20px;
  .react-calendar {
    width: 445px;
    border: 1px solid #C4C4C4;
    border-radius: 0.5rem;
    padding: 3% 5%;
    background-color: white;
  }

  /* 전체 클릭 비활성화 */
  .react-calendar__tile {
    position: relative;
    background-color: transparent !important;
  }

  /* 호버 이벤트 제거 */
  .react-calendar__tile:hover {
    background-color: inherit;
    cursor: default; /* 마우스 커서도 기본으로 변경 */
  }

  .react-calendar__month-view__days__day--neighboringMonth{
  abbr {
    color: #BDBDBD !important; /* 연한 회색 */
  }
}
  .react-calendar__navigation {
    border-bottom: 1px solid #DFDFDF;
  }

  /* 2024.09 텍스트 색상 설정 */
  .react-calendar__navigation__label__labelText {
    color: #3F3F3F;
  }

  /* 좌우 네비게이션 버튼 색상 설정 (<, >) */
  .react-calendar__navigation__arrow {
  background-color: transparent;
    color: #7C97FE;
  }

  /* 버튼 폰트 설정 */
  .react-calendar__navigation button {
    font-weight: 600;
    font-size: 1rem;
  }

  /* 네비게이션 버튼 호버 이벤트 제거 */
  .react-calendar__navigation button:hover {
    background-color: transparent; /* 기본 배경 제거 */
    color: #7C97FE; /* 호버 시 텍스트 색상 설정 (기본 색상 유지) */
  }

  /* 네비게이션 텍스트 호버 이벤트 제거 */
  .react-calendar__navigation__label__labelText:hover {
    color: #3F3F3F; /* 호버 시 색상 유지 */
  }

  /* 네비게이션 텍스트 클릭 비활성화 */
  .react-calendar__navigation__label {
    pointer-events: none; /* 클릭 이벤트 비활성화 */
  }

  /* 네비게이션 버튼 클릭 시 배경색 변경 방지 */
  .react-calendar__navigation button:active {
    background-color: transparent; /* 배경색 투명으로 설정 */
  }

  /* 네비게이션 버튼 포커스 상태 스타일 */
  .react-calendar__navigation button:focus {
    background-color: transparent; /* 배경색 투명으로 설정 */
    outline: none; /* 기본 테두리 제거 */
  }

  /* 년/월 상단 네비게이션 칸 크기 줄이기 */
  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  /* 요일 밑줄 제거 */
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 700;
  }

  /* 일요일에 빨간 폰트 */
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="일요일"] {
    color: #FF0000;
  }

  /* 토요일에 파란 폰트 */
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="토요일"] {
    color: #2E7AF2;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    color: #424242;
  }

  /* 토요일 날짜 숫자는 기본색 유지 또는 파란색 */
  .react-calendar__month-view__days__day--weekend:nth-child(7n) abbr {
    color: #2E7AF2;
  }

  .react-calendar__month-view__days__day:nth-child abbr {
    color: #424242;
  }

  /* 이전 달과 다음 달의 날짜 숫자들의 색상 변경 */
  .react-calendar__month-view__days__day--neighboringMonth{
    abbr {
      color: #BDBDBD !important;
    }
  } 

  .react-calendar__tile--active {
    background: none;
    color: #424242;
  }

  /* 오늘 날짜 폰트 컬러 */
  .react-calendar__tile--now {
    background: none;
    position: relative; /* 원형 위치 조정에 필요 */
    z-index: 1;
    abbr {
      color: white;
      position: relative;
      z-index: 2;
    }
  }

  /* 오늘 날짜 원형 스타일 */
  .react-calendar__tile--now::after {
    content: ''; /* 내용 추가 */
    position: absolute; /* 절대 위치 */
    top: 50%; /* 수직 중앙 정렬 */
    left: 50%; /* 수평 중앙 정렬 */
    width: 30px; /* 원형 너비 조정 */
    height: 30px; /* 원형 높이 조정 */
    border-radius: 50%; /* 원형 유지 */
    background-color: #7C97FE; /* 원형 배경색 */
    transform: translate(-50%, -50%); /* 중앙 정렬 */
  }

  /* 네비게이션 월 스타일 적용 */
  .react-calendar__year-view__months__month {
    border-radius: 0.8rem;
    background-color: white;
    padding: 0;
  }

  /* 일 날짜 간격 */
  .react-calendar__tile {
    padding: 17px;
  }

  /* 1. 기간 전체의 배경색을 파란색으로 지정 */
.react-calendar__tile--range {
  background-color: #7C97FE !important; /* 선택된 기간 전체 */
  color: white;
  border-radius: 0; /* 기간 중간의 날짜는 둥글게 하지 않음 */
}

/* 2. 기간 시작 날짜 스타일 */
.react-calendar__tile--rangeStart {
  background-color: #7C97FE !important;
  color: white;
  /* 시작 날짜의 왼쪽 모서리만 둥글게 */
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

/* 3. 기간 종료 날짜 스타일 */
.react-calendar__tile--rangeEnd {
  background-color: #7C97FE !important;
  color: white;
  /* 종료 날짜의 오른쪽 모서리만 둥글게 */
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}
`;

export const StyledCalendar = styled(Calendar)``;

/* 오늘 버튼 스타일 */
export const StyledDate = styled.div`
  position: absolute;
  top: 20px; /* 상단에서 10px 떨어진 위치 */
  right: 30px; /* 오른쪽에서 10px 떨어진 위치 */
  background-color: #7C97FE;
  color: white;
  width: 90px;
  text-align: center;
  line-height: 1.6rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  z-index: 1; /* 버튼이 다른 요소 위에 나타나도록 설정 */
`;

/* 특정 날짜에 점 표시 스타일 */
export const StyledDot = styled.div`
  background-color: #FF4949;
  border-radius: 50%;
  width: 0.3rem;
  height: 0.3rem;
  position: absolute;
  top: 70%; /* 이 값을 조정하여 날짜 바로 아래에 위치시킵니다 */
  left: 50%;
  transform: translateX(-50%); /* 수평 중앙 정렬 유지 */
`;

