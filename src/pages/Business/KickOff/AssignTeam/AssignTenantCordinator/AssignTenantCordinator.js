import React from 'react';
import './AssignTenantCordinator.scss';
import AssignTeamMembers from '../AssignTeamMembers';

const AssignTenantCordinator = props => {
  return (
    <AssignTeamMembers
      {...props}
      action="assign-tenant-cordinator"
      userType="owner"
      isAssisgnTenantCordinator
    />
  );
};

export default AssignTenantCordinator;
