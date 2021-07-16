import React, { useState, useEffect } from 'react';
import './AddOrUpdateSubPhases.scss';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CardHeaderTitle from '../../../components/CardHeader/CardHeader';
import Accordion from '../../../components/Accordion/Accordion';
import Header from './Header/Header';
import TextFieldComponent from '../../../components/TextFieldComponent/TextFieldComponent';
import Switch from '../../../components/Switch/Switch';
import LabelWithIcon from '../../../components/LabelWithIcon/LabelWithIcon';
import CardListTable from '../../../components/CardListTable/CardListTable';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import MandatoryIcon from '../../../components/MandatoryIcon/MandatoryIcon';
import plushIcon from '../../../images/plus/plus.png';
import { getPhasesListInSequence } from '../selector';
import {
  getPhases,
  getSubPhases,
  saveSubPhases,
  resetPhases,
} from '../../../actions/phasesAndMoreActions';

import {
  getErrorMessage,
  insertIsErrorInLabels,
  scrollToTop,
} from '../../../utils/utils';

/** Error & Lables */
import labels from '../../../utils/Locales/labels';
import messages from '../../../utils/Locales/messages';
import { validateNameWithRegex } from '../../../utils/validation';
import constants from '../../../utils/constants';

const labelsForStringComparession = {
  others: 'Others',
  inspection: 'Inspection',
  propertySubphaseSequence: 'propertySubphaseSequence',
  unitHandoverAndFitOut: 'Unit handover & fitout',
};

