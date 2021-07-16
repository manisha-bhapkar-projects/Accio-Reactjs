import React from 'react';
import './AssignOwnerTeamMembers.scss';
import AssignTeamMembers from '../AssignTeamMembers';

const AssignOwnerTeamMembers = props => {
  return <AssignTeamMembers {...props} userType="owner" />;
};

export default AssignOwnerTeamMembers;
