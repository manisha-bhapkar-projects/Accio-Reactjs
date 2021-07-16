import {
  SET_PHASE_LISTING_TABLE,
  SET_PHASE_LISTING_TABLE_BACKUP,
  SET_SELECT_WORKFLOW_LIST,
} from '../../types';

const initialState = {
  addUpdateMilesones: {
    select_workflow_List: [],
    select_workflow: {},
    phase_Listing_Table: [],
    phase_Listing_Table_beckup: [],
  },
};

const caseListing = (state = initialState, action) => {
  switch (action.type) {
    case SET_PHASE_LISTING_TABLE:
      return {
        ...state,
        addUpdateMilesones: {
          ...state.addUpdateMilesones,
          phase_Listing_Table: action.list,
        },
      };

    case SET_SELECT_WORKFLOW_LIST:
      return {
        ...state,
        addUpdateMilesones: {
          ...state.addUpdateMilesones,
          select_workflow_List: action.list,
        },
      };
    case SET_PHASE_LISTING_TABLE_BACKUP:
      return {
        ...state,
        addUpdateMilesones: {
          ...state.addUpdateMilesones,
          phase_Listing_Table_beckup: action.list,
        },
        // caseListIsLoading: false,
      };

    default:
      return state;
  }
};
export default caseListing;
