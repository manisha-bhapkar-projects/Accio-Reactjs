import fetchClient from '../../utils/axiosConfig';
import apiPaths from '../../utils/constants';
import { getFormatedDate } from '../../utils/utils';

import {
  GET_PHASEWISE_CASE_DETAILS,
  SET_CASE_LIST_DETAILS,
  SET_CASE_LIST_DETAILS_TOTAL,
  SET_CASE_LIST_DETAILS_IS_LOADING,
  SET_USER_ACCESS_PROPERTIES,
  SET_CUSTOMER_FILTER_LIST,
  SET_BRAND_FILTER_LIST,
  SET_UNITS_LIST,
  SET_CASE_STATUS_LIST,
  SET_PROPERTY_PHASE_LIST,
  SET_CASE_TYPE_LIST,
  SET_ASSIGNED_TO_USER_LIST,
  SET_IS_CASE_MANIPULATION_ACCESS,
  SET_IS_ALL_PROPERTY_LICENSE_SUSPENDED,
} from '../../types';
// import {
//  // phaseData,
// //  caseListDetails,
//   // propertyList,
//   // customerList,
//   // brandList,
//   // unitsList,
//   // caseStatusList,
//   // propertyPhaseList,
//   // // caseTypeList,
//   // assignedToUserList,
// } from '../../utils/DemoData/caselisting';

export const setPhaseWiseCaseDetails = list => ({
  type: GET_PHASEWISE_CASE_DETAILS,
  list,
});

export const getPhaseWiseCaseDetailsAPIAction = () => {
  return dispatch => {
    fetchClient
      .get(apiPaths.BUSINESS.API.CASE_LISTING.PHASEWISE_LIST_DETAILS)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          const phaseWiseList = [];
          apiData.forEach(phase => {
            // console.log(Object.keys(phase), 'skdfgdjsfggj');
            if (
              Object.keys(phase).includes('onHold') &&
              Object.keys(phase).length === 1
            ) {
              const phaseDataObj = {
                onHold: phase.onHold,
              };
              phaseWiseList.push(phaseDataObj);
            } else {
              const phaseDataObj = {
                onTrack: phase.onTrack,
                delayed: phase.delayed,
                phaseName: phase.phaseName,
                phaseId: phase.phaseId,
              };
              phaseWiseList.push(phaseDataObj);
            }

            dispatch(setPhaseWiseCaseDetails(phaseWiseList));
          });
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setPhaseWiseCaseDetails([]));
        }
      });
    // dispatch(setPhaseWiseCaseDetails(phaseData));
  };
};

export const setCaseListDetails = list => ({
  type: SET_CASE_LIST_DETAILS,
  list,
});
export const setCaseListDetailsTotal = total => ({
  type: SET_CASE_LIST_DETAILS_TOTAL,
  total,
});
export const setCaseListDetailsIsLoading = isLoading => ({
  type: SET_CASE_LIST_DETAILS_IS_LOADING,
  isLoading,
});

export const setIsCaseManipulationAccess = isAccess => ({
  type: SET_IS_CASE_MANIPULATION_ACCESS,
  isAccess,
});

export const setIsAllPropertyLicenseSuspended = isLicenseSuspended => ({
  type: SET_IS_ALL_PROPERTY_LICENSE_SUSPENDED,
  isLicenseSuspended,
});

