import _ from 'lodash';
import {
  SET_WORKFLOW_LIST,
  SET_WORKFLOW_LIST_LOADING,
  SET_FITOUT_TYPES_LIST,
  SET_WIZARD_STEPS,
  SETUP_WORKFLOW_LOADING,
  SET_PHASES_LIST_IN_WIZARD,
  SET_SUB_PHASES_LIST_IN_WIZARD,
  SET_LANGAUGES,
  SET_SELECT_PRE_REQUISITE_LIST,
  SET_PRE_REQUISITE_LIST,
  SET_PRE_REQUISITE_LIST_IN_WIZARD,
  RESET_WORKFLOW,
  RESET_WORKFLOW_FORM,
  SET_WORKFLOW_IS_MODIFY,
} from '../types';

import constants from '../utils/constants';
import fetchClient from '../utils/axiosConfig';
import {
  getFitOutTypesList,
  getSubPhaseNameFromitem,
} from '../pages/WorkFlows/selector';
import labels from '../utils/Locales/labels';

/** Reset Complete Workflow When user leave Worfklow Section */
export const resetWorkFlowModuleAction = () => ({
  type: RESET_WORKFLOW,
});

/** Reset Workflow Form When user leave Create New Workflow Section */
export const resetWorkFlowFormModuleAction = () => ({
  type: RESET_WORKFLOW_FORM,
});

/** *************************** WORKFLOW LISTING *************************** */

/**
 * Store Worflow List in Reducer(workFlows)
 * @param {Array} list
 */
export const setWorkFlowList = (list, totalCount) => ({
  type: SET_WORKFLOW_LIST,
  totalCount,
  list,
});

/**
 * Loader status for getWorkFlowList Api
 * @param {boolean} isloading => status for workflow isloading or not
 */
export const setWorkFlowLoading = isloading => ({
  type: SET_WORKFLOW_LIST_LOADING,
  isloading,
});

/**
 * API CALL for Get Workflow List
 */
export const getWorkFlowListApiAction = (_page = 1, _search = '') => {
  return dispatch => {
    dispatch(setWorkFlowLoading(true));
    /** Here there will be api calling for Getting WorkFlow list */
    fetchClient
      .get(constants.API.WORKFLOWS.LIST, {
        params: {
          page: _page,
          limit: labels.WORKFLOWS.LIST.PAGINATION_LIMIT,
          search: _search,
        },
      })
      .then(_response => {
        if (_response.data.success) {
          if (
            _response.data.data.length &&
            _response.data.data[0].workflows.length
          ) {
            const { totalCount } = _response.data.data[0];
            dispatch(
              setWorkFlowList(_response.data.data[0].workflows, totalCount),
            );
          } else {
            throw new Error('Workflow List is Empty');
          }
        } else {
          throw new Error('Workflow Api Failure');
        }
      })
      .catch(_error => {
        // console.log(_error);
        dispatch(setWorkFlowList([], 0));
      });
  };
};

/**
 * API CALL to Check weather User has Completed Phases and SubPhases Section If
 * User has Completed then only user can create new Workflow otherwise not
 */
export const getPreRequisiteStatusAction = () => {
  return (_dispatch, _getState) => {
    return fetchClient.get(
      `${constants.API.WORKFLOWS.GET_PRE_REQUISITES_STATUS}`,
    );
  };
};

/**
 * API CALL to delete Workflow
 * @param {String} uuid
 */
export const deleteWorkFlowApiAction = (_uuid, _page, _searchtext) => {
  return _dispatch => {
    // toast.success('Delete Action Called');
    /** Here there will be api calling for Getting WorkFlow list */
    return fetchClient.put(`${constants.API.WORKFLOWS.DELETE}${_uuid}`);
  };
};

/** **************** SETUP WORKFLOW ***************** */

/**
 * NOT IN USE
 * @param {Boolean} isloading => set is loading true for any api call in Setup Workflows
 */
export const setUpWorkFlowLoading = isloading => ({
  type: SETUP_WORKFLOW_LOADING,
  isloading,
});

/**
 * Action to Set weather Workflow form is Modified or not
 * @param {Boolean} isFormModify
 */
export const setUpWorkFlowFormModify = isFormModify => ({
  type: SET_WORKFLOW_IS_MODIFY,
  isFormModify,
});

/**
 * @param {Array} steps => Complete Wizard Form Data
 */
