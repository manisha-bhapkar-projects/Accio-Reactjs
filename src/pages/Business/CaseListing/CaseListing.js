import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './CaseListing.scss';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PhaseDonought from './PhaseDonought/PhaseDonought';
import infoIcon from '../../../images/InfoForTooltip/infoForTooltip@2x.png';
import Searchbar from '../../../components/Searchbar/Searchbar';
import filterIcon from '../../../images/filter/filter-list.png';
import filterExpandIcon from '../../../images/filter/advanced-icon.png';
import close from '../../../images/close button/close.png';
import LabelWithIcon from '../../../components/LabelWithIcon/LabelWithIcon';
import DropdownComponent from '../../../components/Dropdown/DropdownComponent';
import ActionButton from '../../../components/ActionButton/ActionButton';
import CardListTable from '../../../components/CardListTable/CardListTable';
import CardListTableTablet from '../../../components/CardListTableTablet/CardListTableTablet';
import { customSort, getRouteWithoutParam } from '../../../utils/utils';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import OverlayToolTip from '../../../components/OverlayToolTip/OverlayToolTip';
import useScreenSize from '../../../components/CustomHooks/BreackPointHook/UseScreenSize';
import redirectionMapping from '../../../utils/caseListingRedirection';
import {
  getPhaseWiseCaseDetailsAPIAction,
  getCaseListDetailsAPIAction,
  setCaseListDetails,
  getUserAccessPropertiesApiAction,
  getCustomerListApiAction,
  getBrandListApiAction,
  getUnitsListApiAction,
  getCaseStatusListApiAction,
  getPropertyPhaseListApiAction,
  getCaseTypeListApiAction,
  getAssignedToUserListApiAction,
  getIsCaseManipulateAccessApiAction,
} from '../../../actions/Business/caseListingAction';

import routePaths from '../../../utils/constants';

