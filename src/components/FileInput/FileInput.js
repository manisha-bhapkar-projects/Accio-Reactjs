/**
 *
 * For reference how to use check below page
 * file : src/pages/KickOff/AssignTeam/AssignTenantTeam/Popups/NewContractor
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import './FileInput.scss';
import roundCancel from '../../images/roundCancel/noun-cancel-421660@2x.png';
import labels from '../../utils/Locales/labels';
import ProgressBarWithPersentage from '../ProgressBar/ProgressBarWithPersentage';

const FileInput = props => {
  const {
    name, // provide unique name for input
    label, // to show label on input
    inputContainerClass, // provide class to main input container
    labelClassName, // label class name
    inputClassName, // provide class to the input:- you can use form.scss @include form-input() in your class
    placeholder, // show place holder
    isError, // isError for error or not
    errorMessage, // show error
    // value, // value of an input
    fileName,
    handleRemoveImage, // if type = file
    handleInputChange, // explain above
    handleFileUpload,
    uploadPercentage,
    fileTypes,
    isDisabled,
    isFileUploading,
    fileLinkAfterUpload,
    ...rest
  } = props;
  return (
    <div className={`${inputContainerClass} input-with-label`}>
      {label ? (
        <label
          htmlFor="input"
          className={`${labelClassName || 'form-input-label'} ${
            isError ? 'error' : ''
          }`}
        >
          {label}
        </label>
      ) : (
        ''
      )}
      {isFileUploading && uploadPercentage > 0 ? (
        <div className="padding-top-20">
          <ProgressBarWithPersentage
            variant="determinate"
            value={uploadPercentage}
          />
        </div>
      ) : (
        <>
          <div className={inputClassName || 'form-file-input'}>
            {fileLinkAfterUpload && uploadPercentage === 100 ? (
              <div className="padding-top-20 padding-bottom-10 name-with-remove">
                <span>{fileName}</span>
                <div
                  role="button"
                  tabIndex={-1}
                  onKeyDown={null}
                  onClick={() => handleRemoveImage(name)}
                >
                  <img
                    alt="round-cancel-icon"
                    className="cursor round-cancel-icon"
                    src={roundCancel}
                  />
                </div>
              </div>
            ) : (
              <>
                <label className="file-input" htmlFor={name}>
                  <input
                    disabled={isDisabled}
                    id={name}
                    type="file"
                    title=" "
                    // value={value}
                    name={name}
                    onChange={handleInputChange}
                    className={`${isError ? 'error' : ''} form-control`}
                    placeholder={placeholder}
                    {...rest}
                  />
                  <div
                    className="file-placeholder"
                    tabIndex="-1"
                    role="button"
                    aria-controls="filename"
                  >
                    {!fileName
                      ? labels.COMPONENTS.UPLOAD_FILE.UPLOAD_FILE
                      : fileName}
                  </div>
                </label>
                <button
                  disabled={isDisabled}
                  type="button"
                  className="btn-upload"
                  onClick={handleFileUpload}
                >
                  {labels.COMPONENTS.UPLOAD_FILE.UPLOAD}
                </button>
              </>
            )}
          </div>
          <div className="allowed-file-types">
            {fileTypes && !fileLinkAfterUpload
              ? labels.COMPONENTS.UPLOAD_FILE.ALLOWED_FILE_TYPES + fileTypes
              : ''}
          </div>
        </>
      )}

      {isError ? <span className="error">{errorMessage}</span> : ''}
    </div>
  );
};

export default FileInput;

FileInput.defaultProps = {
  inputContainerClass: '',
  label: '',
  inputClassName: '',
  labelClassName: '',
  name: '',
  placeholder: '',
  isError: false,
  errorMessage: '',
  value: '',
  fileName: '',
  handleRemoveImage: null,
  handleInputChange: '',
  fileTypes: '',
  isDisabled: false,
  handleFileUpload: '',
  uploadPercentage: 0,
  fileLinkAfterUpload: '',
};

FileInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  inputClassName: PropTypes.string,
  inputContainerClass: PropTypes.string,
  labelClassName: PropTypes.string,
  placeholder: PropTypes.string,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.array,
  ]),
  fileName: PropTypes.string,
  handleRemoveImage: PropTypes.func,
  handleInputChange: PropTypes.func,
  fileTypes: PropTypes.string,
  fileLinkAfterUpload: PropTypes.string,
  isDisabled: PropTypes.bool,
  handleFileUpload: PropTypes.func,
  uploadPercentage: PropTypes.number,
  isFileUploading: PropTypes.bool.isRequired,
};
