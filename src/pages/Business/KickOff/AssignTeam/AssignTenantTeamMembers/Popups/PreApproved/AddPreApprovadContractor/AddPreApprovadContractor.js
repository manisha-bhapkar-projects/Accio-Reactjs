import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useTranslation } from 'react-i18next';
import './AddPreApprovadContractor.scss';
import Searchbar from '../../../../../../../../components/Searchbar/Searchbar';
import CardHeader from '../../../../../../../../components/CardHeader/CardHeader';
import deleteIcon from '../../../../../../../../images/delete/delete.png';
// import preRequisiteInfoPlus from '../../../../../../../../images/prerequisiteAdd/add.png';
// import minusIcon from '../../../../../../../../images/minus/minus.png';
import Checkbox from '../../../../../../../../components/Checkbox/Checkbox';
import CardListTable from '../../../../../../../../components/CardListTable/CardListTable';
import { getAddedPrerequisite } from '../../../../../../../../reducers/prerequisiteGroupListReducer';
import { getAllPreRequisiteList } from './selector';
import { getPrerequisiteListApiAction } from '../../../../../../../../actions/prerequisiteListing';
// import PrerequisiteDetails from '../PrerequsiteDetails/PrerequisiteDetails';
import InformationAlert from '../../../../../../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
// import { getPreApprovedContractors } from '../../../../../../../../actions/Business/assignTeam';

