import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Card } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CardHeader from '../../../components/CardHeader/CardHeader';
import './UserAccessSetup.scss';
import Wizard from '../../../components/Wizard/Wizard';
import AddNewUser from '../AddNewUser/AddNewUser';
import AssignPropertyAndAccess from '../AssignPropertyAndAccess/AssignPropertyAndAccess';
import AssignCustomerAndBrand from '../AssignCustomerAndBrand/AssignCustomerAndBrand';
import AssignDepartmentAndRoles from '../AssignDepartmentAndRoles/AssignDepartmentAndRoles';
import {
  getUserAccessSteps,
  getUserIdFromState,
  getUserTypeListForAddUpdate,
  getUserAccessTypeList,
  getAssignedAccess,
} from '../selector';
import {
  setWizardStepsUserAccess,
  saveAddUpdateUserStep1APIAction,
  saveAssignPropertyAndAccesStep2APIAction,
  saveAssignCustomerAndBrandStep3APIAction,
  saveAssignDepartmentAndRoleStep4APIAction,
  setUserID,
  resetUserDataAction,
  getUserDataAPIAction,
  getAssignedAccessAPIAction,
  getAssignedDepartmentAPIAction,
  getAssignedCustomerAPIAction,
  checkEmailExistsAPIAction,
} from '../../../actions/userAndAccessAction';
import {
  validateEmail,
  validateNameWithRegex,
  validateCharacterLength,
} from '../../../utils/validation';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import displayMessages from '../../../utils/Locales/messages';
import labelText from '../../../utils/Locales/labels';
import DetailsItem from '../../../components/DetailsItem/DetailsItem';
import { getErrorMessage } from '../../../utils/utils';
import routePath from '../../../utils/constants';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';

