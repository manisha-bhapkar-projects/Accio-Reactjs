// you can combine multiple reducers see the commented code in this file
import { combineReducers } from 'redux';
import { RESET, RESET_WORKFLOW } from '../types';
import sidebarActive from './sidebarToggle';
import prerequisiteList from './prerequisiteListReducer';
import prerequisiteGroupList from './prerequisiteGroupListReducer';
import header from './headerReducer';
import workFlows from './workFlowsReducer';
import designForms from './designFormsReducer';
import phasesList from './phasesListReducer';
import userAccess from './userAndAccessReducer';
import common from './commonReducer';
import caseListing from './Business/caseListingReducer';
import datePicker from './datePickerReducer';
import sidebarData from './sidebarReducer';
import kickoff from './Business/kickoffReducer';

// Combine all reducers.
const appReducer = combineReducers({
  sidebarActive,
  prerequisiteList,
  prerequisiteGroupList,
  header,
  workFlows,
  datePicker,
  phasesList,
  designForms,
  userAccess,
  common,
  caseListing,
  sidebarData,
  kickoff,
});

const rootReducer = (state, action) => {
  // RESET REDUCER
  // eslint-disable-next-line no-param-reassign
  if (action.type === RESET) state = undefined;
  // RESET WORKFLOW
  // eslint-disable-next-line no-param-reassign
  else if (action.type === RESET_WORKFLOW) {
    return appReducer({ ...state, workFlows: undefined }, action);
  }

  return appReducer(state, action);
};
export default rootReducer;