export const setWizardSteps = steps => ({
  type: SET_WIZARD_STEPS,
  steps,
});

/**
 *  NOT IN USE
 */
export const getLanguagesAction = lang => ({
  type: SET_LANGAUGES,
  lang,
});

//* ************* */ Edit Api ********************

/**
 * API CALL to get Details of workflow by Workflow ID
 * @param {String} _uuid => When user clicks on Edit or Create a Copy
 * @param {Boolean} _isCreateACopy => If this detail is for Create a Copy then true
 * @param {String} _screen  => add / edit / copy
 */
export const getSetupWorkflowApiDetailsAction = (
  _uuid,
  _isCreateACopy,
  _screen,
) => {
  return (_dispatch, _getState) => {
    fetchClient
      .get(`${constants.API.WORKFLOWS.DETAILS}${_uuid}`)
      .then(_response => {
        _dispatch(
          setWorkflowInitialDetails(
            _response,
            false,
            0,
            _isCreateACopy,
            _uuid,
            _screen,
          ),
        );
      })
      .catch(_error => {
        // console.log(_error);
      });
  };
};

/**
 * Middleware Function to call after Step 1 , 2, 3, 4, workflow detail API repsonse.
 * @param {Array} _response => From API Response => Step 1 ,2 ,3, 4, Detail apis response
 * @param {Boolean} isActiveStep => Is Wizard Selected in the Form or else calling this function from  getSetupWorkflowApiDetailsAction
 * @param {String} stepNo => Selected Step No
 * @param {Boolean} _isCreateACopy => If this workflow detail is for Create a Copy then true
 * @param {String} _uuid => When user clicks on Edit or Create a Copy
 * @param {String} _screen => add / edit / copy
 */
