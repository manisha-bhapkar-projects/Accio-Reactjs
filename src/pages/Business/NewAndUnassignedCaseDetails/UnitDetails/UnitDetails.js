import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './UnitDetails.scss';
import _ from 'lodash';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useTranslation } from 'react-i18next';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import CardListTable from '../../../../components/CardListTable/CardListTable';
import DropdownComponentWithSearchBar from '../../../../components/Dropdown/DropdownComponentWithSearchBar';
import LabelWithIcon from '../../../../components/LabelWithIcon/LabelWithIcon';
import ErrorAlert from '../../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import InformationAlert from '../../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import editBtn from '../../../../images/edit/edit.png';
import deleteIcon from '../../../../images/delete/delete.png';
import SuccessAlert from '../../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import {
  getUnitIDsCaseDetailsApiAction,
  getCaseDetailsApiAction,
  deleteUnitDetailsApiAction,
  updateUnitDetailsApiAction,
} from '../../../../actions/Business/caseDetailsAction';
import { getErrorMessage } from '../../../../utils/utils';

function UnitDetails({
  leaseDetailsState,
  handleLeaseDetailsChange,
  setDuplicateLeaseDetailsState,
  unitDetailsState,
  handleUnitDetailsChange,
  propertyUOM,
  viewCase,
  editCase,
  getUnitIDsCaseDetailsApi,
  caseDetailsState,
  duplicateUnitDetailsState,
  getCaseDetailsApi,
  deleteUnitDetailsApi,
  caseId,
  updateUnitDetailsApi,
  setDuplicateUnitDetails,
}) {
  const { t } = useTranslation();
  const initialColumns = [
    {
      name: t('CASE_DETAILS.UNIT_DETAILS.COL_1_UNIT_ID'),
      allowOverflow: true,
      cell: row => {
        return (
          <>
            {viewCase && row.isDeletable ? (
              <div>
                {Object.keys(row.unitId).length ? row.unitId.value : '-'}
              </div>
            ) : (
              <DropdownComponentWithSearchBar
                id="unit-id"
                className="unit-details-dropdown"
                data={[
                  { id: 'select', value: t('GLOBAL.SELECT') },
                  ...unitDetailsState.unitIdList,
                ]}
                value={row.unitId ? row.unitId.value : ''}
                isDisabled={unitDetailsState.unitIdDisabled}
                onSelect={_eventKey => handleUnitSelect(_eventKey, row.id)}
              />
            )}
          </>
        );
      },
    },
    {
      name: t('CASE_DETAILS.UNIT_DETAILS.COL_2_UNIT_TYPE'),
      selector: 'unitType',
      cell: row => {
        return Object.keys(row.unitId).length === 0 ? (
          <div>-</div>
        ) : (
          <div>{row.unitType.value}</div>
        );
      },
      center: true,
    },
    {
      name: propertyUOM.length
        ? `${t('CASE_DETAILS.UNIT_DETAILS.COL_3_AREA')} (${propertyUOM})`
        : t('CASE_DETAILS.UNIT_DETAILS.COL_3_AREA'),
      selector: 'area',
      right: true,
    },
  ];

  const editCaseColumn = [
    ...initialColumns,
    {
      name: '',
      sortable: false,
      cell: row => {
        return (
          <>
            {row.isDeletable ? (
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDeleteUnit(row)}
              >
                <img
                  src={deleteIcon}
                  alt="del"
                  style={{ height: '21px', width: '16px' }}
                />
              </button>
            ) : (
              ''
            )}
          </>
        );
      },
      width: '70px',
      right: true,
    },
  ];

  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isEdit, setIsEdit] = React.useState(false);
  const [isCancel, setIsCancel] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [successAction, setSuccessAction] = React.useState('');

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  useEffect(() => {
    if (!isSuccess) {
      setSuccessMessage('');
    }
  }, [isSuccess]);

  const handleAddMoreRows = () => {
    const modifiedUnitDetailsState = { ...unitDetailsState };
    const modifiedUnitDetailRows = [...modifiedUnitDetailsState.unitDetailRows];

    modifiedUnitDetailRows.push({
      id: modifiedUnitDetailRows.length + 1,
      unitId: {},
      unitType: {},
      area: '-',
      hasAnyValue: false,
      isDeletable: false,
    });

    modifiedUnitDetailsState.unitDetailRows = modifiedUnitDetailRows;
    handleUnitDetailsChange(modifiedUnitDetailsState);
  };

  const handleUnitSelect = (_eventKey, unitDetailRowId) => {
    const modifiedUnitDetails = { ...unitDetailsState };
    if (_eventKey === 'select') {
      modifiedUnitDetails.unitDetailRows.find(
        row => row.id === unitDetailRowId,
      ).unitId = {};
      modifiedUnitDetails.unitDetailRows.find(
        row => row.id === unitDetailRowId,
      ).unitType = {};
      modifiedUnitDetails.unitDetailRows.find(
        row => row.id === unitDetailRowId,
      ).area = '-';

      modifiedUnitDetails.unitDetailRows.find(
        row => row.id === unitDetailRowId,
      ).hasAnyValue = false;
      modifiedUnitDetails.unitAreaTotal = calculateTotalArea(
        modifiedUnitDetails.unitDetailRows.filter(
          item => item.hasAnyValue === true,
        ),
      );

      handleUnitDetailsChange(modifiedUnitDetails);
    } else {
      const selectedVal = modifiedUnitDetails.unitIdList.find(
        item => item.id === _eventKey,
      );

      modifiedUnitDetails.unitDetailRows.find(
        row => row.id === unitDetailRowId,
      ).unitId = selectedVal;
      modifiedUnitDetails.unitDetailRows.find(
        row => row.id === unitDetailRowId,
      ).unitType = selectedVal.unitType;
      modifiedUnitDetails.unitDetailRows.find(
        row => row.id === unitDetailRowId,
      ).area = selectedVal.unitSize;

      modifiedUnitDetails.unitDetailRows.find(
        row => row.id === unitDetailRowId,
      ).hasAnyValue = true;

      const rowsHavingValue = modifiedUnitDetails.unitDetailRows.filter(
        item => item.hasAnyValue === true,
      );

      if (
        _.uniqBy(rowsHavingValue, 'unitId.id').length !== rowsHavingValue.length
      ) {
        setErrorMessage(
          t('CASE_DETAILS.ERROR_MSG.ERR_SAME_UNIT_DETAILS_ADDED_TWICE'),
        );
        setIsErrorMessage(true);
      }

      modifiedUnitDetails.unitAreaTotal = calculateTotalArea(
        unitDetailsState.unitDetailRows.filter(
          item => item.hasAnyValue === true,
        ),
      );

      handleUnitDetailsChange(modifiedUnitDetails);
    }
  };

  const calculateTotalArea = unitsRows => {
    let total = 0;
    unitsRows.forEach(item => {
      total += Number(item.area);
    });

    return total === 0 ? '-' : total;
  };

  const handleEditClick = () => {
    setIsEdit(true);
    const modifiedUnitDetails = { ...unitDetailsState };
    getUnitIDsCaseDetailsApi(caseDetailsState.property.id)
      .then(res => {
        if (res.data.success) {
          const apiUnitIdData = res.data.data;
          const modfiedUnitIdData = [];
          apiUnitIdData.forEach(unit => {
            const unitIdObj = {
              id: unit.unitId,
              value: unit.unitScode,
              unitType: { id: unit.unitTypeId, value: unit.unitTypeName },
              unitSize: unit.unitSize,
            };
            modfiedUnitIdData.push(unitIdObj);
          });
          modifiedUnitDetails.unitIdList = modfiedUnitIdData;
          modifiedUnitDetails.unitIdDisabled = false;
          handleUnitDetailsChange(modifiedUnitDetails);
        }
      })
      .catch(err => {
        setErrorMessage(getErrorMessage(err));
        setIsErrorMessage(true);
      });
  };

  const handleDeleteUnit = row => {
    deleteUnitDetailsApi(row.id)
      .then(res => {
        if (res.data.success) {
          getCaseDetailsApi(caseId).then(caseDetailRes => {
            if (res.data.success) {
              const apiCaseDetails = caseDetailRes.data.data[0];
              const modifiedUnitDetails = { ...unitDetailsState };
              const modifiedLeaseDetails = { ...leaseDetailsState };

              const beingAddedUnitDetailRows = modifiedUnitDetails.unitDetailRows.filter(
                item => item.isDeletable === false,
              );

              const unitDetailRowsList = [];
              apiCaseDetails.unitDetails.forEach(unitRow => {
                const unitRowObj = {
                  id: unitRow.propertyCaseUnitId,
                  unitId: { id: unitRow.unitId, value: unitRow.unitScode },
                  unitType: {
                    id: unitRow.unitTypeId,
                    value: unitRow.unitTypeName,
                  },
                  area: unitRow.unitSize,
                  hasAnyValue: true,
                  isDeletable: true,
                };
                unitDetailRowsList.push(unitRowObj);
              });

              beingAddedUnitDetailRows.forEach(unitRow => {
                const modifiedUnitRow = unitRow;

                modifiedUnitRow.id = unitDetailRowsList.length + 1;
                unitDetailRowsList.push(modifiedUnitRow);
              });

              modifiedUnitDetails.unitDetailRows = unitDetailRowsList;

              // modifiedUnitDetails.unitAreaTotal = calculateTotalArea();

              modifiedUnitDetails.unitAreaTotal = calculateTotalArea(
                modifiedUnitDetails.unitDetailRows.filter(
                  item => item.hasAnyValue === true,
                ),
              );
              modifiedLeaseDetails.leasedArea =
                modifiedUnitDetails.unitAreaTotal;

              handleLeaseDetailsChange(modifiedLeaseDetails);
              setDuplicateLeaseDetailsState(modifiedLeaseDetails);

              handleUnitDetailsChange(modifiedUnitDetails);
              setDuplicateUnitDetails(modifiedUnitDetails);
            }
          });
          setIsSuccess(true);
          setSuccessAction('delete');
          setSuccessMessage(
            t('CASE_DETAILS.ERROR_MSG.UNIT_DETAILS_DELETE_SUCCESS'),
          );
        }
      })
      .catch(err => {
        setErrorMessage(getErrorMessage(err));
        setIsErrorMessage(true);
      });
  };

  const handleUnitDetailsCancel = () => {
    if (
      !isCancel &&
      unitDetailsState.unitDetailRows.some(
        item => item.hasAnyValue === true && item.isDeletable === false,
      )
    ) {
      setIsCancel(true);
      return;
    }

    if (
      !duplicateUnitDetailsState.unitDetailRows.some(
        item => item.hasAnyValue === true && item.isDeletable === true,
      )
    ) {
      setErrorMessage(t('CASE_DETAILS.ERROR_MSG.ERR_NO_UNITS_ADDED'));
      setIsErrorMessage(true);
      return;
    }

    handleUnitDetailsChange(duplicateUnitDetailsState);
    setIsCancel(false);
    setIsEdit(false);
  };

  const handleUnitDetailsSubmit = () => {
    const rowsHavingValue = unitDetailsState.unitDetailRows.filter(
      item => item.hasAnyValue === true,
    );
    if (rowsHavingValue.length === 0) {
      setErrorMessage(t('CASE_DETAILS.ERROR_MSG.ERR_NO_UNITS_ADDED'));
      setIsErrorMessage(true);
      return;
    }

    if (
      _.uniqBy(rowsHavingValue, 'unitId.id').length !== rowsHavingValue.length
    ) {
      setErrorMessage(
        t('CASE_DETAILS.ERROR_MSG.ERR_SAME_UNIT_DETAILS_ADDED_TWICE'),
      );
      setIsErrorMessage(true);
      return;
    }

    const addedUnitRows = unitDetailsState.unitDetailRows.filter(
      row => row.isDeletable === false && row.hasAnyValue === true,
    );

    const newAddedUnits = addedUnitRows.map(row => {
      return {
        unitId: row.unitId.id,
      };
    });

    const reqObj = {
      caseId,
      // leaseArea: unitDetailsState.unitAreaTotal,
      addUnitDetails: newAddedUnits,
    };

    updateUnitDetailsApi(reqObj)
      .then(res => {
        if (res.data.success) {
          setIsEdit(false);
          getCaseDetailsApi(caseId).then(resCase => {
            if (resCase.data.success) {
              const modifiedUnitDetails = { ...unitDetailsState };
              const modifiedLeaseDetails = { ...leaseDetailsState };
              const apiCaseDetails = resCase.data.data[0];
              const unitDetailRowsList = [];
              apiCaseDetails.unitDetails.forEach(unitRow => {
                const unitRowObj = {
                  // id: unitDetailRowsList.length + 1,
                  id: unitRow.propertyCaseUnitId,
                  unitId: { id: unitRow.unitId, value: unitRow.unitScode },
                  unitType: {
                    id: unitRow.unitTypeId,
                    value: unitRow.unitTypeName,
                  },
                  area: unitRow.unitSize,
                  hasAnyValue: true,
                  isDeletable: true,
                };
                unitDetailRowsList.push(unitRowObj);
              });

              modifiedUnitDetails.unitDetailRows = unitDetailRowsList;

              modifiedUnitDetails.unitAreaTotal = calculateTotalArea(
                modifiedUnitDetails.unitDetailRows.filter(
                  item => item.hasAnyValue === true,
                ),
              );
              modifiedLeaseDetails.leasedArea =
                modifiedUnitDetails.unitAreaTotal;

              handleLeaseDetailsChange(modifiedLeaseDetails);
              setDuplicateLeaseDetailsState(modifiedLeaseDetails);

              handleUnitDetailsChange(modifiedUnitDetails);
              setDuplicateUnitDetails(modifiedUnitDetails);
            }
          });
          setIsSuccess(true);
          setSuccessAction('submit');
          setSuccessMessage(
            t('CASE_DETAILS.ERROR_MSG.UNIT_DETAILS_SECTION_EDIT_SUCCESS'),
          );
        }
      })
      .catch(err => {
        setErrorMessage(getErrorMessage(err));
        setIsErrorMessage(true);
      });
  };

  const handleSuccessAlertClick = () => {
    if (successAction === 'delete') {
      setIsSuccess(false);
    }

    if (successAction === 'submit') {
      setIsSuccess(false);
    }
  };

  return (
    <div className="unit-details">
      <Card className="unit-details-card">
        {editCase && !isEdit ? (
          <div className="edit-btn-div">
            <button
              type="button"
              onClick={handleEditClick}
              className="edit-btn"
            >
              <img src={editBtn} alt="" />
            </button>
          </div>
        ) : (
          ''
        )}
        <CardHeader title={t('CASE_DETAILS.UNIT_DETAILS.UNIT_DETAILS_TITLE')} />
        <div className="unit-details-section">
          <CardListTable
            data={unitDetailsState.unitDetailRows}
            columns={editCase && isEdit ? editCaseColumn : initialColumns}
          />
          <div className="area-total-div">
            <div className="area-total">
              <span>{t('CASE_DETAILS.UNIT_DETAILS.TOTAL_AREA')}</span>
              <span>{unitDetailsState.unitAreaTotal}</span>
            </div>
          </div>
          {viewCase && !isEdit ? (
            ''
          ) : (
            <div className="add-more-row">
              <LabelWithIcon
                label={t('GLOBAL.ADD_MORE_ROWS')}
                handleClick={handleAddMoreRows}
              />
            </div>
          )}
        </div>
        {editCase && isEdit ? (
          <div className="unit-details-save">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleUnitDetailsCancel}
            >
              {t('GLOBAL.BUTTON_CANCEL')}
            </button>

            {/* we have commented this for now but will include this in futher phase when we do implementation for this */}
            {/* <button
            type="button"
            className="btn-save-close"
            onClick={handleSaveAndClose}
          >
            {labelText.GLOBAL.BUTTON_SAVE_AND_CLOSE}
          </button> */}
            <button
              type="button"
              className="btn-save-submit"
              onClick={handleUnitDetailsSubmit}
            >
              {t('GLOBAL.BUTTON_SAVE_AND_SUMIT')}
            </button>
          </div>
        ) : (
          ''
        )}
      </Card>

      <SuccessAlert
        alertMessage={successMessage}
        primaryButtonText={t('GLOBAL.OK')}
        open={isSuccess}
        setClose={() => {
          setIsSuccess(!isSuccess);
          handleSuccessAlertClick();
        }}
        primaryButtonOnClick={() => handleSuccessAlertClick()}
      />

      <InformationAlert
        alertMessage={t('GLOBAL.ERROR_MSG.ERR_CHANGES_LOST')}
        primaryButtonText={t('GLOBAL.YES')}
        secondaryButtonText={t('GLOBAL.NO')}
        open={isCancel}
        setClose={() => setIsCancel(!isCancel)}
        primaryButtonOnClick={() => handleUnitDetailsCancel()}
      />
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText={t('GLOBAL.OK')}
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />
    </div>
  );
}

