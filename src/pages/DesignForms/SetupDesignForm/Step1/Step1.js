import React, { useEffect } from 'react';
import './Step1.scss';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DropdownWithSearchBar from '../../../../components/Dropdown/DropdownComponentWithSearchBar';
import TextFieldComponent from '../../../../components/TextFieldComponent/TextFieldComponent';

import {
  getFormNames,
  getFitOutTypesList,
  getDesignSubPhasesList,
} from '../../selector';

import {
  getDesignSubPhasesListApiAction,
  getFitOutTypesListForDesignFormsApiAction,
} from '../../../../actions/designFormsActions';

/** Error & Lables */
import labels from '../../../../utils/Locales/labels';
import messages from '../../../../utils/Locales/messages';
import { validateNameWithRegex } from '../../../../utils/validation';

import {
  scrollToTop,
  getLanguages,
  getPrimaryLanguage,
} from '../../../../utils/utils';

function Step1(props) {
  const {
    steps,
    changeStep,
    fitOutList,
    getFitOutTypesListAction,
    designSubPhasesList,
    getValueFromListById,
    getLanguageNameByCode,
    languages,
    primaryLanguage,
    isBindWithAnyWorkFlow,
  } = props;

  useEffect(() => {
    scrollToTop();
    getFitOutTypesListAction();
  }, []);

  const onFormNameTextChangelistner = (e, indexOfLabel) => {
    const data = [...steps];
    data[0].step1Data.formNames[indexOfLabel].name = e.target.value;
    if (e.target.value === '') {
      data[0].step1Data.formNames[indexOfLabel].isError = true;
      data[0].step1Data.isError = true;
      data[0].step1Data.formNames[indexOfLabel].errorMessage =
        messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.FORM_NAME_IS_REQUIRED;
    } else if (
      e.target.value.length >
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.LENGTH_OF_FORM_NAME &&
      data[0].step1Data.formNames[indexOfLabel].languageCode === primaryLanguage
    ) {
      data[0].step1Data.formNames[indexOfLabel].isError = true;
      data[0].step1Data.formNames[
        indexOfLabel
      ].errorMessage = `${messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.FORM_NAME_SHOULD_BE_LESS}`;
      data[0].step1Data.isError = true;
    } else if (
      e.target.value.length >
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
          .LENGTH_OF_FORM_NAME_SECODARY &&
      data[0].step1Data.formNames[indexOfLabel].languageCode !== primaryLanguage
    ) {
      data[0].step1Data.formNames[indexOfLabel].isError = true;
      data[0].step1Data.formNames[
        indexOfLabel
      ].errorMessage = `${messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.FORM_NAME_SHOULD_BE_LESS_SECONDARY}`;
      data[0].step1Data.isError = true;
    } else if (
      !validateNameWithRegex(
        e.target.value,
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.REGEX_OF_FORM_NAME,
      ) &&
      data[0].step1Data.formNames[indexOfLabel].languageCode === primaryLanguage
    ) {
      data[0].step1Data.formNames[indexOfLabel].isError = true;
      data[0].step1Data.formNames[indexOfLabel].errorMessage =
        messages.GLOBAL.ERR_TEXTFIELD_INPUT;
      data[0].step1Data.isError = true;
    } else {
      data[0].step1Data.formNames[indexOfLabel].errorMessage = '';
      data[0].step1Data.formNames[indexOfLabel].isError = false;
      data[0].step1Data.isError = false;
    }
    changeStep(data);
  };

  // onFitoutTypeChangelistner : handle fitout type change
  const onFitoutTypeChangelistner = caseTypeId => {
    const data = [...steps];
    data[0].step1Data.caseType.ctId = caseTypeId;
    data[0].step1Data.caseType.isError = false;
    changeStep(data);
  };

  // onSubPhaseChangelistner : handle subPhase change
  const onSubPhaseChangelistner = subPhaseId => {
    const data = [...steps];
    data[0].step1Data.subPhase.subPhaseId = subPhaseId;
    data[0].step1Data.subPhase.isError = false;
    changeStep(data);
  };

  return (
    <div
      id={
        languages.length === 1
          ? 'step1-form-desing-one-language'
          : 'step1-form-desing'
      }
    >
      {/* Form Name Fields */}
      <div className="form-name-field-inputs">
        {steps[0].step1Data.formNames.length > 0 &&
          languages.length > 0 &&
          languages.map(language => {
            const indexOfLabel = steps[0].step1Data.formNames.findIndex(
              item => item.languageCode === language.languageCode,
            );
            if (indexOfLabel < 0) return '';
            const formData = steps[0].step1Data.formNames[indexOfLabel];
            return (
              <div key={formData.languageCode} className="input-field-text">
                <TextFieldComponent
                  id={`form-name-${formData.languageCode}`}
                  type="text"
                  helperText={
                    formData.errorMessage
                      ? formData.errorMessage
                      : messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                          .FORM_NAME_IS_REQUIRED
                  }
                  error={formData.isError}
                  name="form-name"
                  label={`${
                    labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.FORM_NAME
                  } (${getLanguageNameByCode(formData.languageCode)})`}
                  value={formData.name}
                  onChange={e => onFormNameTextChangelistner(e, indexOfLabel)}
                  maxLength={
                    formData.languageCode === primaryLanguage
                      ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                          .LENGTH_OF_FORM_NAME
                      : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                          .LENGTH_OF_FORM_NAME_SECODARY
                  }
                  autoFocus={formData.languageCode === primaryLanguage}
                />
              </div>
            );
          })}
      </div>
      {/* Form Name Fields End */}
      {/* Dropdown Fields */}
      <div className="dropdown-field-inputs">
        <div className="dropdown-field-input">
          <DropdownWithSearchBar
            data={fitOutList}
            isDisabled={isBindWithAnyWorkFlow}
            label={labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.FIT_OUT_TYPE}
            value={getValueFromListById(
              fitOutList,
              steps[0].step1Data.caseType.ctId,
            )}
            error={
              steps[0].step1Data.caseType.isError
                ? messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                    .FIT_OUT_TYPE_IS_REQUIRED
                : ''
            }
            onSelect={index => onFitoutTypeChangelistner(index)}
            noOptionsMessage={
              messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                .FIT_OUT_TYPE_NOT_FOUND
            }
          />
        </div>
        <div className="dropdown-field-input">
          <DropdownWithSearchBar
            data={designSubPhasesList}
            label={labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.DESIGN_SUBPHASE}
            value={getValueFromListById(
              designSubPhasesList,
              steps[0].step1Data.subPhase.subPhaseId,
            )}
            isDisabled={isBindWithAnyWorkFlow}
            error={
              steps[0].step1Data.subPhase.isError
                ? messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                    .DESIGN_SUBPHASE_IS_REQUIRED
                : ''
            }
            onSelect={index => onSubPhaseChangelistner(index)}
            noOptionsMessage={
              messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                .DESIGN_SUBPHASES_NOT_FOUND
            }
          />
        </div>
      </div>
    </div>
  );
}

Step1.defaultProps = {
  fitOutList: [],
  designSubPhasesList: [],
};

Step1.propTypes = {
  steps: PropTypes.instanceOf(Array).isRequired,
  changeStep: PropTypes.func.isRequired,
  fitOutList: PropTypes.instanceOf(Array),
  designSubPhasesList: PropTypes.instanceOf(Array),
  getFitOutTypesListAction: PropTypes.func.isRequired,
  getValueFromListById: PropTypes.func.isRequired,
  getLanguageNameByCode: PropTypes.func.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  primaryLanguage: PropTypes.string.isRequired,
  isBindWithAnyWorkFlow: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  fitOutList: getFitOutTypesList(state),
  designSubPhasesList: getDesignSubPhasesList(state),
  formNamesArray: getFormNames(state),
  languages: getLanguages(state),
  primaryLanguage: getPrimaryLanguage(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getFitOutTypesListAction: getFitOutTypesListForDesignFormsApiAction,
      getDesignSubPhasesListAction: getDesignSubPhasesListApiAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