export const setWorkflowInitialDetails = (
  _response,
  isActiveStep,
  stepNo,
  _isCreateACopy,
  _uuid,
  _screen,
) => {
  return (_dispatch, _getState) => {
    // _dispatch(setWorkFlowLoading(true));
    try {
      const data = _response.data.data[0];
      let step4list = [];
      // if (data.lastModifiedStep >= 4) {
      data.phases.forEach(item => {
        if (item.subPhases && item.subPhases.length) {
          if (item.preRequisites && item.preRequisites.length) {
            try {
              step4list.push(
                ...item.preRequisites.map(_preItem => {
                  if (
                    item.subPhases.find(
                      subItem =>
                        subItem.propertySubPhasesId ===
                        _preItem.propertySubPhasesId,
                    )
                  ) {
                    const phaName =
                      item.labels && item.labels.length
                        ? item.labels.filter(
                            ({ languageCode }) => languageCode === 'en',
                          )[0].propertyPhaseName
                        : item.phaseName;

                    const subNameItem = item.subPhases.find(
                      subItem =>
                        subItem.propertySubPhasesId ===
                        _preItem.propertySubPhasesId,
                    );
                    // let subphaName = '';
                    // if (subNameItem) {
                    //   if (subNameItem.labels && subNameItem.labels.length) {
                    //     const nameObj = subNameItem.labels.find(
                    //       ({ languageCode }) => languageCode === 'en',
                    //     );
                    //     if (nameObj) {
                    //       subphaName = nameObj.propertySubPhaseName;
                    //     } else if (nameObj.subPhaseName) {
                    //       subphaName = subNameItem.subPhaseName;
                    //     }
                    //   }
                    let subPhaseRefId = '';
                    if (!subNameItem) {
                      subPhaseRefId = _preItem.subPhaseId;
                    } else {
                      subPhaseRefId = subNameItem.refId;
                    }

                    return {
                      ..._preItem,
                      subPhaseRefId,
                      propertyPrerequisiteGroupId: _preItem.groupRefId,
                      phaseRefId: item.refId,
                      PREREQUISITE: _preItem.names,
                      BEFOREPHASE: `${phaName} - ${getSubPhaseNameFromitem(
                        subNameItem,
                      )}`,
                    };
                  }
                  return undefined;
                }),
              );
            } catch (e) {
              // console.log(e);
            }
            step4list = step4list.filter(_item => _item !== undefined);
          }
        }
      });
      // }

      data.phases = _.orderBy(data.phases, ['phaseSequence'], ['asc']);
      for (let i = 0; i < data.phases.length; i += 1) {
        if (
          data.lastModifiedStep <= 2 &&
          !_isCreateACopy &&
          _screen !== 'copy'
        ) {
          data.phases[i].subPhases = _.orderBy(
            data.phases[i].subPhases,
            ['propertySubphaseSequence'],
            ['asc'],
          );
        } else {
          data.phases[i].subPhases = _.orderBy(
            data.phases[i].subPhases,
            ['sequence'],
            ['asc'],
          );
        }
      }
      const phases =
        data.phases && data.phases.length
          ? data.phases.map(item => {
              return {
                ...item,
                isMandatory: Object.prototype.hasOwnProperty.call(
                  item,
                  'isMandatory',
                )
                  ? item.isMandatory
                  : true,
                daysToComplete: item.daysToComplete
                  ? item.daysToComplete.toString()
                  : '',
                subPhases:
                  // eslint-disable-next-line no-nested-ternary
                  item.subPhases && item.subPhases.length
                    ? data.lastModifiedStep <= 2
                      ? item.subPhases
                          .map((subItem, index) => {
                            return {
                              ...subItem,
                              sequence: index + 1,
                              isMandatory:
                                _screen !== ('copy' || 'edit')
                                  ? true
                                  : subItem.isMandatory,
                              //   Object.prototype.hasOwnProperty.call(
                              //   subItem,
                              //   'isMandatory',
                              // )
                              //   ? subItem.isMandatory
                              //   : true,
                            };
                          })
                          .filter(subItem => subItem.propertySubPhasesId !== '')
                      : item.subPhases
                          .map(subItem => {
                            return {
                              ...subItem,
                              isMandatory: Object.prototype.hasOwnProperty.call(
                                subItem,
                                'isMandatory',
                              )
                                ? subItem.isMandatory
                                : true,
                            };
                          })
                          .filter(subItem => subItem.propertySubPhasesId !== '')
                    : [],
              };
            })
          : [];
      const steps = _getState().workFlows.setUpWorkFlow;
      _dispatch(
        setWizardSteps([
          {
            ...steps[0],
            response: {
              refId: data.refId,
              cTId: data.cTId,
              names: _isCreateACopy ? [] : _.cloneDeep(data.names),
              phases: _.cloneDeep(phases),
            },
            workflowName: _isCreateACopy ? [] : _.cloneDeep(data.names),
            fitOutType: getFitOutTypesList(_getState()).find(obj => {
              return obj.id === data.cTId;
            }),
            isSaved: data.lastModifiedStep >= 1,
            // eslint-disable-next-line no-nested-ternary
            status: isActiveStep ? '' : 'current',
            refId: _isCreateACopy ? '' : data.refId,
            sourceId: _isCreateACopy || _screen === 'copy' ? _uuid : '',
            lastModifiedStep: data.lastModifiedStep,
            isEngagedToCase: data.isEngagedToCase,
            isPublish: data.isPublish,
          },
          {
            ...steps[1],
            list: _.cloneDeep(phases),
            isSaved: _isCreateACopy ? false : data.lastModifiedStep >= 1,
            response: {
              refId: data.refId,
              cTId: data.cTId,
              names: data.names,
              phases: _.cloneDeep(phases),
            },
            // eslint-disable-next-line no-nested-ternary
            status: isActiveStep ? (stepNo === 1 ? 'current' : '') : '',
          },
          {
            ...steps[2],
            list: _.cloneDeep(phases),
            isSaved: _isCreateACopy ? false : data.lastModifiedStep >= 2,
            response: {
              refId: data.refId,
              cTId: data.cTId,
              names: data.names,
              phases: _.cloneDeep(phases),
            },
            // eslint-disable-next-line no-nested-ternary
            status: isActiveStep ? (stepNo === 2 ? 'current' : '') : '',
          },
          {
            ...steps[3],
            isSaved: _isCreateACopy ? false : data.lastModifiedStep >= 3,
            list: step4list,
            requisites: step4list,

            // eslint-disable-next-line no-nested-ternary
            status: isActiveStep ? (stepNo === 3 ? 'current' : '') : '',
          },
          {
            ...steps[4],
            activeLanguage: isActiveStep ? steps[4].activeLanguage : 'en',
            isSaved: _isCreateACopy ? false : data.lastModifiedStep >= 3,
            list: _.cloneDeep(phases),
            // eslint-disable-next-line no-nested-ternary
            status: isActiveStep ? (stepNo === 4 ? 'current' : '') : '',
          },
        ]),
      );
    } catch (e) {
      // console.log(e);
    }
    _dispatch(setWorkFlowLoading(false));
  };
};

