import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, OverlayTrigger, Card } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CardHeader from '../../../components/CardHeader/CardHeader';
import CardListTable from '../../../components/CardListTable/CardListTable';
import deleteIcon from '../../../images/delete/delete.png';
import './AssignPropertyAndAccess.scss';
import DropdownComponent from '../../../components/Dropdown/DropdownComponent';
// import DropdownWithSearchBar from '../../../components/Dropdown/DropdownComponentWithSearchBar';
import Checkbox from '../../../components/Checkbox/Checkbox';
import LabelWithIcon from '../../../components/LabelWithIcon/LabelWithIcon';
import infoIcon from '../../../images/InfoForTooltip/infoForTooltip@2x.png';
import { getErrorMessage, scrollToTop } from '../../../utils/utils';
import displayMessages from '../../../utils/Locales/messages';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import labelText from '../../../utils/Locales/labels';
import OverlayToolTip from '../../../components/OverlayToolTip/OverlayToolTip';

import {
  getUserAccessSteps,
  getCompanyListForDD,
  getUserAccessTypeList,
  getAssignedAccess,
  getUserIdFromState,
} from '../selector';
import {
  setWizardStepsUserAccess,
  getCompanyListAPIAction,
  getPropertyListAPIAction,
  getLLCListAPIAction,
  getUserAccessTypeListAPIAction,
  getAssignedAccessAPIAction,
  deletePropertyAndAccessAssignedAPIAction,
} from '../../../actions/userAndAccessAction';

