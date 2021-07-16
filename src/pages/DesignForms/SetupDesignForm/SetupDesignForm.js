import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import CardHeader from '../../../components/CardHeader/CardHeader';
import Wizard from '../../../components/Wizard/Wizard';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
/** Error & Lables */
import labels from '../../../utils/Locales/labels';
import messages from '../../../utils/Locales/messages';
import constants from '../../../utils/constants';
// steps
import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';
import Step5 from './Step5/Step5';
/** REDUX */
import {
  setWizardSteps,
  setFormId,
  saveDesignFormStep1Data,
  saveDesignFormStep2Data,
  saveDesignFormStep3Data,
  getfileTypeOptionsListApiAction,
  saveDesignFormStep4Data,
  saveDesignFormStep5Data,
  getFormDataAPiAction,
  resetDesignFormAction,
  getFormDataStepWise,
  getDesignSubPhasesListApiAction,
  checkDesignFormEditableApiAction,
} from '../../../actions/designFormsActions';
import './SetupDesignForm.scss';

import {
  getSteps,
  getFormId,
  getFileTypesOptions,
  getDesignSubPhasesList,
  isDesignSubPhasesListFetched,
} from '../selector';

import {
  getErrorMessage,
  scrollToTop,
  insertIsErrorInLabels,
  countCharacter,
} from '../../../utils/utils';

