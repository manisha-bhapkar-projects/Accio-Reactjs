import React, { useEffect, useState } from 'react';
import './Step4.scss';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextFieldComponent from '../../../../components/TextFieldComponent/TextFieldComponent';
import CardListTable from '../../../../components/CardListTable/CardListTable';
import LabelWithIcon from '../../../../components/LabelWithIcon/LabelWithIcon';
/** Error & Lables */
import labels from '../../../../utils/Locales/labels';
import messages from '../../../../utils/Locales/messages';
import { insertIsErrorInLabels, scrollToTop } from '../../../../utils/utils';
import DropdownMultiSelect from '../../../../components/Dropdown/DropdownMultiSelect';
import {
  getfileTypeOptionsListApiAction,
  // getFormDataStepWise,
} from '../../../../actions/designFormsActions';
import { getFileTypesOptions, getWidthByLength } from '../../selector';

function Step4(props) {
  const {
    steps,
    changeStep,
    languages,
    primaryLanguage,
    sectionsArray,
    sectionsFilesArray,
    fileTypeOptions,
    getFilesAsPerSection,
    getSectionPrimaryLabel,
    getLanguageNameByCode,
    countOfStep4DataChange,
    setClickableSteps,
  } = props;

  const [columns, setColumns] = useState([]);

  // initializeColumns : it initialize columns inside content of accordion
  const initializeColumns = () => {
    const inputColumns = [
      {
        name: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.COL_1,
        selector: 'fileName',
        maxWidth: languages.length > 2 ? '100px' : '200px',
      },
    ];
    languages.forEach((language, index) => {
      inputColumns.push({
        // grow: 1,
        maxWidth: languages.length > 2 ? '220px' : '240px',
        name: `${
          labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.COL_2
        } \n (${getLanguageNameByCode(language.languageCode)})`,
        allowOverflow: true,
        cell: row => {
          const indexOfLabel = row.labels.findIndex(
            label => label.languageCode === language.languageCode,
          );
          return (
            <TextFieldComponent
              id={`${row.fileName}-${language.languageCode}`}
              name={`${row.fileName}-${language.languageCode}`}
              type="text"
              className="form-field"
              style={{
                width: getWidthByLength(languages.length, index),
                minWidth: '200px',
              }}
              helperText={
                row.labels[indexOfLabel].errorMessage
                  ? row.labels[indexOfLabel].errorMessage
                  : messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4
                      .FIELD_IS_REQUIRED
              }
              error={
                row.labels[indexOfLabel] && row.labels[indexOfLabel].isError
                  ? row.labels[indexOfLabel].isError
                  : false
              }
              value={
                row.labels[indexOfLabel] && row.labels[indexOfLabel].label
                  ? row.labels[indexOfLabel].label
                  : ''
              }
              maxLength={
                row.labels[indexOfLabel].languageCode === primaryLanguage
                  ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4
                      .LENGTH_OF_FILE_NAME
                  : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4
                      .LENGTH_OF_FILE_NAME_SECONDARY
              }
              onChange={e => handleOnChange(e, row.id, indexOfLabel)}
              autoFocus={row.labels[indexOfLabel].isFocus}
            />
          );
        },
      });
    });
    inputColumns.push({
      grow: 1,
      name: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FILE_TYPE_LABEL,
      allowOverflow: true,
      cell: row => {
        return (
          <DropdownMultiSelect
            multiSelectDesc={
              labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.SELECT_FILE_TYPE
            }
            data={fileTypeOptions}
            onChange={selected => handleOnFileTypesChange(selected, row.id)}
            value={row.fTypes}
            className="file-type-dropdown"
            error={row.isFileTypeError}
            helperText={
              row.isFileTypeError
                ? messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4
                    .NO_FILE_TYPE_SELECTED
                : ''
            }
          />
        );
      },
    });
    setColumns(inputColumns);
  };

  useEffect(() => {
    scrollToTop();
    initializeColumns();
    // if we don't have any files then we not allow over user to jump on step 5
    if (steps[3].step4Data.sectionsFiles.length === 0) setClickableSteps(4);
  }, []);

  useEffect(() => {
    if (countOfStep4DataChange > 0) initializeColumns();
  }, [countOfStep4DataChange]);

  /**
   * handleOnChange to handle input changes
   * @param {*} event :  input event object
   * @param {*} id : id is index of file which we want to change
   * @param {*} indexOfLabel : indexOfLabel is index of language data which we want to change
   */

  const handleOnChange = (event, id, indexOfLabel) => {
    event.preventDefault();
    const data = [...steps];
    const indexOfFile = data[3].step4Data.sectionsFiles.findIndex(
      file => file.id === id,
    );

    data[3].step4Data.sectionsFiles[indexOfFile].labels[indexOfLabel].label =
      event.target.value;

    if (event.target.value === '') {
      data[3].step4Data.sectionsFiles[indexOfFile].labels[
        indexOfLabel
      ].isError = true;
      data[3].step4Data.isError = true;
      data[3].step4Data.sectionsFiles[indexOfFile].labels[
        indexOfLabel
      ].errorMessage =
        messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FIELD_IS_REQUIRED;
    } else if (
      event.target.value.length >
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.LENGTH_OF_FILE_NAME &&
      data[3].step4Data.sectionsFiles[indexOfFile].labels[indexOfLabel]
        .languageCode === primaryLanguage
    ) {
      data[3].step4Data.sectionsFiles[indexOfFile].labels[
        indexOfLabel
      ].isError = true;
      data[3].step4Data.isError = true;
      data[3].step4Data.sectionsFiles[indexOfFile].labels[
        indexOfLabel
      ].errorMessage =
        messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FILE_NAME_SHOULD_BE_LESS;
    } else if (
      event.target.value.length >
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4
          .LENGTH_OF_FILE_NAME_SECONDARY &&
      data[3].step4Data.sectionsFiles[indexOfFile].labels[indexOfLabel]
        .languageCode !== primaryLanguage
    ) {
      data[3].step4Data.sectionsFiles[indexOfFile].labels[
        indexOfLabel
      ].isError = true;
      data[3].step4Data.isError = true;
      data[3].step4Data.sectionsFiles[indexOfFile].labels[
        indexOfLabel
      ].errorMessage =
        messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FILE_NAME_SHOULD_BE_LESS_SECONDARY;
    }
    // uncomment this if regex required in file name
    //  else if (
    //   !validateNameWithRegex(
    //     event.target.value,
    //     labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.REGEX_OF_FILE_NAME,
    //   ) &&
    //   data[3].step4Data.sectionsFiles[indexOfFile].labels[indexOfLabel]
    //     .languageCode === primaryLanguage
    // ) {
    //   data[3].step4Data.sectionsFiles[indexOfFile].labels[
    //     indexOfLabel
    //   ].isError = true;
    //   data[3].step4Data.isError = true;
    //   data[3].step4Data.sectionsFiles[indexOfFile].labels[
    //     indexOfLabel
    //   ].errorMessage = messages.GLOBAL.ERR_TEXTFIELD_INPUT;
    // }
    else {
      data[3].step4Data.sectionsFiles[indexOfFile].labels[
        indexOfLabel
      ].isError = false;
      data[3].step4Data.isError = false;
      data[3].step4Data.sectionsFiles[indexOfFile].labels[
        indexOfLabel
      ].errorMessage = '';
    }

    changeStep(data);
  };

  /**
   * handleOnFileTypesChange
   */

  const handleOnFileTypesChange = (selected, id) => {
    const data = [...steps];
    const indexOfFile = data[3].step4Data.sectionsFiles.findIndex(
      file => file.id === id,
    );
    const extensions = selected.map(e => e.value);
    data[3].step4Data.sectionsFiles[indexOfFile].fTypes = selected;
    data[3].step4Data.sectionsFiles[
      indexOfFile
    ].fTypesExt = extensions.toString();
    if (selected) {
      data[3].step4Data.sectionsFiles[indexOfFile].isFileTypeError = false;
    } else {
      data[3].step4Data.sectionsFiles[indexOfFile].isFileTypeError = true;
    }
    changeStep(data);
  };

  /**
   * insertEmptyObjectsInLabels : insert new label object if not exist for any language
   * @param {array} array : pass array in which we want to add label's object if not exist
   */

  const insertEmptyObjectsInLabels = array => {
    if (array.length === languages.length) {
      return array;
    }
    languages.forEach(language => {
      if (
        !array.find(arrayObj => arrayObj.languageCode === language.languageCode)
      )
        array.push({
          label: '',
          languageCode: language.languageCode,
          languageName: language.languageName,
        });
    });
    return array;
  };

  // handleAddMoreFile: for add file if no any sections found
  const handleAddMoreFile = () => {
    const data = [...steps];
    const { sectionsFiles } = data[3].step4Data;
    const sectionsFilesLabels = insertEmptyObjectsInLabels([]);
    sectionsFiles.push({
      id: sectionsFiles.length + 1,
      fileName: `${
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FILE_LABEL
      } ${sectionsFiles.length + 1}`,
      fTypes: [],
      isFileTypeError: false,
      fTypesExt: '',
      labels: insertIsErrorInLabels(sectionsFilesLabels),
    });
    data[3].step4Data.sectionsFiles = sectionsFiles;
    changeStep(data);
  };

  const getIndexFromPreviousSection = currentSequence => {
    const data = [...steps];
    const { sectionsFiles } = data[3].step4Data;
    const index = sectionsFiles.filter(
      file => file.sectionSequence < currentSequence,
    ).length;
    return index === 0 ? 0 : index;
  };

  const handleAddMoreFileInSection = (
    currenSectionSequence,
    relatedFiles,
    sectionId,
  ) => {
    const data = [...steps];
    const { sectionsFiles } = data[3].step4Data;
    const sectionsFilesLabels = insertEmptyObjectsInLabels([]);

    const indexOfLastFile =
      relatedFiles.length === 0
        ? getIndexFromPreviousSection(currenSectionSequence)
        : relatedFiles.length - 1;

    const indexOfNewFile =
      relatedFiles.length === 0
        ? indexOfLastFile + 1
        : relatedFiles[indexOfLastFile].id + 1;

    sectionsFiles.map(section => {
      const sectionData = section;
      if (sectionData.id >= indexOfNewFile) {
        sectionData.id += 1;
        sectionData.fileName = `${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FILE_LABEL} ${sectionData.id}`;
      }
      return true;
    });
    sectionsFiles.push({
      id: indexOfNewFile,
      sectionId,
      fileName: `${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.FILE_LABEL} ${indexOfNewFile}`,
      fTypes: [],
      isFileTypeError: false,
      fTypesExt: '',
      labels: insertIsErrorInLabels(sectionsFilesLabels),
      sectionSequence: currenSectionSequence,
    });
    data[3].step4Data.sectionsFiles = sectionsFiles;
    changeStep(data);
  };

  const renderSections = () => {
    return (
      <>
        {sectionsArray.length > 0
          ? sectionsArray.map(section => {
              const filesAsPerSection = getFilesAsPerSection(section.sectionId);
              return (
                <div key={section.sectionName} className="section">
                  <div className="section-header">
                    <div className="section-header-title">
                      {section.sectionName}:{' '}
                      {getSectionPrimaryLabel(section.names)}
                    </div>
                    <div className="section-header-add-more">
                      <LabelWithIcon
                        className="add-more-button"
                        label={
                          labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4
                            .ADD_FILES_LABEL
                        }
                        handleClick={() =>
                          handleAddMoreFileInSection(
                            section.sectionSequence,
                            filesAsPerSection,
                            section.sectionId,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="section-form-data-table">
                    {/* No Sections */}
                    {filesAsPerSection.length > 0 && (
                      <div
                        className={`${
                          languages.length === 3 ? 'with-three-column' : ''
                        }`}
                      >
                        <CardListTable
                          columns={columns}
                          data={_.cloneDeep(filesAsPerSection)}
                          pending={false}
                          noDataString={
                            messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4
                              .NO_FILES_FOUND
                          }
                          numOfColumns={columns.length}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          : ''}
      </>
    );
  };

  return (
    <>
      <div id="step-4-design-form">
        {/* Table */}
        <div>
          {sectionsArray.length > 0 ? (
            <div className="section-wise-form-data-table">
              <div className="table-title">
                {labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.TITLE}
              </div>
              {renderSections()}
            </div>
          ) : (
            <div className="without-section-form-data-table padding-top-30">
              {/* No Sections */}
              <CardListTable
                columns={columns}
                data={_.cloneDeep(sectionsFilesArray)}
                pending={false}
                noDataString={
                  messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.NO_FILES_FOUND
                }
              />
              <LabelWithIcon
                className="add-more-button"
                label={
                  labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.ADD_FILES_LABEL
                }
                handleClick={handleAddMoreFile}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Step4.propTypes = {
  steps: PropTypes.instanceOf(Array).isRequired,
  changeStep: PropTypes.func.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  primaryLanguage: PropTypes.string.isRequired,
  sectionsArray: PropTypes.instanceOf(Array).isRequired,
  sectionsFilesArray: PropTypes.instanceOf(Array).isRequired,
  fileTypeOptions: PropTypes.instanceOf(Array).isRequired,
  getFilesAsPerSection: PropTypes.func.isRequired,
  getSectionPrimaryLabel: PropTypes.func.isRequired,
  getLanguageNameByCode: PropTypes.func.isRequired,
  countOfStep4DataChange: PropTypes.number.isRequired,
  setClickableSteps: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fileTypeOptions: getFileTypesOptions(state),
  languages: state.common.userLanguages,
  primaryLanguage: state.common.primaryLanguage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getfileTypeOptionsListAction: getfileTypeOptionsListApiAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Step4);
