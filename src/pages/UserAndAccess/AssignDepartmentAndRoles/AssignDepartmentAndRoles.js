import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from 'react-bootstrap';

import CardHeader from '../../../components/CardHeader/CardHeader';
import CardListTable from '../../../components/CardListTable/CardListTable';
import deleteIcon from '../../../images/delete/delete.png';
// import editIcon from '../../../images/edit/edit.png';
import './AssignDepartmentAndRoles.scss';
import DropdownComponent from '../../../components/Dropdown/DropdownComponent';
import LabelWithIcon from '../../../components/LabelWithIcon/LabelWithIcon';
import DropdownMultiSelect from '../../../components/Dropdown/DropdownMultiSelect';
import labelText from '../../../utils/Locales/labels';
import { getErrorMessage, scrollToTop } from '../../../utils/utils';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import {
  getUserAccessSteps,
  getSelectedPropertyList,
  // getRoleListWithLabel,
  getAssignedDepartmentAndRole,
  getUserIdFromState,
} from '../selector';
import displayMessages from '../../../utils/Locales/messages';

import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import {
  setWizardStepsUserAccess,
  getSelectedPropertyListAPIAction,
  getDepartmentListAPIAction,
  getRoleListAPIAction,
  getAssignedDepartmentAPIAction,
  deleteDepartmentAndRoleAssignedAPIAction,
} from '../../../actions/userAndAccessAction';