/** **************** STEP 1 ***************** */

/**
 *
 * @param {Array} list => Select Fitout Type Dropdown
 */
export const setFitOutTypesList = list => ({
  type: SET_FITOUT_TYPES_LIST,
  list,
});

/**
 * Fitout Types Dropdown API CAll
 */
export const getFitOutTypesListApiAction = () => {
  return dispatch => {
    /** Here there will be api calling for Getting CaseTypes list */
    fetchClient
      .get(constants.API.WORKFLOWS.CASE_TYPES)
      .then(_response => {
        if (_response.data.success) {
          if (_response.data.data.length) {
            dispatch(setFitOutTypesList(_response.data.data));
          } else {
            throw new Error('Case Type List is Empty');
          }
        } else {
          throw new Error('Case Type list Api unsucessfull');
        }
      })
      .catch(_error => {
        dispatch(setFitOutTypesList([]));
      });
  };
};

/**
 * API CALL for STEP 1 => For ADD and EDIT API is DIFFERENT
 * @param {String} _screen => add / edit / copy
 */
export const callStep1ApiAction = _screen => {
  return (_dispatch, _getState) => {
    const request = {
      // isPublish: screen === 'edit',
      isPublish: _getState().workFlows.setUpWorkFlow[0].isPublish,
      cTId: `${_getState().workFlows.setUpWorkFlow[0].fitOutType.id}`,
      names: _getState().workFlows.setUpWorkFlow[0].workflowName.map(x => {
        const newNames = { languageCode: x.languageCode, name: x.name };
        return newNames;
      }),
      sourceId:
        _getState().workFlows.setUpWorkFlow[0].sourceId === ''
          ? undefined
          : _getState().workFlows.setUpWorkFlow[0].sourceId,
    };
    if (_getState().workFlows.setUpWorkFlow[0].refId !== '') {
      return fetchClient.put(
        `${constants.API.WORKFLOWS.STEP_1_EDIT}${
          _getState().workFlows.setUpWorkFlow[0].refId
        }`,
        request,
      );
    }
    return fetchClient.post(constants.API.WORKFLOWS.STEP_1, request);
  };
};

/** **************** STEP 2 ***************** */

/**
 * NOT IN USE
 * @param {Array} list
 */
export const setPhasesWizardList = list => ({
  type: SET_PHASES_LIST_IN_WIZARD,
  list,
});

/**
 * API CALL for STEP 2 => For ADD , EDIT, COPY API is same
 * @param {String} _screen => add / edit / copy
 */
export const callStep2ApiAction = _screen => {
  return (_dispatch, _getState) => {
    const request = {
      // isPublish: screen === 'edit',
      isPublish: _getState().workFlows.setUpWorkFlow[0].isPublish,
      sourceId:
        _getState().workFlows.setUpWorkFlow[0].sourceId === ''
          ? undefined
          : _getState().workFlows.setUpWorkFlow[0].sourceId,

      phases: _getState().workFlows.setUpWorkFlow[1].list.map(item => {
        return {
          propertyPhasesId: item.propertyPhasesId,
          refId: item.refId ? item.refId : undefined,
          sequence: item.phaseSequence ? item.phaseSequence : item.sequence,
          isMandatory: item.isMandatory,
          isParallel: false,
          daysToComplete: Number(item.daysToComplete),
        };
      }),
    };

    return fetchClient.put(
      `${constants.API.WORKFLOWS.STEP_2}${
        _getState().workFlows.setUpWorkFlow[0].refId
      }`,
      request,
    );
  };
};

/** **************** STEP 3 ***************** */

/**
 * NOT IN USE
 * @param {Array} list
 */
export const setSubPhasesWizardList = list => ({
  type: SET_SUB_PHASES_LIST_IN_WIZARD,
  list,
});

/**
 * API CALL for STEP 3 => For ADD , EDIT, COPY API is same
 * @param {String} _screen => add / edit / copy
 */
