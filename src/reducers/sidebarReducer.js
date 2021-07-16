import { SET_SIDEBAR_DATA } from '../types';

const initialState = {
  sidebar: [],
  isApiCalling: true,
};

const businessSidebar = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIDEBAR_DATA:
      return {
        ...state,
        sidebar: action.list,
      };
    // case SET_DATE_PICKER_API_CALLING:
    //   return {
    //     ...state,
    //     isApiCalling: action.list,
    //   };

    default:
      return state;
  }
};
export default businessSidebar;
