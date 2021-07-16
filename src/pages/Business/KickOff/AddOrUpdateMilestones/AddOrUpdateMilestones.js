import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  getPhaselisingTableAPIAction,
  getWorkflowListAPIAction,
  setWorkflowTable,
} from '../../../../actions/Business/addUpdateMilestonesAction';
import DropdownComponentWithSearchBar from '../../../../components/Dropdown/DropdownComponentWithSearchBar';
import './AddOrUpdateMilestones.scss';
import CardHeader from '../../../../components/CardHeader/CardHeader';

import Accordion from './Accordion/Accordion';
import Header from './Header/Header';
import CardListTable from '../../../../components/CardListTable/CardListTable';
import TextAreaComponent from '../../../../components/TextAreaComponent/TextAreaComponent';
import CustomDatePicker from '../../../../components/CustomDatePicker';
// import {
//   // data,
//   demoDataTables,
// } from '../../../../utils/DemoData/addOrUpdateMilestonesData';

import {
  // getAddUpdateMileStone,
  getWorkflowListSelector,
  getWorkflowListTableSelector,
} from '../selector';

function AddOrUpdateMilestones({
  callPhaseDataTableApi,
  getWorkflowListApi,
  // mileStoneData,
  workFlowSelection,
  workFlowTableList,
  changeWorkflow,
}) {
  const [selectWorkflow, setSelectWorkflow] = useState('');

  const [demoColumns, setDemoColumns] = useState([]);

  const [demoDataTable, setDemoDataTable] = useState(false);
  useEffect(() => {
    getWorkflowListApi();
    callPhaseDataTableApi();
    setDemoDataTable(true);
  }, []);
  useEffect(() => {
    if (workFlowTableList.length > 0) {
      const subPhasesColumns = [];

      workFlowTableList.forEach(phase => {
        // const checkOneSort = [];
        if (phase.actions && phase.actions.length > 0) {
          const inputColums = [
            {
              grow: 4,
              name: '',
              cell: row => {
                return <span>{row.actionName}</span>;
              },
            },
          ];
          inputColums.push({
            grow: 2,
            center: true,
            name: '',
            cell: () => {
              return <span>5-Jan-2020</span>;
            },
          });
          inputColums.push({
            grow: 4,
            center: true,
            name: '',
            cell: () => {
              return (
                <CustomDatePicker
                  label=""
                  value="05-jun-2020"
                  min="2000-01-01"
                  max="2210-12-31"
                />
              );
            },
            allowOverflow: true,
          });
          inputColums.push({
            grow: 2,
            center: true,
            name: '',
            cell: () => {
              return <span>-</span>;
            },
          });
          inputColums.push({
            grow: 4,
            center: true,
            name: '',
            cell: () => {
              return (
                <TextAreaComponent
                  className="pt-3"
                  // label={''}
                  labelClassName=""
                  inputClassName=""
                  error={false}
                  helperText=""
                  helperTextClassName=""
                  textCounterClass="small-text"
                  isDisable
                  rows={3}
                  value=""
                />
              );
            },
          });

          inputColums.push({
            grow: 4,
            // center: true,
            name: '',
            cell: () => {
              return (
                <TextAreaComponent
                  className="pt-3"
                  // label={''}
                  // labelClassName={ ''}
                  // inputClassName={''}
                  textCounterClass="small-text"
                  error={false}
                  // helperText={''}
                  // helperTextClassName={ ''}
                  isDisable
                  rows={3}
                  // value={''}
                />
              );
            },
          });

          subPhasesColumns[phase.propWorkflowPhaseRefId] = inputColums;
          // console.log('subPhasesColumns', subPhasesColumns[phase.id]);
        }
        setDemoColumns(subPhasesColumns);
      });
    }
  }, [demoDataTable]);

  const onFitoutTypeChangelistner = item => {
    // console.log(item);
    setSelectWorkflow(item.value);
  };

  const toggleAccordionDemo = id => {
    const newPopupData = [...workFlowTableList];
    newPopupData.forEach((item, i) => {
      if (item.propWorkflowPhaseRefId === id) {
        newPopupData[i].status = newPopupData[i].status
          ? !newPopupData[i].status
          : true;
      } else {
        newPopupData[i].status = false;
      }
    });
    // console.log(newPopupData);

    changeWorkflow(newPopupData);
  };

  const handleContentComponentDemo = item => {
    return item.actions && item.actions.length ? (
      <div>
        <CardListTable
          data={item.actions}
          columns={
            demoColumns && demoColumns[item.propWorkflowPhaseRefId]
              ? demoColumns[item.propWorkflowPhaseRefId]
              : []
          } // what is item.id ?
          pagination={false}
          custompagination={false}
          noDataLabel="actions not found"
        />
      </div>
    ) : (
      <></>
    );
  };
  const { t } = useTranslation();

  return (
    <div className="addorupdate-milestones">
      <div className="card-container">
        <CardHeader title="ADD OR UPDATE MILESTONES" />
        <div className="mail-content mt-4">
          <div className="dropdown">
            <DropdownComponentWithSearchBar
              data={workFlowSelection}
              label={`${t('KICK_OFF.ADD_UPDATE_MILESTONES.SELECT_WORKFLOW')}`}
              value={selectWorkflow}
              onSelect={index => {
                onFitoutTypeChangelistner(
                  workFlowSelection.filter(x => {
                    // console.log(x.id, index)
                    return x.id === Number(index);
                  })[0],
                );
              }}
            />
          </div>
          {selectWorkflow ? (
            <div className="workflow-table-data">
              <div className="title-head-table-data">
                <div className="title-head text-center">{`${t(
                  'KICK_OFF.ADD_UPDATE_MILESTONES.TABLE.PHASE',
                )}`}</div>
                <div className="title-head text-center">
                  {`${t(
                    'KICK_OFF.ADD_UPDATE_MILESTONES.TABLE.BUDGETED_COMPLETION',
                  )}`}
                </div>
                <div className="title-head text-center">
                  {`${t(
                    'KICK_OFF.ADD_UPDATE_MILESTONES.TABLE.PLANNED_COMPLETION',
                  )}`}
                </div>
                <div className="title-head text-center">
                  {`${t(
                    'KICK_OFF.ADD_UPDATE_MILESTONES.TABLE.ACTUAL_COMPLETION',
                  )}`}
                </div>
                <div className="title-head text-center">
                  {`${t(
                    'KICK_OFF.ADD_UPDATE_MILESTONES.TABLE.COMMENTS_TENANT',
                  )}`}
                </div>
                <div className="title-head text-center">
                  {`${t(
                    'KICK_OFF.ADD_UPDATE_MILESTONES.TABLE.COMMENTS_OWNER',
                  )}`}
                </div>
              </div>
              <div className="accordion-container mt-3">
                {/* Accordion */}

                {workFlowTableList.map(item => {
                  // console.log(item);
                  return (
                    <Accordion
                      key={item.propWorkflowPhaseRefId}
                      headerComponent={
                        <>
                          <Header phase={item.phaseName} />
                          <Header phase="5-Nov-2019" />
                          <Header
                            phase={
                              <CustomDatePicker
                                label=""
                                value="05-jun-2020"
                                min="2000-01-01"
                                max="2210-12-31"
                              />
                            }
                          />
                          <Header phase="5-Nov-2019" />
                          <Header phase="-" />
                          <Header phase="-" />
                        </>
                      }
                      isContent={item.actions && item.actions.length > 0}
                      contentComponent={handleContentComponentDemo(item)}
                      toggleAccordion={() => {
                        toggleAccordionDemo(item.propWorkflowPhaseRefId);
                      }}
                      previewStatus={item.status}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
AddOrUpdateMilestones.defaultProps = {
  // mileStoneData: [],
  workFlowSelection: [],
  workFlowTableList: [],
};
AddOrUpdateMilestones.propTypes = {
  callPhaseDataTableApi: PropTypes.func.isRequired,
  getWorkflowListApi: PropTypes.func.isRequired,
  workFlowSelection: PropTypes.instanceOf(Array),
  workFlowTableList: PropTypes.instanceOf(Array),
  changeWorkflow: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  // mileStoneData: getAddUpdateMileStone(state),
  workFlowSelection: getWorkflowListSelector(state),
  workFlowTableList: getWorkflowListTableSelector(state),
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      callPhaseDataTableApi: getPhaselisingTableAPIAction,
      getWorkflowListApi: getWorkflowListAPIAction,
      changeWorkflow: setWorkflowTable,
    },
    dispatch,
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddOrUpdateMilestones);
