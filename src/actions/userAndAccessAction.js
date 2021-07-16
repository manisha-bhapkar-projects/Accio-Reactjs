// import axios from 'axios';
import apiPaths from '../utils/constants';
import fetchClient from '../utils/axiosConfig';
import labelText from '../utils/Locales/labels';

import {
  SET_WIZARD_STEPS_USER_ACCESS,
  SET_COMPANY_LIST,
  SET_CUSTOMER_LIST,
  SET_BRAND_TYPE_LIST,
  SET_BRAND_LIST,
  SET_SELECTED_PROPERTY_LIST,
  // SET_ROLES_LIST,
  SET_USER_LIST,
  SET_USER_LIST_IS_LOADING,
  SET_USER_LIST_COUNT,
  SET_USER_TYPE_LIST,
  SET_ASSIGNED_ACCESS,
  SET_ASSIGNED_CUSTOMER,
  SET_ASSIGNED_DEPARTMENT,
  SET_USER_ACCESS_TYPE_LIST,
  SET_USER_ID,
  RESET_USERDATA_TO_INITIAL_STATE,
} from '../types';
// import selectedPropertyList from '../utils/DemoData/companyList';

export const resetUserDataAction = () => ({
  type: RESET_USERDATA_TO_INITIAL_STATE,
});

export const setWizardStepsUserAccess = steps => ({
  type: SET_WIZARD_STEPS_USER_ACCESS,
  steps,
});

export const setUserList = list => ({
  type: SET_USER_LIST,
  list,
});

export const setUserListIsLoading = isLoading => ({
  type: SET_USER_LIST_IS_LOADING,
  isLoading,
});

export const setUserListCount = count => ({
  type: SET_USER_LIST_COUNT,
  count,
});

export const setUserID = userId => ({
  type: SET_USER_ID,
  userId,
});

export const getUserListAPIAction = (
  page,
  limit,
  searchText,
  isApproved,
  isActive,
  userTypeId,
  propertyId,
) => {
  return dispatch => {
    dispatch(setUserListIsLoading(true));

    const queryParams = {
      params: {
        page,
        limit,
        search: searchText,
        isApproved,
        isActive,
        userTypeId,
        propertyId,
      },
    };
    // api call for getting the user List
    fetchClient
      .get(apiPaths.API.USER_AND_ACCESS.USER_LISTING, queryParams)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data[0];
          const userListing = apiData.record;
          const userListingCount = apiData.totalCount;
          dispatch(setUserList(userListing));
          dispatch(setUserListCount(userListingCount));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setUserList([]));
          dispatch(setUserListCount(0));
        }
      });

    // dispatch(setUserList(userList[0].record));
    // dispatch(setUserListCount(userList[0].totalCount));
  };
};

export const setCompanyList = list => ({
  type: SET_COMPANY_LIST,
  list,
});

export const getCompanyListAPIAction = () => {
  return dispatch => {
    //  api call for getting the company list
    fetchClient
      .get(apiPaths.API.USER_AND_ACCESS.COMPANY_LIST)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          dispatch(setCompanyList(apiData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setCompanyList([]));
        }
      });
  };
};

export const getPropertyListAPIAction = (companyId, llcId) => {
  return () => {
    // api call for getting the property list based on company id
    return fetchClient.get(
      `${apiPaths.API.USER_AND_ACCESS.PROPERTY_LIST_ON_COMPANY_LLC}/${companyId}/${llcId}`,
    );
  };
};

export const getLLCListAPIAction = companyId => {
  return () => {
    // api call for getting the llc list
    return fetchClient.get(
      `${apiPaths.API.USER_AND_ACCESS.LLC_LIST}/${companyId}`,
    );
  };
};

export const setCustomerList = list => ({
  type: SET_CUSTOMER_LIST,
  list,
});

export const getCustomerListAPIAction = () => {
  return dispatch => {
    // api call for getting the customer list

    fetchClient
      .get(apiPaths.API.USER_AND_ACCESS.CUSTOMER_LIST)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          dispatch(setCustomerList(apiData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setCustomerList([]));
        }
      });
  };
};

export const getCustomerListByPropertyAPIAction = propertyId => {
  return () => {
    // api call for getting the customer list

    return fetchClient.get(
      `${apiPaths.API.USER_AND_ACCESS.CUSTOMER_LIST}/${propertyId}`,
    );
  };
};

export const setBrandTypeList = list => ({
  type: SET_BRAND_TYPE_LIST,
  list,
});

