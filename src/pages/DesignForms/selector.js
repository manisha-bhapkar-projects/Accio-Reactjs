import { createSelector } from 'reselect';
import { getPrimaryLanguage } from '../../utils/utils';

export const getDesignForms = state => state.designForms.list;
export const getSteps = state => state.designForms.setUpDesignForm;
export const getFormId = state => state.designForms.formId;

export const getDesignFormsList = createSelector(
  [getDesignForms],
  designForms => {
    return designForms.map((designForm, index) => {
      return {
        id: index + 1,
        uuid: designForm.refId,
        form: designForm.formName,
        fitout: designForm.ctName,
        sub_phase: designForm.sphName,
        modified_by: designForm.editor.name,
        modified_on: designForm.updatedAt,
      };
    });
  },
);

// getFormsTotalCount
export const getFormsTotalCount = state => state.designForms.totalCount;

/**
 * Step 1
 */

// FitoutTypeList
export const getIsLoading = state => state.designForms.isloading;

//
export const getFormNames = state =>
  state.designForms.setUpDesignForm[0].step1Data.formNames;

// FitoutTypeList
const getFitOutTypes = state => state.designForms.caseTypes;

export const getFitOutTypesList = createSelector([getFitOutTypes], types => {
  return types.map(type => {
    return {
      id: type.refId,
      value: type.cname,
    };
  });
});

// DesignSubPhasesList
const getDesignSubPhases = state => state.designForms.designSubPhases;

// isDesignSubPhasesListFetched
export const isDesignSubPhasesListFetched = state =>
  state.designForms.isDesignSubPhasesListFetched;

export const getDesignSubPhasesList = createSelector(
  [getDesignSubPhases, getPrimaryLanguage],
  (subPhases, primaryLanguage) => {
    const designSubPhasesList = [];
    subPhases.forEach(subPhase => {
      const indexOfPrimaryLabel = subPhase.labels.findIndex(
        label => label.languageCode === primaryLanguage,
      );
      if (indexOfPrimaryLabel >= 0) {
        designSubPhasesList.push({
          id: subPhase.propertySubPhasesId,
          value: subPhase.labels[indexOfPrimaryLabel].propertySubPhaseName,
        });
      }
    });
    return designSubPhasesList;
  },
);

// step 4

export const fileTypesOptions = state => state.designForms.fileTypes;

// getFileTypesOptions
export const getFileTypesOptions = createSelector(
  [fileTypesOptions],
  fileTypes => {
    return fileTypes.map(file => {
      return {
        id: file.refId,
        value: file.ext,
        label: file.ext,
        fileType: file.fileType,
      };
    });
  },
);

export const getWidthByLength = (length, index) => {
  switch (length) {
    case 1:
      return '30%';
    case 2:
      return length === 2 && index === 1 ? '50%' : '100%';
    case 3:
      return '100%';
    default:
      return '100%';
  }
};
