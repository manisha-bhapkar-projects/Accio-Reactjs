import React, { useEffect } from 'react';
import './NewAndUnassignedCaseDetails.scss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import CaseDetails from './CaseDetails/CaseDetails';
import MilestoneDates from './MilestoneDates/MilestoneDates';
import LeaseDetails from './LeaseDetails/LeaseDetails';
import UnitDetails from './UnitDetails/UnitDetails';
import {
  getUserPropertyListWithCMApiAction,
  getCaseDetailsApiAction,
  getPropertyUOMApiAction,
  getAmendmentTypeListApiAction,
  createCaseApiAction,
  getBrandListCaseDetailsApiAction,
  // getUnitIDsCaseDetailsApiAction,
} from '../../../actions/Business/caseDetailsAction';
import { getErrorMessage } from '../../../utils/utils';
import { getCaseTypeListApiAction } from '../../../actions/Business/caseListingAction';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import { validateNameWithRegex } from '../../../utils/validation';

function NewAndUnassignedCaseDetails({
  getUserPropertyListWithCMApi,
  getAmendmentTypeListApi,
  getCaseTypeListApi,
  createCaseApi,
  history,
  match,
  getCaseDetailsApi,
  getBrandListCaseDetailsApi,
  // getUnitIDsCaseDetailsApi,
  getPropertyUOMApi,

  // caseTypeList,
}) {
  const { t } = useTranslation();

  const calculateTotalArea = unitDetailRows => {
    let total = 0;
    unitDetailRows.forEach(item => {
      total += Number(item.area);
    });

    return total === 0 ? '-' : total;
  };

  const initialCaseDetailsState = {
    caseNo: '',
    phase: '',
    status: '',
    caseType: {},
    customer: {},
    brand: {},
    property: {},
    isCustomerDisabled: true,
    isBrandDisabled: true,
    propertyList: [],
    brandList: [],
    customerList: [],
    caseTypeList: [],
    caseTypeError: '',
    customerError: '',
    brandError: '',
    propertyError: '',
    caseDetailsIsError: false,
    isAnyValueModified: false,
  };

  const initialMilestoneDatesState = [];

  const initialLeaseDetailsState = {
    caseCreationDate: '',
    leasedArea: '',
    lafApprovalDate: '',
    leaseId: '',
    amendmentType: {},
    contractSigned: '',
    fitoutPeriod: '',
    leaseFrom: '',
    leaseTo: '',
    amendmentTypeList: [],
    lafApprovalDateError: '',
    leaseIdError: '',
    amendmentTypeError: '',
    contractSignedError: '',
    fitoutPeriodError: '',
    leaseFromError: '',
    leaseToError: '',
    leaseDetailsIsError: false,
    isAnyValueModified: false,
  };

  const initialUnitDetailsState = {
    unitIdList: [],
    unitIdDisabled: true,
    unitAreaTotal: '-',
    unitDetailRows: [
      {
        id: 1,
        unitId: {},
        unitType: {},
        area: '-',
        hasAnyValue: false,
        isDeletable: true,
      },
      {
        id: 2,
        unitId: {},
        unitType: {},
        area: '-',
        hasAnyValue: false,
        isDeletable: true,
      },
      {
        id: 3,
        unitId: {},
        unitType: {},
        area: '-',
        hasAnyValue: false,
        isDeletable: true,
      },
    ],
  };

  const [caseDetails, setCaseDetails] = React.useState(initialCaseDetailsState);
  const [duplicateCaseDetails, setDuplicateCaseDetails] = React.useState(
    initialCaseDetailsState,
  );

  const [milestoneDates, setMilestoneDates] = React.useState(
    initialMilestoneDatesState,
  );
  const [leaseDetails, setLeaseDetails] = React.useState(
    initialLeaseDetailsState,
  );
  const [duplicateLeaseDetails, setDuplicateLeaseDetails] = React.useState(
    initialLeaseDetailsState,
  );
  const [duplicateMilestoneDates, setDuplicateMilestoneDates] = React.useState(
    initialMilestoneDatesState,
  );

  const [unitDetails, setUnitDetails] = React.useState(initialUnitDetailsState);
  const [duplicateUnitDetails, setDuplicateUnitDetails] = React.useState(
    initialUnitDetailsState,
  );

  const [isAnyBudgetedDate, setIsAnyBudgetedDate] = React.useState(false);

  const [propertyUOM, setPropertyUOM] = React.useState('');

  // const [caseState, setCaseState] = React.useState(intialState);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [
    isCreateCaseErrorMessage,
    setIsCreateCaseErrorMessage,
  ] = React.useState(false);
  const [createCaseErrorMessage, setCreateCaseErrorMessage] = React.useState(
    '',
  );

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [
    isFromCaseActivityHistory,
    setIsFromCaseActivityHistory,
  ] = React.useState(false);

  const { caseId } = match.params;
  const [
    isCaseManipulationAccess,
    setIsCaseManipulationAccess,
  ] = React.useState(false);
  const addCase = !caseId;
  const viewCase = caseId ? 'view' : '';
  const editCase = caseId && isCaseManipulationAccess ? 'edit' : '';

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  useEffect(() => {
    if (!isCreateCaseErrorMessage) {
      setCreateCaseErrorMessage('');
    }
  }, [isCreateCaseErrorMessage]);

  useEffect(() => {
    getCaseTypeListApi();

    if (caseId) {
      getCaseDetailsApi(caseId)
        .then(res => {
          if (res.data.success) {
            const apiCaseDetails = res.data.data[0];
            setIsCaseManipulationAccess(
              apiCaseDetails.isCaseManipulationAccess,
            );
            setIsFromCaseActivityHistory(
              apiCaseDetails.isFromCaseActivityHistory,
            );
            const modifiedCaseDetails = { ...caseDetails };
            // const modifiedMilestoneDates = [...milestoneDates];
            const modifiedLeaseDetails = { ...leaseDetails };
            const modifiedUnitDetails = { ...unitDetails };

            modifiedCaseDetails.caseNo =
              apiCaseDetails.caseAndLeaseDetails.caseNo;
            modifiedCaseDetails.phase =
              apiCaseDetails.caseAndLeaseDetails.propertyPhaseName;
            modifiedCaseDetails.status =
              apiCaseDetails.caseAndLeaseDetails.caseStatus;
            modifiedCaseDetails.caseType = {
              id: apiCaseDetails.caseAndLeaseDetails.caseTypeId,
              value: apiCaseDetails.caseAndLeaseDetails.caseTypeName,
            };
            modifiedCaseDetails.customer = {
              id: apiCaseDetails.caseAndLeaseDetails.customerId,
              value: apiCaseDetails.caseAndLeaseDetails.customerName,
            };

            if (apiCaseDetails.caseAndLeaseDetails.customerId) {
              getBrandListCaseDetailsApi(
                apiCaseDetails.caseAndLeaseDetails.customerId,
              )
                .then(brandRes => {
                  if (brandRes.data.success) {
                    const apiBrandData = brandRes.data.data;
                    const modfiedBrandData = [];
                    apiBrandData.forEach(brand => {
                      const brandObj = {
                        id: brand.brandId,
                        value: brand.brandName,
                      };
                      modfiedBrandData.push(brandObj);
                    });
                    modifiedCaseDetails.brandList = modfiedBrandData;
                    modifiedCaseDetails.isBrandDisabled = false;
                  }
                })
                .catch(err => {
                  setErrorMessage(getErrorMessage(err));
                  setIsErrorMessage(true);
                });

              // modifiedCaseDetails.isBrandDisabled = false;
            }

            modifiedCaseDetails.brand = {
              id: apiCaseDetails.caseAndLeaseDetails.brandId,
              value: apiCaseDetails.caseAndLeaseDetails.brandName,
            };
            modifiedCaseDetails.property = {
              id: apiCaseDetails.caseAndLeaseDetails.propertyId,
              value: apiCaseDetails.caseAndLeaseDetails.propertyName,
            };
            handleCaseDetailsChange(modifiedCaseDetails);
            setDuplicateCaseDetails(modifiedCaseDetails);

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

            modifiedLeaseDetails.caseCreationDate =
              apiCaseDetails.caseAndLeaseDetails.caseCreationDate;
            // modifiedLeaseDetails.leasedArea =
            //   apiCaseDetails.caseAndLeaseDetails.leaseArea;
            modifiedLeaseDetails.lafApprovalDate =
              apiCaseDetails.caseAndLeaseDetails.LAFApprovalDate;
            modifiedLeaseDetails.leaseId =
              apiCaseDetails.caseAndLeaseDetails.leaseId;
            modifiedLeaseDetails.amendmentType = {
              id: apiCaseDetails.caseAndLeaseDetails.amendmentdTypeId,
              value: apiCaseDetails.caseAndLeaseDetails.amendmentdType,
            };
            modifiedLeaseDetails.contractSigned =
              apiCaseDetails.caseAndLeaseDetails.contractSignedDate;
            modifiedLeaseDetails.fitoutPeriod =
              apiCaseDetails.caseAndLeaseDetails.fitoutPeriod;
            modifiedLeaseDetails.leaseFrom =
              apiCaseDetails.caseAndLeaseDetails.leaseFromDate;
            modifiedLeaseDetails.leaseTo =
              apiCaseDetails.caseAndLeaseDetails.leaseToDate;

            // handleLeaseDetailsChange(modifiedLeaseDetails);
            // setDuplicateLeaseDetails(modifiedLeaseDetails);

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
            modifiedLeaseDetails.leasedArea = modifiedUnitDetails.unitAreaTotal;

            handleLeaseDetailsChange(modifiedLeaseDetails);
            setDuplicateLeaseDetails(modifiedLeaseDetails);

            handleUnitDetailsChange(modifiedUnitDetails);
            setDuplicateUnitDetails(modifiedUnitDetails);
            return modifiedCaseDetails.property.id;
          }
          return '';
        })
        .then(propertyId => {
          getPropertyUOMApi(propertyId)
            .then(res => {
              if (res.data.success) {
                const apiUOMData = res.data.data[0];
                setPropertyUOM(apiUOMData.abbreviation);
              }
            })
            .catch(err => {
              setErrorMessage(getErrorMessage(err));
              setIsErrorMessage(true);
            });
        })
        .catch(err => {
          setErrorMessage(getErrorMessage(err));
          setIsErrorMessage(true);
        });
    }

    if (!caseId) {
      getUserPropertyListWithCMApi()
        .then(res => {
          if (res.data.success) {
            const apiPropertyData = res.data.data;
            const modifiedPropertyList = [];
            apiPropertyData.forEach(property => {
              const modifiedPropObj = {
                id: property.propertyId,
                value: property.propertyName,
              };
              modifiedPropertyList.push(modifiedPropObj);
            });

            setCaseDetails({
              ...caseDetails,
              propertyList: modifiedPropertyList,
            });
          }
        })
        .catch(err => {
          setErrorMessage(getErrorMessage(err));
          setIsErrorMessage(true);
        });

      getAmendmentTypeListApi()
        .then(res => {
          if (res.data.success) {
            const apiAmendmentTypeData = res.data.data;
            const modifiedAmendmentTypeList = [];
            apiAmendmentTypeData.forEach(amendmentType => {
              const modifiedAmendTypeObj = {
                id: amendmentType.amendmentTypeId,
                value: amendmentType.amendmentTypeName,
              };
              modifiedAmendmentTypeList.push(modifiedAmendTypeObj);
            });

            setLeaseDetails({
              ...leaseDetails,
              amendmentTypeList: modifiedAmendmentTypeList,
            });
          }
        })
        .catch(err => {
          setErrorMessage(getErrorMessage(err));
          setIsErrorMessage(true);
        });
    }
  }, []);
  // console.log(caseDetails, 'sdlfhhhaskj');
  const handleCaseDetailsChange = modifiedCaseDetailsState => {
    setCaseDetails(modifiedCaseDetailsState);
  };

  const handleMilestoneDatesChange = modifiedMilestoneDatesState => {
    setMilestoneDates(modifiedMilestoneDatesState);
  };

  const handleLeaseDetailsChange = modifiedLeaseDetails => {
    setLeaseDetails(modifiedLeaseDetails);
  };

  const handleUnitDetailsChange = modifiedUnitDetails => {
    setUnitDetails(modifiedUnitDetails);
  };
  // console.log(caseDetails, 'sdfkasdbhfjkagsdgaskdhf');
  const handleCancel = () => {};
  const handleSubmit = () => {
    /** Case Details validations */
    const modifiedCaseDetails = { ...caseDetails };
    const modifiedLeaseDetails = { ...leaseDetails };
    // const modifiedUnitDetails = { ...unitDetails };

    if (Object.keys(caseDetails.property).length === 0) {
      modifiedCaseDetails.caseDetailsIsError = true;
      modifiedCaseDetails.propertyError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DROPDOWN_SELECT',
      );
      handleCaseDetailsChange(modifiedCaseDetails);
    }

    if (Object.keys(caseDetails.caseType).length === 0) {
      modifiedCaseDetails.caseDetailsIsError = true;
      modifiedCaseDetails.caseTypeError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DROPDOWN_SELECT',
      );
      handleCaseDetailsChange(modifiedCaseDetails);
    }

    if (Object.keys(caseDetails.customer).length === 0) {
      modifiedCaseDetails.caseDetailsIsError = true;
      modifiedCaseDetails.customerError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DROPDOWN_SELECT',
      );
      handleCaseDetailsChange(modifiedCaseDetails);
    }

    if (Object.keys(caseDetails.brand).length === 0) {
      modifiedCaseDetails.caseDetailsIsError = true;
      modifiedCaseDetails.brandError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DROPDOWN_SELECT',
      );
      handleCaseDetailsChange(modifiedCaseDetails);
    }

    /** Lease Details */

    if (modifiedLeaseDetails.lafApprovalDate === '') {
      modifiedLeaseDetails.leaseDetailsIsError = true;
      modifiedLeaseDetails.lafApprovalDateError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DATE_FIELD',
      );
      handleLeaseDetailsChange(modifiedLeaseDetails);
    }

    if (modifiedLeaseDetails.leaseId === '') {
      modifiedLeaseDetails.leaseDetailsIsError = true;
      modifiedLeaseDetails.leaseIdError = t('GLOBAL.ERROR_MSG.MANDATORY_FIELD');
      handleLeaseDetailsChange(modifiedLeaseDetails);
    } else if (
      !validateNameWithRegex(
        modifiedLeaseDetails.leaseId,
        /^[a-zA-Z0-9 _:?/&-]+$/,
      )
    ) {
      modifiedLeaseDetails.leaseDetailsIsError = true;
      modifiedLeaseDetails.leaseIdError = t(
        'GLOBAL.ERROR_MSG.ERR_TEXTFIELD_INPUT',
      );
      handleLeaseDetailsChange(modifiedLeaseDetails);
    }

    if (Object.keys(modifiedLeaseDetails.amendmentType).length === 0) {
      modifiedLeaseDetails.leaseDetailsIsError = true;
      modifiedLeaseDetails.amendmentTypeError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DROPDOWN_SELECT',
      );
      handleLeaseDetailsChange(modifiedLeaseDetails);
    }

    // if (modifiedLeaseDetails.contractSigned === '') {
    //   modifiedLeaseDetails.leaseDetailsIsError = true;
    //   modifiedLeaseDetails.contractSignedError = 'Please select a date';
    //   handleLeaseDetailsChange(modifiedLeaseDetails);
    // }

    if (modifiedLeaseDetails.fitoutPeriod === '') {
      modifiedLeaseDetails.leaseDetailsIsError = true;
      modifiedLeaseDetails.fitoutPeriodError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_FIELD',
      );
      handleLeaseDetailsChange(modifiedLeaseDetails);
    }

    if (modifiedLeaseDetails.leaseFrom === '') {
      modifiedLeaseDetails.leaseDetailsIsError = true;
      modifiedLeaseDetails.leaseFromError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DATE_FIELD',
      );
      handleLeaseDetailsChange(modifiedLeaseDetails);
    }
    // else if (new Date(modifiedLeaseDetails.leaseFrom) < new Date()) {
    //   modifiedLeaseDetails.leaseDetailsIsError = true;
    //   modifiedLeaseDetails.leaseFromError = t(
    //     'CASE_DETAILS.ERROR_MSG.ERR_LEASE_FROM_DATE',
    //   );
    //   handleLeaseDetailsChange(modifiedLeaseDetails);
    // }

    if (modifiedLeaseDetails.leaseTo === '') {
      modifiedLeaseDetails.leaseDetailsIsError = true;
      modifiedLeaseDetails.leaseToError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DATE_FIELD',
      );
      handleLeaseDetailsChange(modifiedLeaseDetails);
    } else if (
      new Date(modifiedLeaseDetails.leaseTo) <
      new Date(modifiedLeaseDetails.leaseFrom)
    ) {
      modifiedLeaseDetails.leaseDetailsIsError = true;
      modifiedLeaseDetails.leaseToError = t(
        'CASE_DETAILS.ERROR_MSG.ERR_LEASE_TO_DATE',
      );
      handleLeaseDetailsChange(modifiedLeaseDetails);
    }

    if (
      !modifiedCaseDetails.caseTypeError &&
      !modifiedCaseDetails.customerError &&
      !modifiedCaseDetails.brandError &&
      !modifiedCaseDetails.propertyError
    ) {
      modifiedCaseDetails.caseDetailsIsError = false;
      handleCaseDetailsChange(modifiedCaseDetails);
    }

    if (
      !modifiedLeaseDetails.lafApprovalDateError &&
      !modifiedLeaseDetails.leaseIdError &&
      !modifiedLeaseDetails.amendmentTypeError &&
      !modifiedLeaseDetails.contractSignedError &&
      !modifiedLeaseDetails.fitoutPeriodError &&
      !modifiedLeaseDetails.leaseFromError &&
      !modifiedLeaseDetails.leaseToError
    ) {
      modifiedLeaseDetails.leaseDetailsIsError = false;
      handleLeaseDetailsChange(modifiedLeaseDetails);
    }

    if (
      modifiedCaseDetails.caseDetailsIsError ||
      modifiedLeaseDetails.leaseDetailsIsError
    ) {
      return;
    }

    /** Unit Details */

    const rowsHavingValue = unitDetails.unitDetailRows.filter(
      item => item.hasAnyValue === true,
    );
    if (
      rowsHavingValue.length === 0 &&
      Object.keys(caseDetails.property).length > 0
    ) {
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

    /** Milestone Detials validations */
    if (
      !milestoneDates.some(item => item.budgetedCompletion !== '') &&
      Object.keys(caseDetails.property).length > 0
    ) {
      if (!isAnyBudgetedDate) {
        setIsAnyBudgetedDate(true);
        return;
      }

      setIsAnyBudgetedDate(false);
    }

    const finalMileStoneDates = [];
    milestoneDates.forEach(phaseMilestone => {
      const milestoneObj = {
        propertyPhaseId: phaseMilestone.id,
        phaseId: phaseMilestone.phaseId,
        phaseTypeId: phaseMilestone.phaseTypeId,
        lafBudgetedDate: phaseMilestone.budgetedCompletion
          ? phaseMilestone.budgetedCompletion
          : null,
        sequence: phaseMilestone.phaseSequence,
      };
      finalMileStoneDates.push(milestoneObj);
    });

    const finalUnitDetails = [];
    const unitDetailsRowsHavingValue = unitDetails.unitDetailRows.filter(
      item => item.hasAnyValue === true,
    );

    unitDetailsRowsHavingValue.forEach(row => {
      const unitObj = {
        unitId: row.unitId.id,
        // unitTypeId: row.unitType.id,
        // area: row.area,
      };
      finalUnitDetails.push(unitObj);
    });

    const reqObj = {
      caseTypeId: caseDetails.caseType.id,
      propertyId: caseDetails.property.id,
      customerId: caseDetails.customer.id,
      brandId: caseDetails.brand.id,
      milestoneDates: finalMileStoneDates,
      leaseDetails: {
        leaseId: leaseDetails.leaseId,
        lafApprovalDate: leaseDetails.lafApprovalDate,
        contractSignedDate: leaseDetails.contractSigned
          ? leaseDetails.contractSigned
          : null,
        leaseFromDate: leaseDetails.leaseFrom,
        leaseToDate: leaseDetails.leaseTo,
        leaseArea: unitDetails.unitAreaTotal,
        fitOutPeriod: Number(leaseDetails.fitoutPeriod),
        amendmentdTypeId: leaseDetails.amendmentType.id,
      },
      unitDetails: finalUnitDetails,
    };

    // console.log(reqObj, 'Create case');
    // pass the request object below, fow now not passing purposefully
    createCaseApi(reqObj)
      .then(res => {
        if (res.data.success) {
          setSuccessMessage(
            t('CASE_DETAILS.CASE_CREATED_SUCCESSFULLY', {
              caseNo: res.data.data[0].caseNumber,
              tchName: res.data.data[0].fullName,
            }),
          );
          setIsSuccess(true);
        }
      })
      .catch(err => {
        setCreateCaseErrorMessage(getErrorMessage(err));
        setIsCreateCaseErrorMessage(true);
      });
  };

  const handleCaseCreateSuccessAlert = () => {
    history.push('/accio');
  };
  return (
    <div className="new-unassigned-case-details">
      <CaseDetails
        caseDetailsState={caseDetails}
        handleCaseDetailsChange={handleCaseDetailsChange}
        unitDetailsState={unitDetails}
        handleUnitDetailsChange={handleUnitDetailsChange}
        milestoneDatesState={milestoneDates}
        handleMilestoneDatesChange={handleMilestoneDatesChange}
        propertyUOM={propertyUOM}
        setPropertyUOM={setPropertyUOM}
        viewCase={viewCase}
        editCase={editCase}
        duplicateCaseDetailsState={duplicateCaseDetails}
        setDuplicateCaseDetails={setDuplicateCaseDetails}
        caseId={caseId}
        getCaseDetailsApi={getCaseDetailsApi}
      />
      {milestoneDates.length > 0 ? (
        <MilestoneDates
          milestoneDatesState={milestoneDates}
          handleMilestoneDatesChange={handleMilestoneDatesChange}
          viewCase={viewCase}
          editCase={editCase}
          caseId={caseId}
          duplicateMilestoneDates={duplicateMilestoneDates}
          setDuplicateMilestoneDates={setDuplicateMilestoneDates}
          isFromCaseActivityHistory={isFromCaseActivityHistory}
          getCaseDetailsApi={getCaseDetailsApi}
        />
      ) : (
        ''
      )}
      <LeaseDetails
        leaseDetailsState={leaseDetails}
        handleLeaseDetailsChange={handleLeaseDetailsChange}
        viewCase={viewCase}
        propertyUOM={propertyUOM}
        editCase={editCase}
        duplicateLeaseDetailsState={duplicateLeaseDetails}
        setDuplicateLeaseDetails={setDuplicateLeaseDetails}
        caseId={caseId}
        getCaseDetailsApi={getCaseDetailsApi}
      />
      <UnitDetails
        caseDetailsState={caseDetails}
        propertyUOM={propertyUOM}
        unitDetailsState={unitDetails}
        handleUnitDetailsChange={handleUnitDetailsChange}
        leaseDetailsState={leaseDetails}
        handleLeaseDetailsChange={handleLeaseDetailsChange}
        viewCase={viewCase}
        editCase={editCase}
        duplicateUnitDetailsState={duplicateUnitDetails}
        caseId={caseId}
        setDuplicateLeaseDetailsState={setDuplicateLeaseDetails}
        setDuplicateUnitDetails={setDuplicateUnitDetails}
      />

      {addCase ? (
        <div className="case-creation-buttons">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
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
            onClick={handleSubmit}
          >
            {t('GLOBAL.BUTTON_SAVE_AND_SUMIT')}
          </button>
        </div>
      ) : (
        ''
      )}

      {editCase ? (
        <div className="case-creation-buttons">
          <button
            type="button"
            className="btn-cancel-case"
            onClick={handleCancel}
          >
            {t('CASE_DETAILS.CANCEL_CASE')}
          </button>
          <button
            type="button"
            className="btn-put-case-on-hold"
            onClick={handleCancel}
          >
            {t('CASE_DETAILS.PUT_CASE_ON_HOLD')}
          </button>
        </div>
      ) : (
        ''
      )}

      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText={t('GLOBAL.OK')}
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />

      <ErrorAlert
        alertMessage={createCaseErrorMessage}
        primaryButtonText={t('GLOBAL.TRY_AGAIN')}
        secondaryButtonText={t('GLOBAL.OK')}
        isCancelButton
        open={isCreateCaseErrorMessage}
        setClose={() => setIsCreateCaseErrorMessage(!isCreateCaseErrorMessage)}
        primaryButtonOnClick={() => {
          setIsCreateCaseErrorMessage(!isCreateCaseErrorMessage);
          handleSubmit();
        }}
      />

      <SuccessAlert
        alertMessage={successMessage}
        primaryButtonText={t('GLOBAL.OK')}
        open={isSuccess}
        setClose={() => {
          setIsSuccess(!isSuccess);
          handleCaseCreateSuccessAlert();
        }}
        primaryButtonOnClick={() => handleCaseCreateSuccessAlert()}
      />

      <InformationAlert
        alertMessage={t(
          'CASE_DETAILS.ERROR_MSG.ALERT_NO_BUDGETED_COMPLETION_DATE',
        )}
        primaryButtonText={t('GLOBAL.YES')}
        secondaryButtonText={t('GLOBAL.NO')}
        open={isAnyBudgetedDate}
        setClose={() => setIsAnyBudgetedDate(!isAnyBudgetedDate)}
        primaryButtonOnClick={handleSubmit}
      />
    </div>
  );
}

