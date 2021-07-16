// import _ from 'lodash';
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
import constants from '../utils/constants';
import fetchClient from '../utils/axiosConfig';
import { fieldSorter } from '../utils/utils';

// setWizardSteps
export const setWizardSteps = steps => ({
  type: SET_FORM_WIZARD_STEPS,
  steps,
});

// setFormId
export const setFormId = formId => ({
  type: SET_FORM_ID,
  formId,
});

/**
 * Store Fomrs List in Reducer(desingForms)
 * @param {Array} list
 */

export const setFormsList = (list, totalCount) => ({
  type: SET_FORMS_LIST,
  list,
  totalCount,
});

// error handling

/**
 * API CALL for Get forms List
 */

export const getFormsApiAction = (_page = 1, _search = '') => {
  const queryParams = {
    params: {
      page: _page,
      limit: 10,
      search: _search,
    },
  };
  /** Here there will be api calling for Getting Design Forms list */
  return fetchClient.get(constants.API.DESIGN_FORMS.LIST, queryParams);
};

/**
 * API CALL to delete Forms
 * @param {String} uuid
 */

export const deleteDesignFormApiAction = _uuid => {
  return fetchClient.put(`${constants.API.DESIGN_FORMS.DELETE}/${_uuid}`);
};

/**
 * API CALL to check form is editable or not
 * @param {String} uuid
 */

export const checkDesignFormEditableApiAction = _uuid => {
  return fetchClient.post(`${constants.API.DESIGN_FORMS.IS_EDITABLE}`, {
    module: 'form-design',
    refId: _uuid,
    operation: 'edit',
  });
};

/**
 * API CALL to check list item is editable or deletable or not
 * @param {String} module 
 * @param {String} refId 
 * @param {String} operation 
 * 
    module: 'form-design',
    refId: _uuid,
    operation: 'edit',

 */

export const checkItemActionable = (module, refId, operation) => {
  return fetchClient.post(`${constants.API.DESIGN_FORMS.IS_EDITABLE}`, {
    module,
    refId,
    operation,
  });
};

/** **************** STEP 1 ***************** */

/**
 * Fitout Types Dropdown API CAll
 */

export const setFitOutTypesListForDesingForm = list => ({
  type: SET_FITOUT_TYPES_DESING_FORM_LIST,
  list,
});

export const getFitOutTypesListForDesignFormsApiAction = () => {
  return dispatch => {
    /** Here there will be api calling for Getting CaseTypes list */
    fetchClient
      .get(constants.API.DESIGN_FORMS.CASE_TYPES)
      .then(_response => {
        if (_response.data.success) {
          if (_response.data.data.length) {
            dispatch(setFitOutTypesListForDesingForm(_response.data.data));
          } else {
            throw new Error('Fitout Type List is Empty');
          }
        } else {
          throw new Error('Fitout Type Api Failure');
        }
      })
      .catch(_error => {
        dispatch(setFitOutTypesListForDesingForm([]));
      });
  };
};

/**
 * Design Subphases Dropdown API CAll
 */

export const setDesignSubPhasesList = list => ({
  type: SET_DESIGN_SUBPHASES_LIST,
  list,
});

export const getDesignSubPhasesListApiAction = () => {
  return dispatch => {
    /** Here there will be api calling for Getting CaseTypes list */
    fetchClient
      .get(constants.API.DESIGN_FORMS.DESIGN_SUB_PHASES)
      .then(_response => {
        if (_response.data.success) {
          if (_response.data.data.length) {
            const { subPhases } = _response.data.data[0];
            const designSubPhasesArray = subPhases.filter(
              subPhase =>
                subPhase.phaseTypeName.toUpperCase() === 'DESIGN' &&
                subPhase.isMandatory,
            );

            // set sequence of design subphases
            const designSubPhasesArrayInSequence = designSubPhasesArray.sort(
              fieldSorter(['propertySubphaseSequence']),
            );
            dispatch(setDesignSubPhasesList(designSubPhasesArrayInSequence));
          } else {
            throw new Error('Subphase List is Empty');
          }
        } else {
          throw new Error('Subphase Api Failure');
        }
      })
      .catch(_error => {
        dispatch(setDesignSubPhasesList([]));
      });
    // dispatch(setDesignSubPhasesList(designSubPhases.data));
  };
};

export const saveDesignFormStep1Data = (formData, isAddRequest, _uuid) => {
  let requestQuery = '';
  if (isAddRequest) {
    requestQuery = fetchClient.post(
      constants.API.DESIGN_FORMS.STEP_1_ADD,
      formData,
    );
  } else {
    requestQuery = fetchClient.put(
      `${constants.API.DESIGN_FORMS.STEP_1_EDIT}/${_uuid}`,
      formData,
    );
  }
  return requestQuery;
};