function UserAccessSetup({
  userAccessSteps,
  changeSteps,
  saveAddUpdateUserStep1API,
  saveAssignPropertyAndAccesStep2API,
  saveAssignCustomerAndBrandStep3API,
  saveAssignDepartmentAndRoleStep4API,
  getAssignedAccessAPI,
  getAssignedDepartmentAPI,
  getAssignedCustomerAPI,
  userId,
  setUserId,
  match,
  resetUserData,
  getUserDataAPI,
  userTypeList,
  // userAccessTypeList,
  assignedAccess,
  history,
  checkEmailExistsAPI,
}) {
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const userIdFromUserList = match.params.userId;
  const isEditUserReq = !!match.params.userId;
  const [isCancel, setIsCancel] = React.useState(false);
  const isAddRequest = !match.params.userId;
  const [duplicateUserData, setDuplicateUserData] = React.useState({
    firstName: '',
    lastName: '',
    approved: '',
    active: '',
    email: '',
    userType: {},
    firstNameError: '',
    lastNameError: '',
    approvedError: '',
    activeError: '',
    emailError: '',
    userTypeError: '',
  });

  const [buttonState, setButtonState] = React.useState(false);

  useEffect(() => {
    if (userIdFromUserList) {
      // setting the user id to redux store
      setUserId(userIdFromUserList);
    }

    // if (isEditUserReq) {
    //   const tempStep = [...userAccessSteps];
    //   tempStep.map(step => {
    //     const modifiedStep = step;
    //     modifiedStep.isSaved = true;
    //     return modifiedStep;
    //   });
    //   changeSteps(tempStep);
    // }

    return () => {
      // reseting the whole step data when the component is unmounted
      resetUserData();
      // React Component Lifecycle => UnMount
    };
  }, []);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const getApprovedActiveBool = value => {
    if (value.toLowerCase() === 'yes') {
      return true;
    }
    if (value.toLowerCase() === 'no') {
      return false;
    }
    return null;
  };

  const compareCommonDataRow = arr => {
    for (let i = 0; i < arr.length - 1; i += 1) {
      for (let j = i + 1; j < arr.length; j += 1) {
        if (_.isEqual(arr[i], arr[j])) {
          return true;
        }
      }
    }
    return false;
  };

  const checkCustomerAll = () => {
    const tempStepData = [...userAccessSteps];
    // console.log('is it logging');
    let isError = false;
    if (
      tempStepData[2].addCustomerRows.some(item => item.hasAnyValue === true)
    ) {
      const rowsHavingValue = tempStepData[2].addCustomerRows.filter(
        item => item.hasAnyValue === true,
      );

      const dataGroupByCutomer = _.groupBy(rowsHavingValue, 'property.id');
      // console.log(dataGroupByCutomer, 'custsdfs');

      const customerGroupArray = Object.keys(dataGroupByCutomer);

      if (customerGroupArray.length > 0) {
        if (
          customerGroupArray.some(cust => {
            const oneCustGroup = dataGroupByCutomer[cust];
            if (oneCustGroup.length > 1) {
              if (oneCustGroup.some(item => item.customer.id === 'all')) {
                return true;
                // return null;
              }
              return false;
            }
            return false;
          })
        ) {
          isError = true;
          setErrorMessage(
            tempStepData[0].userData.userType.value === 'Tenant'
              ? displayMessages.USER_AND_ACCESS.STEP_3.ERR_UNIQUE_CUSTOMER
              : displayMessages.USER_AND_ACCESS.STEP_3.ERR_OVERRIDING_ACCESS,
          );
          setIsErrorMessage(true);
        }
      }
    }
    return isError;
  };

  const checkIncorrectAssignment = () => {
    const tempStepData = [...userAccessSteps];
    // console.log('is it logging');
    let isError = false;
    if (
      tempStepData[2].addCustomerRows.some(item => item.hasAnyValue === true)
    ) {
      const rowsHavingValue = tempStepData[2].addCustomerRows.filter(
        item => item.hasAnyValue === true,
      );

      const duplicationCheckArray = [];

      const pickupArray = _.map(
        rowsHavingValue,
        _.partialRight(_.pick, ['property', 'customer', 'brand']),
      );
      // console.log(pickupArray, 'pickupArray');

      pickupArray.forEach(rowItem => {
        rowItem.brand.forEach(brandObj => {
          if (brandObj.id !== 'all') {
            const checkArrayObj = {
              property: rowItem.property,
              customer: rowItem.customer,
              brand: brandObj,
            };
            duplicationCheckArray.push(checkArrayObj);
          }
        });
      });

      if (compareCommonDataRow(duplicationCheckArray)) {
        isError = true;
        setErrorMessage(
          displayMessages.USER_AND_ACCESS.STEP_3.ERR_OVERRIDING_ACCESS,
        );
        setIsErrorMessage(true);
      }
    }
    return isError;
  };

  const initialAddAccessState = [
    {
      id: 1,
      company: {},
      llc: {},
      property: {},
      llcDropDownData: [],
      propertyDropDownData: [],
      fullAccess: false,
      caseAccess: false,
      caseManipulateAccess: false,
      hasAnyValue: false,
      companyError: '',
      llcError: '',
      propertyError: '',
      accessError: '',
      isPropertyDisabled: true,
      isLLCDisabled: true,
    },
    {
      id: 2,
      company: {},
      llc: {},
      property: {},
      llcDropDownData: [],
      propertyDropDownData: [],
      fullAccess: false,
      caseAccess: false,
      caseManipulateAccess: false,
      hasAnyValue: false,
      companyError: '',
      llcError: '',
      propertyError: '',
      accessError: '',
      isPropertyDisabled: true,
      isLLCDisabled: true,
    },
    {
      id: 3,
      company: {},
      llc: {},
      property: {},
      llcDropDownData: [],
      propertyDropDownData: [],
      fullAccess: false,
      caseAccess: false,
      caseManipulateAccess: false,
      hasAnyValue: false,
      companyError: '',
      llcError: '',
      propertyError: '',
      accessError: '',
      isPropertyDisabled: true,
      isLLCDisabled: true,
    },
    {
      id: 4,
      company: {},
      llc: {},
      property: {},
      llcDropDownData: [],
      propertyDropDownData: [],
      fullAccess: false,
      caseAccess: false,
      caseManipulateAccess: false,
      hasAnyValue: false,
      companyError: '',
      llcError: '',
      propertyError: '',
      accessError: '',
      isPropertyDisabled: true,
      isLLCDisabled: true,
    },
  ];

  const initialAddCustomerState = [
    {
      id: 1,
      property: {},
      customer: { id: 'all', value: 'All' },
      brandType: { id: 'all', value: 'All' },
      brand: [{ id: 'all', value: 'All', label: 'All' }],
      brandListOnBrandType: [],
      customerDropDownData: [],
      hasAnyValue: false,
      customerError: '',
      propertyError: '',
      brandError: '',
      isDisabled: true,
      isBrandDisabled: true,
      isCustomerDisabled: true,
    },
    // {
    //   id: 2,
    //    property: {},
    // customer: { id: 'all', value: 'All' },
    // brandType: { id: 'all', value: 'All' },
    // brand: [{ id: 'all', value: 'All', label: 'All' }],
    // brandListOnBrandType: [],
    // customerDropDownData: [],
    // hasAnyValue: false,
    // customerError: '',
    // propertyError: '',
    // brandError: '',
    // isDisabled: true,
    // },
    // {
    //   id: 3,
    //   property: {},
    // customer: { id: 'all', value: 'All' },
    // brandType: { id: 'all', value: 'All' },
    // brand: [{ id: 'all', value: 'All', label: 'All' }],
    // brandListOnBrandType: [],
    // customerDropDownData: [],
    // hasAnyValue: false,
    // customerError: '',
    // propertyError: '',
    // brandError: '',
    // isDisabled: true,
    // },
    // {
    //   id: 4,
    //  property: {},
    // customer: { id: 'all', value: 'All' },
    // brandType: { id: 'all', value: 'All' },
    // brand: [{ id: 'all', value: 'All', label: 'All' }],
    // brandListOnBrandType: [],
    // customerDropDownData: [],
    // hasAnyValue: false,
    // customerError: '',
    // propertyError: '',
    // brandError: '',
    // isDisabled: true,
    // },
  ];
  const initialAddDeptState = [
    {
      id: 1,
      property: {},
      department: [],
      roles: [],
      departmentDropDownData: [],
      rolesDropDownData: [],
      hasAnyValue: false,
      propertyError: '',
      departmentError: '',
      roleError: '',
      isDisabled: true,
    },
    {
      id: 2,
      property: {},
      department: [],
      roles: [],
      departmentDropDownData: [],
      rolesDropDownData: [],
      hasAnyValue: false,
      propertyError: '',
      departmentError: '',
      roleError: '',
      isDisabled: true,
    },
    {
      id: 3,
      property: {},
      department: [],
      roles: [],
      departmentDropDownData: [],
      rolesDropDownData: [],
      hasAnyValue: false,
      propertyError: '',
      departmentError: '',
      roleError: '',
      isDisabled: true,
    },
    {
      id: 4,
      property: {},
      department: [],
      roles: [],
      departmentDropDownData: [],
      rolesDropDownData: [],
      hasAnyValue: false,
      propertyError: '',
      departmentError: '',
      roleError: '',
      isDisabled: true,
    },
  ];

  const onCancelClickListner = () => {
    const tempStep = [...userAccessSteps];
    const currentStepIndex = tempStep.findIndex(
      item => item.status === 'current',
    );

    if (currentStepIndex === 0) {
      const { userData, isAnyValueModified } = tempStep[currentStepIndex];
      // console.log(isCancel, 'iscancel');
      // console.log(isAnyValueModified, 'isAnyModified');
      if (!isCancel && isAnyValueModified) {
        setIsCancel(true);
        return;
      }

      userData.firstName = duplicateUserData.firstName;
      userData.lastName = duplicateUserData.lastName;
      userData.approved = duplicateUserData.approved;
      userData.active = duplicateUserData.active;
      userData.email = duplicateUserData.email;
      userData.userType = duplicateUserData.userType;
      userData.firstNameError = duplicateUserData.firstNameError;
      userData.lastNameError = duplicateUserData.lastNameError;
      userData.approvedError = duplicateUserData.approvedError;
      userData.activeError = duplicateUserData.activeError;
      userData.emailError = duplicateUserData.emailError;
      userData.userTypeError = duplicateUserData.userTypeError;

      if (userId) {
        getUserDataAPI(userId)
          .then(res => {
            if (res.data.success) {
              const userDataResponse = res.data.data[0];
              // set the data to global storage
              const tempStepData = [...userAccessSteps];
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
              changeSteps(tempStepData);
            }
          })
          .catch(err => {
            if (err) {
              setErrorMessage(`${getErrorMessage(err)}`);
              setIsErrorMessage(true);
            }
          });
      }
      tempStep[currentStepIndex].isAnyValueModified = false;
      changeSteps(tempStep);
      setIsCancel(false);
    }

    if (currentStepIndex === 1) {
      const { addAccessRows } = tempStep[currentStepIndex];
      if (!isCancel && addAccessRows.some(item => item.hasAnyValue === true)) {
        setIsCancel(true);
        return;
      }
      tempStep[currentStepIndex].addAccessRows = initialAddAccessState;
      tempStep[currentStepIndex].isError = false;
      changeSteps(tempStep);
      setIsCancel(false);
    }

    if (currentStepIndex === 2) {
      const { addCustomerRows } = tempStep[currentStepIndex];
      if (
        !isCancel &&
        addCustomerRows.some(item => item.hasAnyValue === true)
      ) {
        setIsCancel(true);
        return;
      }
      tempStep[currentStepIndex].addCustomerRows = initialAddCustomerState;
      tempStep[currentStepIndex].isError = false;
      changeSteps(tempStep);
      setIsCancel(false);
    }

    if (currentStepIndex === 3) {
      const { addDeptRows } = tempStep[currentStepIndex];
      if (!isCancel && addDeptRows.some(item => item.hasAnyValue === true)) {
        setIsCancel(true);
        return;
      }
      tempStep[currentStepIndex].addDeptRows = initialAddDeptState;
      tempStep[currentStepIndex].isError = false;
      changeSteps(tempStep);
      setIsCancel(false);
    }
  };
  // const onSaveAndCloseClickListner = () => {};

  const onSkipAndContinueListener = () => {
    const tempStep = [...userAccessSteps];
    const currentStepIndex = tempStep.findIndex(
      item => item.status === 'current',
    );

    if (currentStepIndex === 2) {
      // change it if we store id here
      const { addCustomerRows } = tempStep[currentStepIndex];
      if (tempStep[0].userData.userType.value.toLowerCase() === 'tenant') {
        if (
          !addCustomerRows.some(item => item.hasAnyValue === true) &&
          tempStep[currentStepIndex].assignedCustomer.length === 0
        ) {
          setIsErrorMessage(true);
          // const groutList= rowData.prerequisiteInGroupArr.join(", ");
          setErrorMessage(
            displayMessages.USER_AND_ACCESS.STEP_3.ERR_NO_CUSTOMER_ASSIGNED,
          );
          return;
        }

        if (
          !addCustomerRows.some(item => item.hasAnyValue === true) &&
          tempStep[currentStepIndex].assignedCustomer.length > 0
        ) {
          const uniqueCustomerRowByPropery = _.uniqBy(
            tempStep[currentStepIndex].assignedCustomer,
            'propertyId',
          );
          if (
            uniqueCustomerRowByPropery.length !==
            tempStep[currentStepIndex].selectedPropertyList.length
          ) {
            setIsErrorMessage(true);
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_3
                .ERR_NOT_ALL_PROPERTY_ASSIGNED,
            );
            return;
          }
        }
      }
      if (addCustomerRows.some(item => item.hasAnyValue === true)) {
        setIsErrorMessage(true);
        setErrorMessage(
          displayMessages.USER_AND_ACCESS.STEP_3.ALERT_SAVE_AND_CONTINUE,
        );
        return;
      }
      const uniqByCustomerAll = _.uniqBy(addCustomerRows, 'customer.id');
      if (
        uniqByCustomerAll.length === 1 &&
        uniqByCustomerAll[0].customer.id === 'all'
      ) {
        tempStep[currentStepIndex].isAllCustomerBrandAssigned =
          tempStep[0].userData.userType.value.toLowerCase() === 'owner';
        changeSteps(tempStep);
        // goToNextStep();
      }

      tempStep[currentStepIndex].status = '';

      tempStep[currentStepIndex].isSaved = true;

      tempStep.forEach((e, stepIndex) => {
        if (stepIndex === currentStepIndex + 1) {
          tempStep[stepIndex].status = 'current';
        } else {
          tempStep[stepIndex].status = '';
        }
      });
      changeSteps(tempStep);
    }
  };
  const onSaveAndSubmitClickListner = () => {
    const tempStep = [...userAccessSteps];
    const currentStepIndex = tempStep.findIndex(
      item => item.status === 'current',
    );

    if (currentStepIndex === 3) {
      const { addDeptRows } = tempStep[currentStepIndex];
      if (
        !addDeptRows.some(item => item.hasAnyValue === true) &&
        tempStep[currentStepIndex].assignedDepartmentAndRoles.length === 0
      ) {
        setIsErrorMessage(true);
        setErrorMessage(
          displayMessages.USER_AND_ACCESS.STEP_4.ERR_NO_DEPT_AND_ROLE_ASSIGNED,
        );
        return;
      }

      if (addDeptRows.some(item => item.hasAnyValue === true)) {
        const rowsHavingValue = addDeptRows.filter(
          item => item.hasAnyValue === true,
        );
        rowsHavingValue.map(row => {
          const modifiedRow = row;
          if (Object.keys(modifiedRow.property).length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.propertyError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }
          if (modifiedRow.department.length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.departmentError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }
          if (modifiedRow.roles.length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.roleError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }

          return modifiedRow;
        });

        if (
          !rowsHavingValue.some(row => {
            if (row.propertyError || row.departmentError || row.roleError) {
              return true;
            }

            return false;
          })
        ) {
          if (rowsHavingValue.length > 1) {
            const modifiedRowsHavingValue = _.map(
              rowsHavingValue,
              _.partialRight(_.pick, ['property', 'department', 'roles']),
            );
            if (compareCommonDataRow(modifiedRowsHavingValue)) {
              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.STEP_4.ERR_SAME_ROW_DATA,
              );
              return;
            }
          }
          tempStep[currentStepIndex].isError = false;
        }
        changeSteps(tempStep);

        if (tempStep[currentStepIndex].isError) {
          return;
        }

        if (tempStep[currentStepIndex].assignedDepartmentAndRoles.length > 0) {
          const uniqueAssignedDeptByPropery = _.map(
            _.uniqBy(
              tempStep[currentStepIndex].assignedDepartmentAndRoles,
              'property',
            ),
            'property',
          );

          const uniqueToAddDeptRowByPropery = _.map(
            _.uniqBy(rowsHavingValue, 'property.value'),
            'property.value',
          );

          const finalAssignedDeptToProperties = [
            ...new Set([
              ...uniqueAssignedDeptByPropery,
              ...uniqueToAddDeptRowByPropery,
            ]),
          ];

          if (
            finalAssignedDeptToProperties.length !==
            tempStep[currentStepIndex].selectedPropertyList.length
          ) {
            setIsErrorMessage(true);
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_4
                .ERR_NOT_ALL_PROPERTY_ASSIGNED,
            );
            return;
          }
        } else {
          const uniqueToAddDeptRowByPropery = _.uniqBy(
            rowsHavingValue,
            'property.id',
          );
          if (
            uniqueToAddDeptRowByPropery.length !==
            tempStep[currentStepIndex].selectedPropertyList.length
          ) {
            setIsErrorMessage(true);
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_4
                .ERR_NOT_ALL_PROPERTY_ASSIGNED,
            );
            return;
          }
        }

        // changeSteps(tempStep);
      }

      // console.log(tempStep[currentStepIndex]);
      if (addDeptRows.some(item => item.hasAnyValue === true)) {
        const rowsHavingValue = addDeptRows.filter(
          item => item.hasAnyValue === true,
        );

        const modifiedAddDeptRow = [];
        rowsHavingValue.forEach(row => {
          const rowObj = {
            propertyId: row.property.id,
            departmentIds: _.map(row.department, 'id'),
            roleIds: _.map(row.roles, 'id'),
          };
          modifiedAddDeptRow.push(rowObj);
        });

        const finalArr = [];

        modifiedAddDeptRow.forEach(row => {
          // const rowFinalObj = {};
          row.departmentIds.forEach(dept => {
            row.roleIds.forEach(role => {
              const rowFinalObj = {
                propertyId: row.propertyId,
                departmentId: dept,
                roleId: role,
              };
              finalArr.push(rowFinalObj);
            });
          });
        });

        if (compareCommonDataRow(finalArr)) {
          setErrorMessage(
            displayMessages.USER_AND_ACCESS.STEP_4
              .ERR_DEPT_OR_ROLE_ALREDY_EXISTS,
          );
          setIsErrorMessage(true);
          return;
        }

        const reqObj = {
          isNewDeptRolesAdded: true,
          userId,
          userDepartmentsAndRoles: finalArr,
        };

        // console.log(reqObj, 'sdfsdfsdf');
        // call add/edit api
        saveAssignDepartmentAndRoleStep4API(reqObj, isAddRequest, userId)
          .then(res => {
            if (res.data.success) {
              getAssignedDepartmentAPI(userId);
              tempStep[currentStepIndex].addDeptRows = initialAddDeptState;
              changeSteps(tempStep);
              // goToNextStep(); at last need to call this to go to the next step
              if (isEditUserReq) {
                setSuccessMessage(
                  displayMessages.USER_AND_ACCESS.USER_ACCESS_SETUP
                    .EDIT_USER_SUCCESS,
                );
              }
              if (isAddRequest) {
                setSuccessMessage(
                  displayMessages.USER_AND_ACCESS.USER_ACCESS_SETUP
                    .ADD_USER_SUCCESS,
                );
              }

              setIsSuccess(true);
            }
          })
          .catch(err => {
            if (err.response.data.errorCode === 'errDataAlreadyExists') {
              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.STEP_4
                  .ERR_DEPT_OR_ROLE_ALREDY_EXISTS,
              );
            } else {
              setErrorMessage(`${getErrorMessage(err)}`);
              setIsErrorMessage(true);
            }
          });
      }
      if (
        !addDeptRows.some(item => item.hasAnyValue === true) &&
        tempStep[currentStepIndex].assignedDepartmentAndRoles.length > 0
      ) {
        const uniqueToAddDeptRowByPropery = _.uniqBy(
          tempStep[currentStepIndex].assignedDepartmentAndRoles,
          'property',
        );
        if (
          uniqueToAddDeptRowByPropery.length !==
          tempStep[currentStepIndex].selectedPropertyList.length
        ) {
          setIsErrorMessage(true);
          setErrorMessage(
            displayMessages.USER_AND_ACCESS.STEP_4
              .ERR_NOT_ALL_PROPERTY_ASSIGNED,
          );
          return;
        }

        const reqObj = {
          isNewDeptRolesAdded: false,
          userId,
          userDepartmentsAndRoles: [],
        };

        // console.log(reqObj, 'sdfsdfsdf');
        // call add/edit api
        saveAssignDepartmentAndRoleStep4API(reqObj, isAddRequest, userId)
          .then(res => {
            if (res.data.success) {
              getAssignedDepartmentAPI(userId);
              tempStep[currentStepIndex].addDeptRows = initialAddDeptState;
              changeSteps(tempStep);
              if (isEditUserReq) {
                setSuccessMessage(
                  displayMessages.USER_AND_ACCESS.USER_ACCESS_SETUP
                    .EDIT_USER_SUCCESS,
                );
              }
              setIsSuccess(true);
            }
          })
          .catch(err => {
            if (err.response.data.errorCode === 'errDataAlreadyExists') {
              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.STEP_4
                  .ERR_DEPT_OR_ROLE_ALREDY_EXISTS,
              );
            } else {
              setErrorMessage(`${getErrorMessage(err)}`);
              setIsErrorMessage(true);
            }
          });
      }
    }
  };

  const handleSuccessAlert = () => {
    history.push(routePath.ROUTE.USER_AND_ACCESS.LIST);
  };

  const setButtonTimeout = () => {
    setButtonState(prevState => !prevState);
    setTimeout(() => {
      setButtonState(prevState => !prevState);
    }, 900);
  };

  const onSaveAndContinueClickListner = () => {
    // console.log('sdfs');
    // setButtonState(true);
    setButtonTimeout();
    const tempStep = [...userAccessSteps];
    const currentStepIndex = tempStep.findIndex(
      item => item.status === 'current',
    );

    if (currentStepIndex === 0) {
      const { userData } = tempStep[currentStepIndex];

      if (userData.firstName === '') {
        tempStep[currentStepIndex].isError = true;
        userData.firstNameError = displayMessages.GLOBAL.MANDATORY_FIELD;
        changeSteps(tempStep);
      } else if (
        !validateNameWithRegex(
          userData.firstName,
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.FIRST_NAME_REGEX,
        )
      ) {
        tempStep[currentStepIndex].isError = true;
        userData.firstNameError = displayMessages.GLOBAL.ERR_TEXTFIELD_INPUT;
        changeSteps(tempStep);
      } else if (
        !validateCharacterLength(
          userData.firstName,
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.FIRST_NAME_LENGTH,
        )
      ) {
        tempStep[currentStepIndex].isError = true;
        userData.firstNameError =
          displayMessages.GLOBAL.ERR_EXCEEDED_MAX_LENGTH;
        changeSteps(tempStep);
      }

      if (userData.lastName === '') {
        tempStep[currentStepIndex].isError = true;
        userData.lastNameError = displayMessages.GLOBAL.MANDATORY_FIELD;
        changeSteps(tempStep);
      } else if (
        !validateNameWithRegex(
          userData.lastName,
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.LAST_NAME_REGEX,
        )
      ) {
        tempStep[currentStepIndex].isError = true;
        userData.lastNameError = displayMessages.GLOBAL.ERR_TEXTFIELD_INPUT;
        changeSteps(tempStep);
      } else if (
        !validateCharacterLength(
          userData.lastName,
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.LAST_NAME_LENGTH,
        )
      ) {
        tempStep[currentStepIndex].isError = true;
        userData.lastNameError = displayMessages.GLOBAL.ERR_EXCEEDED_MAX_LENGTH;
        changeSteps(tempStep);
      }

      if (userData.email === '') {
        tempStep[currentStepIndex].isError = true;
        userData.emailError = displayMessages.GLOBAL.MANDATORY_FIELD;
        changeSteps(tempStep);
      } else if (!validateEmail(userData.email)) {
        tempStep[currentStepIndex].isError = true;
        userData.emailError = displayMessages.GLOBAL.ERR_EMAIL_INPUT;
        changeSteps(tempStep);
      } else if (
        !validateCharacterLength(
          userData.email,
          labelText.USER_AND_ACCESS.ADD_UPDATE_USER_STEP_1.EMAIL_LENGTH,
        )
      ) {
        tempStep[currentStepIndex].isError = true;
        userData.emailError = displayMessages.GLOBAL.ERR_EXCEEDED_MAX_LENGTH;
        changeSteps(tempStep);
      }

      if (Object.keys(userData.userType).length === 0) {
        tempStep[currentStepIndex].isError = true;
        userData.userTypeError =
          displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
        changeSteps(tempStep);
      }

      if (userData.approved === '') {
        tempStep[currentStepIndex].isError = true;
        userData.approvedError =
          displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
        changeSteps(tempStep);
      }

      if (userData.active === '') {
        tempStep[currentStepIndex].isError = true;
        userData.activeError = displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
        changeSteps(tempStep);
      }
      if (
        !userData.activeError &&
        !userData.firstNameError &&
        !userData.lastNameError &&
        !userData.emailError &&
        !userData.userTypeError &&
        !userData.approvedError
      ) {
        tempStep[currentStepIndex].isError = false;
        changeSteps(tempStep);
      }
      if (tempStep[currentStepIndex].isError) {
        return;
      }

      let reqObj;

      if (!userId) {
        reqObj = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          userTypesId: userData.userType.id,
          email: userData.email,
          isApproved: getApprovedActiveBool(userData.approved.value),
          isActive: getApprovedActiveBool(userData.active.value),
        };
      } else {
        reqObj = {
          userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userTypesId: userData.userType.id,
          email: userData.email,
          isApproved: getApprovedActiveBool(userData.approved.value),
          isActive: getApprovedActiveBool(userData.active.value),
        };
      }

      // call edit api
      if (userId) {
        saveAddUpdateUserStep1API(reqObj, isAddRequest, userId)
          .then(res => {
            if (res.data.success) {
              // set the id received here to the stateId, which we will use for further requests
              // if (isAddRequest && !userId) {
              //   setUserId(res.data.data[0].userId);
              // } else
              if (userId && userId === res.data.data[0].userId) {
                setUserId(res.data.data[0].userId);
              } else {
                throw new Error('Records not updated successfully');
              }
              goToNextStep(); // at last need to call this to go to the next step
            }
          })
          .catch(err => {
            setErrorMessage(`${getErrorMessage(err)}`);
            setIsErrorMessage(true);
          });
      } else {
        checkEmailExistsAPI(reqObj)
          .then(res => {
            if (res.data.success) {
              const modifiedDuplicateUserData = { ...duplicateUserData };

              modifiedDuplicateUserData.firstName = userData.firstName;
              modifiedDuplicateUserData.lastName = userData.lastName;
              modifiedDuplicateUserData.userType = userData.userType;
              modifiedDuplicateUserData.email = userData.email;
              modifiedDuplicateUserData.approved = userData.approved;
              modifiedDuplicateUserData.active = userData.active;

              setDuplicateUserData(modifiedDuplicateUserData);
              goToNextStep();
            }
          })
          .catch(err => {
            setErrorMessage(`${getErrorMessage(err)}`);
            setIsErrorMessage(true);
          });
      }
    }
    // step 2 validation and logic
    if (currentStepIndex === 1) {
      const { userData } = tempStep[0];
      const { addAccessRows } = tempStep[currentStepIndex];

      if (
        !addAccessRows.some(item => item.hasAnyValue === true) &&
        tempStep[currentStepIndex].assignedAccess.length === 0
      ) {
        setIsErrorMessage(true);

        setErrorMessage(
          displayMessages.USER_AND_ACCESS.STEP_2.ERR_NO_ACCESS_ADDED,
        );
        return;
      }
      if (addAccessRows.some(item => item.hasAnyValue === true)) {
        const rowsHavingValue = addAccessRows.filter(
          item => item.hasAnyValue === true,
        );

        rowsHavingValue.map(row => {
          const modifiedRow = row;
          if (Object.keys(modifiedRow.company).length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.companyError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }
          if (Object.keys(modifiedRow.llc).length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.llcError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }
          if (Object.keys(modifiedRow.property).length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.propertyError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }
          if (
            !modifiedRow.fullAccess &&
            !modifiedRow.caseAccess &&
            !modifiedRow.caseManipulateAccess
          ) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.accessError =
              displayMessages.USER_AND_ACCESS.STEP_2.ERR_NO_FULL_CASE_ACCESS;
          }

          return modifiedRow;
          // changeSteps(tempStep);
        });

        if (
          !rowsHavingValue.some(row => {
            if (
              row.companyError ||
              row.llcError ||
              row.propertyError ||
              row.accessError
            ) {
              return true;
            }

            return false;
          })
        ) {
          if (rowsHavingValue.length > 1) {
            const modifiedRowsHavingValue = _.map(
              rowsHavingValue,
              _.partialRight(_.pick, ['company', 'llc', 'property']),
            );
            if (compareCommonDataRow(modifiedRowsHavingValue)) {
              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.USER_ACCESS_SETUP
                  .ERR_SAME_ROW_DATA,
              );
              return;
            }
          }
          tempStep[currentStepIndex].isError = false;
        }
        changeSteps(tempStep);
        if (tempStep[currentStepIndex].isError) {
          return;
        }

        if (tempStep[currentStepIndex].assignedAccess.length > 0) {
          if (
            rowsHavingValue.some(row => {
              if (
                tempStep[currentStepIndex].assignedAccess.some(
                  item => item.propertyId === row.property.id,
                )
              ) {
                return true;
              }
              return false;
            })
          ) {
            setIsErrorMessage(true);
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_2
                .ERR_ACCESS_ALREADY_ASSIGNED,
            );
            return;
          }
        }
      }

      if (addAccessRows.some(item => item.hasAnyValue === true)) {
        const rowsHavingValue = addAccessRows.filter(
          item => item.hasAnyValue === true,
        );

        const userAddAccess = [];
        rowsHavingValue.forEach(accessRow => {
          const accessRowObj = {
            propertyId: accessRow.property.id,
            fullAccess: accessRow.fullAccess,
            caseAccess: accessRow.caseAccess,
            caseManipulationAccess: accessRow.caseManipulateAccess,
          };
          userAddAccess.push(accessRowObj);
        });

        if (isAddRequest && !userId) {
          const userDataReqObj = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            userTypesId: userData.userType.id,
            email: userData.email,
            isApproved: getApprovedActiveBool(userData.approved.value),
            isActive: getApprovedActiveBool(userData.active.value),
          };

          saveAddUpdateUserStep1API(userDataReqObj, isAddRequest, userId)
            .then(res => {
              if (res.data.success) {
                setUserId(res.data.data[0].userId);

                return res.data.data[0].userId;
              }

              throw new Error('Records not updated successfully');
            })
            .then(createdUserId => {
              const reqObj = {
                userId: createdUserId,
                userProperties: userAddAccess,
              };
              saveAssignPropertyAndAccesStep2API(reqObj)
                .then(assignPropertyRes => {
                  if (assignPropertyRes.data.success) {
                    getAssignedAccessAPI(createdUserId);
                    tempStep[
                      currentStepIndex
                    ].addAccessRows = initialAddAccessState;
                    tempStep[currentStepIndex].isError = false;
                    changeSteps(tempStep);
                    goToNextStep(); // at last need to call this to go to the next step
                  }
                })
                .catch(err => {
                  setErrorMessage(`${getErrorMessage(err)}`);
                  setIsErrorMessage(true);
                });

              // goToNextStep(); // at last need to call this to go to the next step
            })
            .catch(err => {
              setErrorMessage(`${getErrorMessage(err)}`);
              setIsErrorMessage(true);
            });
        } else {
          const reqObj = {
            userId,
            userProperties: userAddAccess,
          };
          saveAssignPropertyAndAccesStep2API(reqObj)
            .then(res => {
              if (res.data.success) {
                getAssignedAccessAPI(userId);
                tempStep[
                  currentStepIndex
                ].addAccessRows = initialAddAccessState;
                tempStep[currentStepIndex].isError = false;
                changeSteps(tempStep);
                goToNextStep(); // at last need to call this to go to the next step
              }
            })
            .catch(err => {
              setErrorMessage(`${getErrorMessage(err)}`);
              setIsErrorMessage(true);
            });
        }
      }
      if (
        !addAccessRows.some(item => item.hasAnyValue === true) &&
        tempStep[currentStepIndex].assignedAccess.length > 0
      ) {
        tempStep[currentStepIndex].addAccessRows = initialAddAccessState;
        tempStep[currentStepIndex].isError = false;
        changeSteps(tempStep);
        goToNextStep();
      }
    }

    // step 3 validation and logic
    else if (currentStepIndex === 2) {
      // change it if we store id here
      const { addCustomerRows } = tempStep[currentStepIndex];

      if (addCustomerRows.some(item => item.hasAnyValue === true)) {
        const rowsHavingValue = addCustomerRows.filter(
          item => item.hasAnyValue === true,
        );
        rowsHavingValue.map(row => {
          const modifiedRow = row;
          if (Object.keys(modifiedRow.property).length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.propertyError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }
          if (Object.keys(modifiedRow.customer).length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.customerError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }
          if (modifiedRow.brand.length === 0) {
            tempStep[currentStepIndex].isError = true;
            modifiedRow.brandError =
              displayMessages.GLOBAL.MANDATORY_DROPDOWN_SELECT;
          }

          return modifiedRow;
        });

        // if (checkCustomerAll()) {
        //   return;
        // }

        // if (checkIncorrectAssignment()) {
        //   return;
        // }

        if (
          !rowsHavingValue.some(row => {
            if (row.propertyError || row.customerError || row.brandError) {
              return true;
            }

            return false;
          })
        ) {
          if (rowsHavingValue.length > 1) {
            const modifiedRowsHavingValue = _.map(
              rowsHavingValue,
              _.partialRight(_.pick, [
                'property',
                'customer',
                'brandType',
                'brand',
              ]),
            );
            if (compareCommonDataRow(modifiedRowsHavingValue)) {
              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.STEP_3.ERR_SAME_ROW_DATA,
              );
              return;
            }
          }
          tempStep[currentStepIndex].isError = false;
        }
        changeSteps(tempStep);
      }

      if (tempStep[currentStepIndex].isError) {
        return;
      }

      if (checkCustomerAll()) {
        return;
      }

      if (checkIncorrectAssignment()) {
        return;
      }

      if (tempStep[0].userData.userType.value.toLowerCase() === 'tenant') {
        if (
          !addCustomerRows.some(item => item.hasAnyValue === true) &&
          tempStep[currentStepIndex].assignedCustomer.length === 0
        ) {
          setIsErrorMessage(true);
          setErrorMessage(
            displayMessages.USER_AND_ACCESS.STEP_3.ERR_NO_CUSTOMER_ASSIGNED,
          );
          return;
        }
        if (
          !addCustomerRows.some(item => item.hasAnyValue === true) &&
          tempStep[currentStepIndex].assignedCustomer.length > 0
        ) {
          const uniqueCustomerRowByPropery = _.uniqBy(
            tempStep[currentStepIndex].assignedCustomer,
            'propertyId',
          );

          if (
            uniqueCustomerRowByPropery.length !==
            tempStep[currentStepIndex].selectedPropertyList.length
          ) {
            setIsErrorMessage(true);
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_3
                .ERR_NOT_ALL_PROPERTY_ASSIGNED,
            );
            return;
          }
        }

        if (addCustomerRows.some(item => item.hasAnyValue === true)) {
          const rowsHavingValue = addCustomerRows.filter(
            item => item.hasAnyValue === true,
          );

          const uniqueCustomerRow = _.uniqBy(rowsHavingValue, 'customer.id');
          if (
            uniqueCustomerRow.length !== 1 ||
            uniqueCustomerRow.find(item => item.customer.id === 'all')
          ) {
            setIsErrorMessage(true);
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_3.ERR_UNIQUE_CUSTOMER,
            );
            return;
          }
          // if(uniqueCustomerRow.find(item=>item.customer))

          if (tempStep[currentStepIndex].assignedCustomer.length > 0) {
            const uniqueAssignedCustomerByPropery = _.map(
              _.uniqBy(
                tempStep[currentStepIndex].assignedCustomer,
                'propertyId',
              ),
              'propertyId',
            );

            const uniqueToAddCustomerRowByPropery = _.map(
              _.uniqBy(rowsHavingValue, 'property.id'),
              'property.id',
            );

            const finalAssignedCustomerToProperties = [
              ...new Set([
                ...uniqueAssignedCustomerByPropery,
                ...uniqueToAddCustomerRowByPropery,
              ]),
            ];

            if (
              finalAssignedCustomerToProperties.length !==
              tempStep[currentStepIndex].selectedPropertyList.length
            ) {
              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.STEP_3
                  .ERR_NOT_ALL_PROPERTY_ASSIGNED,
              );
              return;
            }
          } else {
            const uniqueCustomerRowByPropery = _.uniqBy(
              rowsHavingValue,
              'property.id',
            );
            if (
              uniqueCustomerRowByPropery.length !==
              tempStep[currentStepIndex].selectedPropertyList.length
            ) {
              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.STEP_3
                  .ERR_NOT_ALL_PROPERTY_ASSIGNED,
              );
              return;
            }
          }
        }

        if (
          addCustomerRows.some(item => item.hasAnyValue === true) &&
          tempStep[currentStepIndex].assignedCustomer.length > 0
        ) {
          const uniqueAssignedCustomer = _.uniqBy(
            tempStep[currentStepIndex].assignedCustomer,
            'customer',
          );
          const rowsHavingValue = addCustomerRows.filter(
            item => item.hasAnyValue === true,
          );

          const uniqueCustomerRow = _.uniqBy(rowsHavingValue, 'customer.id'); // change 2nd param if we store object of selected value

          if (
            uniqueAssignedCustomer[0].customer !==
            uniqueCustomerRow[0].customer.value
          ) {
            setIsErrorMessage(true);
            // const groutList= rowData.prerequisiteInGroupArr.join(", ");
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_3.ERR_UNIQUE_CUSTOMER,
            );
            return;
          }
        }
      }
      // } else if (!addCustomerRows.some(item => item.hasAnyValue === true)) {
      //   setIsErrorMessage(true);
      //   setErrorMessage(
      //     displayMessages.USER_AND_ACCESS.STEP_3.ALERT_SKIP_AND_CONTINUE,
      //   );
      //   return;
      // }

      const uniqByCustomerAll = _.uniqBy(addCustomerRows, 'customer.id');

      if (
        uniqByCustomerAll.length === 1 &&
        uniqByCustomerAll[0].customer.id === 'all'
      ) {
        if (
          tempStep[currentStepIndex].assignedCustomer.length > 0 &&
          uniqByCustomerAll[0].hasAnyValue
        ) {
          const uniqByProperty = _.uniqBy(
            tempStep[currentStepIndex].assignedCustomer,
            'propertyId',
          );
          if (
            uniqByProperty.some(
              item => item.propertyId === uniqByCustomerAll[0].property.id,
            )
          ) {
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_3.ERR_OVERRIDING_ACCESS,
            );
            setIsErrorMessage(true);
            return;
          }
        }
        tempStep[currentStepIndex].isAllCustomerBrandAssigned =
          tempStep[0].userData.userType.value.toLowerCase() === 'owner';
        tempStep[currentStepIndex].addCustomerRows = initialAddCustomerState;
        changeSteps(tempStep);
        goToNextStep();
      } else if (addCustomerRows.some(item => item.hasAnyValue === true)) {
        const rowsHavingValue = addCustomerRows.filter(
          item => item.hasAnyValue === true,
        );

        const custBrandAddedArray = [];
        rowsHavingValue.forEach(row => {
          if (
            row.brandType.id === 'all' &&
            row.brand.some(item => item.id === 'all')
          ) {
            // send only customer data, will not have any entry for brands
            const rowObj = {};
            rowObj.property = row.property;
            rowObj.customer = row.customer;
            rowObj.brand = [];

            custBrandAddedArray.push(rowObj);
          } else {
            const rowObj = {};
            rowObj.property = row.property;
            rowObj.customer = row.customer;
            rowObj.brand = row.brand.filter(item => item.id !== 'all');
            custBrandAddedArray.push(rowObj);
          }
        });

        // console.log(custBrandAddedArray, 'custbrnadArray');
        const finalArr = [];
        const modifiedCustomerBrandArr = [...custBrandAddedArray];
        modifiedCustomerBrandArr.forEach(custBrand => {
          const modifiedCustBrnad = custBrand;
          assignedAccess
            .filter(item => item.property === modifiedCustBrnad.property.value)
            .forEach(propertyAccess => {
              const finalObjs = {};
              finalObjs.userPropertyAccessId = propertyAccess.id;
              finalObjs.propertyId = modifiedCustBrnad.property.id;
              finalObjs.customerId = modifiedCustBrnad.customer.id;
              finalObjs.brands = _.map(modifiedCustBrnad.brand, 'id');

              finalArr.push(finalObjs);
            });
        });
        const reqObj = {
          userId,
          userCompanyAndBrands: finalArr,
        };

        //  console.log(reqObj, 'reqObjctsdfsdfsdf');
        // call add/edit api
        saveAssignCustomerAndBrandStep3API(reqObj)
          .then(res => {
            if (res.data.success) {
              getAssignedCustomerAPI(userId);
              tempStep[
                currentStepIndex
              ].addCustomerRows = initialAddCustomerState;
              tempStep[currentStepIndex].isError = false;
              changeSteps(tempStep);
              goToNextStep(); // at last need to call this to go to the next step
            }
          })
          .catch(err => {
            if (err.response.data.errorCode === 'errDataAlreadyExists') {
              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.STEP_3.ERR_OVERRIDING_ACCESS,
              );
            } else {
              setErrorMessage(`${getErrorMessage(err)}`);
              setIsErrorMessage(true);
            }
          });
      }
    }

    // if (currentStepIndex > 2) {
    //   // console.log('sdfhj');
    //   tempStep[currentStepIndex].status = '';

    //   tempStep[currentStepIndex].isSaved = true;

    //   tempStep.forEach((e, stepIndex) => {
    //     if (stepIndex === currentStepIndex + 1) {
    //       tempStep[stepIndex].status = 'current';
    //     } else {
    //       tempStep[stepIndex].status = '';
    //     }
    //   });
    //   changeSteps(tempStep);
    // }
  };

  const goToNextStep = () => {
    // setButtonState(false);
    const tempStep = [...userAccessSteps];
    const currentStepIndex = tempStep.findIndex(
      item => item.status === 'current',
    );
    if (currentStepIndex >= 0) {
      // console.log('sdfhj');
      tempStep[currentStepIndex].status = '';

      tempStep[currentStepIndex].isSaved = true;

      tempStep.forEach((e, stepIndex) => {
        if (stepIndex === currentStepIndex + 1) {
          tempStep[stepIndex].status = 'current';
        } else {
          tempStep[stepIndex].status = '';
        }
      });
      changeSteps(tempStep);
    }
  };

  const onChangeWizard = index => {
    const tempStep = [...userAccessSteps];
    tempStep[index].status = '';

    const previousStepIndex = tempStep.findIndex(
      item => item.status === 'current',
    );

    if (previousStepIndex === 1) {
      if (tempStep[1].assignedAccess.length === 0 && index !== 0) {
        setIsErrorMessage(true);

        setErrorMessage(
          displayMessages.USER_AND_ACCESS.STEP_2.ERR_NO_ACCESS_ADDED,
        );
        return;
      }

      tempStep[1].addAccessRows = initialAddAccessState;
      tempStep[1].isError = false;
    }

    if (previousStepIndex === 2) {
      tempStep[2].addCustomerRows = initialAddCustomerState;
      tempStep[2].isError = false;
    }

    if (previousStepIndex === 3) {
      tempStep[3].addDeptRows = initialAddDeptState;
      tempStep[3].isError = false;
    }

    tempStep.forEach((e, stepIndex) => {
      if (stepIndex === index) {
        tempStep[stepIndex].status = 'current';
      } else {
        tempStep[stepIndex].status = '';
      }
    });

    changeSteps(tempStep);
  };

  return (
    <div className="user-access-setup">
      <Card>
        <CardHeader title="User and Access Setup" />
        <div className="wizard">
          <Wizard formSteps={userAccessSteps} onSelectStep={onChangeWizard} />
        </div>
        {userAccessSteps.map(steps => {
          if (steps.id === 1 && steps.status === 'current') {
            return (
              <AddNewUser
                key={steps.id}
                stepData={steps}
                changeStepData={changeSteps}
                isEditUserReq={isEditUserReq}
                // userId={userIdFromUserList}
              />
            );
          }
          if (steps.id === 2 && steps.status === 'current') {
            return (
              <div className="d-flex">
                <DetailsItem
                  className="username-detail"
                  itemLabel={
                    labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.USER_LABEL
                  }
                  itemValue={`${userAccessSteps[0].userData.firstName} ${userAccessSteps[0].userData.lastName}`}
                />
                <DetailsItem
                  className="username-detail"
                  itemLabel={
                    labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.USER_TYPE_LABEL
                  }
                  itemValue={`${userAccessSteps[0].userData.userType.value}`}
                />
              </div>
            );
          }
          if (steps.id === 3 && steps.status === 'current') {
            return (
              <div className="d-flex">
                <DetailsItem
                  className="username-detail"
                  itemLabel={
                    labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.USER_LABEL
                  }
                  itemValue={`${userAccessSteps[0].userData.firstName} ${userAccessSteps[0].userData.lastName}`}
                />
                <DetailsItem
                  className="username-detail"
                  itemLabel={
                    labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.USER_TYPE_LABEL
                  }
                  itemValue={`${userAccessSteps[0].userData.userType.value}`}
                />
              </div>
            );
          }
          if (steps.id === 4 && steps.status === 'current') {
            return (
              <div className="d-flex">
                <DetailsItem
                  className="username-detail"
                  itemLabel={
                    labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.USER_LABEL
                  }
                  itemValue={`${userAccessSteps[0].userData.firstName} ${userAccessSteps[0].userData.lastName}`}
                />
                <DetailsItem
                  className="username-detail"
                  itemLabel={
                    labelText.USER_AND_ACCESS.USER_ACCESS_SETUP.USER_TYPE_LABEL
                  }
                  itemValue={`${userAccessSteps[0].userData.userType.value}`}
                />
              </div>
            );
          }
          return null;
        })}
      </Card>
      {userAccessSteps.map(steps => {
        // if (steps.id === 1 && steps.status === 'current') {
        //   return (
        //     <AddNewUser
        //       key={steps.id}
        //       stepData={steps}
        //       changeStepData={changeSteps}
        //     />
        //   );
        // }
        if (steps.id === 2 && steps.status === 'current') {
          return (
            <AssignPropertyAndAccess
              key={steps.id}
              isEditUserReq={isEditUserReq}
            />
          );
        }
        if (steps.id === 3 && steps.status === 'current') {
          return (
            <AssignCustomerAndBrand
              key={steps.id}
              isEditUserReq={isEditUserReq}
            />
          );
        }
        if (steps.id === 4 && steps.status === 'current') {
          return (
            <AssignDepartmentAndRoles
              key={steps.id}
              isEditUserReq={isEditUserReq}
            />
          );
        }
        return null;
      })}

      <div className="access-and-setup-button-container">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancelClickListner}
        >
          {labelText.GLOBAL.BUTTON_CANCEL}
        </button>
        {/* <button
          type="button"
          className="btn-save-close"
          onClick={onSaveAndCloseClickListner}
        >
          Save and Close
        </button> */}
        {userAccessSteps[2].status === 'current' ? (
          <button
            type="button"
            className="btn-skip-and-continue"
            onClick={onSkipAndContinueListener}
          >
            {labelText.GLOBAL.BUTTON_SKIP_AND_CONTINUE}
          </button>
        ) : (
          ''
        )}
        {userAccessSteps[3].status === 'current' ? (
          <button
            type="button"
            className="btn-save-submit"
            onClick={onSaveAndSubmitClickListner}
          >
            {labelText.GLOBAL.BUTTON_SAVE_AND_SUMIT}
          </button>
        ) : (
          <button
            type="button"
            className="btn-save-submit"
            disabled={buttonState}
            onClick={onSaveAndContinueClickListner}
          >
            {labelText.GLOBAL.BUTTON_SAVE_AND_CONTINUE}
          </button>
        )}
      </div>

      <InformationAlert
        alertMessage={displayMessages.GLOBAL.ERR_CHANGES_LOST}
        primaryButtonText="Yes"
        secondaryButtonText="No"
        open={isCancel}
        setClose={() => setIsCancel(!isCancel)}
        primaryButtonOnClick={() => onCancelClickListner()}
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

      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  userAccessSteps: getUserAccessSteps(state),
  userId: getUserIdFromState(state),
  userTypeList: getUserTypeListForAddUpdate(state),
  userAccessTypeList: getUserAccessTypeList(state),
  assignedAccess: getAssignedAccess(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSteps: setWizardStepsUserAccess,
      saveAddUpdateUserStep1API: saveAddUpdateUserStep1APIAction,
      saveAssignPropertyAndAccesStep2API: saveAssignPropertyAndAccesStep2APIAction,
      saveAssignCustomerAndBrandStep3API: saveAssignCustomerAndBrandStep3APIAction,
      saveAssignDepartmentAndRoleStep4API: saveAssignDepartmentAndRoleStep4APIAction,
      setUserId: setUserID,
      resetUserData: resetUserDataAction,
      getUserDataAPI: getUserDataAPIAction,
      getAssignedAccessAPI: getAssignedAccessAPIAction,
      getAssignedDepartmentAPI: getAssignedDepartmentAPIAction,
      getAssignedCustomerAPI: getAssignedCustomerAPIAction,
      checkEmailExistsAPI: checkEmailExistsAPIAction,
    },
    dispatch,
  );

