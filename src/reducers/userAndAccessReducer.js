import _ from 'lodash';
import labelText from '../utils/Locales/labels';

import {
  SET_WIZARD_STEPS_USER_ACCESS,
  SET_COMPANY_LIST,
  SET_CUSTOMER_LIST,
  SET_BRAND_TYPE_LIST,
  SET_BRAND_LIST,
  SET_SELECTED_PROPERTY_LIST,
  // SET_ROLES_LIST,
  SET_USER_LIST_IS_LOADING,
  SET_USER_LIST,
  SET_USER_LIST_COUNT,
  SET_USER_TYPE_LIST,
  SET_ASSIGNED_ACCESS,
  SET_ASSIGNED_CUSTOMER,
  SET_ASSIGNED_DEPARTMENT,
  SET_USER_ACCESS_TYPE_LIST,
  SET_USER_ID,
  RESET_USERDATA_TO_INITIAL_STATE,
} from '../types';

const initialAddAccessState = [
  {
    id: 1,
    company: {},
    llc: {},
    property: {},
    llcDropDownData: [],
    propertyDropDownData: [],
    fullAccess: false,
    caseAccess: false,
    caseManipulateAccess: false,
    hasAnyValue: false,
    companyError: '',
    llcError: '',
    propertyError: '',
    accessError: '',
    isPropertyDisabled: true,
    isLLCDisabled: true,
  },
  {
    id: 2,
    company: {},
    llc: {},
    property: {},
    llcDropDownData: [],
    propertyDropDownData: [],
    fullAccess: false,
    caseAccess: false,
    caseManipulateAccess: false,
    hasAnyValue: false,
    companyError: '',
    llcError: '',
    propertyError: '',
    accessError: '',
    isPropertyDisabled: true,
    isLLCDisabled: true,
  },
  {
    id: 3,
    company: {},
    llc: {},
    property: {},
    llcDropDownData: [],
    propertyDropDownData: [],
    fullAccess: false,
    caseAccess: false,
    caseManipulateAccess: false,
    hasAnyValue: false,
    companyError: '',
    llcError: '',
    propertyError: '',
    accessError: '',
    isPropertyDisabled: true,
    isLLCDisabled: true,
  },
  {
    id: 4,
    company: {},
    llc: {},
    property: {},
    llcDropDownData: [],
    propertyDropDownData: [],
    fullAccess: false,
    caseAccess: false,
    caseManipulateAccess: false,
    hasAnyValue: false,
    companyError: '',
    llcError: '',
    propertyError: '',
    accessError: '',
    isPropertyDisabled: true,
    isLLCDisabled: true,
  },
];

const initialAddCustomerState = [
  {
    id: 1,
    property: {},
    customer: { id: 'all', value: 'All' },
    brandType: { id: 'all', value: 'All' },
    brand: [{ id: 'all', value: 'All', label: 'All' }],
    brandListOnBrandType: [],
    customerDropDownData: [],
    hasAnyValue: false,
    customerError: '',
    propertyError: '',
    brandError: '',
    isDisabled: true,
    isBrandDisabled: true,
    isCustomerDisabled: true,
  },
  // {
  //   id: 2,
  //    property: {},
  // customer: { id: 'all', value: 'All' },
  // brandType: { id: 'all', value: 'All' },
  // brand: [{ id: 'all', value: 'All', label: 'All' }],
  // brandListOnBrandType: [],
  // customerDropDownData: [],
  // hasAnyValue: false,
  // customerError: '',
  // propertyError: '',
  // brandError: '',
  // isDisabled: true,
  // isBrandDisabled: true,
  // isCustomerDisabled:true,
  // },
  // {
  //   id: 3,
  //   property: {},
  // customer: { id: 'all', value: 'All' },
  // brandType: { id: 'all', value: 'All' },
  // brand: [{ id: 'all', value: 'All', label: 'All' }],
  // brandListOnBrandType: [],
  // customerDropDownData: [],
  // hasAnyValue: false,
  // customerError: '',
  // propertyError: '',
  // brandError: '',
  // isDisabled: true,
  // isBrandDisabled: true,
  // isCustomerDisabled:true,
  // },
  // {
  //   id: 4,
  //  property: {},
  // customer: { id: 'all', value: 'All' },
  // brandType: { id: 'all', value: 'All' },
  // brand: [{ id: 'all', value: 'All', label: 'All' }],
  // brandListOnBrandType: [],
  // customerDropDownData: [],
  // hasAnyValue: false,
  // customerError: '',
  // propertyError: '',
  // brandError: '',
  // isDisabled: true,
  // isBrandDisabled: true,
  // isCustomerDisabled:true,
  // },
];

