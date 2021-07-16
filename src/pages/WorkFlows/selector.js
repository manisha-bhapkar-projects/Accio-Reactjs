import { createSelector } from 'reselect';

export const getLanguages = state => state.common.userLanguages;
export const getWorkFlows = state => state.workFlows.list;
export const getWorkFlowisLoading = state => state.workFlows.isloading;
export const getSteps = state => state.workFlows.setUpWorkFlow;
export const getIsModify = state => state.workFlows.isFormModify;
export const getrequisites = state => state.workFlows.requisites;
const getFitOutTypes = state => state.workFlows.fitOutTypes;
export const getStepsPhases = state => state.workFlows.setUpWorkFlow[2].list;
const getPreviewData = state => state.workFlows.setUpWorkFlow[4].list;
const getActiveLanguage = state =>
  state.workFlows.setUpWorkFlow[4].activeLanguage;
export const getPopupDataSelector = state =>
  state.workFlows.setUpWorkFlow[4].preRequisiteItem;
export const getListTotalCountSelector = state =>
  state.workFlows.list_total_count;

const selectPrerequisite = state =>
  state.workFlows.setUpWorkFlow[3].select_prerequisite
    ? state.workFlows.setUpWorkFlow[3].select_prerequisite
    : '';

export const getStep5DataSelector = createSelector(
  [getPreviewData, getActiveLanguage],
  (preview, activeLanguage) => {
    const newPreview = [];
    for (let i = 0; i < preview.length; i += 1) {
      const subPhase = [];
      const actionTask = [];
      if (preview[i].preRequisites) {
        for (let j = 0; j < preview[i].preRequisites.length; j += 1) {
          if (preview[i].preRequisites[j].phaseId === preview[i].refId) {
            let preName = '';
            if (preview[i].preRequisites[j].names.length) {
              const nameObj = preview[i].preRequisites[j].names.find(
                ({ languageCode }) => languageCode === activeLanguage,
              );
              if (nameObj) {
                preName = nameObj.name;
              }
            }

            const newPri = {
              ...preview[i].preRequisites[j],
              name: preName,
              subPhases: [],
              isPrerequistes: true,
              isMandatory: true,
            };
            newPreview.push(newPri);
          }
        }
      }
      for (let j = 0; j < preview[i].subPhases.length; j += 1) {
        if (preview[i].subPhases[j].isMandatory) {
          subPhase.push(preview[i].subPhases[j]);
          if (
            preview[i].subPhases[j].actionTasks &&
            preview[i].subPhases[j].actionTasks
          ) {
            for (
              let k = 0;
              k < preview[i].subPhases[j].actionTasks.length;
              k += 1
            ) {
              actionTask.push(preview[i].subPhases[j].actionTasks[k]);
            }
          }
        }
      }
      let phaName = '';
      if (preview[i].labels.length) {
        const nameObj = preview[i].labels.find(
          ({ languageCode }) => languageCode === activeLanguage,
        );
        if (nameObj) {
          phaName = nameObj.propertyPhaseName;
        } else {
          phaName = preview[i].phaseName;
        }
      } else {
        phaName = preview[i].phaseName;
      }
      newPreview.push({
        ...preview[i],
        name: phaName,
        subPhases: subPhase,
        actionTasks: actionTask,
        isPrerequistes: false,
      });
    }
    return newPreview;
  },
);

/**
 * Workflow LIST Selector in WorkFlowsListing.js
 */
export const getWorkFlowList = createSelector([getWorkFlows], workFlows => {
  return workFlows.map((workflow, index) => {
    return {
      id: index + 1,
      editor: workflow.editor,
      propertyWorkflowId: workflow.refId,
      workflow: workflow.name,
      fitout: workflow.caseType,
      // updated_on: getFormatedDate(workflow.updatedAt),
      updated_on: workflow.updatedAt,
      update_by: workflow.editor.name,
      engagedToCase: workflow.engagedToCase,
    };
  });
});

/**
 * Step 1 => Dropdown Fitout types List
 */
export const getFitOutTypesList = createSelector([getFitOutTypes], types => {
  return types.map(type => {
    return {
      id: type.refId,
      value: type.cname,
    };
  });
});

/**
 * Step 4 => Get Pre requisite Group list in Dropdown 1
 */
export const getSelectPreRequisites = createSelector(
  [selectPrerequisite],
  types => {
    return types.map(type => {
      return {
        id: type.refId,
        value: type.names.find(item => item.languageCode === 'en').name,
        names: type.names,
      };
    });
  },
);

/**
 * Step 4 => Get Phases Before list in Dropdown 2
 */
export const getPhasesBeforeDropdownSelector = createSelector(
  [getStepsPhases],
  phases => {
    const step4AddedList = [];
    if (phases && phases.length) {
      for (let i = 0; i < phases.length; i += 1) {
        if (phases[i].subPhases) {
          for (let j = 0; j < phases[i].subPhases.length; j += 1) {
            if (
              phases[i].isMandatory &&
              !phases[i].restrictedForPrerequisites &&
              phases[i].subPhases[j].isMandatory &&
              phases[i].subPhases[j].refId
            ) {
              const phase =
                phases[i].labels && phases[i].labels.length
                  ? phases[i].labels.filter(
                      ({ languageCode }) => languageCode === 'en',
                    )[0].propertyPhaseName
                  : phases[i].phaseName;
              const phasename = `${phase} - ${getSubPhaseNameFromitem(
                phases[i].subPhases[j],
              )}`;
              const added = {
                id: phases[i].subPhases[j].refId,
                phaseId: phases[i].refId,
                value: phasename,
              };
              // k += 1;
              step4AddedList.push(added);
            }
          }
        }
      }
    }
    return step4AddedList;
  },
);

/**
 * Common utils Workflow function to set SubPhase Name in english lng,
 * if there is no eng language then keep the default propertySubPhaseName
 * @param {Object} item => Object of subPhase in Setup Workflows Response
 */
export const getSubPhaseNameFromitem = item => {
  let subphaName = '';
  if (!item) {
    return '';
  }
  if (item.labels && item.labels.length) {
    const nameObj = item.labels.find(
      ({ languageCode }) => languageCode === 'en',
    );
    if (nameObj) {
      if (nameObj.propertySubPhaseName) {
        subphaName = nameObj.propertySubPhaseName;
      } else if (nameObj.subPhaseName) {
        subphaName = item.subPhaseName;
      }
    }
  }
  if (subphaName === '') {
    subphaName = item.subPhaseName;
  }
  return subphaName;
};

/**
 *
 * @param {Object} item => Action item Object in Setup Workflows Response
 * @param {String} activeLanguage
 */
export const getActionTaskNameFromitemStep5 = (item, activeLanguage) => {
  let actionTaskName = '';
  if (!item) {
    return '';
  }
  if (item.names && item.names.length) {
    const nameObj = item.names.find(
      ({ languageCode }) => languageCode === activeLanguage,
    );
    if (nameObj) {
      if (nameObj.name) {
        actionTaskName = nameObj.name;
      }
    }
  }
  return actionTaskName;
};