const AddOrUpdateSubPhases = props => {
  const { phases, history, languages, primaryLanguage } = props;

  const [phasesData, setPhasesData] = useState([]);
  const [subPhasesData, setSubPhasesData] = useState([]);
  const [oldSubPhasesData, setOldSubPhasesData] = useState([]); // to reset on cancel
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAction, setErrorAction] = useState(false); // duplicate , other
  const [duplicateSubPhases, setDuplicateSubPhases] = useState([]);
  const [isErrorInSubPhase, setIsErrorInSubPhase] = useState(false); //  isErrorInSubPhase: we will use it in each onchange.if we get any error from it then we can prevent user to save and continue
  const [isLoadingSubPhases, setisLoadingSubPhases] = useState(false);
  const [isLoadingForSave, setIsLoadingForSave] = useState(false);
  // alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isPhaseNotFoundAlertOpen, setIsPhaseNotFoundAlertOpen] = useState(
    false,
  );
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(false); // populate , cancel
  // SuccessAlert
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [successMessage, setsuccessMessage] = useState(false);

  /**
   * for datatable not getting value of accordion data if we are not using this state
   * dataUpdatedCount
   */

  const [dataUpdatedCount, setDataUpdatedCount] = useState(0);
  const [isSubPhasesGetSuccessfully, setIsSubPhasesGetSuccessfully] = useState(
    false,
  );

  const [columns, setColumns] = useState([]);

  // isAddRequest : using isAddRequest we can identify that on save and submit we are going to perform add request or edit
  const [isAddRequest, setIsAddRequest] = useState(true);

  // insertEmptyObjectsInLabels: it inserts the labels if not exist in subphase labels
  const insertEmptyObjectsInLabels = arr => {
    if (arr.length === languages.length) {
      return arr;
    }
    languages.forEach(locale => {
      if (!arr.find(arrObj => arrObj.languageCode === locale.languageCode))
        arr.push({
          propertySubPhaseName: '',
          languageCode: locale.languageCode,
          languageName: locale.languageName,
        });
    });
    return arr;
  };

  const insertEmptyObjectsInLabelsOfPhase = arr => {
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

  // handleErrorText : handles error text as per label
  const handleErrorText = (row, indexOfLabel) => {
    if (row.labels[indexOfLabel] && row.labels[indexOfLabel].errorMessage)
      return row.labels[indexOfLabel].errorMessage;
    return messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.FIELD_IS_REQUIRED;
  };

  // handleIsError : handles error as per label
  const handleIsError = (row, indexOfLabel) => {
    if (row.labels[indexOfLabel] && row.labels[indexOfLabel].isError)
      return row.labels[indexOfLabel].isError;
    return false;
  };

  // initializeColumns : it initialize columns inside content of accordion
  const initializeColumns = () => {
    const inputColums = [
      {
        name: labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.COL_1,
        selector: 'subPhaseName',
        maxWidth: '250px',
      },
    ];
    languages.forEach((language, index) => {
      inputColums.push({
        // maxWidth: '250px',
        maxWidth: languages.length === 2 && index === 1 ? '400px' : '250px',
        name: `${labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.COL_2} \n (${language.languageName})`,
        cell: row => {
          const indexOfLabel = row.labels.findIndex(
            label => label.languageCode === language.languageCode,
          );
          return (
            <TextFieldComponent
              id={`${row.phaseId}-${row.subPhaseName}-${language.languageName}-input`}
              name={`${row.phaseId}-${row.subPhaseName}-${language.languageName}-input`}
              type="text"
              className="sub-phase-field"
              inputClassName={`${row.phaseId}-${row.subPhaseName}-input `}
              placeholder=""
              helperText={handleErrorText(row, indexOfLabel)}
              error={handleIsError(row, indexOfLabel)}
              value={
                row.labels[indexOfLabel] &&
                row.labels[indexOfLabel].propertySubPhaseName
                  ? row.labels[indexOfLabel].propertySubPhaseName
                  : ''
              }
              onChange={e =>
                handleOnChange(e, row.phaseId, row.subPhaseName, indexOfLabel)
              }
              isDisable={
                row.isMandatory === '' && row.isDefaultMandatory
                  ? false
                  : !row.isMandatory
              }
              maxLength={
                row.labels[indexOfLabel].languageCode === primaryLanguage
                  ? labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                      .LENGTH_OF_SUB_PHASE_NAME
                  : labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                      .LENGTH_OF_SUB_PHASE_NAME_SECONDARY
              }
              autoFocus={row.labels[indexOfLabel].isFocus}
            />
          );
        },
      });
    });
    inputColums.push({
      grow: languages.length === 2 ? 0.5 : 1,
      width: languages.length === 3 ? '70px' : 'auto',
      right: true,
      name: '',
      cell: row => {
        return (
          <>
            {row.isDefaultMandatory ? (
              <MandatoryIcon
                label={
                  labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                    .MANDATORY_ICON_LABEL
                }
              />
            ) : (
              <Switch
                id={`${row.phaseId}-${row.subPhase}-switch`}
                name={`${row.phaseId}-${row.subPhase}-switch`}
                checked={row.isMandatory}
                handleToggle={() =>
                  handleSwitchToggle(row.phaseId, row.subPhaseName)
                }
              />
            )}
          </>
        );
      },
    });
    setColumns(inputColums);
  };

  // getSubPhasesInSequence: returns subPhases in sequence
  const getSubPhasesInSequence = (phasesArray, subPhasesArray) => {
    // handle subphase sequence
    const subPhasesInSequence = [];
    phasesArray.forEach(p => {
      const relatedSubPhases = subPhasesArray.filter(s => {
        return s.phaseId === p.phaseId;
      });
      const relatedSubPhasesInSequence = _.orderBy(
        relatedSubPhases,
        labelsForStringComparession.propertySubphaseSequence,
      );
      subPhasesInSequence.push(...relatedSubPhasesInSequence);
    });
    return subPhasesInSequence;
  };

  // fetchSubPhases
  const fetchSubPhases = phasesArray => {
    getSubPhases()
      .then(resposne => {
        const responseData = resposne.data;
        if (
          responseData &&
          responseData.success &&
          responseData.data[0].subPhases.length > 0
        ) {
          const { subPhases } = responseData.data[0];
          const subPhasesInSequence = getSubPhasesInSequence(
            phasesArray,
            subPhases,
          );
          subPhasesInSequence.map(subPhase => {
            const subPhaseData = subPhase;
            const labelsArray = insertEmptyObjectsInLabels(subPhase.labels);
            subPhaseData.labels = insertIsErrorInLabels(labelsArray);
            subPhaseData.isPublish = true;
            // set predefined labels based on subphases added using add more button
            if (!subPhaseData.subPhaseId && !subPhaseData.subPhaseName) {
              const phaseData = phasesArray.filter(
                phase => phase.phaseId === subPhaseData.phaseId,
              );
              const { phaseName } = phaseData[0];
              subPhaseData.subPhaseName = capitalizeFirstLetter(
                `${subPhaseData.phaseTypeName} ${
                  phaseName.toUpperCase() ===
                    labelsForStringComparession.unitHandoverAndFitOut.toUpperCase() &&
                  subPhaseData.phaseTypeName.toUpperCase() ===
                    labelsForStringComparession.inspection.toUpperCase()
                    ? subPhaseData.propertySubphaseSequence - 1
                    : subPhaseData.propertySubphaseSequence
                }`,
              );
            }
            if (subPhaseData.isMandatory === '')
              subPhaseData.isMandatory = true;
            return true;
          });

          setIsAddRequest(subPhasesInSequence[0].propertySubPhasesId === ''); // if propertySubPhasesId null of any record it means its add request else edit request
          setSubPhasesData(_.cloneDeep(subPhasesInSequence));
          setOldSubPhasesData(_.cloneDeep(subPhasesInSequence));
          setDataUpdatedCount(1);
          setIsSubPhasesGetSuccessfully(true);
          setisLoadingSubPhases(false);
        }
      })
      .catch(err => {
        setisLoadingSubPhases(false);
        const error = getErrorMessage(err);
        setIsErrorMessage(true);
        setErrorMessage(error);
      });
  };

  useEffect(() => {
    scrollToTop();
    setisLoadingSubPhases(true);
    props.dispatch(getPhases());
    return () => {
      props.dispatch(resetPhases());
    };
  }, []);

  useEffect(() => {
    if (phases.length > 0) {
      phases.map(phase => {
        const phaseData = phase;
        phaseData.propertyPhaseSequence = phaseData.phaseSequence;
        const PhaseLabels = insertEmptyObjectsInLabelsOfPhase(
          phaseData.labels,
          languages,
        );
        phaseData.labels = insertIsErrorInLabels(PhaseLabels);
        return true;
      });
      // if primary labeles empty then show alert message and redirect user to add update phases screen
      const isPrimaryLableEmptyError = phases.some(phase => {
        if (phase.labels.length === 0) return true;

        return phase.labels.some(label => {
          const labelData = label;
          if (
            labelData.propertyPhaseName === '' &&
            labelData.languageCode === primaryLanguage
          )
            return true;
          return false;
        });
      });
      if (isPrimaryLableEmptyError) {
        setAlertMessage(
          messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
            .PHASES_LABEL_NOT_FOUND,
        );
        setisLoadingSubPhases(false);
        setIsPhaseNotFoundAlertOpen(true);
      } else {
        setPhasesData(_.cloneDeep(phases));
        fetchSubPhases(phases);
      }
    }
  }, [phases]);

  useEffect(() => {
    if (isSubPhasesGetSuccessfully && dataUpdatedCount > 0) {
      initializeColumns();
    }
  }, [isSubPhasesGetSuccessfully, dataUpdatedCount]);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  /**
   * handleOnChange to handle input changes in subphases feilds
   * @param {Object} event :  input event object
   * @param {number} phaseIndex : phaseIndex is index of phase which we want to change
   * @param {string} subPhaseName : is subphase subphase name which switch is going to toggle
   * @param {number} languageIndex : languageIndex is index of language which we want to change
   */

  const handleOnChange = (event, phaseIndex, subPhaseName, languageIndex) => {
    event.preventDefault();
    const subPhases = [...subPhasesData];
    const indexOfSubphase = subPhases.findIndex(
      subPhase =>
        subPhase.phaseId === phaseIndex &&
        subPhase.subPhaseName === subPhaseName,
    );
    subPhases[indexOfSubphase].labels[languageIndex].propertySubPhaseName =
      event.target.value;

    if (event.target.value === '') {
      // empty value
      subPhases[indexOfSubphase].labels[languageIndex].isError = true;
      subPhases[indexOfSubphase].labels[languageIndex].errorMessage =
        messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.FIELD_IS_REQUIRED;
      setIsErrorInSubPhase(true);
    } else if (
      event.target.value.length >
        labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
          .LENGTH_OF_SUB_PHASE_NAME &&
      subPhases[indexOfSubphase].labels[languageIndex].languageCode ===
        primaryLanguage
    ) {
      // validate length of primary data
      subPhases[indexOfSubphase].labels[languageIndex].isError = true;
      subPhases[indexOfSubphase].labels[
        languageIndex
      ].errorMessage = `${messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.SUB_PHASE_NAME_SHOULD_BE_LESS}`;
      setIsErrorInSubPhase(true);
    } else if (
      event.target.value.length >
        labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
          .LENGTH_OF_SUB_PHASE_NAME_SECONDARY &&
      subPhases[indexOfSubphase].labels[languageIndex].languageCode !==
        primaryLanguage
    ) {
      // validate length of secondary label
      subPhases[indexOfSubphase].labels[languageIndex].isError = true;
      subPhases[indexOfSubphase].labels[
        languageIndex
      ].errorMessage = `${messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.SUB_PHASE_NAME_SHOULD_BE_LESS_SECONDARY}`;
      setIsErrorInSubPhase(true);
    } else if (
      !validateNameWithRegex(
        event.target.value,
        labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.REGEX_OF_SUB_PHASE_NAME,
      ) &&
      subPhases[indexOfSubphase].labels[languageIndex].languageCode ===
        primaryLanguage
    ) {
      // validate regex
      subPhases[indexOfSubphase].labels[languageIndex].isError = true;
      subPhases[indexOfSubphase].labels[languageIndex].errorMessage =
        messages.GLOBAL.ERR_TEXTFIELD_INPUT;
      setIsErrorInSubPhase(true);
    } else {
      // no error
      subPhases[indexOfSubphase].labels[languageIndex].errorMessage = '';
      subPhases[indexOfSubphase].labels[languageIndex].isError = false;
      setIsErrorInSubPhase(false);
    }

    setSubPhasesData(subPhases);
  };

  /**
   * handleSwitchToggle: handle switch on off functionality
   * @param {number} phaseIndex : is phase id of phase in which we want to toggle switch
   * @param {string} subPhaseName : is subphase subphase name which switch is going to toggle
   * @param {string} classNameForEnableDisable : is class name of input feilds which we want to disable / enable
   */

  const handleSwitchToggle = (phaseIndex, subPhaseName) => {
    const subPhases = [...subPhasesData];
    const indexOfSubphase = subPhases.findIndex(
      subPhase =>
        subPhase.phaseId === phaseIndex &&
        subPhase.subPhaseName === subPhaseName,
    );
    subPhases[indexOfSubphase].isMandatory = !subPhases[indexOfSubphase]
      .isMandatory;

    // if not required suphase then remove its error
    if (!subPhases[indexOfSubphase].isMandatory) {
      setIsErrorInSubPhase(false);
      subPhases[indexOfSubphase].labels.forEach(label => {
        const labelData = label;
        labelData.isError = false;
      });
    }

    setSubPhasesData(subPhases);
  };

  /**
   * capitalizeFirstLetter
   *  this function capitalize the given string
   *  @param {string} string
   *
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * getSequenceOfNewSubPhase :
   *  return sequence which we can use it to generate new subphase
   *  this function counts the no of subphases wich are not having subphaseid means added using add more button
   * @param {Array} subPhases
   *
   */

  const getSequenceOfNewSubPhase = subPhases => {
    // we are checking here which are not added using add more
    const addedUsingAddMore = subPhases.filter(subPhase => {
      return !subPhase.subPhaseId;
    });
    return addedUsingAddMore.length + 1;
  };

  /**
   * handleAddMoreSubphase : for add new subphase
   * add more functionality working based on subPhaseId and propertySubphaseSequence
   * @param {number} phaseIndex : phaseIndex is index of phase where we want to add new subphase
   */

  const handleAddMoreSubphase = (
    phaseIndex,
    phaseTypeName,
    relatedSubPhases,
    phaseName,
  ) => {
    const data = [...subPhasesData];
    // sequenceOfSubPhase : position at which new subphase will be added
    const sequenceOfSubPhase = getSequenceOfNewSubPhase(relatedSubPhases);
    // update sequence of related subphases
    subPhasesData.forEach((item, index) => {
      const subPhase = item;
      if (subPhase.phaseId === phaseIndex && subPhase.subPhaseId) {
        // Unit handover & fitout we are addign new row from second step
        if (
          phaseName.toUpperCase() ===
            labelsForStringComparession.unitHandoverAndFitOut.toUpperCase() &&
          phaseTypeName.toUpperCase() ===
            labelsForStringComparession.inspection.toUpperCase() &&
          data[index].propertySubphaseSequence === 1
        )
          return;
        // others sequence get incremented by 1
        data[index].propertySubphaseSequence += 1;
      }
    });

    const labelsArray = insertEmptyObjectsInLabels([]);
    data.push({
      phaseId: phaseIndex,
      subPhaseName: `${capitalizeFirstLetter(
        phaseTypeName,
      )} ${sequenceOfSubPhase}`,
      propertySubphaseSequence:
        phaseName.toUpperCase() ===
          labelsForStringComparession.unitHandoverAndFitOut.toUpperCase() &&
        phaseTypeName.toUpperCase() ===
          labelsForStringComparession.inspection.toUpperCase()
          ? sequenceOfSubPhase + 1
          : sequenceOfSubPhase,
      isDefaultMandatory: false,
      isDefaultParallel: false,
      isMandatory: true,
      isPublish: true,
      isParallel: false,
      phaseTypeName,
      labels: insertIsErrorInLabels(labelsArray),
    });

    // here we are removing focus if its there in any subphase because it is causing issue at add more time
    _.map(data, i => {
      _.map(i.labels, j => {
        const itemData = j;
        itemData.isFocus = false;
      });
    });

    const subPhasesInSequence = getSubPhasesInSequence(phasesData, data);
    setSubPhasesData(subPhasesInSequence);
    setDataUpdatedCount(dataUpdatedCount + 1);
  };

  /**
   * handleContentComponent: is function which return our sub talbes. We can see inside accordion as content
   *
   */
  const handleContentComponent = (relatedSubPhases, isAddMore, phaseName) => {
    return (
      <div className="subphases-form-data-table">
        <div className={`${languages.length === 2 ? 'with-two-column' : ''}`}>
          <CardListTable
            data={_.cloneDeep(relatedSubPhases)}
            columns={columns}
            noDataLabel={
              messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                .SUB_PHASES_NOT_FOUND
            }
            isPagination={false}
          />
        </div>
        {/* Add More */}
        {isAddMore && (
          <LabelWithIcon
            className="add-more-button"
            label="Add more subphases"
            icon={plushIcon}
            handleClick={() =>
              handleAddMoreSubphase(
                relatedSubPhases[0].phaseId,
                relatedSubPhases[0].phaseTypeName,
                relatedSubPhases,
                phaseName,
              )
            }
          />
        )}
      </div>
    );
  };

  /**
   *  handleCancel: it set the old state to our Sub-PhaseData
   */

  const handleCancel = () => {
    // old data
    const oldData = _.map(
      oldSubPhasesData,
      _.partialRight(_.pick, ['labels', 'isMandatory']),
    );
    _.map(oldData, item => {
      const itemData = item;
      itemData.labels = _.map(
        itemData.labels,
        _.partialRight(_.pick, ['languageCode', 'propertySubPhaseName']),
      );
    });

    // new data
    const newData = _.map(
      subPhasesData,
      _.partialRight(_.pick, ['labels', 'isMandatory']),
    );
    _.map(newData, item => {
      const itemData = item;

      itemData.labels = _.map(
        itemData.labels,
        _.partialRight(_.pick, ['languageCode', 'propertySubPhaseName']),
      );
    });
    if (!_.isEqual(newData, oldData)) {
      setAlertAction('cancel');
      setAlertMessage(messages.GLOBAL.ERR_CHANGES_LOST);
      setIsAlertOpen(true);
    }
  };

  const getErrorCount = data => {
    const dataArray = data;
    let ERROR_COUNT = 0;
    let SUB_PHASE_INDEX_OF_ERROR_ONE = 0;
    let SUB_PHASE_LABEL_INDEX_OF_ERROR_ONE = 0;
    dataArray.map((subPhase, subPhaseIndex) => {
      return subPhase.labels.map((label, labelIndex) => {
        if (
          label.propertySubPhaseName === '' &&
          label.languageCode === primaryLanguage &&
          subPhase.isMandatory
        ) {
          dataArray[subPhaseIndex].labels[labelIndex].isError = true;
          ERROR_COUNT += 1;
          _.map(dataArray, (i, indexOfSubPhase) => {
            _.map(i.labels, (j, indexOfSubPhaseLabel) => {
              dataArray[indexOfSubPhase].labels[
                indexOfSubPhaseLabel
              ].isFocus = false;
            });
          });
          if (ERROR_COUNT === 1) {
            SUB_PHASE_INDEX_OF_ERROR_ONE = subPhaseIndex;
            SUB_PHASE_LABEL_INDEX_OF_ERROR_ONE = labelIndex;
          }
          return true;
        }
        return false;
      });
    });
    if (ERROR_COUNT > 0)
      dataArray[SUB_PHASE_INDEX_OF_ERROR_ONE].labels[
        SUB_PHASE_LABEL_INDEX_OF_ERROR_ONE
      ].isFocus = true;

    return ERROR_COUNT;
  };

  /**
   * handleSaveAndSubmit
   */

  const handleSaveAndSubmit = () => {
    const data = _.cloneDeep(subPhasesData);
    const ERROR_COUNT = getErrorCount(data); // check primary label empty or not
    if (ERROR_COUNT > 0) {
      setSubPhasesData(data);
      setDataUpdatedCount(dataUpdatedCount + 1);
    } else {
      // validate secondary label empty or not
      let isSecondaryLabelEmptyError = false;
      isSecondaryLabelEmptyError = data.some(subPhase => {
        return subPhase.labels.some(label => {
          if (
            label.propertySubPhaseName === '' &&
            label.languageCode !== primaryLanguage &&
            subPhase.isMandatory
          ) {
            // auto populate language
            setAlertMessage(
              messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                .AUTO_POPULATE_LANGUAGE,
            );
            setAlertAction('populate');
            setIsAlertOpen(true);
            return true;
          }
          return false;
        });
      });

      if (isSecondaryLabelEmptyError) return; // if secondary labels empty then return

      if (isErrorInSubPhase) return; // in onchange if we have any error then prevent user to save and continue

      const requiredFields = [
        'phaseId',
        'subPhaseId',
        'isPublish',
        'isMandatory',
        'isParallel',
        'propertySubphaseSequence',
        'labels',
      ];

      if (!isAddRequest) requiredFields.push('propertySubPhasesId'); // for edit we need propertySubPhasesId

      const requestData = _.map(data, _.partialRight(_.pick, requiredFields));

      // removing languageName from labels
      _.map(data, item => {
        const itemData = item;
        itemData.labels = _.map(
          itemData.labels,
          _.partialRight(_.pick, ['languageCode', 'propertySubPhaseName']),
        );
      });

      // valueArr : to store all object with language code , propertySubPhaseName and phaseId
      const valueArr = [];
      _.map(data, item => {
        const itemData = item;

        const labelsWithPhaseIdAndSuPhaseName = [];
        itemData.labels.forEach(label => {
          const labelData = label;
          labelData.phaseId = itemData.phaseId;
          labelData.subPhaseName = itemData.subPhaseName;
          // accept if propertySubPhaseName entered
          if (labelData.propertySubPhaseName) {
            labelsWithPhaseIdAndSuPhaseName.push(labelData);
          }
        });

        const requiredFieldsForDuplicateCheck = _.map(
          labelsWithPhaseIdAndSuPhaseName,
          _.partialRight(_.pick, [
            'languageCode',
            'propertySubPhaseName',
            'phaseId',
            'subPhaseName',
          ]),
        );

        valueArr.push(...requiredFieldsForDuplicateCheck);
      });

      // duplicateItems
      const duplicateItems = valueArr
        .map(e => {
          return e.languageCode + e.propertySubPhaseName.trim().toUpperCase();
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
        setDuplicateSubPhases(duplicateItems);
        setErrorAction('duplicate');
        setIsErrorMessage(true);
        setErrorMessage(
          `${messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.LABEL_SHOULD_BE_UNIQUE}`,
        );
        return;
      }

      const finalFormData = { subPhases: requestData };

      setIsLoadingForSave(true);

      saveSubPhases(finalFormData, isAddRequest)
        .then(response => {
          setIsLoadingForSave(false);
          if (response.data && response.data.success) {
            setsuccessMessage(
              isAddRequest
                ? messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                    .SUB_PHASES_SAVED_SUCCESSFULLY
                : messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                    .SUB_PHASES_EDITED_SUCCESSFULLY,
            );
            setIsSuccessAlertOpen(true);
          }
        })
        .catch(error => {
          setIsLoadingForSave(false);
          const saveErrorMessage = getErrorMessage(error);
          setIsErrorMessage(true);
          setErrorMessage(saveErrorMessage);
        });
    }
  };

  // handleSuccessAlert: after successfully save redirect user to add update pre-requisite
  const handleSuccessAlert = () => {
    history.push(constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE);
  };

  const handleAlertOKButtonClick = () => {
    if (alertAction === 'populate') {
      const newSubPhasesData = [];
      const data = [...subPhasesData];
      data.forEach(subPhase => {
        const subPhaseData = subPhase;
        subPhaseData.labels.forEach(label => {
          const labelData = label;
          if (
            labelData.propertySubPhaseName === '' &&
            labelData.languageCode !== primaryLanguage
          ) {
            // getIndexOfPrimaryLanguage : get id of primary and secondary lang based on its own labels
            const indexOfPrimaryLanguage = subPhaseData.labels.findIndex(
              l => l.languageCode === primaryLanguage,
            );
            const indexOfSecondaryLanguage = subPhaseData.labels.findIndex(
              l => l.languageCode === labelData.languageCode,
            );
            subPhaseData.labels[indexOfSecondaryLanguage].propertySubPhaseName =
              subPhaseData.labels[indexOfPrimaryLanguage].propertySubPhaseName;
            subPhaseData.labels[indexOfSecondaryLanguage].isError = false;
          }
        });
        newSubPhasesData.push(subPhaseData);
      });
      setIsErrorInSubPhase(false);

      _.map(newSubPhasesData, i => {
        _.map(i.labels, j => {
          const itemData = j;
          itemData.isFocus = false;
        });
      });

      setSubPhasesData(newSubPhasesData);
      setDataUpdatedCount(dataUpdatedCount + 1);
    } else if (alertAction === 'cancel') {
      setIsErrorInSubPhase(false);
      setSubPhasesData(_.cloneDeep(oldSubPhasesData));
      setDataUpdatedCount(dataUpdatedCount + 1);
    }
    setIsAlertOpen(false);
  };

  /**
   * getRelatedSubPhases
   * @param {number} phaseId : for get records related to phases from subphases
   */
  const getRelatedSubPhases = phaseId => {
    return subPhasesData.filter(subPhase => subPhase.phaseId === phaseId);
  };

  /**
   * checkIsErrorInContent :
   *  we are using this function to open accordion when user having error in any phase
   *  @param {data} data :
   *
   */

  const checkIsErrorInContent = data => {
    return data.some(subPhase => {
      return subPhase.labels.some(label => {
        if (label.isError) {
          return true;
        }
        return false;
      });
    });
  };

  // handleAlertOKButtonClickForPhaseNotFound
  const handleAlertOKButtonClickForPhaseNotFound = () => {
    history.push(constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PHASES);
  };

  // setFocusOnDuplicateRecord
  const setFocusOnDuplicateRecord = () => {
    const subPhasesArray = [...subPhasesData];

    // set isError false for all labels and then we set it true if any duplicate label found in below step
    _.map(subPhasesArray, i => {
      _.map(i.labels, j => {
        const itemData = j;
        itemData.isError = false;
      });
    });

    duplicateSubPhases.forEach(item => {
      const indexOfSubPhase = subPhasesArray.findIndex(
        subPhase =>
          subPhase.phaseId === item.phaseId &&
          subPhase.subPhaseName === item.subPhaseName,
      );
      const indexOfLabelInDuplicateSubPhase = subPhasesArray[
        indexOfSubPhase
      ].labels.findIndex(label => label.languageCode === item.languageCode);
      subPhasesArray[indexOfSubPhase].labels[
        indexOfLabelInDuplicateSubPhase
      ].isError = true;
      subPhasesArray[indexOfSubPhase].labels[
        indexOfLabelInDuplicateSubPhase
      ].errorMessage =
        messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.DUPLICATE_SUB_PHASE;

      _.map(subPhasesArray, i => {
        _.map(i.labels, j => {
          const itemData = j;
          itemData.isFocus = false;
        });
      });
    });

    const indexOfSubPhaseForSetFocus = subPhasesArray.findIndex(
      phase =>
        phase.phaseId === duplicateSubPhases[0].phaseId &&
        phase.subPhaseName === duplicateSubPhases[0].subPhaseName,
    );

    const indexOfLabelInDuplicateSubPhaseForSetFocus = subPhasesArray[
      indexOfSubPhaseForSetFocus
    ].labels.findIndex(
      label => label.languageCode === duplicateSubPhases[0].languageCode,
    );

    subPhasesArray[indexOfSubPhaseForSetFocus].labels[
      indexOfLabelInDuplicateSubPhaseForSetFocus
    ].isFocus = true;

    setSubPhasesData(subPhasesArray);
    setDataUpdatedCount(dataUpdatedCount + 1);
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

  return (
    <div className="add-or-update-sub-phases">
      {!isPhaseNotFoundAlertOpen && (
        <>
          {/* Card */}
          <div className="card-container">
            {/* CardHeaderTitle */}
            <CardHeaderTitle
              title={labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.TITLE}
            />
            <div className="accordion-container">
              {isLoadingSubPhases && <ProgressBar />}
              {/* Accordion */}
              {phasesData.length > 0 &&
                subPhasesData.length > 0 &&
                phasesData.map(phaseData => {
                  const indexOfPrimaryLabel = phaseData.labels.findIndex(
                    label => label.languageCode === primaryLanguage,
                  );
                  const isAddMore =
                    phaseData.phaseTypeName.toUpperCase() !==
                    labelsForStringComparession.others.toUpperCase();
                  // const isAddMore = !phaseData.isDefaultMandatory;
                  const subPhasesArray = getRelatedSubPhases(phaseData.phaseId);
                  const subPhasesInSequence = _.orderBy(
                    subPhasesArray,
                    labelsForStringComparession.propertySubphaseSequence,
                  );
                  return (
                    <Accordion
                      key={phaseData.phaseId}
                      headerComponent={
                        <Header
                          phase={
                            phaseData.labels[indexOfPrimaryLabel]
                              .propertyPhaseName
                          }
                        />
                      }
                      isContent={subPhasesArray.length > 0}
                      contentComponent={handleContentComponent(
                        subPhasesInSequence,
                        isAddMore,
                        phaseData.phaseName,
                      )}
                      isError={checkIsErrorInContent(subPhasesArray)}
                    />
                  );
                })}
              {subPhasesData.length === 0 && !isLoadingSubPhases && (
                <div className="no-data-found">
                  {
                    messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                      .SUB_PHASES_NOT_FOUND
                  }
                </div>
              )}
            </div>
          </div>
          {/* Buttons */}
          <div className="add-or-update-sub-phases-button-container">
            <button onClick={handleCancel} type="button" className="btn-cancel">
              {labels.GLOBAL.BUTTON_CANCEL}
            </button>
            {/*
          // Do not remove this button it will use in future 
         <button type="button" className="btn-save-close">
          {labels.GLOBAL.BUTTON_SAVE_AND_CLOSE}
        </button> */}
            <button
              type="button"
              onClick={handleSaveAndSubmit}
              disabled={isLoadingForSave}
              className="btn-save-submit"
            >
              {labels.GLOBAL.BUTTON_SAVE_AND_CONTINUE}
            </button>
          </div>
        </>
      )}
      {/* alert box : populate , cancel */}
      <InformationAlert
        alertMessage={alertMessage}
        primaryButtonText={labels.GLOBAL.YES}
        secondaryButtonText={labels.GLOBAL.NO}
        open={isAlertOpen}
        setClose={() => setIsAlertOpen(!isAlertOpen)}
        primaryButtonOnClick={() => handleAlertOKButtonClick()}
      />
      <InformationAlert
        alertMessage={alertMessage}
        primaryButtonText={labels.GLOBAL.OK}
        open={isPhaseNotFoundAlertOpen}
        setClose={() => {
          setIsPhaseNotFoundAlertOpen(false);
          handleAlertOKButtonClickForPhaseNotFound();
        }}
        primaryButtonOnClick={() => handleAlertOKButtonClickForPhaseNotFound()}
        isCancelButton={false}
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
  );
};

AddOrUpdateSubPhases.defaultProps = {
  phases: [],
};

AddOrUpdateSubPhases.propTypes = {
  phases: PropTypes.instanceOf(Array),
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  primaryLanguage: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    phases: getPhasesListInSequence(state),
    languages: state.common.userLanguages,
    primaryLanguage: state.common.primaryLanguage,
  };
};

export default connect(mapStateToProps)(AddOrUpdateSubPhases);
