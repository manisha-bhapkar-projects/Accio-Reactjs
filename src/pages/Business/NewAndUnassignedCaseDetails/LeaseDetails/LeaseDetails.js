import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './LeaseDetails.scss';
import { Card } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import TextFieldComponent from '../../../../components/TextFieldComponent/TextFieldComponent';
import DropdownComponentWithSearchBar from '../../../../components/Dropdown/DropdownComponentWithSearchBar';
import { validateNameWithRegex } from '../../../../utils/validation';
import { getFormatedDate, getErrorMessage } from '../../../../utils/utils';
import editBtn from '../../../../images/edit/edit.png';
import DetailsItem from '../../../../components/DetailsItem/DetailsItem';
import ErrorAlert from '../../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import InformationAlert from '../../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import {
  getAmendmentTypeListApiAction,
  updateLeaseDetailsApiAction,
} from '../../../../actions/Business/caseDetailsAction';
import SuccessAlert from '../../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';

function LeaseDetails({
  leaseDetailsState,
  handleLeaseDetailsChange,
  viewCase,
  editCase,
  getAmendmentTypeListApi,
  propertyUOM,
  duplicateLeaseDetailsState,
  caseId,
  updateLeaseDetailsApi,
  setDuplicateLeaseDetails,
  getCaseDetailsApi,
}) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isCancel, setIsCancel] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const handleLAFApprovalDateChange = _date => {
    const modifiedLeaseDetails = { ...leaseDetailsState };

    modifiedLeaseDetails.lafApprovalDate = _date;
    modifiedLeaseDetails.isAnyValueModified = true;
    modifiedLeaseDetails.lafApprovalDateError = '';
    handleLeaseDetailsChange(modifiedLeaseDetails);
  };

  const handleLeaseIdChange = e => {
    const modifiedLeaseDetails = { ...leaseDetailsState };

    modifiedLeaseDetails.leaseId = e.target.value;
    modifiedLeaseDetails.isAnyValueModified = true;
    modifiedLeaseDetails.leaseIdError = '';
    handleLeaseDetailsChange(modifiedLeaseDetails);
  };

  const handleAmendmentTypeSelect = _eventKey => {
    const selectVal = leaseDetailsState.amendmentTypeList.find(
      item => item.id === _eventKey,
    );

    const modifiedLeaseDetails = { ...leaseDetailsState };
    modifiedLeaseDetails.amendmentType = selectVal;
    modifiedLeaseDetails.isAnyValueModified = true;
    modifiedLeaseDetails.amendmentTypeError = '';
    handleLeaseDetailsChange(modifiedLeaseDetails);
  };

  const handleContractSignedDateChange = _date => {
    const modifiedLeaseDetails = { ...leaseDetailsState };

    modifiedLeaseDetails.contractSigned = _date;
    modifiedLeaseDetails.isAnyValueModified = true;
    modifiedLeaseDetails.contractSignedError = '';
    handleLeaseDetailsChange(modifiedLeaseDetails);
  };

  const handleFitoutPeriodChange = e => {
    const modifiedLeaseDetails = { ...leaseDetailsState };

    if (
      validateNameWithRegex(e.target.value, /^[1-9][0-9]*$/) ||
      e.target.value === ''
    ) {
      const modifiedFitoutValue = e.target.value.substring(0, 3);
      modifiedLeaseDetails.isAnyValueModified =
        modifiedLeaseDetails.fitoutPeriod !== modifiedFitoutValue;
      modifiedLeaseDetails.fitoutPeriod = modifiedFitoutValue;

      modifiedLeaseDetails.fitoutPeriodError = '';
      handleLeaseDetailsChange(modifiedLeaseDetails);
    }
  };

  const handleLeaseFromChange = _date => {
    const modifiedLeaseDetails = { ...leaseDetailsState };

    modifiedLeaseDetails.leaseFrom = _date;
    modifiedLeaseDetails.isAnyValueModified = true;
    modifiedLeaseDetails.leaseFromError = '';
    handleLeaseDetailsChange(modifiedLeaseDetails);
  };

  const handleLeaseToChange = _date => {
    const modifiedLeaseDetails = { ...leaseDetailsState };

    modifiedLeaseDetails.leaseTo = _date;
    modifiedLeaseDetails.isAnyValueModified = true;
    modifiedLeaseDetails.leaseToError = '';
    handleLeaseDetailsChange(modifiedLeaseDetails);
  };

  const handleEditClick = () => {
    setIsEdit(true);

    getAmendmentTypeListApi()
      .then(res => {
        if (res.data.success) {
          const modifiedLeaseDetails = { ...leaseDetailsState };
          const apiAmendmentTypeData = res.data.data;
          const modifiedAmendmentTypeList = [];
          apiAmendmentTypeData.forEach(amendmentType => {
            const modifiedAmendTypeObj = {
              id: amendmentType.amendmentTypeId,
              value: amendmentType.amendmentTypeName,
            };
            modifiedAmendmentTypeList.push(modifiedAmendTypeObj);
          });

          modifiedLeaseDetails.amendmentTypeList = modifiedAmendmentTypeList;
          handleLeaseDetailsChange(modifiedLeaseDetails);
        }
      })
      .catch(err => {
        setErrorMessage(getErrorMessage(err));
        setIsErrorMessage(true);
      });
  };

  const handleLeaseDetailsCancel = () => {
    if (!isCancel && leaseDetailsState.isAnyValueModified) {
      setIsCancel(true);
      return;
    }
    handleLeaseDetailsChange(duplicateLeaseDetailsState);
    setIsCancel(false);
    setIsEdit(false);
  };

  const handleLeaseDetailsSubmit = () => {
    const modifiedLeaseDetails = { ...leaseDetailsState };

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

    if (modifiedLeaseDetails.leaseDetailsIsError) {
      return;
    }

    const reqObj = {
      caseId,
      leaseId: leaseDetailsState.leaseId,
      lafApprovalDate: getFormatedDate(
        leaseDetailsState.lafApprovalDate,
        'YYYY-MM-DD',
      ),
      contractSignedDate: getFormatedDate(
        leaseDetailsState.contractSigned,
        'YYYY-MM-DD',
      ),
      leaseFromDate: getFormatedDate(leaseDetailsState.leaseFrom, 'YYYY-MM-DD'),
      leaseToDate: getFormatedDate(leaseDetailsState.leaseTo, 'YYYY-MM-DD'),
      fitOutPeriod: Number(leaseDetailsState.fitoutPeriod),
      amendmentdTypeId: leaseDetailsState.amendmentType.id,
    };

    updateLeaseDetailsApi(reqObj)
      .then(res => {
        if (res.data.success) {
          setIsEdit(false);
          getCaseDetailsApi(caseId).then(resCase => {
            if (resCase.data.success) {
              const apiCaseDetails = resCase.data.data[0];
              modifiedLeaseDetails.caseCreationDate =
                apiCaseDetails.caseAndLeaseDetails.caseCreationDate;
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

              handleLeaseDetailsChange(modifiedLeaseDetails);
              setDuplicateLeaseDetails(modifiedLeaseDetails);
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

  return (
    <div className="lease-details">
      <Card className="lease-details-card">
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
        <CardHeader
          title={t('CASE_DETAILS.LEASE_DETAILS.LEASE_DETAILS_TITLE')}
        />
        <div
          className={
            !isEdit
              ? 'lease-details-section'
              : `lease-details-section ${editCase}`
          }
        >
          {viewCase ? (
            <div
              className={
                !isEdit
                  ? 'lease-details-item'
                  : `lease-details-item ${editCase}`
              }
            >
              <DetailsItem
                itemLabel={t('CASE_DETAILS.LEASE_DETAILS.CASE_CREATION_DATE')}
                itemValue={getFormatedDate(leaseDetailsState.caseCreationDate)}
              />
            </div>
          ) : (
            ''
          )}

          {viewCase && !isEdit ? (
            <div className="lease-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.LEASE_DETAILS.LAF_APPROVAL_DATE')}
                itemValue={getFormatedDate(leaseDetailsState.lafApprovalDate)}
              />
            </div>
          ) : (
            <div className="lease-details-item">
              <CustomDatePicker
                label={t('CASE_DETAILS.LEASE_DETAILS.LAF_APPROVAL_DATE')}
                min="2000-01-01"
                max="2210-12-31"
                value={leaseDetailsState.lafApprovalDate}
                onDateChange={_date => {
                  handleLAFApprovalDateChange(_date);
                }}
                error={leaseDetailsState.lafApprovalDateError}
                helperText={
                  leaseDetailsState.lafApprovalDateError.length > 0
                    ? leaseDetailsState.lafApprovalDateError
                    : ''
                }
              />
            </div>
          )}

          {viewCase && !isEdit ? (
            <div className="lease-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.LEASE_DETAILS.LEASE_ID')}
                itemValue={leaseDetailsState.leaseId}
              />
            </div>
          ) : (
            <div className="lease-details-item">
              <TextFieldComponent
                id="lease-id"
                name="lease-id"
                label={t('CASE_DETAILS.LEASE_DETAILS.LEASE_ID')}
                value={leaseDetailsState.leaseId}
                onChange={handleLeaseIdChange}
                error={leaseDetailsState.leaseIdError}
                helperText={
                  leaseDetailsState.leaseIdError
                    ? leaseDetailsState.leaseIdError
                    : ''
                }
              />
            </div>
          )}
          {viewCase && !isEdit ? (
            ''
          ) : (
            <div className="lease-details-item">
              <DropdownComponentWithSearchBar
                id="amendment-type"
                className="lease-details-dropdown"
                label={t('CASE_DETAILS.LEASE_DETAILS.AMENDMENT_TYPE')}
                data={leaseDetailsState.amendmentTypeList}
                value={
                  leaseDetailsState.amendmentType
                    ? leaseDetailsState.amendmentType.value
                    : ''
                }
                onSelect={_eventKey => handleAmendmentTypeSelect(_eventKey)}
                error={
                  leaseDetailsState.amendmentTypeError
                    ? leaseDetailsState.amendmentTypeError
                    : ''
                }
              />
            </div>
          )}

          {/* <div className="lease-details-item">
            <TextFieldComponent
              id="lease-amount"
              name="lease-amount"
              label="Lease Amount"
            />
          </div> */}
          {viewCase ? (
            <div
              className={
                !isEdit
                  ? 'lease-details-item'
                  : `lease-details-item ${editCase}`
              }
            >
              <DetailsItem
                itemLabel={t('CASE_DETAILS.LEASE_DETAILS.LEASED_AREA')}
                itemValue={`${
                  leaseDetailsState.leasedArea
                } ${propertyUOM.toUpperCase()}`}
              />
            </div>
          ) : (
            ''
          )}
          {isEdit ? (
            <div className={`lease-details-item ${editCase} break`} />
          ) : (
            ''
          )}

          {viewCase && !isEdit ? (
            <div className="lease-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.LEASE_DETAILS.CONTRACT_SIGNED_DATE')}
                itemValue={
                  leaseDetailsState.contractSigned !== null &&
                  leaseDetailsState.contractSigned !== ''
                    ? getFormatedDate(leaseDetailsState.contractSigned)
                    : '-'
                }
              />
            </div>
          ) : (
            <div className="lease-details-item">
              <CustomDatePicker
                label={t('CASE_DETAILS.LEASE_DETAILS.CONTRACT_SIGNED_DATE')}
                min="2000-01-01"
                max="2210-12-31"
                onDateChange={_date => {
                  handleContractSignedDateChange(_date);
                }}
                value={leaseDetailsState.contractSigned}
                error={leaseDetailsState.contractSignedError}
                helperText={
                  leaseDetailsState.contractSignedError
                    ? leaseDetailsState.contractSignedError
                    : ''
                }
              />
            </div>
          )}

          {viewCase && !isEdit ? (
            <div className="lease-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.LEASE_DETAILS.FITOUT_PERIOD_(DAYS)')}
                itemValue={leaseDetailsState.fitoutPeriod}
              />
            </div>
          ) : (
            <div className="lease-details-item">
              <TextFieldComponent
                id="fitout-period"
                name="fitout-period"
                label={t('CASE_DETAILS.LEASE_DETAILS.FITOUT_PERIOD_(DAYS)')}
                type="number"
                // onKeyUp={()=>{
                //   if(leaseDetailsState.fitoutPeriod.length>3){
                //     const modified{}
                //   }
                // }}
                value={leaseDetailsState.fitoutPeriod}
                onChange={handleFitoutPeriodChange}
                error={leaseDetailsState.fitoutPeriodError}
                helperText={
                  leaseDetailsState.fitoutPeriodError
                    ? leaseDetailsState.fitoutPeriodError
                    : ''
                }
              />
            </div>
          )}

          {viewCase && !isEdit ? (
            <div className="lease-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.LEASE_DETAILS.LEASE_FROM')}
                itemValue={getFormatedDate(leaseDetailsState.leaseFrom)}
              />
            </div>
          ) : (
            <div className="lease-details-item">
              <CustomDatePicker
                label={t('CASE_DETAILS.LEASE_DETAILS.LEASE_FROM')}
                min="2000-01-01"
                max="2210-12-31"
                value={leaseDetailsState.leaseFrom}
                onDateChange={_date => {
                  handleLeaseFromChange(_date);
                }}
                error={leaseDetailsState.leaseFromError}
                helperText={
                  leaseDetailsState.leaseFromError
                    ? leaseDetailsState.leaseFromError
                    : ''
                }
              />
            </div>
          )}

          {viewCase && !isEdit ? (
            <div className="lease-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.LEASE_DETAILS.LEASE_TO')}
                itemValue={getFormatedDate(leaseDetailsState.leaseTo)}
              />
            </div>
          ) : (
            <div className="lease-details-item">
              <CustomDatePicker
                label={t('CASE_DETAILS.LEASE_DETAILS.LEASE_TO')}
                min="2000-01-01"
                max="2210-12-31"
                value={leaseDetailsState.leaseTo}
                onDateChange={_date => {
                  handleLeaseToChange(_date);
                }}
                error={leaseDetailsState.leaseToError}
                helperText={
                  leaseDetailsState.leaseToError
                    ? leaseDetailsState.leaseToError
                    : ''
                }
              />
            </div>
          )}
        </div>
        {editCase && isEdit ? (
          <div className="lease-details-save">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleLeaseDetailsCancel}
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
              onClick={handleLeaseDetailsSubmit}
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
        primaryButtonOnClick={() => handleLeaseDetailsCancel()}
      />

      <SuccessAlert
        alertMessage={t(
          'CASE_DETAILS.ERROR_MSG.LEASE_DETAILS_SECTION_EDIT_SUCCESS',
        )}
        primaryButtonText={t('GLOBAL.OK')}
        open={isSuccess}
        setClose={() => {
          setIsSuccess(!isSuccess);
        }}
        primaryButtonOnClick={() => setIsSuccess(!isSuccess)}
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

LeaseDetails.propTypes = {
  leaseDetailsState: PropTypes.instanceOf(Object).isRequired,
  handleLeaseDetailsChange: PropTypes.func.isRequired,
  viewCase: PropTypes.string.isRequired,
  editCase: PropTypes.string.isRequired,
  getAmendmentTypeListApi: PropTypes.func.isRequired,
  propertyUOM: PropTypes.string.isRequired,
  duplicateLeaseDetailsState: PropTypes.instanceOf(Object).isRequired,
  caseId: PropTypes.string,
  updateLeaseDetailsApi: PropTypes.func.isRequired,
  setDuplicateLeaseDetails: PropTypes.func.isRequired,
  getCaseDetailsApi: PropTypes.func.isRequired,
};

LeaseDetails.defaultProps = {
  caseId: '',
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAmendmentTypeListApi: getAmendmentTypeListApiAction,
      updateLeaseDetailsApi: updateLeaseDetailsApiAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(LeaseDetails);