UnitDetails.propTypes = {
  unitDetailsState: PropTypes.instanceOf(Object).isRequired,
  handleUnitDetailsChange: PropTypes.func.isRequired,
  propertyUOM: PropTypes.string.isRequired,
  viewCase: PropTypes.string.isRequired,
  editCase: PropTypes.string.isRequired,
  getUnitIDsCaseDetailsApi: PropTypes.func.isRequired,
  caseDetailsState: PropTypes.instanceOf(Object).isRequired,
  duplicateUnitDetailsState: PropTypes.instanceOf(Object).isRequired,
  getCaseDetailsApi: PropTypes.func.isRequired,
  deleteUnitDetailsApi: PropTypes.func.isRequired,
  caseId: PropTypes.string,
  leaseDetailsState: PropTypes.instanceOf(Object).isRequired,
  handleLeaseDetailsChange: PropTypes.func.isRequired,
  setDuplicateLeaseDetailsState: PropTypes.func.isRequired,
  updateUnitDetailsApi: PropTypes.func.isRequired,
  setDuplicateUnitDetails: PropTypes.func.isRequired,
};

UnitDetails.defaultProps = {
  caseId: '',
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUnitIDsCaseDetailsApi: getUnitIDsCaseDetailsApiAction,
      getCaseDetailsApi: getCaseDetailsApiAction,
      deleteUnitDetailsApi: deleteUnitDetailsApiAction,
      updateUnitDetailsApi: updateUnitDetailsApiAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(UnitDetails);
