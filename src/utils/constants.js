const API_URL = process.env.REACT_APP_API_URL;

export default {
  BASE_URL: {
    API: `${API_URL}/api`,
  },
  API: {
    GLOBAL: {
      USER_LANGUAGE_PREFERENCE: '/v1/admin/user-preference/',
      IS_ALLOW_DELETE_EDIT: '/v1/admin/is-operation-allow/check',
    },
    LOGIN: {
      SIGNUP: '/v1/auth/sign-in',
      REFRESH_TOKEN: '/v1/auth/token',
      LOGOUT: '/v1/auth/logout',
    },
    HEADER: {
      USER_PROPERTIES: '/v1/admin/user-property-access',
    },
    DATE_PICKER: {
      HOLIDAY: '/case/properties-weekOffDays-holidays',
    },
    BUSINESS: {
      SIDEBAR: {
        SIDEBAR: '/case/left-menus?caseId=',
      },
      CASE_LISTING: {
        CASE_LIST_DETAILS: '/dashboard/case-list',
        PHASEWISE_LIST_DETAILS: '',
        USER_ACCESS_PROPERTY_LIST: '',
        IS_CASE_MANIPULATE_ACCESS: '',
      },
      ADD_OR_UPDATE_MILESTONES: {
        WORKFLOWS_LIST:
          '/kick-off/case-milestone/workflows?caseType=d7e2ee5e-2649-4212-b234-8da95a82107a',
        TEST: '/kick-off/users/types',
      },
    },
    WORKFLOWS: {
      LIST: '/v1/admin/workflow/list',
      DELETE: '/v1/admin/workflow/delete/', // :uuid
      DETAILS: '/v1/admin/workflow/details/', // uuid
      GET_PRE_REQUISITES_STATUS: '/v1/admin/workflow/is-added-by-pr-admin',
      CASE_TYPES: '/v1/admin/case-types', // step 1 fit out list
      // STEP_1: '/v1/admin/workflow/workflow-add1',
      STEP_1: '/v1/admin/workflow/add/1',
      STEP_1_EDIT: '/v1/admin/workflow/edit/1/',
      STEP_2: '/v1/admin/workflow/edit/2/',
      STEP_3: '/v1/admin/workflow/edit/3/',
      STEP_4: '/v1/admin/workflow/edit/4/',
      STEP_5: '/v1/admin/workflow/edit/5/',
      GET_PRE_REQUISITES: '/v1/admin/pre-requisites-group',
      GET_PRE_REQUISITES_DETAILS: '/v1/admin/workflow/pre-requisites/details/',
    },
    PHASES_AND_MORE: {
      GET_PHASES_LIST: '/v1/admin/phases/list',
      POST_PHASES_LIST: '/v1/admin/phases/add-phases',
      PUT_PHASES_LIST: '/v1/admin/phases/update-phases',
      GET_SUB_PHASES_LIST: '/v1/admin/subphases/list',
      POST_SUB_PHASES_LIST: '/v1/admin/subphases/add-subphases',
      PUT_SUB_PHASES_LIST: '/v1/admin/subphases/update-subphases',
    },
    PREREQUISITE: {
      PREREQUISITE_LIST: '/v1/admin/pre-requisites',
      PREREQUISITE_FIELDS: '/v1/admin/pre-requisites-field-types',
      PREREQUISITE_DETAILS: '/v1/admin/pre-requisites/details/',
      PREREQUISITE_ADD: '/v1/admin/pre-requisites/add',
      PREREQUISITE_EDIT: '/v1/admin/pre-requisites/edit/',
      PREREQUISITE_DELETE: '/v1/admin/pre-requisites/delete/',
      PREREQUISITE_COPY: '/v1/admin/pre-requisites/copy/',
    },
    PREREQUISITE_GROUP: {
      PREREQUISITE_GROUP_LIST: '/v1/admin/pre-requisites-group',
      PREREQUISITE_GROUP_DETAILS: '/v1/admin/pre-requisites-group/details/',
      PREREQUISITE_GROUP_ADD: '/v1/admin/pre-requisites-group/add',
      PREREQUISITE_GROUP_EDIT: '/v1/admin/pre-requisites-group/edit/',
      PREREQUISITE_GROUP_DELETE: '/v1/admin/pre-requisites-group/delete/',
      PREREQUISITE_GROUP_COPY: '/v1/admin/pre-requisites-group/copy/',
    },
    DESIGN_FORMS: {
      LIST: '/v1/admin/form-design',
      DELETE: '/v1/admin/form-design/delete', // :uuid
      IS_EDITABLE: '/v1/admin/is-operation-allow/check',
      CASE_TYPES: '/v1/admin/case-types',
      FILE_TYPES: '/v1/admin/file-types',
      DESIGN_SUB_PHASES: '/v1/admin/subphases/list',
      GET_FORM_DATA: '/v1/admin/form-design/details',
      STEP_1_ADD: '/v1/admin/form-design/add/1',
      STEP_1_EDIT: '/v1/admin/form-design/edit/1',
      STEP_2_ADD: '/v1/admin/form-design/add/2',
      STEP_2_EDIT: '/v1/admin/form-design/edit/2',
      STEP_3_ADD: '/v1/admin/form-design/add/3',
      STEP_3_EDIT: '/v1/admin/form-design/edit/3',
      STEP_4_ADD: '/v1/admin/form-design/add/4',
      STEP_4_EDIT: '/v1/admin/form-design/edit/4',
      STEP_5_ADD: '/v1/admin/form-design/add/5',
      STEP_5_EDIT: '/v1/admin/form-design/edit/5',
    },
    USER_AND_ACCESS: {
      USER_LISTING: '/v1/admin/user/access/list',
      USER_TYPE_LIST: '/v1/admin/user-type/list',
      // PROPERTY_FILTER_LIST: '',
      COMPANY_LIST: '/v1/admin/company/list',
      LLC_LIST: '/v1/admin/llc/list',
      PROPERTY_LIST_ON_COMPANY_LLC: '/v1/admin/property/list',
      ASSIGNED_ACCESS: '/v1/admin/user/access/property',
      ASSIGNED_CUSTOMER: '/v1/admin/user/access/companyAndBrand',
      CUSTOMER_LIST: '/v1/admin/customer/list',
      BRAND_TYPE_LIST: '/v1/admin/brand-type/list',
      BRAND_LIST: '/v1/admin/brand/list',
      ASSIGNED_DEPARTMENT_AND_ROLES: '/v1/admin/user/access/departmentAndRole',
      ASSIGNED_PROPERTY_LIST: '/v1/admin/property-list', // this is for step 3,4 property dropdown
      DEPARTMENT_LIST: '/v1/admin/department/list',
      ROLES_LIST: '/v1/admin/role/list',
      USER_ACCESS_TYPE_LIST: '/v1/admin/access-type/list',
      SAVE_ADD_UPDATE_USER_STEP1: '/v1/admin/user/access/addUser',
      SAVE_UPDATE_USER_STEP1: '/v1/admin/user/access/updateUser',
      CHECK_EMAIL_EXISTS: '/v1/admin/user/access/checkUserEmailAlreadyExists',
      SAVE_ASSIGN_PROPERTY_AND_ACCESS_STEP2:
        '/v1/admin/user/access/addUserProperty',
      SAVE_ASSIGN_CUSTOMER_AND_BRAND_STEP3:
        '/v1/admin/user/access/addUserCustomerAndBrand',
      SAVE_ASSIGN_DEPARTMENT_AND_ROLES_STEP4:
        '/v1/admin/user/access/addUserDepartmentAndRole',
      DELETE_PROPERTY_AND_ACCESS: '/v1/admin/user/access/deleteUserProperty',
      DELETE_CUSTOMER_AND_BRAND:
        '/v1/admin/user/access/deleteUserCompanyAndBrand',
      DELETE_DEPARTMENT_AND_ROLES:
        '/v1/admin/user/access/deleteUserDepartmentAndRole',
      GET_USER_DATA: '/v1/admin/user/access/details',
      REMOVE_ACCESS_ON_USER_TYPE_CHANGE: '/v1/admin/user/aceess/delete',
    },
  },
  STORAGE: {
    AUTH: {
      TOKEN: 'auth-token',
      REFRESH_TOKEN: 'refresh-token',
      USER_DATA: 'auth-data',
      USER_APP_STATUS: 'user-app-status',
      USER_APP_TYPE_ADMIN: 'admin',
      USER_APP_TYPE_BUSINESS: 'business',
      COMPANIES: 'companie',
    },
  },
  ROUTE: {
    LOGIN: {
      SIGNUP: '/',
      FORGOT_PASSWORD: '/forgotpassword',
      CHANGE_PASSWORD: '/changepassword',
    },
    DASHBORD: {
      DASHBORD: '/accio/',
    },
    PROPERTY_SETUP: {
      PROPERTY_SETUP: '#', // property-setup
    },
    DEPARTMENT_AND_ROLES: {
      DEPARTMENT_AND_ROLES: '/department-and-roles',
    },
    USER_AND_ACCESS: {
      LIST: '/user-and-access',
      USER_AND_ACCESS_SETUP: '/user-and-access/user-and-access-setup/:userId?',
    },
    PHASES_AND_MORE: {
      PHASES_AND_MORE: '/phases-and-more',
      ADD_UPDATE_PHASES: '/phases-and-more/add-or-update-phases',
      ADD_UPDATE_SUBPHASES: '/phases-and-more/add-or-update-sub-phases',
      ADD_UPDATE_PRE_REQUISITE:
        '/phases-and-more/add-update-pre-requisites-listing',
      ADD_UPDATE_PRE_REQUISITE_GROUP:
        '/phases-and-more/add-update-pre-requisites-groups-listing',
      CREATE_ADD_UPDATE_PRE_REQUISITE:
        '/phases-and-more/add-update-pre-requisites-listing/add-update-prerequisite/:prerequisiteId?',
      CREATE_ADD_UPDATE_PRE_REQUISITE_GROUP:
        '/phases-and-more/add-update-pre-requisites-groups-listing/add-update-prerequisite-group/:prerequisiteGroupId?',
    },
    WORKFLOWS: {
      LIST: '/workflows',
      CREATE_SETUP_WORKFLOW: '/setup-new-workflow/',
      EDIT_SETUP_WORKFLOW_ID: '/setup-workflow/:id',
      EDIT_SETUP_WORKFLOW_FOR_ID: '/setup-workflow/',
    },
    DESIGN_FORMS: {
      LIST: '/design-forms',
      CREATE_DESIGN: '/design-forms/setup-design-form/',
      EDIT_DESIGN: '/design-forms/setup-design-form/:id',
    },
    ADMIN_ROLES: {
      LIST: '#', // admin-roles
    },
  },

  /** Business application Constants */

  BUSINESS: {
    // BASE_URL: {
    //   API: 'http://15.185.169.116:5001/api/v1',
    // },
    API: {
      GLOBAL: {},
      ASSIGN_TEAM: {
        GET_USERS_TYPE: '/v1/kick-off/users/types',
        GET_TEAM: '/v1/kick-off/team',
        GET_ROLES: '/v1/kick-off/users/roles?uType=',
        GET_USERS: '/v1/kick-off/users?roleRefId=',
        GET_PRE_APPROVED_CONTRACTORS:
          '/v1/kick-off/get-pre-approved-contractors',
        ADD_UPDATE_TEAM: '/v1/kick-off/team',
        DELETE_TEAM_MEMBER: '/v1/kick-off/team/',
      },
      KICK_OFF_MEETING_AND_SIGN_OFF: {
        UPLOAD_SIGNED_DOCUMENT: '/v1/kick-off/upload-doc',
        ADD_ATTENDEE: '/v1/kick-off/meeting/attendee',
        ADD_NOTES: '/v1/kick-off/meeting/notes',
        MEETING: '/v1/kick-off/meeting',
        MEETING_ATTENDEE: '/v1/kick-off/meeting/attendee',
      },
      CASE_LISTING: {
        CASE_LIST_DETAILS: '/v1/case/case-list',
        PHASEWISE_LIST_DETAILS: '/v1/case/donut-chart',
        USER_ACCESS_PROPERTY_LIST: '',
        IS_CASE_MANIPULATE_ACCESS: '',
        CASE_STATUS: '/v1/case/case-statuses',
        USER_TYPES: '/v1/case/user-types',
      },

      NEW_AND_UNASSIGNED: {
        CASE_DETAILS: {
          USER_PROPERTY_LIST: '/v1/case/properties',
          USER_CUSTOMER_LIST: '/v1/case/customers',
          USER_BRANDS_LIST: '/v1/case/brands',
          CASE_TYPE_LIST: '/v1/case/case-types',
          AMENDMENT_TYPES_LIST: '/v1/case/amendmentTypes',
          UNIT_IDS_LIST: '/v1/case/units',
          PROPERTY_PHASE_LIST: '/v1/case/property/phases',
          PROPERTY_UOM_LIST: '/v1/case/uom',
          CREATE_CASE: '/v1/case/create',
          GET_CASE_DETAILS: '/v1/case/details',
          DELETE_UNIT_DETAILS: '/v1/case/delete/unit-details',
          UPDATE_CASE_PROPERTY_DETAILS: '/v1/case/update-case/details',
          UPDATE_LEASE_DETAILS: '/v1/case/update-lease/details',
          UPDATE_UNIT_DETAILS: '/v1/case/update-property-case-unit/details',
          UPDATE_MILESTONE_DATES:
            '/v1/case/update-property-milestone-dates/details',
        },
      },
    },
    ROUTE: {
      NEW_AND_UNASSIGN: {
        NEW_AND_UNASSIGN: '/new-and-unassign',
        ASSIGN_TENANT_CORDINATOR:
          '/new-and-unassign/assign-tenant-cordinator/:caseId',
      },
      KICK_OFF: {
        KICK_OFF_SIGN_OFF:
          '/kick-off/kick-off-Meeting-sign-off/kick-off-sign-off',
        KICK_OF: '/kick-off',
        ASSIGN_OWNER_TEAM_MEMBERS: '/kick-off/Assign-owner-team-members',
        ASSIGN_TENANT_TEAM_MEMBERS: '/kick-off/assign-tenant-team-members',
        ADD_OR_UPDATE_MILESTONES: '/kick-off/add-or-Update-milestones',
        SCHEDULE_KICK_OFF_MEETING: '/kick-off/schedule-kick-off-meeting',
        KICK_OFF_MEETING_SIGN_OFF: '/kick-off/kick-off-Meeting-sign-off',
      },
      CASE_DETAILS: {
        CASE_DETAILS: '/case-details/:caseId?',
      },
      SETUP_WORKFLOW: {
        SETUP_WORKFLOW: '/setup-workflow',
      },
      DESIGN: {
        DESIGN: '/design',
        INITIAL_CONCEPT_DESIGN: '/design/initial-concept-design',
        PRELIMINARY_DESIGN: '/design/preliminary-design',
        FINAL_DESIGN: '/design/final-design',
        MEP_DETAILED_DESIGN: '/design/mep-detailed-design',
        CLOSE_DESIGN: '/design/close-design-phase',
      },
      PRE_REQUISITES: {
        PRE_REQUISITES: '/pre-requisites',
      },
      UNIT_HANDOVER_FITOUT: {
        UNIT_HANDOVER_FITOUT: '/unit-handover-fitout',
        UNIT_HANDOVER_AND_SIGNOFF:
          '/unit-handover-fitout/unit-handover-and-sign-off',
        GENERAL_INSOECTION_3PARTY:
          '/unit-handover-fitout/general-inspection-3rd-party',
        ARCHITECTURAL_INSPECTION:
          '/unit-handover-fitout/architectural-inspection',
        MEP_INSPECTION: '/unit-handover-fitout/mep-inspection',
        FIRE_INSPECTION: '/unit-handover-fitout/fire-inspection',
        FINAL_INSPECTION: '/unit-handover-fitout/final-inspection',
        CLOSE_UNIT_HANDOVER_AND_FITOUT:
          '/unit-handover-fitout/close-unit-handover-and-fitout',
      },
      UNIT_OPENING: {
        UNIT_OPENING: '/unit-opening',
        RISK_AND_SECURITY_INSPECTION: '/unit-opening/risk-security-inspection',
        HEALTH_AND_SAFETY_INSPECTION:
          '/unit-opening/health-and-safety-inspection',
        SEEK_APPROVAL_TO_TRADE: '/unit-opening/seek-approval-to-trade',
        CLOSE_UNIT_OPENING_PHASE: '/unit-opening/close-unit-opening',
      },
      CLOSURE: {
        CLOSURE: '/closure',
        FINAL_PENDING_SNAG_LIST_CHECK: '/closure/final-pending-snag-list-check',
        CLOSE_CASE: '/closure/close-case',
      },
    },
  },
  SEARCH_DEBOUNCE_WAIT_TIME: 500,
  // LANG: [
  //   {
  //     language: 'english',
  //     languageCode: 'en',
  //   },
  //   {
  //     language: 'arabic',
  //     languageCode: 'ar',
  //   },
  //   {
  //     language: 'french',
  //     languageCode: 'fr',
  //   },
  //   {
  //     language: 'Simplified Chinese',
  //     languageCode: 'zh',
  //   },
  // ],
};
