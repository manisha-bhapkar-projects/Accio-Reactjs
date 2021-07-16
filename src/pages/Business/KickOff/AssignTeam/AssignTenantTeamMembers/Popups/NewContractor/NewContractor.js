import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextFieldComponent from '../../../../../../../components/TextFieldComponent/TextFieldComponent';
import FileInput from '../../../../../../../components/FileInput/FileInput';
import './NewContractor.scss';
import Note from '../../../../../../../components/Note/Note';
import TextAreaComponent from '../../../../../../../components/TextAreaComponent/TextAreaComponent';
import CardHeader from '../../../../../../../components/CardHeader/CardHeader';
import { validateEmail } from '../../../../../../../utils/validation';

const NewContractor = ({ setOpen }) => {
  const { t } = useTranslation();

  const [newContractorDetails, setNewContractorsDetails] = useState({
    contractorName: '',
    contractorNameError: '',
    contactPerson: '',
    contactPersonError: '',
    email: '',
    emailError: '',
    phoneOffice: '',
    phoneOfficeError: '',
    phoneMobile: '',
    phoneMobileError: '',
    tradLicense: '',
    tradLicenseError: '',
    tradLicenseName: '',
    tradLicenseNameError: '',
    justification: '',
    justificationError: '',
  });

  // error
  // const [isErrorMessage, setIsErrorMessage] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');

  /**
   * handleInputChange: handle file inputs change
   * @param {*} e : event of input element
   */

  const handleInputChange = e => {
    const { name, value, type, files } = e.target;
    const details = { ...newContractorDetails };
    // setting values into our contractor details
    if (type === 'file') {
      details[name] = files;
    } else {
      details[name] = value;
    }

    // validations based on name and values
    if (name === 'contractorName') {
      if (value === '') {
        details.contractorNameError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.CONTRACTOR_NAME_IS_REQUIRED',
        );
      } else if (
        value.length >
        t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.CONTRACTOR_NAME_LENGTH',
        )
      ) {
        details.contractorNameError = t(
          'GLOBAL.ERROR_MSG.ERR_EXCEEDED_MAX_LENGTH',
        );
      } else {
        details.contractorNameError = '';
      }
    } else if (name === 'contactPerson') {
      if (value === '') {
        details.contactPersonError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.CONTACT_PERSON_IS_REQUIRED',
        );
      } else if (
        value.length >
        t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.CONTACT_PERSON_LENGTH',
        )
      ) {
        details.contactPersonError = t(
          'GLOBAL.ERROR_MSG.ERR_EXCEEDED_MAX_LENGTH',
        );
      } else {
        details.contactPersonError = '';
      }
    } else if (name === 'email') {
      if (value === '') {
        details.emailError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.EMAIL_IS_REQUIRED',
        );
      } else if (!validateEmail(value)) {
        details.emailError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.INVALID_EMAIL',
        );
      } else {
        details.emailError = '';
      }
    } else if (name === 'phoneOffice') {
      if (value === '') {
        details.phoneOfficeError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.OFFICE_PHONE_IS_REQUIRED',
        );
      } else if (
        value.length >
        t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.PHONE_LENGTH',
        )
      ) {
        details.phoneOfficeError = t(
          'GLOBAL.ERROR_MSG.ERR_EXCEEDED_MAX_LENGTH',
        );
      } else {
        details.phoneOfficeError = '';
      }
    } else if (name === 'phoneMobile') {
      if (value === '') {
        details.phoneMobileError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.MOBILE_NUMBER_IS_REQUIRED',
        );
      } else if (
        value.length >
        t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.MOBILE_LENGTH',
        )
      ) {
        details.phoneMobileError = t(
          'GLOBAL.ERROR_MSG.ERR_EXCEEDED_MAX_LENGTH',
        );
      } else {
        details.phoneMobileError = '';
      }
    } else if (name === 'tradLicense') {
      if (value === '') {
        details.tradLicenseError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.TRADE_LICENSE_IS_REQUIRED',
        );
      } else if (
        value.length >
        t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.LICENCE_LENGTH',
        )
      ) {
        details.tradLicenseError = t(
          'GLOBAL.ERROR_MSG.ERR_EXCEEDED_MAX_LENGTH',
        );
      } else {
        details.tradLicenseError = '';
      }
    } else if (name === 'tradLicenseName') {
      if (value === '') {
        details.tradLicenseNameError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.TRADE_LICENSE_NAME_IS_REQUIRED',
        );
      } else if (
        value.length >
        t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.LICENCE_NAME_LENGTH',
        )
      ) {
        details.tradLicenseNameError = t(
          'GLOBAL.ERROR_MSG.ERR_EXCEEDED_MAX_LENGTH',
        );
      } else {
        details.tradLicenseNameError = '';
      }
    } else if (name === 'justification') {
      if (value === '') {
        details.justificationError = t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.JUSTIFICATION_IS_REQUIRED',
        );
      } else if (
        value.length >
        t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.JUSTIFICATION_LENGTH',
        )
      ) {
        details.justificationError = t(
          'GLOBAL.ERROR_MSG.ERR_EXCEEDED_MAX_LENGTH',
        );
      } else {
        details.justificationError = '';
      }
    }
    setNewContractorsDetails(details);
  };

  /**
   * ======================== File Upload =============================
   */

  // allFiles: state to handle all files
  const [allFiles, setAllFiles] = useState([
    {
      name: 'tradeLicenceFile',
      label: t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.TRADE_LICENCE',
      ),
      fileTypes: '.pdf',
      accept: 'application/pdf',
      file: '',
      fileName: '',
      fileLinkAfterUpload: '',
      uploadPercentage: 0,
      isError: false,
      errorMessage: '',
      isUploading: false,
      fileSize: 10,
    },
    {
      name: 'otherAttachment1',
      label: t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.OTHER_ATTACHMENT',
      ),
      fileTypes: '.pdf',
      accept: 'application/pdf',
      file: '',
      fileName: '',
      fileLinkAfterUpload: '',
      uploadPercentage: 0,
      isError: false,
      errorMessage: '',
      isUploading: false,
      fileSize: 10,
    },
  ]);

  /**
   * validateFile: validate file and return true if error or false if no error
   * @param {*} file : file for validate
   * @param {*} indexOfFile : index of file for validate
   */

  const validateFile = (file, indexOfFile) => {
    const oldFiles = [...allFiles];
    const dataOfFile = allFiles[indexOfFile];
    // type of file
    if (!dataOfFile.accept.split(',').includes(file.type)) {
      oldFiles[indexOfFile].errorMessage = t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.INVALID_FILE',
      );
      oldFiles[indexOfFile].isError = true;
      setAllFiles(oldFiles);
      return true;
    }
    // size of file
    if (file.size / 1024 / 1024 > dataOfFile.fileSize) {
      oldFiles[indexOfFile].errorMessage = t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.LENGTH_EXCEED',
      );
      oldFiles[indexOfFile].isError = true;
      setAllFiles(oldFiles);
      return true;
    }
    return false;
  };

  /**
   * handleFileInputChange
   * @param {*} event : event of file input
   * @param {*} fileIndex : index of file change
   */

  const handleFileInputChange = (event, fileIndex) => {
    const { files } = event.target;
    if (files.length > 0) {
      const selectedFile = files[0];
      const oldFiles = [...allFiles];
      // validate file
      const isError = validateFile(selectedFile, fileIndex);
      if (isError) {
        // if error then set empty value in file and fileName
        oldFiles[fileIndex].file = '';
        oldFiles[fileIndex].fileName = '';
        return;
      }
      oldFiles[fileIndex].file = selectedFile;
      oldFiles[fileIndex].fileName = selectedFile.name;
      oldFiles[fileIndex].isError = false;
      oldFiles[fileIndex].errorMessage = '';
      setAllFiles(oldFiles);
    }
  };

  /**
   * handleRemoveImage: if want to remove image
   * @param {*} indexOfFile : index of file to remove
   */

  const handleRemoveImage = indexOfFile => {
    const oldFiles = [...allFiles];
    allFiles[indexOfFile].fileLinkAfterUpload = '';
    allFiles[indexOfFile].file = '';
    allFiles[indexOfFile].fileName = '';
    allFiles[indexOfFile].uploadPercentage = 0;
    setAllFiles(oldFiles);
  };

  /**
   * handleFileUpload:
   * @param {*} indexOfFile : file index for upload
   */

  const handleFileUpload = indexOfFile => {
    const oldFiles = [...allFiles];
    const dataOfFile = allFiles[indexOfFile];

    // check file is not selected
    if (!dataOfFile.fileName) {
      oldFiles[indexOfFile].errorMessage = t(
        'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.ERROR_MSG.SELECT_FILE',
      );
      oldFiles[indexOfFile].isError = true;
      setAllFiles(oldFiles);
      return true;
    }

    const isError = validateFile(dataOfFile.file, indexOfFile);
    if (isError) {
      oldFiles[indexOfFile].file = '';
      oldFiles[indexOfFile].fileName = '';
      return true;
    }

    const data = new FormData();
    data.append('file', dataOfFile.file);
    // const options = {
    //   onUploadProgress: progressEvent => {
    //     const { loaded, total } = progressEvent;
    //     const percent = Math.floor((loaded * 100) / total);
    //     if (percent < 100) {
    //       setUploadPercentage(percent);
    //     }
    //   },
    // };
    oldFiles[indexOfFile].isUploading = true;
    oldFiles[indexOfFile].uploadPercentage = 20;
    setAllFiles(oldFiles);

    setTimeout(() => {
      const allTheFiles = [...allFiles];
      allTheFiles[indexOfFile].uploadPercentage = 50;
      setAllFiles(allTheFiles);
    }, 1000);

    setTimeout(() => {
      const allTheFiles = [...allFiles];
      allTheFiles[indexOfFile].fileLinkAfterUpload = 'Doc.pdf (184 kb)';
      allTheFiles[indexOfFile].uploadPercentage = 100;
      allTheFiles[indexOfFile].isUploading = false;
      setAllFiles(allTheFiles);
    }, 2000);

    // uploadSignedDocument(data, options)
    //   .then(res => {
    //     setDocumentLink(res.data.url);
    //     setUploadPercentage(100);
    //     setIsFileUploading(false);
    //   })
    //   .catch(err => {
    //     handleError(err);
    //   });
    return true;
  };

  /**
   * ======================== File Upload End =============================
   */

  /**
   * handleFormSubmit: final form submission
   */

  const handleFormSubmit = () => {};

  return (
    <div className="new-contractor-container">
      <CardHeader
        title={t(
          'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR_TITLE',
        )}
      />
      <form>
        <div>
          <Note
            noteText={t(
              'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.NOTE',
            )}
          />
          <div className="new-contractor-form">
            <TextFieldComponent
              name="contractorName"
              label={t(
                'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.CONTRACTOR_NAME',
              )}
              maxLength={t(
                'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.CONTRACTOR_NAME_LENGTH',
              )}
              inputClassName="form-input-large"
              autoComplete="off"
              placeholder=""
              error={!!newContractorDetails.contractorNameError}
              helperText={newContractorDetails.contractorNameError}
              value={newContractorDetails.contractorName}
              onChange={handleInputChange}
            />
            <div className="padding-top-20 d-flex flex-direction-row">
              <TextFieldComponent
                name="contactPerson"
                label={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.CONTACT_PERSON',
                )}
                maxLength={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.CONTACT_PERSON_LENGTH',
                )}
                inputClassName="form-input-medium"
                placeholder=""
                error={!!newContractorDetails.contactPersonError}
                helperText={newContractorDetails.contactPersonError}
                value={newContractorDetails.contactPerson}
                onChange={handleInputChange}
              />
              <TextFieldComponent
                type="email"
                name="email"
                label={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.EMAIL',
                )}
                className="padding-left-20"
                inputClassName="form-input-medium"
                placeholder=""
                error={!!newContractorDetails.emailError}
                helperText={newContractorDetails.emailError}
                value={newContractorDetails.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="padding-top-20 d-flex flex-direction-row">
              <TextFieldComponent
                name="phoneOffice"
                label={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.PHONE',
                )}
                maxLength={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.PHONE_LENGTH',
                )}
                inputClassName="form-input-medium"
                placeholder=""
                error={!!newContractorDetails.phoneOfficeError}
                helperText={newContractorDetails.phoneOfficeError}
                value={newContractorDetails.phoneOffice}
                onChange={handleInputChange}
              />
              <TextFieldComponent
                name="phoneMobile"
                label={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.MOBILE',
                )}
                maxLength={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.MOBILE_LENGTH',
                )}
                className="padding-left-20"
                inputClassName="form-input-medium"
                placeholder=""
                error={!!newContractorDetails.phoneMobileError}
                helperText={newContractorDetails.phoneMobileError}
                value={newContractorDetails.phoneMobile}
                onChange={handleInputChange}
              />
            </div>
            <div className="padding-top-20 d-flex flex-direction-row">
              <TextFieldComponent
                name="tradLicense"
                label={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.LICENCE',
                )}
                maxLength={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.LICENCE_LENGTH',
                )}
                inputClassName="form-input-medium"
                placeholder=""
                error={!!newContractorDetails.tradLicenseError}
                helperText={newContractorDetails.tradLicenseError}
                value={newContractorDetails.tradLicense}
                onChange={handleInputChange}
              />
              <TextFieldComponent
                name="tradLicenseName"
                label={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.LICENCE_NAME',
                )}
                maxLength={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.LICENCE_NAME_LENGTH',
                )}
                className="padding-left-20"
                inputClassName="form-input-medium"
                placeholder=""
                error={!!newContractorDetails.tradLicenseNameError}
                helperText={newContractorDetails.tradLicenseNameError}
                value={newContractorDetails.tradLicenseName}
                onChange={handleInputChange}
              />
            </div>
            <div className="padding-top-20">
              <TextAreaComponent
                name="justification"
                // type="textarea"
                label={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.JUSTIFICATION',
                )}
                maxLength={t(
                  'KICK_OFF.ASSIGN_TEAM.ASSIGN_TENANT_TEAM_MEMBER.ADD_NEW_CONTRACTOR.JUSTIFICATION_LENGTH',
                )}
                inputClassName="form-textarea-large"
                placeholder=""
                error={!!newContractorDetails.justificationError}
                helperText={newContractorDetails.justificationError}
                value={newContractorDetails.justification}
                onChange={handleInputChange}
                isContentLength={false}
              />
            </div>
            <div>
              {allFiles.map((file, index) => {
                return (
                  <FileInput
                    name={file.name}
                    label={file.label}
                    fileTypes={file.fileTypes} // fileType to show
                    accept={file.accept} // accept to restrict other files
                    fileName={file.fileName} // selected file name
                    handleFileUpload={() => handleFileUpload(index)} // upload button click
                    uploadPercentage={file.uploadPercentage}
                    isFileUploading={file.isUploading}
                    fileLinkAfterUpload={file.fileLinkAfterUpload}
                    inputContainerClass="padding-top-20"
                    // labelClassName="form-file-label"
                    inputClassName="form-file-input"
                    placeholder=""
                    isError={file.isError}
                    errorMessage={file.errorMessage}
                    handleRemoveImage={() => handleRemoveImage(index)}
                    handleInputChange={event =>
                      handleFileInputChange(event, index)
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end pre-approved-buttons">
          <button
            type="button"
            className="btn btn-secondary "
            onClick={setOpen}
          >
            {t('GLOBAL.BUTTON_CANCEL')}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleFormSubmit}
          >
            {t('GLOBAL.BUTTON_SUBMIT')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewContractor;

NewContractor.propTypes = {
  setOpen: PropTypes.bool.isRequired,
};