UserAccessSetup.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  userAccessSteps: PropTypes.instanceOf(Array).isRequired,
  changeSteps: PropTypes.func.isRequired,
  saveAddUpdateUserStep1API: PropTypes.func.isRequired,
  saveAssignPropertyAndAccesStep2API: PropTypes.func.isRequired,
  saveAssignCustomerAndBrandStep3API: PropTypes.func.isRequired,
  saveAssignDepartmentAndRoleStep4API: PropTypes.func.isRequired,
  setUserId: PropTypes.func.isRequired,
  userId: PropTypes.string,
  resetUserData: PropTypes.func.isRequired,
  getUserDataAPI: PropTypes.func.isRequired,
  userTypeList: PropTypes.instanceOf(Array).isRequired,
  getAssignedAccessAPI: PropTypes.func.isRequired,
  // userAccessTypeList: PropTypes.instanceOf(Array).isRequired,
  assignedAccess: PropTypes.instanceOf(Object).isRequired,
  getAssignedDepartmentAPI: PropTypes.func.isRequired,
  getAssignedCustomerAPI: PropTypes.func.isRequired,
  checkEmailExistsAPI: PropTypes.func.isRequired,
};

UserAccessSetup.defaultProps = {
  match: {
    params: {},
  },
  history: {
    push: () => {},
  },
  userId: '',
};
export default connect(mapStateToProps, mapDispatchToProps)(UserAccessSetup);