export const getBrandTypeListAPIAction = () => {
  return dispatch => {
    // // console.log('calling brnad type api');
    // api call for getting the customer list
    fetchClient
      .get(apiPaths.API.USER_AND_ACCESS.BRAND_TYPE_LIST)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          dispatch(setBrandTypeList(apiData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setBrandTypeList([]));
        }
      });

    // dispatch(setBrandTypeList(brandTypeList));
    // return axios.get('../lists.json');
  };
};

export const setBrandList = list => ({
  type: SET_BRAND_LIST,
  list,
});

export const getBrandListAllAPIAction = () => {
  return dispatch => {
    // console.log(brandList, 'calling API');

    fetchClient
      .get(apiPaths.API.USER_AND_ACCESS.BRAND_LIST)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          dispatch(setBrandList(apiData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setBrandList([]));
        }
      });
    // dispatch(setBrandList(brandList));
  };
};

export const getBrandListForIdAPIAction = (customerId, brandTypeId) => {
  return () => {
    // api call for getting the brand for brand type id list
    return fetchClient.get(
      `${apiPaths.API.USER_AND_ACCESS.BRAND_LIST}/${customerId}/${brandTypeId}`,
    );

    // return axios.get('../lists.json');
  };
};
export const setSeletedPropertyList = list => ({
  type: SET_SELECTED_PROPERTY_LIST,
  list,
});

export const getSelectedPropertyListAPIAction = userId => {
  return dispatch => {
    fetchClient
      .get(`${apiPaths.API.USER_AND_ACCESS.ASSIGNED_PROPERTY_LIST}/${userId}`)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          const modifidedApiData = [];
          apiData.forEach(dataRow => {
            const dataObj = {
              id: dataRow.propertyId,
              value: dataRow.propertyName,
            };
            modifidedApiData.push(dataObj);
          });
          dispatch(setSeletedPropertyList(modifidedApiData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setSeletedPropertyList([]));
        }
      });

    // dispatch(setSeletedPropertyList(selectedPropertyList));
  };
};

export const getDepartmentListAPIAction = (propertyId, userTypeId) => {
  return () => {
    // api call for getting department for selected userType and and property
    return fetchClient.get(
      `${apiPaths.API.USER_AND_ACCESS.DEPARTMENT_LIST}/${propertyId}/${userTypeId}`,
    );
  };
};

// export const setRolesList = list => ({
//   type: SET_ROLES_LIST,
//   list,
// });

export const getRoleListAPIAction = (propertyId, userTypeId) => {
  // here I need to send the userType Id to get the roles according to user type

  return () => {
    return fetchClient.get(
      `${apiPaths.API.USER_AND_ACCESS.ROLES_LIST}/${propertyId}/${userTypeId}`,
    );

    // dispatch(setRolesList(rolesList));
  };
};

export const setUserTypeList = list => ({
  type: SET_USER_TYPE_LIST,
  list,
});

export const getUserTypeListAPIAction = () => {
  return dispatch => {
    fetchClient
      .get(apiPaths.API.USER_AND_ACCESS.USER_TYPE_LIST)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          dispatch(setUserTypeList(apiData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setUserTypeList([]));
        }
      });

    // dispatch(setUserTypeList(userTypeList));
    // return axios.get('../lists.json');
  };
};

export const setAssignedAccess = list => ({
  type: SET_ASSIGNED_ACCESS,
  list,
});

