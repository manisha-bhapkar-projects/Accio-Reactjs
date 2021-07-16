import {
  GET_PHASES_LIST_REQUEST,
  GET_PHASES_LIST_RESPONSE,
  GET_PHASES_LIST_ERROR,
  SAVE_PHASES_LIST_REQUEST,
  SAVE_PHASES_LIST_RESPONSE,
  SAVE_PHASES_LIST_ERROR,
  SET_IS_SAVED_PHASES,
} from '../types';

const initialState = {
  phases: [],
  isLoading: false,
  isLoadingForSave: false,
  isError: false,
  message: '',
  isSaved: false,
};

const phasesList = (state = initialState, action) => {
  switch (action.type) {
    case GET_PHASES_LIST_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
        message: '',
      };
    case GET_PHASES_LIST_RESPONSE:
      return {
        ...state,
        phases: action.phases,
        isLoading: false,
        isError: false,
      };
    case GET_PHASES_LIST_ERROR:
      return {
        ...state,
        message: action.message,
        isLoading: false,
        isError: true,
      };
    case SAVE_PHASES_LIST_REQUEST:
      return {
        ...state,
        isLoadingForSave: true,
        isError: false,
        message: '',
      };
    case SAVE_PHASES_LIST_RESPONSE:
      return {
        ...state,
        message: action.message,
        phases: action.phases,
        isLoadingForSave: false,
        isError: false,
        isSaved: action.isSaved,
      };
    case SET_IS_SAVED_PHASES:
      return {
        ...state,
        isSaved: action.isSaved,
      };
    case SAVE_PHASES_LIST_ERROR:
      return {
        ...state,
        isLoadingForSave: false,
        message: action.message,
        isError: true,
        isSaved: false,
      };
    default:
      return state;
  }
};

export default phasesList;