const dummyContracors = [
  {
    id: 1,
    contractor: 'Al Saffar Interiors',
    name: 'Luna Lovegood',
    contact: '04 111 1100 / 052 567 8754',
    email: 'llovegood@gmail.com',
    isPreApprovedContractorSelected: true,
  },
  {
    id: 2,
    contractor: 'Al Tayer Stocks',
    name: 'Barty Crouch',
    contact: '04 111 1100 / 052 567 8754',
    email: 'bcrouch@gmail.com',
    isPreApprovedContractorSelected: false,
  },
  {
    id: 3,
    contractor: 'Al Tayer Stocks',
    name: 'Remo Crouch',
    contact: '04 111 1100 / 052 567 8754',
    email: 'rcrouch@gmail.com',
    isPreApprovedContractorSelected: false,
  },
];
const AddPreApprovadContractor = ({ setOpen }) => {
  const { t } = useTranslation();
  const [
    searchPreApprovedContractor,
    setSearchPreApprovedContractor,
  ] = React.useState('');

  const [isContractorListLoading, setIsContractorListLoading] = React.useState(
    false,
  );

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [
    selectedPreApprovedContractors,
    setSelectedPreApprovedContractors,
  ] = React.useState(dummyContracors);
  // ] = React.useState(addedPreApprovedContractors);

  const [selectFrom, setSelectFrom] = React.useState([]);
  const [selectFromDuplicate, setSelectFromDuplicate] = React.useState([]);

  const columnsSelectorTable = [
    {
      name: t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.CONTRACTOR',
      ),
      selector: 'contractor',
      sortable: false,
      grow: '2',
    },
    {
      name: t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.NAME',
      ),
      selector: 'name',
      sortable: false,
      grow: '2',
    },
    {
      name: t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.CONTACT',
      ),
      selector: 'contact',
      sortable: false,
      grow: '2',
    },
    {
      name: t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.EMAIL',
      ),
      selector: 'email',
      sortable: false,
      grow: '2',
    },
  ];

  const columnsSelectedTable = [
    {
      name: t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.SELECTED',
      ),
      selector: 'contractor',
      sortable: false,
      grow: '2',
    },
    {
      name: '',
      selector: 'name',
      sortable: false,
      grow: '2',
    },
    {
      name: '',
      selector: 'contact',
      sortable: false,
      grow: '2',
    },
    {
      name: '',
      selector: 'email',
      sortable: false,
      grow: '2',
    },
    {
      name: '',
      sortable: false,
      cell: row => {
        return (
          <button
            type="button"
            className="delete-button"
            onClick={() => handleDeletePreApprovedContractor(row)}
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
      width: '50px',
    },
  ];

  useEffect(() => {
    // remove this after api added
    setSelectFromDuplicate([]);
    setIsContractorListLoading(false);
    //  // here 'true' is corresponding to the getting all the listings without pagination
    // getPreApprovedContractors(null, null, '', true)
    // .then(res=>{
    // })
    // .catch(err=>{
    //   // error handling
    // })

    setSelectFrom(dummyContracors);

    // console.log(prerequisiteList, 'dsds');
  }, []);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  // useEffect(() => {
  //   const modifiedPrerequisteList = [...prerequisiteList];

  //   if (modifiedPrerequisteList.length > 0) {
  //     addedPreApprovedContractors.forEach(addedPrereq => {
  //       modifiedPrerequisteList.find(
  //         item => item.id === addedPrereq.id,
  //       ).isPreApprovedContractorSelected = true;
  //       modifiedPrerequisteList.find(
  //         item => item.id === addedPrereq.id,
  //       ).isDisabled = true;
  //     });
  //   }

  //   setSelectFrom(modifiedPrerequisteList);
  //   setSelectFromDuplicate(modifiedPrerequisteList);

  //   // setSelectFrom(prerequisiteList);
  //   // setSelectFromDuplicate(prerequisiteList);
  // }, [prerequisiteList]);

  // console.log(selectFrom, selectFromDuplicate, 'sdfd');
  const handleContractorSelection = state => {
    const tempSelectFrom = [...selectFrom];
    const selectedArr = state.selectedRows;

    tempSelectFrom.map(elements => {
      const modifiedElement = elements;
      if (selectedArr.find(item => item.id === modifiedElement.id)) {
        modifiedElement.isPreApprovedContractorSelected = true;
      } else {
        modifiedElement.isPreApprovedContractorSelected = false;
      }
      return modifiedElement;
    });
    setSelectFrom(tempSelectFrom);
    setSelectedRows(state.selectedRows);
  };

  const transferSelected = () => {
    // console.log('abc');
    let newSelected = [...selectedPreApprovedContractors]; // , ...selectedRows];
    if (newSelected.length > 0) {
      selectedRows.forEach(row => {
        if (!newSelected.find(item => item.id === row.id)) {
          newSelected.push(row);
        }
      });
    } else {
      newSelected = [...selectedRows];
    }
    setSelectedPreApprovedContractors(newSelected);
    // disabling checkbox on seleting the prerequiste from the upper section in UI
    const tempSelectFrom = [...selectFrom];
    selectedRows.forEach(row => {
      tempSelectFrom.find(item => item.id === row.id).isDisabled = true;
    });
    setSelectFrom(tempSelectFrom);
  };

  const handleDeletePreApprovedContractor = row => {
    const modifiedSelectFrom = [...selectFrom];
    const unselectPrereq = modifiedSelectFrom.find(item => item.id === row.id);
    unselectPrereq.isPreApprovedContractorSelected = false;
    unselectPrereq.isDisabled = false;
    setSelectFrom(modifiedSelectFrom);

    const tempArr = [...selectedPreApprovedContractors];
    const prerequisiteRemoveIndex = tempArr.findIndex(
      item => item.id === row.id,
    );
    tempArr.splice(prerequisiteRemoveIndex, 1);
    setSelectedPreApprovedContractors(tempArr);
  };

  // const handleRowSelectionDeSelection = row => {
  //   return row.isPreApprovedContractorSelected;
  // };

  const handleAddPreApprovedContractor = () => {
    if (
      selectFromDuplicate.find(
        item =>
          item.isPreApprovedContractorSelected === true &&
          item.isDisabled === false,
      )
    ) {
      setIsErrorMessage('true');
      // setErrorMessage(
      //   messages.PREREQUISITE_GROUP_LIST.INFO_CHECKED_PREREQUISTED_NOT_SELECTED,
      // );
      return;
    }
    // addPrerequisiteAction(selectedPreApprovedContractors); // call api to add pre approved contracors
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
    setSearchPreApprovedContractor(e.target.value);
  };

  return (
    <div className="add-pre-approvad-contractor">
      <CardHeader
        title={t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.TITLE',
        )}
      />
      <div className="search-box">
        <Searchbar
          searchText={searchPreApprovedContractor}
          onSearchListner={onSearchListener}
        />
      </div>
      <div className="add-from-pre-approvad-contractor-table">
        <CardListTable
          data={selectFrom}
          columns={columnsSelectorTable}
          selectableRows
          noDataString={t(
            'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.ERROR_MSG.PRE_APPROVED_CONTRACTOR_LIST_NO_DATA',
          )}
          onSelectedRowsChange={handleContractorSelection}
          selectableRowsComponent={Checkbox}
          selectableRowSelected={row => row.isPreApprovedContractorSelected}
          selectableRowDisabled={row => row.isDisabled}
          fixedHeader
          fixedHeaderScrollHeight="249px"
          pending={isContractorListLoading}
          numOfColumns={columnsSelectorTable.length - 1}
        />
      </div>

      <div className="select-button">
        <button
          type="button"
          className="btn btn-secondary btn-select"
          onClick={transferSelected}
        >
          {t('GLOBAL.BUTTON_SELECT')}
        </button>
      </div>
      <div className="added-pre-approved-contractor-table">
        <CardListTable
          data={selectedPreApprovedContractors}
          columns={columnsSelectedTable}
          persistTableHead
          noDataString={t(
            'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.ERROR_MSG.PLEASE_SELECT_PRE_APPROVED_CONTRACTOR',
          )}
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
          {t('GLOBAL.BUTTON_CANCEL')}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-new-contractor "
          onClick={handleCancel}
        >
          {t(
            'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.ADD_NEW_CONTRACTOR',
          )}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-submit"
          onClick={handleAddPreApprovedContractor}
        >
          {t(
            'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_PRE_APPROVED_CONTRACTOR.ADD_PRE_APPROVED_CONTRACTOR',
          )}
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

AddPreApprovadContractor.propTypes = {
  setOpen: PropTypes.func.isRequired,
  // addedPreApprovedContractors: PropTypes.instanceOf(Array),
  // prerequisiteList: PropTypes.instanceOf(Array).isRequired,
  // getPrerequisiteListApi: PropTypes.func.isRequired,
  // prerequisiteListIsLoading: PropTypes.bool.isRequired,
};

AddPreApprovadContractor.defaultProps = {
  // addedPreApprovedContractors: [],
};

const mapStateToProps = state => ({
  addedPreApprovedContractors: getAddedPrerequisite(state),
  prerequisiteList: getAllPreRequisiteList(state),
  // prerequisiteListIsLoading: state.prerequisiteList.isLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPrerequisiteListApi: getPrerequisiteListApiAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPreApprovadContractor);
