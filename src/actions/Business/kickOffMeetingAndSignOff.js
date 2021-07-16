/**
 *
 */

import fetchClient from '../../utils/axiosConfig';

import constants from '../../utils/constants';

// uploadSignedDocument:
export const uploadSignedDocument = (data, option) => {
  return fetchClient.post(
    `${constants.BUSINESS.API.KICK_OFF_MEETING_AND_SIGN_OFF.UPLOAD_SIGNED_DOCUMENT}`,
    data,
    option,
  );
};

// getUploadedFile
export const getUploadedFile = () => {
  //  const queryParams = {
  //   params: {
  //     uType: _userType,
  //     caseId: _caseId,
  //   },
  // };
  return fetchClient.get(
    `${constants.BUSINESS.API.KICK_OFF_MEETING_AND_SIGN_OFF.UPLOAD_SIGNED_DOCUMENT}`,
  );
};

// getMeetingDetails
export const getMeetingDetails = () => {
  return fetchClient.get(
    `${constants.BUSINESS.API.KICK_OFF_MEETING_AND_SIGN_OFF.MEETING}`,
  );
};

// getMeetingAttendee
export const getMeetingAttendee = (_meetingId, _caseId) => {
  const queryParams = {
    params: {
      meetingId: _meetingId,
      caseId: _caseId,
    },
  };
  return fetchClient.get(
    `${constants.BUSINESS.API.KICK_OFF_MEETING_AND_SIGN_OFF.MEETING_ATTENDEE}`,
    queryParams,
  );
};

// saveAttendee
export const saveAttendee = requestData => {
  return fetchClient.post(
    constants.BUSINESS.API.KICK_OFF_MEETING_AND_SIGN_OFF.ADD_ATTENDEE,
    requestData,
  );
};

// add / update notes
export const saveNotesData = (notesData, isAddRequest) => {
  let requestQuery = '';
  const api = constants.BUSINESS.API.KICK_OFF_MEETING_AND_SIGN_OFF.ADD_NOTES;
  if (isAddRequest) {
    requestQuery = fetchClient.post(api, notesData);
  } else {
    requestQuery = fetchClient.put(api, notesData);
  }
  return requestQuery;
};
