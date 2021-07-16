import React, { useEffect } from 'react';
import './Step2.scss';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import { connect } from 'react-redux';
import Editor from '../../../../components/CKEditor/Editor';
import LanguageSwitcher from '../../../../components/LanguageSwitcher/LanguageSwitcher';

/** Error & Lables */
import labels from '../../../../utils/Locales/labels';
import messages from '../../../../utils/Locales/messages';
import {
  scrollToTop,
  getLanguages,
  getPrimaryLanguage,
  countCharacter,
} from '../../../../utils/utils';

function Step2(props) {
  const {
    steps,
    changeStep,
    languages,
    indexOfNoteLabel,
    indexOfSpecificationLabel,
    primaryLanguage,
  } = props;

  useEffect(() => {
    scrollToTop();
  }, []);

  // step
  /**
   * getIndexOfLabel:
   *  we are using in step 2 to get index of label and update it
   *  updated index we are not gettin in onchange method that's way we are using second time here
   * @param {*} array
   * @param {*} languageCode
   */
  const getIndexOfLabel = (array, languageCode) => {
    return array.findIndex(label => label.languageCode === languageCode);
  };

  /**
   *  onContentChangelistner : handle content change in editor
   * @param {*} content : content of editor
   * @param {*} activeLanguage : active language code
   * @param {*} type : note / specification
   */

  const onContentChangelistner = (content, type) => {
    const data = [...steps];
    if (type === 'note' && data[1].step2Data.notes.length > 0) {
      const indexOfLabel = getIndexOfLabel(
        data[1].step2Data.notes,
        data[1].step2Data.activeLanguage,
      );

      data[1].step2Data.notes[indexOfLabel].note = content;
      // its issue of editor that on backspace it is taking <p><br></p> while we remove everything
      if (content === '<p><br></p>' || content === '<p></p>') {
        data[1].step2Data.notes[indexOfLabel].note = '';
      }

      // use this condition if notes is required
      // if (content === '') {
      //   data[1].step2Data.notes[indexOfLabel].isError = true;
      //   data[1].step2Data.notes[indexOfLabel].errorMessage =
      //     messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.NOTE_IS_REQUIRED;
      //   data[1].step2Data.isError = true;
      // } else

      if (
        countCharacter(content) >
          labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_NOTE_CONTENT &&
        data[1].step2Data.notes[indexOfLabel].languageCode === primaryLanguage
      ) {
        data[1].step2Data.notes[indexOfLabel].isError = true;
        data[1].step2Data.notes[indexOfLabel].errorMessage =
          messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_NOTE;
        data[1].step2Data.isError = true;
      } else if (
        countCharacter(content) >
          labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
            .LENGTH_OF_NOTE_CONTENT_SECONDARY &&
        data[1].step2Data.notes[indexOfLabel].languageCode !== primaryLanguage
      ) {
        data[1].step2Data.notes[indexOfLabel].isError = true;
        data[1].step2Data.notes[indexOfLabel].errorMessage =
          messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_NOTE_SECONDARY;
        data[1].step2Data.isError = true;
      } else {
        data[1].step2Data.notes[indexOfLabel].errorMessage = '';
        data[1].step2Data.notes[indexOfLabel].isError = false;
        data[1].step2Data.isError = false;
      }
    }
    if (
      type === 'specification' &&
      data[1].step2Data.specifications.length > 0
    ) {
      const indexOfLabel = getIndexOfLabel(
        steps[1].step2Data.specifications,
        steps[1].step2Data.activeLanguage,
      );

      data[1].step2Data.specifications[indexOfLabel].specification = content;
      // its issue of editor that on backspace it is taking <p><br></p> while we remove everything
      if (content === '<p><br></p>' || content === '<p></p>') {
        data[1].step2Data.specifications[indexOfLabel].specification = '';
      }
      // use this condition if specification is required
      // if (content === '') {
      //   data[1].step2Data.specifications[indexOfLabel].isError = true;
      //   data[1].step2Data.specifications[indexOfLabel].errorMessage =
      //     messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.SPECIFICATION_IS_REQUIRED;
      // } else
      if (
        countCharacter(content) >
          labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
            .LENGTH_OF_SPECIFICATION_CONTENT &&
        data[1].step2Data.specifications[indexOfLabel].languageCode ===
          primaryLanguage
      ) {
        data[1].step2Data.specifications[indexOfLabel].isError = true;
        data[1].step2Data.specifications[indexOfLabel].errorMessage =
          messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_SPECIFICATION;
        data[1].step2Data.isError = true;
      } else if (
        countCharacter(content) >
          labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
            .LENGTH_OF_SPECIFICATION_CONTENT_SECONDARY &&
        data[1].step2Data.specifications[indexOfLabel].languageCode !==
          primaryLanguage
      ) {
        data[1].step2Data.specifications[indexOfLabel].isError = true;
        data[1].step2Data.specifications[indexOfLabel].errorMessage =
          messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_SPECIFICATION_SECONDARY;
        data[1].step2Data.isError = true;
      } else {
        data[1].step2Data.specifications[indexOfLabel].errorMessage = '';
        data[1].step2Data.specifications[indexOfLabel].isError = false;
        data[1].step2Data.isError = false;
      }
    }
    changeStep(data);
  };

  const handleLanguageSwitch = languageCode => {
    const data = [...steps];
    data[1].step2Data.activeLanguage = languageCode;
    // reset
    data[1].step2Data.activeLanguageForReset = data[1].step2Data.activeLanguage;
    changeStep(data);
  };

  return (
    <>
      <div id="step-2-design-form">
        {/* language switcher */}
        <LanguageSwitcher
          className="design-form-language-switcher"
          onClick={handleLanguageSwitch}
          activeLanguage={steps[1].step2Data.activeLanguage}
          languages={languages}
        />
        <Editor
          name={`${steps[1].step2Data.activeLanguage}note-editor`}
          inputContainerClass={`editor-input ${
            languages.length === 1 ? 'padding-top-30' : ''
          }`}
          label={labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.NOTES_LABEL}
          content={
            indexOfNoteLabel >= 0
              ? steps[1].step2Data.notes[indexOfNoteLabel].note
              : ''
          }
          setContent={data => onContentChangelistner(data, 'note')}
          isError={
            indexOfNoteLabel >= 0
              ? steps[1].step2Data.notes[indexOfNoteLabel].isError
              : false
          }
          helperText={
            indexOfNoteLabel >= 0 &&
            steps[1].step2Data.notes[indexOfNoteLabel].isError
              ? steps[1].step2Data.notes[indexOfNoteLabel].errorMessage
              : messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.NOTE_IS_REQUIRED
          }
          tabIndex={-1}
          lengthOfContent={
            steps[1].step2Data.notes[indexOfNoteLabel].languageCode ===
            primaryLanguage
              ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .LENGTH_OF_NOTE_CONTENT
              : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .LENGTH_OF_NOTE_CONTENT_SECONDARY
          }
        />
        <Editor
          name={`${steps[1].step2Data.activeLanguage}specification-editor`}
          inputContainerClass="editor-input"
          label={
            labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.SPECIFICATION_LABEL
          }
          content={
            indexOfSpecificationLabel >= 0
              ? steps[1].step2Data.specifications[indexOfSpecificationLabel]
                  .specification
              : ''
          }
          setContent={data => onContentChangelistner(data, 'specification')}
          isError={
            indexOfSpecificationLabel >= 0
              ? steps[1].step2Data.specifications[indexOfSpecificationLabel]
                  .isError
              : false
          }
          helperText={
            indexOfSpecificationLabel >= 0 &&
            steps[1].step2Data.specifications[indexOfSpecificationLabel].isError
              ? steps[1].step2Data.specifications[indexOfSpecificationLabel]
                  .errorMessage
              : messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .SPECIFICATION_IS_REQUIRED
          }
          tabIndex={-1}
          lengthOfContent={
            steps[1].step2Data.specifications[indexOfSpecificationLabel]
              .languageCode === primaryLanguage
              ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .LENGTH_OF_SPECIFICATION_CONTENT
              : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2
                  .LENGTH_OF_SPECIFICATION_CONTENT_SECONDARY
          }
        />
      </div>
    </>
  );
}

Step2.propTypes = {
  steps: PropTypes.instanceOf(Array).isRequired,
  changeStep: PropTypes.func.isRequired,
  indexOfNoteLabel: PropTypes.number.isRequired,
  indexOfSpecificationLabel: PropTypes.number.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  primaryLanguage: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  languages: getLanguages(state),
  primaryLanguage: getPrimaryLanguage(state),
});

export default connect(mapStateToProps)(Step2);