//  saveDesignFormStep2Data
export const saveDesignFormStep2Data = (formData, isAddRequest, _uuid) => {
  let requestQuery = '';
  if (isAddRequest) {
    requestQuery = fetchClient.post(
      constants.API.DESIGN_FORMS.STEP_2_ADD,
      formData,
    );
  } else {
    requestQuery = fetchClient.put(
      `${constants.API.DESIGN_FORMS.STEP_2_EDIT}/${_uuid}`,
      formData,
    );
  }
  return requestQuery;
};

// saveDesignFormStep3Data
export const saveDesignFormStep3Data = (formData, isAddRequest, _uuid) => {
  let requestQuery = '';
  if (isAddRequest) {
    requestQuery = fetchClient.post(
      constants.API.DESIGN_FORMS.STEP_3_ADD,
      formData,
    );
  } else {
    requestQuery = fetchClient.put(
      `${constants.API.DESIGN_FORMS.STEP_3_EDIT}/${_uuid}`,
      formData,
    );
  }
  return requestQuery;
};

// saveDesignFormStep4Data
export const saveDesignFormStep4Data = (formData, isAddRequest, _uuid) => {
  let requestQuery = '';
  if (isAddRequest) {
    requestQuery = fetchClient.post(
      constants.API.DESIGN_FORMS.STEP_4_ADD,
      formData,
    );
  } else {
    requestQuery = fetchClient.put(
      `${constants.API.DESIGN_FORMS.STEP_4_EDIT}/${_uuid}`,
      formData,
    );
  }
  return requestQuery;
};

/**
 * getfileTypeOptionsListApiAction: file types options request
 */

export const setFileTypesOptions = list => ({
  type: SET_FILE_TYPES_LIST,
  list,
});

export const getfileTypeOptionsListApiAction = () => {
  return dispatch => {
    /** Here there will be api calling for file types list */
    fetchClient
      .get(constants.API.DESIGN_FORMS.FILE_TYPES)
      .then(_response => {
        if (_response.data.success) {
          if (_response.data.data.length) {
            dispatch(setFileTypesOptions(_response.data.data));
          } else {
            throw new Error('File Type List is Empty');
          }
        } else {
          throw new Error('File Type Api Failure');
        }
      })
      .catch(_error => {
        dispatch(setFileTypesOptions([]));
      });
  };
};

/**
 * get form data and set it to reducer
 * @param {*} formId
 */

// setFormData
export const setFormData = (response, _getState) => () => {
  const stepsData = _getState().designForms.setUpDesignForm;
  if (response) {
    // step 1
    stepsData[0].step1Data.formNames = response.names;
    stepsData[0].step1Data.caseType.ctId = response.ctId;
    stepsData[0].step1Data.subPhase.subPhaseId = response.sphId;
    // step 2
  }
  return {
    type: SET_FORM_DATA,
    steps: stepsData,
  };
};

// setIsLoading
export const setIsLoading = isLoading => ({
  type: SET_IS_FORM_LOADING,
  isLoading,
});

// getFormDataAPiAction
export const getFormDataAPiAction = formId => {
  return (_dispatch, _getState) => {
    _dispatch(setIsLoading(true));
    /** Here there will be api calling for file types list */
    fetchClient
      .get(`${constants.API.DESIGN_FORMS.GET_FORM_DATA}/0/${formId}`)
      .then(_response => {
        if (_response.data.success) {
          if (_response.data.data.length) {
            _dispatch(setFormData(_response.data.data[0], _getState));
            _dispatch(setIsLoading(false));
          } else {
            throw new Error('Form Data List is Empty');
          }
        } else {
          throw new Error('Form Data Api Failure');
        }
      })
      .catch(_error => {
        _dispatch(setIsLoading(false));
        _dispatch(setFormData('', _getState));
      });
  };
};

// get form data step wise
export const getFormDataStepWise = (_step, _uuid, _lang) => {
  return fetchClient.get(
    `${constants.API.DESIGN_FORMS.GET_FORM_DATA}/${_step}/${_uuid}`,
    {
      headers: {
        'Accept-Language': _lang || 'en',
      },
    },
  );
};

// resetDesignFormAction
export const resetDesignFormAction = () => ({
  type: RESET_DESIGN_FORM,
});

// saveDesignFormStep5Data

// saveDesignFormStep4Data
export const saveDesignFormStep5Data = _uuid => {
  let requestQuery = '';
  // if (isAddRequest) {
  requestQuery = fetchClient.post(constants.API.DESIGN_FORMS.STEP_5_ADD, {
    formId: _uuid,
  });
  // } else {
  //   requestQuery = fetchClient.put(
  //     `${constants.API.DESIGN_FORMS.STEP_5_EDIT}/${_uuid}`,
  //      {
  //       formId: _uuid
  //     },
  //   );
  // }
  return requestQuery;
};
