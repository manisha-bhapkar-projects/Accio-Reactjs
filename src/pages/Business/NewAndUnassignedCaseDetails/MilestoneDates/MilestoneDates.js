import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './MilestoneDates.scss';
import { useTranslation } from 'react-i18next';
import { Card } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import editBtn from '../../../../images/edit/edit.png';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import CardListTable from '../../../../components/CardListTable/CardListTable';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import { getFormatedDate, getErrorMessage } from '../../../../utils/utils';
import useScreenSize from '../../../../components/CustomHooks/BreackPointHook/UseScreenSize';
import InformationAlert from '../../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import { updateMilestoneDatesApiAction } from '../../../../actions/Business/caseDetailsAction';
import ErrorAlert from '../../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';

function MilestoneDates({
  milestoneDatesState,
  handleMilestoneDatesChange,
  viewCase,
  editCase,
  duplicateMilestoneDates,
  isFromCaseActivityHistory,
  caseId,
  updateMilestoneDatesApi,
  setDuplicateMilestoneDates,
  getCaseDetailsApi,
}) {
  const { t } = useTranslation();
  const screenWidth = useScreenSize();
  const [isEdit, setIsEdit] = React.useState(false);
  const [isCancel, setIsCancel] = React.useState(false);
  const [isAnyBudgetedDate, setIsAnyBudgetedDate] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  const columns = [
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_1_PHASE'),
      selector: 'phaseName',
      sortable: false,
      wrap: 'true',
      width: '121px',
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_2_BUDGETED_COMPLETION'),
      // selector: 'bu',
      sortable: false,
      maxWidth: '182px',
      allowOverflow: true,
      cell: row => {
        return (
          <>
            {viewCase && !isEdit ? (
              <div>
                {row.budgetedCompletion !== '' &&
                row.budgetedCompletion !== null
                  ? getFormatedDate(row.budgetedCompletion)
                  : '-'}
              </div>
            ) : (
              <CustomDatePicker
                // label="start Time"
                min="2000-01-01"
                max="2210-12-31"
                isbeforeDateNotSelectable
                value={row.budgetedCompletion}
                onDateChange={_date => handleBudgetedDateChange(_date, row)}
              />
            )}
          </>
        );
      },
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_3_PLANNED_COMPLETION'),
      selector: 'plannedCompletion',
      maxWidth: '175px',
      sortable: false,
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_4_RE-PLANNED_COMPLETION'),
      selector: 'rePlannedCompletion',
      maxWidth: '197px',
      sortable: false,
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_5_ACTUAL_COMPLETION'),
      selector: 'actualCompletion',
      maxWidth: '165px',
      sortable: false,
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_6_DELAY_IN_DAYS'),
      selector: 'delayInDays',
      maxWidth: '120px',
      sortable: false,
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_7_DELAY_DUE_TO'),
      selector: 'delayDueTo',
      maxWidth: '115px',
      sortable: false,
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_8_COMMENTS'),
      selector: 'comments',
      sortable: false,
      wrap: true,
    },
  ];

  const columnsTablet = [
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_1_PHASE'),
      selector: 'phaseName',
      sortable: false,
      wrap: 'true',
      conditionalCellStyles: [
        {
          when: row => row.isExpanded === true,
          style: {
            borderLeft: 'solid 1px #CCDAE6',
            height: '4.3rem',
          },
        },
      ],
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_2_BUDGETED_COMPLETION'),
      // selector: 'bu',
      sortable: false,
      allowOverflow: true,
      // width: '200px',
      cell: row => {
        return (
          <>
            {viewCase && !isEdit ? (
              <div>
                {row.budgetedCompletion !== '' &&
                row.budgetedCompletion !== null
                  ? getFormatedDate(row.budgetedCompletion)
                  : '-'}
              </div>
            ) : (
              <CustomDatePicker
                // label="start Time"
                min="2000-01-01"
                max="2210-12-31"
                isbeforeDateNotSelectable
                value={row.budgetedCompletion}
                onDateChange={_date => handleBudgetedDateChange(_date, row)}
              />
            )}
          </>
        );
      },
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_3_PLANNED_COMPLETION'),
      selector: 'plannedCompletion',
      sortable: false,
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_4_RE-PLANNED_COMPLETION'),
      selector: 'rePlannedCompletion',
      sortable: false,
      center: true,
    },
    {
      name: t('CASE_DETAILS.MILESTONE_DETAILS.COL_5_ACTUAL_COMPLETION'),
      selector: 'actualCompletion',
      sortable: false,
      center: true,
    },
    {
      name: '',
      sortable: false,
      cell: row => {
        return (
          <button
            type="button"
            className="expansion-btn"
            onClick={() => handleRowExpanded(row)}
          >
            {!row.isExpanded ? <span>+</span> : <span>—</span>}
          </button>
        );
      },
      width: '47px',
      center: 'true',
      conditionalCellStyles: [
        {
          when: row => row.isExpanded === true,
          style: {
            // height: 'calc(100% + 2px)',
            marginBottom: '-2px',
            borderLeft: 'solid 1px #d1d1d1',
            borderRight: 'solid 1px #CCDAE6',
            borderBottom: 'solid 2px #ffffff',
            borderTop: 'none',
            height: '4.5rem',
          },
        },
      ],
      style: {
        height: 'calc(100% + 2px)',
      },
    },
  ];

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const handleRowExpanded = row => {
    const modifiedMilestoneDateDetails = [...milestoneDatesState];

    const currentExpandState = modifiedMilestoneDateDetails.find(
      item => item.id === row.id,
    ).isExpanded;
    modifiedMilestoneDateDetails.map(item => {
      const modifiedItem = item;
      modifiedItem.isExpanded = false;
      return modifiedItem;
    });

    modifiedMilestoneDateDetails.find(
      item => item.id === row.id,
    ).isExpanded = !currentExpandState;
    handleMilestoneDatesChange(modifiedMilestoneDateDetails);
  };

  const handleBudgetedDateChange = (_date, row) => {
    const modifiedMilestoneDates = [...milestoneDatesState];
    modifiedMilestoneDates.find(
      item => item.id === row.id,
    ).budgetedCompletion = _date;
    handleMilestoneDatesChange(modifiedMilestoneDates);
  };

  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleMilestoneDatesCancel = () => {
    const isDatesNotModified = _.isEqual(
      milestoneDatesState,
      duplicateMilestoneDates,
    );

    // console.log(milestoneDatesState, 'milestoneDatesState');
    // console.log(duplicateMilestoneDates, 'duplicateMilestoneDates');
    // console.log(isDatesNotModified, 'isDatesNotModified');

    if (!isCancel && !isDatesNotModified) {
      setIsCancel(true);
      return;
    }

    handleMilestoneDatesChange(duplicateMilestoneDates);
    setIsCancel(false);
    setIsEdit(false);
  };

  const handleMilestoneDatesSubmit = () => {
    if (!milestoneDatesState.some(item => item.budgetedCompletion !== '')) {
      if (!isAnyBudgetedDate) {
        setIsAnyBudgetedDate(true);
        return;
      }

      setIsAnyBudgetedDate(false);
    }

    const milestoneDatesArr = milestoneDatesState.map(phaseDet => {
      return {
        propertyCaseBudgtedDateId: phaseDet.propertyCaseBudgtedDateId,
        budgetedCompletionDate: phaseDet.budgetedCompletion,
      };
    });

    const reqObj = {
      caseId,
      isFromCaseActivityHistory,
      milestoneDates: milestoneDatesArr,
    };

    updateMilestoneDatesApi(reqObj)
      .then(res => {
        if (res.data.success) {
          setIsEdit(false);
          getCaseDetailsApi(caseId).then(resCase => {
            if (resCase.data.success) {
              const apiCaseDetails = resCase.data.data[0];
              const modifiedMilestoneDetails = [];

              apiCaseDetails.milestoneDates.forEach(phaseDetails => {
                const phaseMilestoneObj = {
                  id: phaseDetails.propertyPhaseId,
                  phaseName: phaseDetails.propertyPhaseName,
                  phaseSequence: phaseDetails.propertyPhaseSequence,
                  propertyCaseBudgtedDateId:
                    phaseDetails.propertyCaseBudgtedDateId,
                  budgetedCompletion: phaseDetails.budgetedCompletionDate,
                  plannedCompletion: phaseDetails.plannedCompletionDate
                    ? phaseDetails.plannedCompletionDate
                    : '-',
                  rePlannedCompletion: phaseDetails.rePlannedCompletionDate
                    ? phaseDetails.rePlannedCompletionDate
                    : '-',
                  actualCompletion: phaseDetails.actualCompletionDate
                    ? phaseDetails.actualCompletionDate
                    : '-',
                  delayInDays: phaseDetails.delayInDays
                    ? phaseDetails.delayInDays
                    : '-',
                  delayDueTo: phaseDetails.delayDueTo
                    ? phaseDetails.delayDueTo
                    : '-',
                  comments: phaseDetails.comments ? phaseDetails.comments : '-',
                  isExpanded: false,
                };

                modifiedMilestoneDetails.push(phaseMilestoneObj);
              });

              handleMilestoneDatesChange(modifiedMilestoneDetails);
              setDuplicateMilestoneDates(modifiedMilestoneDetails);
            }
          });
          setIsSuccess(true);
        }
      })
      .catch(err => {
        setErrorMessage(getErrorMessage(err));
        setIsErrorMessage(true);
      });

    // setIsEdit(false);
  };

  const tableJSX =
    screenWidth > 1024 ? (
      <CardListTable data={milestoneDatesState} columns={columns} />
    ) : (
      <CardListTable
        data={milestoneDatesState}
        columns={columnsTablet}
        className="tablet-milestone-table"
        expandableRows
        expandableRowExpanded={row => row.isExpanded}
        expandableRowsComponent={<TableExpandedRow t={t} />}
        numOfColumns={columns.length - 1}
      />
    );

  return (
    <div className="milestone-dates">
      <Card className="milestone-dates-card">
        {editCase && !isEdit && !isFromCaseActivityHistory ? (
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
        <CardHeader
          title={t('CASE_DETAILS.MILESTONE_DETAILS.MILESTONE_DETAILS_TITLE')}
        />
        <div className="milestone-dates-section">{tableJSX}</div>
        {editCase && isEdit ? (
          <div className="milestone-dates-save">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleMilestoneDatesCancel}
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
              onClick={handleMilestoneDatesSubmit}
            >
              {t('GLOBAL.BUTTON_SAVE_AND_SUMIT')}
            </button>
          </div>
        ) : (
          ''
        )}
      </Card>
      <InformationAlert
        alertMessage={t('GLOBAL.ERROR_MSG.ERR_CHANGES_LOST')}
        primaryButtonText={t('GLOBAL.YES')}
        secondaryButtonText={t('GLOBAL.NO')}
        open={isCancel}
        setClose={() => setIsCancel(!isCancel)}
        primaryButtonOnClick={() => handleMilestoneDatesCancel()}
      />

      <InformationAlert
        alertMessage={t(
          'CASE_DETAILS.ERROR_MSG.ALERT_NO_BUDGETED_COMPLETION_DATE',
        )}
        primaryButtonText={t('GLOBAL.YES')}
        secondaryButtonText={t('GLOBAL.NO')}
        open={isAnyBudgetedDate}
        setClose={() => setIsAnyBudgetedDate(!isAnyBudgetedDate)}
        primaryButtonOnClick={handleMilestoneDatesSubmit}
      />
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText={t('GLOBAL.OK')}
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />
      <SuccessAlert
        alertMessage={t(
          'CASE_DETAILS.ERROR_MSG.MILESTONE_DETAILS_SECTION_EDIT_SUCCESS',
        )}
        primaryButtonText={t('GLOBAL.OK')}
        open={isSuccess}
        setClose={() => {
          setIsSuccess(!isSuccess);
        }}
        primaryButtonOnClick={() => setIsSuccess(!isSuccess)}
      />
    </div>
  );
}