export const getAssignedAccessAPIAction = userId => {
  return dispatch => {
    // api call for getting the assigned access corresponding to a userId
    // const getAccessTypeValue = accessTypeFromAPI => {
    //   if (accessTypeFromAPI === 'Full access') {
    //     return labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
    //       .FULL_ACCESS_LABEL;
    //   }
    //   if (accessTypeFromAPI === 'Workflow access') {
    //     return labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
    //       .CASE_ACCESS_LABEL;
    //   }
    //   if (accessTypeFromAPI === 'Case management') {
    //     return labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
    //       .CASE_MANAGEMENT_ACCESS_LABEL;
    //   }
    //   return '';
    // };

    const getAccessTypeValue = (
      fullAccess,
      caseAccess,
      adminAccess,
      caseManipulationAccess,
    ) => {
      const accessArr = [];
      if (fullAccess) {
        accessArr.push(
          labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
            .FULL_ACCESS_LABEL,
        );
      }
      if (caseAccess) {
        accessArr.push(
          labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
            .CASE_ACCESS_LABEL,
        );
      }
      if (adminAccess) {
        accessArr.push(
          labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
            .ADMIN_ACCESS_LABEL,
        );
      }
      if (caseManipulationAccess) {
        accessArr.push(
          labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
            .CASE_MANAGEMENT_ACCESS_LABEL,
        );
      }

      const accessesString = accessArr.join(', ');
      return accessesString;
    };

    fetchClient
      .get(`${apiPaths.API.USER_AND_ACCESS.ASSIGNED_ACCESS}/${userId}`)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data[0];
          const assignedAccessData = apiData.records;
          const modifiedAssignedAccess = [];
          assignedAccessData.forEach(access => {
            const accessRowObj = {
              id: access.userPropertyAccessId,
              company: access.companyName,
              companyId: access.companyId,
              llc: access.llcName,
              llcId: access.llcId,
              property: access.propertyName,
              propertyId: access.propertyId,
              // accessTypeId: access.userAccessTypeId,
              // access: getAccessTypeValue(access.userAccessType),
              access: getAccessTypeValue(
                access.fullAccess,
                access.caseAccess,
                access.adminAccess,
                access.caseManipulationAccess,
              ),
            };
            modifiedAssignedAccess.push(accessRowObj);
          });

          dispatch(setAssignedAccess(modifiedAssignedAccess));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setAssignedAccess([]));
        }
      });

    // dispatch(setAssignedAccess(accessAssigned));
  };
};

export const setAssignedCustomer = list => ({
  type: SET_ASSIGNED_CUSTOMER,
  list,
});

export const getAssignedCustomerAPIAction = userId => {
  return dispatch => {
    // api call for getting the assigned access corresponding to a userId

    fetchClient
      .get(`${apiPaths.API.USER_AND_ACCESS.ASSIGNED_CUSTOMER}/${userId}`)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data[0];
          const apiResCustAssigned = apiData.records;
          const modifiedApiResCustAssigned = [];
          apiResCustAssigned.forEach(custAssigned => {
            const custAssignedObj = {
              id: custAssigned.userPropertyAccessId,
              property: custAssigned.propertyName,
              propertyId: custAssigned.propertyId,
              customer: custAssigned.customerName,
              customerId: custAssigned.customerId,
              brand:
                custAssigned.brandId === null
                  ? 'All Brands'
                  : custAssigned.brandName,
              brandId: custAssigned.brandId,
            };
            modifiedApiResCustAssigned.push(custAssignedObj);
          });

          dispatch(setAssignedCustomer(modifiedApiResCustAssigned));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setAssignedCustomer([]));
        }
      });
    dispatch(setAssignedCustomer([]));
  };
};

export const setAssignedDepartment = list => ({
  type: SET_ASSIGNED_DEPARTMENT,
  list,
});

export const getAssignedDepartmentAPIAction = userId => {
  return dispatch => {
    // api call for getting the assigned access corresponding to a userId

    fetchClient
      .get(
        `${apiPaths.API.USER_AND_ACCESS.ASSIGNED_DEPARTMENT_AND_ROLES}/${userId}`,
      )
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data[0];
          const deptListResponse = apiData.records;
          const modifiedDeptListResponse = [];
          deptListResponse.forEach(deptRow => {
            const deptObj = {
              id: deptRow.userDepartmentRoleId,
              property: deptRow.property_name,
              department: deptRow.departmentName,
              roles: deptRow.roleName,
            };
            modifiedDeptListResponse.push(deptObj);
          });
          dispatch(setAssignedDepartment(modifiedDeptListResponse));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setAssignedDepartment([]));
        }
      });
  };
};

export const setUserAccessTypeList = list => ({
  type: SET_USER_ACCESS_TYPE_LIST,
  list,
});

export const getUserAccessTypeListAPIAction = () => {
  return dispatch => {
    // api call for getting the assigned access corresponding to a userId

    fetchClient
      .get(apiPaths.API.USER_AND_ACCESS.USER_ACCESS_TYPE_LIST)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          dispatch(setUserAccessTypeList(apiData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setUserAccessTypeList([]));
        }
      });
    // dispatch(setUserAccessTypeList(userAccessType));
  };
};

