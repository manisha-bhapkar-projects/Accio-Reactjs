import styled from 'styled-components';

import ArrowIcon from '../../../../images/arrow/Arrow-down-1.png';
import ArrowBlueIcon from '../../../../images/arrow/Arrow-down-blue.png';

// import Arrow-down-1 from ''

export const Arrow = styled.button`
  appearance: none;
  user-select: none;
  outline: none !important;
  display: inline-block;
  position: relative;
  cursor: pointer;
  padding: 0;
  border: none;
  border-top: 1.6em solid transparent;
  border-bottom: 1.6em solid transparent;
  transition: all 0.25s ease-out;
`;

export const ArrowLeft = styled(Arrow)`
  // border-right: 2.4em solid #ccc;
  left: 18%;
  // background: transparent;
  width: 50px;
  background: url(${ArrowIcon});
  background-position: center;
  background-repeat: no-repeat;
  transform: rotate(90deg);
  :hover {
    background: url(${ArrowBlueIcon});
    background-position: center;
    background-repeat: no-repeat;
  }
`;

export const ArrowRight = styled(Arrow)`
  // border-left: 2.4em solid #ccc;
  right: 18%;
  width: 50px;
  // background: transparent;
  background: url(${ArrowIcon});
  background-position: center;
  background-repeat: no-repeat;
  transform: rotate(-90deg);

  :hover {
    background: url(${ArrowBlueIcon});
    background-position: center;
    background-repeat: no-repeat;
  }
`;

export const CalendarContainer = styled.div`
  font-size: 5px;
  border: 1px solid #b2b2b5;
  // z-index: 1;
  background: white;
  border-radius: 3px;
  // overflow: hidden;
  position: absolute;
  margin-top: 43px;
  box-sizing: border-box;
  //   height: 239px;
  width: 360px;
  // max-width: 100%;
  animation: popUp 0.1s;
  animation-fill-mode: forwards;
  padding-bottom: 5px;
  :focus {
    outline: none;
  }
  @keyframes popUp {
    0% {
      transform: scale(0);
    }
    10% {
      transform: scale(0.1);
    }
    20% {
      transform: scale(0.2);
    }
    30% {
      transform: scale(0.3);
    }
    40% {
      transform: scale(0.4);
    }
    50% {
      transform: scale(0.5);
    }
    60% {
      transform: scale(0.6);
    }
    70% {
      transform: scale(0.7);
    }
    80% {
      transform: scale(0.8);
    }
    90% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const CalendarHeader = styled.div`
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template: repeat(7, auto) / repeat(7, auto);
`;
export const MonthGrid = styled.div`
  cursor: pointer;
  display: grid;
  grid-template: repeat(3, auto) / repeat(3, auto);
  border-top: 2px solid rgb(193, 157, 42);
  padding-top: 5px;
`;
export const CalendarMonth = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: #00467f;
  text-align: center;
  padding: 0.5em 0.25em;
  word-spacing: 5px;
  user-select: none;
  cursor: pointer;
`;

export const CalendarCell = styled.div`
  text-align: center;
  align-self: center;
  letter-spacing: 0.1rem;
  padding: 5px;
  position: relative;
  user-select: none;
//   grid-column: ${props => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
  font-weight: 400;
  font-size: 12px;
  color: #6b6d8b;
  //   border-top: 2px solid #06c;
  border-bottom: 2px solid #b2b2b5;
  padding-right: 5px;
  padding-left: 5px;
  margin-bottom: 10px;
`;

export const MonthSelectUi = styled(CalendarCell)`
  font-weight: 500;
  color: rgb(89, 89, 89);
  font-size: 15px;
  // color: #00467f;
  text-align: center;
  padding: 15px 0;
  word-spacing: 5px;
  user-select: none;
  margin: 2px auto;
  background-color: rgb(193, 157, 42);
  border-radius: 50%;
  width: 70px;
`;
export const MonthUi = styled(CalendarCell)`
  font-weight: 500;
  color: rgb(89, 89, 89);
  font-size: 15px;
  // color: #00467f;
  text-align: center;
  padding: 15px 0;
  word-spacing: 5px;
  user-select: none;
  margin: 2px auto;
  width: 70px;
  :hover {
    background-color: rgb(193, 157, 42);
    border-radius: 50%;
    width: 70px;
  }
`;
//   border-right: ${(props) =>
//     (props.index % 7) + 1 === 7 ? `none` : `2px solid #06c`};

//   border-bottom: ${(props) =>
//     (props.index + 1) / 7 <= 5 ? `1px solid #ddd` : `none`};
//   border-right: ${(props) =>
//     (props.index % 7) + 1 === 7 ? `none` : `1px solid #ddd`};

export const CalendarDateDisble = styled(CalendarCell)`
  font-weight: 600;
  font-size: 12px;
  width: 24px;
  height: 24px;
  margin-left: auto;
  margin-right: auto;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  cursor: default;
  color: #ddd !important;
  background: transparent !important;
  transition: all 0.4s ease-out;
`;
export const CalendarDate = styled(CalendarCell)`
  font-weight: ${props => (props.inMonth ? 500 : 600)};
  font-size: 12px;
  width: 24px;
   height: 24px;
   margin-left:auto;
     margin-right:auto;
	   border-radius: 50%;
     font-stretch: normal;
	   font-style: normal;
	   line-height: normal;
	   letter-spacing: normal;
	   text-align: center;
  cursor: ${props => (props.inRange ? 'pointer' : 'default')};
  color: ${props =>
    // eslint-disable-next-line no-nested-ternary
    props.inRange ? (props.inMonth ? '#333' : '#ddd') : '#ddd !important'};
  background: ${props =>
    props.inRange ? 'transparent' : 'rgba(102, 25, 0, 0.04) !important'};
//   grid-row: ${props => Math.floor(props.index / 7) + 2} / span 1;
  transition: all 0.4s ease-out;
  :hover {
    ${props =>
      // eslint-disable-next-line no-nested-ternary
      props.inRange
        ? props.inMonth
          ? `color:white;
    background-color: #00467f;

	  font-weight: bold;
	 `
          : null
        : null}
    }
    `;
