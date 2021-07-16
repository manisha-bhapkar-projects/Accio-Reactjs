import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './AddOrUpdatePhases.scss';
import _ from 'lodash';
import CardHeader from '../../../components/CardHeader/CardHeader';
import TextFieldComponent from '../../../components/TextFieldComponent/TextFieldComponent';
// actions
import {
  getPhases,
  savePhases,
  resetPhases,
} from '../../../actions/phasesAndMoreActions';
import {
  getPhasesIsLoadingFromState,
  getPhasesListInSequence,
  getPhasesIsErrorFromState,
  getPhasesIsSavedFromState,
  getPhasesMessageFromState,
  getPhasesIsLoadingForSaveFromState,
} from '../selector';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import CardListTable from '../../../components/CardListTable/CardListTable';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import {
  scrollToTop,
  getPrimaryLanguage,
  getLanguages,
  insertIsErrorInLabels,
} from '../../../utils/utils';
/** Error & Lables */
import labels from '../../../utils/Locales/labels';
import messages from '../../../utils/Locales/messages';
import { validateNameWithRegex } from '../../../utils/validation';
import constants from '../../../utils/constants';

const AddOrUpdatePhases = props => {
  const {
    phases,
    isLoading,
    isError,
    message,
    isLoadingForSave,
    history,
    languages,
    primaryLanguage,
    isSaved,
  } = props;

  const [phasesData, setPhasesData] = useState([]); // to store list of phases
  const [isPhasesResponse, setIsPhasesResponse] = useState(false); // is phases response is get or not
  const [columns, setColumns] = useState([]); // to show table columns
  const [errorMessage, setErrorMessage] = useState(''); // to show error
  const [duplicatePhases, setDuplicatePhases] = useState([]); // to store duplicate phases
  const [isAddRequest, setIsAddRequest] = useState(true); // isAddRequest : using isAddRequest we can identify that on save and submit we are going to perform add request or edit
  const [dataUpdatedCount, setDataUpdatedCount] = useState(0); // dataUpdatedCount : this count is for reinitialize columns when data updated otherwise we are not getting proper state in onchange of text fields
  const [isErrorInPhase, setIsErrorInPhase] = useState(false); // isErrorInPhase: we will use it in each onchange.if we get any error from it then we can prevent user to save and continue

  // InformationAlert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(false); // populate , cancel

  // SuccessAlert
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [successMessage, setsuccessMessage] = useState(false);

  // ErrorAlert
  const [isErrorMessage, setIsErrorMessage] = useState(false); // is error or not
  const [errorAction, setErrorAction] = useState(false); // error related to:- duplicate phases , other

  // initializeColumns : initialize columns inside content of accordion
  const initializeColumns = () => {
    const inputColumns = [
      {
        name: labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.COL_1,
        selector: 'phaseName', // selector name from content
        grow: 1,
      },
    ];
    languages.forEach((language, index) => {
      // for each language we are creating input boxes
      inputColumns.push({
        grow: languages.length === 2 && index === 1 ? 2 : 1,
        name: `${labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.COL_2} \n (${language.languageName})`,
        cell: row => {
          const indexOfLabel = row.labels.findIndex(
            label => label.languageCode === language.languageCode,
          );
          if (indexOfLabel === -1) return null;
          return (
            <TextFieldComponent
              id={`${row.phaseName}-${language.languageName}`}
              name={`${row.phaseName}-${language.languageName}`}
              type="text"
              className="form-field"
              helperText={
                row.labels[indexOfLabel].errorMessage
                  ? row.labels[indexOfLabel].errorMessage
                  : messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
                      .FIELD_IS_REQUIRED
              }
              error={
                row.labels[indexOfLabel] && row.labels[indexOfLabel].isError
                  ? row.labels[indexOfLabel].isError
                  : false
              }
              value={
                row.labels[indexOfLabel] &&
                row.labels[indexOfLabel].propertyPhaseName
                  ? row.labels[indexOfLabel].propertyPhaseName
                  : ''
              }
              maxLength={
                row.labels[indexOfLabel].languageCode === primaryLanguage
                  ? labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
                      .LENGTH_OF_PHASE_NAME
                  : labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
                      .LENGTH_OF_PHASE_NAME_SECONDARY
              }
              onChange={e => handleOnChange(e, row.phaseId, indexOfLabel)}
              autoFocus={row.labels[indexOfLabel].isFocus}
            />
          );
        },
        //   cell: row => {
        //   const indexOfLabel = row.labels.find(
        //     label => label.languageCode === language.languageCode,
        //   );
        //   console.log('row.labels', row.labels);
        //   console.log('indexOfLabel', indexOfLabel);
        //   console.log('languages', languages);
        //   return (
        //     <TextFieldComponent
        //       id={`${row.phaseName}-${language.languageName}`}
        //       name={`${row.phaseName}-${language.languageName}`}
        //       type="text"
        //       className="form-field"
        //       helperText={
        //         indexOfLabel.errorMessage
        //           ? indexOfLabel.errorMessage
        //           : messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
        //               .FIELD_IS_REQUIRED
        //       }
        //       error={
        //         indexOfLabel && indexOfLabel.isError
        //           ? indexOfLabel.isError
        //           : false
        //       }
        //       value={
        //         indexOfLabel &&
        //         indexOfLabel.propertyPhaseName
        //           ? indexOfLabel.propertyPhaseName
        //           : ''
        //       }
        //       maxLength={
        //         indexOfLabel.languageCode === primaryLanguage
        //           ? labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
        //               .LENGTH_OF_PHASE_NAME
        //           : labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
        //               .LENGTH_OF_PHASE_NAME_SECONDARY
        //       }
        //       onChange={e => handleOnChange(e, row.phaseId, indexOfLabel)}
        //       autoFocus={indexOfLabel.isFocus}
        //     />
        //   );
        // },
      });
    });
    setColumns(inputColumns);
  };

  useEffect(() => {
    scrollToTop();
    initializeColumns(); // initialize for fist time will show only labels based on langauges
    props.dispatch(getPhases());
    return () => {
      // at unmount we are resetting our states
      setIsErrorMessage(false);
      setErrorMessage('');
      props.dispatch(resetPhases());
      setPhasesData([]);
    };
  }, []);

  /**
   *
   * insertEmptyObjectsInLabels : insert new label object if not exist
   * @param {array} array : pass array in which we want to add label's object if not exist
   *
   */

  const insertEmptyObjectsInLabels = arr => {
    if (arr.length === languages.length) {
      return arr;
    }
    languages.forEach(locale => {
      if (!arr.find(arrObj => arrObj.languageCode === locale.languageCode))
        arr.push({
          propertyPhaseName: '',
          languageCode: locale.languageCode,
          languageName: locale.languageName,
        });
    });
    return arr;
  };

  useEffect(() => {
    if (phases.length > 0) {
      setIsPhasesResponse(true);
      phases.map((phase, i) => {
        const phaseData = phase;
        phaseData.propertyPhaseSequence = phaseData.phaseSequence;
        phaseData.isPublish = true;
        const PhaseLabels = insertEmptyObjectsInLabels(phaseData.labels);
        phaseData.labels = insertIsErrorInLabels(PhaseLabels);
        // set focus on first label of form
        if (i === 0) {
          const indexOfPrimaryLanguage = phaseData.labels.findIndex(
            item => item.languageCode === primaryLanguage,
          );
          phaseData.labels[indexOfPrimaryLanguage].isFocus = true;
        }
        return true;
      });
      setPhasesData(_.cloneDeep(phases));
    }
  }, [phases]);

  useEffect(() => {
    if (isPhasesResponse) {
      setIsAddRequest(phasesData[0].propertyPhasesId === ''); // if propertyPhasesId null of any record it means its add request else edit request
      initializeColumns();
    }
  }, [isPhasesResponse]);

  useEffect(() => {
    // re-initializing columns if data changed
    if (dataUpdatedCount > 0) {
      initializeColumns();
    }
  }, [dataUpdatedCount]);

  useEffect(() => {
    if (!isErrorMessage) {
      // no error then set message null
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  useEffect(() => {
    if (isError) {
      // if error then show message
      setIsErrorMessage(true);
      setErrorMessage(message);
    }
  }, [isError, isLoadingForSave, message]);

  useEffect(() => {
    if (isSaved) {
      // if saved then show success message
      setsuccessMessage(
        isAddRequest
          ? messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
              .PHASES_SAVED_SUCCESSFULLY
          : messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
              .PHASES_EDITED_SUCCESSFULLY,
      );
      setIsSuccessAlertOpen(true);
    }
  }, [isSaved]);

  // handleSuccessAlert: redirect to add update subphase screen if successfully save phases
  const handleSuccessAlert = () => {
    history.push(constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_SUBPHASES);
  };

  /**
   * handleOnChange to handle input changes in phase input feilds
   * @param {*} event :  input event object
   * @param {*} phaseIndex : phaseIndex is index of phase which we want to change
   * @param {*} languageIndex : languageIndex is index of language which we want to change
   */

  const handleOnChange = (event, phaseIndex, languageIndex) => {
    event.preventDefault();

    const data = [...phasesData];
    const indexOfPhase = data.findIndex(i => i.phaseId === phaseIndex);

    data[indexOfPhase].labels[languageIndex].propertyPhaseName =
      event.target.value;

    if (event.target.value === '') {
      // empty phase label
      data[indexOfPhase].labels[languageIndex].isError = true;
      data[indexOfPhase].labels[languageIndex].errorMessage =
        messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.FIELD_IS_REQUIRED;
      setIsErrorInPhase(true);
    } else if (
      event.target.value.length >
        labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.LENGTH_OF_PHASE_NAME &&
      data[indexOfPhase].labels[languageIndex].languageCode === primaryLanguage
    ) {
      // for primaryLanguage length not valid
      data[indexOfPhase].labels[languageIndex].isError = true;
      data[indexOfPhase].labels[
        languageIndex
      ].errorMessage = `${messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.PHASE_NAME_SHOULD_BE_LESS}`;
      setIsErrorInPhase(true);
    } else if (
      event.target.value.length >
        labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
          .LENGTH_OF_PHASE_NAME_SECONDARY &&
      data[indexOfPhase].labels[languageIndex].languageCode !== primaryLanguage
    ) {
      // for secondary language length not valid
      data[indexOfPhase].labels[languageIndex].isError = true;
      data[indexOfPhase].labels[
        languageIndex
      ].errorMessage = `${messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.PHASE_NAME_SHOULD_BE_LESS_SECONDARY}`;
      setIsErrorInPhase(true);
    } else if (
      !validateNameWithRegex(
        event.target.value,
        labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.REGEX_OF_PHASE_NAME,
      ) &&
      data[indexOfPhase].labels[languageIndex].languageCode === primaryLanguage
    ) {
      // regex not setisfied
      data[indexOfPhase].labels[languageIndex].isError = true;
      data[indexOfPhase].labels[languageIndex].errorMessage =
        messages.GLOBAL.ERR_TEXTFIELD_INPUT;
      setIsErrorInPhase(true);
    } else {
      // no any error
      data[indexOfPhase].labels[languageIndex].isError = false;
      data[indexOfPhase].labels[languageIndex].errorMessage = '';
      setIsErrorInPhase(false);
    }
    setPhasesData(data);
  };

  // handleCancel: it set the old state to our phaseData
  const handleCancel = () => {
    // old data
    const oldPhaseData = _.map(phases, _.partialRight(_.pick, 'labels'));
    _.map(oldPhaseData, item => {
      const itemData = item;
      itemData.labels = _.map(
        itemData.labels,
        _.partialRight(_.pick, ['languageCode', 'propertyPhaseName']),
      );
    });

    // new data
    const newData = _.map(phasesData, _.partialRight(_.pick, 'labels'));
    _.map(newData, item => {
      const itemData = item;
      itemData.labels = _.map(
        itemData.labels,
        _.partialRight(_.pick, ['languageCode', 'propertyPhaseName']),
      );
    });

    if (!_.isEqual(newData, oldPhaseData)) {
      setAlertAction('cancel');
      setAlertMessage(messages.GLOBAL.ERR_CHANGES_LOST);
      setIsAlertOpen(true);
    }
  };

  // handleAlertOKButtonClick : handles alert ok button click
  const handleAlertOKButtonClick = () => {
    if (alertAction === 'populate') {
      const newPhasesData = [];
      const data = [...phasesData];
      data.forEach(phase => {
        const phaseData = phase;
        const indexOfPrimaryLanguage = phaseData.labels.findIndex(
          label => label.languageCode === primaryLanguage,
        );
        phaseData.labels.forEach(label => {
          if (
            label.propertyPhaseName === '' &&
            label.languageCode !== primaryLanguage
          ) {
            const labelData = label;
            labelData.propertyPhaseName =
              phaseData.labels[indexOfPrimaryLanguage].propertyPhaseName;
            labelData.isError = false;
          }
        });
        newPhasesData.push(phaseData);
      });
      setPhasesData(newPhasesData);
      setIsErrorInPhase(false);
      setDataUpdatedCount(dataUpdatedCount + 1);
    } else if (alertAction === 'cancel') {
      setIsErrorInPhase(false);
      setPhasesData(_.cloneDeep(phases));
      setDataUpdatedCount(dataUpdatedCount + 1);
    }
    setIsAlertOpen(false);
  };

  // getErrorCount: it checks primary language labels there or not
  const getErrorCount = data => {
    const dataArray = data;
    let ERROR_COUNT = 0;
    dataArray.map((phase, phaseIndex) => {
      return phase.labels.map((label, labelIndex) => {
        if (
          label.propertyPhaseName === '' &&
          label.languageCode === primaryLanguage
        ) {
          dataArray[phaseIndex].labels[labelIndex].isError = true;
          ERROR_COUNT += 1;
          return true;
        }
        return false;
      });
    });
    return ERROR_COUNT;
  };

  const handleSaveAndSubmit = () => {
    const data = [...phasesData];
    const ERROR_COUNT = getErrorCount(data); // primary languages labels there or not
    if (ERROR_COUNT > 0) {
      setPhasesData(_.cloneDeep(data));
      setDataUpdatedCount(dataUpdatedCount + 1);
    } else {
      let isSecondaryLabelEmptyError = false;
      isSecondaryLabelEmptyError = data.some(phase => {
        return phase.labels.some(label => {
          if (
            label.propertyPhaseName === '' &&
            label.languageCode !== primaryLanguage
          ) {
            // auto populate language
            setAlertMessage(
              messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES
                .AUTO_POPULATE_LANGUAGE,
            );
            setAlertAction('populate');
            setIsAlertOpen(true);
            return true;
          }
          return false;
        });
      });
      if (isSecondaryLabelEmptyError) return;

      if (isErrorInPhase) return; // in onchange if we already have error then prevent user to save data

      const requiredFields = [
        'phaseId',
        'propertyPhaseSequence',
        'labels',
        'isPublish',
      ];

      if (!isAddRequest) requiredFields.push('propertyPhasesId');

      const requestData = _.map(data, _.partialRight(_.pick, requiredFields));
      // removing unwnated data from labels

      // valueArr : to store all object with language code and propertyPhaseName and phaseId
      const valueArr = [];

      _.map(requestData, item => {
        const itemData = item;
        const labelsWithPhaseId = [];
        itemData.labels.forEach(label => {
          const labelData = label;
          // store phaseId with each label
          labelData.phaseId = itemData.phaseId;
          labelsWithPhaseId.push(labelData);
        });
        const requiredFieldsForDuplicateCheck = _.map(
          labelsWithPhaseId,
          _.partialRight(_.pick, [
            'languageCode',
            'propertyPhaseName',
            'phaseId',
          ]),
        );
        valueArr.push(...requiredFieldsForDuplicateCheck);
      });

      // duplicateItems: we are getting duplicateItems here
      const duplicateItems = valueArr
        .map(e => {
          return e.languageCode + e.propertyPhaseName.trim().toUpperCase();
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
        setDuplicatePhases(duplicateItems);
        setErrorAction('duplicate');
        setIsErrorMessage(true);
        setErrorMessage(
          `${messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.LABEL_SHOULD_BE_UNIQUE}`,
        );
        return;
      }
      const finalFormData = { phases: requestData };
      props.dispatch(savePhases(finalFormData, isAddRequest, data));
    }
  };

  // setFocusOnDuplicateRecord : sets focus on duplicate phase label
  const setFocusOnDuplicateRecord = () => {
    const phasesArray = [...phasesData];

    // set isError false for all labels and then we set it true if any duplicate label found in below step
    _.map(phasesArray, i => {
      _.map(i.labels, j => {
        const itemData = j;
        itemData.isError = false;
      });
    });

    duplicatePhases.forEach(item => {
      const indexOfPhase = phasesArray.findIndex(
        phase => phase.phaseId === item.phaseId,
      );
      const indexOfLabelInDuplicatePhase = phasesArray[
        indexOfPhase
      ].labels.findIndex(label => label.languageCode === item.languageCode);
      phasesArray[indexOfPhase].labels[
        indexOfLabelInDuplicatePhase
      ].isError = true;
      phasesArray[indexOfPhase].labels[
        indexOfLabelInDuplicatePhase
      ].errorMessage =
        messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.DUPLICATE_PHASE;
      _.map(phasesArray, i => {
        _.map(i.labels, j => {
          const itemData = j;
          itemData.isFocus = false;
        });
      });
    });

    const indexOfPhaseForSetFocus = phasesArray.findIndex(
      phase => phase.phaseId === duplicatePhases[0].phaseId,
    );

    const indexOfLabelInDuplicatePhaseForSetFocus = phasesArray[
      indexOfPhaseForSetFocus
    ].labels.findIndex(
      label => label.languageCode === duplicatePhases[0].languageCode,
    );

    phasesArray[indexOfPhaseForSetFocus].labels[
      indexOfLabelInDuplicatePhaseForSetFocus
    ].isFocus = true;

    setPhasesData(phasesArray);
    setDataUpdatedCount(dataUpdatedCount + 1);
  };

  // handleError
  const handleError = () => {
    if (errorAction === 'duplicate') {
      setIsErrorMessage(!isErrorMessage);
      // if error of duplicate then focus that input box
      setFocusOnDuplicateRecord();
    } else {
      setIsErrorMessage(!isErrorMessage);
    }
  };

  return (
    <div className="add-or-update-phases">
      <form noValidate>
        {/* Card */}
        <div className="card-container">
          {/* CardHeader */}
          <CardHeader
            title={labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.TITLE}
          />
          {/* Table */}
          <div
            className={`phases-form-data-table ${
              languages.length === 2 ? 'with-two-column' : ''
            }`}
          >
            <CardListTable // FormDataTable
              data={_.cloneDeep(phasesData)}
              columns={columns}
              noDataString={
                messages.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.PHASES_NOT_FOUND
              }
              pending={isLoading}
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="add-or-update-phases-button-container">
          <button onClick={handleCancel} type="button" className="btn-cancel">
            {labels.GLOBAL.BUTTON_CANCEL}
          </button>
          {/*
            // Do not remove this button it will use in future 
           <button type="button" className="btn-save-close">
             {labels.GLOBAL.BUTTON_SAVE_AND_CLOSE}
          </button> */}
          <button
            disabled={isLoadingForSave}
            type="button"
            onClick={handleSaveAndSubmit}
            className="btn-save-submit"
          >
            {labels.GLOBAL.BUTTON_SAVE_AND_CONTINUE}
          </button>
        </div>
      </form>
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
          setIsSuccessAlertOpen(!isSuccessAlertOpen);
          handleSuccessAlert();
        }}
        primaryButtonOnClick={() => handleSuccessAlert()}
      />
    </div>
  );
};

AddOrUpdatePhases.defaultProps = {
  phases: [],
  isLoading: false,
};

AddOrUpdatePhases.propTypes = {
  phases: PropTypes.instanceOf(Array),
  isLoading: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  isError: PropTypes.bool.isRequired,
  isSaved: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  isLoadingForSave: PropTypes.bool.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  primaryLanguage: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    phases: getPhasesListInSequence(state),
    isLoading: getPhasesIsLoadingFromState(state),
    isLoadingForSave: getPhasesIsLoadingForSaveFromState(state),
    isError: getPhasesIsErrorFromState(state),
    isSaved: getPhasesIsSavedFromState(state),
    message: getPhasesMessageFromState(state),
    languages: getLanguages(state),
    primaryLanguage: getPrimaryLanguage(state),
  };
};

export default connect(mapStateToProps)(AddOrUpdatePhases);