NewAndUnassignedCaseDetails.propTypes = {
  getUserPropertyListWithCMApi: PropTypes.func.isRequired,
  getAmendmentTypeListApi: PropTypes.func.isRequired,
  getCaseTypeListApi: PropTypes.func.isRequired,
  createCaseApi: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  match: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }),
  getCaseDetailsApi: PropTypes.func.isRequired,
  getPropertyUOMApi: PropTypes.func.isRequired,
  getBrandListCaseDetailsApi: PropTypes.func.isRequired,
  // getUnitIDsCaseDetailsApi: PropTypes.func.isRequired,
  // caseTypeList: PropTypes.instanceOf(Array).isRequired,
};

NewAndUnassignedCaseDetails.defaultProps = {
  history: {
    push: () => {},
  },
  match: {
    params: {},
  },
};

const mapStateToProps = state => ({
  caseTypeList: state.caseListing.caseTypeList,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserPropertyListWithCMApi: getUserPropertyListWithCMApiAction,
      getCaseTypeListApi: getCaseTypeListApiAction,
      getAmendmentTypeListApi: getAmendmentTypeListApiAction,
      // getUnitIDsCaseDetailsApi: getUnitIDsCaseDetailsApiAction,
      // getCustomerListCaseDetailsApi: getCustomerListCaseDetailsApiAction,
      createCaseApi: createCaseApiAction,
      getCaseDetailsApi: getCaseDetailsApiAction,
      getBrandListCaseDetailsApi: getBrandListCaseDetailsApiAction,

      getPropertyUOMApi: getPropertyUOMApiAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewAndUnassignedCaseDetails);
