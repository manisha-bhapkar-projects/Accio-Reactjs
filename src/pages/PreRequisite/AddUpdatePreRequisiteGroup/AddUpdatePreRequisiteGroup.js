import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './AddUpdatePreRequisiteGroup.scss';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import CardHeader from '../../../components/CardHeader/CardHeader';
import TextFieldComponent from '../../../components/TextFieldComponent/TextFieldComponent';
import LabelWithIcon from '../../../components/LabelWithIcon/LabelWithIcon';
import deleteIcon from '../../../images/delete/delete.png';
import AddPreRequisiteToGroup from '../AddPreRequisiteToGroup/AddPreRequisiteToGroup';
import Popup from '../../../components/Popup/Popup';
import CardListTable from '../../../components/CardListTable/CardListTable';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import labelText from '../../../utils/Locales/labels';
import messages from '../../../utils/Locales/messages';
import routePaths from '../../../utils/constants';

import {
  addPrerequisiteToGroup,
  PRGroupDetailsApiAction,
  addNewPRGroupApiAction,
  editPRGroupApiAction,
} from '../../../actions/prerequisiteGroupListing';
import { getAddedPrerequisite } from '../../../reducers/prerequisiteGroupListReducer';
import { setPrerequisiteList } from '../../../actions/prerequisiteListing';
import { getAllPreRequisiteList } from '../AddPreRequisiteToGroup/selector';
import { getAddedPrerequisiteIds } from './selector';
import { handleApiError } from '../../../utils/utils';
import {
  validateNameWithRegex,
  validateCharacterLength,
} from '../../../utils/validation';

