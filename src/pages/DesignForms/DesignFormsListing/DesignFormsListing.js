import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import CardListTable from '../../../components/CardListTable/CardListTable'; // Without Input
import CardHeader from '../../../components/CardHeader/CardHeader';
import ActionButton from '../../../components/ActionButton/ActionButton';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
import './DesignFormsListing.scss';
/** REDUX */
import {
  setFormsList,
  getFormsApiAction,
  deleteDesignFormApiAction,
  checkDesignFormEditableApiAction,
  checkItemActionable,
} from '../../../actions/designFormsActions';
import { getDesignFormsList, getFormsTotalCount } from '../selector';
/** Error & Lables */
import labels from '../../../utils/Locales/labels';
import { getErrorMessage, scrollToTop, customSort } from '../../../utils/utils';
import messages from '../../../utils/Locales/messages';
import constants from '../../../utils/constants';

function DesignFormsListing({ list, setFormsListApiCall, totalFormsCount }) {
  const history = useHistory();
  const [searchtext, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [isLoadingForGet, setIsLoadingForGet] = useState(false);
  // error
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // success
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const debouncedSearch = useCallback(
    _.debounce(
      (searchInputs, cb) =>
        cb(page, searchInputs)
          .then(_response => {
            handleResponse(_response);
          })
          .catch(_error => {
            handleError(_error);
          }),
      constants.SEARCH_DEBOUNCE_WAIT_TIME,
    ),
    [],
  );

  // handle responce of get form list
  const handleResponse = response => {
    if (response.data.success) {
      if (response.data.data.length && response.data.data[0].formDeisgn) {
        const { totalCount } = response.data.data[0];
        setFormsListApiCall(response.data.data[0].formDeisgn, totalCount);
      }
    }
    setIsLoadingForGet(false);
  };

  // handleError of get form list api
  const handleError = error => {
    setIsLoadingForGet(false);
    setErrorMessage(`${getErrorMessage(error)}`);
    setIsErrorMessage(true);
  };

  // getFormList : get form list
  const getFormList = (_page, _searchtext) => {
    getFormsApiAction(_page, _searchtext)
      .then(_response => {
        handleResponse(_response);
      })
      .catch(_error => {
        handleError(_error);
      });
  };

  useEffect(() => {
    scrollToTop();
    setIsLoadingForGet(true);
    getFormList();
  }, []);

  // actionItems: edit , delete and create a copy
  const actionItems = [
    {
      id: 1,
      actionLink: '',
      label: labels.GLOBAL.ACTION_EDIT,
    },
    {
      id: 2,
      actionLink: '',
      label: labels.GLOBAL.ACTION_DELETE,
    },
    {
      id: 3,
      actionLink: '',
      label: labels.GLOBAL.ACTION_CREATE_COPY,
    },
  ];

  /** Click listner for Action button in Table Row
   * @param{string} _eventKey ActionButton Dropdown index/Key
   * @param{object} _event ActionButton Dropdown item click event object
   * @param{object} rowData Listing Action clicked Row data
   */

  const onActionLister = (_eventKey, _event, rowData) => {
    if (_eventKey === '1') {
      // edit
      checkDesignFormEditableApiAction(rowData.uuid)
        .then(_response => {
          if (_response.data.success) {
            history.push(
              `${constants.ROUTE.DESIGN_FORMS.CREATE_DESIGN}${rowData.uuid}`,
              {
                action: 'edit',
              },
            );
          }
        })
        .catch(_error => {
          handleError(_error);
        });
    } else if (_eventKey === '2') {
      setIsLoadingForGet(true);

      checkItemActionable('form-design', rowData.uuid, 'delete')
        .then(_response => {
          if (_response.data.success) {
            return deleteDesignFormApiAction(rowData.uuid);
          }
          throw new Error(_response.data.message);
        })
        .then(_response => {
          if (_response.data.success) {
            setSuccessMessage(
              messages.DESIGN_FORMS.DESIGN_FORMS_LISTING.FORM_DELETED_MESSAGE,
            );
            setIsSuccessMessage(true);
            getFormList(page, searchtext);
          }
        })
        .catch(_error => {
          handleError(_error);
        });
    } else if (_eventKey === '3') {
      // Create a copy
      history.push(
        `${constants.ROUTE.DESIGN_FORMS.CREATE_DESIGN}${rowData.uuid}`,
        {
          action: 'copy',
        },
      );
    }
  };

  const columns = [
    {
      name: labels.DESIGN_FORMS.DESIGN_FORMS_LISTING.COL_1,
      selector: 'form',
      sortable: true,
      grow: '2',
      cell: row => {
        return <div style={{ overflow: 'hidden' }}>{row.form}</div>;
      },
    },
    {
      name: labels.DESIGN_FORMS.DESIGN_FORMS_LISTING.COL_2,
      selector: 'fitout',
      sortable: true,
      grow: '2',
    },
    {
      name: labels.DESIGN_FORMS.DESIGN_FORMS_LISTING.COL_3,
      selector: 'sub_phase',
      sortable: true,
      grow: '2',
    },
    {
      name: labels.DESIGN_FORMS.DESIGN_FORMS_LISTING.COL_4,
      selector: 'modified_on',
      sortable: true,
      grow: '2',
    },
    {
      name: labels.DESIGN_FORMS.DESIGN_FORMS_LISTING.COL_5,
      selector: 'modified_by',
      sortable: false,
      grow: '2',
    },
    {
      name: '',
      right: true,
      sortable: true,
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
      grow: '0.5',
    },
  ];

  /**
   * When user Search in table
   * @param {*} e
   */

  const onSearchListner = e => {
    setSearchText(e.target.value);
    setIsLoadingForGet(true);

    debouncedSearch(e.target.value, getFormsApiAction);

    // getFormsApiAction(page, e.target.value)
    //   .then(_response => {
    //     handleResponse(_response);
    //   })
    //   .catch(_error => {
    //     handleError(_error);
    //   });
  };

  /**
   * When user change Page of Table
   * @param {Number} _page Pagination Page number
   */

  const handlePageChange = _page => {
    setPage(_page);
    setIsLoadingForGet(true);
    getFormsApiAction(_page, searchtext)
      .then(_response => {
        handleResponse(_response);
      })
      .catch(_error => {
        handleError(_error);
      });
  };

  // handleClickCreateIcon : go to creat a new form
  const handleClickCreateIcon = () => {
    history.push(constants.ROUTE.DESIGN_FORMS.CREATE_DESIGN);
  };

  return (
    <div className="card" id="designFormsListing">
      <CardHeader
        title={labels.DESIGN_FORMS.DESIGN_FORMS_LISTING.TITLE}
        searchbox
        lable
        searchText={searchtext}
        onSearchListner={onSearchListner}
        createLabelName="Create a new form"
        handleClickCreateIcon={handleClickCreateIcon}
      />
      <CardListTable
        columns={columns}
        data={list}
        pending={isLoadingForGet}
        pagination={false}
        total
        totalListCount={totalFormsCount}
        paginationTotalRows={totalFormsCount}
        paginationServer
        handlePageChange={handlePageChange}
        custompagination
        sortFunction={customSort}
        onPageChangedCalled={_page => getFormList(_page, searchtext)}
        noDataString={
          searchtext
            ? `${messages.GLOBAL.ERR_NO_SEARCH_RECORD} ${searchtext}`
            : messages.DESIGN_FORMS.DESIGN_FORMS_LISTING.EMPTY_LIST
        }
      />
      {/* error message */}
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText={labels.GLOBAL.OK}
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />
      {/* success message */}
      <SuccessAlert
        alertMessage={successMessage}
        primaryButtonText={labels.GLOBAL.OK}
        open={isSuccessMessage}
        setClose={() => setIsSuccessMessage(false)}
        primaryButtonOnClick={() => setIsSuccessMessage(false)}
      />
    </div>
  );
}

DesignFormsListing.defaultProps = {
  list: [],
};

DesignFormsListing.propTypes = {
  list: PropTypes.instanceOf(Array),
  setFormsListApiCall: PropTypes.func.isRequired,
  totalFormsCount: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  list: getDesignFormsList(state),
  totalFormsCount: getFormsTotalCount(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setFormsListApiCall: setFormsList,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DesignFormsListing);
