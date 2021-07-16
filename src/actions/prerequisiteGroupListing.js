// import moment from 'moment';
import {
  SET_PREREQUISITE_GROUP_LIST,
  ADD_PREREQUISITE_TO_GROUP,
  SET_TOTAL_GROUPLIST_COUNT,
  SET_PREREQUISITE_GROUP_LIST_LOADING,
} from '../types';

import fetchClient from '../utils/axiosConfig';
import apiPaths from '../utils/constants';
import { getFormatedDate } from '../utils/utils';

export const setGroupListCount = groupListCount => ({
  type: SET_TOTAL_GROUPLIST_COUNT,
  groupListCount,
});

export const setPrerequisiteGroupList = groupList => ({
  type: SET_PREREQUISITE_GROUP_LIST,
  groupList,
});

export const setPrerequisiteGroupListLoading = isLoading => ({
  type: SET_PREREQUISITE_GROUP_LIST_LOADING,
  isLoading,
});

export const getPrerequisiteGroupListApiAction = (page, limit, searchText) => {
  return dispatch => {
    // console.log('calling group list api');
    /* Api calling for getting the prerequisite group list data will be here */
    dispatch(setPrerequisiteGroupListLoading(true));
    const queryParams = {
      params: {
        page,
        limit,
        search: searchText,
      },
    };
    fetchClient
      .get(apiPaths.API.PREREQUISITE_GROUP.PREREQUISITE_GROUP_LIST, queryParams)
      .then(res => {
        const apiData = res.data;
        const groupList = [];
        apiData.data[0].preRequisiteGroups.map(prerequisiteGroup => {
          const group = {};
          group.id = prerequisiteGroup.refId;
          // if (prerequisiteGroup.names.length > 0) {
          //   group.groupName = prerequisiteGroup.names[0].name;
          // }
          group.groupName = prerequisiteGroup.names[0].name;
          group.updatedBy = prerequisiteGroup.editor.name;
          group.updatedOn = getFormatedDate(prerequisiteGroup.updatedAt);
          group.isAddedInWorkFlow = prerequisiteGroup.isEngagedToWorkflow;

          groupList.push(group);
          return groupList;
        });

        dispatch(setGroupListCount(apiData.data[0].totalCount));
        dispatch(setPrerequisiteGroupList(groupList));
      })
      .catch(err => {
        if (err) {
          // console.log(err, 'dsd');
          // dispatch(setPrerequisiteGroupList([]));
        }
      });
  };
};

// Action

export const addPrerequisiteToGroup = addedPrerequisite => ({
  type: ADD_PREREQUISITE_TO_GROUP,
  addedPrerequisite,
});

export const PRGroupDetailsApiAction = prerequisiteGroupId => {
  return () => {
    return fetchClient.get(
      apiPaths.API.PREREQUISITE_GROUP.PREREQUISITE_GROUP_DETAILS +
        prerequisiteGroupId,
    );
  };
};

export const addNewPRGroupApiAction = reqObj => {
  return () => {
    /* API call to add Prerequisite */

    return fetchClient.post(
      apiPaths.API.PREREQUISITE_GROUP.PREREQUISITE_GROUP_ADD,
      reqObj,
    );
  };
};

// // Action
export const editPRGroupApiAction = (prerequisiteGroupId, reqObj) => {
  /* API call to add Prerequisite */
  return () => {
    return fetchClient.put(
      apiPaths.API.PREREQUISITE_GROUP.PREREQUISITE_GROUP_EDIT +
        prerequisiteGroupId,
      reqObj,
    );
  };
};

export const deletePRGroupApiAction = prerequisiteGroupId => {
  /* API call to add Prerequisite */
  return () => {
    return fetchClient.put(
      apiPaths.API.PREREQUISITE_GROUP.PREREQUISITE_GROUP_DELETE +
        prerequisiteGroupId,
    );
  };
};

export const copyPRGroupApiAction = prerequisiteGroupId => {
  /* API call to add Prerequisite */
  return () => {
    return fetchClient.post(
      apiPaths.API.PREREQUISITE_GROUP.PREREQUISITE_GROUP_COPY +
        prerequisiteGroupId,
    );
  };
};
