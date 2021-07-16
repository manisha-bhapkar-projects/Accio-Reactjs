import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Step3.scss';
import Accordion from '../../../../components/Accordion/Accordion';
import Header from '../../../PhasesAndMore/AddOrUpdateSubPhases/Header/Header';
import Switch from '../../../../components/Switch/Switch';
import Download from '../../../../images/DownloadArrow/Download3.png';
import SortAdvanceDataTable from '../../../../components/AdvanceDataTable/SortAdvanceDataTable/SortAdvanceDataTable';

import { getSubPhaseNameFromitem } from '../../selector';

/** Error & Lables */
import labels from '../../../../utils/Locales/labels';

function Step3({
  handleSwitchToggleStep3,
  topWizardComponent,
  SortingRows,
  data,
}) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const subPhasesColumns = [];

      data.forEach(phase => {
        if (phase.subPhases && phase.subPhases.length > 0) {
          const inputColums = [
            {
              grow: 4,
              name: labels.WORKFLOWS.STEP_3.SUB_COL_1,
              cell: row => {
                return (
                  <>
                    <span>{getSubPhaseNameFromitem(row)}</span>
                  </>
                );
              },
            },
          ];

          inputColums.push({
            grow: 3,
            name: labels.WORKFLOWS.STEP_3.SUB_COL_2,
            cell: row => {
              return (
                <Switch
                  id={`${row.subPhaseId}`}
                  isDisabled={row.isDefaultMandatory}
                  checked={row.isMandatory}
                  name={`${row.subPhaseId}`}
                  handleToggle={e => handleSwitchToggleStep3(e, row)}
                />
              );
            },
          });
          inputColums.push({
            grow: 2,
            style: {
              paddingRight: '0 10px 0px 0px',
            },
            right: true,
            name: '',
            cell: row => {
              return !row.isLastIndex && !row.isDefaultMandatory ? (
                <div
                  onKeyDown={e => {
                    SortingRows(e, row);
                  }}
                  onClick={e => {
                    SortingRows(e, row);
                  }}
                  tabIndex="0"
                  role="button"
                >
                  <img alt="Downlaod" className="download-img" src={Download} />
                </div>
              ) : (
                <></>
              );
            },
          });
          subPhasesColumns[phase.id] = inputColums;
        }
        setColumns(subPhasesColumns);
      });
    }
  }, [data]);

  const handleContentComponent = item => {
    return item.subPhases && item.subPhases.length ? (
      <div>
        <SortAdvanceDataTable
          data={[
            ...item.subPhases.map((_item, index) => {
              if (index === item.subPhases.length - 1) {
                return {
                  ..._item,
                  isLastIndex: true,
                };
              }
              if (item.subPhases[index + 1].isDefaultMandatory) {
                return {
                  ..._item,
                  isLastIndex: true,
                };
              }

              return {
                ..._item,
                isLastIndex: false,
              };
            }),
          ]}
          columns={columns[item.id]} // what is item.id ?
          noDataLabel="Sub-Phases not found"
        />
      </div>
    ) : (
      <></>
    );
  };

  return (
    <div className="row mt-5" id="step-3">
      {topWizardComponent}
      <div className="col-12 col-border-title">
        <div className="step-3-title">Phase</div>
        <div className="accordion-container mt-3">
          {/* Accordion */}
          {data.map(item => {
            return item.isMandatory ? (
              <Accordion
                key={item.propertyPhasesId}
                headerComponent={
                  <Header
                    phase={
                      item.labels && item.labels.length
                        ? item.labels.filter(
                            ({ languageCode }) => languageCode === 'en',
                          )[0].propertyPhaseName
                        : item.phaseName
                    }
                  />
                }
                isContent={item.subPhases && item.subPhases.length > 0}
                contentComponent={handleContentComponent(item)}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

Step3.propTypes = {
  handleSwitchToggleStep3: PropTypes.func.isRequired,
  topWizardComponent: PropTypes.node.isRequired,
  SortingRows: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
};

export default Step3;
