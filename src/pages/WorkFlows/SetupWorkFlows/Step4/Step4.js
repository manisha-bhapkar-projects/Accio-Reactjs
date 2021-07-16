import React from 'react';
import PropTypes from 'prop-types';
import './Step4.scss';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import CardListTable from '../../../../components/CardListTable/CardListTable';
import plushIcon from '../../../../images/plus/plus.png';
import LabelWithIcon from '../../../../components/LabelWithIcon/LabelWithIcon';
import DropdownWithSearchBar from '../../../../components/Dropdown/DropdownComponentWithSearchBar';
import Delete from '../../../../images/delete/delete.png';

/** Error & Lables */
import labels from '../../../../utils/Locales/labels';
import messages from '../../../../utils/Locales/messages';

function Step4({
  selectPreRequisite,
  addPreRequisite,
  data,
  handleselectedDataStep4,
  handleaddedDataStep4,
  selectedData,
  addedData,
  addPreRequisiteGroup,
  isErrorAdd,
  isErrorSelect,
  DeletePreRequisites,
  topWizardComponent,
}) {
  // Data table Column
  const columns = [
    {
      grow: 6,
      name: labels.WORKFLOWS.STEP_4.COL_1,
      left: true,
      selector: 'PREREQUISITE',
      cell: row => {
        return (
          <>
            <span>
              {row.PREREQUISITE && row.PREREQUISITE.length
                ? row.PREREQUISITE.filter(
                    ({ languageCode }) => languageCode === 'en',
                  )[0].name
                : ''}
            </span>
          </>
        );
      },
    },
    {
      grow: 8,
      name: labels.WORKFLOWS.STEP_4.COL_2,
      selector: 'BEFOREPHASE',
    },
    {
      grow: 0.8,
      name: '',
      style: {
        padding: '0 30px 0px 0px !important',
      },
      right: true,
      cell: row => {
        return (
          <div
            className="delete-pre-requisite"
            onKeyDown={e => {
              DeletePreRequisites(e, row);
            }}
            onClick={e => {
              DeletePreRequisites(e, row);
            }}
            tabIndex="0"
            role="button"
          >
            <img alt="delete" className="delete-img" src={Delete} />
          </div>
        );
      },
    },
  ];

  return (
    <div id="step4" className="row mt-5">
      {topWizardComponent}

      <div className="col-12">
        <div className="background-tra" />
      </div>
      <div className="col-12 py-5 px-0">
        <CardHeader title={labels.WORKFLOWS.STEP_4.PRE_REQUISITE_ADDED} />
        <CardListTable
          columns={columns}
          data={data}
          noDataString={messages.WORKFLOWS.STEP_4.EMPTY_LIST}
        />
      </div>
      <div className="col-12">
        <div className="background-tra" />
      </div>
      <div className="col-12 py-5 px-0">
        <CardHeader title={labels.WORKFLOWS.STEP_4.ADD_PRE_REQUISITED} />
        <div className="row mx-0">
          <div className="col-3 ml-3">
            <DropdownWithSearchBar
              data={selectPreRequisite}
              label={labels.WORKFLOWS.STEP_4.DROPDOWN_1}
              error={isErrorSelect || ''}
              value={selectedData.value}
              onSelect={index =>
                handleselectedDataStep4(
                  selectPreRequisite.filter(x => {
                    return x.id === index;
                  })[0],
                )
              }
            />
          </div>
          <div className="col-3">
            <DropdownWithSearchBar
              data={addPreRequisite}
              label={labels.WORKFLOWS.STEP_4.DROPDOWN_2}
              value={addedData.value}
              error={isErrorAdd || ''}
              onSelect={index =>
                handleaddedDataStep4(
                  addPreRequisite.filter(x => {
                    return x.id === index;
                  })[0],
                )
              }
            />
          </div>
        </div>
      </div>
      <div className="col-12 text-right">
        <LabelWithIcon
          className="add-more-button float-right mr-4 mt-2"
          label={labels.WORKFLOWS.STEP_4.BUTTON}
          icon={plushIcon}
          handleClick={() => addPreRequisiteGroup()}
        />
      </div>
    </div>
  );
}

Step4.defaultProps = {
  selectedData: {
    value: '',
  },
  addedData: {
    value: '',
  },
  selectPreRequisite: {},
  addPreRequisite: {},
  data: [],
};

Step4.propTypes = {
  selectPreRequisite: PropTypes.instanceOf(Array),
  addPreRequisite: PropTypes.instanceOf(Array),
  data: PropTypes.instanceOf(Array),
  handleaddedDataStep4: PropTypes.func.isRequired,
  handleselectedDataStep4: PropTypes.func.isRequired,
  selectedData: PropTypes.instanceOf(Object),
  addedData: PropTypes.instanceOf(Object),
  addPreRequisiteGroup: PropTypes.func.isRequired,
  isErrorAdd: PropTypes.bool.isRequired,
  isErrorSelect: PropTypes.bool.isRequired,
  DeletePreRequisites: PropTypes.func.isRequired,
  topWizardComponent: PropTypes.node.isRequired,
};

export default Step4;