const initialAddDeptState = [
  {
    id: 1,
    property: {},
    department: [],
    roles: [],
    departmentDropDownData: [],
    rolesDropDownData: [],
    hasAnyValue: false,
    propertyError: '',
    departmentError: '',
    roleError: '',
    isDisabled: true,
  },
  {
    id: 2,
    property: {},
    department: [],
    roles: [],
    departmentDropDownData: [],
    rolesDropDownData: [],
    hasAnyValue: false,
    propertyError: '',
    departmentError: '',
    roleError: '',
    isDisabled: true,
  },
  {
    id: 3,
    property: {},
    department: [],
    roles: [],
    departmentDropDownData: [],
    rolesDropDownData: [],
    hasAnyValue: false,
    propertyError: '',
    departmentError: '',
    roleError: '',
    isDisabled: true,
  },
  {
    id: 4,
    property: {},
    department: [],
    roles: [],
    departmentDropDownData: [],
    rolesDropDownData: [],
    hasAnyValue: false,
    propertyError: '',
    departmentError: '',
    roleError: '',
    isDisabled: true,
  },
];

const initialUserAccessStepsState = [
  {
    id: 1,
    title: `${labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.STEP_1_LABEL}`,
    status: 'current',
    isSaved: true,
    isAnyValueModified: false,
    userData: {
      firstName: '',
      lastName: '',
      approved: '',
      active: '',
      email: '',
      userType: {},
      firstNameError: '',
      lastNameError: '',
      approvedError: '',
      activeError: '',
      emailError: '',
      userTypeError: '',
    },
    isError: false,
  },
  {
    id: 2,
    title: labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.STEP_2_LABEL,
    status: '',
    isSaved: false,
    assignedAccess: [],
    addAccessRows: initialAddAccessState,
    companyList: [],
    isError: false,
  },
  {
    id: 3,
    title: labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.STEP_3_LABEL,
    status: '',
    isSaved: false,
    isAllCustomerBrandAssigned: false,
    selectedPropertyList: [],
    assignedCustomer: [], // inseting value now just for checking validation
    addCustomerRows: initialAddCustomerState,
    customerList: [],
    brandTypeList: [],
    brandList: [],
    isError: false,
  },
  {
    id: 4,
    title: labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.STEP_4_LABEL,
    status: '',
    isSaved: false,
    addDeptRows: initialAddDeptState,
    assignedDepartmentAndRoles: [],
    selectedPropertyList: [],
    // rolesList: [],
    isError: false,
  },
];

const initialState = {
  userList: [],
  userListIsLoading: false,
  userListCount: 0,
  userTypeList: [],
  userAccessTypeList: [],
  userId: '',
  userAndAccessSteps: _.cloneDeep(initialUserAccessStepsState),
  // userAndAccessSteps: [
  //   {
  //     id: 1,
  //     title: 'Add / Update User',
  //     status: 'current',
  //     isSaved: true,
  //     userData: {
  //       firstName: '',
  //       lastName: '',
  //       approved: '',
  //       active: '',
  //       email: '',
  //       userType: {},
  //       firstNameError: '',
  //       lastNameError: '',
  //       approvedError: '',
  //       activeError: '',
  //       emailError: '',
  //       userTypeError: '',
  //     },
  //     isError: false,
  //   },
  //   {
  //     id: 2,
  //     title: 'Assign Property and Access',
  //     status: '',
  //     isSaved: false,
  //     assignedAccess: [],
  //     addAccessRows: initialAddAccessState,
  //     companyList: [],
  //     isError: false,
  //   },
  //   {
  //     id: 3,
  //     title: 'Assign Customer and Brand',
  //     status: '',
  //     isSaved: false,
  //     assignedCustomer: [
  //       // {
  //       //   customer: 'Customer1',
  //       //   brandType: 'Clothing',
  //       //   brand: 'Pantaloons',
  //       // },
  //       // {
  //       //   customer: 'InstaS',
  //       //   brandType: 'F&B',
  //       //   brand: 'Mc Donalds',
  //       // },
  //     ], // inseting value now just for checking validation
  //     addCustomerRows: initialAddCustomerState,
  //     customerList: [],
  //     brandTypeList: [],
  //     brandList: [],
  //     isError: false,
  //   },
  //   {
  //     id: 4,
  //     title: 'Assign Department and roles',
  //     status: '',
  //     isSaved: false,
  //     addDeptRows: initialAddDeptState,
  //     assignedDepartmentAndRoles: [],
  //     selectedPropertyList: [],
  //     rolesList: [],
  //     isError: false,
  //   },
  // ],
};

