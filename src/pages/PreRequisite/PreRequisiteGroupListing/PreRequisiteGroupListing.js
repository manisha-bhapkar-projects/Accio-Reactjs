import React, { useEffect, useCallback } from 'react';
import _ from 'lodash';
import './PreRequisiteGroupListing.scss';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CardHeader from '../../../components/CardHeader/CardHeader';
import CardListTable from '../../../components/CardListTable/CardListTable';
import ActionButton from '../../../components/ActionButton/ActionButton';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import {
  handleApiError,
  getRouteWithoutParam,
  scrollToTop,
  customSort,
} from '../../../utils/utils';

import prerequisiteMessages from '../../../utils/Locales/messages';
import labelText from '../../../utils/Locales/labels';
import routePath from '../../../utils/constants';

import {
  getPreRequisiteGroupList,
  getGroupListCount,
} from '../../../reducers/prerequisiteGroupListReducer';
import {
  getPrerequisiteGroupListApiAction,
  deletePRGroupApiAction,
  // copyPRGroupApiAction,
} from '../../../actions/prerequisiteGroupListing';

import { checkIsEditableDeletableAPIAction } from '../../../actions/commonActions';

function PreRequisiteGroupListing({
  groupList,
  getPrerequisiteGroupListApi,
  deletePRGroupApi,
  // copyPRGroupApi,
  history,
  groupListCount,
  groupListIsLoading,
  checkIsEditableDeletableAPI,
}) {
  const path = getRouteWithoutParam(
    routePath.ROUTE.PHASES_AND_MORE.CREATE_ADD_UPDATE_PRE_REQUISITE_GROUP,
  );
  const [searchtext, setSearchText] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [listNoDataString, setListNoDataString] = React.useState(
    prerequisiteMessages.PREREQUISITE_GROUP_LIST
      .PREREQUISITE_GROUP_LIST_NO_DATA,
  );

  const debouncedSearch = useCallback(
    _.debounce(
      (searchInputs, cb) => cb(currentPage, null, searchInputs),
      routePath.SEARCH_DEBOUNCE_WAIT_TIME,
    ),
    [],
  );
  const columns = [
    {
      name: labelText.PREREQUISITE_GROUP.LIST.COL_1_GROUP_NAME,
      selector: 'groupName',
      sortable: true,
      grow: '6',
    },
    {
      name: labelText.PREREQUISITE_GROUP.LIST.COL_2_UPDATED_ON,
      selector: 'updatedOn',
      sortable: true,
      grow: '2.5',
    },
    {
      name: labelText.PREREQUISITE_GROUP.LIST.COL_3_UPDATED_BY,
      selector: 'updatedBy',
      sortable: false,
      grow: '2.5',
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
      grow: '.8',
      center: 'true',
    },
  ];

  useEffect(() => {
    scrollToTop();
    getPrerequisiteGroupListApi();
  }, []);

  const handleCreateNewGroup = e => {
    e.preventDefault();

    history.push(path);
  };

  const actionItems = [
    {
      id: 1,
      actionLink: '',
      label: labelText.PREREQUISITE_GROUP.LIST.ACTION_EDIT,
    },
    {
      id: 2,
      actionLink: '',
      label: labelText.PREREQUISITE_GROUP.LIST.ACTION_DELETE,
    },
    {
      id: 3,
      actionLink: '',
      label: labelText.PREREQUISITE_GROUP.LIST.ACTION_CREATE_COPY,
    },
  ];

  const editPreRequisiteGroup = rowData => {
    const module = 'pre-requisities_group';
    const operation = 'edit';
    const refId = rowData.id;
    checkIsEditableDeletableAPI(module, operation, refId).then(res => {
      if (res.data.success) {
        history.push(`${path}/${rowData.id}`, {
          action: 'edit',
        });
      } else {
        setErrorMessage(
          prerequisiteMessages.PREREQUISITE_GROUP_LIST
            .PREREQUISITE_GROUP_WITH_CASE,
        );
        setIsErrorMessage(true);
      }
    });
  };

  const copyPreRequisiteGroup = rowData => {
    history.push(`${path}/${rowData.id}`, {
      action: 'copy',
    });
  };

  /** Click listner for Action button in Work Listing Table Row
   * @param{string} _eventKey ActionButton Dropdown index/Key
   * @param{object} _event ActionButton Dropdown item click event object
   * @param{object} rowData Worflows Listing Action clicked Row data
   */
  const onActionLister = (_eventKey, _event, rowData) => {
    // // eslint-disable-next-line no-console
    if (_eventKey === '1') {
      editPreRequisiteGroup(rowData);
    }
    // // delete event
    if (_eventKey === '2') {
      if (!rowData.isAddedInWorkFlow) {
        deletePRGroupApi(rowData.id)
          .then(res => {
            // console.log(res.data, 'for delete group');
            if (res.data.success) {
              setIsDeleteSuccess(true);
              // getPrerequisiteGroupListApi(currentPage, 10, searchtext);
            } else {
              setIsErrorMessage(true);
              setErrorMessage(res.data.message);
            }
          })
          .catch(err => {
            if (err) {
              const errMesage = handleApiError(err);
              setIsErrorMessage(true);
              setErrorMessage(errMesage);
            }
          });
      } else {
        setIsErrorMessage(true);
        setErrorMessage(
          prerequisiteMessages.PREREQUISITE_GROUP_LIST
            .PREREQUISITE_GROUP_IN_WORKFLOW_ERROR,
        );
      }
    }
    if (_eventKey === '3') {
      copyPreRequisiteGroup(rowData);
    }
  };

  const handleDeleteSuccessAlert = () => {
    getPrerequisiteGroupListApi(currentPage, 10, searchtext);
    setIsDeleteSuccess(false);
  };

  const onSearchListner = e => {
    // Api call for search
    const searchInputs = e.target.value;
    setSearchText(searchInputs);
    if (searchInputs) {
      setListNoDataString(
        `${prerequisiteMessages.GLOBAL.ERR_NO_SEARCH_RECORD} "${searchInputs}"`,
      );
    } else {
      setListNoDataString(
        prerequisiteMessages.PREREQUISITE_GROUP_LIST
          .PREREQUISITE_GROUP_LIST_NO_DATA,
      );
    }
    debouncedSearch(searchInputs, getPrerequisiteGroupListApi);
    // getPrerequisiteGroupListApi(currentPage, null, searchInputs);
  };

  const onPageChange = page => {
    // console.log(page, 'curentPageCurrent');
    setCurrentPage(page);
    getPrerequisiteGroupListApi(page, 10, searchtext);
  };

  return (
    <div className="prerequisite-group-lising">
      <Card>
        <CardHeader
          title={labelText.PREREQUISITE_GROUP.LIST.TITLE}
          searchbox
          lable
          createLabelName={labelText.PREREQUISITE_GROUP.LIST.CREATE_NEW}
          handleClickCreateIcon={handleCreateNewGroup}
          searchText={searchtext}
          onSearchListner={onSearchListner}
        />

        <CardListTable
          data={groupList}
          columns={columns}
          pagination={false}
          custompagination
          sortFunction={customSort}
          onPageChangedCalled={_page =>
            getPrerequisiteGroupListApi(_page, 10, searchtext)
          }
          paginationServer
          pending={groupListIsLoading}
          noDataString={listNoDataString}
          total
          totalListCount={groupListCount}
          handlePageChange={onPageChange}
          numOfColumns={columns.length - 1}
          // defaultSortField="groupName"
          // defaultSortAsc={false}
        />
      </Card>
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />

      <SuccessAlert
        alertMessage={
          prerequisiteMessages.PREREQUISITE_GROUP_LIST
            .PREREQUISITE_GROUP_DELETE_SUCCESSFULL
        }
        primaryButtonText="OK"
        open={isDeleteSuccess}
        setClose={() => {
          setIsDeleteSuccess(!isDeleteSuccess);
          handleDeleteSuccessAlert();
        }}
        primaryButtonOnClick={() => handleDeleteSuccessAlert()}
      />
    </div>
  );
}

PreRequisiteGroupListing.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  groupList: PropTypes.instanceOf(Array).isRequired,
  getPrerequisiteGroupListApi: PropTypes.func.isRequired,
  deletePRGroupApi: PropTypes.func.isRequired,
  // copyPRGroupApi: PropTypes.func.isRequired,
  groupListCount: PropTypes.number.isRequired,
  groupListIsLoading: PropTypes.bool.isRequired,
  checkIsEditableDeletableAPI: PropTypes.func.isRequired,
};

PreRequisiteGroupListing.defaultProps = {
  history: {
    push: () => {},
  },
};

const mapStateToProps = state => ({
  groupList: getPreRequisiteGroupList(state),
  groupListCount: getGroupListCount(state),
  groupListIsLoading: state.prerequisiteGroupList.isLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPrerequisiteGroupListApi: getPrerequisiteGroupListApiAction,
      deletePRGroupApi: deletePRGroupApiAction,
      checkIsEditableDeletableAPI: checkIsEditableDeletableAPIAction,
      // copyPRGroupApi: copyPRGroupApiAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreRequisiteGroupListing);
