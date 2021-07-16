import {
  GET_PHASEWISE_CASE_DETAILS,
  SET_CASE_LIST_DETAILS,
  SET_CASE_LIST_DETAILS_TOTAL,
  SET_CASE_LIST_DETAILS_IS_LOADING,
  SET_USER_ACCESS_PROPERTIES,
  SET_CUSTOMER_FILTER_LIST,
  SET_BRAND_FILTER_LIST,
  SET_UNITS_LIST,
  SET_CASE_STATUS_LIST,
  SET_PROPERTY_PHASE_LIST,
  SET_CASE_TYPE_LIST,
  SET_ASSIGNED_TO_USER_LIST,
  SET_IS_CASE_MANIPULATION_ACCESS,
  SET_IS_ALL_PROPERTY_LICENSE_SUSPENDED,
} from '../../types';

const initialState = {
  phaseWiseCaseDetailList: [],
  caseList: [],
  caseListIsLoading: false,
  caseListTotal: 0,
  userAccessPropertyList: [],
  customerList: [],
  brandList: [],
  unitsList: [],
  caseStatusList: [],
  propertyPhaseList: [],
  caseTypeList: [],
  assignedToList: [],
  isCaseManipulationAccess: false,
  isAllPropertyLicenseSuspended: false,
};

const caseListing = (state = initialState, action) => {
  switch (action.type) {
    case GET_PHASEWISE_CASE_DETAILS:
      return {
        ...state,
        phaseWiseCaseDetailList: action.list,
      };
    case SET_CASE_LIST_DETAILS:
      return {
        ...state,
        caseList: action.list,
        caseListIsLoading: false,
      };
    case SET_CASE_LIST_DETAILS_IS_LOADING:
      return {
        ...state,
        caseListIsLoading: action.isLoading,
      };
    case SET_CASE_LIST_DETAILS_TOTAL:
      return {
        ...state,
        caseListTotal: action.total,
      };
    case SET_IS_CASE_MANIPULATION_ACCESS:
      return {
        ...state,
        isCaseManipulationAccess: action.isAccess,
      };

    case SET_IS_ALL_PROPERTY_LICENSE_SUSPENDED:
      return {
        ...state,
        isAllPropertyLicenseSuspended: action.isLicenseSuspended,
      };
    case SET_USER_ACCESS_PROPERTIES:
      return {
        ...state,
        userAccessPropertyList: action.list,
      };
    case SET_CUSTOMER_FILTER_LIST:
      return {
        ...state,
        customerList: action.list,
      };
    case SET_BRAND_FILTER_LIST:
      return {
        ...state,
        brandList: action.list,
      };
    case SET_UNITS_LIST:
      return {
        ...state,
        unitsList: action.list,
      };
    case SET_CASE_STATUS_LIST:
      return {
        ...state,
        caseStatusList: action.list,
      };
    case SET_PROPERTY_PHASE_LIST:
      return {
        ...state,
        propertyPhaseList: action.list,
      };
    case SET_CASE_TYPE_LIST:
      return {
        ...state,
        caseTypeList: action.list,
      };
    case SET_ASSIGNED_TO_USER_LIST:
      return {
        ...state,
        assignedToList: action.list,
      };

    default:
      return state;
  }
};
export default caseListing;