export const callStep3ApiAction = _screen => {
  return (_dispatch, _getState) => {
    const data = _getState().workFlows.setUpWorkFlow[2].list;
    const createResponse = [];
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].subPhases && data[i].subPhases.length) {
        for (let j = 0; j < data[i].subPhases.length; j += 1) {
          const subPhaseResponse = {
            propertySubPhasesId: data[i].subPhases[j].propertySubPhasesId,
            phasesRefId: data[i].refId,
            refId: data[i].subPhases[j].refId
              ? data[i].subPhases[j].refId
              : undefined,
            sequence: data[i].subPhases[j].sequence,
            isMandatory: data[i].subPhases[j].isMandatory,
            isParallel: data[i].subPhases[j].isParallel,
          };
          createResponse.push(subPhaseResponse);
        }
      }
    }
    const request = {
      // pId: getPropId(),
      // isPublish: screen === 'edit',
      isPublish: _getState().workFlows.setUpWorkFlow[0].isPublish,
      // workflowId: _getState().workFlows.setUpWorkFlow[0].response.refId,
      subPhases: createResponse,
      sourceId:
        _getState().workFlows.setUpWorkFlow[0].sourceId === ''
          ? undefined
          : _getState().workFlows.setUpWorkFlow[0].sourceId,
    };
    return fetchClient.put(
      `${constants.API.WORKFLOWS.STEP_3}${
        _getState().workFlows.setUpWorkFlow[0].refId
      }`,
      request,
    );
  };
};

/** **************** STEP 4 ***************** */

/**
 * @param {Array} list => Set list in redux
 */
export const getSelectPreRequisite = list => ({
  type: SET_SELECT_PRE_REQUISITE_LIST,
  list,
});

export const getPreRequisiteList = list => ({
  type: SET_PRE_REQUISITE_LIST,
  list,
});

/**
 * NOT IN USE
 * @param {Array} list
 */
export const getPreRequisiteListWizard = list => ({
  type: SET_PRE_REQUISITE_LIST_IN_WIZARD,
  list,
});

/**
 * API CALL to get Pre requisite group List to Show in Dropdown
 */
export const getPreRequisiteListApiAction = () => {
  return dispatch => {
    fetchClient
      .get(`${constants.API.WORKFLOWS.GET_PRE_REQUISITES}?all=true`)
      .then(_response => {
        dispatch(
          getSelectPreRequisite(_response.data.data[0].preRequisiteGroups),
        );
      })
      .catch(() => {
        // console.log(error);
      });
  };
};

/**
 * API CALL for STEP 4 => For ADD , EDIT, COPY API is same
 * @param {String} _screen => add / edit / copy
 */
export const callStep4ApiAction = _screen => {
  return (_dispatch, _getState) => {
    const request = {
      // pId: getPropId(),
      // isPublish: screen === 'edit',
      isPublish: _getState().workFlows.setUpWorkFlow[0].isPublish,
      // workflowId: _getState().workFlows.setUpWorkFlow[0].response.refId,
      // workflowId:
      //   Number[
      //     _getState().workFlows.setUpWorkFlow[0].response[0][0]
      //       .propertyWorkflowId
      //   ],
      prerequisite: _getState().workFlows.setUpWorkFlow[3].list.map(item => {
        return {
          phaseRefId: item.phaseRefId,
          subPhaseRefId: item.subPhaseRefId,
          propertyPrerequisiteGroupId: item.propertyPrerequisiteGroupId,
          // isPublish: 'true',
        };
      }),
    };
    return fetchClient.put(
      `${constants.API.WORKFLOWS.STEP_4}${
        _getState().workFlows.setUpWorkFlow[0].response.refId
      }`,
      request,
    );
  };
};

/** **************** STEP 5 ***************** */

/**
 * NOT IN USE
 */
export const saveSetUpWorkFlowSteps = /* step */ () => {
  return (/* dispatch, getState */) => {
    setUpWorkFlowLoading(true);
  };
};

/**
 * API CALL for STEP 5 => For ADD , EDIT, COPY API is same
 */
export const callStep5ApiAction = () => {
  return (_dispatch, _getState) => {
    return fetchClient.put(
      `${constants.API.WORKFLOWS.STEP_5}${
        _getState().workFlows.setUpWorkFlow[0].response.refId
      }`,
    );
  };
};

/**
 * Api to get Details of Prerequisite Group and Its Prerequsite
 * @param {String} id => Prerequisite Group API
 */
export const callApiPreRequisitesAction = id => {
  return (_dispatch, _getState) => {
    return fetchClient.get(
      `${constants.API.WORKFLOWS.GET_PRE_REQUISITES_DETAILS}${id}`,
    );
  };
};
