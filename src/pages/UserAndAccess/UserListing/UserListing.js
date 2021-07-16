import React, { useEffect, useCallback } from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import messages from '../../../utils/Locales/messages';
import CardHeader from '../../../components/CardHeader/CardHeader';
import CardListTable from '../../../components/CardListTable/CardListTable';
import filterIcon from '../../../images/filter/filter-list.png';
import filterExpandIcon from '../../../images/filter/advanced-icon.png';
import close from '../../../images/close button/close.png';
import './UserListing.scss';
import DropdownComponent from '../../../components/Dropdown/DropdownComponent';
import {
  customSort,
  getErrorMessage,
  getRouteWithoutParam,
} from '../../../utils/utils';

import ActionButton from '../../../components/ActionButton/ActionButton';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import {
  getUserListModified,
  getUserTypeListForFilterDD,
  getUserAccessProprtyListForFilterDD,
} from '../selector';
import {
  getUserListAPIAction,
  getUserTypeListAPIAction,
  saveAddUpdateUserStep1APIAction,
} from '../../../actions/userAndAccessAction';
// import Switch from '../../../components/Switch/Switch';
import routePath from '../../../utils/constants';
import labelText from '../../../utils/Locales/labels';

function UserListing({
  history,
  userListing,
  getUserListAPI,
  userListCount,
  getUserTypeListAPI,
  userTypeList,
  userPropertyList,
  userListIsLoading,
  saveAddUpdateUserStep1API,
}) {
  const path = getRouteWithoutParam(
    routePath.ROUTE.USER_AND_ACCESS.USER_AND_ACCESS_SETUP,
  );
  const approvedFilterDropDownData = [
    { id: '0', value: 'All' },
    { id: '1', value: 'Yes' },
    { id: '2', value: 'No' },
  ];

  const approveActiveDropdownData = [
    { id: '1', value: 'Yes' },
    { id: '2', value: 'No' },
  ];

  const [searchtext, setSearchtext] = React.useState('');
  const [filterExpanded, setFilterExpanded] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // //const [approvedFilterVal, setApprovedFilterVal] = React.useState(
  //   approvedFilterDropDownData[0].value,
  // );

  const debouncedSearch = useCallback(
    _.debounce(
      (searchString, isApproved, isActive, userTypeId, propertyId) =>
        getUserListAPI(
          currentPage,
          10,
          searchString,
          isApproved,
          isActive,
          userTypeId,
          propertyId,
        ),
      routePath.SEARCH_DEBOUNCE_WAIT_TIME,
    ),
    [],
  );

  const [isFilterApplied, setIsFilterApplied] = React.useState(false);

  const getFilterOptions = (filterOptions, isFilterAppliedVar) => {
    const isApproved =
      filterOptions.approved === 'All' || !isFilterAppliedVar
        ? null
        : getApprovedActiveBool(filterOptions.approved);
    const isActive =
      filterOptions.active === 'All' || !isFilterAppliedVar
        ? null
        : getApprovedActiveBool(filterOptions.active);
    const userTypeId =
      filterOptions.userType.id === 'all' || !isFilterAppliedVar
        ? null
        : filterOptions.userType.id;
    const propertyId =
      filterOptions.property.id === 'all' || !isFilterAppliedVar
        ? null
        : filterOptions.property.id;

    return { isApproved, isActive, userTypeId, propertyId };
  };

  const initialFilterState = {
    approved: 'All',
    active: 'All',
    userType: { id: 'all', value: 'All' },
    property: { id: 'all', value: 'All' },
  };

  const [filterOptionsState, setFilterOptionsState] = React.useState(
    initialFilterState,
  );

  const getApprovedActiveBool = value => {
    if (value.toLowerCase() === 'yes') {
      return true;
    }
    if (value.toLowerCase() === 'no') {
      return false;
    }
    return null;
  };

  useEffect(() => {
    getUserListAPI();
    getUserTypeListAPI();
  }, []);

  const columns = [
    {
      name: labelText.USER_AND_ACCESS.USER_LISTING.COL_1_FIRSTNAME,
      selector: 'firstName',
      sortable: true,
      grow: 1,
    },
    {
      name: labelText.USER_AND_ACCESS.USER_LISTING.COL_2_LASTNAME,
      selector: 'lastName',
      sortable: true,
      grow: 1,
    },
    {
      name: labelText.USER_AND_ACCESS.USER_LISTING.COL_3_EMAIL,
      selector: 'email',
      sortable: true,
      grow: 1.5,
    },
    {
      name: labelText.USER_AND_ACCESS.USER_LISTING.COL_4_USET_TYPE,
      selector: 'userType',
      sortable: true,
      // width: '120px',
      // center: 'true',
      grow: 1,
    },
    {
      grow: 1,
      name: labelText.USER_AND_ACCESS.USER_LISTING.COL_5_APPROPVED,
      allowOverflow: true,
      cell: row => {
        return (
          <>
            {/* {row.firstName === 'Sirus' ? (
              <DropdownComponent
                className="in-table-dropdown"
                data={approveActiveDropdownData}
                value={row.approved}
                onSelect={_eventKey =>
                  handleApprovedSelect(Number(_eventKey), row)
                }
              />
            ) : (
              <Switch />
            )} */}

            <DropdownComponent
              className="in-table-dropdown"
              data={approveActiveDropdownData}
              value={row.approved.value}
              onSelect={_eventKey => handleApprovedSelect(_eventKey, row)}
            />
          </>
        );
      },
    },
    {
      grow: 1,
      name: labelText.USER_AND_ACCESS.USER_LISTING.COL_6_ACTIVE,
      allowOverflow: true,
      sortable: false,
      cell: row => {
        return (
          <>
            {/* {row.firstName === 'Sirus' ? (
              <DropdownComponent
                className="in-table-dropdown"
                data={approveActiveDropdownData}
                value={row.active}
                onSelect={_eventKey =>
                  handleActiveSelect(Number(_eventKey), row)
                }
              />
            ) : (
              <Switch />
            )} */}

            <DropdownComponent
              className="in-table-dropdown"
              data={approveActiveDropdownData}
              value={row.active.value}
              onSelect={_eventKey => handleActiveSelect(_eventKey, row)}
            />
          </>
        );
      },
    },
    {
      name: '',
      sortable: false,
      cell: rowData => {
        return (
          <ActionButton
            actionItems={actionItems}
            rowData={rowData}
            onActionLister={(_eventKey, _event) =>
              onActionLister(_eventKey, _event, rowData)
            }
          />
        );
      },
      width: '70px',
      center: 'true',
    },
  ];

  const handleApplyFilter = () => {
    setIsFilterApplied(true);
    const currentFilterOptions = getFilterOptions(filterOptionsState, true);

    getUserListAPI(
      1,
      10,
      searchtext,
      currentFilterOptions.isApproved,
      currentFilterOptions.isActive,
      currentFilterOptions.userTypeId,
      currentFilterOptions.propertyId,
    );
  };

  const handleApprovedSelect = (_eventKey, rowData) => {
    const selectedVal = approveActiveDropdownData.find(
      item => item.id === _eventKey,
    ).value;

    const reqObj = {
      userId: rowData.userId,
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      userTypesId: userTypeList.find(item => item.value === rowData.userType)
        .id,
      email: rowData.email,
      isApproved: getApprovedActiveBool(selectedVal),
      isActive: getApprovedActiveBool(rowData.active.value),
    };

    saveAddUpdateUserStep1API(reqObj, false, rowData.userId)
      .then(res => {
        if (res.data.success) {
          if (res.data.data[0].userId) {
            getUserListAPI();
          }
        }
      })
      .catch(err => {
        setErrorMessage(`${getErrorMessage(err)}`);
        setIsErrorMessage(true);
      });
    // give a call to backend passing the row data and selected value in whichever format they require
    // call the getUserListAPI again to pupulate the modified data
  };
  // const handleApprovedSelect = () => {};
  // const handleActiveSelect = () => {};
  const handleActiveSelect = (_eventKey, rowData) => {
    const selectedVal = approveActiveDropdownData.find(
      item => item.id === _eventKey,
    ).value;

    const reqObj = {
      userId: rowData.userId,
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      userTypesId: userTypeList.find(item => item.value === rowData.userType)
        .id,
      email: rowData.email,
      isApproved: getApprovedActiveBool(rowData.approved.value),
      isActive: getApprovedActiveBool(selectedVal),
    };

    saveAddUpdateUserStep1API(reqObj, false, rowData.userId)
      .then(res => {
        if (res.data.success) {
          if (res.data.data[0].userId) {
            getUserListAPI();
          }
        }
      })
      .catch(err => {
        setErrorMessage(`${getErrorMessage(err)}`);
        setIsErrorMessage(true);
      });

    // give a call to backend passing the row data and selected value in whichever format they require
    // call the getUserListAPI again to pupulate the modified data
  };

  const actionItems = [
    {
      id: 1,
      actionLink: '',
      label: labelText.GLOBAL.ACTION_EDIT,
    },
  ];

  const onActionLister = (_eventKey, _event, rowData) => {
    if (_eventKey === '1') {
      history.push(`${path}/${rowData.userId}`);
    }
  };

  const openFilterTab = () => {
    if (filterExpanded === '') {
      setFilterExpanded('filter-expanded');
    }
  };
  const closeFilterTab = () => {
    if (filterExpanded === 'filter-expanded') {
      handleClearFilter();
      setFilterExpanded('');
    }
  };

  const handleApprovedFilter = _eventKey => {
    const selectedVal = approvedFilterDropDownData.find(
      item => item.id === _eventKey,
    ).value;
    setFilterOptionsState({
      ...filterOptionsState,
      approved: selectedVal,
    });
  };

  const handleActiveFilter = _eventKey => {
    const selectedVal = approvedFilterDropDownData.find(
      item => item.id === _eventKey,
    ).value;
    setFilterOptionsState({
      ...filterOptionsState,
      active: selectedVal,
    });
  };

  const handleUserTypeFilter = _eventKey => {
    const selectedVal = userTypeList.find(item => item.id === _eventKey);
    setFilterOptionsState({
      ...filterOptionsState,
      userType: selectedVal,
    });
  };

  const handlePropertyFilter = _eventKey => {
    const selectedVal = userPropertyList.find(item => item.id === _eventKey);
    setFilterOptionsState({
      ...filterOptionsState,
      property: selectedVal,
    });
  };

  const handleClearFilter = () => {
    setFilterOptionsState(initialFilterState);
    setIsFilterApplied(false);
    const currentfilterOptions = getFilterOptions(initialFilterState, false);
    getUserListAPI(
      1,
      10,
      searchtext,
      currentfilterOptions.isApproved,
      currentfilterOptions.isActive,
      currentfilterOptions.userTypeId,
      currentfilterOptions.propertyId,
    );
  };

  const handleAddNewUser = () => {
    history.push(`${path}`);
  };

  const onPageChange = page => {
    const currentFilterOptions = getFilterOptions(
      filterOptionsState,
      isFilterApplied,
    );
    setCurrentPage(page);
    getUserListAPI(
      page,
      10,
      searchtext,
      currentFilterOptions.isApproved,
      currentFilterOptions.isActive,
      currentFilterOptions.userTypeId,
      currentFilterOptions.propertyId,
    ); // just setting this now to current page as requires to push the code.
  };

  const onSearchListner = e => {
    const currentFilterOptions = getFilterOptions(
      filterOptionsState,
      isFilterApplied,
    );
    setSearchtext(e.target.value);
    // api call for search
    debouncedSearch(
      e.target.value,
      currentFilterOptions.isApproved,
      currentFilterOptions.isActive,
      currentFilterOptions.userTypeId,
      currentFilterOptions.propertyId,
    );

    // getUserListAPI(
    //   currentPage,
    //   10,
    //   e.target.value,
    //   currentFilterOptions.isApproved,
    //   currentFilterOptions.isActive,
    //   currentFilterOptions.userTypeId,
    //   currentFilterOptions.propertyId,
    // );
  };
  return (
    <div className="user-listing">
      <Card>
        <div className="header-with-filter">
          <div className={`header-main ${filterExpanded}`}>
            <CardHeader
              title={labelText.USER_AND_ACCESS.USER_LISTING.TITLE}
              searchbox
              lable
              createLabelName={
                labelText.USER_AND_ACCESS.USER_LISTING.ADD_NEW_USER
              }
              handleClickCreateIcon={handleAddNewUser}
              searchText={searchtext}
              onSearchListner={onSearchListner}
            />
          </div>

          <div className={`header-filter ${filterExpanded}`}>
            <button
              type="button"
              className="filter-btn"
              onClick={openFilterTab}
            >
              {filterExpanded === 'filter-expanded' && searchtext.length > 0 ? (
                <>
                  {labelText.GLOBAL.ADVANCED}&nbsp;{' '}
                  <img src={filterExpandIcon} alt="" />
                </>
              ) : (
                <>
                  {labelText.GLOBAL.FILTER}&nbsp;
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
            <DropdownComponent
              id="approved"
              className="filter-dropdown"
              label={
                labelText.USER_AND_ACCESS.USER_LISTING.FILTER_DROPDOWN_APPROVED
              }
              filterDropdown
              data={approvedFilterDropDownData}
              value={filterOptionsState.approved}
              onSelect={_eventKey => handleApprovedFilter(_eventKey)}
            />
            <DropdownComponent
              id="active"
              className="filter-dropdown"
              label={
                labelText.USER_AND_ACCESS.USER_LISTING.FILTER_DROPDOWN_ACTIVE
              }
              filterDropdown
              data={approvedFilterDropDownData}
              value={filterOptionsState.active}
              onSelect={_eventKey => handleActiveFilter(_eventKey)}
            />
            <DropdownComponent
              id="userType"
              className="filter-dropdown"
              label={
                labelText.USER_AND_ACCESS.USER_LISTING.FILTER_DROPDOWN_USER_TYPE
              }
              filterDropdown
              data={userTypeList}
              value={
                filterOptionsState.userType
                  ? filterOptionsState.userType.value
                  : ''
              }
              onSelect={_eventKey => handleUserTypeFilter(_eventKey)}
            />
            <DropdownComponent
              id="property"
              className="filter-dropdown"
              label={
                labelText.USER_AND_ACCESS.USER_LISTING.FILTER_DROPDOWN_PROPERTY
              }
              filterDropdown
              data={userPropertyList}
              value={
                filterOptionsState.property
                  ? filterOptionsState.property.value
                  : ''
              }
              onSelect={_eventKey => handlePropertyFilter(_eventKey)}
            />
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={handleClearFilter}
              >
                {labelText.GLOBAL.CLEAR}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={handleApplyFilter}
              >
                {labelText.GLOBAL.APPLY}
              </button>
            </div>
          </div>
        ) : (
          ''
        )}

        <CardListTable
          total
          totalListCount={userListCount} // for now we are keeping userList.length otherwise need to fetch it from the api call only
          data={userListing}
          columns={columns}
          pagination={false}
          custompagination
          sortFunction={customSort}
          onPageChangedCalled={_page =>
            getUserListAPI(
              _page,
              10,
              searchtext,
              getFilterOptions(filterOptionsState, isFilterApplied).isApproved,
              getFilterOptions(filterOptionsState, isFilterApplied).isActive,
              getFilterOptions(filterOptionsState, isFilterApplied).userTypeId,
              getFilterOptions(filterOptionsState, isFilterApplied).propertyId,
            )
          }
          paginationServer
          pending={userListIsLoading}
          noDataString={messages.USER_AND_ACCESS.USER_LISTING.USER_LIST_NO_DATA}
          numOfColumns={columns.length - 1}
          handlePageChange={onPageChange}
        />
      </Card>
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText={labelText.GLOBAL.OK}
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  userListing: getUserListModified(state),
  userListCount: state.userAccess.userListCount,
  userTypeList: getUserTypeListForFilterDD(state),
  userPropertyList: getUserAccessProprtyListForFilterDD(state),
  userListIsLoading: state.userAccess.userListIsLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserListAPI: getUserListAPIAction,
      getUserTypeListAPI: getUserTypeListAPIAction,
      saveAddUpdateUserStep1API: saveAddUpdateUserStep1APIAction,
    },
    dispatch,
  );

UserListing.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  getUserListAPI: PropTypes.func.isRequired,
  userListing: PropTypes.instanceOf(Array).isRequired,
  userListCount: PropTypes.number.isRequired,
  userTypeList: PropTypes.instanceOf(Array).isRequired,
  getUserTypeListAPI: PropTypes.func.isRequired,
  userPropertyList: PropTypes.instanceOf(Array).isRequired,
  userListIsLoading: PropTypes.bool.isRequired,
  saveAddUpdateUserStep1API: PropTypes.func.isRequired,
};

UserListing.defaultProps = {
  history: PropTypes.shape({
    push: () => {},
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(UserListing);
