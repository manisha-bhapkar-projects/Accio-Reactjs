import {
  SET_FORMS_LIST,
  SET_FORM_WIZARD_STEPS,
  SET_FITOUT_TYPES_DESING_FORM_LIST,
  SET_DESIGN_SUBPHASES_LIST,
  SET_FORM_ID,
  SET_FILE_TYPES_LIST,
  SET_FORM_DATA,
  SET_IS_FORM_LOADING,
  RESET_DESIGN_FORM,
} from '../types';
import labels from '../utils/Locales/labels';

const initialState = {
  formId: '',
  list: [],
  totalCount: 0,
  isloading: false,
  setUpDesignForm: [
    {
      id: 1,
      title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.TITLE_1,
      status: 'current',
      isSaved: false,
      isError: false,
      step1Data: {
        formNames: [],
        formNamesForReset: [],
        caseType: {
          ctId: '',
          ctIdForReset: '',
          isError: false,
        },
        subPhase: {
          subPhaseId: '',
          subPhaseIdForReset: '',
          isError: false,
        },
      },
      response: {},
    },
    {
      id: 2,
      title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.TITLE_2,
      status: '',
      isSaved: false,
      isError: false,
      step2Data: {
        notes: [],
        notesForReset: [],
        specifications: [],
        specificationsForReset: [],
        activeLanguage: 'en',
        activeLanguageForReset: 'en',
      },
      response: {},
    },
    {
      id: 3,
      title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.TITLE_3,
      status: '',
      isSaved: false,
      isError: false,
      step3Data: {
        formSections: [],
        formSectionsForReset: [],
      },
      response: {},
    },
    {
      id: 4,
      title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.TITLE_4,
      status: '',
      isSaved: false,
      step4Data: {
        sectionsFiles: [],
        sectionsFilesForReset: [],
      },
      response: {},
    },
    {
      id: 5,
      title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_5.TITLE_5,
      status: '',
      isSaved: false,
      step5Data: {
        activeLanguage: 'en',
      },
    },
  ],
  // Step 1
  caseTypes: [],
  designSubPhases: [],
  isDesignSubPhasesListFetched: false,
  // Step 4
  fileTypes: [],
};

const designForms = (state = initialState, action) => {
  switch (action.type) {
    case SET_FORMS_LIST:
      return {
        ...state,
        list: action.list,
        totalCount: action.totalCount,
        isloading: false,
      };
    case SET_FORM_WIZARD_STEPS:
      return {
        ...state,
        setUpDesignForm: action.steps,
      };
    case SET_FITOUT_TYPES_DESING_FORM_LIST:
      return {
        ...state,
        caseTypes: action.list,
      };
    case SET_DESIGN_SUBPHASES_LIST:
      return {
        ...state,
        designSubPhases: action.list,
        isDesignSubPhasesListFetched: true,
      };
    case SET_FORM_ID:
      return {
        ...state,
        formId: action.formId,
      };
    case SET_FILE_TYPES_LIST:
      return {
        ...state,
        fileTypes: action.list,
      };
    case SET_FORM_DATA:
      return {
        ...state,
        setUpDesignForm: action.steps,
      };
    case SET_IS_FORM_LOADING:
      return {
        ...state,
        isloading: action.isLoading,
      };
    case RESET_DESIGN_FORM:
      return {
        ...state,
        setUpDesignForm: [
          {
            id: 1,
            title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.TITLE_1,
            status: 'current',
            isSaved: false,
            isError: false,
            step1Data: {
              formNames: [],
              formNamesForReset: [],
              caseType: {
                ctId: '',
                ctIdForReset: '',
                isError: false,
              },
              subPhase: {
                subPhaseId: '',
                subPhaseIdForReset: '',
                isError: false,
              },
            },
            response: {},
          },
          {
            id: 2,
            title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.TITLE_2,
            status: '',
            isSaved: false,
            isError: false,
            step2Data: {
              notes: [],
              notesForReset: [],
              specifications: [],
              specificationsForReset: [],
              activeLanguage: 'en',
              activeLanguageForReset: 'en',
            },
            response: {},
          },
          {
            id: 3,
            title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.TITLE_3,
            status: '',
            isSaved: false,
            isError: false,
            step3Data: {
              formSections: [],
              formSectionsForReset: [],
            },
            response: {},
          },
          {
            id: 4,
            title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.TITLE_4,
            status: '',
            isSaved: false,
            step4Data: {
              sectionsFiles: [],
              sectionsFilesForReset: [],
            },
            response: {},
          },
          {
            id: 5,
            title: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_5.TITLE_5,
            status: '',
            isSaved: false,
            step5Data: {
              activeLanguage: 'en',
            },
          },
        ],
        formId: '',
        totalCount: 0,
        isDesignSubPhasesListFetched: false,
      };
    default:
      return state;
  }
};

export default designForms;