export const getCaseListDetailsAPIAction = (reqObj, page, limit) => {
  // export const getCaseListDetailsAPIAction = () => {
  return dispatch => {
    const queryParams = {
      params: {
        page,
        limit,
      },
    };

    fetchClient
      .post(
        apiPaths.BUSINESS.API.CASE_LISTING.CASE_LIST_DETAILS,
        reqObj,
        queryParams,
      )
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data[0];
          const caseListTotal = apiData.total;
          const isCaseManipulationAccess = apiData.isCreateCaseAllowed;
          const isAllPropertyLicenseSuspended = apiData.noLicenceProperties;
          const listCaseDetails = apiData.cases;

          const modifiedListCaseDetails = [];

          listCaseDetails.forEach(caseRow => {
            const caseObj = {
              id: caseRow.caseId,
              caseNo: caseRow.caseNo,
              property: caseRow.propertyName,
              tenant: `${caseRow.customerName} (${caseRow.brandName})`,
              units: caseRow.propertyUnits,
              taskDueDate: getFormatedDate(caseRow.taskDueDate),
              taskStatus: caseRow.taskStatus,
              action: caseRow.taskAction,
              phase: caseRow.phaseName,
              caseStatus: caseRow.caseStatus,
              pendingWith: caseRow.pendingWith,
              isExpanded: false,
              pendingWithName: caseRow.userName,
              isAssignedToUser: caseRow.isAssignedToUser,
              actionKey: 'assign_tenant_coordinator',
            };

            modifiedListCaseDetails.push(caseObj);
          });
          dispatch(setCaseListDetailsIsLoading(true));
          dispatch(setCaseListDetails(modifiedListCaseDetails));
          dispatch(setCaseListDetailsTotal(caseListTotal));
          dispatch(setIsCaseManipulationAccess(isCaseManipulationAccess));
          dispatch(
            setIsAllPropertyLicenseSuspended(isAllPropertyLicenseSuspended),
          );
        }
      })
      .catch(() => {
        dispatch(setCaseListDetailsIsLoading(false));
        dispatch(setCaseListDetails([]));
        dispatch(setCaseListDetailsTotal(0));
      });
    // const modifiedCasedetails = [...caseListDetails];
    // // modifiedCasedetails.map(caseDetail => {
    // //   const modifiedCase = caseDetail;
    // //   modifiedCase.actionButtonItems = getActionItemsList(
    // //     caseDetail.isAssignedToUser,
    // //     caseDetail.action,
    // //   );
    // //   return modifiedCase;
    // // });
    // dispatch(setCaseListDetailsIsLoading(true));
    // dispatch(setCaseListDetails(modifiedCasedetails));
    // dispatch(setCaseListDetailsTotal(caseListDetails.length));
    // dispatch(setIsCaseManipulationAccess(true));
    // dispatch(setIsAllPropertyLicenseSuspended(false));
  };
};

export const setUserAccessProperties = list => ({
  type: SET_USER_ACCESS_PROPERTIES,
  list,
});

export const getUserAccessPropertiesApiAction = filter => {
  return dispatch => {
    const queryParams = {
      params: {
        filter,
      },
    };

    fetchClient
      .get(
        apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS
          .USER_PROPERTY_LIST,
        queryParams,
      )
      .then(res => {
        if (res.data.success) {
          const apiPropertyData = res.data.data;
          const modifiedPropertyList = [];
          apiPropertyData.forEach(property => {
            const modifiedPropObj = {
              id: property.propertyId,
              value: property.propertyName,
            };
            modifiedPropertyList.push(modifiedPropObj);
          });

          dispatch(setUserAccessProperties(modifiedPropertyList));
        }
      })

      .catch(err => {
        if (err) {
          dispatch(setUserAccessProperties([]));
        }
      });

    // dispatch(setUserAccessProperties(propertyList));
  };
};

export const setCustomerList = list => ({
  type: SET_CUSTOMER_FILTER_LIST,
  list,
});