MilestoneDates.propTypes = {
  milestoneDatesState: PropTypes.instanceOf(Array).isRequired,
  handleMilestoneDatesChange: PropTypes.func.isRequired,
  viewCase: PropTypes.string.isRequired,
  editCase: PropTypes.string.isRequired,
  duplicateMilestoneDates: PropTypes.instanceOf(Array).isRequired,
  isFromCaseActivityHistory: PropTypes.bool.isRequired,
  caseId: PropTypes.string,
  updateMilestoneDatesApi: PropTypes.func.isRequired,
  setDuplicateMilestoneDates: PropTypes.func.isRequired,
  getCaseDetailsApi: PropTypes.func.isRequired,
};
MilestoneDates.defaultProps = {
  caseId: '',
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateMilestoneDatesApi: updateMilestoneDatesApiAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneDates);

const TableExpandedRow = ({ data, t }) => {
  // console.log("data = ",data.delaysInDays);
  return (
    <div className="milestone-table-row-expanded">
      <div
        className="milestone-detail"
        style={{ width: '150px', flexGrow: 'unset' }}
      >
        <span className="milestone-detail-heading">
          {t('CASE_DETAILS.MILESTONE_DETAILS.COL_6_DELAY_IN_DAYS')}
        </span>
        <span className="milestone-detail-value">{data.delayInDays}</span>
      </div>
      <div
        className="milestone-detail"
        style={{ width: '150px', flexGrow: 'unset' }}
      >
        <span className="milestone-detail-heading">
          {t('CASE_DETAILS.MILESTONE_DETAILS.COL_7_DELAY_DUE_TO')}
        </span>
        <span className="milestone-detail-value">{data.delayDueTo}</span>
      </div>
      <div className="milestone-detail">
        <span className="milestone-detail-heading">
          {t('CASE_DETAILS.MILESTONE_DETAILS.COL_8_COMMENTS')}
        </span>
        <span className="milestone-detail-value">{data.comments}</span>
      </div>
    </div>
  );
};

TableExpandedRow.propTypes = {
  data: PropTypes.instanceOf(Object),
  t: PropTypes.func.isRequired,
};

TableExpandedRow.defaultProps = {
  data: [],
};
