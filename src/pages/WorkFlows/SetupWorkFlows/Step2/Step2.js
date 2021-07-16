import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CardListTable from '../../../../components/CardListTable/CardListTable';
import TextFieldComponent from '../../../../components/TextFieldComponent/TextFieldComponent';
import Switch from '../../../../components/Switch/Switch';
import './Step2.scss';

/** Error & Lables */
import labels from '../../../../utils/Locales/labels';

function Step2(props) {
  const {
    data,
    topWizardComponent,
    handleSwitchToggle,
    onDaysTextFieldChangelistner,
    countOfStep2DataChange,
  } = props;

  const [columns, setColumns] = useState([]);

  const initializeColumns = _countOfStep2DataChange => {
    setColumns([
      {
        grow: 2,
        name: labels.WORKFLOWS.STEP_2.COL_1,
        cell: row => {
          return (
            <>
              <span>
                {row.labels && row.labels.length
                  ? row.labels.filter(
                      ({ languageCode }) => languageCode === 'en',
                    )[0].propertyPhaseName
                  : row.phaseName}
              </span>
            </>
          );
        },
      },
      {
        grow: 6,
        name: labels.WORKFLOWS.STEP_2.COL_2,
        center: true,
        cell: row => {
          return row.isDefaultMandatory ? (
            <TextFieldComponent
              id={`${row.propertyPhasesId}`}
              name={`${row.propertyPhasesId}`}
              type="text"
              autoFocus={
                _countOfStep2DataChange === 0 ? row.phaseSequence === 1 : false
              }
              helperText={row.isError ? row.isError : ''}
              error={row.isError}
              className="form-field text-field-component-days"
              onChange={e => onDaysTextFieldChangelistner(e, row)}
              value={row.daysToComplete}
            />
          ) : null;
        },
      },
      {
        grow: 2,
        name: labels.WORKFLOWS.STEP_2.COL_3,
        cell: row => {
          return (
            <>
              <Switch
                id={`${row.propertyPhasesId}`}
                isDisabled={row.isDefaultMandatory}
                name={`${row.propertyPhasesId}`}
                checked={row.isMandatory}
                handleToggle={e => handleSwitchToggle(e, row)}
              />
            </>
          );
        },
      },
    ]);
  };

  useEffect(() => {
    initializeColumns(countOfStep2DataChange);
  }, []);

  useEffect(() => {
    initializeColumns(countOfStep2DataChange);
  }, [countOfStep2DataChange]);

  return (
    <>
      <div className="row mt-5" id="step2">
        {topWizardComponent}
        <div className="col-12">
          <div className="table px-4">
            <CardListTable columns={columns} data={_.cloneDeep(data)} />
          </div>
        </div>
      </div>
    </>
  );
}

Step2.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  handleSwitchToggle: PropTypes.func.isRequired,
  topWizardComponent: PropTypes.node.isRequired,
  onDaysTextFieldChangelistner: PropTypes.func.isRequired,
  countOfStep2DataChange: PropTypes.number.isRequired,
};

export default Step2;
