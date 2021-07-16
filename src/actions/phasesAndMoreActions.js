import {
  GET_PHASES_LIST_REQUEST,
  GET_PHASES_LIST_RESPONSE,
  GET_PHASES_LIST_ERROR,
  SAVE_PHASES_LIST_REQUEST,
  SAVE_PHASES_LIST_RESPONSE,
  SAVE_PHASES_LIST_ERROR,
} from '../types';
import constants from '../utils/constants';
import fetchClient from '../utils/axiosConfig';
import { getErrorMessage } from '../utils/utils';

/**
 * Add Update Phases
 * getPhases
 * savePhases
 */

const getPhasesListRequest = () => ({
  type: GET_PHASES_LIST_REQUEST,
});

const getPhasesListResponse = response => ({
  type: GET_PHASES_LIST_RESPONSE,
  phases: response.data[0].phases,
  message: response.message,
});

const getPhasesListError = errorMessage => ({
  type: GET_PHASES_LIST_ERROR,
  message: errorMessage,
});

export const getPhases = () => {
  return dispatch => {
    dispatch(getPhasesListRequest());
    fetchClient
      .get(constants.API.PHASES_AND_MORE.GET_PHASES_LIST)
      .then(response => {
        dispatch(getPhasesListResponse(response.data));
      })
      .catch(error => {
        const errorMessage = getErrorMessage(error);
        if (errorMessage) dispatch(getPhasesListError(errorMessage));
      });
  };
};

export const checkPhasesHasLabels = () => {
  return fetchClient.get(constants.API.PHASES_AND_MORE.GET_PHASES_LIST);
};

const savePhasesRequest = () => ({
  type: SAVE_PHASES_LIST_REQUEST,
});

const savePhasesResponse = (response, updatedPhasesData) => ({
  type: SAVE_PHASES_LIST_RESPONSE,
  phases: updatedPhasesData,
  message: response.message,
  isSaved: true,
});

const savePhasesError = errorMessage => ({
  type: SAVE_PHASES_LIST_ERROR,
  message: errorMessage,
});

/**
 *
 * @param {array} formData : phases data in format of request data
 * @param {boolean} isAddRequest : true for add and false for update
 * @param {array} updatedPhasesData : to store update phases in redux soter when successfully stored in backend
 * @param {function} handleRedirection : callback function it called after successfully response get
 *
 */

export const savePhases = (
  formData,
  isAddRequest,
  updatedPhasesData,
  // handleRedirection,
) => {
  return dispatch => {
    dispatch(savePhasesRequest());
    let requestQuery = '';
    if (isAddRequest) {
      requestQuery = fetchClient.post(
        constants.API.PHASES_AND_MORE.POST_PHASES_LIST,
        formData,
      );
    } else {
      requestQuery = fetchClient.put(
        constants.API.PHASES_AND_MORE.PUT_PHASES_LIST,
        formData,
      );
    }
    requestQuery
      .then(response => {
        if (response.data && response.data.success) {
          dispatch(savePhasesResponse(response.data, updatedPhasesData));
          // handleRedirection();
        }
      })
      .catch(error => {
        const errorMessage = getErrorMessage(error);
        dispatch(savePhasesError(errorMessage));
      });
  };
};

/**
 * Add Update Sub-Phases
 * getSubPhases
 *
 */

export const getSubPhases = () => {
  return fetchClient.get(constants.API.PHASES_AND_MORE.GET_SUB_PHASES_LIST);
};

export const saveSubPhases = (formData, isAddRequest) => {
  let requestQuery = '';
  if (isAddRequest) {
    requestQuery = fetchClient.post(
      constants.API.PHASES_AND_MORE.POST_SUB_PHASES_LIST,
      formData,
    );
  } else {
    requestQuery = fetchClient.put(
      constants.API.PHASES_AND_MORE.PUT_SUB_PHASES_LIST,
      formData,
    );
  }
  return requestQuery;
};

export const resetPhases = () => ({
  type: SAVE_PHASES_LIST_RESPONSE,
  phases: [],
  message: '',
  isSaved: false,
});
