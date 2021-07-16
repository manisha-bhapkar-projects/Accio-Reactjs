import {
  SET_PREREQUISITE_LIST,
  SET_TOTAL_LIST_COUNT,
  SET_PREREQUISITE_LIST_LOADING,
} from '../types';

const initialState = {
  list: [],
  listCount: 0,
  // prerequisiteDetails: {},
  isLoading: false,
  fieldList: [],
};

const prerequisiteList = (state = initialState, action) => {
  switch (action.type) {
    case SET_PREREQUISITE_LIST:
      return {
        ...state,
        list: action.list,
        isLoading: false,
      };
    case SET_TOTAL_LIST_COUNT:
      return {
        ...state,
        listCount: action.count,
      };

    case SET_PREREQUISITE_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
};

export const getPreRequisiteList = state => state.prerequisiteList.list;
export const getPrerequisiteTotalCount = state =>
  state.prerequisiteList.listCount;

// export const getPreRequisiteDetails = state =>
//   state.prerequisiteList.prerequisiteDetails;

// export const getPreRequisiteFields = state => state.prerequisiteList.fieldList;
export default prerequisiteList;
