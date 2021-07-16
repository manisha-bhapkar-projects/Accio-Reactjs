import {
  SET_SPECIAL_DATE,
  SET_PUBLIC_HOLIDAY,
  SET_WEEK_END,
  SET_SPECIAL_EVENTS_DATE,
  SET_DATE_PICKER_API_CALLING,
} from '../types';

const initialState = {
  specialDates: [],
  publicHolidayDates: [],
  weekEnd: [],
  specialEventDates: [],
  isApiCalling: true,
};

const datePicker = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPECIAL_DATE:
      return {
        ...state,
        specialDates: action.list,
      };
    case SET_PUBLIC_HOLIDAY:
      return {
        ...state,
        publicHolidayDates: action.list,
      };
    case SET_DATE_PICKER_API_CALLING:
      return {
        ...state,
        isApiCalling: action.list,
      };
    case SET_SPECIAL_EVENTS_DATE:
      return {
        ...state,
        specialEventDates: action.list,
      };

    case SET_WEEK_END:
      return {
        ...state,
        weekEnd: action.list,
      };
    default:
      return state;
  }
};
export default datePicker;
