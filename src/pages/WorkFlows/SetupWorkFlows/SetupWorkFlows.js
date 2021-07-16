import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SetupWorkFlows.scss';
import { validateNameWithRegex } from '../../../utils/validation';
import CardHeader from '../../../components/CardHeader/CardHeader';
import Wizard from '../../../components/Wizard/Wizard';
import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';
import Step5 from './Step5/Step5';
import StepWizardText from './StepWizardText/StepWizardText';

/** Error & Lables */
import messages from '../../../utils/Locales/messages';
import labels from '../../../utils/Locales/labels';

/** ALERT */
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';

/** REDUX */
import {
  getFitOutTypesListApiAction,
  getSetupWorkflowApiDetailsAction,
  setWizardSteps,
  saveSetUpWorkFlowSteps,
  setUpWorkFlowLoading,
  setUpWorkFlowFormModify,
  callStep1ApiAction,
  callStep2ApiAction,
  callStep3ApiAction,
  callStep4ApiAction,
  callStep5ApiAction,
  getPreRequisiteListApiAction,
  resetWorkFlowModuleAction,
  resetWorkFlowFormModuleAction,
  setWorkflowInitialDetails,
  setWorkFlowLoading,
} from '../../../actions/workFlowsAction';

/** REDUX RESELECT SELECTOR */
import {
  getSteps,
  getIsModify,
  getrequisites,
  getFitOutTypesList,
  getSelectPreRequisites,
  getStep5DataSelector,
  getPhasesBeforeDropdownSelector,
  getLanguages,
  getWorkFlowisLoading,
} from '../selector';
import constants from '../../../utils/constants';

