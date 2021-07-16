import React from 'react';
import './AssignTenantTeamMembers.scss';
import AssignTeamMembers from '../AssignTeamMembers';

const AssignTenantTeamMembers = props => {
  return <AssignTeamMembers {...props} userType="tenant" />;
};

export default AssignTenantTeamMembers;