function CaseListing({
  history,
  getPhaseWiseCaseDetailsAPI,
  phaseWiseCaseDetailList,
  getCaseListDetailsAPI,
  caseListDetails,
  caseListingIsLoading,
  caseListingTotalCount,
  setModifiedCaseListDetails,
  headerSearchText,
  getUserAccessPropertiesApi,
  getCustomerListApi,
  getBrandListApi,
  getUnitsListApi,
  getCaseStatusListApi,
  getPropertyPhaseListApi,
  getCaseTypeListApi,
  getAssignedToUserListApi,
  userAccessPropertyList,
  customerList,
  brandList,
  unitsList,
  caseStatusList,
  propertyPhaseList,
  caseTypeList,
  assignedToUserList,
  isCaseManipulationAccess,
  isAllPropertyLicenseSuspended,
}) {
  const initialFilterState = {
    property: {},
    customer: {},
    brand: {},
    units: {},
    caseStatus: {},
    phase: {},
    caseType: {},
    assignedTo: {},
  };

  const { t } = useTranslation();

  const [filterExpanded, setFilterExpanded] = React.useState('');
  const [searchtext, setSearchtext] = React.useState('');
  const screenWidth = useScreenSize();
  const [filterOptionsState, setFilterOptionsState] = React.useState(
    initialFilterState,
  );
  // const [
  //   isCaseManipulationAccess,
  //   setIsCaseManipulationAccess,
  // ] = React.useState(true);

  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isFilterApplied, setIsFilterApplied] = React.useState(false);

  const caseDetailsPath = getRouteWithoutParam(
    routePaths.BUSINESS.ROUTE.CASE_DETAILS.CASE_DETAILS,
  );

  const getReqObjectForCaseListing = (
    filterState,
    searchTextString,
    isFilterAppliedVar,
  ) => {
    // if (useStateData) {
    //   const reqObj = {
    //     caseStatusId:
    //       filterOptionsState.caseStatus && isFilterApplied
    //         ? filterOptionsState.caseStatus.id
    //         : null,
    //     caseTypeId:
    //       filterOptionsState.caseType && isFilterApplied
    //         ? filterOptionsState.caseType.id
    //         : null,
    //     propertyPhaseId:
    //       filterOptionsState.phase && isFilterApplied
    //         ? filterOptionsState.phase.id
    //         : null,
    //     propertyId:
    //       filterOptionsState.property && isFilterApplied
    //         ? filterOptionsState.property.id
    //         : null,
    //     customerId:
    //       filterOptionsState.customer && isFilterApplied
    //         ? filterOptionsState.customer.id
    //         : null,
    //     brandId:
    //       filterOptionsState.brand && isFilterApplied
    //         ? filterOptionsState.brand.id
    //         : null,
    //     propertyUnitId:
    //       filterOptionsState.units && isFilterApplied
    //         ? filterOptionsState.units.id
    //         : null,
    //     assignedToId:
    //       filterOptionsState.assignedTo && isFilterApplied
    //         ? filterOptionsState.assignedTo.id
    //         : null,
    //     search: searchtext || null,
    //   };
    //   return reqObj;
    // }

    const reqObj = {
      caseStatusId:
        filterState.caseStatus && isFilterAppliedVar
          ? filterState.caseStatus.id
          : null,
      caseTypeId:
        filterState.caseType && isFilterAppliedVar
          ? filterState.caseType.id
          : null,
      propertyPhaseId:
        filterState.phase && isFilterAppliedVar ? filterState.phase.id : null,
      propertyId:
        filterState.property && isFilterAppliedVar
          ? filterState.property.id
          : null,
      customerId:
        filterState.customer && isFilterAppliedVar
          ? filterState.customer.id
          : null,
      brandId:
        filterState.brand && isFilterAppliedVar ? filterState.brand.id : null,
      propertyUnitId:
        filterState.units && isFilterAppliedVar ? filterState.units.id : null,
      assignedToId:
        filterState.assignedTo && isFilterAppliedVar
          ? filterState.assignedTo.id
          : null,
      search: searchTextString || null,
    };
    return reqObj;
  };

  useEffect(() => {
    getPhaseWiseCaseDetailsAPI();
    getCaseListDetailsAPI();
    getUserAccessPropertiesApi(false);
    getCustomerListApi();
    getBrandListApi();
    getUnitsListApi();
    getCaseStatusListApi();
    getPropertyPhaseListApi();
    getCaseTypeListApi();
    getAssignedToUserListApi();

    // getIsCaseManipulateAccessApi()
    //   .then(res => {
    //     if (res.data.success && res.data.data === true) {
    //       setIsCaseManipulationAccess(true);
    //     }
    //   })
    //   .catch(err => {
    //     setErrorMessage(getErrorMessage(err));
    //     setIsErrorMessage(true);
    //   });
  }, []);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  useEffect(() => {
    if (headerSearchText.length > 0) {
      openFilterTab();
    } else {
      closeFilterTab();
    }
  }, [headerSearchText]);

  // const isTablet = screenWidth <= 1024 ? 'tablet-screen' : '';

  const openFilterTab = () => {
    if (filterExpanded === '') {
      setFilterExpanded('filter-expanded');
    }
  };
  const closeFilterTab = () => {
    if (filterExpanded === 'filter-expanded') {
      setFilterExpanded('');
      handleClearFilter();
    }
  };

  const handlePropertyFilter = _eventKey => {
    const selectedVal = userAccessPropertyList.find(
      item => item.id === _eventKey,
    );

    setFilterOptionsState({
      ...filterOptionsState,
      property: selectedVal,
    });

    getPropertyPhaseListApi(selectedVal.id);
  };

  const handleCustomerFilter = _eventKey => {
    const selectedVal = customerList.find(item => item.id === _eventKey);

    setFilterOptionsState({
      ...filterOptionsState,
      customer: selectedVal,
    });
  };

  const handleBrandFilter = _eventKey => {
    const selectedVal = brandList.find(item => item.id === _eventKey);

    setFilterOptionsState({
      ...filterOptionsState,
      brand: selectedVal,
    });
  };

  const handleUnitsFilter = _eventKey => {
    const selectedVal = unitsList.find(item => item.id === _eventKey);

    setFilterOptionsState({
      ...filterOptionsState,
      units: selectedVal,
    });
  };

  const handleCaseStatusFilter = _eventKey => {
    const selectedVal = caseStatusList.find(item => item.id === _eventKey);

    setFilterOptionsState({
      ...filterOptionsState,
      caseStatus: selectedVal,
    });
  };

  const handlePhaseFilter = _eventKey => {
    const selectedVal = propertyPhaseList.find(item => item.id === _eventKey);

    setFilterOptionsState({
      ...filterOptionsState,
      phase: selectedVal,
    });
  };

  const handleDonoughtChartClick = _eventKey => {
    handlePhaseFilter(_eventKey);
    setIsFilterApplied(true);
    const reqObj = getReqObjectForCaseListing(
      filterOptionsState,
      searchtext,
      true,
    );
    reqObj.propertyPhaseId = _eventKey;

    getCaseListDetailsAPI(reqObj, 1, 10);
  };

  const handleCaseTypeFilter = _eventKey => {
    const selectedVal = caseTypeList.find(item => item.id === _eventKey);

    setFilterOptionsState({
      ...filterOptionsState,
      caseType: selectedVal,
    });
  };

  const handleAssignedToFilter = _eventKey => {
    const selectedVal = assignedToUserList.find(item => item.id === _eventKey);

    setFilterOptionsState({
      ...filterOptionsState,
      assignedTo: selectedVal,
    });
  };

  const handleClearFilter = () => {
    setIsFilterApplied(false);
    setFilterOptionsState(initialFilterState);
    getCaseListDetailsAPI(
      getReqObjectForCaseListing(initialFilterState, searchtext, false),
      1,
      10,
    );
  };
  const handleApplyFilter = () => {
    setIsFilterApplied(true);

    const reqObj = getReqObjectForCaseListing(
      filterOptionsState,
      searchtext,
      true,
    );

    getCaseListDetailsAPI(reqObj, 1, 10);
  };

  const onSearchListner = e => {
    setSearchtext(e.target.value);

    getCaseListDetailsAPI(
      getReqObjectForCaseListing(
        filterOptionsState,
        e.target.value,
        isFilterApplied,
      ),
      currentPage,
      10,
    );
    // api call for search
  };

  const onPageChange = page => {
    setCurrentPage(page);
    getCaseListDetailsAPI(
      getReqObjectForCaseListing(
        filterOptionsState,
        searchtext,
        isFilterApplied,
      ),
      page,
      10,
    );
  };

  const getActionItemsList = (isAssignedToUser, taskAction) => {
    const actionItemArr = [
      {
        id: '1',
        actionLink: '',
        label: t('CASE_LISTING.VIEW'),
      },
    ];
    if (isAssignedToUser) {
      actionItemArr.push({
        id: '2',
        actionLink: '',
        label: t('CASE_LISTING.RE-ASSIGN'),
      });
      actionItemArr.push({ id: '3', actionLink: '', label: taskAction });
    }
    return actionItemArr;
  };

  const columns = [
    {
      name: t('CASE_LISTING.COL_1_CASE_NO'),
      selector: 'caseNo',
      sortable: true,
      width: '90px',
    },
    {
      name: t('CASE_LISTING.COL_2_PROPERTY'),
      selector: 'property',
      sortable: true,
      wrap: true,
    },
    {
      name: t('CASE_LISTING.COL_3_TENANT'),
      selector: 'tenant',
      sortable: true,
      wrap: true,
    },
    {
      name: t('CASE_LISTING.COL_4_UNITS'),
      selector: 'units',
      cell: row => {
        return (
          <OverlayToolTip label={row.units} position="bottom">
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {row.units}
            </div>
          </OverlayToolTip>
        );
      },

      sortable: true,
    },
    {
      name: t('CASE_LISTING.COL_5_TASK_DUE_DATE'),
      selector: 'taskDueDate',
      sortable: true,
      width: '140px',
    },
    {
      name: t('CASE_LISTING.COL_6_TASK_STATUS'),
      selector: 'taskStatus',
      sortable: true,
      width: '128px',
    },
    {
      name: t('CASE_LISTING.COL_7_ACTION'),
      selector: 'action',
      sortable: true,
      wrap: true,
    },
    {
      name: t('CASE_LISTING.COL_8_PHASE'),
      selector: 'phase',
      sortable: true,
      wrap: true,
    },
    {
      name: t('CASE_LISTING.COL_9_CASE_STATUS'),
      cell: row => {
        switch (row.caseStatus.toLowerCase()) {
          case 'on-track':
            return <span className="on-track-dot" />;
          case 'delayed':
            return <span className="delayed-dot" />;
          case 'on-hold':
            return (
              <span className="case-status-hold-cancel-close-chip">
                On hold
              </span>
            );

          case 'cancelled':
            return (
              <span className="case-status-hold-cancel-close-chip">
                Cancelled
              </span>
            );
          case 'closed':
            return (
              <span className="case-status-hold-cancel-close-chip">Closed</span>
            );
          default:
            return '';
        }
      },
      center: true,
      width: '112px',
    },
    {
      name: t('CASE_LISTING.COL_10_PENDING_WITH'),
      selector: 'pendingWith',
      cell: row => {
        return (
          <OverlayToolTip label={row.pendingWithName} position="bottom">
            <div>
              {row.pendingWith.toLowerCase() === 'contractor'
                ? 'Tenant'
                : row.pendingWith}
            </div>
          </OverlayToolTip>
        );
      },
      sortable: true,
      width: '136px',
    },
    {
      name: '',
      sortable: false,
      cell: rowData => {
        const actionBtnItems = getActionItemsList(
          rowData.isAssignedToUser,
          rowData.action,
        );
        return (
          <ActionButton
            actionItems={actionBtnItems}
            rowData={rowData}
            onActionLister={(_eventKey, _event) =>
              onActionLister(_eventKey, _event, rowData)
            }
          />
        );
      },
      width: '64px',
      center: 'true',
    },
  ];

  const columnsTablet = [
    {
      name: t('CASE_LISTING.COL_1_CASE_NO'),
      selector: 'caseNo',
      sortable: true,
      width: '150px',
      cell: row => {
        switch (row.caseStatus.toLowerCase()) {
          case 'on-track':
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="on-track-dot"
                  style={{ marginRight: '10px' }}
                />
                <span>
                  <span className="case-num-string">
                    {`${t('CASE_LISTING.COL_1_CASE_NO')} `}
                  </span>
                  {row.caseNo}
                </span>
              </div>
            );
          case 'delayed':
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span className="delayed-dot" style={{ marginRight: '10px' }} />
                <span>
                  <span className="case-num-string">{`${t(
                    'CASE_LISTING.COL_1_CASE_NO',
                  )} `}</span>
                  {row.caseNo}
                </span>
              </div>
            );
          case 'on-hold':
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="case-status-hold-cancel-close-chip"
                  style={{ marginRight: '10px' }}
                >
                  On hold
                </span>
                <span>
                  <span className="case-num-string">{`${t(
                    'CASE_LISTING.COL_1_CASE_NO',
                  )} `}</span>
                  {row.caseNo}
                </span>
              </div>
            );

          case 'cancelled':
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="case-status-hold-cancel-close-chip"
                  style={{ marginRight: '10px' }}
                >
                  Cancelled
                </span>
                <span>
                  <span className="case-num-string">{`${t(
                    'CASE_LISTING.COL_1_CASE_NO',
                  )} `}</span>
                  {row.caseNo}
                </span>
              </div>
            );
          case 'closed':
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="case-status-hold-cancel-close-chip"
                  style={{ marginRight: '10px' }}
                >
                  Closed
                </span>
                <span>
                  <span className="case-num-string">{`${t(
                    'CASE_LISTING.COL_1_CASE_NO',
                  )} `}</span>
                  {row.caseNo}
                </span>
              </div>
            );
          default:
            return '';
        }
      },
    },

    {
      name: t('CASE_LISTING.COL_3_TENANT'),
      selector: 'tenant',
      sortable: true,
      wrap: true,
      width: '190px',
      cell: row => {
        return (
          <div>
            <div className="cell-heading">{t('CASE_LISTING.COL_3_TENANT')}</div>
            <div className="cell-content">{row.tenant}</div>
          </div>
        );
      },
    },
    {
      name: t('CASE_LISTING.COL_4_UNITS'),
      selector: 'units',
      cell: row => {
        return (
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <div className="cell-heading">{t('CASE_LISTING.COL_4_UNITS')}</div>
            <OverlayToolTip label={row.units} position="bottom">
              <div
                className="cell-content"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.units}
              </div>
            </OverlayToolTip>
          </div>
        );
      },
      width: '160px',
      sortable: true,
    },
    {
      name: t('CASE_LISTING.COL_5_TASK_DUE_DATE'),
      selector: 'taskDueDate',
      sortable: true,
      width: '140px',
      cell: row => {
        return (
          <div>
            <div className="cell-heading">
              {t('CASE_LISTING.COL_5_TASK_DUE_DATE')}
            </div>
            <div className="cell-content">{row.taskDueDate}</div>
          </div>
        );
      },
    },

    {
      name: t('CASE_LISTING.COL_7_ACTION'),
      selector: 'action',
      sortable: true,
      wrap: true,
      cell: row => {
        return (
          <div>
            <div className="cell-heading">{t('CASE_LISTING.COL_7_ACTION')}</div>
            <div className="cell-content">{row.action}</div>
          </div>
        );
      },
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
            height: 'calc(100% + 2px)',
            borderLeft: 'solid 1px #d1d1d1',
            borderBottom: 'solid 1px #ffffff',
          },
        },
      ],
      style: {
        height: 'calc(100% + 2px)',
        borderLeft: 'solid 1px #d1d1d1',
      },
    },
  ];

  const handleRowExpanded = row => {
    // const currentExpandSate=row.isExpanded;

    const modifiedCaseListDetails = [...caseListDetails];

    const currentExpandState = modifiedCaseListDetails.find(
      item => item.id === row.id,
    ).isExpanded;

    modifiedCaseListDetails.map(item => {
      const modifiedItem = item;
      modifiedItem.isExpanded = false;
      return modifiedItem;
    });

    modifiedCaseListDetails.find(
      item => item.id === row.id,
    ).isExpanded = !currentExpandState;
    setModifiedCaseListDetails(modifiedCaseListDetails);
    // transferSelected();
  };

  // console.log(Object.values(filterOptionsState), 'kjgsdfjsgdjfgsdjgfj');

  const onActionLister = (_eventKey, _event, rowData) => {
    if (_eventKey === '1' && rowData) {
      // console.log(rowData, '1');

      history.push(`${caseDetailsPath}/${rowData.id}`);
    }
    if (_eventKey === '2') {
      //  console.log(rowData, '2');
      // history.push(`${path}/${rowData.userId}`);
    }
    if (_eventKey === '3') {
      const path = getRouteWithoutParam(redirectionMapping[rowData.actionKey]);
      // console.log(
      //   redirectionMapping,
      //   redirectionMapping[rowData.actionKey],
      //   path,
      //   '<-----------------------|',
      // );
      history.push(`${path}/${rowData.id}`);
    }
  };

  const handleCreateNewCaseClick = () => {
    history.push(caseDetailsPath);
  };

  const getUIListDisplay = () => {
    if (caseListDetails.length > 0) {
      return tableJSX;
    }
    if (headerSearchText.length > 0) {
      return <div className="no-case-on-header-search" />;
    }

    return (
      <div className="no-case-listing-details">
        <div className="no-case-text">
          {t('CASE_LISTING.NO_CASES_AVAILABLE')}
        </div>
        <div className="no-case-png" />
      </div>
    );
  };

  const tableJSX =
    screenWidth > 1024 ? (
      <div className="listing-table">
        <CardListTable
          data={caseListDetails}
          columns={columns}
          pagination={false}
          custompagination
          sortFunction={customSort}
          onPageChangedCalled={_page => getCaseListDetailsAPI()}
          paginationServer
          pending={caseListingIsLoading}
          numOfColumns={columns.length - 1}
          totalListCount={caseListingTotalCount}
          handlePageChange={onPageChange}
        />
      </div>
    ) : (
      <div className="listing-table">
        <CardListTableTablet
          data={caseListDetails}
          columns={columnsTablet}
          pagination={false}
          custompagination
          noTableHead
          sortFunction={customSort}
          onPageChangedCalled={_page => getCaseListDetailsAPI()}
          paginationServer
          expandableRows
          expandableRowExpanded={row => row.isExpanded}
          expandableRowsComponent={
            <TableExpandedRow
              t={t}
              onActionLister={onActionLister}
              getActionItemsList={getActionItemsList}
            />
          }
          pending={caseListingIsLoading}
          numOfColumns={columnsTablet.length - 1}
          totalListCount={caseListingTotalCount}

          // handlePageChange={onPageChange}
        />
      </div>
    );
  return (
    <>
      {isAllPropertyLicenseSuspended ? (
        <div className="liscense-suspended">
          <Card className="license-status-card">
            <img
              src={infoIcon}
              style={{ height: '24px', width: '24px' }}
              alt=""
            />
            <span>{t('CASE_LISTING.LICENSE_SUSPENDED')}</span>
          </Card>
        </div>
      ) : (
        <div className="case-listing">
          {headerSearchText.length === 0 ? (
            <div className="charts-section">
              {phaseWiseCaseDetailList.map(phaseData => {
                return (
                  <>
                    {Object.keys(phaseData).includes('onHold') &&
                    Object.keys(phaseData).length === 1 ? (
                      <div
                        className="case-phase-card"
                        key={
                          caseStatusList.length > 0 &&
                          caseStatusList.find(
                            item =>
                              item.value &&
                              item.value.toLowerCase() === 'on-hold',
                          ).value
                        }
                      >
                        <PhaseDonought
                          data={[
                            {
                              title: 'on-hold',
                              value: Number(phaseData.onHold),
                              color: 'dfe0e5', // on hold same color as background
                            },
                          ]}
                          title={
                            caseStatusList.length > 0 &&
                            caseStatusList.find(
                              item =>
                                item.value &&
                                item.value.toLowerCase() === 'on-hold',
                            ).value
                          }
                          onDonoughtBoxClick={() =>
                            handleDonoughtChartClick(phaseData.phaseId)
                          }
                        />
                      </div>
                    ) : (
                      <div
                        className="case-phase-card"
                        key={phaseData.phaseName}
                      >
                        <PhaseDonought
                          data={[
                            {
                              title: 'delayed',
                              value: Number(phaseData.delayed),
                              color: '#ff7a39', // delayed
                            },
                            {
                              title: 'on-track',
                              value: Number(phaseData.onTrack),
                              color: '#13b43e', // ontrack
                            },
                          ]}
                          title={phaseData.phaseName}
                          onDonoughtBoxClick={() =>
                            handleDonoughtChartClick(phaseData.phaseId)
                          }
                        />
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          ) : (
            ''
          )}

          {/* {caseListDetails.length > 0 ||
          headerSearchText ||
          searchtext ||
          isFilterApplied ? ( */}
          <div className="listing-section">
            <Card className="case-listing-table-card">
              <div className="case-header">
                <div className={`case-header-main ${filterExpanded}`}>
                  {headerSearchText.length > 0 ? (
                    <div className="case-header-title">
                      {caseListDetails.length > 0
                        ? `${t('CASE_LISTING.SEARCH_RESULT_FOR', {
                            searchValue: headerSearchText,
                          })} `
                        : `${t('CASE_LISTING.NO_SEARCH_RESULT', {
                            searchValue: headerSearchText,
                          })}`}
                    </div>
                  ) : (
                    <div className="case-header-title">
                      {t('CASE_LISTING.CASES')}
                      <span className="line" />
                      <span>
                        {t('CASE_LISTING.TOTAL')} <b>{caseListingTotalCount}</b>
                      </span>
                    </div>
                  )}
                  {headerSearchText.length > 0 &&
                  caseListDetails.length === 0 ? (
                    ''
                  ) : (
                    <div className="case-header-content">
                      <div className="case-status">
                        <span className="on-track-dot" />
                        &nbsp;<span>{t('CASE_LISTING.ON_TRACK')}</span>
                      </div>
                      <div className="case-status">
                        <span className="delayed-dot" />
                        &nbsp;{t('CASE_LISTING.DELAYED')}
                      </div>
                      {isCaseManipulationAccess ? (
                        <div className="create-case">
                          <LabelWithIcon
                            label={t('CASE_LISTING.CREATE_A_NEW_CASE_LABEL')}
                            handleClick={handleCreateNewCaseClick}
                          />
                        </div>
                      ) : (
                        ''
                      )}
                      <div className="search-box">
                        <Searchbar
                          className="caselisting-searchbar"
                          searchText={searchtext}
                          onSearchListner={onSearchListner}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className={`header-filter ${filterExpanded}`}>
                  <button
                    type="button"
                    className="filter-btn"
                    onClick={openFilterTab}
                  >
                    {filterExpanded === 'filter-expanded' &&
                    (searchtext.length > 0 || headerSearchText.length > 0) ? (
                      <>
                        {t('GLOBAL.ADVANCED')}&nbsp;
                        <img src={filterExpandIcon} alt="" />
                      </>
                    ) : (
                      <>
                        {t('GLOBAL.FILTER')}&nbsp;
                        <img src={filterIcon} alt="" />
                      </>
                    )}
                    {/* Filter&nbsp;
              <img src={filterIcon} alt="" /> */}
                    &nbsp;&nbsp;
                  </button>
                  {filterExpanded === 'filter-expanded' ? (
                    <button
                      type="button"
                      className="filter-close-icon-btn"
                      onClick={closeFilterTab}
                    >
                      <img src={close} alt="" />
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {filterExpanded === 'filter-expanded' ? (
                <div className="filter-tab">
                  <div className="filter-dropdowns">
                    <DropdownComponent
                      id="property"
                      className="filter-dropdown"
                      label={t('CASE_LISTING.COL_2_PROPERTY')}
                      filterDropdown
                      data={userAccessPropertyList}
                      value={
                        filterOptionsState.property
                          ? filterOptionsState.property.value
                          : ''
                      }
                      onSelect={_eventKey => handlePropertyFilter(_eventKey)}
                    />
                    <DropdownComponent
                      id="customer"
                      className="filter-dropdown"
                      label={t('CASE_LISTING.COL_3_TENANT')}
                      filterDropdown
                      data={customerList}
                      value={
                        filterOptionsState.customer
                          ? filterOptionsState.customer.value
                          : ''
                      }
                      onSelect={_eventKey => handleCustomerFilter(_eventKey)}
                    />
                    <DropdownComponent
                      id="brand"
                      className="filter-dropdown"
                      label={t('CASE_LISTING.BRAND')}
                      filterDropdown
                      data={brandList}
                      value={
                        filterOptionsState.brand
                          ? filterOptionsState.brand.value
                          : ''
                      }
                      onSelect={_eventKey => handleBrandFilter(_eventKey)}
                    />
                    <DropdownComponent
                      id="units"
                      className="filter-dropdown"
                      label={t('CASE_LISTING.COL_4_UNITS')}
                      filterDropdown
                      data={unitsList}
                      value={
                        filterOptionsState.units
                          ? filterOptionsState.units.value
                          : ''
                      }
                      onSelect={_eventKey => handleUnitsFilter(_eventKey)}
                    />

                    <DropdownComponent
                      id="status"
                      className="filter-dropdown"
                      label={t('CASE_LISTING.COL_9_CASE_STATUS')}
                      filterDropdown
                      data={caseStatusList}
                      value={
                        filterOptionsState.caseStatus
                          ? filterOptionsState.caseStatus.value
                          : ''
                      }
                      onSelect={_eventKey => handleCaseStatusFilter(_eventKey)}
                    />
                    <DropdownComponent
                      id="phase"
                      className="filter-dropdown"
                      label={t('CASE_LISTING.COL_8_PHASE')}
                      filterDropdown
                      data={propertyPhaseList}
                      value={
                        filterOptionsState.phase
                          ? filterOptionsState.phase.value
                          : ''
                      }
                      onSelect={_eventKey => handlePhaseFilter(_eventKey)}
                    />
                    <DropdownComponent
                      id="case-type"
                      className="filter-dropdown"
                      label={t('CASE_LISTING.CASE_TYPE')}
                      filterDropdown
                      data={caseTypeList}
                      value={
                        filterOptionsState.caseType
                          ? filterOptionsState.caseType.value
                          : ''
                      }
                      onSelect={_eventKey => handleCaseTypeFilter(_eventKey)}
                    />
                    <DropdownComponent
                      id="assigned-to"
                      className="filter-dropdown"
                      label={t('CASE_LISTING.ASSIGNED_TO_FILTER')}
                      filterDropdown
                      data={assignedToUserList}
                      value={
                        filterOptionsState.assignedTo
                          ? filterOptionsState.assignedTo.value
                          : ''
                      }
                      onSelect={_eventKey => handleAssignedToFilter(_eventKey)}
                    />
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-secondary btn-small"
                        onClick={handleClearFilter}
                      >
                        {t('GLOBAL.CLEAR')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-small"
                        onClick={handleApplyFilter}
                      >
                        {t('GLOBAL.APPLY')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}

              {getUIListDisplay()}
            </Card>
          </div>

          {/* {caseListDetails.length === 0 && !headerSearchText && !searchtext ? (
        <div className="no-case-listing-details">
          <div className="no-case-text">No cases Available</div>
          <div className="no-case-png" />
        </div>
      ) : (
        ''
      )} */}

          <ErrorAlert
            alertMessage={errorMessage}
            primaryButtonText={t('GLOBAL.OK')}
            open={isErrorMessage}
            setClose={() => setIsErrorMessage(!isErrorMessage)}
            primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = state => ({
  phaseWiseCaseDetailList: state.caseListing.phaseWiseCaseDetailList,
  caseListDetails: state.caseListing.caseList,
  caseListingIsLoading: state.caseListing.caseListIsLoading,
  caseListingTotalCount: state.caseListing.caseListTotal,
  headerSearchText: state.header.searchText,
  userAccessPropertyList: state.caseListing.userAccessPropertyList,
  customerList: state.caseListing.customerList,
  brandList: state.caseListing.brandList,
  unitsList: state.caseListing.unitsList,
  caseStatusList: state.caseListing.caseStatusList,
  propertyPhaseList: state.caseListing.propertyPhaseList,
  caseTypeList: state.caseListing.caseTypeList,
  assignedToUserList: state.caseListing.assignedToList,
  isCaseManipulationAccess: state.caseListing.isCaseManipulationAccess,
  isAllPropertyLicenseSuspended:
    state.caseListing.isAllPropertyLicenseSuspended,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPhaseWiseCaseDetailsAPI: getPhaseWiseCaseDetailsAPIAction,
      getCaseListDetailsAPI: getCaseListDetailsAPIAction,
      setModifiedCaseListDetails: setCaseListDetails,
      getUserAccessPropertiesApi: getUserAccessPropertiesApiAction,
      getCustomerListApi: getCustomerListApiAction,
      getBrandListApi: getBrandListApiAction,
      getUnitsListApi: getUnitsListApiAction,
      getCaseStatusListApi: getCaseStatusListApiAction,
      getPropertyPhaseListApi: getPropertyPhaseListApiAction,
      getCaseTypeListApi: getCaseTypeListApiAction,
      getAssignedToUserListApi: getAssignedToUserListApiAction,
      getIsCaseManipulateAccessApi: getIsCaseManipulateAccessApiAction,
    },
    dispatch,
  );

CaseListing.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  headerSearchText: PropTypes.string.isRequired,
  getPhaseWiseCaseDetailsAPI: PropTypes.func.isRequired,
  phaseWiseCaseDetailList: PropTypes.instanceOf(Array).isRequired,
  getCaseListDetailsAPI: PropTypes.func.isRequired,
  caseListDetails: PropTypes.instanceOf(Array).isRequired,
  caseListingIsLoading: PropTypes.bool.isRequired,
  caseListingTotalCount: PropTypes.number.isRequired,
  setModifiedCaseListDetails: PropTypes.func.isRequired,
  getUserAccessPropertiesApi: PropTypes.func.isRequired,
  getCustomerListApi: PropTypes.func.isRequired,
  getBrandListApi: PropTypes.func.isRequired,
  getUnitsListApi: PropTypes.func.isRequired,
  getCaseStatusListApi: PropTypes.func.isRequired,
  getPropertyPhaseListApi: PropTypes.func.isRequired,
  getCaseTypeListApi: PropTypes.func.isRequired,
  getAssignedToUserListApi: PropTypes.func.isRequired,
  userAccessPropertyList: PropTypes.instanceOf(Array).isRequired,
  customerList: PropTypes.instanceOf(Array).isRequired,
  brandList: PropTypes.instanceOf(Array).isRequired,
  unitsList: PropTypes.instanceOf(Array).isRequired,
  caseStatusList: PropTypes.instanceOf(Array).isRequired,
  propertyPhaseList: PropTypes.instanceOf(Array).isRequired,
  caseTypeList: PropTypes.instanceOf(Array).isRequired,
  assignedToUserList: PropTypes.instanceOf(Array).isRequired,
  isCaseManipulationAccess: PropTypes.bool.isRequired,
  isAllPropertyLicenseSuspended: PropTypes.bool.isRequired,
};

CaseListing.defaultProps = {
  history: PropTypes.shape({
    push: () => {},
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseListing);

const TableExpandedRow = ({ data, t, onActionLister, getActionItemsList }) => {
  const actionBtnItems = getActionItemsList(data.isAssignedToUser, data.action);

  return (
    <div className="table-row-expanded">
      <div
        className="case-detail"
        style={{ width: '150px', flexGrow: 'unset' }}
      >
        <span className="case-detail-heading">
          {t('CASE_LISTING.COL_2_PROPERTY')}
        </span>
        <span className="case-detail-value">{data.property}</span>
      </div>
      <div
        className="case-detail"
        style={{ width: '190px', flexGrow: 'unset' }}
      >
        <span className="case-detail-heading">
          {t('CASE_LISTING.COL_6_TASK_STATUS')}
        </span>
        <span className="case-detail-value">{data.taskStatus}</span>
      </div>
      <div
        className="case-detail"
        style={{ width: '160px', flexGrow: 'unset' }}
      >
        <span className="case-detail-heading">
          {t('CASE_LISTING.COL_8_PHASE')}
        </span>
        <span className="case-detail-value">{data.phase}</span>
      </div>
      <div
        className="case-detail"
        style={{ width: '140px', flexGrow: 'unset' }}
      >
        <span className="case-detail-heading">
          {t('CASE_LISTING.COL_10_PENDING_WITH')}
        </span>
        <span className="case-detail-value">{data.pendingWith}</span>
      </div>
      <div className="action-links-tab">
        {actionBtnItems.map(item => {
          return (
            <button
              type="button"
              className="btn-link action-link"
              key={item.id}
              onClick={_event => {
                onActionLister(item.id, _event, data);
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

TableExpandedRow.propTypes = {
  data: PropTypes.instanceOf(Object),
  t: PropTypes.func.isRequired,
  onActionLister: PropTypes.func.isRequired,
  getActionItemsList: PropTypes.func.isRequired,
};

TableExpandedRow.defaultProps = {
  data: [],
};
