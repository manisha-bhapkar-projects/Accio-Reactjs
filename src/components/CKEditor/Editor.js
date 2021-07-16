import React from 'react';
import PropTypes from 'prop-types';
import './Editor.scss';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { countCharacter } from '../../utils/utils';

const config = {
  toolbar: [
    'Bold',
    'Italic',
    'Underline',
    'Strike',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    'outdent',
    'indent',
    'undo',
    'redo',
  ],
  font_names: 'Roboto',
};

const Editor = ({
  content,
  setContent,
  inputContainerClass,
  labelClassName,
  label,
  isError,
  helperText,
  helperTextClassName,
  name,
  lengthOfContent,
}) => {
  return (
    <div className={`${inputContainerClass} editor-with-label`}>
      {label ? (
        <label
          htmlFor="input"
          className={`${labelClassName || 'editor-label'} ${
            isError ? 'error' : ''
          }`}
        >
          {label}
        </label>
      ) : (
        ''
      )}
      <CKEditor
        key={name}
        editor={ClassicEditor}
        data={content}
        config={config}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
      />
      <div className="content-length">
        {isError && helperText && (
          <small
            className={
              !isError
                ? `${helperTextClassName} helper-text`
                : `${helperTextClassName} helper-text error`
            }
          >
            {helperText}
          </small>
        )}
        <span>
          {content ? countCharacter(content) : 0}/{lengthOfContent}
        </span>
      </div>
    </div>
  );
};

export default Editor;

Editor.defaultProps = {
  name: 'editor',
  content: '',
  setContent: '',
  label: '',
  inputContainerClass: '',
  labelClassName: '',
  isError: '',
  helperText: '',
  helperTextClassName: '',
  lengthOfContent: 2000,
};

Editor.propTypes = {
  name: PropTypes.string,
  content: PropTypes.string,
  setContent: PropTypes.func,
  label: PropTypes.string,
  inputContainerClass: PropTypes.string,
  labelClassName: PropTypes.string,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
  helperTextClassName: PropTypes.string,
  lengthOfContent: PropTypes.number,
};
