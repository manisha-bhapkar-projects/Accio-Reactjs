// import fetchClient from '../../utils/axiosConfig';
// import constants from '../../utils/constants';
// import { getFormatedDate } from '../utils/utils';

import {
  SET_PHASE_LISTING_TABLE,
  SET_PHASE_LISTING_TABLE_BACKUP,
  SET_SELECT_WORKFLOW_LIST,
} from '../../types';

import {
  getWorkflowList,
  mileStoneWorkflowTable,
  // getEmails,
} from '../../utils/DemoData/addOrUpdateMilestonesData';

// Add Update Milestone TableData
export const setPhaselisingTable = list => ({
  type: SET_PHASE_LISTING_TABLE,
  list,
});
export const setPhaselisingTableBeckup = list => ({
  type: SET_PHASE_LISTING_TABLE_BACKUP,
  list,
});
export const getPhaselisingTableAPIAction = () => {
  return dispatch => {
    // fetchClient
    //   .get(constants.API.BUSINESS.ADD_OR_UPDATE_MILESTONES.WORKFLOWS_LIST)
    //   .then(_response => {
    //     console.log(_response);
    //     if (_response.data.success) {
    //       if (_response.data.data.length) {
    //         dispatch(setPhaselisingTable(_response.data.data));
    //         dispatch(setPhaselisingTableBeckup(_response.data.data));
    //       } else {
    //         throw new Error('Case Type List is Empty');
    //       }
    //     } else {
    //       throw new Error('Case Type list Api unsucessfull');
    //     }
    //   })
    //   .catch(_error => {
    //     dispatch(setPhaselisingTable([]));
    //     dispatch(setPhaselisingTableBeckup([]));
    //   });
    dispatch(setPhaselisingTable(mileStoneWorkflowTable));
    dispatch(setPhaselisingTableBeckup(mileStoneWorkflowTable));
  };
};

export const setWorkflowTable = newItem => {
  return dispatch => {
    dispatch(setPhaselisingTable(newItem));
  };
};
// Add Update Milestone Select Workflow Dropdown
export const getSelectWorkflowList = list => ({
  type: SET_SELECT_WORKFLOW_LIST,
  list,
});
export const getWorkflowListAPIAction = () => {
  return dispatch => {
    // fetchClient
    //   .get(constants.API.BUSINESS.ADD_OR_UPDATE_MILESTONES.WORKFLOWS_LIST)
    //   .then(_response => {
    //     console.log(_response);
    //     if (_response.data.success) {
    //       if (_response.data.data.length) {
    //         dispatch(setPhaselisingTable(_response.data.data));
    //         dispatch(setPhaselisingTableBeckup(_response.data.data));
    //       } else {
    //         throw new Error('Case Type List is Empty');
    //       }
    //     } else {
    //       throw new Error('Case Type list Api unsucessfull');
    //     }
    //   })
    //   .catch(_error => {
    //     dispatch(setPhaselisingTable([]));
    //     dispatch(setPhaselisingTableBeckup([]));
    //   });
    dispatch(getSelectWorkflowList(getWorkflowList));
  };
};
