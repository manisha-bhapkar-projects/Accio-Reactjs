import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './AddPreRequisiteToGroup.scss';
import Searchbar from '../../../components/Searchbar/Searchbar';
import CardHeader from '../../../components/CardHeader/CardHeader';
import deleteIcon from '../../../images/delete/delete.png';
import preRequisiteInfoPlus from '../../../images/prerequisiteAdd/add.png';
import minusIcon from '../../../images/minus/minus.png';
import Checkbox from '../../../components/Checkbox/Checkbox';
import CardListTable from '../../../components/CardListTable/CardListTable';
import { addPrerequisiteToGroup } from '../../../actions/prerequisiteGroupListing';
import { getAddedPrerequisite } from '../../../reducers/prerequisiteGroupListReducer';
import { getAllPreRequisiteList } from './selector';
import { getPrerequisiteListApiAction } from '../../../actions/prerequisiteListing';
import PrerequisiteDetails from '../PrerequsiteDetails/PrerequisiteDetails';
import prerequisiteMessages from '../../../utils/Locales/messages';
import labelText from '../../../utils/Locales/labels';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';

const AddPreRequisiteToGroup = ({
  addPrerequisiteAction,
  setOpen,
  addedPrerequisite,
  getPrerequisiteListApi,
  prerequisiteList,
  prerequisiteListIsLoading,
}) => {
  const [searchPrerequisite, setSearchPrerequisite] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [selectedPrerequiste, setSelectedPrerequiste] = React.useState(
    addedPrerequisite,
  );
  const [selectFrom, setSelectFrom] = React.useState([]);
  const [selectFromDuplicate, setSelectFromDuplicate] = React.useState([]);

  const columnsSelectorTable = [
    {
      name: 'Prerequisite',
      selector: 'prerequisite',
      sortable: false,
      grow: '11',
    },
    {
      name: '',
      sortable: false,
      cell: row => {
        return (
          <button
            type="button"
            className="delete-button"
            onClick={() => handleRowExpanded(row)}
          >
            {!row.isExpanded ? (
              <img
                src={preRequisiteInfoPlus}
                alt="info"
                style={{ marginRight: '15px' }}
              />
            ) : (
              <img src={minusIcon} alt="info" style={{ marginRight: '15px' }} />
            )}
          </button>
        );
      },
      grow: '1',
      right: true,
    },
  ];

  const columnsSelectedTable = [
    {
      name: labelText.PREREQUISITE_GROUP.ADD_PREREQUISITE_TO_GROUP.COL_SELECTED,
      selector: 'prerequisite',
      sortable: false,
      grow: '11',
    },
    {
      name: '',
      sortable: false,
      cell: row => {
        return (
          <button
            type="button"
            className="delete-button"
            onClick={() => handleDeletePrerequisite(row)}
          >
            <img
              src={deleteIcon}
              alt="del"
              style={{ height: '21px', width: '16px', marginRight: '15px' }}
            />
          </button>
        );
      },
      grow: '1',
      right: true,
    },
  ];

  useEffect(() => {
    getPrerequisiteListApi(null, null, '', true); // here 'true' is corresponding to the getting all the listings without pagination
    // addPrerequisiteAction([]);

    // console.log(prerequisiteList, 'dsds');
  }, []);
  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  useEffect(() => {
    const modifiedPrerequisteList = [...prerequisiteList];

    if (modifiedPrerequisteList.length > 0) {
      addedPrerequisite.forEach(addedPrereq => {
        if (modifiedPrerequisteList.some(item => item.id === addedPrereq.id)) {
          modifiedPrerequisteList.find(
            item => item.id === addedPrereq.id,
          ).isPrerequisiteSelected = true;
          modifiedPrerequisteList.find(
            item => item.id === addedPrereq.id,
          ).isDisabled = true;
        }
      });
    }

    setSelectFrom(modifiedPrerequisteList);
    setSelectFromDuplicate(modifiedPrerequisteList);

    // setSelectFrom(prerequisiteList);
    // setSelectFromDuplicate(prerequisiteList);
  }, [prerequisiteList]);

  // console.log(selectFrom, selectFromDuplicate, 'sdfd');
  const handlePrerequisiteSelection = state => {
    // // console.log(state);
    const tempSelectFrom = [...selectFrom];
    const selectedArr = state.selectedRows;

    tempSelectFrom.map(elements => {
      const modifiedElement = elements;
      if (selectedArr.find(item => item.id === modifiedElement.id)) {
        modifiedElement.isPrerequisiteSelected = true;
      } else {
        modifiedElement.isPrerequisiteSelected = false;
      }
      return modifiedElement;
    });
    setSelectFrom(tempSelectFrom);

    setSelectedRows(state.selectedRows);
  };

  const transferSelected = () => {
    // console.log('abc');
    let newSelected = [...selectedPrerequiste]; // , ...selectedRows];
    if (newSelected.length > 0) {
      selectedRows.forEach(row => {
        if (!newSelected.find(item => item.id === row.id)) {
          newSelected.push(row);
        }
      });
    } else {
      newSelected = [...selectedRows];
    }
    setSelectedPrerequiste(newSelected);
    // disabling checkbox on seleting the prerequiste from the upper section in UI
    const tempSelectFrom = [...selectFrom];
    selectedRows.forEach(row => {
      tempSelectFrom.find(item => item.id === row.id).isDisabled = true;
    });
    setSelectFrom(tempSelectFrom);
  };

  const handleRowExpanded = row => {
    // const currentExpandSate=row.isExpanded;

    const modifiedSelectFrom = [...selectFrom];

    const currentExpandState = modifiedSelectFrom.find(
      item => item.id === row.id,
    ).isExpanded;

    modifiedSelectFrom.find(
      item => item.id === row.id,
    ).isExpanded = !currentExpandState;
    setSelectFrom(modifiedSelectFrom);
    // transferSelected();
  };

  const handleDeletePrerequisite = row => {
    const modifiedSelectFrom = [...selectFrom];
    const unselectPrereq = modifiedSelectFrom.find(item => item.id === row.id);
    unselectPrereq.isPrerequisiteSelected = false;
    unselectPrereq.isDisabled = false;
    setSelectFrom(modifiedSelectFrom);

    const tempArr = [...selectedPrerequiste];
    const prerequisiteRemoveIndex = tempArr.findIndex(
      item => item.id === row.id,
    );
    tempArr.splice(prerequisiteRemoveIndex, 1);
    setSelectedPrerequiste(tempArr);
  };

  const handleRowSelectionDeSelection = row => {
    return row.isPrerequisiteSelected;
  };

  const handleAddPrerequisite = () => {
    // console.log(selectedPrerequiste);

    // this logic is to verify that if the fron the selection tab of prerequisite some prerequiste is checked and not add in below section by click of SELECT btn
    if (
      selectFromDuplicate.find(
        item =>
          item.isPrerequisiteSelected === true && item.isDisabled === false,
      )
    ) {
      setIsErrorMessage('true');
      setErrorMessage(
        prerequisiteMessages.PREREQUISITE_GROUP_LIST
          .INFO_CHECKED_PREREQUISITE_NOT_SELECTED,
      );
      return;
    }
    // if (selectedRows.length !== selectedPrerequiste.length) {
    //   setIsErrorMessage('true');
    //   setErrorMessage(
    //     prerequisiteMessages.PREREQUISITE_GROUP_LIST
    //       .INFO_CHECKED_PREREQUISITE_NOT_SELECTED,
    //   );
    //   return;
    // }
    addPrerequisiteAction(selectedPrerequiste);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onSearchListener = e => {
    // api call for search here
    // check this implementation
    setSelectFrom(
      selectFromDuplicate.filter(item =>
        item.prerequisite.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
    // getPrerequisiteListApi(null, null, e.target.value, 'all');
    setSearchPrerequisite(e.target.value);
  };

  return (
    <div className="add-prerequisite-to-group">
      <CardHeader
        title={labelText.PREREQUISITE_GROUP.ADD_PREREQUISITE_TO_GROUP.TITLE}
      />
      <div className="search-box">
        <Searchbar
          searchText={searchPrerequisite}
          onSearchListner={onSearchListener}
        />
      </div>
      <div className="add-from-prerequisite-table">
        <CardListTable
          data={selectFrom}
          columns={columnsSelectorTable}
          noTableHead
          selectableRows
          noDataString={
            prerequisiteMessages.PREREQUISITE_LIST.PREREQUISITE_LIST_NO_DATA
          }
          onSelectedRowsChange={handlePrerequisiteSelection}
          selectableRowsComponent={Checkbox}
          selectableRowSelected={handleRowSelectionDeSelection}
          selectableRowDisabled={row => row.isDisabled}
          fixedHeader
          fixedHeaderScrollHeight="249px"
          expandableRows
          expandableRowExpanded={row => row.isExpanded}
          expandableRowsComponent={<PrerequisiteDetails />}
          pending={prerequisiteListIsLoading}
          numOfColumns={columnsSelectorTable.length - 1}
        />
      </div>

      <div className="select-button">
        <button
          type="button"
          className="btn btn-secondary btn-select"
          onClick={transferSelected}
        >
          {labelText.PREREQUISITE_GROUP.ADD_PREREQUISITE_TO_GROUP.BUTTON_SELECT}
        </button>
      </div>

      <div className="added-prerequisite-table">
        <CardListTable
          data={selectedPrerequiste}
          columns={columnsSelectedTable}
          persistTableHead
          noDataString={
            prerequisiteMessages.PREREQUISITE_GROUP_LIST
              .PREREQUISITE_GROUP_NO_SELECTED_PREREQUISITE
          }
          fixedHeader
          fixedHeaderScrollHeight="249px"
          numOfColumns={columnsSelectedTable.length - 1}
        />
      </div>
      <div className="submit-buttom-section">
        <button
          type="button"
          className="btn btn-secondary btn-cancel"
          onClick={handleCancel}
        >
          {labelText.GLOBAL.BUTTON_CANCEL}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-submit"
          onClick={handleAddPrerequisite}
        >
          {labelText.GLOBAL.BUTTON_SUBMIT}
        </button>
      </div>
      <InformationAlert
        alertMessage={errorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />
    </div>
  );
};

AddPreRequisiteToGroup.propTypes = {
  addPrerequisiteAction: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  addedPrerequisite: PropTypes.instanceOf(Array),
  prerequisiteList: PropTypes.instanceOf(Array).isRequired,
  getPrerequisiteListApi: PropTypes.func.isRequired,
  prerequisiteListIsLoading: PropTypes.bool.isRequired,
};

AddPreRequisiteToGroup.defaultProps = {
  addedPrerequisite: [],
};

const mapStateToProps = state => ({
  addedPrerequisite: getAddedPrerequisite(state),
  prerequisiteList: getAllPreRequisiteList(state),
  prerequisiteListIsLoading: state.prerequisiteList.isLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addPrerequisiteAction: addPrerequisiteToGroup,
      getPrerequisiteListApi: getPrerequisiteListApiAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPreRequisiteToGroup);
