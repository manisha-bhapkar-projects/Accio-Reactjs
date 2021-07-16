import {
  SET_PREREQUISITE_LIST,
  SET_PREREQUISITE_LIST_LOADING,
  SET_TOTAL_LIST_COUNT,
} from '../types';

import apiPaths from '../utils/constants';
import fetchClient from '../utils/axiosConfig';
import { getFormatedDate } from '../utils/utils';

export const setPrerequisiteListLoading = isLoading => ({
  type: SET_PREREQUISITE_LIST_LOADING,
  isLoading,
});
// Action
export const setPrerequisiteList = list => ({
  type: SET_PREREQUISITE_LIST,
  list,
});

export const setTotalListCount = count => ({
  type: SET_TOTAL_LIST_COUNT,
  count,
});

export const getPrerequisiteListApiAction = (page, limit, searchText, all) => {
  return dispatch => {
    /* Api calling for getting the prerequisite list data will be here */
    dispatch(setPrerequisiteListLoading(true));

    const queryParams = {
      params: {
        page,
        limit,
        search: searchText,
        all,
      },
    };
    fetchClient
      .get(apiPaths.API.PREREQUISITE.PREREQUISITE_LIST, queryParams)
      .then(res => {
        // console.log(res.data, 'everything good');
        const apiData = res.data;
        const list = [];
        apiData.data[0].preRequisites.forEach(rowData => {
          const prerequisiteObj = {};
          prerequisiteObj.id = rowData.refId;

          prerequisiteObj.updatedOn = getFormatedDate(rowData.updatedAt);
          prerequisiteObj.updatedBy = rowData.editor.name;
          prerequisiteObj.prerequisite = rowData.names[0].name; // update based on language if required
          prerequisiteObj.isPrerequisiteInPRGroup = rowData.isPreReqEngaged;
          if (prerequisiteObj.isPrerequisiteInPRGroup && rowData.groups) {
            const tempGroupArr = [];
            rowData.groups.forEach(groupItem => {
              tempGroupArr.push(groupItem.names[0].name); // update based on language if required
            });
            prerequisiteObj.prerequisiteInGroupArr = [...tempGroupArr];
          }

          list.push(prerequisiteObj);
        });
        dispatch(setTotalListCount(apiData.data[0].totalCount));
        dispatch(setPrerequisiteList(list));
      })
      .catch(err => {
        if (err) {
          // dispatch(setPrerequisiteList([]));
          // console.log(err, 'error fetching data');
        }
      });
  };
};

export const getPRFieldsAPIAction = () => {
  return () => {
    return fetchClient.get(apiPaths.API.PREREQUISITE.PREREQUISITE_FIELDS);
  };
};

export const getPRDetailsAPIAction = prerequisiteId => {
  return () => {
    return fetchClient.get(
      apiPaths.API.PREREQUISITE.PREREQUISITE_DETAILS + prerequisiteId,
    );
  };
};

export const addNewPRApiAction = reqObj => {
  return () => {
    /* API call to add Prerequisite */

    return fetchClient.post(apiPaths.API.PREREQUISITE.PREREQUISITE_ADD, reqObj);
  };
};

export const editPRApiAction = (prerequisiteId, reqObj) => {
  /* API call to add Prerequisite */
  return () => {
    return fetchClient.put(
      apiPaths.API.PREREQUISITE.PREREQUISITE_EDIT + prerequisiteId,
      reqObj,
    );
  };
};

export const deletePRApiAction = prerequisiteId => {
  return () => {
    return fetchClient.put(
      apiPaths.API.PREREQUISITE.PREREQUISITE_DELETE + prerequisiteId,
    );
  };
};

export const copyPRApiAction = prerequisiteId => {
  /* API call to add Prerequisite */
  return () => {
    return fetchClient.post(
      apiPaths.API.PREREQUISITE.PREREQUISITE_COPY + prerequisiteId,
    );
  };
};