export const getCustomerListApiAction = propertyId => {
  return dispatch => {
    const queryParams = {
      params: {
        propertyId,
      },
    };

    fetchClient
      .get(
        apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS
          .USER_CUSTOMER_LIST,
        queryParams,
      )
      .then(res => {
        if (res.data.success) {
          const apiCustomerData = res.data.data;
          const modfiedCustomerData = [];
          apiCustomerData.forEach(customer => {
            const custObj = {
              id: customer.customerId,
              value: customer.customerName,
            };
            modfiedCustomerData.push(custObj);
          });
          dispatch(setCustomerList(modfiedCustomerData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setCustomerList([]));
        }
      });

    // dispatch(setCustomerList(customerList));
  };
};

export const setBrandList = list => ({
  type: SET_BRAND_FILTER_LIST,
  list,
});

export const getBrandListApiAction = customerId => {
  return dispatch => {
    const queryParams = {
      params: {
        customerId,
      },
    };
    fetchClient
      .get(
        apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.USER_BRANDS_LIST,
        queryParams,
      )
      .then(res => {
        if (res.data.success) {
          const apiBrandData = res.data.data;
          const modfiedBrandData = [];
          apiBrandData.forEach(brand => {
            const brandObj = {
              id: brand.brandId,
              value: brand.brandName,
            };
            modfiedBrandData.push(brandObj);
          });
          dispatch(setBrandList(modfiedBrandData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setBrandList([]));
        }
      });

    //  dispatch(setBrandList(brandList));
  };
};

export const setUnitsList = list => ({
  type: SET_UNITS_LIST,
  list,
});

export const getUnitsListApiAction = propertyId => {
  return dispatch => {
    const queryParams = {
      params: {
        propertyId,
      },
    };

    fetchClient
      .get(
        apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.UNIT_IDS_LIST,
        queryParams,
      )
      .then(res => {
        if (res.data.success) {
          const apiUnitIdData = res.data.data;
          const modfiedUnitIdData = [];
          apiUnitIdData.forEach(unit => {
            const unitIdObj = {
              id: unit.unitId,
              value: unit.unitName,
              //  unitType: { id: unit.unitTypeId, value: unit.unitTypeName },
              //  unitSize: unit.unitSize,
            };
            modfiedUnitIdData.push(unitIdObj);
          });
          dispatch(setUnitsList(modfiedUnitIdData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setUnitsList([]));
        }
      });

    // dispatch(setUnitsList(unitsList));
  };
};

export const setCaseStatusList = list => ({
  type: SET_CASE_STATUS_LIST,
  list,
});

export const getCaseStatusListApiAction = () => {
  return dispatch => {
    fetchClient
      .get(apiPaths.BUSINESS.API.CASE_LISTING.CASE_STATUS)
      .then(res => {
        const apiData = res.data.data;
        const modfieCaseStatusData = [];
        apiData.forEach(caseStatus => {
          const caseStatusObj = {
            id: caseStatus.caseStatusId,
            value: caseStatus.caseStatus,
          };
          modfieCaseStatusData.push(caseStatusObj);
        });
        dispatch(setCaseStatusList(modfieCaseStatusData));
      })
      .catch(err => {
        if (err) {
          dispatch(setCaseStatusList([]));
        }
      });

    // dispatch(setCaseStatusList(caseStatusList));
  };
};

export const setPropertyPhaseList = list => ({
  type: SET_PROPERTY_PHASE_LIST,
  list,
});

export const getPropertyPhaseListApiAction = propertyId => {
  return dispatch => {
    fetchClient
      .get(
        `${apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.PROPERTY_PHASE_LIST}/${propertyId}`,
      )
      .then(res => {
        if (res.data.success) {
          const apiPhaseData = res.data.data;
          const modifiedPhaseList = [];
          apiPhaseData.forEach(phase => {
            const phaseObj = {
              id: phase.phaseId,
              value: phase.propertyPhaseName,
              phaseSequence: phase.propertyPhaseSequence,
            };
            modifiedPhaseList.push(phaseObj);
          });
          dispatch(setPropertyPhaseList(modifiedPhaseList));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setPropertyPhaseList([]));
        }
      });

    // dispatch(setPropertyPhaseList(propertyPhaseList));
  };
};

export const setCaseTypeList = list => ({
  type: SET_CASE_TYPE_LIST,
  list,
});

export const getCaseTypeListApiAction = () => {
  return dispatch => {
    fetchClient
      .get(apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.CASE_TYPE_LIST)
      .then(res => {
        const apiData = res.data.data;
        const modifiedCaseTypeList = [];
        apiData.forEach(caseType => {
          const caseTypeObj = {
            id: caseType.caseTypeId,
            value: caseType.caseTypeName,
          };
          modifiedCaseTypeList.push(caseTypeObj);
        });
        dispatch(setCaseTypeList(modifiedCaseTypeList));
      })
      .catch(err => {
        if (err) {
          dispatch(setCaseTypeList([]));
        }
      });

    // dispatch(setCaseTypeList(caseTypeList));
  };
};

export const setAssignedToUserList = list => ({
  type: SET_ASSIGNED_TO_USER_LIST,
  list,
});

export const getAssignedToUserListApiAction = () => {
  return dispatch => {
    fetchClient
      .get(apiPaths.BUSINESS.API.CASE_LISTING.USER_TYPES)
      .then(res => {
        const apiData = res.data.data;
        const modifiedUserTypeList = [];
        apiData.forEach(userType => {
          const userTypeObj = {
            id: userType.uuid,
            value: userType.user_type,
          };
          modifiedUserTypeList.push(userTypeObj);
        });
        dispatch(setAssignedToUserList(modifiedUserTypeList));
      })
      .catch(err => {
        if (err) {
          dispatch(setAssignedToUserList([]));
        }
      });

    // dispatch(setAssignedToUserList(assignedToUserList));
  };
};

export const getIsCaseManipulateAccessApiAction = () => {
  return () => {
    // return fetchClient.get(apiPaths.API.CASE_LISTING.IS_CASE_MANIPULATE_ACCESS);
  };
};