const AddUpdatePreRequisiteGroup = ({
  history,
  selectedPrerequisiteToAdd,
  addPrerequisiteAction,
  PRGroupDetailsApi,
  // userPropertyDetail,
  addedPrerequisiteIds,
  addNewPRGroupApi,
  editPRGroupApi,
  match,
  location,
  lang,
  primaryLanguage,
  // getting all the prerequisite List here as to when we delete a selected/added prerequisite on this screen on popup screen it gets un checked inside listig section
}) => {
  const [prerequisiteGroupName, setPrerequisteGroupName] = React.useState([]);

  // const [
  //   addedPrerequisite,
  //   setAddedPrerequisite,
  // ] = React.useState([]);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [isAutoPopulatePopupOpen, setIsAutoPopulatePopupOpen] = React.useState(
    false,
  );
  const [isCancel, setIsCancel] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [isAnyDataModified, setIsAnyDataModified] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [primaryGroupNameError, setPrimaryGroupNameError] = React.useState([]);
  const [addedPrereqInitialState, setAddedPrereqInitialState] = React.useState(
    [],
  );

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

  const initializePreRequisiteGroupNameArr = () => {
    const nameArr = [];
    lang.forEach(locale => {
      nameArr.push({ name: '', languageCode: locale.languageCode });
    });
    setPrerequisteGroupName(nameArr);
  };

  const initializePreRequisiteGroupNameErrorArr = () => {
    const nameErrorArr = [];
    lang.forEach(locale => {
      nameErrorArr.push({ errorText: '', languageCode: locale.languageCode });
    });
    setPrimaryGroupNameError(nameErrorArr);
  };

  useEffect(() => {
    initializePreRequisiteGroupNameArr();
    initializePreRequisiteGroupNameErrorArr();
    addPrerequisiteAction([]);
    // for validation on cancel
    setAddedPrereqInitialState([]);
  }, []);

  useEffect(() => {
    if (match.params.prerequisiteGroupId) {
      PRGroupDetailsApi(match.params.prerequisiteGroupId)
        .then(res => {
          const PRGroupDetails = res.data.data[0].preRequisiteGroups[0];
          // console.log(PRGroupDetails);
          const PRGroupNames = PRGroupDetails.names;
          const prerequisiteInGroup = PRGroupDetails.preRequisites;
          const modifiedPRGroupNames = insertEmptyObjectsIn(PRGroupNames);

          const modifiedprerequisiteInGroup = [];
          prerequisiteInGroup.forEach(addedPrerequsite => {
            const modifiedAddedPrerequisite = {};
            // modifiedAddedPrerequisite.id = addedPrerequsite.uuid;
            modifiedAddedPrerequisite.id = addedPrerequsite.refId;
            modifiedAddedPrerequisite.prerequisite = addedPrerequsite.names.find(
              item => item.languageCode === primaryLanguage, // considering en as primary languageName always or we need to give here the refrence of primary languageName
            ).name;
            modifiedAddedPrerequisite.isPrerequisiteSelected = true;
            modifiedAddedPrerequisite.isDisabled = true;
            modifiedprerequisiteInGroup.push(modifiedAddedPrerequisite);
            // return modifiedAddedPrerequisite;
          });
          if (location.state && location.state.action === 'edit') {
            setPrerequisteGroupName(modifiedPRGroupNames);
          }

          addPrerequisiteAction(modifiedprerequisiteInGroup);
          setAddedPrereqInitialState(modifiedprerequisiteInGroup);
        })
        .catch(err => {
          // console.log(err.message, 'inside getting details');
          if (err) {
            const errMesage = handleApiError(err);
            setIsErrorMessage(true);
            setErrorMessage(errMesage);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const columns = [
    {
      name: 'Pre-Requisite',
      selector: 'prerequisite',
      sortable: false,
      grow: '11',
    },
    {
      name: '',
      sortable: false,
      cell: rowData => {
        return (
          <button
            type="button"
            className="delete-button"
            onClick={() => handleDeletePrerequisiteFromGroup(rowData)}
          >
            <img
              src={deleteIcon}
              alt="del"
              style={{ height: '21px', width: '16px', marginRight: '15px' }}
            />
          </button>
        );
      },
      grow: '1',
      right: true,
    },
  ];
  // console.log(selectedPrerequisiteToAdd);

  // const validatePrimaryPRGroupName = () => {
  //   const isPrimaryNameEmpty = prerequisiteGroupName.some(names => {
  //     if (names.name === '' && names.languageCode === primaryLanguage) {
  //       setPrimaryGroupNameError(true);
  //       return true;
  //     }
  //     return false;
  //   });
  //   return isPrimaryNameEmpty;
  // };

  const validatePrimaryPRGroupName = () => {
    const isPrimaryNameEmpty = prerequisiteGroupName.some(names => {
      if (names.name === '' && names.languageCode === primaryLanguage) {
        const tempErrorState = [...primaryGroupNameError];
        tempErrorState.find(
          item => item.languageCode === primaryLanguage,
        ).errorText = messages.GLOBAL.MANDATORY_FIELD;
        setPrimaryGroupNameError(tempErrorState);
        return true;
      }
      // if (!validateNameWithRegex(names.name) && names.languageCode === primaryLanguage) {
      //   setPrimaryGroupNameError(messages.GLOBAL.ERR_TEXTFIELD_INPUT);
      //   return true;
      // }
      return false;
    });
    return isPrimaryNameEmpty;
  };

  const handleDeletePrerequisiteFromGroup = rowData => {
    const tempArr = [...selectedPrerequisiteToAdd];
    setIsAnyDataModified(true);
    // const tempAllPR = [...prerequisiteListAll];
    // tempAllPR.find(
    //   item => item.id === rowData.id,
    // ).isPrerequisiteSelected = false;

    // updatePrerequisteListIsSelected(tempAllPR);

    const prerequisiteRemoveIndex = tempArr.findIndex(
      item => item.id === rowData.id,
    );
    tempArr.splice(prerequisiteRemoveIndex, 1);
    addPrerequisiteAction(tempArr);
  };
  const handlePrerequisiteGroupNameChange = (langCode, e) => {
    e.preventDefault();
    setIsAnyDataModified(true);
    const tempErrorState = [...primaryGroupNameError];
    tempErrorState.find(item => item.languageCode === langCode).errorText = '';
    setPrimaryGroupNameError(tempErrorState);

    if (!e.target.value) {
      tempErrorState.find(item => item.languageCode === langCode).errorText =
        messages.GLOBAL.MANDATORY_FIELD;
      setPrimaryGroupNameError(tempErrorState);
    }

    if (e.target.value) {
      if (
        !validateNameWithRegex(
          e.target.value,
          labelText.PREREQUISITE_GROUP.ADD_UPDATE_PREREQUISITE_GROUP
            .GROUP_NAME_REGEX,
        ) &&
        langCode === primaryLanguage
      ) {
        tempErrorState.find(item => item.languageCode === langCode).errorText =
          messages.GLOBAL.ERR_TEXTFIELD_INPUT;
        setPrimaryGroupNameError(tempErrorState);
      }
      if (
        !validateCharacterLength(
          e.target.value,
          langCode === primaryLanguage
            ? labelText.PREREQUISITE_GROUP.ADD_UPDATE_PREREQUISITE_GROUP
                .GROUP_NAME_LENGTH
            : labelText.PREREQUISITE_GROUP.ADD_UPDATE_PREREQUISITE_GROUP
                .GROUP_NAME_LENGTH_SECONDARY,
        )
      ) {
        tempErrorState.find(
          item => item.languageCode === langCode,
        ).errorText = `${messages.GLOBAL.ERR_EXCEEDED_MAX_LENGTH}(max 45 characters)`;
        setPrimaryGroupNameError(tempErrorState);
      }
    }

    const groupNames = [...prerequisiteGroupName];
    groupNames.find(item => item.languageCode === langCode).name =
      e.target.value;
    setPrerequisteGroupName(groupNames);
  };

  const handleAddPrerequisite = e => {
    e.preventDefault();
    setPopupOpen(true);
  };

  const handleCancel = () => {
    const isChangesDone = !_.isEqual(
      selectedPrerequisiteToAdd,
      addedPrereqInitialState,
    );
    if (!isCancel && (isAnyDataModified || isChangesDone)) {
      setIsCancel(true);
      return;
    }
    // set state to initial state
    addPrerequisiteAction([]);
    history.push(
      routePaths.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE_GROUP,
    );
  };

  const handleSaveAndSubmit = e => {
    const { prerequisiteGroupId } = match.params;
    const action = location.state ? location.state.action : '';

    const reqObj = {
      isPublish: true,
      names: prerequisiteGroupName,
      preRequisites: addedPrerequisiteIds,
    };
    e.preventDefault();
    if (validatePrimaryPRGroupName()) return;

    if (
      primaryGroupNameError.some(
        item => item.errorText !== '' && item.languageCode === primaryLanguage,
      )
    ) {
      return;
    }

    let isSecondaryLabelEmpty = false;
    if (!validatePrimaryPRGroupName()) {
      isSecondaryLabelEmpty = reqObj.names.some(prGroupName => {
        if (
          prGroupName.name === '' &&
          prGroupName.languageCode !== primaryLanguage
        ) {
          setIsAutoPopulatePopupOpen(true);

          return true;
        }
        return false;
      });
    }

    if (primaryGroupNameError.some(item => item.errorText !== '')) {
      return;
    }

    // // console.log(reqObj);

    // const isPrimaryLabelEmpty = reqObj.names.some(prGroupName => {
    //   if (
    //     prGroupName.name === '' &&
    //     prGroupName.languageCode === primaryLanguage
    //   ) {
    //     setIsErrorMessage(true);
    //     setErrorMessage(
    //       'Please enter the mandatory  Prerequisite Group Name for primary languageName',
    //     );

    //     return true;
    //   }
    //   return false;
    // });

    if (isSecondaryLabelEmpty) return;
    if (reqObj.preRequisites.length === 0) {
      setIsErrorMessage(true);
      setErrorMessage(
        messages.PREREQUISITE_GROUP_LIST.NO_PRERQUISITE_ADDED_IN_GROUP,
      );
      return;
    }

    if (prerequisiteGroupId && action === 'edit') {
      // console.log(reqObj, 'inside edit');

      editPRGroupApi(prerequisiteGroupId, reqObj)
        .then(res => {
          // console.log(res.data, 'on edit');
          if (res.data.success) {
            // history.push(
            //   routePaths.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE_GROUP,
            // );
            setIsSuccess(true);
            setSuccessMessage(
              messages.PREREQUISITE_GROUP_LIST.EDIT_PREREQUISITE_GROUP_SUCCESS,
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
              setErrorMessage(messages.PREREQUISITE_GROUP_LIST.DUPLICATE_NAME);
            } else {
              const errMesage = handleApiError(err);
              setIsErrorMessage(true);
              setErrorMessage(errMesage);
            }
          }
        });

      // console.log(reqObj, 'requestObj');
    } else {
      addNewPRGroupApi(reqObj)
        .then(res => {
          if (res.data.success) {
            // history.push(
            //   routePaths.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE_GROUP,
            // );
            setIsSuccess(true);
            setSuccessMessage(
              messages.PREREQUISITE_GROUP_LIST.ADD_PREREQUISITE_GROUP_SUCCESS,
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
              setErrorMessage(messages.PREREQUISITE_GROUP_LIST.DUPLICATE_NAME);
            } else {
              const errMesage = handleApiError(err);
              setIsErrorMessage(true);
              setErrorMessage(errMesage);
            }
          }
        });

      // console.log(reqObj, 'requestObj');
    }

    // console.log(prerequisiteGroupName);
  };
  const handleSuccessAlert = () => {
    history.push(
      routePaths.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE_GROUP,
    );
  };

  const handleAlertOKButtonClick = () => {
    const modifiedGroupNameArr = [...prerequisiteGroupName];
    const primaryName = modifiedGroupNameArr.find(
      item => item.languageCode === primaryLanguage,
    ).name;

    modifiedGroupNameArr.map(prName => {
      const modifiedPrName = prName;
      if (
        modifiedPrName.name === '' &&
        modifiedPrName.languageCode !== primaryName
      ) {
        modifiedPrName.name = primaryName;
        /** clearing error state on auto populate */
        const tempErrorState = [...primaryGroupNameError];
        tempErrorState.find(
          item => item.languageCode === modifiedPrName.languageCode,
        ).errorText = '';
        setPrimaryGroupNameError(tempErrorState);
        return modifiedPrName;
      }
      return modifiedPrName;
    });
    // console.log(modifiedGroupNameArr, 'modifiedGroupNameArr');
    setPrerequisteGroupName(modifiedGroupNameArr);

    setIsAutoPopulatePopupOpen(false);
  };
  return (
    <div className="add-update-prerequisite-group">
      <Card>
        <CardHeader
          title={
            labelText.PREREQUISITE_GROUP.ADD_UPDATE_PREREQUISITE_GROUP.TITLE
          }
        />
        <div className="group-name-fields">
          {prerequisiteGroupName.length > 0 &&
            lang.map(locale => {
              return (
                <TextFieldComponent
                  key={locale.languageCode}
                  id={`group-name-${locale.languageCode}`}
                  name={`group-name-${locale.languageCode}`}
                  type="text"
                  label={`${labelText.PREREQUISITE_GROUP.ADD_UPDATE_PREREQUISITE_GROUP.GROUP_NAME_LABEL} (${locale.languageName})`}
                  className="group-name"
                  // defaultValue={prerequisiteGroupName[grpNameIndex].name}
                  value={
                    prerequisiteGroupName.find(
                      item => item.languageCode === locale.languageCode,
                    ).name
                  }
                  onChange={e =>
                    handlePrerequisiteGroupNameChange(locale.languageCode, e)
                  }
                  error={
                    !!primaryGroupNameError.length > 0
                      ? primaryGroupNameError.find(
                          item => item.languageCode === locale.languageCode,
                        ).errorText
                      : false
                  }
                  helperText={
                    (primaryGroupNameError.length > 0
                    ? primaryGroupNameError.find(
                        item => item.languageCode === locale.languageCode,
                      ).errorText
                    : false)
                      ? primaryGroupNameError.find(
                          item => item.languageCode === locale.languageCode,
                        ).errorText
                      : ''
                  }
                  maxLength={
                    locale.languageCode === primaryLanguage
                      ? labelText.PREREQUISITE_GROUP
                          .ADD_UPDATE_PREREQUISITE_GROUP.GROUP_NAME_LENGTH
                      : labelText.PREREQUISITE_GROUP
                          .ADD_UPDATE_PREREQUISITE_GROUP
                          .GROUP_NAME_LENGTH_SECONDARY
                  }
                  autoFocus={locale.languageCode === primaryLanguage}
                />
              );
            })}
        </div>
      </Card>
      <Card>
        <CardHeader
          title={
            labelText.PREREQUISITE_GROUP.ADD_UPDATE_PREREQUISITE_GROUP
              .PREREQUISITE_ADDED
          }
        />
        <div className="added-prerequisite-table">
          <CardListTable
            data={selectedPrerequisiteToAdd}
            columns={columns}
            noTableHead
            noDataString={
              messages.PREREQUISITE_GROUP_LIST
                .PREREQUISITE_GROUP_NO_ADDED_PREREQUISITE
            }
            numOfColumns={columns.length - 1}
            fixedHeader
            fixedHeaderScrollHeight="310px"
          />
        </div>
        <div className="add-prerequisite-label-icon">
          <LabelWithIcon
            label={
              labelText.PREREQUISITE_GROUP.ADD_UPDATE_PREREQUISITE_GROUP
                .ADD_PREREQUISITE_ICON
            }
            handleClick={handleAddPrerequisite}
          />
        </div>
        {popupOpen ? (
          <Popup
            scrollType="body"
            // open={setPopupOpen}
            open={popupOpen}
            setClose={() => setPopupOpen(false)}
          >
            <AddPreRequisiteToGroup setOpen={setPopupOpen} />
          </Popup>
        ) : (
          ''
        )}
      </Card>
      <div className="add-update-prerequisite-group-buttons">
        <button type="button" className="btn-cancel" onClick={handleCancel}>
          {labelText.GLOBAL.BUTTON_CANCEL}
        </button>
        {/* commented for now will be used in future phases */}
        {/* <button type="button" className="btn-save-close">
          {labelText.GLOBAL.BUTTON_SAVE_AND_CLOSE}
        </button> */}
        <button
          type="button"
          className="btn-save-submit"
          onClick={handleSaveAndSubmit}
        >
          {labelText.GLOBAL.BUTTON_SAVE_AND_SUMIT}
        </button>
      </div>
      {/* auto-populate-language Popup */}
      <InformationAlert
        alertMessage={messages.GLOBAL.AUTO_POPULATE_FIELDS}
        primaryButtonText="OK"
        open={isAutoPopulatePopupOpen}
        setClose={() => setIsAutoPopulatePopupOpen(!isAutoPopulatePopupOpen)}
        primaryButtonOnClick={() => handleAlertOKButtonClick()}
      />
      {/* for cancel check */}
      <InformationAlert
        alertMessage={messages.GLOBAL.ERR_CHANGES_LOST}
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
  );
};

const mapStateToProps = state => ({
  selectedPrerequisiteToAdd: getAddedPrerequisite(state),
  userPropertyDetail: state.propertyUserDetail,
  addedPrerequisiteIds: getAddedPrerequisiteIds(state),
  prerequisiteListAll: getAllPreRequisiteList(state),
  lang: state.common.userLanguages,
  primaryLanguage: state.common.primaryLanguage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addPrerequisiteAction: addPrerequisiteToGroup,
      PRGroupDetailsApi: PRGroupDetailsApiAction,
      addNewPRGroupApi: addNewPRGroupApiAction,
      editPRGroupApi: editPRGroupApiAction,
      updatePrerequisteListIsSelected: setPrerequisiteList,
    },
    dispatch,
  );

AddUpdatePreRequisiteGroup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  match: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }),
  location: PropTypes.shape({
    state: PropTypes.instanceOf(Object),
  }),
  selectedPrerequisiteToAdd: PropTypes.instanceOf(Array).isRequired,
  addPrerequisiteAction: PropTypes.func.isRequired,
  PRGroupDetailsApi: PropTypes.func.isRequired,
  // userPropertyDetail: PropTypes.instanceOf(Object).isRequired,
  addedPrerequisiteIds: PropTypes.instanceOf(Array),
  addNewPRGroupApi: PropTypes.func.isRequired,
  editPRGroupApi: PropTypes.func.isRequired,
  lang: PropTypes.instanceOf(Array).isRequired,
  primaryLanguage: PropTypes.string.isRequired,
};

AddUpdatePreRequisiteGroup.defaultProps = {
  history: {
    push: () => {},
  },
  match: {
    params: {},
  },
  location: {
    state: {},
  },
  addedPrerequisiteIds: [],
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddUpdatePreRequisiteGroup);
