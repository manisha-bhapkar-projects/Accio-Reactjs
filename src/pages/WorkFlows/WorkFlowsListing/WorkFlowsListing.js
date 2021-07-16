import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';

/** Data table */
import CardListTable from '../../../components/CardListTable/CardListTable'; // Without Input

/** CARD HEADER */
import CardHeader from '../../../components/CardHeader/CardHeader';

/** ACTION BUTTON IN DATATABLE ROW */
import ActionButton from '../../../components/ActionButton/ActionButton';

/** STYPE WORKFLOW */
import './WorkFlowsListing.scss';

/** Error & Lables */
import labels from '../../../utils/Locales/labels';
import messages from '../../../utils/Locales/messages';

/** REDUX */
import {
  getWorkFlowListApiAction,
  deleteWorkFlowApiAction,
  setWorkFlowList,
  getPreRequisiteStatusAction,
} from '../../../actions/workFlowsAction';

import {
  getWorkFlowList,
  getWorkFlowisLoading,
  getListTotalCountSelector,
  getWorkFlows,
} from '../selector';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import constants from '../../../utils/constants';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';

function WorkFlows({
  list,
  getWorkFlowListApi,
  getPreRequisiteStatus,
  workFlowIsLoading,
  deleteWorkFlowApi,
  getListTotalCount,
}) {
  const history = useHistory();
  const [searchtext, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [popUp, setPopUp] = useState(false);
  const [workflowStatus, setWorkFlowStatus] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  const debouncedSearch = useCallback(
    _.debounce(
      (searchInputs, cb) => cb(1, searchInputs),
      constants.SEARCH_DEBOUNCE_WAIT_TIME,
    ),
    [],
  );

  const sortData = list;
  useEffect(() => {
    // React Component Lifecycle => Mount
    getWorkFlowListApi(); // Workflow listing api caling
    getPreRequisiteStatus() // Get Status wheather user can Create new Workflow or not
      .then(res => {
        setWorkFlowStatus(res.data.data[0]);
      })
      .catch(() => {
        // console.log(error);
      });
    return () => {
      // React Component Lifecycle => UnMount
    };
  }, []);

  /** Array for Action Items in Table Row */
  const actionItems = [
    {
      id: 1,
      actionLink: '',
      label: labels.WORKFLOWS.LIST.ACTION_EDIT,
    },
    {
      id: 2,
      actionLink: '',
      label: labels.WORKFLOWS.LIST.ACTION_DELETE,
    },
    {
      id: 3,
      actionLink: '',
      label: labels.WORKFLOWS.LIST.ACTION_CREATE_COPY,
    },
  ];

  /** Click listner for Action button in Work Listing Table Row
   * @param{string} _eventKey ActionButton Dropdown index/Key
   * @param{object} _event ActionButton Dropdown item click event object
   * @param{object} rowData Worflows Listing Action clicked Row data
   */
  const onActionLister = (_eventKey, _event, rowData) => {
    /**
     * If Workflow is engagedToCase then User will not be able to Delete or Edit
     * Only user can Create a Copy of that workflow
     */
    if (rowData.engagedToCase) {
      if (_eventKey === '3') {
        // Create a Copy
        history.push(
          constants.ROUTE.WORKFLOWS.LIST +
            constants.ROUTE.WORKFLOWS.CREATE_SETUP_WORKFLOW,
          {
            createWorkflowId: rowData.propertyWorkflowId,
          },
        );
      }
      setAlertMsg(messages.WORKFLOWS.LIST.ENGAGED_CASE);
      setPopUp(true);
      return null;
    }

    if (_eventKey === '1') {
      // Edit a Workflow
      history.push(
        `${constants.ROUTE.WORKFLOWS.LIST}${constants.ROUTE.WORKFLOWS.EDIT_SETUP_WORKFLOW_FOR_ID}${rowData.propertyWorkflowId}`,
      );
    } else if (_eventKey === '2') {
      // Delete a Workflow => In Application from Backend there is Soft Delete
      deleteWorkFlowApi(rowData.propertyWorkflowId, page, searchtext)
        .then(_response => {
          if (_response.data.success) {
            getWorkFlowListApi(page, searchtext);
            setIsDeleteSuccess(true);
          } else {
            throw new Error('Api Failure');
          }
        })
        .catch(_error => {
          // console.log(_error)
        });
    } else if (_eventKey === '3') {
      // Create a Copy
      history.push(
        constants.ROUTE.WORKFLOWS.LIST +
          constants.ROUTE.WORKFLOWS.CREATE_SETUP_WORKFLOW,
        {
          createWorkflowId: rowData.propertyWorkflowId,
        },
      );
    }
    return null;
  };

  /** Columns For DataTable */
  const columns = [
    {
      name: labels.WORKFLOWS.LIST.COL_1,
      selector: 'workflow',
      sortable: true,
      grow: '2.5',
      cell: row => {
        return <div style={{ overflow: 'hidden' }}>{row.workflow}</div>;
      },
    },
    {
      name: labels.WORKFLOWS.LIST.COL_2,
      selector: 'fitout',
      sortable: true,
      left: true,
      grow: '2.5',
    },
    {
      name: labels.WORKFLOWS.LIST.COL_3,
      selector: 'updated_on',
      // sortable: true,
      left: true,
      grow: '2.5',
    },
    {
      name: labels.WORKFLOWS.LIST.COL_4,
      selector: 'update_by',
      // sortable: true,
      left: true,
      grow: '2',
    },
    {
      name: '',
      right: true,
      sortable: true,
      cell: rowData => {
        return (
          <div style={{ marginRight: '10px' }}>
            <ActionButton
              actionItems={actionItems}
              // .filter(_item => {
              // if (
              //   _item.label === labels.WORKFLOWS.LIST.ACTION_EDIT ||
              //   _item.label === labels.WORKFLOWS.LIST.ACTION_DELETE
              // ) {
              //   if (!rowData.engagedToCase) {
              //     return true;
              //   }
              //   return false;
              // }
              // return true;
              // })}
              rowData={rowData}
              onActionLister={(_eventKey, _event) =>
                onActionLister(_eventKey, _event, rowData)
              }
            />
          </div>
        );
      },
      grow: '.5',
    },
  ];

  /**
   * When user Search in table
   * @param {*} e
   */
  const onSearchListner = e => {
    setSearchText(e.target.value);
    debouncedSearch(e.target.value, getWorkFlowListApi);
    // getWorkFlowListApi(1, e.target.value);
  };

  /**
   * When user change Page of Table
   * @param {Number} _page Pagination Page number
   */
  const handlePageChange = _page => {
    window.scrollTo(0, 0);
    setPage(_page);
    getWorkFlowListApi(_page, searchtext);
  };

  /**
   * When User clicks on Create a Workflow
   */
  const handleClickCreateIcon = () => {
    if (workflowStatus) {
      history.push(
        constants.ROUTE.WORKFLOWS.LIST +
          constants.ROUTE.WORKFLOWS.CREATE_SETUP_WORKFLOW,
      );
    } else {
      setAlertMsg(messages.WORKFLOWS.LIST.PHASES_MORE_PREFILLED);
      setPopUp(true);
    }
  };

  /**
   * Custom Sorting in Data table
   * @param {Array} rows => Rows in Datatable
   * @param {String} field => Columnname which we have to Sort
   * @param {String} direction => Ascending or descending
   */
  const customSort = (rows, field, direction) => {
    const handleField = row => {
      if (row[field]) {
        return row[field].toLowerCase();
      }
      return row[field];
    };
    return _.orderBy(rows, handleField, direction);
  };

  return (
    <div className="card" id="workFlowListing">
      <CardHeader
        title={labels.WORKFLOWS.LIST.TITLE}
        searchbox
        lable
        searchText={searchtext}
        onSearchListner={onSearchListner}
        createLabelName={labels.WORKFLOWS.LIST.CREATE_NEW}
        handleClickCreateIcon={handleClickCreateIcon}
      />
      <CardListTable
        columns={columns}
        data={sortData}
        pending={workFlowIsLoading}
        custompagination
        pagination={false}
        total
        paginationServer
        noDataString={messages.WORKFLOWS.LIST.EMPTY_LIST}
        totalListCount={getListTotalCount}
        paginationTotalRows={getListTotalCount}
        handlePageChange={handlePageChange}
        sortFunction={customSort}
        onPageChangedCalled={handlePageChange}
      />
      <ErrorAlert
        alertMessage={alertMsg}
        primaryButtonText="OK"
        open={popUp}
        setClose={() => setPopUp(!popUp)}
        primaryButtonOnClick={() => setPopUp(!popUp)}
      />
      <SuccessAlert
        alertMessage={messages.WORKFLOWS.LIST.WORKFLOWS_DELETE}
        primaryButtonText="OK"
        open={isDeleteSuccess}
        setClose={() => setIsDeleteSuccess(!isDeleteSuccess)}
        primaryButtonOnClick={() => setIsDeleteSuccess(!isDeleteSuccess)}
      />
    </div>
  );
}

WorkFlows.defaultProps = {
  list: [],
};

WorkFlows.propTypes = {
  list: PropTypes.instanceOf(Array),
  getWorkFlowListApi: PropTypes.func.isRequired,
  getPreRequisiteStatus: PropTypes.func.isRequired,
  workFlowIsLoading: PropTypes.bool.isRequired,
  getListTotalCount: PropTypes.number.isRequired,
  deleteWorkFlowApi: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  list: getWorkFlowList(state),
  workFlowIsLoading: getWorkFlowisLoading(state),
  getListTotalCount: getListTotalCountSelector(state),
  workflowList: getWorkFlows(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getWorkFlowListApi: getWorkFlowListApiAction,
      getPreRequisiteStatus: getPreRequisiteStatusAction,
      deleteWorkFlowApi: deleteWorkFlowApiAction,
      changeList: setWorkFlowList,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(WorkFlows);
