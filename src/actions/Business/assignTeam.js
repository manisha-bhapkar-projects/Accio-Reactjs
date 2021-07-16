/**
 * Assign team
 */
import fetchClient from '../../utils/axiosConfig';

import constants from '../../utils/constants';

// getUsersType: for fetch users types with id
export const getUsersType = () => {
  return fetchClient.get(
    `${constants.BUSINESS.API.ASSIGN_TEAM.GET_USERS_TYPE}`,
  );
};

// getTeamMembers
export const getTeamMembers = (_userType, _caseId) => {
  const queryParams = {
    params: {
      uType: _userType,
      caseId: _caseId,
    },
  };
  return fetchClient.get(
    `${constants.BUSINESS.API.ASSIGN_TEAM.GET_TEAM}`,
    queryParams,
  );
};

// getRolesPropertyAndUserTypeWise
export const getRolesPropertyAndUserTypeWise = _userType => {
  // const queryParams = {
  //     params: {
  //       page: _page,
  //       limit: 10,
  //       search: _search,
  //     },
  //   };
  return fetchClient.get(
    `${constants.BUSINESS.API.ASSIGN_TEAM.GET_ROLES + _userType}`,
    // {
    //   headers: {
    //     'Accept-Language': _lang || 'en',
    //   },
    // },
  );
};

// getUsersRoleWise
export const getUsersRoleWise = _role => {
  return fetchClient.get(
    `${constants.BUSINESS.API.ASSIGN_TEAM.GET_USERS + _role}`,
    // {
    //   headers: {
    //     'Accept-Language': _lang || 'en',
    //   },
    // },
  );
};

// addTeamMembers
export const addTeamMembers = requestData => {
  return fetchClient.post(
    constants.BUSINESS.API.ASSIGN_TEAM.ADD_UPDATE_TEAM,
    requestData,
  );
};

// getPreApprovedContractors
export const getPreApprovedContractors = (page, limit, searchText, all) => {
  /* Api calling for getting the pre approved contractors here */

  const queryParams = {
    params: {
      page,
      limit,
      search: searchText,
      all,
    },
  };
  return fetchClient.get(
    constants.BUSINESS.API.ASSIGN_TEAM.GET_PRE_APPROVED_CONTRACTORS,
    queryParams,
  );
};

// deleteTeamMember
export const deleteTeamMember = _userId => {
  return fetchClient.delete(
    constants.BUSINESS.API.ASSIGN_TEAM.DELETE_TEAM_MEMBER + _userId,
  );
};