function SetupWorkFlows({
  fitOutList,
  selectPreRequisites,
  getStep5Data,
  getFitOutTypesListApi,
  getPreRequisiteApi,
  getSetupWorkflowApiDetails,
  match,
  location,
  steps,
  isModifyStatus,
  changeStep,
  requisites,
  callStep1Api,
  callStep2Api,
  callStep3Api,
  callStep4Api,
  callStep5Api,
  isSetUpLoading,
  isSetModify,
  resetWorkFlowGlobalModule,
  resetWorkFlowModule,
  step4phasesList,
  setWorkflowStepResponse,
  isWorkflowLoading,
  languages,
  isLoading,
}) {
  const { i18n } = useTranslation();
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [isErrorMessageDuplicate, setIsErrorMessageDuplicate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [popupErrorMessage, setErrorMessage] = useState();
  const [isCancel, setIsCancel] = useState(false);
  const [screen, setScreen] = useState('add');
  const [copyId, setCopyId] = useState('');
  const [step4Popup, setStep4Popup] = useState(false);
  const [countOfStep2DataChange, setCountOfStep2DataChange] = useState(0);
  const history = useHistory();

  useEffect(() => {
    // React Component Lifecycle => Mount
    resetWorkFlowGlobalModule(); // Reset To Initital State
    resetWorkFlowModule(); // Reset To Initial State
    // Step 1 Apis
    getFitOutTypesListApi(); // For Dropdown
    // Step 4 Apis
    getPreRequisiteApi(); // For Dropdown

    // it can check to url in id. if true than it is edit
    if (match.params && match.params.id) {
      setScreen('edit'); // Set screen state to edit
      getSetupWorkflowApiDetails(match.params.id, false, 'edit'); // Edit Workflow Details Apis
    }
    const checkStatus = location.state ? location.state.createWorkflowId : null; // Check whether we get ID from location router
    if (checkStatus) {
      // If yes then Its Create a Copy
      setScreen('copy'); // Set screen state to copy
      setCopyId(location.state.createWorkflowId); // Set CopyID state
      getSetupWorkflowApiDetails(location.state.createWorkflowId, true, screen); // Create a Copy Workflow Details Apis
    }
    return () => {
      i18n.changeLanguage('en');
      resetWorkFlowGlobalModule(); // Reset To Initital State Before leaving Form
      resetWorkFlowModule(); // Reset To Initital State Before leaving Form
      // React Component Lifecycle => UnMount
    };
  }, []);

  // Setup Work Flow listners
  const setAutoPopupStep1 = () => {
    const stepsData = [...steps];
    const nameDefault = stepsData[0].workflowName.filter(
      x => x.languageCode === 'en',
    )[0].name;
    for (let i = 0; i < stepsData[0].workflowName.length; i += 1) {
      if (stepsData[0].workflowName[i].name === '') {
        stepsData[0].workflowName[i].name = nameDefault;
        stepsData[0].workflowName[i].isErrorWorkflowName = false;
        stepsData[0].workflowName[i].isErrorWorkflowNameMsg = '';
      }
    }
    changeStep(stepsData);
    setIsErrorMessage(!isErrorMessage);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };

  /** Listener for Save and Continue */
  const onSaveAndContinueClickListner = () => {
    isWorkflowLoading(true);
    const stepsData = [...steps];
    const currentSelected = stepsData.findIndex(
      ({ status }) => status === 'current',
    );
    // currentSelected it check index of steps. it starting 0 to 4
    if (currentSelected !== undefined) {
      if (currentSelected === 4) {
        // If Step 5 Submit button is Clicked
        callStep5Api()
          .then(response => {
            if (response.data.success) {
              if (response.data.data[0]) {
                if (screen === 'edit') {
                  // Error Messages are different for Add and update
                  setErrorMessage(messages.WORKFLOWS.STEP_5.SUCCESS_EDIT);
                } else {
                  setErrorMessage(messages.WORKFLOWS.STEP_5.SUCCESS_CREATE);
                }
                setIsSuccess(true);
                isSetModify(false);
                if (isLoading) {
                  isWorkflowLoading(false);
                }
              }
              window.scrollTo(0, 0); // Default Scroll ti top
            } else {
              throw new Error('Create Workflow Step 1 Api Error');
            }
          })
          .catch(() => {});
      } else if (currentSelected === 0) {
        // If Step 1 Save and Continue button is Clicked
        setLangaugesInWorkflow();
        if (
          (steps[0].workflowName &&
            steps[0].workflowName.length &&
            steps[0].workflowName.filter(x => x.languageCode === 'en')[0]
              .name === '') ||
          Object.keys(steps[0].fitOutType).length === 0
        ) {
          const isError = [...steps];
          if (steps[0].workflowName && steps[0].workflowName.length) {
            if (
              steps[0].workflowName.filter(x => x.languageCode === 'en')[0]
                .name === ''
            ) {
              for (let i = 0; i < steps[0].workflowName.length; i += 1) {
                if (
                  steps[0].workflowName[i].languageCode === 'en' &&
                  steps[0].workflowName[i].name === ''
                ) {
                  isError[0].workflowName[i].isErrorWorkflowNameMsg =
                    messages.WORKFLOWS.STEP_1.MANDATORY_FIELD;
                  isError[0].workflowName[i].isErrorWorkflowName = true;
                }
              }
            }
          }
          if (steps[0].workflowName && !steps[0].workflowName.length) {
            const item = {
              languageCode: 'en',
              name: '',
              isErrorWorkflowName: true,
              isErrorWorkflowNameMsg: messages.WORKFLOWS.STEP_1.MANDATORY_FIELD,
            };
            isError[0].workflowName.push(item);
          }

          if (Object.keys(steps[0].fitOutType).length === 0) {
            isError[0].isErrorFitOutType = true;
            isError[0].isErrorFitOutTypeMsg =
              messages.WORKFLOWS.STEP_1.SELECT_ANY_ONE;
          }
          changeStep(isError);
          if (isLoading) {
            isWorkflowLoading(false);
          }
          return null;
        }

        for (let i = 0; i < steps[0].workflowName.length; i += 1) {
          if (steps[0].workflowName[i].name === '') {
            setIsErrorMessage(true);
            setErrorMessage(messages.WORKFLOWS.AUTO_POPULATE_LANGUAGE);
            if (isLoading) {
              isWorkflowLoading(false);
            }
            return null;
          }
          if (steps[0].workflowName[i].isErrorWorkflowName) {
            if (isLoading) {
              isWorkflowLoading(false);
            }
            return null;
          }
        }

        callStep1Api(screen)
          .then(_response => {
            if (_response.data.success) {
              if (_response.data.data.length) {
                if (_response.data.data[0] == null) {
                  setIsErrorMessageDuplicate(true);
                  setErrorMessage(messages.WORKFLOWS.STEP_1.DUPLICATE_NAME);
                  if (isLoading) {
                    isWorkflowLoading(false);
                  }
                  return null;
                }
                setWorkflowStepResponse(
                  _response,
                  true,
                  1,
                  false,
                  copyId,
                  screen,
                );
                isSetUpLoading(false);
                isSetModify(false);
                window.scrollTo(0, 0);
                if (isLoading) {
                  isWorkflowLoading(false);
                }
                return null;
              }
              throw new Error('Create Workflow Step 1 Response Data Empty');
            } else {
              throw new Error('Create Workflow Step 1 Api Error');
            }
          })
          .catch(_error => {
            if (
              _error.response.data.errorCode === 'errDuplicateName' ||
              _error.response.data.errorCode === 'errDuplicateNameFoundWorkflow'
            ) {
              setIsErrorMessageDuplicate(true);
              setErrorMessage(messages.WORKFLOWS.STEP_1.DUPLICATE_NAME);
              if (isLoading) {
                isWorkflowLoading(false);
              }
              return null;
            }
            setIsErrorMessageDuplicate(true);
            setErrorMessage(messages.WORKFLOWS.API_FAILURE);
            if (isLoading) {
              isWorkflowLoading(false);
            }
            return null;
          });
      } else if (currentSelected === 1) {
        // const isError = [...steps];
        const data = [...steps];
        // using for table re-initialize
        setCountOfStep2DataChange(countOfStep2DataChange + 1);

        data[1].list.forEach((item, i) => {
          if (!item.daysToComplete.trim()) {
            data[1].list[i].isError = messages.WORKFLOWS.STEP_2.MANDATORY_FIELD;
          }
        });

        changeStep(data);

        for (let i = 0; i < steps[1].list.length; i += 1) {
          if (steps[1].list[i].isDefaultMandatory) {
            if (steps[1].list[i].isError) {
              if (isLoading) {
                isWorkflowLoading(false);
              }
              return null;
            }
          }
        }

        callStep2Api(screen)
          .then(_response => {
            setWorkflowStepResponse(_response, true, 2, false, copyId, screen);
            isSetUpLoading(false);
            isSetModify(false);
            window.scrollTo(0, 0);
          })
          .catch(_error => {
            setIsErrorMessageDuplicate(true);
            setErrorMessage(messages.WORKFLOWS.API_FAILURE);
            if (isLoading) {
              isWorkflowLoading(false);
            }
            return null;
          });
      } else if (currentSelected === 2) {
        callStep3Api(screen)
          .then(_response => {
            if (_response.data.success) {
              setWorkflowStepResponse(
                _response,
                true,
                3,
                false,
                copyId,
                screen,
              );
              isSetUpLoading(false);
              isSetModify(false);
              window.scrollTo(0, 0);
            }
          })
          .catch(_error => {
            setIsErrorMessageDuplicate(true);
            setErrorMessage(messages.WORKFLOWS.API_FAILURE);
            if (isLoading) {
              isWorkflowLoading(false);
            }
            return null;
          });
      } else if (currentSelected === 3) {
        if (
          Object.keys(steps[3].selected_data).length !== 0 &&
          Object.keys(steps[3].added_data).length !== 0
        ) {
          setStep4Popup(true);
          setErrorMessage(messages.WORKFLOWS.STEP_4.CLICK_PREVIEW_POPUP_MSG);
          if (isLoading) {
            isWorkflowLoading(false);
          }
          return null;
        }
        callStep4Api(screen)
          .then(_response => {
            if (_response.data.success) {
              setWorkflowStepResponse(
                _response,
                true,
                4,
                false,
                copyId,
                screen,
              );
              isSetUpLoading(false);
              isSetModify(false);
              window.scrollTo(0, 0);
            }
          })
          .catch(_error => {
            setIsErrorMessageDuplicate(true);
            setErrorMessage(messages.WORKFLOWS.API_FAILURE);
            if (isLoading) {
              isWorkflowLoading(false);
            }
            return null;
          });
      }
      if (isLoading) {
        isWorkflowLoading(false);
      }
    }
    if (isLoading) {
      isWorkflowLoading(false);
    }
    return null;
  };

  /** Listener for Save and Close => Not included in Sprint 1 */
  // const onSaveAndCloseClickListner = () => {
  // };

  /** Workflow successfully Added Route to Workflow Listing Page */
  const WorkflowAddedSuccess = () => {
    setIsSuccess(false);
    resetWorkFlowGlobalModule();
    history.push(constants.ROUTE.WORKFLOWS.LIST);
  };

  // On Step 5 Edit Button Click Listner
  const onEditClickListner = () => {
    const data = [...steps];
    data[4].status = '';
    data[0].status = 'current';
    changeStep(data);
    window.scrollTo(0, 0);
  };

  // On Cancel Button Click in Complete Form
  const onCancelButtonClickListner = () => {
    const stepsData = [...steps];
    if (isLoading) {
      isWorkflowLoading(false);
    }
    const currentSelected = stepsData.findIndex(
      ({ status }) => status === 'current',
    );
    if (isModifyStatus) {
      if (currentSelected !== undefined) {
        if (currentSelected === 0) {
          if (Object.keys(steps[0].fitOutType).length === 0) {
            // alert('Object');
            if (steps[0].workflowName && !steps[0].workflowName.length) {
              history.push(constants.ROUTE.WORKFLOWS.LIST);
              return null;
            }
            if (
              !steps[0].workflowName.filter(_item => _item.name !== '').length
            ) {
              history.push(constants.ROUTE.WORKFLOWS.LIST);
              return null;
            }
          }
          setIsCancel(true);
          return null;
        }
        setIsCancel(true);
        window.scrollTo(0, 0);
        return null;
      }
    } else if (currentSelected === 0) {
      history.push(constants.ROUTE.WORKFLOWS.LIST);
      window.scrollTo(0, 0);
      return null;
    }
    return null;
  };

  // On Cancel Button Click with Validation in Complete Form used in onChangeWizard
  const onCancelClickListnerWithValidation = id => {
    const stepsData = [...steps];
    const currentSelected = stepsData.findIndex(
      ({ status }) => status === 'current',
    );
    if (id > currentSelected || id === 3) {
      onCancelClickListner(id);
    }
  };

  const onCancelClickListner = id => {
    const stepsData = [...steps];
    const currentSelected = stepsData.findIndex(
      ({ status }) => status === 'current',
    );
    if (currentSelected !== undefined) {
      // Step index 0,1,2,3
      isSetModify(false);
      if (currentSelected === 0) {
        const data = [...steps];
        if (
          data[0].response &&
          data[0].response.names &&
          data[0].response.names.length
        ) {
          data[0].workflowName = _.cloneDeep(data[0].response.names);
          data[0].fitOutType = fitOutList.find(obj => {
            return obj.id === data[0].response.cTId;
          });
        } else {
          data[0].workflowName = [];
          data[0].fitOutType = {};
          data[0].isSaved = false;
          data[0].response = {};
        }
        data[0].isErrorWorkflowName = false;
        data[0].isErrorWorkflowNameMsg = '';
        data[0].status = 'current';
        changeStep(data);
      } else if (currentSelected === 1) {
        const data = [...steps];
        data[1].list = _.cloneDeep(data[1].response.phases);
        data[1].isError = false;
        changeStep(data);
      } else if (currentSelected === 2) {
        const data = [...steps];
        data[2].list = _.cloneDeep(data[2].response.phases);
        changeStep(data);
      } else if (currentSelected === 3 || id === 3) {
        const data = [...steps];
        // data[3].list = [...requisites];
        data[3].list = _.cloneDeep(data[3].requisites);

        data[3].selected_data = {};
        data[3].added_data = {};
        data[3].isErrorAdd = false;
        data[3].isErrorSelect = false;
        changeStep(data);
      }
      setIsCancel(false);
    }
    return null;
  };

  const removeSelectedDropdownData = () => {
    const data = [...steps];
    data[3].selected_data = {};
    data[3].added_data = {};
    data[3].isErrorAdd = false;
    data[3].isErrorSelect = false;
    changeStep(data);
  };

  // ==================================== * On Wizard Click  *  =====================================
  const onChangeWizard = id => {
    onCancelClickListnerWithValidation(id);
    const stepsData = [...steps];
    stepsData[id].status = '';
    setLangaugesInWorkflow();
    setCountOfStep2DataChange(0);
    if (isLoading) {
      isWorkflowLoading(false);
    }

    if (!stepsData[0].workflowName.filter(x => x.name === '').length) {
      stepsData.forEach((_e, phaseCount) => {
        if (phaseCount === id) {
          stepsData[phaseCount].status = 'current';
        } else {
          stepsData[phaseCount].status = '';
        }
        // ============ * On click Is not Saved than assign default value * ==============
        if (phaseCount === 1) {
          if (!stepsData[phaseCount].isSaved) {
            stepsData[phaseCount].list = stepsData[phaseCount].response.phases
              ? _.cloneDeep(stepsData[phaseCount].response.phases)
              : [];
          }
        }
        if (phaseCount === 2) {
          if (!stepsData[phaseCount].isSaved) {
            stepsData[phaseCount].list = stepsData[phaseCount].response.phases
              ? _.cloneDeep(stepsData[phaseCount].response.phases)
              : [];
          }
        }
        if (phaseCount === 3) {
          if (!stepsData[phaseCount].isSaved) {
            stepsData[phaseCount].list = stepsData[phaseCount].response.phases
              ? _.cloneDeep(requisites)
              : [];
          }
        }
        // ============ * On click Is not Saved than assign default value * ==============
      });
    } else {
      stepsData[0].status = 'current';
    }
    changeStep(stepsData);
  };

  // =================================== * Step 1 Listners * =============================================
  const setLangaugesInWorkflow = () => {
    const data = [...steps];
    for (let i = 0; i < languages.length; i += 1) {
      if (
        !data[0].workflowName.find(
          item => item.languageCode === languages[i].languageCode,
        )
      ) {
        const item = {
          languageCode: languages[i].languageCode,
          name: '',
          isErrorWorkflowName: false,
          isErrorWorkflowNameMsg: '',
        };
        data[0].workflowName.push(item);
      }
    }
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };
  const onWorkFlowNameFocus = () => {
    setLangaugesInWorkflow();
  };
  const onWorkFlowNameTextChangelistner = (e, lang) => {
    const data = [...steps];
    if (isLoading) {
      isWorkflowLoading(false);
    }
    isSetModify(true);
    const index = data[0].workflowName.findIndex(x => x.languageCode === lang);
    if (index >= 0) {
      data[0].workflowName[index].name = e.target.value;
      data[0].workflowName[index].isErrorWorkflowName = false;
      data[0].workflowName[index].isErrorWorkflowNameMsg = '';
    } else {
      let item = {};
      item = {
        languageCode: lang,
        name: e.target.value,
        isErrorWorkflowName: false,
        isErrorWorkflowNameMsg: '',
      };
      data[0].workflowName.push(item);
    }
    if (lang === 'en') {
      if (
        !validateNameWithRegex(
          e.target.value,
          labels.WORKFLOWS.STEP_1.REGEX_OF_WORKFLOW_NAME,
        ) &&
        e.target.value !== '' &&
        data[0].workflowName[index]
      ) {
        data[0].workflowName[index].isErrorWorkflowName = true;
        data[0].workflowName[index].isErrorWorkflowNameMsg =
          messages.WORKFLOWS.STEP_1.INVALID_FIELD;
      } else if (e.target.value === '') {
        data[0].workflowName[index].isErrorWorkflowName = true;
        data[0].workflowName[index].isErrorWorkflowNameMsg =
          messages.WORKFLOWS.STEP_1.MANDATORY_FIELD;
      } else if (
        e.target.value.length > labels.WORKFLOWS.STEP_1.LENGTH_OF_WORKFLOW_NAME
      ) {
        if (data[0].workflowName[index].languageCode === 'en') {
          data[0].workflowName[index].isErrorWorkflowName = true;
          data[0].workflowName[index].isErrorWorkflowNameMsg =
            messages.WORKFLOWS.STEP_1.LENGTH +
            labels.WORKFLOWS.STEP_1.LENGTH_OF_WORKFLOW_NAME;
        } else if (
          e.target.value.length >
          labels.WORKFLOWS.STEP_1.LENGTH_OF_WORKFLOW_NAME * 4
        ) {
          data[0].workflowName[index].isErrorWorkflowName = true;
          data[0].workflowName[index].isErrorWorkflowNameMsg =
            messages.WORKFLOWS.STEP_1.LENGTH +
            labels.WORKFLOWS.STEP_1.LENGTH_OF_WORKFLOW_NAME * 4;
        }
      }
    } else if (e.target.value === '') {
      data[0].workflowName[index].isErrorWorkflowName = true;
      data[0].workflowName[index].isErrorWorkflowNameMsg =
        messages.WORKFLOWS.STEP_1.MANDATORY_FIELD;
    }
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };
  const onFitoutTypeChangelistner = fitOut => {
    const data = [...steps];
    isSetModify(true);
    data[0].fitOutType = fitOut;
    data[0].isErrorFitOutType = false;
    data[0].isErrorFitOutTypeMsg = '';
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };

  // =================================== * Step 2 Listners * =============================================
  const handleSwitchToggle = (_e, phase) => {
    const data = [...steps];
    isSetModify(true);
    data[1].list.map(item => {
      if (item.propertyPhasesId === phase.propertyPhasesId) {
        const modifiedItem = item;
        modifiedItem.isMandatory = !modifiedItem.isMandatory;
        return modifiedItem;
      }
      return item;
    });
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };
  const handleCheckToggle = (_e, phase) => {
    const data = [...steps];
    data[1].list.map(item => {
      if (item.propertyPhasesId === phase.propertyPhasesId) {
        const modifiedItem = item;
        modifiedItem.isDefaultParallel = !modifiedItem.isDefaultParallel;
        return modifiedItem;
      }
      return item;
    });
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };
  const onDaysTextFieldChangelistner = (e, phase) => {
    const data = [...steps];
    if (
      (e.target.value === '' ||
        validateNameWithRegex(
          e.target.value,
          labels.WORKFLOWS.STEP_2.REGEX_OF_DAYS_RESTRICTED,
        )) &&
      e.target.value.length <= labels.WORKFLOWS.STEP_2.LENGTH_OF_DAYS
    ) {
      isSetModify(true);
      data[1].list.map(item => {
        if (item.propertyPhasesId === phase.propertyPhasesId) {
          const modifiedItem = item;
          modifiedItem.daysToComplete = e.target.value;

          if (!e.target.value.trim()) {
            modifiedItem.isError = messages.WORKFLOWS.STEP_2.MANDATORY_FIELD;
          } else if (
            e.target.value.length > labels.WORKFLOWS.STEP_2.LENGTH_OF_DAYS
          ) {
            modifiedItem.isError =
              messages.WORKFLOWS.STEP_2.LENGTH_OF_SPECIFICATION;
          } else if (
            !validateNameWithRegex(
              e.target.value,
              labels.WORKFLOWS.STEP_2.REGEX_OF_DAYS_REQUIRED,
            )
          ) {
            modifiedItem.isError =
              messages.WORKFLOWS.STEP_2.VALUE_MUSTBE_NUMBER;
          } else {
            modifiedItem.isError = '';
          }

          return modifiedItem;
        }

        return item;
      });
    }

    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
    // setIsBtnDisable(false);
  };

  // =================================== * Step 3 Listners * =============================================
  const handleSwitchToggleStep3 = (e, phase) => {
    e.preventDefault();
    isSetModify(true);
    const data = [...steps];
    const modifiedList = [...data[2].list];
    for (let i = 0; i < modifiedList.length; i += 1) {
      const ErrorDisplay = [];
      if (modifiedList[i].propertyPhasesId === phase.propertyPhasesId) {
        for (let j = 0; j < modifiedList[i].subPhases.length; j += 1) {
          if (
            modifiedList[i].subPhases[j].propertySubPhasesId ===
            phase.propertySubPhasesId
          ) {
            const changeIndex = modifiedList[i];
            changeIndex.subPhases[j].isMandatory = !changeIndex.subPhases[j]
              .isMandatory;
            modifiedList[i] = changeIndex;
            // break;
          }
          if (
            !modifiedList[i].subPhases[j].isMandatory ||
            modifiedList[i].subPhases[j].isDefaultMandatory
          ) {
            ErrorDisplay.push(modifiedList[i].subPhases[j]);
          }
        }
        if (ErrorDisplay.length === modifiedList[i].subPhases.length) {
          setErrorMessage(messages.WORKFLOWS.STEP_3.WARNING_SUBPHASE);
          setIsErrorMessageDuplicate(true);
        }
        break;
      }
    }
    data[2].list = modifiedList;
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
    // setIsBtnDisable(false);
  };
  const handleCheckToggleStep3 = (e, phase) => {
    e.preventDefault();
    const data = [...steps];
    const modifiedList = [...data[2].list];
    for (let i = 0; i < modifiedList.length; i += 1) {
      if (modifiedList[i].propertyPhasesId === phase.propertyPhasesId) {
        for (let j = 0; j < modifiedList[i].subPhases.length; j += 1) {
          if (
            modifiedList[i].subPhases[j].propertySubPhasesId ===
            phase.propertySubPhasesId
          ) {
            const changeIndex = modifiedList[i];
            changeIndex.subPhases[j].isParallel = !changeIndex.subPhases[j]
              .isParallel;
            modifiedList[i] = changeIndex;
            break;
          }
        }
        break;
      }
    }
    data[2].list = modifiedList;
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
    // setIsBtnDisable(false);
  };
  const SortingRows = (e, row, _phase) => {
    e.preventDefault();
    isSetModify(true);
    const data = [...steps];
    const changeRow = [...data[2].list];
    let isSwap = false;

    for (let i = 0; i < changeRow.length; i += 1) {
      if (changeRow[i].propertyPhasesId === row.propertyPhasesId) {
        for (let j = 0; j < changeRow[i].subPhases.length - 1; j += 1) {
          if (
            changeRow[i].subPhases[j].propertySubPhasesId ===
            row.propertySubPhasesId
          ) {
            for (let k = j + 1; k < changeRow[i].subPhases.length - 1; k += 1) {
              const swapSequence = changeRow[i].subPhases[j].sequence;
              const swapItem = changeRow[i].subPhases[j];
              if (!changeRow[i].subPhases[k].isDefaultMandatory) {
                // Swap Sequence
                changeRow[i].subPhases[j].sequence =
                  changeRow[i].subPhases[k].sequence;
                changeRow[i].subPhases[k].sequence = swapSequence;

                // Swap Index
                changeRow[i].subPhases[j] = changeRow[i].subPhases[k];
                changeRow[i].subPhases[k] = swapItem;
                isSwap = true;
              }
              if (isSwap) {
                break;
              }
            }
            if (isSwap) {
              break;
            }
          }
          if (isSwap) {
            break;
          }
        }
        if (isSwap) {
          break;
        }
      }
    }
    data[2].list = changeRow;
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
    // setIsBtnDisable(false);
  };

  // =================================== * Step 4 Listners * =============================================
  const DeletePreRequisites = (e, row) => {
    e.preventDefault();
    isSetModify(true);
    const data = [...steps];
    const changeRow = [...data[3].list];
    data[3].list = changeRow.filter(pre => pre !== row);
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };
  const handleselectedDataStep4 = item => {
    const data = [...steps];
    isSetModify(true);
    data[3].selected_data = item;
    data[3].isErrorSelect = false;
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };
  const handleaddedDataStep4 = item => {
    const data = [...steps];
    isSetModify(true);
    data[3].added_data = item;
    data[3].isErrorAdd = false;

    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };
  const addPreRequisiteGroup = _e => {
    const data = [...steps];

    if (
      Object.keys(steps[3].selected_data).length === 0 ||
      Object.keys(steps[3].added_data).length === 0
    ) {
      if (Object.keys(steps[3].selected_data).length === 0) {
        data[3].isErrorSelect =
          messages.WORKFLOWS.STEP_4.SELECT_ANY_ONE_PRE_GROUP;
      }
      if (Object.keys(steps[3].added_data).length === 0) {
        data[3].isErrorAdd =
          messages.WORKFLOWS.STEP_4.SELECT_ANY_ONE_BEFORE_PHASE;
      }
    } else {
      isSetModify(true);
      let adddata = data[3].list;
      const newData = {
        subPhaseRefId: data[3].added_data.id,
        phaseRefId: data[3].added_data.phaseId,
        propertyPrerequisiteGroupId: data[3].selected_data.id,
        PREREQUISITE: data[3].selected_data.names,
        BEFOREPHASE: data[3].added_data.value,
      };
      const CheckDuplicateData = [];
      for (let i = 0; i < adddata.length; i += 1) {
        if (
          adddata[i].subPhaseRefId === steps[3].added_data.id &&
          adddata[i].phaseRefId === steps[3].added_data.phaseId &&
          adddata[i].propertyPrerequisiteGroupId === steps[3].selected_data.id
        ) {
          break;
        } else {
          CheckDuplicateData.push(adddata[i]);
        }
      }
      if (adddata.length === CheckDuplicateData.length) {
        adddata = [...adddata, newData];
        data[3].added_data = {};
        data[3].selected_data = {};
      } else {
        setErrorMessage(messages.WORKFLOWS.STEP_4.DUPLICATE);
        setIsErrorMessageDuplicate(true);
      }
      data[3].list = adddata;
    }
    changeStep(data);
    if (isLoading) {
      isWorkflowLoading(false);
    }
  };

  // =================================== * Step 5 Listners * =============================================
  const handleLanguageSwitch = languageCode => {
    const data = [...steps];
    i18n.changeLanguage(languageCode);
    data[4].activeLanguage = languageCode;
    changeStep(data);
  };

  // ======================================================================================================

  return (
    <div className="setup-workflow">
      <div className="card pb-5">
        <CardHeader title="setup WORKFLOWS" />
        <Wizard formSteps={steps} onSelectStep={onChangeWizard} />
        <div className="col-12">
          {steps.map(item => {
            if (item.id === 1 && item.status === 'current') {
              return (
                <Step1
                  key={item.id}
                  workflowName={steps[0].workflowName}
                  fitOutType={steps[0].fitOutType}
                  fitOutList={fitOutList}
                  isErrorFitOutType={steps[0].isErrorFitOutType}
                  // isErrorWorkflowName={steps[0].isErrorWorkflowName}
                  isErrorFitOutTypeMsg={steps[0].isErrorFitOutTypeMsg}
                  // isErrorWorkflowNameMsg={steps[0].isErrorWorkflowNameMsg}
                  onWorkFlowNameTextChangelistner={
                    onWorkFlowNameTextChangelistner
                  }
                  onWorkFlowNameFocus={onWorkFlowNameFocus}
                  languages={languages}
                  fitoutDisable={steps[0].isEngagedToCase}
                  maxLength={labels.WORKFLOWS.STEP_1.LENGTH_OF_WORKFLOW_NAME}
                  onFitoutTypeChangelistner={onFitoutTypeChangelistner}
                />
              );
            }
            if (item.id === 2 && item.status === 'current') {
              return (
                <Step2
                  key={item.id}
                  topWizardComponent={
                    <StepWizardText
                      workflowName={steps[0].workflowName}
                      fitOutType={steps[0].fitOutType}
                      languages={languages}
                    />
                  }
                  data={steps[1].list}
                  handleCheckToggle={handleCheckToggle}
                  handleSwitchToggle={handleSwitchToggle}
                  onDaysTextFieldChangelistner={onDaysTextFieldChangelistner}
                  countOfStep2DataChange={countOfStep2DataChange}
                />
              );
            }

            if (item.id === 3 && item.status === 'current') {
              return (
                <Step3
                  key={item.id}
                  topWizardComponent={
                    <StepWizardText
                      workflowName={steps[0].workflowName}
                      fitOutType={steps[0].fitOutType}
                      languages={languages}
                    />
                  }
                  data={steps[2].list}
                  handleSwitchToggleStep3={handleSwitchToggleStep3}
                  handleCheckToggleStep3={handleCheckToggleStep3}
                  SortingRows={SortingRows}
                />
              );
            }
            if (item.id === 4 && item.status === 'current') {
              return (
                <Step4
                  key={item.id}
                  topWizardComponent={
                    <StepWizardText
                      workflowName={steps[0].workflowName}
                      fitOutType={steps[0].fitOutType}
                      languages={languages}
                    />
                  }
                  selectPreRequisite={selectPreRequisites}
                  addPreRequisite={step4phasesList}
                  data={steps[3].list}
                  handleselectedDataStep4={handleselectedDataStep4}
                  handleaddedDataStep4={handleaddedDataStep4}
                  selectedData={steps[3].selected_data}
                  addedData={steps[3].added_data}
                  isErrorAdd={steps[3].isErrorAdd}
                  isErrorSelect={steps[3].isErrorSelect}
                  addPreRequisiteGroup={addPreRequisiteGroup}
                  DeletePreRequisites={DeletePreRequisites}
                />
              );
            }
            if (item.id === 5 && item.status === 'current') {
              return (
                <Step5
                  data={getStep5Data}
                  key={item.id}
                  handleLanguageSwitch={handleLanguageSwitch}
                  languages={languages}
                  activeLanguage={steps[4].activeLanguage}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
      {steps.map(item => {
        if (item.id <= 3 && item.status === 'current') {
          return (
            <div
              key={item.id}
              className="add-or-update-phases-button-container mb-5"
            >
              <button
                type="button"
                className="btn-cancel"
                onClick={() => onCancelButtonClickListner()}
              >
                Cancel
              </button>
              {/* <button
                type="button"
                className="btn-save-close"
                onClick={onSaveAndCloseClickListner}
              >
                Save and Close
              </button> */}
              <button
                type="button"
                className="btn-save-submit"
                onClick={onSaveAndContinueClickListner}
                onDoubleClick={() => isWorkflowLoading(true)}
                disabled={isLoading}
              >
                Save and Continue
              </button>
            </div>
          );
        }

        if (item.id === 4 && item.status === 'current') {
          return (
            <div
              key={item.id}
              className="add-or-update-phases-button-container mb-5"
            >
              <button
                type="button"
                className="btn-cancel"
                onClick={() => onCancelButtonClickListner()}
              >
                Cancel
              </button>
              {/* <button
                type="button"
                className="btn-save-close"
                onClick={onSaveAndCloseClickListner}
              >
                Save and Close
              </button> */}
              <button
                type="button"
                className="btn-save-submit"
                onClick={onSaveAndContinueClickListner}
                onDoubleClick={() => isWorkflowLoading(true)}
                disabled={isLoading}
              >
                Preview Workflow
              </button>
            </div>
          );
        }
        if (item.id > 4 && item.status === 'current') {
          return (
            <div className="add-or-update-phases-button-container mb-5">
              <button
                type="button"
                className="btn-cancel btn-cancel-step5"
                onClick={onEditClickListner}
              >
                Edit
              </button>

              <button
                type="button"
                className="btn-save-submit btn-save-submit-step5"
                onClick={onSaveAndContinueClickListner}
                onDoubleClick={() => isWorkflowLoading(true)}
                disabled={isLoading}
              >
                Submit
              </button>
            </div>
          );
        }

        return null;
      })}
      <InformationAlert
        alertMessage={messages.GLOBAL.ERR_CHANGES_LOST}
        primaryButtonText="Yes"
        secondaryButtonText="No"
        open={isCancel}
        setClose={() => {
          if (isLoading) {
            isWorkflowLoading(false);
          }
          setIsCancel(!isCancel);
        }}
        primaryButtonOnClick={() => onCancelClickListner()}
      />
      <InformationAlert
        alertMessage={popupErrorMessage}
        primaryButtonText="Yes"
        secondaryButtonText="No"
        open={isErrorMessage}
        setClose={() => {
          if (isLoading) {
            isWorkflowLoading(false);
          }
          setIsErrorMessage(!isErrorMessage);
        }}
        primaryButtonOnClick={() => setAutoPopupStep1()}
      />
      <InformationAlert
        alertMessage={popupErrorMessage}
        primaryButtonText="Yes"
        secondaryButtonText="No"
        open={step4Popup}
        setClose={() => {
          if (isLoading) {
            isWorkflowLoading(false);
          }
          setStep4Popup(!step4Popup);
          removeSelectedDropdownData();
        }}
        primaryButtonOnClick={() => {
          addPreRequisiteGroup();
          setStep4Popup(!step4Popup);
        }}
      />
      <ErrorAlert
        alertMessage={popupErrorMessage}
        primaryButtonText="OK"
        open={isErrorMessageDuplicate}
        setClose={() => setIsErrorMessageDuplicate(!isErrorMessageDuplicate)}
        primaryButtonOnClick={() =>
          setIsErrorMessageDuplicate(!isErrorMessageDuplicate)
        }
      />
      <SuccessAlert
        alertMessage={popupErrorMessage}
        primaryButtonText="OK"
        open={isSuccess}
        setClose={() => WorkflowAddedSuccess()}
        primaryButtonOnClick={() => WorkflowAddedSuccess()}
      />
    </div>
  );
}

SetupWorkFlows.defaultProps = {
  fitOutList: [],
  selectPreRequisites: [],
  getStep5Data: [],
  steps: [],
  requisites: [],
  match: [],
  location: [],
  step4phasesList: [],
  languages: [],
  isLoading: false,
};

SetupWorkFlows.propTypes = {
  fitOutList: PropTypes.instanceOf(Array),
  selectPreRequisites: PropTypes.instanceOf(Array),
  getStep5Data: PropTypes.instanceOf(Array),
  steps: PropTypes.instanceOf(Array),
  isModifyStatus: PropTypes.bool.isRequired,
  getFitOutTypesListApi: PropTypes.func.isRequired,
  getSetupWorkflowApiDetails: PropTypes.func.isRequired,
  getPreRequisiteApi: PropTypes.func.isRequired,
  requisites: PropTypes.instanceOf(Array),
  changeStep: PropTypes.func.isRequired,
  match: PropTypes.instanceOf(Array),
  location: PropTypes.instanceOf(Array),
  callStep1Api: PropTypes.func.isRequired,
  callStep2Api: PropTypes.func.isRequired,
  callStep3Api: PropTypes.func.isRequired,
  callStep4Api: PropTypes.func.isRequired,
  callStep5Api: PropTypes.func.isRequired,
  // getLanguagesRD: PropTypes.func.isRequired,
  resetWorkFlowGlobalModule: PropTypes.func.isRequired,
  resetWorkFlowModule: PropTypes.func.isRequired,
  // setPhases: PropTypes.func.isRequired,
  isSetUpLoading: PropTypes.func.isRequired,
  isSetModify: PropTypes.func.isRequired,
  step4phasesList: PropTypes.instanceOf(Array),
  setWorkflowStepResponse: PropTypes.func.isRequired,
  isWorkflowLoading: PropTypes.func.isRequired,
  languages: PropTypes.instanceOf(Array),
  isLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  fitOutList: getFitOutTypesList(state),
  selectPreRequisites: getSelectPreRequisites(state),
  getStep5Data: getStep5DataSelector(state),
  steps: getSteps(state),
  isModifyStatus: getIsModify(state),
  requisites: getrequisites(state),
  step4phasesList: getPhasesBeforeDropdownSelector(state),
  languages: getLanguages(state),
  isLoading: getWorkFlowisLoading(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getFitOutTypesListApi: getFitOutTypesListApiAction,
      getSetupWorkflowApiDetails: getSetupWorkflowApiDetailsAction,
      getPreRequisiteApi: getPreRequisiteListApiAction,
      saveSetUpWorkFlowStep: saveSetUpWorkFlowSteps,
      changeStep: setWizardSteps,
      isSetUpLoading: setUpWorkFlowLoading,
      isSetModify: setUpWorkFlowFormModify,
      callStep1Api: callStep1ApiAction,
      callStep2Api: callStep2ApiAction,
      callStep3Api: callStep3ApiAction,
      callStep4Api: callStep4ApiAction,
      callStep5Api: callStep5ApiAction,
      resetWorkFlowGlobalModule: resetWorkFlowModuleAction,
      resetWorkFlowModule: resetWorkFlowFormModuleAction,
      setWorkflowStepResponse: setWorkflowInitialDetails,
      isWorkflowLoading: setWorkFlowLoading,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SetupWorkFlows);