// color:${(props) =>
//   props.inRange ? (props.inMonth ? `#06c` : `#ddd`) : `#ddd`};
// background:${(props) =>
//   props.inRange
//     ? props.inMonth
//       ? `rgba(0, 102, 204, 0.075)`
//       : `transparent`
//     : `transparent`};

export const inRangeDateUI = styled(CalendarCell)`
  font-weight: ${props => (props.inMonth ? 500 : 600)};
  font-size: 12px;
  cursor: default;
  font-family: Roboto;
  color: ${props =>
    // eslint-disable-next-line no-nested-ternary
    props.isWeekend ? 'rgba(237,36,0,0.5)' : '#595959 !important'};
  background: ${props =>
    props.inRange
      ? 'rgba(127,162,191,0.2)'
      : 'rgba(127,162,191,0.2) !important'};
  // border-radius: 50%;
  width: 100%;
  height: 24px;
  // padding-left: 18.5px;
  // padding-right: 19px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  // margin-left: auto;
  // margin-right: auto;
  margin: 1px auto;

  transition: all 0.4s ease-out;
`;
export const PublicHolidayUi = styled(CalendarCell)`
  font-weight: ${props => (props.inMonth ? 500 : 600)};
  font-size: 12px;
  cursor: 'default';
  font-family: Roboto;
  color: ${props =>
    // eslint-disable-next-line no-nested-ternary
    props.inRange
      ? props.inMonth
        ? '#595959'
        : 'rgba(240,127,37,0.5)'
      : 'rgba(240,127,37,0.5) !important'};
  background: ${props =>
    props.inRange ? '#E8F6EB' : 'rgba(102, 25, 0, 0.04) !important'};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.4s ease-out;
`;
export const SpecialDaysUi = styled(CalendarCell)`
  font-weight: ${props => (props.inMonth ? 500 : 600)};
  font-size: 12px;
  cursor: 'default';
  font-family: Roboto;
  color: ${props =>
    // eslint-disable-next-line no-nested-ternary
    props.inRange
      ? props.inMonth
        ? '#595959'
        : 'rgba(115,112,100,0.5)'
      : 'rgba(240,127,37,0.5) !important'};
  background: ${props =>
    props.inRange
      ? 'rgba(247,211,42,0.5)'
      : 'rgba(102, 25, 0, 0.04) !important'};
  border-radius: 50%;

  // padding-left: 18.5px;
  // padding-right: 19px;
  width: 24px;
  height: 24px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.4s ease-out;
`;
export const WeekEndDate = styled(CalendarCell)`
  font-weight: ${props => (props.inMonth ? 500 : 600)};
  font-size: 12px;
  cursor:default;
  color: ${props =>
    // eslint-disable-next-line no-nested-ternary
    props.inRange
      ? props.inMonth
        ? 'rgba(237,36,0,0.8)'
        : 'rgba(240,127,37,0.5)'
      : 'rgba(240,127,37,0.5) !important'};
  background: ${props =>
    props.inRange ? 'transparent' : 'rgba(102, 25, 0, 0.04) !important'};
//   grid-row: ${props => Math.floor(props.index / 7) + 2} / span 1;
  transition: all 0.4s ease-out;
  // :hover {
  //   color: rgb(237,36,0);
  //   background: rgba(0, 102, 204, 0.075);
  // }
`;

export const HighlightedCalendarDateS = styled(CalendarDate)`
  color: white !important;
  background: ${props =>
    props.startDateUI
      ? 'linear-gradient(90deg, white 50%, rgba(127,162,191,0.2) 50%)'
      : 'linear-gradient(90deg, rgba(127,162,191,0.2) 50%, white 50%)'};
  width: 100%;
  height: 24px;
  padding-top: 0px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  border-radius: 0px !important;
  :hover {
    color: white !important;
    background: ${props =>
      props.startDateUI
        ? 'linear-gradient(90deg, white 50%, rgba(127,162,191,0.2) 50%)'
        : 'linear-gradient(90deg, rgba(127,162,191,0.2) 50%, white 50%)'} !important;
  }
`;
export const HighlightedCalendarDate = styled(CalendarDate)`
  color: white !important;

  // padding:auto !important;
  font-size: 12px;
  background-color: #00467f !important;
  width: 24px;
  height: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
`;
// export const TodayCalendarDateS = styled(CalendarDate)`
//   color: white !important;
//   background: ${props =>
//     props.startDateUI
//       ? 'linear-gradient(90deg, white 50%, #98b4cb 50%)'
//       : 'linear-gradient(90deg, #98b4cb 50%, white 50%)'};
//   width: 100%;
//   height: 24px;
//   padding-top: 0px;
//   font-weight: bold;
//   font-stretch: normal;
//   font-style: normal;
//   line-height: normal;
//   letter-spacing: normal;
//   text-align: center;
//   border-radius: 0px !important;
// `;
export const TodayCalendarDate = styled(CalendarDate)`
  ${props =>
    props.inRange &&
    `
    color: #595959 !important;
	  border: solid 1px #ffd329 !important;
  background-color: rgba(255, 211, 41, 0.25) !important;
   :hover {
     color: #595959 !important;
	  border: solid 1px #ffd329 !important;
  background-color: rgba(255, 211, 41, 0.25) !important;
  }
   
  `}
`;
