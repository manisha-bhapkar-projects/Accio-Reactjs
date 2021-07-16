import labels from './labels';
import constants from '../constants';

export default {
  menuItems: [
    {
      phase: labels.MENU_ITEMS.CASE_DETAILS,
      id: 'kick_off',
      sequenceNo: 1,
      isEditable: true,
      status: 'completed',
      subphases: [],
      path: '/case-details', // use this path as subphases starting path if there is subPhases inside it
    },
    {
      phase: labels.MENU_ITEMS.NEW_AND_UNASSIGN.NEW_AND_UNASSIGN,
      status: '',
      id: 'new_and_unassign',
      sequenceNo: 1,
      isEditable: true,
      path: constants.BUSINESS.ROUTE.NEW_AND_UNASSIGN.NEW_AND_UNASSIGN,
      subphases: [
        {
          subphase: labels.MENU_ITEMS.NEW_AND_UNASSIGN.ASSIGN_TENANT_CORDINATOR,
          id: 'assign_tenant_cordinator',
          sequenceNo: 1,
          isEditable: true,
          status: 'inprogress',
          path:
            constants.BUSINESS.ROUTE.NEW_AND_UNASSIGN.ASSIGN_TENANT_CORDINATOR,
        },
      ],
    },
    {
      phase: labels.MENU_ITEMS.KICK_OF.KICK_OF,
      status: '',
      id: 'kick_off',
      sequenceNo: 1,
      isEditable: true,
      path: constants.BUSINESS.ROUTE.KICK_OFF.KICK_OF,
      subphases: [
        {
          subphase: labels.MENU_ITEMS.KICK_OF.ASSIGN_OWNER_TEAM_MEMBERS,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.KICK_OFF.ASSIGN_OWNER_TEAM_MEMBERS,
        },
        {
          subphase: labels.MENU_ITEMS.KICK_OF.ASSIGN_TENANT_TEAM_MEMBERS,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.KICK_OFF.ASSIGN_TENANT_TEAM_MEMBERS,
        },
        {
          subphase: labels.MENU_ITEMS.KICK_OF.ADD_OR_UPDATE_MILESTONES,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.KICK_OFF.ADD_OR_UPDATE_MILESTONES,
        },
        {
          subphase: labels.MENU_ITEMS.KICK_OF.SCHEDULE_KICK_OFF_MEETING,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.KICK_OFF.SCHEDULE_KICK_OFF_MEETING,
        },
        {
          subphase: labels.MENU_ITEMS.KICK_OF.KICK_OFF_MEETING_SIGN_OFF,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.KICK_OFF.KICK_OFF_MEETING_SIGN_OFF,
        },
      ],
    },
    {
      phase: labels.MENU_ITEMS.SETUP_WORKFLOW,
      id: 'kick_off',
      sequenceNo: 1,
      isEditable: true,
      subphases: [],
      status: '',
      path: constants.BUSINESS.ROUTE.SETUP_WORKFLOW.SETUP_WORKFLOW,
    },
    {
      phase: labels.MENU_ITEMS.DESIGN.DESIGN,
      id: 'kick_off',
      sequenceNo: 1,
      isEditable: true,
      status: '',
      path: constants.BUSINESS.ROUTE.DESIGN.DESIGN,
      subphases: [
        {
          subphase: labels.MENU_ITEMS.DESIGN.INITIAL_CONCEPT_DESIGN,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.DESIGN.INITIAL_CONCEPT_DESIGN,
        },
        {
          subphase: labels.MENU_ITEMS.DESIGN.PRELIMINARY_DESIGN,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.DESIGN.PRELIMINARY_DESIGN,
        },
        {
          subphase: labels.MENU_ITEMS.DESIGN.FINAL_DESIGN,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.DESIGN.FINAL_DESIGN,
        },
        {
          subphase: labels.MENU_ITEMS.DESIGN.MEP_DETAILED_DESIGN,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.DESIGN.MEP_DETAILED_DESIGN,
        },
        {
          subphase: labels.MENU_ITEMS.DESIGN.CLOSE_DESIGN,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.DESIGN.CLOSE_DESIGN,
        },
      ],
    },
    {
      phase: labels.MENU_ITEMS.PRE_REQUISITES.PRE_REQUISITES,
      id: 'kick_off',
      sequenceNo: 1,
      isEditable: true,
      subphases: [],
      status: '',
      path: constants.BUSINESS.ROUTE.PRE_REQUISITES.PRE_REQUISITES,
    },
    {
      phase: labels.MENU_ITEMS.UNIT_HANDOVER_FITOUT.UNIT_HANDOVER_FITOUT,
      id: 'kick_off',
      sequenceNo: 1,
      isEditable: true,
      status: '',
      path: constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT.UNIT_HANDOVER_FITOUT,
      subphases: [
        {
          subphase:
            labels.MENU_ITEMS.UNIT_HANDOVER_FITOUT.UNIT_HANDOVER_AND_SIGNOFF,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path:
            constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
              .UNIT_HANDOVER_AND_SIGNOFF,
        },
        {
          subphase:
            labels.MENU_ITEMS.UNIT_HANDOVER_FITOUT.GENERAL_INSOECTION_3PARTY,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path:
            constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
              .GENERAL_INSOECTION_3PARTY,
        },
        {
          subphase:
            labels.MENU_ITEMS.UNIT_HANDOVER_FITOUT.ARCHITECTURAL_INSPECTION,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path:
            constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
              .ARCHITECTURAL_INSPECTION,
        },
        {
          subphase: labels.MENU_ITEMS.UNIT_HANDOVER_FITOUT.MEP_INSPECTION,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT.MEP_INSPECTION,
        },
        {
          subphase: labels.MENU_ITEMS.UNIT_HANDOVER_FITOUT.FIRE_INSPECTION,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT.FIRE_INSPECTION,
        },
        {
          subphase: labels.MENU_ITEMS.UNIT_HANDOVER_FITOUT.FINAL_INSPECTION,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT.FINAL_INSPECTION,
        },
        {
          subphase:
            labels.MENU_ITEMS.UNIT_HANDOVER_FITOUT
              .CLOSE_UNIT_HANDOVER_AND_FITOUT,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path:
            constants.BUSINESS.ROUTE.UNIT_HANDOVER_FITOUT
              .CLOSE_UNIT_HANDOVER_AND_FITOUT,
        },
      ],
    },
    // {
    //   phase: labels.MENU_ITEMS.PRE_REQUISITES.PRE_REQUISITES,
    //   id: 'kick_off',
    //   sequenceNo: 1,
    //   isEditable: true,
    //   subphases: [],
    //   status: '',
    //   path: constants.BUSINESS.ROUTE.PRE_REQUISITES.PRE_REQUISITES,
    // },
    {
      phase: labels.MENU_ITEMS.UNIT_OPENING.UNIT_OPENING,
      id: 'kick_off',
      sequenceNo: 1,
      isEditable: true,
      status: '',
      path: constants.BUSINESS.ROUTE.UNIT_OPENING.UNIT_OPENING,
      subphases: [
        {
          subphase: labels.MENU_ITEMS.UNIT_OPENING.RISK_AND_SECURITY_INSPECTION,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path:
            constants.BUSINESS.ROUTE.UNIT_OPENING.RISK_AND_SECURITY_INSPECTION,
        },
        {
          subphase: labels.MENU_ITEMS.UNIT_OPENING.HEALTH_AND_SAFETY_INSPECTION,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path:
            constants.BUSINESS.ROUTE.UNIT_OPENING.HEALTH_AND_SAFETY_INSPECTION,
        },
        {
          subphase: labels.MENU_ITEMS.UNIT_OPENING.SEEK_APPROVAL_TO_TRADE,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.UNIT_OPENING.SEEK_APPROVAL_TO_TRADE,
        },
        {
          subphase: labels.MENU_ITEMS.UNIT_OPENING.CLOSE_UNIT_OPENING_PHASE,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.UNIT_OPENING.CLOSE_UNIT_OPENING_PHASE,
        },
      ],
    },
    {
      phase: labels.MENU_ITEMS.CLOSURE.CLOSURE,
      id: 'kick_off',
      sequenceNo: 1,
      isEditable: true,
      status: '',
      path: constants.BUSINESS.ROUTE.CLOSURE.CLOSURE,
      subphases: [
        {
          subphase: labels.MENU_ITEMS.CLOSURE.FINAL_PENDING_SNAG_LIST_CHECK,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.CLOSURE.FINAL_PENDING_SNAG_LIST_CHECK,
        },
        {
          subphase: labels.MENU_ITEMS.CLOSURE.CLOSE_CASE,
          id: 'assign_owner_team_member',
          sequenceNo: 1,
          isEditable: true,
          status: '',
          path: constants.BUSINESS.ROUTE.CLOSURE.CLOSE_CASE,
        },
      ],
    },
  ],
};
