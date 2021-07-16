import React from 'react';
import './SubComponent.scss';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextFieldComponent from '../../../../../components/TextFieldComponent/TextFieldComponent';
import TextAreaComponent from '../../../../../components/TextAreaComponent/TextAreaComponent';
import Checkbox from '../../../../../components/Checkbox/Checkbox';

function SubComponent({ subComponentData, activeLanguage }) {
  const { t } = useTranslation();
  const Satisfied = subComponentData.details.find(
    item => item.field === 'Satisfied?',
  );
  const Date = subComponentData.details.find(item => item.field === 'Date');
  const Textbox = subComponentData.details.find(
    item => item.field === 'Textbox',
  );
  const FileUpload = subComponentData.details.find(
    item => item.field === 'File Upload' || item.field === 'File upload',
  );
  const Other = subComponentData.details.find(item => item.field === 'Other');
  const OkToProceed = subComponentData.details.find(
    item => item.field === 'Ok to proceed?',
  );
  const OkToProceedComment = subComponentData.details.find(
    item => item.field === 'Ok to proceed comment',
  );

  return (
    <div className="sub-component">
      <div className="custom-row">
        <Checkbox
          id="pre-requisite-check"
          checked={false}
          // onClick={e => handleCheckToggleStep3(e, row)}
        />
        <div className="heading ml-2 mt-1">
          {Satisfied.labelNames && Satisfied.labelNames.length
            ? Satisfied.labelNames.find(
                item => item.languageCode === activeLanguage,
              ).name
            : ''}
          {Satisfied.isDefault || Satisfied.isMandatory ? ' *' : ''}
          {/* is pre-requisite Satisfied?* */}
        </div>
      </div>
      <div className="custom-row">
        <div className="date align-self-end">
          <TextFieldComponent
            id={`Check_Reciept_Date-${subComponentData.refId}`}
            type="text"
            isDisable
            name="Check_Reciept_Date"
            label={`${
              Date.labelNames && Date.labelNames.length
                ? Date.labelNames.find(
                    item => item.languageCode === activeLanguage,
                  ).name
                : ''
            }
                ${Date.isDefault || Date.isMandatory ? ' *' : ''}`}
            labelClassName="label-text-bold"
            className="form-field"
            inputClassName="custom-date-icon align-self-end"
            // value={
            //   Date.labelNames && Date.labelNames.length
            //     ? Date.labelNames.find(item => item.languageCode === 'en').name
            //     : ''
            // }
            // onChange={onWorkFlowNameTextChangelistner}
          />
        </div>
        <div className="cheque-number mx-4 align-self-end">
          <TextFieldComponent
            id="Check number"
            isDisable
            type="text"
            name="Check number"
            label={`${
              Textbox.labelNames && Textbox.labelNames.length
                ? Textbox.labelNames.find(
                    item => item.languageCode === activeLanguage,
                  ).name
                : ''
            }${Textbox.isDefault || Textbox.isMandatory ? ' *' : ''}`}
            labelClassName="label-text-bold"
            className="form-field align-self-end"
          />
        </div>
        <div className="scan-copy mr-2 align-self-end">
          <TextFieldComponent
            // id="scan-copy"
            type="text"
            isDisable
            name="scanned copy of cheque"
            label={`${
              FileUpload.labelNames && FileUpload.labelNames.length
                ? FileUpload.labelNames.find(
                    item => item.languageCode === activeLanguage,
                  ).name
                : ''
            }${FileUpload.isDefault || FileUpload.isMandatory ? ' *' : ''}`}
            labelClassName="label-text-bold"
            className="form-field scan-copy-class"
          />
        </div>
        <div className="upload-btn align-self-end">
          <button type="button" className="btn-upload">
            {t('ADMIN.WORKFLOW.UPLOAD')}
          </button>
        </div>
        <div className="notes">
          <TextAreaComponent
            id="comment-notes"
            isDisable
            name="comment-notes"
            label={`${
              Other.labelNames && Other.labelNames.length
                ? Other.labelNames.find(
                    item => item.languageCode === activeLanguage,
                  ).name
                : ''
            }${Other.isDefault || Other.isMandatory ? ' *' : ''}`}
            labelClassName="label-text-bold"
            className="form-field"
          />
        </div>
      </div>
      {OkToProceed ? (
        <div className="custom-row mt-3">
          <>
            <Checkbox
              id="pre-requisite-check"
              checked={false}
              // onClick={e => handleCheckToggleStep3(e, row)}
            />
            <div className="heading ml-2 mt-1">
              {OkToProceed.labelNames && OkToProceed.labelNames.length
                ? OkToProceed.labelNames.find(
                    item => item.languageCode === activeLanguage,
                  ).name
                : ''}
              {OkToProceed.isDefault || OkToProceed.isMandatory ? ' *' : ''}
              {/* is pre-requisite Satisfied?* */}
            </div>
          </>
        </div>
      ) : (
        <></>
      )}
      {OkToProceedComment ? (
        <div className="custom-row">
          <div className="notes mt-4">
            <TextAreaComponent
              id="comment-notes"
              isDisable
              name="comment-notes"
              label={`${
                OkToProceedComment.labelNames &&
                OkToProceedComment.labelNames.length
                  ? OkToProceedComment.labelNames.find(
                      item => item.languageCode === activeLanguage,
                    ).name
                  : ''
              }${
                OkToProceedComment.isDefault || OkToProceedComment.isMandatory
                  ? ' *'
                  : ''
              }`}
              labelClassName="label-text-bold"
              className="form-field"
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* <div className="upload">
        <FileInput
          name="upload" // provide unique name for input
          label="Scan Copy of Cheque" // to show label on input
          inputContainerClass="form-control" // provide class to main input container
          labelClassName="upload" // label class name
          inputClassName="upload" // provide class to the input:- you can use form.scss @include form-input() in your class
        />
      </div> */}
    </div>
  );
}
SubComponent.propTypes = {
  subComponentData: PropTypes.instanceOf(Array).isRequired,
  activeLanguage: PropTypes.instanceOf(Array).isRequired,
};

export default SubComponent;