export const saveAddUpdateUserStep1APIAction = (
  reqObj,
  isAddRequest,
  userId,
) => {
  return () => {
    let requestQuery = '';
    if (isAddRequest && !userId) {
      requestQuery = fetchClient.post(
        apiPaths.API.USER_AND_ACCESS.SAVE_ADD_UPDATE_USER_STEP1,
        reqObj,
      );
    } else {
      requestQuery = fetchClient.put(
        `${apiPaths.API.USER_AND_ACCESS.SAVE_UPDATE_USER_STEP1}`,
        reqObj,
      );
    }
    return requestQuery;
  };
};

export const checkEmailExistsAPIAction = reqObj => {
  return () => {
    return fetchClient.post(
      apiPaths.API.USER_AND_ACCESS.CHECK_EMAIL_EXISTS,
      reqObj,
    );
  };
};

export const saveAssignPropertyAndAccesStep2APIAction = (
  reqObj,
  // isAddRequest,
  // userId,
) => {
  return () => {
    let requestQuery = '';
    // if (isAddRequest) {
    //   requestQuery = fetchClient.post(
    //     apiPaths.API.USER_AND_ACCESS.SAVE_ASSIGN_PROPERTY_AND_ACCESS_STEP2,
    //     reqObj,
    //   );
    // } else {
    requestQuery = fetchClient.post(
      `${apiPaths.API.USER_AND_ACCESS.SAVE_ASSIGN_PROPERTY_AND_ACCESS_STEP2}`,
      reqObj,
    );
    // }
    return requestQuery;
  };
};

export const saveAssignCustomerAndBrandStep3APIAction = reqObj => {
  return () => {
    let requestQuery = '';

    requestQuery = fetchClient.post(
      `${apiPaths.API.USER_AND_ACCESS.SAVE_ASSIGN_CUSTOMER_AND_BRAND_STEP3}`,
      reqObj,
    );
    // }
    return requestQuery;
  };
};
export const saveAssignDepartmentAndRoleStep4APIAction = (
  reqObj,
  isAddRequest,
  // userId,
) => {
  return () => {
    let requestQuery = '';
    if (isAddRequest) {
      const modifiedReqObj = {
        isUpdate: false,
        isNewDeptRolesAdded: reqObj.isNewDeptRolesAdded,
        userId: reqObj.userId,
        userDepartmentsAndRoles: reqObj.userDepartmentsAndRoles,
      };
      requestQuery = fetchClient.post(
        apiPaths.API.USER_AND_ACCESS.SAVE_ASSIGN_DEPARTMENT_AND_ROLES_STEP4,
        modifiedReqObj,
      );
    } else {
      const modifiedReqObj = {
        isUpdate: true,
        isNewDeptRolesAdded: reqObj.isNewDeptRolesAdded,
        userId: reqObj.userId,
        userDepartmentsAndRoles: reqObj.userDepartmentsAndRoles,
      };
      requestQuery = fetchClient.post(
        `${apiPaths.API.USER_AND_ACCESS.SAVE_ASSIGN_DEPARTMENT_AND_ROLES_STEP4}`,
        modifiedReqObj,
      );
    }
    return requestQuery;
  };
};

export const deletePropertyAndAccessAssignedAPIAction = reqObj => {
  return () => {
    return fetchClient.put(
      `${apiPaths.API.USER_AND_ACCESS.DELETE_PROPERTY_AND_ACCESS}`,
      reqObj,
    );
  };
};

export const deleteCustomerAndBrandAssignedAPIAction = assignedCustomerId => {
  return () => {
    return fetchClient.put(
      `${apiPaths.API.USER_AND_ACCESS.DELETE_CUSTOMER_AND_BRAND}`,
      { userPropertyAccessId: assignedCustomerId },
    );
  };
};
export const deleteDepartmentAndRoleAssignedAPIAction = assignedDepartmentId => {
  return () => {
    return fetchClient.put(
      `${apiPaths.API.USER_AND_ACCESS.DELETE_DEPARTMENT_AND_ROLES}`,
      {
        userDepartmentRoleId: assignedDepartmentId,
      },
    );
  };
};

export const getUserDataAPIAction = userId => {
  return () => {
    return fetchClient.get(
      `${apiPaths.API.USER_AND_ACCESS.GET_USER_DATA}/${userId}`,
    );
  };
};

export const removeAccessOnUserTypeChangeApiAction = userId => {
  return () => {
    return fetchClient.put(
      apiPaths.API.USER_AND_ACCESS.REMOVE_ACCESS_ON_USER_TYPE_CHANGE,
      { userId },
    );
  };
};
