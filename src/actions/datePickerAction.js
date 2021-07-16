import moment from 'moment';
import {
  SET_SPECIAL_DATE,
  SET_PUBLIC_HOLIDAY,
  SET_WEEK_END,
  SET_SPECIAL_EVENTS_DATE,
  SET_DATE_PICKER_API_CALLING,
} from '../types';

//  specialDatesAction,
//   publicHolidayDatesAction,
//   weekEndAction,
import fetchClient from '../utils/axiosConfig';
import constants from '../utils/constants';

// const DAYS = [
//   'Sunday',
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
// ];

export const specialDatesAction = list => ({
  type: SET_SPECIAL_DATE,
  list,
});
export const specialEventsAction = list => ({
  type: SET_SPECIAL_EVENTS_DATE,
  list,
});

export const publicHolidayDatesAction = list => ({
  type: SET_PUBLIC_HOLIDAY,
  list,
});
export const weekEndAction = list => ({
  type: SET_WEEK_END,
  list,
});

export const apiCalling = list => ({
  type: SET_DATE_PICKER_API_CALLING,
  list,
});
export const getHodidayAPIAction = () => {
  return (dispatch, getState) => {
    if (getState().datePicker.isApiCalling) {
      // dispatch(apiCalling(false));
      fetchClient
        .get(constants.API.DATE_PICKER.HOLIDAY)
        .then(res => {
          if (res.data.success) {
            dispatch(apiCalling(false));

            if (res.data.data && res.data.data.length) {
              dispatch(
                specialDatesAction(
                  res.data.data[0].specialTimeEvents.map(x => x.date),
                ),
              );
              dispatch(
                specialEventsAction(
                  res.data.data[0].specialEvents.map(x => x.date),
                ),
              );
              dispatch(
                publicHolidayDatesAction(
                  res.data.data[0].holidayDates.map(x => x.date),
                ),
              );
              dispatch(
                weekEndAction(
                  res.data.data[0].weekOffDays.map(x =>
                    new Date(moment().day(x.day)).getDay(),
                  ),
                ),
              );
            }
          }
        })
        .catch(() => {
          // console.log(error);
        });
    }
  };
};
