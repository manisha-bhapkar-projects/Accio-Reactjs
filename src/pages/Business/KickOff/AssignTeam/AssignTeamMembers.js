/**
 * AssignTeamMembers:
 * userType: owner / tenant
 *
 * TCH
 * a. befor save and submit
 *     edit completion date
 *     add/delete TC and other team members and also he can delete him self but in that case we need to restrict them to save and submit befor adding new TCH
 *     cancel changes
 *     save and close : save and redirect to listing screen
 * b. after save and submit
 *     show message that task is assign to TC with due date if TCH have only view access
 * c. restrict / show message when TCH clicks on Assign tenant team members handle it in side bar
 *
 *
 *
 * TC
 * a. assign owner team
 *   can add / delete team members if he delete TC or TCH then we restrict them to save record on save they need to add new one first
 *   also check for each role they need to select one user
 * b. assign tenant team
 *    one TR required
 *
 * TR : assign tenant team members
 *  only can add / delete tenant team members
 *  can not delete him self
 *  can add pre-approved contracors or new contracor
 *  on contracor must required
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useTranslation } from 'react-i18next'; // multi langauge support
import CustomDatePicker from '../../../../components/CustomDatePicker';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import DropdownWithSearchBar from '../../../../components/Dropdown/DropdownComponentWithSearchBar';
import CardListTable from '../../../../components/CardListTable/CardListTable';
import LabelWithIcon from '../../../../components/LabelWithIcon/LabelWithIcon';
import ErrorAlert from '../../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import InformationAlert from '../../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import Popup from '../../../../components/Popup/Popup';
import deleteImg from '../../../../images/delete/delete.png';
import plusImg from '../../../../images/plus/plus.png';

import NewContractor from './AssignTenantTeamMembers/Popups/NewContractor/NewContractor';
import './AssignTeamMembers.scss';
import {
  getUsersType,
  deleteTeamMember,
  getTeamMembers,
  getRolesPropertyAndUserTypeWise,
  getUsersRoleWise,
  addTeamMembers,
} from '../../../../actions/Business/assignTeam';
import { getErrorMessage } from '../../../../utils/utils';
import Note2 from '../../../../components/Note2/Note2';
import AddPreApprovadContractor from './AssignTenantTeamMembers/Popups/PreApproved/AddPreApprovadContractor/AddPreApprovadContractor';

const AssignTeamMembers = props => {
  const { t } = useTranslation();
  const {
    userType,
    action,
    match,
    isAssignTenantCordinator,
    // history
  } = props; // userType: owner / tenant , action : 'assign-tenant-cordinator'

  // caseId
  const { caseId } = match.params;

  // planned completion date
  const [plannedCompletionDate, setPlannedCompletionDate] = useState('');

  // taskStatus :
  const [taskStatus, setTaskStatus] = useState('completed');
  const [isTaskWithLoggedInUser, setIsTaskWithLoggedInUser] = useState(true);

  //
  const [isKickOffSignedOffComplete, setIsKickOffSignedOffComplete] = useState(
    true,
  );

  const [showPreApprovedPopup, setShowPreApprovedPopup] = useState(false);
  const [showNewContractorPopup, setShowNewContractorPopup] = useState(false);

  const [isLoadingForGetTeamMembers, setIsLoadingForGetTeamMembers] = useState(
    false,
  );

  // error
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorInTeamAssign, setIsErrorInTeamAssign] = useState(false);

  // success
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // InformationAlert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(false); // cancel , delete

  // userForDeleteAction
  const [userForDeleteAction, setUserForDeleteAction] = useState('');

  // roleOptions
  const [roleOptions, setRoleOptions] = useState([]);
  const [contractorRoleOptions] = useState([]);

  // usersType: to set users type with id
  const [usersType, setUsersType] = useState([]);

  // const [columnWidth, setColumnWidth] = useState('100px');

  // useEffect(() => {
  //   const table = document.getElementById('attendees-table');
  //   setColumnWidth(table.offsetWidth / 4 - 40);
  // }, []);
  // console.log('table width ============>', columnWidth);

  // onDeleteTeamMemberClickListner
  const onDeleteTeamMemberClickListner = userData => {
    // check if requested user is in list of required roles list and for same role not have more then one user then show message befor delete
    const indexOfRequiredRole = requiredRoles.findIndex(
      role => role.refId === userData.roleId,
    );
    if (indexOfRequiredRole >= 0) {
      // role is required now checking that for this role how many users are there in team
      const usersWithSameRole = teamMembers.filter(
        member => member.roleId === userData.roleId,
      );
      if (usersWithSameRole.length < 2) {
        // show message that if user with required role deleted then they need to add new user with that role
        setAlertAction('delete');
        setUserForDeleteAction(userData);
        setAlertMessage(
          t('KICK_OFF.ASSIGN_TEAM.ERROR_MSG.REQUIRED_USER_WITH_ROLE'),
        );
        setIsAlertOpen(true);
      }
    }
  };

  const columns = [
    {
      name: t('KICK_OFF.ASSIGN_TEAM.COL_1'),
      selector: 'role',
      sortable: true,
      // grow: '2',
      cell: rowData => {
        return (
          <div
          // style={{ width: columnWidth }}
          >
            {rowData.role}
          </div>
        );
      },
    },
    {
      name: t('KICK_OFF.ASSIGN_TEAM.COL_2'),
      selector: 'name',
      sortable: true,
      // grow: '2',
      cell: rowData => {
        return (
          <div
          // style={{ width: columnWidth }}
          >
            {rowData.name}
          </div>
        );
      },
    },
    {
      name: t('KICK_OFF.ASSIGN_TEAM.COL_3'),
      selector: 'email',
      sortable: true,
      // grow: '2',
      cell: rowData => {
        return (
          <div
          // style={{ width: columnWidth }}
          >
            {rowData.email}
          </div>
        );
      },
    },
    {
      name: t('KICK_OFF.ASSIGN_TEAM.COL_4'),
      selector: 'contact',
      sortable: true,
      // grow: '2',
      cell: rowData => {
        return (
          <div
          // style={{ width: columnWidth }}
          >
            {rowData.contact}
          </div>
        );
      },
    },
    {
      name: '',
      right: true,
      sortable: true,
      cell: rowData => {
        return (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={null}
            onClick={() => onDeleteTeamMemberClickListner(rowData)}
          >
            <img alt="delete" className="delete-icon cursor" src={deleteImg} />
          </div>
        );
      },
      grow: '0.5',
    },
  ];

  const [teamMembers, setTeamMembers] = useState([]);

  const [requiredRoles, setRequiredRoles] = useState([]);

  // selectObject for default select
  const selectObject = {
    id: '0',
    value: 'Select',
    label: 'Select',
    role: '',
    contact: '',
  };

  // defaultTeamMembers
  const defaultTeamMembers = [
    {
      id: 1,
      role: '',
      name: '',
      userId: '',
      email: '',
      contact: '',
      nameOptions: [selectObject],
      isNameOptionsDisabled: true,
      isNameError: false,
      nameErrorMessage: '',
    },
    {
      id: 2,
      role: '',
      name: '',
      userId: '',
      email: '',
      contact: '',
      nameOptions: [selectObject],
      isNameOptionsDisabled: true,
      isNameError: false,
      nameErrorMessage: '',
    },
    {
      id: 3,
      role: '',
      name: '',
      userId: '',
      email: '',
      contact: '',
      nameOptions: [selectObject],
      isNameOptionsDisabled: true,
      isNameError: false,
      nameErrorMessage: '',
    },
    {
      id: 4,
      role: '',
      name: '',
      userId: '',
      email: '',
      contact: '',
      nameOptions: [selectObject],
      isNameOptionsDisabled: true,
      isNameError: false,
      nameErrorMessage: '',
    },
    {
      id: 5,
      role: '',
      name: '',
      userId: '',
      email: '',
      contact: '',
      nameOptions: [selectObject],
      isNameOptionsDisabled: true,
      isNameError: false,
      nameErrorMessage: '',
    },
  ];

  // defaultContractors
  const defaultContractors = [
    {
      id: 1,
      role: '',
      name: '',
      userId: '',
      email: '',
      contact: '',
      nameOptions: [selectObject],
      isNameOptionsDisabled: true,
      isNameError: false,
      nameErrorMessage: '',
    },
  ];

  const [newTeamMembers, setNewTeamMembers] = useState(
    _.cloneDeep(defaultTeamMembers),
  );

  const [newContractors, setNewContractors] = useState(
    _.cloneDeep(defaultContractors),
  );

  const [indexOfNewMember, setIndexOfNewMember] = useState(6);
  const [indexOfNewContractor, setIndexOfNewContractor] = useState(2);

  // const [isCompletionDateEditable] = useState(true);
  const [isDateDisable, setIsDateDisable] = useState(true);

  // userTypeId : we are storing id of type (like userType - Owner and its refId we store here)
  const [userTypeId, setUserTypeId] = useState('');

  // isPublish : true - save and submit / save and contine and false - save and close
  const [isPublish, setIsPublish] = useState(false);

  // const [completionDate, setCompletionDate] = useState({
  //   year: 2019,
  //   month: 11,
  //   day: 14,
  // });

  // handleError of get form list api
  const handleError = error => {
    setIsLoadingForGetTeamMembers(false);
    setErrorMessage(`${getErrorMessage(error)}`);
    setIsErrorMessage(true);
  };

  // fetch users types
  useEffect(() => {
    getUsersType()
      .then(_response => {
        if (_response.data.success) {
          if (_response.data.data.length) {
            setUsersType(_response.data.data);
          }
        }
      })
      .catch(_error => {
        handleError(_error);
      });
  }, []);

  useEffect(() => {
    if (usersType.length > 0 && caseId) {
      // console.log('usersType', usersType);
      setIsLoadingForGetTeamMembers(true);
      // getRolesPropertyWise : to get roles as per type of user(owner/tenant) and property wise
      const indexOfUserType = usersType.findIndex(
        type => type.uType === userType,
      );
      setUserTypeId(usersType[indexOfUserType].refId);
    }
  }, [usersType, caseId]);

  useEffect(() => {
    // if we have caseId  and user type id then we can get team members and roles.
    if (caseId && userTypeId) {
      // getting team members
      getTeamMembers(userTypeId, caseId)
        .then(_response => {
          if (_response.data.success) {
            if (_response.data.data.length) {
              // team for team members
              const team = [];
              _response.data.data[0].members.forEach((member, i) => {
                team.push({
                  id: i,
                  role: member.roleName,
                  name: `${member.fName} ${member.lName}`,
                  email: member.email,
                  contact: '+971 52 567 8754',
                  roleId: member.roleId,
                });
              });
              setTeamMembers(team);
              if (
                _response.data.data[0].requiredRoles &&
                _response.data.data[0].requiredRoles.length
              )
                setRequiredRoles(_response.data.data[0].requiredRoles);
            }
            return true;
          }
          return false;
        })
        .then(() => {
          // check if taskStatus is completed then no need to call api
          if (taskStatus === 'completed') return true;
          // getting roles as per property and user
          return getRolesPropertyAndUserTypeWise(userTypeId);
        })
        .then(_response => {
          if (_response.data.success) {
            if (_response.data.data.length) {
              const options = [
                {
                  id: 0,
                  value: 'Select',
                  label: 'Select',
                },
              ];
              _response.data.data.forEach(role => {
                options.push({
                  id: role.refId,
                  value: role.roleName,
                  label: role.refId,
                });
              });
              setRoleOptions(options);
            }
          }
          setIsLoadingForGetTeamMembers(false);
        })
        .catch(_error => {
          handleError(_error);
        });
    }
  }, [caseId, userTypeId]);

  // remove this useeffect when apis added
  useEffect(() => {
    setIsTaskWithLoggedInUser(true);
    setIsKickOffSignedOffComplete(true);
    setTaskStatus('completed');
    setPlannedCompletionDate('05-jun-2020');

    if (!isLoadingForGetTeamMembers && !isErrorInTeamAssign) {
      if (teamMembers.length === 0) setTeamMembers([]);
      setSuccessMessage('');
    }
  }, []);

  // handleAddNewRow : This function adds new row on Add More rows Click
  const handleAddNewRow = index => {
    setNewTeamMembers(members => [
      ...members,
      {
        id: index,
        role: '',
        name: '',
        userId: '',
        email: '',
        contact: '',
        nameOptions: [selectObject],
        isNameOptionsDisabled: true,
        isNameError: false,
        nameErrorMessage: '',
      },
    ]);
    setIndexOfNewMember(index + 1);
  };

  // handleRole: handle role of new added member
  const handleRole = (role, index) => {
    const members = [...newTeamMembers];
    members[index].role = role;
    if (role === '0') {
      // if user clicks on select then we reset our role and nameOptions to empty
      members[index].nameOptions = [selectObject];
      members[index].isNameOptionsDisabled = true;
      members[index].name = '';
      members[index].userId = '';
      members[index].email = '';
      members[index].contact = '';
      members[index].nameErrorMessage = '';
      setNewTeamMembers(members);
      setIsErrorInTeamAssign(false);
    } else {
      getUsersRoleWise(role)
        .then(_response => {
          if (_response.data.success) {
            if (_response.data.data.length > 0) {
              const users = [selectObject];
              _response.data.data.forEach(user => {
                users.push({
                  id: user.refId,
                  value: user.email,
                  label: `${user.fName} ${user.lName}`,
                  role,
                  contact: user.contact,
                });
              });
              members[index].name = '';
              members[index].userId = '';
              members[index].email = '';
              members[index].contact = '';
              members[index].isNameOptionsDisabled = false;
              members[index].nameOptions = users;
              setNewTeamMembers(members);
            } else {
              // if no users found for selected role then we will set our state to default and show error message
              members[index].nameOptions = [selectObject];
              members[index].isNameOptionsDisabled = true;
              members[index].name = '';
              members[index].userId = '';
              members[index].email = '';
              members[index].contact = '';
              setNewTeamMembers(members);
              setErrorMessage(
                t(
                  'KICK_OFF.ASSIGN_TEAM.ERROR_MSG.USERS_NOT_FOUND_FOR_SELECTED_ROLE',
                ),
              );
              setIsErrorMessage(true);
            }
          }
        })
        .catch(_error => {
          handleError(_error);
        });
    }
  };

  /**
   * handleName: handle name email and contact of new added member
   * @param {*} nameOptions
   * @param {*} id
   * @param {*} index
   */

  const handleName = (nameOptions, userId, index) => {
    const indexOfUserInNameOptions = nameOptions.findIndex(item => {
      return item.id === userId;
    });
    if (userId === '0') {
      // if user clicks on select in uses dropdown
      setNewTeamMembers(members => {
        const oldMembers = members;
        oldMembers[index].email = '';
        oldMembers[index].name = '';
        oldMembers[index].userId = '';
        oldMembers[index].contact = '';
        oldMembers[index].nameErrorMessage = t(
          'KICK_OFF.ASSIGN_TEAM.ERROR_MSG.USER_IS_REQUIRED',
        );
        return [...oldMembers];
      });
      setIsErrorInTeamAssign(true);
    } else {
      const teamMemberWithSameRoleAndName = newTeamMembers.filter(member => {
        return (
          member.role === newTeamMembers[index].role &&
          member.name === nameOptions[indexOfUserInNameOptions].label
        );
      });
      // check if combination of role and name already selected then show message
      if (teamMemberWithSameRoleAndName.length > 0) {
        setErrorMessage(
          t('KICK_OFF.ASSIGN_TEAM.ERROR_MSG.USER_EXIST_WITH_SAME_ROLE'),
        );
        setIsErrorMessage(true);
      } else {
        setNewTeamMembers(members => {
          const oldMembers = members;
          oldMembers[index].email = nameOptions[indexOfUserInNameOptions].value;
          oldMembers[index].name = nameOptions[indexOfUserInNameOptions].label;
          oldMembers[index].userId = nameOptions[indexOfUserInNameOptions].id;
          oldMembers[index].contact =
            nameOptions[indexOfUserInNameOptions].contact;
          oldMembers[index].nameErrorMessage = '';
          return [...oldMembers];
        });
        setIsErrorInTeamAssign(false);
      }
    }
  };

  // ------------ contractor

  // handleAddNewContractor
  const handleAddNewContractor = index => {
    setNewContractors(members => [
      ...members,
      {
        id: index,
        role: '',
        name: '',
        userId: '',
        email: '',
        contact: '',
        nameOptions: [selectObject],
        isNameOptionsDisabled: true,
        isNameError: false,
        nameErrorMessage: '',
      },
    ]);
    setIndexOfNewContractor(index + 1);
  };

  // handleContractorRole: handle role of new added contracot
  const handleContractorRole = (role, index) => {
    const members = [...newContractors];
    members[index].role = role;
    if (role === '0') {
      // if user clicks on select then we reset our role and nameOptions to empty
      members[index].nameOptions = [selectObject];
      members[index].isNameOptionsDisabled = true;
      members[index].name = '';
      members[index].userId = '';
      members[index].email = '';
      members[index].contact = '';
      members[index].nameErrorMessage = '';
      setNewContractors(members);
      setIsErrorInTeamAssign(false);
    } else {
      getUsersRoleWise(role)
        .then(_response => {
          if (_response.data.success) {
            if (_response.data.data.length > 0) {
              const users = [selectObject];
              _response.data.data.forEach(user => {
                users.push({
                  id: user.refId,
                  value: user.email,
                  label: `${user.fName} ${user.lName}`,
                  role,
                  contact: user.contact,
                });
              });
              members[index].name = '';
              members[index].userId = '';
              members[index].email = '';
              members[index].contact = '';
              members[index].isNameOptionsDisabled = false;
              members[index].nameOptions = users;
              setNewContractors(members);
            } else {
              // if no users found for selected role then we will set our state to default and show error message
              members[index].nameOptions = [selectObject];
              members[index].isNameOptionsDisabled = true;
              members[index].name = '';
              members[index].userId = '';
              members[index].email = '';
              members[index].contact = '';
              setNewContractors(members);
              setErrorMessage(
                t(
                  'KICK_OFF.ASSIGN_TEAM.ERROR_MSG.USERS_NOT_FOUND_FOR_SELECTED_ROLE',
                ),
              );
              setIsErrorMessage(true);
            }
          }
        })
        .catch(_error => {
          handleError(_error);
        });
    }
  };

  /**
   * handleContractorName: handle name email and contact of new added contractor
   * @param {*} nameOptions
   * @param {*} id
   * @param {*} index
   */

  const handleContractorName = (nameOptions, userId, index) => {
    const indexOfUserInNameOptions = nameOptions.findIndex(item => {
      return item.id === userId;
    });
    if (userId === '0') {
      // if user clicks on select in uses dropdown
      setNewContractors(members => {
        const oldMembers = members;
        oldMembers[index].email = '';
        oldMembers[index].name = '';
        oldMembers[index].userId = '';
        oldMembers[index].contact = '';
        oldMembers[index].nameErrorMessage = t(
          'KICK_OFF.ASSIGN_TEAM.ERROR_MSG.USER_IS_REQUIRED',
        );
        return [...oldMembers];
      });
      setIsErrorInTeamAssign(true);
    } else {
      const teamMemberWithSameRoleAndName = newTeamMembers.filter(member => {
        return (
          member.role === newTeamMembers[index].role &&
          member.name === nameOptions[indexOfUserInNameOptions].label
        );
      });
      // check if combination of role and name already selected then show message
      if (teamMemberWithSameRoleAndName.length > 0) {
        setErrorMessage(
          t('KICK_OFF.ASSIGN_TEAM.ERROR_MSG.USER_EXIST_WITH_SAME_ROLE'),
        );
        setIsErrorMessage(true);
      } else {
        setNewContractors(members => {
          const oldMembers = members;
          oldMembers[index].email = nameOptions[indexOfUserInNameOptions].value;
          oldMembers[index].name = nameOptions[indexOfUserInNameOptions].label;
          oldMembers[index].userId = nameOptions[indexOfUserInNameOptions].id;
          oldMembers[index].contact =
            nameOptions[indexOfUserInNameOptions].contact;
          oldMembers[index].nameErrorMessage = '';
          return [...oldMembers];
        });
        setIsErrorInTeamAssign(false);
      }
    }
  };

  // ------------ contractor end
  // handleSaveAndContinue
  const handleSaveAndContinue = () => {
    // setTeamMembers(members => [...members, ...newTeamMembers]);
    // setNewTeamMembers([...defaultTeamMembers]);
    setIsPublish(true);
    handleSaveTeamMembers();
  };

  // handleSuccessMessageOkButtonClick
  const handleSuccessMessageOkButtonClick = () => {
    setIsSuccessMessage(false);
    // isAssignTenantCordinator : true means we assigned task to tc and now go back to case-listing page
    // isPublish : false meanse we save data and now we redirect to case listing
    if (isAssignTenantCordinator || !isPublish) {
      // redirect to case listing
    } else {
      // isPublish:  true then save and go to next step
    }
  };

  /**
   * handleSaveTeamMembers: for save team members
   */

  const handleSaveTeamMembers = () => {
    // validations

    // check task is with user or not
    if (!isTaskWithLoggedInUser) return;
    if (taskStatus !== 'active') return;

    // // check any changes done other wise redirect to case-listing screen
    // if (_.isEqual(newTeamMembers, defaultTeamMembers)) {
    //   // redirect to case-listing
    //   history.push(constants.ROUTE.DASHBORD);
    //   return;
    // }

    // check required users added or not
    // requiredRolesAdded - if we have two requiredRoles then we will get here [true,false] like this array then we check if this array has false then we need to show error message required role need to add first
    // const requiredRolesAdded = requiredRoles.forEach(role => {
    //   //  role.refId === userData.roleId,
    //   // for each role we check new team members have this role or not
    //   return newTeamMembers.find(member => member.roleId === role.refId);
    // });

    // call save and submit api with isPublish true and isAssignTenantCordinator true

    // call api to assign tenant cordinator and assign next task to that user
    const requestData = {
      isPublish,
      assisgningTC: isAssignTenantCordinator,
      uType: userTypeId,
      caseId,
      team: newTeamMembers,
    };

    addTeamMembers(requestData)
      .then(_response => {
        if (_response.data.success) {
          setSuccessMessage(_response.data.message);
          setIsSuccessMessage(true);
        }
      })
      .catch(_error => {
        handleError(_error);
      });
  };

  // handleSaveAndSubmit: call BPM assign next task to TC and redirect to listing screen
  const handleSaveAndSubmit = () => {
    // setTeamMembers(members => [...members, ...newTeamMembers]);
    // setNewTeamMembers([]);
    setIsPublish(true);
    // handleSaveTeamMembers();
  };

  // handleSaveAndClose
  const handleSaveAndClose = () => {
    // setTeamMembers(members => [...members, ...newTeamMembers]);
    // setNewTeamMembers([]);
    setIsPublish(false);
    handleSaveTeamMembers();
  };

  // onCancelClickListner
  const onCancelClickListner = () => {
    if (
      !_.isEqual(newTeamMembers, defaultTeamMembers) ||
      !_.isEqual(newContractors, defaultContractors)
    ) {
      setAlertAction('cancel');
      setAlertMessage(t('GLOBAL.ERROR_MSG.ERR_CHANGES_LOST'));
      setIsAlertOpen(true);
    }
  };

  // handleDeleteMember
  const handleDeleteMember = _userId => {
    deleteTeamMember(_userId)
      .then(_response => {
        if (_response.data.success) {
          setSuccessMessage(_response.data.message);
          setIsSuccessMessage(true);
        }
      })
      .catch(_error => {
        handleError(_error);
      });
  };

  // handleAlertOKButtonClick : handles alert ok button click
  const handleAlertOKButtonClick = () => {
    if (alertAction === 'cancel') {
      setNewTeamMembers([...defaultTeamMembers]);
      setNewContractors([...defaultContractors]);
      setIsAlertOpen(false);
    } else if (alertAction === 'delete') {
      // call delete api here
      handleDeleteMember(userForDeleteAction);
      setIsAlertOpen(false);
    }
  };

  /**
   * getValueFromListById :
   *  Provide list and id to access value
   * @param {*} list : list from which we want to get value
   * @param {*} id : unique id to access value
   */

  const getValueFromListById = (list, id) => {
    if (!id || list.length === 0) return '';
    const index = list.findIndex(item => item.id === id);
    if (index < 0) return '';
    return list[index].value;
  };

  // getNamesAsPerRole
  // const getNamesAsPerRole = role => {
  //   return nameOptions.filter(name => name.role === role);
  // };

  // handleSendReminder
  const handleSendReminder = () => {};

  return (
    <>
      <div
        className="assign-team-members "
        style={
          taskStatus === 'completed' // if task is completed then disable screen
            ? { pointerEvents: 'none', opacity: '0.9' }
            : {}
        }
      >
        {/* Task with loggedin user */}
        {isTaskWithLoggedInUser ? (
          <>
            <div className="d-flex flex-direction-row padding-bottom-30">
              <CustomDatePicker
                label={
                  action === 'assign-tenant-cordinator'
                    ? t('KICK_OFF.ASSIGN_TEAM.ASSIGN_BY_DATE')
                    : t('KICK_OFF.ASSIGN_TEAM.COMPLETION_DATE')
                }
                value={plannedCompletionDate}
                min="2000-01-01"
                max="2210-12-31"
                isDisable={isDateDisable}
                isEditIcon={!isKickOffSignedOffComplete}
                handleEditClick={() => setIsDateDisable(!isDateDisable)}
                // onDateChange={_date => {
                //   handleContractSignedDateChange(_date);
                // }}
                // error={leaseDetailsState.contractSignedError}
                // helperText={
                //   leaseDetailsState.contractSignedError
                //     ? leaseDetailsState.contractSignedError
                //     : ''
                // }
              />
            </div>
            {/* CustomDatePicker end */}
            <div className="card-container">
              {/* CardHeader */}
              <CardHeader
                title={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_OWNER_TEAM_MEMBER.TEAM_ASSIGNED',
                )}
              />
              <div className="padding-top-20" id="attendees-table" />
              {/* Table */}
              <CardListTable
                columns={columns}
                data={teamMembers}
                // pending={isLoadingForGet}
                pagination={false}
                noDataString={t('KICK_OFF.ASSIGN_TEAM.NO_TEAM_ASSIGNED')}
                numOfColumns={4}
              />
            </div>
            <div className="card-container">
              <CardHeader
                title={`${
                  userType === 'owner'
                    ? t('KICK_OFF.ASSIGN_TEAM.ADD_TEAM')
                    : t('KICK_OFF.ASSIGN_TEAM.ADD_TENANT_TEAM')
                }`}
              />
              <>
                <div className="team-assigned-table">
                  {newTeamMembers.map((item, index) => {
                    // const namesAsPerRole = getNamesAsPerRole(item.role);
                    return (
                      <div className="new-row-item" key={item.id}>
                        <div className="input-element">
                          <DropdownWithSearchBar
                            className="assign-team-dropdown"
                            data={roleOptions}
                            label={t('KICK_OFF.ASSIGN_TEAM.COL_1')}
                            value={getValueFromListById(roleOptions, item.role)}
                            onSelect={data => handleRole(data, index)}
                            noOptionsMessage={t(
                              'KICK_OFF.ASSIGN_TEAM.ROLES_NOT_FOUND',
                            )}
                          />
                        </div>
                        <div className="input-element">
                          <DropdownWithSearchBar
                            className="assign-team-dropdown"
                            data={item.nameOptions}
                            isDisabled={item.isNameOptionsDisabled}
                            label={t('KICK_OFF.ASSIGN_TEAM.COL_2')}
                            value={item.email}
                            error={item.nameErrorMessage}
                            onSelect={data =>
                              handleName(item.nameOptions, data, index)
                            }
                            noOptionsMessage={t(
                              'KICK_OFF.ASSIGN_TEAM.NAMES_NOT_FOUND',
                            )}
                          />
                        </div>
                        <div className="input-element">
                          <div className="input-element-label">
                            {t('KICK_OFF.ASSIGN_TEAM.COL_3')}
                          </div>
                          <input
                            className="text-input-element disabled-input"
                            name={`email${index}`}
                            value={item.email}
                            disabled
                          />
                        </div>
                        <div className="input-element">
                          <div className="input-element-label">
                            {t('KICK_OFF.ASSIGN_TEAM.COL_4')}
                          </div>
                          <input
                            className="text-input-element disabled-input"
                            name={`contact${index}`}
                            value={item.contact}
                            disabled
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="d-flex justify-content-end add-more-row-button">
                  <LabelWithIcon
                    label={t('KICK_OFF.ASSIGN_TEAM.ADD_MORE_ROWS')}
                    handleClick={() => handleAddNewRow(indexOfNewMember)}
                    icon={plusImg}
                  />
                </div>
                {/* TR */}
                {userType === 'tenant' && isKickOffSignedOffComplete ? (
                  <>
                    <div className="horizontal-row" />
                    {/* contractors */}
                    <div className="team-assigned-table">
                      {newContractors.map((item, index) => {
                        // const namesAsPerRole = getNamesAsPerRole(item.role);
                        return (
                          <div className="new-row-item" key={item.id}>
                            <div className="input-element">
                              <DropdownWithSearchBar
                                className="assign-team-dropdown"
                                data={contractorRoleOptions}
                                label={t('KICK_OFF.ASSIGN_TEAM.COL_1')}
                                value={getValueFromListById(
                                  contractorRoleOptions,
                                  item.role,
                                )}
                                onSelect={data =>
                                  handleContractorRole(data, index)
                                }
                                noOptionsMessage={t(
                                  'KICK_OFF.ASSIGN_TEAM.ROLES_NOT_FOUND',
                                )}
                              />
                            </div>
                            <div className="input-element">
                              <DropdownWithSearchBar
                                className="assign-team-dropdown"
                                data={item.nameOptions}
                                isDisabled={item.isNameOptionsDisabled}
                                label={t('KICK_OFF.ASSIGN_TEAM.COL_2')}
                                value={item.email}
                                error={item.nameErrorMessage}
                                onSelect={data =>
                                  handleContractorName(
                                    item.nameOptions,
                                    data,
                                    index,
                                  )
                                }
                                noOptionsMessage={t(
                                  'KICK_OFF.ASSIGN_TEAM.NAMES_NOT_FOUND',
                                )}
                              />
                            </div>
                            <div className="input-element">
                              <div className="input-element-label">
                                {t('KICK_OFF.ASSIGN_TEAM.COL_3')}
                              </div>
                              <input
                                className="text-input-element disabled-input"
                                name={`email${index}`}
                                value={item.email}
                                disabled
                              />
                            </div>
                            <div className="input-element">
                              <div className="input-element-label">
                                {t('KICK_OFF.ASSIGN_TEAM.COL_4')}
                              </div>
                              <input
                                className="text-input-element disabled-input"
                                name={`contact${index}`}
                                value={item.contact}
                                disabled
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Popup
                      scrollType="body"
                      open={showPreApprovedPopup}
                      setClose={() => setShowPreApprovedPopup(false)}
                      // title={t(
                      //   'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.PRE_APPROVED_TITLE',
                      // )}
                    >
                      <AddPreApprovadContractor
                        setOpen={() => setShowPreApprovedPopup(false)}
                      />
                    </Popup>
                    <Popup
                      scrollType="body"
                      open={showNewContractorPopup}
                      setClose={() => setShowNewContractorPopup(false)}
                      // title={t(
                      //   'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR_TITLE',
                      // )}
                    >
                      <NewContractor
                        setOpen={() => setShowNewContractorPopup(false)}
                      />
                    </Popup>
                    <div className="d-flex justify-content-end add-more-contractor-button">
                      <LabelWithIcon
                        label={t(
                          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTORS',
                        )}
                        handleClick={() => setShowPreApprovedPopup(true)}
                        icon={plusImg}
                      />
                      <LabelWithIcon
                        className="pl-3"
                        label={t(
                          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTORS',
                        )}
                        handleClick={() => setShowNewContractorPopup(true)}
                        icon={plusImg}
                      />
                      <LabelWithIcon
                        className="pl-3"
                        label={t(
                          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_MORE_CONTRACTORS',
                        )}
                        handleClick={() =>
                          handleAddNewContractor(indexOfNewContractor)
                        }
                        icon={plusImg}
                      />
                    </div>
                  </>
                ) : (
                  ''
                )}
              </>
            </div>
          </>
        ) : (
          <>
            <div className="card-container">
              {/* CardHeader */}
              <CardHeader
                title={t(
                  'BUSINESS.KICK_OFF.ASSIGN_TEAM.ASSIGN_OWNER_TEAM_MEMBER.TEAM_ASSIGNED',
                )}
              />
              <div className="padding-top-20" />
              <Note2 noteText="Task pending with Herry porter,Due date is 24-Nov-2019" />
            </div>
          </>
        )}

        <div className="button-container">
          {isTaskWithLoggedInUser ? (
            <>
              <button
                type="button"
                className="btn-cancel"
                onClick={onCancelClickListner}
              >
                {t('GLOBAL.BUTTON_CANCEL')}
              </button>
              <button
                type="button"
                className="btn-save-close"
                onClick={handleSaveAndClose}
              >
                {t('GLOBAL.BUTTON_SAVE_AND_CLOSE')}
              </button>
              {/* save and submit buttonn: for TCH first time assign next task to TC */}
              {action === 'assign-tenant-cordinator' ? (
                <button
                  type="button"
                  onClick={handleSaveAndSubmit}
                  className="btn-save-submit"
                >
                  {t('GLOBAL.BUTTON_SAVE_AND_SUMIT')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveAndContinue}
                  className="btn-save-submit"
                >
                  {t('GLOBAL.BUTTON_SAVE_AND_CONTINUE')}
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleSendReminder}
              className="btn-save-submit"
            >
              {t('GLOBAL.SEND_REMINDER')}
            </button>
          )}
        </div>
        {/* Alert Box */}
        <>
          {/* error message */}
          <ErrorAlert
            alertMessage={errorMessage}
            primaryButtonText={t('GLOBAL.OK')}
            open={isErrorMessage}
            setClose={() => setIsErrorMessage(!isErrorMessage)}
            primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
          />
          {/* success message */}
          <SuccessAlert
            alertMessage={successMessage}
            primaryButtonText={t('GLOBAL.OK')}
            open={isSuccessMessage}
            setClose={() => handleSuccessMessageOkButtonClick()}
            primaryButtonOnClick={() => handleSuccessMessageOkButtonClick()}
          />
          {/* alert box : cancel */}
          <InformationAlert
            alertMessage={alertMessage}
            primaryButtonText={t('GLOBAL.YES')}
            secondaryButtonText={t('GLOBAL.NO')}
            open={isAlertOpen}
            setClose={() => setIsAlertOpen(!isAlertOpen)}
            primaryButtonOnClick={() => handleAlertOKButtonClick()}
          />
        </>
      </div>
    </>
  );
};

export default AssignTeamMembers;

AssignTeamMembers.defaultProps = {
  action: '',
  isAssignTenantCordinator: false,
};

AssignTeamMembers.propTypes = {
  userType: PropTypes.string.isRequired,
  action: PropTypes.string,
  match: PropTypes.instanceOf(Object).isRequired,
  isAssignTenantCordinator: PropTypes.bool,
  // history: PropTypes.instanceOf(Object).isRequired,
};