function AssignPropertyAndAccess({
  stepData,
  changeStepData,
  getCompanyListAPI,
  getLLCListAPI,
  getPropertyListAPI,
  companyList,
  getUserAccessTypeListAPI,
  userAccessTypes,
  getAssignedAccessAPI,
  assignedAccess,
  deletePropertyAndAccessAssignedAPI,
  userId,
  // isEditUserReq,
}) {
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [confirmDeletion, setConfirmDeletion] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState({});

  useEffect(() => {
    scrollToTop();
    getCompanyListAPI();
    getUserAccessTypeListAPI();

    if (userId) {
      getAssignedAccessAPI(userId); // call this with user id
    }
  }, []);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const accessAssignedColumns = [
    {
      selector: 'company',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
          .ASSIGNED_ACCESS.COMPANY_COL_1,
      sortable: true,
      grow: 1,
    },
    {
      selector: 'llc',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
          .ASSIGNED_ACCESS.LLC_COL_2,
      sortable: true,
      grow: 1,
    },
    {
      selector: 'property',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
          .ASSIGNED_ACCESS.PROPERTY_COL_3,
      sortable: true,
      grow: 1,
    },

    {
      name:
        labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
          .ASSIGNED_ACCESS.ACCESS_COl_4,
      selector: 'access',
      sortable: false,
      grow: 1.5,
      wrap: true,
    },
    {
      name: '',
      sortable: false,
      cell: row => {
        return (
          <>
            <button
              type="button"
              className="delete-button"
              onClick={() => {
                handleDeleteAssignedAccess(row);
              }}
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
      width: '100px',
      right: true,
    },
  ];

  const handleDeleteAssignedAccess = accessRow => {
    // we will also need to pass the userId here, as to know for which user this delete is being performed

    if (!confirmDeletion) {
      setRowToDelete(accessRow);
      setConfirmDeletion(true);
      return;
    }

    const reqObj = {
      userPropertyAccessId: accessRow.id,
    };
    deletePropertyAndAccessAssignedAPI(reqObj)
      .then(res => {
        if (res.data.success) {
          setConfirmDeletion(false);
          getAssignedAccessAPI(userId);
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

  const handleCompanySelect = (_eventKey, accessRowId) => {
    if (_eventKey === 'select') {
      const tempStepData = [...stepData];
      const indexToReset = tempStepData[1].addAccessRows.findIndex(
        item => item.id === accessRowId,
      );
      const resetObj = {
        id: accessRowId,
        company: {},
        llc: {},
        property: {},
        llcDropDownData: [],
        propertyDropDownData: [],
        fullAccess: false,
        caseAccess: false,
        caseManipulateAccess: false,
        hasAnyValue: false,
        companyError: '',
        llcError: '',
        propertyError: '',
        accessError: '',
        isPropertyDisabled: true,
        isLLCDisabled: true,
      };

      tempStepData[1].addAccessRows.splice(indexToReset, 1, resetObj);
      changeStepData(tempStepData);
    } else {
      const selectedVal = companyList.find(item => item.id === _eventKey);
      const tempStepData = [...stepData];

      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).companyError = '';

      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).company = selectedVal;

      // tempStepData[1].addAccessRows.find(
      //   item => item.id === accessRowId,
      // ).llc = {};
      // tempStepData[1].addAccessRows.find(
      //   item => item.id === accessRowId,
      // ).property = {};

      // will use this for validation
      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).hasAnyValue = true;

      if (tempStepData[0].userData.userType.value.toLowerCase() === 'tenant') {
        tempStepData[1].addAccessRows.find(
          item => item.id === accessRowId,
        ).fullAccess = true;
        tempStepData[1].addAccessRows.find(
          item => item.id === accessRowId,
        ).caseAccess = true;
      }
      if (tempStepData[0].userData.userType.value === 'Contractor') {
        tempStepData[1].addAccessRows.find(
          item => item.id === accessRowId,
        ).caseAccess = true;
      }

      getLLCListAPI(selectedVal.id) // need to pass company id here in api call
        .then(res => {
          // const { llcList } = res.data.data;
          const llcList = res.data.data;
          const modifiedLLCListForDD = [];
          llcList.forEach(llc => {
            const llcObj = {
              id: llc.LLCId,
              value: llc.LLCName,
            };
            modifiedLLCListForDD.push(llcObj);
          });

          tempStepData[1].addAccessRows.find(
            item => item.id === accessRowId,
          ).llcDropDownData = modifiedLLCListForDD;
          tempStepData[1].addAccessRows.find(
            item => item.id === accessRowId,
          ).isLLCDisabled = false;
          changeStepData(tempStepData);
        })
        .catch(err => {
          if (err) {
            changeStepData(tempStepData);
          }
        });

      // changeStepData(tempStepData);
    }
  };

  const handleLLCSelect = (_eventKey, accessRowId) => {
    const tempStepData = [...stepData];

    if (
      tempStepData[1].addAccessRows.find(item => item.id === accessRowId).llc
        .id !== _eventKey
    ) {
      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).llcError = '';

      const LLCListData = tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).llcDropDownData;

      const selectedVal = LLCListData.find(item => item.id === _eventKey);
      // console.log(selectedVal)
      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).llc = selectedVal;

      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).property = {};

      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).propertyDropDownData = [];

      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).hasAnyValue = true;

      const selectedLLCId = selectedVal.id;
      const selectedCompanyId = tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).company.id;

      getPropertyListAPI(selectedCompanyId, selectedLLCId) // need to pass LLC id here in api call
        .then(res => {
          const propertyList = res.data.data;

          if (propertyList.length > 0) {
            const modifiedPropertyListForDD = [];
            propertyList.forEach(property => {
              const propertyObj = {
                id: property.propertyId,
                value: property.propertyName,
              };
              modifiedPropertyListForDD.push(propertyObj);
            });
            tempStepData[1].addAccessRows.find(
              item => item.id === accessRowId,
            ).propertyDropDownData = modifiedPropertyListForDD;
            tempStepData[1].addAccessRows.find(
              item => item.id === accessRowId,
            ).isPropertyDisabled = false;
          } else {
            tempStepData[1].addAccessRows.find(
              item => item.id === accessRowId,
            ).isPropertyDisabled = true;
            setErrorMessage(
              displayMessages.USER_AND_ACCESS.STEP_2.ERR_NO_PROPERTY_FOR_LLC,
            );
            setIsErrorMessage(true);
          }

          changeStepData(tempStepData);
        })
        .catch(err => {
          if (err) {
            changeStepData(tempStepData);
          }
        });

      // changeStepData(tempStepData);
    }
  };

  const handlePropertySelect = (_eventKey, accessRowId) => {
    // if (_eventKey === 'select') {
    //   const tempStepData = [...stepData];
    //   const indexToReset = tempStepData[1].addAccessRows.findIndex(
    //     item => item.id === accessRowId,
    //   );
    //   const resetObj = {
    //     id: accessRowId,
    //     company: {},
    //     llc: {},
    //     property: {},
    //     llcDropDownData: [],
    //     propertyDropDownData: [],
    //     fullAccess: false,
    //     caseAccess: false,
    //     caseManipulateAccess: false,
    //     hasAnyValue: false,
    //     companyError: '',
    //     llcError: '',
    //     propertyError: '',
    //     accessError: '',
    //     isPropertyDisabled: true,
    //     isLLCDisabled: true,
    //   };

    //   tempStepData[1].addAccessRows.splice(indexToReset, 1, resetObj);
    //   changeStepData(tempStepData);
    // } else {
    const tempStepData = [...stepData];
    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).propertyError = '';
    const propertyListData = tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).propertyDropDownData;
    const selectedVal = propertyListData.find(item => item.id === _eventKey);
    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).property = selectedVal;

    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).hasAnyValue = true;

    changeStepData(tempStepData);
    // }
  };

  const handleFullAccessClick = (accessRowId, e) => {
    const isChecked = e.target.checked;
    const tempStepData = [...stepData];

    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).accessError = '';
    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).fullAccess = isChecked;

    if (isChecked) {
      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).caseAccess = isChecked;

      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).hasAnyValue = true;
    }
    changeStepData(tempStepData);
  };

  const handleCaseAccessClick = (accessRowId, e) => {
    const isChecked = e.target.checked;
    const tempStepData = [...stepData];
    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).accessError = '';
    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).caseAccess = isChecked;

    if (isChecked) {
      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).hasAnyValue = true;
    }
    // else {
    //   tempStepData[1].addAccessRows.find(
    //     item => item.id === accessRowId,
    //   ).hasAnyValue = false;
    // }
    changeStepData(tempStepData);
  };

  const handleCaseManipulateAccessClick = (accessRowId, e) => {
    const isChecked = e.target.checked;
    const tempStepData = [...stepData];
    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).accessError = '';
    tempStepData[1].addAccessRows.find(
      item => item.id === accessRowId,
    ).caseManipulateAccess = isChecked;

    if (isChecked) {
      tempStepData[1].addAccessRows.find(
        item => item.id === accessRowId,
      ).hasAnyValue = true;
    }
    // else {
    //   tempStepData[1].addAccessRows.find(
    //     item => item.id === accessRowId,
    //   ).hasAnyValue = false;
    // }
    changeStepData(tempStepData);
  };

  const handleAddMoreAccessRows = () => {
    const tempStepData = [...stepData];
    tempStepData[1].addAccessRows.push({
      id: tempStepData[1].addAccessRows.length + 1,
      company: {},
      llc: {},
      property: {},
      llcDropDownData: [],
      propertyDropDownData: [],
      fullAccess: false,
      caseAccess: false,
      caseManipulateAccess: false,
      hasAnyValue: false,
      companyError: '',
      llcError: '',
      propertyError: '',
      accessError: '',
      isPropertyDisabled: true,
      isLLCDisabled: true,
    });
    changeStepData(tempStepData);
  };

  return (
    <div className="assign-property-and-access">
      <Card>
        <div className="table-title">
          <CardHeader
            title={
              labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                .TITLE_ACCESS_ASSIGNED
            }
          />
        </div>
        {assignedAccess.length > 0 ? (
          <div className="assigned-access-table">
            <CardListTable
              columns={accessAssignedColumns}
              data={assignedAccess}
              numOfColumns={accessAssignedColumns.length - 1}
              noDataString={
                labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                  .ASSIGNED_ACCESS.NO_ACCESS_ASSIGNED
              }
              persistTableHead
              fixedHeader
              fixedHeaderScrollHeight="310px"
            />
          </div>
        ) : (
          <div className="no-table-data">
            {
              labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                .ASSIGNED_ACCESS.NO_ACCESS_ASSIGNED
            }
          </div>
        )}
      </Card>
      <Card>
        <div className="add-access-title">
          <CardHeader
            title={
              labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                .TITLE_ADD_ACCESS
            }
          />
        </div>
        {stepData[1].addAccessRows.map(row => {
          return (
            <div className="add-access-row" key={row.id}>
              <DropdownComponent
                id={`company-${row.id}`}
                className="add-access-row-fields"
                label={
                  labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                    .COMPANY_LABEL
                }
                drop="down"
                data={[{ id: 'select', value: 'Select' }, ...companyList]}
                value={row.company ? row.company.value : ''}
                onSelect={_eventKey => handleCompanySelect(_eventKey, row.id)}
                error={row.companyError.length > 0 ? row.companyError : ''}
              />
              <DropdownComponent
                id="llc"
                className="add-access-row-fields"
                label={
                  labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                    .LLC_LABEL
                }
                drop="down"
                data={row.llcDropDownData}
                value={row.llc ? row.llc.value : ''}
                onSelect={_eventKey => handleLLCSelect(_eventKey, row.id)}
                noOptionsMessage="Select Company "
                error={row.llcError.length > 0 ? row.llcError : ''}
                isDisabled={row.isLLCDisabled}
              />
              <DropdownComponent
                id="property"
                className="add-access-row-fields"
                label={
                  labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                    .PROPERTY_LABEL
                }
                drop="down"
                data={row.propertyDropDownData}
                value={row.property ? row.property.value : ''}
                onSelect={_eventKey => handlePropertySelect(_eventKey, row.id)}
                noOptionsMessage="Select another LLC"
                error={row.propertyError.length > 0 ? row.propertyError : ''}
                isDisabled={row.isPropertyDisabled}
              />
              <div className="checkbox-section">
                <div className="display-checkbox-section">
                  <div className="access-check">
                    <Checkbox
                      id="fullAccess"
                      className="access-checkboxes"
                      label={
                        labelText.USER_AND_ACCESS
                          .ASSIGN_PROPERTY_AND_ACCESS_STEP_2.FULL_ACCESS_LABEL
                      }
                      checked={row.fullAccess}
                      onChange={e => handleFullAccessClick(row.id, e)}
                      error={row.accessError.length > 0}
                    />
                    <OverlayToolTip
                      label={
                        userAccessTypes.length > 0
                          ? userAccessTypes.find(
                              item =>
                                item.accessType.toLowerCase() ===
                                labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2.FULL_ACCESS_LABEL.toLowerCase(),
                            ).accessDescription
                          : 'Full access'
                      }
                      position="top"
                    >
                      <img
                        src={infoIcon}
                        alt=""
                        style={{ height: '12px', width: '12px' }}
                      />
                    </OverlayToolTip>
                  </div>
                  <div className="access-check">
                    <Checkbox
                      id="caseAccess"
                      className="access-checkboxes"
                      label={
                        labelText.USER_AND_ACCESS
                          .ASSIGN_PROPERTY_AND_ACCESS_STEP_2.CASE_ACCESS_LABEL
                      }
                      disabled={row.fullAccess}
                      checked={row.caseAccess}
                      onChange={e => handleCaseAccessClick(row.id, e)}
                      error={row.accessError.length > 0}
                    />
                    <OverlayToolTip
                      label={
                        userAccessTypes.length > 0
                          ? userAccessTypes.find(
                              item =>
                                item.accessType.toLowerCase() ===
                                labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2.CASE_ACCESS_LABEL.toLowerCase(),
                            ).accessDescription
                          : 'Case access'
                      }
                      position="top"
                    >
                      <img
                        src={infoIcon}
                        alt=""
                        style={{ height: '12px', width: '12px' }}
                      />
                    </OverlayToolTip>
                  </div>
                  <div className="access-check">
                    <Checkbox
                      id="addCaseAccess"
                      className="access-checkboxes"
                      label={
                        labelText.USER_AND_ACCESS
                          .ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                          .CASE_MANAGEMENT_ACCESS_LABEL
                      }
                      disabled={
                        stepData[0].userData.userType.value.toLowerCase() ===
                        'tenant'
                      }
                      checked={row.caseManipulateAccess}
                      onChange={e => handleCaseManipulateAccessClick(row.id, e)}
                      error={
                        row.accessError.length > 0 &&
                        stepData[0].userData.userType.value.toLowerCase() ===
                          'owner'
                      }
                    />
                    <OverlayToolTip
                      label={
                        userAccessTypes.length > 0
                          ? userAccessTypes.find(
                              item =>
                                item.accessType.toLowerCase() ===
                                labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2.CASE_MANAGEMENT_ACCESS_LABEL.toLowerCase(),
                            ).accessDescription
                          : 'Case Management access'
                      }
                      position="top"
                    >
                      <img
                        src={infoIcon}
                        alt=""
                        style={{ height: '12px', width: '12px' }}
                      />
                    </OverlayToolTip>
                  </div>
                </div>
                <div className="check-error">
                  {row.accessError.length > 0 ? row.accessError : ''}
                </div>
              </div>
            </div>
          );
        })}

        <div className="add-more-access-rows">
          <LabelWithIcon
            label={
              labelText.USER_AND_ACCESS.ASSIGN_PROPERTY_AND_ACCESS_STEP_2
                .ADD_MORE_ROW_LABEL
            }
            handleClick={handleAddMoreAccessRows}
          />
        </div>
      </Card>
      {/* cancel check popup */}

      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />

      <InformationAlert
        alertMessage={
          displayMessages.USER_AND_ACCESS.STEP_2.CONFIRM_ASSIGNED_ACCESS_DELETE
        }
        primaryButtonText="Yes"
        secondaryButtonText="No"
        open={confirmDeletion}
        setClose={() => setConfirmDeletion(!confirmDeletion)}
        primaryButtonOnClick={() => handleDeleteAssignedAccess(rowToDelete)}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  stepData: getUserAccessSteps(state),
  companyList: getCompanyListForDD(state),
  userAccessTypes: getUserAccessTypeList(state),
  assignedAccess: getAssignedAccess(state),
  userId: getUserIdFromState(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeStepData: setWizardStepsUserAccess,
      getCompanyListAPI: getCompanyListAPIAction,
      getPropertyListAPI: getPropertyListAPIAction,
      getLLCListAPI: getLLCListAPIAction,
      getUserAccessTypeListAPI: getUserAccessTypeListAPIAction,
      getAssignedAccessAPI: getAssignedAccessAPIAction,
      deletePropertyAndAccessAssignedAPI: deletePropertyAndAccessAssignedAPIAction,
    },
    dispatch,
  );

