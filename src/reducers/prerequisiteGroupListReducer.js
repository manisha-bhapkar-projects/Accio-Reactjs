import {
  SET_PREREQUISITE_GROUP_LIST,
  ADD_PREREQUISITE_TO_GROUP,
  SET_TOTAL_GROUPLIST_COUNT,
  SET_PREREQUISITE_GROUP_LIST_LOADING,
} from '../types';

const initialState = {
  groupList: [],
  addedPrerequisite: [],
  groupListCount: 0,
  isLoading: false,
};

const prerequisiteGroupList = (state = initialState, action) => {
  switch (action.type) {
    case SET_PREREQUISITE_GROUP_LIST:
      return {
        ...state,
        groupList: action.groupList,
        isLoading: false,
      };
    case ADD_PREREQUISITE_TO_GROUP:
      return {
        ...state,
        addedPrerequisite: action.addedPrerequisite,
      };

    case SET_TOTAL_GROUPLIST_COUNT:
      return {
        ...state,
        groupListCount: action.groupListCount,
      };
    case SET_PREREQUISITE_GROUP_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
};

export const getPreRequisiteGroupList = state =>
  state.prerequisiteGroupList.groupList;

export const getAddedPrerequisite = state =>
  state.prerequisiteGroupList.addedPrerequisite;

export const getGroupListCount = state =>
  state.prerequisiteGroupList.groupListCount;

export default prerequisiteGroupList;
