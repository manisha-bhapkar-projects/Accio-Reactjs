import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './AddUpdatePreRequisites.scss';
import { Card } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Checkbox from '../../../components/Checkbox/Checkbox';
import CardHeader from '../../../components/CardHeader/CardHeader';
import TextFieldComponent from '../../../components/TextFieldComponent/TextFieldComponent';
import CardListTable from '../../../components/CardListTable/CardListTable';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import { handleApiError, hasDuplicates } from '../../../utils/utils';
import routePaths from '../../../utils/constants';
import validationMessage from '../../../utils/Locales/messages';
import {
  validateNameWithRegex,
  validateCharacterLength,
} from '../../../utils/validation';
import labelText from '../../../utils/Locales/labels';
// Redux
import {
  getPRFieldsAPIAction,
  getPRDetailsAPIAction,
  addNewPRApiAction,
  editPRApiAction,
} from '../../../actions/prerequisiteListing';

const AddUpdatePreRequisites = ({
  history,
  getPreRequisiteFieldsApi,
  addNewPRApi,
  editPRApi,
  getPRDetailsApi,
  match,
  location,
  lang,
  primaryLanguage,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [prerequisiteName, setPrerequisteName] = React.useState([]);
  // const [
  //   prerequsiteNameInitialState,
  //   setPrerequisteNameInitialState,
  // ] = React.useState([]);
  const [primaryNameError, setPrimaryNameError] = React.useState([]);
  const [primaryPRFieldsError, setPrimaryPRFieldsError] = React.useState([]);

  const [columns, setColumns] = React.useState([]);
  const [isAutoPopulatePopupOpen, setIsAutoPopulatePopupOpen] = React.useState(
    false,
  );
  const [isCancel, setIsCancel] = React.useState(false);
  const [isAnyDataModified, setIsAnyDataModified] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [
    preRequisiteFieldDetails,
    setPreRequisiteFieldDetails,
  ] = React.useState([]);
  // const [
  //   preRequisiteFieldDetailsInitialState,
  //   setPreRequisiteFieldDetailsInitialState,
  // ] = React.useState([]);

  const insertEmptyObjectsIn = arr => {
    if (arr.length === lang.length) {
      return arr;
    }
    lang.forEach(locale => {
      if (!arr.find(arrObj => arrObj.languageCode === locale.languageCode))
        arr.push({
          name: '',
          languageCode: locale.languageCode,
        });
    });
    return arr;
  };

  const insertEmptyErrorObjectsIn = arr => {
    if (arr.length === lang.length) {
      return arr;
    }
    lang.forEach(locale => {
      if (!arr.find(arrObj => arrObj.languageCode === locale.languageCode))
        arr.push({
          errorText: '',
          languageCode: locale.languageCode,
        });
    });
    return arr;
  };

  const validatePrimaryPRName = () => {
    const isPrimaryNameEmpty = prerequisiteName.some(names => {
      if (names.name === '' && names.languageCode === primaryLanguage) {
        const tempPRNameError = [...primaryNameError];
        tempPRNameError.find(
          item => item.languageCode === primaryLanguage,
        ).errorText = validationMessage.GLOBAL.MANDATORY_FIELD;

        setPrimaryNameError(tempPRNameError);
        return true;
      }
      // if (!validateNameWithRegex(names.name) && names.languageCode === primaryLanguage) {
      //   setPrimaryNameError(validationMessage.GLOBAL.ERR_TEXTFIELD_INPUT);
      //   return true;
      // }
      return false;
    });
    return isPrimaryNameEmpty;
  };

  const validatePrimaryPRFields = () => {
    let isPrimaryFieldLabelsEmpty = false;
    preRequisiteFieldDetails.forEach(PRFieldDetails => {
      const prFieldLabels = PRFieldDetails.labelNames;
      if (
        prFieldLabels.some(label => {
          if (label.name === '' && label.languageCode === primaryLanguage) {
            isPrimaryFieldLabelsEmpty = true;
            return true;
          }
          return false;
        })
      ) {
        const tempErrorState = [...primaryPRFieldsError];
        const tempErrorRow = tempErrorState.find(
          item => item.seq === PRFieldDetails.seq,
        );
        tempErrorRow.error.find(
          item => item.languageCode === primaryLanguage,
        ).errorText = validationMessage.GLOBAL.MANDATORY_FIELD;
        setPrimaryPRFieldsError(tempErrorState);
      }
    });
    return isPrimaryFieldLabelsEmpty;
  };

  const initializePreRequisiteNameArr = () => {
    const nameArr = [];
    lang.forEach(locale => {
      nameArr.push({ name: '', languageCode: locale.languageCode });
    });
    setPrerequisteName(nameArr);
    // adding below for cancel logic

    // setPrerequisteNameInitialState(_.cloneDeep(nameArr));
  };

  const initializePreRequisiteNameErrorArr = () => {
    const nameErrArr = [];
    lang.forEach(locale => {
      nameErrArr.push({ errorText: '', languageCode: locale.languageCode });
    });
    setPrimaryNameError(nameErrArr);
  };

  const initializeDetailsColumns = () => {
    const inputColumn = [
      {
        keyField: 'seq',
        name:
          labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE.FIELD_DETAILS.COL_1,
        selector: 'field',
        sortable: false,
      },
    ];

    lang.forEach(locale => {
      inputColumn.push({
        keyField: 'seq',
        name: `${labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE.FIELD_DETAILS.COL_LANG_UPDATE_LABEL} (${locale.languageName})`,
        sortable: false,
        cell: row => {
          return (
            <>
              <TextFieldComponent
                id={`${row.field}-${locale.languageCode}`}
                name={`${row.field}-${locale.languageCode}`}
                type="text"
                className="prerequisite-field"
                value={
                  row.labelNames.length > 0
                    ? row.labelNames.find(
                        item => item.languageCode === locale.languageCode,
                      ).name
                    : ''
                }
                onChange={e =>
                  handlePrerequisiteLabelChange(row, locale.languageCode, e)
                }
                error={
                  !!(primaryPRFieldsError.length > 0
                    ? primaryPRFieldsError
                        .find(item => item.seq === row.seq)
                        .error.find(
                          item => item.languageCode === locale.languageCode,
                        ).errorText
                    : false)
                }
                helperText={
                  (primaryPRFieldsError.length > 0
                  ? primaryPRFieldsError
                      .find(item => item.seq === row.seq)
                      .error.find(
                        item => item.languageCode === locale.languageCode,
                      ).errorText
                  : false)
                    ? primaryPRFieldsError
                        .find(item => item.seq === row.seq)
                        .error.find(
                          item => item.languageCode === locale.languageCode,
                        ).errorText
                    : ''
                }
                maxLength={
                  locale.languageCode === primaryLanguage
                    ? labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE
                        .FIELD_DETAILS.FIELD_LABEL_LENGTH
                    : labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE
                        .FIELD_DETAILS.FIELD_LABEL_LENGTH_SECONDARY
                }
              />
            </>
          );
        },
      });
    });

    inputColumn.push({
      keyField: 'seq',
      name:
        labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE.FIELD_DETAILS
          .COL_MANDATORY,
      sortable: false,
      cell: row => {
        return (
          <Checkbox
            id={`${row.field}`}
            checked={row.isMandatory}
            // defaultChecked={row.isMandatory}
            disabled={row.isDefault}
            onChange={e => handleMandatoryField(row, e)}
          />
        );
      },
      center: 'true',
    });
    setColumns(inputColumn);
  };

  useEffect(() => {
    initializePreRequisiteNameArr();
    initializePreRequisiteNameErrorArr();
    initializeDetailsColumns();
  }, []);

  useEffect(() => {
    getPreRequisiteFieldsApi()
      .then(res => {
        // console.log(res.data, 'sdfksd');
        const PRFieldData = res.data.data;
        PRFieldData.map(field => {
          const labels = field.labelNames;
          const modifiedLabels = insertEmptyObjectsIn(labels);
          return modifiedLabels;
        });
        return PRFieldData;
      })
      .then(fieldData => {
        if (match.params.prerequisiteId) {
          // here in the below api request we need to passs the prerequisiteId,  now it is not passed because done locally
          getPRDetailsApi(match.params.prerequisiteId).then(res => {
            //  console.log(res.data, 'edit response');
            const PRDetails = res.data.data[0].preRequisites[0];
            const PRNames = PRDetails.names;
            const PRFieldDetails = PRDetails.details;
            const modifiedPRNames = insertEmptyObjectsIn(PRNames);

            if (PRFieldDetails.length !== fieldData.length) {
              fieldData.forEach(fieldObj => {
                if (
                  !PRFieldDetails.find(item => item.field === fieldObj.field)
                ) {
                  PRFieldDetails.push(fieldObj);
                }
              });
            }
            PRFieldDetails.map(prerequisiteField => {
              const prerequisiteFieldLabels = prerequisiteField.labelNames;
              const modifiedPrerequisiteFieldLabels = insertEmptyObjectsIn(
                prerequisiteFieldLabels,
              );
              return modifiedPrerequisiteFieldLabels;
            });
            // this setting state is done for edit and create a copy case
            setPreRequisiteFieldDetails(PRFieldDetails);
            // setPreRequisiteFieldDetailsInitialState(
            //   _.cloneDeep(PRFieldDetails),
            // );
            if (location.state && location.state.action === 'edit') {
              setPrerequisteName(modifiedPRNames);
              // setPrerequisteNameInitialState(_.cloneDeep(modifiedPRNames));
            }
          });
        } else {
          // this setting state is done for add case
          setPreRequisiteFieldDetails(fieldData);
          // setPreRequisiteFieldDetailsInitialState(_.cloneDeep(fieldData));
        }
      })
      .catch(err => {
        if (err) {
          const errMesage = handleApiError(err);
          setIsErrorMessage(true);
          setErrorMessage(errMesage);
        }
      });
  }, []);

  useEffect(() => {
    if (preRequisiteFieldDetails.length > 0) {
      setIsLoaded(true);

      if (primaryPRFieldsError.length === 0 && lang.length > 0) {
        const initialPRFieldsError = [...primaryPRFieldsError];

        preRequisiteFieldDetails.forEach(PRFieldDetails => {
          const fieldErrorRow = insertEmptyErrorObjectsIn([]);
          const fieldErrorObj = {
            seq: PRFieldDetails.seq,
            error: fieldErrorRow,

            // include langCode if required here i.e. langCode:primaryLanguage
          };
          initialPRFieldsError.push(fieldErrorObj);
          // console.log(primaryPRFieldsError, 'error object');
          setPrimaryPRFieldsError(initialPRFieldsError);
        });
      }
    }
  }, [preRequisiteFieldDetails]);

  useEffect(() => {
    if (isLoaded) {
      initializeDetailsColumns();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const handlePrerequsiteNameChange = (langCode, e) => {
    e.preventDefault();
    setIsAnyDataModified(true);
    const tempPRNameError = [...primaryNameError];
    tempPRNameError.find(item => item.languageCode === langCode).errorText = '';
    // setPrimaryNameError(false);
    setPrimaryNameError(tempPRNameError);

    if (!e.target.value) {
      tempPRNameError.find(item => item.languageCode === langCode).errorText =
        validationMessage.GLOBAL.MANDATORY_FIELD;
      setPrimaryNameError(tempPRNameError);
    }

    if (e.target.value) {
      if (
        !validateNameWithRegex(
          e.target.value,
          labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE
            .PREREQUISITE_NAME_REGEX,
        ) &&
        langCode === primaryLanguage
      ) {
        tempPRNameError.find(item => item.languageCode === langCode).errorText =
          validationMessage.GLOBAL.ERR_TEXTFIELD_INPUT;
        setPrimaryNameError(tempPRNameError);
      }
      if (
        !validateCharacterLength(
          e.target.value,
          langCode === primaryLanguage
            ? labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE
                .PREREQUISITE_NAME_LENGTH
            : labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE
                .PREREQUISITE_NAME_LENGTH_SECONDARY,
        )
      ) {
        tempPRNameError.find(
          item => item.languageCode === langCode,
        ).errorText = `${validationMessage.GLOBAL.ERR_EXCEEDED_MAX_LENGTH}(45 characters)`;
        setPrimaryNameError(tempPRNameError);
      }
    }

    const names = [...prerequisiteName];

    names.find(item => item.languageCode === langCode).name = e.target.value;
    setPrerequisteName(names);
  };
  // console.log('error state', primaryPRFieldsError);
  const handlePrerequisiteLabelChange = (fieldRow, langCode, e) => {
    e.preventDefault();

    setIsAnyDataModified(true);
    // making error state empty, on onChange
    const tempErrorState = [...primaryPRFieldsError];
    tempErrorState
      .find(item => item.seq === fieldRow.seq)
      .error.find(item => item.languageCode === langCode).errorText = '';
    setPrimaryPRFieldsError(tempErrorState);

    if (!e.target.value) {
      tempErrorState
        .find(item => item.seq === fieldRow.seq)
        .error.find(item => item.languageCode === langCode).errorText =
        validationMessage.GLOBAL.MANDATORY_FIELD;
      setPrimaryPRFieldsError(tempErrorState);
    }

    if (e.target.value) {
      if (
        !validateNameWithRegex(
          e.target.value,
          labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE.FIELD_DETAILS
            .FIELD_LABEL_REGEX,
        ) &&
        langCode === primaryLanguage
      ) {
        tempErrorState
          .find(item => item.seq === fieldRow.seq)
          .error.find(item => item.languageCode === langCode).errorText =
          validationMessage.GLOBAL.ERR_TEXTFIELD_INPUT;
        setPrimaryPRFieldsError(tempErrorState);
      }
      if (
        !validateCharacterLength(
          e.target.value,
          langCode === primaryLanguage
            ? labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE.FIELD_DETAILS
                .FIELD_LABEL_LENGTH
            : labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE.FIELD_DETAILS
                .FIELD_LABEL_LENGTH_SECONDARY,
        )
      ) {
        tempErrorState
          .find(item => item.seq === fieldRow.seq)
          .error.find(
            item => item.languageCode === langCode,
          ).errorText = `${validationMessage.GLOBAL.ERR_EXCEEDED_MAX_LENGTH}(max 45 characters)`;
        setPrimaryPRFieldsError(tempErrorState);
      }
    }

    const detArr = [...preRequisiteFieldDetails];

    detArr.map(detail => {
      if (detail.field === fieldRow.field) {
        const labelValue = e.target.value;
        const modifiedDetailItem = detail;
        modifiedDetailItem.labelNames.find(
          item => item.languageCode === langCode,
        ).name = labelValue;
        return modifiedDetailItem;
      }
      return detail;
    });

    setPreRequisiteFieldDetails(detArr);
  };

  const handleMandatoryField = (fieldRow, e) => {
    setIsAnyDataModified(true);
    const isChecked = e.target.checked;
    const detailArr = [...preRequisiteFieldDetails];
    detailArr.map(detail => {
      if (detail.field === fieldRow.field) {
        const modifiedDetailItem = detail;
        modifiedDetailItem.isMandatory = isChecked;
        return modifiedDetailItem;
      }
      return detail;
    });
    setPreRequisiteFieldDetails(detailArr);
  };

  const handleCancel = () => {
    // set State to initial state
    // console.log(
    //   preRequisiteFieldDetails,
    //   preRequisiteFieldDetailsInitialState,
    //   'field states',
    // );
    // console.log(prerequisiteName, prerequsiteNameInitialState, 'name states');

    // const isChangesDone =
    //   !_.isEqual(
    //     preRequisiteFieldDetails,
    //     preRequisiteFieldDetailsInitialState,
    //   ) || !_.isEqual(prerequisiteName, prerequsiteNameInitialState);

    if (!isCancel && isAnyDataModified) {
      setIsCancel(true);
      return;
    }
    // setPrerequisteName(prerequsiteNameInitialState);
    // setPreRequisiteFieldDetails(preRequisiteFieldDetailsInitialState);
    // setIsCancel(false);
    // const modifiedPrerequisiteName = [...prerequisiteName];
    // modifiedPrerequisiteName.map(prereqName => {
    //   const modifiedPrerequisite = prereqName;
    //   modifiedPrerequisite.name = '';
    //   return modifiedPrerequisiteName;
    // });
    // setPrerequisteName(modifiedPrerequisiteName);
    // const modifiedPrerequisiteFieldDetails = [...preRequisiteFieldDetails];
    // modifiedPrerequisiteFieldDetails.map(fieldDetails => {
    //   const modifiedFieldDetails = fieldDetails;
    //   console.log(modifiedFieldDetails, 'sdffffffffffffffffffffffff');
    //   modifiedFieldDetails.labelNames.map(label => {
    //     const modifiedLabel = label;
    //     modifiedLabel.name = '';
    //     return modifiedLabel;
    //   });
    //   modifiedFieldDetails.isMandatory =
    //     modifiedFieldDetails.field === 'Satisfied?';

    //   console.log(modifiedFieldDetails, 'afret');
    //   return modifiedFieldDetails;
    // });
    // setPreRequisiteFieldDetails(modifiedPrerequisiteFieldDetails);

    history.push(routePaths.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE);
  };
  // console.log(preRequisiteFieldDetails, 'state object');
  // const handleSaveAndClose = e => {
  //   e.preventDefault();
  // };

  const handleSubmit = e => {
    e.preventDefault();
    const { prerequisiteId } = match.params;
    const action = location.state ? location.state.action : '';

    const reqObj = {
      isPublish: true,
      names: prerequisiteName,
      details: preRequisiteFieldDetails,
    };

    const isPrimaryLabelEmpty =
      validatePrimaryPRName() && validatePrimaryPRFields();
    if (validatePrimaryPRName()) return;
    if (validatePrimaryPRFields()) return;
    // if (isPrimaryLabelEmpty) return;

    if (
      primaryNameError.some(
        item => item.errorText !== '' && item.languageCode === primaryLanguage,
      )
    ) {
      return;
    }

    if (
      primaryPRFieldsError.some(PRFieldError => {
        if (
          PRFieldError.error.some(
            item =>
              item.errorText !== '' &&
              item.errorText !==
                validationMessage.PREREQUISITE_LIST.DUPLICATE_FIELD_LABEL &&
              item.languageCode === primaryLanguage,
          )
        ) {
          return true;
        }
        return false;
      })
    ) {
      return;
    }

    let isSecondaryLabelEmpty = false;
    if (!isPrimaryLabelEmpty) {
      isSecondaryLabelEmpty =
        reqObj.names.some(prName => {
          if (prName.name === '' && prName.languageCode !== primaryLanguage) {
            setIsAutoPopulatePopupOpen(true);
            return true;
          }
          return false;
        }) ||
        reqObj.details.some(field => {
          return field.labelNames.some(labelName => {
            if (
              labelName.name === '' &&
              labelName.languageCode !== primaryLanguage
            ) {
              setIsAutoPopulatePopupOpen(true);

              return true;
            }
            return false;
          });
        });
    }

    if (isPrimaryLabelEmpty || isSecondaryLabelEmpty) return;

    const checkArr = [];
    preRequisiteFieldDetails.forEach(item => {
      item.labelNames.forEach(label => {
        const langLabelObject = {
          fieldSeq: item.seq,
          name: label.name,
          languageCode: label.languageCode,
        };
        checkArr.push(langLabelObject);
      });
    });

    const duplicateItems = checkArr
      .map(a => {
        return a.languageCode + a.name.trim().toLowerCase();
      })
      .map((a, i, final) => {
        return final.indexOf(a) !== i && i;
      })
      .filter(obj => checkArr[obj])
      .map(a => {
        return checkArr[a];
      });

    const tempErrorState = [...primaryPRFieldsError];
    tempErrorState.map(field => {
      field.error.map(item => {
        const modifiedItem = item;
        if (
          modifiedItem.errorText ===
          validationMessage.PREREQUISITE_LIST.DUPLICATE_FIELD_LABEL
        ) {
          modifiedItem.errorText = '';
        }
        return modifiedItem;
      });
      return field;
    });

    duplicateItems.forEach(element => {
      // const tempErrorState = [...primaryPRFieldsError];
      tempErrorState
        .find(item => item.seq === element.fieldSeq)
        .error.find(
          item => item.languageCode === element.languageCode,
        ).errorText = validationMessage.PREREQUISITE_LIST.DUPLICATE_FIELD_LABEL;
      setPrimaryPRFieldsError(tempErrorState);
    });

    const tempPrerequisiteFields = _.map(
      preRequisiteFieldDetails,
      _.partialRight(_.pick, ['labelNames']),
    );

    const checkArray = [];
    tempPrerequisiteFields.forEach(item => {
      item.labelNames.forEach(label => {
        const concatLabelLang = label.name.toLowerCase() + label.languageCode;

        checkArray.push(concatLabelLang);
      });
    });

    const isNotUnique = hasDuplicates(checkArray);
    if (isNotUnique) {
      setIsErrorMessage(true);
      setErrorMessage(
        validationMessage.PREREQUISITE_LIST.LABEL_SHOULD_BE_UNIQUE,
      );
      return;
    }

    if (primaryNameError.some(item => item.errorText !== '')) {
      return;
    }

    if (
      primaryPRFieldsError.some(PRFieldError => {
        if (PRFieldError.error.some(item => item.errorText !== '')) {
          return true;
        }
        return false;
      })
    ) {
      return;
    }

    if (prerequisiteId && action === 'edit') {
      editPRApi(prerequisiteId, reqObj)
        .then(res => {
          if (res.data.success) {
            // history.push(
            //   routePaths.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE,
            // );
            setIsSuccess(true);
            setSuccessMessage(
              validationMessage.PREREQUISITE_LIST.EDIT_PREREQUISITE_SUCCESS,
            );
          } else {
            // need to do proper error handling change error message
            setIsErrorMessage(true);
            setErrorMessage(res.data.message);
          }
        })
        .catch(err => {
          if (err) {
            if (err.response.data.errorCode === 'errDuplicateName') {
              setIsErrorMessage(true);
              setErrorMessage(
                validationMessage.PREREQUISITE_LIST.DUPLICATE_NAME,
              );
            } else {
              const errMesage = handleApiError(err);
              setIsErrorMessage(true);
              setErrorMessage(errMesage);
            }
          }
        });
    } else {
      addNewPRApi(reqObj)
        .then(res => {
          if (res.data.success) {
            setIsSuccess(true);
            setSuccessMessage(
              validationMessage.PREREQUISITE_LIST.ADD_PREREQUISITE_SUCCESS,
            );
          } else {
            // need to do proper error handling change error message
            setIsErrorMessage(true);
            setErrorMessage(res.data.message);
          }
        })
        .catch(err => {
          if (err) {
            if (err.response.data.errorCode === 'errDuplicateName') {
              setIsErrorMessage(true);
              setErrorMessage(
                validationMessage.PREREQUISITE_LIST.DUPLICATE_NAME,
              );
            } else {
              const errMesage = handleApiError(err);
              setIsErrorMessage(true);
              setErrorMessage(errMesage);
            }
          }
        });
    }
  };

  const handleSuccessAlert = () => {
    history.push(routePaths.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE);
  };

  const handleAlertOKButtonClick = () => {
    const modifiedNameArr = [...prerequisiteName];
    const primaryName = modifiedNameArr.find(
      item => item.languageCode === primaryLanguage,
    ).name;

    modifiedNameArr.map(prName => {
      const modifiedPrName = prName;
      if (
        modifiedPrName.name === '' &&
        modifiedPrName.languageCode !== primaryLanguage
      ) {
        modifiedPrName.name = primaryName;
        /** for clearing out the error state while populating the value for secondary labels */
        const tempPRNameError = [...primaryNameError];
        tempPRNameError.find(
          item => item.languageCode === modifiedPrName.languageCode,
        ).errorText = '';
        // setPrimaryNameError(false);
        setPrimaryNameError(tempPRNameError);
        /** */
        return modifiedPrName;
      }
      return modifiedPrName;
    });

    setPrerequisteName(modifiedNameArr);

    const modifiedFieldDetails = [...preRequisiteFieldDetails];

    modifiedFieldDetails.forEach(field => {
      const primaryFieldLabelName = field.labelNames.find(
        item => item.languageCode === primaryLanguage,
      ).name;

      field.labelNames.map(label => {
        const modifiedLabel = label;
        if (
          modifiedLabel.name === '' &&
          modifiedLabel.languageCode !== primaryLanguage
        ) {
          modifiedLabel.name = primaryFieldLabelName;
          /** for clearing out the error state while populating the value for secondary labels */
          const tempErrorState = [...primaryPRFieldsError];
          tempErrorState
            .find(item => item.seq === field.seq)
            .error.find(
              item => item.languageCode === modifiedLabel.languageCode,
            ).errorText = '';
          setPrimaryPRFieldsError(tempErrorState);
          /** */
          return modifiedLabel;
        }
        return modifiedLabel;
      });
    });

    setPreRequisiteFieldDetails(modifiedFieldDetails);
    setIsAutoPopulatePopupOpen(false);
  };

  return (
    <>
      <div className="add-update-prerequisites">
        <Card>
          <CardHeader
            title={labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE.TITLE}
          />
          <div className="prerequisite-name-fields">
            {prerequisiteName.length > 0 &&
              lang.map(locale => {
                return (
                  <TextFieldComponent
                    key={locale.languageCode}
                    id={`prerequisite-name-${locale.languageCode}`}
                    name={`prerequisite-name-${locale.languageCode}`}
                    type="text"
                    label={`${labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE.PREREQUISITE_NAME_LABEL} (${locale.languageName})`}
                    className="prerequisite-name"
                    value={
                      prerequisiteName.find(
                        item => item.languageCode === locale.languageCode,
                      ).name
                    }
                    onChange={e =>
                      handlePrerequsiteNameChange(locale.languageCode, e)
                    }
                    error={
                      !!(primaryNameError.length > 0
                        ? primaryNameError.find(
                            item => item.languageCode === locale.languageCode,
                          ).errorText
                        : false)
                    }
                    helperText={
                      (primaryNameError.length > 0
                      ? primaryNameError.find(
                          item => item.languageCode === locale.languageCode,
                        ).errorText
                      : false)
                        ? primaryNameError.find(
                            item => item.languageCode === locale.languageCode,
                          ).errorText
                        : ''
                    }
                    autoFocus={locale.languageCode === primaryLanguage}
                    maxLength={
                      locale.languageCode === primaryLanguage
                        ? labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE
                            .PREREQUISITE_NAME_LENGTH
                        : labelText.PREREQUISITE.ADD_UPDATE_PREREQUISITE
                            .PREREQUISITE_NAME_LENGTH_SECONDARY
                    }
                  />
                );
              })}
          </div>

          <div className="add-update-prerequisite-table">
            <CardListTable
              data={_.cloneDeep(preRequisiteFieldDetails)}
              columns={columns}
              pending={!isLoaded}
              defaultSortField="seq"
            />
          </div>
        </Card>
        <div className="add-update-prerequisite-buttons">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            {labelText.GLOBAL.BUTTON_CANCEL}
          </button>

          {/* we have commented this for now but will include this in futher phase when we do implementation for this */}
          {/* <button
            type="button"
            className="btn-save-close"
            onClick={handleSaveAndClose}
          >
            {labelText.GLOBAL.BUTTON_SAVE_AND_CLOSE}
          </button> */}
          <button
            type="button"
            className="btn-save-submit"
            onClick={handleSubmit}
          >
            {labelText.GLOBAL.BUTTON_SAVE_AND_SUMIT}
          </button>
        </div>
        {/* auto-populate-language Popup */}
        <InformationAlert
          alertMessage={validationMessage.GLOBAL.AUTO_POPULATE_FIELDS}
          primaryButtonText="OK"
          open={isAutoPopulatePopupOpen}
          setClose={() => setIsAutoPopulatePopupOpen(!isAutoPopulatePopupOpen)}
          primaryButtonOnClick={() => handleAlertOKButtonClick()}
        />
        {/* for cancel check */}
        <InformationAlert
          alertMessage={validationMessage.GLOBAL.ERR_CHANGES_LOST}
          primaryButtonText="Yes"
          secondaryButtonText="No"
          open={isCancel}
          setClose={() => setIsCancel(!isCancel)}
          primaryButtonOnClick={() => handleCancel()}
        />

        {/* error message */}
        <ErrorAlert
          alertMessage={errorMessage}
          primaryButtonText="OK"
          open={isErrorMessage}
          setClose={() => setIsErrorMessage(!isErrorMessage)}
          primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
        />

        <SuccessAlert
          alertMessage={successMessage}
          primaryButtonText="OK"
          open={isSuccess}
          setClose={() => {
            setIsSuccess(!isSuccess);
            handleSuccessAlert();
          }}
          primaryButtonOnClick={() => handleSuccessAlert()}
        />
      </div>
    </>
  );
};

AddUpdatePreRequisites.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  match: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }),
  location: PropTypes.shape({
    state: PropTypes.instanceOf(Object),
  }),
  getPreRequisiteFieldsApi: PropTypes.func.isRequired,
  getPRDetailsApi: PropTypes.func.isRequired,
  // userPropertyDetail: PropTypes.instanceOf(Object).isRequired,
  addNewPRApi: PropTypes.func.isRequired,
  editPRApi: PropTypes.func.isRequired,
  lang: PropTypes.instanceOf(Array).isRequired,
  primaryLanguage: PropTypes.string.isRequired,
};

AddUpdatePreRequisites.defaultProps = {
  history: {
    push: () => {},
  },
  match: {
    params: {},
  },
  location: {
    state: {},
  },
};

const mapStateToProps = state => ({
  userPropertyDetail: state.propertyUserDetail,
  lang: state.common.userLanguages,
  primaryLanguage: state.common.primaryLanguage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPreRequisiteFieldsApi: getPRFieldsAPIAction,
      getPRDetailsApi: getPRDetailsAPIAction,
      addNewPRApi: addNewPRApiAction,
      editPRApi: editPRApiAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddUpdatePreRequisites);
