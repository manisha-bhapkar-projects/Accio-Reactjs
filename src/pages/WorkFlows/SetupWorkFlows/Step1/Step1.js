import React from 'react';
import './Step1.scss';
import PropTypes from 'prop-types';
import DropdownComponentWithSearchBar from '../../../../components/Dropdown/DropdownComponentWithSearchBar';
import TextFieldComponent from '../../../../components/TextFieldComponent/TextFieldComponent';

/** Error & Lables */
import labels from '../../../../utils/Locales/labels';

function Step1(props) {
  const {
    workflowName,
    onWorkFlowNameTextChangelistner,
    onFitoutTypeChangelistner,
    fitOutType,
    fitOutList,
    onWorkFlowNameFocus,
    isErrorFitOutType,
    isErrorFitOutTypeMsg,
    languages,
    fitoutDisable,
    maxLength,
  } = props;
  let isErrorWorkflowName = '';
  return (
    <div id="step1">
      <div className="row">
        {languages ? (
          languages.length !== 0 &&
          languages.map((lang, _index) => {
            isErrorWorkflowName = workflowName.filter(
              x => x.languageCode === lang.languageCode,
            )[0]
              ? workflowName.filter(
                  x => x.languageCode === lang.languageCode,
                )[0].isErrorWorkflowNameMsg
              : '';
            return (
              <div className="input-field-text" key={lang.languageCode}>
                <TextFieldComponent
                  id={`workdlow-name-${lang.languageName}`}
                  type="text"
                  autoFocus={_index === 0}
                  helperText={isErrorWorkflowName || ''}
                  error={isErrorWorkflowName} // && lang.languageCode === 'en'}
                  name="workdlow-name"
                  label={
                    languages.length >= 2
                      ? `${labels.WORKFLOWS.STEP_1.NAME}  (${lang.languageName})`
                      : labels.WORKFLOWS.STEP_1.NAME
                  }
                  labelClassName="label-text-bold"
                  className="form-field"
                  value={
                    workflowName.filter(
                      x => x.languageCode === lang.languageCode,
                    )[0]
                      ? workflowName.filter(
                          x => x.languageCode === lang.languageCode,
                        )[0].name
                      : ''
                  }
                  onChange={e => {
                    onWorkFlowNameTextChangelistner(e, lang.languageCode);
                  }}
                  onFocus={onWorkFlowNameFocus}
                  maxLength={
                    lang.languageCode === 'en' ? maxLength : maxLength * 4
                  }
                />
              </div>
            );
          })
        ) : (
          <></>
        )}
        <div className="dropdown-field-input">
          <DropdownComponentWithSearchBar
            data={fitOutList}
            isDisabled={fitoutDisable}
            label={
              languages.length >= 2
                ? `${labels.WORKFLOWS.STEP_1.CASE_TYPE} `
                : labels.WORKFLOWS.STEP_1.CASE_TYPE
            }
            value={fitOutType.value}
            error={isErrorFitOutType ? isErrorFitOutTypeMsg : ''}
            onSelect={index => {
              onFitoutTypeChangelistner(
                fitOutList.filter(x => {
                  return x.id === index;
                })[0],
                'en',
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

Step1.defaultProps = {
  workflowName: [],
  fitOutType: {
    value: '',
  },
  fitOutList: [],
  languages: [],
  fitoutDisable: false,
};

Step1.propTypes = {
  workflowName: PropTypes.instanceOf(Array),
  onWorkFlowNameTextChangelistner: PropTypes.func.isRequired,
  onFitoutTypeChangelistner: PropTypes.func.isRequired,
  fitOutType: PropTypes.instanceOf(Object),
  fitOutList: PropTypes.instanceOf(Array),
  isErrorFitOutType: PropTypes.bool.isRequired,
  isErrorFitOutTypeMsg: PropTypes.string.isRequired,
  languages: PropTypes.instanceOf(Array),
  fitoutDisable: PropTypes.bool,
  maxLength: PropTypes.number.isRequired,
  onWorkFlowNameFocus: PropTypes.func.isRequired,
};

export default Step1;
