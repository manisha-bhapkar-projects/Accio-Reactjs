/**
 * SignOff :
 *
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { getErrorMessage } from '../../../../../utils/utils';
// import PropTypes from 'prop-types';
import './SignOff.scss';
// import {
//   uploadSignedDocument,
//   getUploadedFile,
// } from '../../../../../actions/Business/kickOffMeetingAndSignOff';
import CardHeader from '../../../../../components/CardHeader/CardHeader';
import FileInput from '../../../../../components/FileInput/FileInput';
import labels from '../../../../../utils/Locales/labels';
import ErrorAlert from '../../../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
// import SuccessAlert from '../../../../../components/Alerts/AlertBox/SuccessAlert/SuccessAlert';
// import messages from '../../../../../utils/Locales/messages';

const SignOff = () => {
  const { t } = useTranslation(); // for language translation

  const link =
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  const [signedDocument, setSignedDocument] = useState({});
  const [documentLink, setDocumentLink] = useState('');
  // const [documentLinkForReset, setDocumentLinkForReset] = useState('');
  const [signedDocumentName, setSignedDocumentFileName] = useState('');
  // const [
  //   signedDocumentNameForReset,
  //   setSignedDocumentFileNameForReset,
  // ] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  // const [uploadPercentageForReset, setUploadPercentageForReset] = useState(0);
  const [isFileUploading, setIsFileUploading] = useState(false);

  // error
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const [isErrorInSignOff, setIsErrorInSignOff] = useState(false);

  // success
  // const [successMessage, setSuccessMessage] = useState('');
  // const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // handleError of get form list api
  // const handleError = error => {
  //   setErrorMessage(`${getErrorMessage(error)}`);
  //   setIsErrorMessage(true);
  // };

  useEffect(() => {
    // setDocumentLink('link');
    // setSignedDocumentFileName('file name');
    // setUploadPercentage(100);
    // getUploadedFile()
    //   .then(() => {
    //     setDocumentLink('link');
    //     setSignedDocumentFileName('file name');
    //     setUploadPercentage(100);
    //     // reset
    //     // setDocumentLinkForReset('link');
    //     // setSignedDocumentFileNameForReset('file name');
    //     // setUploadPercentageForReset(100);
    //   })
    //   .catch(err => {
    //     handleError(err);
    //   });
  }, []);

  const validateFile = file => {
    if (file.type !== 'application/pdf') {
      setErrorMessage(
        t(
          'KICK_OFF.KICK_OFF_MEETING_AND_SIGNED_OFF.KICK_OFF_SIGN_OFF.ERROR_MSG.SELECT_VALID_DOCUMENT',
        ),
      );
      setIsErrorMessage(true);
      return true;
    }
    if (file.size / 1024 / 1024 > 10) {
      setErrorMessage(
        t(
          'KICK_OFF.KICK_OFF_MEETING_AND_SIGNED_OFF.KICK_OFF_SIGN_OFF.ERROR_MSG.ERROR_DOCUMENT_SIZE',
        ),
      );
      setIsErrorMessage(true);
      return true;
    }
    return false;
    // if (file.size !== 'application/pdf') {
    //   setErrorMessage(
    //     t('KICK_OFF.KICK_OFF_MEETING_AND_SIGNED_OFF.KICK_OFF_SIGN_OFF.ERROR_MSG.SELECT_VALID_DOCUMENT')
    //   );
    //   setIsErrorMessage(true);
    //   return true;
    // }
  };

  // handleFileInputChange
  const handleFileInputChange = e => {
    const { files } = e.target;
    if (files.length > 0) {
      const isError = validateFile(files[0]);
      if (isError) return;
      setSignedDocument(files[0]);
      setSignedDocumentFileName(files[0].name);
    }
  };

  const handleFileUpload = () => {
    // check file is not selected
    if (!signedDocumentName) {
      setErrorMessage(
        t(
          'KICK_OFF.KICK_OFF_MEETING_AND_SIGNED_OFF.KICK_OFF_SIGN_OFF.ERROR_MSG.SELECT_SIGNED_DOCUMENT',
        ),
      );
      setIsErrorMessage(true);
      return true;
    }

    const isError = validateFile(signedDocument);
    if (isError) return true;

    const data = new FormData();
    data.append('file', signedDocument);
    // const options = {
    //   onUploadProgress: progressEvent => {
    //     const { loaded, total } = progressEvent;
    //     const percent = Math.floor((loaded * 100) / total);
    //     if (percent < 100) {
    //       setUploadPercentage(percent);
    //     }
    //   },
    // };
    setIsFileUploading(true);

    setUploadPercentage(20);
    setTimeout(() => {
      setUploadPercentage(50);
    }, 1000);
    setTimeout(() => {
      setUploadPercentage(75);
    }, 2000);
    setTimeout(() => {
      setDocumentLink('Doc.pdf (184 kb)');
      setUploadPercentage(100);
      setIsFileUploading(false);
    }, 3000);

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

  // handleRemoveImage: if want to remove image
  const handleRemoveImage = () => {
    setDocumentLink('');
    setSignedDocument({});
    setSignedDocumentFileName('');
    setUploadPercentage(0);
  };

  // onCancelClickListner
  const onCancelClickListner = () => {
    // if(signedDocumentName !== signedDocumentNameForReset)
    // {
    //   setSignedDocumentFileName(signedDocumentNameForReset);
    //   setSignedDocument(signedDocumentFor);
    // }
  };

  const handleErrorClose = () => {
    setErrorMessage('');
    setIsErrorMessage(!isErrorMessage);
  };

  return (
    <>
      <div className="sign-off">
        <div className="card-container">
          {/* Title */}
          <CardHeader
            title={labels.BUSINESS.KICK_OFF.KICK_OFF_SIGN_OFF.TITLE}
            downloadPdf={link}
          />
          {/* Notes */}
          {/* <div className="note-label">
            {labels.BUSINESS.KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.NOTES}
          </div> */}
          <div className="note-content">
            <div className="note-content-title">
              {labels.BUSINESS.KICK_OFF.KICK_OFF_SIGN_OFF.NOTES.TITLE}
            </div>
            <ul>
              {labels.BUSINESS.KICK_OFF.KICK_OFF_SIGN_OFF.NOTES.LIST.map(
                listItem => {
                  return <li key={listItem}>{listItem}</li>;
                },
              )}
              {/* <li>
                Download and print the minutes (we give a download icon with PDF
                written - this is available on the preview screen
              </li>
              <li>Sign the minutes (both parties)</li>
              <li> Upload the scanned copy and signoff the activity</li> */}
            </ul>
          </div>
          <div className="file-upload">
            <FileInput
              name="signedDocuent" // unique name
              label={labels.BUSINESS.KICK_OFF.KICK_OFF_SIGN_OFF.SIGNED_COPY} // label
              fileTypes=".pdf" // fileType to show
              accept="application/pdf" // accept to restrict other files
              handleInputChange={handleFileInputChange} // handle file change
              fileName={signedDocumentName} // selected file name
              handleFileUpload={handleFileUpload} // upload button click
              uploadPercentage={uploadPercentage}
              isFileUploading={isFileUploading}
              fileLinkAfterUpload={documentLink}
              handleRemoveImage={handleRemoveImage}
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="button-container">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancelClickListner}
          >
            {labels.GLOBAL.BUTTON_CANCEL}
          </button>
          <button
            type="button"
            className="btn-save-close"
            // onClick={onSaveAndCloseClickListner}
          >
            {labels.GLOBAL.SEND_FOR_APPROVAL}
          </button>
          <button
            type="button"
            // onClick={onSaveAndContinueClickListner}
            className="btn-save-submit"
          >
            {labels.BUSINESS.KICK_OFF.KICK_OFF_SIGN_OFF.SIGN_AND_SUBMIT}
          </button>
        </div>
        {/* error message */}
        <ErrorAlert
          alertMessage={errorMessage}
          primaryButtonText={labels.GLOBAL.OK}
          open={isErrorMessage}
          setClose={() => handleErrorClose()}
          primaryButtonOnClick={() => handleErrorClose()}
        />
        {/* success message */}
        {/* <SuccessAlert
          alertMessage={successMessage}
          primaryButtonText={labels.GLOBAL.OK}
          open={isSuccessMessage}
          setClose={() => setIsSuccessMessage(false)}
          primaryButtonOnClick={() => setIsSuccessMessage(false)}
        /> */}
      </div>
    </>
  );
};

export default SignOff;

// SignOff.defaultProps = {
//   notes: '',
// };

// SignOff.propTypes = {
//   notes: PropTypes.string,
//   changeNotes: PropTypes.func.isRequired,
// };