const userAccess = (state = initialState, action) => {
  switch (action.type) {
    case RESET_USERDATA_TO_INITIAL_STATE:
      return {
        ...state,
        userAndAccessSteps: _.cloneDeep(initialUserAccessStepsState),
        userId: '',
      };
    case SET_USER_LIST_IS_LOADING:
      return {
        ...state,
        userListIsLoading: action.isLoading,
      };

    case SET_USER_LIST:
      return {
        ...state,
        userList: action.list,
        userListIsLoading: false,
      };
    case SET_USER_LIST_COUNT: {
      return {
        ...state,
        userListCount: action.count,
      };
    }

    case SET_USER_TYPE_LIST: {
      return {
        ...state,
        userTypeList: action.list,
      };
    }

    case SET_USER_ID: {
      return {
        ...state,
        userId: action.userId,
      };
    }
    case SET_WIZARD_STEPS_USER_ACCESS:
      return {
        ...state,
        userAndAccessSteps: action.steps,
      };
    case SET_COMPANY_LIST: {
      let data = state.userAndAccessSteps;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 1) {
          item.companyList = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        userAndAccessSteps: data,
      };
    }

    case SET_USER_ACCESS_TYPE_LIST: {
      return {
        ...state,
        userAccessTypeList: action.list,
      };
    }

    case SET_CUSTOMER_LIST: {
      let data = state.userAndAccessSteps;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 2) {
          item.customerList = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        userAndAccessSteps: data,
      };
    }
    case SET_BRAND_TYPE_LIST: {
      let data = state.userAndAccessSteps;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 2) {
          item.brandTypeList = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        userAndAccessSteps: data,
      };
    }
    case SET_BRAND_LIST: {
      let data = state.userAndAccessSteps;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 2) {
          item.brandList = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        userAndAccessSteps: data,
      };
    }
    case SET_SELECTED_PROPERTY_LIST: {
      let data = state.userAndAccessSteps;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 3 || i === 2) {
          item.selectedPropertyList = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        userAndAccessSteps: data,
      };
    }
    // case SET_ROLES_LIST: {
    //   let data = state.userAndAccessSteps;
    //   data = data.map((_item, i) => {
    //     const item = _item;
    //     if (i === 3) {
    //       item.rolesList = action.list;
    //       return item;
    //     }
    //     return item;
    //   });
    //   return {
    //     ...state,
    //     userAndAccessSteps: data,
    //   };
    // }

    case SET_ASSIGNED_ACCESS: {
      let data = state.userAndAccessSteps;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 1) {
          item.assignedAccess = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        userAndAccessSteps: data,
      };
    }

    case SET_ASSIGNED_CUSTOMER: {
      let data = state.userAndAccessSteps;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 2) {
          item.assignedCustomer = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        userAndAccessSteps: data,
      };
    }

    case SET_ASSIGNED_DEPARTMENT: {
      let data = state.userAndAccessSteps;
      data = data.map((_item, i) => {
        const item = _item;
        if (i === 3) {
          item.assignedDepartmentAndRoles = action.list;
          return item;
        }
        return item;
      });
      return {
        ...state,
        userAndAccessSteps: data,
      };
    }

    default:
      return state;
  }
};

export default userAccess;
