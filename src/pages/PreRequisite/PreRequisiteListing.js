import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './PreRequisiteListing.scss';
import { Card } from 'react-bootstrap';
import _ from 'lodash';
import CardHeader from '../../components/CardHeader/CardHeader';
import ErrorAlert from '../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import ActionButton from '../../components/ActionButton/ActionButton';
import CardListTable from '../../components/CardListTable/CardListTable';

import {
  handleApiError,
  getRouteWithoutParam,
  scrollToTop,
  customSort,
} from '../../utils/utils';

import prerequisiteMessages from '../../utils/Locales/messages';
import labelText from '../../utils/Locales/labels';
import routePath from '../../utils/constants';

// Redux
import {
  getPreRequisiteList,
  getPrerequisiteTotalCount,
} from '../../reducers/prerequisiteListReducer';
import {
  getPrerequisiteListApiAction,
  deletePRApiAction,
  // copyPRApiAction,
} from '../../actions/prerequisiteListing';

import { checkIsEditableDeletableAPIAction } from '../../actions/commonActions';

function PreRequisiteListing({
  history,
  prerequisiteListData,
  getPrerequisiteListApi,
  deletePRApi,
  // copyPRApi,
  totalPrerequisite,
  prerequisiteListIsLoading,
  checkIsEditableDeletableAPI,
}) {
  const path = getRouteWithoutParam(
    routePath.ROUTE.PHASES_AND_MORE.CREATE_ADD_UPDATE_PRE_REQUISITE,
  );
  const [searchtext, setSearchtext] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isDeleteSuccess, setIsDeleteSuccess] = React.useState(false);
  const [listNoDataString, setListNoDataString] = React.useState(
    prerequisiteMessages.PREREQUISITE_LIST.PREREQUISITE_LIST_NO_DATA,
  );
  const debouncedSearch = useCallback(
    _.debounce(
      (searchInputs, cb) => cb(currentPage, null, searchInputs),
      routePath.SEARCH_DEBOUNCE_WAIT_TIME,
    ),
    [],
  );

  useEffect(() => {
    scrollToTop();
    getPrerequisiteListApi();
  }, []);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  const handleCreatePrerequisite = e => {
    e.preventDefault();

    // history.push(
    //   '/phases-and-more/add-update-pre-requisites/add-update-prerequisite',
    // );

    history.push(path);
  };

  const columns = [
    {
      name: labelText.PREREQUISITE.LIST.COL_1_PREREQUISITE,
      selector: 'prerequisite',
      sortable: true,
      grow: '6',
    },
    {
      name: labelText.PREREQUISITE.LIST.COL_2_UPDATED_ON,
      selector: 'updatedOn',
      sortable: true,
      grow: '2.5',
    },
    {
      name: labelText.PREREQUISITE.LIST.COL_3_UPDATED_BY,
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

  const actionItems = [
    {
      id: 1,
      actionLink: '',
      label: labelText.PREREQUISITE.LIST.ACTION_EDIT,
    },
    {
      id: 2,
      actionLink: '',
      label: labelText.PREREQUISITE.LIST.ACTION_DELETE,
    },
    {
      id: 3,
      actionLink: '',
      label: labelText.PREREQUISITE.LIST.ACTION_CREATE_COPY,
    },
  ];

  /** Click listner for Action button in Work Listing Table Row
   * @param{string} _eventKey ActionButton Dropdown index/Key
   * @param{object} _event ActionButton Dropdown item click event object
   * @param{object} rowData Worflows Listing Action clicked Row data
   */
  const editPreRequisite = rowData => {
    const module = 'pre-requisities';
    const operation = 'edit';
    const refId = rowData.id;
    checkIsEditableDeletableAPI(module, operation, refId).then(res => {
      if (res.data.success) {
        history.push(`${path}/${rowData.id}`, { action: 'edit' });
      } else {
        setErrorMessage(
          prerequisiteMessages.PREREQUISITE_LIST.PREREQUISTE_WITH_CASE,
        );
        setIsErrorMessage(true);
      }
    });
  };

  const copyPreRequisite = rowData => {
    history.push(`${path}/${rowData.id}`, { action: 'copy' });
  };

  const onActionLister = (_eventKey, _event, rowData) => {
    if (_eventKey === '1') {
      editPreRequisite(rowData);
    }
    // delete event
    if (_eventKey === '2') {
      if (rowData.isPrerequisiteInPRGroup) {
        setIsErrorMessage(true);
        // const groutList = rowData.prerequisiteInGroupArr.join(', ');
        setErrorMessage(
          `${prerequisiteMessages.PREREQUISITE_LIST.PREREQUISITE_IN_GROUP_ERROR}`,
        );
      } else {
        deletePRApi(rowData.id)
          .then(res => {
            if (res.data.success) {
              setIsDeleteSuccess(true);
              // getPrerequisiteListApi(currentPage, 10, searchtext);
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
      }
    }

    if (_eventKey === '3') {
      if (rowData.id) {
        copyPreRequisite(rowData);
      }
    }
  };

  const handleDeleteSuccessAlert = () => {
    getPrerequisiteListApi(currentPage, 10, searchtext);
    setIsDeleteSuccess(false);
  };

  const onSearchListner = e => {
    const searchInputs = e.target.value;
    setSearchtext(searchInputs);
    if (searchInputs) {
      setListNoDataString(
        `${prerequisiteMessages.GLOBAL.ERR_NO_SEARCH_RECORD} "${searchInputs}"`,
      );
    } else {
      setListNoDataString(
        prerequisiteMessages.PREREQUISITE_LIST.PREREQUISITE_LIST_NO_DATA,
      );
    }
    debouncedSearch(searchInputs, getPrerequisiteListApi);
    // getPrerequisiteListApi(currentPage, null, searchInputs);
  };

  const onPageChange = page => {
    setCurrentPage(page);
    getPrerequisiteListApi(page, 10, searchtext);
  };

  return (
    <div className="prerequisite-lising">
      <Card className="listing-card">
        <CardHeader
          title={labelText.PREREQUISITE.LIST.TITLE}
          searchbox
          lable
          createLabelName={labelText.PREREQUISITE.LIST.CREATE_NEW}
          handleClickCreateIcon={handleCreatePrerequisite}
          searchText={searchtext}
          onSearchListner={onSearchListner}
        />

        <CardListTable
          data={prerequisiteListData}
          columns={columns}
          pagination={false}
          custompagination
          sortFunction={customSort}
          onPageChangedCalled={_page =>
            getPrerequisiteListApi(_page, 10, searchtext)
          }
          paginationServer
          noDataString={listNoDataString}
          total
          pending={prerequisiteListIsLoading}
          totalListCount={totalPrerequisite}
          handlePageChange={onPageChange}
          numOfColumns={columns.length - 1}
          // defaultSortField="prerequisite"
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
          prerequisiteMessages.PREREQUISITE_LIST.PREREQUISITE_DELETE_SUCCESSFULL
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

PreRequisiteListing.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  prerequisiteListData: PropTypes.instanceOf(Object).isRequired,
  getPrerequisiteListApi: PropTypes.func.isRequired,
  // copyPRApi: PropTypes.func.isRequired,
  deletePRApi: PropTypes.func.isRequired,
  totalPrerequisite: PropTypes.number.isRequired,
  prerequisiteListIsLoading: PropTypes.bool.isRequired,
  checkIsEditableDeletableAPI: PropTypes.func.isRequired,
};

PreRequisiteListing.defaultProps = {
  history: {
    push: () => {},
  },
};

const mapStateToProps = state => ({
  prerequisiteListData: getPreRequisiteList(state),
  totalPrerequisite: getPrerequisiteTotalCount(state),
  prerequisiteListIsLoading: state.prerequisiteList.isLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPrerequisiteListApi: getPrerequisiteListApiAction,
      deletePRApi: deletePRApiAction,
      checkIsEditableDeletableAPI: checkIsEditableDeletableAPIAction,
      // copyPRApi: copyPRApiAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreRequisiteListing);
