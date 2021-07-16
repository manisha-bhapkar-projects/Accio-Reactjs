import { SET_SIDEBAR_DATA } from '../types';

//  specialDatesAction,
//   publicHolidayDatesAction,
//   weekEndAction,
// import fetchClient from '../utils/axiosConfig';
// import constants from '../utils/constants';
import { sidebarData } from '../utils/DemoData/sidebarData';

export const setSidebarData = list => ({
  type: SET_SIDEBAR_DATA,
  list,
});
// export const specialEventsAction = list => ({
//   type: SET_SPECIAL_EVENTS_DATE,
//   list,
// });

// export const publicHolidayDatesAction = list => ({
//   type: SET_PUBLIC_HOLIDAY,
//   list,
// });
// export const weekEndAction = list => ({
//   type: SET_WEEK_END,
//   list,
// });

// export const apiCalling = list => ({
//   type: SET_DATE_PICKER_API_CALLING,
//   list,
// });
export const getSidebarDataApiAction = () => {
  return dispatch => {
    // if (getState().datePicker.isApiCalling) {
    // dispatch(apiCalling(false));
    dispatch(setSidebarData(sidebarData));

    // fetchClient
    //   .get(constants.API.BUSINESS.SIDEBAR.SIDEBAR)
    //   .then(res => {
    //     console.log('Sidebar', res.data);
    //     // alert('sidebar');
    //     if (res.data.success) {
    //       if (res.data.data && res.data.data.length) {
    //         dispatch(setSidebarData(res.data.data));
    //       }
    //     }
    //   })
    //   .catch(() => {
    //     // console.log(error);
    //   });
  };
};
