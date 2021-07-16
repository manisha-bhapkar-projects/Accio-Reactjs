import React, { useEffect, useState } from 'react';
import TextFieldComponent from '../../components/TextFieldComponent/TextFieldComponent';
import Layout from '../../components/Layout/Layout';
import './UploadData.scss';
import CardHeader from '../../components/CardHeader/CardHeader';

const UploadData = () => {
  const [tableName, setTableName] = useState('');
  const [file, setFile] = useState('');
  const [fileErrorText, setFileErrorText] = useState('');

  useEffect(() => {
    if (file) {
      const isValidFile = validateFile(file.name);
      if (!isValidFile) {
        document.getElementById('xl-file').value = '';
        setFileErrorText('Only xlsx/xls file allowed');
        setFile('');
      } else {
        setFileErrorText('');
      }
    }
  }, [file]);

  /**
   * getExtension: this function returns file extention from selected file
   * @param {string} filename
   */
  const getExtension = filename => {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  };

  /**
   * validateFile: this function validates file is valid or not
   * @param {string} filename
   */
  const validateFile = filename => {
    const ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'xlsx':
      case 'xls':
        return true;
      default:
        return false;
    }
  };

  /**
   * handleSubmit: it handles file submit
   */
  const handleSubmit = () => {
    if (!file) {
      setFileErrorText('Please select xlsx/xls file');
      // return;
    }
    // console.log('selected file', file, 'table name', tableName);
  };

  return (
    <Layout>
      <div className="upload-data">
        <form className="upload-data-container" noValidate autoComplete="off">
          <div className="card-container">
            <CardHeader title="Upload Data" />
            <TextFieldComponent
              id="table-name"
              type="text"
              name="table-name"
              label="Table Name"
              className="input-field"
              placeholder="Enter table name here"
              value={tableName}
              onChange={e => setTableName(e.target.value)}
            />
            <TextFieldComponent
              id="xl-file"
              type="file"
              name="file"
              label="File *"
              className="input-field"
              inputClassName="file-input-field"
              onChange={e => setFile(e.target.files[0])}
              accept=".xlsx,.xls"
              helperText={fileErrorText}
              error={!!fileErrorText}
              helperTextClassName="upload-data-error-text"
            />
          </div>
          <div className="button-container">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-block btn-primary"
            >
              Upload File
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default UploadData;
