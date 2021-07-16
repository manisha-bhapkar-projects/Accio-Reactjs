// import axios from 'axios';
import apiPaths from '../../utils/constants';
import fetchClient from '../../utils/axiosConfig';

export const getUserPropertyListWithCMApiAction = () => {
  return () => {
    return fetchClient.get(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.USER_PROPERTY_LIST,
    );
    // return axios.get('../lists.json');
  };
};

export const getCustomerListCaseDetailsApiAction = propertyId => {
  // export const getCustomerListCaseDetailsApiAction = () => {
  return () => {
    const queryParams = {
      params: {
        propertyId,
      },
    };
    return fetchClient.get(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.USER_CUSTOMER_LIST,
      queryParams,
    );
    // return axios.get('../lists.json');
  };
};

export const getBrandListCaseDetailsApiAction = customerId => {
  // export const getBrandListCaseDetailsApiAction = () => {
  return () => {
    const queryParams = {
      params: {
        customerId,
      },
    };
    return fetchClient.get(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.USER_BRANDS_LIST,
      queryParams,
    );
    // return axios.get('../lists.json');
  };
};

export const getAmendmentTypeListApiAction = () => {
  return () => {
    return fetchClient.get(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS
        .AMENDMENT_TYPES_LIST,
    );
    // return axios.get('../lists.json');
  };
};

export const getUnitIDsCaseDetailsApiAction = propertyId => {
  // export const getUnitIDsCaseDetailsApiAction = () => {
  return () => {
    const queryParams = {
      params: {
        propertyId,
      },
    };
    return fetchClient.get(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.UNIT_IDS_LIST,
      queryParams,
    );
    // return axios.get('../lists.json');
  };
};

export const getPropertyPhasesListApiAction = propertyId => {
  // export const getPropertyPhasesListApiAction = () => {
  return () => {
    return fetchClient.get(
      `${apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.PROPERTY_PHASE_LIST}/${propertyId}`,
    );
    // return axios.get('../lists.json');
  };
};

export const getPropertyUOMApiAction = propertyId => {
  // export const getPropertyUOMApiAction = () => {
  return () => {
    return fetchClient.get(
      `${apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.PROPERTY_UOM_LIST}/${propertyId}`,
    );
    //  return axios.get('../lists.json');
  };
};

export const createCaseApiAction = reqObj => {
  return () => {
    return fetchClient.post(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.CREATE_CASE,
      reqObj,
    );
  };
};

export const getCaseDetailsApiAction = caseId => {
  // export const getCaseDetailsApiAction = () => {
  return () => {
    return fetchClient.get(
      `${apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.GET_CASE_DETAILS}/${caseId}`,
    );
    // return axios.get('../lists.json');
  };
};

export const deleteUnitDetailsApiAction = unitId => {
  return () => {
    return fetchClient.put(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.DELETE_UNIT_DETAILS,
      { propertyCaseUnitId: unitId },
    );
  };
};

export const updateCasePropertyDetailsApiAction = reqObj => {
  return () => {
    return fetchClient.put(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS
        .UPDATE_CASE_PROPERTY_DETAILS,
      reqObj,
    );
  };
};

export const updateLeaseDetailsApiAction = reqObj => {
  return () => {
    return fetchClient.put(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS
        .UPDATE_LEASE_DETAILS,
      reqObj,
    );
  };
};

export const updateUnitDetailsApiAction = reqObj => {
  return () => {
    return fetchClient.put(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS.UPDATE_UNIT_DETAILS,
      reqObj,
    );
  };
};

export const updateMilestoneDatesApiAction = reqObj => {
  return () => {
    return fetchClient.put(
      apiPaths.BUSINESS.API.NEW_AND_UNASSIGNED.CASE_DETAILS
        .UPDATE_MILESTONE_DATES,
      reqObj,
    );
  };
};