function AssignDepartmentAndRoles({
  stepData,
  changeStepData,
  getSelectedPropertyListAPI,
  selectedPropertyList,
  getDepartmentListAPI,
  getRoleListAPI,
  // rolesList,
  assignedDepartmentAndRoles,
  getAssignedDepartmentAPI,
  deleteDepartmentAndRoleAssignedAPI,
  // isEditUserReq,
  userId,
}) {
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [confirmDeletion, setConfirmDeletion] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState([]);

  useEffect(() => {
    scrollToTop();
    getSelectedPropertyListAPI(userId);

    if (userId) {
      getAssignedDepartmentAPI(userId);
    }
  }, []);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const deptAssignedColumns = [
    {
      selector: 'property',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
          .ASSIGNED_DEPARTMENT.PROPERTY_COL_1,
      sortable: true,
    },
    {
      selector: 'department',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
          .ASSIGNED_DEPARTMENT.DEPARTMENT_COL_2,
      sortable: true,
    },
    {
      selector: 'roles',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
          .ASSIGNED_DEPARTMENT.ROLES_COL_3,
      sortable: true,
    },
    {
      name: '',
      sortable: false,
      cell: row => {
        return (
          <>
            {/* <button type="button" className="edit-button" onClick={() => {}}>
              <img src={editIcon} alt="edit" style={{ marginRight: '15px' }} />
            </button> */}
            <button
              type="button"
              className="delete-button"
              onClick={() => handleDeleteDepartmentAndRole(row)}
            >
              <img
                src={deleteIcon}
                alt="del"
                style={{ height: '21px', width: '16px', marginRight: '15px' }}
              />
            </button>
          </>
        );
      },
      // grow: '1',
      width: '100px',
      right: true,
    },
  ];

  const handleDeleteDepartmentAndRole = departmentRow => {
    // we will also need to pass the userId here, as to know for which user this delete is being performed

    if (!confirmDeletion) {
      setConfirmDeletion(true);
      setRowToDelete(departmentRow);
      return;
    }

    deleteDepartmentAndRoleAssignedAPI(departmentRow.id)
      .then(res => {
        if (res.data.success) {
          setConfirmDeletion(false);
          getAssignedDepartmentAPI(userId);
        }
      })
      .catch(err => {
        setConfirmDeletion(false);
        if (err) {
          const errMess = getErrorMessage(err);
          setIsErrorMessage(true);
          setErrorMessage(errMess);
        }
      });
  };

  const handlePropertySelect = (_eventKey, deptRowId) => {
    if (_eventKey === 'select') {
      const tempStepData = [...stepData];
      const indexToReset = tempStepData[3].addDeptRows.findIndex(
        item => item.id === deptRowId,
      );
      const resetObj = {
        id: deptRowId,
        property: {},
        department: [],
        roles: [],
        departmentDropDownData: [],
        rolesDropDownData: [],
        hasAnyValue: false,
        propertyError: '',
        departmentError: '',
        roleError: '',
        isDisabled: true,
      };
      tempStepData[3].addDeptRows.splice(indexToReset, 1, resetObj);
      changeStepData(tempStepData);
    } else {
      const selectedVal = selectedPropertyList.find(
        item => item.id === _eventKey,
      );

      const tempStepData = [...stepData];

      if (
        tempStepData[3].addDeptRows.find(item => item.id === deptRowId).property
          .id !== _eventKey
      ) {
        tempStepData[3].addDeptRows.find(
          item => item.id === deptRowId,
        ).propertyError = '';

        tempStepData[3].addDeptRows.find(
          item => item.id === deptRowId,
        ).hasAnyValue = true;

        tempStepData[3].addDeptRows.find(
          item => item.id === deptRowId,
        ).property = selectedVal;
        // changeStepData(tempStepData);

        tempStepData[3].addDeptRows.find(
          item => item.id === deptRowId,
        ).department = [];
        tempStepData[3].addDeptRows.find(
          item => item.id === deptRowId,
        ).roles = [];

        // pass the property selected in below api call
        getDepartmentListAPI(selectedVal.id, stepData[0].userData.userType.id) // params are selected propId,usertypeId
          .then(res => {
            const departmentDropDownList = res.data.data;
            const modifiedDepartmentListForDD = [];
            departmentDropDownList.forEach(department => {
              const deptObj = {
                id: department.departmentId,
                value: department.departmentName,
                label: department.departmentName,
              };
              modifiedDepartmentListForDD.push(deptObj);
            });

            tempStepData[3].addDeptRows.find(
              item => item.id === deptRowId,
            ).departmentDropDownData = modifiedDepartmentListForDD;
            // changeStepData(tempStepData);
            return tempStepData;
          })
          .then(tempStepData1 => {
            const localTempStep = tempStepData1;
            getRoleListAPI(
              selectedVal.id,
              stepData[0].userData.userType.id,
            ).then(res => {
              if (res.data.success) {
                const rolesDropdownList = res.data.data;

                const modifiedRolesDropdownList = [];
                rolesDropdownList.forEach(role => {
                  const roleObj = {
                    id: role.roleId,
                    value: role.roleName,
                    label: role.roleName,
                  };
                  modifiedRolesDropdownList.push(roleObj);
                });
                localTempStep[3].addDeptRows.find(
                  item => item.id === deptRowId,
                ).rolesDropDownData = modifiedRolesDropdownList;
                localTempStep[3].addDeptRows.find(
                  item => item.id === deptRowId,
                ).isDisabled = false;
                changeStepData(localTempStep);
              }
            });
          })
          // .then(() => {
          //   changeStepData(tempStepData);
          // })
          .catch(err => {
            if (err) {
              // console.log(err)
              changeStepData(tempStepData);
            }
          });
      }
    }
  };

  const handleDepartmentSelect = (selectedVal, deptRowId) => {
    const tempStepData = [...stepData];

    tempStepData[3].addDeptRows.find(
      item => item.id === deptRowId,
    ).hasAnyValue = true;

    tempStepData[3].addDeptRows.find(
      item => item.id === deptRowId,
    ).departmentError = '';

    tempStepData[3].addDeptRows.find(
      item => item.id === deptRowId,
    ).department = [...selectedVal];

    changeStepData(tempStepData);
  };

  const handleRoleSelect = (selectedVal, deptRowId) => {
    const tempStepData = [...stepData];

    tempStepData[3].addDeptRows.find(item => item.id === deptRowId).roleError =
      '';

    tempStepData[3].addDeptRows.find(
      item => item.id === deptRowId,
    ).hasAnyValue = true;

    tempStepData[3].addDeptRows.find(item => item.id === deptRowId).roles = [
      ...selectedVal,
    ];

    changeStepData(tempStepData);
  };

  const handleAddMoreDeptRows = () => {
    const tempStepData = [...stepData];
    tempStepData[3].addDeptRows.push({
      id: tempStepData[3].addDeptRows.length + 1,
      property: {},
      department: [],
      roles: [],
      departmentDropDownData: [],
      rolesDropDownData: [],
      hasAnyValue: false,
      propertyError: '',
      departmentError: '',
      roleError: '',
      isDisabled: true,
    });

    changeStepData(tempStepData);
  };
  return (
    <div className="assign-department-and-roles">
      <Card>
        <div className="table-title">
          <CardHeader
            title={
              labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
                .TITLE_DEPARTMENT_ROLES_ASSIGNED
            }
          />
        </div>
        {assignedDepartmentAndRoles.length > 0 ? (
          <div className="assigned-dept-table">
            <CardListTable
              columns={deptAssignedColumns}
              data={assignedDepartmentAndRoles}
              numOfColumns={deptAssignedColumns.length - 1}
              noDataString={
                labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
                  .ASSIGNED_DEPARTMENT.NO_DEPARTMENT_ASSIGNED
              }
              persistTableHead
              fixedHeader
              fixedHeaderScrollHeight="310px"
            />
          </div>
        ) : (
          <div className="no-table-data">
            {
              labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
                .ASSIGNED_DEPARTMENT.NO_DEPARTMENT_ASSIGNED
            }
          </div>
        )}
      </Card>
      <Card>
        <div className="add-dept-title">
          <CardHeader
            title={
              labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
                .TITLE_ADD_DEPARTMENT_ROLES
            }
          />
        </div>
        {stepData[3].addDeptRows.map(row => {
          return (
            <div className="add-dept-row" key={row.id}>
              <DropdownComponent
                id="property"
                className="add-dept-row-fields"
                label={
                  labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
                    .PROPERTY_LABEL
                }
                data={[
                  { id: 'select', value: 'Select' },
                  ...selectedPropertyList,
                ]}
                value={row.property.value}
                onSelect={_eventKey => handlePropertySelect(_eventKey, row.id)}
                error={row.propertyError ? row.propertyError : ''}
              />

              <DropdownMultiSelect
                className="add-dept-row-fields"
                labelName={
                  labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
                    .DEPARTMENT_LABEL
                }
                data={row.departmentDropDownData}
                multiSelectDesc="Select Departments"
                value={row.department}
                onChange={selectedItems =>
                  handleDepartmentSelect(selectedItems, row.id)
                }
                isSearchable={false}
                error={!!row.departmentError}
                helperText={row.departmentError ? row.departmentError : ''}
                isDisabled={row.isDisabled}
              />

              <DropdownMultiSelect
                className="add-dept-row-fields"
                labelName={
                  labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
                    .ROLE_LABEL
                }
                data={row.rolesDropDownData}
                multiSelectDesc="Select Roles"
                value={row.roles}
                onChange={selectedItems =>
                  handleRoleSelect(selectedItems, row.id)
                }
                // isSearchable
                error={row.roleError}
                helperText={row.roleError ? row.roleError : ''}
                isDisabled={row.isDisabled}
              />
            </div>
          );
        })}

        <div className="add-more-dept-rows">
          <LabelWithIcon
            label={
              labelText.USER_AND_ACCESS.ASSIGN_DEPARTMENT_ROLES_STEP_4
                .ADD_MORE_ROW_LABEL
            }
            handleClick={handleAddMoreDeptRows}
          />
        </div>
      </Card>
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />

      <InformationAlert
        alertMessage={
          displayMessages.USER_AND_ACCESS.STEP_4
            .CONFIRM_ASSIGNED_DEPT_ROLE_DELETE
        }
        primaryButtonText="Yes"
        secondaryButtonText="No"
        open={confirmDeletion}
        setClose={() => setConfirmDeletion(!confirmDeletion)}
        primaryButtonOnClick={() => handleDeleteDepartmentAndRole(rowToDelete)}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  stepData: getUserAccessSteps(state),
  selectedPropertyList: getSelectedPropertyList(state),
  // rolesList: getRoleListWithLabel(state),
  assignedDepartmentAndRoles: getAssignedDepartmentAndRole(state),
  userId: getUserIdFromState(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeStepData: setWizardStepsUserAccess,
      getSelectedPropertyListAPI: getSelectedPropertyListAPIAction,
      getDepartmentListAPI: getDepartmentListAPIAction,
      getRoleListAPI: getRoleListAPIAction,
      getAssignedDepartmentAPI: getAssignedDepartmentAPIAction,
      deleteDepartmentAndRoleAssignedAPI: deleteDepartmentAndRoleAssignedAPIAction,
    },
    dispatch,
  );

AssignDepartmentAndRoles.propTypes = {
  stepData: PropTypes.instanceOf(Array).isRequired,
  changeStepData: PropTypes.func.isRequired,
  getSelectedPropertyListAPI: PropTypes.func.isRequired,
  selectedPropertyList: PropTypes.instanceOf(Array).isRequired,
  getDepartmentListAPI: PropTypes.func.isRequired,
  getRoleListAPI: PropTypes.func.isRequired,
  // rolesList: PropTypes.instanceOf(Array).isRequired,
  assignedDepartmentAndRoles: PropTypes.instanceOf(Array).isRequired,
  getAssignedDepartmentAPI: PropTypes.func.isRequired,
  deleteDepartmentAndRoleAssignedAPI: PropTypes.func.isRequired,
  userId: PropTypes.string,
  // isEditUserReq: PropTypes.bool.isRequired,
};
AssignDepartmentAndRoles.defaultProps = {
  userId: '',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssignDepartmentAndRoles);
