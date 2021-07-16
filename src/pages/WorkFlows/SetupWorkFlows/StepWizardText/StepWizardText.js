import React from 'react';
import PropTypes from 'prop-types';
import TextFieldComponent from '../../../../components/TextFieldComponent/TextFieldComponent';

/** Error & Lables */
import labels from '../../../../utils/Locales/labels';
// import messages from '../../../../utils/Locales/messages';

function StepWizardText({ workflowName, fitOutType, languages }) {
  // console.log(workflowName, fitOutType, languages);
  // const example = [
  //   { name: 'hhh en', languageCode: 'en' },
  //   { name: 'hhh', languageCode: 'zh' },
  //   { name: 'hh454545h', languageCode: 'zh4545' },
  // ];
  const english = workflowName.filter(x => x.languageCode === 'en');
  const other = workflowName.filter(x => x.languageCode !== 'en');
  const workflowSort = english.concat(other);

  return (
    <>
      {workflowSort ? (
        workflowSort.length &&
        workflowSort.map(item => {
          const languagename = languages.find(
            lang => lang.languageCode === item.languageCode,
          );
          let label = '';
          if (languagename) {
            label = `${labels.WORKFLOWS.STEP_1.NAME} (${languagename.languageName})`;
          } else {
            label = `${labels.WORKFLOWS.STEP_1.NAME}`;
          }

          return (
            <div
              key={item.languageCode}
              className="input-field-text wizard-text-box ml-4  mb-5"
            >
              <TextFieldComponent
                id={`workdlow-name-${item.languageCode}`}
                type="text"
                name="workdlow-name"
                label={label}
                labelClassName="label-text-bold"
                className="form-field"
                placeholder=""
                value={item.name}
                inputClassName="disabled"
                isDisable
              />
            </div>
          );
        })
      ) : (
        <></>
      )}

      <div className="input-field-text mx-4 px-3 mb-5">
        <TextFieldComponent
          id="fit-out-type"
          type="text"
          name="fit-out-type"
          label={labels.WORKFLOWS.STEP_1.CASE_TYPE}
          labelClassName="label-text-bold"
          className="form-field"
          placeholder=""
          value={fitOutType.value}
          inputClassName="disabled"
          isDisable
        />
      </div>
    </>
  );
}

StepWizardText.defaultProps = {
  workflowName: [],
  fitOutType: {
    value: '',
  },
  languages: [],
};

StepWizardText.propTypes = {
  workflowName: PropTypes.instanceOf(Array),
  fitOutType: PropTypes.instanceOf(Object),
  languages: PropTypes.instanceOf(Array),
};

export default StepWizardText;
