import React, { useEffect } from 'react';
import './Step5.scss';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { connect } from 'react-redux';
import LanguageSwitcher from '../../../../components/LanguageSwitcher/LanguageSwitcher';
/** Error & Lables */
import labels from '../../../../utils/Locales/labels';
import FileInput from '../../../../components/FileInput/FileInput';
import TextAreaComponent from './TextAreaComponent/TextAreaComponent';
import { scrollToTop } from '../../../../utils/utils';
import messages from '../../../../utils/Locales/messages';

function Step5(props) {
  const {
    steps,
    changeStep,
    languages,
    indexOfNameLabel,
    indexOfNoteLabel,
    indexOfSpecificationLabel,
    sectionsArray,
    getFilesAsPerSection,
  } = props;

  useEffect(() => {
    scrollToTop();
  }, []);

  /**
   *  onContentChangelistner : handle content change in editor
   * @param {*} content : content of editor
   * @param {*} activeLanguage : active language code
   * @param {*} type : note / specification
   */

  const handleLanguageSwitch = languageCode => {
    const data = [...steps];
    data[4].step5Data.activeLanguage = languageCode;
    changeStep(data);
  };

  const getSectionNameByLanguageCode = sectionNames => {
    const primaryName = sectionNames.filter(
      nameData => nameData.languageCode === steps[4].step5Data.activeLanguage,
    );
    return primaryName[0].name;
  };

  const renderSections = () => {
    return (
      <>
        {sectionsArray.length > 0
          ? sectionsArray.map(section => {
              const filesAsPerSection = getFilesAsPerSection(section.sectionId);
              if (filesAsPerSection.length === 0) return '';
              return (
                <div key={section.sectionName} className="sections-files">
                  <div className="section-title">
                    {' '}
                    {getSectionNameByLanguageCode(section.names)}
                  </div>
                  {filesAsPerSection.map(file => {
                    const indexOfFileName = file.labels.findIndex(
                      label =>
                        label.languageCode ===
                        steps[4].step5Data.activeLanguage,
                    );
                    return (
                      <div className="files-to-submit">
                        <div className="file-no">{file.id}.</div>
                        <div className="file-input-box">
                          <FileInput
                            name="otherAttachments"
                            label={file.labels[indexOfFileName].label}
                            placeholder="other attachments"
                            fileTypes={file.fTypesExt}
                            isDisabled
                          />
                        </div>
                        <div className="or-symbol">OR</div>
                        <div className="ftp-location">
                          <TextAreaComponent
                            isDisable
                            label={
                              labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_5
                                .FTP_LABEL
                            }
                            type="text"
                            className="ftp-text-area"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          : steps[3].step4Data.sectionsFiles.map((file, i) => {
              const indexOfFileName = file.labels.findIndex(
                label =>
                  label.languageCode === steps[4].step5Data.activeLanguage,
              );
              return (
                <div className="files-to-submit">
                  <div className="file-no">{i + 1}.</div>
                  <div className="file-input-box">
                    <FileInput
                      name="otherAttachments"
                      label={file.labels[indexOfFileName].label}
                      placeholder="other attachments"
                      fileTypes={file.fTypesExt}
                      isDisabled
                    />
                  </div>
                  <div className="or-symbol">OR</div>
                  <div className="ftp-location">
                    <TextAreaComponent
                      isDisable
                      label={
                        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_5.FTP_LABEL
                      }
                      type="text"
                      className="ftp-text-area"
                    />
                  </div>
                </div>
              );
            })}
      </>
    );
  };

  return (
    <>
      <div
        id="step-5-design-form"
        className={languages.length === 1 ? 'padding-top-30' : ''}
      >
        {/* language switcher */}
        <LanguageSwitcher
          className="design-form-language-switcher"
          onClick={handleLanguageSwitch}
          activeLanguage={steps[4].step5Data.activeLanguage}
          languages={languages}
        />
        {indexOfNameLabel >= 0 && (
          <div className="design-form-title">
            <div className="card-design-form-title">
              {steps[0].step1Data.formNames[indexOfNameLabel].name}{' '}
            </div>
            <div className="design-form-bottom-border " />
          </div>
        )}
        {indexOfNoteLabel >= 0 &&
          steps[1].step2Data.notes[indexOfNoteLabel].note && (
            <div className="editor-content padding-top-30">
              <div className="label-text">
                {labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_5.NOTES_LABEL}
              </div>
              {parse(steps[1].step2Data.notes[indexOfNoteLabel].note)}
            </div>
          )}
        {indexOfSpecificationLabel >= 0 &&
          steps[1].step2Data.specifications[indexOfSpecificationLabel]
            .specification && (
            <div className="editor-content padding-top-30">
              <div className="label-text">
                {
                  labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_5
                    .SPECIFICATION_LABEL
                }
              </div>
              {parse(
                steps[1].step2Data.specifications[indexOfSpecificationLabel]
                  .specification,
              )}
            </div>
          )}
        <div className="editor-content padding-top-30">
          <div className="label-text">
            {labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_5.ITEMS_TO_BE_SUBMITTED}
          </div>
          {messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_5.ITEMS_TO_BE_SUBMITTED}
        </div>
        {/* Files */}
        {renderSections()}
      </div>
    </>
  );
}

Step5.propTypes = {
  steps: PropTypes.instanceOf(Array).isRequired,
  changeStep: PropTypes.func.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  indexOfNameLabel: PropTypes.number.isRequired,
  indexOfNoteLabel: PropTypes.number.isRequired,
  indexOfSpecificationLabel: PropTypes.number.isRequired,
  sectionsArray: PropTypes.instanceOf(Array).isRequired,
  getFilesAsPerSection: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  languages: state.common.userLanguages,
});

export default connect(mapStateToProps)(Step5);
