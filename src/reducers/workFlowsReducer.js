import {
  SET_WORKFLOW_LIST,
  SET_WORKFLOW_LIST_LOADING,
  SET_FITOUT_TYPES_LIST,
  SET_WIZARD_STEPS,
  SETUP_WORKFLOW_LOADING,
  SET_PHASES_LIST_IN_WIZARD,
  SET_SUB_PHASES_LIST_IN_WIZARD,
  SET_SELECT_PRE_REQUISITE_LIST,
  // SET_ADD_PRE_REQUISITE_LIST,
  SET_LANGAUGES,
  SET_PRE_REQUISITE_LIST,
  SET_PRE_REQUISITE_LIST_IN_WIZARD,
  RESET_WORKFLOW_FORM,
  SET_WORKFLOW_IS_MODIFY,
} from '../types';

/** Error & Lables */
import labels from '../utils/Locales/labels';
import constants from '../utils/constants';
// import messages from '../utils/Locales/messages';

const initialState = {
  list: [],
  isFormModify: false,
  list_total_count: 0,
  isloading: false,
  setUpWorkFlowloading: false,
  setUpWorkFlow: [
    {
      id: 1,
      title: labels.WORKFLOWS.STEP_1.TITLE,
      status: 'current',
      isSaved: true,
      response: {},
      workflowName: [],
      fitOutType: {},
      isErrorFitOutType: false,
      isErrorWorkflowName: false,
      isErrorFitOutTypeMsg: '',
      isErrorWorkflowNameMsg: '',
      refId: '',
      lastModifiedStep: 0,
      sourceId: '',
      isEngagedToCase: false,
      isPublish: false,
    },
    {
      id: 2,
      title: labels.WORKFLOWS.STEP_2.TITLE,
      status: '',
      list: [],
      isSaved: false,
      isError: false,
      response: [],
    },
    {
      id: 3,
      title: labels.WORKFLOWS.STEP_3.TITLE,
      status: '',
      list: [],
      isSaved: false,
      response: {},
    },
    {
      id: 4,
      title: labels.WORKFLOWS.STEP_4.TITLE,
      status: '',
      isSaved: false,
      list: [],
      requisites: [],
      select_prerequisite: [],
      selected_data: {},
      added_data: {},
      response: {},
      isErrorAdd: false,
      isErrorSelect: false,
    },
    {
      id: 5,
      title: labels.WORKFLOWS.STEP_5.TITLE,
      list: [],
      status: '',
      isSaved: false,
      activeLanguage: 'en',
      response: {},
      preRequisiteItem: [],
      preview: '',
    },
  ],
  // Step 1
  fitOutTypes: [],
  // Step 4
  requisites: [],
};

const workFlows = (state = initialState, action) => {
  switch (action.type) {
    case SET_WORKFLOW_LIST:
      return {
        ...state,
        list: action.list,
        list_total_count: action.totalCount,
        isloading: false,
      };
    case SET_WORKFLOW_LIST_LOADING:
      return {
        ...state,
        isloading: action.isloading,
      };
    case SET_WORKFLOW_IS_MODIFY:
      return {
        ...state,
        isFormModify: action.isFormModify,
      };
    case SET_FITOUT_TYPES_LIST:
      return {
        ...state,
        fitOutTypes: action.list,
      };
    case SET_WIZARD_STEPS:
      return {
        ...state,
        setUpWorkFlow: action.steps,
      };
    case SET_LANGAUGES: {
      let data1 = state.setUpWorkFlow;
      data1 = data1.map((_item, i) => {
        const item = _item;
        if (i === 0) {
          item.workflowName = constants.LANG.map(x => {
            const newLang = { ...x, name: '' };
            return newLang;
          });
          return item;
        }
        return item;
      });
      return {
        ...state,
        setUpWorkFlow: data1,
      };
    }
    case SET_PHASES_LIST_IN_WIZARD: {
      let data = state.setUpWorkFlow;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 1) {
          item.list = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        setUpWorkFlow: data,
      };
    }
    case SET_SUB_PHASES_LIST_IN_WIZARD: {
      let subPhaseData = state.setUpWorkFlow;

      subPhaseData = subPhaseData.map((item, i) => {
        if (i === 2) {
          const subPhaseitem = item;
          subPhaseitem.list = action.list;
          return subPhaseitem;
        }
        return item;
      });

      return {
        ...state,
        setUpWorkFlow: subPhaseData,
      };
    }
    case SET_PRE_REQUISITE_LIST_IN_WIZARD: {
      let step4 = state.setUpWorkFlow;
      step4 = step4.map((item, i) => {
        if (i === 3) {
          const preRequisiteItem = item;
          preRequisiteItem.list = action.list;
          return preRequisiteItem;
        }
        return item;
      });
      return {
        ...state,
        setUpWorkFlow: step4,
      };
    }
    case SET_SELECT_PRE_REQUISITE_LIST: {
      let selectPrerequisite = state.setUpWorkFlow;
      selectPrerequisite = selectPrerequisite.map((item, i) => {
        if (i === 3) {
          const preRequisiteItem = item;
          preRequisiteItem.select_prerequisite = action.list;
          return preRequisiteItem;
        }
        return item;
      });
      return {
        ...state,
        setUpWorkFlow: selectPrerequisite,
      };
    }
    case SET_PRE_REQUISITE_LIST:
      return {
        ...state,
        requisites: action.list,
      };
    case SETUP_WORKFLOW_LOADING:
      return {
        ...state,
        setUpWorkFlowloading: action.isloading,
      };
    case RESET_WORKFLOW_FORM:
      return {
        ...state,
        setUpWorkFlow: [
          {
            id: 1,
            title: labels.WORKFLOWS.STEP_1.TITLE,
            status: 'current',
            isSaved: true,
            response: {},
            workflowName: [],
            fitOutType: {},
            isErrorFitOutType: false,
            isErrorWorkflowName: false,
            isErrorFitOutTypeMsg: '',
            isErrorWorkflowNameMsg: '',
            refId: '',
            lastModifiedStep: 0,
            sourceId: '',
            isEngagedToCase: false,
            isPublish: false,
          },
          {
            id: 2,
            title: labels.WORKFLOWS.STEP_2.TITLE,
            status: '',
            list: [],
            isSaved: false,
            isError: false,
            response: [],
          },
          {
            id: 3,
            title: labels.WORKFLOWS.STEP_3.TITLE,
            status: '',
            list: [],
            isSaved: false,
            response: {},
          },
          {
            id: 4,
            title: labels.WORKFLOWS.STEP_4.TITLE,
            status: '',
            isSaved: false,
            list: [],
            select_prerequisite: [],
            selected_data: {},
            added_data: {},
            response: {},
            isErrorAdd: false,
            isErrorSelect: false,
          },
          {
            id: 5,
            title: labels.WORKFLOWS.STEP_5.TITLE,
            list: [],
            status: '',
            isSaved: false,
            activeLanguage: 'en',
            response: {},
            preRequisiteItem: [],
            preview: '',
          },
        ],
      };
    default:
      return state;
  }
};

export default workFlows;