function SetupDesingForm({
  steps,
  changeStep,
  formId,
  changeFormId,
  fileTypeOptions,
  getfileTypeOptionsListAction,
  getDesignSubPhasesListAction,
  location,
  match,
  history,
  designSubPhasesList,
  resetDesignForm,
  languages,
  primaryLanguage,
  isDesignSubPhasesFetched,
}) {
  // edit or copy
  const action = location.state ? location.state.action : '';
  // add request if not edit
  const isAddRequest = action !== 'edit';
  // fetch data if copy or edit
  const isFetchData = action !== '';
  // form id for get data from url
  const formIdForGetData = match.params.id;

  const [isSavingData, setIsSavingData] = useState(false);

  // const [isPublished, setIsPublished] = useState(false); // form is published or not uncomment it if required
  // alert states
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(false); // populate , cancel (provide unique name for each action)
  // success
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [successMessage, setsuccessMessage] = useState(false);

  // error
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [errorAction, setErrorAction] = useState(false); // duplicate , other

  // notes and specification is required
  const [autoPopulate, setAutoPopulate] = useState('all'); // note , specification , all for both

  // active step
  const [activeStep, setActiveStep] = useState(0);

  // clickable steps : to which steps we can jump
  const [clickableSteps, setClickableSteps] = useState(0);
  // duplicateSections: duplicate sections we store here to validate in step 3
  const [duplicateSections, setDuplicateSections] = useState([]);
  // duplicateFiles: duplicate files we store here to validate in step 4
  const [duplicateFiles, setDuplicateFiles] = useState([]);

  // data change count for step 3 and 4 for table we need to initialize columns again if data change because we are not getting update data into table
  const [countOfStep3DataChange, setCountOfStep3DataChange] = useState(0);
  const [countOfStep4DataChange, setCountOfStep4DataChange] = useState(0);

  // isBindWithAnyWorkFlow
  const [isBindWithAnyWorkFlow, setIsBindWithAnyWorkFlow] = useState(false);

  // step 1: indert empty objects in names and store it in redux store state
  const setFormNameLabels = () => {
    const stepsData = [...steps];
    const formNameLabels = insertEmptyObjectsInNames(
      stepsData[0].step1Data.formNames,
    );
    stepsData[0].step1Data.formNames = insertIsErrorInLabels(formNameLabels);
    stepsData[0].step1Data.formNamesForReset = _.cloneDeep(
      stepsData[0].step1Data.formNames,
    );
    changeStep(stepsData);
  };

  /**
   * insertEmptyObjectsInLabels : insert new label object if not exist for note / specification
   * @param {array} array : pass array in which we want to add label's object if not exist
   * @param {string} type : type = note / specification
   *
   */

  const insertEmptyObjectsInLabels = (array, type) => {
    if (array.length === languages.length) {
      return array;
    }
    languages.forEach(language => {
      if (
        !array.find(arrayObj => arrayObj.languageCode === language.languageCode)
      )
        if (type === 'note') {
          array.push({
            note: '',
            languageCode: language.languageCode,
            languageName: language.languageName,
          });
        } else if (type === 'specification') {
          array.push({
            specification: '',
            languageCode: language.languageCode,
            languageName: language.languageName,
          });
        }
    });
    return array;
  };

  const insertEmptyObjectsInNames = array => {
    if (array.length === languages.length) {
      return array;
    }
    languages.forEach(language => {
      if (
        !array.find(arrayObj => arrayObj.languageCode === language.languageCode)
      )
        array.push({
          name: '',
          languageCode: language.languageCode,
          languageName: language.languageName,
        });
    });
    return array;
  };

  // to set empty label object
  const insertEmptyObjectsWithLabel = array => {
    if (array.length === languages.length) {
      return array;
    }
    languages.forEach(language => {
      if (
        !array.find(arrayObj => arrayObj.languageCode === language.languageCode)
      )
        array.push({
          label: '',
          languageCode: language.languageCode,
          languageName: language.languageName,
        });
    });
    return array;
  };

  // notes and specifications we are adding isError , data for reset , empty object here if needed after fetched data
  const setLabels = () => {
    const data = [...steps];

    // 1. notes
    const noteLabels = insertEmptyObjectsInLabels(
      data[1].step2Data.notes,
      'note',
    );
    data[1].step2Data.notes = insertIsErrorInLabels(noteLabels);

    // 2. specification
    const specificationLabels = insertEmptyObjectsInLabels(
      data[1].step2Data.specifications,
      'specification',
    );

    data[1].step2Data.specifications = insertIsErrorInLabels(
      specificationLabels,
    );

    // RESET
    data[1].step2Data.notesForReset = _.cloneDeep(data[1].step2Data.notes);
    data[1].step2Data.specificationsForReset = _.cloneDeep(
      data[1].step2Data.specifications,
    );

    changeStep(data);
  };

  // step 4
  // getFileTypes: set file type object with ext
  const getFileTypes = types => {
    const valuesArray = [];
    types.forEach(i => {
      if (
        !fileTypeOptions.find(item => item.value === i) ||
        fileTypeOptions.find(item => item.value === i) === undefined
      )
        return;
      valuesArray.push({
        id: fileTypeOptions.find(item => item.value === i).id,
        label: i,
        value: i,
        fileType: fileTypeOptions.find(item => item.value === i).fileType,
      });
    });
    return valuesArray;
  };

  // fetchRecords: fetch all records
  const fetchRecords = () => {
    getFormDataStepWise(0, formId || formIdForGetData)
      .then(_response => {
        if (_response.data.success) {
          if (_response.data.data.length) {
            const res = _response.data.data[0];
            // step 1
            const stepsData = [...steps];
            // setIsPublished(res.ispublish); // uncomment if is published required

            stepsData[0].step1Data.formNames =
              action === 'edit' ? res.names : [];

            stepsData[0].step1Data.caseType.ctId = res.ctid;

            // For publish or unpublish if design subphase disable from add-update subphase then don't store it in subphase id
            const isSubPhaseInList =
              designSubPhasesList.filter(subPhase => {
                return subPhase.id === res.sphid;
              }).length > 0;
            // for edit case if subphase is not disable then we are store subphaseId other wise for create a copy we store empty
            stepsData[0].step1Data.subPhase.subPhaseId =
              action === 'edit' && isSubPhaseInList ? res.sphid : '';

            // set data for reset here in ctId and subPhaseId
            stepsData[0].step1Data.caseType.ctIdForReset =
              stepsData[0].step1Data.caseType.ctId;
            stepsData[0].step1Data.subPhase.subPhaseIdForReset =
              stepsData[0].step1Data.subPhase.subPhaseId;

            // isNextStepClickable : using isNextStepClickable we are managing next step is clickable or not based on records we get from api
            let isNextStepClickable = false;

            // step 1 is clickable or not
            if (
              stepsData[0].step1Data.formNames.length === 0 ||
              stepsData[0].step1Data.formNames.length !== languages.length ||
              !stepsData[0].step1Data.caseType.ctId ||
              !stepsData[0].step1Data.subPhase.subPhaseId
            ) {
              setClickableSteps(1); // if step 1 has error then we only allow user to stay on step 1
              stepsData[0].isSaved = false;
              isNextStepClickable = false;
            } else {
              stepsData[0].isSaved = true;
              isNextStepClickable = true;
            }

            changeStep(stepsData);
            setFormNameLabels();

            // step 2
            stepsData[1].step2Data.notes = _.cloneDeep(
              res.notesAndSpecifications,
            );
            stepsData[1].step2Data.specifications = _.cloneDeep(
              res.notesAndSpecifications,
            );

            if (action === 'edit') {
              isNextStepClickable = true;
              stepsData[1].isSaved = true;
            }

            changeStep(stepsData);
            // setLabels: will set lables to our notes and specifications
            setLabels();

            // step 3 and 4
            const sectionsArrayResponse = res.sections;
            const sectionsFilesData = [];

            if (sectionsArrayResponse.length > 0) {
              // sectionsArrayResponse: for each section we are seting name, sequence
              sectionsArrayResponse.forEach((section, i) => {
                const sectionData = section;
                const filesData = section.files;
                sectionData.sectionName = `${
                  labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.SECTION_LABEL
                } ${i + 1}`;
                sectionData.sectionSequence = i + 1;
                sectionData.id = i + 1;
                if (action === 'edit') {
                  // for edit we have sectionRefId
                  sectionData.sectionId = section.sectionRefId;
                } else {
                  // else we manage by i
                  sectionData.sectionId = i + 1;
                }
                sectionData.names = insertEmptyObjectsInNames(
                  insertEmptyObjectsWithLabel(section.names),
                );
                if (i === 0) {
                  // we are setting focus on first section input box
                  const indexOfPrimaryLanguage = sectionData.names.findIndex(
                    item => item.languageCode === primaryLanguage,
                  );
                  sectionData.names[indexOfPrimaryLanguage].isFocus = true;
                }
                // handle files
                if (filesData.length > 0) {
                  filesData.forEach(file => {
                    sectionsFilesData.push({
                      id: sectionsFilesData.length + 1,
                      fileName: `${
                        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FILE_LABEL
                      } ${sectionsFilesData.length + 1}`,
                      fTypes: file.fileTypes
                        ? getFileTypes(file.fileTypesExt.split(','))
                        : [],
                      isFileTypeError: false,
                      fTypesExt: file.fileTypesExt
                        ? file.fileTypesExt.split(',')
                        : [],
                      labels: insertIsErrorInLabels(
                        insertEmptyObjectsWithLabel(file.labels, 'label'),
                      ),
                      sectionId:
                        action === 'edit' ? section.sectionRefId : i + 1,
                      sectionSequence: sectionData.sectionSequence,
                    });
                  });
                }
              });
            } else {
              // if no any sections then we get files in otherFiles array
              const otherFilesArrayResponse = res.otherFiles;
              if (otherFilesArrayResponse.length > 0) {
                otherFilesArrayResponse.forEach(async file => {
                  sectionsFilesData.push({
                    id: sectionsFilesData.length + 1,
                    fileName: `${
                      labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FILE_LABEL
                    } ${sectionsFilesData.length + 1}`,
                    fTypes: file.fileTypes
                      ? getFileTypes(file.fileTypesExt.split(','))
                      : [],
                    isFileTypeError: false,
                    fTypesExt: file.fileTypesExt
                      ? file.fileTypesExt.split(',')
                      : [],
                    labels: insertIsErrorInLabels(
                      insertEmptyObjectsWithLabel(file.labels),
                    ),
                    sectionId: '0',
                  });
                });
              }
            }

            stepsData[2].step3Data.formSections = sectionsArrayResponse;

            if (sectionsFilesData.length === 0) {
              // sectionsFilesData not exist then we do not allow user to jump on step 5
              stepsData[3].isSaved = true;
              stepsData[4].isSaved = false;
            } else {
              // we have files then set focus on first file
              const indexOfPrimaryLanguage = sectionsFilesData[0].labels.findIndex(
                item => item.languageCode === primaryLanguage,
              );
              sectionsFilesData[0].labels[
                indexOfPrimaryLanguage
              ].isFocus = true;
              stepsData[3].step4Data.sectionsFiles = sectionsFilesData;
            }

            // reset
            stepsData[2].step3Data.formSectionsForReset = _.cloneDeep(
              stepsData[2].step3Data.formSections,
            );

            stepsData[3].step4Data.sectionsFilesForReset = _.cloneDeep(
              stepsData[3].step4Data.sectionsFiles,
            );

            if (isNextStepClickable) {
              // if step 3 is clickable
              if (stepsData[3].step4Data.sectionsFiles.length === 0) {
                stepsData[2].isSaved = true;
                stepsData[3].isSaved = true;
                stepsData[4].isSaved = false; // if we don't have files then don't allow user to preview screen
              } else {
                stepsData[2].isSaved = true; // if we have files then step 3 is also clickable
                stepsData[3].isSaved = true;
                stepsData[4].isSaved = true;
              }
            }
            changeStep(stepsData);
          }
        }
      })
      .catch(error => {
        const saveErrorMessage = getErrorMessage(error);
        setIsErrorMessage(true);
        setErrorMessage(saveErrorMessage);
      });
  };

  useEffect(() => {
    scrollToTop();
    // step 4
    if (action === 'edit') {
      checkDesignFormEditableApiAction(formIdForGetData)
        .then(_response => {
          if (_response.data.success) {
            setIsBindWithAnyWorkFlow(!_response.data.data[0]);
          }
        })
        .catch(_error => {
          handleError(_error);
        });
    }
    getfileTypeOptionsListAction(); // get file types
    getDesignSubPhasesListAction(); // get design subphases
    if (match.params.id) {
      changeFormId(match.params.id);
    }
    return () => {
      resetDesignForm();
    };
  }, []);

  useEffect(() => {
    if (isFetchData && isDesignSubPhasesFetched) {
      fetchRecords();
    } else {
      setFormNameLabels();
      setLabels();
    }
  }, [fileTypeOptions, designSubPhasesList, isDesignSubPhasesFetched]);

  useEffect(() => {
    if (action === 'copy') {
      // for copy we are setting isSaved false for all steps
      const stepsData = [...steps];
      stepsData.forEach(step => {
        const stepData = step;
        stepData.isSaved = false;
      });
      changeStep(stepsData);
    }
  }, [action]);

  // goToNextStep : go to next step when step is complete
  const goToNextStep = () => {
    const stepsData = [...steps];
    stepsData[activeStep].status = '';
    stepsData.forEach((e, phaseCount) => {
      if (phaseCount === activeStep + 1) {
        stepsData[phaseCount].status = 'current';
        setActiveStep(activeStep + 1);
      } else {
        stepsData[phaseCount].status = '';
      }
    });
    // isSetUpLoading(false);
    changeStep(stepsData);
  };

  const onSaveAndContinueClickListner = () => {
    const stepsData = [...steps];
    // set true for disable save and continue button

    const currentSelected = stepsData.findIndex(
      ({ status }) => status === 'current',
    );
    setActiveStep(currentSelected);
    if (currentSelected !== undefined) {
      // Step index 0,1,2,3 : step1 , step2 , step3 and step4
      if (currentSelected === 0) {
        // step 1
        // condition 1: checking if mandatory form name is empty
        const emptyPrimaryFormLabel = stepsData[0].step1Data.formNames.filter(
          (formData, indexOfLabel) => {
            if (
              formData.name === '' &&
              formData.languageCode === primaryLanguage
            ) {
              stepsData[0].step1Data.formNames[indexOfLabel].isError = true;
              return true;
            }
            return false;
          },
        );

        //  condition 2: chase type(fitout type) is empty
        let isCaseTypeEmpty = false;
        if (stepsData[0].step1Data.caseType.ctId === '') {
          stepsData[0].step1Data.caseType.isError = true;
          isCaseTypeEmpty = true;
        }

        //  condition 3: subphase is empty
        let isSubPhaseEmpty = false;
        if (stepsData[0].step1Data.subPhase.subPhaseId === '') {
          stepsData[0].step1Data.subPhase.isError = true;
          isSubPhaseEmpty = true;
        }

        if (
          emptyPrimaryFormLabel.length > 0 ||
          isCaseTypeEmpty ||
          isSubPhaseEmpty
        ) {
          changeStep(stepsData);
          return;
        }

        // condition 4: if secondary form name is empty then auto populate it
        const emptySecondaryFormLabel = stepsData[0].step1Data.formNames.filter(
          formData => {
            if (
              formData.name === '' &&
              formData.languageCode !== primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );

        if (emptySecondaryFormLabel.length > 0) {
          // auto populate language
          setAlertMessage(
            messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
              .AUTO_POPULATE_LANGUAGE,
          );
          setAlertAction('populate');
          setIsAlertOpen(true);
          return;
        }

        if (stepsData[0].step1Data.isError) return;

        const { subPhase, caseType, formNames } = stepsData[0].step1Data;
        const formData = {
          sphId: subPhase.subPhaseId,
          ctId: caseType.ctId,
          isPublish: false,
          names: _.map(
            formNames,
            _.partialRight(_.pick, ['languageCode', 'name']),
          ),
        };

        let request = !stepsData[0].isSaved;
        if (action === 'edit') request = false;

        setIsSavingData(true);
        saveDesignFormStep1Data(formData, request, formId)
          .then(_response => {
            setIsSavingData(false);
            if (_response.data.success) {
              if (_response.data.data.length) {
                const res = _response.data.data[0];
                stepsData[0].response = res;
                // data for reset form on cancel click
                stepsData[0].step1Data.formNamesForReset = _.cloneDeep(
                  stepsData[0].step1Data.formNames,
                );
                stepsData[0].step1Data.caseType.ctIdForReset =
                  stepsData[0].step1Data.caseType.ctId;
                stepsData[0].step1Data.subPhase.subPhaseIdForReset =
                  stepsData[0].step1Data.subPhase.subPhaseId;
                changeFormId(res.formid);
                changeStep(stepsData);
                if (res.formid) {
                  if (stepsData[0].isSaved) {
                    stepsData[1].isSaved = true;
                  }
                  if (!stepsData[0].isSaved) {
                    setClickableSteps(2);
                  }
                  stepsData[0].isSaved = true;
                  changeStep(stepsData);
                  goToNextStep();
                }
              }
            }
          })
          .catch(_error => {
            setIsSavingData(false);
            setErrorMessage(`${getErrorMessage(_error)}`);
            setIsErrorMessage(true);
          });
      }
      if (currentSelected === 1) {
        // Step 2: do not remove this code

        // condition 1: checking if mandatory note is empty
        const emptyPrimaryNote = stepsData[1].step2Data.notes.filter(
          noteData => {
            if (
              noteData.note === '' &&
              noteData.languageCode === primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );

        // condition 2: checking if mandatory specification is empty
        const emptyPrimarySpecification = stepsData[1].step2Data.specifications.filter(
          specificationData => {
            if (
              specificationData.specification === '' &&
              specificationData.languageCode === primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );

        // // condition 3: if secondary note is empty
        const emptySecondaryNoteLabel = stepsData[1].step2Data.notes.filter(
          noteData => {
            if (
              noteData.note === '' &&
              noteData.languageCode !== primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );

        // condition 4: if secondary specification is empty
        const emptySecondarySpecificationLabel = stepsData[1].step2Data.specifications.filter(
          specificationData => {
            if (
              specificationData.specification === '' &&
              specificationData.languageCode !== primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );

        if (
          emptyPrimaryNote.length === 0 &&
          emptyPrimarySpecification.length === 0
        ) {
          // note and specification both added for primary and secornary empty

          if (
            emptySecondaryNoteLabel.length > 0 &&
            emptySecondarySpecificationLabel.length > 0
          ) {
            setAlertMessage(
              messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.AUTO_POPULATE_BOTH,
            );
            setAutoPopulate('all');
            setAlertAction('populate');
            setIsAlertOpen(true);
            return;
          }
        }
        if (emptyPrimaryNote.length === 0) {
          if (emptySecondaryNoteLabel.length > 0) {
            setAlertMessage(
              messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.AUTO_POPULATE_NOTE,
            );
            setAutoPopulate('note');
            setAlertAction('populate');
            setIsAlertOpen(true);
            return;
          }
        }
        if (emptyPrimarySpecification.length === 0) {
          if (emptySecondarySpecificationLabel.length > 0) {
            setAlertMessage(
              messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                .AUTO_POPULATE_SPECIFICATION,
            );
            setAutoPopulate('specification');
            setAlertAction('populate');
            setIsAlertOpen(true);
            return;
          }
        }

        if (stepsData[1].step2Data.isError) return;

        // check length
        const lengthExidedPrimaryNote = stepsData[1].step2Data.notes.filter(
          noteData => {
            if (
              countCharacter(noteData.note) >
                labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .LENGTH_OF_NOTE_CONTENT &&
              noteData.languageCode === primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );
        const lengthExidedSecondaryNote = stepsData[1].step2Data.notes.filter(
          noteData => {
            if (
              countCharacter(noteData.note) >
                labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .LENGTH_OF_NOTE_CONTENT_SECONDARY &&
              noteData.languageCode !== primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );
        const lengthExidedPrimarySpecification = stepsData[1].step2Data.specifications.filter(
          specificationData => {
            if (
              countCharacter(specificationData.specification) >
                labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .LENGTH_OF_SPECIFICATION_CONTENT &&
              specificationData.languageCode === primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );
        const lengthExidedSecondarySpecification = stepsData[1].step2Data.specifications.filter(
          specificationData => {
            if (
              countCharacter(specificationData.specification) >
                labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .LENGTH_OF_SPECIFICATION_CONTENT_SECONDARY &&
              specificationData.languageCode !== primaryLanguage
            ) {
              return true;
            }
            return false;
          },
        );

        if (
          lengthExidedPrimaryNote.length > 0 ||
          lengthExidedSecondaryNote.length > 0 ||
          lengthExidedPrimarySpecification.length > 0 ||
          lengthExidedSecondarySpecification.length > 0
        )
          return;

        const { notes, specifications } = stepsData[1].step2Data;
        const formData = {
          formId,
          isPublish: false,
          notes: _.map(notes, _.partialRight(_.pick, ['languageCode', 'note'])),
          specifications: _.map(
            specifications,
            _.partialRight(_.pick, ['languageCode', 'specification']),
          ),
        };

        let request = !stepsData[1].isSaved;
        if (action === 'edit') request = false;

        setIsSavingData(true);
        saveDesignFormStep2Data(formData, request, formId)
          .then(_response => {
            setIsSavingData(false);
            if (_response.data.success) {
              if (_response.data.data.length) {
                const res = _response.data.data[0];
                stepsData[1].response = res;
                // RESET
                stepsData[1].step2Data.notesForReset = _.cloneDeep(
                  stepsData[1].step2Data.notes,
                );
                stepsData[1].step2Data.specificationsForReset = _.cloneDeep(
                  stepsData[1].step2Data.specifications,
                );

                if (res.notesAndSpecifications.length > 0) {
                  if (stepsData[1].isSaved) {
                    stepsData[2].isSaved = true;
                  }
                  if (!stepsData[1].isSaved) {
                    setClickableSteps(3);
                  }
                  stepsData[1].isSaved = true;
                  changeStep(stepsData);
                  goToNextStep();
                } else {
                  setIsErrorMessage(true);
                  setErrorMessage(
                    messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                      .ERROR_WHILE_STORING_NOTE_AND_SPECIFICATION,
                  );
                }
              }
            }
          })
          .catch(_error => {
            setIsSavingData(false);
            setIsErrorMessage(true);
            setErrorMessage(`${getErrorMessage(_error)}`);
            return true;
          });
      }
      if (currentSelected === 2) {
        // Step 3:

        if (stepsData[2].step3Data.formSections.length === 0) {
          setIsErrorMessage(true);
          setErrorMessage(
            `${messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.ADD_SECTION_FIRST}`,
          );
          return;
        }

        // condition 1: if primary name is empty
        const emptyPrimarySectionLabel = stepsData[2].step3Data.formSections.filter(
          section => {
            const sectionData = section;
            const indexOfPrimaryData = sectionData.names.findIndex(
              nameData => nameData.languageCode === primaryLanguage,
            );
            if (sectionData.names[indexOfPrimaryData].name === '') {
              sectionData.names[indexOfPrimaryData].isError = true;
              return true;
            }
            return false;
          },
        );

        if (emptyPrimarySectionLabel.length > 0) {
          changeStep(stepsData);
          setCountOfStep3DataChange(countOfStep3DataChange + 1);
          return;
        }

        // condition 2: if primary name is entered and secondary name  is empty
        const emptySecondarySectionLabel = stepsData[2].step3Data.formSections.some(
          section => {
            const sectionData = section;
            const indexOfPrimaryData = sectionData.names.findIndex(
              nameData => nameData.languageCode === primaryLanguage,
            );

            return sectionData.names.some(nameData => {
              if (sectionData.names[indexOfPrimaryData].name !== '')
                if (
                  nameData.languageCode !== primaryLanguage &&
                  nameData.name === ''
                )
                  return true;
              return false;
            });
          },
        );

        if (emptySecondarySectionLabel) {
          setAlertMessage(messages.GLOBAL.AUTO_POPULATE_FIELDS);
          setAlertAction('populate');
          setIsAlertOpen(true);
          return;
        }

        // condition 3: if same section name

        // valueArr : to store all object with language code and name
        const valueArr = [];

        _.map(stepsData[2].step3Data.formSections, item => {
          const itemData = item;
          const namesWithId = [];
          itemData.names.forEach(label => {
            const labelData = label;
            labelData.id = itemData.id;
            namesWithId.push(labelData);
          });
          valueArr.push(...namesWithId);
        });

        const duplicateItems = valueArr
          .map(e => {
            return e.languageCode + e.name.trim().toUpperCase();
          })
          .map((e, i, final) => {
            return final.indexOf(e) !== i && i;
          })
          .filter(obj => valueArr[obj])
          .map(e => {
            return valueArr[e];
          });

        const isDuplicate = duplicateItems.length > 0;

        if (isDuplicate) {
          setDuplicateSections(duplicateItems);
          setErrorAction('duplicate');
          setIsErrorMessage(true);
          setErrorMessage(
            `${messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.LABEL_SHOULD_BE_UNIQUE}`,
          );
          return;
        }

        const { formSections } = stepsData[2].step3Data;

        _.map(formSections, item => {
          const itemData = item;
          if (itemData.sectionId && itemData.sectionId !== 0) {
            itemData.sectionRefId = itemData.sectionId;
          }

          itemData.names = _.map(
            itemData.names,
            _.partialRight(_.pick, ['languageCode', 'name']),
          );
        });

        const requestData = _.map(
          formSections,
          _.partialRight(_.pick, 'names', 'sectionRefId'),
        );

        _.map(requestData, item => {
          const itemData = item;
          itemData.isDefault = false;
        });

        const formData = {
          formId,
          isPublish: false,
          formSections: requestData,
        };

        let request = !stepsData[2].isSaved;
        if (action === 'edit') request = false;

        setIsSavingData(true);
        saveDesignFormStep3Data(formData, request, formId)
          .then(_response => {
            setIsSavingData(false);
            if (_response.data.success) {
              if (_response.data.data.length) {
                const res = _response.data.data[0];
                stepsData[2].response = res;
                // for edit
                if (stepsData[2].isSaved) {
                  stepsData[3].isSaved = true;
                }
                stepsData[2].isSaved = true;

                // if we have sections but files not there then we do not allow to jump on step 5
                stepsData[4].isSaved = false;

                // handle section id chnage
                formSections.forEach((section, indexOfsection) => {
                  const indexOfPrimaryLabel = section.names.findIndex(
                    name => name.languageCode === primaryLanguage,
                  );

                  // for action copy we need to update section id of each file
                  const sectionFiles = stepsData[3].step4Data.sectionsFiles;
                  res.sections.forEach(responseDataOfSection => {
                    if (responseDataOfSection.names.length === 0) {
                      throw new Error(
                        messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.ERROR_WHILE_STORING_SECTION_NAME,
                      );
                    } else {
                      const indexOfPrimaryLabelInResponseData = responseDataOfSection.names.findIndex(
                        name => name.languageCode === primaryLanguage,
                      );
                      if (
                        section.names[indexOfPrimaryLabel].name ===
                        responseDataOfSection.names[
                          indexOfPrimaryLabelInResponseData
                        ].name
                      ) {
                        if (action === 'copy') {
                          // section files with default seciton id
                          // we are going to set section id for files related to section
                          sectionFiles.forEach(file => {
                            const fileData = file;
                            if (
                              file.sectionSequence ===
                              formSections[indexOfsection].sectionSequence
                            ) {
                              fileData.sectionId =
                                responseDataOfSection.sectionRefId;
                            }
                          });
                        }
                        formSections[indexOfsection].sectionId =
                          responseDataOfSection.sectionRefId;
                      }
                    }
                  });
                  if (action === 'copy') {
                    stepsData[3].step4Data.sectionsFiles = sectionFiles;
                  }
                });

                stepsData[2].step3Data.formSections = formSections;

                // reset
                stepsData[2].step3Data.formSectionsForReset = _.cloneDeep(
                  stepsData[2].step3Data.formSections,
                );

                changeStep(stepsData);

                if (stepsData[2].step3Data.formSections.length > 0) {
                  // if we have sections then we need to check if any file exist with sectionId: '0' then we need to remove that file
                  const filesWithSectionId = stepsData[3].step4Data.sectionsFiles.filter(
                    file => file.sectionId && file.sectionId !== '0',
                  );
                  stepsData[3].step4Data.sectionsFiles = filesWithSectionId;
                  stepsData[3].step4Data.sectionsFilesForReset = _.cloneDeep(
                    filesWithSectionId,
                  );
                  if (!stepsData[2].isSaved) {
                    setClickableSteps(4);
                  }
                  stepsData[2].isSaved = true;
                  changeStep(stepsData);
                  goToNextStep();
                } else {
                  setIsErrorMessage(true);
                  setErrorMessage(
                    messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3
                      .ERROR_WHILE_STORING_SECTION_NAME,
                  );
                }
              }
            }
          })
          .catch(_error => {
            setIsSavingData(false);
            setIsErrorMessage(true);
            setErrorMessage(`${getErrorMessage(_error)}`);
            return true;
          });
      }
      if (currentSelected === 3) {
        // step 4 stepsData[3].step4Data
        const { sectionsFiles } = stepsData[3].step4Data;

        // condition 1 : files not exist then show message
        if (sectionsFiles.length === 0) {
          setIsErrorMessage(true);
          setErrorMessage(
            messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.NO_FILES_FOUND,
          );
          return;
        }

        // condition 4: check if file type is empty
        let FILE_TYPE_ERROR_COUNT = 0;
        sectionsFiles.map(file => {
          const fileData = file;
          if (fileData.fTypes.length === 0) {
            FILE_TYPE_ERROR_COUNT += 1;
            fileData.isFileTypeError = true;
            return true;
          }
          return false;
        });

        stepsData[3].step4Data.sectionsFiles = sectionsFiles;

        // condition 2: check if primary labels is empty
        let PRIMARY_LABEL_ERROR_COUNT = 0;
        sectionsFiles.map(fileData => {
          return fileData.labels.map(label => {
            const labelData = label;
            if (
              labelData.label === '' &&
              labelData.languageCode === primaryLanguage
            ) {
              labelData.isError = true;
              PRIMARY_LABEL_ERROR_COUNT += 1;
              return true;
            }
            return false;
          });
        });

        stepsData[3].step4Data.sectionsFiles = sectionsFiles;
        if (PRIMARY_LABEL_ERROR_COUNT > 0 || FILE_TYPE_ERROR_COUNT > 0) {
          changeStep(stepsData);
          return;
        }

        // condition 3: check if secondary labels is empty
        const emptySecondaryFileLabel = sectionsFiles.some(fileData => {
          return fileData.labels.some(label => {
            const labelData = label;
            if (
              labelData.label === '' &&
              labelData.languageCode !== primaryLanguage
            ) {
              // setIsAutoPopulateLanguagePopupOpen(true);
              setAlertMessage(messages.GLOBAL.AUTO_POPULATE_FIELDS);
              setAlertAction('populate');
              setIsAlertOpen(true);
              return true;
            }
            return false;
          });
        });

        stepsData[3].step4Data.sectionsFiles = sectionsFiles;
        if (emptySecondaryFileLabel) {
          changeStep(stepsData);
          return;
        }

        if (stepsData[3].step4Data.isError) return;

        // let allLables = [];
        // valueArr : to store all object with language code and label
        const valueArr = [];
        // get all the labels to check duplication

        _.map(stepsData[3].step4Data.sectionsFiles, item => {
          const itemData = item;
          const labelsWithUniqueName = [];
          itemData.labels.forEach(label => {
            const labelData = label;
            labelData.fileName = itemData.fileName;
            labelsWithUniqueName.push(labelData);
          });
          valueArr.push(...labelsWithUniqueName);
        });

        const duplicateItems = valueArr
          .map(e => {
            return e.languageCode + e.label.trim().toUpperCase();
          })
          .map((e, i, final) => {
            return final.indexOf(e) !== i && i;
          })
          .filter(obj => valueArr[obj])
          .map(e => {
            return valueArr[e];
          });

        const isDuplicate = duplicateItems.length > 0;

        if (isDuplicate) {
          setDuplicateFiles(duplicateItems);
          setErrorAction('duplicate');
          setIsErrorMessage(true);
          setErrorMessage(
            `${messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.LABEL_SHOULD_BE_UNIQUE}`,
          );
          return;
        }

        const filesArray = steps[3].step4Data.sectionsFiles;
        _.map(filesArray, i => {
          _.map(i.labels, j => {
            const itemData = j;
            itemData.isError = false;
            itemData.isFocus = false;
          });
        });

        const requestData = _.map(
          sectionsFiles,
          _.partialRight(_.pick, 'labels', 'sectionId', 'fTypes', 'fTypesExt'),
        );

        _.map(requestData, item => {
          const itemData = item;
          const fileData = _.cloneDeep(itemData.fTypes);
          const fileTypesData = [];
          const fTypesExtData = [];
          _.map(fileData, fileDataItem => {
            fileTypesData.push(fileDataItem.fileType);
            fTypesExtData.push(fileDataItem.value);
          });
          itemData.fTypes = fileTypesData.toString();
          itemData.fTypesExt = fTypesExtData.toString();
          itemData.labels = _.map(
            itemData.labels,
            _.partialRight(_.pick, ['languageCode', 'label']),
          );

          // if files added without section then set sectionId = 0
          if (stepsData[2].step3Data.formSections.length === 0) {
            itemData.sectionId = '0';
          }
        });

        let filesData = [];
        if (
          stepsData[2].isSaved &&
          stepsData[2].step3Data.formSections.length > 0
        ) {
          _.map(requestData, item => {
            const itemData = item;
            if (itemData.sectionId !== '' && itemData.sectionId) {
              filesData.push(itemData);
            }
          });
        } else {
          filesData = requestData;
        }

        const formData = {
          formId,
          isPublish: false,
          sectionsFiles: filesData,
        };

        let request = !stepsData[3].isSaved;
        if (action === 'edit') request = false;

        setIsSavingData(true);
        saveDesignFormStep4Data(formData, request, formId)
          .then(_response => {
            setIsSavingData(false);
            if (_response.data.success) {
              if (_response.data.data.length) {
                const res = _response.data.data[0];
                stepsData[3].response = res;
                // for edit
                if (stepsData[3].isSaved) {
                  stepsData[4].isSaved = true;
                }
                stepsData[3].isSaved = true;
                if (res.sections.length > 0) {
                  stepsData[2].isSaved = true;
                  stepsData[3].isSaved = true;
                  stepsData[4].isSaved = true;
                } else if (res.otherFiles.length > 0) {
                  stepsData[2].isSaved = true;
                  stepsData[3].isSaved = true;
                  stepsData[4].isSaved = true;
                } else {
                  setIsErrorMessage(true);
                  setErrorMessage(
                    messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4
                      .ERROR_WHILE_STORING_FILES,
                  );
                  stepsData[3].isSaved = false;
                }

                // reset
                stepsData[2].step3Data.formSectionsForReset = _.cloneDeep(
                  stepsData[2].step3Data.formSections,
                );

                stepsData[3].step4Data.sectionsFilesForReset = _.cloneDeep(
                  stepsData[3].step4Data.sectionsFiles,
                );

                changeStep(stepsData);
                setClickableSteps(5);

                if (stepsData[3].isSaved) {
                  goToNextStep();
                }
              }
            }
          })
          .catch(_error => {
            setIsSavingData(false);
            setIsErrorMessage(true);
            setErrorMessage(`${getErrorMessage(_error)}`);
            return true;
          });
      }
    }
  };

  const onSkipAndContinueClickListner = () => {
    const stepsData = [...steps];
    stepsData[activeStep].status = '';
    stepsData.forEach((e, phaseCount) => {
      if (phaseCount === activeStep + 1) {
        stepsData[phaseCount].status = 'current';
        setActiveStep(activeStep + 1);
      } else {
        stepsData[phaseCount].status = '';
      }
    });
    const sectionsData = [];
    if (stepsData[2].step3Data.formSections.length > 0) {
      stepsData[2].step3Data.formSections.forEach(formSection => {
        const formSectionData = formSection;
        if (formSectionData.sectionId && stepsData[2].isSaved) {
          sectionsData.push(formSectionData);
        }
      });
    }
    // if we skip sections without save it at copy time and we dont have any files at saved then we set our files to empty state otherwise we keep our files as it is
    if (
      stepsData[2].step3Data.formSections.length > 0 &&
      action === 'copy' &&
      !stepsData[2].isSaved
    ) {
      stepsData[3].step4Data.sectionsFiles = [];
      stepsData[3].step4Data.sectionsFilesForReset = _.cloneDeep([]);
    }

    stepsData[2].step3Data.formSections = sectionsData;
    stepsData[2].step3Data.formSectionsForReset = _.cloneDeep(
      stepsData[2].step3Data.formSections,
    );
    if (stepsData[2].isSaved) {
      // add case
      stepsData[3].isSaved = true;
    }
    stepsData[2].isSaved = true; // save true for edit case
    setClickableSteps(4);
    if (stepsData[3].isSaved) {
      setClickableSteps(5);
    }
    changeStep(stepsData);
  };

  const toggleCancelMessagePopup = () => {
    setAlertAction('cancel'); // action for cancel
    setAlertMessage(messages.GLOBAL.ERR_CHANGES_LOST);
    setIsAlertOpen(true);
  };

  //  validations
  // step 1 : isStep1Validate validates form name , case type id and subphase id is changed or not
  const isStep1Validate = () => {
    const stepsData = [...steps];
    // old data
    const oldData = _.map(
      stepsData[0].step1Data.formNames,
      _.partialRight(_.pick, 'name', 'languageCode'),
    );
    // new data
    const newData = _.map(
      stepsData[0].step1Data.formNamesForReset,
      _.partialRight(_.pick, 'name', 'languageCode'),
    );

    if (!_.isEqual(newData, oldData)) return true; // prev and current data chaged so return true
    if (stepsData[0].step1Data.caseType.ctId) {
      if (
        stepsData[0].step1Data.caseType.ctId !==
        stepsData[0].step1Data.caseType.ctIdForReset
      )
        return true;
    }
    if (stepsData[0].step1Data.subPhase.subPhaseId) {
      if (
        stepsData[0].step1Data.subPhase.subPhaseId !==
        stepsData[0].step1Data.subPhase.subPhaseIdForReset
      )
        return true;
    }
    return false;
  };

  // step 2 : validate notes or specification is changed or not
  const isStep2Validate = () => {
    const stepsData = [...steps];
    //  note
    const oldDataNote = _.map(
      stepsData[1].step2Data.notesForReset,
      _.partialRight(_.pick, 'note', 'languageCode'),
    );
    const newDataNote = _.map(
      stepsData[1].step2Data.notes,
      _.partialRight(_.pick, 'note', 'languageCode'),
    );
    // specification
    const oldDataSpecification = _.map(
      stepsData[1].step2Data.specificationsForReset,
      _.partialRight(_.pick, 'specification', 'languageCode'),
    );
    const newDataSpecification = _.map(
      stepsData[1].step2Data.specifications,
      _.partialRight(_.pick, 'specification', 'languageCode'),
    );

    return (
      !_.isEqual(newDataNote, oldDataNote) ||
      !_.isEqual(newDataSpecification, oldDataSpecification)
    );
  };

  // step 3 : validate section name is changed or not in any section
  const isStep3Validate = () => {
    const stepsData = [...steps];

    const oldData = _.map(
      stepsData[2].step3Data.formSectionsForReset,
      _.partialRight(_.pick, 'names'),
    );

    _.map(oldData, item => {
      const itemData = item;
      itemData.names = _.map(
        itemData.names,
        _.partialRight(_.pick, ['languageCode', 'name']),
      );
    });

    const newData = _.map(
      stepsData[2].step3Data.formSections,
      _.partialRight(_.pick, 'names'),
    );

    _.map(newData, item => {
      const itemData = item;
      itemData.names = _.map(
        itemData.names,
        _.partialRight(_.pick, ['languageCode', 'name']),
      );
    });

    // return data is changed or same
    return !_.isEqual(newData, oldData);
  };

  // step 4: validate file name is changed or not in any file or file type is changed
  const isStep4Validate = () => {
    const stepsData = [...steps];

    // label name
    const oldFileLabels = _.map(
      stepsData[3].step4Data.sectionsFilesForReset,
      _.partialRight(_.pick, 'labels'),
    );

    _.map(oldFileLabels, item => {
      const itemData = item;
      itemData.labels = _.map(
        itemData.labels,
        _.partialRight(_.pick, ['languageCode', 'label']),
      );
    });

    const newFileLabels = _.map(
      stepsData[3].step4Data.sectionsFiles,
      _.partialRight(_.pick, 'labels'),
    );

    _.map(newFileLabels, item => {
      const itemData = item;
      itemData.labels = _.map(
        itemData.labels,
        _.partialRight(_.pick, ['languageCode', 'label']),
      );
    });

    // file type
    const oldFileTypes = _.map(
      stepsData[3].step4Data.sectionsFilesForReset,
      _.partialRight(_.pick, 'fTypes'),
    );

    _.map(oldFileTypes, item => {
      const itemData = item;
      itemData.fTypes = _.map(
        itemData.fTypes,
        _.partialRight(_.pick, ['label']),
      );
    });

    const newFileTypes = _.map(
      stepsData[3].step4Data.sectionsFiles,
      _.partialRight(_.pick, 'fTypes'),
    );

    _.map(newFileTypes, item => {
      const itemData = item;
      itemData.fTypes = _.map(
        itemData.fTypes,
        _.partialRight(_.pick, ['label']),
      );
    });

    return (
      !_.isEqual(newFileLabels, oldFileLabels) ||
      !_.isEqual(newFileTypes, oldFileTypes)
    );
  };

  const onCancelClickListner = () => {
    if (activeStep === 0) {
      // step1
      if (isStep1Validate()) {
        toggleCancelMessagePopup();
      }
    }
    if (activeStep === 1) {
      // step2
      if (isStep2Validate()) {
        toggleCancelMessagePopup();
      }
    }
    if (activeStep === 2) {
      // step3
      if (isStep3Validate()) {
        toggleCancelMessagePopup();
      }
    }
    if (activeStep === 3) {
      // step4
      if (isStep4Validate()) {
        toggleCancelMessagePopup();
      }
    }
  };

  // ==================================== * On Wizard Click  *  ===================================== //

  const onChangeWizard = id => {
    handleCancelAction();
    const stepsData = [...steps];
    stepsData[id].status = '';
    stepsData.forEach((e, phaseCount) => {
      if (phaseCount === id) {
        stepsData[phaseCount].status = 'current';
        setActiveStep(phaseCount);
      } else {
        stepsData[phaseCount].status = '';
      }
    });
    changeStep(stepsData);
  };

  const handleCancelAction = () => {
    if (activeStep === 0) {
      // re-set form names , casetype and subphase
      const stepsData = [...steps];
      stepsData[0].step1Data.formNames = _.cloneDeep(
        stepsData[0].step1Data.formNamesForReset,
      );
      stepsData[0].step1Data.caseType.ctId = _.cloneDeep(
        stepsData[0].step1Data.caseType.ctIdForReset,
      );
      stepsData[0].step1Data.subPhase.subPhaseId = _.cloneDeep(
        stepsData[0].step1Data.subPhase.subPhaseIdForReset,
      );
      changeStep(stepsData);
      setIsAlertOpen(false);
    } else if (activeStep === 1) {
      // re-set notes and specifications
      const stepsData = [...steps];
      stepsData[1].step2Data.notes = _.cloneDeep(
        stepsData[1].step2Data.notesForReset,
      );
      stepsData[1].step2Data.specifications = _.cloneDeep(
        stepsData[1].step2Data.specificationsForReset,
      );

      changeStep(stepsData);
      setIsAlertOpen(false);
    } else if (activeStep === 2) {
      // re-set sections
      const stepsData = [...steps];
      stepsData[2].step3Data.formSections = _.cloneDeep(
        stepsData[2].step3Data.formSectionsForReset,
      );

      changeStep(stepsData);
      setIsAlertOpen(false);
    } else if (activeStep === 3) {
      // re-set files
      const stepsData = [...steps];
      stepsData[3].step4Data.sectionsFiles = _.cloneDeep(
        stepsData[3].step4Data.sectionsFilesForReset,
      );
      // if (stepsData[3].isSaved && action === 'edit') {
      //   stepsData[4].isSaved = true;
      // }
      changeStep(stepsData);
      setIsAlertOpen(false);
    }
  };

  /**
   * handleAlertOKButtonClick
   * handle auto population of english language
   * cancel ok button click
   */

  const handleAlertOKButtonClick = () => {
    if (alertAction === 'populate') {
      const data = [...steps];
      if (activeStep === 0) {
        // auto populate form name
        const { formNames } = data[0].step1Data;
        const indexOfPrimaryLanguage = formNames.findIndex(
          form => form.languageCode === primaryLanguage,
        );
        formNames.forEach((form, index) => {
          if (
            form.languageCode !== indexOfPrimaryLanguage &&
            form.name === ''
          ) {
            data[0].step1Data.formNames[index].name =
              formNames[indexOfPrimaryLanguage].name;
            data[0].step1Data.formNames[index].isError = false;
            data[0].step1Data.isError = false;
          }
        });
      } else if (activeStep === 1) {
        // do not remove this if we need to add note and specification
        // auto populate functionality for note and specification if needed then uncomment this code
        const { notes, specifications } = data[1].step2Data;
        if (autoPopulate === 'note' || autoPopulate === 'all') {
          // auto populate note
          const indexOfPrimaryLanguageInNotes = notes.findIndex(
            note => note.languageCode === primaryLanguage,
          );
          notes.forEach((note, index) => {
            if (
              note.languageCode !== indexOfPrimaryLanguageInNotes &&
              data[1].step2Data.notes[index].note === ''
            ) {
              data[1].step2Data.notes[index].note =
                notes[indexOfPrimaryLanguageInNotes].note;
              data[1].step2Data.notes[index].isError = false;
              // data[1].step2Data.isError = false;
            }
          });
        }
        if (autoPopulate === 'specification' || autoPopulate === 'all') {
          // auto populate specification
          const indexOfPrimaryLanguageInSpecifications = specifications.findIndex(
            specification => specification.languageCode === primaryLanguage,
          );
          specifications.forEach((specification, index) => {
            if (
              specification.languageCode !==
                indexOfPrimaryLanguageInSpecifications &&
              data[1].step2Data.specifications[index].specification === ''
            ) {
              data[1].step2Data.specifications[index].specification =
                specifications[
                  indexOfPrimaryLanguageInSpecifications
                ].specification;
              data[1].step2Data.specifications[index].isError = false;
              // data[1].step2Data.isError = false;
            }
          });
        }
      } else if (activeStep === 2) {
        const { formSections } = data[2].step3Data;
        formSections.map(section => {
          const sectionData = section;
          const indexOfPrimaryData = sectionData.names.findIndex(
            nameData => nameData.languageCode === primaryLanguage,
          );
          return sectionData.names.map((nameData, indexOfLabel) => {
            if (
              nameData.languageCode !== primaryLanguage &&
              nameData.name === ''
            ) {
              sectionData.names[indexOfLabel].name =
                sectionData.names[indexOfPrimaryData].name;
              sectionData.names[indexOfLabel].isError = false;
              data[2].step3Data.isError = false;
            }
            return true;
          });
        });
        setCountOfStep3DataChange(countOfStep3DataChange + 1);
        data[2].step3Data.formSections = formSections;
      } else if (activeStep === 3) {
        const { sectionsFiles } = data[3].step4Data;
        sectionsFiles.map(file => {
          const fileData = file;
          const indexOfPrimaryData = fileData.labels.findIndex(
            label => label.languageCode === primaryLanguage,
          );
          return fileData.labels.map((labelData, indexOfLabel) => {
            if (
              labelData.languageCode !== primaryLanguage &&
              labelData.label === ''
            ) {
              fileData.labels[indexOfLabel].label =
                fileData.labels[indexOfPrimaryData].label;
              fileData.labels[indexOfLabel].isError = false;
              data[3].step4Data.isError = false;
            }
            return true;
          });
        });
        setCountOfStep3DataChange(countOfStep3DataChange + 1);
        data[3].step4Data.sectionsFiles = sectionsFiles;
      }
      changeStep(data);
      setIsAlertOpen(false);
    } else if (alertAction === 'cancel') {
      // cancel
      handleCancelAction();
    }
  };

  // ==================================== * Step 1 *  ===================================== //

  /**
   * getValueFromListById :
   *  Provide list and id to access value
   * @param {*} list : list from which we want to get value
   * @param {*} id : unique id to access value
   */

  const getValueFromListById = (list, id) => {
    if (!id || list.length === 0) return '';
    const index = list.findIndex(item => item.id === id);
    if (index < 0) return '';
    return list[index].value;
  };

  const getLanguageNameByCode = languageCode => {
    return languages.filter(lang => lang.languageCode === languageCode)[0]
      .languageName;
  };

  // ==================================== * Step 2 *  ===================================== //

  /**
   * getIndexOfLabel:
   * we are using in step 2 for show error and content in editor
   * @param {*} array
   * @param {*} languageCode
   */

  const getIndexOfLabel = (array, languageCode) => {
    return array.findIndex(label => label.languageCode === languageCode);
  };

  const getTitle = currentStep => {
    const { TITLE } = labels.DESIGN_FORMS.SETUP_DESIGN_FORM;
    switch (currentStep) {
      case 0:
        return TITLE;
      case 1:
      case 2:
      case 3:
      case 4:
        return `${TITLE} ${
          steps[0].step1Data.subPhase.subPhaseId
            ? `- ${getValueFromListById(
                designSubPhasesList,
                steps[0].step1Data.subPhase.subPhaseId,
              )}`
            : ''
        }`;
      default:
        return TITLE;
    }
  };

  // step 3

  // setFocusOnDuplicateRecord
  const setFocusOnDuplicateRecord = () => {
    if (activeStep === 2) {
      const sectionsArray = steps[2].step3Data.formSections;

      // set isError false for all names and then we set it true if any duplicate name found in below step
      _.map(sectionsArray, i => {
        _.map(i.names, j => {
          const itemData = j;
          itemData.isError = false;
        });
      });

      duplicateSections.forEach(item => {
        const indexOfSection = sectionsArray.findIndex(
          section => section.id === item.id,
        );
        const indexOfLabelInDuplicateSection = sectionsArray[
          indexOfSection
        ].names.findIndex(label => label.languageCode === item.languageCode);
        sectionsArray[indexOfSection].names[
          indexOfLabelInDuplicateSection
        ].isError = true;
        sectionsArray[indexOfSection].names[
          indexOfLabelInDuplicateSection
        ].errorMessage =
          messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.DUPLICATE_SECTION_NAME;
        _.map(sectionsArray, i => {
          _.map(i.names, j => {
            const itemData = j;
            itemData.isFocus = false;
          });
        });
      });
      const indexOfSectionForSetFocus = sectionsArray.findIndex(
        section => section.id === duplicateSections[0].id,
      );
      const indexOfLabelInDuplicateSectionForSetFocus = sectionsArray[
        indexOfSectionForSetFocus
      ].names.findIndex(
        label => label.languageCode === duplicateSections[0].languageCode,
      );
      sectionsArray[indexOfSectionForSetFocus].names[
        indexOfLabelInDuplicateSectionForSetFocus
      ].isFocus = true;
      const stepsData = [...steps];
      stepsData[2].step3Data.formSections = sectionsArray;
      changeStep(stepsData);
      setCountOfStep3DataChange(countOfStep3DataChange + 1);
    }
    if (activeStep === 3) {
      const filesArray = steps[3].step4Data.sectionsFiles;

      // set isError false for all labels and then we set it true if any duplicate label found in below step
      _.map(filesArray, i => {
        _.map(i.labels, j => {
          const itemData = j;
          itemData.isError = false;
        });
      });

      duplicateFiles.forEach(item => {
        const indexOfFile = filesArray.findIndex(
          file => file.fileName === item.fileName,
        );
        const indexOfLabelInDuplicateFile = filesArray[
          indexOfFile
        ].labels.findIndex(label => label.languageCode === item.languageCode);
        filesArray[indexOfFile].labels[
          indexOfLabelInDuplicateFile
        ].isError = true;
        filesArray[indexOfFile].labels[
          indexOfLabelInDuplicateFile
        ].errorMessage =
          messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.DUPLICATE_FILE_NAME;
        _.map(filesArray, i => {
          _.map(i.labels, j => {
            const itemData = j;
            itemData.isFocus = false;
          });
        });
      });

      const indexOfFileForSetFocus = filesArray.findIndex(
        file => file.fileName === duplicateFiles[0].fileName,
      );

      const indexOfLabelInDuplicateFileForSetFocus = filesArray[
        indexOfFileForSetFocus
      ].labels.findIndex(
        label => label.languageCode === duplicateFiles[0].languageCode,
      );
      filesArray[indexOfFileForSetFocus].labels[
        indexOfLabelInDuplicateFileForSetFocus
      ].isFocus = true;
      const stepsData = [...steps];
      stepsData[3].step4Data.sectionsFiles = filesArray;
      changeStep(stepsData);
      setCountOfStep4DataChange(countOfStep4DataChange + 1);
    }
  };

  // handleError
  const handleError = () => {
    if (errorAction === 'duplicate') {
      setIsErrorMessage(!isErrorMessage);
      setFocusOnDuplicateRecord();
    } else {
      setIsErrorMessage(!isErrorMessage);
    }
  };

  // step 4
  const getFilesAsPerSection = id => {
    if (steps[3].step4Data.sectionsFiles.length > 0) {
      return steps[3].step4Data.sectionsFiles.filter(
        file => file.sectionId === id,
      );
    }
    return [];
  };

  const getSectionPrimaryLabel = names => {
    const primaryName = names.filter(
      nameData => nameData.languageCode === primaryLanguage,
    );
    return primaryName[0].name;
  };

  // step 5
  const onSubmitButtonClick = () => {
    setIsSavingData(true);
    saveDesignFormStep5Data(formId)
      .then(res => {
        setIsSavingData(false);
        if (res.data.success) {
          setsuccessMessage(
            isAddRequest
              ? messages.DESIGN_FORMS.SETUP_DESIGN_FORM.FORM_SAVED_SUCCESSFULLY
              : messages.DESIGN_FORMS.SETUP_DESIGN_FORM
                  .FORM_EDITED_SUCCESSFULLY,
          );
          setIsSuccessAlertOpen(true);
        }
      })
      .catch(err => {
        setIsSavingData(false);
        setErrorMessage(getErrorMessage(err));
        setIsErrorMessage(true);
      });
  };

  const onEditClickListner = () => {
    const stepsData = [...steps];
    stepsData[activeStep].status = '';
    stepsData.forEach((e, phaseCount) => {
      if (phaseCount === 0) {
        stepsData[phaseCount].status = 'current';
        setActiveStep(0);
      } else {
        stepsData[phaseCount].status = '';
      }
    });
    changeStep(stepsData);
  };

  // handleSuccessAlert
  const handleSuccessAlert = () => {
    history.push(`${constants.ROUTE.DESIGN_FORMS.LIST}`);
  };

  return (
    <div className="setup-design-form">
      <>
        <div className="card-container">
          <CardHeader title={getTitle(activeStep)} />
          <div className="padding-top-30" />
          <>
            <Wizard
              formSteps={steps}
              clickableSteps={clickableSteps}
              onSelectStep={onChangeWizard}
            />
            <div>
              {steps.map(item => {
                if (item.id === 1 && item.status === 'current') {
                  return (
                    <div key={item.id} className="step-container">
                      {steps[0].step1Data.formNames.length > 0 && (
                        <Step1
                          key={item.id}
                          steps={steps}
                          changeStep={changeStep}
                          formId={formIdForGetData}
                          isFetchData={isFetchData}
                          getValueFromListById={getValueFromListById}
                          action={action}
                          getLanguageNameByCode={getLanguageNameByCode}
                          // isPublished={isPublished} uncomment it if is published required
                          isBindWithAnyWorkFlow={isBindWithAnyWorkFlow}
                        />
                      )}
                    </div>
                  );
                }
                if (item.id === 2 && item.status === 'current') {
                  const indexOfNoteLabel = getIndexOfLabel(
                    steps[1].step2Data.notes,
                    steps[1].step2Data.activeLanguage,
                  );
                  const indexOfSpecificationLabel = getIndexOfLabel(
                    steps[1].step2Data.specifications,
                    steps[1].step2Data.activeLanguage,
                  );
                  return (
                    <div key={item.id} className="step-container">
                      <Step2
                        key={item.id}
                        steps={steps}
                        changeStep={changeStep}
                        indexOfNoteLabel={indexOfNoteLabel}
                        indexOfSpecificationLabel={indexOfSpecificationLabel}
                        formId={formIdForGetData}
                        isFetchData={isFetchData}
                        action={action}
                        isStep2Validate={isStep2Validate}
                      />
                    </div>
                  );
                }
                if (item.id === 3 && item.status === 'current') {
                  return (
                    <div key={item.id} className="step-container">
                      <Step3
                        key={item.id}
                        steps={steps}
                        changeStep={changeStep}
                        sectionsArray={steps[2].step3Data.formSections}
                        countOfStep3DataChange={countOfStep3DataChange}
                        formId={steps[2].isSaved ? formId : formIdForGetData}
                        isFetchData={isFetchData}
                        action={action}
                        isStep3Validate={isStep3Validate}
                      />
                    </div>
                  );
                }
                if (item.id === 4 && item.status === 'current') {
                  return (
                    <div
                      key={item.id}
                      className={languages.length < 3 ? 'step-container' : ''}
                    >
                      <Step4
                        key={item.id}
                        steps={steps}
                        changeStep={changeStep}
                        sectionsArray={steps[2].step3Data.formSections}
                        sectionsFilesArray={steps[3].step4Data.sectionsFiles}
                        getFilesAsPerSection={getFilesAsPerSection}
                        getSectionPrimaryLabel={getSectionPrimaryLabel}
                        fileTypeOptions={fileTypeOptions}
                        formId={steps[3].isSaved ? formId : formIdForGetData}
                        isFetchData={isFetchData}
                        getLanguageNameByCode={getLanguageNameByCode}
                        action={action}
                        isStep4Validate={isStep4Validate}
                        countOfStep4DataChange={countOfStep4DataChange}
                        setClickableSteps={setClickableSteps}
                      />
                    </div>
                  );
                }
                if (item.id === 5 && item.status === 'current') {
                  return (
                    <div key={item.id} className="step-container">
                      <Step5
                        steps={steps}
                        changeStep={changeStep}
                        indexOfNameLabel={getIndexOfLabel(
                          steps[0].step1Data.formNames,
                          steps[4].step5Data.activeLanguage,
                        )}
                        indexOfNoteLabel={getIndexOfLabel(
                          steps[1].step2Data.notes,
                          steps[4].step5Data.activeLanguage,
                        )}
                        indexOfSpecificationLabel={getIndexOfLabel(
                          steps[1].step2Data.specifications,
                          steps[4].step5Data.activeLanguage,
                        )}
                        sectionsArray={steps[2].step3Data.formSections}
                        sectionsFilesArray={steps[3].step4Data.sectionsFiles}
                        getFilesAsPerSection={getFilesAsPerSection}
                        getSectionPrimaryLabel={getSectionPrimaryLabel}
                        fileTypeOptions={fileTypeOptions}
                        formId={formId || formIdForGetData}
                        isFetchData={isFetchData}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </>
          {/* alert box : populate , cancel */}
          <InformationAlert
            alertMessage={alertMessage}
            primaryButtonText={labels.GLOBAL.YES}
            secondaryButtonText={labels.GLOBAL.NO}
            open={isAlertOpen}
            setClose={() => setIsAlertOpen(!isAlertOpen)}
            primaryButtonOnClick={() => handleAlertOKButtonClick()}
          />
          {/* error message */}
          <ErrorAlert
            alertMessage={errorMessage}
            primaryButtonText={labels.GLOBAL.OK}
            open={isErrorMessage}
            setClose={() => handleError()}
            primaryButtonOnClick={() => handleError()}
          />
          {/* success alert */}
          <SuccessAlert
            alertMessage={successMessage}
            open={isSuccessAlertOpen}
            setClose={() => {
              setIsAlertOpen(!isSuccessAlertOpen);
              handleSuccessAlert();
            }}
            primaryButtonOnClick={() => handleSuccessAlert()}
          />
        </div>
        <div className="button-container">
          {activeStep === 4 ? (
            <>
              <button
                type="button"
                className="btn-cancel"
                onClick={onEditClickListner}
              >
                {labels.GLOBAL.BUTTON_EDIT}
              </button>
              <button
                disabled={isSavingData}
                type="button"
                onClick={onSubmitButtonClick}
                className="btn-submit"
              >
                {labels.GLOBAL.BUTTON_SUBMIT}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-cancel"
                onClick={onCancelClickListner}
              >
                {labels.GLOBAL.BUTTON_CANCEL}
              </button>
              {/* 
                // do not remove this button we will use it future if required
                <button
                  type="button"
                  className="btn-save-close"
                  onClick={onSaveAndCloseClickListner}
                >
                  {labels.GLOBAL.BUTTON_SAVE_AND_CLOSE}
                </button> */}
              {activeStep === 2 && (
                <button
                  type="button"
                  className="btn-skip-and-continue"
                  onClick={onSkipAndContinueClickListner}
                >
                  {labels.GLOBAL.BUTTON_SKIP_AND_CONTINUE}
                </button>
              )}
              <button
                disabled={isSavingData}
                type="button"
                onClick={onSaveAndContinueClickListner}
                className="btn-save-submit"
              >
                {labels.GLOBAL.BUTTON_SAVE_AND_CONTINUE}
              </button>
            </>
          )}
        </div>
      </>
    </div>
  );
}

SetupDesingForm.defaultProps = {
  steps: [],
  formId: '',
};

SetupDesingForm.propTypes = {
  steps: PropTypes.instanceOf(Array),
  formId: PropTypes.string,
  changeStep: PropTypes.func.isRequired,
  changeFormId: PropTypes.func.isRequired,
  fileTypeOptions: PropTypes.instanceOf(Array).isRequired,
  getfileTypeOptionsListAction: PropTypes.func.isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  designSubPhasesList: PropTypes.instanceOf(Array).isRequired,
  resetDesignForm: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  primaryLanguage: PropTypes.string.isRequired,
  getDesignSubPhasesListAction: PropTypes.func.isRequired,
  isDesignSubPhasesFetched: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  steps: getSteps(state),
  formId: getFormId(state),
  fileTypeOptions: getFileTypesOptions(state),
  designSubPhasesList: getDesignSubPhasesList(state),
  languages: state.common.userLanguages,
  primaryLanguage: state.common.primaryLanguage,
  isDesignSubPhasesFetched: isDesignSubPhasesListFetched(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeStep: setWizardSteps,
      changeFormId: setFormId,
      getfileTypeOptionsListAction: getfileTypeOptionsListApiAction,
      getFormData: getFormDataAPiAction,
      resetDesignForm: resetDesignFormAction,
      getDesignSubPhasesListAction: getDesignSubPhasesListApiAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SetupDesingForm);
