import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/Layout/Layout';
import DashboardCard from './DashboardCard/DashboardCard';
import settingsIcon from '../../images/dashboard/settings/settings.png';
import usersIcon from '../../images/dashboard/users/users.png';
import stepsIcon from '../../images/dashboard/steps/steps.png';
import workflowsIcon from '../../images/dashboard/workflow/workflow.png';
import formIcon from '../../images/dashboard/form/form.png';
import adminIcon from '../../images/dashboard/admin/admin.png';
import constants from '../../utils/constants';

// styles
import './Home.scss';

function Home() {
  const dashoardItems = [
    {
      icon: <img alt="Property setup" src={settingsIcon} />,
      title: 'property setup',
      subtitle: 'Add / Update Property settings, Attributes and Configurations',
      link: constants.ROUTE.PROPERTY_SETUP.PROPERTY_SETUP,
    },
    {
      icon: <img alt="user and access" src={usersIcon} />,
      title: 'user and access',
      subtitle:
        'Add / Update Department, Roles, Users, Provide and Maintain access and Configurations',
      link: constants.ROUTE.USER_AND_ACCESS.LIST,
    },
    {
      icon: <img alt="phases and more" src={stepsIcon} />,
      title: 'phases and more',
      subtitle: 'Add / Update Phases, Sub-phases and pre-requisites',
      link: constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PHASES,
    },
    {
      icon: <img alt="workflows" src={workflowsIcon} />,
      title: 'workflows',
      subtitle: 'Add / Update and Configure workflows based on case types',
      link: constants.ROUTE.WORKFLOWS.LIST,
    },
    {
      icon: <img alt="form" src={formIcon} />,
      title: 'forms (design phase)',
      subtitle:
        'Add / Update and Configure Design forms and Files to be  submitted during each design sub-phase',
      link: constants.ROUTE.DESIGN_FORMS.LIST,
    },
    {
      icon: <img alt="admin roles" src={adminIcon} />,
      title: 'admin roles',
      subtitle:
        'Add / Update Property admins and request for configuration changes in Accio',
      link: constants.ROUTE.ADMIN_ROLES.LIST,
    },
  ];
  return (
    <Layout>
      <div className="dashboard-container">
        {dashoardItems.map(item => (
          <DashboardCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            link={item.link}
          />
        ))}
      </div>
    </Layout>
  );
}

export default connect()(Home);
