import React, { useEffect, useState } from 'react';
import './Step3.scss';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Note from '../../../../components/Note/Note';
import TextFieldComponent from '../../../../components/TextFieldComponent/TextFieldComponent';
import { getWidthByLength } from '../../selector';
import CardListTable from '../../../../components/CardListTable/CardListTable';
import LabelWithIcon from '../../../../components/LabelWithIcon/LabelWithIcon';
import { insertIsErrorInLabels, scrollToTop } from '../../../../utils/utils';

/** Error & Lables */
import labels from '../../../../utils/Locales/labels';
import messages from '../../../../utils/Locales/messages';
import { primaryLanguage } from '../../../../utils/DemoData/languages';

function Step3(props) {
  const {
    steps,
    changeStep,
    languages,
    sectionsArray,
    countOfStep3DataChange,
  } = props;

  const [columns, setColumns] = useState([]);

  // initializeColumns : it initialize columns inside content of accordion
  const initializeColumns = () => {
    const inputColumns = [
      {
        name: labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.COL_1,
        selector: 'sectionName',
      },
    ];
    languages.forEach((language, index) => {
      inputColumns.push({
        grow: languages.length === 2 && index === 1 ? 2 : 1,
        allowOverflow: true,
        name: `${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.COL_2} \n (${language.languageName})`,
        cell: row => {
          const indexOfLabel = row.names.findIndex(
            name => name.languageCode === language.languageCode,
          );
          if (indexOfLabel < 0) return <></>;
          return (
            <TextFieldComponent
              id={`${row.sectionName}-${language.languageCode}`}
              name={`${row.sectionName}-${language.languageCode}`}
              type="text"
              className="form-field"
              style={{
                width: getWidthByLength(languages.length, index),
                minWidth: '200px',
              }}
              helperText={
                row.names[indexOfLabel].errorMessage
                  ? row.names[indexOfLabel].errorMessage
                  : messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3
                      .FIELD_IS_REQUIRED
              }
              error={
                row.names[indexOfLabel] && row.names[indexOfLabel].isError
                  ? row.names[indexOfLabel].isError
                  : false
              }
              value={
                row.names[indexOfLabel] && row.names[indexOfLabel].name
                  ? row.names[indexOfLabel].name
                  : ''
              }
              onChange={e => handleOnChange(e, row.id, indexOfLabel)}
              maxLength={
                row.names[indexOfLabel].languageCode === primaryLanguage
                  ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3
                      .LENGTH_OF_SECTION_NAME
                  : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3
                      .LENGTH_OF_SECTION_NAME_SECONDARY
              }
              autoFocus={row.names[indexOfLabel].isFocus}
            />
          );
        },
      });
    });
    setColumns(inputColumns);
  };

  useEffect(() => {
    scrollToTop();
    initializeColumns();
  }, []);

  useEffect(() => {
    if (countOfStep3DataChange > 0) initializeColumns();
  }, [countOfStep3DataChange]);

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
          name: '',
          languageCode: language.languageCode,
          languageName: language.languageName,
        });
    });
    return array;
  };

  /**
   * handleOnChange to handle input changes
   * @param {*} event :  input event object
   * @param {*} id : id is index of section which we want to change
   * @param {*} indexOfLabel : indexOfLabel is index of language data which we want to change
   */

  const handleOnChange = (event, id, indexOfLabel) => {
    event.preventDefault();
    const data = [...steps];
    const indexOfSection = data[2].step3Data.formSections.findIndex(
      section => section.id === id,
    );
    data[2].step3Data.formSections[indexOfSection].names[indexOfLabel].name =
      event.target.value;

    if (event.target.value === '') {
      data[2].step3Data.formSections[indexOfSection].names[
        indexOfLabel
      ].isError = true;
      data[2].step3Data.isError = true;

      data[2].step3Data.formSections[indexOfSection].names[
        indexOfLabel
      ].errorMessage =
        messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.FIELD_IS_REQUIRED;
    } else if (
      event.target.value.length >
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.LENGTH_OF_SECTION_NAME &&
      data[2].step3Data.formSections[indexOfSection].names[indexOfLabel]
        .languageCode === primaryLanguage
    ) {
      data[2].step3Data.formSections[indexOfSection].names[
        indexOfLabel
      ].isError = true;
      data[2].step3Data.isError = true;
      data[2].step3Data.formSections[indexOfSection].names[
        indexOfLabel
      ].errorMessage =
        messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.SECTION_NAME_SHOULD_BE_LESS;
    } else if (
      event.target.value.length >
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3
          .LENGTH_OF_SECTION_NAME_SECONDARY &&
      data[2].step3Data.formSections[indexOfSection].names[indexOfLabel]
        .languageCode !== primaryLanguage
    ) {
      data[2].step3Data.formSections[indexOfSection].names[
        indexOfLabel
      ].isError = true;
      data[2].step3Data.isError = true;
      data[2].step3Data.formSections[indexOfSection].names[
        indexOfLabel
      ].errorMessage =
        messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.SECTION_NAME_SHOULD_BE_LESS_SECONDARY;
    }
    // uncomment this if regex required with section name
    //  else if (
    //   !validateNameWithRegex(
    //     event.target.value,
    //     labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.REGEX_OF_SECTION_NAME,
    //   ) &&
    //   data[2].step3Data.formSections[indexOfSection].names[indexOfLabel]
    //     .languageCode === primaryLanguage
    // ) {
    //   data[2].step3Data.formSections[indexOfSection].names[
    //     indexOfLabel
    //   ].isError = true;
    //   data[2].step3Data.isError = true;
    //   data[2].step3Data.formSections[indexOfSection].names[
    //     indexOfLabel
    //   ].errorMessage = messages.GLOBAL.ERR_TEXTFIELD_INPUT;
    // }
    else {
      data[2].step3Data.formSections[indexOfSection].names[
        indexOfLabel
      ].isError = false;
      data[2].step3Data.isError = false;
      data[2].step3Data.formSections[indexOfSection].names[
        indexOfLabel
      ].errorMessage = '';
    }
    changeStep(data);
  };

  const handleAddMoreSection = () => {
    const data = [...steps];
    const sectionsData = data[2].step3Data.formSections;
    const formSectionsLabels = insertEmptyObjectsInLabels([]);
    sectionsData.push({
      sectionSequence: sectionsData.length + 1,
      id: sectionsData.length + 1,
      sectionName: `${
        labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.SECTION_LABEL
      } ${sectionsData.length + 1}`,
      names: insertIsErrorInLabels(formSectionsLabels),
    });
    data[2].step3Data.formSections = sectionsData; // formSectionsForReset
    changeStep(data);
  };

  return (
    <>
      <div id="step-3-design-form">
        {/* note */}
        <div className="padding-top-30 padding-bottom-30">
          <Note
            noteText={
              labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3
                .NOTE_SECTIONS_ARE_OPTIONAL
            }
          />
        </div>
        {/* add more sections */}
        {/* Table */}
        <div className="sections-form-data-table ">
          <div className={`${languages.length === 2 ? 'with-two-column' : ''}`}>
            <CardListTable
              columns={columns}
              data={_.cloneDeep(sectionsArray)}
              pending={false}
              noDataString={
                messages.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.ADD_SECTION_FIRST
              }
              handlePageChange={null}
            />
          </div>
          <LabelWithIcon
            className="add-more-button"
            label="Add more sections"
            handleClick={handleAddMoreSection}
          />
        </div>
      </div>
    </>
  );
}

Step3.propTypes = {
  steps: PropTypes.instanceOf(Array).isRequired,
  changeStep: PropTypes.func.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  sectionsArray: PropTypes.instanceOf(Array).isRequired,
  countOfStep3DataChange: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  languages: state.common.userLanguages,
});

export default connect(mapStateToProps)(Step3);