AssignPropertyAndAccess.propTypes = {
  stepData: PropTypes.instanceOf(Array).isRequired,
  changeStepData: PropTypes.func.isRequired,
  getCompanyListAPI: PropTypes.func.isRequired,
  companyList: PropTypes.instanceOf(Array).isRequired,
  getPropertyListAPI: PropTypes.func.isRequired,
  getLLCListAPI: PropTypes.func.isRequired,
  getUserAccessTypeListAPI: PropTypes.func.isRequired,
  userAccessTypes: PropTypes.instanceOf(Array).isRequired,
  getAssignedAccessAPI: PropTypes.func.isRequired,
  assignedAccess: PropTypes.instanceOf(Array).isRequired,
  deletePropertyAndAccessAssignedAPI: PropTypes.instanceOf(Array).isRequired,
  // isEditUserReq: PropTypes.bool.isRequired,
  userId: PropTypes.string,
};

AssignPropertyAndAccess.defaultProps = {
  userId: '',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssignPropertyAndAccess);

const TooltipComp = ({ textDescription, children }) => {
  return (
    <>
      <OverlayTrigger
        key="right"
        placement="top"
        overlay={
          <Tooltip id="tooltip-right">
            <div className="tooltip-text">{textDescription}</div>
          </Tooltip>
        }
      >
        {children}
      </OverlayTrigger>
    </>
  );
};

TooltipComp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
  textDescription: PropTypes.string.isRequired,
};
