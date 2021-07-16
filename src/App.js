import React, { useEffect } from 'react';
import { Router, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// i18n
import './utils/i18n';
import { bindActionCreators } from 'redux';

import './App.scss';
import { ToastContainer } from 'react-toastify';
import {
  getUserLanguagesListAPIAction,
  // getIntervalUserLanguagesListAPIAction,
} from './actions/commonActions';

import PrivateRoute from './utils/routes/PrivateRoute';
import PublicRoute from './utils/routes/PublicRoute';
import history from './utils/history';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import RecoveryLinkInfo from './pages/ForgotPassword/RecoveryLinkInfo';
import ChangePassword from './pages/ForgotPassword/ChangePassword';
import PreRequisiteListing from './pages/PreRequisite/PreRequisiteListing';
import PreRequisiteGroupListing from './pages/PreRequisite/PreRequisiteGroupListing/PreRequisiteGroupListing';
import AddUpdatePreRequisites from './pages/PreRequisite/AddUpdatePreRequisites/AddUpdatePreRequisites';
import AddUpdatePreRequisiteGroup from './pages/PreRequisite/AddUpdatePreRequisiteGroup/AddUpdatePreRequisiteGroup';

// Phases and More
import AddOrUpdatePhases from './pages/PhasesAndMore/AddOrUpdatePhases/AddOrUpdatePhases';
import AddOrUpdateSubPhases from './pages/PhasesAndMore/AddOrUpdateSubPhases/AddOrUpdateSubPhases';
import UploadData from './pages/UploadData/UploadData';

// WorkFlows
import WorkFlows from './pages/WorkFlows/WorkFlowsListing/WorkFlowsListing';
import LayoutWithSidebar from './components/Layout/WithSidebar/LayoutWithSidebar';
import SetupWorkFlows from './pages/WorkFlows/SetupWorkFlows/SetupWorkFlows';
import UserListing from './pages/UserAndAccess/UserListing/UserListing';
import Auth from './components/HOC/Auth';
import LanguageWrapper from './components/HOC/LanguageWrapper';
import constants from './utils/constants';

// DesignForms
import DesignFormsListing from './pages/DesignForms/DesignFormsListing/DesignFormsListing';
import SetupDesignForm from './pages/DesignForms/SetupDesignForm/SetupDesignForm';
import UserAccessSetup from './pages/UserAndAccess/UserAccessSetup/UserAccessSetup';
import Dashboard from './pages/Business/Dashboard/Dashboard';

// HOC
import CardHeader from './components/CardHeader/CardHeader';

/** Business Pages */
import ScheduleKickOffMeeting from './pages/Business/KickOff/ScheduleKickOffMeeting/ScheduleKickOffMeeting';
import AddOrUpdateMilestones from './pages/Business/KickOff/AddOrUpdateMilestones/AddOrUpdateMilestones';
import AssignTenantCordinator from './pages/Business/KickOff/AssignTeam/AssignTenantCordinator/AssignTenantCordinator';
import AssignOwnerTeamMembers from './pages/Business/KickOff/AssignTeam/AssignOwnerTeamMembers/AssignOwnerTeamMembers';
import AssignTenantTeamMembers from './pages/Business/KickOff/AssignTeam/AssignTenantTeamMembers/AssignTenantTeamMembers';
import KickOffMeetingAndSignOff from './pages/Business/KickOff/KickOffMeetingAndSignOff/KickOffMeetingAndSignOff';
import SignOff from './pages/Business/KickOff/KickOffMeetingAndSignOff/SignOff/SignOff';

import NewAndUnassignedCaseDetails from './pages/Business/NewAndUnassignedCaseDetails/NewAndUnassignedCaseDetails';
import { setpropappStatus } from './actions/headerAction';

import {
  getAppAccessList,
  storeUserAppStatus,
  getUserAppStatus,
} from './utils/storage';

function App({
  getUserLanguagesListAPI,
  // getIntervalUserLanguagesListAPI,
  propertyUserAppStatus,
  setpropappStatusAction,
}) {
  useEffect(() => {
    try {
      if (getUserAppStatus() !== propertyUserAppStatus) {
        const accessList = getAppAccessList();
        if (accessList.includes('admin')) {
          setpropappStatusAction(constants.STORAGE.AUTH.USER_APP_TYPE_ADMIN);
          storeUserAppStatus(constants.STORAGE.AUTH.USER_APP_TYPE_ADMIN);
        } else if (
          accessList.includes('full') ||
          accessList.includes('case') ||
          accessList.includes('workflow')
        ) {
          setpropappStatusAction(constants.STORAGE.AUTH.USER_APP_TYPE_BUSINESS);
          storeUserAppStatus(constants.STORAGE.AUTH.USER_APP_TYPE_BUSINESS);
        }
      }

      getUserLanguagesListAPI();
      //  getIntervalUserLanguagesListAPI();
    } catch (e) {
      // console.log(e);
    }
  }, []);

  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <PublicRoute
            restricted
            path={constants.ROUTE.LOGIN.SIGNUP}
            exact
            component={Login}
          />
          <PublicRoute
            restricted
            exact
            path={constants.ROUTE.LOGIN.FORGOT_PASSWORD}
            component={ForgotPassword}
          />
          {propertyUserAppStatus ===
          constants.STORAGE.AUTH.USER_APP_TYPE_ADMIN ? (
            <PrivateRoute
              path={constants.ROUTE.DASHBORD.DASHBORD}
              component={Home}
            />
          ) : (
            <PrivateRoute
              path={constants.ROUTE.DASHBORD.DASHBORD}
              component={Dashboard}
            />
          )}
          <PrivateRoute path="/linksentinfo/" component={RecoveryLinkInfo} />
          <PrivateRoute
            path={constants.ROUTE.LOGIN.CHANGE_PASSWORD}
            component={ChangePassword}
          />
          {/* {propertyUserAppStatus === constants.STORAGE.AUTH.USER_APP_TYPE_ADMIN ? (
            <PrivateRoute
              path={constants.ROUTE.DASHBORD.DASHBORD}
              component={Home}
            />
          ) : null} */}
          {/* Design Forms End */}
          <LayoutWithSidebar>
            <Switch>
              {propertyUserAppStatus ===
              constants.STORAGE.AUTH.USER_APP_TYPE_ADMIN ? (
                <>
                  <PrivateRoute
                    path={constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PHASES}
                    component={LanguageWrapper(AddOrUpdatePhases)}
                  />
                  <PrivateRoute
                    path={constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_SUBPHASES}
                    component={LanguageWrapper(AddOrUpdateSubPhases)}
                  />
                  <PrivateRoute
                    exact
                    path={constants.ROUTE.USER_AND_ACCESS.LIST}
                    component={UserListing}
                  />
                  <PrivateRoute
                    path={constants.ROUTE.USER_AND_ACCESS.USER_AND_ACCESS_SETUP}
                    component={UserAccessSetup}
                  />
                  <PrivateRoute
                    path={
                      constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE
                    }
                    component={PreRequisiteListing}
                    exact
                  />
                  <PrivateRoute
                    path={
                      constants.ROUTE.PHASES_AND_MORE
                        .ADD_UPDATE_PRE_REQUISITE_GROUP
                    }
                    component={PreRequisiteGroupListing}
                    exact
                  />
                  <PrivateRoute
                    path={constants.ROUTE.DESIGN_FORMS.LIST}
                    exact
                    component={Auth(DesignFormsListing)}
                  />
                  <PrivateRoute
                    path={constants.ROUTE.DESIGN_FORMS.CREATE_DESIGN}
                    exact
                    component={LanguageWrapper(SetupDesignForm)}
                  />
                  <PrivateRoute
                    path={constants.ROUTE.DESIGN_FORMS.EDIT_DESIGN}
                    exact
                    component={LanguageWrapper(SetupDesignForm)}
                  />

                  <PrivateRoute
                    path="/upload-data/"
                    component={Auth(UploadData)}
                  />

                  <PrivateRoute
                    path={
                      constants.ROUTE.PHASES_AND_MORE
                        .CREATE_ADD_UPDATE_PRE_REQUISITE
                    }
                    component={LanguageWrapper(AddUpdatePreRequisites)}
                  />
                  <PrivateRoute
                    path={
                      constants.ROUTE.PHASES_AND_MORE
                        .CREATE_ADD_UPDATE_PRE_REQUISITE_GROUP
                    }
                    component={LanguageWrapper(AddUpdatePreRequisiteGroup)}
                  />
                  <PrivateRoute
                    path={
                      constants.ROUTE.WORKFLOWS.LIST +
                      constants.ROUTE.WORKFLOWS.CREATE_SETUP_WORKFLOW
                    }
                    exact
                    component={SetupWorkFlows}
                  />
                  <PrivateRoute
                    path={
                      constants.ROUTE.WORKFLOWS.LIST +
                      constants.ROUTE.WORKFLOWS.EDIT_SETUP_WORKFLOW_ID
                    }
                    exact
                    component={SetupWorkFlows}
                  />
                  <PrivateRoute
                    path={constants.ROUTE.WORKFLOWS.LIST}
                    exact
                    component={WorkFlows}
                  />
                </>
              ) : (
                <>
                  <PrivateRoute
                    path={constants.BUSINESS.ROUTE.CASE_DETAILS.CASE_DETAILS}
                    exact
                    component={NewAndUnassignedCaseDetails}
                  />
                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.KICK_OFF.ADD_OR_UPDATE_MILESTONES
                    }
                    exact
                    component={AddOrUpdateMilestones}
                  />
                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.KICK_OFF
                        .SCHEDULE_KICK_OFF_MEETING
                    }
                    exact
                    component={ScheduleKickOffMeeting}
                  />
                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.KICK_OFF
                        .ASSIGN_OWNER_TEAM_MEMBERS
                    }
                    exact
                    component={AssignOwnerTeamMembers}
                  />
                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.KICK_OFF
                        .ASSIGN_TENANT_TEAM_MEMBERS
                    }
                    exact
                    component={AssignTenantTeamMembers}
                  />
                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.KICK_OFF
                        .KICK_OFF_MEETING_SIGN_OFF
                    }
                    exact
                    component={KickOffMeetingAndSignOff}
                  />
                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.NEW_AND_UNASSIGN
                        .ASSIGN_TENANT_CORDINATOR
                    }
                    component={AssignTenantCordinator}
                  />
                  <PrivateRoute
                    path={constants.BUSINESS.ROUTE.KICK_OFF.KICK_OFF_SIGN_OFF}
                    component={SignOff}
                  />
                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.SETUP_WORKFLOW.SETUP_WORKFLOW
                    }
                    exact
                    component={() => <CardHeader title="SETUP_WORKFLOW" />}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.DESIGN.INITIAL_CONCEPT_DESIGN
                    }
                    exact
                    component={() => (
                      <CardHeader title="INITIAL_CONCEPT_DESIGN" />
                    )}
                  />

                  <PrivateRoute
                    path={constants.BUSINESS.ROUTE.DESIGN.PRELIMINARY_DESIGN}
                    exact
                    component={() => <CardHeader title="PRELIMINARY_DESIGN" />}
                  />

                  <PrivateRoute
                    path={constants.BUSINESS.ROUTE.DESIGN.FINAL_DESIGN}
                    exact
                    component={() => <CardHeader title="FINAL_DESIGN" />}
                  />
                  <PrivateRoute
                    path={constants.BUSINESS.ROUTE.DESIGN.MEP_DETAILED_DESIGN}
                    exact
                    component={() => <CardHeader title="MEP_DETAILED_DESIGN" />}
                  />

                  <PrivateRoute
                    path={constants.BUSINESS.ROUTE.DESIGN.CLOSE_DESIGN}
                    exact
                    component={() => <CardHeader title="CLOSE_DESIGN" />}
                  />
                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.PRE_REQUISITES.PRE_REQUISITES
                    }
                    exact
                    component={() => <CardHeader title="PRE_REQUISITES" />}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
                        .UNIT_HANDOVER_AND_SIGNOFF
                    }
                    exact
                    component={() => (
                      <CardHeader title="UNIT_HANDOVER_AND_SIGNOFF" />
                    )}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
                        .GENERAL_INSOECTION_3PARTY
                    }
                    exact
                    component={() => (
                      <CardHeader title="GENERAL_INSOECTION_3PARTY" />
                    )}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
                        .ARCHITECTURAL_INSPECTION
                    }
                    exact
                    component={() => (
                      <CardHeader title="ARCHITECTURAL_INSPECTION" />
                    )}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
                        .MEP_INSPECTION
                    }
                    exact
                    component={() => <CardHeader title="MEP_INSPECTION" />}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
                        .FIRE_INSPECTION
                    }
                    exact
                    component={() => <CardHeader title="FIRE_INSPECTION" />}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
                        .FINAL_INSPECTION
                    }
                    exact
                    component={() => <CardHeader title="FINAL_INSPECTION" />}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
                        .CLOSE_UNIT_HANDOVER_AND_FITOUT
                    }
                    exact
                    component={() => (
                      <CardHeader title="CLOSE_UNIT_HANDOVER_AND_FITOUT" />
                    )}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_OPENING
                        .RISK_AND_SECURITY_INSPECTION
                    }
                    exact
                    component={() => (
                      <CardHeader title="RISK_AND_SECURITY_INSPECTION" />
                    )}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_OPENING
                        .HEALTH_AND_SAFETY_INSPECTION
                    }
                    exact
                    component={() => (
                      <CardHeader title="HEALTH_AND_SAFETY_INSPECTION" />
                    )}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_OPENING
                        .SEEK_APPROVAL_TO_TRADE
                    }
                    exact
                    component={() => (
                      <CardHeader title="SEEK_APPROVAL_TO_TRADE" />
                    )}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.UNIT_OPENING
                        .CLOSE_UNIT_OPENING_PHASE
                    }
                    exact
                    component={() => (
                      <CardHeader title="CLOSE_UNIT_OPENING_PHASE" />
                    )}
                  />

                  <PrivateRoute
                    path={
                      constants.BUSINESS.ROUTE.CLOSURE
                        .FINAL_PENDING_SNAG_LIST_CHECK
                    }
                    exact
                    component={() => (
                      <CardHeader title="FINAL_PENDING_SNAG_LIST_CHECK" />
                    )}
                  />

                  <PrivateRoute
                    path={constants.BUSINESS.ROUTE.CLOSURE.CLOSE_CASE}
                    exact
                    component={() => <CardHeader title="CLOSE_CASE" />}
                  />
                </>
              )}
            </Switch>
          </LayoutWithSidebar>
        </Switch>
      </Router>
      <ToastContainer />
    </div>
  );
}

App.propTypes = {
  getUserLanguagesListAPI: PropTypes.func.isRequired,
  // getIntervalUserLanguagesListAPI: PropTypes.func.isRequired,
  propertyUserAppStatus: PropTypes.string.isRequired,
  setpropappStatusAction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  propertyUserAppStatus: state.header.propertyUserAppStatus,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserLanguagesListAPI: getUserLanguagesListAPIAction,
      // getIntervalUserLanguagesListAPI: getIntervalUserLanguagesListAPIAction,
      setpropappStatusAction: setpropappStatus,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(App);
