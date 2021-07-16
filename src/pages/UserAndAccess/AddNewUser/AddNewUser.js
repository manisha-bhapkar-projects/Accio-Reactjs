import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
// import { Card } from 'react-bootstrap';
import './AddNewUser.scss';
import { connect } from 'react-redux';
import DropdownComponent from '../../../components/Dropdown/DropdownComponent';
import TextFieldComponent from '../../../components/TextFieldComponent/TextFieldComponent';
import labelText from '../../../utils/Locales/labels';
import {
  getUserAccessSteps,
  getUserTypeListForAddUpdate,
  getUserIdFromState,
} from '../selector';
import {
  setWizardStepsUserAccess,
  getUserTypeListAPIAction,
  getUserDataAPIAction,
  removeAccessOnUserTypeChangeApiAction,
  getAssignedAccessAPIAction,
} from '../../../actions/userAndAccessAction';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import { getErrorMessage, scrollToTop } from '../../../utils/utils';
import {
  validateNameWithRegex,
  validateEmail,
} from '../../../utils/validation';
// import DropdownMultiSelect from '../../../components/Dropdown/DropdownMultiSelect';
import displayMessages from '../../../utils/Locales/messages';

function AddNewUser({
  stepData,
  changeStepData,
  userTypeList,
  getUserTypeListAPI,
  isEditUserReq,
  userId,
  getUserDataAPI,
  removeAccessOnUserTypeChangeApi,
  getAssignedAccessAPI,
}) {
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [confirmUserTypeChange, setConfirmUserTypeChange] = React.useState(
    false,
  );
  const [userTypeChangeKey, setUserTypeChangeKey] = React.useState('');

  const approvedDropDownData = [
    {
      id: 1,
      value: 'Yes',
    },
    { id: 2, value: 'No' },
  ];

  useEffect(() => {
    scrollToTop();
    getUserTypeListAPI();

    // first seting is modified false to keep a track if any value is changed in the component
    const tempStepData = [...stepData];
    tempStepData[0].isAnyValueModified = false;
    changeStepData(tempStepData);

    // return () => {
    //   // react component unmount
    //   const tempStepData = [...stepData];
    //   tempStepData[0].isAnyValueModified = false;
    //   changeStepData(tempStepData);
    // };
  }, []);

  useEffect(() => {
    if (userId && userTypeList.length > 0) {
      if (isEditUserReq) {
        getAssignedAccessAPI(userId); // call this with user id

        // console.log(userId, 'sdfsdfsd');
        getUserDataAPI(userId)
          .then(res => {
            if (res.data.success) {
              const userDataResponse = res.data.data[0];
              // set the data to global storage
              const tempStepData = [...stepData];
              tempStepData[0].userData.firstName = userDataResponse.firstName;
              tempStepData[0].userData.lastName = userDataResponse.lastName;
              tempStepData[0].userData.userType = userTypeList.find(
                item => item.value === userDataResponse.userType,
              );
              tempStepData[0].userData.email = userDataResponse.email;
              tempStepData[0].userData.approved =
                userDataResponse.isApproved === true
                  ? {
                      id: 1,
                      value: 'Yes',
                    }
                  : {
                      id: 2,
                      value: 'No',
                    };
              tempStepData[0].userData.active =
                userDataResponse.isActive === true
                  ? {
                      id: 1,
                      value: 'Yes',
                    }
                  : {
                      id: 2,
                      value: 'No',
                    };

              changeStepData(tempStepData);
            }
          })
          .catch(err => {
            if (err) {
              setErrorMessage(`${getErrorMessage(err)}`);
              setIsErrorMessage(true);
            }
          });
      }
    }
  }, [userId, userTypeList]);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const handleTextChange = e => {
    e.preventDefault();
    const tempStepData = [...stepData];
    tempStepData[0].isAnyValueModified = true;
    const targetElement = e.target.name;
    if (targetElement === 'firstName') {
      tempStepData[0].userData.firstNameError = '';

      if (!e.target.value) {
        tempStepData[0].isError = true;
        tempStepData[0].userData.firstNameError =
          displayMessages.GLOBAL.MANDATORY_FIELD;
      }
      if (e.target.value) {
        if (
          !validateNameWithRegex(
            e.target.value,
            labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.FIRST_NAME_REGEX,
          )
        ) {
          tempStepData[0].isError = true;
          tempStepData[0].userData.firstNameError =
            displayMessages.GLOBAL.ERR_TEXTFIELD_INPUT;
        }
      }

      tempStepData[0].userData.firstName = e.target.value;
    }
    if (targetElement === 'lastName') {
      tempStepData[0].userData.lastNameError = '';

      if (!e.target.value) {
        tempStepData[0].isError = true;
        tempStepData[0].userData.lastNameError =
          displayMessages.GLOBAL.MANDATORY_FIELD;
      }
      if (e.target.value) {
        if (
          !validateNameWithRegex(
            e.target.value,
            labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.LAST_NAME_REGEX,
          )
        ) {
          tempStepData[0].isError = true;
          tempStepData[0].userData.lastNameError =
            displayMessages.GLOBAL.ERR_TEXTFIELD_INPUT;
        }
      }

      tempStepData[0].userData.lastName = e.target.value;
    }
    if (targetElement === 'email') {
      tempStepData[0].userData.emailError = '';

      if (!e.target.value) {
        tempStepData[0].isError = true;
        tempStepData[0].userData.emailError =
          displayMessages.GLOBAL.MANDATORY_FIELD;
      }
      if (e.target.value) {
        if (!validateEmail(e.target.value)) {
          tempStepData[0].isError = true;
          tempStepData[0].userData.emailError =
            displayMessages.GLOBAL.ERR_EMAIL_INPUT;
        }
      }
      tempStepData[0].userData.email = e.target.value.toLowerCase();
    }

    changeStepData(tempStepData);
  };
  // console.log(user, 'state on chage');
  const handleApprovalChange = id => {
    const tempStepData = [...stepData];
    tempStepData[0].isAnyValueModified = true;
    tempStepData[0].userData.approvedError = '';
    const seletedVal = approvedDropDownData.find(item => item.id === id);
    tempStepData[0].userData.approved = seletedVal;
    changeStepData(tempStepData);
  };
  const handleActiveChange = id => {
    const tempStepData = [...stepData];
    tempStepData[0].isAnyValueModified = true;
    tempStepData[0].userData.activeError = '';
    const seletedVal = approvedDropDownData.find(item => item.id === id);
    tempStepData[0].userData.active = seletedVal;
    changeStepData(tempStepData);
  };
  const handleUserTypeChange = id => {
    const tempStepData = [...stepData];
    tempStepData[0].isAnyValueModified = true;
    tempStepData[0].userData.userTypeError = '';

    if (
      userId &&
      !confirmUserTypeChange &&
      tempStepData[0].userData.userType.id !== id &&
      tempStepData[1].assignedAccess.length > 0
    ) {
      setConfirmUserTypeChange(true);
      setUserTypeChangeKey(id);
      return;
    }

    if (userId && confirmUserTypeChange) {
      removeAccessOnUserTypeChangeApi(userId)
        .then(res => {
          if (res.data.success) {
            const seletedVal = userTypeList.find(item => item.id === id);
            tempStepData[0].userData.userType = seletedVal;

            tempStepData[1].isSaved = false;
            tempStepData[1].isError = false;

            tempStepData[2].isSaved = false;
            tempStepData[2].isAllCustomerBrandAssigned = false;
            tempStepData[2].isError = false;

            tempStepData[3].isSaved = false;
            tempStepData[3].isError = false;

            getAssignedAccessAPI(userId);
            changeStepData(tempStepData);
            setConfirmUserTypeChange(false);
          }
        })
        .catch(err => {
          if (err) {
            setErrorMessage(getErrorMessage(err));
            setIsErrorMessage(true);
          }
        });
    } else {
      const seletedVal = userTypeList.find(item => item.id === id);
      tempStepData[0].userData.userType = seletedVal;
      changeStepData(tempStepData);
      setConfirmUserTypeChange(false);
    }
  };

  return (
    <div className="add-new-user">
      <TextFieldComponent
        className="new-user-text-fields"
        id="firstName"
        name="firstName"
        type="text"
        label={
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.FIRST_NAME_LABEL
        }
        maxLength={
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.FIRST_NAME_LENGTH
        }
        value={stepData[0].userData.firstName}
        onChange={handleTextChange}
        error={stepData[0].userData.firstNameError.length > 0}
        helperText={
          stepData[0].userData.firstNameError.length > 0
            ? stepData[0].userData.firstNameError
            : ''
        }
        autoFocus
      />
      <TextFieldComponent
        className="new-user-text-fields"
        id="lastName"
        name="lastName"
        type="text"
        maxLength={
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.LAST_NAME_LENGTH
        }
        label={labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.LAST_NAME_LABEL}
        value={stepData[0].userData.lastName}
        onChange={handleTextChange}
        error={stepData[0].userData.lastNameError.length > 0}
        helperText={
          stepData[0].userData.lastNameError.length > 0
            ? stepData[0].userData.lastNameError
            : ''
        }
      />
      <TextFieldComponent
        id="email"
        className="new-user-text-fields"
        inputClassName="email-input-text"
        name="email"
        type="text"
        maxLength={
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.EMAIL_LENGTH
        }
        label={labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.EMAIL_LABEL}
        value={stepData[0].userData.email}
        onChange={handleTextChange}
        error={stepData[0].userData.emailError.length > 0}
        helperText={
          stepData[0].userData.emailError.length > 0
            ? stepData[0].userData.emailError
            : ''
        }
      />
      <div className="new-user-text-fields">
        <DropdownComponent
          id="userType"
          className="new-user-dropdown-fields"
          label={
            labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.USER_TYPE_LABEL
          }
          data={userTypeList}
          value={
            stepData[0].userData.userType
              ? stepData[0].userData.userType.value
              : ''
          }
          onSelect={_eventKey => handleUserTypeChange(_eventKey)}
          error={
            stepData[0].userData.userTypeError.length > 0
              ? stepData[0].userData.userTypeError
              : ''
          }
        />
      </div>

      <div className="new-user-text-fields">
        <DropdownComponent
          id="approved"
          className="new-user-dropdown-fields"
          label={
            labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.APPROVED_LABEL
          }
          data={approvedDropDownData}
          value={stepData[0].userData.approved.value}
          onSelect={_eventKey => handleApprovalChange(Number(_eventKey))}
          error={
            stepData[0].userData.approvedError.length > 0
              ? stepData[0].userData.approvedError
              : ''
          }
        />
      </div>
      <div className="new-user-text-fields">
        <DropdownComponent
          id="active"
          className="new-user-dropdown-fields"
          label={labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.ACTIVE_LABEL}
          data={approvedDropDownData}
          value={stepData[0].userData.active.value}
          onSelect={_eventKey => handleActiveChange(Number(_eventKey))}
          error={
            stepData[0].userData.activeError.length > 0
              ? stepData[0].userData.activeError
              : ''
          }
        />
      </div>
      {/* <DropdownMultiSelect
        className="add-dept-row-fields"
        labelName="Role"
        data={approvedDr}
        multiSelectDesc="Select Roles"
        value={selectedRole}
        onChange={selectedItems => {
          setSelectedRole(selectedItems);
          // console.log(selectedItems, action);
        }}
        // error={row.roleError ? row.roleError : ''}
      /> */}

      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />

      <InformationAlert
        alertMessage={
          displayMessages.USER_AND_ACCESS.USER_ACCESS_SETUP
            .CONFIRM_USER_TYPE_CHANGE
        }
        primaryButtonText="Yes"
        secondaryButtonText="No"
        open={confirmUserTypeChange}
        setClose={() => setConfirmUserTypeChange(!confirmUserTypeChange)}
        primaryButtonOnClick={() => handleUserTypeChange(userTypeChangeKey)}
      />
    </div>
  );
}
AddNewUser.propTypes = {
  stepData: PropTypes.instanceOf(Array).isRequired,
  changeStepData: PropTypes.func.isRequired,
  userTypeList: PropTypes.instanceOf(Array).isRequired,
  getUserTypeListAPI: PropTypes.func.isRequired,
  isEditUserReq: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  getUserDataAPI: PropTypes.func,
  removeAccessOnUserTypeChangeApi: PropTypes.func.isRequired,
  getAssignedAccessAPI: PropTypes.func.isRequired,
};

AddNewUser.defaultProps = {
  userId: '',
  getUserDataAPI: () => {},
};

const mapStateToProps = state => ({
  stepData: getUserAccessSteps(state),
  userTypeList: getUserTypeListForAddUpdate(state),
  userId: getUserIdFromState(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeStepData: setWizardStepsUserAccess,
      getUserTypeListAPI: getUserTypeListAPIAction,
      getUserDataAPI: getUserDataAPIAction,
      removeAccessOnUserTypeChangeApi: removeAccessOnUserTypeChangeApiAction,
      getAssignedAccessAPI: getAssignedAccessAPIAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddNewUser);
