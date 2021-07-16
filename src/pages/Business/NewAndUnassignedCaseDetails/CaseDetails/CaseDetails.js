import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './CaseDetails.scss';
import { Card } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import DropdownComponentWithSearchBar from '../../../../components/Dropdown/DropdownComponentWithSearchBar';
import DropdownComponent from '../../../../components/Dropdown/DropdownComponent';
import editBtn from '../../../../images/edit/edit.png';
import {
  getCustomerListCaseDetailsApiAction,
  getBrandListCaseDetailsApiAction,
  getUnitIDsCaseDetailsApiAction,
  getPropertyPhasesListApiAction,
  getPropertyUOMApiAction,
  updateCasePropertyDetailsApiAction,
} from '../../../../actions/Business/caseDetailsAction';
import DetailsItem from '../../../../components/DetailsItem/DetailsItem';

import { getErrorMessage } from '../../../../utils/utils';
import ErrorAlert from '../../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import InformationAlert from '../../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';

import SuccessAlert from '../../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';

function CaseDetails({
  caseDetailsState,
  handleCaseDetailsChange,
  getCustomerListCaseDetailsApi,
  getBrandListCaseDetailsApi,
  getUnitIDsCaseDetailsApi,
  caseTypeList,
  unitDetailsState,
  handleUnitDetailsChange,
  getPropertyPhasesListApi,
  // milestoneDatesState,
  handleMilestoneDatesChange,
  setPropertyUOM,
  getPropertyUOMApi,
  viewCase,
  editCase,
  duplicateCaseDetailsState,
  updateCasePropertyDetailsApi,
  caseId,
  getCaseDetailsApi,
  setDuplicateCaseDetails,
}) {
  const { t } = useTranslation();
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [confirmPropertyChange, setConfirmPropertyChange] = React.useState(
    false,
  );
  const [isCancel, setIsCancel] = React.useState(false);

  const [isEdit, setIsEdit] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const [propertySelectId, setPropertySelectId] = React.useState('');

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  useEffect(() => {
    const modifiedCaseDetials = { ...caseDetailsState };

    if (modifiedCaseDetials.propertyList.length === 1) {
      [modifiedCaseDetials.property] = modifiedCaseDetials.propertyList;
      handleCaseDetailsChange(modifiedCaseDetials);
      handlePropertySelect(modifiedCaseDetials.property.id);
    }
  }, [caseDetailsState.propertyList]);

  const handlePropertySelect = _eventKey => {
    const selectedVal = caseDetailsState.propertyList.find(
      item => item.id === _eventKey,
    );

    const modifiedCaseDetials = { ...caseDetailsState };
    const modifiedUnitDetails = { ...unitDetailsState };
    // const modifiedMilestoneDates = [...milestoneDatesState];

    modifiedCaseDetials.property = selectedVal;
    modifiedCaseDetials.isAnyValueModified = true;
    modifiedCaseDetials.propertyError = '';
    if (
      Object.keys(caseDetailsState.property).length !== 0 &&
      caseDetailsState.property.id !== selectedVal.id
    ) {
      if (!confirmPropertyChange) {
        setConfirmPropertyChange(true);
        setPropertySelectId(_eventKey);
        return;
      }

      modifiedCaseDetials.customer = {};
      modifiedCaseDetials.customerError = '';
      modifiedCaseDetials.brand = {};
      modifiedCaseDetials.brandError = '';
      modifiedCaseDetials.brandList = [];
      modifiedCaseDetials.isBrandDisabled = true;

      modifiedUnitDetails.unitDetailRows = [
        {
          id: 1,
          unitId: {},
          unitType: {},
          area: '-',
          hasAnyValue: false,
        },
        {
          id: 2,
          unitId: {},
          unitType: {},
          area: '-',
          hasAnyValue: false,
        },
        {
          id: 3,
          unitId: {},
          unitType: {},
          area: '-',
          hasAnyValue: false,
        },
      ];
      handleUnitDetailsChange(modifiedUnitDetails);
      handleCaseDetailsChange(modifiedCaseDetials);
      setConfirmPropertyChange(false);
    }

    if (
      Object.keys(caseDetailsState.property).length === 0 ||
      (Object.keys(caseDetailsState.property).length !== 0 &&
        caseDetailsState.property.id !== selectedVal.id)
    ) {
      getCustomerListCaseDetailsApi(selectedVal.id)
        .then(res => {
          if (res.data.success) {
            const apiCustomerData = res.data.data;
            const modfiedCustomerData = [];
            apiCustomerData.forEach(customer => {
              const custObj = {
                id: customer.customerId,
                value: customer.customerName,
              };
              modfiedCustomerData.push(custObj);
            });
            modifiedCaseDetials.customerList = modfiedCustomerData;
            modifiedCaseDetials.isCustomerDisabled = false;
            handleCaseDetailsChange(modifiedCaseDetials);
          }
        })
        .catch(err => {
          handleCaseDetailsChange(modifiedCaseDetials);
          setErrorMessage(getErrorMessage(err));
          setIsErrorMessage(true);
        });

      getPropertyPhasesListApi(selectedVal.id)
        .then(res => {
          if (res.data.success) {
            const apiPhaseData = res.data.data;
            const modifiedPhaseList = [];
            apiPhaseData.forEach(phase => {
              const phaseObj = {
                id: phase.propertyPhaseId,
                phaseId: phase.phaseId,
                phaseTypeId: phase.phaseTypeId,
                phaseName: phase.propertyPhaseName,
                phaseSequence: phase.propertyPhaseSequence,
                budgetedCompletion: '',
                plannedCompletion: '-',
                rePlannedCompletion: '-',
                actualCompletion: '-',
                delayInDays: '-',
                delayDueTo: '-',
                comments: '-',
                isExpanded: false,
              };
              modifiedPhaseList.push(phaseObj);
            });
            handleMilestoneDatesChange(modifiedPhaseList);
          }
        })
        .catch(err => {
          handleCaseDetailsChange(modifiedCaseDetials);
          setErrorMessage(getErrorMessage(err));
          setIsErrorMessage(true);
        });

      getUnitIDsCaseDetailsApi(selectedVal.id)
        .then(res => {
          if (res.data.success) {
            const apiUnitIdData = res.data.data;
            const modfiedUnitIdData = [];
            apiUnitIdData.forEach(unit => {
              const unitIdObj = {
                id: unit.unitId,
                value: unit.unitScode,
                unitType: { id: unit.unitTypeId, value: unit.unitTypeName },
                // unitTypeId: unit.unitTypeId,
                // unitTypeName: unit.unitTypeName,
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
          // handleUnitDetailsChange(modifiedUnitDetails);
          handleCaseDetailsChange(modifiedCaseDetials);
          setErrorMessage(getErrorMessage(err));
          setIsErrorMessage(true);
        });

      getPropertyUOMApi(selectedVal.id)
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
    }
  };

  const handleCustomerSelect = _eventKey => {
    const selectedVal = caseDetailsState.customerList.find(
      item => item.id === _eventKey,
    );

    const modifiedCaseDetials = { ...caseDetailsState };
    modifiedCaseDetials.customer = selectedVal;
    modifiedCaseDetials.isAnyValueModified = true;
    modifiedCaseDetials.customerError = '';

    getBrandListCaseDetailsApi(selectedVal.id)
      .then(res => {
        if (res.data.success) {
          const apiBrandData = res.data.data;
          const modfiedBrandData = [];
          apiBrandData.forEach(brand => {
            const brandObj = {
              id: brand.brandId,
              value: brand.brandName,
            };
            modfiedBrandData.push(brandObj);
          });
          modifiedCaseDetials.brandList = modfiedBrandData;
          modifiedCaseDetials.isBrandDisabled = false;
          handleCaseDetailsChange(modifiedCaseDetials);
        }
      })
      .catch(err => {
        handleCaseDetailsChange(modifiedCaseDetials);
        setErrorMessage(getErrorMessage(err));
        setIsErrorMessage(true);
      });
  };

  const handleBrandSelect = _eventKey => {
    const selectedVal = caseDetailsState.brandList.find(
      item => item.id === _eventKey,
    );

    const modifiedCaseDetials = { ...caseDetailsState };
    modifiedCaseDetials.brand = selectedVal;
    modifiedCaseDetials.isAnyValueModified = true;
    modifiedCaseDetials.brandError = '';
    handleCaseDetailsChange(modifiedCaseDetials);
  };

  const handleCaseTypeSelect = _eventKey => {
    const selectedVal = caseTypeList.find(item => item.id === _eventKey);

    const modifiedCaseDetials = { ...caseDetailsState };
    modifiedCaseDetials.caseType = selectedVal;
    modifiedCaseDetials.isAnyValueModified = true;
    modifiedCaseDetials.caseTypeError = '';
    handleCaseDetailsChange(modifiedCaseDetials);
  };

  const handleEditClick = () => {
    setIsEdit(true);

    const modifiedCaseDetials = { ...caseDetailsState };
    getCustomerListCaseDetailsApi(caseDetailsState.property.id)
      .then(res => {
        if (res.data.success) {
          const apiCustomerData = res.data.data;
          const modfiedCustomerData = [];
          apiCustomerData.forEach(customer => {
            const custObj = {
              id: customer.customerId,
              value: customer.customerName,
            };
            modfiedCustomerData.push(custObj);
          });
          modifiedCaseDetials.customerList = modfiedCustomerData;
          modifiedCaseDetials.isCustomerDisabled = false;
          handleCaseDetailsChange(modifiedCaseDetials);
        }
      })
      .catch(err => {
        handleCaseDetailsChange(modifiedCaseDetials);
        setErrorMessage(getErrorMessage(err));
        setIsErrorMessage(true);
      });
  };

  const handleCaseDetailsCancel = () => {
    if (!isCancel && caseDetailsState.isAnyValueModified) {
      setIsCancel(true);
      return;
    }

    handleCaseDetailsChange(duplicateCaseDetailsState);
    setIsCancel(false);
    setIsEdit(false);
  };

  const handleCaseDetailsSubmit = () => {
    const modifiedCaseDetails = { ...caseDetailsState };

    if (Object.keys(caseDetailsState.caseType).length === 0) {
      modifiedCaseDetails.caseDetailsIsError = true;
      modifiedCaseDetails.caseTypeError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DROPDOWN_SELECT',
      );
      handleCaseDetailsChange(modifiedCaseDetails);
    }

    if (Object.keys(caseDetailsState.customer).length === 0) {
      modifiedCaseDetails.caseDetailsIsError = true;
      modifiedCaseDetails.customerError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DROPDOWN_SELECT',
      );
      handleCaseDetailsChange(modifiedCaseDetails);
    }

    if (Object.keys(caseDetailsState.brand).length === 0) {
      modifiedCaseDetails.caseDetailsIsError = true;
      modifiedCaseDetails.brandError = t(
        'GLOBAL.ERROR_MSG.MANDATORY_DROPDOWN_SELECT',
      );
      handleCaseDetailsChange(modifiedCaseDetails);
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

    if (modifiedCaseDetails.caseDetailsIsError) {
      return;
    }

    const reqObj = {
      caseId,
      caseTypeId: caseDetailsState.caseType.id,
      customerId: caseDetailsState.customer.id,
      brandId: caseDetailsState.brand.id,
    };

    updateCasePropertyDetailsApi(reqObj)
      .then(res => {
        if (res.data.success) {
          setIsEdit(false);
          getCaseDetailsApi(caseId).then(resCase => {
            if (resCase.data.success) {
              const apiCaseDetails = resCase.data.data[0];

              // const modifiedCaseDetails = { ...caseDetailsState };
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

              handleCaseDetailsChange(modifiedCaseDetails);
              setDuplicateCaseDetails(modifiedCaseDetails);
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
    <div
      className={
        !isEdit
          ? `case-details ${viewCase}`
          : `case-details ${viewCase} ${editCase}`
      }
    >
      <Card className="property-details-card">
        <CardHeader title={t('CASE_DETAILS.PROPERTY_DETAIL_TITLE')} />
        <div className="property-details-section">
          {viewCase ? (
            <div className="property-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.PROPERTY_NAME')}
                itemValue={caseDetailsState.property.value}
              />
            </div>
          ) : (
            <div className="property-details-item">
              {caseDetailsState.propertyList.length === 1 ? (
                <DetailsItem
                  itemLabel={t('CASE_DETAILS.PROPERTY_NAME')}
                  itemValue={
                    Object.keys(caseDetailsState.property).length > 0
                      ? caseDetailsState.property.value
                      : ''
                  }
                />
              ) : (
                <DropdownComponent
                  id="property"
                  className="property-details-dropdown"
                  label={t('CASE_DETAILS.PROPERTY_NAME')}
                  data={caseDetailsState.propertyList}
                  value={
                    caseDetailsState.property
                      ? caseDetailsState.property.value
                      : ''
                  }
                  onSelect={_eventKey => handlePropertySelect(_eventKey)}
                  error={
                    caseDetailsState.propertyError.length > 0
                      ? caseDetailsState.propertyError
                      : ''
                  }
                />
              )}
            </div>
          )}
        </div>
      </Card>
      <Card className="case-details-card">
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
        <CardHeader title="Case Details" />
        <div className="case-details-section">
          {viewCase ? (
            <div className="case-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.CASE_NO')}
                itemValue={caseDetailsState.caseNo}
              />
            </div>
          ) : (
            ''
          )}

          {viewCase && !isEdit ? (
            <div className="case-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.CASE_TYPE')}
                itemValue={caseDetailsState.caseType.value}
              />
            </div>
          ) : (
            <div className="case-details-item">
              <DropdownComponentWithSearchBar
                id="case-type"
                className="case-details-dropdown"
                label={t('CASE_DETAILS.CASE_TYPE')}
                data={caseTypeList}
                value={
                  caseDetailsState.caseType
                    ? caseDetailsState.caseType.value
                    : ''
                }
                onSelect={_eventKey => handleCaseTypeSelect(_eventKey)}
                error={
                  caseDetailsState.caseTypeError.length > 0
                    ? caseDetailsState.caseTypeError
                    : ''
                }
              />
            </div>
          )}

          {viewCase ? (
            <div className="case-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.PHASE')}
                itemValue={caseDetailsState.phase}
              />
            </div>
          ) : (
            ''
          )}

          {viewCase && !isEdit ? (
            <div className="case-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.CUSTOMER')}
                itemValue={caseDetailsState.customer.value}
              />
            </div>
          ) : (
            <div className="case-details-item">
              <DropdownComponentWithSearchBar
                id="customer"
                className="case-details-dropdown"
                label={t('CASE_DETAILS.CUSTOMER')}
                data={caseDetailsState.customerList}
                value={
                  caseDetailsState.customer
                    ? caseDetailsState.customer.value
                    : ''
                }
                isDisabled={caseDetailsState.isCustomerDisabled}
                onSelect={_eventKey => handleCustomerSelect(_eventKey)}
                error={
                  caseDetailsState.customerError.length > 0
                    ? caseDetailsState.customerError
                    : ''
                }
              />
            </div>
          )}

          {viewCase && !isEdit ? (
            <div className="case-details-item">
              <DetailsItem
                itemLabel={t('CASE_DETAILS.BRAND')}
                itemValue={caseDetailsState.brand.value}
              />
            </div>
          ) : (
            <div className="case-details-item">
              <DropdownComponentWithSearchBar
                id="brand"
                className="case-details-dropdown"
                label={t('CASE_DETAILS.BRAND')}
                data={caseDetailsState.brandList}
                value={
                  caseDetailsState.brand ? caseDetailsState.brand.value : ''
                }
                isDisabled={caseDetailsState.isBrandDisabled}
                onSelect={_eventKey => handleBrandSelect(_eventKey)}
                error={
                  caseDetailsState.brandError.length > 0
                    ? caseDetailsState.brandError
                    : ''
                }
              />
            </div>
          )}

          {viewCase ? (
            <div className="case-details-item">
              <DetailsItem itemLabel={t('CASE_DETAILS.STATUS')}>
                <div
                  className={`status-pill ${
                    caseDetailsState.status
                      ? caseDetailsState.status.toLowerCase()
                      : ''
                  }`}
                >
                  {caseDetailsState.status}
                </div>
              </DetailsItem>
            </div>
          ) : (
            ''
          )}
        </div>
        {editCase && isEdit ? (
          <div className="case-details-save">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCaseDetailsCancel}
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
              onClick={handleCaseDetailsSubmit}
            >
              {t('GLOBAL.BUTTON_SAVE_AND_SUMIT')}
            </button>
          </div>
        ) : (
          ''
        )}
      </Card>
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText={t('GLOBAL.OK')}
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />

      <InformationAlert
        alertMessage={t('CASE_DETAILS.ERROR_MSG.ALERT_PROPERTY_CHANGE')}
        primaryButtonText={t('GLOBAL.YES')}
        secondaryButtonText={t('GLOBAL.NO')}
        open={confirmPropertyChange}
        setClose={() => setConfirmPropertyChange(!confirmPropertyChange)}
        primaryButtonOnClick={() => handlePropertySelect(propertySelectId)}
      />

      <SuccessAlert
        alertMessage={t(
          'CASE_DETAILS.ERROR_MSG.CASE_DETAILS_SECTION_EDIT_SUCCESS',
        )}
        primaryButtonText={t('GLOBAL.OK')}
        open={isSuccess}
        setClose={() => {
          setIsSuccess(!isSuccess);
        }}
        primaryButtonOnClick={() => setIsSuccess(!isSuccess)}
      />

      <InformationAlert
        alertMessage={t('GLOBAL.ERROR_MSG.ERR_CHANGES_LOST')}
        primaryButtonText={t('GLOBAL.YES')}
        secondaryButtonText={t('GLOBAL.NO')}
        open={isCancel}
        setClose={() => setIsCancel(!isCancel)}
        primaryButtonOnClick={() => handleCaseDetailsCancel()}
      />
    </div>
  );
}

CaseDetails.propTypes = {
  caseDetailsState: PropTypes.instanceOf(Object).isRequired,
  handleCaseDetailsChange: PropTypes.func.isRequired,
  getBrandListCaseDetailsApi: PropTypes.func.isRequired,
  getUnitIDsCaseDetailsApi: PropTypes.func.isRequired,
  getCustomerListCaseDetailsApi: PropTypes.func.isRequired,
  caseTypeList: PropTypes.instanceOf(Array).isRequired,
  unitDetailsState: PropTypes.instanceOf(Object).isRequired,
  handleUnitDetailsChange: PropTypes.func.isRequired,
  getPropertyPhasesListApi: PropTypes.func.isRequired,
  // milestoneDatesState: PropTypes.instanceOf(Array).isRequired,
  handleMilestoneDatesChange: PropTypes.func.isRequired,
  // propertyUOM: PropTypes.string.isRequired,
  setPropertyUOM: PropTypes.func.isRequired,
  getPropertyUOMApi: PropTypes.func.isRequired,
  viewCase: PropTypes.string.isRequired,
  editCase: PropTypes.string.isRequired,
  duplicateCaseDetailsState: PropTypes.instanceOf(Object).isRequired,
  updateCasePropertyDetailsApi: PropTypes.func.isRequired,
  caseId: PropTypes.string,
  getCaseDetailsApi: PropTypes.func.isRequired,
  setDuplicateCaseDetails: PropTypes.func.isRequired,
};

CaseDetails.defaultProps = {
  caseId: '',
};

const mapStateToProps = state => ({
  caseTypeList: state.caseListing.caseTypeList,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getBrandListCaseDetailsApi: getBrandListCaseDetailsApiAction,
      getUnitIDsCaseDetailsApi: getUnitIDsCaseDetailsApiAction,
      getCustomerListCaseDetailsApi: getCustomerListCaseDetailsApiAction,
      getPropertyPhasesListApi: getPropertyPhasesListApiAction,
      getPropertyUOMApi: getPropertyUOMApiAction,
      updateCasePropertyDetailsApi: updateCasePropertyDetailsApiAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetails);
